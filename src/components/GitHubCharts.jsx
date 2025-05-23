import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend
);

export default function GitHubCharts({ 
  userData, 
  repoData, 
  commitData, 
  activityData,
  languages 
}) {
  const [activityByTime, setActivityByTime] = useState(null);
  const [activityByDay, setActivityByDay] = useState(null);
  const [languageDistribution, setLanguageDistribution] = useState(null);
  const [topRepos, setTopRepos] = useState(null);
  const [monthlyActivity, setMonthlyActivity] = useState(null);
  const [skillRadar, setSkillRadar] = useState(null);
  
  // Colors for charts
  const chartColors = [
    'rgba(75, 192, 192, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
    'rgba(255, 99, 132, 0.7)',
    'rgba(255, 205, 86, 0.7)',
    'rgba(201, 203, 207, 0.7)',
    'rgba(99, 255, 132, 0.7)',
  ];
  
  // Process activity by time of day
  useEffect(() => {
    if (!activityData?.length) return;
    
    // Count commits by hour
    const hourCounts = Array(24).fill(0);
    activityData.forEach(data => {
      hourCounts[data.hour]++;
    });
    
    setActivityByTime({
      labels: Array.from({ length: 24 }, (_, i) => formatHour(i)),
      datasets: [
        {
          label: 'Commits by Hour',
          data: hourCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
        },
      ],
    });
    
    // Count commits by day of week
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCounts = Array(7).fill(0);
    activityData.forEach(data => {
      dayCounts[data.day]++;
    });
    
    setActivityByDay({
      labels: dayNames,
      datasets: [
        {
          label: 'Commits by Day',
          data: dayCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
        },
      ],
    });
    
    // Monthly activity (last 12 months)
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const now = new Date();
    const monthlyData = Array(12).fill(0);
    
    activityData.forEach(data => {
      const date = new Date(data.timestamp);
      const monthsAgo = (now.getFullYear() - date.getFullYear()) * 12 + 
                         (now.getMonth() - date.getMonth());
      
      if (monthsAgo >= 0 && monthsAgo < 12) {
        monthlyData[11 - monthsAgo]++;
      }
    });
    
    // Generate labels for the last 12 months
    const monthLabels = [];
    for (let i = 11; i >= 0; i--) {
      const monthIndex = (now.getMonth() - i + 12) % 12;
      monthLabels.push(monthNames[monthIndex]);
    }
    
    setMonthlyActivity({
      labels: monthLabels,
      datasets: [
        {
          label: 'Monthly Activity',
          data: monthlyData,
          fill: true,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          tension: 0.4,
        },
      ],
    });
  }, [activityData]);
  
  // Process language distribution
  useEffect(() => {
    if (!Object.keys(languages).length) return;
    
    const languageEntries = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
      
    const languageLabels = languageEntries.map(([lang]) => lang);
    const languageCounts = languageEntries.map(([_, count]) => count);
    const backgroundColors = chartColors.slice(0, languageLabels.length);
    
    setLanguageDistribution({
      labels: languageLabels,
      datasets: [
        {
          label: 'Languages',
          data: languageCounts,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
          borderWidth: 1,
        },
      ],
    });
    
    // Generate skill radar data
    const maxSkillValue = Math.max(...languageCounts);
    
    // Create normalized values for radar chart (0-100 scale)
    const skillValues = languageCounts.map(count => 
      Math.round((count / maxSkillValue) * 100)
    );
    
    setSkillRadar({
      labels: languageLabels,
      datasets: [
        {
          label: 'Language Proficiency',
          data: skillValues,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)',
        },
      ],
    });
  }, [languages]);
  
  // Process repository data
  useEffect(() => {
    if (!repoData?.length) return;
    
    const topRepositories = repoData
      .filter(repo => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);
      
    const repoLabels = topRepositories.map(repo => repo.name);
    const starData = topRepositories.map(repo => repo.stargazers_count);
    const forkData = topRepositories.map(repo => repo.forks_count);
    
    setTopRepos({
      labels: repoLabels,
      datasets: [
        {
          label: 'Stars',
          data: starData,
          backgroundColor: 'rgba(255, 206, 86, 0.7)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
        {
          label: 'Forks',
          data: forkData,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    });
  }, [repoData]);
  
  // Format hour for display (24h to 12h)
  const formatHour = (hour) => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
  };
  
  return (
    <div className="space-y-10">
      <h3 className="text-xl font-bold mb-6">GitHub Analytics Visualizations</h3>
      
      {/* Activity & Productivity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Activity Pattern */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md">
          <h4 className="text-lg font-semibold mb-4">Commit Activity by Hour</h4>
          {activityByTime ? (
            <div className="h-64">
              <Bar 
                data={activityByTime} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        title: (context) => `Time: ${context[0].label}`,
                        label: (context) => `${context.formattedValue} commits`
                      }
                    },
                    legend: {
                      display: false,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Commit Count'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Hour of Day'
                      }
                    }
                  }
                }} 
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>Insufficient data</p>
            </div>
          )}
        </div>
        
        {/* Weekly Activity Pattern */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md">
          <h4 className="text-lg font-semibold mb-4">Commit Activity by Day</h4>
          {activityByDay ? (
            <div className="h-64">
              <Bar 
                data={activityByDay} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        title: (context) => `Day: ${context[0].label}`,
                        label: (context) => `${context.formattedValue} commits`
                      }
                    },
                    legend: {
                      display: false,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Commit Count'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Day of Week'
                      }
                    }
                  }
                }} 
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>Insufficient data</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Monthly Activity & Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Activity Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md">
          <h4 className="text-lg font-semibold mb-4">Activity Trend (Last 12 Months)</h4>
          {monthlyActivity ? (
            <div className="h-64">
              <Line 
                data={monthlyActivity} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        title: (context) => `Month: ${context[0].label}`,
                        label: (context) => `${context.formattedValue} commits`
                      }
                    },
                    legend: {
                      display: false,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Commit Count'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Month'
                      }
                    }
                  }
                }} 
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>Insufficient data</p>
            </div>
          )}
        </div>
        
        {/* Language Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md">
          <h4 className="text-lg font-semibold mb-4">Language Distribution</h4>
          {languageDistribution ? (
            <div className="h-64">
              <Pie 
                data={languageDistribution} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((context.raw / total) * 100);
                          return `${context.label}: ${context.formattedValue} (${percentage}%)`;
                        }
                      }
                    },
                    legend: {
                      position: 'right',
                    }
                  }
                }} 
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>Insufficient data</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Repository Stats & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Repositories */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md">
          <h4 className="text-lg font-semibold mb-4">Top Repositories</h4>
          {topRepos ? (
            <div className="h-80">
              <Bar 
                data={topRepos} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  plugins: {
                    tooltip: {
                      callbacks: {
                        title: (context) => `Repository: ${context[0].label}`,
                      }
                    },
                    legend: {
                      position: 'bottom',
                    }
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Count'
                      }
                    }
                  }
                }} 
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-400">
              <p>Insufficient data</p>
            </div>
          )}
        </div>
        
        {/* Skill Radar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md">
          <h4 className="text-lg font-semibold mb-4">Language Proficiency</h4>
          {skillRadar ? (
            <div className="h-80">
              <Radar 
                data={skillRadar} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      min: 0,
                      max: 100,
                      beginAtZero: true,
                      angleLines: {
                        display: true
                      },
                      ticks: {
                        stepSize: 20,
                        display: false
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.label}: ${context.formattedValue}%`
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-400">
              <p>Insufficient data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 