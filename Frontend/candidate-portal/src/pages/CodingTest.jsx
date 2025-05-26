"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Clock,
  CheckCircle,
  Code,
  Terminal,
  CheckCircle2,
  ChevronDown,
  Send,
  Trophy,
  Timer,
  PlayCircle,
} from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import CodingTestInstructions from "../components/CodingTestInstructions";
import CodingTestSubmitted from "../components/CodingTestSubmitted";
import AIVoicePanel from "../components/AIVoicePanel";
import { fetchCodingProblem } from "../api/codingTestUtils";

const CodingTest = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [testStarted, setTestStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [aiText, setAiText] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const timerRef = useRef(null);
  const dropdownRef = useRef(null);

  const languages = {
    python: {
      name: "Python",
      extension: python(),
      icon: "🐍",
      template: `# Start coding from here`,
    },
    javascript: {
      name: "JavaScript",
      extension: javascript(),
      icon: "⚡",
      template: ``,
    },
    cpp: {
      name: "C++",
      extension: cpp(),
      icon: "⚙️",
      template: ``,
    },
  };

  const languageIds = {
    python: 71,
    javascript: 63,
    cpp: 54,
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (testStarted && timeRemaining > 0 && !testCompleted) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTestCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [testStarted, timeRemaining, testCompleted]);

  useEffect(() => {
    const fetchProblem = async () => {
      const statement = await fetchCodingProblem(jobId);
      setProblemStatement(statement || "");
    };
    fetchProblem();
  }, [jobId]);

  // Helper to inject problem statement into code templates
  const getTemplateWithQuestion = (lang) => {
    const question = problemStatement
      ? problemStatement
      : "Problem statement will appear here.";
    if (lang === "python") {
      return `# ${question}\n\n# Start coding from here`;
    } else if (lang === "javascript") {
      return `/**\n * ${question}\n */\n\n// Start coding from here`;
    } else if (lang === "cpp") {
      return `// ${question}\n\n// Start coding from here`;
    }
    return languages[lang].template;
  };

  // Update code template when language or problem changes
  useEffect(() => {
    setCode(getTemplateWithQuestion(selectedLanguage));
  }, [selectedLanguage, problemStatement]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartTest = () => {
    setTestStarted(true);
    setCode(languages[selectedLanguage].template);
  };

  const handleLanguageChange = (language) => {
    if (!testCompleted) {
      setSelectedLanguage(language);
      setIsDropdownOpen(false);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("🚀 Compiling and executing your code...");

    try {
      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "Content-Type": "application/json",
            "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
          body: JSON.stringify({
            source_code: code,
            language_id: languageIds[selectedLanguage],
            stdin: "",
          }),
        }
      );

      const { token } = await response.json();

      let iterations = 0;
      const maxIterations = 10;
      const pollInterval = setInterval(async () => {
        try {
          const resultResponse = await fetch(
            `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            {
              headers: {
                "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              },
            }
          );

          const resultData = await resultResponse.json();

          if (resultData.status.id <= 2) {
            if (iterations >= maxIterations) {
              clearInterval(pollInterval);
              setOutput("⏱️ Execution timed out. Please try again.");
              setIsRunning(false);
            }
            iterations++;
            return;
          }

          clearInterval(pollInterval);

          if (resultData.stderr) {
            setOutput(`❌ Runtime Error:\n${resultData.stderr}`);
          } else if (resultData.compile_output) {
            setOutput(`🔨 Compilation Error:\n${resultData.compile_output}`);
          } else {
            setOutput(`✅ Output:\n${resultData.stdout || "No output"}`);
          }

          setIsRunning(false);
        } catch (error) {
          clearInterval(pollInterval);
          setOutput("❌ Error checking submission status");
          setIsRunning(false);
        }
      }, 1000);
    } catch (error) {
      setOutput("❌ Error submitting code");
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    console.log("Submitted code:", code);
  };

  if (isSubmitted) {
    return <CodingTestSubmitted navigate={navigate} />;
  }

  if (!testStarted) {
    return (
      <CodingTestInstructions
        jobId={jobId}
        navigate={navigate}
        handleStartTest={handleStartTest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
              <div>
                <h1 className="text-2xl font-bold text-white">Coding Round</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 text-sm">
                    Your Interview would be conducted by HiroBot
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-3xl font-mono font-bold ${
                  timeRemaining < 300 ? "text-red-400" : "text-blue-400"
                }`}
              >
                {formatTime(timeRemaining)}
              </div>
              <div className="flex items-center justify-end text-sm text-slate-400">
                <Clock className="w-4 h-4 mr-1" />
                Time Remaining
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-2">
        {/* Toolbar: full width, above code/AI row */}
        <div className="w-full mb-3">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-2 backdrop-blur-sm flex items-center">
            {/* Language Dropdown */}
            <div className="relative z-50" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={testCompleted}
                className="flex items-center space-x-3 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              >
                <span className="text-lg">
                  {languages[selectedLanguage].icon}
                </span>
                <span className="font-medium text-slate-200">
                  {languages[selectedLanguage].name}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-full min-w-[180px] bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden"
                  style={{ position: "absolute" }}
                >
                  {Object.entries(languages).map(([key, lang]) => (
                    <button
                      key={key}
                      onClick={() => handleLanguageChange(key)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-700/50 transition-colors ${
                        selectedLanguage === key
                          ? "bg-blue-500/20 text-blue-300"
                          : "text-slate-300"
                      }`}
                    >
                      <span className="text-lg">{lang.icon}</span>
                      <span className="font-medium">{lang.name}</span>
                      {selectedLanguage === key && (
                        <CheckCircle className="w-4 h-4 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Action Buttons */}
            <div className="flex items-center space-x-3 ml-auto">
              <button
                onClick={handleRunCode}
                disabled={isRunning || testCompleted}
                className="flex items-center space-x-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? "Running..." : "Run"}</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={testCompleted}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Submit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Code Editor + AI Voice Panel Row */}
        <div className="flex flex-col lg:flex-row gap-4 h-full">
          {/* Code Editor and Console (left) */}
          <div className="flex-1 flex flex-col space-y-3">
            {/* Code Editor */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="border-b border-slate-700/50 px-4 py-2 bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-300">
                      Code Editor
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              <CodeMirror
                value={code}
                height="400px"
                theme={oneDark}
                extensions={[languages[selectedLanguage].extension]}
                onChange={(value) => setCode(value)}
                editable={!testCompleted}
                className="text-sm"
              />
            </div>

            {/* Console Output */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="border-b border-slate-700/50 px-4 py-2 bg-slate-900/50">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">
                    Console
                  </span>
                </div>
              </div>
              <div className="p-3 bg-slate-900/30 min-h-[80px]">
                <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap">
                  {output ||
                    "// Click 'Run' to execute your code and see output here"}
                </pre>
              </div>
            </div>
          </div>
          {/* AI Voice Panel (right) */}
          <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col h-full">
            <AIVoicePanel jobId={jobId} />
          </div>
        </div>
      </div>

      {/* Time's Up Modal */}
      {testCompleted && !isSubmitted && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md mx-auto shadow-2xl">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30"></div>
                <Clock className="relative w-16 h-16 text-red-400 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Time's Up!</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                The coding challenge has ended. Please submit your current
                solution to complete the test.
              </p>
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg"
              >
                Submit Solution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingTest;
