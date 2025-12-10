import React, { useEffect } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { LiquidContainer } from './liquid-ui/liquid-ui_RN';
import { Dock, SideMenu, BottomSheet } from './components/navigation';
import { LoginScreen } from './components/login';
import { AppButton, SettingsHeader } from './components/ui';
import { PunchScreen } from './screens/punch';
import { HistoryScreen, ReportScreen } from './screens/history';
import { SettingsScreen, UserProfileEditScreen } from './screens/settings';
import {
  AdminDashboardScreen,
  AdminOrgSettingsScreen,
  AdminGroupSettingsScreen,
  AdminSubgroupSettingsScreen,
  CommonSettingsForm,
  PunchSettingsSection,
  GeofenceSection,
} from './screens/admin';
import { DebugOverlay, debugOverlayEnabled } from './debugOverlay';
import { useAppContext, AppProvider } from './state/appContext';
import { getDefaultSubgroupName, MOCK_AUTH_USERS } from '../../data/mockData';
import { isAdminRole } from './roles';
import { useScrollLock } from './hooks/useScrollLock';
import { styles } from '../lib/styles';
import { COLORS, layout, spacing } from './designTokens';
import type { TabKey } from './types';
import { Menu } from 'lucide-react-native';

const TAB_SCROLL_MODE: Record<TabKey, 'lock' | 'auto' | 'scroll'> = {
  punch: 'scroll',
  admin: 'lock',
  history: 'auto',
  settings: 'scroll',
  settings_profile: 'scroll',
  admin_org_settings: 'scroll',
  admin_group_settings: 'scroll',
  admin_subgroup_settings: 'scroll',
  admin_group_edit: 'scroll',
  admin_subgroup_edit: 'scroll',
  reports: 'scroll',
};

