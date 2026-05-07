import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/i18n/i18n-provider';
import { sessionsApi } from '@/lib/api/endpoints';
import type { SessionDto } from '@/lib/api/types';
import { formatTimeRange } from '@/lib/utils/date';
import { weekStartIso } from '@/lib/utils/date';
import { sessionTypeStyle, tokens, useColors } from '@/theme';

function StudentAvatar({ name, index }: { name: string; index: number }) {
  const colors = useColors();
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const hues = ['#1B5E20', '#01579B', '#4A148C', '#BF360C', '#006064'];
  const bg = hues[index % hues.length];

  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: tokens.radius.full,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.surface,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>{initials}</Text>
    </View>
  );
}

export function CoachSessionDetailsScreen() {
  const { t } = useI18n();
  const route = useRoute();
  const navigation = useNavigation<any>();
  const colors = useColors();
  const sessionId = (route.params as { sessionId: string } | undefined)?.sessionId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<SessionDto | null>(null);

  const load = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const weekData = await sessionsApi.listWeek(weekStartIso());
      const found = weekData.find((item) => item.id === sessionId) ?? null;
      setSession(found);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [sessionId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState />;

  if (!session) {
    return (
      <ScreenContainer>
        {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      </ScreenContainer>
    );
  }

  const typeStyle = sessionTypeStyle(session.sessionType, colors.isDark);

  return (
    <ScreenContainer>
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}

      {/* Session header card */}
      <Animated.View entering={FadeInDown.delay(40).springify()}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radius.lg,
            overflow: 'hidden',
            ...colors.shadow,
          }}
        >
          <View style={{ height: 4, backgroundColor: typeStyle.accent }} />
          <View style={{ padding: 18, gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, letterSpacing: -0.4, flex: 1 }}>
                {session.title || session.court.name}
              </Text>
              <View
                style={{
                  backgroundColor: typeStyle.bg,
                  borderRadius: tokens.radius.full,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: typeStyle.accent }}>
                  {session.sessionType}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 16 }}>
              <View style={{ gap: 2 }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  Orar
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] }}>
                  {formatTimeRange(session.startAt, session.endAt)}
                </Text>
              </View>
              <View style={{ gap: 2 }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  Teren
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>{session.court.name}</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Students section */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={{ gap: 10 }}>
        <Text
          style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase', paddingHorizontal: 2 }}
        >
          {t('coach.details.students')} ({session.students.length})
        </Text>

        {session.students.length === 0 ? (
          <Text style={{ fontSize: 14, color: colors.textSecondary, paddingHorizontal: 2 }}>
            {t('coach.details.noStudents')}
          </Text>
        ) : (
          session.students.map((student, index) => (
            <Animated.View key={student.id} entering={FadeInDown.delay(140 + index * 50).springify()}>
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: tokens.radius.md,
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  ...colors.shadowSm,
                }}
              >
                <StudentAvatar name={`${student.firstName} ${student.lastName}`} index={index} />
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>
                  {student.firstName} {student.lastName}
                </Text>
              </View>
            </Animated.View>
          ))
        )}
      </Animated.View>

      {/* Complete session CTA */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <Pressable
          onPress={() =>
            navigation.navigate('CoachSessionComplete' as never, { sessionId: session.id } as never)
          }
          style={({ pressed }) => ({
            borderRadius: tokens.radius.md,
            overflow: 'hidden',
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            marginTop: 8,
          })}
        >
          <LinearGradient
            colors={tokens.gradient.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingVertical: 15, alignItems: 'center' }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 }}>
              {t('coach.details.complete')}
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </ScreenContainer>
  );
}

