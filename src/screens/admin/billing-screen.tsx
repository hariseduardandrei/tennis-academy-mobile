import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/i18n/i18n-provider';
import { billingApi } from '@/lib/api/endpoints';
import type { BillingStudentRow, MembershipStatus } from '@/lib/api/types';
import { monthYearFromNow } from '@/lib/utils/date';
import { billingStyle, tokens, useColors } from '@/theme';

function TabPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        paddingVertical: 10,
        borderRadius: tokens.radius.sm,
        backgroundColor: active
          ? colors.isDark ? 'rgba(76,175,80,0.22)' : 'rgba(46,125,50,0.12)'
          : 'transparent',
        alignItems: 'center',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: '700',
          color: active ? colors.primary : colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function StatusButton({
  label,
  color,
  onPress,
}: {
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        paddingVertical: 8,
        borderRadius: tokens.radius.sm,
        backgroundColor: color + '1A',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: color + '40',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ fontSize: 12, fontWeight: '700', color }}>{label}</Text>
    </Pressable>
  );
}

export function AdminBillingScreen() {
  const { t } = useI18n();
  const colors = useColors();
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

  const monthNames = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <ScreenContainer>
      {/* Month navigator */}
      <Animated.View entering={FadeInDown.delay(40).springify()}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radius.lg,
            padding: 12,
            gap: 12,
            ...colors.shadowSm,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <Pressable
              onPress={() => setMonth((m) => (m === 1 ? 12 : m - 1))}
              style={({ pressed }) => ({
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: tokens.radius.sm,
                backgroundColor: colors.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary }}>←</Text>
            </Pressable>

            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, letterSpacing: -0.3, fontVariant: ['tabular-nums'] }}>
                {monthNames[month - 1]} {year}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textTertiary }}>{t('admin.billing.title')}</Text>
            </View>

            <Pressable
              onPress={() => setMonth((m) => (m === 12 ? 1 : m + 1))}
              style={({ pressed }) => ({
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: tokens.radius.sm,
                backgroundColor: colors.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary }}>→</Text>
            </Pressable>
          </View>

          {/* Tab toggle */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              borderRadius: tokens.radius.sm,
              padding: 4,
            }}
          >
            <TabPill label={t('admin.billing.month')} active={tab === 'month'} onPress={() => setTab('month')} />
            <TabPill label={t('admin.billing.overdue')} active={tab === 'overdue'} onPress={() => setTab('overdue')} />
          </View>
        </View>
      </Animated.View>

      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {!error && rows.length === 0 ? <EmptyState title={t('admin.billing.empty')} /> : null}

      {rows.map((row, index) => {
        const st = billingStyle(row.status, colors.isDark);
        return (
          <Animated.View key={row.studentId} entering={FadeInDown.delay(80 + index * 50).springify()}>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: tokens.radius.lg,
                overflow: 'hidden',
                ...colors.shadow,
              }}
            >
              {/* Left status bar */}
              <View style={{ height: 3, backgroundColor: st.color }} />
              <View style={{ padding: 14, gap: 10 }}>
                {/* Name + status */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                    {row.firstName} {row.lastName}
                  </Text>
                  <View
                    style={{
                      backgroundColor: st.bg,
                      borderRadius: tokens.radius.full,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '700', color: st.color }}>{row.status}</Text>
                  </View>
                </View>

                {/* Amount + date */}
                {(row.amount ?? row.dueDate) ? (
                  <Text style={{ fontSize: 13, color: colors.textSecondary, fontVariant: ['tabular-nums'] }}>
                    {row.amount ? `${row.amount} RON` : ''}
                    {row.amount && row.dueDate ? '  ·  ' : ''}
                    {row.dueDate ?? ''}
                  </Text>
                ) : null}

                {/* Action buttons */}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <StatusButton
                    label={t('admin.billing.markPaid')}
                    color={tokens.colors.paid}
                    onPress={() => void patchStatus(row.studentId, 'PAID')}
                  />
                  <StatusButton
                    label={t('admin.billing.markDue')}
                    color={tokens.colors.due}
                    onPress={() => void patchStatus(row.studentId, 'DUE')}
                  />
                  <StatusButton
                    label={t('admin.billing.markWaived')}
                    color={tokens.colors.waived}
                    onPress={() => void patchStatus(row.studentId, 'WAIVED')}
                  />
                </View>
              </View>
            </View>
          </Animated.View>
        );
      })}
    </ScreenContainer>
  );
}

