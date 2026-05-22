CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS work_areas (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  restriction TEXT NOT NULL CHECK (restriction IN ('closed','speed_limit','one_way','caution')),
  speed_limit_kts NUMERIC,
  active_from TIMESTAMPTZ,
  active_to TIMESTAMPTZ,
  geometry GEOMETRY(POLYGON, 4326) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS aircraft_positions (
  id BIGSERIAL PRIMARY KEY,
  aircraft_id TEXT NOT NULL,
  callsign TEXT,
  registration TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  heading DOUBLE PRECISION,
  speed_kts DOUBLE PRECISION,
  status TEXT,
  source TEXT NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_work_areas_geom ON work_areas USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_aircraft_observed_at ON aircraft_positions (observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_aircraft_id ON aircraft_positions (aircraft_id);
