import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { fetchJobDetails } from "../api/codingTestUtils";
import { createFeedback } from "../api/job";

const apiKey =
  import.meta.env.VITE_VAPI_PUBLIC_API_KEY ||
  process.env.VITE_VAPI_PUBLIC_API_KEY;

// Assistant configuration
const baseAssistantConfig = {
  name: "Hiro",
  voice: {
    model: "tts-1",
    voiceId: "alloy",
    provider: "openai",
  },
  model: {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "[Identity]  \nYou are a professional and insightful interviewer, focused on assessing candidates' technical skills.\n\n[Style]  \n- Use a formal and respectful tone.  \n- Be clear and concise with your questions.  \n- Encourage candidates with polite remarks.\n\n[Response Guidelines]  \n- Ask one question at a time and wait for the candidate's response before proceeding.  \n- Use plain language while framing questions to ensure clarity.  \n\n[Task & Goals]  \n1. Begin by greeting the candidate and introducing yourself.  \n2. Select two topics from the list [javascript, python, java, react, mongodb].  \n3. Ask the first technical question related to the first selected topic.  \n   < wait for candidate response >  \n4. Acknowledge the candidate's response and proceed with the second technical question related to the second selected topic.  \n   < wait for candidate response >  \n5. After both questions are answered, thank the candidate for their responses.  \n6. Conclude with polite regards and end the call.\n\n[Error Handling / Fallback]  \n- If the candidate requests clarification on a question, provide a brief explanation to assist them.  \n- If the candidate struggles with a question, offer encouragement and suggest they move to the next question.  \n- In case of technical issues or if the candidate is unable to hear, politely inform them of the issue and suggest rescheduling if necessary.",
      },
    ],
    provider: "openai",
  },
};

