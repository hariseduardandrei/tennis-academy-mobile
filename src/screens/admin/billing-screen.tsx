import React, { useCallback, useEffect, useState } from 'react';

import { Button, Card, SegmentedButtons, Text } from 'react-native-paper';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/i18n/i18n-provider';
import { billingApi } from '@/lib/api/endpoints';
import type { BillingStudentRow, MembershipStatus } from '@/lib/api/types';
import { monthYearFromNow } from '@/lib/utils/date';

export function AdminBillingScreen() {
  const { t } = useI18n();
  const { year: initialYear, month: initialMonth } = monthYearFromNow();
  const [year] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [tab, setTab] = useState<'month' | 'overdue'>('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<BillingStudentRow[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data =
        tab === 'month' ? await billingApi.getMonth(year, month) : await billingApi.getOverdue(year, month);
      setRows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [month, tab, t, year]);

  useEffect(() => {
    void load();
  }, [load]);

  const patchStatus = async (studentId: string, status: MembershipStatus) => {
    await billingApi.patchMonth(studentId, year, month, status);
    await load();
  };

  if (loading) return <LoadingState />;

  return (
    <ScreenContainer>
      <Card>
        <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
          <Button mode="outlined" onPress={() => setMonth((m) => (m === 1 ? 12 : m - 1))}>
            {t('common.previous')}
          </Button>
          <Text selectable>{`${month}/${year}`}</Text>
          <Button mode="outlined" onPress={() => setMonth((m) => (m === 12 ? 1 : m + 1))}>
            {t('common.next')}
          </Button>
        </Card.Content>
        <Card.Content>
          <SegmentedButtons
            value={tab}
            onValueChange={(next) => setTab(next as 'month' | 'overdue')}
            buttons={[
              { value: 'month', label: t('admin.billing.month') },
              { value: 'overdue', label: t('admin.billing.overdue') },
            ]}
          />
        </Card.Content>
      </Card>

      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {!error && rows.length === 0 ? <EmptyState title={t('admin.billing.empty')} /> : null}

      {rows.map((row) => (
        <Card key={row.studentId}>
          <Card.Title title={`${row.firstName} ${row.lastName}`} subtitle={`${row.status}`} />
          <Card.Content style={{ gap: 8 }}>
            <Text selectable>
              {row.amount ?? '-'} RON | {row.dueDate ?? '-'}
            </Text>
            <Button mode="outlined" onPress={() => void patchStatus(row.studentId, 'PAID')}>
              {t('admin.billing.markPaid')}
            </Button>
            <Button mode="outlined" onPress={() => void patchStatus(row.studentId, 'DUE')}>
              {t('admin.billing.markDue')}
            </Button>
            <Button mode="outlined" onPress={() => void patchStatus(row.studentId, 'WAIVED')}>
              {t('admin.billing.markWaived')}
            </Button>
          </Card.Content>
        </Card>
      ))}
    </ScreenContainer>
  );
}


