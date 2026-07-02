import { apiClient } from "./apiClient";
import type {
  AISuggestions,
  DashboardSummary,
  Profile,
  TrendsResponse,
  WaterLog,
  WeightLog,
} from "@/types";

// Profile
export async function getProfile(): Promise<Profile> {
  const { data } = await apiClient.get<Profile>("/api/profile");
  return data;
}

export async function updateProfile(payload: Partial<Profile>): Promise<Profile> {
  const { data } = await apiClient.put<Profile>("/api/profile", payload);
  return data;
}

// Water
export async function logWater(amount_ml: number): Promise<WaterLog> {
  const { data } = await apiClient.post<WaterLog>("/api/water", { amount_ml });
  return data;
}

export async function getTodayWater(): Promise<{ date: string; total_ml: number }> {
  const { data } = await apiClient.get("/api/water/today");
  return data;
}

// Weight
export async function logWeight(weight_kg: number, notes?: string): Promise<WeightLog> {
  const { data } = await apiClient.post<WeightLog>("/api/weight", { weight_kg, notes });
  return data;
}

export async function listWeightLogs(): Promise<WeightLog[]> {
  const { data } = await apiClient.get<WeightLog[]>("/api/weight");
  return data;
}

// Analytics
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>("/api/analytics/dashboard");
  return data;
}

export async function getTrends(days = 30): Promise<TrendsResponse> {
  const { data } = await apiClient.get<TrendsResponse>("/api/analytics/trends", { params: { days } });
  return data;
}

// AI Suggestions
export async function getAISuggestions(): Promise<AISuggestions> {
  const { data } = await apiClient.get<AISuggestions>("/api/suggestions");
  return data;
}

// Export
export function exportCsvUrl() {
  return `${apiClient.defaults.baseURL}/api/export/csv`;
}
export function exportPdfUrl() {
  return `${apiClient.defaults.baseURL}/api/export/pdf`;
}
