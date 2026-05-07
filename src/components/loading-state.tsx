import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { useI18n } from '@/i18n/i18n-provider';
import { tokens, useColors } from '@/theme';

export function LoadingState() {
  const { t } = useI18n();
  const colors = useColors();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: colors.bg }}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: tokens.radius.xl,
          backgroundColor: colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          ...colors.shadow,
        }}
      >
        <ActivityIndicator animating size="large" color={colors.primary} />
      </View>
      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary }}>{t('common.loading')}</Text>
    </View>
  );
}
