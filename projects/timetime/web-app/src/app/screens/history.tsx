import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Building2,
  Clock,
  Download,
  FileText,
  MapPin,
} from 'lucide-react-native';
import { CardSurface, SegmentControl, DateNavigator, TimelineItem, SelectField, AppButton, SettingsHeader } from '../components/ui';
import { useTextFieldFocus } from '../hooks/useTextFieldFocus';
import {
  formatDate,
  formatDateInputValue,
  getShortDate,
  getWeekDate,
  shiftDateByViewMode,
} from '../dateUtils';
import {
  getDefaultSubgroupName,
  getHistoryEvents,
  getMonthlyStats,
  getWeeklyStats,
  MOCK_GROUPS,
  MOCK_SUBGROUPS,
} from '../../../data/mockData';
import {
  APP_CONFIG,
  COLORS,
  REPORT_VIEW_MODES,
  VIEW_MODE_OPTIONS,
  spacing,
} from '../designTokens';
import type { SelectOption } from '../components/ui';
import type { User, ViewMode } from '../types';
import { styles } from '../styles';

type HistoryScreenProps = {
  isModal?: boolean;
};

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ isModal }) => {
  const [mode, setMode] = useState<ViewMode>('日');
  const [date, setDate] = useState(new Date());

  const events = getHistoryEvents(date);
  const weekly = getWeeklyStats(date);
  const monthly = getMonthlyStats(date);

  const handleShift = (dir: number) => {
    setDate((prev) => shiftDateByViewMode(prev, mode, dir));
  };

  const content = (
    <View style={styles.screenContainer}>
      {!isModal && <Text style={styles.screenTitle}>勤務履歴</Text>}

      <View style={{ marginBottom: spacing.md }}>
        <SegmentControl
          options={VIEW_MODE_OPTIONS}
          selected={mode}
          onSelect={(v) => setMode(v as ViewMode)}
        />
      </View>

      <DateNavigator
        label={formatDate(date, mode)}
        onPrev={() => handleShift(-1)}
        onNext={() => handleShift(1)}
      />

      {mode === '日' && (
        <CardSurface padding={spacing.md}>
          <View style={styles.dailyHeaderRow}>
            <Text style={styles.dailyHeaderDate}>{getShortDate(date)}</Text>
            <View style={styles.dailyHeaderRight}>
              <Clock size={14} color={COLORS.textSub} />
              <Text style={styles.dailyHeaderTotal}>合計: 8.25h</Text>
            </View>
          </View>
          <View style={{ marginTop: spacing.md }}>
            {events.map((ev, i) => (
              <TimelineItem
                key={ev.id}
                event={ev}
                isLast={i === events.length - 1}
              />
            ))}
          </View>
        </CardSurface>
      )}

      {mode === '週' && (
        <CardSurface padding={spacing.md}>
          <View style={styles.weekChartRow}>
            {weekly.map((w, idx) => {
              const d = getWeekDate(date, idx);
              const h = (w.hours / 10) * 120;
              return (
                <Pressable
                  key={w.day}
                  onPress={() => {
                    setDate(d);
                    setMode('日');
                  }}
                  style={styles.weekChartBarWrapper}
                >
                  <View
                    style={[
                      styles.weekChartBar,
                      { height: h || 4 },
                      w.hours === 0 && { backgroundColor: '#E5E5EA' },
                    ]}
                  />
                  <Text style={styles.weekChartDay}>{w.day}</Text>
                  <Text style={styles.weekChartDate}>{w.date}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.weekTotalRow}>
            <Text style={styles.weekTotalLabel}>週合計</Text>
            <Text style={styles.weekTotalValue}>41.25h</Text>
          </View>
        </CardSurface>
      )}

      {mode === '月' && (
        <CardSurface padding={0}>
          <View style={styles.monthHeaderRow}>
            <Text style={styles.monthHeaderCellLeft}>日付</Text>
            <Text style={styles.monthHeaderCellCenter}>勤務時間</Text>
            <Text style={styles.monthHeaderCellRight}>状態</Text>
          </View>
          <ScrollView
            style={{ maxHeight: 360 }}
            contentContainerStyle={{ paddingBottom: spacing.sm }}
          >
            {monthly.map((m, index) => (
              <Pressable
                key={m.date}
                onPress={() => {
                  const target = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    index + 1,
                  );
                  setDate(target);
                  setMode('日');
                }}
                style={styles.monthRow}
              >
                <Text style={styles.monthCellLeft}>
                  {m.date}{' '}
                  <Text style={styles.monthDay}>({m.day})</Text>
                </Text>
                <Text
                  style={[
                    styles.monthCellCenter,
                    m.hours === 0 && { color: COLORS.textSub },
                  ]}
                >
                  {m.hours.toFixed(1)}h
                </Text>
                <Text
                  style={[
                    styles.monthCellRight,
                    m.status === '出勤' && { color: COLORS.success },
                  ]}
                >
                  {m.status}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={styles.monthFooterRow}>
            <Text style={styles.monthFooterLabel}>月間合計</Text>
            <Text style={styles.monthFooterValue}>124.5h</Text>
          </View>
        </CardSurface>
      )}
    </View>
  );

  if (isModal) {
    return <View>{content}</View>;
  }
  return content;
};

type ReportScreenProps = {
  user: User;
};

export const ReportScreen: React.FC<ReportScreenProps> = ({ user }) => {
  const [targetGroup, setTargetGroup] = useState<string>(user.currentGroup);
  const [targetSubgroup, setTargetSubgroup] = useState<string>(
    user.currentSubgroup,
  );
  const [mode, setMode] = useState<ViewMode>('日');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDateStr, setStartDateStr] = useState(formatDateInputValue(new Date()));
  const [endDateStr, setEndDateStr] = useState(formatDateInputValue(new Date()));
  const startDateFocus = useTextFieldFocus();
  const endDateFocus = useTextFieldFocus();

  const shift = (dir: number) => {
    setCurrentDate((prev) => shiftDateByViewMode(prev, mode, dir));
  };

  useEffect(() => {
    if (targetGroup === 'all') return;
    setTargetSubgroup((prev) => getDefaultSubgroupName(targetGroup, prev));
  }, [targetGroup]);

  const groupOptions: SelectOption[] = [
    { value: 'all', label: `${APP_CONFIG.companyName} (全組織)` },
    ...MOCK_GROUPS.map((g) => ({ value: g.name, label: g.name })),
  ];

  const subOptions: SelectOption[] =
    targetGroup === 'all'
      ? []
      : [
          {
            value: 'all_group',
            label: `全${targetGroup}グループ`,
          },
          ...(MOCK_SUBGROUPS[targetGroup] ?? []).map((s) => ({
            value: s.name,
            label: s.name,
          })),
        ];

  const handleExport = (fmt: 'CSV' | 'PDF') => {
    const range =
      mode === 'カスタム'
        ? `${startDateStr} - ${endDateStr}`
        : formatDate(currentDate, mode);
    Alert.alert(
      `${fmt} レポートを生成しました`,
      `期間: ${range}\n対象: ${targetGroup} / ${targetSubgroup}`,
    );
  };

  return (
    <View style={styles.screenContainer}>
      <SettingsHeader title="レポート出力" />

      <Text style={styles.sectionSubtitle}>対象者と期間の指定</Text>
      <CardSurface padding={spacing.md} style={{ marginBottom: spacing.lg }}>
        <Text style={styles.fieldSectionTitle}>対象組織 / グループ</Text>
        <SelectField
          icon={Building2}
          value={targetGroup}
          onChange={setTargetGroup}
          options={groupOptions}
          placeholder="組織を選択"
        />
        {targetGroup !== 'all' && (
          <SelectField
            icon={MapPin}
            value={targetSubgroup}
            onChange={setTargetSubgroup}
            options={subOptions}
            placeholder="現場 / 小グループを選択"
          />
        )}

        <Text style={[styles.fieldSectionTitle, { marginTop: spacing.md }]}>
          期間指定
        </Text>
        <SegmentControl
          options={REPORT_VIEW_MODES}
          selected={mode}
          onSelect={(v) => setMode(v as ViewMode)}
        />
        {mode !== 'カスタム' && (
          <DateNavigator
            label={formatDate(currentDate, mode)}
            onPrev={() => shift(-1)}
            onNext={() => shift(1)}
            style={{ marginTop: spacing.md }}
          />
        )}
        {mode === 'カスタム' && (
          <View style={styles.customRangeRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>開始日</Text>
              <TextInput
                {...startDateFocus.baseInputProps}
                value={startDateStr}
                onChangeText={setStartDateStr}
                style={[styles.rangeInput, startDateFocus.focused && styles.inputFocusFrame]}
              />
            </View>
            <Text style={styles.rangeSeparator}>〜</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>終了日</Text>
              <TextInput
                {...endDateFocus.baseInputProps}
                value={endDateStr}
                onChangeText={setEndDateStr}
                style={[styles.rangeInput, endDateFocus.focused && styles.inputFocusFrame]}
              />
            </View>
          </View>
        )}
      </CardSurface>

      <Text style={styles.sectionSubtitle}>出力フォーマット</Text>
      <View style={styles.exportRow}>
        <AppButton
          variant="primary"
          icon={Download}
          onPress={() => handleExport('CSV')}
          style={{ flex: 1, height: 48 }}
        >
          CSVエクスポート
        </AppButton>
        <AppButton
          variant="glass"
          icon={FileText}
          onPress={() => handleExport('PDF')}
          style={{ flex: 1, height: 48 }}
        >
          PDFエクスポート
        </AppButton>
      </View>
    </View>
  );
};
