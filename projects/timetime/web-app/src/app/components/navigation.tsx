import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Building2,
  ChevronDown,
  Clock,
  Edit2,
  FileText,
  Globe,
  Layers,
  LayoutDashboard,
  List,
  LogOut,
  Map,
  MapPin,
  Settings,
  User as UserIcon,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react-native';
import {
  LiquidDock,
  LiquidSheet,
  LiquidTheme,
} from '../liquid-ui/liquid-ui_RN';
import {
  ADMIN_TABS,
  APP_CONFIG,
  APP_COPY,
  COLORS,
  GENERAL_TABS,
  spacing,
} from '../designTokens';
import type { TabKey, User } from '../types';
import { styles } from '../../lib/styles';
import { isAdminRole } from '../roles';
import { MOCK_GROUPS, MOCK_SUBGROUPS } from '../../../data/mockData';
import {
  MenuAccordion,
  MenuListItem,
  MenuQuickAction,
  MenuSubItem,
  MenuSurface,
} from './menuCommon';

type DockProps = {
  activeTab: TabKey;
  onTabChange: (t: TabKey) => void;
  role: string;
};

const TAB_ICON_MAP: Record<TabKey, any> = {
  punch: Clock,
  history: List,
  admin: LayoutDashboard,
  settings: Settings,
  settings_profile: Settings,
  admin_org_settings: Globe,
  admin_group_settings: Layers,
  admin_subgroup_settings: Map,
  admin_group_edit: Edit2,
  admin_subgroup_edit: Edit2,
  reports: FileText,
};

const MENU_GRADIENTS = {
  org: ['rgba(255,255,255,0.95)', 'rgba(240,246,255,0.82)'],
  user: ['rgba(255,255,255,0.9)', 'rgba(236,242,255,0.82)'],
  group: ['rgba(255,255,255,0.96)', 'rgba(240,248,255,0.82)'],
  subgroup: ['rgba(255,255,255,0.96)', 'rgba(236,252,244,0.82)'],
  quickAction: ['rgba(255,255,255,0.95)', 'rgba(255,249,234,0.82)'],
  adminSettings: ['rgba(255,255,255,0.96)', 'rgba(245,248,250,0.84)'],
};

export const Dock: React.FC<DockProps> = ({ activeTab, onTabChange, role }) => {
  const tabs = (isAdminRole(role) ? ADMIN_TABS : GENERAL_TABS).map((t) => {
    const Icon = TAB_ICON_MAP[t.id];
    return {
      id: t.id,
      label: t.label,
      icon: (
        <Icon
          size={22}
          color={
            t.id === activeTab ? LiquidTheme.colors.primary : COLORS.textSub
          }
        />
      ),
    };
  });
  const dockActiveId = tabs.some((t) => t.id === activeTab) ? activeTab : null;

  return (
    <LiquidDock
      tabs={tabs}
      activeId={dockActiveId}
      onChange={onTabChange}
    />
  );
};

type SideMenuProps = {
  visible: boolean;
  onClose: () => void;
  user: User;
  onNavigate: (tab: TabKey) => void;
  onGroupSelect: (name: string) => void;
  onSubgroupSelect: (name: string) => void;
  onLogout: () => void;
};

