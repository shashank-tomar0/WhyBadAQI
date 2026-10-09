from fastapi import APIRouter, Depends
from typing import List
from app.api.auth import get_current_user

router = APIRouter(prefix="/actions", tags=["actions"])

@router.get("/")
def get_action_cards(user: dict = Depends(get_current_user)):
    return {
        "cards": [
            {
                "id": "action-1",
                "title": "Cancel Outdoor Sports (4–7 PM)",
                "category": "High Urgency",
                "urgency_color": "#E63946",
                "reason": "NW stubble smoke plume intersects evening peak rush hour",
                "duration": "Next 3 hours",
                "expected_impact": "Prevents 42% spike in inhaled PM2.5 lung dose",
                "icon": "activity",
                "share_text": "⚠️ WhyBadAQI Alert: AQI set to peak between 4-7 PM due to incoming stubble smoke. Cancel evening outdoor sports and keep kids indoors!",
                "reminder_time": "16:00"
            },
            {
                "id": "action-2",
                "title": "Close Windows & Run Purifier (High Fan)",
                "category": "Home Defense",
                "urgency_color": "#F4A261",
                "reason": "Nighttime temperature inversion will trap ground particulates",
                "duration": "7 PM – 8 AM",
                "expected_impact": "Maintains indoor PM2.5 below 25 µg/m³",
                "icon": "shield",
                "share_text": "WhyBadAQI: Temperature inversion tonight will trap smog. Seal windows and switch your air purifier to high before 8 PM.",
                "reminder_time": "19:00"
            },
            {
                "id": "action-3",
                "title": "Divert Commute: Avoid Outer Ring Road",
                "category": "Commute Optimizer",
                "urgency_color": "#2A9D8F",
                "reason": "Heavy diesel truck bottleneck causing micro-smog zone",
                "duration": "Evening commute",
                "expected_impact": "Saves 18% PM2.5 exposure via Green Belt Boulevard",
                "icon": "map-pin",
                "share_text": "WhyBadAQI Commute Tip: Ring Road pollution is 2.4x higher right now. Take Green Belt Boulevard to cut toxic exposure by 18%.",
                "reminder_time": "17:30"
            },
            {
                "id": "action-4",
                "title": "Wear N95 Mask for Walk",
                "category": "Personal Shield",
                "urgency_color": "#E76F51",
                "reason": "Construction dust & coarse PM10 elevated near Sector 45",
                "duration": "All day",
                "expected_impact": "Filters 95% of airborne toxic particles",
                "icon": "heart",
                "share_text": "WhyBadAQI: Air quality in our sector is currently unhealthy. Wear an N95 mask if stepping out today.",
                "reminder_time": "08:00"
            }
        ]
    }
