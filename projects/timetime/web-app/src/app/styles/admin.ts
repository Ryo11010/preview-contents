import { StyleSheet } from 'react-native';
import { COLORS, spacing } from '../designTokens';
import { adminCardShadow, commonShadow, inputShell, inputTextBase, inputFocusFrameStyle } from './shared';
import { radius } from '../designTokens';

export const adminStyles = StyleSheet.create({
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
    flex: 1,
  },
  adminScreenContainer: {
    paddingBottom: 0,
  },
  adminContent: {
    flex: 1,
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
    paddingBottom: 0,
  },
  adminListScroll: {
    flex: 1,
    minHeight: 0,
  },
  adminListContent: {
    gap: 0,
    paddingBottom: 0,
    paddingHorizontal: spacing.md,
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
