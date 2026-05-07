import React from 'react';
import { View } from 'react-native';

import { ActivityIndicator, Text } from 'react-native-paper';

import { useI18n } from '@/i18n/i18n-provider';

export function LoadingState() {
  const { t } = useI18n();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <ActivityIndicator animating size="large" />
      <Text selectable>{t('common.loading')}</Text>
    </View>
  );
}

