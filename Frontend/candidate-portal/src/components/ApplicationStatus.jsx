import { CheckCircle, Clock, AlertCircle, FileText, Code, Users, Calendar } from "lucide-react"

const ApplicationStatus = () => {
  const applicationData = {
    position: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    appliedDate: "2024-01-15",
    status: "in-review",
    currentStep: 2,
  }

  const steps = [
    {
      id: 1,
      title: "Application Submitted",
      description: "Your application has been received",
      status: "completed",
      date: "2024-01-15",
      icon: FileText,
    },
    {
      id: 2,
      title: "Resume Review",
      description: "HR team is reviewing your resume",
      status: "in-progress",
      date: "2024-01-16",
      icon: FileText,
    },
    {
      id: 3,
      title: "Coding Assessment",
      description: "Complete technical coding tests",
      status: "pending",
      date: null,
      icon: Code,
    },
    {
      id: 4,
      title: "Technical Interview",
      description: "Video interview with engineering team",
      status: "pending",
      date: null,
      icon: Users,
    },
    {
      id: 5,
      title: "Final Decision",
      description: "Final hiring decision",
      status: "pending",
      date: null,
      icon: CheckCircle,
    },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case "in-progress":
        return <Clock className="w-6 h-6 text-blue-600" />
      case "pending":
        return <Clock className="w-6 h-6 text-gray-400" />
      default:
        return <AlertCircle className="w-6 h-6 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Application Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Overview</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{applicationData.position}</h3>
            <p className="text-gray-600 mb-4">{applicationData.company}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Applied on {new Date(applicationData.appliedDate).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(applicationData.status)}`}
            >
              {applicationData.status === "in-review" ? "Under Review" : applicationData.status}
            </span>
            <p className="text-sm text-gray-500 mt-2">
              Step {applicationData.currentStep} of {steps.length}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Progress</h2>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isLast = index === steps.length - 1

            return (
              <div key={step.id} className="relative">
                {!isLast && (
                  <div
                    className={`absolute left-3 top-12 w-0.5 h-16 ${
                      step.status === "completed" ? "bg-green-200" : "bg-gray-200"
                    }`}
                  />
                )}

                <div className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      step.status === "completed"
                        ? "bg-green-100"
                        : step.status === "in-progress"
                          ? "bg-blue-100"
                          : "bg-gray-100"
                    }`}
                  >
                    {getStatusIcon(step.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-medium ${
                          step.status === "completed"
                            ? "text-green-900"
                            : step.status === "in-progress"
                              ? "text-blue-900"
                              : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </h3>
                      {step.date && (
                        <span className="text-sm text-gray-500">{new Date(step.date).toLocaleDateString()}</span>
                      )}
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        step.status === "completed"
                          ? "text-green-700"
                          : step.status === "in-progress"
                            ? "text-blue-700"
                            : "text-gray-500"
                      }`}
                    >
                      {step.description}
                    </p>

                    {step.status === "in-progress" && (
                      <div className="mt-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                          <p className="text-sm text-blue-800">
                            <strong>Action Required:</strong> Your resume is currently being reviewed by our HR team.
                            You'll receive an update within 2-3 business days.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 mb-2">What's Next?</h3>
        <p className="text-blue-800 text-sm">
          We're currently reviewing your resume and will contact you within 2-3 business days with next steps. If you
          have any questions, feel free to reach out to our HR team at hr@techcorp.com.
        </p>
      </div>
    </div>
  )
}

export default ApplicationStatus
