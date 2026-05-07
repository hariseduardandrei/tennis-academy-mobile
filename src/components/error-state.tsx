import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useI18n } from '@/i18n/i18n-provider';
import { tokens, useColors } from '@/theme';

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { t } = useI18n();
  const colors = useColors();

  return (
    <View
      style={{
        padding: 18,
        borderRadius: tokens.radius.lg,
        backgroundColor: colors.isDark ? 'rgba(183,28,28,0.14)' : '#FFF5F5',
        borderWidth: 1,
        borderColor: colors.isDark ? 'rgba(183,28,28,0.3)' : '#FFCDD2',
        gap: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 16 }}>⚠️</Text>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#B71C1C' }}>{t('common.error')}</Text>
      </View>
      {message ? (
        <Text selectable style={{ fontSize: 13, color: colors.isDark ? '#EF9A9A' : '#C62828', lineHeight: 18 }}>
          {message}
        </Text>
      ) : null}
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => ({
            marginTop: 4,
            alignSelf: 'flex-start',
            paddingHorizontal: 14,
            paddingVertical: 7,
            borderRadius: tokens.radius.sm,
            backgroundColor: colors.isDark ? 'rgba(183,28,28,0.28)' : '#FFEBEE',
            borderWidth: 1,
            borderColor: colors.isDark ? 'rgba(183,28,28,0.5)' : '#FFCDD2',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#B71C1C' }}>{t('common.retry')}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
