import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Dialog, Portal, Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/i18n/i18n-provider';
import { studentsApi } from '@/lib/api/endpoints';
import type { StudentDto } from '@/lib/api/types';
import { tokens, useColors } from '@/theme';

export function AdminStudentDetailsScreen() {
  const { t } = useI18n();
  const route = useRoute();
  const colors = useColors();
  const id = (route.params as { id: string } | undefined)?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentDto | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await studentsApi.get(id);
      setStudent(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const createAccount = async () => {
    if (!id) return;
    try {
      const res = await studentsApi.createAccount(id);
      setTempPassword(res.temporaryPassword);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    }
  };

  if (loading) return <LoadingState />;

  const isActive = student?.status === 'ACTIVE';

  return (
    <ScreenContainer>
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}

      {student ? (
        <>
          {/* Profile header */}
          <Animated.View entering={FadeInDown.delay(40).springify()}>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: tokens.radius.lg,
                overflow: 'hidden',
                ...colors.shadow,
              }}
            >
              {/* Gradient accent top */}
              <LinearGradient
                colors={tokens.gradient.brand}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 4 }}
              />
              <View style={{ padding: 20, alignItems: 'center', gap: 10 }}>
                {/* Avatar */}
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: tokens.radius.full,
                    backgroundColor: tokens.colors.primaryGreen,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...colors.shadow,
                  }}
                >
                  <Text style={{ fontSize: 26, fontWeight: '700', color: '#FFFFFF' }}>
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '800',
                    color: colors.text,
                    letterSpacing: -0.4,
                    textAlign: 'center',
                  }}
                >
                  {student.firstName} {student.lastName}
                </Text>
                <View
                  style={{
                    backgroundColor: isActive ? tokens.colors.presentBg : '#ECEFF1',
                    borderRadius: tokens.radius.full,
                    paddingHorizontal: 14,
                    paddingVertical: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '700',
                      color: isActive ? tokens.colors.present : '#546E7A',
                    }}
                  >
                    {student.status}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Details card */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: tokens.radius.lg,
                padding: 18,
                gap: 14,
                ...colors.shadowSm,
              }}
            >
              {student.phone ? (
                <View style={{ gap: 3 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: colors.textTertiary,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    Telefon
                  </Text>
                  <Text selectable style={{ fontSize: 15, color: colors.text }}>
                    {student.phone}
                  </Text>
                </View>
              ) : null}
              {student.dateOfBirth ? (
                <View style={{ gap: 3 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: colors.textTertiary,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    Data nasterii
                  </Text>
                  <Text selectable style={{ fontSize: 15, color: colors.text }}>
                    {student.dateOfBirth}
                  </Text>
                </View>
              ) : null}
              {student.notes ? (
                <View style={{ gap: 3 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: colors.textTertiary,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    Note
                  </Text>
                  <Text
                    selectable
                    style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}
                  >
                    {student.notes}
                  </Text>
                </View>
              ) : null}
            </View>
          </Animated.View>

          {/* Create account CTA */}
          <Animated.View entering={FadeInDown.delay(160).springify()}>
            <Pressable
              onPress={() => void createAccount()}
              disabled={Boolean(student.userId)}
              style={({ pressed }) => ({
                borderRadius: tokens.radius.md,
                overflow: 'hidden',
                opacity: pressed || Boolean(student.userId) ? 0.65 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <LinearGradient
                colors={tokens.gradient.brand}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 15, alignItems: 'center' }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#FFFFFF',
                    letterSpacing: 0.2,
                  }}
                >
                  {student.userId ? '✓ ' : ''}
                  {t('admin.students.createAccount')}
                </Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </>
      ) : null}

      <Portal>
        <Dialog visible={Boolean(tempPassword)} onDismiss={() => setTempPassword(null)}>
          <Dialog.Title>{t('admin.students.tempPassword')}</Dialog.Title>
          <Dialog.Content>
            <View
              style={{
                backgroundColor: tokens.colors.presentBg,
                borderRadius: tokens.radius.md,
                padding: 16,
                borderWidth: 1,
                borderColor: tokens.colors.presentBg,
              }}
            >
              <Text
                selectable
                style={{
                  fontSize: 20,
                  fontWeight: '800',
                  color: tokens.colors.present,
                  textAlign: 'center',
                  letterSpacing: 2,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {tempPassword}
              </Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Pressable
              onPress={() => setTempPassword(null)}
              style={({ pressed }) => ({
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: tokens.radius.sm,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontWeight: '700', color: tokens.colors.primaryGreenMid }}>
                {t('common.close')}
              </Text>
            </Pressable>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScreenContainer>
  );
}


