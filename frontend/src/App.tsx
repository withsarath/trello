import { Routes, Route, Navigate } from "react-router-dom";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { BoardListPage } from "./pages/BoardListPage";
import { BoardPage } from "./pages/BoardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/boards" replace />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/boards"
        element={
          <ProtectedRoute>
            <Layout>
              <BoardListPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/boards/:boardId"
        element={
          <ProtectedRoute>
            <Layout>
              <BoardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/boards" replace />} />
    </Routes>
  );
}
