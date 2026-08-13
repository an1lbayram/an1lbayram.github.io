import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InstallButton from '../../components/InstallButton';
import { LanguageProvider } from '../../context/LanguageContext';
import useInstallPrompt from '../../hooks/useInstallPrompt';

vi.mock('../../hooks/useInstallPrompt');

const renderButton = () =>
  render(
    <LanguageProvider>
      <InstallButton />
    </LanguageProvider>
  );

describe('InstallButton', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders nothing when the app is already installed', () => {
    useInstallPrompt.mockReturnValue({
      canPromptInstall: false,
      showIOSInstructions: false,
      isInstalled: true,
      promptInstall: vi.fn(),
    });
    const { container } = renderButton();
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when install is not available and this is not iOS', () => {
    useInstallPrompt.mockReturnValue({
      canPromptInstall: false,
      showIOSInstructions: false,
      isInstalled: false,
      promptInstall: vi.fn(),
    });
    const { container } = renderButton();
    expect(container).toBeEmptyDOMElement();
  });

  it('triggers the native install prompt when available (Chrome/Edge/Android)', async () => {
    const promptInstall = vi.fn();
    useInstallPrompt.mockReturnValue({
      canPromptInstall: true,
      showIOSInstructions: false,
      isInstalled: false,
      promptInstall,
    });
    const user = userEvent.setup();
    renderButton();

    await user.click(screen.getByRole('button', { name: /uygulama olarak cihazına yükle/i }));
    expect(promptInstall).toHaveBeenCalledOnce();
  });

  it('shows manual "Add to Home Screen" instructions on iOS instead of a native prompt', async () => {
    const promptInstall = vi.fn();
    useInstallPrompt.mockReturnValue({
      canPromptInstall: false,
      showIOSInstructions: true,
      isInstalled: false,
      promptInstall,
    });
    const user = userEvent.setup();
    renderButton();

    await user.click(screen.getByRole('button', { name: /uygulama olarak cihazına yükle/i }));
    expect(promptInstall).not.toHaveBeenCalled();
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });
});
