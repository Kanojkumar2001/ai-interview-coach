import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import ResumeUploadModal from "@/components/ResumeUploadModal";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Video,
  Brain,
  MessageSquare,
  Target,
  Zap,
  Play,
  Upload,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

const performanceData = [
  { name: "Jan", score: 65 },
  { name: "Feb", score: 72 },
  { name: "Mar", score: 68 },
  { name: "Apr", score: 78 },
  { name: "May", score: 82 },
  { name: "Jun", score: 85 },
];

const skillData = [
  { skill: "Technical", value: 82 },
  { skill: "Communication", value: 75 },
  { skill: "Problem Solving", value: 88 },
  { skill: "Confidence", value: 70 },
  { skill: "Body Language", value: 65 },
  { skill: "Clarity", value: 78 },
];

const interviews = [
  { role: "Frontend Developer", mode: "Video", date: "2026-03-05", score: 85, status: "Completed" },
  { role: "Full Stack Engineer", mode: "Text", date: "2026-02-28", score: 72, status: "Reviewed" },
  { role: "React Developer", mode: "Video", date: "2026-02-20", score: 91, status: "Completed" },
  { role: "Software Engineer", mode: "Video", date: "2026-02-14", score: 68, status: "Completed" },
];

const stats = [
  { label: "Interviews Taken", value: "12", icon: Video, change: "+3", up: true },
  { label: "Average Score", value: "78%", icon: Target, change: "+5%", up: true },
  { label: "Best Performance", value: "91%", icon: Zap, change: "+2%", up: true },
  { label: "Confidence Score", value: "70%", icon: Brain, change: "-3%", up: false },
  { label: "Communication", value: "75%", icon: MessageSquare, change: "+8%", up: true },
  { label: "Technical Accuracy", value: "82%", icon: Target, change: "+4%", up: true },
];

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const CandidateDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showResume, setShowResume] = useState(false);

  return (
    <DashboardLayout>
      {/* Welcome */}
      <motion.div {...fadeIn} transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
          Hello, {user?.fullName?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Your interview readiness score is <span className="text-primary font-semibold">78%</span>
        </p>
        <div className="mt-2 inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
          💡 AI Suggestion: Improve technical explanations
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        {...fadeIn}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        {stats.map((stat, i) => (
          <div key={i} className="stat-card flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-display font-bold text-foreground mt-1">{stat.value}</p>
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.up ? "text-success" : "text-destructive"}`}>
                {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.change}
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="stat-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="stat-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Skill Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={skillData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="skill" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Start Interview */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.25 }} className="mb-8">
        <div className="stat-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-semibold text-foreground">Ready for your next interview?</h3>
            <p className="text-sm text-muted-foreground mt-1">Choose your preferred interview mode</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition">
              <Play className="h-4 w-4" /> AI Video Interview
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-secondary transition">
              <MessageSquare className="h-4 w-4" /> Text Interview
            </button>
          </div>
        </div>
      </motion.div>

      {/* Interviews Table */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.3 }}>
        <div className="stat-card overflow-x-auto">
          <h3 className="font-display font-semibold text-foreground mb-4">My Interviews</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Role</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Mode</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Date</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Score</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((iv, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-3 px-2 font-medium text-foreground">{iv.role}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${iv.mode === "Video" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                      {iv.mode}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">{iv.date}</td>
                  <td className="py-3 px-2 font-semibold text-foreground">{iv.score}%</td>
                  <td className="py-3 px-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">{iv.status}</span>
                  </td>
                  <td className="py-3 px-2">
                    <button className="text-xs text-primary hover:underline">View Report</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default CandidateDashboard;
