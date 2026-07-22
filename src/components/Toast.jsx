import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 saniye sonra kapan
    return () => clearTimeout(timer);
  }, [onClose]);

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
