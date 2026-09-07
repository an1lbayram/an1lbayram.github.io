import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from '../../components/Toast';

describe('Toast', () => {
  it('renders the message and a success icon for type=success', () => {
    render(<Toast message="Kaydedildi" type="success" onClose={vi.fn()} />);
    expect(screen.getByText('Kaydedildi')).toBeInTheDocument();
    expect(screen.getByTestId('toast-icon')).toHaveAttribute('data-variant', 'success');
  });

  it('renders an error icon for type=error', () => {
    render(<Toast message="Hata oluştu" type="error" onClose={vi.fn()} />);
    expect(screen.getByTestId('toast-icon')).toHaveAttribute('data-variant', 'error');
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Toast message="Kaydedildi" onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Kapat' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('auto-dismisses after 5 seconds', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Toast message="Kaydedildi" onClose={onClose} />);

    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(5000);
    expect(onClose).toHaveBeenCalledOnce();

    vi.useRealTimers();
  });
});
