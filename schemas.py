import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.simulation import sim_state

router = APIRouter(tags=['websocket'])

@router.websocket('/ws/traffic')
async def traffic_ws(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            await ws.send_json(sim_state.frame().model_dump(mode='json'))
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        return
