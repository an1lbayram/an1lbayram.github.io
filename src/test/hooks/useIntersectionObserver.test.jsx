import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

// The hook only calls observe()/unobserve() once its ref is actually attached
// to a DOM node, so a real (if trivial) consumer component is needed here —
// calling the hook in isolation via renderHook() leaves elementRef.current null.
const Probe = (props) => {
  const [ref, isIntersecting] = useIntersectionObserver(props.options);
  props.onRender?.(isIntersecting);
  return <div ref={ref} data-testid="probe" />;
};

describe('useIntersectionObserver', () => {
  let observeSpy;
  let unobserveSpy;
  let capturedCallback;
  let capturedOptions;

  beforeEach(() => {
    observeSpy = vi.fn();
    unobserveSpy = vi.fn();
    window.IntersectionObserver = vi.fn().mockImplementation(function (callback, options) {
      capturedCallback = callback;
      capturedOptions = options;
      return {
        observe: observeSpy,
        unobserve: unobserveSpy,
        disconnect: vi.fn(),
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts as not intersecting and observes the attached element', () => {
    let latest;
    render(<Probe onRender={(v) => (latest = v)} />);

    expect(latest).toBe(false);
    expect(observeSpy).toHaveBeenCalledOnce();
  });

  it('passes the given threshold/rootMargin through to the browser IntersectionObserver', () => {
    render(<Probe options={{ threshold: 0.5, rootMargin: '10px' }} />);
    expect(capturedOptions).toEqual({ threshold: 0.5, rootMargin: '10px' });
  });

  it('applies default threshold/rootMargin when no options are passed', () => {
    render(<Probe />);
    expect(capturedOptions).toEqual({ threshold: 0.1, rootMargin: '0px' });
  });

  it('flips isIntersecting to true once the element enters the viewport, then unobserves (fire once)', () => {
    let latest;
    render(<Probe onRender={(v) => (latest = v)} />);

    act(() => {
      capturedCallback([{ isIntersecting: true }]);
    });

    expect(latest).toBe(true);
    expect(unobserveSpy).toHaveBeenCalledOnce();
  });

  it('does not flip to true when the entry is not intersecting', () => {
    let latest;
    render(<Probe onRender={(v) => (latest = v)} />);

    act(() => {
      capturedCallback([{ isIntersecting: false }]);
    });

    expect(latest).toBe(false);
    expect(unobserveSpy).not.toHaveBeenCalled();
  });

  it('unobserves the element on unmount', () => {
    const { unmount } = render(<Probe />);
    unmount();
    expect(unobserveSpy).toHaveBeenCalledOnce();
  });
});
