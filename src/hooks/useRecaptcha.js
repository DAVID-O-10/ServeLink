import { useCallback, useEffect, useRef } from 'react';

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

let scriptLoaded = false;
let scriptLoading = false;
let loadCallbacks = [];

function loadScript() {
  if (scriptLoaded) return Promise.resolve();
  if (scriptLoading) {
    return new Promise((resolve) => loadCallbacks.push(resolve));
  }
  scriptLoading = true;
  return new Promise((resolve) => {
    const el = document.createElement('script');
    el.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    el.async = true;
    el.defer = true;
    el.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      resolve();
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks = [];
    };
    document.head.appendChild(el);
  });
}

export function useRecaptcha() {
  const ready = useRef(scriptLoaded || !SITE_KEY);

  useEffect(() => {
    if (!SITE_KEY) return;
    if (!scriptLoaded && !scriptLoading) loadScript();
  }, []);

  const getToken = useCallback(async () => {
    if (!SITE_KEY) return null;
    try {
      await loadScript();
      const token = await window.grecaptcha.execute(SITE_KEY, { action: 'submit' });
      return token;
    } catch {
      return null;
    }
  }, []);

  return { getToken, enabled: Boolean(SITE_KEY) };
}
