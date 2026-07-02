from enum import Enum
from pydantic import BaseModel, Field


class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"


class ActivityLevel(str, Enum):
    sedentary = "sedentary"
    light = "light"
    moderate = "moderate"
    active = "active"
    athlete = "athlete"


class ProfileUpdateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    age: int = Field(ge=10, le=120)
    gender: Gender
    height_cm: float = Field(gt=50, lt=272)
    weight_kg: float = Field(gt=20, lt=400)
    activity_level: ActivityLevel


class ProfileResponse(BaseModel):
    id: str
    email: str | None
    name: str | None
    avatar_url: str | None
    age: int | None
    gender: Gender | None
    height_cm: float | None
    weight_kg: float | None
    activity_level: ActivityLevel | None
    bmr: float | None = None
    tdee: float | None = None
    bmi: float | None = None
    bmi_category: str | None = None
    calories_needed: float | None = None
    protein_needed_g: float | None = None
    carbs_needed_g: float | None = None
    fat_needed_g: float | None = None
    fiber_needed_g: float | None = None
    water_needed_ml: float | None = None
