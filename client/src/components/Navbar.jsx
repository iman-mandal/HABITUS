import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'
import { motion } from 'framer-motion'

const Navbar = () => {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('/home')
  const [currentTheme, setCurrentTheme] = useState('dark')

  // Get theme from localStorage or use default
  useEffect(() => {
    const userTheme = localStorage.getItem('userTheme') || 'light'
    setCurrentTheme(userTheme)
  }, [])

  // Theme configuration - BOTH LIGHT AND DARK MODES
  const themeConfig = {
    // LIGHT MODE COLORS (using your specified palette: F1F0E8, E5E1DA, B3C8CF, 89A8B2)
    light: {
      // Active state colors
      activeBg: 'from-[#89A8B2] to-[#B3C8CF]', // Soft blue gradient
      activeIcon: 'text-[#2E3944]', // Dark blue-gray text
      activeText: 'text-[#2E3944]', // Dark blue-gray text
      
      // Inactive state colors
      inactiveIcon: 'text-[#5A6D74]', // Muted blue-gray
      inactiveText: 'text-[#5A6D74]', // Muted blue-gray
      
      // Background colors
      background: 'from-[#F1F0E8] to-[#E5E1DA]', // Cream gradient
      navBorder: 'border-t border-[#B3C8CF]/50', // Light blue border
      
      // Card backgrounds
      cardBg: 'from-[#F1F0E8]/80 to-[#E5E1DA]/80', // Semi-transparent cream
      cardBorder: 'border-[#B3C8CF]/30', // Light blue border
      
      // FAB (Floating Action Button) colors
      fabBg: 'from-[#89A8B2] to-[#B3C8CF]', // Soft blue gradient
      fabIcon: 'text-[#2E3944]', // Dark blue-gray icon
      fabBorder: 'border-[#F1F0E8]', // Cream border
      
      // Indicator colors
      activeIndicator: 'from-[#89A8B2] to-[#B3C8CF]', // Soft blue gradient
      
      // Pattern colors (for decorative elements)
      pattern1: 'from-[#89A8B2] to-[#B3C8CF]', // Blue gradient
      pattern2: 'from-[#F1F0E8] to-[#E5E1DA]', // Cream gradient
      pattern3: 'from-[#B3C8CF] to-[#89A8B2]', // Reversed blue gradient
    },
    
    // DARK MODE COLORS (original colors)
    dark: {
      // Active state colors
      activeBg: 'from-[#124E66] to-[#748D92]', // Deep blue gradient
      activeIcon: 'text-[#D3D9D4]', // Off-white text
      activeText: 'text-[#D3D9D4]', // Off-white text
      
      // Inactive state colors
      inactiveIcon: 'text-[#748D92]', // Muted slate blue
      inactiveText: 'text-[#748D92]', // Muted slate blue
      
      // Background colors
      background: 'from-[#212A31] to-[#2E3944]', // Dark blue gradient
      navBorder: 'border-t border-[#748D92]/30', // Slate blue border
      
      // Card backgrounds
      cardBg: 'from-[#2E3944]/60 to-[#212A31]/60', // Semi-transparent dark blue
      cardBorder: 'border-[#748D92]/20', // Slate blue border
      
      // FAB (Floating Action Button) colors
      fabBg: 'from-[#124E66] to-[#748D92]', // Deep blue gradient
      fabIcon: 'text-[#D3D9D4]', // Off-white icon
      fabBorder: 'border-[#212A31]', // Dark blue border
      
      // Indicator colors
      activeIndicator: 'from-[#124E66] to-[#748D92]', // Deep blue gradient
      
      // Pattern colors (for decorative elements)
      pattern1: 'from-[#124E66] to-[#748D92]', // Blue gradient
      pattern2: 'from-[#212A31] to-[#2E3944]', // Dark blue gradient
      pattern3: 'from-[#748D92] to-[#124E66]', // Reversed blue gradient
    }
  }
  const theme = themeConfig[currentTheme] || themeConfig.dark



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

  // Update theme when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const userTheme = localStorage.getItem('userTheme') || 'dark'
      setCurrentTheme(userTheme)
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also check for theme changes periodically (in case of same-tab updates)
    const interval = setInterval(() => {
      const userTheme = localStorage.getItem('userTheme') || 'dark'
      if (userTheme !== currentTheme) {
        setCurrentTheme(userTheme)
      }
    }, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [currentTheme])

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed w-full bottom-0 z-40 ${theme.navBorder}`}
    >
      {/* Background with subtle nature pattern */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.background} backdrop-blur-sm`}>
        {/* Subtle decorative pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className={`absolute top-2 left-4 w-6 h-6 rounded-full bg-gradient-to-r ${theme.pattern1}`}></div>
          <div className={`absolute top-4 right-8 w-4 h-4 rounded-full bg-gradient-to-r ${theme.pattern2}`}></div>
          <div className={`absolute bottom-6 left-10 w-5 h-5 rounded-full bg-gradient-to-r ${theme.pattern3}`}></div>
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
                    className={`absolute -top-4 w-16 h-1 bg-gradient-to-r ${theme.activeIndicator} rounded-b-full`}
                    initial={false}
                  />
                )}

                {/* Icon container with gradient background when active */}
                <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-1 transition-all duration-300 ${isActive
                  ? `bg-gradient-to-r ${theme.activeBg} shadow-lg scale-110 border ${theme.cardBorder}`
                  : `bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.cardBorder} shadow-md hover:scale-105 hover:border-opacity-40`
                  }`} style={{
                    borderColor: isActive 
                      ? 'inherit' 
                      : currentTheme === 'light' 
                        ? 'rgba(179, 200, 207, 0.3)' 
                        : 'rgba(116, 141, 146, 0.2)',
                    hoverBorderColor: currentTheme === 'light' 
                      ? 'rgba(137, 168, 178, 0.4)' 
                      : 'rgba(116, 141, 146, 0.4)'
                  }}>
                  {/* Glow effect for active items */}
                  {isActive && (
                    <div className={`absolute -inset-1 bg-gradient-to-r ${theme.activeBg} rounded-2xl blur-md opacity-20`}></div>
                  )}

                  {/* Icon */}
                  <i className={`text-xl transition-all duration-300 ${isActive ? theme.activeIcon : theme.inactiveIcon
                    }`}>
                    {isActive ? item.activeIcon : item.icon}
                  </i>

                </div>

                {/* Label */}
                <span className={`font-['Source_Sans_Pro'] font-semibold text-xs transition-all duration-300 ${isActive ? theme.activeText : theme.inactiveText
                  }`}>
                  {item.label}
                </span>

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
          <div className={`absolute -inset-4 bg-gradient-to-r ${theme.fabBg} rounded-full opacity-20 blur-md`}></div>
          <div className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${theme.fabBg} flex items-center justify-center shadow-xl border-4 ${theme.fabBorder}`}>
            <i className={`ri-add-large-line text-2xl ${theme.fabIcon}`}></i>
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
              <i className={`ri-leaf-fill text-lg ${theme.fabIcon}`}></i>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default Navbar