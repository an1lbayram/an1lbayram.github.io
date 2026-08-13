import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../../components/Navbar';
import { LanguageProvider } from '../../context/LanguageContext';

vi.mock('../../hooks/useInstallPrompt', () => ({
  default: () => ({ canPromptInstall: false, showIOSInstructions: false, isInstalled: false, promptInstall: vi.fn() }),
}));

const renderNavbar = () =>
  render(
    <LanguageProvider>
      <Navbar />
    </LanguageProvider>
  );

describe('Navbar', () => {
  it('renders all navigation links pointing at their in-page section anchors', () => {
    renderNavbar();

    const expected = {
      'Ana Sayfa': '#hero',
      'Hakkımda': '#about',
      'Projeler': '#projects',
      'Medium': '#medium',
      'Sertifikalar': '#certificates',
      'Beceriler': '#skills',
      'İletişim': '#contact',
    };

    for (const [label, href] of Object.entries(expected)) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', href);
    }
  });

  it('opens the mobile menu on hamburger click and closes it on Escape', async () => {
    const user = userEvent.setup();
    renderNavbar();

    const hamburger = screen.getByLabelText('Menüyü Aç/Kapat');
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');

    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the mobile menu when a nav link is clicked', async () => {
    const user = userEvent.setup();
    renderNavbar();

    const hamburger = screen.getByLabelText('Menüyü Aç/Kapat');
    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('link', { name: 'Hakkımda' }));
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles the displayed language label when the language switcher is clicked', async () => {
    const user = userEvent.setup();
    renderNavbar();

    const langButton = screen.getByRole('button', { name: 'EN | TR' });
    await user.click(langButton);

    expect(screen.getByRole('button', { name: 'TR | EN' })).toBeInTheDocument();
  });
});
