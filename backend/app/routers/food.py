import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.core.security import CurrentUser, get_current_user
from app.schemas.food import (
    FoodAnalysisResult,
    FoodLogResponse,
    SaveFoodLogRequest,
    TextAnalysisRequest,
    UpdateFoodLogRequest,
)
from app.services import gemini_service
from app.services.supabase_service import get_supabase

router = APIRouter(prefix="/api/food", tags=["food"])

MAX_IMAGE_BYTES = 8 * 1024 * 1024  # 8MB
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic"}


@router.post("/analyze/image", response_model=FoodAnalysisResult)
async def analyze_image(
    file: UploadFile = File(...),
    note: str = Form(""),
    user: CurrentUser = Depends(get_current_user),
):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image type. Use JPEG, PNG, WEBP, or HEIC.")

    image_bytes = await file.read()
    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=400, detail="Image too large. Max size is 8MB.")

    try:
        result = gemini_service.analyze_food_image(image_bytes, file.content_type, note)
        return FoodAnalysisResult(**result)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {exc}") from exc


@router.post("/analyze/text", response_model=FoodAnalysisResult)
def analyze_text(payload: TextAnalysisRequest, user: CurrentUser = Depends(get_current_user)):
    try:
        result = gemini_service.analyze_food_text(payload.food_description)
        if payload.meal_type:
            result["meal_type"] = payload.meal_type
        return FoodAnalysisResult(**result)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {exc}") from exc


@router.post("/log", response_model=FoodLogResponse)
def save_food_log(payload: SaveFoodLogRequest, user: CurrentUser = Depends(get_current_user)):
    supabase = get_supabase()
    analysis = payload.analysis
    logged_at = payload.logged_at or datetime.now(timezone.utc)

    row = {
        "id": str(uuid.uuid4()),
        "user_id": user.id,
        "food_name": analysis.food_name,
        "meal_type": payload.meal_type,
        "calories": analysis.calories,
        "protein_g": analysis.protein_g,
        "carbs_g": analysis.carbs_g,
        "fat_g": analysis.fat_g,
        "fiber_g": analysis.fiber_g,
        "weight_g": analysis.estimated_weight_g,
        "image_url": payload.image_url,
        "notes": payload.notes,
        "raw_analysis": analysis.model_dump(),
        "logged_at": logged_at.isoformat(),
    }
    result = supabase.table("food_logs").insert(row).execute()
    return result.data[0]


@router.get("/logs", response_model=list[FoodLogResponse])
def list_food_logs(
    start_date: str | None = None,
    end_date: str | None = None,
    meal_type: str | None = None,
    search: str | None = None,
    limit: int = 100,
    user: CurrentUser = Depends(get_current_user),
):
    supabase = get_supabase()
    query = supabase.table("food_logs").select("*").eq("user_id", user.id)
    if start_date:
        query = query.gte("logged_at", start_date)
    if end_date:
        query = query.lte("logged_at", end_date)
    if meal_type:
        query = query.eq("meal_type", meal_type)
    if search:
        query = query.ilike("food_name", f"%{search}%")
    result = query.order("logged_at", desc=True).limit(limit).execute()
    return result.data


@router.patch("/logs/{log_id}", response_model=FoodLogResponse)
def update_food_log(log_id: str, payload: UpdateFoodLogRequest, user: CurrentUser = Depends(get_current_user)):
    supabase = get_supabase()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update.")
    result = (
        supabase.table("food_logs").update(updates).eq("id", log_id).eq("user_id", user.id).execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Food log not found.")
    return result.data[0]


@router.delete("/logs/{log_id}")
def delete_food_log(log_id: str, user: CurrentUser = Depends(get_current_user)):
    supabase = get_supabase()
    result = supabase.table("food_logs").delete().eq("id", log_id).eq("user_id", user.id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Food log not found.")
    return {"deleted": True, "id": log_id}
