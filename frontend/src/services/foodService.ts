import { apiClient } from "./apiClient";
import type { FoodAnalysisResult, FoodLog, MealType } from "@/types";

export async function analyzeImage(file: File, note = ""): Promise<FoodAnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("note", note);
  const { data } = await apiClient.post<FoodAnalysisResult>("/api/food/analyze/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function analyzeText(food_description: string, meal_type?: MealType): Promise<FoodAnalysisResult> {
  const { data } = await apiClient.post<FoodAnalysisResult>("/api/food/analyze/text", {
    food_description,
    meal_type,
  });
  return data;
}

export async function saveFoodLog(params: {
  analysis: FoodAnalysisResult;
  meal_type: MealType;
  notes?: string;
  image_url?: string;
}): Promise<FoodLog> {
  const { data } = await apiClient.post<FoodLog>("/api/food/log", params);
  return data;
}

export async function listFoodLogs(params: {
  start_date?: string;
  end_date?: string;
  meal_type?: string;
  search?: string;
}): Promise<FoodLog[]> {
  const { data } = await apiClient.get<FoodLog[]>("/api/food/logs", { params });
  return data;
}

export async function updateFoodLog(id: string, updates: Partial<FoodLog>): Promise<FoodLog> {
  const { data } = await apiClient.patch<FoodLog>(`/api/food/logs/${id}`, updates);
  return data;
}

export async function deleteFoodLog(id: string): Promise<void> {
  await apiClient.delete(`/api/food/logs/${id}`);
}
