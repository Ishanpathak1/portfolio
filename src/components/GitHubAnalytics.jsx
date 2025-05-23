import { useState, useEffect, useRef } from 'react';
import GitHubCharts from './GitHubCharts';

export default function GitHubAnalytics() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [repoData, setRepoData] = useState([]);
  const [languages, setLanguages] = useState({});
  const [commitData, setCommitData] = useState({});
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'charts', or 'jobs'
  
  const inputRef = useRef(null);
  
  // Handle URL parameters for direct navigation
  useEffect(() => {
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const usernameParam = urlParams.get('username');
    const tabParam = urlParams.get('tab');
    
    // Set username from URL if provided
    if (usernameParam) {
      setUsername(usernameParam);
      // Auto-submit if username was provided in URL
      handleSubmit(new Event('submit'), usernameParam);
    }
    
    // Set active tab from URL if provided
    if (tabParam && ['overview', 'charts'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);
  
  useEffect(() => {
    // Focus username input on component mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = async (e, usernameOverride = null) => {
    e.preventDefault();
    const submitUsername = usernameOverride || username;
    if (!submitUsername.trim()) return;
    
    setLoading(true);
    setError(null);
    setUserData(null);
    setRepoData([]);
    setLanguages({});
    setCommitData({});
    setActivityData([]);
    setAnalysisComplete(false);
    
    try {
      // Step 1: Fetch user profile data
      const userResponse = await fetch(`https://api.github.com/users/${submitUsername}`);
      if (!userResponse.ok) {
        throw new Error(`GitHub user not found or API rate limit exceeded`);
      }
      const userData = await userResponse.json();
      setUserData(userData);
      
      // Step 2: Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${submitUsername}/repos?per_page=100&sort=updated`);
      if (!reposResponse.ok) {
        throw new Error(`Failed to fetch repository data`);
      }
      const reposData = await reposResponse.json();
      setRepoData(reposData);
      
      // Step 3: Analyze languages across repositories
      const languageData = {};
      const languagePromises = reposData.slice(0, 20).map(repo => {
        if (repo.language) {
          // Count repositories by language
          languageData[repo.language] = (languageData[repo.language] || 0) + 1;
        }
        return repo;
      });
      
      await Promise.all(languagePromises);
      setLanguages(languageData);
      
      // Step 4: Analyze commit frequency for top repositories
      const commitAnalysis = {};
      let totalCommits = 0;
      
      // Only process top 5 repositories to avoid API rate limits
      const topRepos = reposData
        .filter(repo => !repo.fork) // Exclude forks
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);
      
      // Analyze commit patterns
      for (const repo of topRepos) {
        try {
          const commitsResponse = await fetch(`https://api.github.com/repos/${submitUsername}/${repo.name}/commits?per_page=100`);
          if (commitsResponse.ok) {
            const commits = await commitsResponse.json();
            commitAnalysis[repo.name] = commits.length;
            totalCommits += commits.length;
            
            // Analyze commit times
            const commitTimes = commits.map(commit => {
              const date = new Date(commit.commit.author.date);
              return {
                hour: date.getHours(),
                day: date.getDay(),
                month: date.getMonth(),
                timestamp: date.getTime()
              };
            });
            
            // Add to activity data
            setActivityData(prev => [...prev, ...commitTimes]);
          }
        } catch (error) {
          console.error(`Error fetching commits for ${repo.name}:`, error);
        }
      }
      
      setCommitData({
        repositories: commitAnalysis,
        totalCommits
      });
      
      setAnalysisComplete(true);
      setLoading(false);
    } catch (error) {
      console.error('Error analyzing GitHub profile:', error);
      setError(error.message || 'Failed to analyze GitHub profile');
      setLoading(false);
    }
  };
  
  // Calculate productivity metrics
  const getProductivityMetrics = () => {
    if (!activityData.length) return null;
    
    // Most productive time of day (hour)
    const hourCounts = {};
    activityData.forEach(data => {
      hourCounts[data.hour] = (hourCounts[data.hour] || 0) + 1;
    });
    
    const mostProductiveHour = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    // Most productive day of week
    const dayCounts = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    activityData.forEach(data => {
      dayCounts[data.day] = (dayCounts[data.day] || 0) + 1;
    });
    
    const mostProductiveDay = Object.entries(dayCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    // Longest streak calculation
    const dateSet = new Set();
    activityData.forEach(data => {
      const date = new Date(data.timestamp);
      dateSet.add(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
    });
    
    // Convert dates to array of timestamps and sort
    const dates = Array.from(dateSet).map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month, day).getTime();
    }).sort();
    
    // Calculate longest streak
    let currentStreak = 1;
    let longestStreak = 1;
    const DAY_IN_MS = 86400000;
    
    for (let i = 1; i < dates.length; i++) {
      if (dates[i] - dates[i-1] === DAY_IN_MS) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return {
      mostProductiveHour: parseInt(mostProductiveHour),
      mostProductiveDay: dayNames[parseInt(mostProductiveDay)],
      longestStreak
    };
  };
  
  // Calculate primary languages
  const getPrimaryLanguages = () => {
    if (!Object.keys(languages).length) return [];
    
    return Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([language, count]) => ({
        language,
        count,
        percentage: Math.round((count / Object.values(languages).reduce((a, b) => a + b, 0)) * 100)
      }));
  };
  
  // Calculate language color
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      Java: '#b07219',
      HTML: '#e34c26',
      CSS: '#563d7c',
      'C#': '#178600',
      PHP: '#4F5D95',
      Swift: '#ffac45',
      Go: '#00ADD8',
      Ruby: '#701516',
      Rust: '#dea584',
      Dart: '#00B4AB',
      Kotlin: '#A97BFF',
      'C++': '#f34b7d',
      C: '#555555',
      Shell: '#89e051',
    };
    
    return colors[language] || '#8b949e';
  };
  
  // Format time displays (convert 24h to 12h format)
  const formatHour = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">GitHub Analytics Explorer</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="GitHub username"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white font-medium rounded-lg px-6 py-2 transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze Profile'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Analyzing GitHub profile...
          </p>
        </div>
      )}
      
      {userData && analysisComplete && (
        <div className="space-y-8">
          {/* Profile Overview */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img 
              src={userData.avatar_url} 
              alt={`${userData.name || username}'s GitHub avatar`} 
              className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700"
            />
            <div>
              <h3 className="text-xl font-bold">{userData.name || username}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">@{userData.login}</p>
              
              {userData.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">{userData.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="font-medium">{userData.public_repos}</span> Repositories
                </div>
                <div>
                  <span className="font-medium">{userData.followers}</span> Followers
                </div>
                <div>
                  <span className="font-medium">{userData.following}</span> Following
                </div>
                <div>
                  <span className="font-medium">{commitData.totalCommits || 0}</span> Analyzed Commits
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'charts'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Advanced Charts
              </button>
            </nav>
          </div>
          
          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Productivity Analytics */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5">
                <h4 className="text-lg font-semibold mb-4">Productivity Insights</h4>
                
                {getProductivityMetrics() ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Most Productive Time</p>
                      <p className="text-xl font-medium">{formatHour(getProductivityMetrics().mostProductiveHour)}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Most Active Day</p>
                      <p className="text-xl font-medium">{getProductivityMetrics().mostProductiveDay}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Longest Contribution Streak</p>
                      <p className="text-xl font-medium">{getProductivityMetrics().longestStreak} days</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Insufficient data for analysis</p>
                )}
              </div>
              
              {/* Language Distribution */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5">
                <h4 className="text-lg font-semibold mb-4">Primary Languages</h4>
                
                {getPrimaryLanguages().length > 0 ? (
                  <div className="space-y-3">
                    {getPrimaryLanguages().map(({ language, percentage }) => (
                      <div key={language}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{language}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: getLanguageColor(language)
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No language data available</p>
                )}
              </div>
              
              {/* Top Repositories */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 md:col-span-2">
                <h4 className="text-lg font-semibold mb-4">Top Repositories (by stars)</h4>
                
                {repoData.length > 0 ? (
                  <div className="space-y-4">
                    {repoData
                      .filter(repo => !repo.fork)
                      .sort((a, b) => b.stargazers_count - a.stargazers_count)
                      .slice(0, 5)
                      .map(repo => (
                        <div key={repo.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <a 
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:text-primary"
                              >
                                {repo.name}
                              </a>
                              {repo.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {repo.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                {repo.stargazers_count}
                              </span>
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                {repo.forks_count}
                              </span>
                              {commitData.repositories && commitData.repositories[repo.name] && (
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  {commitData.repositories[repo.name]} commits
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No repositories found</p>
                )}
              </div>
            </div>
          )}
          
          {/* Charts Tab Content */}
          {activeTab === 'charts' && (
            <GitHubCharts 
              userData={userData}
              repoData={repoData}
              commitData={commitData}
              activityData={activityData}
              languages={languages}
            />
          )}
          
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
            <a 
              href={userData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              View Full GitHub Profile →
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 