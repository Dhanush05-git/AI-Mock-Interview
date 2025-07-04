'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/utils/db';
import { UserAnswer, MockInterview } from '@/utils/schema'; // import MockInterview if needed
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Loader2, PlayCircle, RotateCcw, MessageCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

function InterviewItemCard({ interview, onDelete }) {
  const router = useRouter();
  const [hasFeedback, setHasFeedback] = useState(false);
  const [checkingFeedback, setCheckingFeedback] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const navigateToInterview = () => {
    router.push(`/dashboard/interview/${interview?.mockId}`);
  };

  const navigateToFeedback = () => {
    router.push(`/dashboard/interview/${interview?.mockId}/feedback`);
  };

  useEffect(() => {
    const checkFeedback = async () => {
      const cacheKey = `feedback-${interview?.mockId}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached === 'true') {
        setHasFeedback(true);
        setCheckingFeedback(false);
        return;
      }

      try {
        const result = await db
          .select()
          .from(UserAnswer)
          .where(eq(UserAnswer.mockIdRef, interview?.mockId));

        if (result.length > 0) {
          setHasFeedback(true);
          localStorage.setItem(cacheKey, 'true');
        } else {
          localStorage.setItem(cacheKey, 'false');
        }
      } catch (error) {
        console.error('Error checking feedback:', error);
      } finally {
        setCheckingFeedback(false);
      }
    };

    checkFeedback();
  }, [interview?.mockId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this interview and all related data?')) return;

    setDeleting(true);

    try {
      // Delete answers related to this interview (mockId)
      await db.delete(UserAnswer).where(eq(UserAnswer.mockIdRef, interview?.mockId));

      // Delete the interview itself by id
      await db.delete(MockInterview).where(eq(MockInterview.id, interview.id));

      // Clear localStorage cache
      localStorage.removeItem(`feedback-${interview?.mockId}`);

      // Inform parent to remove from UI list
      if (onDelete) onDelete(interview.id);
    } catch (error) {
      console.error('Failed to delete interview:', error);
      alert('Failed to delete interview. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative border shadow-sm rounded-xl p-4 bg-white hover:shadow-md transition-all cursor-pointer"
    >
      {/* Close button */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Delete interview"
        className="absolute top-2 right-2 text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors"
      >
        <X className="w-5 h-5 cursor-pointer" />
      </button>

      <div className="space-y-1">
        <h2 className="font-bold text-primary text-lg">{interview?.jobPosition}</h2>
        <p className="text-sm text-gray-500">{interview?.jobExperience} Years of Experience</p>
        <p className="text-xs text-gray-400">Created At: {interview?.createdAt}</p>
      </div>

      <div className="flex justify-between mt-4 gap-3 items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={navigateToFeedback}
          className="gap-2 text-blue-600 hover:text-blue-700 border-blue-200 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 cursor-pointer" />
          Feedback
        </Button>

        <motion.div whileTap={{ scale: 0.95 }} className="w-full md:w-auto flex justify-end">
          <Button
            size="sm"
            className="w-30 gap-2 bg-pink-500 text-white hover:bg-pink-600 cursor-pointer"
            onClick={navigateToInterview}
            disabled={checkingFeedback}
          >
            {checkingFeedback ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : hasFeedback ? (
              <>
                <RotateCcw className="h-4 w-4" />
                Get Back
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                Start
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default InterviewItemCard;