import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { CardSurface } from '../components/ui';
import { MOTION, spacing, COLORS } from '../designTokens';
import {
  DEFAULT_SELECTION_BY_STATUS,
  PUNCH_PROCESSING_DELAY_MS,
  PUNCH_STATUS_TRANSITIONS,
  PUNCH_TYPE_META,
  PUNCH_TYPE_ORDER,
  getPunchColor,
  getPunchLabel,
} from '../punchMeta';
import { useNow } from '../hooks/useNow';
import type { PunchStatus, PunchTypeId, User } from '../types';
import { styles } from '../styles';

type PunchScreenProps = { user: User };

export const PunchScreen: React.FC<PunchScreenProps> = ({ user }) => {
  const [status, setStatus] = useState<PunchStatus>('working');
  const [selection, setSelection] = useState<PunchTypeId>(
    DEFAULT_SELECTION_BY_STATUS.working,
  );
  const [processing, setProcessing] = useState(false);
  const now = useNow();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const punchScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    setSelection(DEFAULT_SELECTION_BY_STATUS[status]);
  }, [status]);

  const bounceTo = (
    value: number,
    config: { friction: number; tension: number },
  ) => {
    Animated.spring(punchScale, {
      toValue: value,
      useNativeDriver: true,
      friction: config.friction,
      tension: config.tension,
    }).start();
  };

  const handlePunch = () => {
    if (!selection) {
      setSelection(DEFAULT_SELECTION_BY_STATUS[status]);
      return;
    }
    setProcessing(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setProcessing(false);
      const nextStatus = PUNCH_STATUS_TRANSITIONS[selection] ?? status;
      setStatus(nextStatus);
      setSelection(DEFAULT_SELECTION_BY_STATUS[nextStatus]);
    }, PUNCH_PROCESSING_DELAY_MS);
  };

  const color = getPunchColor(selection);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.punchLocationChip}>
        <View
          style={[
            styles.statusDot,
            status === 'working' && { backgroundColor: COLORS.success },
            status === 'break' && { backgroundColor: COLORS.warning },
            status === 'finished' && { backgroundColor: COLORS.textSub },
          ]}
        />
        <Text style={styles.punchLocationText}>{user.currentSubgroup}</Text>
      </View>

      <View style={styles.punchTimeBlock}>
        <Text style={styles.punchTimeText}>
          {now.toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <Text style={styles.punchDateText}>
          {now.toLocaleDateString('ja-JP', {
            month: 'long',
            day: 'numeric',
            weekday: 'short',
          })}
        </Text>
      </View>

      <View style={styles.punchTypeGrid}>
        {PUNCH_TYPE_ORDER.map((id) => {
          const meta = PUNCH_TYPE_META[id];
          const active = selection === id;
          const Icon = meta.icon;
          return (
            <Pressable
              key={id}
              onPress={() => setSelection(id)}
              style={[
                styles.punchTypeItem,
                active && styles.punchTypeItemActive,
              ]}
            >
              <View
                style={[
                  styles.punchTypeIconCircle,
                  active && { backgroundColor: meta.color },
                ]}
              >
                <Icon size={18} color={active ? '#fff' : meta.color} />
              </View>
              <Text
                style={[
                  styles.punchTypeLabel,
                  active && styles.punchTypeLabelActive,
                ]}
              >
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Animated.View
        style={[
          styles.punchMainButtonWrapper,
          { transform: [{ scale: punchScale }] },
        ]}
      >
        <Pressable
          onPress={handlePunch}
          onPressIn={() => bounceTo(MOTION.punchPressScale, MOTION.punchSpring)}
          onPressOut={() => bounceTo(1, MOTION.punchRelease)}
          style={({ pressed }) => [
            styles.punchMainButton,
            { backgroundColor: color },
            (pressed || processing) && styles.punchMainButtonPressed,
          ]}
        >
          <Text style={styles.punchMainCaption}>TAP TO</Text>
          <Text style={styles.punchMainLabel}>
            {processing ? '...' : getPunchLabel(selection)}
          </Text>
        </Pressable>
      </Animated.View>

      <View style={styles.punchSummaryRow}>
        <CardSurface padding={spacing.md} style={styles.punchSummaryCard}>
          <Text style={styles.summaryTitle}>今日の合計</Text>
          <Text style={styles.summaryValue}>1.0h</Text>
        </CardSurface>
        <CardSurface padding={spacing.md} style={styles.punchSummaryCard}>
          <Text style={styles.summaryTitle}>現在の状態</Text>
          <Text
            style={[
              styles.summaryStatusText,
              status === 'working' && { color: COLORS.primary },
              status === 'break' && { color: COLORS.warning },
              status === 'finished' && { color: COLORS.textSub },
            ]}
          >
            {status === 'working'
              ? '勤務中'
              : status === 'break'
              ? '休憩中'
            : '退勤済'}
          </Text>
        </CardSurface>
      </View>
    </View>
  );
};
