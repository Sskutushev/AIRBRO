import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    deferredPrompt: Event | null;
  }
}

const PWAPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Detect if the user is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    setIsIOS(isIos());

    // Handle beforeinstallprompt event for non-iOS devices
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // @ts-expect-error - TypeScript doesn't recognize this event type properly
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await (deferredPrompt as any).userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  // iOS instructions
  if (isIOS && !window.matchMedia('(display-mode: standalone)').matches) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Install AIBRO Business</h3>
            <p className="text-sm text-gray-600">Add to Home Screen for best experience</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Regular PWA install prompt for non-iOS devices
  if (showPrompt && !(deferredPrompt as any)?.['handled']) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Install AIBRO Business</h3>
            <p className="text-sm text-gray-600">Install this application to your home screen</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPrompt(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Later
            </button>
            <button
              onClick={handleInstallClick}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAPrompt;
