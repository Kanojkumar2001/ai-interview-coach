import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Star, Medal, Crown, Award } from "lucide-react";

const topPerformers = [
  { rank: 1, name: "Priya Sharma", score: 96, interviews: 18, badge: "🥇" },
  { rank: 2, name: "James Chen", score: 94, interviews: 22, badge: "🥈" },
  { rank: 3, name: "Maria Garcia", score: 91, interviews: 15, badge: "🥉" },
  { rank: 4, name: "Alex Johnson", score: 89, interviews: 12, badge: "" },
  { rank: 5, name: "Aisha Patel", score: 87, interviews: 20, badge: "" },
  { rank: 6, name: "Liam O'Brien", score: 85, interviews: 14, badge: "" },
  { rank: 7, name: "Sophie Kim", score: 83, interviews: 16, badge: "" },
  { rank: 8, name: "Daniel Moore", score: 81, interviews: 11, badge: "" },
];

const skillLeaders = [
  { skill: "React", leader: "James Chen", score: 98 },
  { skill: "TypeScript", leader: "Priya Sharma", score: 97 },
  { skill: "System Design", leader: "Maria Garcia", score: 95 },
  { skill: "Algorithms", leader: "Aisha Patel", score: 94 },
  { skill: "Node.js", leader: "Liam O'Brien", score: 92 },
  { skill: "Communication", leader: "Sophie Kim", score: 96 },
];

const mostImproved = [
  { name: "Daniel Moore", improvement: "+22%", from: 59, to: 81 },
  { name: "Sophie Kim", improvement: "+18%", from: 65, to: 83 },
  { name: "Liam O'Brien", improvement: "+15%", from: 70, to: 85 },
];

const Leaderboard = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-display font-bold text-foreground">Leaderboard</h1>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-xl mx-auto">
          {[topPerformers[1], topPerformers[0], topPerformers[2]].map((p, i) => (
            <motion.div
              key={p.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`stat-card text-center ${i === 1 ? "lg:-mt-4" : ""}`}
            >
              <div className="text-3xl mb-2">{p.badge}</div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary font-bold text-sm">
                {p.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
              <p className="text-2xl font-display font-bold text-primary mt-1">{p.score}%</p>
              <p className="text-xs text-muted-foreground">{p.interviews} interviews</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Full Rankings */}
          <div className="lg:col-span-2 stat-card">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" /> All Rankings
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">#</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Name</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Score</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Interviews</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((p) => (
                  <tr key={p.rank} className="border-b border-border last:border-0">
                    <td className="py-3 px-2 font-semibold text-foreground">
                      {p.badge || p.rank}
                    </td>
                    <td className="py-3 px-2 text-foreground">{p.name}</td>
                    <td className="py-3 px-2">
                      <span className="font-semibold text-primary">{p.score}%</span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{p.interviews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skill Leaders */}
            <div className="stat-card">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" /> Skill Leaders
              </h3>
              <div className="space-y-3">
                {skillLeaders.map((s) => (
                  <div key={s.skill} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.skill}</p>
                      <p className="text-xs text-muted-foreground">{s.leader}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">{s.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Improved */}
            <div className="stat-card">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" /> Most Improved
              </h3>
              <div className="space-y-3">
                {mostImproved.map((p) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.from}% → {p.to}%</p>
                    </div>
                    <span className="text-sm font-bold text-success">{p.improvement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Leaderboard;
