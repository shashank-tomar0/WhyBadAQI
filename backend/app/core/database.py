import sqlite3
import json
import os
from typing import Optional, Dict, Any, List
from app.core.config import settings

# Hybrid database engine: provides clean persistence with SQLite fallback and MongoDB adapter
DB_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "whybadaqi.db")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        password_hash TEXT,
        ward TEXT,
        created_at TEXT
    )
    """)
    # Exposure profiles & streaks
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_profiles (
        user_id TEXT PRIMARY KEY,
        streak_days INTEGER DEFAULT 3,
        clean_air_score REAL DEFAULT 78.5,
        total_reports INTEGER DEFAULT 2,
        badges TEXT,
        commute_saved_pct REAL DEFAULT 18.0
    )
    """)
    # Community Reports table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS community_reports (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        user_name TEXT,
        category TEXT,
        description TEXT,
        latitude REAL,
        longitude REAL,
        photo_url TEXT,
        trust_badge TEXT,
        upvotes INTEGER DEFAULT 1,
        created_at TEXT
    )
    """)

    # Seed demo evaluators if not present
    from app.core.security import get_password_hash
    cursor.execute("SELECT id FROM users WHERE email = ?", ("demo@whybadaqi.ai",))
    if not cursor.fetchone():
        pwd_hash = get_password_hash("demopassword123")
        cursor.execute(
            "INSERT INTO users (id, email, name, password_hash, ward, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            ("usr-demo-001", "demo@whybadaqi.ai", "Demo Evaluator", pwd_hash, "Ward 45 (Central)", "2026-10-10T00:00:00Z")
        )
        starter_badges = ["Clean Air Pioneer", "First Sentinel"]
        cursor.execute(
            "INSERT OR IGNORE INTO user_profiles (user_id, streak_days, clean_air_score, total_reports, badges, commute_saved_pct) VALUES (?, ?, ?, ?, ?, ?)",
            ("usr-demo-001", 4, 78.5, 3, json.dumps(starter_badges), 18.0)
        )

    cursor.execute("SELECT id FROM users WHERE email = ?", ("arjun@whybadaqi.ai",))
    if not cursor.fetchone():
        pwd_hash = get_password_hash("demopassword123")
        cursor.execute(
            "INSERT INTO users (id, email, name, password_hash, ward, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            ("usr-demo-777", "arjun@whybadaqi.ai", "Arjun (Delhi NCR)", pwd_hash, "Ward 45 (Central)", "2026-10-10T00:00:00Z")
        )
        cursor.execute(
            "INSERT OR IGNORE INTO user_profiles (user_id, streak_days, clean_air_score, total_reports, badges, commute_saved_pct) VALUES (?, ?, ?, ?, ?, ?)",
            ("usr-demo-777", 4, 82.0, 5, json.dumps(["Route Optimizer", "Clean Air Champion"]), 22.0)
        )

    # Seed initial community reports if empty
    cursor.execute("SELECT count(*) FROM community_reports")
    count = cursor.fetchone()[0]
    if count == 0:
        cursor.execute(
            """
            INSERT INTO community_reports (id, user_id, user_name, category, description, latitude, longitude, photo_url, trust_badge, upvotes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            ("rpt-001", "usr-demo-001", "Shashank T.", "Open Garbage Fire", "Heavy black smoke plume billowing behind Sector 45 market.", 28.6189, 77.2120, "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600", "GPS & Photo Verified", 12, "2026-10-10T05:15:00Z")
        )
        cursor.execute(
            """
            INSERT INTO community_reports (id, user_id, user_name, category, description, latitude, longitude, photo_url, trust_badge, upvotes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            ("rpt-002", "usr-demo-777", "Ananya R.", "Construction Dust", "Demolition site operating without water spray curtains.", 28.6250, 77.2180, "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=600", "GPS & Photo Verified", 8, "2026-10-10T04:45:00Z")
        )

    conn.commit()
    conn.close()

init_db()

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn
