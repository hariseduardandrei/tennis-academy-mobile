import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { SessionCard } from '@/components/session-card';
import { useI18n } from '@/i18n/i18n-provider';
import { portalApi } from '@/lib/api/endpoints';
import type { MyScheduleSessionResponse } from '@/lib/api/types';
import { shiftWeek, weekStartIso } from '@/lib/utils/date';
import { tokens, useColors } from '@/theme';

function WeekNavigator({
  weekStart,
  onPrev,
  onToday,
  onNext,
}: {
  weekStart: string;
  onPrev: () => void;
  onToday: () => void;
  onNext: () => void;
}) {
  const colors = useColors();
  const { t } = useI18n();

  return (
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
        onPress={onPrev}
        style={({ pressed }) => ({
          flex: 1,
          paddingVertical: 9,
          borderRadius: tokens.radius.sm,
          backgroundColor: colors.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
          alignItems: 'center',
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>← {t('common.previous')}</Text>
      </Pressable>

      <Pressable
        onPress={onToday}
        style={({ pressed }) => ({
          paddingHorizontal: 12,
          paddingVertical: 9,
          borderRadius: tokens.radius.sm,
          backgroundColor: colors.isDark ? 'rgba(76,175,80,0.18)' : 'rgba(46,125,50,0.09)',
          alignItems: 'center',
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>{t('common.today')}</Text>
      </Pressable>

      <Pressable
        onPress={onNext}
        style={({ pressed }) => ({
          flex: 1,
          paddingVertical: 9,
          borderRadius: tokens.radius.sm,
          backgroundColor: colors.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
          alignItems: 'center',
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>{t('common.next')} →</Text>
      </Pressable>
    </View>
  );
}

export function StudentScheduleScreen() {
  const { t } = useI18n();
  const colors = useColors();
  const [weekStart, setWeekStart] = useState(weekStartIso());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<MyScheduleSessionResponse[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const week = await portalApi.getScheduleWeek(weekStart);
      setSessions([...(week.sessions ?? [])].sort((a, b) => a.startAt.localeCompare(b.startAt)));
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [t, weekStart]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState />;

  return (
    <ScreenContainer>
      <Animated.View entering={FadeInDown.delay(40).springify()}>
        <WeekNavigator
          weekStart={weekStart}
          onPrev={() => setWeekStart((prev) => shiftWeek(prev, -1))}
          onToday={() => setWeekStart(weekStartIso())}
          onNext={() => setWeekStart((prev) => shiftWeek(prev, 1))}
        />
      </Animated.View>

      <Text
        selectable
        style={{ fontSize: 12, color: colors.textTertiary, paddingHorizontal: 2, fontVariant: ['tabular-nums'] }}
      >
        {weekStart}
      </Text>

      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {!error && sessions.length === 0 ? <EmptyState title={t('student.home.empty')} /> : null}

      {sessions.map((session, index) => (
        <Animated.View key={session.sessionId} entering={FadeInDown.delay(80 + index * 55).springify()}>
          <SessionCard
            title={session.title}
            startAt={session.startAt}
            endAt={session.endAt}
            court={session.courtName}
            type={session.sessionType}
            subtitle={session.staffName}
          />
        </Animated.View>
      ))}
    </ScreenContainer>
  );
}


