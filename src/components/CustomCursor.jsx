import { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
  const [cursorState, setCursorState] = useState({
    hovered: false,
    text: false,
    clicked: false,
    hidden: true,
    isTouch: false,
  });

  const dotRef = useRef(null);
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

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setCursorState(prev => prev.hidden ? { ...prev, hidden: false } : prev);
    };

    const handleMouseDown = () => setCursorState(prev => ({ ...prev, clicked: true }));
    const handleMouseUp = () => setCursorState(prev => ({ ...prev, clicked: false }));
    const handleMouseLeave = () => setCursorState(prev => ({ ...prev, hidden: true }));
    const handleMouseEnter = () => setCursorState(prev => ({ ...prev, hidden: false }));

    const handleElementHover = (e) => {
      const target = e.target;
      if (!target || !(target instanceof HTMLElement)) return;

      const isInteractive = target.closest(
        'a, button, input[type="submit"], input[type="button"], .btn, [role="button"], .toggle-theme, .scroll-to-top, select, label, .certificate-link, .timeline-content, .card, .hamburger, .nav-links a, .badge-link'
      );

      const isTextInput = target.closest(
        'input[type="text"], input[type="email"], input[type="number"], input[type="search"], textarea, [contenteditable="true"]'
      );

      setCursorState(prev => ({
        ...prev,
        hovered: Boolean(isInteractive),
        text: Boolean(isTextInput),
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
      const lerpFactor = 0.22;
      badgePos.current.x += (mousePos.current.x - badgePos.current.x) * lerpFactor;
      badgePos.current.y += (mousePos.current.y - badgePos.current.y) * lerpFactor;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

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

  const badgeIcon = cursorState.text ? '✏️' : cursorState.hovered ? '⚡' : '👨‍💻';
  const badgeLabel = cursorState.text ? 'EDIT' : cursorState.hovered ? 'CLICK' : 'DEV';

  return (
    <div className={`dev-cursor-container ${cursorState.hidden ? 'cursor-hidden' : ''}`}>
      {/* 0ms Precision Target Dot */}
      <div
        ref={dotRef}
        className={`dev-cursor-dot ${cursorState.hovered ? 'is-hovered' : ''} ${cursorState.clicked ? 'is-clicked' : ''}`}
      />

      {/* Developer Badge */}
      <div
        ref={badgeRef}
        className={`dev-cursor-badge ${cursorState.hovered ? 'is-hovered' : ''} ${cursorState.text ? 'is-text' : ''} ${cursorState.clicked ? 'is-clicked' : ''}`}
      >
        <span className="dev-badge-icon">{badgeIcon}</span>
        <span className="dev-badge-text">{badgeLabel}</span>
      </div>
    </div>
  );
};

export default CustomCursor;
