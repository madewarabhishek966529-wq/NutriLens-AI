from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.core.config import get_settings
from app.routers import auth, food, profile, water, weight, analytics, suggestions, export

settings = get_settings()

limiter = Limiter(key_func=get_remote_address, default_limits=[f"{settings.rate_limit_per_minute}/minute"])

app = FastAPI(
    title="NutriLens AI API",
    description="AI-powered nutrition analysis — no fixed food database, pure LLM/Vision reasoning.",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Something went wrong on our end. Please try again."})


app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(food.router)
app.include_router(water.router)
app.include_router(weight.router)
app.include_router(analytics.router)
app.include_router(suggestions.router)
app.include_router(export.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "NutriLens AI API"}


@app.get("/health")
def health():
    return {"status": "healthy"}
