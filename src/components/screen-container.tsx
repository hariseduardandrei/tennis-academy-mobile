import type { PropsWithChildren } from 'react';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from 'react-native-paper';

export function ScreenContainer({ children }: PropsWithChildren) {
  const theme = useTheme();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 16,
  },
  inner: {
    gap: 12,
  },
});

