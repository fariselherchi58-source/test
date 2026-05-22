from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import aircraft, work_areas, ws, routes

app = FastAPI(title='Schiphol Ground Traffic Simulator', version='0.1.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(aircraft.router)
app.include_router(work_areas.router)
app.include_router(routes.router)
app.include_router(ws.router)

@app.get('/health')
def health():
    return {'ok': True}
