import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Timeline from '../../components/Timeline';
import { LanguageProvider } from '../../context/LanguageContext';
import { projects } from '../../data/projects';

describe('Timeline', () => {
  it('renders every project as a timeline entry', () => {
    render(
      <LanguageProvider>
        <Timeline />
      </LanguageProvider>
    );

    for (const p of projects) {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    }
  });

  it('sorts entries by customDate, newest first', () => {
    const { container } = render(
      <LanguageProvider>
        <Timeline />
      </LanguageProvider>
    );

    const titles = Array.from(container.querySelectorAll('.timeline-content h3')).map(
      (el) => el.textContent
    );
    const expectedOrder = [...projects]
      .sort((a, b) => new Date(b.customDate) - new Date(a.customDate))
      .map((p) => p.title);

    expect(titles).toEqual(expectedOrder);
  });
});
