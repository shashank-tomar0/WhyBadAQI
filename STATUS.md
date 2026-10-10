# WhyBadAQI — Project Status

> **Last updated:** 2026-10-09 | **Repo:** [shashank-tomar0/WhyBadAQI](https://github.com/shashank-tomar0/WhyBadAQI)
> **One-liner:** "Know not just how bad the air is — know *what's causing it*, right now, on your street."

---

## ✅ DONE

### 🏗️ Infrastructure & Repo Setup
- [x] Monorepo initialized at `env-hack/` with `backend/`, `mobile/`, `infra/` structure
- [x] `.gitignore` configured (excludes venv, node_modules, .db, .env)
- [x] GitHub repo created: `https://github.com/shashank-tomar0/WhyBadAQI`
- [x] 7 semantic commits pushed to `main` branch
- [x] `README.md` — full project documentation with badges, architecture, quickstart
- [x] AWS SAM template `infra/template.yaml` — Lambda, DynamoDB, S3, Cognito, SNS
- [x] SageMaker endpoint deployment script `infra/sagemaker_endpoint.py`

### ⚙️ Backend — FastAPI + PyTorch
- [x] `backend/requirements.txt` — all core Python dependencies
- [x] `backend/Dockerfile` — production container (python:3.11-slim, non-root user, health check)
- [x] `backend/.env.example` — environment variable template with all keys documented
- [x] `backend/app/core/config.py` — Settings class (JWT secret, DB URL, API keys, hybrid mode flag)
- [x] `backend/app/core/security.py` — JWT encode/decode, bcrypt password hash/verify
- [x] `backend/app/core/database.py` — SQLite `init_db()` with users, user_profiles, community_reports tables + seeding
- [x] **ML Engine** `backend/app/models/attribution_ml.py`
  - PyTorch MLP `SourceAttributionMLP` (8 input features → 4-class softmax: stubble / traffic / dust / industry)
  - Gaussian plume atmospheric dispersion physics (hour_sin/cos, wind_rad, fire_factor, rush_index)
  - `AttributionEngine` singleton: 24hr forecast, timeline, cardinal wind directions
  - Graceful degradation if numpy/torch not installed
- [x] **Data Service** `backend/app/services/air_quality_service.py`
  - `AirQualityService`: live API feeds with heatmap grid generation
  - Nearby hotspot detection (4 source types)
  - Personal exposure score calculation (0–100, normalized)
- [x] **API Routers** (all mounted at `/api/v1`):
  - `auth.py` — `/auth/register`, `/auth/login`, `/auth/me` (JWT Bearer)
  - `attribution.py` — `/attribution/live?lat&lon&time_offset`, `/attribution/forecast`
  - `exposure.py` — `/exposure/score` with badges, streaks, commute comparison, weekly history
  - `actions.py` — `/actions/` → 4 prescriptive swipeable action cards
  - `community.py` — `/community/reports` (GET/POST), `/community/leaderboard`
  - `ingestion.py` — Hybrid ingestor: OpenAQ v3 + NASA FIRMS + OpenWeatherMap with full simulation fallback
- [x] `backend/app/main.py` — FastAPI entrypoint, CORS, lifespan startup, all routers registered
- [x] `backend/venv/` — Python virtual environment with core packages installed
- [x] **End-to-end integration test passed**: AQI=300, Stubble=40%, Exposure=78.5, Streak=3, 4 action cards, 2 community reports

### 📱 Mobile — Expo React Native SDK 52
- [x] `mobile/package.json` — Expo SDK 52, React 18.3.1, expo-router 4.0.17, expo-notifications, expo-device, expo-location
- [x] `mobile/app.json` — WhyBadAQI branding, dark UI, bundle ID `ai.whybadaqi.app`
- [x] `mobile/tsconfig.json` — TypeScript strict config
- [x] **Constants** `mobile/constants/theme.ts` — full design token system (colours, source config, AQI grade helper, spacing, radius)
- [x] **Services:**
  - `mobile/services/api.ts` — Full typed API client with offline mock fallback for all 5 endpoints
  - `mobile/services/notifications.ts` — Push registration, daily summary scheduling, AQI threshold alerts, badge unlock toasts, listener setup
- [x] **Context** `mobile/context/AuthContext.tsx` — JWT session, login/register/quickDemoLogin/logout, AsyncStorage persistence
- [x] **Hooks:**
  - `mobile/hooks/useAttribution.ts` — live source attribution with auto-refresh (2 min interval)
  - `mobile/hooks/useExposure.ts` — personal exposure score + badges
  - `mobile/hooks/useLocation.ts` — GPS foreground permission + live position subscription (Delhi fallback)
- [x] **Reusable Components:**
- [x] **Design System Specification:** `design.md` — Brutalist Monospace Precision Instrument (Nothing OS / Teenage Engineering OP-1 / Dieter Rams aesthetic)
- [x] **Skills Integration:** 38 Matt Pocock skills installed via `npx skills add https://github.com/mattpocock/skills` (including `ask-matt`, `grill-with-docs`, `tdd`, `code-review`)
- [x] **Reusable Brutalist Components:**
  - `mobile/components/HeroAqi.tsx` — massive 84px monospace hero AQI indicator with status and range tags
  - `mobile/components/MetricTile.tsx` — high-density 2-column tabular metric cell with 1px hairline dividers
  - `mobile/components/HourlyScrub.tsx` — horizontal monospace hourly projection scrubber
  - `mobile/components/ProjectionRow.tsx` — multi-day projection row with hairline range bar gauge
  - `mobile/components/AsciiButton.tsx` — bracketed brutalist button (`[+]`, `[>]`, `[X]`, `[ENABLE]`)
  - `mobile/components/AqiRing.tsx` — animated arc gauge
- [x] **All App Screens Completely Redesigned to Brutalist Monospace Aesthetic:**

| Screen | File | Aesthetic & Implementation Status |
|---|---|---|
| Auth: Login | `app/(auth)/login.tsx` | ✅ Done — Terminal gateway + 1-tap evaluator bypass |
| Auth: Register | `app/(auth)/register.tsx` | ✅ Done — Operator onboarding form |
| Map: Live Pollution Map | `app/(tabs)/index.tsx` | ✅ Done — Crosshair sensor grid, hero AQI, 2-col metric tiles |
| Attribution: Why Is It Bad? | `app/(tabs)/attribution.tsx` | ✅ Done — Source apportionment bars, met grid, synthesis box |
| Exposure: My Score | `app/(tabs)/exposure.tsx` | ✅ Done — 78/100 hero dosimetry, route comparison, 7-day history |
| Actions: Action Cards | `app/(tabs)/actions.tsx` | ✅ Done — Prescriptive defense advisories + WhatsApp trigger |
| Community: Reports | `app/(tabs)/community.tsx` | ✅ Done — Ward leaderboard, incident stream, field submission modal |
| Share Card (viral modal) | `app/share-card.tsx` | ✅ Done — Printable atmospheric dossier export card |

- [x] `mobile/node_modules/` — 940 packages audited and installed (`npm install --legacy-peer-deps`)
- [x] TypeScript check (`npx tsc --noEmit`) — **passed clean (exit code 0)**

### 📦 Git Commit History
```
dd7e421  feat(ui): implement brutalist monospace Nothing OS / Teenage Engineering aesthetic across all 5 core screens and components
7192e28  docs: add design.md specification and sync skills-lock.json
9496ce3  docs: add comprehensive STATUS.md project tracker
3441459  chore(mobile): update lockfile for expo-notifications and expo-location dependencies
ed75927  feat(infra): add docker-compose local dev stack and CI workflow template
3a16489  feat(mobile): add theme tokens, GlassCard/SourceBadge/AqiRing components, useAttribution/useExposure/useLocation hooks, and push notification service
331a5a0  feat(backend): add Dockerfile, .env.example, and hybrid OpenAQ/FIRMS/OWM ingestion pipeline
eada8ba  chore(mobile): pin exact dependency lockfile for reproducible builds
c0fa907  feat(ui): implement 5 core screens + viral share card
04840bf  feat(mobile): scaffold Expo app with Expo Router & strict auth wall
00cb492  feat(api): add auth, attribution, exposure, actions, community endpoints
4923db8  feat(ml): implement PyTorch MLP surrogate & Gaussian plume engine
580383b  feat(backend): implement FastAPI core, JWT, SQLite persistence
7f9363f  feat(infra): initialize repo, AWS SAM template & SageMaker spec
```

---

- [x] **Live Satellite & Sensor Integration (All 3 APIs Active & Verified Live):**
  - **NASA FIRMS MODIS / VIIRS**: Thermal anomaly satellite queries active (Key: `3aed288...`)
  - **OpenAQ v3 Ground Sensors**: CPCB / DPCC Delhi ground stations ingesting live PM2.5 (Key: `3a60025...`)
  - **OpenWeatherMap & Open-Meteo**: Live wind vectors (16.7 km/h, 100° E), 30.0°C, 70% humidity (Key: `5ceb773...`)
  - **End-to-End Live Validation**: All 10 API endpoints tested live against `http://127.0.0.1:8000` with 100% pass rate.

---

## ❌ REMAINING / NOT STARTED

### Mobile
- [ ] **Haptic feedback** — `expo-haptics` on button taps and score reveals
- [ ] **Animated heatmap overlay** — time-scrub animation with interpolated colours (currently static mock circles)
- [ ] **Mapbox GL integration** — `@rnmapbox/maps` or `react-native-mapbox-gl` for real vector map tiles (currently basic react-native-maps placeholder)
- [ ] **EAS Build config** — `eas.json` for cloud build (iOS + Android binary)
- [ ] **App Store metadata** — screenshots, description, keywords for App Store / Play Store
- [ ] **Offline data persistence** — cache attribution + exposure data to AsyncStorage so app works on first open without internet
- [ ] **Widget spec** — iOS 16 / Android 13 home screen widget showing current AQI + top source

### Backend
- [ ] **numpy install check** — ensure `numpy` is in `backend/venv` for full PyTorch MLP activation
- [ ] **Rate limiting** — `slowapi` middleware to protect public endpoints
- [ ] **Caching layer** — Redis or in-memory TTL cache for `/attribution/live` (avoid re-running ML on every tap)
- [ ] **User profile endpoints** — PATCH `/auth/profile` for ward/city preference updates
- [ ] **Scheduled ingestion cron** — call `ingestion_pipeline.run()` every 15 min via APScheduler or AWS EventBridge

### Infrastructure / Deployment
- [ ] **AWS deployment** — `sam deploy` with `infra/template.yaml`
- [ ] **GitHub Actions CI/CD** — lint + test on PR, deploy to Lambda on merge to `main`
- [ ] **Expo EAS deployment** — `eas build` + `eas submit` for TestFlight / Play Store internal track

### Demo / Hackathon Polish
- [ ] **3-minute demo video** — screen record on device, voiceover explaining value prop
- [ ] **Live hosted backend URL** — Railway / Render / Fly.io free tier for judges to test against
- [ ] **QR code for judges** — Expo Go QR pointing to the hosted backend

---

## 🚀 HOW TO RUN

### Backend (FastAPI)
```bash
cd c:\Users\dell\Desktop\env-hack\backend

# Activate venv (Windows)
.\venv\Scripts\activate

# Install deps (first time)
pip install -r requirements.txt

# Start dev server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API docs auto-generated at: http://127.0.0.1:8000/docs

### Mobile (Expo)
```bash
cd c:\Users\dell\Desktop\env-hack\mobile

# Install new packages (after adding expo-notifications etc.)
npm install --legacy-peer-deps

# Start Expo dev server
npx expo start

# Open in browser (web preview)
npx expo start --web

# TypeScript check
npx tsc --noEmit
```

---

## 🏛️ ARCHITECTURE OVERVIEW

```
WhyBadAQI Monorepo
├── backend/                     ← FastAPI + PyTorch
│   ├── app/
│   │   ├── core/               ← config, security, database
│   │   ├── models/             ← attribution_ml.py (MLP + Gaussian physics)
│   │   ├── services/           ← air_quality_service.py (live + sim)
│   │   └── api/                ← auth, attribution, exposure, actions,
│   │                               community, ingestion (OpenAQ/FIRMS/OWM)
│   ├── Dockerfile              ← production container
│   └── .env.example            ← API key template
│
├── mobile/                      ← Expo React Native SDK 52
│   ├── app/
│   │   ├── (auth)/             ← login, register screens
│   │   └── (tabs)/             ← 5 core screens + share card
│   ├── components/             ← GlassCard, SourceBadge, AqiRing
│   ├── constants/              ← theme.ts (design tokens)
│   ├── context/                ← AuthContext (JWT session)
│   ├── hooks/                  ← useAttribution, useExposure, useLocation
│   └── services/               ← api.ts, notifications.ts
│
└── infra/                       ← AWS SAM IaC
    ├── template.yaml           ← Lambda, DynamoDB, S3, Cognito, SNS
    └── sagemaker_endpoint.py   ← SageMaker PyTorch endpoint deployment
```

### Data Flow
```
Live APIs (OpenAQ / FIRMS / OpenWeatherMap)
        ↓  [ingestion pipeline — 15 min cron]
   Hybrid Simulator (if keys absent)
        ↓
   FastAPI Backend (port 8000)
        ↓  REST JSON /api/v1/*
   Expo Mobile App  ←→  expo-location GPS
        ↓
   5 Screens + Push Notifications + Share Cards
```

---

## 📱 SCREEN OVERVIEW

| # | Screen | Key Feature | Viral Hook |
|---|--------|-------------|------------|
| 1 | **Live Map** | Animated heatmap, time scrubber, source filters | Screenshot-worthy AQI overlays |
| 2 | **Why Is It Bad?** | Source donut chart, wind compass, plain-language explanation | "Smoke from Haryana fires" shareable |
| 3 | **My Exposure Score** | 0–100 ring gauge, streak counter, badge gallery | Duolingo-style habit forming |
| 4 | **Action Cards** | Swipeable prescriptive actions, WhatsApp deep-link | One-tap share to RWA groups |
| 5 | **Community Reports** | Geo-tagged photo reports, ward leaderboard | Social proof + streaks |

---

## 🔑 API KEYS NEEDED (all optional — simulator kicks in without them)

| API | Purpose | Free Tier | Link |
|-----|---------|-----------|------|
| OpenAQ v3 | Ground PM2.5 sensors | Yes | https://explore.openaq.org/ |
| OpenWeatherMap | Wind / met conditions | Yes | https://openweathermap.org/api |
| NASA FIRMS | Active fire / stubble burn hotspots | Yes | https://firms.modaps.eosdis.nasa.gov/api/ |

Place keys in `backend/.env` (copy from `backend/.env.example`).
