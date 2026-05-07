import type { PropsWithChildren } from 'react';
import React from 'react';
import { ScrollView } from 'react-native';

import { useColors } from '@/theme';

export function ScreenContainer({ children }: PropsWithChildren) {
  const colors = useColors();

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 32,
        gap: 14,
        backgroundColor: colors.bg,
      }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}
