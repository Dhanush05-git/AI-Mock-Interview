'use client'

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import loadingAnimation from '@/public/lottie/loading.json'
import { FaClock, FaHome } from 'react-icons/fa'

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Questions', path: '/questions' },
  { name: 'Premium', path: '/upgrade' },
  { name: 'How it Works?', path: '/HIW' },
]

export default function How_it_works() {
  const path = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(7) // 10s total - 3s loading = 7s countdown
  const [menuOpen, setMenuOpen] = useState(false)

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

      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [loading, countdown, router])

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
              {/* Left: Logo */}
              <div className="flex-shrink-0">
                <Link href="/">
                 
                    <Image
                      src="/logo.svg"
                      alt="Logo"
                      width={160}
                      height={80}
                      priority
                      className="object-contain"
                    />
                  
                </Link>
              </div>
      
              {/* Center: Navigation - Desktop */}
              <nav className="hidden md:flex gap-10 text-[15px] font-medium">
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
      
              {/* Right: User button */}
              <div className="flex items-center gap-4">
                {/* User Button */}
                <div className="flex-shrink-0 scale-110">
                  <UserButton afterSignOutUrl="/" />
                </div>
      
                {/* Mobile menu button */}
                <button
                  type="button"
                  className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle menu"
                >
                  {/* Hamburger Icon */}
                  <svg
                    className={`${menuOpen ? 'hidden' : 'block'} h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  {/* Close Icon */}
                  <svg
                    className={`${menuOpen ? 'block' : 'hidden'} h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
      
            {/* Mobile menu */}
            {menuOpen && (
              <nav className="md:hidden bg-white border-t border-gray-200 shadow-inner">
                <ul className="flex flex-col space-y-1 px-4 py-3 text-base font-medium">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`block py-2 px-3 rounded-md transition-colors duration-150 ${
                          path === item.path
                            ? 'bg-indigo-100 text-indigo-700 font-semibold'
                            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                        onClick={() => setMenuOpen(false)} // Close menu on link click
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </header>

      <main className="flex justify-center items-center h-[75vh] px-6 text-center">
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
                className="text-lg text-gray-600"
              >
                Preparing something amazing for you...
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
                className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3"
              >
              
                🚧 Page Under Development
              </motion.h2>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-gray-600 text-lg flex items-center justify-center gap-2"
              >
                <FaClock className="text-indigo-500 animate-pulse" />
                You'll be redirected to the Dashboard in{' '}
                <span className="font-semibold text-indigo-600">{countdown}</span> second
                {countdown !== 1 && 's'}...
              </motion.p>

              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard')}
                className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-base font-semibold transition-all shadow-md inline-flex items-center gap-2 justify-center mx-auto"
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
