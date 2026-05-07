import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, Card, Text } from 'react-native-paper';

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

export function CoachWeekScreen() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
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
      <Card>
        <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
          <Button mode="outlined" onPress={() => setWeekStart((prev) => shiftWeek(prev, -1))}>
            {t('common.previous')}
          </Button>
          <Button mode="text" onPress={() => setWeekStart(weekStartIso())}>
            {t('common.today')}
          </Button>
          <Button mode="outlined" onPress={() => setWeekStart((prev) => shiftWeek(prev, 1))}>
            {t('common.next')}
          </Button>
        </Card.Content>
      </Card>

      <Text selectable variant="titleSmall">
        {weekStart}
      </Text>
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {!error && sorted.length === 0 ? <EmptyState title={t('coach.today.empty')} /> : null}
      {sorted.map((session) => (
        <SessionCard
          key={session.id}
          title={session.title}
          startAt={session.startAt}
          endAt={session.endAt}
          court={session.court.name}
          type={session.sessionType}
          onPress={() =>
            navigation.navigate('CoachSessionDetails' as never, { sessionId: session.id } as never)
          }
        />
      ))}
    </ScreenContainer>
  );
}


