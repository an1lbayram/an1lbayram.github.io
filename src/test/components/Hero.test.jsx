import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from '../../components/Hero';
import { LanguageProvider } from '../../context/LanguageContext';

describe('Hero', () => {
  it('renders the name heading and both dark/light profile photos with alt text', () => {
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'ANIL BAYRAM' })).toBeInTheDocument();
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    images.forEach((img) => expect(img).toHaveAttribute('alt'));
  });

  it('renders a link to #about and a link to #cv', () => {
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    );

    expect(screen.getByRole('link', { name: 'Projelerimi Gör' })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('link', { name: /CV İndir/ })).toHaveAttribute('href', '#cv');
  });
});
