import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const HabitAreaChartGraph = ({ habits }) => {
  // If habitData is an object (single habit), wrap it in an array for the logic
  const habit = Array.isArray(habits) ? habits : [habits];
  const [filter, setFilter] = useState('monthly');

  const chartData = useMemo(() => {
    if (!habit || habit.length === 0) return [];

    const now = new Date();
    let buckets = [];
    let labels = [];

    // Initialize buckets based on filter
    if (filter === 'weekly') {
      buckets = Array(7).fill(0).map(() => ({ completed: 0, total: 0 }));
      labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    } else if (filter === 'monthly') {
      buckets = Array(4).fill(0).map(() => ({ completed: 0, total: 0 }));
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    } else {
      buckets = Array(12).fill(0).map(() => ({ completed: 0, total: 0 }));
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }

    habit.forEach(habit => {
      habit.history?.forEach(h => {
        // Convert string date/timestamp to Date Object
        const date = new Date(isNaN(h.date) ? h.date : parseInt(h.date));
        let index = -1;

        if (filter === 'weekly') {
          index = date.getDay(); // 0 for Sun, 1 for Mon...
        } else if (filter === 'monthly') {
          const diffWeeks = Math.floor((now - date) / (7 * 24 * 60 * 60 * 1000));
          if (diffWeeks >= 0 && diffWeeks < 4) index = 3 - diffWeeks;
        } else if (filter === 'yearly') {
          index = date.getMonth();
        }

        if (index >= 0 && buckets[index]) {
          buckets[index].total += 1;
          if (h.completed) buckets[index].completed += 1;
        }
      });
    });

    return buckets.map((b, i) => ({
      name: labels[i],
      // If no data for that period, return 0 to keep the line continuous
      value: b.total ? Math.round((b.completed / b.total) * 100) : 0
    }));
  }, [habits, filter]);

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 shadow-lg rounded-[32px] border border-white">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-gray-800 font-bold text-lg">Performance Graph</h3>
        <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-200">
          {['weekly', 'monthly', 'yearly'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === f 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* CHART AREA */}
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F7CFE" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4F7CFE" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />

            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} 
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={v => `${v}%`}
            />

            <Tooltip 
              cursor={{ stroke: '#4F7CFE', strokeWidth: 1, strokeDasharray: '5 5' }}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              formatter={(v) => [`${v}%`, 'Completion']}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#4F7CFE"
              strokeWidth={4}
              fill="url(#colorValue)"
              animationDuration={1500}
              dot={{ r: 5, fill: '#fff', stroke: '#4F7CFE', strokeWidth: 2 }}
              activeDot={{ r: 7, strokeWidth: 0, fill: '#4F7CFE' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HabitAreaChartGraph;