# WhyBadAQI 💨

> **"Know not just how bad the air is — know what's causing it, right now, on your street."**

[![Expo](https://img.shields.io/badge/Expo-React%20Native-000020?style=for-the-badge&logo=expo)](https://expo.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-PyTorch%20Backend-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![AWS](https://img.shields.io/badge/AWS-Serverless%20Architecture-FF9900?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🌟 The Vision

Existing AQI apps only tell you an aggregate number (e.g., *"AQI 320 - Hazardous"*), leaving citizens helpless. 

**WhyBadAQI** answers the fundamental question: **Why is my air bad right now?**
By fusing OpenAQ v3 sensor networks, NASA FIRMS thermal satellite imagery, and high-resolution atmospheric dispersion modeling, WhyBadAQI attributes particulate matter down to 100-meter street levels into four distinct causal drivers:
1. **🔥 Stubble Burning (Agricultural Fires)** — Upwind advection plumes
2. **🚗 Vehicular Exhaust** — Corridor traffic congestion and diesel choke points
3. **🏜️ Construction & Road Dust** — Low boundary-layer suspension
4. **🏭 Industrial Emissions** — Point-source manufacturing clusters

---

## 📱 The 5 Core Mobile Screens (Expo + React Native)

| Screen | Description | Key Tech |
|---|---|---|
| **1. Live Pollution Map** | Dark mode full-screen atmospheric canvas with animated heatmaps colored by dominant source (Stubble=Orange, Traffic=Blue, Dust=Brown, Industry=Purple). Features pulsing active fire clusters, personal exposure halo, and a 24-hour time scrubber. | `react-native-svg`, `LinearGradient`, Scrubber Slider |
| **2. "Why Is It Bad?" (Attribution)** | Interactive SVG donut chart breaking down real-time source contributions (%). Includes a wind-vector transport compass (NW @ 14.5 km/h), plain-language summaries, and a "What changed?" hourly timeline. | SVG Donut Arc Math, Wind Advection Compass |
| **3. My Exposure Score** | Daily 0-100 score fitness ring tracking personal inhaled dose. Compares commute corridors (*"Your commute = 18% more PM2.5 than cleanest route"*), tracks daily clean streaks, and awards clean-air badges. | Circular Gauge, Route Comparison Engine, Streaks |
| **4. Action Cards** | Swipeable prescriptive decision cards ("Cancel outdoor sports 4-7 PM", "Seal windows before 8 PM inversion"). Each card details action, reason, duration, and lung impact with 1-tap WhatsApp sharing and reminder scheduling. | Deep Linking, One-Tap WhatsApp RWA Broadcast |
| **5. Community Reports** | Crowdsourced, photo-verified ground truth sensing. Citizens submit geo-tagged observations of garbage fires or unmitigated dust. Verified with "GPS & Photo Trust Badges" and a ward reputation leaderboard. | Geo-tag Verification, Reputation Leaderboard |
| **✨ Viral Share Card** | Screenshot-worthy auto-generated branded card for WhatsApp Status and Instagram Stories displaying personal scores, dominant drivers, and streaks. | Native Share Sheets, Viral Retention Loop |

---

## 🧠 AI Attribution & Atmospheric Physics

WhyBadAQI utilizes a **hybrid neural-physics pipeline**:
- **Gaussian Plume Dispersion Model**: Simulates steady-state atmospheric advection driven by wind speed, direction vectors, and diurnal boundary-layer heights.
- **PyTorch MLP Surrogate**: Evaluates multi-variate features `[sin(hour), cos(hour), wind_speed, wind_direction, fire_density, traffic_rush_index, industrial_proximity, temp]` to infer real-time source contribution percentages in <10ms.

---

## ☁️ AWS Serverless Infrastructure (`infra/`)

Built strictly for enterprise scalability and hackathon evaluation criteria:
- **AWS Lambda**: Event-driven ingestion of NASA FIRMS fire spots and OpenAQ stations every 15 minutes.
- **Amazon DynamoDB**: Key-value store for real-time geohashed sensor states with TTL expiration.
- **Amazon S3**: Raw satellite observation and satellite data lake.
- **Amazon SageMaker**: Real-time endpoint hosting containerized PyTorch source-attribution surrogate models (`infra/sagemaker_endpoint.py`).
- **Amazon Cognito**: Secure authentication and identity pools for mobile clients.
- **Amazon SNS**: Hyperlocal push alerts triggered by threshold pollution spikes.

---

## 🚀 Quickstart Guide

### 1. Backend (FastAPI + PyTorch)
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: `http://localhost:8000/docs`

### 2. Mobile App (Expo / React Native)
```bash
cd mobile
npm install --legacy-peer-deps

# Start Expo development server:
npx expo start

# Run on Web Preview:
npm run web

# Run on Android Simulator or iOS:
npm run android
npm run ios
```

---

## 🔒 Security & Data Compliance
- Strict Auth Wall via JWT (HS256) and salted bcrypt password hashing.
- Encrypted local session storage with fallback offline mode for intermittent connectivity.

---

## 👥 Built with Pride for Hackathon 2026
*Protecting millions of lungs across northern plains and metropolitan corridors through radical air transparency.*
