import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { I18nProvider } from '@/i18n/i18n-provider';
import { AuthProvider } from '@/lib/auth/auth-context';
import { RootNavigator } from '@/navigation/root-navigator';
import { darkTheme, lightTheme } from '@/theme';

export default function App() {
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nProvider>
          <AuthProvider>
            <PaperProvider theme={paperTheme}>
              <RootNavigator darkMode={colorScheme === 'dark'} />
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            </PaperProvider>
          </AuthProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}


