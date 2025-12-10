import { StyleSheet } from 'react-native';
import { COLORS, layout, radius, spacing } from '../../app/designTokens';
import {
  adminCardShadow,
  commonShadow,
  inputFocusFrameStyle,
  inputShell,
  inputTextBase,
  menuCardShadow,
  selectBackdropPosition,
} from './shared';

export const controlStyles = StyleSheet.create({
  roleChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,122,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.2)',
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },

  card: {
    borderRadius: radius.lg,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: spacing.md,
    ...commonShadow,
  },
  cardShadowSoft: {
    ...commonShadow,
  },
  cardShadowMenu: {
    ...menuCardShadow,
  },
  cardShadowAdmin: {
    ...adminCardShadow,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },

  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.xs,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonDanger: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonGlass: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  buttonSm: {
    height: 32,
    paddingHorizontal: spacing.sm,
  },
  buttonIcon: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSub,
  },
  buttonLabelPrimary: {
    color: '#fff',
  },
  buttonLabelDanger: {
    color: COLORS.danger,
  },

  switchContainer: {
    width: 48,
    height: 28,
    borderRadius: 28,
    backgroundColor: '#E5E5EA',
    padding: 2,
    justifyContent: 'center',
  },
  switchOn: {
    backgroundColor: COLORS.success,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    transform: [{ translateX: 0 }],
  },
  switchThumbOn: {
    transform: [{ translateX: 20 }],
  },

  segmentRoot: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 2,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: '#fff',
  },
  segmentLabel: {
    fontSize: 13,
    color: COLORS.textSub,
    fontWeight: '500',
  },
  segmentLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  fieldContainer: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 12,
    color: COLORS.textSub,
    marginBottom: spacing.xs,
  },
  fieldInner: {
    ...inputShell,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  fieldInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    marginLeft: spacing.xs,
    fontSize: 15,
    ...inputTextBase,
  },
  fieldSectionTitle: {
    fontSize: 12,
    color: COLORS.textSub,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  simpleInput: {
    ...inputShell,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 14,
    ...inputTextBase,
  },

  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    ...inputShell,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  selectFieldOpen: {
    ...inputFocusFrameStyle,
  },
  selectFieldPressed: {
    backgroundColor: '#F5F7FB',
  },
  selectFieldDisabled: {
    backgroundColor: '#F8F9FB',
    borderColor: '#E5E5EA',
  },
  selectValueText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textMain,
  },
  selectPlaceholderText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textSub,
  },
  selectDisabledText: {
    flex: 1,
    fontSize: 15,
    color: '#C0C4CC',
  },
  selectContainer: {
    position: 'relative',
  },
  selectContainerOpen: {
    zIndex: 12000,
  },
  selectBackdrop: {
    position: selectBackdropPosition,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 12000,
  },
  selectDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    zIndex: 12001,
  },
  selectList: {
    maxHeight: 240,
  },
  selectModalOverlay: {
    flex: 1,
  },
  selectDropdownFloating: {
    position: 'absolute',
  },
  selectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  selectItemActive: {
    backgroundColor: '#F2F2F7',
  },
  selectItemLabel: {
    fontSize: 14,
    color: COLORS.textMain,
  },

  dateNavRoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  dateNavLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain,
  },

  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timelineIconColumn: {
    width: 32,
    alignItems: 'center',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E5E5EA',
    marginTop: spacing.xs,
  },
  timelineContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  timelineSub: {
    fontSize: 12,
    color: COLORS.textSub,
  },
  timelineTimeColumn: {
    marginLeft: spacing.sm,
  },
  timelineTime: {
    fontSize: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },

  settingsHeaderRoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    alignSelf: 'stretch',
    width: '100%',
  },
  settingsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  settingsLogoutRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  settingsLogoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.danger,
  },

  dockRoot: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    height: layout.dockHeight,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...commonShadow,
  },
  dockItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dockItemActive: {},
  dockLabel: {
    fontSize: 11,
    color: COLORS.textSub,
  },
  dockLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchCard: {
    ...inputShell,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: spacing.xs,
    paddingVertical: 0,
    ...inputTextBase,
  },
  inputFocusFrame: {
    ...inputFocusFrameStyle,
  },
});
