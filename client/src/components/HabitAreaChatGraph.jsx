import React, { useMemo, useState, useEffect, useCallback } from 'react';
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
  const [colors, setColors] = useState({});
  const [isLight, setIsLight] = useState(false);

  // Theme colors definition
  const themeColors = {
    light: {
      primary: '#89A8B2',
      secondary: '#B3C8CF',
      accent: '#2E3944',
      success: '#89A8B2',
      error: '#FF6B6B',
      warning: '#FFA726',
      background: 'rgba(241, 240, 232, 0.9)',
      grid: 'rgba(137, 168, 178, 0.1)',
      textPrimary: '#2E3944',
      textSecondary: '#89A8B2',
      cardBg: 'from-[#F1F0E8] to-[#E5E1DA]',
      cardBgSecondary: 'from-[#E5E1DA] to-[#F1F0E8]',
      cardBorder: 'border-[#B3C8CF]/30',
      buttonActive: 'from-[#89A8B2] to-[#B3C8CF]',
      buttonInactive: 'bg-[#F1F0E8]',
      buttonTextActive: '#F1F0E8',
      buttonTextInactive: '#89A8B2',
      buttonBorder: 'border-[#B3C8CF]/50',
      iconBg: 'from-[#89A8B2] to-[#B3C8CF]',
      iconText: '#F1F0E8',
      iconBgAlt: 'from-[#F1F0E8] to-[#E5E1DA]',
      iconTextAlt: '#2E3944',
      divider: 'border-[#B3C8CF]/30',
      barFill: '#89A8B2',
      lineStroke: '#B3C8CF',
      areaFill: 'rgba(137, 168, 178, 0.2)',
      tooltipBg: '#F1F0E8'
    },
    dark: {
      primary: '#124E66',
      secondary: '#748D92',
      accent: '#D3D9D4',
      success: '#748D92',
      error: '#FF6B6B',
      warning: '#FFA726',
      background: 'rgba(33, 42, 49, 0.9)',
      grid: 'rgba(116, 141, 146, 0.1)',
      textPrimary: '#D3D9D4',
      textSecondary: '#748D92',
      cardBg: 'from-[#2E3944] to-[#212A31]',
      cardBgSecondary: 'from-[#212A31] to-[#2E3944]',
      cardBorder: 'border-[#748D92]/30',
      buttonActive: 'from-[#124E66] to-[#212A31]',
      buttonInactive: 'bg-[#212A31]',
      buttonTextActive: '#D3D9D4',
      buttonTextInactive: '#748D92',
      buttonBorder: 'border-[#2E3944]',
      iconBg: 'from-[#124E66] to-[#212A31]',
      iconText: '#D3D9D4',
      iconBgAlt: 'from-[#2E3944] to-[#124E66]',
      iconTextAlt: '#D3D9D4',
      divider: 'border-[#748D92]/30',
      barFill: '#124E66',
      lineStroke: '#748D92',
      areaFill: 'rgba(18, 78, 102, 0.2)',
      tooltipBg: '#2E3944'
    }
  };

  // Initialize theme
  useEffect(() => {
    const initializeTheme = () => {
      try {
        const savedTheme = localStorage.getItem('userTheme');
        const initialTheme = theme || savedTheme || 'dark';
        setCurrentTheme(initialTheme);
        setIsLight(initialTheme === 'light');
        setColors(themeColors[initialTheme] || themeColors.dark);
      } catch (error) {
        console.error('Error initializing theme:', error);
        setCurrentTheme('dark');
        setIsLight(false);
        setColors(themeColors.dark);
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
        setColors(themeColors[newTheme] || themeColors.dark);
      }
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom theme change events
    const handleThemeChange = (e) => {
      if (e.detail?.theme) {
        setCurrentTheme(e.detail.theme);
        setIsLight(e.detail.theme === 'light');
        setColors(themeColors[e.detail.theme] || themeColors.dark);
      }
    };

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
        <div 
          className="backdrop-blur-sm p-4 rounded-xl border shadow-lg min-w-[200px]"
          style={{
            backgroundColor: isLight ? '#F1F0E8' : '#2E3944',
            borderColor: isLight ? 'rgba(179, 200, 207, 0.3)' : 'rgba(116, 141, 146, 0.3)'
          }}
        >
          <p className={`font-['Merriweather'] font-semibold ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'} mb-2`}>
            {label}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
                Completion:
              </span>
              <span className={`font-['Montserrat'] font-bold ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'}`}>
                {data.completionRate}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
                Completed:
              </span>
              <span className={`font-['Montserrat'] font-bold ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'}`}>
                {data.completed}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
                Missed:
              </span>
              <span className={`font-['Montserrat'] font-bold text-[#FF6B6B]`}>
                {data.missed}
              </span>
            </div>
            {data.trend !== undefined && (
              <div className="flex items-center justify-between">
                <span className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
                  Trend:
                </span>
                <span 
                  className={`font-['Montserrat'] font-bold`}
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

  // Helper function to get gradient classes
  const getGradientClass = (type) => {
    switch (type) {
      case 'cardBg':
        return isLight ? 'from-[#F1F0E8] to-[#E5E1DA]' : 'from-[#2E3944] to-[#212A31]';
      case 'cardBgSecondary':
        return isLight ? 'from-[#E5E1DA] to-[#F1F0E8]' : 'from-[#212A31] to-[#2E3944]';
      case 'iconBg':
        return isLight ? 'from-[#89A8B2] to-[#B3C8CF]' : 'from-[#124E66] to-[#212A31]';
      case 'buttonActive':
        return isLight ? 'from-[#89A8B2] to-[#B3C8CF]' : 'from-[#124E66] to-[#212A31]';
      case 'iconBgAlt':
        return isLight ? 'from-[#F1F0E8] to-[#E5E1DA]' : 'from-[#2E3944] to-[#124E66]';
      case 'iconBgLight':
        return isLight ? 'from-[#F1F0E8] to-[#E5E1DA]' : 'from-[#D3D9D4] to-[#748D92]';
      case 'iconBgMix':
        return isLight ? 'from-[#E5E1DA] to-[#89A8B2]' : 'from-[#2E3944] to-[#124E66]';
      case 'iconBgAlt2':
        return isLight ? 'from-[#89A8B2] to-[#F1F0E8]' : 'from-[#124E66] to-[#212A31]';
      default:
        return '';
    }
  };

  // Render the appropriate chart based on graphType
  const renderChart = () => {
    if (timeData.length === 0) {
      return (
        <div className="h-[300px] flex flex-col items-center justify-center">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${getGradientClass('iconBgAlt')} flex items-center justify-center mb-4`}>
            <span className={`text-4xl ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'}`}>📈</span>
          </div>
          <h4 className={`font-['Merriweather'] ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'} text-lg mb-2`}>
            No data yet
          </h4>
          <p className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-center max-w-md`}>
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
    <div className="w-full">
      {/* TIME RANGE STATS OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {/* Completion Rate */}
        <div className={`bg-gradient-to-br ${getGradientClass('cardBg')} rounded-xl p-4 border backdrop-blur-sm`}
             style={{ borderColor: isLight ? 'rgba(179, 200, 207, 0.3)' : 'rgba(116, 141, 146, 0.3)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getGradientClass('iconBg')} flex items-center justify-center`}>
              <span className={`text-sm ${isLight ? 'text-[#F1F0E8]' : 'text-[#D3D9D4]'}`}>✓</span>
            </div>
            <p className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
              Completion
            </p>
          </div>
          <p className={`font-['Montserrat'] font-bold ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'} text-xl`}>
            {timeRangeStats.avgCompletion}%
          </p>
          <p className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-xs mt-1`}>
            {timeRangeStats.totalCompleted}/{timeRangeStats.totalCompleted + timeRangeStats.totalMissed} habits
          </p>
        </div>

        {/* Best Period */}
        <div className={`bg-gradient-to-br ${getGradientClass('cardBg')} rounded-xl p-4 border backdrop-blur-sm`}
             style={{ borderColor: isLight ? 'rgba(179, 200, 207, 0.3)' : 'rgba(116, 141, 146, 0.3)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getGradientClass('iconBgLight')} flex items-center justify-center`}>
              <span className={`text-sm ${isLight ? 'text-[#2E3944]' : 'text-[#212A31]'}`}>🏆</span>
            </div>
            <p className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
              Best Period
            </p>
          </div>
          <p className={`font-['Montserrat'] font-bold ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'} text-xl truncate`}>
            {timeRangeStats.bestPeriod}
          </p>
          <p className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-xs mt-1`}>
            {timeRangeStats.bestRate}% completion
          </p>
        </div>

        {/* Consistency */}
        <div className={`bg-gradient-to-br ${getGradientClass('cardBg')} rounded-xl p-4 border backdrop-blur-sm`}
             style={{ borderColor: isLight ? 'rgba(179, 200, 207, 0.3)' : 'rgba(116, 141, 146, 0.3)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getGradientClass('iconBgMix')} flex items-center justify-center`}>
              <span className={`text-sm ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'}`}>📊</span>
            </div>
            <p className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
              Consistency
            </p>
          </div>
          <p 
            className={`font-['Montserrat'] font-bold text-xl`}
            style={{
              color: timeRangeStats.consistency > 80 ? (isLight ? '#89A8B2' : '#748D92') : 
                     timeRangeStats.consistency > 60 ? '#FFA726' : 
                     '#FF6B6B'
            }}
          >
            {timeRangeStats.consistency}%
          </p>
          <p className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-xs mt-1`}>
            {timeRangeStats.consistency > 80 ? 'Excellent' :
              timeRangeStats.consistency > 60 ? 'Good' : 'Needs improvement'}
          </p>
        </div>

        {/* Period Overview */}
        <div className={`bg-gradient-to-br ${getGradientClass('cardBg')} rounded-xl p-4 border backdrop-blur-sm`}
             style={{ borderColor: isLight ? 'rgba(179, 200, 207, 0.3)' : 'rgba(116, 141, 146, 0.3)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getGradientClass('iconBgAlt2')} flex items-center justify-center`}>
              <span className={`text-sm ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'}`}>
                {filter === 'weekly' ? '📅' : filter === 'monthly' ? '🗓️' : filter === 'quarterly' ? '📊' : '🌱'}
              </span>
            </div>
            <p className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
              Period
            </p>
          </div>
          <p className={`font-['Montserrat'] font-bold ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'} text-xl capitalize`}>
            {filter}
          </p>
          <p className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-xs mt-1`}>
            {timeData.length} {filter === 'weekly' ? 'days' :
              filter === 'monthly' ? 'weeks' :
                filter === 'quarterly' ? 'months' : 'months'}
          </p>
        </div>
      </div>

      {/* MAIN GRAPH CARD */}
      <div className={`bg-gradient-to-br ${getGradientClass('cardBg')} backdrop-blur-sm rounded-2xl p-6 border shadow-lg`}
           style={{ borderColor: isLight ? 'rgba(179, 200, 207, 0.3)' : 'rgba(116, 141, 146, 0.3)' }}>
        {/* HEADER WITH CONTROLS */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getGradientClass('iconBg')} flex items-center justify-center`}>
                <span className={`text-lg ${isLight ? 'text-[#F1F0E8]' : 'text-[#D3D9D4]'}`}>📊</span>
              </div>
              <div>
                <h3 className={`font-['Merriweather'] font-bold ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'} text-lg`}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)} Performance
                </h3>
                <p className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
                  Track your habit completion across the {filter} period
                </p>
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Graph Type Selector */}
            <div className="flex flex-wrap gap-2">
              {graphTypeOptions.map(g => (
                <button
                  key={g.value}
                  onClick={() => setGraphType(g.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-['Source_Sans_Pro'] font-semibold transition-all ${graphType === g.value
                    ? `bg-gradient-to-r ${getGradientClass('buttonActive')} ${isLight ? 'text-[#F1F0E8]' : 'text-[#D3D9D4]'} shadow-lg ${isLight ? 'shadow-[#89A8B2]/20' : 'shadow-[#124E66]/20'}`
                    : `${isLight ? 'bg-[#F1F0E8]' : 'bg-[#212A31]'} ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} border ${isLight ? 'border-[#B3C8CF]/50 hover:border-[#89A8B2]' : 'border-[#2E3944] hover:border-[#124E66]'}`
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
        <div className="h-[300px] w-full">
          {renderChart()}
        </div>

        {/* CHART FOOTER */}
        <div className={`mt-6 pt-6 border-t`}
             style={{ borderColor: isLight ? 'rgba(179, 200, 207, 0.3)' : 'rgba(116, 141, 146, 0.3)' }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ background: isLight ? 'linear-gradient(to right, #89A8B2, #B3C8CF)' : 'linear-gradient(to right, #124E66, #748D92)' }}
                ></div>
                <span className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
                  Completion Rate
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: isLight ? '#89A8B2' : '#124E66' }}
                ></div>
                <span className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
                  Completed Habits
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF6B6B]"></div>
                <span className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
                  Missed Habits
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
                Viewing:
              </span>
              <span className={`font-['Source_Sans_Pro'] font-semibold ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'} text-sm capitalize`}>
                {filter} • {graphTypeOptions.find(g => g.value === graphType)?.label || 'Area Chart'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TIME RANGE INSIGHTS */}
      {timeData.length > 0 && (
        <div className={`mt-6 bg-gradient-to-r ${getGradientClass('cardBgSecondary')} rounded-2xl p-6 border`}
             style={{ borderColor: isLight ? 'rgba(179, 200, 207, 0.3)' : 'rgba(116, 141, 146, 0.3)' }}>
          <h4 className={`font-['Merriweather'] font-semibold ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'} mb-4`}>
            {filter.charAt(0).toUpperCase() + filter.slice(1)} Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Performance Summary */}
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${isLight ? 'from-[#B3C8CF] to-[#89A8B2]' : 'from-[#748D92] to-[#124E66]'} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-lg ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'}`}>📈</span>
              </div>
              <div>
                <p className={`font-['Source_Sans_Pro'] font-semibold ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'}`}>
                  Performance Summary
                </p>
                <p className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
                  Your average completion rate is {timeRangeStats.avgCompletion}% with {timeRangeStats.consistency}% consistency across {timeData.length} {filter === 'weekly' ? 'days' : filter === 'monthly' ? 'weeks' : 'months'}.
                </p>
              </div>
            </div>

            {/* Peak Performance */}
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full ${isLight ? 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]' : 'bg-gradient-to-r from-[#D3D9D4] to-[#748D92]'} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-lg ${isLight ? 'text-[#2E3944]' : 'text-[#212A31]'}`}>🏆</span>
              </div>
              <div>
                <p className={`font-['Source_Sans_Pro'] font-semibold ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'}`}>
                  Peak Performance
                </p>
                <p className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
                  {timeRangeStats.bestPeriod} was your strongest with {timeRangeStats.bestRate}% completion.
                  {timeRangeStats.worstPeriod && ` ${timeRangeStats.worstPeriod} needs attention with ${timeRangeStats.worstRate}%.`}
                </p>
              </div>
            </div>

            {/* Improvement Areas */}
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full ${isLight ? 'bg-gradient-to-r from-[#E5E1DA] to-[#89A8B2]' : 'bg-gradient-to-r from-[#2E3944] to-[#124E66]'} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-lg ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'}`}>🎯</span>
              </div>
              <div>
                <p className={`font-['Source_Sans_Pro'] font-semibold ${isLight ? 'text-[#2E3944]' : 'text-[#D3D9D4]'}`}>
                  Improvement Areas
                </p>
                <p className={`font-['Source_Sans_Pro'] ${isLight ? 'text-[#89A8B2]' : 'text-[#748D92]'} text-sm`}>
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