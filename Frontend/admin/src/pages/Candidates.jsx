"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  MessageCircle,
  Calendar,
  Eye,
  Star,
  Github,
  Linkedin,
} from "lucide-react";
import { getAllJobs } from "../api/job";
import { getAllCandidates } from "../api/candidate";

const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    // Fetch all jobs for the HR
    const hr = JSON.parse(localStorage.getItem("hr"));
    const hrId = hr?.id || hr?._id || hr?.hr_id;
    if (!hrId) return;
    getAllJobs(hrId)
      .then(setJobs)
      .catch(() => setJobs([]));
  }, []);

  useEffect(() => {
    if (!selectedJobId) return;
    getAllCandidates(selectedJobId)
      .then(setCandidates)
      .catch(() => setCandidates([]));
  }, [selectedJobId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800";
      case "Shortlisted":
        return "bg-yellow-100 text-yellow-800";
      case "Interviewed":
        return "bg-purple-100 text-purple-800";
      case "Hired":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const name = candidate.resume_detail?.name || "";
    const position = candidate.resume_detail?.position || "";
    const email = candidate.resume_detail?.email || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (candidate.status || "").toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Candidate Management
          </h1>
          <p className="text-gray-600">
            Review and manage candidate applications
          </p>
        </div>
        <div>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            <option value="">Select Job</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.job_title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewed">Interviewed</option>
              <option value="hired">Hired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate._id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                  {candidate.resume_detail?.name
                    ? candidate.resume_detail.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {candidate.resume_detail?.name || "Unknown"}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {candidate.resume_detail?.email || "-"}
                  </p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      candidate.status
                    )}`}
                  >
                    {candidate.status || "-"}
                  </span>
                </div>
              </div>

              {/* Score Section */}
              <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="text-center flex-1">
                  <div
                    className={`text-lg font-bold ${getScoreColor(
                      candidate.resume_score
                    )}`}
                  >
                    {candidate.resume_score || "-"}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Match Score</div>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-center flex-1">
                  <div className="text-lg font-bold text-gray-900">
                    {candidate.resume_detail?.skills?.length || 0}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Skills</div>
                </div>
              </div>

              {/* Skills Preview */}
              {candidate.resume_detail?.skills?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1">
                  {candidate.resume_detail.skills
                    .slice(0, 3)
                    .map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-xs font-medium text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                  {candidate.resume_detail.skills.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 text-xs font-medium text-gray-600">
                      +{candidate.resume_detail.skills.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex items-center gap-2">
                <Link
                  to={`/admin/candidates/${candidate._id}`}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </Link>
                <button className="inline-flex items-center justify-center p-2 border border-gray-200 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-50">
                  <Calendar className="w-4 h-4" />
                </button>
                <button className="inline-flex items-center justify-center p-2 border border-gray-200 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-50">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Applied:{" "}
                    {new Date(candidate.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-3">
                    {candidate.resume_detail?.github && (
                      <a
                        href={candidate.resume_detail.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-600 transition-colors flex items-center"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {candidate.resume_detail?.linkedin && (
                      <a
                        href={candidate.resume_detail.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-600 transition-colors flex items-center"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Candidates;
