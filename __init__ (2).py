from fastapi import APIRouter
from app.services.routing import taxi_router
from app.services.simulation import sim_state

router = APIRouter(prefix='/routes', tags=['routes'])

@router.get('/{start}/{end}')
def get_route(start: str, end: str):
    return {'route': taxi_router.route(start, end, list(sim_state.work_areas.values()))}