const AppShell = () => {
  const {
    state,
    login,
    logout,
    setActiveTab,
    openMenu,
    closeMenu,
    setSheetUserId,
    updateUser,
    updateRole,
    updateMember,
    addMember,
  } = useAppContext();
  const { activeTab, menuVisible, sheetUserId, user, roleAssignments } = state;
  const scrollMode = TAB_SCROLL_MODE[activeTab] ?? 'scroll';
  const useOuterScroll = scrollMode === 'scroll';
  const isPunchTab = activeTab === 'punch';
  const isAdminTab = activeTab === 'admin';

  useScrollLock(scrollMode);

  useEffect(() => {
    if (!debugOverlayEnabled) return;
    DebugOverlay.ensure({ title: 'Timetime Debug' });
    DebugOverlay.update('env', {
      debugOverlayEnabled,
      platform: Platform.OS,
    });
  }, []);

  useEffect(() => {
    if (!debugOverlayEnabled || !user) return;
    DebugOverlay.update('app/state', {
      activeTab,
      menuVisible,
      sheetUserId,
    });
    DebugOverlay.update('user', {
      role: user.role,
      group: user.currentGroup,
      subgroup: user.currentSubgroup,
    });
  }, [activeTab, menuVisible, sheetUserId, user]);

  if (!user) {
    return (
      <View style={styles.loginWrapper}>
        <LoginScreen authUsers={MOCK_AUTH_USERS} onLogin={login} />
      </View>
    );
  }

  const handleNavigate = (tab: TabKey) => {
    if (tab === 'admin' && !isAdminRole(user.role)) {
      setActiveTab('punch');
      return;
    }
    setActiveTab(tab);
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  const onGroupChange = (name: string) => {
    const newSub = getDefaultSubgroupName(name, user.currentSubgroup);
    updateUser({
      currentGroup: name,
      currentSubgroup: newSub,
    });
  };

  const onSubgroupChange = (name: string) => {
    updateUser({ currentSubgroup: name });
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'punch':
        return <PunchScreen user={user} />;
      case 'history':
        return <HistoryScreen />;
      case 'settings':
        return (
          <SettingsScreen
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            user={user}
          />
        );
      case 'settings_profile':
        return (
          <UserProfileEditScreen
            user={user}
            onBack={() => setActiveTab('settings')}
          />
        );
      case 'settings_notifications':
        return (
          <SettingsScreen.NotificationsScreen
            onBack={() => setActiveTab('settings')}
          />
        );
      case 'settings_password':
        return (
          <SettingsScreen.PasswordScreen
            onBack={() => setActiveTab('settings')}
          />
        );
      case 'admin':
        return (
          <AdminDashboardScreen
            onMemberClick={(id) => setSheetUserId(id)}
            currentUser={user}
            assignments={roleAssignments}
          />
        );
      case 'admin_org_settings':
        return (
          <AdminOrgSettingsScreen
            assignments={roleAssignments}
            currentUser={user}
            onRoleChange={updateRole}
            onMemberUpdate={updateMember}
            onAddMember={addMember}
          />
        );
      case 'admin_group_settings':
        return (
          <AdminGroupSettingsScreen
            onNavigate={handleNavigate}
          />
        );
      case 'admin_subgroup_settings':
        return (
          <AdminSubgroupSettingsScreen
            onNavigate={handleNavigate}
          />
        );
      case 'admin_group_edit':
        return (
          <View style={styles.screenContainer}>
            <SettingsHeader
              title="グループ編集"
              onBack={() => setActiveTab('admin_group_settings')}
            />
            <CommonSettingsForm title="関東エリア" />
            <PunchSettingsSection />
            <GeofenceSection />
            <View style={styles.saveBottomRow}>
              <AppButton style={{ width: '100%', height: 48 }}>保存</AppButton>
            </View>
          </View>
        );
      case 'admin_subgroup_edit':
        return (
          <View style={styles.screenContainer}>
            <SettingsHeader
              title="小グループ編集"
              onBack={() => setActiveTab('admin_subgroup_settings')}
            />
            <CommonSettingsForm title="新宿駅前現場" />
            <PunchSettingsSection />
            <GeofenceSection />
            <View style={styles.saveBottomRow}>
              <AppButton style={{ width: '100%', height: 48 }}>保存</AppButton>
            </View>
          </View>
        );
      case 'reports':
        return (
          <ReportScreen
            user={user}
          />
        );
      default:
        return <PunchScreen user={user} />;
    }
  };

  return (
    <LiquidContainer style={styles.containerFull}>
      <View style={styles.appRoot}>
        <View style={styles.appForeground}>
          <View style={styles.header}>
            <AppButton
              size="icon"
              variant="glass"
              onPress={openMenu}
            >
              <Menu size={24} color={COLORS.textMain} />
            </AppButton>
          </View>

          {!useOuterScroll ? (
            <View
              style={[
                isAdminTab
                  ? styles.adminStaticLock
                  : styles.scrollContent,
                styles.staticContent,
                isPunchTab ? styles.punchContent : null,
                isAdminTab ? styles.adminContent : null,
              ]}
            >
              {renderScreen()}
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[
                styles.scrollContent,
                isPunchTab && styles.punchScrollContent,
                { paddingBottom: layout.dockHeight + spacing.md },
              ]}
              showsVerticalScrollIndicator={false}
              scrollEnabled
              alwaysBounceVertical
              overScrollMode="never"
              contentInsetAdjustmentBehavior="always"
            >
              {renderScreen()}
            </ScrollView>
          )}

          <View style={styles.dockWrapper}>
            <Dock
              activeTab={activeTab}
              onTabChange={handleNavigate}
              role={user.role}
            />
          </View>

          <SideMenu
            visible={menuVisible}
            onClose={closeMenu}
            user={user}
            onNavigate={handleNavigate}
            onGroupSelect={onGroupChange}
            onSubgroupSelect={onSubgroupChange}
            onLogout={handleLogout}
          />

          <BottomSheet
            visible={sheetUserId != null}
            onClose={() => setSheetUserId(null)}
            title="勤務履歴詳細"
          >
            <HistoryScreen isModal />
          </BottomSheet>
        </View>
      </View>
    </LiquidContainer>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
