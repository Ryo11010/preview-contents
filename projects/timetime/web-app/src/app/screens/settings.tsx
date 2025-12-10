import React, { useCallback, useEffect } from 'react';
import { Alert, LayoutChangeEvent, StyleSheet, View, Text, Pressable } from 'react-native';
import {
  Bell,
  ChevronRight,
  CreditCard,
  Edit2,
  Save,
  Settings as SettingsIcon,
  Shield,
  Smartphone,
  User as UserIcon,
} from 'lucide-react-native';
import { AppButton, CardSurface, TextField, SettingsHeader } from '../components/ui';
import { APP_COPY, COLORS, spacing } from '../designTokens';
import type { TabKey, User } from '../types';
import { styles } from '../../lib/styles';
import { DebugOverlay, debugOverlayEnabled } from '../debugOverlay';

type SettingsScreenProps = {
  onNavigate: (t: TabKey) => void;
  onLogout: () => void;
  user: User;
};

const BaseSettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigate,
  onLogout,
  user,
}) => {
  const handleProfileLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (!debugOverlayEnabled) return;
      const { width, height } = e.nativeEvent.layout;
      DebugOverlay.update('settings/profileCard', { width, height });
    },
    [],
  );
  const handleProfileSurfaceLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (!debugOverlayEnabled) return;
      const { width, height } = e.nativeEvent.layout;
      DebugOverlay.update('settings/profileCardSurface', { width, height });
    },
    [],
  );
  const logCardShadow = useCallback(
    (key: string, style: any) => {
      if (!debugOverlayEnabled) return;
      const flat = StyleSheet.flatten(style);
      DebugOverlay.update(`settings/shadow/${key}`, {
        boxShadow: flat?.boxShadow ?? 'n/a',
        shadowColor: flat?.shadowColor ?? 'n/a',
        shadowOpacity: flat?.shadowOpacity ?? 'n/a',
        shadowRadius: flat?.shadowRadius ?? 'n/a',
        shadowOffset: flat?.shadowOffset ?? 'n/a',
        elevation: flat?.elevation ?? 'n/a',
      });
    },
    [],
  );
  useEffect(() => {
    logCardShadow('logout', styles.settingsCardShadow);
  }, [logCardShadow]);
  const handleProfileInnerLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (!debugOverlayEnabled) return;
      const { width, height } = e.nativeEvent.layout;
      DebugOverlay.update('settings/profileCardInner', { width, height });
    },
    [],
  );

  return (
    <View style={[styles.screenContainer, styles.settingsContent]}>
      <Text style={styles.screenTitle}>設定</Text>
      <View style={styles.profileCardWrapper}>
        <Pressable
          onPress={() => onNavigate('settings_profile')}
          style={({ pressed }) => [
            styles.settingsProfilePressable,
            pressed && { opacity: 0.9 },
          ]}
        >
          <View
            style={styles.profileCardSurface}
            onLayout={handleProfileSurfaceLayout}
          >
            <View
              style={styles.profileCardInner}
              onLayout={handleProfileInnerLayout}
            >
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>{user.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1, gap: spacing.xs }}>
                <View style={styles.profileHeaderRow}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {user.name}
                  </Text>
                  <View style={styles.profileRoleChip}>
                    <Shield size={12} color={COLORS.primary} />
                    <Text style={styles.profileRoleChipText} numberOfLines={1}>
                      {user.role}
                    </Text>
                  </View>
                </View>
                <Text style={styles.profileEmail} numberOfLines={1}>
                  {user.email}
                </Text>
                <Text style={styles.profileMeta} numberOfLines={1}>
                  ユーザーID: {user.id}
                </Text>
              </View>
              <ChevronRight size={20} color={COLORS.textSub} />
            </View>
          </View>
        </Pressable>
      </View>

      <CardSurface
        padding={spacing.md}
        style={[{ marginBottom: spacing.sm }, styles.settingsCardFull]}
        onLayout={(e) => {
          handleProfileSurfaceLayout(e);
          logCardShadow('notification-password', styles.settingsCardShadow);
        }}
      >
        <Pressable
          onPress={() => onNavigate('settings_notifications')}
          style={({ pressed }) => [
            styles.settingsRowPressable,
            pressed && { opacity: 0.9, transform: [{ scale: 0.995 }] },
          ]}
        >
          <View style={styles.settingsRow}>
            <View style={styles.settingsIconBoxWarning}>
              <Bell size={18} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingsLabel}>通知設定</Text>
              <Text style={styles.settingsSubLabel}>プッシュ・メールの送信設定</Text>
            </View>
            <ChevronRight size={18} color={COLORS.textSub} />
          </View>
        </Pressable>
        <View style={styles.settingsRowDivider} />
        <Pressable
          onPress={() => onNavigate('settings_password')}
          style={({ pressed }) => [
            styles.settingsRowPressable,
            pressed && { opacity: 0.9, transform: [{ scale: 0.995 }] },
          ]}
        >
          <View style={styles.settingsRow}>
            <View style={styles.settingsIconBoxSuccess}>
              <Shield size={18} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingsLabel}>パスワード変更</Text>
              <Text style={styles.settingsSubLabel}>現在のパスワードと新しいパスワード</Text>
            </View>
            <ChevronRight size={18} color={COLORS.textSub} />
          </View>
        </Pressable>
      </CardSurface>

      <CardSurface
        padding={spacing.xs}
        style={[{ marginBottom: spacing.lg }, styles.settingsCardNarrow]}
        onLayout={() => logCardShadow('logout', styles.settingsCardShadow)}
      >
        <Pressable
          onPress={onLogout}
          style={({ pressed }) => [
            styles.settingsLogoutPressable,
            pressed && { opacity: 0.9 },
          ]}
        >
          <View style={styles.settingsLogoutRow}>
            <Text style={styles.settingsLogoutText}>ログアウト</Text>
          </View>
        </Pressable>
      </CardSurface>

      <Text style={styles.versionText}>
        {APP_COPY.version}
        {'\n'}ID: {user.id}
      </Text>
    </View>
  );
};

