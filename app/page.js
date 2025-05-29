"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // wait until user state is loaded

    if (isSignedIn) {
      router.replace("/dashboard"); // send signed-in users to dashboard
    } else {
      router.replace("/sign-in"); // send unsigned users to sign-in page
    }
  }, [isSignedIn, isLoaded, router]);

  // While redirecting, you can show a loading message or spinner
  return (
    <>
    <style jsx>{`
      /* Bouncing dots animation */
      @keyframes bounce {
        0%, 80%, 100% {
          transform: translateY(0);
          opacity: 0.7;
        }
        40% {
          transform: translateY(-15px);
          opacity: 1;
        }
      }
    
      /* Fade in/out for loading text */
      @keyframes fadeInOut {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
    `}</style>
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700">
      <div className="flex space-x-3 mb-6">
        {/* Three bouncing dots */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-5 h-5 bg-white rounded-full inline-block"
            style={{
              animation: `bounce 0.7s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      <p
        className="text-white text-2xl font-semibold tracking-wider"
        style={{
          animation: 'fadeInOut 1s ease-in-out infinite',
        }}
      >
        Loading...
      </p>
    </div>
    </>
  );
}
