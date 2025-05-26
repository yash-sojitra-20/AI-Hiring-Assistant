import React from "react";
import { CheckCircle2, Trophy } from "lucide-react";

const CodingTestSubmitted = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-8 text-center shadow-2xl">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl opacity-30"></div>
            <Trophy className="relative w-20 h-20 text-emerald-400 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Solution Submitted!
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Excellent work! Your solution has been submitted successfully. Our
            technical team will review your code and provide feedback shortly.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodingTestSubmitted;
