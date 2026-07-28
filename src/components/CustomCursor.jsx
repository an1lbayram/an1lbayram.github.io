import { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
  const [cursorState, setCursorState] = useState({
    hovered: false,
    text: false,
    disabled: false,
    clicked: false,
    hidden: true,
    isTouch: false,
  });

  const badgeRef = useRef(null);

  // Position refs for 60-120fps lerp animation
  const mousePos = useRef({ x: -100, y: -100 });
  const badgePos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef(null);

  useEffect(() => {
    // Mobile / Touch device check
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setCursorState(prev => ({ ...prev, isTouch: true }));
      return;
    }

    const checkIframeHover = (target) => {
      if (!target || !(target instanceof HTMLElement)) return false;
      return Boolean(target.closest('iframe, .h-captcha-wrapper, [src*="hcaptcha"], [title*="hCaptcha"]'));
    };

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      const isOverIframe = checkIframeHover(e.target);
      if (isOverIframe) {
        setCursorState(prev => ({ ...prev, hidden: true }));
      } else {
        setCursorState(prev => prev.hidden ? { ...prev, hidden: false } : prev);
      }
    };

    const handleMouseDown = () => setCursorState(prev => ({ ...prev, clicked: true }));
    const handleMouseUp = () => setCursorState(prev => ({ ...prev, clicked: false }));
    const handleMouseLeave = () => setCursorState(prev => ({ ...prev, hidden: true }));
    const handleMouseEnter = () => setCursorState(prev => ({ ...prev, hidden: false }));

    const handleElementHover = (e) => {
      const target = e.target;
      if (!target || !(target instanceof HTMLElement)) return;

      if (checkIframeHover(target)) {
        setCursorState(prev => ({ ...prev, hidden: true }));
        return;
      }

      const isDisabledEl = target.closest(
        ':disabled, .disabled, [aria-disabled="true"], [disabled]'
      );

      const isInteractive = target.closest(
        'a, button, input[type="submit"], input[type="button"], .btn, [role="button"], .toggle-theme, .scroll-to-top, select, label, .certificate-link, .timeline-content, .card, .hamburger, .nav-links a, .badge-link'
      );

      const isTextInput = target.closest(
        'input[type="text"], input[type="email"], input[type="number"], input[type="search"], textarea, [contenteditable="true"]'
      );

      setCursorState(prev => ({
        ...prev,
        hidden: false,
        disabled: Boolean(isDisabledEl),
        hovered: Boolean(isInteractive) && !isDisabledEl,
        text: Boolean(isTextInput) && !isDisabledEl,
      }));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleElementHover, { passive: true });

    // Smooth Lerp Animation Loop
    const animate = () => {
      const lerpFactor = 0.28;
      badgePos.current.x += (mousePos.current.x - badgePos.current.x) * lerpFactor;
      badgePos.current.y += (mousePos.current.y - badgePos.current.y) * lerpFactor;

      if (badgeRef.current) {
        badgeRef.current.style.transform = `translate3d(${badgePos.current.x}px, ${badgePos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleElementHover);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  if (cursorState.isTouch) return null;

  // Determine Symbol
  let symbol = '</>';
  if (cursorState.disabled) {
    symbol = '<🚫>';
  } else if (cursorState.text) {
    symbol = '<|>';
  }

  return (
    <div className={`code-cursor-wrapper ${cursorState.hidden ? 'cursor-hidden' : ''}`}>
      {/* State-Adaptive </> Glass Pill Badge Cursor */}
      <div
        ref={badgeRef}
        className={`code-cursor-badge ${cursorState.hovered ? 'is-hovered' : ''} ${cursorState.text ? 'is-text' : ''} ${cursorState.disabled ? 'is-disabled' : ''} ${cursorState.clicked ? 'is-clicked' : ''}`}
      >
        <span className="code-symbol">{symbol}</span>
      </div>
    </div>
  );
};

export default CustomCursor;
