import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';

import { Button, Card, Dialog, Portal, Text } from 'react-native-paper';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/i18n/i18n-provider';
import { studentsApi } from '@/lib/api/endpoints';
import type { StudentDto } from '@/lib/api/types';

export function AdminStudentDetailsScreen() {
  const { t } = useI18n();
  const route = useRoute();
  const id = (route.params as { id: string } | undefined)?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentDto | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await studentsApi.get(id);
      setStudent(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const createAccount = async () => {
    if (!id) return;
    try {
      const res = await studentsApi.createAccount(id);
      setTempPassword(res.temporaryPassword);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    }
  };

  if (loading) return <LoadingState />;

  return (
    <ScreenContainer>
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {student ? (
        <Card>
          <Card.Title title={`${student.firstName} ${student.lastName}`} subtitle={student.status} />
          <Card.Content style={{ gap: 8 }}>
            <Text selectable>{student.phone ?? '-'}</Text>
            <Text selectable>{student.dateOfBirth ?? '-'}</Text>
            <Text selectable>{student.notes ?? '-'}</Text>
            <Button mode="contained" onPress={() => void createAccount()}>
              {t('admin.students.createAccount')}
            </Button>
          </Card.Content>
        </Card>
      ) : null}

      <Portal>
        <Dialog visible={Boolean(tempPassword)} onDismiss={() => setTempPassword(null)}>
          <Dialog.Title>{t('admin.students.tempPassword')}</Dialog.Title>
          <Dialog.Content>
            <Text selectable>{tempPassword}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setTempPassword(null)}>{t('common.close')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScreenContainer>
  );
}

