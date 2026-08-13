import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Contact from '../../components/Contact';
import { LanguageProvider } from '../../context/LanguageContext';

// hCaptcha loads an external script and iframe; stub it with a test-controllable
// fake that exposes an "Onayla (test)" button to simulate a solved captcha.
vi.mock('@hcaptcha/react-hcaptcha', () => ({
  default: React.forwardRef(function FakeHCaptcha({ onVerify }, ref) {
    React.useImperativeHandle(ref, () => ({ resetCaptcha: vi.fn() }));
    return (
      <button type="button" onClick={() => onVerify('fake-captcha-token')}>
        Onayla (test)
      </button>
    );
  }),
}));

const renderContact = () =>
  render(
    <LanguageProvider>
      <Contact />
    </LanguageProvider>
  );

// user-event caches each element's value internally; a native form.reset()
// (used by Contact.jsx after a successful submit) doesn't go through
// user-event's API, so its cache goes stale and the next type() appends onto
// the old text instead of the now-empty field. Explicit clear() re-syncs it.
const typeInto = async (user, element, text) => {
  await user.clear(element);
  await user.type(element, text);
};

const fillValidForm = async (user) => {
  await typeInto(user, screen.getByLabelText(/İsim|Name/i), 'Test Kullanıcı');
  await typeInto(user, screen.getByLabelText(/E-posta|Email/i), 'test@example.com');
  await typeInto(user, screen.getByLabelText(/Konu|Subject/i), 'Test Konusu');
  await typeInto(user, screen.getByLabelText(/Mesaj|Message/i), 'Bu bir test mesajıdır, en az on karakter.');
};

describe('Contact form security', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ success: true }),
    });
  });

  it('renders a hidden honeypot field named "botcheck" for bot spam protection', () => {
    renderContact();
    const honeypot = document.querySelector('input[name="botcheck"]');
    expect(honeypot).toBeInTheDocument();
    expect(honeypot).toHaveStyle({ display: 'none' });
  });

  it('does not execute a <script>-tag XSS payload typed into the name field; React renders it as inert text', async () => {
    const user = userEvent.setup();
    renderContact();

    const nameInput = screen.getByLabelText(/İsim|Name/i);
    const payload = '<script>window.__xss__ = true;</script>';
    await user.type(nameInput, payload);

    expect(nameInput.value).toBe(payload);
    expect(document.querySelectorAll('script').length).toBe(0);
    expect(window.__xss__).toBeUndefined();
  });

  it('blocks submission when the captcha has not been solved, and never calls the API', async () => {
    const user = userEvent.setup();
    renderContact();
    await fillValidForm(user);

    await user.click(screen.getByRole('button', { name: /Gönder|Send/i }));

    expect(await screen.findByText(/robot olmadığınızı doğrulayın/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('submits to Web3Forms only once a valid form + solved captcha are present', async () => {
    const user = userEvent.setup();
    renderContact();
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /Onayla \(test\)/i }));

    await user.click(screen.getByRole('button', { name: /Gönder|Send/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('https://api.web3forms.com/submit');
    expect(options.body.get('h-captcha-response')).toBe('fake-captcha-token');
  });

  it('enforces the client-side rate limit after 3 submissions within the window', async () => {
    const user = userEvent.setup();
    renderContact();

    for (let i = 0; i < 3; i += 1) {
      await fillValidForm(user);
      await user.click(screen.getByRole('button', { name: /Onayla \(test\)/i }));
      await user.click(screen.getByRole('button', { name: /Gönder|Send/i }));
      await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(i + 1));
      // wait for the success handler's form.reset() to actually land before
      // typing into the same fields again on the next loop iteration
      await waitFor(() => expect(screen.getByLabelText(/Mesaj|Message/i)).toHaveValue(''));
    }

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /Onayla \(test\)/i }));
    await user.click(screen.getByRole('button', { name: /Gönder|Send/i }));

    expect(await screen.findByText(/Çok fazla istek|too many requests/i)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(3);
  }, 15000);
});
