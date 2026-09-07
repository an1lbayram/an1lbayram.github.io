import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CV from '../../components/CV';
import { LanguageProvider } from '../../context/LanguageContext';
import { projects } from '../../data/projects';
import { certificates } from '../../data/certificates';

const renderCV = (onClose = vi.fn()) =>
  render(
    <LanguageProvider>
      <CV onClose={onClose} />
    </LanguageProvider>
  );

describe('CV', () => {
  it('renders the name, every project, and every certificate', () => {
    renderCV();

    expect(screen.getByText('ANIL BAYRAM')).toBeInTheDocument();
    for (const p of projects) {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    }
    for (const c of certificates) {
      expect(screen.getAllByText(c.title).length).toBeGreaterThan(0);
    }
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderCV(onClose);

    await user.click(screen.getByRole('button', { name: /Kapat/ }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderCV(onClose);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('triggers window.print() when the download/print button is clicked', async () => {
    const user = userEvent.setup();
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    renderCV();

    await user.click(screen.getByRole('button', { name: /PDF Olarak İndir/ }));
    expect(printSpy).toHaveBeenCalledOnce();
  });
});
