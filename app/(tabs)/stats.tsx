import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ScreenContainer } from '@/components/screen-container';
import { StatCard } from '@/components/stat-card';
import { AppTheme } from '@/constants/theme';

export default function StatsScreen() {
  return (
    <ScreenContainer
      title="Stats"
      subtitle="Daily totals, streaks, and weekly trends will be derived from saved sessions in phase 4."
      contentContainerStyle={styles.content}>
      <View style={styles.grid}>
        <StatCard label="Focus time today" value="0h 00m" helper="Waiting for first session" />
        <StatCard label="Sessions today" value="0" helper="Completed focus blocks" />
        <StatCard label="Current streak" value="0 days" helper="Built from daily activity" />
      </View>
      <EmptyState
        title="Weekly chart coming in phase 4"
        description="Once sessions are stored locally, this screen can calculate trends instead of showing placeholders."
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: AppTheme.spacing.md,
  },
  grid: {
    gap: AppTheme.spacing.md,
  },
});
