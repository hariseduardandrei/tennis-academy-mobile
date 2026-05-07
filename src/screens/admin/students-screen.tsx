import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/i18n/i18n-provider';
import { studentsApi } from '@/lib/api/endpoints';
import type { StudentDto } from '@/lib/api/types';
import { tokens, useColors } from '@/theme';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#1B5E20',
  INACTIVE: '#757575',
};

function StudentRow({
  student,
  index,
  onPress,
}: {
  student: StudentDto;
  index: number;
  onPress: () => void;
}) {
  const colors = useColors();
  const statusColor = STATUS_COLORS[student.status] ?? '#757575';
  const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();
  const hues = ['#1B5E20', '#01579B', '#4A148C', '#BF360C', '#006064', '#37474F'];
  const avatarBg = hues[index % hues.length];

  return (
    <Animated.View entering={FadeInDown.delay(index * 45).springify()}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          backgroundColor: colors.surface,
          borderRadius: tokens.radius.lg,
          padding: 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          opacity: pressed ? 0.88 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
          ...colors.shadow,
        })}
      >
        {/* Avatar */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: tokens.radius.full,
            backgroundColor: avatarBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>{initials}</Text>
        </View>

        {/* Name + status */}
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
            {student.firstName} {student.lastName}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: tokens.radius.full,
                backgroundColor: statusColor,
              }}
            />
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>{student.status}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 18, color: colors.textTertiary }}>›</Text>
      </Pressable>
    </Animated.View>
  );
}

export function AdminStudentsScreen() {
  const { t } = useI18n();
  const navigation = useNavigation<any>();
  const colors = useColors();
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
      {/* Search bar */}
      <Animated.View entering={FadeInDown.delay(40).springify()}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radius.lg,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 4,
            gap: 10,
            ...colors.shadowSm,
          }}
        >
          <Text style={{ fontSize: 16, color: colors.textTertiary }}>🔍</Text>
          <TextInput
            placeholder={t('common.search')}
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => void load()}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            style={{
              flex: 1,
              height: 44,
              fontSize: 15,
              color: colors.text,
            }}
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')}>
              <Text style={{ fontSize: 16, color: colors.textTertiary }}>✕</Text>
            </Pressable>
          ) : null}
        </View>
      </Animated.View>

      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {!error && students.length === 0 ? <EmptyState title={t('admin.students.empty')} /> : null}

      {students.map((student, index) => (
        <StudentRow
          key={student.id}
          student={student}
          index={index}
          onPress={() => navigation.navigate('AdminStudentDetails' as never, { id: student.id } as never)}
        />
      ))}
    </ScreenContainer>
  );
}

