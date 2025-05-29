"use client";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import {
  Mic,
  StopCircle,
  Video,
  VideoOff,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAImodel";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { UserAnswer } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { motion, AnimatePresence } from "framer-motion";

function RecordAnsSection({
  mockInterviewQuestions,
  activeQuestionIndex,
  InterviewData,
  webcamEnabled,
  setWebcamEnabled,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const [savedAnswer, setSavedAnswer] = useState("");
  const [showSavedText, setShowSavedText] = useState(false);
  const [hasSavedAnswer, setHasSavedAnswer] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [micPermissionState, setMicPermissionState] = useState("prompt");
  const [questionsAttempted, setQuestionsAttempted] = useState(() => {
    const stored = localStorage.getItem("questionsAttempted");
    return stored ? parseInt(stored, 10) : 0;
  });
  


  // State for update answer recording
  const [isUpdatingRecording, setIsUpdatingRecording] = useState(false);
  const [updateUserAnswer, setUpdateUserAnswer] = useState("");

  // Main recording hook for Record Answer button
  const {
    error,
    results,
    isRecording,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Separate speech to text hook instance for Update Answer button
  const {
    results: updateResults,
    isRecording: isUpdateRecording,
    startSpeechToText: startUpdateSpeechToText,
    stopSpeechToText: stopUpdateSpeechToText,
    setResults: setUpdateResults,
    error: updateError,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const permission = await navigator.permissions.query({
          name: "microphone",
        });
        setMicPermissionState(permission.state);
        setMicPermissionDenied(permission.state === "denied");
        permission.onchange = () => {
          setMicPermissionState(permission.state);
          setMicPermissionDenied(permission.state === "denied");
        };
      } catch (e) {
        console.warn("Permissions API not supported:", e);
      }
    };
    checkMicPermission();
  }, []);

  // Append transcripts to userAnswer while recording main answer
  useEffect(() => {
    if (results.length > 0) {
      const latestTranscript = results[results.length - 1]?.transcript || "";
      setUserAnswer((prev) => (prev + " " + latestTranscript).trim());
    }
  }, [results]);

  // When main recording stops and userAnswer is not empty, save it to DB
  useEffect(() => {
    if (!isRecording && userAnswer?.length > 5) {
      updateUserAnswerInDb(userAnswer);
    }
  }, [isRecording]);

  // Append transcripts to updateUserAnswer while recording update answer
  useEffect(() => {
    if (updateResults.length > 0) {
      const latestTranscript = updateResults[updateResults.length - 1]?.transcript || "";
      setUpdateUserAnswer((prev) => (prev + " " + latestTranscript).trim());
    }
  }, [updateResults]);

  // When update recording stops and new updateUserAnswer exists, combine and save
  useEffect(() => {
    if (!isUpdatingRecording && updateUserAnswer.length > 0) {
      const combinedAnswer = (savedAnswer + " " + updateUserAnswer).trim();
      setUserAnswer(combinedAnswer);
      setUpdateUserAnswer("");
      updateUserAnswerInDb(combinedAnswer);
    }
  }, [isUpdatingRecording]);

  // Fetch saved answer on question change
  useEffect(() => {
    if (InterviewData && mockInterviewQuestions.length > 0) {
      fetchSavedAnswer();
    }
  }, [activeQuestionIndex]);

  const fetchSavedAnswer = async () => {
    try {
      const response = await db
        .select()
        .from(UserAnswer)
        .where(
          and(
            eq(UserAnswer.mockIdRef, InterviewData.mockId),
            eq(UserAnswer.question, mockInterviewQuestions[activeQuestionIndex]?.question)
          )
        );

      if (response?.[0]?.userAns) {
        setSavedAnswer(response[0].userAns);
        setHasSavedAnswer(true);
      } else {
        setSavedAnswer("");
        setHasSavedAnswer(false);
      }

      setShowSavedText(false);
      setUserAnswer(""); // Reset current userAnswer when question changes
      setResults([]);
      setUpdateResults([]);
    } catch (err) {
      console.error("Error fetching saved answer", err);
    }
  };

  // Handle recording start/stop for Record Answer button
  const startStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      if (error) {
        toast.error("Recording error. Please try again.");
      } else {
        toast.success("Recording stopped. Saving...");
      }
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermissionDenied(false);
        startSpeechToText();
      } catch (e) {
        setMicPermissionDenied(true);
        toast.error("Microphone access denied");
      }
    }
  };

  // Handle recording start/stop for Update Answer button
  const startStopUpdateRecording = async () => {
    if (isUpdatingRecording) {
      stopUpdateSpeechToText();
      if (updateError) {
        toast.error("Recording error. Please try again.");
      } else {
        toast.success("Update recording stopped. Saving...");
      }
      setIsUpdatingRecording(false);
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermissionDenied(false);
        startUpdateSpeechToText();
        setIsUpdatingRecording(true);
      } catch (e) {
        setMicPermissionDenied(true);
        toast.error("Microphone access denied");
      }
    }
  };

  // Enable microphone access retry
  const enableMicrophone = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermissionDenied(false);
      toast.success("Microphone enabled");
    } catch {
      toast.error("Microphone access denied");
    }
  };

  const openMicSettingsHelp = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("chrome")) {
      window.open("https://support.google.com/chrome/answer/2693767", "_blank");
    } else if (userAgent.includes("firefox")) {
      window.open(
        "https://support.mozilla.org/en-US/kb/microphone-permissions",
        "_blank"
      );
    } else {
      window.open(
        "https://www.google.com/search?q=enable+microphone+access+in+browser",
        "_blank"
      );
    }
  };

  // Save user answer to DB and get feedback
  const updateUserAnswerInDb = async (answerToSave) => {
    setLoading(true);
    const prompt = `Question: ${mockInterviewQuestions[activeQuestionIndex]?.question}, User Answer: ${answerToSave}. Give a JSON response with fields 'rating' and 'feedback'.`;
  
    try {
      const result = await chatSession.sendMessage(prompt);
      const textResponse = await result.response.text();
      const cleaned = textResponse.replace(/```json|```/g, "").trim();
      const feedback = JSON.parse(cleaned);
  
      // Check if answer already exists for this user, mockId, and question
      const existingAnswer = await db
        .select()
        .from(UserAnswer)
        .where(
          and(
            eq(UserAnswer.mockIdRef, InterviewData.mockId),
            eq(UserAnswer.question, mockInterviewQuestions[activeQuestionIndex]?.question),
            eq(UserAnswer.userEmail, user?.primaryEmailAddress?.emailAddress)
          )
        )
        .limit(1);
  
      if (existingAnswer.length > 0) {
        // Update existing answer
        await db
          .update(UserAnswer)
          .set({
            userAns: answerToSave,
            feedback: feedback?.feedback,
            rating: feedback?.rating,
            createdAt: moment().format("DD-MM-YYYY HH:mm:ss"),
          })
          .where(eq(UserAnswer.id, existingAnswer[0].id));
      } else {
        // Insert new answer
        await db.insert(UserAnswer).values({
          mockIdRef: InterviewData.mockId,
          question: mockInterviewQuestions[activeQuestionIndex]?.question,
          correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
          userAns: answerToSave,
          feedback: feedback?.feedback,
          rating: feedback?.rating,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY HH:mm:ss"),
        });
      }
  
      toast.success("Answer saved successfully");
      setSavedAnswer(answerToSave);
      setHasSavedAnswer(true);
      if (!hasSavedAnswer) {
        setQuestionsAttempted((prev) => {
          const updated = prev + 1;
          localStorage.setItem("questionsAttempted", updated.toString());
          return updated;
        });
      }
  
      setResults([]);
      setUpdateResults([]);
    } catch (err) {
      console.error("Error saving answer or parsing feedback", err);
      toast.error("Failed to save your answer");
    }
  
    setLoading(false);
  };
  

  // Clear saved answer from DB
  const confirmAndClearAnswer = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your saved answer?"
    );
    if (!confirmed) return;

    try {
      await db.delete(UserAnswer).where(
        and(
          eq(UserAnswer.mockIdRef, InterviewData.mockId),
          eq(UserAnswer.question, mockInterviewQuestions[activeQuestionIndex]?.question)
        )
      );

      toast.success("Saved answer cleared");
      setSavedAnswer("");
      setHasSavedAnswer(false);
      setUserAnswer("");
      setResults([]);
      setUpdateResults([]);
      setShowSavedText(false);
      // Decrease attempted questions if it was counted before
      setQuestionsAttempted((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to clear saved answer", err);
      toast.error("Failed to clear the answer");
    }
  };

  // Toggle display of saved answer text
  const toggleSavedText = () => {
    if (!savedAnswer) {
      toast.info("No saved answer available");
      return;
    }
    setShowSavedText((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center w-full px-4 max-w-2xl mx-auto">
           


      <div className="relative w-full h-[300px] mt-8 rounded-xl overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          {webcamEnabled ? (
            <motion.div
              key="webcam-on"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <Webcam mirrored audio={false} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    LIVE
                  </div>
            </motion.div>
          ) : (
            <motion.div
              key="webcam-off"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center  text-white text-lg"
            >
              Webcam Disabled
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <motion.button
          onClick={() => setWebcamEnabled((prev) => !prev)}
          className={`px-4 py-2 rounded-lg font-medium text-white flex  items-center gap-2 cursor-pointer transition-all duration-300 shadow-md ${
            webcamEnabled ? "bg-red-500 hover:bg-red-600 " : "bg-green-500 hover:bg-green-600 "
          }`}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
        >
          {webcamEnabled ? (
            <>
              <VideoOff className="w-4 h-4 " />
              Disable Webcam
            </>
          ) : (
            <>
              <Video className="w-4 h-4" />
              Enable Webcam
            </>
          )}
        </motion.button>

        <Button
          onClick={toggleSavedText}
          variant="ghost"
          className="text-muted-foreground cursor-pointer hover:text-primary text-sm font-medium px-2"
        >
          <AnimatePresence mode="wait" initial={false}>
            {showSavedText ? (
              <motion.span
                key="hide"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Hide Your Answer
              </motion.span>
            ) : (
              <motion.span
                key="show"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1"
              >
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Show Your Answer
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

      </div>

   

      {/* Mic permission denied message */}
      {micPermissionDenied && (
        <div className="flex flex-col items-center text-center p-4 bg-red-100 rounded-md mt-4 space-y-2">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <p className="text-red-700 font-semibold">
            Microphone access is denied. Please enable microphone permissions in your browser.
          </p>
          <div className="flex gap-4 mt-2">
            <Button onClick={enableMicrophone} className="cursor-pointer" variant="outline">
              Enable Microphone
            </Button>
            <Button onClick={openMicSettingsHelp} className="cursor-pointer" variant="link">
              How to Enable Mic Access
            </Button>
          </div>
        </div>
      )}

      {/* Recording buttons */}
      <div className="w-full flex justify-center gap-4 my-4 flex-wrap">
  {hasSavedAnswer ? (
    <>
      <Button
        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600"
        onClick={(e) => {
          e.preventDefault()
          confirmAndClearAnswer()
        }}
        onTouchEnd={(e) => {
          e.preventDefault()
          confirmAndClearAnswer()
        }}
        disabled={loading}
      >
        <X className="w-4 h-4" />
        Clear Response
      </Button>

      <Button
        className="flex items-center gap-2"
        onClick={(e) => {
          e.preventDefault()
          startStopUpdateRecording()
        }}
        onTouchEnd={(e) => {
          e.preventDefault()
          startStopUpdateRecording()
        }}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" />
            Saving...
          </>
        ) : isUpdatingRecording ? (
          <>
            <StopCircle className="text-red-600" />
            Stop Update
          </>
        ) : (
          <>
            <Mic />
            Update Answer
          </>
        )}
      </Button>
    </>
  ) : (
    <Button
      className="flex items-center gap-2"
      onClick={(e) => {
        e.preventDefault()
        startStopRecording()
      }}
      onTouchEnd={(e) => {
        e.preventDefault()
        startStopRecording()
      }}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin w-4 h-4" />
          Saving...
        </>
      ) : isRecording ? (
        <>
          <StopCircle className="text-red-600" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic />
          Record Answer
        </>
      )}
    </Button>
  )}
</div>


     <AnimatePresence>
        {showSavedText && (
          <motion.div
            key="saved-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-gray-100 border text-gray-800 rounded-md p-4 max-w-md w-full mb-8"
          >
            <h3 className="text-md font-semibold mb-2">Your Saved Answer:</h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {savedAnswer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}

export default RecordAnsSection;

