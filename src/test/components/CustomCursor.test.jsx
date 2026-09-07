import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import CustomCursor from '../../components/CustomCursor';

// The component runs a requestAnimationFrame loop for smooth cursor lerp motion;
// stub it to a no-op so tests don't spin an unbounded animation loop.
beforeEach(() => {
  vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

const mockPointer = (coarse) => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query === '(pointer: coarse)' ? coarse : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  // jsdom's window always defines `ontouchstart` (as an inert GlobalEventHandlers
  // property) regardless of the simulated device, which would make the
  // component's `'ontouchstart' in window` touch-detection always true. Mouse-
  // device tests must remove it to actually exercise the non-touch code path.
  if (coarse) {
    if (!('ontouchstart' in window)) window.ontouchstart = null;
  } else {
    delete window.ontouchstart;
  }
};

describe('CustomCursor', () => {
  it('renders nothing on a touch/coarse-pointer device', () => {
    mockPointer(true);
    const { container } = render(<CustomCursor />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the cursor badge (hidden by default until the mouse moves) on a mouse-pointer device', () => {
    mockPointer(false);
    const { container } = render(<CustomCursor />);
    expect(container.querySelector('.code-cursor-wrapper')).toHaveClass('cursor-hidden');
  });

  it('reveals the cursor and shows the default </> symbol once the mouse moves', () => {
    mockPointer(false);
    const { container } = render(<CustomCursor />);

    fireEvent.mouseMove(window, { clientX: 10, clientY: 10 });

    expect(container.querySelector('.code-cursor-wrapper')).not.toHaveClass('cursor-hidden');
    expect(container.querySelector('.code-symbol')).toHaveTextContent('</>');
  });

  it('hides the cursor again on mouseleave', () => {
    mockPointer(false);
    const { container } = render(<CustomCursor />);

    fireEvent.mouseMove(window, { clientX: 10, clientY: 10 });
    expect(container.querySelector('.code-cursor-wrapper')).not.toHaveClass('cursor-hidden');

    fireEvent.mouseLeave(document);
    expect(container.querySelector('.code-cursor-wrapper')).toHaveClass('cursor-hidden');
  });
});
