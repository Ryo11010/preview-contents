import { StyleSheet } from 'react-native';
import { COLORS, radius, spacing } from '../../app/designTokens';
import { commonShadow } from './shared';

export const punchStyles = StyleSheet.create({
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
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  punchTimeText: {
    fontSize: 64,
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
    marginBottom: spacing.md,
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
    marginBottom: spacing.md,
  },
  punchMainButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
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
    fontSize: 30,
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
});

