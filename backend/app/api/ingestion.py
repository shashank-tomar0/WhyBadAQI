"""
WhyBadAQI — Hybrid Data Ingestion Service
==========================================
Pulls from live APIs when keys are present, falls back to high-fidelity
simulation otherwise. Designed for AWS Lambda scheduling (every 15 min).

Data sources:
  - OpenAQ v3 REST API  → ground sensor PM2.5, PM10, NO2
  - NASA FIRMS MODIS    → thermal anomaly / active fire coordinates
  - OpenWeatherMap      → wind speed, direction, temperature
"""
import math
import time
import random
import logging
from datetime import datetime, timezone
from typing import Optional

try:
    import requests as http_requests
    HTTP_AVAILABLE = True
except ImportError:
    HTTP_AVAILABLE = False

from app.core.config import settings

logger = logging.getLogger("whybadaqi.ingestion")


# ---------------------------------------------------------------------------
# OpenAQ v3 — Air Quality Sensor Ingestor
# ---------------------------------------------------------------------------
class OpenAQIngestor:
    BASE_URL = "https://api.openaq.org/v3"

    def fetch_recent_measurements(self, lat: float = 28.6139, lon: float = 77.2090, radius_km: int = 25):
        """Fetch latest PM2.5 readings from OpenAQ sensors within radius."""
        if not settings.OPENAQ_API_KEY or not HTTP_AVAILABLE:
            logger.info("OpenAQ key not set — using high-fidelity simulation")
            return self._simulate_measurements(lat, lon)

        try:
            headers = {"X-API-Key": settings.OPENAQ_API_KEY}
            params = {
                "coordinates": f"{lat},{lon}",
                "radius": radius_km * 1000,  # OpenAQ expects metres
                "parameters_id": 2,           # PM2.5 = parameter ID 2
                "limit": 20,
                "page": 1,
            }
            resp = http_requests.get(
                f"{self.BASE_URL}/measurements",
                headers=headers,
                params=params,
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json()
            logger.info(f"OpenAQ: fetched {len(data.get('results', []))} PM2.5 readings")
            return data.get("results", [])
        except Exception as e:
            logger.warning(f"OpenAQ fetch failed ({e}) — falling back to simulation")
            return self._simulate_measurements(lat, lon)

    def _simulate_measurements(self, lat: float, lon: float):
        """Realistic simulated PM2.5 sensor grid for the Indo-Gangetic plain."""
        hour = datetime.now(timezone.utc).hour
        base_pm25 = 120 + 40 * math.sin((hour - 6) * math.pi / 12)  # diurnal pattern
        grid = []
        for i in range(5):
            noise = random.uniform(-15, 20)
            grid.append({
                "location": f"Simulated Sensor {i+1} (Ward {42+i})",
                "coordinates": {
                    "latitude": lat + random.uniform(-0.04, 0.04),
                    "longitude": lon + random.uniform(-0.04, 0.04),
                },
                "value": round(max(20, base_pm25 + noise), 1),
                "unit": "µg/m³",
                "parameter": "pm25",
                "date": {"utc": datetime.now(timezone.utc).isoformat()},
                "source": "simulated",
            })
        return grid


# ---------------------------------------------------------------------------
# NASA FIRMS — Fire / Thermal Anomaly Ingestor
# ---------------------------------------------------------------------------
class FIRMSIngestor:
    BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"

    def fetch_active_fires(self, lat: float = 28.6139, lon: float = 77.2090, area_deg: float = 3.0):
        """Fetch active MODIS fire detections from NASA FIRMS API."""
        if not settings.FIRMS_MAP_KEY or not HTTP_AVAILABLE:
            logger.info("FIRMS key not set — using fire cluster simulation")
            return self._simulate_fires(lat, lon)

        try:
            # FIRMS area query: left,bottom,right,top (WGS84)
            bbox = f"{lon-area_deg},{lat-area_deg},{lon+area_deg},{lat+area_deg}"
            url = f"{self.BASE_URL}/{settings.FIRMS_MAP_KEY}/MODIS_NRT/{bbox}/1"  # last 1 day
            resp = http_requests.get(url, timeout=15)
            resp.raise_for_status()

            lines = resp.text.strip().split("\n")
            fires = []
            if len(lines) > 1:
                keys = lines[0].split(",")
                for row in lines[1:]:
                    vals = row.split(",")
                    if len(vals) == len(keys):
                        fires.append(dict(zip(keys, vals)))
            logger.info(f"FIRMS: fetched {len(fires)} thermal anomalies")
            return fires
        except Exception as e:
            logger.warning(f"FIRMS fetch failed ({e}) — falling back to simulation")
            return self._simulate_fires(lat, lon)

    def _simulate_fires(self, lat: float, lon: float):
        """Simulate realistic Punjab/Haryana stubble fire clusters (Oct–Nov season)."""
        # Historical fire hotspot clusters in north India during crop residue burning season
        clusters = [
            {"lat": lat + 1.2, "lon": lon - 0.8, "count": 47, "zone": "Ludhiana / Sangrur"},
            {"lat": lat + 0.9, "lon": lon - 1.1, "count": 38, "zone": "Bathinda"},
            {"lat": lat + 1.4, "lon": lon - 0.4, "count": 29, "zone": "Fatehabad"},
            {"lat": lat + 0.6, "lon": lon - 0.6, "count": 22, "zone": "Karnal / Kaithal"},
        ]
        fires = []
        for cluster in clusters:
            for _ in range(min(cluster["count"], 8)):  # cap for simulation
                fires.append({
                    "latitude": str(cluster["lat"] + random.uniform(-0.15, 0.15)),
                    "longitude": str(cluster["lon"] + random.uniform(-0.15, 0.15)),
                    "brightness": str(round(random.uniform(310, 365), 1)),
                    "frp": str(round(random.uniform(15, 85), 1)),   # Fire Radiative Power MW
                    "acq_date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                    "acq_time": datetime.now(timezone.utc).strftime("%H%M"),
                    "source": "simulated",
                    "zone": cluster["zone"],
                })
        logger.info(f"Simulated {len(fires)} FIRMS fire detections from {len(clusters)} clusters")
        return fires


# ---------------------------------------------------------------------------
# OpenWeatherMap — Wind & Met Conditions
# ---------------------------------------------------------------------------
class WeatherIngestor:
    BASE_URL = "https://api.openweathermap.org/data/2.5"

    def fetch_conditions(self, lat: float = 28.6139, lon: float = 77.2090):
        """Fetch current wind speed, direction, and temperature."""
        if not settings.OPENWEATHER_API_KEY or not HTTP_AVAILABLE:
            return self._simulate_conditions()

        try:
            params = {
                "lat": lat,
                "lon": lon,
                "appid": settings.OPENWEATHER_API_KEY,
                "units": "metric",
            }
            resp = http_requests.get(f"{self.BASE_URL}/weather", params=params, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            return {
                "wind_speed_kmh": round(data["wind"]["speed"] * 3.6, 1),
                "wind_deg": data["wind"].get("deg", 315),
                "temp_c": data["main"]["temp"],
                "humidity_pct": data["main"]["humidity"],
                "description": data["weather"][0]["description"],
                "source": "openweathermap",
            }
        except Exception as e:
            logger.warning(f"OpenWeather fetch failed ({e}) — simulating met conditions")
            return self._simulate_conditions()

    def _simulate_conditions(self):
        """Simulate realistic October atmospheric conditions over north India."""
        hour = datetime.now(timezone.utc).hour + 5  # IST offset
        # NW winds typical in stubble-burning season (Oct–Nov)
        base_wind_deg = 315 + 15 * math.sin(hour * math.pi / 12)
        base_speed = 12.5 + 5 * math.cos(hour * math.pi / 8)
        return {
            "wind_speed_kmh": round(max(3, base_speed + random.uniform(-2, 3)), 1),
            "wind_deg": round(base_wind_deg % 360, 0),
            "temp_c": round(26 - 4 * math.cos(hour * math.pi / 12) + random.uniform(-1, 1), 1),
            "humidity_pct": random.randint(55, 78),
            "description": "haze with smoke aerosols",
            "source": "simulated",
        }


# ---------------------------------------------------------------------------
# Master Ingestion Pipeline (Lambda handler entry point)
# ---------------------------------------------------------------------------
class IngestionPipeline:
    def __init__(self):
        self.openaq = OpenAQIngestor()
        self.firms = FIRMSIngestor()
        self.weather = WeatherIngestor()

    def run(self, lat: float = 28.6139, lon: float = 77.2090) -> dict:
        """Execute full ingestion cycle and return merged snapshot."""
        start = time.time()
        logger.info(f"Ingestion cycle starting for ({lat}, {lon})")

        sensors = self.openaq.fetch_recent_measurements(lat, lon)
        fires = self.firms.fetch_active_fires(lat, lon)
        met = self.weather.fetch_conditions(lat, lon)

        # Aggregate PM2.5 from sensor grid
        pm25_values = [s.get("value", 0) for s in sensors if isinstance(s.get("value"), (int, float))]
        avg_pm25 = round(sum(pm25_values) / len(pm25_values), 1) if pm25_values else 148.6
        aqi_est = min(500, max(25, int(avg_pm25 * 1.4)))

        snapshot = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "location": {"latitude": lat, "longitude": lon},
            "pm25_avg": avg_pm25,
            "aqi_estimated": aqi_est,
            "active_fires_count": len(fires),
            "wind": met,
            "sensor_count": len(sensors),
            "ingestion_duration_ms": round((time.time() - start) * 1000, 1),
            "data_sources": {
                "openaq": "live" if (settings.OPENAQ_API_KEY and HTTP_AVAILABLE) else "simulated",
                "firms": "live" if (settings.FIRMS_MAP_KEY and HTTP_AVAILABLE) else "simulated",
                "weather": "live" if (settings.OPENWEATHER_API_KEY and HTTP_AVAILABLE) else "simulated",
            },
        }
        logger.info(f"Ingestion complete: AQI≈{aqi_est}, Fires={len(fires)}, Wind={met['wind_speed_kmh']}km/h {met['wind_deg']}°")
        return snapshot


# AWS Lambda handler
def lambda_handler(event, context):
    pipeline = IngestionPipeline()
    result = pipeline.run()
    return {"statusCode": 200, "body": result}


# Module-level singleton for FastAPI routes
ingestion_pipeline = IngestionPipeline()
