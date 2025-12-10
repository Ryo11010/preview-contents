import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { CardSurface, DateNavigator, SegmentControl, StatCard } from '../../components/ui';
import { COLORS, VIEW_MODE_OPTIONS, layout, spacing } from '../../designTokens';
import { formatDate, shiftDateByViewMode } from '../../dateUtils';
import type { User, ViewMode } from '../../types';
import { styles } from '../../styles';

type AdminDashboardScreenProps = {
  onMemberClick: (id: string) => void;
  currentUser: User;
  assignments: User[];
};

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  onMemberClick,
  currentUser,
  assignments,
}) => {
  const [mode, setMode] = useState<ViewMode>('日');
  const [date, setDate] = useState(new Date());

  const statsByMode = {
    日: { count: 42, hours: 328, countLabel: '稼働人数', hoursLabel: '総労働時間' },
    週: { count: 45, hours: 1850, countLabel: '週間稼働', hoursLabel: '週間総労働' },
    月: { count: 48, hours: 7420, countLabel: '月間稼働', hoursLabel: '月間総労働' },
  } as const;

  const stats = statsByMode[mode];

  const shift = (dir: number) => {
    setDate((prev) => shiftDateByViewMode(prev, mode, dir));
  };

  const listBottomOffset = Math.max(layout.dockHeight - spacing.sm, spacing.sm);

  return (
    <View style={[styles.screenContainer, styles.adminScreenContainer, styles.adminScreen]}>
      <View style={styles.adminTopBlock}>
        <View style={styles.adminHeaderRow}>
          <Text style={styles.screenTitle}>管理ダッシュボード</Text>
          <View style={styles.liveChip}>
            <Text style={styles.liveChipText}>LIVE</Text>
          </View>
        </View>

        <View style={{ marginBottom: spacing.md }}>
          <SegmentControl
            options={VIEW_MODE_OPTIONS}
            selected={mode}
            onSelect={(v) => setMode(v as ViewMode)}
          />
        </View>

        <DateNavigator
          label={formatDate(date, mode)}
          onPrev={() => shift(-1)}
          onNext={() => shift(1)}
        />

        <View style={styles.adminStatsRow}>
          <StatCard
            label={stats.countLabel}
            value={stats.count}
            suffix="名"
            style={styles.adminStatCard}
          />
          <StatCard
            label={stats.hoursLabel}
            value={stats.hours}
            suffix="h"
            style={styles.adminStatCard}
          />
        </View>
      </View>

      <View style={styles.adminListContainer}>
        <Text style={styles.sectionSubtitle}>
          {mode === '日' ? '出勤状況リスト' : 'メンバー別集計'}
        </Text>

        <FlatList
          data={assignments}
          keyExtractor={(member) => member.id}
          renderItem={({ item, index }) => {
            const isSelf = item.id === currentUser.id;
            const isLast = index === assignments.length - 1;
            return (
              <CardSurface
                variant="admin"
                padding={spacing.md}
                onPress={() => onMemberClick(item.id)}
                style={[
                  isSelf ? styles.selfHighlightCard : undefined,
                  !isLast ? { marginBottom: spacing.sm } : null,
                ]}
              >
                <View style={styles.memberRow}>
                  <View style={styles.memberLeft}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberAvatarText}>
                        {item.name.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                        <Text style={styles.memberName}>{item.name}</Text>
                        {isSelf && (
                          <View style={styles.selfBadge}>
                            <Text style={styles.selfBadgeText}>あなた</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.memberSub}>
                        {item.location ?? item.currentSubgroup}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.memberRight}>
                    {mode === '日' ? (
                      <>
                        <Text style={styles.memberTime}>
                          {item.dailyTime ?? '--:--'}
                        </Text>
                        <View style={styles.memberLocationChip}>
                          <MapPin
                            size={10}
                            color={COLORS.textSub}
                            style={{ marginRight: 4 }}
                          />
                          <Text style={styles.memberLocationText}>
                            {item.location ?? item.currentGroup}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text style={styles.memberTime}>
                          {mode === '週'
                            ? item.weeklyHours ?? '-'
                            : item.monthlyHours ?? '-'}
                        </Text>
                        <Text style={styles.memberSummarySub}>
                          {mode === '週'
                            ? item.weeklyDays ?? ''
                            : item.monthlyDays ?? ''}
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </CardSurface>
            );
          }}
          style={styles.adminListScroll}
          contentContainerStyle={[
            styles.adminListContent,
            { paddingBottom: listBottomOffset },
          ]}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          ListFooterComponent={<View style={{ height: listBottomOffset }} />}
          scrollEventThrottle={16}
        />
      </View>
    </View>
  );
};
