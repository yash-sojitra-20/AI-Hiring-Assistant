"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Clock, User, MapPin } from "lucide-react"

const Scheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const interviews = [
    {
      id: 1,
      candidate: "John Smith",
      position: "Senior Frontend Developer",
      time: "10:00 AM",
      duration: "1 hour",
      interviewer: "Sarah Johnson",
      type: "Technical Interview",
      status: "Confirmed",
      date: "2024-01-25",
    },
    {
      id: 2,
      candidate: "Emily Davis",
      position: "UX Designer",
      time: "2:00 PM",
      duration: "45 minutes",
      interviewer: "Mike Chen",
      type: "Portfolio Review",
      status: "Pending",
      date: "2024-01-25",
    },
    {
      id: 3,
      candidate: "Michael Chen",
      position: "Backend Developer",
      time: "11:00 AM",
      duration: "1 hour",
      interviewer: "David Wilson",
      type: "System Design",
      status: "Confirmed",
      date: "2024-01-26",
    },
  ]

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ]

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getInterviewsForDate = (date) => {
    const dateString = date.toISOString().split("T")[0]
    return interviews.filter((interview) => interview.date === dateString)
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const isToday = (date) => {
    const today = new Date()
    return date && date.toDateString() === today.toDateString()
  }

  const isSelected = (date) => {
    return date && date.toDateString() === selectedDate.toDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interview Scheduler</h1>
          <p className="text-gray-600">Manage and schedule candidate interviews</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>Schedule Interview</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h2>
              <div className="flex space-x-2">
                <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((date, index) => (
                  <div
                    key={index}
                    className={`p-2 h-20 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      date ? "bg-white" : "bg-gray-50"
                    } ${isToday(date) ? "bg-blue-50 border-blue-200" : ""} ${
                      isSelected(date) ? "bg-blue-100 border-blue-300" : ""
                    }`}
                    onClick={() => date && setSelectedDate(date)}
                  >
                    {date && (
                      <>
                        <div className={`text-sm ${isToday(date) ? "font-bold text-blue-600" : "text-gray-900"}`}>
                          {date.getDate()}
                        </div>
                        {getInterviewsForDate(date).length > 0 && (
                          <div className="mt-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{formatDate(selectedDate)}</h3>

            <div className="space-y-4">
              {getInterviewsForDate(selectedDate).length > 0 ? (
                getInterviewsForDate(selectedDate).map((interview) => (
                  <div key={interview.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{interview.candidate}</h4>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          interview.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {interview.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{interview.position}</p>
                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {interview.time} ({interview.duration})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{interview.interviewer}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{interview.type}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No interviews scheduled for this date</p>
              )}
            </div>
          </div>

          {/* Available Time Slots */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Available Time Slots</h3>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => {
                const isBooked = getInterviewsForDate(selectedDate).some((interview) => interview.time === slot)
                return (
                  <button
                    key={slot}
                    className={`p-2 text-sm rounded-lg border ${
                      isBooked
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                    disabled={isBooked}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Scheduler
