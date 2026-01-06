import React from "react";
import { FaChevronLeft, FaChevronRight, FaCheck, FaTimes } from "react-icons/fa";

const CalendarView = ({ history = [] }) => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Map backend history
  const historyMap = {};
  history.forEach(h => {
    historyMap[h.date] = h.completed ? "done" : "missed";
  });

  const getStatusStyle = (status) => {
    if (status === "done") return "bg-green-100 text-green-600";
    if (status === "missed") return "bg-red-100 text-red-500";
    return "bg-white";
  };

  return (
    <div className="p-4">
      <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-xl p-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <FaChevronLeft className="text-gray-400 cursor-pointer" />
          <h2 className="text-lg font-semibold">
            {today.toLocaleString("default", { month: "long" })} {year}
          </h2>
          <FaChevronRight className="text-gray-400 cursor-pointer" />
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 text-center text-gray-400 text-sm mb-2">
          {days.map((day, i) => (
            <span className="text-[#4343ff] text-[13px] font-semibold font-serif" 
            key={i}>{day}</span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 text-sm">

          {/* Empty slots before month starts */}
          {[...Array(firstDayIndex)].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Month days */}
          {[...Array(daysInMonth)].map((_, index) => {
            const day = index + 1;
            const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const status = historyMap[date];

            return (
              <div
                key={date}
                className={`h-10 w-10 flex shadow-lg items-center justify-center rounded-lg ${getStatusStyle(status)}`}
              >
                {status === "done" && <FaCheck />}
                {status === "missed" && <FaTimes />}
                {!status && <span className="text-gray-400">{day}</span>}
              </div>
            );
          })}
        </div>

        <div className="flex justify-around mt-4 text-xs">
          <div className="flex items-center gap-1 text-green-600">
            <FaCheck /> Completed
          </div>
          <div className="flex items-center gap-1 text-red-500">
            <FaTimes /> Missed
          </div>
        </div>

      </div>
    </div>
  );
};

export default CalendarView;
