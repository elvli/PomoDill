import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ScreenContainer } from '@/components/screen-container';
import { TaskCard } from '@/components/task-card';
import { AppTheme } from '@/constants/theme';

export default function TasksScreen() {
  return (
    <ScreenContainer
      title="Tasks"
      subtitle="Keep the task list tight and practical. CRUD and session linking land in phase 3."
      contentContainerStyle={styles.content}>
      <TaskCard title="Review biology flashcards" detail="2 pomodoros estimated" />
      <TaskCard title="Draft history outline" detail="Due tomorrow" accent="muted" />
      <View style={styles.section}>
        <EmptyState
          title="Completed tasks will show here"
          description="We will split active and completed sections once task persistence is in place."
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: AppTheme.spacing.md,
  },
  section: {
    marginTop: AppTheme.spacing.sm,
  },
});
