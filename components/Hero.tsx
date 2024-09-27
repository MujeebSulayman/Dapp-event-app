import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const Hero: React.FC = () => {
  return (
    <div className="relative bg-black overflow-hidden min-h-screen flex items-center">
      {/* Background animation */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-500 rounded-full opacity-10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 2, 2, 1, 1],
              rotate: [0, 0, 270, 270, 0],
              opacity: [0.1, 0.2, 0.4, 0.2, 0.1],
              borderRadius: ['20%', '20%', '50%', '80%', '20%'],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center">
          <motion.h1
            className="text-3xl tracking-tight font-extrabold text-white sm:text-4xl md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="block">Revolutionize Events with</span>{' '}
            <span className="block text-blue-500">Blockchain Technology</span>
          </motion.h1>
          <motion.p
            className="mt-3 max-w-md mx-auto text-sm text-gray-300 sm:text-base md:mt-5 md:text-lg lg:text-xl md:max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Create, join, and manage events using the power of Web3. Secure ticketing, transparent
            transactions, and community-driven experiences.
          </motion.p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                href="/events/create"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Create Event
              </Link>
            </motion.div>
            <motion.div
              className="mt-3 sm:mt-0 sm:ml-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link
                href="/events"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
              >
                Explore Events
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Web3 elements */}
        <motion.div
          className="mt-12 flex flex-row justify-center flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {['Conferences', 'Meetups', 'Workshops'].map((tech, index) => (
            <div key={tech} className="flex items-center justify-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                  {/* You can replace this with actual icons */}
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-2">
                <dt className="text-sm leading-6 font-medium text-white">{tech}</dt>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Hero
