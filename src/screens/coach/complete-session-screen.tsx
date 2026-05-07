import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';

import {
  Button,
  Card,
  SegmentedButtons,
  Snackbar,
  Text,
  TextInput,
} from 'react-native-paper';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/i18n/i18n-provider';
import { sessionsApi } from '@/lib/api/endpoints';
import type {
  AttendanceStatus,
  CompleteSessionItemRequest,
  SessionMetricItem,
} from '@/lib/api/types';

interface RowState {
  studentId: string;
  firstName: string;
  lastName: string;
  attendanceStatus: AttendanceStatus;
  durationMinutes: string;
  rpe: string;
  internalNotes: string;
  studentNotes: string;
}

function toRow(item: SessionMetricItem): RowState {
  return {
    studentId: item.studentId,
    firstName: item.firstName,
    lastName: item.lastName,
    attendanceStatus: item.attendanceStatus,
    durationMinutes: String(item.durationMinutes ?? ''),
    rpe: item.rpe ? String(item.rpe) : '',
    internalNotes: item.internalNotes ?? '',
    studentNotes: item.studentNotes ?? '',
  };
}

export function CompleteSessionScreen() {
  const { t } = useI18n();
  const route = useRoute();
  const sessionId = (route.params as { sessionId: string } | undefined)?.sessionId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<RowState[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const load = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const metrics = await sessionsApi.getMetrics(sessionId);
      setRows(metrics.items.map(toRow));
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [sessionId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateRow = (studentId: string, patch: Partial<RowState>) => {
    setRows((prev) => prev.map((row) => (row.studentId === studentId ? { ...row, ...patch } : row)));
  };

  const save = async () => {
    if (!sessionId) return;
    setSaving(true);
    setError(null);
    try {
      const items: CompleteSessionItemRequest[] = rows.map((row) => ({
        studentId: row.studentId,
        attendanceStatus: row.attendanceStatus,
        durationMinutes: row.durationMinutes ? Number(row.durationMinutes) : undefined,
        rpe: row.rpe ? Number(row.rpe) : undefined,
        internalNotes: row.internalNotes || undefined,
        studentNotes: row.studentNotes || undefined,
      }));
      await sessionsApi.complete(sessionId, { items });
      setSnackbarOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <ScreenContainer>
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {rows.map((row) => (
        <Card key={row.studentId}>
          <Card.Title title={`${row.firstName} ${row.lastName}`} />
          <Card.Content style={{ gap: 10 }}>
            <Text selectable variant="labelLarge">
              {t('coach.complete.attendance')}
            </Text>
            <SegmentedButtons
              value={row.attendanceStatus}
              onValueChange={(next) =>
                updateRow(row.studentId, { attendanceStatus: next as AttendanceStatus })
              }
              buttons={[
                { value: 'PRESENT', label: t('attendance.PRESENT') },
                { value: 'LATE', label: t('attendance.LATE') },
                { value: 'ABSENT', label: t('attendance.ABSENT') },
              ]}
            />
            <TextInput
              label={t('coach.complete.duration')}
              value={row.durationMinutes}
              keyboardType="numeric"
              onChangeText={(value) => updateRow(row.studentId, { durationMinutes: value })}
            />
            <TextInput
              label={t('coach.complete.rpe')}
              value={row.rpe}
              keyboardType="numeric"
              onChangeText={(value) => updateRow(row.studentId, { rpe: value })}
            />
            <TextInput
              label={t('coach.complete.internalNotes')}
              value={row.internalNotes}
              multiline
              onChangeText={(value) => updateRow(row.studentId, { internalNotes: value })}
            />
            <TextInput
              label={t('coach.complete.studentNotes')}
              value={row.studentNotes}
              multiline
              onChangeText={(value) => updateRow(row.studentId, { studentNotes: value })}
            />
          </Card.Content>
        </Card>
      ))}

      <Button mode="contained" onPress={() => void save()} loading={saving}>
        {t('coach.complete.save')}
      </Button>

      <Snackbar visible={snackbarOpen} onDismiss={() => setSnackbarOpen(false)}>
        {t('coach.complete.saved')}
      </Snackbar>
    </ScreenContainer>
  );
}

