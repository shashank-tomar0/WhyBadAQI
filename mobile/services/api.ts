import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Dynamically select backend endpoint:
// - Android Emulator: 10.0.2.2:8000
// - iOS / Web / Desktop: localhost:8000
const DEV_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000/api/v1' : 'http://localhost:8000/api/v1';
const BASE_URL = DEV_API_URL;

const TOKEN_KEY = 'whybadaqi_auth_token';
const USER_KEY = 'whybadaqi_user_profile';

export interface User {
  id: string;
  name: string;
  email: string;
  ward: string;
}

export interface AttributionBreakdown {
  stubble: number;
  traffic: number;
  dust: number;
  industry: number;
}

export interface WindData {
  speed_kmh: number;
  direction_deg: number;
  cardinal: string;
}

export interface LiveAttributionData {
  timestamp: string;
  selected_time_offset: number;
  center: { latitude: number; longitude: number };
  aqi: number;
  pm25: number;
  exposure_score: number;
  health_grade: string;
  health_color: string;
  exposure_advice: string;
  attribution: {
    aqi: number;
    pm25: number;
    dominant_source: string;
    dominant_share: number;
    breakdown: AttributionBreakdown;
    wind: WindData;
    explanation: string;
    timeline: Array<{ time: string; event: string }>;
  };
  forecast_24h: Array<{
    hour_offset: number;
    timestamp: string;
    iso_time: string;
    aqi: number;
    health_grade: string;
  }>;
  hotspots: Array<{
    id: string;
    type: string;
    name: string;
    latitude: number;
    longitude: number;
    intensity: string;
    color: string;
    distance_km: number;
    pm25_contribution: string;
  }>;
  heatmap_points: Array<{
    latitude: number;
    longitude: number;
    weight: number;
    dominant_source: string;
    color: string;
  }>;
}

export interface ExposureScoreData {
  user_id: string;
  user_name: string;
  ward: string;
  daily_exposure_score: number;
  score_label: string;
  streak_days: number;
  commute_comparison: {
    headline: string;
    default_route: { name: string; pm25_dose: number; duration_mins: number };
    cleanest_route: { name: string; pm25_dose: number; duration_mins: number; reduction: string };
  };
  weekly_history: Array<{ day: string; score: number }>;
  badges: Array<{
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    icon: string;
  }>;
}

export interface ActionCard {
  id: string;
  title: string;
  category: string;
  urgency_color: string;
  reason: string;
  duration: string;
  expected_impact: string;
  icon: string;
  share_text: string;
  reminder_time: string;
}

export interface CommunityReport {
  id: string;
  user_id: string;
  user_name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  photo_url: string;
  trust_badge: string;
  upvotes: number;
  created_at: string;
}

export interface LeaderboardData {
  ward: string;
  top_reporters: Array<{
    rank: number;
    name: string;
    reports_count: number;
    streak: number;
    badge: string;
  }>;
  user_stats: {
    current_rank: number;
    weekly_reports: number;
    streak_days: number;
  };
}

// Token helper methods
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = async (token: string, user: User): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredAuth = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
};

export const getStoredUser = async (): Promise<User | null> => {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Generic authenticated fetcher with fallback simulation
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    if (res.ok) {
      return await res.json();
    }
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || `HTTP Error ${res.status}`);
  } catch (error) {
    // Graceful offline/demo mock fallback so UI never breaks
    console.warn(`[WhyBadAQI API Fallback] ${endpoint}:`, error);
    return getOfflineMock<T>(endpoint, options);
  }
}

