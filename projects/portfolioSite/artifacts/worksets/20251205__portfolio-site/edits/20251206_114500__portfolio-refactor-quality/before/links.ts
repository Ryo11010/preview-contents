import { shareCopy } from '@/config/tokens';

export const openExternalLink = (url?: string) => {
  if (!url || typeof window === 'undefined') return;
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch {
    // no-op
  }
};

export const openMailLink = (email?: string) => {
  if (!email || typeof window === 'undefined') return;
  try {
    window.location.href = `mailto:${email}`;
  } catch {
    // no-op
  }
};

export const safeAlert = (message: string) => {
  if (typeof window === 'undefined') return;
  window.alert(message);
};

export const shareContent = (text: string) => {
  if (!text) {
    safeAlert(shareCopy.fallback);
    return;
  }

  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (nav.share) {
      nav.share({ title: shareCopy.successTitle, text }).catch(() => safeAlert(shareCopy.fallback));
      return;
    }
  }

  safeAlert(shareCopy.fallback);
};
