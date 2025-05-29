'use client';
import React, { useState } from 'react';
import { Lightbulb, Volume2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Brain } from 'lucide-react';

function Questionsection({ mockInterviewQuestions, activeQuestionIndex, setActiveQuestionIndex }) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const activeQuestion = mockInterviewQuestions[activeQuestionIndex];
  if (!activeQuestion) return null;

  const handleVoiceClick = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000); // Hide alert after 3 seconds
  };

  return (
    <div className="p-6 my-2 bg-white">
      {/* Header */}
      <div className="mb-6 flex flex-col items-center">
  <div className="flex items-center gap-3">
    <Brain className="text-primary-600" size={28} />
    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
      AI Generated Interview Questions
    </h1>
  </div>
  <div className="mt-2 w-24 h-1 rounded-full bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400" />
</div>

      {/* Question Buttons */}
      <div className="my-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockInterviewQuestions.map((question, index) => (
          <button
            key={question.id}
            className={`px-3 py-2 rounded-full text-sm cursor-pointer font-medium transition-all duration-200
              ${activeQuestionIndex === index
                ? 'bg-primary text-white shadow'
                : 'bg-gray-100 hover:bg-primary hover:text-white'
              }`}
            onClick={() => setActiveQuestionIndex(index)}
          >
            Question #{index + 1}
          </button>
        ))}
      </div>

      {/* Question and Voice Button */}
      <div className="mt-8 p-6 rounded-xl bg-gray-50 border relative">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-gray-800 w-full">
            {activeQuestion?.question}
          </h2>
          <button onClick={handleVoiceClick}>
            <Volume2 className="text-primary hover:scale-110 cursor-pointer transition-transform duration-200" size={24} />
          </button>
        </div>

        {/* Animated "Coming Soon" Message */}
        <AnimatePresence>
          {showComingSoon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 right-0 mt-10 mr-10 bg-white border border-blue-300 shadow-lg rounded-xl p-4 flex items-center gap-3 z-10"
            >
              <Sparkles className="text-blue-500" />
              <span className="text-sm text-blue-700 font-semibold">Voice Assistant Coming Soon!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Note Section */}
      <div className="border rounded-xl p-6 bg-blue-50 mt-10">
        <div className="flex items-center gap-2 text-blue-700 font-semibold">
          <Lightbulb />
          <span>Note:</span>
        </div>
        <p className="mt-3 text-sm text-blue-700">{process.env.NEXT_PUBLIC_NOTE_3}</p>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Questionsection), { ssr: false });
