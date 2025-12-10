import { StyleSheet } from 'react-native';
import { COLORS, spacing } from '../designTokens';
import { inputShell, inputTextBase } from './shared';

export const historyStyles = StyleSheet.create({
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
});

