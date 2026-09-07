import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMediumFeed } from '../../hooks/useMediumFeed';

const sampleFeed = {
  status: 'ok',
  items: [
    {
      guid: 'abc-1',
      title: 'Test Article',
      description: '<p>Some <b>HTML</b> content that should become plain text</p>',
      link: 'https://medium.com/@anl1bayram/test-article',
      thumbnail: 'https://example.com/thumb.png',
      content: '<img src="https://example.com/fallback.png" />',
      pubDate: '2026-01-15T00:00:00.000Z',
      categories: ['react'],
    },
  ],
};

describe('useMediumFeed', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('fetches the RSS2JSON feed and strips HTML tags out of the description', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => sampleFeed });

    const { result } = renderHook(() => useMediumFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.rss2json.com/v1/api.json')
    );
    expect(result.current.articles).toHaveLength(1);
    expect(result.current.articles[0].description).not.toMatch(/<[^>]+>/);
    expect(result.current.articles[0].description).toContain('Some HTML content');
    expect(result.current.articles[0].url).toBe('https://medium.com/@anl1bayram/test-article');
  });

  it('does not execute a <script> payload injected into the RSS description (XSS via feed content)', async () => {
    const maliciousFeed = {
      status: 'ok',
      items: [
        {
          ...sampleFeed.items[0],
          description: '<img src=x onerror="window.__pwned__=true"><script>window.__pwned__=true;</script>Hello',
        },
      ],
    };
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => maliciousFeed });

    const { result } = renderHook(() => useMediumFeed());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(window.__pwned__).toBeUndefined();
    expect(result.current.articles[0].description).toContain('Hello');
    expect(result.current.articles[0].description).not.toMatch(/<script|onerror/i);
  });

  it('caches the formatted articles and avoids a second fetch within the TTL', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => sampleFeed });

    const { unmount } = renderHook(() => useMediumFeed());
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    unmount();

    const { result } = renderHook(() => useMediumFeed());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.current.articles).toHaveLength(1);
  });

  it('falls back to an empty article list with an error when the feed API is unreachable and no cache exists', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network down'));

    const { result } = renderHook(() => useMediumFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.articles).toEqual([]);
  });

  it('treats a non-"ok" status payload as a failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'error' }) });

    const { result } = renderHook(() => useMediumFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
