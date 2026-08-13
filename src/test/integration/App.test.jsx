import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../../App';
import { useGitHubStats } from '../../hooks/useGitHubStats';
import { useMediumFeed } from '../../hooks/useMediumFeed';
import { LanguageProvider } from '../../context/LanguageContext';

vi.mock('../../hooks/useGitHubStats');
vi.mock('../../hooks/useMediumFeed');
vi.mock('@vercel/analytics/react', () => ({ Analytics: () => null }));
vi.mock('@vercel/speed-insights/react', () => ({ SpeedInsights: () => null }));
// Contact renders this widget, which otherwise tries to load an external
// script/iframe that jsdom can't fetch. Contact attaches a ref to it, so the
// stub must forward one too (a plain function component would warn).
vi.mock('@hcaptcha/react-hcaptcha', () => ({
  default: React.forwardRef(function FakeHCaptcha(_props, ref) {
    React.useImperativeHandle(ref, () => ({ resetCaptcha: vi.fn() }));
    return null;
  }),
}));

// App wraps the whole page in <LanguageProvider> only indirectly (main.jsx
// does that in production); it reads useLanguage() directly, so tests must
// supply the provider explicitly the same way the real entrypoint does.
const renderApp = () =>
  render(
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );

describe('App integration', () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.hash = '';
    document.documentElement.removeAttribute('data-bs-theme');
    useGitHubStats.mockReturnValue({ stats: null, loading: false, error: null });
    useMediumFeed.mockReturnValue({ articles: [], loading: false, error: null });
  });

  it('boots in dark theme by default and toggles to light on click, persisting the choice', async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark'));

    const themeBtn = await screen.findByRole('button', { name: /Açık Temaya Geç/i });
    await user.click(themeBtn);

    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
    expect(localStorage.getItem('color-mode')).toBe('light');
  });

  it('restores a previously saved theme from localStorage on mount', async () => {
    localStorage.setItem('color-mode', 'light');
    renderApp();

    await waitFor(() => expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light'));
    expect(await screen.findByRole('button', { name: /Koyu Temaya Geç/i })).toBeInTheDocument();
  });

  it('shows the CV page instead of the landing page when the URL hash is #cv on load', async () => {
    window.location.hash = '#cv';
    renderApp();

    expect(await screen.findByText('ANIL BAYRAM')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Açık Temaya Geç|Koyu Temaya Geç/i })).not.toBeInTheDocument();
  });

  it('switches to the CV view when the hash changes at runtime, and back when cleared', async () => {
    renderApp();
    await screen.findByRole('button', { name: /Açık Temaya Geç|Koyu Temaya Geç/i });

    window.location.hash = '#cv';
    act(() => {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(await screen.findByText('ANIL BAYRAM')).toBeInTheDocument();

    const closeBtn = await screen.findByRole('button', { name: /Kapat/i });
    await userEvent.setup().click(closeBtn);

    expect(await screen.findByRole('button', { name: /Açık Temaya Geç|Koyu Temaya Geç/i })).toBeInTheDocument();
  });

  it('propagates a language toggle from the navbar to other sections (About heading translates)', async () => {
    const user = userEvent.setup();
    renderApp();

    expect(await screen.findByRole('heading', { name: 'Hakkımda' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'EN | TR' }));

    expect(await screen.findByRole('heading', { name: 'About Me' })).toBeInTheDocument();
    expect(localStorage.getItem('site-lang')).toBe('en');
  });
});
