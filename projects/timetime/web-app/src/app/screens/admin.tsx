import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { TextInputProps } from 'react-native';
import {
  Building2,
  ChevronRight,
  Edit2,
  Layers,
  LogIn,
  LogOut,
  MapPin,
  MinusCircle,
  Map,
  Plus,
  X,
} from 'lucide-react-native';
import { CardSurface, SectionCard, StatCard, SegmentControl, SelectField, TextField, AppButton, AppSwitch, SettingsHeader, RoleChip, DateNavigator, SearchBar } from '../components/ui';
import type { SelectOption } from '../components/ui';
import {
  APP_CONFIG,
  COLORS,
  VIEW_MODE_OPTIONS,
  spacing,
  layout,
  ROLE_LABELS,
} from '../designTokens';
import {
  getDefaultSubgroupName,
  getSubgroupsForGroup,
  INITIAL_PUNCH_ITEMS,
  MOCK_GROUPS,
  MOCK_SUBGROUPS,
} from '../../../data/mockData';
import { formatDate, shiftDateByViewMode } from '../dateUtils';
import type { PunchSettingItem, TabKey, User, ViewMode } from '../types';
import { isAdminRole, isGroupLevelRole, isOrgLevelRole } from '../roles';
import { styles } from '../styles';
import { useTextFieldFocus } from '../hooks/useTextFieldFocus';

type AdminDashboardScreenProps = {
  onMemberClick: (id: string) => void;
  currentUser: User;
  assignments: User[];
};

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

const RoleAssignmentPanel: React.FC<RoleAssignmentPanelProps> = ({
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

      <CardSurface variant="admin" padding={spacing.md} style={{ marginTop: spacing.sm }}>
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
            <CardSurface
              key={roleKey}
              variant="admin"
              padding={spacing.sm}
              style={styles.roleSummaryCard}
            >
              <Text style={styles.roleSummaryLabel}>{roleKey}</Text>
              <Text style={styles.roleSummaryValue}>{summary[roleKey]}名</Text>
            </CardSurface>
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
      </CardSurface>

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

  return (
    <View style={[styles.screenContainer, styles.adminScreen]}>
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

        <ScrollView
          style={styles.adminListScroll}
          contentContainerStyle={[
            styles.adminListContent,
            { paddingBottom: layout.dockHeight + spacing.md },
          ]}
          showsVerticalScrollIndicator
          nestedScrollEnabled
          bounces={false}
          overScrollMode="never"
        >
          {assignments.map((member) => {
            const isSelf = member.id === currentUser.id;
            return (
              <CardSurface
                key={member.id}
                variant="admin"
                padding={spacing.md}
                onPress={() => onMemberClick(member.id)}
                style={[
                  isSelf ? styles.selfHighlightCard : undefined,
                ]}
              >
                <View style={styles.memberRow}>
                  <View style={styles.memberLeft}>
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberAvatarText}>
                      {member.name.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      {isSelf && (
                        <View style={styles.selfBadge}>
                          <Text style={styles.selfBadgeText}>あなた</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.memberSub}>
                      {member.location ?? member.currentSubgroup}
                    </Text>
                  </View>
                </View>
                <View style={styles.memberRight}>
                  {mode === '日' ? (
                    <>
                      <Text style={styles.memberTime}>
                        {member.dailyTime ?? '--:--'}
                      </Text>
                      <View style={styles.memberLocationChip}>
                        <MapPin
                          size={10}
                          color={COLORS.textSub}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={styles.memberLocationText}>
                          {member.location ?? member.currentGroup}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={styles.memberTime}>
                        {mode === '週'
                          ? member.weeklyHours ?? '-'
                          : member.monthlyHours ?? '-'}
                      </Text>
                      <Text style={styles.memberSummarySub}>
                        {mode === '週'
                          ? member.weeklyDays ?? ''
                          : member.monthlyDays ?? ''}
                      </Text>
                    </>
                  )}
                </View>
                </View>
              </CardSurface>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

type CommonSettingsFormProps = {
  title: string;
};

export const CommonSettingsForm: React.FC<CommonSettingsFormProps> = ({ title }) => {
  return (
    <SectionCard title="基本情報" variant="admin">
      <View style={{ marginBottom: spacing.md }}>
        <Text style={styles.fieldLabel}>名称</Text>
        <SimpleFocusedInput defaultValue={title} />
      </View>
      <View>
        <Text style={styles.fieldLabel}>概要説明</Text>
        <SimpleFocusedInput
          placeholder="組織の概要や目的などを入力してください"
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: 'top' }}
        />
      </View>
    </SectionCard>
  );
};

export const PunchSettingsSection: React.FC = () => {
  const [items, setItems] = useState<PunchSettingItem[]>(INITIAL_PUNCH_ITEMS);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<PunchSettingItem>>({});

  const startEdit = (item: PunchSettingItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editingId) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === editingId ? { ...it, ...editForm, id: it.id } : it,
      ),
    );
    setEditingId(null);
  };

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, enabled: !it.enabled } : it,
      ),
    );
  };

  const addItem = () => {
    const id = Date.now();
    const item: PunchSettingItem = {
      id,
      title: '新しい打刻',
      type: 'custom',
      required: false,
      enabled: true,
      labelIn: '開始',
      labelOut: '終了',
    };
    setItems((prev) => [...prev, item]);
    startEdit(item);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <SectionCard title="打刻設定" variant="admin">
      {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const editing = editingId === item.id;

          if (editing) {
            return (
              <View
                key={item.id}
                style={[
                  styles.settingRow,
                  !isLast && styles.settingRowDivider,
                ]}
              >
                <Text style={styles.fieldLabel}>セット名称</Text>
                <SimpleFocusedInput
                  value={editForm.title ?? ''}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, title: v }))
                  }
                />
                <View style={styles.editRow}>
                  <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <Text style={styles.fieldLabel}>IN ボタン文言</Text>
                    <SimpleFocusedInput
                      value={editForm.labelIn ?? ''}
                      onChangeText={(v) =>
                        setEditForm((prev) => ({ ...prev, labelIn: v }))
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>OUT ボタン文言</Text>
                    <SimpleFocusedInput
                      value={editForm.labelOut ?? ''}
                      onChangeText={(v) =>
                        setEditForm((prev) => ({ ...prev, labelOut: v }))
                      }
                    />
                  </View>
                </View>
                <View style={styles.editActionRow}>
                  <AppButton
                    size="sm"
                    variant="ghost"
                    onPress={cancelEdit}
                  >
                    キャンセル
                  </AppButton>
                  <AppButton size="sm" onPress={saveEdit}>
                    完了
                  </AppButton>
                </View>
              </View>
            );
          }

          return (
            <View key={item.id} style={[styles.settingRow, !isLast && styles.settingRowDivider]}>
              <View style={styles.settingRowHeader}>
                <View style={styles.settingRowTitleLeft}>
                  {!item.required && (
                    <Pressable
                      onPress={() => removeItem(item.id)}
                      style={{ marginRight: spacing.sm }}
                    >
                      <MinusCircle size={20} color={COLORS.danger} />
                    </Pressable>
                  )}
                  <Text style={styles.settingRowTitle}>{item.title}</Text>
                  <Pressable
                    onPress={() => startEdit(item)}
                    style={styles.editIconBox}
                  >
                    <Edit2 size={12} color={COLORS.textSub} />
                  </Pressable>
                </View>
                {item.required ? (
                  <Text style={styles.requiredChip}>必須</Text>
                ) : (
                  <AppSwitch
                    isOn={item.enabled}
                    onToggle={() => toggleItem(item.id)}
                  />
                )}
              </View>
              <View style={styles.settingRowDesc}>
                <Text style={styles.settingRowDescText}>
                  <LogIn size={14} color={COLORS.textSub} /> {item.labelIn}
                </Text>
                <Text style={styles.settingRowDescText}>
                  <LogOut size={14} color={COLORS.textSub} /> {item.labelOut}
                </Text>
              </View>
            </View>
          );
        })}
      <Pressable
        onPress={addItem}
        style={({ pressed }) => [
          styles.addRow,
          pressed && { backgroundColor: '#F2F2F7' },
        ]}
      >
        <Plus size={18} color={COLORS.primary} />
        <Text style={styles.addRowLabel}>打刻セットを追加</Text>
      </Pressable>
    </SectionCard>
  );
};

