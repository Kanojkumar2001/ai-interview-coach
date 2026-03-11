import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Users,
  Brain,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Trophy,
  Code2,
} from "lucide-react";
import { useState } from "react";

const candidateLinks = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/candidate" },
  { label: "Video Interview", icon: Video, path: "/dashboard/candidate/interviews" },
  { label: "Text Interview", icon: MessageSquare, path: "/dashboard/candidate/text-interview" },
  { label: "AI Practice", icon: Brain, path: "/dashboard/candidate/practice" },
  { label: "Reports", icon: FileText, path: "/dashboard/candidate/reports" },
  { label: "Analytics", icon: BarChart3, path: "/dashboard/candidate/analytics" },
  { label: "Leaderboard", icon: Trophy, path: "/dashboard/candidate/leaderboard" },
  { label: "Settings", icon: Settings, path: "/dashboard/candidate/settings" },
];

const recruiterLinks = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/recruiter" },
  { label: "Candidates", icon: Users, path: "/dashboard/recruiter/candidates" },
  { label: "Interviews", icon: Video, path: "/dashboard/recruiter/interviews" },
  { label: "Reports", icon: FileText, path: "/dashboard/recruiter/reports" },
  { label: "Analytics", icon: BarChart3, path: "/dashboard/recruiter/analytics" },
  { label: "Settings", icon: Settings, path: "/dashboard/recruiter/settings" },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const links = user?.role === "recruiter" ? recruiterLinks : candidateLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 fixed h-full z-30`}
      >
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
          <Sparkles className="h-7 w-7 text-sidebar-primary flex-shrink-0" />
          {!collapsed && (
            <span className="text-lg font-display font-bold text-sidebar-primary-foreground">
              InterviewAI
            </span>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`sidebar-item ${isActive ? "active" : ""} ${collapsed ? "justify-center px-0" : ""}`}
                title={collapsed ? link.label : undefined}
              >
                <link.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-item w-full justify-center"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
          <div className={`flex items-center gap-3 px-3 py-2 ${collapsed ? "justify-center" : ""}`}>
            <div className="h-9 w-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary text-sm font-bold flex-shrink-0">
              {initials}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-accent-foreground truncate">{user?.fullName}</p>
                <p className="text-xs text-sidebar-foreground capitalize">{user?.role}</p>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="sidebar-item w-full text-destructive">
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}>
        <div className="p-6 lg:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
