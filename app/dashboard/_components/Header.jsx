'use client'

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import Link from 'next/link'

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Questions', path: '/questions' },
  { name: 'Premium', path: '/upgrade' },
  { name: 'How it Works?', path: '/HIW' },
]

function Header() {
  const path = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
           
              <Image
                src="/logo.svg"
                alt="Logo"
                width={120}
                height="auto"
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
  )
}

export default Header
