import { SignUp } from "@clerk/nextjs";
import Head from "next/head";

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>AI Interview Mocker - Sign Up</title>
      </Head>

      <div className="flex h-screen w-full">
        {/* Left side with background image */}
        <div
          className="hidden md:flex w-11/20 bg-cover bg-center relative"
          style={{ backgroundImage: "url('/interview.jpg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-10">
            <h1 className="text-4xl font-bold mb-4">Join AI Interview Mocker 🚀</h1>
            <p className="text-lg text-center max-w-md">
              Start preparing for your dream job interviews using our AI-powered simulations.
            </p>
          </div>
        </div>

        {/* Right side with sign-up form */}
        <div className="flex w-full md:w-9/20 justify-center items-center px-4">
          <div className="max-w-md w-full">
            <SignUp path="/sign-up" routing="path" />
          
          </div>
        </div>
      </div>
    </>
  );
}