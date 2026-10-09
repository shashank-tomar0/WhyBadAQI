from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.api.auth import router as auth_router
from app.api.attribution import router as attribution_router
from app.api.exposure import router as exposure_router
from app.api.actions import router as actions_router
from app.api.community import router as community_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="WhyBadAQI Backend - Real-time hyper-local source attribution, Gaussian dispersion, exposure scoring, and community reporting."
)

# Enable CORS for Expo / React Native and Web previews
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "mode": "Hybrid (Live APIs + ML Surrogate Dispersion Engine)"
    }

# Register API routers under /api/v1
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(attribution_router, prefix=settings.API_V1_STR)
app.include_router(exposure_router, prefix=settings.API_V1_STR)
app.include_router(actions_router, prefix=settings.API_V1_STR)
app.include_router(community_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
