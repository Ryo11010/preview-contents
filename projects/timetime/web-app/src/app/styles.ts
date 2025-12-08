import { Platform, StyleSheet } from 'react-native';
import { COLORS, layout, radius, spacing } from './designTokens';
import { LOGIN_COLORS, LOGIN_FONT_SIZES, LOGIN_RADIUS, LOGIN_SPACING } from './styleConstants';
import { LiquidTheme } from './liquid-ui/liquid-ui_RN';

const webFixedPosition = (Platform.OS === 'web' ? 'fixed' : 'absolute') as any;
const isWeb = Platform.OS === 'web';
const commonShadow = LiquidTheme.shadowSoft;
const inputShell = {
  borderWidth: 1,
  borderColor: COLORS.cardBorder,
  backgroundColor: '#fff',
  borderRadius: radius.lg,
};
const inputTextBase = {
  color: COLORS.textMain,
  outlineStyle: 'none' as const,
  outlineWidth: 0,
};
const inputFocusFrameStyle = {
  borderColor: COLORS.primary,
  ...(isWeb
    ? {
        boxShadow: '0 0 0 2px rgba(0,122,255,0.16)',
      }
    : {
        shadowColor: COLORS.primary,
        shadowOpacity: 0.16,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
      }),
};
const menuCardShadow = isWeb
  ? {
      boxShadow:
        '0 12px 24px -14px rgba(0,0,0,0.16), 0 6px 14px -12px rgba(0,0,0,0.12)',
    }
  : {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    };
const adminCardShadow = isWeb
  ? {
      boxShadow:
        '0 10px 22px -16px rgba(0,0,0,0.16), 0 6px 12px -14px rgba(0,0,0,0.12)',
    }
  : {
      shadowColor: '#000',
      shadowOpacity: 0.07,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 6 },
      elevation: 5,
    };

