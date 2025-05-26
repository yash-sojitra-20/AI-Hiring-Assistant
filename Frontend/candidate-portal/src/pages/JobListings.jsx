"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Clock, DollarSign } from "lucide-react";
import { getAllJobs } from "../api/job";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const userString = localStorage.getItem("candidate"); // Get the string from localStorage
        let userId = null;
        if (userString) {
          try {
            const user = JSON.parse(userString); // Parse the string as JSON
            userId = user.id; // Access the id from the parsed object
          } catch (parseError) {
            console.error(
              "Failed to parse user data from localStorage:",
              parseError
            );
            // Handle the case where localStorage data is invalid
            localStorage.removeItem("candidate"); // Clear invalid data
            // Optionally set an error state or redirect to login
          }
        }

        if (!userId) {
          console.warn("User ID not found in localStorage. Cannot fetch jobs.");
          // Optionally set an empty jobs array or redirect to login
          setJobs([]);
          setFilteredJobs([]);
          return;
        }

        const response = await getAllJobs(userId);
        // Map API response to component's expected structure
        const fetchedJobs = response.map((job) => ({
          id: job._id, // Use _id from backend as unique key
          title: job.job_title,
          company: job.hr_details?.hr_company || "N/A", // Use optional chaining for safety
          location: job.hr_details?.hr_location || "N/A",
          type: job.job_type,
          salary: job.job_salary
            ? `$${job.job_salary.toLocaleString()}`
            : "N/A", // Format salary
          description:
            job.hr_details?.hr_description || "No description provided.",
          requirements: job.job_des || [], // Ensure requirements is an array
          postedDate: job.posted_date, // Use posted_date
          applied: job.applied || false, // Use applied status
          // Remove logo as it's not in the API response
        }));
        setJobs(fetchedJobs);
        setFilteredJobs(fetchedJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        // Optionally set an error state to display a message to the user
      }
    };

    fetchJobs();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements.some((req) =>
          req.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find Your Dream Job
        </h1>
        <p className="text-gray-600">
          Discover opportunities that match your skills and interests
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search jobs, companies, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            onClick={() => handleJobClick(job.id)}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer p-6 relative" // Added relative positioning
          >
            {job.applied && (
              <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Applied
              </span>
            )}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {/* Removed logo display */}
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {job.title}
                  </h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-2" />
                {job.location}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                {job.type}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <DollarSign className="h-4 w-4 mr-2" />
                {job.salary}
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.requirements.slice(0, 3).map((req, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                >
                  {req}
                </span>
              ))}
              {job.requirements.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  +{job.requirements.length - 3} more
                </span>
              )}
            </div>

            <div className="text-xs text-gray-400">
              Posted {new Date(job.postedDate).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default JobListings;
