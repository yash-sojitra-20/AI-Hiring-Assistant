"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Upload,
  CheckCircle,
  Code,
} from "lucide-react";
import { getJobById } from "../api/job";
import { createCandidate } from "../api/candidate";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);

  const userId = localStorage.getItem("user");
  const candidate = userId ? JSON.parse(userId) : null;

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await getJobById(id, candidate?.id || null);
        // Map API response to component's expected structure
        const fetchedJob = {
          id: response._id, // Use _id from backend as unique key
          title: response.job_title,
          company: response.hr_details?.hr_company || "N/A", // Use optional chaining for safety
          location: response.hr_details?.hr_location || "N/A",
          type: response.job_type,
          applied: response.applied || false, // Use applied status
          status: response.status || "1", // Use status from API
          salary: response.job_salary
            ? `$${response.job_salary.toLocaleString()}`
            : "N/A", // Format salary
          description:
            response.hr_details?.hr_description || "No description provided.",
          requirements: response.job_des || [], // Ensure requirements is an array
          postedDate: response.posted_date, // Use posted_date
          // Remove logo as it's not in the API response
          // Determine if coding test is available based on problem_statements
          hasCodingTest:
            response.problem_statements &&
            response.problem_statements.length > 0,
        };
        setJob(fetchedJob);
      } catch (error) {
        console.error(`Failed to fetch job details for ID ${id}:`, error);
        // Optionally set an error state to display a message to the user
        setJob(null); // Set job to null to show loading/error state
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]); // Rerun effect if the job ID changes

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setUploadStatus("uploading");
      setUploadProgress(0);

      if (!candidate || !candidate.id) {
        console.error("User ID not found in localStorage.");
        setUploadStatus("error");
        // Optionally set an error message for the user
        return;
      }

      const formData = new FormData();
      formData.append("job_id", id); // job_id from useParams
      formData.append("user_id", candidate.id); // user_id from localStorage
      formData.append("resume", file); // The resume file

      try {
        // Simulate upload progress (optional, can be removed if backend provides progress)
        // const interval = setInterval(() => {
        //   setUploadProgress((prev) => {
        //     if (prev >= 100) {
        //       clearInterval(interval);
        //       return 100;
        //     }
        //     return prev + 10;
        //   });
        // }, 200);

        const response = await createCandidate(formData);
        console.log("Candidate created successfully:", response);

        // clearInterval(interval); // Clear simulated interval on success
        setUploadProgress(100); // Set progress to 100% on success
        setUploadStatus("success");
        // Handle success response, e.g., show a success message
      } catch (error) {
        console.error("Error creating candidate:", error);
        // clearInterval(interval); // Clear simulated interval on error
        setUploadProgress(0); // Reset progress on error
        setUploadStatus("error");
        // Handle error response, e.g., show an error message to the user
      }
    }
  };

  const handleCodingTest = () => {
    navigate(`/coding-test/${id}`);
  };

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Job Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start space-x-4 mb-6">
              {/* Removed logo display */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h1>
                <p className="text-xl text-gray-600 mb-4">{job.company}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.type}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {job.salary}
                  </div>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Company Description
              </h3>
              <div className="text-gray-600 whitespace-pre-line">
                {job.description}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.requirements.map((req, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Application Panel */}
        <div className="space-y-6">
          {/* Resume Upload */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Apply for this Position
            </h3>

            {job.applied ? (
              // Show already applied message if job.applied is true
              <div className="text-center text-green-600 font-medium py-6">
                <CheckCircle className="h-8 w-8 mx-auto mb-3" />
                <p>You have already applied for this job.</p>
              </div>
            ) : (
              // Show upload UI if job.applied is false
              <>
                {uploadStatus === "idle" && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-3">
                      Upload your resume
                    </p>
                    <label className="cursor-pointer">
                      <span className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        Choose File
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {uploadStatus === "uploading" && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-600">
                        Uploading {uploadedFile?.name}...
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {uploadProgress}% complete
                    </div>
                  </div>
                )}

                {uploadStatus === "success" && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        Resume uploaded successfully!
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>File:</strong> {uploadedFile?.name}
                    </div>
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                      Application Submitted
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Coding Test / Application Status */}
          {job.applied ? (
            // If already applied
            job.status === "shortlisted" && job.hasCodingTest ? (
              // If shortlisted and has coding test, show coding test div
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Next Step: Coding Test
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Complete a coding assessment to demonstrate your technical
                  skills.
                </p>
                <button
                  onClick={handleCodingTest}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Code className="h-4 w-4" />
                  <span>Start Coding Test</span>
                </button>
              </div>
            ) : job.status === "not_selected" ? (
              // If not selected, show not selected message
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center text-red-600 font-medium">
                <p>
                  Your application was not selected for the next stage at this
                  time.
                </p>
              </div>
            ) : // Applied but status is neither shortlisted nor not_selected
            // Show nothing or a pending message? Showing nothing for now.
            null
          ) : (
            // If not applied, keep existing logic (show coding test if upload success and hasCodingTest)
            job.hasCodingTest &&
            uploadStatus === "success" && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Next Step: Coding Test
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Complete a coding assessment to demonstrate your technical
                  skills.
                </p>
                <button
                  onClick={handleCodingTest}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Code className="h-4 w-4" />
                  <span>Start Coding Test</span>
                </button>
              </div>
            )
          )}

          {/* Company Info */}
          {/* <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              About {job.company}
            </h3>
            <p className="text-sm text-gray-600">
              TechCorp Inc. is a leading technology company focused on building
              innovative solutions for the modern world. We value creativity,
              collaboration, and continuous learning.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
