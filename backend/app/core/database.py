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
    conn.commit()
    conn.close()

init_db()

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn
