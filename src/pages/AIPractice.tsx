import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import MockInterviewSession from "@/components/practice/MockInterviewSession";
import { motion } from "framer-motion";
import {
  Brain,
  Play,
  Clock,
  Target,
  MessageSquare,
  Code2,
  Video,
  Mic,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Star,
  Zap,
  ArrowRight,
  RotateCcw,
  Timer,
} from "lucide-react";

const practiceCategories = [
  {
    id: "behavioral",
    label: "Behavioral",
    icon: MessageSquare,
    color: "text-primary",
    bg: "bg-primary/10",
    description: "STAR method, leadership, teamwork",
    questions: 24,
    completed: 8,
  },
  {
    id: "technical",
    label: "Technical",
    icon: Code2,
    color: "text-accent",
    bg: "bg-accent/10",
    description: "DSA, system design, OOP concepts",
    questions: 36,
    completed: 12,
  },
  {
    id: "communication",
    label: "Communication",
    icon: Mic,
    color: "text-success",
    bg: "bg-success/10",
    description: "Clarity, tone, articulation drills",
    questions: 18,
    completed: 5,
  },
  {
    id: "situational",
    label: "Situational",
    icon: Target,
    color: "text-warning",
    bg: "bg-warning/10",
    description: "Conflict resolution, decision making",
    questions: 20,
    completed: 3,
  },
];

const dailyChallenges = [
  { title: "Explain polymorphism in 60 seconds", difficulty: "Medium", xp: 50, type: "Technical" },
  { title: "Describe a time you led a team", difficulty: "Easy", xp: 30, type: "Behavioral" },
  { title: "Design a URL shortener", difficulty: "Hard", xp: 100, type: "System Design" },
];

const recentSessions = [
  { topic: "React Hooks Deep Dive", score: 88, date: "2026-03-11", duration: "12 min", category: "Technical" },
  { topic: "Tell me about yourself", score: 75, date: "2026-03-10", duration: "8 min", category: "Behavioral" },
  { topic: "Conflict at work", score: 82, date: "2026-03-09", duration: "10 min", category: "Situational" },
  { topic: "REST vs GraphQL", score: 91, date: "2026-03-08", duration: "15 min", category: "Technical" },
];

const flashcards = [
  { front: "What is a closure in JavaScript?", back: "A closure is a function that retains access to its outer scope variables even after the outer function has returned." },
  { front: "Explain the STAR method", back: "Situation → Task → Action → Result. A structured way to answer behavioral interview questions." },
  { front: "What is CAP theorem?", back: "A distributed system can only guarantee two of three: Consistency, Availability, Partition tolerance." },
  { front: "What is Big O notation?", back: "A mathematical notation describing the upper bound of an algorithm's time or space complexity." },
];

const tips = [
  "Practice answering in under 2 minutes for conciseness.",
  "Use specific examples with measurable outcomes.",
  "Pause before answering — it shows thoughtfulness.",
  "Mirror the interviewer's energy and tone.",
];

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const difficultyColor: Record<string, string> = {
  Easy: "text-success bg-success/10",
  Medium: "text-warning bg-warning/10",
  Hard: "text-destructive bg-destructive/10",
};

