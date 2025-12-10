import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { Edit2, LogIn, LogOut, MinusCircle, Plus } from 'lucide-react-native';
import { AppButton, AppSwitch, SearchBar, SectionCard, SelectField, TextField } from '../../components/ui';
import { APP_CONFIG, COLORS, spacing } from '../../designTokens';
import type { PunchSettingItem } from '../../types';
import { INITIAL_PUNCH_ITEMS } from '../../../../data/mockData';
import { styles } from '../../styles';
import { useTextFieldFocus } from '../../hooks/useTextFieldFocus';

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
                <TextField
                  value={editForm.title ?? ''}
                  onChange={(v) =>
                    setEditForm((prev) => ({ ...prev, title: v }))
                  }
                />
                <View style={styles.editRow}>
                  <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <Text style={styles.fieldLabel}>IN ボタン文言</Text>
                    <TextField
                      value={editForm.labelIn ?? ''}
                      onChange={(v) =>
                        setEditForm((prev) => ({ ...prev, labelIn: v }))
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>OUT ボタン文言</Text>
                    <TextField
                      value={editForm.labelOut ?? ''}
                      onChange={(v) =>
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
