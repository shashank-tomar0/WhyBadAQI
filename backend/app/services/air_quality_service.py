import math
import random
import requests
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.core.config import settings
from app.models.attribution_ml import attribution_engine

class AirQualityService:
    def __init__(self):
        pass

    def get_hyperlocal_feed(self, lat: float = 28.6139, lon: float = 77.2090, time_offset_hours: int = 0) -> Dict[str, Any]:
        """
        Returns full live state:
        - Attribution breakdown & forecast
        - Active fire clusters and industrial hotspots
        - Heatmap points with source coloring
        - Personal exposure score (0-100)
        """
        # Wind simulation: default typical NW wind for northern plains / Indo-Gangetic basin
        wind_speed = round(12.0 + 4.0 * math.sin(time_offset_hours * 0.4), 1)
        wind_deg = (315.0 + time_offset_hours * 2.5) % 360

        attr = attribution_engine.calculate_attribution(
            lat=lat,
            lon=lon,
            wind_speed_kmh=wind_speed,
            wind_deg=wind_deg,
            active_fires_count=184,
            hour=(datetime.now().hour + time_offset_hours) % 24
        )

        forecast = attribution_engine.generate_24h_forecast(
            current_aqi=attr["aqi"],
            wind_speed=wind_speed,
            wind_deg=wind_deg
        )

        # Personal Exposure Score calculation (0-100, where 100 is cleanest, 0 is worst)
        # Scaled inversely to AQI and peak exposure
        raw_score = max(10, min(95, 100 - (attr["aqi"] * 0.18)))
        exposure_score = int(round(raw_score))

        # Health grade & color
        if attr["aqi"] <= 100:
            health_color = "#2ECC71" # Green
            health_label = "Good Air Quality"
            exposure_advice = "Safe for outdoor workouts"
        elif attr["aqi"] <= 200:
            health_color = "#F1C40F" # Yellow
            health_label = "Moderate Smog"
            exposure_advice = "Sensitive groups wear masks"
        elif attr["aqi"] <= 300:
            health_color = "#E67E22" # Orange
            health_label = "Unhealthy"
            exposure_advice = "Limit outdoor exposure; close windows"
        else:
            health_color = "#E74C3C" # Red
            health_label = "Severe Pollution"
            exposure_advice = "Avoid all outdoor activity; run air purifier"

        # Generate realistic nearby source points and heatmap tiles centered on user coordinates
        hotspots = self._generate_nearby_hotspots(lat, lon, time_offset_hours)
        heatmap_points = self._generate_heatmap_grid(lat, lon, attr, time_offset_hours)

        return {
            "timestamp": datetime.now().isoformat(),
            "selected_time_offset": time_offset_hours,
            "center": {"latitude": lat, "longitude": lon},
            "aqi": attr["aqi"],
            "pm25": attr["pm25"],
            "exposure_score": exposure_score,
            "health_grade": health_label,
            "health_color": health_color,
            "exposure_advice": exposure_advice,
            "attribution": attr,
            "forecast_24h": forecast,
            "hotspots": hotspots,
            "heatmap_points": heatmap_points
        }

    def _generate_nearby_hotspots(self, lat: float, lon: float, offset_hours: int) -> List[Dict[str, Any]]:
        """Active point sources: fires (pulsing red), traffic bottlenecks, factories."""
        return [
            {
                "id": "fire-1",
                "type": "stubble",
                "name": "Active Stubble Burn Cluster",
                "latitude": lat + 0.052,
                "longitude": lon - 0.048,
                "intensity": "High (Pulsing)",
                "color": "#FF6B35",
                "distance_km": 6.8,
                "pm25_contribution": "48 µg/m³"
            },
            {
                "id": "traffic-1",
                "type": "traffic",
                "name": "Ring Road Arterial Congestion",
                "latitude": lat - 0.018,
                "longitude": lon + 0.021,
                "intensity": "Heavy",
                "color": "#0077B6",
                "distance_km": 2.4,
                "pm25_contribution": "32 µg/m³"
            },
            {
                "id": "dust-1",
                "type": "dust",
                "name": "Metro Extension Construction Site",
                "latitude": lat + 0.025,
                "longitude": lon + 0.035,
                "intensity": "Moderate",
                "color": "#D4A373",
                "distance_km": 3.9,
                "pm25_contribution": "19 µg/m³"
            },
            {
                "id": "industry-1",
                "type": "industry",
                "name": "Manufacturing Complex Plume",
                "latitude": lat - 0.062,
                "longitude": lon - 0.039,
                "intensity": "Continuous",
                "color": "#7209B7",
                "distance_km": 7.5,
                "pm25_contribution": "25 µg/m³"
            }
        ]

    def _generate_heatmap_grid(self, lat: float, lon: float, attr: Dict[str, Any], offset_hours: int) -> List[Dict[str, Any]]:
        """Generates hyper-local colored heatmap points indicating spatial distribution of dominant sources."""
        points = []
        # Grid around user lat/lon within ~10km radius
        step = 0.015
        for i in range(-3, 4):
            for j in range(-3, 4):
                grid_lat = lat + (i * step)
                grid_lon = lon + (j * step)
                
                # Northwest quadrant has stronger stubble influence
                if i >= 0 and j <= 0:
                    dominant = "stubble"
                    color = "#FF6B35"
                    weight = min(1.0, 0.5 + (attr["breakdown"]["stubble"] / 100.0))
                elif abs(i) <= 1 and abs(j) <= 1:
                    dominant = "traffic"
                    color = "#0077B6"
                    weight = min(1.0, 0.4 + (attr["breakdown"]["traffic"] / 100.0))
                elif j > 0 and i > 0:
                    dominant = "dust"
                    color = "#D4A373"
                    weight = 0.55
                else:
                    dominant = "industry"
                    color = "#7209B7"
                    weight = 0.60

                points.append({
                    "latitude": grid_lat,
                    "longitude": grid_lon,
                    "weight": round(weight, 2),
                    "dominant_source": dominant,
                    "color": color
                })
        return points

air_quality_service = AirQualityService()
