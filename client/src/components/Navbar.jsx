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
    const userTheme = localStorage.getItem('userTheme') || 'dark'
    setCurrentTheme(userTheme)
  }, [])

  // Set CSS variables for hover borders
  useEffect(() => {
    if (currentTheme === 'light') {
      document.documentElement.style.setProperty('--nav-icon-hover-border', 'rgba(137, 168, 178, 0.4)');
    } else {
      document.documentElement.style.setProperty('--nav-icon-hover-border', 'rgba(116, 141, 146, 0.4)');
    }
  }, [currentTheme]);

  const isLight = currentTheme === 'light';

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
      className={`navbar-container ${isLight ? 'navbar-container-light' : 'navbar-container-dark'}`}
    >
      {/* Background with subtle nature pattern */}
      <div className={`navbar-background ${isLight ? 'navbar-background-light' : 'navbar-background-dark'}`}>
        {/* Subtle decorative pattern overlay */}
        <div className="decorative-pattern">
          <div className={`pattern-circle-1 ${isLight ? 'pattern-circle-1-light' : 'pattern-circle-1-dark'}`}></div>
          <div className={`pattern-circle-2 ${isLight ? 'pattern-circle-2-light' : 'pattern-circle-2-dark'}`}></div>
          <div className={`pattern-circle-3 ${isLight ? 'pattern-circle-3-light' : 'pattern-circle-3-dark'}`}></div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="navigation-items">
        {navItems.map((item, index) => {
          const isActive = activeTab === item.path

          return (
            <motion.div
              key={item.path}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05, type: "spring" }}
              className="nav-item"
            >
              <Link
                to={item.path}
                className="nav-link"
                onClick={() => setActiveTab(item.path)}
              >
                {/* Active indicator background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className={`active-indicator ${isLight ? 'active-indicator-light' : 'active-indicator-dark'}`}
                    initial={false}
                  />
                )}

                {/* Icon container with gradient background when active */}
                <div className={`icon-container ${isActive
                  ? (isLight ? 'icon-container-active-light' : 'icon-container-active-dark')
                  : (isLight ? 'icon-container-inactive-light' : 'icon-container-inactive-dark')
                  }`}>

                  {/* Glow effect for active items */}
                  {isActive && (
                    <div className={`icon-glow ${isLight ? 'icon-glow-light' : 'icon-glow-dark'}`}></div>
                  )}

                  {/* Icon */}
                  <i className={`nav-icon ${isActive
                    ? (isLight ? 'icon-active-light' : 'icon-active-dark')
                    : (isLight ? 'icon-inactive-light' : 'icon-inactive-dark')
                    }`}>
                    {isActive ? item.activeIcon : item.icon}
                  </i>

                </div>

                {/* Label */}
                <span className={`nav-label ${isActive
                  ? (isLight ? 'label-active-light' : 'label-active-dark')
                  : (isLight ? 'label-inactive-light' : 'label-inactive-dark')
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
        className="fab-container"
      >
        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="relative hover-scale"
        >
          <div className={`fab-glow ${isLight ? 'fab-glow-light' : 'fab-glow-dark'}`}></div>
          <div className={`fab-button ${isLight ? 'fab-button-light' : 'fab-button-dark'}`}>
            <i className={`ri-add-large-line fab-icon ${isLight ? 'fab-icon-light' : 'fab-icon-dark'}`}></i>
            {/* Floating leaves animation */}
            <div className="floating-leaf leaf-float">
              <i className={`ri-leaf-fill leaf-icon ${isLight ? 'leaf-icon-light' : 'leaf-icon-dark'}`}></i>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default Navbar