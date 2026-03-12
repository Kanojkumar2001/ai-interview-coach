import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Brain, Zap, ArrowRight, CheckCircle2, Clock, Trophy, AlertTriangle,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const mockInterviewQuestions = [
  { q: "Tell me about yourself and your professional background.", category: "Behavioral", difficulty: "Easy" },
  { q: "Explain the difference between REST and GraphQL.", category: "Technical", difficulty: "Medium" },
  { q: "Describe a time you resolved a conflict within your team.", category: "Behavioral", difficulty: "Medium" },
  { q: "What is the virtual DOM and why does React use it?", category: "Technical", difficulty: "Medium" },
  { q: "Tell me about a project you're most proud of.", category: "Behavioral", difficulty: "Easy" },
  { q: "How does a hash map handle collisions?", category: "Technical", difficulty: "Hard" },
  { q: "Describe a situation where you had to learn something quickly.", category: "Behavioral", difficulty: "Medium" },
  { q: "What are the SOLID principles? Give an example of one.", category: "Technical", difficulty: "Hard" },
  { q: "How do you prioritize tasks when everything is urgent?", category: "Behavioral", difficulty: "Medium" },
  { q: "Explain the event loop in JavaScript.", category: "Technical", difficulty: "Hard" },
];

interface Props {
  onExit: () => void;
}

const MockInterviewSession = ({ onExit }: Props) => {
  const TOTAL_TIME = 30 * 60; // 30 minutes
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState<{ score: number; clarity: number; relevance: number }[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setFinished(true);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finished]);

  const formatTime = useCallback((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }, []);

  const handleSubmit = () => {
    const score = Math.floor(Math.random() * 25) + 70;
    const clarity = Math.floor(Math.random() * 20) + 72;
    const relevance = Math.floor(Math.random() * 20) + 70;
    setScores([...scores, { score, clarity, relevance }]);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentQ < mockInterviewQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setAnswer("");
      setSubmitted(false);
    } else {
      setFinished(true);
    }
  };

  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length)
    : 0;

  const timeWarning = timeLeft < 300 && timeLeft > 0;
  const progress = ((currentQ + (submitted ? 1 : 0)) / mockInterviewQuestions.length) * 100;

  if (finished) {
    return (
      <motion.div {...fadeIn} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Mock Interview Complete 🎉</h1>
          <button onClick={onExit} className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Back to Practice
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="stat-card text-center">
            <Trophy className="h-8 w-8 text-warning mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{avgScore}%</p>
            <p className="text-xs text-muted-foreground">Overall Score</p>
          </div>
          <div className="stat-card text-center">
            <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{scores.length}</p>
            <p className="text-xs text-muted-foreground">Answered</p>
          </div>
          <div className="stat-card text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{formatTime(TOTAL_TIME - timeLeft)}</p>
            <p className="text-xs text-muted-foreground">Time Used</p>
          </div>
          <div className="stat-card text-center">
            <Brain className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{mockInterviewQuestions.length}</p>
            <p className="text-xs text-muted-foreground">Total Questions</p>
          </div>
        </div>

        <div className="stat-card mb-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Question-by-Question Results</h3>
          <div className="space-y-3">
            {scores.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{mockInterviewQuestions[i].q}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{mockInterviewQuestions[i].category}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{mockInterviewQuestions[i].difficulty}</span>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-foreground font-semibold">{s.score}%</span>
                </div>
              </div>
            ))}
            {scores.length < mockInterviewQuestions.length && (
              <p className="text-sm text-muted-foreground italic">
                {mockInterviewQuestions.length - scores.length} question(s) skipped (time ran out)
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onExit}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition"
        >
          Return to Practice Lab
        </button>
      </motion.div>
    );
  }

  const question = mockInterviewQuestions[currentQ];

  return (
    <motion.div {...fadeIn} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Mock Interview</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Question {currentQ + 1} of {mockInterviewQuestions.length} · {question.category}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${timeWarning ? "bg-destructive/10 text-destructive animate-pulse" : "bg-muted text-foreground"}`}>
            {timeWarning && <AlertTriangle className="h-4 w-4" />}
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setFinished(true)}
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            End Early
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-muted rounded-full h-2 mb-6">
        <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="stat-card mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${question.difficulty === "Easy" ? "text-success bg-success/10" : question.difficulty === "Medium" ? "text-warning bg-warning/10" : "text-destructive bg-destructive/10"}`}>
            {question.difficulty}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{question.category}</span>
        </div>

        <div className="flex items-start gap-3 my-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <p className="text-lg font-medium text-foreground">{question.q}</p>
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={submitted}
          placeholder="Type your answer here... Be specific and use examples."
          className="w-full min-h-[140px] p-4 rounded-lg border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
        />

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={answer.trim().length < 20}
            className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition disabled:opacity-40"
          >
            <Zap className="h-4 w-4" /> Submit Answer
          </button>
        ) : (
          <motion.div {...fadeIn} transition={{ duration: 0.3 }} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-xs text-muted-foreground mb-1">Score</p>
                <p className="text-2xl font-bold text-success">{scores[scores.length - 1].score}%</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Clarity</p>
                <p className="text-2xl font-bold text-primary">{scores[scores.length - 1].clarity}%</p>
              </div>
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-xs text-muted-foreground mb-1">Relevance</p>
                <p className="text-2xl font-bold text-accent">{scores[scores.length - 1].relevance}%</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <p className="text-sm font-medium text-foreground mb-2">💡 AI Feedback</p>
              <p className="text-sm text-muted-foreground">
                {question.category === "Technical"
                  ? "Good technical depth. Try to include real-world examples and trade-offs to strengthen your answer."
                  : "Solid response. Use the STAR method and include measurable outcomes to make your answer more compelling."}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition"
            >
              {currentQ < mockInterviewQuestions.length - 1 ? (
                <>Next Question <ArrowRight className="h-4 w-4" /></>
              ) : (
                <>Finish Interview <CheckCircle2 className="h-4 w-4" /></>
              )}
            </button>
          </motion.div>
        )}
      </div>

      {/* Session scores */}
      {scores.length > 0 && (
        <div className="stat-card">
          <h3 className="font-display font-semibold text-foreground mb-3">Progress</h3>
          <div className="flex gap-3 flex-wrap">
            {scores.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ${s.score >= 80 ? "bg-success/10 text-success" : s.score >= 65 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                  {s.score}
                </div>
                <span className="text-[10px] text-muted-foreground">Q{i + 1}</span>
              </div>
            ))}
          </div>
          {scores.length > 1 && (
            <p className="text-sm text-muted-foreground mt-3">
              Average: <span className="font-semibold text-foreground">{avgScore}%</span>
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MockInterviewSession;
