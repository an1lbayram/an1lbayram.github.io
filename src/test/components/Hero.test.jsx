import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from '../../components/Hero';
import { LanguageProvider } from '../../context/LanguageContext';

describe('Hero', () => {
  it('renders the name as the single h1 on the page', () => {
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'ANIL BAYRAM' })).toBeInTheDocument();
    // The dark/light profile photos moved to the About section in the
    // redesign; the hero is type-only. See About.test.jsx for their coverage.
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });

  it('renders a link to #projects and a link to #cv', () => {
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    );

    expect(screen.getByRole('link', { name: 'Projelerimi Gör' })).toHaveAttribute('href', '#projects');
    expect(screen.getByRole('link', { name: /CV İndir/ })).toHaveAttribute('href', '#cv');
  });
});
