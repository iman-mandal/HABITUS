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
  let theme=localStorage.getItem('userTheme');
  // Theme colors
  const themeColors = {
    light: {
      primary: '#89A8B2',
      secondary: '#B3C8CF',
      accent: '#2E3944',
      success: '#89A8B2',
      error: '#FF6B6B',
      background: 'rgba(241, 240, 232, 0.3)',
      grid: 'rgba(137, 168, 178, 0.1)',
      textPrimary: '#2E3944',
      textSecondary: '#89A8B2',
      cardBg: 'from-[#F1F0E8]/90 to-[#E5E1DA]/90',
      cardBgSecondary: 'from-[#E5E1DA] to-[#F1F0E8]',
      cardBorder: 'border-[#B3C8CF]/20',
      buttonActive: 'from-[#89A8B2] to-[#B3C8CF]',
      buttonInactive: 'bg-[#F1F0E8]',
      buttonTextActive: '#F1F0E8',
      buttonTextInactive: '#89A8B2',
      buttonBorder: 'border-[#B3C8CF]/30',
      iconBg: 'from-[#89A8B2] to-[#B3C8CF]',
      iconText: '#F1F0E8',
      iconBgAlt: 'from-[#F1F0E8] to-[#E5E1DA]',
      iconTextAlt: '#2E3944',
      divider: 'border-[#B3C8CF]/20'
    },
    dark: {
      primary: '#124E66',
      secondary: '#748D92',
      accent: '#D3D9D4',
      success: '#748D92',
      error: '#FF6B6B',
      background: 'rgba(33, 42, 49, 0.3)',
      grid: 'rgba(116, 141, 146, 0.1)',
      textPrimary: '#D3D9D4',
      textSecondary: '#748D92',
      cardBg: 'from-[#2E3944]/90 to-[#212A31]/90',
      cardBgSecondary: 'from-[#212A31] to-[#2E3944]',
      cardBorder: 'border-[#748D92]/20',
      buttonActive: 'from-[#124E66] to-[#212A31]',
      buttonInactive: 'bg-[#212A31]',
      buttonTextActive: '#D3D9D4',
      buttonTextInactive: '#748D92',
      buttonBorder: 'border-[#2E3944]',
      iconBg: 'from-[#124E66] to-[#212A31]',
      iconText: '#D3D9D4',
      iconBgAlt: 'from-[#2E3944] to-[#124E66]',
      iconTextAlt: '#D3D9D4',
      divider: 'border-[#748D92]/20'
    }
  };

  const colors = themeColors[theme];
  const isLight = theme === 'light';

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
        <div className={`${isLight ? 'bg-[#F1F0E8]/90' : 'bg-[#2E3944]/90'} backdrop-blur-sm p-4 rounded-xl border ${colors.cardBorder} shadow-lg`}>
          <p className={`font-['Merriweather'] font-semibold ${colors.textPrimary} mb-2`}>{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`font-['Source_Sans_Pro'] ${colors.textSecondary}`}>Completion:</span>
              <span className={`font-['Montserrat'] font-bold ${colors.textPrimary}`}>{payload[0].value}%</span>
            </div>
            {payload[1] && (
              <div className="flex items-center justify-between">
                <span className={`font-['Source_Sans_Pro'] ${colors.textSecondary}`}>Growth:</span>
                <span className={`font-['Montserrat'] font-bold ${payload[1].value > 0 ? colors.secondary :
                  payload[1].value < 0 ? colors.error :
                    isLight ? 'text-[#89A8B2]/60' : 'text-[#748D92]/60'
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
        {/* Avg. Rate */}
        <div className={`bg-gradient-to-br ${colors.cardBg} rounded-xl p-4 border ${colors.cardBorder} backdrop-blur-sm`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${colors.iconBg} flex items-center justify-center`}>
              <span className={`text-sm ${colors.iconText}`}>✓</span>
            </div>
            <p className={`font-['Source_Sans_Pro'] ${colors.textSecondary} text-sm`}>Avg. Rate</p>
          </div>
          <p className={`font-['Montserrat'] font-bold ${colors.textPrimary} text-xl`}>{stats.avgCompletion}%</p>
        </div>

        {/* Best Period */}
        <div className={`bg-gradient-to-br ${colors.cardBg} rounded-xl p-4 border ${colors.cardBorder} backdrop-blur-sm`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-full ${isLight ? 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]' : 'bg-gradient-to-r from-[#D3D9D4] to-[#748D92]'} flex items-center justify-center`}>
              <span className={`text-sm ${isLight ? 'text-[#2E3944]' : 'text-[#212A31]'}`}>🏆</span>
            </div>
            <p className={`font-['Source_Sans_Pro'] ${colors.textSecondary} text-sm`}>Best Period</p>
          </div>
          <p className={`font-['Montserrat'] font-bold ${colors.textPrimary} text-xl truncate`}>{stats.bestPeriod}</p>
        </div>

        {/* Growth */}
        <div className={`bg-gradient-to-br ${colors.cardBg} rounded-xl p-4 border ${colors.cardBorder} backdrop-blur-sm`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-full ${isLight ? 'bg-gradient-to-r from-[#E5E1DA] to-[#89A8B2]' : 'bg-gradient-to-r from-[#2E3944] to-[#124E66]'} flex items-center justify-center`}>
              <span className={`text-sm ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'}`}>📈</span>
            </div>
            <p className={`font-['Source_Sans_Pro'] ${colors.textSecondary} text-sm`}>Growth</p>
          </div>
          <p className={`font-['Montserrat'] font-bold text-xl ${stats.growth > 0 ? colors.secondary :
            stats.growth < 0 ? colors.error :
              colors.textPrimary
            }`}>
            {stats.growth > 0 ? '+' : ''}{stats.growth}%
          </p>
        </div>

        {/* Total Streaks */}
        <div className={`bg-gradient-to-br ${colors.cardBg} rounded-xl p-4 border ${colors.cardBorder} backdrop-blur-sm`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-full ${isLight ? 'bg-gradient-to-r from-[#89A8B2] to-[#F1F0E8]' : 'bg-gradient-to-r from-[#124E66] to-[#212A31]'} flex items-center justify-center`}>
              <span className={`text-sm ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'}`}>🔥</span>
            </div>
            <p className={`font-['Source_Sans_Pro'] ${colors.textSecondary} text-sm`}>Total Streaks</p>
          </div>
          <p className={`font-['Montserrat'] font-bold ${colors.textPrimary} text-xl`}>{stats.streak}</p>
        </div>
      </div>

      {/* CHART CARD */}
      <div className={`bg-gradient-to-br ${colors.cardBg} backdrop-blur-sm rounded-2xl p-6 border ${colors.cardBorder} shadow-lg`}>
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${colors.iconBg} flex items-center justify-center`}>
                <span className={`text-lg ${colors.iconText}`}>📊</span>
              </div>
              <div>
                <h3 className={`font-['Merriweather'] font-bold ${colors.textPrimary} text-lg`}>
                  Growth Trend
                </h3>
                <p className={`font-['Source_Sans_Pro'] ${colors.textSecondary} text-sm`}>
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
                  ? `bg-gradient-to-r ${colors.buttonActive} ${colors.buttonTextActive} shadow-lg ${isLight ? 'shadow-[#89A8B2]/20' : 'shadow-[#124E66]/20'}`
                  : `${colors.buttonInactive} ${colors.buttonTextInactive} border ${colors.buttonBorder} ${isLight ? 'hover:border-[#89A8B2]' : 'hover:border-[#124E66]'}`
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
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={isLight ? 0.4 : 0.6} />
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={isLight ? 0.1 : 0.1} />
                  </linearGradient>

                  {/* Secondary gradient for growth */}
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.secondary} stopOpacity={isLight ? 0.3 : 0.4} />
                    <stop offset="95%" stopColor={colors.secondary} stopOpacity={isLight ? 0.05 : 0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={colors.grid}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: colors.textSecondary, fontSize: 12, fontFamily: "'Source Sans Pro', sans-serif" }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  tick={{ fill: colors.textSecondary, fontSize: 12, fontFamily: "'Source Sans Pro', sans-serif" }}
                  tickFormatter={value => `${value}%`}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: colors.primary,
                    strokeWidth: 1,
                    strokeDasharray: '5 5',
                    strokeOpacity: isLight ? 0.5 : 0.8
                  }}
                />

                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className={`font-['Source_Sans_Pro'] ${colors.textSecondary} text-sm`}>
                      {value === 'value' ? 'Completion' : 'Growth'}
                    </span>
                  )}
                  wrapperStyle={{
                    color: colors.textPrimary,
                    fontFamily: "'Source Sans Pro', sans-serif"
                  }}
                />

                {/* Completion Area */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={colors.primary}
                  strokeWidth={3}
                  fill="url(#colorCompletion)"
                  fillOpacity={1}
                  name="Completion"
                  dot={{
                    r: 5,
                    fill: colors.primary,
                    stroke: isLight ? '#E5E1DA' : '#2E3944',
                    strokeWidth: 2
                  }}
                  activeDot={{
                    r: 7,
                    fill: colors.primary,
                    stroke: colors.accent,
                    strokeWidth: 3
                  }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />

                {/* Growth Area */}
                <Area
                  type="monotone"
                  dataKey="growth"
                  stroke={colors.secondary}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="url(#colorGrowth)"
                  fillOpacity={0.3}
                  name="Growth"
                  dot={{
                    r: 4,
                    fill: colors.secondary,
                    stroke: isLight ? '#E5E1DA' : '#2E3944',
                    strokeWidth: 2
                  }}
                  activeDot={{
                    r: 6,
                    fill: colors.secondary,
                    stroke: colors.accent,
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
              <div className={`w-24 h-24 rounded-full ${isLight ? 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]' : 'bg-gradient-to-r from-[#212A31] to-[#2E3944]'} flex items-center justify-center mb-4`}>
                <span className={`text-4xl ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'}`}>📈</span>
              </div>
              <h4 className={`font-['Merriweather'] ${colors.textPrimary} text-lg mb-2`}>No data yet</h4>
              <p className={`font-['Source_Sans_Pro'] ${colors.textSecondary} text-center max-w-md`}>
                Start tracking your habits to see your growth trends here
              </p>
            </div>
          )}
        </div>

        {/* CHART FOOTER */}
        <div className={`mt-6 pt-6 border-t ${colors.divider}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isLight ? 'bg-gradient-to-r from-[#89A8B2] to-[#B3C8CF]' : 'bg-gradient-to-r from-[#124E66] to-[#748D92]'}`}></div>
                <span className={`font-['Source_Sans_Pro'] ${colors.textSecondary} text-sm`}>Completion Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isLight ? 'bg-gradient-to-r from-[#E5E1DA] to-[#89A8B2]' : 'bg-gradient-to-r from-[#2E3944] to-[#124E66]'}`}></div>
                <span className={`font-['Source_Sans_Pro'] ${colors.textSecondary} text-sm`}>Growth Trend</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-['Source_Sans_Pro'] ${colors.textSecondary} text-sm`}>Showing:</span>
              <span className={`font-['Source_Sans_Pro'] font-semibold ${colors.textPrimary} text-sm capitalize`}>
                {filter}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INSIGHTS */}
      {chartData.length > 0 && (
        <div className={`mt-6 bg-gradient-to-r ${colors.cardBgSecondary} rounded-2xl p-6 border ${colors.cardBorder}`}>
          <h4 className={`font-['Merriweather'] font-semibold ${colors.textPrimary} mb-4`}>
            Growth Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Positive Growth / Needs Attention */}
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${isLight ? 'from-[#B3C8CF] to-[#89A8B2]' : 'from-[#748D92] to-[#124E66]'} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-lg ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'}`}>📈</span>
              </div>
              <div>
                <p className={`font-['Source_Sans_Pro'] font-semibold ${colors.textPrimary}`}>
                  {stats.growth > 0 ? 'Positive Growth' : 'Needs Attention'}
                </p>
                <p className={`font-['Source_Sans_Pro'] ${colors.textSecondary} text-sm`}>
                  {stats.growth > 0
                    ? `Your completion rate increased by ${stats.growth}% this period`
                    : 'Try increasing consistency to see positive growth'}
                </p>
              </div>
            </div>

            {/* Best Performance */}
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full ${isLight ? 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]' : 'bg-gradient-to-r from-[#D3D9D4] to-[#748D92]'} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-lg ${isLight ? 'text-[#2E3944]' : 'text-[#212A31]'}`}>🏆</span>
              </div>
              <div>
                <p className={`font-['Source_Sans_Pro'] font-semibold ${colors.textPrimary}`}>
                  Best Performance
                </p>
                <p className={`font-['Source_Sans_Pro'] ${colors.textSecondary} text-sm`}>
                  {stats.bestPeriod} was your strongest period with {chartData.find(d => d.name === stats.bestPeriod)?.value || 0}% completion
                </p>
              </div>
            </div>

            {/* Next Goal */}
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full ${isLight ? 'bg-gradient-to-r from-[#E5E1DA] to-[#89A8B2]' : 'bg-gradient-to-r from-[#2E3944] to-[#124E66]'} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-lg ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'}`}>🎯</span>
              </div>
              <div>
                <p className={`font-['Source_Sans_Pro'] font-semibold ${colors.textPrimary}`}>
                  Next Goal
                </p>
                <p className={`font-['Source_Sans_Pro'] ${colors.textSecondary} text-sm`}>
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