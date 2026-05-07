import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { SessionCard } from '@/components/session-card';
import { useI18n } from '@/i18n/i18n-provider';
import { portalApi } from '@/lib/api/endpoints';
import type { MyScheduleSessionResponse } from '@/lib/api/types';
import { weekStartIso } from '@/lib/utils/date';
import { tokens, useColors } from '@/theme';

function SectionHeader({ title, count }: { title: string; count?: number }) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 2 }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase' }}>
        {title}
      </Text>
      {count !== undefined ? (
        <View
          style={{
            backgroundColor: colors.isDark ? tokens.colors.primaryGreen + '33' : tokens.colors.primaryGreenMid + '18',
            borderRadius: tokens.radius.full,
            paddingHorizontal: 7,
            paddingVertical: 2,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary }}>{count}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function StudentHomeScreen() {
  const { t } = useI18n();
  const colors = useColors();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<MyScheduleSessionResponse[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const week = await portalApi.getScheduleWeek(weekStartIso());
      const sorted = [...(week.sessions ?? [])].sort((a, b) => a.startAt.localeCompare(b.startAt));
      setSessions(sorted.slice(0, 6));
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState />;

  return (
    <ScreenContainer>
      {/* Membership banner card */}
      <Animated.View entering={FadeInDown.delay(40).springify()}>
        <LinearGradient
          colors={colors.isDark ? tokens.gradient.darkCard : tokens.gradient.greenSoft}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: tokens.radius.lg,
            padding: 18,
            borderWidth: 1,
            borderColor: colors.isDark ? tokens.colors.borderDark : tokens.colors.presentBg,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: tokens.radius.md,
              backgroundColor: colors.isDark ? 'rgba(76,175,80,0.22)' : 'rgba(46,125,50,0.12)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 22 }}>🏆</Text>
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>
              {t('student.home.membership')}
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 17 }}>
              {t('student.home.membershipTodo')}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Upcoming sessions */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={{ gap: 10 }}>
        <SectionHeader title={t('student.home.upcoming')} count={sessions.length} />

        {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
        {!error && sessions.length === 0 ? <EmptyState title={t('student.home.empty')} /> : null}

        {sessions.map((session, index) => (
          <Animated.View key={session.sessionId} entering={FadeInDown.delay(140 + index * 55).springify()}>
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
      </Animated.View>
    </ScreenContainer>
  );
}

