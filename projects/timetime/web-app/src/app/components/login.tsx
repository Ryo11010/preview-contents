import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppButton, GlassCard } from './ui';
import { styles } from '../styles';
import { LOGIN_COLORS, LOGIN_FONT_SIZES, LOGIN_SPACING } from '../styleConstants';
import type { MockAuthUser } from '../../../data/mockData';
import type { IconComponent, User } from '../types';
import { useTextFieldFocus } from '../hooks/useTextFieldFocus';

type LoginScreenProps = {
  authUsers: MockAuthUser[];
  onLogin: (user: User) => void;
};

type LoginInputProps = {
  icon?: IconComponent;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isPassword?: boolean;
};

const LoginInput: React.FC<LoginInputProps> = ({
  icon: Icon,
  value,
  onChangeText,
  placeholder,
  isPassword,
}) => {
  const { focused, baseInputProps } = useTextFieldFocus();
  const [showPassword, setShowPassword] = useState(false);
  const secure = isPassword && !showPassword;
  const iconColor = focused ? LOGIN_COLORS.primary : LOGIN_COLORS.textSub;

  return (
    <View
      style={[
        styles.loginInputContainer,
        focused && styles.inputFocusFrame,
        focused && styles.loginInputContainerFocused,
      ]}
    >
      {Icon ? (
        <View style={styles.loginInputIcon}>
          <Icon size={20} color={iconColor} />
        </View>
      ) : null}
      <TextInput
        {...baseInputProps}
        style={styles.loginTextInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secure}
        placeholderTextColor={LOGIN_COLORS.textSub}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={isPassword ? 'default' : 'email-address'}
        textContentType={isPassword ? 'password' : 'username'}
      />
      {isPassword ? (
        <Pressable
          onPress={() => setShowPassword((v) => !v)}
          style={styles.loginEyeButton}
        >
          {showPassword ? (
            <EyeOff size={20} color={LOGIN_COLORS.textSub} />
          ) : (
            <Eye size={20} color={LOGIN_COLORS.textSub} />
          )}
        </Pressable>
      ) : null}
    </View>
  );
};

type LoginButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  icon?: IconComponent;
};

const LoginButton: React.FC<LoginButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon: Icon,
}) => (
  <AppButton
    onPress={onPress}
    variant={variant === 'primary' ? 'primary' : 'glass'}
    icon={Icon}
    style={[
      styles.loginActionButton,
      variant === 'outline' ? styles.loginActionButtonOutline : null,
    ]}
  >
    {title}
  </AppButton>
);

const LoginPickerItem: React.FC<{
  user: MockAuthUser;
  onPress: () => void;
}> = ({ user, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.loginPickerPressable,
      pressed && styles.loginPickerPressablePressed,
    ]}
  >
    <GlassCard
      padding={LOGIN_SPACING.md}
      shadowless
      style={styles.loginPickerItemCard}
    >
      <Text style={styles.loginPickerName}>{user.name}</Text>
      <Text style={styles.loginPickerEmail}>{user.loginId}</Text>
      <Text style={styles.loginPickerRole}>{user.role}</Text>
    </GlassCard>
  </Pressable>
);

export const LoginScreen: React.FC<LoginScreenProps> = ({ authUsers, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSubmit = () => {
    const trimmed = email.trim();
    const matched = authUsers.find(
      (u) => u.loginId === trimmed && u.password === password,
    );
    if (!matched) {
      setError('メールアドレスまたはパスワードが正しくありません');
      return;
    }
    setError('');
    setPassword('');
    onLogin(matched);
  };

  const handleSelectMock = (u: MockAuthUser) => {
    setEmail(u.loginId);
    setPassword(u.password);
    setError('');
    setPickerOpen(false);
  };

  return (
    <View style={styles.loginWrapper}>
      <LinearGradient
        colors={['#E6EEFF', '#F7FBFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.loginBackgroundGradient}
      />
      <SafeAreaView style={styles.loginSafeArea}>
        <ScrollView
          contentContainerStyle={styles.loginScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <GlassCard padding={LOGIN_SPACING.lg} style={styles.loginFormCard}>
            <View style={styles.loginHeader}>
              <Text style={styles.loginHeroBadge}>timetime</Text>
              <Text style={styles.loginHeroTitle}>ログイン</Text>
              <Text style={styles.loginHeroSubtitle}>
                勤怠・現場・権限をひとつのUIで管理します。アカウント情報を入力してください。
              </Text>
            </View>

            <View style={styles.loginForm}>
              <LoginInput
                icon={Mail}
                value={email}
                onChangeText={setEmail}
                placeholder="メールアドレス"
              />
              <View style={styles.loginSpacerMd} />
              <LoginInput
                icon={Lock}
                value={password}
                onChangeText={setPassword}
                placeholder="パスワード"
                isPassword
              />

              <Pressable
                style={styles.loginForgotPasswordContainer}
                onPress={() => setError('')}
              >
                <Text style={styles.loginForgotPasswordText}>
                  パスワードをお忘れですか？
                </Text>
              </Pressable>

              {error ? <Text style={styles.loginErrorText}>{error}</Text> : null}

              <View style={styles.loginSpacerMd} />

              <LoginButton
                title="モックアカウントを選択"
                variant="outline"
                onPress={() => setPickerOpen(true)}
              />

              <View style={styles.loginSpacerXl} />

              <LoginButton title="ログイン" onPress={handleSubmit} />
            </View>

            <View style={styles.loginFooter}>
              <Text style={styles.loginFooterText}>はじめての方はこちら </Text>
              <Pressable onPress={() => setError('')}>
                <Text style={styles.loginLinkText}>アカウント作成</Text>
              </Pressable>
            </View>
          </GlassCard>
        </ScrollView>

        <Modal transparent visible={pickerOpen} animationType="fade">
          <View style={styles.loginPickerOverlay}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setPickerOpen(false)}
            />
            <View style={styles.loginPickerCard}>
              <Text style={styles.loginPickerTitle}>モックアカウントを選択</Text>
              <ScrollView
                style={styles.loginPickerList}
                contentContainerStyle={styles.loginPickerListContent}
                keyboardShouldPersistTaps="handled"
              >
                {authUsers.map((u) => (
                  <LoginPickerItem
                    key={u.id}
                    user={u}
                    onPress={() => handleSelectMock(u)}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};
