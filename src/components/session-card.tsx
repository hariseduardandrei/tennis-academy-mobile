import React from 'react';

import { Card, Chip, Text } from 'react-native-paper';

import type { SessionType } from '@/lib/api/types';
import { formatTimeRange } from '@/lib/utils/date';

export function SessionCard({
  title,
  startAt,
  endAt,
  court,
  type,
  onPress,
  subtitle,
}: {
  title?: string;
  startAt: string;
  endAt: string;
  court: string;
  type: SessionType;
  subtitle?: string;
  onPress?: () => void;
}) {
  return (
    <Card mode="contained" onPress={onPress}>
      <Card.Title title={title || court} subtitle={formatTimeRange(startAt, endAt)} />
      <Card.Content style={{ gap: 8 }}>
        <Chip compact>{type}</Chip>
        <Text selectable variant="bodySmall">
          {court}
        </Text>
        {subtitle ? (
          <Text selectable variant="bodySmall">
            {subtitle}
          </Text>
        ) : null}
      </Card.Content>
    </Card>
  );
}

