import React from 'react';
import { View } from 'react-native';

import { Button, Text } from 'react-native-paper';

import { useI18n } from '@/i18n/i18n-provider';

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { t } = useI18n();

  return (
    <View
      style={{
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F1C0C0',
        backgroundColor: '#FFF5F5',
        gap: 10,
      }}
    >
      <Text selectable variant="titleSmall">
        {t('common.error')}
      </Text>
      <Text selectable variant="bodyMedium">
        {message ?? t('common.error')}
      </Text>
      {onRetry ? (
        <Button mode="outlined" onPress={onRetry}>
          {t('common.retry')}
        </Button>
      ) : null}
    </View>
  );
}

