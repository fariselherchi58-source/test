from __future__ import annotations
import httpx
from app.config import settings

class FR24Client:
    def __init__(self) -> None:
        self.base_url = settings.fr24_base_url.rstrip('/')
        self.api_key = settings.fr24_api_key

    async def live_bounds(self, north: float, south: float, west: float, east: float) -> list[dict]:
        """Fetch live FR24 positions for a bounding box.

        Endpoint names/params may need adjustment for your FR24 plan. This adapter is isolated
        so the rest of the simulator does not depend directly on vendor response shape.
        """
        if not self.api_key:
            return []
        headers = {"Authorization": f"Bearer {self.api_key}", "Accept": "application/json"}
        params = {"bounds": f"{north},{south},{west},{east}"}
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.get(f"{self.base_url}/live/flight-positions/full", headers=headers, params=params)
            r.raise_for_status()
            data = r.json()
        return data.get('data', data if isinstance(data, list) else [])

fr24_client = FR24Client()
