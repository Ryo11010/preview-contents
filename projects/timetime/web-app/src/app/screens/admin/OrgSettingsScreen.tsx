import React from 'react';
import { View } from 'react-native';
import { AppButton, SettingsHeader } from '../../components/ui';
import { APP_CONFIG } from '../../designTokens';
import { styles } from '../../../lib/styles';
import type { User } from '../../types';
import { RoleAssignmentPanel } from './RoleAssignmentPanel';
import { CommonSettingsForm, GeofenceSection, PunchSettingsSection } from './SettingsSections';

type AdminOrgSettingsScreenProps = {
  assignments: User[];
  currentUser: User;
  onRoleChange: (id: string, role: string) => void;
  onMemberUpdate: (id: string, patch: Partial<User>) => void;
  onAddMember: (payload: {
    name: string;
    email: string;
    role: string;
    currentGroup: string;
    currentSubgroup: string;
  }) => void;
};

export const AdminOrgSettingsScreen: React.FC<AdminOrgSettingsScreenProps> = ({
  assignments,
  currentUser,
  onRoleChange,
  onMemberUpdate,
  onAddMember,
}) => {
  return (
    <View style={styles.screenContainer}>
      <SettingsHeader title="組織基本設定" />
      <RoleAssignmentPanel
        assignments={assignments}
        currentUser={currentUser}
        onRoleChange={onRoleChange}
        onMemberUpdate={onMemberUpdate}
        onAddMember={onAddMember}
      />
      <CommonSettingsForm title={APP_CONFIG.companyName} />
      <PunchSettingsSection />
      <GeofenceSection />
      <View style={styles.saveBottomRow}>
        <AppButton style={{ width: '100%', height: 48 }}>変更を保存</AppButton>
      </View>
    </View>
  );
};
