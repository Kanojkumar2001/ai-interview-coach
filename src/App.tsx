import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AIVideoInterview from "./pages/AIVideoInterview";
import AITextInterview from "./pages/AITextInterview";
import CodingInterview from "./pages/CodingInterview";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import { ReactNode } from "react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, role }: { children: ReactNode; role?: string }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={`/dashboard/${user.role}`} replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={`/dashboard/${user.role}`} replace /> : <Index />} />
      <Route path="/login" element={user ? <Navigate to={`/dashboard/${user.role}`} replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to={`/dashboard/${user.role}`} replace /> : <Signup />} />
      <Route
        path="/dashboard/candidate"
        element={<ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/candidate/interviews"
        element={<ProtectedRoute role="candidate"><AIVideoInterview /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/candidate/text-interview"
        element={<ProtectedRoute role="candidate"><AITextInterview /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/candidate/reports"
        element={<ProtectedRoute role="candidate"><Reports /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/candidate/analytics"
        element={<ProtectedRoute role="candidate"><Reports /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/candidate/leaderboard"
        element={<ProtectedRoute role="candidate"><Leaderboard /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/candidate/settings"
        element={<ProtectedRoute role="candidate"><Settings /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/recruiter"
        element={<ProtectedRoute role="recruiter"><RecruiterDashboard /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/recruiter/reports"
        element={<ProtectedRoute role="recruiter"><Reports /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/recruiter/analytics"
        element={<ProtectedRoute role="recruiter"><Reports /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/recruiter/settings"
        element={<ProtectedRoute role="recruiter"><Settings /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/admin"
        element={<ProtectedRoute role="admin"><RecruiterDashboard /></ProtectedRoute>}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
