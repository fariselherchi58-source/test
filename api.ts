from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field

class Aircraft(BaseModel):
    id: str
    callsign: str
    registration: Optional[str] = None
    lat: float
    lon: float
    heading: float = 0
    speed_kts: float = 0
    status: Literal['taxiing','pushback','holding','arriving','departing','parked'] = 'taxiing'
    route: list[list[float]] = Field(default_factory=list)  # [lon, lat]
    conflict: bool = False
    delay_seconds: int = 0

class WorkArea(BaseModel):
    id: str
    name: str
    restriction: Literal['closed','speed_limit','one_way','caution'] = 'closed'
    speed_limit_kts: Optional[float] = None
    active_from: Optional[datetime] = None
    active_to: Optional[datetime] = None
    geometry: dict

class WorkAreaCreate(BaseModel):
    name: str
    restriction: Literal['closed','speed_limit','one_way','caution'] = 'closed'
    speed_limit_kts: Optional[float] = None
    active_from: Optional[datetime] = None
    active_to: Optional[datetime] = None
    geometry: dict

class TrafficFrame(BaseModel):
    ts: datetime
    aircraft: list[Aircraft]
    work_areas: list[WorkArea]
