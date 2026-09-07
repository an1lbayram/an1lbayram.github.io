import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useRateLimit from '../../hooks/useRateLimit';

describe('useRateLimit', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('allows submissions up to the limit', () => {
    const { result } = renderHook(() => useRateLimit(3, 5));

    act(() => {
      expect(result.current.checkRateLimit()).toBe(true);
      expect(result.current.checkRateLimit()).toBe(true);
      expect(result.current.checkRateLimit()).toBe(true);
    });
  });

  it('blocks the submission once the limit is exceeded', () => {
    const { result } = renderHook(() => useRateLimit(3, 5));

    act(() => {
      result.current.checkRateLimit();
      result.current.checkRateLimit();
      result.current.checkRateLimit();
    });

    act(() => {
      expect(result.current.checkRateLimit()).toBe(false);
    });
    expect(result.current.isLimited).toBe(true);
  });

  it('allows a new submission again once the time window has passed', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useRateLimit(1, 1)); // 1 request per 1 minute

    act(() => {
      expect(result.current.checkRateLimit()).toBe(true);
    });
    act(() => {
      expect(result.current.checkRateLimit()).toBe(false);
    });

    // fast-forward past the 1 minute window
    act(() => {
      vi.advanceTimersByTime(61 * 1000);
    });

    act(() => {
      expect(result.current.checkRateLimit()).toBe(true);
    });

    vi.useRealTimers();
  });

  it('does not throw / does not lock the user out when localStorage holds corrupted JSON', () => {
    localStorage.setItem('contact_submissions', '{not valid json');
    const { result } = renderHook(() => useRateLimit(3, 5));

    let outcome;
    act(() => {
      expect(() => {
        outcome = result.current.checkRateLimit();
      }).not.toThrow();
    });
    expect(outcome).toBe(true);
  });
});
