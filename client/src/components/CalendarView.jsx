import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaCheck, FaTimes, FaLock } from "react-icons/fa";

const CalendarView = ({ history = [], theme = "dark" }) => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const year = currentYear;
  const month = currentMonth;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  //  Theme colors
  const themeColors = {
    dark: {
      bgGradient: "linear-gradient(to bottom right, #2E3944, #212A31)",
      border: "rgba(116,141,146,0.3)",
      textPrimary: "#D3D9D4",
      textSecondary: "#748D92",
      accentFrom: "#124E66",
      accentTo: "#748D92",
      accentBg: "rgba(18,78,102,0.2)",
      missedFrom: "#8B0000",
      missedTo: "#B22222",
      dayBg: "#212A31",
      dividerColor: "rgba(116,141,146,0.3)",
    },
    light: {
      bgGradient: "linear-gradient(to bottom right, #F1F0E8, #E5E1DA)",
      border: "rgba(137,168,178,0.4)",
      textPrimary: "#2E3944",
      textSecondary: "#5A6D77",
      accentFrom: "#B3C8CF",
      accentTo: "#89A8B2",
      accentBg: "rgba(179,200,207,0.3)",
      missedFrom: "#D86A6A",
      missedTo: "#C45C5C",
      dayBg: "#F1F0E8",
      dividerColor: "rgba(137,168,178,0.3)",
    },
  };

  //  SAFE THEME FIX
  const colors = themeColors[theme] || themeColors.dark;

  //  Map history
  const historyMap = {};
  history.forEach((h) => {
    const dateStr = new Date(h.date).toISOString().split("T")[0];
    historyMap[dateStr] = h.completed ? "done" : "missed";
  });

  const isToday = (day) => {
    const date = new Date(year, month, day);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isFutureDate = (day) => {
    return new Date(year, month, day) > today;
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setCurrentMonth(11);
      setCurrentYear(year - 1);
    } else {
      setCurrentMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
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

  //  Stats
  const calculateMonthStats = () => {
    let completed = 0;
    let total = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const status = historyMap[date];
      if (status === "done") completed++;
      if (status) total++;
    }

    return { completed, total };
  };

  const monthStats = calculateMonthStats();

  return (
    <div className="p-2">
      {/* 🔥 MAIN CARD */}
      <div
        className="rounded-2xl shadow-xl p-6"
        style={{
          background: colors.bgGradient,
          border: `1px solid ${colors.border}`,
        }}
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={handlePrevMonth}>
            <FaChevronLeft />
          </button>

          <h2 style={{ color: colors.textPrimary }}>
            {monthNames[month]} {year}
          </h2>

          <button onClick={handleNextMonth}>
            <FaChevronRight />
          </button>
        </div>

        {/* WEEK DAYS */}
        <div className="grid grid-cols-7 mb-3 text-center">
          {days.map((d, i) => (
            <span key={i} style={{ color: colors.textSecondary }}>
              {d}
            </span>
          ))}
        </div>

        {/* CALENDAR */}
        <div className="grid grid-cols-7 gap-2">
          {[...Array(firstDayIndex)].map((_, i) => (
            <div key={i}></div>
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const status = historyMap[date];

            return (
              <div
                key={date}
                className="h-12 flex flex-col items-center justify-center rounded-lg"
                style={{
                  background: colors.dayBg,
                  color: colors.textPrimary,
                  opacity: isFutureDate(day) ? 0.5 : 1,
                }}
              >
                <span>{day}</span>

                {!isFutureDate(day) && status === "done" && <FaCheck />}
                {!isFutureDate(day) && status === "missed" && <FaTimes />}
                {isToday(day) && <FaLock />}
              </div>
            );
          })}
        </div>

        {/* STATS */}
        <div className="mt-6">
          <div style={{ color: colors.textPrimary }}>
            {monthStats.completed}/{monthStats.total} completed
          </div>

          <div
            className="h-2 mt-2 rounded"
            style={{ background: colors.dayBg }}
          >
            <div
              className="h-2 rounded"
              style={{
                width: `${monthStats.total ? (monthStats.completed / monthStats.total) * 100 : 0}%`,
                background: `linear-gradient(to right, ${colors.accentFrom}, ${colors.accentTo})`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;