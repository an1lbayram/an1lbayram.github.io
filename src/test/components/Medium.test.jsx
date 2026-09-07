import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Medium from '../../components/Medium';
import { LanguageProvider } from '../../context/LanguageContext';
import { useMediumFeed } from '../../hooks/useMediumFeed';
import { mediumArticles } from '../../data/medium';

vi.mock('../../hooks/useMediumFeed');

const renderMedium = () =>
  render(
    <LanguageProvider>
      <Medium />
    </LanguageProvider>
  );

describe('Medium', () => {
  beforeEach(() => {
    useMediumFeed.mockReturnValue({ articles: [], loading: false, error: null });
  });

  it('shows skeleton placeholders while the feed is loading', () => {
    useMediumFeed.mockReturnValue({ articles: [], loading: true, error: null });
    const { container } = renderMedium();
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
  });

  it('renders live feed articles (up to 6) when the API returns data', () => {
    const feedArticles = Array.from({ length: 8 }, (_, i) => ({
      id: `live-${i}`,
      title: `Live Article ${i}`,
      description: 'desc',
      url: `https://medium.com/@anl1bayram/live-${i}`,
    }));
    useMediumFeed.mockReturnValue({ articles: feedArticles, loading: false, error: null });

    renderMedium();

    expect(screen.getByText('Live Article 0')).toBeInTheDocument();
    expect(screen.getByText('Live Article 5')).toBeInTheDocument();
    expect(screen.queryByText('Live Article 6')).not.toBeInTheDocument();
  });

  it('falls back to local TR articles when the feed API returns nothing (fail-open, not fail-blank)', () => {
    renderMedium();

    const trFallback = mediumArticles.filter((a) => a.lang === 'TR');
    expect(screen.getByText(trFallback[0].title)).toBeInTheDocument();
  });

  it('every article link opens in a new tab safely (rel=noopener noreferrer)', () => {
    renderMedium();
    const links = screen.getAllByRole('link', { name: /Yazıyı Oku/i });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });
  });
});
