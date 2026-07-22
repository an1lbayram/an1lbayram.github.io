import { useState, useCallback } from 'react';

const useRateLimit = (limit = 3, timeWindowMinutes = 5) => {
  const [isLimited, setIsLimited] = useState(false);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const windowMs = timeWindowMinutes * 60 * 1000;
    
    // Get past submissions from localStorage
    const pastSubmissionsJson = localStorage.getItem('contact_submissions');
    let pastSubmissions = [];
    
    if (pastSubmissionsJson) {
      try {
        pastSubmissions = JSON.parse(pastSubmissionsJson);
      } catch (e) {
        pastSubmissions = [];
      }
    }

    // Filter out submissions older than the time window
    const recentSubmissions = pastSubmissions.filter(time => now - time < windowMs);

    if (recentSubmissions.length >= limit) {
      setIsLimited(true);
      return false; // Rate limit exceeded
    }

    // Add current submission
    recentSubmissions.push(now);
    localStorage.setItem('contact_submissions', JSON.stringify(recentSubmissions));
    setIsLimited(false);
    return true; // OK to proceed
  }, [limit, timeWindowMinutes]);

  return { checkRateLimit, isLimited };
};

export default useRateLimit;
