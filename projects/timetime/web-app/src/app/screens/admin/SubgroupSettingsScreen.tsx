import React from 'react';
import { Text, View } from 'react-native';
import { ChevronRight, MapPin, Plus } from 'lucide-react-native';
import { AppButton, CardSurface, SearchBar, SectionCard, SettingsHeader } from '../../components/ui';
import { COLORS, spacing } from '../../designTokens';
import { MOCK_SUBGROUPS } from '../../../../data/mockData';
import type { TabKey } from '../../types';
import { styles } from '../../../lib/styles';

type AdminSubgroupSettingsScreenProps = {
  onNavigate: (t: TabKey) => void;
};

export const AdminSubgroupSettingsScreen: React.FC<
  AdminSubgroupSettingsScreenProps
> = ({ onNavigate }) => {
  return (
    <View style={styles.screenContainer}>
      <SettingsHeader
        title="小グループ設定"
        action={
          <AppButton size="sm" icon={Plus}>
            新規
          </AppButton>
        }
      />
      <SectionCard variant="admin">
        <SearchBar placeholder="現場名で検索" value="" onChange={() => {}} />
        <View style={{ paddingTop: spacing.md, gap: spacing.lg }}>
          {Object.entries(MOCK_SUBGROUPS).map(([groupName, subs]) => (
            <View key={groupName} style={{ gap: spacing.sm }}>
              <Text style={styles.subgroupSectionLabel}>{groupName}</Text>
              <View style={{ gap: spacing.sm }}>
                {subs.map((s) => (
                  <CardSurface
                    variant="admin"
                    key={s.id}
                    padding={spacing.md}
                    onPress={() => onNavigate('admin_subgroup_edit')}
                  >
                    <View style={styles.subgroupRow}>
                      <MapPin
                        size={22}
                        color={COLORS.success}
                        style={{ marginRight: spacing.md }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.subgroupName}>{s.name}</Text>
                        <Text style={styles.subgroupRadius}>半径 {s.radius}m</Text>
                      </View>
                      <ChevronRight size={20} color={COLORS.textSub} />
                    </View>
                  </CardSurface>
                ))}
              </View>
            </View>
          ))}
        </View>
      </SectionCard>
    </View>
  );
};
