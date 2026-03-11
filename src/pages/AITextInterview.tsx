import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Clock,
  Code,
  CheckCircle,
  AlertTriangle,
  Zap,
  SkipForward,
} from "lucide-react";

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
  evaluation?: { relevance: number; grammar: number; logic: number; overall: number };
}

const interviewQuestions = [
  "Tell me about your experience with React and component-based architecture.",
  "How would you optimize a React application that has slow rendering performance?",
  "Explain the difference between useEffect and useLayoutEffect. When would you use each?",
  "Write a function that debounces API calls. Explain your approach.",
  "How do you handle state management in large-scale applications?",
  "Describe a challenging bug you've encountered and how you resolved it.",
];

const AITextInterview = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [phase, setPhase] = useState<"intro" | "interview" | "complete">("intro");
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTyping, setIsTyping] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [codeValue, setCodeValue] = useState("// Write your code here\n");
  const [scores, setScores] = useState<{ relevance: number; grammar: number; logic: number; overall: number }[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (phase !== "interview") return;
    if (timeLeft <= 0) {
      handleSkip();
      return;
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase]);

  const startInterview = () => {
    setPhase("interview");
    const aiMsg: Message = {
      id: Date.now().toString(),
      role: "ai",
      content: `Welcome! I'll be conducting your technical interview today. Let's begin.\n\n**Question 1/${interviewQuestions.length}:**\n${interviewQuestions[0]}`,
      timestamp: new Date(),
    };
    setMessages([aiMsg]);
  };

  const evaluateAnswer = (answer: string) => {
    const wordCount = answer.trim().split(/\s+/).length;
    const relevance = Math.min(95, 50 + Math.random() * 30 + (wordCount > 20 ? 15 : 0));
    const grammar = Math.min(98, 60 + Math.random() * 30);
    const logic = Math.min(92, 45 + Math.random() * 35 + (wordCount > 30 ? 12 : 0));
    const overall = Math.round((relevance + grammar + logic) / 3);
    return {
      relevance: Math.round(relevance),
      grammar: Math.round(grammar),
      logic: Math.round(logic),
      overall,
    };
  };

  const sendMessage = () => {
    const text = showCode ? `${input}\n\n\`\`\`\n${codeValue}\n\`\`\`` : input;
    if (!text.trim()) return;

    const eval_ = evaluateAnswer(text);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
      evaluation: eval_,
    };
    setMessages((p) => [...p, userMsg]);
    setScores((p) => [...p, eval_]);
    setInput("");
    setCodeValue("// Write your code here\n");
    setShowCode(false);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const nextQ = currentQ + 1;
      if (nextQ >= interviewQuestions.length) {
        finishInterview([...scores, eval_]);
      } else {
        setCurrentQ(nextQ);
        setTimeLeft(120);
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: `${eval_.overall >= 75 ? "Great answer! " : "Thank you. "}**Question ${nextQ + 1}/${interviewQuestions.length}:**\n${interviewQuestions[nextQ]}`,
          timestamp: new Date(),
        };
        setMessages((p) => [...p, aiMsg]);
      }
    }, 1500);
  };

  const handleSkip = () => {
    const nextQ = currentQ + 1;
    if (nextQ >= interviewQuestions.length) {
      finishInterview(scores);
    } else {
      setCurrentQ(nextQ);
      setTimeLeft(120);
      const aiMsg: Message = {
        id: Date.now().toString(),
        role: "ai",
        content: `Skipped. **Question ${nextQ + 1}/${interviewQuestions.length}:**\n${interviewQuestions[nextQ]}`,
        timestamp: new Date(),
      };
      setMessages((p) => [...p, aiMsg]);
    }
  };

  const finishInterview = (allScores: typeof scores) => {
    setPhase("complete");
    const avg = allScores.length
      ? Math.round(allScores.reduce((a, s) => a + s.overall, 0) / allScores.length)
      : 0;
    const aiMsg: Message = {
      id: Date.now().toString(),
      role: "ai",
      content: `🎉 **Interview Complete!**\n\nYour overall score: **${avg}%**\n\nQuestions answered: ${allScores.length}/${interviewQuestions.length}\n\nA detailed report has been generated. Check the Reports page for full analysis.`,
      timestamp: new Date(),
    };
    setMessages((p) => [...p, aiMsg]);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (phase === "intro") {
    return (
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center py-16"
        >
          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">AI Text Interview</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Chat-based technical interview with real-time AI evaluation. Answer questions, write code, and receive instant feedback.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
            {[
              { icon: Clock, label: "2 min/question" },
              { icon: Code, label: "Code editor" },
              { icon: Zap, label: "Live scoring" },
            ].map((f, i) => (
              <div key={i} className="stat-card flex flex-col items-center gap-2 py-4">
                <f.icon className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">{f.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={startInterview}
            className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
          >
            Start Interview
          </button>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-6rem)]">
        {/* Chat panel */}
        <div className="flex-1 flex flex-col stat-card p-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">AI Interviewer</p>
                <p className="text-xs text-muted-foreground">
                  Q{currentQ + 1}/{interviewQuestions.length}
                </p>
              </div>
            </div>
            {phase === "interview" && (
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1 text-sm font-mono font-semibold ${timeLeft < 30 ? "text-destructive" : "text-foreground"}`}>
                  <Clock className="h-4 w-4" />
                  {fmt(timeLeft)}
                </div>
                <button onClick={handleSkip} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
                  <SkipForward className="h-3.5 w-3.5" /> Skip
                </button>
              </div>
            )}
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "ai" ? "bg-primary/10" : "bg-accent/10"}`}>
                    {msg.role === "ai" ? <Bot className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-accent" />}
                  </div>
                  <div className={`max-w-[75%] space-y-2`}>
                    <div className={`rounded-xl px-4 py-3 text-sm ${msg.role === "ai" ? "bg-secondary text-foreground" : "bg-primary text-primary-foreground"}`}>
                      <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                        __html: msg.content
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/```([\s\S]*?)```/g, '<pre class="bg-background/50 rounded p-2 mt-2 text-xs overflow-x-auto"><code>$1</code></pre>')
                      }} />
                    </div>
                    {msg.evaluation && (
                      <div className="flex gap-2 flex-wrap">
                        {[
                          { l: "Relevance", v: msg.evaluation.relevance },
                          { l: "Grammar", v: msg.evaluation.grammar },
                          { l: "Logic", v: msg.evaluation.logic },
                        ].map((e) => (
                          <span key={e.l} className={`text-xs px-2 py-0.5 rounded-full ${e.v >= 75 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                            {e.l}: {e.v}%
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-secondary rounded-xl px-4 py-3 text-sm text-muted-foreground">
                  Evaluating your answer...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          {phase === "interview" && (
            <div className="border-t border-border p-4 space-y-3">
              {showCode && (
                <textarea
                  value={codeValue}
                  onChange={(e) => setCodeValue(e.target.value)}
                  className="w-full h-32 bg-background border border-border rounded-lg p-3 text-sm font-mono text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Write your code here..."
                />
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCode(!showCode)}
                  className={`px-3 py-2 rounded-lg border text-sm transition ${showCode ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground hover:text-foreground"}`}
                >
                  <Code className="h-4 w-4" />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Type your answer..."
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() && !codeValue.trim()}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Side panel – live evaluation */}
        <div className="w-full lg:w-72 space-y-4 flex-shrink-0">
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">Live Evaluation</h3>
            <div className="space-y-3">
              {[
                { label: "Relevance", value: scores.length ? scores[scores.length - 1].relevance : 0, color: "bg-primary" },
                { label: "Grammar", value: scores.length ? scores[scores.length - 1].grammar : 0, color: "bg-accent" },
                { label: "Logic", value: scores.length ? scores[scores.length - 1].logic : 0, color: "bg-success" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="text-foreground font-medium">{m.value}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${m.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${m.value}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="stat-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">Progress</h3>
            <div className="space-y-2">
              {interviewQuestions.map((_, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {i < currentQ || phase === "complete" ? (
                    <CheckCircle className="h-3.5 w-3.5 text-success" />
                  ) : i === currentQ && phase === "interview" ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-border" />
                  )}
                  <span className={i <= currentQ ? "text-foreground" : "text-muted-foreground"}>
                    Question {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {scores.length > 0 && (
            <div className="stat-card">
              <h3 className="text-sm font-semibold text-foreground mb-2">Avg Score</h3>
              <p className="text-3xl font-display font-bold text-primary">
                {Math.round(scores.reduce((a, s) => a + s.overall, 0) / scores.length)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AITextInterview;
