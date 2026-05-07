import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

import type { SessionType } from '@/lib/api/types';
import { formatTimeRange } from '@/lib/utils/date';
import { sessionTypeStyle, tokens, useColors } from '@/theme';

interface SessionCardProps {
  title?: string;
  startAt: string;
  endAt: string;
  court: string;
  type: SessionType;
  subtitle?: string;
  onPress?: () => void;
}

export function SessionCard({ title, startAt, endAt, court, type, onPress, subtitle }: SessionCardProps) {
  const colors = useColors();
  const typeStyle = sessionTypeStyle(type, colors.isDark);
  const timeStr = formatTimeRange(startAt, endAt);
  const displayTitle = title || court;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.94 : 1,
        transform: [{ scale: pressed ? 0.988 : 1 }],
      })}
    >
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: tokens.radius.lg,
          flexDirection: 'row',
          overflow: 'hidden',
          ...colors.shadow,
        }}
      >
        {/* Left accent bar */}
        <View style={{ width: 4, backgroundColor: typeStyle.accent }} />

        {/* Content */}
        <View style={{ flex: 1, padding: 14, gap: 6 }}>
          {/* Title row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <Text
              numberOfLines={1}
              style={{ flex: 1, fontSize: 15, fontWeight: '700', color: colors.text, letterSpacing: -0.2 }}
            >
              {displayTitle}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, fontVariant: ['tabular-nums'] }}>
              {timeStr}
            </Text>
          </View>

          {/* Court + subtext row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 12, color: colors.textSecondary }} numberOfLines={1}>
              {court}
            </Text>
            {subtitle ? (
              <>
                <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: colors.textTertiary }} />
                <Text style={{ fontSize: 12, color: colors.textSecondary, flex: 1 }} numberOfLines={1}>
                  {subtitle}
                </Text>
              </>
            ) : null}
          </View>

          {/* Type badge */}
          <View style={{ flexDirection: 'row', marginTop: 2 }}>
            <View
              style={{
                backgroundColor: typeStyle.bg,
                borderRadius: tokens.radius.full,
                paddingHorizontal: 9,
                paddingVertical: 3,
                alignSelf: 'flex-start',
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: typeStyle.accent, letterSpacing: 0.3 }}>
                {type}
              </Text>
            </View>
          </View>
        </View>

        {/* Chevron if pressable */}
        {onPress ? (
          <View style={{ justifyContent: 'center', paddingRight: 14, paddingLeft: 4 }}>
            <Text style={{ fontSize: 16, color: colors.textTertiary }}>›</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
