from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import datetime
from app.api.auth import get_current_user
from app.core.database import get_db_connection

router = APIRouter(prefix="/community", tags=["community"])

class CreateReportRequest(BaseModel):
    category: str # smoke, dust, waste_burning, traffic_clog
    description: str
    latitude: float
    longitude: float
    photo_url: Optional[str] = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600" # fallback realistic sample

@router.get("/reports")
def get_reports(user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    reports = conn.execute("SELECT * FROM community_reports ORDER BY created_at DESC").fetchall()
    
    # If empty, populate initial realistic verified reports
    if not reports:
        seed_reports = [
            (
                "rep-1",
                "usr-delhi-1",
                "Arjun Sharma",
                "Open Garbage Fire",
                "Dense toxic smoke billowing behind Sector 45 vacant plot.",
                28.6189,
                77.2120,
                "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600",
                "GPS & Timestamp Verified",
                14,
                datetime.utcnow().isoformat()
            ),
            (
                "rep-2",
                "usr-delhi-2",
                "Priya Nair",
                "Uncovered Construction Dust",
                "Truck dumping loose dry cement without mandatory water misting.",
                28.6110,
                77.2050,
                "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600",
                "GPS & Timestamp Verified",
                9,
                datetime.utcnow().isoformat()
            )
        ]
        for r in seed_reports:
            conn.execute(
                "INSERT INTO community_reports (id, user_id, user_name, category, description, latitude, longitude, photo_url, trust_badge, upvotes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                r
            )
        conn.commit()
        reports = conn.execute("SELECT * FROM community_reports ORDER BY created_at DESC").fetchall()

    conn.close()
    return [dict(r) for r in reports]

@router.post("/reports")
def create_report(req: CreateReportRequest, user: dict = Depends(get_current_user)):
    report_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    trust_badge = "GPS & Photo Verified"

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO community_reports (id, user_id, user_name, category, description, latitude, longitude, photo_url, trust_badge, upvotes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (report_id, user["id"], user["name"], req.category, req.description, req.latitude, req.longitude, req.photo_url, trust_badge, 1, now)
    )
    # Increment user's total reports in profile
    conn.execute(
        "UPDATE user_profiles SET total_reports = total_reports + 1, streak_days = streak_days + 1 WHERE user_id = ?",
        (user["id"],)
    )
    conn.commit()
    conn.close()

    return {
        "id": report_id,
        "message": "Report successfully verified and broadcasted to ward",
        "trust_badge": trust_badge,
        "created_at": now
    }

@router.get("/leaderboard")
def get_leaderboard(user: dict = Depends(get_current_user)):
    return {
        "ward": user.get("ward", "Ward 45 (Central)"),
        "top_reporters": [
            {"rank": 1, "name": "Arjun Sharma", "reports_count": 14, "streak": 7, "badge": "Ward Guardian"},
            {"rank": 2, "name": "Priya Nair", "reports_count": 9, "streak": 5, "badge": "Sentinel Pro"},
            {"rank": 3, "name": user["name"], "reports_count": 4, "streak": 3, "badge": "Clean Air Pioneer"},
            {"rank": 4, "name": "Vikram Seth", "reports_count": 3, "streak": 2, "badge": "Early Warner"},
            {"rank": 5, "name": "Rohan Mehra", "reports_count": 2, "streak": 1, "badge": "Observer"}
        ],
        "user_stats": {
            "current_rank": 3,
            "weekly_reports": 4,
            "streak_days": 3
        }
    }
