from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException

from app.core.security import CurrentUser, get_current_user
from app.services import gemini_service
from app.services.supabase_service import get_supabase

router = APIRouter(prefix="/api/suggestions", tags=["suggestions"])


@router.get("")
def get_ai_suggestions(user: CurrentUser = Depends(get_current_user)):
    supabase = get_supabase()
    start = (date.today() - timedelta(days=7)).isoformat()
    logs = (
        supabase.table("food_logs")
        .select("food_name,meal_type,calories,protein_g,carbs_g,fat_g,fiber_g,logged_at")
        .eq("user_id", user.id)
        .gte("logged_at", f"{start}T00:00:00")
        .execute()
        .data
    )

    if not logs:
        return {
            "headline": "Log a few meals this week and I'll tailor suggestions to you.",
            "foods_to_increase_protein": [],
            "foods_to_increase_fiber": [],
            "foods_to_reduce_calories": [],
            "healthy_alternatives": [],
            "meal_suggestions": [],
            "daily_tip": "Consistent logging is the fastest way to see patterns in your diet.",
        }

    summary = {
        "total_entries": len(logs),
        "avg_daily_calories": round(sum(l["calories"] for l in logs) / 7, 1),
        "avg_daily_protein_g": round(sum(l["protein_g"] for l in logs) / 7, 1),
        "avg_daily_fiber_g": round(sum(l["fiber_g"] for l in logs) / 7, 1),
        "foods_logged": [l["food_name"] for l in logs],
    }

    try:
        return gemini_service.generate_ai_suggestions(summary)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Could not generate suggestions: {exc}") from exc
