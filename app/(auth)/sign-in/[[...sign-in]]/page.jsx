// pages/sign-in.tsx
import { SignIn } from "@clerk/nextjs";
import Head from "next/head";

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>AI Interview Mocker - Sign In</title>
      </Head>
      <div className="flex h-screen w-full">
        {/* Left Panel with Background Image */}
        <div
          className="hidden md:flex w-11/20 bg-cover bg-center relative"
          // You can add your background image style here or via Tailwind config
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-10">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to AI Interview Mocker{" "}
            <span className="animate-custom-bounce text-yellow-400">🚀</span>
          </h1>


            <p className="text-lg text-center max-w-md">
              Prepare for interviews smarter with AI! Practice, improve, and succeed.
            </p>
          </div>
        </div>

        {/* Right Panel with Clerk Sign In */}
        <div className="flex w-full md:w-9/20 justify-center items-center px-4 bg-gray-50">
          <div className="max-w-md w-full">

            {/* Mobile-only welcome message */}
            <div className="block md:hidden text-center mb-6 text-xl font-semibold text-gray-700">
              Welcome to AI Interview Mocker <span className="animate-custom-bounce">🚀</span>
            </div>

            <SignIn path="/sign-in" routing="path" />
          </div>
        </div>
      </div>
    </>
  );
}
