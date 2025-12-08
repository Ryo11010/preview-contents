import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

declare const __DEBUG_OVERLAY_ENABLED__: boolean | undefined;

type SectionMap = Record<string, unknown>;

type OverlayState = {
  visible: boolean;
  expanded: boolean;
  title: string;
  sections: SectionMap;
  copyFeedback: 'idle' | 'copied';
};

type EnsureOptions = {
  title?: string;
};

const initialState: OverlayState = {
  visible: false,
  expanded: false,
  title: 'Debug Overlay',
  sections: {},
  copyFeedback: 'idle',
};

const subscribers = new Set<(state: OverlayState) => void>();
let state: OverlayState = { ...initialState };
let notifyTimer: ReturnType<typeof setTimeout> | null = null;
const NOTIFY_INTERVAL_MS = 200;
const isWeb = Platform.OS === 'web';

const overlayShadow = isWeb
  ? { boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }
  : {
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    };

const debugOverlayEnabled =
  typeof __DEBUG_OVERLAY_ENABLED__ !== 'undefined'
    ? __DEBUG_OVERLAY_ENABLED__
    : String(process.env.DEBUG_OVERLAY_ENABLED ?? 'false').toLowerCase() === 'true';

const cloneState = (): OverlayState => ({
  ...state,
  sections: { ...state.sections },
});

const scheduleNotify = () => {
  if (notifyTimer) return;
  notifyTimer = setTimeout(() => {
    notifyTimer = null;
    const snapshot = cloneState();
    subscribers.forEach((cb) => cb(snapshot));
  }, NOTIFY_INTERVAL_MS);
};

const safeStringify = (value: unknown) => {
  const seen = new WeakSet();
  return JSON.stringify(
    value,
    (key, val) => {
      if (typeof val === 'number') {
        return Math.round(val * 1000) / 1000;
      }
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) return '[Circular]';
        seen.add(val);
      }
      return val;
    },
    2,
  );
};

const exportSections = () => safeStringify(state.sections);

const updateSection = (name: string, data: unknown) => {
  if (!debugOverlayEnabled) return;
  state = {
    ...state,
    sections: {
      ...state.sections,
      [name]: data,
    },
  };
  scheduleNotify();
};

const appendSection = (name: string, data: unknown) => {
  if (!debugOverlayEnabled) return;
  const current = state.sections[name];
  let next: unknown;
  if (Array.isArray(current)) {
    next = [...current, data];
  } else if (current === undefined) {
    next = [data];
  } else {
    next = [current, data];
  }
  state = { ...state, sections: { ...state.sections, [name]: next } };
  scheduleNotify();
};

const removeSection = (name: string) => {
  if (!debugOverlayEnabled) return;
  const nextSections = { ...state.sections };
  delete nextSections[name];
  state = { ...state, sections: nextSections };
  scheduleNotify();
};

const clearSections = () => {
  if (!debugOverlayEnabled) return;
  state = { ...state, sections: {} };
  scheduleNotify();
};

const setTitle = (title: string) => {
  if (!debugOverlayEnabled) return;
  state = { ...state, title };
  scheduleNotify();
};

const setExpanded = (expanded: boolean) => {
  if (!debugOverlayEnabled) return;
  state = { ...state, expanded };
  scheduleNotify();
};

const setVisible = (visible: boolean) => {
  if (!debugOverlayEnabled) return;
  state = { ...state, visible };
  scheduleNotify();
};

const setCopyFeedback = (copyFeedback: OverlayState['copyFeedback']) => {
  if (!debugOverlayEnabled) return;
  state = { ...state, copyFeedback };
  scheduleNotify();
};

const destroy = () => {
  if (!debugOverlayEnabled) return;
  state = { ...initialState };
  scheduleNotify();
};

const subscribe = (cb: (s: OverlayState) => void) => {
  subscribers.add(cb);
  cb(cloneState());
  return () => subscribers.delete(cb);
};

const debugOverlayApi = {
  ensure: (opts?: EnsureOptions) => {
    if (!debugOverlayEnabled) return debugOverlayApi;
    state = {
      ...state,
      visible: true,
      title: opts?.title || state.title,
    };
    scheduleNotify();
    return debugOverlayApi;
  },
  show: () => setVisible(true),
  hide: () => setVisible(false),
  toggle: () => setVisible(!state.visible),
  setTitle,
  setTheme: (_theme: 'dark' | 'light' | 'auto') => debugOverlayApi,
  setOpacity: (_opacity: number) => debugOverlayApi,
  update: updateSection,
  append: appendSection,
  remove: removeSection,
  clear: clearSections,
  export: exportSections,
  destroy,
};

const DebugOverlayHost: React.FC = () => {
  const [uiState, setUiState] = useState<OverlayState>(cloneState());
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!debugOverlayEnabled) return;
    const unsub = subscribe(setUiState);
    debugOverlayApi.ensure();
    return () => {
      unsub();
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!debugOverlayEnabled || Platform.OS !== 'web') return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTyping = tag === 'input' || tag === 'textarea' || target?.isContentEditable;
      if (isTyping) return;
      if (e.altKey && e.code === 'KeyD') {
        e.preventDefault();
        setExpanded(!state.expanded);
      }
      if (e.altKey && e.code === 'KeyC') {
        e.preventDefault();
        handleCopy();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const handleCopy = async () => {
    if (!debugOverlayEnabled) return;
    const payload = exportSections();
    let copied = false;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(payload);
        copied = true;
      } catch {
        copied = false;
      }
    }
    if (!copied && typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = payload;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      }
      document.body.removeChild(textarea);
    }
    if (copied) {
      setCopyFeedback('copied');
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopyFeedback('idle'), 1200);
    }
  };

  const sections = useMemo(() => Object.entries(uiState.sections), [uiState.sections]);

  if (!debugOverlayEnabled || !uiState.visible) return null;

  return (
    <View style={styles.root}>
      {uiState.expanded ? (
        <View style={styles.panel}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
          >
            {sections.length === 0 ? (
              <Text style={styles.emptyText}>ログなし</Text>
            ) : (
              sections.map(([name, value]) => (
                <View key={name} style={styles.section}>
                  <Text style={styles.sectionTitle}>{name}</Text>
                  <Text style={styles.sectionBody}>{safeStringify(value)}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      ) : null}

      <View style={styles.bar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="コピー"
          onPress={handleCopy}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {uiState.copyFeedback === 'copied' ? 'コピー済み' : 'コピー'}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="詳細"
          onPress={() => setExpanded(!uiState.expanded)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{uiState.expanded ? '詳細▲' : '詳細▼'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    zIndex: 9999,
    maxWidth: 360,
    pointerEvents: 'box-none',
  },
  panel: {
    backgroundColor: 'rgba(20,20,20,0.86)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    ...overlayShadow,
    maxHeight: 300,
    pointerEvents: 'auto',
  },
  scroll: {
    maxHeight: 280,
  },
  scrollContent: {
    gap: 12,
  },
  section: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionBody: {
    color: '#e5e5ea',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Menlo',
    fontSize: 12,
    lineHeight: 16,
    whiteSpace: 'pre-wrap',
  } as any,
  emptyText: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 12,
  },
  bar: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(20,20,20,0.86)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    pointerEvents: 'auto',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 999,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});

export type DebugOverlayApi = typeof debugOverlayApi;

export const DebugOverlay = debugOverlayApi;
export const DotconDebugOverlay = debugOverlayApi;
export const debugOverlay = debugOverlayApi;
export { debugOverlayEnabled };
export default DebugOverlayHost;
