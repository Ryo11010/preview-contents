import { StyleSheet } from 'react-native';
import { COLORS, radius, spacing } from '../designTokens';

export const navigationStyles = StyleSheet.create({
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheetRoot: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.sm,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D1D6',
    marginBottom: spacing.sm,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sheetDoneText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  sheetContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});

