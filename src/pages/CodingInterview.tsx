import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  SkipForward,
  RotateCcw,
  Terminal,
  Code2,
  Zap,
  AlertTriangle,
  Trophy,
} from "lucide-react";

interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: string;
  testCases: { input: string; expected: string }[];
}

const problems: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists."],
    starterCode: `function twoSum(nums, target) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: "twoSum([2,7,11,15], 9)", expected: "[0,1]" },
      { input: "twoSum([3,2,4], 6)", expected: "[1,2]" },
      { input: "twoSum([3,3], 6)", expected: "[0,1]" },
    ],
  },
  {
    id: 2,
    title: "Reverse Linked List",
    difficulty: "Easy",
    description:
      "Given the `head` of a singly linked list, reverse the list, and return the reversed list.\n\nImplement the function that takes an array (representing linked list values) and returns the reversed array.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" },
    ],
    constraints: ["The number of nodes in the list is [0, 5000]", "-5000 <= Node.val <= 5000"],
    starterCode: `function reverseList(arr) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: "reverseList([1,2,3,4,5])", expected: "[5,4,3,2,1]" },
      { input: "reverseList([1,2])", expected: "[2,1]" },
      { input: "reverseList([])", expected: "[]" },
    ],
  },
  {
    id: 3,
    title: "Valid Parentheses",
    difficulty: "Medium",
    description:
      "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'"],
    starterCode: `function isValid(s) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: 'isValid("()")', expected: "true" },
      { input: 'isValid("()[]{}")', expected: "true" },
      { input: 'isValid("(]")', expected: "false" },
      { input: 'isValid("([)]")', expected: "false" },
    ],
  },
  {
    id: 4,
    title: "Maximum Subarray",
    difficulty: "Medium",
    description:
      "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: `function maxSubArray(nums) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: "maxSubArray([-2,1,-3,4,-1,2,1,-5,4])", expected: "6" },
      { input: "maxSubArray([1])", expected: "1" },
      { input: "maxSubArray([5,4,-1,7,8])", expected: "23" },
    ],
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Hard",
    description:
      'Given a string `s`, return the longest palindromic substring in `s`.\n\nA palindrome is a string that reads the same forward and backward.',
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
      { input: 's = "cbbd"', output: '"bb"' },
    ],
    constraints: ["1 <= s.length <= 1000", "s consist of only digits and English letters."],
    starterCode: `function longestPalindrome(s) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: 'longestPalindrome("babad")', expected: '"bab"' },
      { input: 'longestPalindrome("cbbd")', expected: '"bb"' },
      { input: 'longestPalindrome("a")', expected: '"a"' },
    ],
  },
];

const difficultyColor: Record<string, string> = {
  Easy: "text-success",
  Medium: "text-warning",
  Hard: "text-destructive",
};

interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

const CodingInterview = () => {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [code, setCode] = useState(problems[0].starterCode);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [phase, setPhase] = useState<"intro" | "coding" | "complete">("intro");
  const [output, setOutput] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [tab, setTab] = useState<"output" | "tests">("output");
  const [completedProblems, setCompletedProblems] = useState<Set<number>>(new Set());
  const [scores, setScores] = useState<Record<number, number>>({});
  const [language, setLanguage] = useState("javascript");

  const problem = problems[currentProblem];

  useEffect(() => {
    if (phase !== "coding") return;
    if (timeLeft <= 0) {
      finishInterview();
      return;
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const startInterview = () => {
    setPhase("coding");
    setCode(problems[0].starterCode);
  };

  const runCode = useCallback(() => {
    setIsRunning(true);
    setOutput([]);
    setTestResults([]);
    setTab("output");

    setTimeout(() => {
      const logs: string[] = [];
      const results: TestResult[] = [];

      try {
        // Sandbox execution
        const consoleCapture: string[] = [];
        const fakeConsole = {
          log: (...args: unknown[]) => consoleCapture.push(args.map(String).join(" ")),
        };

        // eslint-disable-next-line no-new-Function
        const fn = new Function("console", code + "\nreturn { " + problem.starterCode.match(/function (\w+)/)?.[1] + " };");
        const exported = fn(fakeConsole);
        const funcName = problem.starterCode.match(/function (\w+)/)?.[1] || "";

        if (consoleCapture.length) logs.push(...consoleCapture);

        // Run test cases
        for (const tc of problem.testCases) {
          try {
            const testFn = new Function("console", funcName, `return JSON.stringify(${tc.input});`);
            const actual = testFn(fakeConsole, exported[funcName]);
            const passed = actual === tc.expected || actual === tc.expected.replace(/"/g, "");
            results.push({ input: tc.input, expected: tc.expected, actual, passed });
          } catch (e: unknown) {
            results.push({ input: tc.input, expected: tc.expected, actual: `Error: ${(e as Error).message}`, passed: false });
          }
        }

        if (!logs.length && results.length) {
          logs.push(`Ran ${results.length} test cases.`);
          const passed = results.filter((r) => r.passed).length;
          logs.push(`${passed}/${results.length} passed.`);
        }
      } catch (e: unknown) {
        logs.push(`Runtime Error: ${(e as Error).message}`);
      }

      setOutput(logs);
      setTestResults(results);
      setTab(results.length ? "tests" : "output");
      setIsRunning(false);
    }, 800);
  }, [code, problem]);

  const submitSolution = () => {
    runCode();
    setTimeout(() => {
      const passed = testResults.filter((r) => r.passed).length;
      const total = problem.testCases.length;
      const score = Math.round((passed / Math.max(total, 1)) * 100);
      setScores((p) => ({ ...p, [currentProblem]: score }));
      if (score >= 50) setCompletedProblems((p) => new Set(p).add(currentProblem));
    }, 1000);
  };

  const nextProblem = () => {
    const next = currentProblem + 1;
    if (next >= problems.length) {
      finishInterview();
    } else {
      setCurrentProblem(next);
      setCode(problems[next].starterCode);
      setOutput([]);
      setTestResults([]);
    }
  };

  const resetCode = () => setCode(problem.starterCode);

  const finishInterview = () => {
    setPhase("complete");
  };

  const avgScore = Object.values(scores).length
    ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length)
    : 0;

  // Intro screen
  if (phase === "intro") {
    return (
      <DashboardLayout>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center py-16">
          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Code2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">Coding Interview</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Solve algorithmic problems in a timed environment with live code execution and automated test validation.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
            {[
              { icon: Clock, label: "30 min total" },
              { icon: Code2, label: "5 problems" },
              { icon: Zap, label: "Live execution" },
            ].map((f, i) => (
              <div key={i} className="stat-card flex flex-col items-center gap-2 py-4">
                <f.icon className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">{f.label}</span>
              </div>
            ))}
          </div>
          <button onClick={startInterview} className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
            Start Coding Interview
          </button>
        </motion.div>
      </DashboardLayout>
    );
  }

  // Completion screen
  if (phase === "complete") {
    return (
      <DashboardLayout>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center py-16">
          <div className="h-20 w-20 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-6">
            <Trophy className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">Interview Complete!</h1>
          <p className="text-muted-foreground mb-8">Here's your performance summary.</p>
          <div className="stat-card max-w-sm mx-auto mb-6">
            <p className="text-5xl font-display font-bold text-primary mb-2">{avgScore}%</p>
            <p className="text-sm text-muted-foreground">Overall Score</p>
          </div>
          <div className="space-y-2 max-w-sm mx-auto mb-8">
            {problems.map((p, i) => (
              <div key={i} className="stat-card flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  {completedProblems.has(i) ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : scores[i] !== undefined ? (
                    <XCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-border" />
                  )}
                  <span className="text-sm text-foreground">{p.title}</span>
                  <span className={`text-xs ${difficultyColor[p.difficulty]}`}>{p.difficulty}</span>
                </div>
                <span className="text-sm font-mono text-muted-foreground">{scores[i] !== undefined ? `${scores[i]}%` : "—"}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </DashboardLayout>
    );
  }

  // Main coding interface
  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-6rem)] gap-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card rounded-t-lg">
          <div className="flex items-center gap-3">
            <Code2 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm text-foreground">{problem.title}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              problem.difficulty === "Easy" ? "bg-success/10 text-success" :
              problem.difficulty === "Medium" ? "bg-warning/10 text-warning" :
              "bg-destructive/10 text-destructive"
            }`}>{problem.difficulty}</span>
            <span className="text-xs text-muted-foreground">
              {currentProblem + 1}/{problems.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1 text-sm font-mono font-semibold ${timeLeft < 300 ? "text-destructive" : "text-foreground"}`}>
              <Clock className="h-4 w-4" />
              {fmt(timeLeft)}
            </div>
            <button onClick={nextProblem} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
              <SkipForward className="h-3.5 w-3.5" /> Skip
            </button>
            <button onClick={finishInterview} className="text-xs px-3 py-1.5 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition">
              End
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Problem panel */}
          <div className="w-[38%] border-r border-border overflow-y-auto p-5 bg-card">
            <h2 className="text-lg font-display font-bold text-foreground mb-3">{problem.title}</h2>
            <div className="prose prose-sm text-muted-foreground mb-4">
              {problem.description.split("\n").map((line, i) => (
                <p key={i} className="mb-2 text-sm">
                  {line.replace(/`([^`]+)`/g, (_, m) => m)}
                </p>
              ))}
            </div>

            <div className="space-y-4">
              {problem.examples.map((ex, i) => (
                <div key={i} className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs font-semibold text-foreground mb-1.5">Example {i + 1}:</p>
                  <div className="text-xs font-mono space-y-1 text-muted-foreground">
                    <p><span className="text-foreground">Input:</span> {ex.input}</p>
                    <p><span className="text-foreground">Output:</span> {ex.output}</p>
                    {ex.explanation && <p><span className="text-foreground">Explanation:</span> {ex.explanation}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-foreground mb-2">Constraints:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {problem.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span> {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Problem list */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs font-semibold text-foreground mb-2">All Problems</p>
              <div className="space-y-1">
                {problems.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentProblem(i);
                      setCode(problems[i].starterCode);
                      setOutput([]);
                      setTestResults([]);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition ${
                      i === currentProblem ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {completedProblems.has(i) ? (
                        <CheckCircle className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-border" />
                      )}
                      {p.title}
                    </div>
                    <span className={difficultyColor[p.difficulty]}>{p.difficulty}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: editor + output */}
          <div className="flex-1 flex flex-col">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-xs bg-secondary border border-border rounded px-2 py-1 text-foreground focus:outline-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={resetCode} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition px-2 py-1 rounded hover:bg-secondary">
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-success/10 text-success hover:bg-success/20 transition disabled:opacity-40"
                >
                  <Play className="h-3 w-3" /> Run
                </button>
                <button
                  onClick={submitSolution}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-primary text-primary-foreground hover:opacity-90 transition"
                >
                  <ChevronRight className="h-3 w-3" /> Submit
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                language={language}
                value={code}
                onChange={(v) => setCode(v || "")}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 12 },
                  lineNumbers: "on",
                  roundedSelection: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
            </div>

            {/* Output / Tests panel */}
            <div className="h-[30%] border-t border-border bg-card flex flex-col">
              <div className="flex items-center gap-0 border-b border-border">
                <button
                  onClick={() => setTab("output")}
                  className={`px-4 py-2 text-xs font-medium transition ${tab === "output" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Terminal className="h-3 w-3 inline mr-1.5" />Output
                </button>
                <button
                  onClick={() => setTab("tests")}
                  className={`px-4 py-2 text-xs font-medium transition ${tab === "tests" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <CheckCircle className="h-3 w-3 inline mr-1.5" />Tests
                  {testResults.length > 0 && (
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-secondary">
                      {testResults.filter((r) => r.passed).length}/{testResults.length}
                    </span>
                  )}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <AnimatePresence mode="wait">
                  {isRunning ? (
                    <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Executing...
                    </motion.div>
                  ) : tab === "output" ? (
                    <motion.div key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs space-y-1">
                      {output.length ? output.map((line, i) => (
                        <p key={i} className={line.startsWith("Runtime Error") ? "text-destructive" : "text-muted-foreground"}>
                          {line}
                        </p>
                      )) : (
                        <p className="text-muted-foreground italic">Run your code to see output.</p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="tests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                      {testResults.length ? testResults.map((r, i) => (
                        <div key={i} className={`rounded-lg p-3 text-xs ${r.passed ? "bg-success/5 border border-success/20" : "bg-destructive/5 border border-destructive/20"}`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            {r.passed ? <CheckCircle className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}
                            <span className={`font-medium ${r.passed ? "text-success" : "text-destructive"}`}>
                              Test {i + 1} {r.passed ? "Passed" : "Failed"}
                            </span>
                          </div>
                          <div className="font-mono text-muted-foreground space-y-0.5 pl-5">
                            <p>Input: {r.input}</p>
                            <p>Expected: {r.expected}</p>
                            {!r.passed && <p className="text-destructive">Got: {r.actual}</p>}
                          </div>
                        </div>
                      )) : (
                        <p className="text-xs text-muted-foreground italic">Submit your solution to see test results.</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CodingInterview;
