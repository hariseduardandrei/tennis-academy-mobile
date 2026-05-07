import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { HelperText, Text, TextInput } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '@/i18n/i18n-provider';
import type { I18nKey } from '@/i18n/translations';
import { getFriendlyLoginError, useAuth } from '@/lib/auth/auth-context';
import { tokens, useColors } from '@/theme';

export function LoginScreen() {
  const { t } = useI18n();
  const { login } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorKey, setErrorKey] = useState<I18nKey | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Hero gradient section */}
      <LinearGradient
        colors={tokens.gradient.brand}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: insets.top + 48,
          paddingBottom: 56,
          paddingHorizontal: 28,
          alignItems: 'center',
          gap: 12,
        }}
      >
        {/* Logo mark */}
        <Animated.View
          entering={FadeInDown.delay(80).springify()}
          style={{
            width: 72,
            height: 72,
            borderRadius: tokens.radius.xl,
            backgroundColor: 'rgba(255,255,255,0.18)',
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.35)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 36 }}>🎾</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).springify()} style={{ alignItems: 'center', gap: 6 }}>
          <Text
            style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5, textAlign: 'center' }}
          >
            Tennis Academy
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center', letterSpacing: 0.1 }}>
            {t('auth.subtitle')}
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Form card */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderTopLeftRadius: tokens.radius.xl,
            borderTopRightRadius: tokens.radius.xl,
            marginTop: -20,
            paddingHorizontal: 24,
            paddingTop: 32,
            paddingBottom: insets.bottom + 24,
            gap: 14,
          }}
        >
          <Text
            style={{ fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 4, letterSpacing: -0.3 }}
          >
            {t('auth.login')}
          </Text>

          <TextInput
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            mode="outlined"
            outlineStyle={{ borderRadius: tokens.radius.md }}
            disabled={submitting}
          />

          <TextInput
            label={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            mode="outlined"
            outlineStyle={{ borderRadius: tokens.radius.md }}
            disabled={submitting}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword((v) => !v)}
              />
            }
          />

          {errorKey ? (
            <HelperText type="error" visible style={{ marginTop: -6 }}>
              {t(errorKey)}
            </HelperText>
          ) : null}

          {/* Gradient CTA button */}
          <Pressable
            onPress={() => void onSubmit()}
            disabled={submitting || !email || !password}
            style={({ pressed }) => ({
              borderRadius: tokens.radius.md,
              overflow: 'hidden',
              opacity: pressed || submitting || !email || !password ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <LinearGradient
              colors={tokens.gradient.brand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 }}>
                {submitting ? '...' : t('auth.login')}
              </Text>
            </LinearGradient>
          </Pressable>

          <Text
            selectable
            style={{
              fontSize: 12,
              color: colors.textTertiary,
              textAlign: 'center',
              marginTop: 'auto',
              paddingTop: 24,
            }}
          >
            {t('settings.apiHint')}
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
