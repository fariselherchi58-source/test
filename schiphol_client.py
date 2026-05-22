from uuid import uuid4
from fastapi import APIRouter, HTTPException
from app.models.schemas import WorkArea, WorkAreaCreate
from app.services.simulation import sim_state

router = APIRouter(prefix='/work-areas', tags=['work areas'])

@router.get('')
def list_work_areas():
    return list(sim_state.work_areas.values())

@router.post('', response_model=WorkArea)
def create_work_area(payload: WorkAreaCreate):
    area = WorkArea(id=str(uuid4()), **payload.model_dump())
    sim_state.work_areas[area.id] = area
    return area

@router.delete('/{area_id}')
def delete_work_area(area_id: str):
    if area_id not in sim_state.work_areas:
        raise HTTPException(404, 'Work area not found')
    del sim_state.work_areas[area_id]
    return {'ok': True}
