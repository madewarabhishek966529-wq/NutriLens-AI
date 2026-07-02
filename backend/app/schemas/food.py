from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field


class TextAnalysisRequest(BaseModel):
    food_description: str = Field(min_length=2, max_length=300, examples=["2 boiled eggs"])
    meal_type: str | None = None


class FoodAnalysisResult(BaseModel):
    food_name: str
    description: str
    ingredients: list[str] = []
    estimated_weight_g: float
    serving_size: str
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float
    sugar_g: float
    sodium_mg: float
    potassium_mg: float
    calcium_mg: float
    iron_mg: float
    vitamins: dict[str, float] = {}
    water_content_percent: float
    glycemic_index_estimate: float
    health_score: float
    is_healthy: bool
    benefits: list[str] = []
    disadvantages: list[str] = []
    best_time_to_eat: str
    recommended_quantity: str
    meal_type: str
    confidence: float


class SaveFoodLogRequest(BaseModel):
    analysis: FoodAnalysisResult
    meal_type: str
    notes: str | None = None
    image_url: str | None = None
    logged_at: datetime | None = None


class FoodLogResponse(BaseModel):
    id: str
    user_id: str
    food_name: str
    meal_type: str
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float
    weight_g: float
    image_url: str | None
    notes: str | None
    raw_analysis: dict[str, Any]
    logged_at: datetime
    created_at: datetime


class UpdateFoodLogRequest(BaseModel):
    meal_type: str | None = None
    notes: str | None = None
    calories: float | None = None
    protein_g: float | None = None
    carbs_g: float | None = None
    fat_g: float | None = None
