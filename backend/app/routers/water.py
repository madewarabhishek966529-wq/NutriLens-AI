import uuid
from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from app.core.security import CurrentUser, get_current_user
from app.schemas.tracking import WaterLogRequest, WaterLogResponse
from app.services.supabase_service import get_supabase

router = APIRouter(prefix="/api/water", tags=["water"])


@router.post("", response_model=WaterLogResponse)
def log_water(payload: WaterLogRequest, user: CurrentUser = Depends(get_current_user)):
    supabase = get_supabase()
    row = {
        "id": str(uuid.uuid4()),
        "user_id": user.id,
        "amount_ml": payload.amount_ml,
        "logged_at": (payload.logged_at or datetime.now(timezone.utc)).isoformat(),
    }
    result = supabase.table("water_logs").insert(row).execute()
    return result.data[0]


@router.get("/today")
def get_today_water(user: CurrentUser = Depends(get_current_user)):
    supabase = get_supabase()
    today = date.today().isoformat()
    result = (
        supabase.table("water_logs")
        .select("amount_ml")
        .eq("user_id", user.id)
        .gte("logged_at", f"{today}T00:00:00")
        .execute()
    )
    total_ml = sum(r["amount_ml"] for r in result.data)
    return {"date": today, "total_ml": total_ml}


@router.delete("/{log_id}")
def delete_water_log(log_id: str, user: CurrentUser = Depends(get_current_user)):
    supabase = get_supabase()
    result = supabase.table("water_logs").delete().eq("id", log_id).eq("user_id", user.id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Water log not found.")
    return {"deleted": True, "id": log_id}
