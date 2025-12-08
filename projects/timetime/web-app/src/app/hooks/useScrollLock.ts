import { useEffect } from 'react';
import { Platform } from 'react-native';

export type ScrollMode = 'lock' | 'auto' | 'scroll';

export const useScrollLock = (mode: ScrollMode) => {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root') as HTMLElement | null;

    const applyLock = () => {
      html.style.overflowX = 'hidden';
      body.style.overflowX = 'hidden';
      html.style.overflowY = 'hidden';
      body.style.overflowY = 'hidden';
      html.style.height = '100%';
      body.style.height = '100%';
      html.style.width = '100%';
      body.style.width = '100%';
      body.style.position = 'fixed';
      body.style.top = '0';
      body.style.left = '0';
      if (root) {
        root.style.height = '100%';
        root.style.width = '100%';
        root.style.overflow = 'hidden';
        root.style.position = 'relative';
      }
      window.scrollTo(0, 0);
    };

    const applyAuto = () => {
      html.style.overflowX = 'hidden';
      body.style.overflowX = 'hidden';
      html.style.overflowY = 'auto';
      body.style.overflowY = 'auto';
      html.style.height = '';
      body.style.height = '';
      html.style.width = '';
      body.style.width = '';
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      if (root) {
        root.style.height = '';
        root.style.width = '';
        root.style.overflow = '';
        root.style.position = '';
      }
    };

    const clear = () => {
      html.style.overflowX = '';
      body.style.overflowX = '';
      html.style.overflowY = '';
      body.style.overflowY = '';
      html.style.height = '';
      body.style.height = '';
      html.style.width = '';
      body.style.width = '';
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      if (root) {
        root.style.height = '';
        root.style.width = '';
        root.style.overflow = '';
        root.style.position = '';
      }
    };

    if (mode === 'lock') applyLock();
    else applyAuto();
    return clear;
  }, [mode]);
};

