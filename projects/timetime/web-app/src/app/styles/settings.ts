import { StyleSheet } from 'react-native';
import { COLORS, radius, spacing } from '../designTokens';
import { commonShadow, inputShell, inputTextBase, inputFocusFrameStyle } from './shared';

export const settingsStyles = StyleSheet.create({
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
});
