import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import useInstallPrompt from '../hooks/useInstallPrompt';

const InstallButton = ({ className = '' }) => {
  const { t } = useLanguage();
  const { canPromptInstall, showIOSInstructions, isInstalled, promptInstall } = useInstallPrompt();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled || (!canPromptInstall && !showIOSInstructions)) {
    return null;
  }

  const handleClick = () => {
    if (canPromptInstall) {
      promptInstall();
    } else if (showIOSInstructions) {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`btn btn-sm btn-outline-primary install-app-btn ${className}`}
        aria-label={t('install-app-aria')}
      >
        <span aria-hidden="true">⬇</span> {t('install-app')}
      </button>

      {showIOSModal && (
        <div
          className="install-ios-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-ios-title"
          onClick={() => setShowIOSModal(false)}
        >
          <div className="install-ios-modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="install-ios-title" className="h6 mb-2">{t('install-app-ios-title')}</h3>
            <p className="text-secondary small mb-3">{t('install-app-ios-desc')}</p>
            <button
              type="button"
              className="btn btn-sm btn-primary w-100"
              onClick={() => setShowIOSModal(false)}
            >
              {t('install-app-ios-close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallButton;
