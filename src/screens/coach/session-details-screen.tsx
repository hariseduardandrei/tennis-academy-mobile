import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';

import { Button, Card, Text } from 'react-native-paper';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/i18n/i18n-provider';
import { sessionsApi } from '@/lib/api/endpoints';
import type { SessionDto } from '@/lib/api/types';
import { weekStartIso } from '@/lib/utils/date';

export function CoachSessionDetailsScreen() {
  const { t } = useI18n();
  const route = useRoute();
  const navigation = useNavigation<any>();
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

  return (
    <ScreenContainer>
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {session ? (
        <Card>
          <Card.Title title={session.title || session.court.name} subtitle={session.sessionType} />
          <Card.Content style={{ gap: 8 }}>
            <Text selectable variant="titleMedium">
              {t('coach.details.students')}
            </Text>
            {session.students.length === 0 ? (
              <Text selectable>{t('coach.details.noStudents')}</Text>
            ) : (
              session.students.map((student) => (
                <Text key={student.id} selectable>
                  {student.firstName} {student.lastName}
                </Text>
              ))
            )}
            <Button
              mode="contained"
              onPress={() =>
                navigation.navigate('CoachSessionComplete' as never, { sessionId: session.id } as never)
              }
            >
              {t('coach.details.complete')}
            </Button>
          </Card.Content>
        </Card>
      ) : null}
    </ScreenContainer>
  );
}