export const GeofenceSection: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [radiusValue, setRadiusValue] = useState(
    APP_CONFIG.geofence.defaultRadius,
  );

  const minus = () => {
    setRadiusValue((prev) =>
      Math.max(prev - APP_CONFIG.geofence.step, APP_CONFIG.geofence.minRadius),
    );
  };
  const plus = () => {
    setRadiusValue((prev) =>
      Math.min(prev + APP_CONFIG.geofence.step, APP_CONFIG.geofence.maxRadius),
    );
  };

  return (
    <SectionCard
      title="位置情報・ジオフェンス設定"
      variant="admin"
      action={<AppSwitch isOn={enabled} onToggle={() => setEnabled((v) => !v)} />}
    >
      {enabled ? (
        <>
          <View style={styles.geoMapMock}>
            <View style={styles.geoMapCircle} />
          </View>
          <View style={styles.geoRadiusRow}>
            <Text style={styles.fieldLabel}>半径</Text>
            <Text style={styles.geoRadiusValue}>{radiusValue}m</Text>
          </View>
          <View style={styles.geoControlRow}>
            <AppButton size="sm" variant="ghost" onPress={minus} style={{ flex: 1 }}>
              -{APP_CONFIG.geofence.step}m
            </AppButton>
            <AppButton size="sm" variant="ghost" onPress={plus} style={{ flex: 1 }}>
              +{APP_CONFIG.geofence.step}m
            </AppButton>
          </View>
          <View style={{ marginTop: spacing.md }}>
            <SearchBar placeholder="住所または座標を入力" value="" onChange={() => {}} />
          </View>
        </>
      ) : (
        <Text style={styles.geoDisabledText}>位置情報による制限は無効です</Text>
      )}
    </SectionCard>
  );
};

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
