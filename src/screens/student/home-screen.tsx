import React, { useCallback, useEffect, useState } from 'react';

import { Card, Text } from 'react-native-paper';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { SessionCard } from '@/components/session-card';
import { useI18n } from '@/i18n/i18n-provider';
import { portalApi } from '@/lib/api/endpoints';
import type { MyScheduleSessionResponse } from '@/lib/api/types';
import { weekStartIso } from '@/lib/utils/date';

export function StudentHomeScreen() {
  const { t } = useI18n();
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
      <Card>
        <Card.Title title={t('student.home.membership')} />
        <Card.Content>
          <Text selectable variant="bodyMedium">
            {t('student.home.membershipTodo')}
          </Text>
        </Card.Content>
      </Card>

      <Card>
        <Card.Title title={t('student.home.upcoming')} />
        <Card.Content style={{ gap: 8 }}>
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
        </Card.Content>
      </Card>
    </ScreenContainer>
  );
}

