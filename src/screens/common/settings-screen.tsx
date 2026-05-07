import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Dialog, Portal, Text, TextInput } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/i18n/i18n-provider';
import { useAuth } from '@/lib/auth/auth-context';
import { getApiBaseUrl, getApiBaseUrlOverride, setApiBaseUrlOverride } from '@/lib/config/runtime-config';
import { tokens, useColors } from '@/theme';

function SettingRow({
  label,
  value,
  onPress,
  danger,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 13,
        paddingHorizontal: 16,
        borderRadius: tokens.radius.md,
        backgroundColor: colors.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ fontSize: 15, fontWeight: '600', color: danger ? '#B71C1C' : colors.text }}>{label}</Text>
      {value ? <Text style={{ fontSize: 13, color: colors.textSecondary }}>{value}</Text> : null}
      {onPress && !value ? <Text style={{ fontSize: 16, color: colors.textTertiary }}>›</Text> : null}
    </Pressable>
  );
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <Animated.View entering={FadeInDown.springify()} style={{ gap: 6 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '700',
          color: colors.textTertiary,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          paddingHorizontal: 4,
          paddingBottom: 2,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: tokens.radius.lg,
          overflow: 'hidden',
          gap: 1,
          ...colors.shadowSm,
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
}

export function SettingsScreen() {
  const { t, locale, setLocale } = useI18n();
  const { logout, user } = useAuth();
  const colors = useColors();
  const version = Constants.expoConfig?.version ?? 'dev';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [value, setValue] = useState('');

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
      {/* Profile card */}
      <Animated.View entering={FadeInDown.delay(40).springify()}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radius.lg,
            padding: 18,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            ...colors.shadow,
          }}
        >
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: tokens.radius.full,
              backgroundColor: tokens.colors.primaryGreen,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#FFFFFF' }}>
              {user?.email?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }} numberOfLines={1}>
              {user?.email ?? ''}
            </Text>
            <View
              style={{
                backgroundColor: colors.isDark ? 'rgba(76,175,80,0.18)' : 'rgba(46,125,50,0.09)',
                borderRadius: tokens.radius.full,
                paddingHorizontal: 8,
                paddingVertical: 2,
                alignSelf: 'flex-start',
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary }}>
                {user?.role ?? ''}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Language */}
      <SettingsGroup title={t('settings.language')}>
        <View style={{ flexDirection: 'row', padding: 10, gap: 8 }}>
          {(['ro', 'en'] as const).map((lang) => (
            <Pressable
              key={lang}
              onPress={() => void setLocale(lang)}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 10,
                borderRadius: tokens.radius.sm,
                backgroundColor:
                  locale === lang
                    ? colors.isDark ? 'rgba(76,175,80,0.22)' : 'rgba(46,125,50,0.12)'
                    : colors.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                alignItems: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: locale === lang ? colors.primary : colors.textSecondary,
                }}
              >
                {lang === 'ro' ? '🇷🇴 Română' : '🇬🇧 English'}
              </Text>
            </Pressable>
          ))}
        </View>
      </SettingsGroup>

      {/* Account */}
      <SettingsGroup title="Cont">
        <SettingRow label={t('common.logout')} onPress={() => void logout()} danger />
      </SettingsGroup>

      {/* Developer */}
      <SettingsGroup title="Developer">
        <SettingRow label={t('common.version')} value={version} />
        <SettingRow
          label={t('settings.apiOverride')}
          value={currentUrl.length > 30 ? '…' + currentUrl.slice(-20) : currentUrl}
          onPress={() => setDialogOpen(true)}
        />
      </SettingsGroup>

      <Text
        selectable
        style={{ fontSize: 11, color: colors.textTertiary, textAlign: 'center', paddingTop: 8 }}
      >
        {t('settings.apiHint')}
      </Text>

      <Portal>
        <Dialog visible={dialogOpen} onDismiss={() => setDialogOpen(false)}>
          <Dialog.Title>{t('settings.apiOverride')}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={t('settings.apiInput')}
              value={value}
              onChangeText={setValue}
              autoCapitalize="none"
              autoCorrect={false}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Pressable
              onPress={() => setDialogOpen(false)}
              style={{ paddingHorizontal: 16, paddingVertical: 10 }}
            >
              <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>{t('common.cancel')}</Text>
            </Pressable>
            <Pressable
              onPress={() => void saveOverride()}
              style={{ paddingHorizontal: 16, paddingVertical: 10 }}
            >
              <Text style={{ color: colors.primary, fontWeight: '700' }}>{t('common.save')}</Text>
            </Pressable>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScreenContainer>
  );
}