type UserProfileEditScreenProps = {
  onBack: () => void;
  user: User;
};

const UserProfileEditScreenInner: React.FC<UserProfileEditScreenProps> = ({
  onBack,
  user,
}) => {
  return (
    <View style={[styles.screenContainer, styles.settingsContent]}>
      <SettingsHeader title="ユーザー情報編集" onBack={onBack} />
      <View style={styles.profileEditAvatarWrapper}>
        <View style={styles.profileEditAvatar}>
          <Text style={styles.profileEditAvatarText}>
            {user.name.charAt(0)}
          </Text>
          <View style={styles.profileEditBadge}>
            <Edit2 size={16} color="#fff" />
          </View>
        </View>
      </View>

      <CardSurface
        padding={spacing.md}
        style={[{ marginBottom: spacing.lg }, styles.settingsCardFull]}
      >
        <TextField label="お名前" value={user.name} icon={UserIcon} />
        <TextField label="メールアドレス" value={user.email} icon={SettingsIcon} />
        <TextField label="電話番号" value="090-1234-5678" icon={Smartphone} />
      </CardSurface>

      <CardSurface
        padding={spacing.md}
        style={styles.settingsCardFull}
      >
        <View style={styles.infoRowHeader}>
          <CreditCard
            size={20}
            color={COLORS.textSub}
            style={{ marginRight: spacing.xs }}
          />
          <Text style={styles.infoRowHeaderTitle}>システム情報</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoRowLabel}>ユーザーID</Text>
          <Text style={styles.infoRowValue}>{user.id}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoRowLabel}>権限</Text>
          <Text style={styles.infoRoleChip}>{user.role}</Text>
        </View>
      </CardSurface>

      <CardSurface
        padding={spacing.md}
        style={[{ marginTop: spacing.xl }, styles.settingsCardFull]}
      >
        <AppButton
          icon={Save}
          style={{ width: '100%', height: 48 }}
          onPress={() => Alert.alert('保存', 'ダミー実装です')}
        >
          変更を保存
        </AppButton>
      </CardSurface>
    </View>
  );
};

const NotificationsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <View style={[styles.screenContainer, styles.settingsContent]}>
    <SettingsHeader title="通知設定" onBack={onBack} />
    <CardSurface padding={spacing.md} style={styles.settingsCardFull}>
      <View style={styles.settingsRow}>
        <Text style={styles.settingsLabel}>プッシュ通知</Text>
        <AppButton
          variant="glass"
          size="sm"
          onPress={() => {}}
          style={{ paddingHorizontal: spacing.sm }}
        >
          ON/OFF
        </AppButton>
      </View>
      <View style={styles.settingsRowDivider} />
      <View style={styles.settingsRow}>
        <Text style={styles.settingsLabel}>メール通知</Text>
        <AppButton
          variant="glass"
          size="sm"
          onPress={() => {}}
          style={{ paddingHorizontal: spacing.sm }}
        >
          ON/OFF
        </AppButton>
      </View>
      <View style={{ marginTop: spacing.md }}>
        <Text style={styles.settingsSubLabel}>細かな設定は未接続のダミーです</Text>
      </View>
    </CardSurface>
  </View>
);

const PasswordScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <View style={[styles.screenContainer, styles.settingsContent]}>
    <SettingsHeader title="パスワード変更" onBack={onBack} />
    <CardSurface padding={spacing.md} style={styles.settingsCardFull}>
      <TextField label="現在のパスワード" secureTextEntry />
      <TextField label="新しいパスワード" secureTextEntry />
      <TextField label="新しいパスワード（確認）" secureTextEntry />
      <View style={{ marginTop: spacing.md }}>
        <AppButton style={{ width: '100%', height: 44 }}>更新する</AppButton>
      </View>
    </CardSurface>
  </View>
);

export const SettingsScreen = Object.assign(BaseSettingsScreen, {
  NotificationsScreen,
  PasswordScreen,
});

export const UserProfileEditScreen = UserProfileEditScreenInner;
