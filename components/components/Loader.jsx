// components/Loader.jsx
'use client'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Loader() {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      >
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </motion.div>
      <motion.p
        className="mt-4 text-indigo-700 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, repeatType: 'mirror', duration: 1 }}
      >
        Loading...
      </motion.p>
    </motion.div>
  )
}
