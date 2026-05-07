import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';

import { Card, Searchbar } from 'react-native-paper';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/i18n/i18n-provider';
import { studentsApi } from '@/lib/api/endpoints';
import type { StudentDto } from '@/lib/api/types';

export function AdminStudentsScreen() {
  const { t } = useI18n();
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentDto[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await studentsApi.list({ search: query || undefined });
      setStudents(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [query, t]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState />;

  return (
    <ScreenContainer>
      <Searchbar value={query} onChangeText={setQuery} onSubmitEditing={() => void load()} />

      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {!error && students.length === 0 ? <EmptyState title={t('admin.students.empty')} /> : null}
      {students.map((student) => (
        <Card
          key={student.id}
          onPress={() => navigation.navigate('AdminStudentDetails' as never, { id: student.id } as never)}
        >
          <Card.Title
            title={`${student.firstName} ${student.lastName}`}
            subtitle={student.status}
          />
        </Card>
      ))}
    </ScreenContainer>
  );
}


