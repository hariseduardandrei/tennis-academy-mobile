import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { tokens, useColors } from '@/theme';

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  const colors = useColors();
  return (
    <View
      style={{
        padding: 32,
        borderRadius: tokens.radius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
      }}
    >
      <Text style={{ fontSize: 32, lineHeight: 40 }}>🎾</Text>
      <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, textAlign: 'center' }}>{title}</Text>
      {subtitle ? (
        <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center' }}>{subtitle}</Text>
      ) : null}
    </View>
  );
}
