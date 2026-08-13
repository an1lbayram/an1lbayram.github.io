import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Skills from '../../components/Skills';
import { LanguageProvider } from '../../context/LanguageContext';
import { skills, languages } from '../../data/skills';

describe('Skills', () => {
  it('renders a progressbar for every skill with correct aria attributes', () => {
    render(
      <LanguageProvider>
        <Skills />
      </LanguageProvider>
    );

    const bars = screen.getAllByRole('progressbar');
    expect(bars).toHaveLength(skills.length);

    bars.forEach((bar, i) => {
      expect(bar).toHaveAttribute('aria-valuenow', String(skills[i].progress));
      expect(bar).toHaveAttribute('aria-valuemin', '0');
      expect(bar).toHaveAttribute('aria-valuemax', '100');
    });
  });

  it('renders a card for every spoken language', () => {
    render(
      <LanguageProvider>
        <Skills />
      </LanguageProvider>
    );

    for (const lang of languages) {
      expect(screen.getByText(lang.name)).toBeInTheDocument();
    }
  });
});
