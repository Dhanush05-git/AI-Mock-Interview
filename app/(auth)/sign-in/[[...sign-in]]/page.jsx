'use client';

import { SignIn } from "@clerk/nextjs";
import Head from "next/head";
import { motion } from "framer-motion";

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>AI Interview Mocker - Sign In</title>
      </Head>

      <div className="flex flex-col md:flex-row h-screen w-full bg-gray-100 overflow-hidden">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="hidden md:flex md:w-1/2 bg-[url('/background.jpg')] bg-cover bg-center relative"
        >
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-white p-10 text-center">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Welcome to <br /> AI Interview Mocker{" "}
              <span className="inline-block animate-bounce text-yellow-400">🚀</span>
            </h1>
            <p className="text-lg max-w-md">
              Prepare for interviews smarter with AI! Practice, improve, and succeed.
            </p>
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="flex flex-1 justify-center items-center px-4 py-8"
        >
          <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 md:p-10 transition duration-300 ease-in-out">
            <SignIn path="/sign-in" routing="path" />
          </div>
        </motion.div>
      </div>
    </>
  );
}
