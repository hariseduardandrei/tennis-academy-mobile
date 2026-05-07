import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ScreenContainer } from '@/components/screen-container';
import { useI18n } from '@/i18n/i18n-provider';
import { portalApi } from '@/lib/api/endpoints';
import type { MyHistoryItemResponse } from '@/lib/api/types';
import { formatDateTime, formatTimeRange } from '@/lib/utils/date';
import { attendanceStyle, sessionTypeStyle, tokens, useColors } from '@/theme';

const PAGE_SIZE = 20;

function HistoryItem({ item, index }: { item: MyHistoryItemResponse; index: number }) {
  const colors = useColors();
  const { t } = useI18n();
  const attendance = attendanceStyle(item.attendanceStatus, colors.isDark);
  const typeStyle = sessionTypeStyle(item.sessionType, colors.isDark);

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: tokens.radius.lg,
          flexDirection: 'row',
          overflow: 'hidden',
          ...colors.shadow,
        }}
      >
        {/* Left attendance colour bar */}
        <View style={{ width: 4, backgroundColor: attendance.color }} />

        <View style={{ flex: 1, padding: 14, gap: 6 }}>
          {/* Header row: title + datetime */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <Text
              numberOfLines={1}
              style={{ flex: 1, fontSize: 15, fontWeight: '700', color: colors.text, letterSpacing: -0.2 }}
            >
              {item.title || item.courtName}
            </Text>
            {item.attendanceStatus ? (
              <View
                style={{
                  backgroundColor: attendance.bg,
                  borderRadius: tokens.radius.full,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: attendance.color }}>
                  {t(`attendance.${item.attendanceStatus}` as never)}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Date + time */}
          <Text style={{ fontSize: 12, color: colors.textSecondary, fontVariant: ['tabular-nums'] }}>
            {formatDateTime(item.startAt)} · {formatTimeRange(item.startAt, item.endAt)}
          </Text>

          {/* Staff */}
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>{item.staffName}</Text>

          {/* Metrics row */}
          {(item.rpe ?? item.load) ? (
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 2 }}>
              {item.rpe ? (
                <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, color: colors.textTertiary, fontWeight: '600' }}>RPE</Text>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] }}>
                    {item.rpe}
                  </Text>
                </View>
              ) : null}
              {item.load ? (
                <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, color: colors.textTertiary, fontWeight: '600' }}>Load</Text>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] }}>
                    {item.load}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* Student notes */}
          {item.studentNotes ? (
            <View
              style={{
                marginTop: 4,
                padding: 10,
                backgroundColor: colors.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                borderRadius: tokens.radius.sm,
                borderLeftWidth: 3,
                borderLeftColor: typeStyle.accent,
              }}
            >
              <Text selectable style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 17 }}>
                {item.studentNotes}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
}

export function StudentHistoryScreen() {
  const { t } = useI18n();
  const colors = useColors();
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

      {items.map((item, index) => (
        <HistoryItem key={`${item.sessionId}-${item.startAt}`} item={item} index={index} />
      ))}

      {items.length < total ? (
        <Pressable
          onPress={() => void load(items.length)}
          disabled={loadingMore}
          style={({ pressed }) => ({
            paddingVertical: 13,
            borderRadius: tokens.radius.md,
            backgroundColor: colors.surface,
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: colors.isDark ? 'rgba(76,175,80,0.35)' : 'rgba(46,125,50,0.2)',
            opacity: pressed || loadingMore ? 0.7 : 1,
            ...colors.shadowSm,
          })}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary }}>
            {loadingMore ? '...' : t('student.history.loadMore')}
          </Text>
        </Pressable>
      ) : null}
    </ScreenContainer>
  );
}
