import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { axe } from 'vitest-axe';
import { LanguageProvider } from '../../context/LanguageContext';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import About from '../../components/About';
import Skills from '../../components/Skills';
import Footer from '../../components/Footer';
import Contact from '../../components/Contact';
import Toast from '../../components/Toast';
import ErrorBoundary from '../../components/ErrorBoundary';

vi.mock('@hcaptcha/react-hcaptcha', () => ({
  default: React.forwardRef(function FakeHCaptcha(_props, ref) {
    React.useImperativeHandle(ref, () => ({ resetCaptcha: vi.fn() }));
    return null;
  }),
}));

const withLanguage = (ui) => <LanguageProvider>{ui}</LanguageProvider>;

// jsdom always reports `ontouchstart` as present (see CustomCursor.test.jsx),
// which is irrelevant noise here; axe itself needs no special DOM shims.
describe('accessibility (axe-core)', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ json: async () => ({ success: true }) });
  });

  it('Navbar has no detectable accessibility violations', async () => {
    const { container } = render(withLanguage(<Navbar />));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Hero has no detectable accessibility violations', async () => {
    const { container } = render(withLanguage(<Hero />));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('About has no detectable accessibility violations', async () => {
    const { container } = render(withLanguage(<About />));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Skills (progressbars) has no detectable accessibility violations', async () => {
    const { container } = render(withLanguage(<Skills />));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Footer (social links + scroll-to-top button) has no detectable accessibility violations', async () => {
    const { container } = render(withLanguage(<Footer />));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Contact form has no detectable accessibility violations (labels, error states)', async () => {
    const { container } = render(withLanguage(<Contact />));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Toast notification has no detectable accessibility violations', async () => {
    const { container } = render(<Toast message="Test" onClose={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('ErrorBoundary fallback UI has no detectable accessibility violations', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const Bomb = () => {
      throw new Error('boom');
    };
    const { container } = render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