const AIVoicePanel = ({ jobId }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [fullConversation, setFullConversation] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [callStatus, setCallStatus] = useState("idle");
  const [jobQuestions, setJobQuestions] = useState([]);
  const vapiRef = useRef(null);

  useEffect(() => {
    // Fetch job questions on mount (or when jobId changes)
    const fetchQuestions = async () => {
      if (!jobId) return;
      const job = await fetchJobDetails(jobId);
      console.log("Fetched job details:", job);
      if (job && job.job_questions) {
        setJobQuestions(job.job_questions);
      }
    };
    fetchQuestions();
  }, [jobId]);

  const addToTranscript = (speaker, message, timestamp = new Date()) => {
    setTranscript((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        speaker,
        message,
        timestamp: timestamp.toLocaleTimeString(),
      },
    ]);
  };

  // Dynamically build the prompt with job_questions
  const dynamicPrompt = `
[Identity]  
You are a professional and insightful interviewer, focused on assessing candidates' technical skills.

[Style]  
- Use a formal and respectful tone.  
- Be clear and concise with your questions.  
- Encourage candidates with polite remarks.

[Response Guidelines]  
- Ask one question at a time and wait for the candidate's response before proceeding.  
- Use plain language while framing questions to ensure clarity.  

[Task & Goals]  
1. Begin by greeting the candidate and introducing yourself.  
2. Ask the following questions in order, one at a time, from this list: ${JSON.stringify(
    jobQuestions
  )}.  
   < wait for candidate response >  
3. After all questions are answered, thank the candidate for their responses.  
4. Conclude with polite regards and end the call.

[Error Handling / Fallback]  
- If the candidate requests clarification on a question, provide a brief explanation to assist them.  
- If the candidate struggles with a question, offer encouragement and suggest they move to the next question.  
- In case of technical issues or if the candidate is unable to hear, politely inform them of the issue and suggest rescheduling if necessary.`;

  // Use dynamicPrompt in assistantConfig
  const assistantConfig = {
    ...baseAssistantConfig,
    model: {
      ...baseAssistantConfig.model,
      messages: [
        {
          role: "system",
          content: dynamicPrompt,
        },
      ],
    },
    firstMessage:
      "Hello, I am your Interviewer and I'll be asking you some technical questions, are you ready ?",
    voicemailMessage: "Please call back when you're available.",
    endCallMessage: "Goodbye.",
    transcriber: {
      model: "nova-3",
      language: "en",
      provider: "deepgram",
    },
    silenceTimeoutSeconds: 15,
    maxDurationSeconds: 270,
    analysisPlan: baseAssistantConfig.analysisPlan,
  };

  const handleStartInterview = () => {
    if (!apiKey) {
      addToTranscript(
        "System",
        "❌ Vapi API key is missing. Check your .env file and restart the dev server."
      );
      return;
    }

    setIsLoading(true);
    setCallStatus("connecting");

    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    // Handle call start
    vapi.on("call-start", () => {
      console.log("Call has started");
      setIsConnected(true);
      setIsLoading(false);
      setShowAnimation(true);
      setCallStatus("active");
      addToTranscript("System", "🟢 Call connected successfully");
    });

    // Handle call end
    vapi.on("call-end", async () => {
      console.log("Call has ended");
      console.log("Full conversation history:", fullConversation);
      setIsConnected(false);
      setShowAnimation(false);
      setCallStatus("idle");
      addToTranscript("System", "🔴 Call ended");
      // Send feedback to backend
      try {
        // DEBUG: Log jobId, fullConversation, and userId
        console.log("jobId:", jobId);
        console.log("fullConversation:", fullConversation);
        const userString =
          localStorage.getItem("candidate") || localStorage.getItem("user");
        let userId = null;
        if (userString) {
          try {
            const user = JSON.parse(userString);
            userId = user.id;
          } catch (e) {
            console.error("Failed to parse user from localStorage", e);
          }
        }
        console.log("userId:", userId);
        if (jobId && userId && fullConversation) {
          await createFeedback(jobId, userId, {
            conversation: fullConversation,
          });
          console.log("Feedback sent to backend");
        } else {
          console.warn(
            "Feedback not sent: missing jobId, userId, or fullConversation"
          );
        }
      } catch (err) {
        console.error("Failed to send feedback:", err);
      }
    });

    // Handle speech events
    vapi.on("speech-start", () => {
      console.log("Speech has started");
      setCallStatus("speaking");
    });

    vapi.on("speech-end", () => {
      console.log("Speech has ended");
      setCallStatus("active");
    });

    vapi.on("volume-level", (volume) => {
      console.log(`Assistant volume level: ${volume}`);
    });

    // Handle all messages including transcripts
    vapi.on("message", (message) => {
      console.log("Received message:", message);
      switch (message.type) {
        case "transcript":
          if (message.transcriptType === "final") {
            // User's speech transcript
            if (message.transcript && message.transcript.trim()) {
              addToTranscript("Human", message.transcript);
            }
          }
          break;

        case "assistant-response":
          // Assistant's response
          if (message.response && message.response.trim()) {
            // For assistant responses, always use "Hiro" as the speaker
            addToTranscript("Hiro", message.response);
          }
          break;

        case "message":
          // Handle regular messages with role information
          if (message.message?.content && message.message.content.trim()) {
            const speaker = message.message.role === "user" ? "Human" : "Hiro";
            addToTranscript(speaker, message.message.content);
          }
          break;

        case "function-call":
          // Function calls
          addToTranscript(
            "System",
            `🔧 Function called: ${message.functionCall?.name || "Unknown"}`
          );
          break;

        case "hang":
          addToTranscript("System", "⏸️ Call paused");
          break;

        case "error":
          addToTranscript(
            "System",
            `❌ Error: ${message.error?.message || "Unknown error"}`
          );
          break;

        case "conversation-update":
          console.log("Entire conversation update:", message);
          setFullConversation(message.conversation);
          break;

        default:
          // Handle any other message types
          if (message.message?.content) {
            // Check message role to determine the speaker
            const speaker = message.message.role === "user" ? "Human" : "Hiro";
            addToTranscript(speaker, message.message.content);
          }
      }
    });

    // Handle errors
    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      setIsLoading(false);
      setCallStatus("idle");
      addToTranscript(
        "System",
        `❌ Error: ${error.message || "Connection failed"}`
      );
    });

    // Start the call with dynamic assistant configuration
    try {
      vapi.start(assistantConfig);
      addToTranscript("System", "📞 Initiating call with dynamic assistant...");
    } catch (error) {
      console.error("Failed to start call:", error);
      setIsLoading(false);
      setCallStatus("idle");
      addToTranscript("System", `❌ Failed to start call: ${error.message}`);
    }
  };

  const handleStopInterview = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      vapiRef.current = null;
    }
    setShowAnimation(false);
    setIsConnected(false);
    setIsLoading(false);
    setCallStatus("idle");
  };

  const clearTranscript = () => {
    setTranscript([]);
  };

  const getButtonIcon = () => {
    if (isLoading) return <Mic className="animate-pulse" />;
    if (isConnected) return <PhoneOff />;
    return <Phone />;
  };

  const getButtonText = () => {
    if (isLoading) return "Connecting...";
    if (isConnected) return "End Call";
    return "Start Interview";
  };

  const getStatusColor = () => {
    switch (callStatus) {
      case "connecting":
        return "bg-yellow-500";
      case "active":
        return "bg-green-500";
      case "speaking":
        return "bg-blue-500 animate-pulse";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex flex-col h-full items-center w-full space-y-4">
      {/* Control Buttons */}
      <div className="flex gap-3">
        <button
          onClick={isConnected ? handleStopInterview : handleStartInterview}
          disabled={isLoading}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            isConnected
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {getButtonIcon()}
          {getButtonText()}
        </button>

        {transcript.length > 0 && (
          <button
            onClick={clearTranscript}
            className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
          >
            Clear
          </button>
        )}
      </div>

      {/* Animation Container */}
      <div className="w-full aspect-square max-w-[340px] flex items-center justify-center relative overflow-hidden mb-4 border border-slate-700/40 rounded-xl">
        {showAnimation && (
          <>
            <span className="absolute w-2/3 h-2/3 min-w-24 min-h-24 bg-gradient-to-br from-[#00E5FF]/30 to-[#7C4DFF]/20 rounded-full animate-ai-pulse1" />
            <span className="absolute w-1/2 h-1/2 min-w-16 min-h-16 bg-gradient-to-tr from-[#4FC3F7]/40 to-[#00B8D4]/10 rounded-full animate-ai-pulse2" />
            <span className="absolute w-1/3 h-1/3 min-w-10 min-h-10 bg-gradient-to-tl from-[#00B8D4]/30 to-[#7C4DFF]/10 rounded-full animate-ai-pulse3" />
            <span className="absolute w-1/6 h-1/6 min-w-6 min-h-6 bg-gradient-to-br from-[#00E5FF]/60 to-[#4FC3F7]/30 rounded-full animate-ai-pulse4" />
          </>
        )}
        <span className="relative z-10 flex items-center justify-center w-20 h-20 bg-[#181F2A] border-4 border-[#00E5FF]/60 rounded-full shadow-lg">
          <Sparkles
            className={
              callStatus === "speaking" ? "animate-pulse text-blue-400" : ""
            }
          />
        </span>
      </div>

      {/* Transcript Display - Subtitle Style */}
      <div className="w-full h-32 bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 text-blue-100 overflow-hidden relative">
        {transcript.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-slate-400 text-center text-sm">
              Voice transcripts will appear here...
            </span>
          </div>
        ) : (
          <div className="absolute bottom-4 left-4 right-4 space-y-1">
            {transcript.slice(-4).map((entry, index) => (
              <div
                key={entry.id}
                className={`transition-all duration-300 ${
                  index === transcript.slice(-4).length - 1
                    ? "opacity-100"
                    : "opacity-60"
                }`}
                style={{
                  opacity: Math.max(
                    0.2,
                    1 - (transcript.slice(-4).length - 1 - index) * 0.3
                  ),
                }}
              >
                <p
                  className={`text-sm leading-tight ${
                    entry.speaker === "Human"
                      ? "text-blue-300"
                      : entry.speaker === "System"
                      ? "text-gray-400 text-xs"
                      : entry.speaker === "Hiro"
                      ? "text-green-300"
                      : "text-slate-300"
                  }`}
                >
                  {" "}
                  <span className="font-medium">
                    {entry.speaker === "user"
                      ? "You:"
                      : entry.speaker === ""
                      ? "Hiro:"
                      : entry.speaker + ":"}
                  </span>{" "}
                  {entry.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIVoicePanel;
