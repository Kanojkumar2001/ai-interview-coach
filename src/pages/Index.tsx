import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Video,
  Brain,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "AI Video Interviews",
    desc: "Real-time AI-powered video interviews with emotion detection, speech analysis, and smart follow-up questions.",
  },
  {
    icon: Brain,
    title: "Smart Evaluation",
    desc: "AI evaluates technical knowledge, communication skills, confidence, and problem-solving in real-time.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    desc: "Comprehensive performance dashboards with skill radars, trend analysis, and hiring probability predictions.",
  },
  {
    icon: Shield,
    title: "AI Proctoring",
    desc: "Automated cheating detection, eye tracking, and behavioral analysis to ensure interview integrity.",
  },
  {
    icon: Zap,
    title: "Resume Parsing",
    desc: "AI extracts skills, experience, and education from resumes to auto-generate targeted interview questions.",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    desc: "Conduct interviews in English, Hindi, and other supported languages with real-time translation.",
  },
];

const steps = [
  { num: "01", title: "Sign Up", desc: "Create your account as a candidate or recruiter" },
  { num: "02", title: "AI Interview", desc: "Take AI-powered video or text interviews" },
  { num: "03", title: "Get Scored", desc: "Receive detailed AI evaluation and feedback" },
  { num: "04", title: "Get Hired", desc: "Recruiters review reports and hire top talent" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" />
            <span className="text-xl font-display font-bold text-foreground">InterviewAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">How It Works</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary transition">
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-bg pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" /> AI-Powered Recruitment Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight mb-6">
              <span className="text-primary-foreground">Hire Smarter with</span>
              <br />
              <span className="gradient-text">AI Interviews</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Transform your hiring process with real-time AI video interviews, intelligent evaluation,
              and comprehensive analytics. Find the best talent faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition glow-primary"
              >
                Start Free Trial <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-primary-foreground font-medium hover:bg-secondary/10 transition"
              >
                <Video className="h-5 w-5" /> Watch Demo
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-8 mt-20 max-w-xl mx-auto"
          >
            {[
              { val: "10K+", label: "Interviews" },
              { val: "500+", label: "Companies" },
              { val: "95%", label: "Accuracy" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-display font-bold text-primary-foreground">{s.val}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
              Powerful AI Features
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to conduct, evaluate, and analyze interviews at scale
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="stat-card group"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground">Four simple steps to transform your hiring</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }} className="text-center">
                <div className="text-5xl font-display font-bold text-primary/20 mb-3">{step.num}</div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">Simple Pricing</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Free", price: "$0", features: ["3 AI Interviews/month", "Basic Analytics", "Text Mode Only"] },
              { name: "Pro", price: "$29", features: ["Unlimited Interviews", "Full Analytics", "Video + Text Mode", "AI Feedback", "Resume Parsing"], popular: true },
              { name: "Enterprise", price: "$99", features: ["Everything in Pro", "Team Dashboard", "API Access", "Custom Branding", "Priority Support"] },
            ].map((plan, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`stat-card text-center relative ${plan.popular ? "border-primary glow-primary" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-display font-semibold text-foreground">{plan.name}</h3>
                <p className="text-4xl font-display font-bold text-foreground mt-4 mb-6">
                  {plan.price}<span className="text-sm text-muted-foreground font-normal">/mo</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`block w-full py-3 rounded-lg font-medium text-sm transition ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 hero-bg">
        <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary-foreground mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of companies using AI to find the best talent
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition glow-primary"
          >
            Start Free Trial <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-foreground">InterviewAI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 InterviewAI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
