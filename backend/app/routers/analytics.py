from collections import defaultdict
from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends

from app.core.security import CurrentUser, get_current_user
from app.services.supabase_service import get_supabase

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


def _daterange_logs(user_id: str, days: int):
    supabase = get_supabase()
    start = (date.today() - timedelta(days=days - 1)).isoformat()
    result = (
        supabase.table("food_logs")
        .select("*")
        .eq("user_id", user_id)
        .gte("logged_at", f"{start}T00:00:00")
        .execute()
    )
    return result.data


@router.get("/dashboard")
def dashboard_summary(user: CurrentUser = Depends(get_current_user)):
    supabase = get_supabase()
    today = date.today().isoformat()

    today_logs = (
        supabase.table("food_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("logged_at", f"{today}T00:00:00")
        .execute()
        .data
    )
    water_today = (
        supabase.table("water_logs")
        .select("amount_ml")
        .eq("user_id", user.id)
        .gte("logged_at", f"{today}T00:00:00")
        .execute()
        .data
    )
    recent = (
        supabase.table("food_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("logged_at", desc=True)
        .limit(6)
        .execute()
        .data
    )

    totals = defaultdict(float)
    for log in today_logs:
        totals["calories"] += log.get("calories", 0)
        totals["protein_g"] += log.get("protein_g", 0)
        totals["carbs_g"] += log.get("carbs_g", 0)
        totals["fat_g"] += log.get("fat_g", 0)
        totals["fiber_g"] += log.get("fiber_g", 0)

    return {
        "today": dict(totals),
        "water_intake_ml": sum(w["amount_ml"] for w in water_today),
        "recent_foods": recent,
    }


@router.get("/trends")
def trends(days: int = 30, user: CurrentUser = Depends(get_current_user)):
    logs = _daterange_logs(user.id, days)
    by_day: dict[str, dict] = defaultdict(lambda: defaultdict(float))
    for log in logs:
        day = log["logged_at"][:10]
        by_day[day]["calories"] += log.get("calories", 0)
        by_day[day]["protein_g"] += log.get("protein_g", 0)
        by_day[day]["carbs_g"] += log.get("carbs_g", 0)
        by_day[day]["fat_g"] += log.get("fat_g", 0)
        by_day[day]["fiber_g"] += log.get("fiber_g", 0)

    series = [{"date": d, **vals} for d, vals in sorted(by_day.items())]

    macro_totals = defaultdict(float)
    for log in logs:
        macro_totals["protein_g"] += log.get("protein_g", 0)
        macro_totals["carbs_g"] += log.get("carbs_g", 0)
        macro_totals["fat_g"] += log.get("fat_g", 0)

    weekly_avg_calories = (sum(s["calories"] for s in series) / len(series)) if series else 0

    return {
        "series": series,
        "macro_distribution": dict(macro_totals),
        "weekly_avg_calories": round(weekly_avg_calories, 1),
        "days_logged": len(series),
    }
