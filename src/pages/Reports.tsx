import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Download, FileText, Share2, Filter } from "lucide-react";
import { useState } from "react";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const skillPerformance = [
  { skill: "React", score: 88 },
  { skill: "TypeScript", score: 82 },
  { skill: "Node.js", score: 75 },
  { skill: "Python", score: 60 },
  { skill: "SQL", score: 70 },
  { skill: "System Design", score: 55 },
  { skill: "DSA", score: 65 },
];

const progressData = [
  { month: "Sep", score: 55 },
  { month: "Oct", score: 62 },
  { month: "Nov", score: 58 },
  { month: "Dec", score: 70 },
  { month: "Jan", score: 75 },
  { month: "Feb", score: 78 },
  { month: "Mar", score: 82 },
];

const radarData = [
  { metric: "Technical", value: 82 },
  { metric: "Communication", value: 75 },
  { metric: "Confidence", value: 70 },
  { metric: "Problem Solving", value: 88 },
  { metric: "Body Language", value: 65 },
  { metric: "Clarity", value: 78 },
];

const scoreDistribution = [
  { name: "Excellent (80-100)", value: 4 },
  { name: "Good (60-79)", value: 5 },
  { name: "Average (40-59)", value: 2 },
  { name: "Needs Work (<40)", value: 1 },
];

const PIE_COLORS = [
  "hsl(var(--success))",
  "hsl(var(--primary))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
];

const interviewReports = [
  { id: 1, role: "Frontend Developer", date: "2026-03-05", score: 85, mode: "Video", status: "Reviewed" },
  { id: 2, role: "Full Stack Engineer", date: "2026-02-28", score: 72, mode: "Text", status: "Completed" },
  { id: 3, role: "React Developer", date: "2026-02-20", score: 91, mode: "Video", status: "Reviewed" },
  { id: 4, role: "Software Engineer", date: "2026-02-14", score: 68, mode: "Video", status: "Completed" },
  { id: 5, role: "Backend Developer", date: "2026-01-30", score: 74, mode: "Text", status: "Reviewed" },
];

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const Reports = () => {
  const [filterMode, setFilterMode] = useState<"all" | "Video" | "Text">("all");

  const filtered = filterMode === "all"
    ? interviewReports
    : interviewReports.filter((r) => r.mode === filterMode);

  const handleExportPDF = () => {
    // Simulate PDF generation
    const content = [
      "InterviewAI - Performance Report",
      "================================",
      "",
      `Generated: ${new Date().toLocaleDateString()}`,
      "",
      "Interview Summary",
      "-----------------",
      ...interviewReports.map(
        (r) => `${r.role} | ${r.date} | Score: ${r.score}% | Mode: ${r.mode} | ${r.status}`
      ),
      "",
      "Skill Performance",
      "-----------------",
      ...skillPerformance.map((s) => `${s.skill}: ${s.score}%`),
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "InterviewAI-Report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <motion.div {...fadeIn} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Detailed performance analysis across all interviews</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            <Download className="h-4 w-4" /> Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-secondary transition">
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart - Skill Performance */}
        <div className="stat-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Skill Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skillPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="skill" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Progress Over Time */}
        <div className="stat-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="stat-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Skill Radar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Radar
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Score Distribution */}
        <div className="stat-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={scoreDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {scoreDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Legend
                formatter={(value: string) => (
                  <span style={{ color: "hsl(var(--foreground))", fontSize: "12px" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Interview Reports Table */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.2 }}>
        <div className="stat-card overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Interview Reports</h3>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {(["all", "Video", "Text"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterMode(m)}
                  className={`text-xs px-3 py-1.5 rounded-full transition capitalize ${
                    filterMode === m
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Role</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Date</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Mode</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Score</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="py-3 px-2 font-medium text-foreground">{r.role}</td>
                  <td className="py-3 px-2 text-muted-foreground">{r.date}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      r.mode === "Video" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                    }`}>
                      {r.mode}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-semibold text-foreground">{r.score}%</td>
                  <td className="py-3 px-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">{r.status}</span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <button className="text-xs text-primary hover:underline flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" /> View
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <Download className="h-3.5 w-3.5" /> PDF
                      </button>
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

export default Reports;
