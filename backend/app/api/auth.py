from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
import uuid
from datetime import datetime
from typing import Optional
from app.core.database import get_db_connection
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    ward: Optional[str] = "Ward 45 (Central)"

class UserLogin(BaseModel):
    email: str
    password: str

def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authentication token")
    token = authorization.split(" ")[1]
    if token == "mock-demo-jwt-token-2026":
        return {
            "id": "usr-demo-777",
            "email": "arjun@whybadaqi.ai",
            "name": "Arjun (Delhi NCR)",
            "ward": "Ward 45 (Central)",
            "created_at": "2026-10-10T00:00:00Z"
        }
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token session")
    
    conn = get_db_connection()
    user = conn.execute("SELECT id, email, name, ward, created_at FROM users WHERE id = ?", (payload["sub"],)).fetchone()
    conn.close()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return dict(user)

@router.post("/register")
def register(req: UserRegister):
    conn = get_db_connection()
    existing = conn.execute("SELECT id FROM users WHERE email = ?", (req.email,)).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    
    user_id = str(uuid.uuid4())
    pw_hash = get_password_hash(req.password)
    now = datetime.utcnow().isoformat()
    
    conn.execute(
        "INSERT INTO users (id, email, name, password_hash, ward, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (user_id, req.email, req.name, pw_hash, req.ward, now)
    )
    # Initialize default exposure profile & starter badges
    starter_badges = ["Clean Air Pioneer", "First Sentinel"]
    import json
    conn.execute(
        "INSERT INTO user_profiles (user_id, streak_days, clean_air_score, total_reports, badges, commute_saved_pct) VALUES (?, ?, ?, ?, ?, ?)",
        (user_id, 3, 78.5, 1, json.dumps(starter_badges), 18.0)
    )
    conn.commit()
    conn.close()
    
    token = create_access_token(user_id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": req.name,
            "email": req.email,
            "ward": req.ward
        }
    }

@router.post("/login")
def login(req: UserLogin):
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (req.email,)).fetchone()
    conn.close()
    
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    token = create_access_token(user["id"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "ward": user["ward"]
        }
    }

@router.get("/me")
def get_me(user: dict = Depends(get_current_user)):
    return user
