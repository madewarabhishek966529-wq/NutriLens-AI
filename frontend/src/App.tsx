import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import AboutPage from "@/pages/AboutPage";
import DashboardPage from "@/pages/DashboardPage";
import UploadFoodPage from "@/pages/UploadFoodPage";
import TextAnalysisPage from "@/pages/TextAnalysisPage";
import HistoryPage from "@/pages/HistoryPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import WeightTrackerPage from "@/pages/WeightTrackerPage";
import WaterTrackerPage from "@/pages/WaterTrackerPage";
import SettingsPage from "@/pages/SettingsPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<AboutPage />} />

      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadFoodPage />} />
        <Route path="/analyze" element={<TextAnalysisPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/weight" element={<WeightTrackerPage />} />
        <Route path="/water" element={<WaterTrackerPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
