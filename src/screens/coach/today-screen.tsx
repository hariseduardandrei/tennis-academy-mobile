import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

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

export function CoachTodayScreen() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
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

  return (
    <ScreenContainer>
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
          subtitle={`${session.students.length} ${t('nav.students')}`}
          onPress={() =>
            navigation.navigate('CoachSessionDetails' as never, { sessionId: session.id } as never)
          }
        />
      ))}
    </ScreenContainer>
  );
}



