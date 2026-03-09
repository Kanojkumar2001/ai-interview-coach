import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "candidate" | "recruiter" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  profilePhoto: string;
  subscriptionPlan: "free" | "pro" | "enterprise";
  accountStatus: "active" | "blocked";
  skills: string[];
  experienceLevel: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const DUMMY_USERS: { email: string; password: string; user: User }[] = [
  {
    email: "candidate@demo.com",
    password: "password123",
    user: {
      id: "1",
      fullName: "Alex Johnson",
      email: "candidate@demo.com",
      role: "candidate",
      profilePhoto: "",
      subscriptionPlan: "pro",
      accountStatus: "active",
      skills: ["React", "TypeScript", "Node.js", "Python"],
      experienceLevel: "Mid-Level",
    },
  },
  {
    email: "recruiter@demo.com",
    password: "password123",
    user: {
      id: "2",
      fullName: "Sarah Miller",
      email: "recruiter@demo.com",
      role: "recruiter",
      profilePhoto: "",
      subscriptionPlan: "enterprise",
      accountStatus: "active",
      skills: [],
      experienceLevel: "",
    },
  },
  {
    email: "admin@demo.com",
    password: "password123",
    user: {
      id: "3",
      fullName: "Admin User",
      email: "admin@demo.com",
      role: "admin",
      profilePhoto: "",
      subscriptionPlan: "enterprise",
      accountStatus: "active",
      skills: [],
      experienceLevel: "",
    },
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ai_interview_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const found = DUMMY_USERS.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser(found.user);
      localStorage.setItem("ai_interview_user", JSON.stringify(found.user));
      return true;
    }
    return false;
  };

  const signup = async (fullName: string, email: string, _password: string, role: UserRole): Promise<boolean> => {
    const newUser: User = {
      id: Date.now().toString(),
      fullName,
      email,
      role,
      profilePhoto: "",
      subscriptionPlan: "free",
      accountStatus: "active",
      skills: [],
      experienceLevel: "Entry-Level",
    };
    setUser(newUser);
    localStorage.setItem("ai_interview_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ai_interview_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
