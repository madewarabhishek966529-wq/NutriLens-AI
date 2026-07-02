from app.schemas.profile import ActivityLevel, Gender

ACTIVITY_MULTIPLIERS = {
    ActivityLevel.sedentary: 1.2,
    ActivityLevel.light: 1.375,
    ActivityLevel.moderate: 1.55,
    ActivityLevel.active: 1.725,
    ActivityLevel.athlete: 1.9,
}


def calculate_bmr(weight_kg: float, height_cm: float, age: int, gender: Gender) -> float:
    """Mifflin-St Jeor Equation."""
    base = 10 * weight_kg + 6.25 * height_cm - 5 * age
    if gender == Gender.male:
        return base + 5
    if gender == Gender.female:
        return base - 161
    # Non-binary / other: use the average of the male/female offsets
    return base - 78


def calculate_tdee(bmr: float, activity_level: ActivityLevel) -> float:
    return bmr * ACTIVITY_MULTIPLIERS[activity_level]


def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    height_m = height_cm / 100
    return round(weight_kg / (height_m**2), 1)


def bmi_category(bmi: float) -> str:
    if bmi < 18.5:
        return "Underweight"
    if bmi < 25:
        return "Normal weight"
    if bmi < 30:
        return "Overweight"
    return "Obese"


def calculate_daily_targets(
    weight_kg: float, height_cm: float, age: int, gender: Gender, activity_level: ActivityLevel
) -> dict:
    bmr = calculate_bmr(weight_kg, height_cm, age, gender)
    tdee = calculate_tdee(bmr, activity_level)
    bmi = calculate_bmi(weight_kg, height_cm)

    # Macro split: 30% protein, 40% carbs, 30% fat (evidence-based general target)
    protein_g = round((tdee * 0.30) / 4, 1)
    carbs_g = round((tdee * 0.40) / 4, 1)
    fat_g = round((tdee * 0.30) / 9, 1)
    fiber_g = round(min(38, max(25, tdee / 1000 * 14)), 1)  # ~14g per 1000 kcal
    water_ml = round(weight_kg * 35, 0)  # 35ml per kg body weight

    return {
        "bmr": round(bmr, 0),
        "tdee": round(tdee, 0),
        "bmi": bmi,
        "bmi_category": bmi_category(bmi),
        "calories_needed": round(tdee, 0),
        "protein_needed_g": protein_g,
        "carbs_needed_g": carbs_g,
        "fat_needed_g": fat_g,
        "fiber_needed_g": fiber_g,
        "water_needed_ml": water_ml,
    }
