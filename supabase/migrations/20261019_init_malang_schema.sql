-- ==============================================================================
-- MALANG CITY INDEX - DATABASE SCHEMA MIGRATION
-- Production-Ready Supabase PostgreSQL + PostGIS Schema
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. DATA SOURCES & PIPELINE HEALTH
CREATE TABLE IF NOT EXISTS data_sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    agency_or_provider TEXT NOT NULL,
    official_url TEXT NOT NULL,
    data_type TEXT NOT NULL,
    geographic_scope TEXT NOT NULL,
    data_period TEXT NOT NULL,
    update_frequency TEXT NOT NULL,
    connection_status TEXT NOT NULL DEFAULT 'Connected',
    validation_status TEXT NOT NULL DEFAULT 'Verified Official',
    fetch_method TEXT NOT NULL,
    license_or_terms TEXT NOT NULL,
    limitations TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_sync_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id TEXT REFERENCES data_sources(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('RUNNING', 'SUCCESS', 'FAILED')),
    records_processed INTEGER DEFAULT 0,
    error_message TEXT,
    metadata JSONB
);

-- 3. ADMINISTRATIVE BOUNDARIES (KECAMATAN)
CREATE TABLE IF NOT EXISTS administrative_areas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    area_km2 NUMERIC(6, 2) NOT NULL,
    population INTEGER NOT NULL,
    density_per_km2 INTEGER NOT NULL,
    kelurahan_count INTEGER NOT NULL,
    characteristics TEXT,
    geom GEOMETRY(Polygon, 4326),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ROAD NETWORK & TRAFFIC
CREATE TABLE IF NOT EXISTS road_segments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    kecamatan_id TEXT REFERENCES administrative_areas(id),
    road_class TEXT NOT NULL,
    lanes INTEGER NOT NULL DEFAULT 2,
    one_way BOOLEAN NOT NULL DEFAULT FALSE,
    length_km NUMERIC(5, 2) NOT NULL,
    free_flow_speed_kmh NUMERIC(5, 1) NOT NULL,
    base_capacity INTEGER NOT NULL,
    geom GEOMETRY(LineString, 4326),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS traffic_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    road_segment_id TEXT REFERENCES road_segments(id) ON DELETE CASCADE,
    observed_at TIMESTAMPTZ NOT NULL,
    observed_speed_kmh NUMERIC(5, 1) NOT NULL,
    travel_time_minutes NUMERIC(5, 2) NOT NULL,
    travel_time_ratio NUMERIC(5, 2) NOT NULL,
    level_of_service VARCHAR(2) NOT NULL,
    congestion_index INTEGER NOT NULL,
    vehicle_volume_per_hour INTEGER,
    vc_ratio NUMERIC(4, 2),
    data_status TEXT NOT NULL DEFAULT 'OBSERVED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. AIR QUALITY STATIONS & OBSERVATIONS
CREATE TABLE IF NOT EXISTS air_quality_stations (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    kecamatan_id TEXT REFERENCES administrative_areas(id),
    elevation_meters INTEGER DEFAULT 450,
    station_type TEXT NOT NULL,
    active_status TEXT NOT NULL DEFAULT 'OPERATIONAL',
    source_authority TEXT NOT NULL,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS air_quality_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id TEXT REFERENCES air_quality_stations(id) ON DELETE CASCADE,
    measured_at TIMESTAMPTZ NOT NULL,
    pm25 NUMERIC(6, 2) NOT NULL,
    pm10 NUMERIC(6, 2),
    co NUMERIC(7, 2),
    no2 NUMERIC(6, 2),
    so2 NUMERIC(6, 2),
    o3 NUMERIC(6, 2),
    ispu_score INTEGER NOT NULL,
    ispu_category TEXT NOT NULL,
    data_origin TEXT NOT NULL DEFAULT 'OBSERVED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SCENARIO SIMULATION ENGINE TABLES
CREATE TABLE IF NOT EXISTS simulation_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    scenario_type TEXT NOT NULL,
    description TEXT,
    parameters JSONB NOT NULL,
    model_version TEXT NOT NULL DEFAULT 'BPR-PKJI-1.0',
    created_by TEXT DEFAULT 'anonymous',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS simulation_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scenario_id UUID REFERENCES simulation_scenarios(id) ON DELETE CASCADE,
    run_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    aggregate_metrics JSONB NOT NULL,
    corridor_results JSONB NOT NULL,
    assumptions JSONB,
    limitations JSONB
);

-- 7. INDEXES FOR HIGH QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_traffic_obs_segment_time ON traffic_observations(road_segment_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_aq_obs_station_time ON air_quality_observations(station_id, measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_road_segments_geom ON road_segments USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_air_stations_geom ON air_quality_stations USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_admin_areas_geom ON administrative_areas USING GIST(geom);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE administrative_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE road_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE air_quality_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE air_quality_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_runs ENABLE ROW LEVEL SECURITY;

-- Public READ access for all intelligence indicators
CREATE POLICY "Allow public read access to data_sources" ON data_sources FOR SELECT USING (true);
CREATE POLICY "Allow public read access to administrative_areas" ON administrative_areas FOR SELECT USING (true);
CREATE POLICY "Allow public read access to road_segments" ON road_segments FOR SELECT USING (true);
CREATE POLICY "Allow public read access to traffic_observations" ON traffic_observations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to air_quality_stations" ON air_quality_stations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to air_quality_observations" ON air_quality_observations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to simulation_scenarios" ON simulation_scenarios FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to simulation_scenarios" ON simulation_scenarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to simulation_runs" ON simulation_runs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to simulation_runs" ON simulation_runs FOR INSERT WITH CHECK (true);
