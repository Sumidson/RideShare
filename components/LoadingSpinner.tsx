"use client"
import { motion } from 'framer-motion'
import { Car } from 'lucide-react'

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md h-32">
        {/* Road with dashed lines */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gray-800 rounded-full">
          <div className="absolute top-1 left-0 right-0 h-1 bg-yellow-400 rounded-full opacity-60"></div>
        </div>
        {/* Car animation with bounce effect */}
        <motion.div
          className="absolute bottom-3"
          initial={{ x: -100, y: 0 }}
          animate={{ x: "100%", y: [0, -5, 0] }}
          transition={{
            x: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const },
            y: { duration: 0.5, repeat: Infinity, ease: "easeInOut" as const }
          }}
        >
          <Car className="w-10 h-10 text-blue-600 drop-shadow-lg" />
        </motion.div>
        {/* Loading text with fade animation */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl font-semibold text-gray-700"
          >
            Loading...
          </motion.div>
        </div>
        {/* Dots animation */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full"
              initial={{ opacity: 0.3, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut" as const
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner 