import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Certificates from '../../components/Certificates';
import { LanguageProvider } from '../../context/LanguageContext';
import { certificates } from '../../data/certificates';

describe('Certificates', () => {
  it('renders a card for every certificate with its institution and date', () => {
    // Titles can repeat (e.g. two "İlkyardım" certs from different institutions),
    // so assert on the total count of rendered cards instead of unique text.
    const { container } = render(
      <LanguageProvider>
        <Certificates />
      </LanguageProvider>
    );
    expect(container.querySelectorAll('.card-title').length).toBe(certificates.length);
    expect(screen.getAllByText(/Kurum:/).length).toBe(certificates.length);
  });

  it('renders a "show credential" link only for certificates that have a url', () => {
    render(
      <LanguageProvider>
        <Certificates />
      </LanguageProvider>
    );

    const withUrl = certificates.filter((c) => c.url).length;
    const links = screen.getAllByRole('link', { name: /Yeterlilik Belgesi/i });
    expect(links).toHaveLength(withUrl);
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });
  });
});
