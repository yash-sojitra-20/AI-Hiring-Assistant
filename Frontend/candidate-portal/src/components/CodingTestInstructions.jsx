import React from "react";
import { ArrowLeft, Code, Timer, PlayCircle } from "lucide-react";

const CodingTestInstructions = ({ jobId, navigate, handleStartTest }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(`/job/${jobId}`)}
          className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Job Details
        </button>

        <div className="backdrop-blur-sm bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 shadow-2xl mt-20">
          <div className="mb-4 text-center">
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20"></div>
              <Code className="relative w-16 h-16 text-blue-400 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              Coding Challenge
            </h1>
            <p className="text-slate-400 text-base mt-1">
              Showcase your algorithmic thinking and problem-solving skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-5">
            <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
              <h3 className="font-bold text-lg mb-2 text-white">
                Challenge Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-slate-300">
                  <Timer className="w-5 h-5 mr-2 text-blue-400" />
                  <span>30-minute time limit</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Code className="w-5 h-5 mr-2 text-blue-400" />
                  <span>Multiple language support</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <PlayCircle className="w-5 h-5 mr-2 text-blue-400" />
                  <span>Test & debug your solution</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
              <h3 className="font-bold text-lg mb-2 text-white">
                Instructions
              </h3>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>• Read the problem statement carefully</li>
                <li>• Choose your preferred programming language</li>
                <li>• Implement and test your solution</li>
                <li>• Submit before time expires</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleStartTest}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-semibold text-base transition-all duration-200 shadow-md hover:shadow-blue-500/25 transform hover:scale-[1.01] mt-2"
          >
            Start Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodingTestInstructions;