const AIPractice = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [practiceMode, setPracticeMode] = useState<"menu" | "session" | "mock">("menu");
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sessionScores, setSessionScores] = useState<number[]>([]);

  const mockQuestions: Record<string, string[]> = {
    behavioral: [
      "Tell me about a time you handled a difficult team member.",
      "Describe a situation where you had to meet a tight deadline.",
      "Give an example of when you showed leadership.",
      "Tell me about a failure and what you learned from it.",
      "Describe a time you went above and beyond.",
    ],
    technical: [
      "Explain the difference between var, let, and const in JavaScript.",
      "What is the virtual DOM and how does React use it?",
      "Describe how a hash map works internally.",
      "What are the SOLID principles?",
      "Explain the difference between SQL and NoSQL databases.",
    ],
    communication: [
      "Introduce yourself in a professional setting.",
      "Explain a complex technical concept to a non-technical person.",
      "How would you deliver bad news to a stakeholder?",
      "Describe your ideal work environment.",
      "How do you handle receiving critical feedback?",
    ],
    situational: [
      "What would you do if you disagreed with your manager's decision?",
      "How would you handle two urgent tasks with conflicting deadlines?",
      "A colleague takes credit for your work. What do you do?",
      "You discover a critical bug right before a release. What's your approach?",
      "A client is unhappy with the delivered product. How do you respond?",
    ],
  };

  const startPractice = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPracticeMode("session");
    setCurrentQ(0);
    setAnswer("");
    setSubmitted(false);
    setSessionScores([]);
  };

  const handleSubmitAnswer = () => {
    const score = Math.floor(Math.random() * 30) + 65;
    setSessionScores([...sessionScores, score]);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (selectedCategory && currentQ < mockQuestions[selectedCategory].length - 1) {
      setCurrentQ(currentQ + 1);
      setAnswer("");
      setSubmitted(false);
    } else {
      setPracticeMode("menu");
      setSelectedCategory(null);
    }
  };

  const avgScore = sessionScores.length > 0
    ? Math.round(sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length)
    : 0;

  if (practiceMode === "mock") {
    return (
      <DashboardLayout>
        <MockInterviewSession onExit={() => setPracticeMode("menu")} />
      </DashboardLayout>
    );
  }

  if (practiceMode === "session" && selectedCategory) {
    const questions = mockQuestions[selectedCategory];
    const category = practiceCategories.find((c) => c.id === selectedCategory);

    return (
      <DashboardLayout>
        <motion.div {...fadeIn} transition={{ duration: 0.4 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {category?.label} Practice
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Question {currentQ + 1} of {questions.length}
              </p>
            </div>
            <button
              onClick={() => { setPracticeMode("menu"); setSelectedCategory(null); }}
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              ← Back to Practice
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-8">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQ + (submitted ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>

          <div className="stat-card mb-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">AI Interviewer asks:</p>
                <p className="text-lg font-medium text-foreground">{questions[currentQ]}</p>
              </div>
            </div>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted}
              placeholder="Type your answer here... Be specific and use examples."
              className="w-full min-h-[160px] p-4 rounded-lg border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            />

            {!submitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={answer.trim().length < 20}
                className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition disabled:opacity-40"
              >
                <Zap className="h-4 w-4" /> Submit for AI Evaluation
              </button>
            ) : (
              <motion.div {...fadeIn} transition={{ duration: 0.3 }} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-xs text-muted-foreground mb-1">Overall Score</p>
                    <p className="text-2xl font-bold text-success">{sessionScores[sessionScores.length - 1]}%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-1">Clarity</p>
                    <p className="text-2xl font-bold text-primary">{Math.floor(Math.random() * 20) + 70}%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-xs text-muted-foreground mb-1">Relevance</p>
                    <p className="text-2xl font-bold text-accent">{Math.floor(Math.random() * 20) + 72}%</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <p className="text-sm font-medium text-foreground mb-2">💡 AI Feedback</p>
                  <p className="text-sm text-muted-foreground">
                    Good structure in your response. Consider adding more specific metrics or outcomes to strengthen your answer.
                    Try using the STAR method for behavioral questions to ensure completeness.
                  </p>
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition"
                >
                  {currentQ < questions.length - 1 ? (
                    <>Next Question <ArrowRight className="h-4 w-4" /></>
                  ) : (
                    <>Finish Session <CheckCircle2 className="h-4 w-4" /></>
                  )}
                </button>
              </motion.div>
            )}
          </div>

          {sessionScores.length > 0 && (
            <div className="stat-card">
              <h3 className="font-display font-semibold text-foreground mb-3">Session Progress</h3>
              <div className="flex gap-3 flex-wrap">
                {sessionScores.map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ${s >= 80 ? "bg-success/10 text-success" : s >= 65 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                      {s}
                    </div>
                    <span className="text-[10px] text-muted-foreground">Q{i + 1}</span>
                  </div>
                ))}
              </div>
              {sessionScores.length > 1 && (
                <p className="text-sm text-muted-foreground mt-3">
                  Session average: <span className="font-semibold text-foreground">{avgScore}%</span>
                </p>
              )}
            </div>
          )}
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div {...fadeIn} transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">AI Practice Lab 🧠</h1>
        <p className="text-muted-foreground mt-1">Sharpen your skills with AI-powered mock interviews and drills</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.05 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => navigate("/dashboard/candidate/interviews")}
          className="stat-card flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer text-left"
        >
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Video className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Mock Video Interview</p>
            <p className="text-xs text-muted-foreground">Full AI video simulation</p>
          </div>
        </button>
        <button
          onClick={() => navigate("/dashboard/candidate/text-interview")}
          className="stat-card flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer text-left"
        >
          <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Text Practice</p>
            <p className="text-xs text-muted-foreground">Chat-based Q&A drills</p>
          </div>
        </button>
        <button
          onClick={() => navigate("/dashboard/candidate/coding-interview")}
          className="stat-card flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer text-left"
        >
          <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
            <Code2 className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Coding Challenge</p>
            <p className="text-xs text-muted-foreground">Solve problems with AI hints</p>
          </div>
        </button>
      </motion.div>

      {/* Practice Categories */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.1 }} className="mb-8">
        <h2 className="font-display font-semibold text-foreground mb-4">Practice Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {practiceCategories.map((cat) => (
            <div key={cat.id} className="stat-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${cat.bg} flex items-center justify-center`}>
                    <cat.icon className={`h-5 w-5 ${cat.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{cat.label}</p>
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{cat.completed}/{cat.questions} completed</p>
                <p className="text-xs font-medium text-foreground">{Math.round((cat.completed / cat.questions) * 100)}%</p>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 mb-4">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(cat.completed / cat.questions) * 100}%` }} />
              </div>
              <button
                onClick={() => startPractice(cat.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition w-full justify-center"
              >
                <Play className="h-4 w-4" /> Start Practice
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Daily Challenges + Flashcards */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.15 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Challenges */}
        <div className="stat-card">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-warning" /> Daily Challenges
          </h3>
          <div className="space-y-3">
            {dailyChallenges.map((ch, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{ch.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${difficultyColor[ch.difficulty]}`}>{ch.difficulty}</span>
                    <span className="text-[10px] text-muted-foreground">{ch.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-warning">+{ch.xp} XP</span>
                  <button
                    onClick={() => startPractice(ch.type === "Behavioral" ? "behavioral" : "technical")}
                    className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition"
                  >
                    <Play className="h-3.5 w-3.5 text-primary" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flashcards */}
        <div className="stat-card">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Quick Flashcards
          </h3>
          <div className="space-y-3">
            {flashcards.map((card, i) => (
              <button
                key={i}
                onClick={() => setActiveCard(activeCard === i ? null : i)}
                className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/30 transition"
              >
                <p className="text-sm font-medium text-foreground">{card.front}</p>
                {activeCard === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-sm text-muted-foreground mt-2 pt-2 border-t border-border"
                  >
                    {card.back}
                  </motion.p>
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Sessions */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.2 }}>
        <div className="stat-card overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Recent Practice Sessions</h3>
            <button className="text-xs text-primary hover:underline flex items-center gap-1">
              <RotateCcw className="h-3 w-3" /> View All
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Topic</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Category</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Duration</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Score</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((s, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-3 px-2 font-medium text-foreground">{s.topic}</td>
                  <td className="py-3 px-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{s.category}</span>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {s.duration}
                  </td>
                  <td className="py-3 px-2 font-semibold text-foreground">{s.score}%</td>
                  <td className="py-3 px-2 text-muted-foreground">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.25 }} className="mt-8">
        <div className="stat-card bg-primary/5 border-primary/20">
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" /> Pro Interview Tips
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AIPractice;
