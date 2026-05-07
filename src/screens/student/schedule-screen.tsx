import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, Card, Text } from 'react-native-paper';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { SessionCard } from '@/components/session-card';
import { useI18n } from '@/i18n/i18n-provider';
import { portalApi } from '@/lib/api/endpoints';
import type { MyScheduleSessionResponse } from '@/lib/api/types';
import { shiftWeek, weekStartIso } from '@/lib/utils/date';

export function StudentScheduleScreen() {
  const { t } = useI18n();
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

  const header = useMemo(
    () => (
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
    ),
    [t],
  );

  if (loading) return <LoadingState />;

  return (
    <ScreenContainer>
      {header}
      <Text selectable variant="titleSmall">
        {weekStart}
      </Text>
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {!error && sessions.length === 0 ? <EmptyState title={t('student.home.empty')} /> : null}
      {sessions.map((session) => (
        <SessionCard
          key={session.sessionId}
          title={session.title}
          startAt={session.startAt}
          endAt={session.endAt}
          court={session.courtName}
          type={session.sessionType}
          subtitle={session.staffName}
        />
      ))}
    </ScreenContainer>
  );
}

