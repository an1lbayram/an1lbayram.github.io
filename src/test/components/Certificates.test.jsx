import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Certificates from '../../components/Certificates';
import { LanguageProvider } from '../../context/LanguageContext';
import { certificates } from '../../data/certificates';

describe('Certificates', () => {
  const COLLAPSED_COUNT = 6;

  it('collapses to the first few certificates and expands to all of them', async () => {
    // Titles can repeat (e.g. two "İlkyardım" certs from different institutions),
    // so assert on the total count of rendered cards instead of unique text.
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Certificates />
      </LanguageProvider>
    );

    expect(screen.getAllByText(/Kurum:/)).toHaveLength(COLLAPSED_COUNT);

    await user.click(screen.getByRole('button', { name: /Tümünü göster/i }));
    expect(screen.getAllByText(/Kurum:/)).toHaveLength(certificates.length);

    await user.click(screen.getByRole('button', { name: /Daha az göster/i }));
    expect(screen.getAllByText(/Kurum:/)).toHaveLength(COLLAPSED_COUNT);
  });

  it('renders a "show credential" link only for certificates that have a url', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Certificates />
      </LanguageProvider>
    );
    await user.click(screen.getByRole('button', { name: /Tümünü göster/i }));

    const withUrl = certificates.filter((c) => c.url).length;
    const links = screen.getAllByRole('link', { name: /Yeterlilik Belgesi/i });
    expect(links).toHaveLength(withUrl);
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });
  });
});
