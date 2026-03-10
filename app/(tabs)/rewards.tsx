import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ScreenContainer } from '@/components/screen-container';
import { StatCard } from '@/components/stat-card';
import { AppTheme } from '@/constants/theme';

export default function RewardsScreen() {
  return (
    <ScreenContainer
      title="Rewards"
      subtitle="This stays intentionally lightweight for v1. Full reward mechanics are deferred to v2."
      contentContainerStyle={styles.content}>
      <View style={styles.badgeRow}>
        <StatCard label="First sprout" value="Seed badge" helper="Example reward tile" />
        <StatCard label="Dill streak" value="3 days" helper="Example milestone tile" />
      </View>
      <EmptyState
        title="More rewards are coming soon"
        description="Gamification should wait until the timer, tasks, and stats flows are solid."
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: AppTheme.spacing.md,
  },
  badgeRow: {
    gap: AppTheme.spacing.md,
  },
});
