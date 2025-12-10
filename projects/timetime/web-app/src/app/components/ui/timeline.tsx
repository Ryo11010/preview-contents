import React from 'react';
import { Text, View } from 'react-native';
import { PUNCH_TYPE_META } from '../../punchMeta';
import type { HistoryEvent } from '../../types';
import { styles } from '../../styles';

type TimelineItemProps = { event: HistoryEvent; isLast: boolean };

export const TimelineItem: React.FC<TimelineItemProps> = ({ event, isLast }) => {
  const meta = PUNCH_TYPE_META[event.punchType];
  const Icon = meta.icon;
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineIconColumn}>
        <View style={[styles.timelineDot, { backgroundColor: meta.color }]}>
          <Icon size={14} color="#fff" />
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>
      <View style={styles.timelineContent}>
        <Text style={[styles.timelineTitle, { color: meta.color }]}>
          {meta.label}
          {event.valid && <Text> ✓</Text>}
        </Text>
        <Text style={styles.timelineSub}>
          {event.punchType.includes('break') ? 'Break Time' : 'Work Time'}
        </Text>
      </View>
      <View style={styles.timelineTimeColumn}>
        <Text style={styles.timelineTime}>{event.time}</Text>
      </View>
    </View>
  );
};

