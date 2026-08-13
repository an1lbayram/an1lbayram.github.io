import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import TypeWriter from '../../components/TypeWriter';

// TypeWriter renders `{currentText}<span class="typewriter-cursor">|</span>`,
// so any given DOM node's textContent bubbles up to its ancestors too —
// asserting on container.textContent directly avoids RTL's "multiple
// elements match" ambiguity that getByText would hit here. Each character is
// scheduled by its own effect-driven setTimeout, so timers must be advanced
// and flushed one step at a time (each wrapped in its own act()) — a single
// large advance skips ahead before the next character's timeout is even
// registered, since that registration depends on a state update flushing.
const typeSteps = (steps, delay) => {
  for (let i = 0; i < steps; i += 1) {
    act(() => {
      vi.advanceTimersByTime(delay);
    });
  }
};

describe('TypeWriter', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with just the blinking cursor and no characters typed yet', () => {
    vi.useFakeTimers();
    const { container } = render(<TypeWriter text="Hi" delay={10} />);
    expect(container.textContent).toBe('|');
  });

  it('types out the given text one character at a time', () => {
    vi.useFakeTimers();
    const { container } = render(<TypeWriter text="Hi" delay={10} />);

    typeSteps(1, 10);
    expect(container.textContent).toBe('H|');

    typeSteps(1, 10);
    expect(container.textContent).toBe('Hi|');
  });

  it('resets and retypes when the text prop changes (language switch)', () => {
    vi.useFakeTimers();
    const { container, rerender } = render(<TypeWriter text="Hi" delay={10} />);
    typeSteps(2, 10);
    expect(container.textContent).toBe('Hi|');

    rerender(<TypeWriter text="Selam" delay={10} />);
    expect(container.textContent).toBe('|');

    typeSteps(5, 10);
    expect(container.textContent).toBe('Selam|');
  });
});
