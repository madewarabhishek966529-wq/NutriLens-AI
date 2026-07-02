export type Gender = "male" | "female" | "other";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "athlete";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  age: number | null;
  gender: Gender | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: ActivityLevel | null;
  bmr: number | null;
  tdee: number | null;
  bmi: number | null;
  bmi_category: string | null;
  calories_needed: number | null;
  protein_needed_g: number | null;
  carbs_needed_g: number | null;
  fat_needed_g: number | null;
  fiber_needed_g: number | null;
  water_needed_ml: number | null;
}

export interface FoodAnalysisResult {
  food_name: string;
  description: string;
  ingredients: string[];
  estimated_weight_g: number;
  serving_size: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  potassium_mg: number;
  calcium_mg: number;
  iron_mg: number;
  vitamins: Record<string, number>;
  water_content_percent: number;
  glycemic_index_estimate: number;
  health_score: number;
  is_healthy: boolean;
  benefits: string[];
  disadvantages: string[];
  best_time_to_eat: string;
  recommended_quantity: string;
  meal_type: MealType;
  confidence: number;
}

export interface FoodLog {
  id: string;
  user_id: string;
  food_name: string;
  meal_type: MealType;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  weight_g: number;
  image_url: string | null;
  notes: string | null;
  raw_analysis: FoodAnalysisResult;
  logged_at: string;
  created_at: string;
}

export interface WaterLog {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
}

export interface WeightLog {
  id: string;
  user_id: string;
  weight_kg: number;
  logged_date: string;
  notes: string | null;
}

export interface DashboardSummary {
  today: {
    calories?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    fiber_g?: number;
  };
  water_intake_ml: number;
  recent_foods: FoodLog[];
}

export interface TrendPoint {
  date: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
}

export interface TrendsResponse {
  series: TrendPoint[];
  macro_distribution: { protein_g: number; carbs_g: number; fat_g: number };
  weekly_avg_calories: number;
  days_logged: number;
}

export interface AISuggestions {
  headline: string;
  foods_to_increase_protein: string[];
  foods_to_increase_fiber: string[];
  foods_to_reduce_calories: string[];
  healthy_alternatives: { instead_of: string; try: string; why: string }[];
  meal_suggestions: { meal_type: string; suggestion: string }[];
  daily_tip: string;
}
