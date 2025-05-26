"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Users, Clock, Target } from "lucide-react"

const Insights = () => {
  const [timeFilter, setTimeFilter] = useState("30days")
  const [jobFilter, setJobFilter] = useState("all")

  const metrics = [
    {
      name: "Total Applications",
      value: "1,234",
      change: "+12%",
      changeType: "increase",
      icon: Users,
    },
    {
      name: "Average Time to Hire",
      value: "18 days",
      change: "-8%",
      changeType: "decrease",
      icon: Clock,
    },
    {
      name: "Interview Success Rate",
      value: "68%",
      change: "+5%",
      changeType: "increase",
      icon: Target,
    },
    {
      name: "Offer Acceptance Rate",
      value: "85%",
      change: "+3%",
      changeType: "increase",
      icon: TrendingUp,
    },
  ]

  const applicationSources = [
    { name: "LinkedIn", applications: 450, color: "#0077B5" },
    { name: "Indeed", applications: 320, color: "#2557A7" },
    { name: "Company Website", applications: 280, color: "#10B981" },
    { name: "Referrals", applications: 184, color: "#F59E0B" },
  ]

  const hiringFunnel = [
    { stage: "Applied", count: 1234 },
    { stage: "Screened", count: 456 },
    { stage: "Interviewed", count: 234 },
    { stage: "Offered", count: 89 },
    { stage: "Hired", count: 67 },
  ]

  const timeToHireData = [
    { month: "Jan", days: 22 },
    { month: "Feb", days: 19 },
    { month: "Mar", days: 21 },
    { month: "Apr", days: 18 },
    { month: "May", days: 16 },
    { month: "Jun", days: 18 },
  ]

  const topPerformingJobs = [
    { position: "Frontend Developer", applications: 234, hires: 12, successRate: 5.1 },
    { position: "Backend Developer", applications: 189, hires: 8, successRate: 4.2 },
    { position: "UX Designer", applications: 156, hires: 6, successRate: 3.8 },
    { position: "Product Manager", applications: 98, hires: 4, successRate: 4.1 },
    { position: "Data Scientist", applications: 87, hires: 3, successRate: 3.4 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insights & Reports</h1>
          <p className="text-gray-600">Analytics and performance metrics for your hiring process</p>
        </div>
        <div className="flex space-x-2">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
          >
            <option value="all">All Jobs</option>
            <option value="engineering">Engineering</option>
            <option value="design">Design</option>
            <option value="product">Product</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{metric.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{metric.value}</div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            metric.changeType === "increase" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {metric.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Sources */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Application Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applicationSources}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applications" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hiring Funnel */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hiring Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hiringFunnel} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time to Hire Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Time to Hire Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeToHireData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="days" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Application Sources Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Application Sources Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={applicationSources}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="applications"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {applicationSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Jobs Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Performing Job Positions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topPerformingJobs.map((job, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.applications}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.hires}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.successRate}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(job.successRate / 6) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {job.successRate > 4 ? "Excellent" : job.successRate > 3 ? "Good" : "Average"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Insights
