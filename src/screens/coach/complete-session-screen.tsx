import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Snackbar, Text, TextInput } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/i18n/i18n-provider';
import { sessionsApi } from '@/lib/api/endpoints';
import type { AttendanceStatus, CompleteSessionItemRequest, SessionMetricItem } from '@/lib/api/types';
import { attendanceStyle, tokens, useColors } from '@/theme';

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

function AttendancePicker({
  value,
  onChange,
}: {
  value: AttendanceStatus;
  onChange: (v: AttendanceStatus) => void;
}) {
  const colors = useColors();
  const { t } = useI18n();
  const options: AttendanceStatus[] = ['PRESENT', 'LATE', 'ABSENT'];

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {options.map((opt) => {
        const style = attendanceStyle(opt, colors.isDark);
        const isActive = value === opt;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 10,
              borderRadius: tokens.radius.sm,
              backgroundColor: isActive ? style.color : colors.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
              alignItems: 'center',
              borderWidth: isActive ? 0 : 1,
              borderColor: colors.border,
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: isActive ? '#FFFFFF' : colors.textSecondary,
              }}
            >
              {t(`attendance.${opt}` as never)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function CompleteSessionScreen() {
  const { t } = useI18n();
  const route = useRoute();
  const colors = useColors();
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

      {rows.map((row, index) => (
        <Animated.View key={row.studentId} entering={FadeInDown.delay(index * 80).springify()}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: tokens.radius.lg,
              overflow: 'hidden',
              ...colors.shadow,
            }}
          >
            {/* Student header */}
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: colors.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: tokens.radius.full,
                  backgroundColor: tokens.colors.primaryGreen,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>
                  {row.firstName[0]}{row.lastName[0]}
                </Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                {row.firstName} {row.lastName}
              </Text>
            </View>

            {/* Form fields */}
            <View style={{ padding: 16, gap: 14 }}>
              {/* Attendance */}
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  {t('coach.complete.attendance')}
                </Text>
                <AttendancePicker
                  value={row.attendanceStatus}
                  onChange={(v) => updateRow(row.studentId, { attendanceStatus: v })}
                />
              </View>

              {/* Duration + RPE in a row */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <TextInput
                    label={t('coach.complete.duration')}
                    value={row.durationMinutes}
                    keyboardType="numeric"
                    mode="outlined"
                    outlineStyle={{ borderRadius: tokens.radius.md }}
                    onChangeText={(value) => updateRow(row.studentId, { durationMinutes: value })}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    label={t('coach.complete.rpe')}
                    value={row.rpe}
                    keyboardType="numeric"
                    mode="outlined"
                    outlineStyle={{ borderRadius: tokens.radius.md }}
                    onChangeText={(value) => updateRow(row.studentId, { rpe: value })}
                  />
                </View>
              </View>

              {/* Internal notes */}
              <TextInput
                label={t('coach.complete.internalNotes')}
                value={row.internalNotes}
                multiline
                numberOfLines={2}
                mode="outlined"
                outlineStyle={{ borderRadius: tokens.radius.md }}
                onChangeText={(value) => updateRow(row.studentId, { internalNotes: value })}
              />

              {/* Student notes */}
              <TextInput
                label={t('coach.complete.studentNotes')}
                value={row.studentNotes}
                multiline
                numberOfLines={2}
                mode="outlined"
                outlineStyle={{ borderRadius: tokens.radius.md }}
                onChangeText={(value) => updateRow(row.studentId, { studentNotes: value })}
              />
            </View>
          </View>
        </Animated.View>
      ))}

      {/* Save button */}
      <Pressable
        onPress={() => void save()}
        disabled={saving}
        style={({ pressed }) => ({
          borderRadius: tokens.radius.md,
          overflow: 'hidden',
          opacity: pressed || saving ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          marginTop: 8,
        })}
      >
        <LinearGradient
          colors={tokens.gradient.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ paddingVertical: 15, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 }}>
            {saving ? '...' : t('coach.complete.save')}
          </Text>
        </LinearGradient>
      </Pressable>

      <Snackbar visible={snackbarOpen} onDismiss={() => setSnackbarOpen(false)}>
        {t('coach.complete.saved')}
      </Snackbar>
    </ScreenContainer>
  );
}
