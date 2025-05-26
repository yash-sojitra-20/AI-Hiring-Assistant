import { Users, Calendar, TrendingUp, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const Dashboard = () => {
  const stats = [
    {
      name: "New Applications Today",
      value: "24",
      change: "+12%",
      changeType: "increase",
      icon: Users,
    },
    {
      name: "Interviews Scheduled",
      value: "8",
      change: "+4%",
      changeType: "increase",
      icon: Calendar,
    },
    {
      name: "Top Candidates",
      value: "156",
      change: "-2%",
      changeType: "decrease",
      icon: TrendingUp,
    },
    {
      name: "Avg. Time to Hire",
      value: "18 days",
      change: "-8%",
      changeType: "increase",
      icon: Clock,
    },
  ]

  const applicationData = [
    { name: "Mon", applications: 12 },
    { name: "Tue", applications: 19 },
    { name: "Wed", applications: 8 },
    { name: "Thu", applications: 24 },
    { name: "Fri", applications: 15 },
    { name: "Sat", applications: 6 },
    { name: "Sun", applications: 4 },
  ]

  const statusData = [
    { name: "Applied", value: 45, color: "#3B82F6" },
    { name: "Shortlisted", value: 25, color: "#10B981" },
    { name: "Interviewed", value: 20, color: "#F59E0B" },
    { name: "Hired", value: 10, color: "#8B5CF6" },
  ]

  const recentApplications = [
    { name: "John Smith", position: "Frontend Developer", score: 92, time: "2 hours ago" },
    { name: "Emily Davis", position: "UX Designer", score: 88, time: "4 hours ago" },
    { name: "Michael Chen", position: "Backend Developer", score: 95, time: "6 hours ago" },
    { name: "Sarah Wilson", position: "Product Manager", score: 85, time: "8 hours ago" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your hiring process.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            item.changeType === "increase" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {item.changeType === "increase" ? (
                            <ArrowUpRight className="h-4 w-4 flex-shrink-0 self-center" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 flex-shrink-0 self-center" />
                          )}
                          <span className="sr-only">
                            {item.changeType === "increase" ? "Increased" : "Decreased"} by
                          </span>
                          {item.change}
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Applications This Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={applicationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Funnel */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hiring Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentApplications.map((application, index) => (
            <div key={index} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {application.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{application.name}</p>
                  <p className="text-sm text-gray-500">{application.position}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Match Score: {application.score}%</p>
                  <p className="text-sm text-gray-500">{application.time}</p>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    application.score >= 90
                      ? "bg-green-100 text-green-800"
                      : application.score >= 80
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {application.score >= 90 ? "Excellent" : application.score >= 80 ? "Good" : "Fair"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
