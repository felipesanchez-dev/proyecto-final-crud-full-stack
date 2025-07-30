import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import SurveyDetailPage from "./pages/SurveyDetailPage";
import SurveyFormPage from "./pages/SurveyFormPage";
import QuestionFormPage from "./pages/QuestionFormPage";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/surveys/:id" element={<SurveyDetailPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/surveys/new" element={<SurveyFormPage />} />
          <Route path="/admin/surveys/edit/:id" element={<SurveyFormPage />} />

          <Route
            path="/admin/surveys/:idEncuesta/questions/new"
            element={<QuestionFormPage />}
          />
          <Route
            path="/admin/surveys/:idEncuesta/questions/edit/:questionId"
            element={<QuestionFormPage />}
          />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
  );
}

export default App;
