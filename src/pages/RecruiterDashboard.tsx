import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import {
  Users,
  Video,
  Target,
  UserCheck,
  TrendingUp,
  Download,
  Star,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const scoreDistribution = [
  { range: "0-20", count: 2 },
  { range: "21-40", count: 5 },
  { range: "41-60", count: 12 },
  { range: "61-80", count: 25 },
  { range: "81-100", count: 18 },
];

const hiringTrend = [
  { month: "Oct", hires: 3 },
  { month: "Nov", hires: 5 },
  { month: "Dec", hires: 4 },
  { month: "Jan", hires: 7 },
  { month: "Feb", hires: 6 },
  { month: "Mar", hires: 9 },
];

const candidates = [
  { name: "Alex Johnson", role: "Frontend Dev", mode: "Video", score: 85, recommendation: "Strong Hire", probability: 88 },
  { name: "Emily Chen", role: "Backend Dev", mode: "Video", score: 72, recommendation: "Consider", probability: 62 },
  { name: "Michael Brown", role: "Full Stack", mode: "Text", score: 91, recommendation: "Strong Hire", probability: 94 },
  { name: "Sarah Davis", role: "DevOps", mode: "Video", score: 68, recommendation: "No Hire", probability: 35 },
  { name: "James Wilson", role: "ML Engineer", mode: "Video", score: 79, recommendation: "Consider", probability: 70 },
];

const stats = [
  { label: "Total Candidates", value: "156", icon: Users, change: "+12" },
  { label: "Interviews Done", value: "89", icon: Video, change: "+8" },
  { label: "Avg Score", value: "74%", icon: Target, change: "+3%" },
  { label: "Shortlisted", value: "23", icon: UserCheck, change: "+5" },
];

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const RecruiterDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <motion.div {...fadeIn} transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
          Recruiter Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.fullName?.split(" ")[0]}</p>
      </motion.div>

      {/* Stats */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-display font-bold text-foreground mt-1">{stat.value}</p>
              <div className="flex items-center gap-1 mt-2 text-xs font-medium text-success">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="stat-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="stat-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Hiring Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hiringTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
              <Line type="monotone" dataKey="hires" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Candidate Table */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.3 }}>
        <div className="stat-card overflow-x-auto">
          <h3 className="font-display font-semibold text-foreground mb-4">Candidate Reviews</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Candidate</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Role</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Mode</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Score</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">AI Rec.</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Hire %</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-3 px-2 font-medium text-foreground">{c.name}</td>
                  <td className="py-3 px-2 text-muted-foreground">{c.role}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${c.mode === "Video" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                      {c.mode}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-semibold text-foreground">{c.score}%</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      c.recommendation === "Strong Hire"
                        ? "bg-success/10 text-success"
                        : c.recommendation === "Consider"
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive"
                    }`}>
                      {c.recommendation}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-semibold text-foreground">{c.probability}%</td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <button className="text-xs text-primary hover:underline">View</button>
                      <button className="text-xs text-muted-foreground hover:text-foreground"><Download className="h-3.5 w-3.5" /></button>
                      <button className="text-xs text-warning hover:text-foreground"><Star className="h-3.5 w-3.5" /></button>
                    </div>
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

export default RecruiterDashboard;
