from fastapi import APIRouter, Query, Depends
from typing import Optional
from app.services.air_quality_service import air_quality_service
from app.api.auth import get_current_user

router = APIRouter(prefix="/attribution", tags=["attribution"])

@router.get("/live")
def get_live_attribution(
    lat: float = Query(28.6139, description="Latitude"),
    lon: float = Query(77.2090, description="Longitude"),
    time_offset: int = Query(0, ge=0, le=24, description="Scrub hours into future (0-24)"),
    user: dict = Depends(get_current_user)
):
    """
    Returns live pollution state, source attribution breakdown,
    wind vectors, plain language explanation, and heatmap tiles.
    """
    data = air_quality_service.get_hyperlocal_feed(lat=lat, lon=lon, time_offset_hours=time_offset)
    return data

@router.get("/forecast")
def get_forecast(
    lat: float = Query(28.6139),
    lon: float = Query(77.2090),
    user: dict = Depends(get_current_user)
):
    """Returns 24-hour hour-by-hour forecast curve."""
    feed = air_quality_service.get_hyperlocal_feed(lat=lat, lon=lon, time_offset_hours=0)
    return {
        "current_aqi": feed["aqi"],
        "forecast": feed["forecast_24h"],
        "forecast_24h": feed["forecast_24h"]
    }
