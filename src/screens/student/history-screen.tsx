import React, { useCallback, useEffect, useState } from 'react';

import { Button, Card, Chip, Text } from 'react-native-paper';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/i18n/i18n-provider';
import { portalApi } from '@/lib/api/endpoints';
import type { MyHistoryItemResponse } from '@/lib/api/types';
import { formatDateTime, formatTimeRange } from '@/lib/utils/date';

const PAGE_SIZE = 20;

export function StudentHistoryScreen() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<MyHistoryItemResponse[]>([]);
  const [total, setTotal] = useState(0);

  const load = useCallback(
    async (offset = 0) => {
      if (offset === 0) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      try {
        const response = await portalApi.getHistory(PAGE_SIZE, offset);
        setTotal(response.total ?? 0);
        setItems((prev) => (offset === 0 ? response.items : [...prev, ...response.items]));
      } catch (e) {
        setError(e instanceof Error ? e.message : t('common.error'));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [t],
  );

  useEffect(() => {
    void load(0);
  }, [load]);

  if (loading) return <LoadingState />;

  return (
    <ScreenContainer>
      {error ? <ErrorState message={error} onRetry={() => void load(0)} /> : null}
      {!error && items.length === 0 ? <EmptyState title={t('student.history.empty')} /> : null}
      {items.map((item) => (
        <Card key={`${item.sessionId}-${item.startAt}`}>
          <Card.Title
            title={item.title || item.courtName}
            subtitle={`${formatDateTime(item.startAt)} • ${formatTimeRange(item.startAt, item.endAt)}`}
          />
          <Card.Content style={{ gap: 8 }}>
            <Text selectable variant="bodySmall">
              {item.staffName}
            </Text>
            <Chip compact>{item.attendanceStatus ? t(`attendance.${item.attendanceStatus}` as never) : '-'}</Chip>
            <Text selectable variant="bodySmall">
              RPE: {item.rpe ?? '-'} | Load: {item.load ?? '-'}
            </Text>
            <Text selectable variant="bodySmall">
              {item.studentNotes ?? '-'}
            </Text>
          </Card.Content>
        </Card>
      ))}
      {items.length < total ? (
        <Button mode="outlined" onPress={() => void load(items.length)} loading={loadingMore}>
          {t('student.history.loadMore')}
        </Button>
      ) : null}
    </ScreenContainer>
  );
}

