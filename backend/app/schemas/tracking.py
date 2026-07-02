from datetime import date, datetime
from pydantic import BaseModel, Field


class WaterLogRequest(BaseModel):
    amount_ml: float = Field(gt=0, le=5000)
    logged_at: datetime | None = None


class WaterLogResponse(BaseModel):
    id: str
    user_id: str
    amount_ml: float
    logged_at: datetime


class WeightLogRequest(BaseModel):
    weight_kg: float = Field(gt=20, lt=400)
    logged_date: date | None = None
    notes: str | None = None


class WeightLogResponse(BaseModel):
    id: str
    user_id: str
    weight_kg: float
    logged_date: date
    notes: str | None
