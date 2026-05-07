import React, { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, HelperText, Text, TextInput } from 'react-native-paper';

import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/i18n/i18n-provider';
import type { I18nKey } from '@/i18n/translations';
import { getFriendlyLoginError, useAuth } from '@/lib/auth/auth-context';

export function LoginScreen() {
  const { t } = useI18n();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorKey, setErrorKey] = useState<I18nKey | null>(null);

  const onSubmit = async () => {
    if (!email || !password) return;
    setSubmitting(true);
    setErrorKey(null);
    try {
      await login(email.trim(), password);
    } catch (error) {
      setErrorKey(getFriendlyLoginError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 24 }}>
        <Card>
          <Card.Title title={t('app.name')} subtitle={t('auth.subtitle')} />
          <Card.Content style={{ gap: 12 }}>
            <TextInput
              label={t('auth.email')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              label={t('auth.password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {errorKey ? (
              <HelperText type="error" visible>
                {t(errorKey)}
              </HelperText>
            ) : null}
            <Button mode="contained" onPress={onSubmit} loading={submitting}>
              {t('auth.login')}
            </Button>
            <Text selectable variant="bodySmall">
              {t('settings.apiHint')}
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScreenContainer>
  );
}




