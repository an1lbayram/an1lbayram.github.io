import React, { useEffect, useRef } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const timer = setTimeout(() => {
      onCloseRef.current();
    }, 5000); // 5 saniye sonra kapan
    return () => clearTimeout(timer);
  }, []); // onClose dependency'den çıkarıldı — ref ile izleniyor

  return (
    <div className={`custom-toast custom-toast-${type}`}>
      <div className="custom-toast-icon">
        {type === 'success' ? '✓' : '✕'}
      </div>
      <div className="custom-toast-message">{message}</div>
      <button className="custom-toast-close" onClick={onClose} aria-label="Kapat">
        ✕
      </button>
    </div>
  );
};

export default Toast;
