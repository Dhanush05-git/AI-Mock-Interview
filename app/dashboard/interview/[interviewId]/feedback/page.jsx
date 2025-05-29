"use client";

import { UserAnswer } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronsUpDown,
  Home,
  AlertTriangle,
  Download,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { CalendarDays } from 'lucide-react';

function Feedback() {
  const params = useParams();
  const interviewId = params?.interviewId;
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  const GetFeedback = async () => {
    setIsLoading(true);
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId))
        .orderBy(UserAnswer.id);

      setFeedbackList(result);
      if (result.length) setShowConfetti(true);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      toast.error('Something went wrong while fetching feedback');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GetFeedback();
  }, []);

  const averageRating =
    feedbackList.length > 0
      ? (
          feedbackList.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
          feedbackList.length
        ).toFixed(2)
      : null;

  const showComingSoon = () => {
    toast(
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="text-center"
      >
        <p className="text-lg font-semibold text-green-600">🚀 Coming Soon!</p>
        <p className="text-sm text-gray-700">Export to PDF will be available in a future update.</p>
      </motion.div>,
      {
        duration: 3000,
        position: 'bottom-center',
        className: 'bg-white border border-green-200 shadow-md rounded-lg px-4 py-2',
      }
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      {showConfetti && <Confetti numberOfPieces={300} recycle={false} />}
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-[60vh]"
          >
            <div className="w-14 h-14 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-500 text-sm">Loading feedback...</p>
          </motion.div>
        ) : feedbackList.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mt-10"
          >
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto" />
            <h2 className="font-bold text-xl text-gray-500 mt-4">
              No Interview Record Found
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button
                onClick={GetFeedback}
                className="flex items-center gap-2 cursor-pointer px-5 py-2 text-base rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-all shadow-sm hover:shadow-md"
              >
                <RotateCcw className="w-5 h-5" />
                Retry
              </Button>

              <Button
                onClick={() => router.replace('/dashboard')}
                className="flex items-center gap-2 px-6 py-2 text-base cursor-pointer rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition-all shadow-sm hover:shadow-md"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Centered Header */}
            <div className="text-center mb-10">
              <motion.h2
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-5xl font-bold text-pink-500 mb-2"
              >
                🎉 Congratulations!
              </motion.h2>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Feedback of Your Interview
              </h2>
              <p className="text-lg text-gray-700">
                Your Overall Interview Rating:{' '}
                <span className="font-bold text-green-600">{averageRating}/10</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Below are your answers, correct answers, and the feedback.
              </p>
            </div>

            <div className="mt-6 space-y-6">
              {feedbackList.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Collapsible>
                    <div className="flex items-start gap-4">
                      
                      <div className="flex flex-col w-full">
                        <CollapsibleTrigger className="flex justify-between cursor-pointer items-center p-4 bg-gray-100 rounded-xl text-left w-full border hover:bg-gray-200 transition-all duration-200">
                        <div className="flex flex-col flex-1">
  <span className="text-base font-semibold text-gray-800">{item.question}</span>

  {item.createdAt && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-600 bg-gray-100 border border-gray-300/50 px-3 py-1 rounded-lg mt-1 shadow-sm animate-pulse-slow"
      title={`Answered on ${item.createdAt}`}
    >
      <CalendarDays className="w-4 h-4 text-gray-500" />
      <span className="tracking-wide">{item.createdAt}</span>
    </motion.div>
  )}
</div>


                          <ChevronsUpDown className="h-5 w-5 text-gray-600" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-3 mt-4">
                              <div className="p-3 border rounded-lg text-red-600 bg-red-50">
                                <strong>Rating:</strong> {item.rating}
                              </div>
                              <div className="p-3 border rounded-lg bg-red-100 text-red-900 text-sm">
                                <strong>Your Answer:</strong> {item.userAns}
                              </div>
                              <div className="p-3 border rounded-lg bg-green-100 text-green-900 text-sm">
                                <strong>Correct Answer:</strong> {item.correctAns}
                              </div>
                              <div className="p-3 border rounded-lg bg-blue-100 text-blue-900 text-sm">
                                <strong>Feedback:</strong> {item.feedback}
                              </div>
                            </div>
                          </motion.div>
                        </CollapsibleContent>
                      </div>
                    </div>
                  </Collapsible>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12">
              <Button
                onClick={() => router.replace('/dashboard')}
                className="flex items-center gap-2 cursor-pointer px-6 py-2 text-base rounded-full shadow-md hover:shadow-lg transition"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Button>
              <Button
                onClick={showComingSoon}
                className="flex items-center cursor-pointer gap-2 px-6 py-2 text-base rounded-full bg-green-500 text-white hover:bg-green-600"
              >
                <Download className="w-5 h-5" />
                Export as PDF
              </Button>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Feedback;
