import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from '../../components/About';
import { LanguageProvider } from '../../context/LanguageContext';

describe('About', () => {
  it('renders the about section with a heading and description', () => {
    render(
      <LanguageProvider>
        <About />
      </LanguageProvider>
    );

    expect(screen.getByRole('heading', { name: 'Hakkımda' })).toBeInTheDocument();
    expect(screen.getByText(/Front-End ve Masaüstü Geliştirici/)).toBeInTheDocument();
  });

  it('renders both dark/light profile photos with alt text', () => {
    render(
      <LanguageProvider>
        <About />
      </LanguageProvider>
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    images.forEach((img) => expect(img).toHaveAttribute('alt'));
  });

  it('exposes an anchor target #about for in-page navigation', () => {
    const { container } = render(
      <LanguageProvider>
        <About />
      </LanguageProvider>
    );
    expect(container.querySelector('section#about')).toBeInTheDocument();
  });
});
