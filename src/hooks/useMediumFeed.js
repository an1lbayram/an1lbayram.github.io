import { useState, useEffect } from 'react';

const CACHE_KEY = 'medium_feed_cache';
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours in ms
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@anl1bayram';

/**
 * HTML string'den güvenli şekilde düz metin çıkarır.
 * innerHTML yerine DOMParser kullanarak XSS riskini azaltır.
 */
const extractTextFromHTML = (html) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const textContent = doc.body.textContent || '';
    return textContent.substring(0, 150) + '...';
  } catch {
    return '';
  }
};

export const useMediumFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_TTL) {
            setArticles(data);
            setLoading(false);
            return;
          }
        } catch (e) {
          // Ignore cache parse errors
        }
      }

      try {
        const response = await fetch(RSS2JSON_API);
        if (!response.ok) {
          throw new Error('RSS fetch failed');
        }
        
        const data = await response.json();
        
        if (data.status === 'ok') {
          // Format articles
          const formattedArticles = data.items.map(item => {
            const textContent = extractTextFromHTML(item.description);
            
            return {
              id: item.guid,
              title: item.title,
              description: textContent,
              url: item.link,
              thumbnail: item.thumbnail || (item.content.match(/<img[^>]+src="([^">]+)"/) || [])[1],
              pubDate: new Date(item.pubDate).toLocaleDateString(),
              categories: item.categories
            };
          });

          // Save to cache
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: formattedArticles,
            timestamp: Date.now()
          }));

          setArticles(formattedArticles);
        } else {
          throw new Error('Invalid feed data');
        }
        setLoading(false);
      } catch (err) {
        console.error("Medium feed fetch error:", err);
        setError(err);
        setLoading(false);
        // Fallback to cache if available
        if (cachedData) {
           try {
              const { data } = JSON.parse(cachedData);
              setArticles(data);
           } catch(e) {}
        }
      }
    };

    fetchFeed();
  }, []);

  return { articles, loading, error };
};
