import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LiquidTheme, nativeDriver } from './theme';
import { LiquidButton } from './button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: React.ReactNode;
};

export const DeleteConfirmationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = '削除する',
  cancelLabel = 'キャンセル',
  icon,
}) => {
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isOpen) {
      scale.setValue(0.8);
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: nativeDriver,
        friction: 7,
      }).start();
    }
  }, [isOpen, scale]);

  if (!isOpen) return null;

  return (
    <Modal transparent visible={isOpen} animationType="fade">
      <View style={styles.modalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          style={[
            styles.modalCard,
            { transform: [{ scale }] },
            LiquidTheme.shadowStrong,
          ]}
        >
          <View style={styles.modalIconCircle}>
            {icon ?? <Text style={styles.modalIconText}>!</Text>}
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={{ height: 12 }} />
          <LiquidButton variant="danger" onPress={onConfirm}>
            {confirmLabel}
          </LiquidButton>
          <View style={{ height: 8 }} />
          <LiquidButton variant="ghost" onPress={onClose}>
            {cancelLabel}
          </LiquidButton>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(248,113,113,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalIconText: {
    fontSize: 24,
    color: LiquidTheme.colors.danger,
    fontWeight: '700',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
});

