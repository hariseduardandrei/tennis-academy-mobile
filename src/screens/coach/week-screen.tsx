import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { SessionCard } from '@/components/session-card';
import { useI18n } from '@/i18n/i18n-provider';
import { sessionsApi } from '@/lib/api/endpoints';
import type { SessionDto } from '@/lib/api/types';
import { useAuth } from '@/lib/auth/auth-context';
import { shiftWeek, weekStartIso } from '@/lib/utils/date';
import { tokens, useColors } from '@/theme';

export function CoachWeekScreen() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const colors = useColors();
  const [weekStart, setWeekStart] = useState(weekStartIso());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionDto[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await sessionsApi.listWeek(weekStart);
      const mine = all.filter((s) => {
        if (!user) return false;
        if (user.role === 'ADMIN') return true;
        return s.staffUser.id === user.id;
      });
      setSessions(mine);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [t, user, weekStart]);

  useEffect(() => {
    void load();
  }, [load]);

  const sorted = useMemo(() => [...sessions].sort((a, b) => a.startAt.localeCompare(b.startAt)), [sessions]);

  if (loading) return <LoadingState />;

  return (
    <ScreenContainer>
      {/* Week navigator */}
      <Animated.View entering={FadeInDown.delay(40).springify()}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radius.lg,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            ...colors.shadowSm,
          }}
        >
          <Pressable
            onPress={() => setWeekStart((prev) => shiftWeek(prev, -1))}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 9,
              borderRadius: tokens.radius.sm,
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
              alignItems: 'center',
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>
              ← {t('common.previous')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setWeekStart(weekStartIso())}
            style={({ pressed }) => ({
              paddingHorizontal: 12,
              paddingVertical: 9,
              borderRadius: tokens.radius.sm,
              backgroundColor: colors.isDark ? 'rgba(76,175,80,0.18)' : 'rgba(46,125,50,0.09)',
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>{t('common.today')}</Text>
          </Pressable>
          <Pressable
            onPress={() => setWeekStart((prev) => shiftWeek(prev, 1))}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 9,
              borderRadius: tokens.radius.sm,
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
              alignItems: 'center',
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>
              {t('common.next')} →
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      <Text
        selectable
        style={{
          fontSize: 12,
          color: colors.textTertiary,
          paddingHorizontal: 2,
          fontVariant: ['tabular-nums'],
        }}
      >
        {weekStart}
      </Text>

      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {!error && sorted.length === 0 ? <EmptyState title={t('coach.today.empty')} /> : null}

      {sorted.map((session, index) => (
        <Animated.View key={session.id} entering={FadeInDown.delay(80 + index * 55).springify()}>
          <SessionCard
            title={session.title}
            startAt={session.startAt}
            endAt={session.endAt}
            court={session.court.name}
            type={session.sessionType}
            onPress={() =>
              navigation.navigate('CoachSessionDetails' as never, { sessionId: session.id } as never)
            }
          />
        </Animated.View>
      ))}
    </ScreenContainer>
  );
}

