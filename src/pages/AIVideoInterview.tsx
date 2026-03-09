import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Sun,
  Wifi,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  ChevronRight,
  Brain,
  AlertTriangle,
  StopCircle,
  SkipForward,
} from "lucide-react";

type Phase = "setup" | "interview" | "completed";
type CheckStatus = "checking" | "pass" | "fail";

interface SystemCheck {
  label: string;
  icon: typeof Video;
  status: CheckStatus;
}

const QUESTIONS = [
  "Tell me about yourself and your experience with web development.",
  "What is React and how does it differ from other frameworks?",
  "Explain the concept of React hooks. Can you give examples?",
  "How do you handle state management in large applications?",
  "Describe a challenging technical problem you solved recently.",
  "What are your strategies for optimizing frontend performance?",
];

const AIVideoInterview = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("setup");
  const [checks, setChecks] = useState<SystemCheck[]>([
    { label: "Camera", icon: Video, status: "checking" },
    { label: "Microphone", icon: Mic, status: "checking" },
    { label: "Lighting", icon: Sun, status: "checking" },
    { label: "Internet", icon: Wifi, status: "checking" },
  ]);
  const [allChecksPassed, setAllChecksPassed] = useState(false);

  // Interview state
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 min per question
  const [isRecording, setIsRecording] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [liveMetrics, setLiveMetrics] = useState({
    speechSpeed: "Normal",
    fillerWords: 2,
    eyeContact: "Good",
    emotion: "Confident",
  });
  const [answers, setAnswers] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // System checks simulation
  useEffect(() => {
    if (phase !== "setup") return;
    const runChecks = async () => {
      // Try to get real camera/mic
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        // Will mark camera/mic as fail
      }

      for (let i = 0; i < 4; i++) {
        await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
        setChecks((prev) => {
          const next = [...prev];
          // Camera & mic depend on real permissions, others always pass
          if (i < 2) {
            next[i] = { ...next[i], status: streamRef.current ? "pass" : "fail" };
          } else {
            next[i] = { ...next[i], status: "pass" };
          }
          return next;
        });
      }
    };
    runChecks();
  }, [phase]);

  useEffect(() => {
    const passed = checks.every((c) => c.status === "pass");
    setAllChecksPassed(passed);
  }, [checks]);

  // Timer
  useEffect(() => {
    if (phase !== "interview" || !isRecording) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleNextQuestion();
          return 120;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, isRecording, currentQ]);

  // Simulate live metrics changes
  useEffect(() => {
    if (phase !== "interview" || !isRecording) return;
    const iv = setInterval(() => {
      const emotions = ["Confident", "Neutral", "Focused", "Nervous"];
      const speeds = ["Slow", "Normal", "Fast"];
      const contacts = ["Good", "Average", "Excellent"];
      setLiveMetrics({
        speechSpeed: speeds[Math.floor(Math.random() * speeds.length)],
        fillerWords: Math.floor(Math.random() * 8),
        eyeContact: contacts[Math.floor(Math.random() * contacts.length)],
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
      });
    }, 4000);
    return () => clearInterval(iv);
  }, [phase, isRecording]);

  const startInterview = () => {
    setPhase("interview");
    setIsRecording(true);
    setCurrentQ(0);
    setTimeLeft(120);
    // Attach stream to video
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  };

  const handleNextQuestion = useCallback(() => {
    setAnswers((prev) => [...prev, `Answer for Q${currentQ + 1}`]);
    if (currentQ + 1 >= QUESTIONS.length) {
      setPhase("completed");
      setIsRecording(false);
      clearInterval(timerRef.current);
      // Stop camera
      streamRef.current?.getTracks().forEach((t) => t.stop());
    } else {
      setCurrentQ((q) => q + 1);
      setTimeLeft(120);
    }
  }, [currentQ]);

  const stopInterview = () => {
    setPhase("completed");
    setIsRecording(false);
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const statusIcon = (s: CheckStatus) => {
    if (s === "checking") return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    if (s === "pass") return <CheckCircle2 className="h-4 w-4 text-success" />;
    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <DashboardLayout>
      <AnimatePresence mode="wait">
        {/* SETUP PHASE */}
        {phase === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="max-w-2xl mx-auto"
          >
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">AI Video Interview</h1>
            <p className="text-muted-foreground mb-8">
              We'll run a quick system check before starting your interview.
            </p>

            {/* Camera preview */}
            <div className="relative rounded-xl overflow-hidden bg-foreground/5 aspect-video mb-6 border border-border">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!streamRef.current && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <VideoOff className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* System checks */}
            <div className="stat-card mb-6">
              <h3 className="font-display font-semibold text-foreground mb-4">System Checks</h3>
              <div className="grid grid-cols-2 gap-3">
                {checks.map((check, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary"
                  >
                    <check.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground flex-1">{check.label}</span>
                    {statusIcon(check.status)}
                  </div>
                ))}
              </div>
            </div>

            {/* Proctoring rules */}
            <div className="stat-card mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <h3 className="text-sm font-semibold text-foreground">AI Proctoring Rules</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Keep your face visible in the camera at all times</li>
                <li>• Do not switch tabs or open other applications</li>
                <li>• Ensure a quiet environment with good lighting</li>
                <li>• No external assistance or notes allowed</li>
              </ul>
            </div>

            <button
              onClick={startInterview}
              disabled={!allChecksPassed}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Start Interview <ChevronRight className="h-5 w-5" />
            </button>
            {!allChecksPassed && checks.some((c) => c.status === "fail") && (
              <p className="text-xs text-destructive text-center mt-2">
                Please grant camera & microphone permissions to continue
              </p>
            )}
          </motion.div>
        )}

        {/* INTERVIEW PHASE */}
        {phase === "interview" && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {/* Top bar: question + timer */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Question {currentQ + 1} of {QUESTIONS.length}
                </p>
                <h2 className="text-lg font-display font-semibold text-foreground">
                  {QUESTIONS[currentQ]}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-display font-bold text-lg ${
                    timeLeft <= 30
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Clock className="h-5 w-5" />
                  {formatTime(timeLeft)}
                </div>
                {isRecording && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10">
                    <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                    <span className="text-xs font-medium text-destructive">REC</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video window */}
              <div className="lg:col-span-2">
                <div className="relative rounded-xl overflow-hidden bg-foreground/5 aspect-video border border-border">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover ${!cameraOn ? "hidden" : ""}`}
                  />
                  {!cameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                      <VideoOff className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-border">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button
                    onClick={() => setCameraOn(!cameraOn)}
                    className={`p-3 rounded-full transition ${cameraOn ? "bg-secondary text-foreground" : "bg-destructive/10 text-destructive"}`}
                  >
                    {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => setMicOn(!micOn)}
                    className={`p-3 rounded-full transition ${micOn ? "bg-secondary text-foreground" : "bg-destructive/10 text-destructive"}`}
                  >
                    {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition"
                  >
                    <SkipForward className="h-4 w-4" />
                    {currentQ + 1 >= QUESTIONS.length ? "Finish" : "Next Question"}
                  </button>
                  <button
                    onClick={stopInterview}
                    className="p-3 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition"
                  >
                    <StopCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* AI Feedback Panel */}
              <div className="space-y-4">
                <div className="stat-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Real-Time AI Feedback</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Speech Speed</span>
                      <span className="font-medium text-foreground">{liveMetrics.speechSpeed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Filler Words</span>
                      <span className={`font-medium ${liveMetrics.fillerWords > 5 ? "text-destructive" : "text-success"}`}>
                        {liveMetrics.fillerWords} detected
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Eye Contact</span>
                      <span className="font-medium text-foreground">{liveMetrics.eyeContact}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Emotion</span>
                      <span className={`font-medium ${
                        liveMetrics.emotion === "Confident"
                          ? "text-success"
                          : liveMetrics.emotion === "Nervous"
                          ? "text-warning"
                          : "text-foreground"
                      }`}>
                        {liveMetrics.emotion}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Questions progress */}
                <div className="stat-card">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Questions</h3>
                  <div className="space-y-2">
                    {QUESTIONS.map((_, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
                          i === currentQ
                            ? "bg-primary/10 text-primary font-medium"
                            : i < currentQ
                            ? "bg-success/10 text-success"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {i < currentQ ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : i === currentQ ? (
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                        )}
                        Q{i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* COMPLETED PHASE */}
        {phase === "completed" && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="stat-card py-12">
              <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">Interview Complete!</h1>
              <p className="text-muted-foreground mb-8">
                Your responses are being analyzed by our AI. Results will appear in your reports.
              </p>

              {/* Score preview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 text-left max-w-md mx-auto">
                {[
                  { label: "Technical", score: 82 },
                  { label: "Communication", score: 75 },
                  { label: "Confidence", score: 70 },
                  { label: "Problem Solving", score: 88 },
                  { label: "Body Language", score: 65 },
                  { label: "Overall", score: 78 },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-xl font-display font-bold text-foreground">{s.score}%</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-left max-w-md mx-auto mb-8">
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <p className="text-xs font-semibold text-success mb-1">Strengths</p>
                  <p className="text-sm text-foreground">Strong knowledge of JavaScript fundamentals and React patterns.</p>
                </div>
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <p className="text-xs font-semibold text-warning mb-1">Areas to Improve</p>
                  <p className="text-sm text-foreground">Needs improvement in explaining algorithms and system design.</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate("/dashboard/candidate/reports")}
                  className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition"
                >
                  View Full Report
                </button>
                <button
                  onClick={() => navigate("/dashboard/candidate")}
                  className="px-6 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-secondary transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default AIVideoInterview;