export const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
    backgroundColor: 'transparent',
    minHeight: 0,
  },
  appForeground: {
    flex: 1,
    paddingHorizontal: spacing.md,
    position: 'relative',
    minHeight: 0,
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
    paddingTop: layout.headerHeight + spacing.md,
    paddingBottom: layout.dockHeight + spacing.xl,
    flex: 1,
    flexGrow: 1,
    minHeight: 0,
    height: '100%',
  },
  staticContent: {
    flex: 1,
    minHeight: 0,
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    minHeight: 0,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: spacing.sm,
  },
  loginWrapper: {
    flex: 1,
    backgroundColor: LOGIN_COLORS.background,
  },
  loginBackgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  loginSafeArea: {
    flex: 1,
    backgroundColor: LOGIN_COLORS.background,
  },
  settingsContent: {
    gap: spacing.lg,
    alignItems: 'center',
  },
  settingsProfilePressable: {
    width: '100%',
    alignItems: 'center',
  },
  settingsRowPressable: {
    width: '100%',
  },
  settingsLogoutPressable: {
    width: '100%',
    alignItems: 'center',
  },
  settingsCardFull: {
    alignSelf: 'center',
    width: '92%',
    maxWidth: 560,
  },
  settingsCardNarrow: {
    alignSelf: 'center',
    width: '70%',
    maxWidth: 360,
  },
  loginScrollContent: {
    flexGrow: 1,
    paddingHorizontal: LOGIN_SPACING.lg,
    paddingTop: LOGIN_SPACING.xxl,
    paddingBottom: LOGIN_SPACING.xxl,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loginFormCard: {
    borderRadius: LOGIN_RADIUS.xl,
    borderWidth: 1,
    borderColor: LOGIN_COLORS.border,
    backgroundColor: 'rgba(255,255,255,0.92)',
    gap: LOGIN_SPACING.md,
  },
  loginHeader: {
    marginBottom: LOGIN_SPACING.xl,
    marginTop: LOGIN_SPACING.xl,
  },
  loginHeroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: LOGIN_SPACING.md,
    paddingVertical: LOGIN_SPACING.xs,
    borderRadius: LOGIN_RADIUS.pill,
    backgroundColor: 'rgba(0,122,255,0.12)',
    color: COLORS.primary,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: LOGIN_SPACING.sm,
    fontSize: 12,
  },
  loginHeroTitle: {
    fontSize: LOGIN_FONT_SIZES.xl,
    fontWeight: '800',
    color: LOGIN_COLORS.textMain,
    marginBottom: LOGIN_SPACING.xs,
  },
  loginHeroSubtitle: {
    fontSize: LOGIN_FONT_SIZES.md,
    color: LOGIN_COLORS.textSub,
    fontWeight: '600',
    lineHeight: 22,
  },
  loginTitle: {
    fontSize: LOGIN_FONT_SIZES.xl,
    fontWeight: '700',
    color: LOGIN_COLORS.textMain,
    marginBottom: LOGIN_SPACING.sm,
  },
  loginSubtitle: {
    fontSize: LOGIN_FONT_SIZES.md,
    color: LOGIN_COLORS.textSub,
    fontWeight: '600',
  },
  loginForm: {
    width: '100%',
  },
  loginInputContainer: {
    ...inputShell,
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingLeft: LOGIN_SPACING.lg,
    paddingRight: LOGIN_SPACING.lg,
  },
  loginInputContainerFocused: {
  },
  loginInputIcon: {
    marginRight: LOGIN_SPACING.md,
  },
  loginTextInput: {
    flex: 1,
    height: '100%',
    fontSize: LOGIN_FONT_SIZES.md,
    fontWeight: '600',
    color: LOGIN_COLORS.textMain,
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderWidth: 0,
    ...inputTextBase,
    backgroundColor: 'transparent',
  },
  loginEyeButton: {
    padding: LOGIN_SPACING.sm,
    marginLeft: LOGIN_SPACING.xs,
  },
  loginForgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: LOGIN_SPACING.md,
  },
  loginForgotPasswordText: {
    color: LOGIN_COLORS.primary,
    fontSize: LOGIN_FONT_SIZES.sm,
    fontWeight: '700',
  },
  loginActionButton: {
    width: '100%',
    height: 52,
    borderRadius: LOGIN_RADIUS.lg,
  },
  loginActionButtonOutline: {
    backgroundColor: LOGIN_COLORS.inputMuted,
    borderColor: LOGIN_COLORS.border,
    borderWidth: 1,
  },
  loginSpacerMd: { height: LOGIN_SPACING.md },
  loginSpacerXl: { height: LOGIN_SPACING.xl },
  loginFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: LOGIN_SPACING.xl,
    paddingTop: LOGIN_SPACING.xl,
  },
  loginFooterText: {
    color: LOGIN_COLORS.textSub,
    fontSize: LOGIN_FONT_SIZES.sm,
    fontWeight: '500',
  },
  loginLinkText: {
    color: LOGIN_COLORS.textMain,
    fontWeight: '700',
    fontSize: LOGIN_FONT_SIZES.sm,
    marginLeft: 4,
  },
  loginErrorText: {
    color: LOGIN_COLORS.danger,
    fontSize: LOGIN_FONT_SIZES.sm,
    marginTop: LOGIN_SPACING.sm,
  },
  loginPickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: LOGIN_SPACING.lg,
  },
  loginPickerCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: LOGIN_COLORS.background,
    borderRadius: LOGIN_RADIUS.xl,
    padding: LOGIN_SPACING.lg,
    borderWidth: 1,
    borderColor: LOGIN_COLORS.border,
    ...commonShadow,
  },
  loginPickerTitle: {
    fontSize: LOGIN_FONT_SIZES.lg,
    fontWeight: '700',
    color: LOGIN_COLORS.textMain,
    marginBottom: LOGIN_SPACING.md,
  },
  loginPickerList: {
    maxHeight: 360,
  },
  loginPickerListContent: {
    gap: LOGIN_SPACING.sm,
    paddingBottom: LOGIN_SPACING.sm,
  },
  loginPickerPressable: {
    borderRadius: LOGIN_RADIUS.md,
  },
  loginPickerPressablePressed: {
    opacity: 0.9,
  },
  loginPickerItemCard: {
    width: '100%',
    borderRadius: LOGIN_RADIUS.md,
    borderWidth: 1,
    borderColor: LOGIN_COLORS.border,
    backgroundColor: LOGIN_COLORS.inputMuted,
  },
  loginPickerName: {
    fontSize: LOGIN_FONT_SIZES.md,
    fontWeight: '700',
    color: LOGIN_COLORS.textMain,
  },
  loginPickerEmail: {
    fontSize: LOGIN_FONT_SIZES.sm,
    color: LOGIN_COLORS.textSub,
    marginTop: 4,
  },
  loginPickerRole: {
    fontSize: LOGIN_FONT_SIZES.sm,
    color: LOGIN_COLORS.textSub,
    marginTop: 2,
  },
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

  // Card
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

  // Button
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

  // Switch
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

  // Segment
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

  // Fields
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

  // Select
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
    position: (isWeb ? 'fixed' : 'absolute') as any,
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

  // DateNavigator
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

  // Timeline
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

  // Settings header
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

  // Dock
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

  // Side menu
  menuShadow: {
    ...commonShadow,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  menuPanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 320,
    maxWidth: '92%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    ...commonShadow,
  },
  menuPanelGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  menuPanelGlowTop: {
    position: 'absolute',
    top: -80,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    opacity: 0.9,
  },
  menuPanelGlowBottom: {
    position: 'absolute',
    bottom: -100,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.85,
  },
  menuPanelEdgeFade: {
    position: 'absolute',
    right: -12,
    top: 0,
    bottom: 0,
    width: 32,
    opacity: 0.9,
  },
  menuPanelContent: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  menuSurface: {
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    ...menuCardShadow,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  menuCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  menuUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xl,
    gap: spacing.sm,
    minHeight: 56,
  },
  menuAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  menuUserCardPressable: {
    flex: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  menuAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,122,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  menuAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  menuUserName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 2,
  },
  menuUserRole: {
    fontSize: 12,
    color: COLORS.textSub,
    fontWeight: '500',
  },
  menuAccountMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  menuAccountTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,122,255,0.08)',
  },
  menuAccountTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  menuAccountRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.md,
    backgroundColor: 'rgba(0,122,255,0.12)',
  },
  menuAccountRoleText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  menuScroll: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xs,
    gap: spacing.md,
  },
  menuScrollView: {
    flex: 1,
  },
  menuSection: {
    marginBottom: 0,
  },
  menuSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  menuSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSub,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  menuOrgCard: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    gap: spacing.xs,
    overflow: 'hidden',
  },
  menuCardBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  menuOrgText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  menuAccordionCard: {
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    gap: spacing.xs,
  },
  menuAccordionSurface: {
    overflow: 'hidden',
  },
  menuAccordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  menuAccordionHeaderPressed: {
    opacity: 0.85,
  },
  menuAccordionIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0,122,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  menuAccordionIconWrapperSuccess: {
    backgroundColor: 'rgba(52,199,89,0.12)',
  },
  menuAccordionIconWrapperNeutral: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  menuAccordionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSub,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  menuAccordionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  menuAccordionContentWrapper: {
    overflow: 'hidden',
  },
  menuAccordionContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  menuListRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  menuListRowActive: {
    backgroundColor: 'rgba(0,122,255,0.08)',
    borderColor: 'rgba(0,122,255,0.35)',
  },
  menuListLabel: {
    fontSize: 14,
    color: COLORS.textSub,
    fontWeight: '500',
  },
  menuListLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginVertical: spacing.xs,
    marginHorizontal: -spacing.lg,
  },
  menuQuickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderRadius: radius.lg,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
  },
  menuQuickActionPressable: {
    borderRadius: radius.lg,
  },
  menuQuickActionPressablePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  menuQuickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuQuickActionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 2,
  },
  menuQuickActionSub: {
    fontSize: 12,
    color: COLORS.textSub,
  },
  menuSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.58)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  menuSubItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  menuSubItemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  menuLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255,59,48,0.06)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.15)',
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  menuLogoutLabel: {
    fontSize: 14,
    color: COLORS.danger,
    fontWeight: '700',
  },
  menuVersionText: {
    fontSize: 11,
    color: COLORS.textSub,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  // Sheet
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

  // Punch
  punchLocationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginTop: spacing.xs,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.textSub,
    marginRight: spacing.sm,
  },
  punchLocationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  punchTimeBlock: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  punchTimeText: {
    fontSize: 72,
    fontWeight: '200',
    letterSpacing: -2,
    color: COLORS.textMain,
  },
  punchDateText: {
    marginTop: spacing.sm,
    fontSize: 16,
    color: COLORS.textSub,
  },
  punchTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  punchTypeItem: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  punchTypeItemActive: {
    backgroundColor: '#fff',
    ...commonShadow,
  },
  punchTypeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  punchTypeLabel: {
    fontSize: 12,
    color: COLORS.textSub,
  },
  punchTypeLabelActive: {
    color: COLORS.textMain,
    fontWeight: '600',
  },
  punchMainButtonWrapper: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  punchMainButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    ...commonShadow,
  },
  punchMainButtonPressed: {
    opacity: 0.98,
  },
  punchMainCaption: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  punchMainLabel: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  punchSummaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  punchSummaryCard: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 12,
    color: COLORS.textSub,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryStatusText: {
    fontSize: 15,
    fontWeight: '700',
  },

  // History daily
  dailyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyHeaderDate: {
    fontSize: 15,
    fontWeight: '700',
  },
  dailyHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dailyHeaderTotal: {
    fontSize: 15,
    fontWeight: '600',
  },

  // History week
  weekChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 200,
    marginTop: spacing.md,
  },
  weekChartBarWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  weekChartBar: {
    width: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  weekChartDay: {
    fontSize: 11,
    color: COLORS.textSub,
    marginTop: spacing.xs,
    fontWeight: '700',
  },
  weekChartDate: {
    fontSize: 10,
    color: COLORS.textSub,
  },
  weekTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  weekTotalLabel: {
    fontSize: 13,
    color: COLORS.textSub,
  },
  weekTotalValue: {
    fontSize: 18,
    fontWeight: '700',
  },

  // History month
  monthHeaderRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  monthHeaderCellLeft: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSub,
  },
  monthHeaderCellCenter: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.textSub,
  },
  monthHeaderCellRight: {
    flex: 1,
    fontSize: 12,
    textAlign: 'right',
    color: COLORS.textSub,
  },
  monthRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  monthCellLeft: {
    flex: 1,
    fontSize: 14,
  },
  monthDay: {
    fontSize: 11,
    color: COLORS.textSub,
  },
  monthCellCenter: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  monthCellRight: {
    flex: 1,
    fontSize: 13,
    textAlign: 'right',
    color: COLORS.textSub,
  },
  monthFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  monthFooterLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  monthFooterValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Sections
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSub,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSub,
    marginBottom: spacing.xs,
  },

  // Report
  customRangeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  rangeInput: {
    ...inputShell,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 14,
    ...inputTextBase,
  },
  rangeSeparator: {
    fontSize: 16,
    color: COLORS.textSub,
    paddingHorizontal: spacing.xs,
  },
  exportRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  // Settings
  profileCardWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 0,
    minWidth: 0,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    alignSelf: 'stretch',
    width: '100%',
    minHeight: 96,
  },
  profileCardSurface: {
    width: '92%',
    maxWidth: 560,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.9)',
    ...commonShadow,
  },
  profileCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,122,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.textSub,
  },
  profileMeta: {
    fontSize: 12,
    color: COLORS.textSub,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsRowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: spacing.sm,
    marginHorizontal: spacing.sm,
  },
  settingsSubLabel: {
    fontSize: 12,
    color: COLORS.textSub,
    marginTop: spacing.xs / 2,
  },
  settingsIconBoxWarning: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingsIconBoxSuccess: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 15,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textSub,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  profileRoleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.md,
    backgroundColor: 'rgba(0,122,255,0.12)',
  },
  profileRoleChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  settingsCardShadow: {
    ...commonShadow,
  },

  // Profile edit
  profileEditAvatarWrapper: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profileEditAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileEditAvatarText: {
    fontSize: 40,
    color: '#C7C7CC',
  },
  profileEditBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  infoRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoRowHeaderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  infoRowLabel: {
    fontSize: 14,
    color: COLORS.textSub,
  },
  infoRowValue: {
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  infoRoleChip: {
    fontSize: 12,
    color: COLORS.primary,
    backgroundColor: 'rgba(0,122,255,0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.sm,
  },

  // Admin dashboard
  adminHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  liveChipText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
  },
  adminScreen: {
    gap: spacing.lg,
    minHeight: 0,
  },
  adminContent: {
    height: '100%',
    width: '100%',
  },
  adminTopBlock: {
    gap: spacing.md,
    flexShrink: 0,
  },
  adminStatsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  adminStatCard: {
    flex: 1,
  },
  adminStatLabel: {
    fontSize: 12,
    color: COLORS.textSub,
  },
  adminStatValue: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  adminStatSuffix: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: spacing.xs / 2,
  },
  roleAssignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  roleAssignTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  roleAssignScope: {
    fontSize: 12,
    color: COLORS.textSub,
  },
  roleAssignNote: {
    fontSize: 12,
    color: COLORS.textSub,
    marginBottom: spacing.sm,
  },
  roleAssignList: {
    gap: spacing.sm,
  },
  roleAssignRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  roleAssignName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  roleAssignEmail: {
    fontSize: 12,
    color: COLORS.textSub,
    marginBottom: 2,
  },
  roleAssignMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  roleAssignMetaText: {
    fontSize: 12,
    color: COLORS.textSub,
  },
  roleManageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  roleManageControlsRow: {
    gap: spacing.sm,
  },
  roleSummaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  roleSummaryCard: {
    flexBasis: '48%',
    minWidth: 160,
  },
  adminCardShadow: {
    ...adminCardShadow,
  },
  roleSummaryLabel: {
    fontSize: 12,
    color: COLORS.textSub,
    marginBottom: spacing.xs,
  },
  roleSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  sectionCard: {
    marginBottom: spacing.xl,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  sectionCardBody: {
    gap: spacing.sm,
  },
  roleManageCard: {
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    outlineStyle: 'none',
    outlineWidth: 0,
  },
  roleManageCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  roleManageIdent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  roleManageName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  roleManageEmail: {
    fontSize: 12,
    color: COLORS.textSub,
  },
  roleManageMetaRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  roleManageMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  roleManageMetaText: {
    fontSize: 12,
    color: COLORS.textSub,
  },
  roleManageFieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  roleManageField: {
    flex: 1,
    minWidth: 180,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  addMemberCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  selfBadge: {
    backgroundColor: 'rgba(0,122,255,0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.pill,
  },
  selfBadgeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
  },
  selfHighlightCard: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0EAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#555',
  },
  memberName: {
    fontSize: 15,
    fontWeight: '700',
  },
  memberSub: {
    fontSize: 12,
    color: COLORS.textSub,
  },
  memberRight: {
    alignItems: 'flex-end',
  },
  memberTime: {
    fontSize: 18,
    fontWeight: '600',
  },
  memberLocationChip: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  memberLocationText: {
    fontSize: 11,
    color: COLORS.textSub,
  },
  memberSummarySub: {
    fontSize: 11,
    color: COLORS.textSub,
    marginTop: spacing.xs,
  },
  adminListContainer: {
    flex: 1,
    minHeight: 0,
    overflow: 'visible',
    maxHeight: '100%',
    height: '100%',
  },
  adminListScroll: {
    flex: 1,
    height: '100%',
  },
  adminListContent: {
    gap: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  containerFull: {
    height: '100vh',
    overflow: 'hidden',
  },

  // Settings common
  simpleInput: {
    ...inputShell,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 14,
    ...inputTextBase,
  },
  settingRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  settingRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  settingRowTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingRowTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  editIconBox: {
    marginLeft: spacing.xs,
    borderRadius: 12,
    padding: spacing.xs,
    backgroundColor: '#F2F2F7',
  },
  requiredChip: {
    fontSize: 11,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.pill,
    backgroundColor: '#F2F2F7',
    color: COLORS.textSub,
    fontWeight: '600',
  },
  settingRowDesc: {
    flexDirection: 'row',
    gap: spacing.md,
    marginLeft: 32,
  },
  settingRowDescText: {
    fontSize: 13,
    color: COLORS.textSub,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  addRowLabel: {
    marginLeft: spacing.sm,
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '500',
  },
  editRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  editActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  geoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  geoMapMock: {
    height: 160,
    borderRadius: radius.lg,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  geoMapCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(0,122,255,0.12)',
  },
  geoRadiusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  geoRadiusValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  geoControlRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  geoDisabledText: {
    fontSize: 13,
    color: COLORS.textSub,
    textAlign: 'center',
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

  subgroupSectionLabel: {
    fontSize: 12,
    color: COLORS.textSub,
    marginBottom: spacing.xs,
  },
  subgroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subgroupName: {
    fontSize: 15,
    fontWeight: '600',
  },
  subgroupRadius: {
    fontSize: 12,
    color: COLORS.textSub,
  },

  saveBottomRow: {
    marginTop: spacing.lg,
    paddingBottom: spacing.lg,
  },

  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(88,86,214,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
  },
  groupCode: {
    fontSize: 12,
    color: COLORS.textSub,
  },
});
