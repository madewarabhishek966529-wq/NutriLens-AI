import uuid
from datetime import date

from fastapi import APIRouter, Depends, HTTPException

from app.core.security import CurrentUser, get_current_user
from app.schemas.tracking import WeightLogRequest, WeightLogResponse
from app.services.supabase_service import get_supabase

router = APIRouter(prefix="/api/weight", tags=["weight"])


@router.post("", response_model=WeightLogResponse)
def log_weight(payload: WeightLogRequest, user: CurrentUser = Depends(get_current_user)):
    supabase = get_supabase()
    logged_date = (payload.logged_date or date.today()).isoformat()
    row = {
        "id": str(uuid.uuid4()),
        "user_id": user.id,
        "weight_kg": payload.weight_kg,
        "logged_date": logged_date,
        "notes": payload.notes,
    }
    # One entry per day: upsert on (user_id, logged_date)
    result = supabase.table("weight_logs").upsert(row, on_conflict="user_id,logged_date").execute()

    # Keep the live weight on the profile in sync for BMR/TDEE calculations
    supabase.table("profiles").update({"weight_kg": payload.weight_kg}).eq("id", user.id).execute()

    return result.data[0]


@router.get("", response_model=list[WeightLogResponse])
def list_weight_logs(
    start_date: str | None = None, end_date: str | None = None, user: CurrentUser = Depends(get_current_user)
):
    supabase = get_supabase()
    query = supabase.table("weight_logs").select("*").eq("user_id", user.id)
    if start_date:
        query = query.gte("logged_date", start_date)
    if end_date:
        query = query.lte("logged_date", end_date)
    result = query.order("logged_date", desc=False).execute()
    return result.data


@router.delete("/{log_id}")
def delete_weight_log(log_id: str, user: CurrentUser = Depends(get_current_user)):
    supabase = get_supabase()
    result = supabase.table("weight_logs").delete().eq("id", log_id).eq("user_id", user.id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Weight log not found.")
    return {"deleted": True, "id": log_id}
