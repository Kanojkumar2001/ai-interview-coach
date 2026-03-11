import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  CreditCard,
  Shield,
  Camera,
  Save,
  Check,
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
];

const plans = [
  { id: "free", name: "Free", price: "$0", features: ["5 interviews/month", "Basic reports", "Email support"] },
  { id: "pro", name: "Pro", price: "$29", features: ["Unlimited interviews", "Advanced analytics", "Priority support", "Resume parsing"] },
  { id: "enterprise", name: "Enterprise", price: "$99", features: ["Everything in Pro", "Custom branding", "API access", "Dedicated manager", "SSO"] },
];

const Settings = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    experienceLevel: user?.experienceLevel || "Mid-Level",
    skills: user?.skills?.join(", ") || "",
  });

  const [notifications, setNotifications] = useState({
    emailResults: true,
    emailTips: false,
    interviewReminders: true,
    weeklyDigest: true,
    marketingEmails: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Settings</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabs */}
          <div className="lg:w-56 flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  tab === t.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            {tab === "profile" && (
              <div className="stat-card space-y-6">
                <h2 className="text-lg font-display font-semibold text-foreground">Profile Information</h2>

                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                    {profile.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()}
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition">
                    <Camera className="h-4 w-4" /> Change Photo
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
                    <input
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                    <input
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Experience Level</label>
                    <select
                      value={profile.experienceLevel}
                      onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option>Entry-Level</option>
                      <option>Mid-Level</option>
                      <option>Senior</option>
                      <option>Lead</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Skills (comma-separated)</label>
                    <input
                      value={profile.skills}
                      onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition">
                  {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  {saved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            )}

            {tab === "notifications" && (
              <div className="stat-card space-y-5">
                <h2 className="text-lg font-display font-semibold text-foreground">Notification Preferences</h2>
                {Object.entries(notifications).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {key === "emailResults" && "Get notified when interview results are ready"}
                        {key === "emailTips" && "Receive AI-powered improvement tips"}
                        {key === "interviewReminders" && "Reminders before scheduled interviews"}
                        {key === "weeklyDigest" && "Weekly performance summary email"}
                        {key === "marketingEmails" && "Product updates and promotions"}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [key]: !val })}
                      className={`w-11 h-6 rounded-full transition-colors ${val ? "bg-primary" : "bg-secondary"}`}
                    >
                      <div className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${val ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === "subscription" && (
              <div className="space-y-4">
                <h2 className="text-lg font-display font-semibold text-foreground">Subscription Plan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {plans.map((plan) => {
                    const isCurrent = user?.subscriptionPlan === plan.id;
                    return (
                      <div
                        key={plan.id}
                        className={`stat-card space-y-4 ${isCurrent ? "ring-2 ring-primary" : ""}`}
                      >
                        <div>
                          <h3 className="font-display font-bold text-foreground">{plan.name}</h3>
                          <p className="text-2xl font-display font-bold text-primary mt-1">
                            {plan.price}<span className="text-sm text-muted-foreground font-normal">/mo</span>
                          </p>
                        </div>
                        <ul className="space-y-2">
                          {plan.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="h-3.5 w-3.5 text-success" /> {f}
                            </li>
                          ))}
                        </ul>
                        <button
                          className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                            isCurrent
                              ? "bg-secondary text-muted-foreground cursor-default"
                              : "bg-primary text-primary-foreground hover:opacity-90"
                          }`}
                          disabled={isCurrent}
                        >
                          {isCurrent ? "Current Plan" : "Upgrade"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {tab === "security" && (
              <div className="stat-card space-y-6">
                <h2 className="text-lg font-display font-semibold text-foreground">Security</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Current Password</label>
                    <input type="password" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">New Password</label>
                    <input type="password" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Confirm Password</label>
                    <input type="password" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition">
                    <Shield className="h-4 w-4" /> Update Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Settings;
