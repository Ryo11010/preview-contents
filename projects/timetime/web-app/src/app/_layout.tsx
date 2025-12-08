// src/app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      {/* ここでアプリ全体のナビゲーションを定義します */}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
