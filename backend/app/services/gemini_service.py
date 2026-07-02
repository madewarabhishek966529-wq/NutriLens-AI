import base64
import json
import re
from typing import Any

import google.generativeai as genai

from app.core.config import get_settings

settings = get_settings()
genai.configure(api_key=settings.gemini_api_key)

NUTRITION_JSON_SCHEMA_PROMPT = """
You are a clinical nutrition reasoning engine. You do NOT look anything up in a
food database. You estimate nutrition purely from your own knowledge of food
science, typical recipes, ingredient composition, and portion sizes.

Respond with ONLY a single valid JSON object — no markdown fences, no preamble,
no commentary. Use this exact shape:

{
  "food_name": string,
  "description": string (1-2 sentences describing what you identified),
  "ingredients": string[] (likely ingredients, empty array if truly unknown),
  "estimated_weight_g": number,
  "serving_size": string (human readable, e.g. "1 medium bowl (~250g)"),
  "calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,
  "fiber_g": number,
  "sugar_g": number,
  "sodium_mg": number,
  "potassium_mg": number,
  "calcium_mg": number,
  "iron_mg": number,
  "vitamins": {
    "A_percent_dv": number, "B_percent_dv": number, "C_percent_dv": number,
    "D_percent_dv": number, "E_percent_dv": number, "K_percent_dv": number
  },
  "water_content_percent": number,
  "glycemic_index_estimate": number,
  "health_score": number (0-100),
  "is_healthy": boolean,
  "benefits": string[],
  "disadvantages": string[],
  "best_time_to_eat": string,
  "recommended_quantity": string,
  "meal_type": "breakfast" | "lunch" | "dinner" | "snack",
  "confidence": number (0-1, your confidence in this estimate)
}

Rules:
- Never say you cannot estimate. Always give your best scientific estimate.
- All numeric fields must be plain numbers (no units, no ranges — pick a midpoint).
- Base portion assumptions on what is visible/described; state assumptions in "description".
- Do not wrap the JSON in backticks.
"""


def _extract_json(raw_text: str) -> dict[str, Any]:
    cleaned = raw_text.strip()
    cleaned = re.sub(r"^```json|^```|```$", "", cleaned, flags=re.MULTILINE).strip()
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if not match:
        raise ValueError("Gemini response did not contain valid JSON")
    return json.loads(match.group(0))


def analyze_food_image(image_bytes: bytes, mime_type: str, user_note: str = "") -> dict[str, Any]:
    model = genai.GenerativeModel(settings.gemini_vision_model)
    image_part = {"mime_type": mime_type, "data": base64.b64encode(image_bytes).decode()}
    prompt = NUTRITION_JSON_SCHEMA_PROMPT
    if user_note:
        prompt += f"\n\nAdditional context from the user: {user_note}"
    response = model.generate_content(
        [prompt, {"inline_data": image_part}],
        generation_config={"temperature": 0.3},
    )
    return _extract_json(response.text)


def analyze_food_text(food_description: str) -> dict[str, Any]:
    model = genai.GenerativeModel(settings.gemini_text_model)
    prompt = (
        NUTRITION_JSON_SCHEMA_PROMPT
        + f"\n\nAnalyze this food description exactly as given, respecting any "
        f"quantities or units mentioned: \"{food_description}\""
    )
    response = model.generate_content(prompt, generation_config={"temperature": 0.3})
    return _extract_json(response.text)


def generate_ai_suggestions(summary: dict[str, Any]) -> dict[str, Any]:
    """Given a rollup of the user's recent nutrition history, ask Gemini for
    personalized, actionable suggestions. No fixed rule tables — pure LLM reasoning.
    """
    model = genai.GenerativeModel(settings.gemini_text_model)
    prompt = f"""
You are a supportive, evidence-based nutrition coach. Given this JSON summary of a
user's last 7 days of logged nutrition, respond with ONLY a JSON object (no
markdown fences) shaped like:

{{
  "headline": string (one encouraging, specific sentence),
  "foods_to_increase_protein": string[],
  "foods_to_increase_fiber": string[],
  "foods_to_reduce_calories": string[],
  "healthy_alternatives": [{{ "instead_of": string, "try": string, "why": string }}],
  "meal_suggestions": [{{ "meal_type": string, "suggestion": string }}],
  "daily_tip": string
}}

User's last 7 days summary:
{json.dumps(summary)}
"""
    response = model.generate_content(prompt, generation_config={"temperature": 0.5})
    return _extract_json(response.text)
