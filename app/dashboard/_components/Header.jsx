"use client"

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React from 'react'
import Link from 'next/link'

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Questions', path: '/questions' },
  { name: 'Premium', path: '/upgrade' },
  { name: 'How it Works?', path: '/HIW' },
]

function Header() {
  const path = usePathname()

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={160}
            height={80}
            priority
            className="object-contain"
          />
        </div>

        {/* Center: Navigation */}
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
        <div className="flex-shrink-0 scale-110">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}

export default Header
