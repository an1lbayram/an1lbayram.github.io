import { useState, useEffect } from 'react';

const CACHE_KEY = 'github_stats_cache';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms

export const useGitHubStats = (username = 'an1lbayram') => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_TTL) {
            setStats(data);
            setLoading(false);
            return;
          }
        } catch (e) {
          // Ignore cache parse errors
        }
      }

      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (!response.ok) {
          throw new Error('GitHub API failed');
        }
        const repos = await response.json();
        
        // Convert array to map by repo name for easy lookup
        const reposMap = {};
        repos.forEach(repo => {
          reposMap[repo.name] = {
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            description: repo.description,
            topics: repo.topics
          };
        });

        // Save to cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: reposMap,
          timestamp: Date.now()
        }));

        setStats(reposMap);
        setLoading(false);
      } catch (err) {
        console.error("GitHub stats fetch error:", err);
        setError(err);
        setLoading(false);
        // Fallback to cache if available even if expired, when offline/error
        if (cachedData) {
           try {
              const { data } = JSON.parse(cachedData);
              setStats(data);
           } catch(e) {}
        }
      }
    };

    fetchStats();
  }, [username]);

  return { stats, loading, error };
};
