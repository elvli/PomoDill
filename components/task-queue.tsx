import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Task } from '@/types';
import { SwipeableTaskRow } from '@/components/swipeable-task-row';

type TaskQueueProps = {
  tasks: Task[];
  currentTaskId?: string;
  onPressAddTask: () => void;
  onDeleteTask: (taskId: string) => void;
  onSetCurrentTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
};

export function TaskQueue({
  tasks,
  currentTaskId,
  onPressAddTask,
  onDeleteTask,
  onSetCurrentTask,
  onEditTask,
}: TaskQueueProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.queueCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <View style={styles.queueHeader}>
        <Text style={[styles.queueEyebrow, { color: palette.textMuted }]}>Task Queue</Text>
        <Text style={[styles.queueCount, { color: palette.textMuted }]}>
          {tasks.length} {tasks.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <View style={styles.queueBody}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <SwipeableTaskRow
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onSetCurrent={onSetCurrentTask}
              onEdit={onEditTask}
              showDivider
            />
          ))
        ) : (
          <View style={styles.emptyQueue}>
            <Text style={[styles.emptyQueueTitle, { color: palette.text }]}>Queue cleared</Text>
            <Text style={[styles.emptyQueueDetail, { color: palette.textMuted }]}>
              Add a few tasks here to build the next focus run.
            </Text>
          </View>
        )}

        <View style={[styles.addActionWrap, { borderTopColor: palette.border }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add task"
            onPress={onPressAddTask}
            style={({ pressed }) => [
              styles.addButton,
              {
                backgroundColor: pressed ? palette.accent : palette.accentSoft,
              },
            ]}>
            <Text style={[styles.addButtonPlus, { color: palette.tintStrong }]}>+</Text>
            <Text style={[styles.addButtonText, { color: palette.tintStrong }]}>Add Task</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  queueCard: {
    width: '100%',
    borderWidth: 1,
    borderRadius: AppTheme.radius.lg,
    overflow: 'hidden',
  },
  queueHeader: {
    paddingHorizontal: AppTheme.spacing.lg,
    paddingTop: AppTheme.spacing.md,
    paddingBottom: AppTheme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  queueEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  queueCount: {
    fontSize: 13,
    fontWeight: '600',
  },
  queueBody: {
    paddingBottom: AppTheme.spacing.xs,
  },
  emptyQueue: {
    paddingHorizontal: AppTheme.spacing.lg,
    paddingTop: AppTheme.spacing.sm,
    paddingBottom: AppTheme.spacing.lg,
    gap: 4,
  },
  emptyQueueTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 17,
    fontWeight: '700',
  },
  emptyQueueDetail: {
    fontSize: 14,
    lineHeight: 20,
  },
  addActionWrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: AppTheme.spacing.md,
    paddingTop: AppTheme.spacing.sm,
    paddingBottom: AppTheme.spacing.xs,
    alignItems: 'center',
  },
  addButton: {
    minHeight: 44,
    borderRadius: AppTheme.radius.pill,
    paddingHorizontal: AppTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: AppTheme.spacing.xs,
  },
  addButtonPlus: {
    fontFamily: Fonts.rounded,
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '700',
  },
  addButtonText: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
});
