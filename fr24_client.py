from fastapi import APIRouter
from app.services.simulation import sim_state

router = APIRouter(prefix='/aircraft', tags=['aircraft'])

@router.get('')
def list_aircraft():
    return sim_state.current_aircraft()
