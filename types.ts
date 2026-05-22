from __future__ import annotations
import math, time
from datetime import datetime, timezone
from shapely.geometry import Point, shape
from app.models.schemas import Aircraft, TrafficFrame, WorkArea

EHAM_CENTER = (52.3105, 4.7683)

class SimulationState:
    def __init__(self) -> None:
        self.started = time.time()
        self.work_areas: dict[str, WorkArea] = {}

    def _path_position(self, route: list[tuple[float, float]], speed: float, offset: float) -> tuple[float, float, float]:
        # route points are (lat, lon). This simple interpolator is for demo only.
        t = (time.time() - self.started + offset) * speed
        segment = int(t) % (len(route) - 1)
        frac = t - int(t)
        lat1, lon1 = route[segment]
        lat2, lon2 = route[segment + 1]
        lat = lat1 + (lat2 - lat1) * frac
        lon = lon1 + (lon2 - lon1) * frac
        heading = math.degrees(math.atan2(lon2 - lon1, lat2 - lat1)) % 360
        return lat, lon, heading

    def current_aircraft(self) -> list[Aircraft]:
        routes = [
            [(52.3090,4.7600),(52.3100,4.7650),(52.3120,4.7700),(52.3140,4.7760)],
            [(52.3010,4.7480),(52.3050,4.7550),(52.3090,4.7620),(52.3130,4.7700)],
            [(52.3220,4.7890),(52.3180,4.7800),(52.3140,4.7730),(52.3100,4.7660)],
            [(52.2960,4.7700),(52.3020,4.7700),(52.3080,4.7700),(52.3140,4.7700)],
        ]
        out: list[Aircraft] = []
        for i, r in enumerate(routes):
            lat, lon, heading = self._path_position(r, 0.04 + i*0.01, i*7)
            ac = Aircraft(
                id=f"MOCK-{i+1}",
                callsign=["KLM101", "TRA222", "EZY73A", "DLH9PT"][i],
                registration=["PH-BQA", "PH-HZW", "G-EZAA", "D-AIZX"][i],
                lat=lat,
                lon=lon,
                heading=heading,
                speed_kts=12 + i*3,
                status=["taxiing", "pushback", "arriving", "departing"][i],
                route=[[p[1], p[0]] for p in r],
            )
            ac.conflict = self._intersects_closed_area(ac)
            if ac.conflict:
                ac.status = 'holding'
                ac.delay_seconds = 90
            out.append(ac)
        return out

    def _intersects_closed_area(self, aircraft: Aircraft) -> bool:
        point = Point(aircraft.lon, aircraft.lat)
        for area in self.work_areas.values():
            if area.restriction != 'closed':
                continue
            try:
                if shape(area.geometry).buffer(0.00035).contains(point):
                    return True
            except Exception:
                continue
        return False

    def frame(self) -> TrafficFrame:
        return TrafficFrame(
            ts=datetime.now(timezone.utc),
            aircraft=self.current_aircraft(),
            work_areas=list(self.work_areas.values()),
        )

sim_state = SimulationState()
