"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Questionsection from "./_components/Questionsection";
import RecordAnsSection from "./_components/RecordAnsSection";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

function StartInterview({ params }) {
  const [InterviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [webcamEnabled, setWebcamEnabled] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [attemptedQuestions, setAttemptedQuestions] = useState(new Set());
  const router = useRouter();

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      if (!result || result.length === 0) {
        console.error("No interview found with the given ID");
        return;
      }

      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      setMockInterviewQuestions(jsonMockResp);
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview data:", error);
    }
  };

  const handleConfirmEnd = () => {
    router.push(`/dashboard/interview/${InterviewData?.mockId}/feedback`);
  };

  const isLastQuestion = activeQuestionIndex === mockInterviewQuestions.length - 1;

  return (
    <div className="px-4 py-6 md:px-8 min-h-screen bg-gray-50">
      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <Button
          onClick={() => setActiveQuestionIndex((prev) => prev - 1)}
          disabled={activeQuestionIndex === 0}
          className="w-full sm:w-auto"
        >
          Previous
        </Button>

        {!isLastQuestion && (
          <Button
            onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
            disabled={activeQuestionIndex === mockInterviewQuestions.length - 1}
            className="w-full sm:w-auto"
          >
            Next
          </Button>
        )}

        {isLastQuestion && (
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => setShowConfirmDialog(true)}
              >
                End Interview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle>End Interview?</DialogTitle>
                <DialogDescription>
                  Are you sure you’d like to conclude the interview? Once confirmed, you’ll proceed to the feedback page to reflect on your responses.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setShowConfirmDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmEnd}>
                  Confirm & End
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-6 transition hover:shadow-md">
          <RecordAnsSection
            mockInterviewQuestions={mockInterviewQuestions}
            activeQuestionIndex={activeQuestionIndex}
            InterviewData={InterviewData}
            webcamEnabled={webcamEnabled}
            setWebcamEnabled={setWebcamEnabled}
            attemptedQuestions={attemptedQuestions}
            setAttemptedQuestions={setAttemptedQuestions}
          />
        </div>

        {mockInterviewQuestions.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-6 transition hover:shadow-md">
            <Questionsection
              mockInterviewQuestions={mockInterviewQuestions}
              activeQuestionIndex={activeQuestionIndex}
              setActiveQuestionIndex={setActiveQuestionIndex}
              attemptedQuestions={attemptedQuestions}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
