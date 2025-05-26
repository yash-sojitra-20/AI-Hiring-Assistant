"use client"

import { useState } from "react"
import { Play, CheckCircle, Clock, Code } from "lucide-react"

const CodingTest = () => {
  const [selectedTest, setSelectedTest] = useState(null)
  const [code, setCode] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(3600) // 1 hour in seconds

  const tests = [
    {
      id: 1,
      title: "Array Manipulation",
      difficulty: "Easy",
      timeLimit: "60 minutes",
      description: "Implement a function that finds the maximum sum of a contiguous subarray.",
      status: "available",
    },
    {
      id: 2,
      title: "String Processing",
      difficulty: "Medium",
      timeLimit: "90 minutes",
      description: "Create a function that validates and formats email addresses.",
      status: "completed",
    },
    {
      id: 3,
      title: "Data Structures",
      difficulty: "Hard",
      timeLimit: "120 minutes",
      description: "Implement a binary search tree with insertion and deletion operations.",
      status: "locked",
    },
  ]

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartTest = (test) => {
    setSelectedTest(test)
    setCode(
      `// ${test.title}\n// ${test.description}\n\nfunction solution() {\n  // Your code here\n}\n\n// Test cases\nconsole.log(solution());`,
    )
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    // Here you would typically send the code to your backend
    console.log("Submitted code:", code)
  }

  if (selectedTest && !isSubmitted) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Test Header */}
          <div className="border-b p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedTest.title}</h2>
                <p className="text-gray-600 mt-1">{selectedTest.description}</p>
                <div className="flex items-center space-x-4 mt-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedTest.difficulty === "Easy"
                        ? "bg-green-100 text-green-800"
                        : selectedTest.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedTest.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">Time Limit: {selectedTest.timeLimit}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-blue-600">{formatTime(timeRemaining)}</div>
                <p className="text-sm text-gray-500">Time Remaining</p>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Code Editor</h3>
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                    <Play className="w-4 h-4" />
                    <span>Run Code</span>
                  </button>
                </div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 p-4 border rounded-lg font-mono text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write your code here..."
              />

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setSelectedTest(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back to Tests
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Submit Solution
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Test Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your solution has been submitted and is being evaluated. You'll receive results within 24 hours.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setSelectedTest(null)
                setIsSubmitted(false)
                setCode("")
              }}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Take Another Test
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Coding Tests</h2>

        <div className="space-y-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className={`border rounded-lg p-6 transition-colors ${
                test.status === "locked" ? "bg-gray-50 opacity-60" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{test.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        test.difficulty === "Easy"
                          ? "bg-green-100 text-green-800"
                          : test.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {test.difficulty}
                    </span>
                    {test.status === "completed" && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  <p className="text-gray-600 mb-3">{test.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{test.timeLimit}</span>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  {test.status === "available" && (
                    <button
                      onClick={() => handleStartTest(test)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Code className="w-4 h-4" />
                      <span>Start Test</span>
                    </button>
                  )}
                  {test.status === "completed" && <span className="text-green-600 font-medium">Completed</span>}
                  {test.status === "locked" && <span className="text-gray-400 font-medium">Locked</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CodingTest
