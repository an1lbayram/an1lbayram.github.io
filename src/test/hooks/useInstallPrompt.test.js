import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useInstallPrompt from '../../hooks/useInstallPrompt';

function makeBeforeInstallPromptEvent() {
  const event = new Event('beforeinstallprompt', { cancelable: true });
  event.prompt = vi.fn();
  event.userChoice = Promise.resolve({ outcome: 'accepted' });
  return event;
}

describe('useInstallPrompt', () => {
  it('is not installable until the browser fires beforeinstallprompt', () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.canPromptInstall).toBe(false);
  });

  it('becomes installable after beforeinstallprompt fires, and prevents the default mini-infobar', () => {
    const { result } = renderHook(() => useInstallPrompt());
    const event = makeBeforeInstallPromptEvent();
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    act(() => {
      window.dispatchEvent(event);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(result.current.canPromptInstall).toBe(true);
  });

  it('promptInstall() replays the captured native prompt and resolves with the user choice', async () => {
    const { result } = renderHook(() => useInstallPrompt());
    const event = makeBeforeInstallPromptEvent();

    act(() => {
      window.dispatchEvent(event);
    });

    let outcome;
    await act(async () => {
      outcome = await result.current.promptInstall();
    });

    expect(event.prompt).toHaveBeenCalledOnce();
    expect(outcome).toBe('accepted');
  });

  it('hides the button once the app reports as installed', () => {
    const { result } = renderHook(() => useInstallPrompt());

    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });

    expect(result.current.isInstalled).toBe(true);
    expect(result.current.canPromptInstall).toBe(false);
  });
});
