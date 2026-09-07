import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from '../../components/Footer';
import { LanguageProvider } from '../../context/LanguageContext';

const renderFooter = () =>
  render(
    <LanguageProvider>
      <Footer />
    </LanguageProvider>
  );

describe('Footer', () => {
  it('renders every social link with a safe target="_blank" + rel="noopener noreferrer"', () => {
    renderFooter();
    for (const name of [
      /GitHub profilimi ziyaret et/i,
      /Medium yazılarımı oku/i,
      /LinkedIn profilimi görüntüle/i,
      /Instagram profilimi ziyaret et/i,
    ]) {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    }
  });

  it('shows the current year in the copyright line', () => {
    renderFooter();
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });

  it('copies the current page URL to the clipboard when "Copy Link" is clicked', async () => {
    const user = userEvent.setup();
    // user-event's setup() installs its own navigator.clipboard stub, so the
    // spy must be attached to that object (after setup runs), not to a
    // stand-in defined beforehand — otherwise user-event's stub silently
    // replaces it when the click fires.
    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    renderFooter();

    await user.click(screen.getByRole('button', { name: /Bağlantıyı kopyala/i }));
    expect(writeTextSpy).toHaveBeenCalledWith(window.location.href);
  });

  it('shows the scroll-to-top button only after scrolling past 300px', () => {
    renderFooter();
    // The redesign mounts/unmounts the button (AnimatePresence) instead of
    // toggling a `show` class on an always-present one.
    expect(
      screen.queryByRole('button', { name: 'Sayfanın Başına Git' })
    ).not.toBeInTheDocument();

    Object.defineProperty(window, 'scrollY', { value: 400, configurable: true });
    fireEvent.scroll(window);

    expect(
      screen.getByRole('button', { name: 'Sayfanın Başına Git' })
    ).toBeInTheDocument();
  });
});
