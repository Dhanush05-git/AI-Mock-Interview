'use client'

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import loadingAnimation from '@/public/lottie/loading.json'
import { FaClock, FaHome, FaBars } from 'react-icons/fa'

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Questions', path: '/questions' },
  { name: 'Premium', path: '/upgrade' },
  { name: 'How it Works?', path: '/HIW' },
]

function QuestionPage() {
  const path = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(7)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const loadingTimer = setTimeout(() => setLoading(false), 1900)
    return () => clearTimeout(loadingTimer)
  }, [])

  useEffect(() => {
    if (!loading) {
      if (countdown === 0) {
        router.push('/dashboard')
        return
      }
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [loading, countdown, router])

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between px-4 sm:px-6 py-3">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={150}
              height={60}
              className="object-contain"
              priority
            />
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center justify-between w-full mt-2">
            <button
              className="text-gray-600 text-xl"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <FaBars />
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>

          {/* Nav Items */}
          <nav
            className={`${
              mobileMenuOpen ? 'flex' : 'hidden'
            } flex-col md:flex md:flex-row gap-5 md:gap-10 w-full md:w-auto text-[15px] font-medium mt-3 md:mt-0`}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`transition-all duration-150 ease-in-out pb-0.5 border-b-2 ${
                  path === item.path
                    ? 'text-indigo-600 font-semibold border-indigo-600'
                    : 'text-gray-600 hover:text-indigo-500 hover:border-indigo-300 border-transparent'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop user button */}
          <div className="hidden md:block flex-shrink-0 scale-110">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex justify-center items-center min-h-[70vh] px-4 text-center">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="flex flex-col items-center gap-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Lottie animationData={loadingAnimation} loop style={{ height: 180 }} />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg text-gray-600"
              >
                Getting your Questions ready...
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="redirect"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-6"
            >
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-2xl sm:text-4xl font-bold text-gray-800 flex items-center justify-center gap-3"
              >
                🤖 Questions Page Coming Soon
              </motion.h2>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-gray-600 text-base sm:text-lg flex items-center justify-center gap-2"
              >
                <FaClock className="text-indigo-500 animate-pulse" />
                Redirecting to the Dashboard in{' '}
                <span className="font-semibold text-indigo-600">{countdown}</span> second
                {countdown !== 1 && 's'}...
              </motion.p>

              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard')}
                className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white px-6 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all shadow-md inline-flex items-center gap-2 justify-center"
              >
                <FaHome />
                Go to Dashboard Now
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}

export default QuestionPage