// High-fidelity fallback simulator for offline / demo mode
function getOfflineMock<T>(endpoint: string, options: RequestInit): T {
  if (endpoint.includes('/attribution/live')) {
    return {
      timestamp: new Date().toISOString(),
      selected_time_offset: 0,
      center: { latitude: 28.6139, longitude: 77.2090 },
      aqi: 312,
      pm25: 148.6,
      exposure_score: 42,
      health_grade: "Severe Pollution",
      health_color: "#E74C3C",
      exposure_advice: "Avoid outdoor activity; run air purifier",
      attribution: {
        aqi: 312,
        pm25: 148.6,
        dominant_source: "Stubble Burning",
        dominant_share: 54.2,
        breakdown: { stubble: 54.2, traffic: 24.8, dust: 12.1, industry: 8.9 },
        wind: { speed_kmh: 14.5, direction_deg: 315, cardinal: "NW" },
        explanation: "Smoke from Haryana farm fires is blowing in on NW winds (14.5 km/h), contributing 54.2% of local PM2.5.",
        timeline: [
          { time: "3h ago", event: "Traffic rush was dominant (46%), stubble was minimal (14%)" },
          { time: "1h ago", event: "NW wind shift picked up smoke plumes from upwind fires" },
          { time: "Now", event: "Stubble fires dominant (54.2%), combined with corridor congestion" },
          { time: "+3h forecast", event: "Inversion layer will trap emissions, AQI peak expected around 9 PM" }
        ]
      },
      forecast_24h: Array.from({ length: 25 }, (_, i) => ({
        hour_offset: i,
        timestamp: `${((new Date().getHours() + i) % 12) || 12}:00 ${((new Date().getHours() + i) % 24) >= 12 ? 'PM' : 'AM'}`,
        iso_time: new Date(Date.now() + i * 3600000).toISOString(),
        aqi: Math.min(480, Math.max(160, Math.round(312 + 60 * Math.sin(i / 3.5)))),
        health_grade: "Very Poor (Red)"
      })),
      hotspots: [
        { id: "fire-1", type: "stubble", name: "Active Stubble Burn Cluster", latitude: 28.6659, longitude: 77.1610, intensity: "High (Pulsing)", color: "#FF6B35", distance_km: 6.8, pm25_contribution: "48 µg/m³" },
        { id: "traffic-1", type: "traffic", name: "Ring Road Arterial Congestion", latitude: 28.5959, longitude: 77.2300, intensity: "Heavy", color: "#0077B6", distance_km: 2.4, pm25_contribution: "32 µg/m³" },
        { id: "dust-1", type: "dust", name: "Metro Extension Construction Site", latitude: 28.6389, longitude: 77.2440, intensity: "Moderate", color: "#D4A373", distance_km: 3.9, pm25_contribution: "19 µg/m³" },
        { id: "industry-1", type: "industry", name: "Manufacturing Complex Plume", latitude: 28.5519, longitude: 77.1700, intensity: "Continuous", color: "#7209B7", distance_km: 7.5, pm25_contribution: "25 µg/m³" }
      ],
      heatmap_points: [
        { latitude: 28.62, longitude: 77.20, weight: 0.85, dominant_source: "stubble", color: "#FF6B35" },
        { latitude: 28.61, longitude: 77.21, weight: 0.70, dominant_source: "traffic", color: "#0077B6" },
        { latitude: 28.60, longitude: 77.22, weight: 0.65, dominant_source: "dust", color: "#D4A373" },
        { latitude: 28.59, longitude: 77.19, weight: 0.75, dominant_source: "industry", color: "#7209B7" }
      ]
    } as unknown as T;
  }

  if (endpoint.includes('/exposure/score')) {
    return {
      user_id: "demo-usr-1",
      user_name: "Demo Environmentalist",
      ward: "Ward 45 (Central)",
      daily_exposure_score: 78.5,
      score_label: "Good Exposure Control",
      streak_days: 4,
      commute_comparison: {
        headline: "Your commute = 18% more PM2.5 than cleanest route",
        default_route: { name: "Highway / Ring Corridor", pm25_dose: 84, duration_mins: 34 },
        cleanest_route: { name: "Green Belt Boulevard", pm25_dose: 69, duration_mins: 38, reduction: "18% cleaner" }
      },
      weekly_history: [
        { day: "Mon", score: 82 },
        { day: "Tue", score: 79 },
        { day: "Wed", score: 75 },
        { day: "Thu", score: 88 },
        { day: "Fri", score: 76 },
        { day: "Sat", score: 71 },
        { day: "Sun", score: 84 }
      ],
      badges: [
        { id: "b1", title: "Clean Air Champion", description: "Maintained 3+ days in low exposure zones", unlocked: true, icon: "award" },
        { id: "b2", title: "Route Optimizer", description: "Picked the greenest commute corridor", unlocked: true, icon: "navigation" },
        { id: "b3", title: "Early Warner", description: "Shared smoke alerts with neighbors", unlocked: false, icon: "bell" },
        { id: "b4", title: "Stubble Sentinel", description: "Submitted a photo-verified field burning report", unlocked: true, icon: "shield-check" }
      ]
    } as unknown as T;
  }

  if (endpoint.includes('/actions')) {
    return {
      cards: [
        {
          id: "action-1",
          title: "Cancel Outdoor Sports (4–7 PM)",
          category: "High Urgency",
          urgency_color: "#E63946",
          reason: "NW stubble smoke plume intersects evening peak rush hour",
          duration: "Next 3 hours",
          expected_impact: "Prevents 42% spike in inhaled PM2.5 lung dose",
          icon: "activity",
          share_text: "⚠️ WhyBadAQI Alert: AQI set to peak between 4-7 PM due to incoming stubble smoke. Cancel evening outdoor sports and keep kids indoors!",
          reminder_time: "16:00"
        },
        {
          id: "action-2",
          title: "Close Windows & Run Purifier (High Fan)",
          category: "Home Defense",
          urgency_color: "#F4A261",
          reason: "Nighttime temperature inversion will trap ground particulates",
          duration: "7 PM – 8 AM",
          expected_impact: "Maintains indoor PM2.5 below 25 µg/m³",
          icon: "shield",
          share_text: "WhyBadAQI: Temperature inversion tonight will trap smog. Seal windows and switch your air purifier to high before 8 PM.",
          reminder_time: "19:00"
        },
        {
          id: "action-3",
          title: "Divert Commute: Avoid Outer Ring Road",
          category: "Commute Optimizer",
          urgency_color: "#2A9D8F",
          reason: "Heavy diesel truck bottleneck causing micro-smog zone",
          duration: "Evening commute",
          expected_impact: "Saves 18% PM2.5 exposure via Green Belt Boulevard",
          icon: "map-pin",
          share_text: "WhyBadAQI Commute Tip: Ring Road pollution is 2.4x higher right now. Take Green Belt Boulevard to cut toxic exposure by 18%.",
          reminder_time: "17:30"
        },
        {
          id: "action-4",
          title: "Wear N95 Mask for Walk",
          category: "Personal Shield",
          urgency_color: "#E76F51",
          reason: "Construction dust & coarse PM10 elevated near Sector 45",
          duration: "All day",
          expected_impact: "Filters 95% of airborne toxic particles",
          icon: "heart",
          share_text: "WhyBadAQI: Air quality in our sector is currently unhealthy. Wear an N95 mask if stepping out today.",
          reminder_time: "08:00"
        }
      ]
    } as unknown as T;
  }

  if (endpoint.includes('/community/reports')) {
    return [
      {
        id: "rep-1",
        user_id: "usr-delhi-1",
        user_name: "Arjun Sharma",
        category: "Open Garbage Fire",
        description: "Dense toxic smoke billowing behind Sector 45 vacant plot.",
        latitude: 28.6189,
        longitude: 77.2120,
        photo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600",
        trust_badge: "GPS & Timestamp Verified",
        upvotes: 14,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "rep-2",
        user_id: "usr-delhi-2",
        user_name: "Priya Nair",
        category: "Uncovered Construction Dust",
        description: "Truck dumping loose dry cement without mandatory water misting.",
        latitude: 28.6110,
        longitude: 77.2050,
        photo_url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600",
        trust_badge: "GPS & Timestamp Verified",
        upvotes: 9,
        created_at: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ] as unknown as T;
  }

  if (endpoint.includes('/community/leaderboard')) {
    return {
      ward: "Ward 45 (Central)",
      top_reporters: [
        { rank: 1, name: "Arjun Sharma", reports_count: 14, streak: 7, badge: "Ward Guardian" },
        { rank: 2, name: "Priya Nair", reports_count: 9, streak: 5, badge: "Sentinel Pro" },
        { rank: 3, name: "You (Clean Air Hero)", reports_count: 4, streak: 3, badge: "Clean Air Pioneer" },
        { rank: 4, name: "Vikram Seth", reports_count: 3, streak: 2, badge: "Early Warner" },
        { rank: 5, name: "Rohan Mehra", reports_count: 2, streak: 1, badge: "Observer" }
      ],
      user_stats: { current_rank: 3, weekly_reports: 4, streak_days: 3 }
    } as unknown as T;
  }

  return {} as T;
}

// Exported high-level API methods
export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string; ward?: string }) =>
    apiRequest<{ access_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => apiRequest<User>('/auth/me'),

  // Attribution & Map
  getLiveAttribution: (lat: number = 28.6139, lon: number = 77.2090, timeOffset: number = 0) =>
    apiRequest<LiveAttributionData>(`/attribution/live?lat=${lat}&lon=${lon}&time_offset=${timeOffset}`),

  // Exposure
  getExposureScore: () => apiRequest<ExposureScoreData>('/exposure/score'),

  // Actions
  getActionCards: () => apiRequest<{ cards: ActionCard[] }>('/actions/'),

  // Community
  getCommunityReports: () => apiRequest<CommunityReport[]>('/community/reports'),

  createReport: (data: { category: string; description: string; latitude: number; longitude: number; photo_url?: string }) =>
    apiRequest<{ id: string; message: string; trust_badge: string }>('/community/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getLeaderboard: () => apiRequest<LeaderboardData>('/community/leaderboard'),
};
