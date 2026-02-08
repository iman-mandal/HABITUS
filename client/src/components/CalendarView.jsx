import React, { useState } from "react";
import '../global.css';
import { FaChevronLeft, FaChevronRight, FaCheck, FaTimes, FaLock } from "react-icons/fa";

const CalendarView = ({ history = [], theme = 'dark', onDateClick }) => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const year = currentYear;
  const month = currentMonth;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Map backend history to date strings
  const historyMap = {};
  history.forEach(h => {
    try {
      const date = isNaN(h.date) ? new Date(h.date) : new Date(parseInt(h.date));
      const dateStr = date.toISOString().split('T')[0];
      historyMap[dateStr] = h.completed ? "done" : "missed";
    } catch (error) {
      console.error('Error parsing date:', h.date, error);
    }
  });

  // Check if a specific day is today
  const isToday = (day) => {
    const date = new Date(year, month, day);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if a date is in the future
  const isFutureDate = (day) => {
    const date = new Date(year, month, day);
    date.setHours(23, 59, 59, 999);
    return date > today;
  };

  const getStatusClass = (status, day) => {
    const todayFlag = isToday(day);
    const futureFlag = isFutureDate(day);

    if (todayFlag) return "day-cell day-today";
    if (futureFlag) return "day-cell day-future";
    if (status === "done") return "day-cell day-done";
    if (status === "missed") return "day-cell day-missed";
    return "day-cell day-empty-state";
  };

  const getDayClass = (dayIndex) => {
    if (dayIndex === 0 || dayIndex === 6) return "weekday-label weekend-day";
    return "weekday-label weekday-day";
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(year - 1);
    } else {
      setCurrentMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(year + 1);
    } else {
      setCurrentMonth(month + 1);
    }
  };

  const handleDateClick = (day, status, isFuture, isTodayFlag) => {
    if (onDateClick && !isFuture && !isTodayFlag) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      onDateClick(dateStr, status);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Calculate completion stats for current month
  const calculateMonthStats = () => {
    let completed = 0;
    let total = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const status = historyMap[date];
      if (status === "done") completed++;
      if (status === "done" || status === "missed") total++;
    }

    return { completed, total };
  };

  const monthStats = calculateMonthStats();
  const completionRate = monthStats.total > 0 ? Math.round((monthStats.completed / monthStats.total) * 100) : 0;

  return (
    <div className="calendar-container">
      <div className={`calendar-wrapper ${theme === 'dark' ? 'calendar-dark' : 'calendar-light'}`}>

        {/* Header */}
        <div className="calendar-header">
          <button
            onClick={handlePrevMonth}
            className="calendar-nav-button"
            aria-label="Previous month"
          >
            <FaChevronLeft />
          </button>

          <div className="text-center">
            <h2 className="calendar-title">
              {monthNames[month]} {year}
            </h2>
            <div className="calendar-stats">
              <div className="calendar-stat-item">
                <div className="calendar-stat-dot"></div>
                <span className="calendar-stat-text">
                  {monthStats.completed} completed
                </span>
              </div>
              <div className="calendar-divider"></div>
              <span className="calendar-stat-text">
                {completionRate}% rate
              </span>
            </div>
          </div>

          <button
            onClick={handleNextMonth}
            className="calendar-nav-button"
            aria-label="Next month"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Week Days */}
        <div className="calendar-weekdays">
          {days.map((day, i) => (
            <span
              key={i}
              className={getDayClass(i)}
            >
              {day}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {/* Empty slots before month starts */}
          {[...Array(firstDayIndex)].map((_, i) => (
            <div key={`empty-${i}`} className="day-empty" />
          ))}

          {/* Month days */}
          {[...Array(daysInMonth)].map((_, index) => {
            const day = index + 1;
            const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const status = historyMap[date];
            const todayFlag = isToday(day);
            const futureFlag = isFutureDate(day);

            return (
              <div
                key={date}
                className={getStatusClass(status, day)}
                onClick={() => handleDateClick(day, status, futureFlag, todayFlag)}
                aria-label={`${monthNames[month]} ${day}, ${year} - ${status === "done" ? "Completed" : status === "missed" ? "Missed" : "No data"}`}
                role="button"
                tabIndex={0}
              >
                <span className="day-number">
                  {day}
                </span>
                <div className="day-icon">
                  {status === "done" && !todayFlag && !futureFlag && (
                    <FaCheck className={`${theme === 'dark' ? 'icon-done' : 'icon-done'}`} />
                  )}
                  {status === "missed" && !todayFlag && !futureFlag && (
                    <FaTimes className={`${theme === 'dark' ? 'icon-missed' : 'icon-missed'}`} />
                  )}
                  {todayFlag && (
                    <FaLock className="icon-today" />
                  )}
                  {futureFlag && (
                    <div className="icon-future"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend & Stats */}
        <div className="calendar-footer footer-divider">
          <div className="footer-content">
            <div className="legend-container">
              <div className="legend-item">
                <div className="legend-icon legend-icon-done">
                  <FaCheck />
                </div>
                <span className="legend-text">Completed</span>
              </div>

              <div className="legend-item">
                <div className="legend-icon legend-icon-missed">
                  <FaTimes />
                </div>
                <span className="legend-text">Missed</span>
              </div>

              <div className="legend-item">
                <div className="legend-icon legend-icon-today">
                  <FaLock />
                </div>
                <span className="legend-text">Today (Locked)</span>
              </div>
            </div>

            {/* Monthly Summary */}
            <div className="summary-box">
              <span className="summary-text">
                Monthly: <span className="summary-highlight">
                  {monthStats.completed}/{monthStats.total}
                </span> days
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-header">
            <span className="progress-label">Monthly Progress</span>
            <span className="progress-percentage">{completionRate}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${completionRate}%` }}
              role="progressbar"
              aria-valuenow={completionRate}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;