"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Calendar,
  Star,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
} from "lucide-react";
import { getCandidateById, getCandidateResume } from "../api/candidate";

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const data = await getCandidateById(id);
        setCandidate(data);
      } catch (err) {
        setError(err.message || "Failed to fetch candidate data");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const handleDownloadResume = async () => {
    try {
      setDownloading(true);
      const blob = await getCandidateResume(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = candidate.resume_filename || "resume.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download resume:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/admin/candidates")}
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Candidates
          </button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">Candidate Not Found</div>
          <button
            onClick={() => navigate("/admin/candidates")}
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Candidates
          </button>
        </div>
      </div>
    );
  }

  // Transform the candidate data to match the component's expectations
  const transformedCandidate = {
    id: candidate._id,
    name: candidate.resume_detail?.name || "Unknown",
    email: candidate.resume_detail?.email || "-",
    phone: candidate.resume_detail?.phone || "-",
    position: candidate.resume_detail?.position || "-",
    location: candidate.resume_detail?.location || "Remote",
    resumeMatch: candidate.resume_score || 0,
    technicalScore: candidate.technical_score || 0,
    appliedDate: candidate.created_at,
    updatedDate: candidate.updated_at,
    status: candidate.status || "Applied",
    resumeFilename: candidate.resume_filename,
    avatar: candidate.resume_detail?.name
      ? candidate.resume_detail.name
          .split(" ")
          .map((n) => n[0])
          .join("")
      : "?",
    experience: candidate.resume_detail?.experience || "-",
    linkedin: candidate.resume_detail?.linkedin || "",
    github: candidate.resume_detail?.github || "",
    portfolio: candidate.resume_detail?.portfolio || "",
    summary: candidate.resume_detail?.summary || "No summary available",
    skills: candidate.resume_detail?.skills || [],
    workExperience:
      candidate.resume_detail?.workExperience?.map((exp) => ({
        company: exp.company || "-",
        position: exp.position || "-",
        duration: exp.duration || "-",
        description: exp.description || "-",
      })) || [],
    education:
      candidate.resume_detail?.education?.map((edu) => ({
        degree: edu.degree || "-",
        school: edu.school || "-",
        year: edu.year || "-",
      })) || [],
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/admin/candidates")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Candidate Profile
          </h1>
          <p className="text-gray-600">
            Detailed view of candidate information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl font-medium text-blue-800">
                    {transformedCandidate.avatar}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {transformedCandidate.name}
                  </h2>
                  <p className="text-gray-600">
                    {transformedCandidate.position}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{transformedCandidate.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Interview</span>
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    transformedCandidate.resumeMatch
                  )}`}
                >
                  {transformedCandidate.resumeMatch}%
                </div>
                <div className="text-sm text-gray-500">Resume Match</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    transformedCandidate.technicalScore
                  )}`}
                >
                  {transformedCandidate.technicalScore}%
                </div>
                <div className="text-sm text-gray-500">Technical Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {/* {transformedCandidate.experience} */}
                </div>
                <div className="text-sm text-gray-500">Experience</div>
              </div>
              <div className="text-center">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                    transformedCandidate.status
                  )}`}
                >
                  {transformedCandidate.status}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">
                  {transformedCandidate.email}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">
                  {transformedCandidate.phone}
                </span>
              </div>
              {transformedCandidate.linkedin && (
                <div className="flex items-center space-x-3">
                  <Linkedin className="h-5 w-5 text-gray-400" />
                  <a
                    href={transformedCandidate.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {transformedCandidate.github && (
                <div className="flex items-center space-x-3">
                  <Github className="h-5 w-5 text-gray-400" />
                  <a
                    href={transformedCandidate.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    GitHub Profile
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
            <p className="text-gray-700">{transformedCandidate.summary}</p>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {transformedCandidate.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Work Experience
            </h3>
            <div className="space-y-4">
              {transformedCandidate.workExperience.map((job, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <h4 className="font-medium text-gray-900">{job.position}</h4>
                  {/* <p className="text-blue-600">{job.company}</p> */}
                  {/* <p className="text-sm text-gray-500">{job.duration}</p> */}
                  <p className="text-gray-700 mt-2">{job.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Resume */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resume</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="text-gray-400 mb-2">
                <Download className="h-8 w-8 mx-auto" />
              </div>
              <p className="text-sm text-gray-600">
                {transformedCandidate.resumeFilename ||
                  `${transformedCandidate.name}'s Resume`}
              </p>
              <button
                onClick={handleDownloadResume}
                disabled={downloading}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? "Downloading..." : "Download Resume"}
              </button>
            </div>
          </div>

          {/* Notes */}
          {/* <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Add your notes about this candidate..."
              value={candidate.notes || ""}
              disabled
            ></textarea>
            <button
              className="mt-2 bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Save Notes
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Notes functionality coming soon
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
