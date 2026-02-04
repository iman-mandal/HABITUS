import React, { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

const HabitAreaChartGraph = ({ habits, timeRange = 'monthly' }) => {
  const [filter, setFilter] = useState(timeRange);

  // Dark theme colors
  const darkColors = {
    primary: '#124E66',
    secondary: '#748D92',
    accent: '#D3D9D4',
    success: '#748D92',
    water: '#2E3944',
    mental: '#212A31',
    background: 'rgba(33, 42, 49, 0.3)',
    grid: 'rgba(116, 141, 146, 0.1)'
  };

  // Filter options with icons
  const filterOptions = [
    { value: 'weekly', label: 'Weekly', icon: '📅', description: '7 days' },
    { value: 'monthly', label: 'Monthly', icon: '🗓️', description: '4 weeks' },
    { value: 'quarterly', label: 'Quarterly', icon: '📊', description: '3 months' },
    { value: 'yearly', label: 'Yearly', icon: '🌱', description: '12 months' },
  ];

  const chartData = useMemo(() => {
    if (!habits || habits.length === 0) {
      // Return sample data for empty state
      const labels = filter === 'weekly' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
        filter === 'monthly' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
          filter === 'quarterly' ? ['Month 1', 'Month 2', 'Month 3'] :
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      return labels.map(label => ({
        name: label,
        value: Math.floor(Math.random() * 30) + 40, // Sample data between 40-70%
        growth: Math.floor(Math.random() * 20) + 10,
      }));
    }

    const now = new Date();
    let buckets = [];
    let labels = [];
    let bucketCount = 0;

    // Initialize buckets based on filter
    switch (filter) {
      case 'weekly':
        bucketCount = 7;
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        break;
      case 'monthly':
        bucketCount = 4;
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        break;
      case 'quarterly':
        bucketCount = 3;
        labels = ['Month 1', 'Month 2', 'Month 3'];
        break;
      default: // yearly
        bucketCount = 12;
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }

    buckets = Array(bucketCount).fill(0).map(() => ({
      completed: 0,
      total: 0,
      growth: 0
    }));

    habits.forEach(habit => {
      habit.history?.forEach(h => {
        const date = new Date(isNaN(h.date) ? h.date : parseInt(h.date));
        let index = -1;

        switch (filter) {
          case 'weekly':
            index = (date.getDay() + 6) % 7; // Convert to Monday start
            break;
          case 'monthly':
            const weekOfMonth = Math.floor((date.getDate() - 1) / 7);
            index = Math.min(weekOfMonth, 3);
            break;
          case 'quarterly':
            const month = date.getMonth();
            index = Math.floor(month / 3);
            break;
          default: // yearly
            index = date.getMonth();
        }

        if (index >= 0 && buckets[index]) {
          buckets[index].total += 1;
          if (h.completed) buckets[index].completed += 1;
        }
      });
    });

    // Calculate growth trend
    for (let i = 1; i < buckets.length; i++) {
      const prevValue = buckets[i - 1].total ? Math.round((buckets[i - 1].completed / buckets[i - 1].total) * 100) : 0;
      const currValue = buckets[i].total ? Math.round((buckets[i].completed / buckets[i].total) * 100) : 0;
      buckets[i].growth = currValue - prevValue;
    }

    return buckets.map((b, i) => ({
      name: labels[i],
      value: b.total ? Math.round((b.completed / b.total) * 100) : 0,
      growth: b.growth,
      // Add trend indicator
      trend: b.growth > 5 ? 'up' : b.growth < -5 ? 'down' : 'stable'
    }));
  }, [habits, filter]);

  // Calculate overall statistics
  const stats = useMemo(() => {
    if (!habits || habits.length === 0) {
      return {
        avgCompletion: 65,
        bestPeriod: 'Week 3',
        growth: 12,
        streak: 0
      };
    }

    const totalCompleted = habits.reduce((acc, habit) =>
      acc + (habit.history?.filter(h => h.completed).length || 0), 0);
    const totalDays = habits.reduce((acc, habit) =>
      acc + (habit.history?.length || 0), 0);
    const avgCompletion = totalDays ? Math.round((totalCompleted / totalDays) * 100) : 0;

    // Find best period
    const bestPeriod = chartData.length > 0 ?
      chartData.reduce((max, item) => item.value > max.value ? item : max, { value: 0, name: 'None' }).name :
      'None';

    // Calculate growth
    const growth = chartData.length > 1 ?
      chartData[chartData.length - 1].value - chartData[0].value : 0;

    return {
      avgCompletion,
      bestPeriod,
      growth,
      streak: habits.reduce((acc, habit) => acc + (habit.streak || 0), 0)
    };
  }, [habits, chartData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2E3944]/90 backdrop-blur-sm p-4 rounded-xl border border-[#748D92]/30 shadow-lg">
          <p className="font-['Merriweather'] font-semibold text-[#D3D9D4] mb-2">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-['Source_Sans_Pro'] text-[#748D92]">Completion:</span>
              <span className="font-['Montserrat'] font-bold text-[#D3D9D4]">{payload[0].value}%</span>
            </div>
            {payload[1] && (
              <div className="flex items-center justify-between">
                <span className="font-['Source_Sans_Pro'] text-[#748D92]">Growth:</span>
                <span className={`font-['Montserrat'] font-bold ${payload[1].value > 0 ? 'text-[#748D92]' :
                  payload[1].value < 0 ? 'text-[#FF6B6B]' :
                    'text-[#748D92]/60'
                  }`}>
                  {payload[1].value > 0 ? '+' : ''}{payload[1].value}%
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#2E3944]/90 to-[#212A31]/90 rounded-xl p-4 border border-[#748D92]/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#748D92] to-[#124E66] flex items-center justify-center">
              <span className="text-[#D3D9D4] text-sm">✓</span>
            </div>
            <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">Avg. Rate</p>
          </div>
          <p className="font-['Montserrat'] font-bold text-[#D3D9D4] text-xl">{stats.avgCompletion}%</p>
        </div>

        <div className="bg-gradient-to-br from-[#2E3944]/90 to-[#212A31]/90 rounded-xl p-4 border border-[#748D92]/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#D3D9D4] to-[#748D92] flex items-center justify-center">
              <span className="text-[#212A31] text-sm">🏆</span>
            </div>
            <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">Best Period</p>
          </div>
          <p className="font-['Montserrat'] font-bold text-[#D3D9D4] text-xl truncate">{stats.bestPeriod}</p>
        </div>

        <div className="bg-gradient-to-br from-[#2E3944]/90 to-[#212A31]/90 rounded-xl p-4 border border-[#748D92]/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2E3944] to-[#124E66] flex items-center justify-center">
              <span className="text-[#D3D9D4] text-sm">📈</span>
            </div>
            <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">Growth</p>
          </div>
          <p className={`font-['Montserrat'] font-bold text-xl ${stats.growth > 0 ? 'text-[#748D92]' :
            stats.growth < 0 ? 'text-[#FF6B6B]' :
              'text-[#D3D9D4]'
            }`}>
            {stats.growth > 0 ? '+' : ''}{stats.growth}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#2E3944]/90 to-[#212A31]/90 rounded-xl p-4 border border-[#748D92]/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#124E66] to-[#212A31] flex items-center justify-center">
              <span className="text-[#D3D9D4] text-sm">🔥</span>
            </div>
            <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">Total Streaks</p>
          </div>
          <p className="font-['Montserrat'] font-bold text-[#D3D9D4] text-xl">{stats.streak}</p>
        </div>
      </div>

      {/* CHART CARD */}
      <div className="bg-gradient-to-br from-[#2E3944]/90 to-[#212A31]/90 backdrop-blur-sm rounded-2xl p-6 border border-[#748D92]/20 shadow-lg">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#212A31] flex items-center justify-center">
                <span className="text-[#D3D9D4] text-lg">📊</span>
              </div>
              <div>
                <h3 className="font-['Merriweather'] font-bold text-[#D3D9D4] text-lg">
                  Growth Trend
                </h3>
                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                  Track your habit completion over time
                </p>
              </div>
            </div>
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-['Source_Sans_Pro'] font-semibold transition-all ${filter === f.value
                  ? 'bg-gradient-to-r from-[#124E66] to-[#212A31] text-[#D3D9D4] shadow-lg shadow-[#124E66]/20'
                  : 'bg-[#212A31] text-[#748D92] border border-[#2E3944] hover:border-[#124E66]'
                  }`}
              >
                <span className="text-base">{f.icon}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CHART */}
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  {/* Primary gradient for completion */}
                  <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={darkColors.primary} stopOpacity={0.6} />
                    <stop offset="95%" stopColor={darkColors.primary} stopOpacity={0.1} />
                  </linearGradient>

                  {/* Secondary gradient for growth */}
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={darkColors.secondary} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={darkColors.secondary} stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={darkColors.grid}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#748D92', fontSize: 12, fontFamily: "'Source Sans Pro', sans-serif" }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  tick={{ fill: '#748D92', fontSize: 12, fontFamily: "'Source Sans Pro', sans-serif" }}
                  tickFormatter={value => `${value}%`}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: darkColors.primary, strokeWidth: 1, strokeDasharray: '5 5' }}
                />

                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                      {value === 'value' ? 'Completion' : 'Growth'}
                    </span>
                  )}
                  wrapperStyle={{
                    color: '#D3D9D4',
                    fontFamily: "'Source Sans Pro', sans-serif"
                  }}
                />

                {/* Completion Area - Improved with smoother curve */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={darkColors.primary}
                  strokeWidth={3}
                  fill="url(#colorCompletion)"
                  fillOpacity={1}
                  name="Completion"
                  dot={{
                    r: 5,
                    fill: darkColors.primary,
                    stroke: '#2E3944',
                    strokeWidth: 2
                  }}
                  activeDot={{
                    r: 7,
                    fill: darkColors.primary,
                    stroke: '#D3D9D4',
                    strokeWidth: 3
                  }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />

                {/* Growth Area - Dashed line for better visibility */}
                <Area
                  type="monotone"
                  dataKey="growth"
                  stroke={darkColors.secondary}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="url(#colorGrowth)"
                  fillOpacity={0.3}
                  name="Growth"
                  dot={{
                    r: 4,
                    fill: darkColors.secondary,
                    stroke: '#2E3944',
                    strokeWidth: 2
                  }}
                  activeDot={{
                    r: 6,
                    fill: darkColors.secondary,
                    stroke: '#D3D9D4',
                    strokeWidth: 3
                  }}
                  animationDuration={2000}
                  animationEasing="ease-in-out"
                  animationBegin={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#212A31] to-[#2E3944] flex items-center justify-center mb-4">
                <span className="text-4xl text-[#748D92]">📈</span>
              </div>
              <h4 className="font-['Merriweather'] text-[#D3D9D4] text-lg mb-2">No data yet</h4>
              <p className="font-['Source_Sans_Pro'] text-[#748D92] text-center max-w-md">
                Start tracking your habits to see your growth trends here
              </p>
            </div>
          )}
        </div>

        {/* CHART FOOTER */}
        <div className="mt-6 pt-6 border-t border-[#748D92]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92]"></div>
                <span className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">Completion Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#2E3944] to-[#124E66]"></div>
                <span className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">Growth Trend</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">Showing:</span>
              <span className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4] text-sm capitalize">
                {filter}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INSIGHTS */}
      {chartData.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-[#212A31] to-[#2E3944] rounded-2xl p-6 border border-[#748D92]/20">
          <h4 className="font-['Merriweather'] font-semibold text-[#D3D9D4] mb-4">
            Growth Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#748D92] to-[#124E66] flex items-center justify-center flex-shrink-0">
                <span className="text-[#D3D9D4] text-lg">📈</span>
              </div>
              <div>
                <p className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4]">
                  {stats.growth > 0 ? 'Positive Growth' : 'Needs Attention'}
                </p>
                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                  {stats.growth > 0
                    ? `Your completion rate increased by ${stats.growth}% this period`
                    : 'Try increasing consistency to see positive growth'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D3D9D4] to-[#748D92] flex items-center justify-center flex-shrink-0">
                <span className="text-[#212A31] text-lg">🏆</span>
              </div>
              <div>
                <p className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4]">
                  Best Performance
                </p>
                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                  {stats.bestPeriod} was your strongest period with {chartData.find(d => d.name === stats.bestPeriod)?.value || 0}% completion
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2E3944] to-[#124E66] flex items-center justify-center flex-shrink-0">
                <span className="text-[#D3D9D4] text-lg">🎯</span>
              </div>
              <div>
                <p className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4]">
                  Next Goal
                </p>
                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                  Aim for {stats.avgCompletion + 10}% average to reach your next milestone
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitAreaChartGraph;