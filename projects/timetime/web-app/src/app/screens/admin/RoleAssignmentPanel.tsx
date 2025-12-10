import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { TextInputProps } from 'react-native';
import {
  Building2,
  MapPin,
  Plus,
  X,
} from 'lucide-react-native';
import {
  AppButton,
  RoleChip,
  SearchBar,
  SegmentControl,
  SelectField,
  TextField,
  CardSurface,
} from '../../components/ui';
import type { SelectOption } from '../../components/ui';
import {
  COLORS,
  ROLE_LABELS,
  spacing,
} from '../../designTokens';
import {
  getDefaultSubgroupName,
  getSubgroupsForGroup,
  MOCK_GROUPS,
} from '../../../../data/mockData';
import type { User } from '../../types';
import { isGroupLevelRole, isOrgLevelRole } from '../../roles';
import { styles } from '../../styles';
import { useTextFieldFocus } from '../../hooks/useTextFieldFocus';

type RoleAssignmentPanelProps = {
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

type RoleMemberCardProps = {
  member: User;
  isSelf: boolean;
  roleOptions: SelectOption[];
  groupOptions: SelectOption[];
  onRoleChange: (role: string) => void;
  onGroupChange: (group: string) => void;
  onSubgroupChange: (subgroup: string) => void;
};

const SimpleFocusedInput: React.FC<TextInputProps> = ({
  style,
  onFocus,
  onBlur,
  placeholderTextColor,
  ...rest
}) => {
  const { focused, baseInputProps } = useTextFieldFocus({ onFocus, onBlur });

  return (
    <TextInput
      {...baseInputProps}
      {...rest}
      style={[styles.simpleInput, focused && styles.inputFocusFrame, style]}
      placeholderTextColor={placeholderTextColor ?? COLORS.textSub}
    />
  );
};

const RoleMemberCard: React.FC<RoleMemberCardProps> = ({
  member,
  isSelf,
  roleOptions,
  groupOptions,
  onRoleChange,
  onGroupChange,
  onSubgroupChange,
}) => {
  const subOptions = getSubgroupsForGroup(member.currentGroup).map((s) => ({
    value: s.name,
    label: s.name,
  }));

  return (
    <CardSurface
      variant="admin"
      padding={spacing.md}
      transparent
      style={[
        styles.roleManageCard,
        isSelf && styles.selfHighlightCard,
      ]}
    >
      <View style={styles.roleManageCardHeader}>
        <View style={styles.roleManageIdent}>
          <Text style={styles.roleManageName}>{member.name}</Text>
          {isSelf && (
            <View style={styles.selfBadge}>
              <Text style={styles.selfBadgeText}>あなた</Text>
            </View>
          )}
        </View>
        <RoleChip role={member.role} />
      </View>

      <Text style={styles.roleManageEmail}>{member.email}</Text>

      <View style={styles.roleManageMetaRow}>
        <View style={styles.roleManageMetaItem}>
          <Building2 size={14} color={COLORS.textSub} />
          <Text style={styles.roleManageMetaText}>{member.currentGroup}</Text>
        </View>
        <View style={styles.roleManageMetaItem}>
          <MapPin size={14} color={COLORS.textSub} />
          <Text style={styles.roleManageMetaText}>{member.currentSubgroup}</Text>
        </View>
      </View>

      <View style={styles.roleManageFieldGrid}>
        <SelectField
          label="権限ロール"
          value={member.role}
          onChange={onRoleChange}
          options={roleOptions}
          style={styles.roleManageField}
        />
        <SelectField
          label="所属グループ"
          value={member.currentGroup}
          onChange={(v) => {
            const nextSub = getDefaultSubgroupName(v, member.currentSubgroup);
            onGroupChange(v);
            onSubgroupChange(nextSub);
          }}
          options={groupOptions}
          style={styles.roleManageField}
        />
        <SelectField
          label="小グループ"
          value={member.currentSubgroup}
          onChange={onSubgroupChange}
          options={subOptions}
          style={styles.roleManageField}
        />
      </View>
    </CardSurface>
  );
};

export const RoleAssignmentPanel: React.FC<RoleAssignmentPanelProps> = ({
  assignments,
  currentUser,
  onRoleChange,
  onMemberUpdate,
  onAddMember,
}) => {
  const [scope, setScope] = useState<'all' | 'group' | 'subgroup'>(
    isOrgLevelRole(currentUser.role)
      ? 'all'
      : isGroupLevelRole(currentUser.role)
        ? 'group'
        : 'subgroup',
  );
  const [query, setQuery] = useState('');
  const [addVisible, setAddVisible] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: ROLE_LABELS.user,
    currentGroup: currentUser.currentGroup,
    currentSubgroup: currentUser.currentSubgroup,
  });

  const roleOptions = Array.from(
    new Set([
      ROLE_LABELS.superAdmin,
      ROLE_LABELS.orgAdmin,
      ROLE_LABELS.groupAdmin,
      ROLE_LABELS.subAdmin,
      ROLE_LABELS.user,
    ]),
  ).map((r) => ({ value: r, label: r }));

  const groupOptions: SelectOption[] = MOCK_GROUPS.map((g) => ({
    value: g.name,
    label: g.name,
  }));

  const scopeOptions: { value: 'all' | 'group' | 'subgroup'; label: string }[] = [
    { value: 'all', label: '全社' },
    { value: 'group', label: `${currentUser.currentGroup}` },
    { value: 'subgroup', label: `${currentUser.currentSubgroup}` },
  ];

  const scopedAssignments = assignments.filter((u) => {
    if (scope === 'all') return true;
    if (scope === 'group') return u.currentGroup === currentUser.currentGroup;
    return (
      u.currentGroup === currentUser.currentGroup &&
      u.currentSubgroup === currentUser.currentSubgroup
    );
  });

  const filtered = scopedAssignments.filter((u) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.currentGroup.toLowerCase().includes(q) ||
      u.currentSubgroup.toLowerCase().includes(q)
    );
  });

  const summary = filtered.reduce(
    (acc, cur) => {
      const key = cur.role as keyof typeof acc;
      if (acc[key] != null) acc[key] += 1;
      return acc;
    },
    {
      [ROLE_LABELS.superAdmin]: 0,
      [ROLE_LABELS.orgAdmin]: 0,
      [ROLE_LABELS.groupAdmin]: 0,
      [ROLE_LABELS.subAdmin]: 0,
      [ROLE_LABELS.user]: 0,
    } as Record<string, number>,
  );

  const resetNewMember = () => {
    setNewMember({
      name: '',
      email: '',
      role: ROLE_LABELS.user,
      currentGroup: currentUser.currentGroup,
      currentSubgroup: getDefaultSubgroupName(
        currentUser.currentGroup,
        currentUser.currentSubgroup,
      ),
    });
  };

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) {
      Alert.alert('入力が不足しています', '氏名とメールを入力してください');
      return;
    }
    onAddMember({
      name: newMember.name.trim(),
      email: newMember.email.trim(),
      role: newMember.role,
      currentGroup: newMember.currentGroup,
      currentSubgroup: newMember.currentSubgroup,
    });
    setAddVisible(false);
    resetNewMember();
  };

  const currentSubOptions = getSubgroupsForGroup(newMember.currentGroup).map(
    (s) => ({ value: s.name, label: s.name }),
  );

  return (
    <View style={{ marginTop: spacing.lg }}>
      <View style={styles.roleManageHeaderRow}>
        <View>
          <Text style={styles.roleAssignTitle}>権限・メンバー管理</Text>
          <Text style={styles.roleAssignScope}>組織設定から一元管理</Text>
        </View>
        <AppButton size="sm" icon={Plus} onPress={() => {
          resetNewMember();
          setAddVisible(true);
        }}>
          メンバー追加
        </AppButton>
      </View>

      <View style={{ marginTop: spacing.sm }}>
        <View style={styles.roleManageControlsRow}>
          <SegmentControl
            options={scopeOptions.map((o) => ({ value: o.value, label: o.label }))}
            selected={scope}
            onSelect={(v) => setScope(v as 'all' | 'group' | 'subgroup')}
          />
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="氏名・メール・所属で検索"
            style={{ flex: 1 }}
          />
        </View>

        <View style={styles.roleSummaryRow}>
          {Object.keys(summary).map((roleKey) => (
            <View
              key={roleKey}
              style={styles.roleSummaryCard}
            >
              <Text style={styles.roleSummaryLabel}>{roleKey}</Text>
              <Text style={styles.roleSummaryValue}>{summary[roleKey]}名</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
          {filtered.map((u) => {
            const isSelf = u.id === currentUser.id;
            return (
              <RoleMemberCard
                key={u.id}
                member={u}
                isSelf={isSelf}
                roleOptions={roleOptions}
                groupOptions={groupOptions}
                onRoleChange={(role) => onRoleChange(u.id, role)}
                onGroupChange={(group) =>
                  onMemberUpdate(u.id, {
                    currentGroup: group,
                    currentSubgroup: getDefaultSubgroupName(
                      group,
                      u.currentSubgroup,
                    ),
                  })
                }
                onSubgroupChange={(subgroup) =>
                  onMemberUpdate(u.id, { currentSubgroup: subgroup })
                }
              />
            );
          })}
        </View>
      </View>

      <Modal visible={addVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.addMemberCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>メンバーを追加</Text>
              <Pressable onPress={() => setAddVisible(false)}>
                <X size={20} color={COLORS.textSub} />
              </Pressable>
            </View>
            <TextField
              label="氏名"
              value={newMember.name}
              onChange={(v) => setNewMember((prev) => ({ ...prev, name: v }))}
              placeholder="山田 太郎"
            />
            <TextField
              label="メールアドレス"
              value={newMember.email}
              onChange={(v) => setNewMember((prev) => ({ ...prev, email: v }))}
              keyboardType="email-address"
              placeholder="taro@example.com"
            />
            <SelectField
              label="権限ロール"
              value={newMember.role}
              onChange={(v) => setNewMember((prev) => ({ ...prev, role: v }))}
              options={roleOptions}
            />
            <SelectField
              label="所属グループ"
              value={newMember.currentGroup}
              onChange={(v) =>
                setNewMember((prev) => ({
                  ...prev,
                  currentGroup: v,
                  currentSubgroup: getDefaultSubgroupName(v, prev.currentSubgroup),
                }))
              }
              options={groupOptions}
            />
            <SelectField
              label="小グループ"
              value={newMember.currentSubgroup}
              onChange={(v) => setNewMember((prev) => ({ ...prev, currentSubgroup: v }))}
              options={currentSubOptions}
              placeholder="所属先を選択"
            />
            <View style={styles.modalActions}>
              <AppButton
                size="sm"
                variant="ghost"
                onPress={() => {
                  setAddVisible(false);
                  resetNewMember();
                }}
                style={{ flex: 1 }}
              >
                キャンセル
              </AppButton>
              <AppButton size="sm" onPress={handleAddMember} style={{ flex: 1 }}>
                追加する
              </AppButton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
