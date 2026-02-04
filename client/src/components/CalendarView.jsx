import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaCheck, FaTimes } from "react-icons/fa";

const CalendarView = ({ history = [] }) => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const today = new Date();
  const year = currentYear;
  const month = currentMonth;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Map backend history
  const historyMap = {};
  history.forEach(h => {
    const dateStr = new Date(isNaN(h.date) ? h.date : parseInt(h.date)).toISOString().split('T')[0];
    historyMap[dateStr] = h.completed ? "done" : "missed";
  });

  const getStatusStyle = (status, day, isToday) => {
    const baseStyles = "h-12 w-12 flex flex-col items-center justify-center rounded-xl transition-all duration-300";

    if (isToday) {
      return `${baseStyles} bg-gradient-to-r from-[#124E66] to-[#748D92] text-[#D3D9D4] border-2 border-[#D3D9D4] shadow-lg`;
    }

    if (status === "done") return `${baseStyles} bg-gradient-to-r from-[#124E66]/20 to-[#124E66]/10 text-[#D3D9D4] border border-[#748D92]/30`;
    if (status === "missed") return `${baseStyles} bg-gradient-to-r from-[#8B0000]/20 to-[#B22222]/10 text-[#748D92] border border-[#748D92]/20`;
    return `${baseStyles} bg-[#212A31] text-[#748D92] border border-[#748D92]/20 hover:border-[#748D92]/40`;
  };

  const getDayStyle = (day) => {
    if (day === 0 || day === 6) return "text-[#124E66]"; // Weekend color
    return "text-[#D3D9D4]";
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

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
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
      <div className="bg-gradient-to-br from-[#2E3944] to-[#212A31] rounded-2xl border border-[#748D92]/30 shadow-xl p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handlePrevMonth}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center text-[#D3D9D4] hover:opacity-90 transition active:scale-95"
          >
            <FaChevronLeft />
          </button>

          <div className="text-center">
            <h2 className="text-xl font-['Merriweather'] font-bold text-[#D3D9D4]">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92]"></div>
                <span className="text-[#748D92] text-sm font-['Source_Sans_Pro']">
                  {monthStats.completed} completed
                </span>
              </div>
              <div className="h-4 w-px bg-[#748D92]/30"></div>
              <span className="text-[#748D92] text-sm font-['Source_Sans_Pro']">
                {monthStats.total > 0 ? Math.round((monthStats.completed / monthStats.total) * 100) : 0}% rate
              </span>
            </div>
          </div>

          <button
            onClick={handleNextMonth}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center text-[#D3D9D4] hover:opacity-90 transition active:scale-95"
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

            return (
              <div
                key={date}
                className={getStatusStyle(status, day, todayFlag)}
              >
                <span className="text-xs mb-1 font-['Source_Sans_Pro']">
                  {day}
                </span>
                <div className="flex items-center justify-center">
                  {status === "done" && (
                    <FaCheck className="text-[#124E66]" />
                  )}
                  {status === "missed" && (
                    <FaTimes className="text-[#8B0000]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend & Stats */}
        <div className="mt-8 pt-6 border-t border-[#748D92]/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                  <FaCheck className="text-[#D3D9D4] text-xs" />
                </div>
                <span className="text-[#D3D9D4] text-sm font-['Source_Sans_Pro']">Completed</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#8B0000] to-[#B22222] flex items-center justify-center">
                  <FaTimes className="text-[#D3D9D4] text-xs" />
                </div>
                <span className="text-[#D3D9D4] text-sm font-['Source_Sans_Pro']">Missed</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] border-2 border-[#D3D9D4]"></div>
                <span className="text-[#D3D9D4] text-sm font-['Source_Sans_Pro']">Today</span>
              </div>
            </div>

            {/* Monthly Summary */}
            <div className="bg-[#212A31] rounded-xl px-4 py-2 border border-[#748D92]/20">
              <span className="text-[#748D92] text-sm font-['Source_Sans_Pro']">
                Monthly: <span className="text-[#D3D9D4] font-semibold">
                  {monthStats.completed}/{monthStats.total}
                </span> days
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-[#D3D9D4] text-sm font-['Source_Sans_Pro']">Monthly Progress</span>
            <span className="text-[#D3D9D4] font-['Montserrat'] font-semibold">
              {monthStats.total > 0 ? Math.round((monthStats.completed / monthStats.total) * 100) : 0}%
            </span>
          </div>
          <div className="h-2 bg-[#212A31] rounded-full overflow-hidden border border-[#748D92]/20">
            <div
              className="h-full bg-gradient-to-r from-[#124E66] to-[#748D92] rounded-full transition-all duration-700"
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
