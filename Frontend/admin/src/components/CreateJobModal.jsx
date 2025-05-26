import React, { useState } from "react";
import { X } from "lucide-react";
import { createJob } from "../api/job";

export default function CreateJobModal({ isOpen, onClose, onCreateJob }) {
  const [jobData, setJobData] = useState({
    job_title: "",
    job_department: "",
    job_type: "Full-time",
    job_des: "",
    job_applicant: 0,
    posted_date: new Date().toISOString().split("T")[0],
    open_date: "",
    close_date: "",
    problem_statements: "",
    job_salary: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Basic validation
    if (
      !jobData.job_title ||
      !jobData.job_department ||
      !jobData.job_type ||
      !jobData.job_des ||
      !jobData.open_date ||
      !jobData.close_date ||
      !jobData.problem_statements ||
      !jobData.job_salary
    ) {
      alert("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }
    // Prepare payload
    const hr = JSON.parse(localStorage.getItem("hr"));
    const hr_id = hr?.id || hr?._id || hr?.hr_id;
    const payload = {
      job_title: jobData.job_title,
      job_department: jobData.job_department,
      job_type: jobData.job_type,
      job_des: jobData.job_des.split(",").map((s) => s.trim()),
      job_applicant: Number(jobData.job_applicant) || 0,
      posted_date: jobData.posted_date,
      open_date: jobData.open_date,
      close_date: jobData.close_date,
      problem_statements: jobData.problem_statements
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      hr_id,
      job_salary: Number(jobData.job_salary),
    };
    try {
      const created = await createJob(payload);
      onCreateJob(created);
      setJobData({
        job_title: "",
        job_department: "",
        job_type: "Full-time",
        job_des: "",
        job_applicant: 0,
        posted_date: new Date().toISOString().split("T")[0],
        open_date: "",
        close_date: "",
        problem_statements: "",
        job_salary: "",
      });
      onClose();
    } catch (err) {
      alert("Failed to create job. Please try again.");
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl mx-auto max-h-[90vh] overflow-y-auto relative">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            Create New Job Posting
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Title*
                </label>
                <input
                  required
                  type="text"
                  name="job_title"
                  value={jobData.job_title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Backend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Department*
                </label>
                <input
                  required
                  type="text"
                  name="job_department"
                  value={jobData.job_department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Engineering"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Type*
                </label>
                <select
                  required
                  name="job_type"
                  value={jobData.job_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Skills (comma separated)*
                </label>
                <input
                  required
                  type="text"
                  name="job_des"
                  value={jobData.job_des}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Python, FastAPI, MongoDB"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Number of Applicants
                </label>
                <input
                  type="number"
                  name="job_applicant"
                  value={jobData.job_applicant}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 10"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Salary (in USD)*
                </label>
                <input
                  required
                  type="number"
                  name="job_salary"
                  value={jobData.job_salary}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 80000"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Open Date*
                </label>
                <input
                  required
                  type="date"
                  name="open_date"
                  value={jobData.open_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Close Date*
                </label>
                <input
                  required
                  type="date"
                  name="close_date"
                  value={jobData.close_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Problem Statements (one per line)*
                </label>
                <textarea
                  required
                  name="problem_statements"
                  value={jobData.problem_statements}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder={
                    "e.g.\nBuild a REST API\nOptimize database queries"
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center min-w-[110px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                    Creating...
                  </>
                ) : (
                  "Create Job"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
