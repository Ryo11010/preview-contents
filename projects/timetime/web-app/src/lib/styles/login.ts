import { StyleSheet } from 'react-native';
import {
  COLORS,
} from '../../app/designTokens';
import {
  LOGIN_COLORS,
  LOGIN_FONT_SIZES,
  LOGIN_RADIUS,
  LOGIN_SPACING,
} from '../../app/styleConstants';
import { commonShadow, inputShell, inputTextBase } from './shared';

export const loginStyles = StyleSheet.create({
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
  loginInputContainerFocused: {},
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
});

