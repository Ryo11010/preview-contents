import React from 'react';
import { Text, View } from 'react-native';
import { ChevronRight, Layers, Plus } from 'lucide-react-native';
import { AppButton, CardSurface, SectionCard, SettingsHeader } from '../../components/ui';
import { COLORS, spacing } from '../../designTokens';
import { MOCK_GROUPS } from '../../../../data/mockData';
import type { TabKey } from '../../types';
import { styles } from '../../../lib/styles';

type AdminGroupSettingsScreenProps = {
  onNavigate: (t: TabKey) => void;
};

export const AdminGroupSettingsScreen: React.FC<AdminGroupSettingsScreenProps> = ({
  onNavigate,
}) => {
  return (
    <View style={styles.screenContainer}>
      <SettingsHeader
        title="グループ設定"
        action={
          <AppButton size="sm" icon={Plus}>
            新規
          </AppButton>
        }
      />
      <SectionCard title="グループ一覧" variant="admin">
        <View style={{ gap: spacing.sm }}>
          {MOCK_GROUPS.map((g) => (
            <CardSurface
              variant="admin"
              key={g.id}
              padding={spacing.md}
              onPress={() => onNavigate('admin_group_edit')}
            >
              <View style={styles.groupRow}>
                <View style={styles.groupIconBox}>
                  <Layers size={22} color={COLORS.indigo} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.groupName}>{g.name}</Text>
                  <Text style={styles.groupCode}>{g.code}</Text>
                </View>
                <ChevronRight size={20} color={COLORS.textSub} />
              </View>
            </CardSurface>
          ))}
        </View>
      </SectionCard>
    </View>
  );
};
