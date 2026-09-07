import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGitHubStats } from '../../hooks/useGitHubStats';

const sampleRepos = [
  { name: 'Altay', stargazers_count: 5, forks_count: 2, language: 'JavaScript', created_at: '2026-01-01', updated_at: '2026-02-01', description: 'x', topics: [] },
  { name: 'Zenith', stargazers_count: 1, forks_count: 0, language: 'TypeScript', created_at: '2026-01-01', updated_at: '2026-02-01', description: 'y', topics: [] },
];

describe('useGitHubStats', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('fetches repos from the GitHub API and maps them by repo name', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleRepos,
    });

    const { result } = renderHook(() => useGitHubStats('an1lbayram'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/users/an1lbayram/repos?per_page=100');
    expect(result.current.stats.Altay).toEqual(
      expect.objectContaining({ stars: 5, forks: 2, language: 'JavaScript' })
    );
    expect(result.current.error).toBeNull();
  });

  it('caches the response in localStorage and serves it without a second network call', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleRepos,
    });

    const { unmount } = renderHook(() => useGitHubStats('an1lbayram'));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    unmount();

    const { result } = renderHook(() => useGitHubStats('an1lbayram'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.current.stats.Altay.stars).toBe(5);
  });

  it('falls back to a stale cache when the network request fails', async () => {
    localStorage.setItem(
      'github_stats_cache',
      JSON.stringify({ data: { Altay: { stars: 99, forks: 1 } }, timestamp: Date.now() - 999999999 })
    );
    global.fetch = vi.fn().mockRejectedValue(new Error('network down'));

    const { result } = renderHook(() => useGitHubStats('an1lbayram'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.stats.Altay.stars).toBe(99);
  });

  it('surfaces an error and empty stats when the API fails with no cache available', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    const { result } = renderHook(() => useGitHubStats('an1lbayram'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.stats).toBeNull();
  });

  it('does not throw when the cached value is corrupted JSON', async () => {
    localStorage.setItem('github_stats_cache', '{not valid json');
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => sampleRepos });

    const { result } = renderHook(() => useGitHubStats('an1lbayram'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.Altay.stars).toBe(5);
  });
});
