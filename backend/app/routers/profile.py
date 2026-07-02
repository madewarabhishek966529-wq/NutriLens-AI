from fastapi import APIRouter, Depends, HTTPException

from app.core.security import CurrentUser, get_current_user
from app.schemas.profile import ProfileResponse, ProfileUpdateRequest
from app.services.nutrition_calc import calculate_daily_targets
from app.services.supabase_service import get_supabase

router = APIRouter(prefix="/api/profile", tags=["profile"])


def _build_response(user: CurrentUser, row: dict | None) -> ProfileResponse:
    row = row or {}
    targets = {}
    if row.get("weight_kg") and row.get("height_cm") and row.get("age") and row.get("gender"):
        targets = calculate_daily_targets(
            weight_kg=row["weight_kg"],
            height_cm=row["height_cm"],
            age=row["age"],
            gender=row["gender"],
            activity_level=row.get("activity_level", "sedentary"),
        )
    return ProfileResponse(
        id=user.id,
        email=user.email,
        name=row.get("name") or user.name,
        avatar_url=row.get("avatar_url") or user.avatar_url,
        age=row.get("age"),
        gender=row.get("gender"),
        height_cm=row.get("height_cm"),
        weight_kg=row.get("weight_kg"),
        activity_level=row.get("activity_level"),
        **targets,
    )


@router.get("", response_model=ProfileResponse)
def get_profile(user: CurrentUser = Depends(get_current_user)):
    supabase = get_supabase()
    result = supabase.table("profiles").select("*").eq("id", user.id).maybe_single().execute()
    return _build_response(user, result.data if result else None)


@router.put("", response_model=ProfileResponse)
def update_profile(payload: ProfileUpdateRequest, user: CurrentUser = Depends(get_current_user)):
    supabase = get_supabase()
    data = payload.model_dump()
    data["id"] = user.id
    data["email"] = user.email
    data["avatar_url"] = user.avatar_url
    try:
        supabase.table("profiles").upsert(data).execute()
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail="Could not save profile.") from exc

    result = supabase.table("profiles").select("*").eq("id", user.id).maybe_single().execute()
    return _build_response(user, result.data if result else None)