export const SideMenu: React.FC<SideMenuProps> = ({
  visible,
  onClose,
  user,
  onNavigate,
  onGroupSelect,
  onSubgroupSelect,
  onLogout,
}) => {
  const slideX = useRef(new Animated.Value(-340)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);
  const [groupOpen, setGroupOpen] = useState(false);
  const [subgroupOpen, setSubgroupOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.spring(slideX, {
          toValue: 0,
          useNativeDriver: false,
          damping: 20,
          mass: 0.8,
          stiffness: 100,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideX, {
          toValue: -340,
          duration: 240,
          easing: Easing.in(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: false,
        }),
      ]).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, slideX, backdropOpacity]);

  if (!mounted) return null;

  const handleReport = () => {
    onNavigate('reports');
    onClose();
  };

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent>
      <Animated.View
        style={[
          styles.menuOverlay,
          { opacity: backdropOpacity },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View
        style={[
          styles.menuPanel,
          {
            transform: [{ translateX: slideX }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(236,242,255,0.9)', 'rgba(255,255,255,0.86)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.menuPanelGradient}
        />
        <LinearGradient
          colors={['rgba(88,86,214,0.25)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.menuPanelGlowTop}
        />
        <LinearGradient
          colors={['rgba(0,122,255,0.2)', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.menuPanelGlowBottom}
        />
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.95)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.menuPanelEdgeFade}
        />
        <BlurView intensity={42} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.menuPanelContent}>
          <View style={styles.menuHeader}>
            <Pressable
              onPress={() => {
                onNavigate('settings');
                onClose();
              }}
              style={({ pressed }) => [
                styles.menuUserCardPressable,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={styles.menuAccountRow}>
                <View style={styles.menuAvatar}>
                  <UserIcon size={18} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuUserName} numberOfLines={1}>
                    {user.name}
                  </Text>
                  <View style={styles.menuAccountMetaRow}>
                    <View style={styles.menuAccountRoleBadge}>
                      <ShieldCheck size={12} color={COLORS.primary} />
                      <Text style={styles.menuAccountRoleText} numberOfLines={1}>
                        {user.role}
                      </Text>
                    </View>
                    <View style={styles.menuAccountTag}>
                      <Settings size={12} color={COLORS.primary} />
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.menuCloseButton,
                pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
              ]}
            >
                <X size={22} color={COLORS.textMain} />
              </Pressable>
          </View>

          <ScrollView
            style={styles.menuScrollView}
            contentContainerStyle={styles.menuScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.menuSection}>
              <View style={styles.menuSectionHeader}>
                <Building2 size={16} color={COLORS.primary} />
                <Text style={styles.menuSectionTitle}>組織情報</Text>
              </View>
              <MenuSurface
                gradient={MENU_GRADIENTS.org}
                style={styles.menuOrgCard}
              >
                <Text style={styles.menuOrgText}>{APP_CONFIG.companyName}</Text>
              </MenuSurface>
            </View>

            <View style={styles.menuSection}>
              <MenuAccordion
                gradient={MENU_GRADIENTS.group}
                icon={<Users size={18} color={COLORS.indigo} />}
                label="グループ"
                title={user.currentGroup}
                open={groupOpen}
                onToggle={() => setGroupOpen((o) => !o)}
              >
                {MOCK_GROUPS.map((g) => (
                  <MenuListItem
                    key={g.id}
                    label={g.name}
                    active={g.name === user.currentGroup}
                    onPress={() => onGroupSelect(g.name)}
                  />
                ))}
              </MenuAccordion>
            </View>

            <View style={styles.menuSection}>
              <MenuAccordion
                gradient={MENU_GRADIENTS.subgroup}
                icon={<MapPin size={18} color={COLORS.success} />}
                label="現場"
                title={user.currentSubgroup}
                open={subgroupOpen}
                onToggle={() => setSubgroupOpen((o) => !o)}
                iconWrapperStyle={styles.menuAccordionIconWrapperSuccess}
              >
                {(MOCK_SUBGROUPS[user.currentGroup] ?? []).map((s) => (
                  <MenuListItem
                    key={s.id}
                    label={s.name}
                    active={s.name === user.currentSubgroup}
                    onPress={() => {
                      onSubgroupSelect(s.name);
                      onClose();
                    }}
                  />
                ))}
              </MenuAccordion>
            </View>

            {isAdminRole(user.role) && (
              <>
                <View style={styles.menuDivider} />

                <View style={styles.menuSection}>
                  <View style={styles.menuSectionHeader}>
                <LayoutDashboard size={16} color={COLORS.warning} />
                <Text style={styles.menuSectionTitle}>管理</Text>
              </View>
              <MenuQuickAction
                gradient={MENU_GRADIENTS.quickAction}
                label="レポート"
                subLabel="勤怠出力・分析"
                icon={<FileText size={18} color={COLORS.warning} />}
                iconColor={COLORS.warning}
                onPress={handleReport}
              />
            </View>

                <View style={styles.menuSection}>
                  <MenuAccordion
                    gradient={MENU_GRADIENTS.adminSettings}
                    icon={<Settings size={18} color={COLORS.textMain} />}
                    label="組織設定"
                    title="グループ・現場管理"
                    open={adminOpen}
                    onToggle={() => setAdminOpen((o) => !o)}
                    iconWrapperStyle={styles.menuAccordionIconWrapperNeutral}
                  >
                    {[
                      {
                        label: '組織設定',
                        icon: <Globe size={16} color={COLORS.primary} />,
                        color: COLORS.primary,
                        tab: 'admin_org_settings',
                      },
                      {
                        label: 'グループ設定',
                        icon: <Layers size={16} color={COLORS.indigo} />,
                        color: COLORS.indigo,
                        tab: 'admin_group_settings',
                      },
                      {
                        label: '現場設定',
                        icon: <Map size={16} color={COLORS.success} />,
                        color: COLORS.success,
                        tab: 'admin_subgroup_settings',
                      },
                    ].map((item) => (
                      <MenuSubItem
                        key={item.label}
                        label={item.label}
                        color={item.color}
                        icon={item.icon}
                        onPress={() => {
                          onNavigate(item.tab as TabKey);
                          onClose();
                        }}
                      />
                    ))}
                  </MenuAccordion>
                </View>
              </>
            )}

            <View style={styles.menuDivider} />

            <View style={styles.menuSection}>
              <Pressable
                onPress={() => {
                  onClose();
                  onLogout();
                }}
                style={({ pressed }) => [
                  styles.menuLogoutButton,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                ]}
              >
                <LogOut size={18} color={COLORS.danger} />
                <Text style={styles.menuLogoutLabel}>ログアウト</Text>
              </Pressable>

              <Text style={styles.menuVersionText}>{APP_COPY.version}</Text>
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
};

type SheetProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export const BottomSheet: React.FC<SheetProps> = ({
  visible,
  onClose,
  title,
  children,
}) => (
  <LiquidSheet isOpen={visible} onClose={onClose} title={title}>
    {children}
  </LiquidSheet>
);

export { TAB_ICON_MAP };
