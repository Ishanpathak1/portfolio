import { useState, useEffect } from 'react';

export default function GitHubStats() {
  const [stats, setStats] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const username = 'Ishanpathak1';

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        setLoading(true);
        
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();
        
        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
        if (!reposResponse.ok) throw new Error('Failed to fetch repository data');
        const reposData = await reposResponse.json();
        
        // Extract relevant stats
        setStats({
          avatar: userData.avatar_url,
          name: userData.name || username,
          followers: userData.followers,
          following: userData.following,
          publicRepos: userData.public_repos,
          contributions: calculateContributions(reposData),
          url: userData.html_url
        });
        
        // Process repos to include language colors
        const processedRepos = reposData.map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          url: repo.html_url,
          homepage: repo.homepage,
          updated: new Date(repo.updated_at).toLocaleDateString(),
          color: getLanguageColor(repo.language)
        }));
        
        setRepos(processedRepos);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError('Failed to load GitHub data. GitHub may be rate limiting requests.');
        setLoading(false);
      }
    }
    
    fetchGitHubData();
  }, [username]);
  
  // Simple function to calculate estimated contributions based on repo activity
  function calculateContributions(repos) {
    return repos.reduce((total, repo) => {
      // Sum of stars, forks, and watchers as a rough approximation
      return total + repo.stargazers_count + repo.forks_count + (repo.watchers_count || 0);
    }, 0);
  }
  
  // Map of languages to colors
  function getLanguageColor(language) {
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
    
    return colors[language] || '#8b949e'; // Default color
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md animate-pulse">
        <div className="flex space-x-4 items-center mb-6">
          <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-16 w-16"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
          ))}
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="text-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
          <p>{error}</p>
          <p className="mt-4 text-sm">
            GitHub limits API requests to 60 per hour for unauthenticated requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      {stats && (
        <>
          {/* GitHub Profile Overview */}
          <div className="flex items-center mb-6">
            <a 
              href={stats.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block rounded-full overflow-hidden mr-4"
            >
              <img 
                src={stats.avatar} 
                alt={`${stats.name}'s GitHub avatar`} 
                className="h-16 w-16 object-cover"
              />
            </a>
            <div>
              <h3 className="text-lg font-bold">
                <a 
                  href={stats.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {stats.name}
                </a>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                GitHub Stats
              </p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold">{stats.publicRepos}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Repositories</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold">{stats.followers}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Followers</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold">{stats.following}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Following</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold">{stats.contributions}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Activity</p>
            </div>
          </div>
          
          {/* Recent Repositories */}
          <h4 className="font-semibold mb-4 text-lg">Recent Repositories</h4>
          
          <div className="space-y-4">
            {repos.slice(0, 5).map(repo => (
              <div key={repo.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <a 
                    href={repo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {repo.name}
                  </a>
                  <div className="flex space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      {repo.stars}
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      {repo.forks}
                    </span>
                  </div>
                </div>
                
                {repo.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {repo.description}
                  </p>
                )}
                
                <div className="flex justify-between items-center">
                  {repo.language ? (
                    <span className="flex items-center text-sm">
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-1" 
                        style={{ backgroundColor: repo.color }}
                      ></span>
                      {repo.language}
                    </span>
                  ) : (
                    <span></span>
                  )}
                  
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Updated {repo.updated}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <a 
              href={stats.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              View Full GitHub Profile →
            </a>
          </div>
        </>
      )}
    </div>
  );
} 