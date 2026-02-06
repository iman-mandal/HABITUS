import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaCheck, FaTimes, FaLock } from "react-icons/fa";

const CalendarView = ({ history = [], theme = 'dark' }) => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const year = currentYear;
  const month = currentMonth;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Theme colors
  const themeColors = {
    dark: {
      bgGradient: "from-[#2E3944] to-[#212A31]",
      border: "border-[#748D92]/30",
      textPrimary: "#D3D9D4",
      textSecondary: "#748D92",
      accentFrom: "#124E66",
      accentTo: "#748D92",
      accentBg: "from-[#124E66]/20 to-[#124E66]/10",
      missedFrom: "#8B0000",
      missedTo: "#B22222",
      dayBg: "#212A31",
      dayBorder: "border-[#748D92]/20",
      dayHoverBorder: "border-[#748D92]/40",
      weekendColor: "#124E66",
      progressBg: "#212A31",
      statBoxBg: "#212A31",
      statBoxBorder: "border-[#748D92]/20",
      dividerColor: "#748D92/30",
    },
    light: {
      bgGradient: "from-[#F1F0E8] to-[#E5E1DA]",
      border: "border-[#89A8B2]/40",
      textPrimary: "#2E3944",
      textSecondary: "#5A6D77",
      accentFrom: "#B3C8CF",
      accentTo: "#89A8B2",
      accentBg: "from-[#B3C8CF]/30 to-[#B3C8CF]/10",
      missedFrom: "#D86A6A",
      missedTo: "#C45C5C",
      dayBg: "#F1F0E8",
      dayBorder: "border-[#89A8B2]/30",
      dayHoverBorder: "border-[#89A8B2]/50",
      weekendColor: "#89A8B2",
      progressBg: "#E5E1DA",
      statBoxBg: "#F1F0E8",
      statBoxBorder: "border-[#89A8B2]/30",
      dividerColor: "#89A8B2/30",
    }
  };

  const colors = themeColors[theme];

  // Map backend history
  const historyMap = {};
  history.forEach(h => {
    const dateStr = new Date(isNaN(h.date) ? h.date : parseInt(h.date)).toISOString().split('T')[0];
    historyMap[dateStr] = h.completed ? "done" : "missed";
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
    return date > today;
  };

  const getStatusStyle = (status, day) => {
    const baseStyles = "h-12 w-12 flex flex-col items-center justify-center rounded-xl transition-all duration-300";
    const todayFlag = isToday(day);
    const futureFlag = isFutureDate(day);

    if (todayFlag) {
      return `${baseStyles} bg-gradient-to-r ${theme === 'dark' ? 'from-[#124E66] to-[#748D92]' : 'from-[#B3C8CF] to-[#89A8B2]'} text-[#D3D9D4] border-2 ${theme === 'dark' ? 'border-[#D3D9D4]' : 'border-[#2E3944]'} shadow-lg cursor-not-allowed`;
    }

    if (futureFlag) {
      return `${baseStyles} bg-${theme === 'dark' ? '[#212A31]' : '[#F1F0E8]'} ${theme === 'dark' ? 'text-[#748D92]/40' : 'text-[#5A6D77]/40'} border ${colors.dayBorder} opacity-50 cursor-not-allowed`;
    }

    if (status === "done") return `${baseStyles} bg-gradient-to-r ${colors.accentBg} ${theme === 'dark' ? 'text-[#D3D9D4]' : 'text-[#2E3944]'} border ${theme === 'dark' ? 'border-[#748D92]/30' : 'border-[#89A8B2]/40'}`;
    if (status === "missed") return `${baseStyles} bg-gradient-to-r from-[${colors.missedFrom}]/20 to-[${colors.missedTo}]/10 ${theme === 'dark' ? 'text-[#748D92]' : 'text-[#5A6D77]'} border ${theme === 'dark' ? 'border-[#748D92]/20' : 'border-[#89A8B2]/30'}`;
    return `${baseStyles} bg-${theme === 'dark' ? '[#212A31]' : '[#F1F0E8]'} ${theme === 'dark' ? 'text-[#748D92]' : 'text-[#5A6D77]'} border ${colors.dayBorder}`;
  };

  const getDayStyle = (day) => {
    if (day === 0 || day === 6) return `text-${theme === 'dark' ? '[#124E66]' : '[#89A8B2]'}`;
    return `text-[${colors.textPrimary}]`;
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

  return (
    <div className="p-1">
      <div className={`bg-gradient-to-br ${colors.bgGradient} rounded-2xl border ${colors.border} shadow-xl p-6`}>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handlePrevMonth}
            className={`w-10 h-10 rounded-full bg-gradient-to-r from-[${colors.accentFrom}] to-[${colors.accentTo}] flex items-center justify-center ${theme === 'dark' ? 'text-[#D3D9D4]' : 'text-[#2E3944]'} hover:opacity-90 transition active:scale-95`}
          >
            <FaChevronLeft />
          </button>

          <div className="text-center">
            <h2 className={`text-xl font-['Merriweather'] font-bold text-[${colors.textPrimary}]`}>
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r from-[${colors.accentFrom}] to-[${colors.accentTo}]`}></div>
                <span className={`text-[${colors.textSecondary}] text-sm font-['Source_Sans_Pro']`}>
                  {monthStats.completed} completed
                </span>
              </div>
              <div className={`h-4 w-px bg-${colors.dividerColor}`}></div>
              <span className={`text-[${colors.textSecondary}] text-sm font-['Source_Sans_Pro']`}>
                {monthStats.total > 0 ? Math.round((monthStats.completed / monthStats.total) * 100) : 0}% rate
              </span>
            </div>
          </div>

          <button
            onClick={handleNextMonth}
            className={`w-10 h-10 rounded-full bg-gradient-to-r from-[${colors.accentFrom}] to-[${colors.accentTo}] flex items-center justify-center ${theme === 'dark' ? 'text-[#D3D9D4]' : 'text-[#2E3944]'} hover:opacity-90 transition active:scale-95`}
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-[20px] mr-4 text-center mb-4">
          {days.map((day, i) => (
            <span
              key={i}
              className={`text-sm font-['Source_Sans_Pro'] font-semibold ${getDayStyle(i)}`}
            >
              {day}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-3">
          {/* Empty slots before month starts */}
          {[...Array(firstDayIndex)].map((_, i) => (
            <div key={`empty-${i}`} className="h-12" />
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
                className={getStatusStyle(status, day)}
              >
                <span className={`text-xs mb-1 font-['Source_Sans_Pro'] ${todayFlag ? 'font-bold text-white' : theme === 'dark' ? 'text-[#748D92]' : 'text-[#5A6D77]'}`}>
                  {day}
                </span>
                <div className="flex items-center justify-center">
                  {status === "done" && !todayFlag && !futureFlag && (
                    <FaCheck className={theme === 'dark' ? "text-[#124E66]" : "text-[#B3C8CF]"} />
                  )}
                  {status === "missed" && !todayFlag && !futureFlag && (
                    <FaTimes className={theme === 'dark' ? "text-[#8B0000]" : "text-[#D86A6A]"} />
                  )}
                  {todayFlag && (
                    <FaLock className="text-white text-xs" />
                  )}
                  {futureFlag && (
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend & Stats */}
        <div className={`mt-8 pt-6 border-t ${theme === 'dark' ? 'border-[#748D92]/30' : 'border-[#89A8B2]/30'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r from-[${colors.accentFrom}] to-[${colors.accentTo}] flex items-center justify-center`}>
                  <FaCheck className={`${theme === 'dark' ? 'text-[#D3D9D4]' : 'text-[#2E3944]'} text-xs`} />
                </div>
                <span className={`text-[${colors.textPrimary}] text-sm font-['Source_Sans_Pro']`}>Completed</span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r from-[${colors.missedFrom}] to-[${colors.missedTo}] flex items-center justify-center`}>
                  <FaTimes className={`${theme === 'dark' ? 'text-[#D3D9D4]' : 'text-[#2E3944]'} text-xs`} />
                </div>
                <span className={`text-[${colors.textPrimary}] text-sm font-['Source_Sans_Pro']`}>Missed</span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r from-[${colors.accentFrom}] to-[${colors.accentTo}] ${theme === 'dark' ? 'border-2 border-[#D3D9D4]' : 'border-2 border-[#2E3944]'} flex items-center justify-center`}>
                  <FaLock className="text-xs" />
                </div>
                <span className={`text-[${colors.textPrimary}] text-sm font-['Source_Sans_Pro']`}>Today (Locked)</span>
              </div>
            </div>

            {/* Monthly Summary */}
            <div className={`${theme === 'dark' ? 'bg-[#212A31]' : 'bg-[#F1F0E8]'} rounded-xl px-4 py-2 border ${theme === 'dark' ? 'border-[#748D92]/20' : 'border-[#89A8B2]/30'}`}>
              <span className={`text-[${colors.textSecondary}] text-sm font-['Source_Sans_Pro']`}>
                Monthly: <span className={`text-[${colors.textPrimary}] font-semibold`}>
                  {monthStats.completed}/{monthStats.total}
                </span> days
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className={`text-[${colors.textPrimary}] text-sm font-['Source_Sans_Pro']`}>Monthly Progress</span>
            <span className={`text-[${colors.textPrimary}] font-['Montserrat'] font-semibold`}>
              {monthStats.total > 0 ? Math.round((monthStats.completed / monthStats.total) * 100) : 0}%
            </span>
          </div>
          <div className={`h-2 ${theme === 'dark' ? 'bg-[#212A31]' : 'bg-[#E5E1DA]'} rounded-full overflow-hidden border ${theme === 'dark' ? 'border-[#748D92]/20' : 'border-[#89A8B2]/30'}`}>
            <div
              className={`h-full bg-gradient-to-r from-[${colors.accentFrom}] to-[${colors.accentTo}] rounded-full transition-all duration-700`}
              style={{
                width: `${monthStats.total > 0 ? Math.round((monthStats.completed / monthStats.total) * 100) : 0}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;