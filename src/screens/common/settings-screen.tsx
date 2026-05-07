import Constants from 'expo-constants';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button, Card, Dialog, Portal, SegmentedButtons, Text, TextInput } from 'react-native-paper';

import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/i18n/i18n-provider';
import { useAuth } from '@/lib/auth/auth-context';
import { getApiBaseUrl, getApiBaseUrlOverride, setApiBaseUrlOverride } from '@/lib/config/runtime-config';

export function SettingsScreen() {
  const { t, locale, setLocale } = useI18n();
  const { logout } = useAuth();
  const version = Constants.expoConfig?.version ?? 'dev';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [value, setValue] = useState('');

  const localeButtons = useMemo(
    () => [
      { label: 'RO', value: 'ro' },
      { label: 'EN', value: 'en' },
    ],
    [],
  );

  useEffect(() => {
    (async () => {
      setCurrentUrl(await getApiBaseUrl());
      setValue(await getApiBaseUrlOverride());
    })();
  }, [dialogOpen]);

  const saveOverride = async () => {
    await setApiBaseUrlOverride(value);
    setCurrentUrl(await getApiBaseUrl());
    setDialogOpen(false);
    await logout();
  };

  return (
    <ScreenContainer>
      <Card>
        <Card.Title title={t('common.settings')} />
        <Card.Content style={{ gap: 12 }}>
          <Text selectable variant="titleMedium">
            {t('settings.language')}
          </Text>
          <SegmentedButtons
            value={locale}
            onValueChange={(next) => void setLocale(next as 'ro' | 'en')}
            buttons={localeButtons}
          />
          <Button mode="outlined" onPress={() => void logout()}>
            {t('common.logout')}
          </Button>
        </Card.Content>
      </Card>

      <Card>
        <Card.Title title={t('settings.apiOverride')} />
        <Card.Content style={{ gap: 8 }}>
          <Text selectable variant="bodySmall">
            {t('settings.apiHint')}
          </Text>
          <Text selectable variant="bodySmall">
            {t('settings.apiCurrent')}: {currentUrl}
          </Text>
          <Pressable onLongPress={() => setDialogOpen(true)} delayLongPress={500}>
            <Text selectable variant="labelLarge">
              {t('common.version')}: {version}
            </Text>
          </Pressable>
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={dialogOpen} onDismiss={() => setDialogOpen(false)}>
          <Dialog.Title>{t('settings.apiOverride')}</Dialog.Title>
          <Dialog.Content>
            <View style={{ gap: 8 }}>
              <TextInput
                label={t('settings.apiInput')}
                value={value}
                onChangeText={setValue}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button onPress={() => void saveOverride()}>{t('common.save')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScreenContainer>
  );
}

