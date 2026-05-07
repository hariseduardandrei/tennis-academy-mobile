import React from 'react';
import { View } from 'react-native';

import { Text } from 'react-native-paper';

export function EmptyState({ title }: { title: string }) {
  return (
    <View
      style={{
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D9DCE2',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Text selectable variant="bodyMedium">
        {title}
      </Text>
    </View>
  );
}

