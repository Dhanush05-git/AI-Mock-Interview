"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Webcam from "react-webcam";
import {
  Lightbulb,
  WebcamIcon,
  Home,
  CalendarClock,
  BadgeCheck,
  FileText,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { motion, AnimatePresence } from "framer-motion";

function Interview() {
  const { interviewId } = useParams();
  const webcamRef = useRef(null);
  const [interviewData, setInterviewData] = useState(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());
  const router = useRouter();
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    if (interviewId) fetchInterviewDetails(interviewId);
  }, [interviewId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchInterviewDetails = async (id) => {
    try {
      const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, id));
      const interview = result[0] || null;
      setInterviewData(interview);

      if (interview) {
        const answers = await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef, id));
        setHasStarted(answers.length > 0);
      }
    } catch (err) {
      setError("Failed to load interview data.");
      console.error("Error fetching interview:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWebcam = () => {
    if (!webcamEnabled) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => setWebcamEnabled(true))
        .catch(() => {
          alert("Permission denied. Please enable webcam access.");
          setWebcamEnabled(false);
        });
    } else {
      setWebcamEnabled(false);
      setTimeout(() => window.location.reload(), 300);
    }
  };

  return (
    <div className="container mx-auto my-8 px-4 flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 drop-shadow-md"
      >
        Interview Details
        <span className="block w-16 h-1 bg-purple-500 mx-auto mt-2 rounded-full animate-pulse"></span>
      </motion.h2>

      <p className="mb-6 text-sm text-muted-foreground flex items-center gap-2">
        <CalendarClock className="w-4 h-4 text-blue-500" />
        Local Time: <span className="font-medium">{localTime}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
        {/* Webcam Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-[340px] h-[260px] p-4 border rounded-lg bg-secondary shadow-md flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {webcamEnabled ? (
                <motion.div
                  key="webcam-on"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full h-full"
                >
                  <Webcam
                    ref={webcamRef}
                    video
                    mirrored
                    className="rounded-md w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    LIVE
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="webcam-off"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center text-center "
                >
                  <WebcamIcon className="h-20 w-20 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Webcam is currently disabled.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            onClick={toggleWebcam}
            className={`mt-4 w-full max-w-xs cursor-pointer ${
              webcamEnabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            } text-white transition-all duration-300`}
          >
            {webcamEnabled ? "Stop Webcam" : "Enable Webcam"}
          </Button>
        </motion.div>

        {/* Interview Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          {loading ? (
            <p className="text-gray-500">Loading interview details...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : interviewData ? (
            <div className="p-6 border rounded-lg shadow-sm bg-white space-y-3 animate-in fade-in-90 slide-in-from-bottom-5">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-500" />
                Job Position: <span className="font-normal">{interviewData.jobPosition}</span>
              </h3>

                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    Description:{' '}
                    <span
                      className={`font-normal ${
                        interviewData.jobDesc.length > 80
                          ? 'text-sm'
                          : interviewData.jobDesc.length > 40
                          ? 'text-base'
                          : 'text-lg'
                      }`}
                    >
                      {interviewData.jobDesc.length > 30 && !descExpanded
                        ? `${interviewData.jobDesc.slice(0, 30)}...`
                        : interviewData.jobDesc}
                    </span>
                    {interviewData.jobDesc.length > 30 && (
                      <button
                        onClick={() => setDescExpanded(!descExpanded)}
                        className="text-xs text-indigo-600 underline ml-2 cursor-pointer hover:text-indigo-800 transition-colors duration-200"
                      >
                        {descExpanded ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                  </h3>


              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-green-500" />
                Experience:{" "}
                <span className="font-normal">{interviewData.jobExperience} years</span>
              </h3>
            </div>
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}

          {/* Notes Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="p-5 border rounded-lg border-yellow-300 bg-yellow-100"
          >
            <h4 className="flex items-center gap-2 text-yellow-600 font-semibold">
              <Lightbulb className="w-5 h-5" />
              Information
            </h4>
            <p className="mt-3 text-yellow-700">{process.env.NEXT_PUBLIC_NOTE_1}</p>
            <p className="mt-2 text-yellow-700">
              <strong>Note:</strong> {process.env.NEXT_PUBLIC_NOTE_2}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-12 flex flex-col items-center gap-5"
      >
        <Link href={`/dashboard/interview/${interviewId}/start`}>
          <Button className="bg-primary hover:bg-primary/90 text-white cursor-pointer font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300">
            {hasStarted ? "Continue Interview" : "Start Interview"}
          </Button>
        </Link>

        <Button
          onClick={() => router.replace("/dashboard")}
          className="flex items-center gap-2 px-6 py-3 text-base rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200  cursor-pointer transition-all shadow-sm hover:shadow-md"
        >
          <Home className="w-5 h-5 " />
          Go Home
        </Button>
      </motion.div>
    </div>
  );
}

export default Interview;
