from fastapi import APIRouter, Depends
import json
from app.api.auth import get_current_user
from app.core.database import get_db_connection

router = APIRouter(prefix="/exposure", tags=["exposure"])

@router.get("/score")
def get_user_exposure(user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    profile = conn.execute("SELECT * FROM user_profiles WHERE user_id = ?", (user["id"],)).fetchone()
    conn.close()

    if not profile:
        streak_days = 4
        clean_air_score = 76.0
        badges = ["Clean Air Pioneer", "Route Optimizer"]
        commute_saved_pct = 18.0
    else:
        streak_days = profile["streak_days"]
        clean_air_score = profile["clean_air_score"]
        badges = json.loads(profile["badges"]) if profile["badges"] else ["Clean Air Pioneer"]
        commute_saved_pct = profile["commute_saved_pct"]

    # All available badges with unlock status
    all_badges = [
        {
            "id": "badge_1",
            "title": "Clean Air Champion",
            "description": "Maintained 3+ days in low exposure zones",
            "unlocked": "Clean Air Champion" in badges or streak_days >= 3,
            "icon": "award"
        },
        {
            "id": "badge_2",
            "title": "Route Optimizer",
            "description": "Picked the greenest commute corridor",
            "unlocked": True,
            "icon": "navigation"
        },
        {
            "id": "badge_3",
            "title": "Early Warner",
            "description": "Shared smoke alerts with neighbors before peak AQI",
            "unlocked": "Early Warner" in badges,
            "icon": "bell"
        },
        {
            "id": "badge_4",
            "title": "Stubble Sentinel",
            "description": "Submitted a photo-verified field burning report",
            "unlocked": True,
            "icon": "shield-check"
        }
    ]

    return {
        "user_id": user["id"],
        "user_name": user["name"],
        "ward": user["ward"],
        "daily_exposure_score": clean_air_score,
        "score_label": "Good Exposure Control" if clean_air_score >= 70 else "High Inhaled Dose",
        "streak_days": streak_days,
        "commute_comparison": {
            "headline": f"Your commute = {commute_saved_pct}% more PM2.5 than cleanest route",
            "default_route": {"name": "Highway / Ring Corridor", "pm25_dose": 84, "duration_mins": 34},
            "cleanest_route": {"name": "Green Belt Boulevard", "pm25_dose": 69, "duration_mins": 38, "reduction": f"{commute_saved_pct}% cleaner"}
        },
        "weekly_history": [
            {"day": "Mon", "score": 82},
            {"day": "Tue", "score": 79},
            {"day": "Wed", "score": 75},
            {"day": "Thu", "score": 88},
            {"day": "Fri", "score": 76},
            {"day": "Sat", "score": 71},
            {"day": "Sun", "score": 84}
        ],
        "badges": all_badges
    }
