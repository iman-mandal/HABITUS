import React, { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'

const HabitAreaChartGraph = ({ habits }) => {

  const chartData = useMemo(() => {
    if (!habits || habits.length === 0) return []

    const now = new Date()
    const weeksCompleted = [0, 0, 0, 0] 
    const weeksTotal = [0, 0, 0, 0] 

    habits.forEach(habit => {
      habit.history?.forEach(h => {
        const date = new Date(h.date)
        const diffWeeks = Math.floor((now - date) / (7 * 24 * 60 * 60 * 1000))
        if (diffWeeks >= 0 && diffWeeks < 4) {
          weeksTotal[3 - diffWeeks] += 1
          if (h.completed) weeksCompleted[3 - diffWeeks] += 1
        }
      })
    })

    // Calculate percentage for each week
    return weeksCompleted.map((completed, idx) => ({
      name: `Week ${idx + 1}`,
      value: weeksTotal[idx] > 0 ? Math.round((completed / weeksTotal[idx]) * 100) : 0
    }))

  }, [habits])

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-gray-700 font-semibold mb-3">
        Monthly Completion Trend
      </h3>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F7CFE" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4F7CFE" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F3F4F6"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              tickFormatter={(value) => `${value}%`} // Show percentage
              domain={[0, 100]}
            />

            <Tooltip formatter={(value) => `${value}%`} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#4F7CFE"
              strokeWidth={3}
              fill="url(#colorValue)"
              dot={{
                r: 4,
                fill: '#FFFFFF',
                stroke: '#4F7CFE',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default HabitAreaChartGraph
