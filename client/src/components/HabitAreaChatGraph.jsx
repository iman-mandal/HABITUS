import React, { useMemo, useState, useEffect } from 'react';
import '../global.css';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';

const HabitAreaChartGraph = ({ habits, timeRange = 'monthly', theme }) => {
  const [filter, setFilter] = useState(timeRange);
  const [graphType, setGraphType] = useState('area');
  const [timeData, setTimeData] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isLight, setIsLight] = useState(false);

  // Initialize theme
  useEffect(() => {
    const initializeTheme = () => {
      try {
        const savedTheme = localStorage.getItem('userTheme');
        const initialTheme = theme || savedTheme || 'dark';
        setCurrentTheme(initialTheme);
        setIsLight(initialTheme === 'light');
      } catch (error) {
        console.error('Error initializing theme:', error);
        setCurrentTheme('dark');
        setIsLight(false);
      }
    };

    initializeTheme();
  }, [theme]);

  // Listen for theme changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userTheme') {
        const newTheme = e.newValue || 'dark';
        setCurrentTheme(newTheme);
        setIsLight(newTheme === 'light');
      }
    };

    const handleThemeChange = (e) => {
      if (e.detail?.theme) {
        setCurrentTheme(e.detail.theme);
        setIsLight(e.detail.theme === 'light');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  // Sync filter with prop timeRange
  useEffect(() => {
    if (timeRange) {
      const convertedFilter =
        timeRange === 'week' ? 'weekly' :
          timeRange === 'month' ? 'monthly' :
            timeRange === 'quarter' ? 'quarterly' :
              timeRange === 'year' ? 'yearly' : timeRange;
      setFilter(convertedFilter);
    }
  }, [timeRange]);

  // Generate time-based data for the selected range
  useEffect(() => {
    if (!habits || habits.length === 0) return;

    const generateTimeData = () => {
      const now = new Date();
      let data = [];
      let labels = [];
      let startDate, endDate;

      // Calculate date range based on filter
      switch (filter) {
        case 'weekly': {
          const day = now.getDay();
          const diffToMonday = day === 0 ? -6 : 1 - day;
          startDate = new Date(now);
          startDate.setDate(now.getDate() + diffToMonday);
          startDate.setHours(0, 0, 0, 0);

          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);

          labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

          // Initialize data for each day
          data = labels.map((label, index) => {
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + index);
            return {
              name: label,
              date: dayDate,
              completed: 0,
              total: 0,
              missed: 0
            };
          });
          break;
        }

        case 'monthly': {
          const year = now.getFullYear();
          const month = now.getMonth();
          startDate = new Date(year, month, 1);
          startDate.setHours(0, 0, 0, 0);

          endDate = new Date(year, month + 1, 0);
          endDate.setHours(23, 59, 59, 999);

          // Get weeks in month
          const firstDay = startDate.getDay();
          const daysInMonth = endDate.getDate();
          const weeks = Math.ceil((daysInMonth + firstDay) / 7);

          labels = Array.from({ length: weeks }, (_, i) => `Week ${i + 1}`);

          data = labels.map((label, weekIndex) => {
            const weekStart = new Date(startDate);
            weekStart.setDate(startDate.getDate() + (weekIndex * 7));
            return {
              name: label,
              startDate: weekStart,
              completed: 0,
              total: 0,
              missed: 0
            };
          });
          break;
        }

        case 'quarterly': {
          const currentMonth = now.getMonth();
          const quarter = Math.floor(currentMonth / 3);
          const quarterStartMonth = quarter * 3;

          startDate = new Date(now.getFullYear(), quarterStartMonth, 1);
          startDate.setHours(0, 0, 0, 0);

          endDate = new Date(now.getFullYear(), quarterStartMonth + 3, 0);
          endDate.setHours(23, 59, 59, 999);

          labels = ['Month 1', 'Month 2', 'Month 3'];

          data = labels.map((label, monthIndex) => {
            const monthStart = new Date(now.getFullYear(), quarterStartMonth + monthIndex, 1);
            return {
              name: label,
              month: monthIndex + 1,
              startDate: monthStart,
              completed: 0,
              total: 0,
              missed: 0
            };
          });
          break;
        }

        case 'yearly': {
          const year = now.getFullYear();
          startDate = new Date(year, 0, 1);
          startDate.setHours(0, 0, 0, 0);

          endDate = new Date(year, 11, 31);
          endDate.setHours(23, 59, 59, 999);

          labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

          data = labels.map((label, monthIndex) => {
            const monthStart = new Date(year, monthIndex, 1);
            return {
              name: label,
              month: monthIndex + 1,
              startDate: monthStart,
              completed: 0,
              total: 0,
              missed: 0
            };
          });
          break;
        }
      }

      // Populate data with habits history
      habits.forEach(habit => {
        if (!habit.history) return;

        habit.history.forEach(h => {
          try {
            const historyDate = new Date(h.date);

            if (historyDate >= startDate && historyDate <= endDate) {
              let dataIndex = -1;

              switch (filter) {
                case 'weekly': {
                  const dayIndex = (historyDate.getDay() + 6) % 7;
                  if (dayIndex >= 0 && dayIndex < 7) dataIndex = dayIndex;
                  break;
                }
                case 'monthly': {
                  const weekOfMonth = Math.floor((historyDate.getDate() - 1) / 7);
                  if (weekOfMonth >= 0 && weekOfMonth < data.length) dataIndex = weekOfMonth;
                  break;
                }
                case 'quarterly': {
                  const month = historyDate.getMonth();
                  const quarterStartMonth = Math.floor(month / 3) * 3;
                  const monthInQuarter = month - quarterStartMonth;
                  if (monthInQuarter >= 0 && monthInQuarter < 3) dataIndex = monthInQuarter;
                  break;
                }
                case 'yearly': {
                  const month = historyDate.getMonth();
                  if (month >= 0 && month < 12) dataIndex = month;
                  break;
                }
              }

              if (dataIndex >= 0 && data[dataIndex]) {
                data[dataIndex].total += 1;
                if (h.completed) {
                  data[dataIndex].completed += 1;
                } else {
                  data[dataIndex].missed += 1;
                }
              }
            }
          } catch (error) {
            console.error('Error processing history date:', error);
          }
        });
      });

      // Calculate percentages and additional metrics
      const processedData = data.map(item => {
        const completionRate = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
        const missRate = item.total > 0 ? Math.round((item.missed / item.total) * 100) : 0;
        const avgHabits = habits.length > 0 ? Math.round(item.total / habits.length) : 0;

        return {
          ...item,
          completionRate,
          missRate,
          avgHabits,
          efficiency: item.total > 0 ? Math.round((item.completed / (item.completed + item.missed)) * 100) : 0,
          value: completionRate
        };
      });

      // Calculate trends
      if (processedData.length > 1) {
        for (let i = 1; i < processedData.length; i++) {
          const prev = processedData[i - 1].completionRate;
          const curr = processedData[i].completionRate;
          processedData[i].trend = curr - prev;
        }
      }

      setTimeData(processedData);
    };

    generateTimeData();
  }, [habits, filter]);

  // Calculate statistics for the time range
  const timeRangeStats = useMemo(() => {
    if (timeData.length === 0) {
      return {
        totalCompleted: 0,
        totalMissed: 0,
        avgCompletion: 0,
        bestPeriod: '',
        worstPeriod: '',
        consistency: 0
      };
    }

    const totalCompleted = timeData.reduce((sum, item) => sum + item.completed, 0);
    const totalMissed = timeData.reduce((sum, item) => sum + item.missed, 0);
    const total = totalCompleted + totalMissed;
    const avgCompletion = total > 0 ? Math.round((totalCompleted / total) * 100) : 0;

    const bestPeriod = timeData.reduce((best, item) =>
      item.completionRate > best.completionRate ? item : best,
      { completionRate: 0, name: '' }
    );

    const worstPeriod = timeData.reduce((worst, item) =>
      item.completionRate < worst.completionRate ? item : worst,
      { completionRate: 100, name: '' }
    );

    // Calculate consistency
    const values = timeData.map(item => item.completionRate);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const consistency = Math.max(0, 100 - Math.sqrt(variance));

    return {
      totalCompleted,
      totalMissed,
      avgCompletion,
      bestPeriod: bestPeriod.name,
      worstPeriod: worstPeriod.name,
      bestRate: bestPeriod.completionRate,
      worstRate: worstPeriod.completionRate,
      consistency: Math.round(consistency)
    };
  }, [timeData]);

  // Graph type options
  const graphTypeOptions = [
    { value: 'area', label: 'Area Chart', icon: '📈' },
    { value: 'bar', label: 'Bar Chart', icon: '📊' },
    { value: 'line', label: 'Line Chart', icon: '📉' },
    { value: 'composed', label: 'Detailed', icon: '🔍' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      if (!data) return null;

      return (
        <div className={`chart-tooltip ${isLight ? 'chart-tooltip-light' : 'chart-tooltip-dark'}`}>
          <p className={`tooltip-title ${isLight ? 'tooltip-title-light' : 'tooltip-title-dark'}`}>
            {label}
          </p>
          <div className="tooltip-content">
            <div className="tooltip-row">
              <span className={`tooltip-label ${isLight ? 'tooltip-label-light' : 'tooltip-label-dark'}`}>
                Completion:
              </span>
              <span className={`tooltip-value ${isLight ? 'tooltip-value-light' : 'tooltip-value-dark'}`}>
                {data.completionRate}%
              </span>
            </div>
            <div className="tooltip-row">
              <span className={`tooltip-label ${isLight ? 'tooltip-label-light' : 'tooltip-label-dark'}`}>
                Completed:
              </span>
              <span className="tooltip-value tooltip-value-success">
                {data.completed}
              </span>
            </div>
            <div className="tooltip-row">
              <span className={`tooltip-label ${isLight ? 'tooltip-label-light' : 'tooltip-label-dark'}`}>
                Missed:
              </span>
              <span className="tooltip-value tooltip-value-error">
                {data.missed}
              </span>
            </div>
            {data.trend !== undefined && (
              <div className="tooltip-row">
                <span className={`tooltip-label ${isLight ? 'tooltip-label-light' : 'tooltip-label-dark'}`}>
                  Trend:
                </span>
                <span 
                  className="tooltip-value"
                  style={{
                    color: data.trend > 0 ? (isLight ? '#89A8B2' : '#748D92') : 
                           data.trend < 0 ? '#FF6B6B' : 
                           (isLight ? '#89A8B2' : '#748D92')
                  }}
                >
                  {data.trend > 0 ? '↗' : data.trend < 0 ? '↘' : '→'} {data.trend > 0 ? '+' : ''}{data.trend || 0}%
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Render the appropriate chart based on graphType
  const renderChart = () => {
    if (timeData.length === 0) {
      return (
        <div className="no-data-container">
          <div className={`no-data-icon ${isLight ? 'no-data-icon-light' : 'no-data-icon-dark'}`}>
            <span className={`no-data-icon-text ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'}`}>📈</span>
          </div>
          <h4 className={`no-data-title ${isLight ? 'no-data-text-light' : 'no-data-text-dark'}`}>
            No data yet
          </h4>
          <p className={`no-data-subtitle ${isLight ? 'no-data-subtitle-light' : 'no-data-subtitle-dark'}`}>
            Start tracking your habits to see your {filter} trends here
          </p>
        </div>
      );
    }

    switch (graphType) {
      case 'area':
        return renderAreaChart();
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'composed':
        return renderComposedChart();
      default:
        return renderAreaChart();
    }
  };

  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={timeData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={isLight ? '#89A8B2' : '#124E66'} stopOpacity={isLight ? 0.4 : 0.6} />
            <stop offset="95%" stopColor={isLight ? '#89A8B2' : '#124E66'} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke={isLight ? 'rgba(137, 168, 178, 0.1)' : 'rgba(116, 141, 146, 0.1)'} 
        />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: isLight ? '#89A8B2' : '#748D92', fontSize: 12 }} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: isLight ? '#89A8B2' : '#748D92', fontSize: 12 }} 
          tickFormatter={value => `${value}%`} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="completionRate" 
          stroke={isLight ? '#89A8B2' : '#124E66'} 
          fill="url(#colorCompletion)" 
          name="Completion Rate" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={timeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke={isLight ? 'rgba(137, 168, 178, 0.1)' : 'rgba(116, 141, 146, 0.1)'} 
        />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: isLight ? '#89A8B2' : '#748D92', fontSize: 12 }} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: isLight ? '#89A8B2' : '#748D92', fontSize: 12 }} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          dataKey="completed" 
          fill={isLight ? '#89A8B2' : '#124E66'} 
          name="Completed" 
          radius={[4, 4, 0, 0]} 
        />
        <Bar 
          dataKey="missed" 
          fill="#FF6B6B" 
          name="Missed" 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={timeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke={isLight ? 'rgba(137, 168, 178, 0.1)' : 'rgba(116, 141, 146, 0.1)'} 
        />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: isLight ? '#89A8B2' : '#748D92', fontSize: 12 }} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: isLight ? '#89A8B2' : '#748D92', fontSize: 12 }} 
          tickFormatter={value => `${value}%`} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="completionRate" 
          stroke={isLight ? '#89A8B2' : '#124E66'} 
          strokeWidth={2} 
          dot={{ r: 4 }} 
          activeDot={{ r: 6 }} 
          name="Completion Rate" 
        />
        <Line 
          type="monotone" 
          dataKey="efficiency" 
          stroke={isLight ? '#B3C8CF' : '#748D92'} 
          strokeWidth={2} 
          strokeDasharray="5 5" 
          dot={{ r: 4 }} 
          name="Efficiency" 
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderComposedChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={timeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke={isLight ? 'rgba(137, 168, 178, 0.1)' : 'rgba(116, 141, 146, 0.1)'} 
        />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: isLight ? '#89A8B2' : '#748D92', fontSize: 12 }} 
        />
        <YAxis 
          yAxisId="left" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: isLight ? '#89A8B2' : '#748D92', fontSize: 12 }} 
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: isLight ? '#89A8B2' : '#748D92', fontSize: 12 }} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          yAxisId="left" 
          dataKey="completed" 
          fill={isLight ? '#89A8B2' : '#124E66'} 
          name="Completed" 
          radius={[4, 4, 0, 0]} 
        />
        <Bar 
          yAxisId="left" 
          dataKey="missed" 
          fill="#FF6B6B" 
          name="Missed" 
          radius={[4, 4, 0, 0]} 
        />
        <Line 
          yAxisId="right" 
          type="monotone" 
          dataKey="completionRate" 
          stroke={isLight ? '#2E3944' : '#D3D9D4'} 
          strokeWidth={2} 
          dot={{ r: 4 }} 
          name="Completion Rate" 
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  return (
    <div className="habit-chart-container">
      {/* TIME RANGE STATS OVERVIEW */}
      <div className="stats-grid">
        {/* Completion Rate */}
        <div className={`stat-card ${isLight ? 'stat-card-light' : 'stat-card-dark'}`}>
          <div className="stat-header">
            <div className={`stat-icon ${isLight ? 'stat-icon-light' : 'stat-icon-dark'}`}>
              <span className={`stat-icon-text ${isLight ? 'icon-text-light' : 'icon-text-dark'}`}>✓</span>
            </div>
            <p className={`stat-label ${isLight ? 'stat-label-light' : 'stat-label-dark'}`}>
              Completion
            </p>
          </div>
          <p className={`stat-value ${isLight ? 'stat-value-light' : 'stat-value-dark'}`}>
            {timeRangeStats.avgCompletion}%
          </p>
          <p className={`stat-subtext ${isLight ? 'stat-subtext-light' : 'stat-subtext-dark'}`}>
            {timeRangeStats.totalCompleted}/{timeRangeStats.totalCompleted + timeRangeStats.totalMissed} habits
          </p>
        </div>

        {/* Best Period */}
        <div className={`stat-card ${isLight ? 'stat-card-light' : 'stat-card-dark'}`}>
          <div className="stat-header">
            <div className={`stat-icon ${isLight ? 'stat-icon-alt-light' : 'stat-icon-alt-dark'}`}>
              <span className={`stat-icon-text ${isLight ? 'icon-text-alt-light' : 'icon-text-alt-dark'}`}>🏆</span>
            </div>
            <p className={`stat-label ${isLight ? 'stat-label-light' : 'stat-label-dark'}`}>
              Best Period
            </p>
          </div>
          <p className={`stat-value ${isLight ? 'stat-value-light' : 'stat-value-dark'}`}>
            {timeRangeStats.bestPeriod}
          </p>
          <p className={`stat-subtext ${isLight ? 'stat-subtext-light' : 'stat-subtext-dark'}`}>
            {timeRangeStats.bestRate}% completion
          </p>
        </div>

        {/* Consistency */}
        <div className={`stat-card ${isLight ? 'stat-card-light' : 'stat-card-dark'}`}>
          <div className="stat-header">
            <div className={`stat-icon ${isLight ? 'stat-icon-mix-light' : 'stat-icon-mix-dark'}`}>
              <span className={`stat-icon-text ${isLight ? 'icon-text-alt-light' : 'icon-text-dark'}`}>📊</span>
            </div>
            <p className={`stat-label ${isLight ? 'stat-label-light' : 'stat-label-dark'}`}>
              Consistency
            </p>
          </div>
          <p className={`stat-value ${
            timeRangeStats.consistency > 80 ? (isLight ? 'consistency-excellent-light' : 'consistency-excellent-dark') : 
            timeRangeStats.consistency > 60 ? 'consistency-good' : 
            'consistency-needs-improvement'
          }`}>
            {timeRangeStats.consistency}%
          </p>
          <p className={`stat-subtext ${isLight ? 'stat-subtext-light' : 'stat-subtext-dark'}`}>
            {timeRangeStats.consistency > 80 ? 'Excellent' :
              timeRangeStats.consistency > 60 ? 'Good' : 'Needs improvement'}
          </p>
        </div>

        {/* Period Overview */}
        <div className={`stat-card ${isLight ? 'stat-card-light' : 'stat-card-dark'}`}>
          <div className="stat-header">
            <div className={`stat-icon ${isLight ? 'stat-icon-alt2-light' : 'stat-icon-alt2-dark'}`}>
              <span className={`stat-icon-text ${isLight ? 'icon-text-alt-light' : 'icon-text-dark'}`}>
                {filter === 'weekly' ? '📅' : filter === 'monthly' ? '🗓️' : filter === 'quarterly' ? '📊' : '🌱'}
              </span>
            </div>
            <p className={`stat-label ${isLight ? 'stat-label-light' : 'stat-label-dark'}`}>
              Period
            </p>
          </div>
          <p className={`stat-value ${isLight ? 'stat-value-light' : 'stat-value-dark'}`}>
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </p>
          <p className={`stat-subtext ${isLight ? 'stat-subtext-light' : 'stat-subtext-dark'}`}>
            {timeData.length} {filter === 'weekly' ? 'days' :
              filter === 'monthly' ? 'weeks' :
                filter === 'quarterly' ? 'months' : 'months'}
          </p>
        </div>
      </div>

      {/* MAIN GRAPH CARD */}
      <div className={`main-graph-card ${isLight ? 'main-graph-card-light' : 'main-graph-card-dark'}`}>
        {/* HEADER WITH CONTROLS */}
        <div className="graph-header">
          <div>
            <div className="graph-title-container">
              <div className={`graph-title-icon ${isLight ? 'graph-title-icon-light' : 'graph-title-icon-dark'}`}>
                <span className={isLight ? 'icon-text-light' : 'icon-text-dark'}>📊</span>
              </div>
              <div>
                <h3 className={`graph-title-text ${isLight ? 'graph-title-text-light' : 'graph-title-text-dark'}`}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)} Performance
                </h3>
                <p className={`graph-subtitle ${isLight ? 'graph-subtitle-light' : 'graph-subtitle-dark'}`}>
                  Track your habit completion across the {filter} period
                </p>
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="controls-container">
            {/* Graph Type Selector */}
            <div className="graph-type-selector">
              {graphTypeOptions.map(g => (
                <button
                  key={g.value}
                  onClick={() => setGraphType(g.value)}
                  className={`graph-type-button ${
                    graphType === g.value
                      ? (isLight ? 'graph-type-button-active-light' : 'graph-type-button-active-dark')
                      : (isLight ? 'graph-type-button-inactive-light' : 'graph-type-button-inactive-dark')
                  }`}
                >
                  <span className="text-sm">{g.icon}</span>
                  <span className="hidden sm:inline">{g.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className="chart-container">
          {renderChart()}
        </div>

        {/* CHART FOOTER */}
        <div className={`chart-footer ${isLight ? 'chart-footer-light' : 'chart-footer-dark'}`}>
          <div className="chart-legend">
            <div className="legend-item">
              <div className={`legend-dot ${isLight ? 'legend-dot-primary-light' : 'legend-dot-primary-dark'}`}></div>
              <span className={`legend-text ${isLight ? 'legend-text-light' : 'legend-text-dark'}`}>
                Completion Rate
              </span>
            </div>
            <div className="legend-item">
              <div className={`legend-dot ${isLight ? 'legend-dot-completed-light' : 'legend-dot-completed-dark'}`}></div>
              <span className={`legend-text ${isLight ? 'legend-text-light' : 'legend-text-dark'}`}>
                Completed Habits
              </span>
            </div>
            <div className="legend-item">
              <div className="legend-dot legend-dot-missed"></div>
              <span className={`legend-text ${isLight ? 'legend-text-light' : 'legend-text-dark'}`}>
                Missed Habits
              </span>
            </div>
          </div>
          <div className="view-info">
            <span className={`view-label ${isLight ? 'view-label-light' : 'view-label-dark'}`}>
              Viewing:
            </span>
            <span className={`view-value ${isLight ? 'view-value-light' : 'view-value-dark'}`}>
              {filter} • {graphTypeOptions.find(g => g.value === graphType)?.label || 'Area Chart'}
            </span>
          </div>
        </div>
      </div>

      {/* TIME RANGE INSIGHTS */}
      {timeData.length > 0 && (
        <div className={`insights-card ${isLight ? 'insights-card-light' : 'insights-card-dark'}`}>
          <h4 className={`insights-title ${isLight ? 'insights-title-light' : 'insights-title-dark'}`}>
            {filter.charAt(0).toUpperCase() + filter.slice(1)} Insights
          </h4>
          <div className="insights-grid">
            {/* Performance Summary */}
            <div className="insight-item">
              <div className={`insight-icon ${isLight ? 'insight-icon-perf-light' : 'insight-icon-perf-dark'}`}>
                <span className={`insight-icon-text ${isLight ? 'icon-text-alt-light' : 'icon-text-dark'}`}>📈</span>
              </div>
              <div className="insight-content">
                <p className={`insight-title ${isLight ? 'insight-title-light' : 'insight-title-dark'}`}>
                  Performance Summary
                </p>
                <p className={`insight-text ${isLight ? 'insight-text-light' : 'insight-text-dark'}`}>
                  Your average completion rate is {timeRangeStats.avgCompletion}% with {timeRangeStats.consistency}% consistency across {timeData.length} {filter === 'weekly' ? 'days' : filter === 'monthly' ? 'weeks' : 'months'}.
                </p>
              </div>
            </div>

            {/* Peak Performance */}
            <div className="insight-item">
              <div className={`insight-icon ${isLight ? 'insight-icon-peak-light' : 'insight-icon-peak-dark'}`}>
                <span className={`insight-icon-text ${isLight ? 'icon-text-alt-light' : 'icon-text-alt-dark'}`}>🏆</span>
              </div>
              <div className="insight-content">
                <p className={`insight-title ${isLight ? 'insight-title-light' : 'insight-title-dark'}`}>
                  Peak Performance
                </p>
                <p className={`insight-text ${isLight ? 'insight-text-light' : 'insight-text-dark'}`}>
                  {timeRangeStats.bestPeriod} was your strongest with {timeRangeStats.bestRate}% completion.
                  {timeRangeStats.worstPeriod && ` ${timeRangeStats.worstPeriod} needs attention with ${timeRangeStats.worstRate}%.`}
                </p>
              </div>
            </div>

            {/* Improvement Areas */}
            <div className="insight-item">
              <div className={`insight-icon ${isLight ? 'insight-icon-improve-light' : 'insight-icon-improve-dark'}`}>
                <span className={`insight-icon-text ${isLight ? 'icon-text-alt-light' : 'icon-text-dark'}`}>🎯</span>
              </div>
              <div className="insight-content">
                <p className={`insight-title ${isLight ? 'insight-title-light' : 'insight-title-dark'}`}>
                  Improvement Areas
                </p>
                <p className={`insight-text ${isLight ? 'insight-text-light' : 'insight-text-dark'}`}>
                  Aim for {Math.min(100, timeRangeStats.avgCompletion + 15)}% average next {filter}. Focus on consistency during weaker periods.
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