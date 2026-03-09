import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  FileText,
  CheckCircle2,
  Loader2,
  Sparkles,
  Tag,
} from "lucide-react";

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_SKILLS = [
  "React", "TypeScript", "Node.js", "Python", "AWS", "Docker",
  "GraphQL", "PostgreSQL", "Git", "REST APIs", "CI/CD", "Agile",
];

const MOCK_EDUCATION = "B.Tech Computer Science — MIT (2022)";
const MOCK_EXPERIENCE = "3 years — Full Stack Development";

type UploadPhase = "idle" | "uploading" | "parsing" | "done";

const ResumeUploadModal = ({ isOpen, onClose }: ResumeUploadModalProps) => {
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setPhase("idle");
    setFile(null);
    setExtractedSkills([]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const simulateProcessing = useCallback((f: File) => {
    setFile(f);
    setPhase("uploading");
    setTimeout(() => {
      setPhase("parsing");
      setTimeout(() => {
        // Simulate AI skill extraction
        const count = 6 + Math.floor(Math.random() * 4);
        const shuffled = [...MOCK_SKILLS].sort(() => 0.5 - Math.random());
        setExtractedSkills(shuffled.slice(0, count));
        setPhase("done");
      }, 2000);
    }, 1500);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f && (f.type === "application/pdf" || f.name.endsWith(".pdf") || f.name.endsWith(".docx"))) {
        simulateProcessing(f);
      }
    },
    [simulateProcessing]
  );

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) simulateProcessing(f);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">Upload Resume</h2>
            </div>
            <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {phase === "idle" && (
              <div
                onDrop={onDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium text-foreground">Drag & drop your resume here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse • PDF, DOCX</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={onFileSelect}
                />
              </div>
            )}

            {(phase === "uploading" || phase === "parsing") && (
              <div className="text-center py-8">
                <Loader2 className="h-10 w-10 text-primary mx-auto mb-4 animate-spin" />
                <p className="font-medium text-foreground">
                  {phase === "uploading" ? "Uploading resume..." : "AI is extracting skills..."}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{file?.name}</p>
                <div className="mt-4 w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: phase === "uploading" ? "50%" : "90%" }}
                    transition={{ duration: 1.5 }}
                  />
                </div>
              </div>
            )}

            {phase === "done" && (
              <div className="space-y-5">
                {/* File info */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file?.name}</p>
                    <p className="text-xs text-muted-foreground">Resume parsed successfully</p>
                  </div>
                </div>

                {/* AI Extracted Skills */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">AI-Extracted Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {extractedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                      >
                        <Tag className="h-3 w-3" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education & Experience */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground mb-1">Education</p>
                    <p className="text-sm font-medium text-foreground">{MOCK_EDUCATION}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground mb-1">Experience</p>
                    <p className="text-sm font-medium text-foreground">{MOCK_EXPERIENCE}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={reset}
                    className="flex-1 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-secondary transition"
                  >
                    Upload Another
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
                  >
                    Save & Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResumeUploadModal;
