import React from 'react'
import { PlusCircle, History, Bot } from 'lucide-react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

function Dashboard() {
  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10" style={{ backgroundColor: '#fdfdf8' }}>
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-2 sm:gap-3 flex-wrap">
          <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
          Welcome to Your Dashboard
        </h2>
        <p className="text-gray-700 mt-2 text-base sm:text-lg">
          Create and start your personalized AI mock interviews.
        </p>
      </div>

      {/* Add New Interview Section */}
      <div className="border border-gray-200 bg-white shadow-lg rounded-2xl p-4 sm:p-6 mb-10 transition-all hover:shadow-xl">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-5 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-blue-600" />
          Start Interview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <AddNewInterview />
        </div>
      </div>

      {/* Previous Interviews Section */}
      <div className="border border-gray-200 bg-white shadow-lg rounded-2xl p-4 sm:p-6 transition-all hover:shadow-xl">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-5 flex items-center gap-2">
          <History className="w-5 h-5 text-green-600" />
          Previous Interviews
        </h3>
        <InterviewList />
      </div>
    </div>
  )
}

export default Dashboard