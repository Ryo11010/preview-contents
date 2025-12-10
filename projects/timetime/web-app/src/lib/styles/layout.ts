import { StyleSheet } from 'react-native';
import { COLORS, layout, spacing } from '../../app/designTokens';
import { SCROLL_MIN_HEIGHT, webFixedPosition } from './shared';

export const layoutStyles = StyleSheet.create({
  appRoot: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  appForeground: {
    flex: 1,
    paddingHorizontal: spacing.md,
    position: 'relative',
  },
  header: {
    height: layout.headerHeight,
    justifyContent: 'center',
    position: webFixedPosition,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: layout.headerHeight + spacing.sm,
    paddingBottom: layout.dockHeight + spacing.md,
    minHeight: SCROLL_MIN_HEIGHT,
    flexGrow: 1,
  },
  adminStaticLock: {
    flex: 1,
    paddingTop: layout.headerHeight + spacing.sm,
    paddingBottom: 0,
    minHeight: 0,
  },
  staticContent: {
    flex: 1,
  },
  punchContent: {
    paddingBottom: spacing.md,
  },
  dockWrapper: {
    position: webFixedPosition,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.md,
    zIndex: 10,
    pointerEvents: 'box-none',
  },
  screenContainer: {
    flex: 1,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  punchScrollContent: {
    minHeight: SCROLL_MIN_HEIGHT,
    paddingBottom: layout.dockHeight + spacing.lg,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: spacing.sm,
  },
  containerFull: {
    flex: 1,
  },
});

