import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
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
import { nowInAcademyTz, weekStartIso } from '@/lib/utils/date';
import { tokens, useColors } from '@/theme';

export function CoachTodayScreen() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const colors = useColors();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionDto[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await sessionsApi.listWeek(weekStartIso());
      const today = nowInAcademyTz().toISODate();
      const filtered = all.filter((s) => s.startAt.slice(0, 10) === today);
      const mine = filtered.filter((s) => {
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
  }, [t, user]);

  useEffect(() => {
    void load();
  }, [load]);

  const sorted = useMemo(() => [...sessions].sort((a, b) => a.startAt.localeCompare(b.startAt)), [sessions]);

  if (loading) return <LoadingState />;

  const today = nowInAcademyTz();
  const dateLabel = today.toFormat('cccc, d MMMM', { locale: 'ro' });

  return (
    <ScreenContainer>
      {/* Date header card */}
      <Animated.View entering={FadeInDown.delay(40).springify()}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radius.lg,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...colors.shadowSm,
          }}
        >
          <View style={{ gap: 2 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              {t('coach.today.title')}
            </Text>
            <Text style={{ fontSize: 17, fontWeight: '800', color: colors.text, letterSpacing: -0.3 }}>
              {dateLabel}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: colors.isDark ? 'rgba(76,175,80,0.18)' : 'rgba(46,125,50,0.09)',
              borderRadius: tokens.radius.sm,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.primary, fontVariant: ['tabular-nums'] }}>
              {sorted.length}
            </Text>
          </View>
        </View>
      </Animated.View>

      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {!error && sorted.length === 0 ? <EmptyState title={t('coach.today.empty')} /> : null}

      {sorted.map((session, index) => (
        <Animated.View key={session.id} entering={FadeInDown.delay(80 + index * 60).springify()}>
          <SessionCard
            title={session.title}
            startAt={session.startAt}
            endAt={session.endAt}
            court={session.court.name}
            type={session.sessionType}
            subtitle={`${session.students.length} ${t('nav.students')}`}
            onPress={() =>
              navigation.navigate('CoachSessionDetails' as never, { sessionId: session.id } as never)
            }
          />
        </Animated.View>
      ))}
    </ScreenContainer>
  );
}

