import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'
import { motion } from 'framer-motion'

const Navbar = () => {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('/home')

  // Nature-themed color palette
  const navColors = {
    activeBg: 'from-[#4A7C3F] to-[#2D5A27]',
    activeIcon: 'text-white',
    activeText: 'text-white',
    inactiveIcon: 'text-[#5D6D55]',
    inactiveText: 'text-[#7A7A7A]',
    background: 'from-[#F5E8C7] to-[#E8F5E9]',
    border: 'border-t border-[#E0E6D6]',
  }

  // Navigation items with nature-themed icons
  const navItems = [
    {
      path: '/home',
      label: 'Home',
      icon: <i className="ri-home-4-line"></i>,
      activeIcon: <i className="ri-home-4-fill"></i>,
      description: 'Dashboard'
    },
    {
      path: '/habit-list',
      label: 'Habits',
      icon: <i className='ri-seedling-line'></i>,
      activeIcon: <i className="ri-seedling-fill"></i>,
      description: 'My Garden'
    },
    {
      path: '/habit-analytics',
      label: 'Analytics',
      icon: <i className="ri-pie-chart-2-line"></i>,
      activeIcon: <i className="ri-pie-chart-2-fill"></i>,
      description: 'Growth'
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: <i className="ri-user-3-line"></i>,
      activeIcon: <i className="ri-user-3-fill"></i>,
      description: 'Settings'
    }
  ]

  // Update active tab when location changes
  useEffect(() => {
    const currentPath = location.pathname
    setActiveTab(currentPath)
  }, [location])

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed w-full bottom-0 z-40 ${navColors.border}`}
    >
      {/* Background with subtle nature pattern */}
      <div className={`absolute inset-0 bg-gradient-to-b ${navColors.background} backdrop-blur-sm`}>
        {/* Subtle leaf pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-2 left-4 w-6 h-6 rounded-full bg-gradient-to-r from-[#4A7C3F] to-[#2D5A27]"></div>
          <div className="absolute top-4 right-8 w-4 h-4 rounded-full bg-gradient-to-r from-[#FFD166] to-[#FFB347]"></div>
          <div className="absolute bottom-6 left-10 w-5 h-5 rounded-full bg-gradient-to-r from-[#87CEEB] to-[#3498DB]"></div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="relative flex items-center justify-evenly py-1 px-2">
        {navItems.map((item, index) => {
          const isActive = activeTab === item.path

          return (
            <motion.div
              key={item.path}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05, type: "spring" }}
              className="relative"
            >
              <Link
                to={item.path}
                className="flex flex-col items-center justify-center w-14"
                onClick={() => setActiveTab(item.path)}
              >
                {/* Active indicator background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -top-4 w-16 h-1 bg-gradient-to-r from-[#4A7C3F] to-[#2D5A27] rounded-b-full"
                    initial={false}
                  />
                )}

                {/* Icon container with gradient background when active */}
                <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-1 transition-all duration-300 ${isActive
                    ? `bg-gradient-to-r ${navColors.activeBg} shadow-lg scale-110`
                    : 'bg-white/60 backdrop-blur-sm border border-white/40 shadow-md hover:scale-105'
                  }`}>
                  {/* Glow effect for active items */}
                  {isActive && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#4A7C3F] to-[#2D5A27] rounded-2xl blur-md opacity-30"></div>
                  )}

                  {/* Icon */}
                  <i className={`text-2xl transition-all duration-300 ${isActive ? navColors.activeIcon : navColors.inactiveIcon
                    }`}>
                    {isActive ? item.activeIcon : item.icon}
                  </i>

                  {/* Notification dot (example for habits) */}
                  {item.path === '/habit-list' && !isActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C] border-2 border-white"></div>
                  )}

                  
                  
                </div>

                {/* Label */}
                <span className={`font-['Source_Sans_Pro'] font-semibold text-xs transition-all duration-300 ${isActive ? navColors.activeText : navColors.inactiveText
                  }`}>
                  {item.label}
                </span>

                {/* Description for active item */}
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-['Source_Sans_Pro'] text-[8px] text-white/80 mt-0.5"
                  >
                    {item.description}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Floating action button for adding habits - positioned above navbar */}
      <Link
        to="/add-habit"
        className="absolute -top-7 left-1/2 transform -translate-x-1/2 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-[#4A7C3F] to-[#2D5A27] rounded-full opacity-20 blur-md"></div>
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-[#4A7C3F] to-[#6B8E23] flex items-center justify-center shadow-xl border-4 border-white">
            <i className="ri-add-large-line text-2xl text-white"></i>
            {/* Floating leaves animation */}
            <motion.div
              animate={{
                y: [0, -5, 0],
                rotate: [0, 10, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }}
              className="absolute -top-2 -right-2"
            >
              <i className="ri-leaf-fill text-lg text-[#FFD166]"></i>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default Navbar