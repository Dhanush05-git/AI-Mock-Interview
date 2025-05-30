"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      router.replace("/dashboard");
    } else {
      router.replace("/sign-in");
    }
  }, [isSignedIn, isLoaded, router]);

  return (
    <>
      <style jsx>{`
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

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 px-4">
        <div className="flex space-x-3 mb-6">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-5 h-5 bg-white rounded-full inline-block"
              style={{
                animation: "bounce 0.7s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
        <p
          className="text-white text-2xl font-semibold tracking-wider text-center"
          style={{
            animation: "fadeInOut 1s ease-in-out infinite",
          }}
        >
          Loading... and
        </p>
      </div>
    </>
  );
}