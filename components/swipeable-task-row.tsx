import { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Task } from '@/types';
import { IconSymbol } from '@/components/ui/icon-symbol';

type SwipeableTaskRowProps = {
  task: Task;
  onDelete: (taskId: string) => void;
  onSetCurrent: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  showDivider?: boolean;
};

const DELETE_ACTION_WIDTH = 88;

export function SwipeableTaskRow({
  task,
  onDelete,
  onSetCurrent,
  onEdit,
  showDivider = true,
}: SwipeableTaskRowProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const swipeableRef = useRef<Swipeable>(null);
  const longPressTriggeredRef = useRef(false);

  const handlePress = () => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }

    swipeableRef.current?.close();
    onSetCurrent(task.id);
  };

  const handleLongPress = () => {
    longPressTriggeredRef.current = true;
    swipeableRef.current?.close();
    onEdit(task.id);
  };

  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete(task.id);
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const iconScale = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
      extrapolate: 'clamp',
    });
    const iconOpacity = progress.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [0, 0.65, 1],
      extrapolate: 'clamp',
    });
    const actionTranslateX = dragX.interpolate({
      inputRange: [-DELETE_ACTION_WIDTH, 0],
      outputRange: [0, DELETE_ACTION_WIDTH * 0.25],
      extrapolate: 'clamp',
    });

    return (
      <RectButton style={styles.actionButton} onPress={handleDelete}>
        <Animated.View
          style={[
            styles.actionFill,
            {
              width: DELETE_ACTION_WIDTH,
              backgroundColor: '#FF3B30',
              transform: [{ translateX: actionTranslateX }],
            },
          ]}>
          <Animated.View style={{ opacity: iconOpacity, transform: [{ scale: iconScale }] }}>
            <IconSymbol name="trash.fill" size={20} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <View
      style={[
        styles.rowClip,
        showDivider && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border },
      ]}>
      <Swipeable
        ref={swipeableRef}
        friction={1.9}
        overshootRight={false}
        rightThreshold={DELETE_ACTION_WIDTH * 0.55}
        renderRightActions={renderRightActions}>
        <Pressable
          delayLongPress={240}
          onLongPress={handleLongPress}
          onPress={handlePress}
          style={({ pressed }) => [
            styles.row,
            {
              backgroundColor: task.isCurrent
                ? palette.accentSoft
                : pressed
                  ? palette.surface
                  : palette.card,
            },
          ]}>
          <View
            style={[
              styles.selectionDot,
              {
                backgroundColor: task.isCurrent ? palette.tintStrong : palette.surfaceMuted,
              },
            ]}
          />
          <View style={styles.copy}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: palette.text }]} numberOfLines={1}>
                {task.title}
              </Text>
            </View>
            <Text style={[styles.detail, { color: palette.textMuted }]} numberOfLines={1}>
              {task.notes || 'No notes yet'}
            </Text>
          </View>
          <View style={styles.meta}>
            <Text style={[styles.metaText, { color: palette.textMuted }]}>
              {task.completedPomodoros}/{task.estimatedPomodoros} pomos
            </Text>
          </View>
        </Pressable>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  rowClip: {
    overflow: 'hidden',
  },
  row: {
    minHeight: 72,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.md,
  },
  selectionDot: {
    width: 12,
    height: 12,
    borderRadius: AppTheme.radius.pill,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.xs,
  },
  title: {
    flex: 1,
    fontFamily: Fonts.rounded,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },
  detail: {
    fontSize: 13,
    lineHeight: 18,
  },
  meta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionButton: {
    width: DELETE_ACTION_WIDTH,
  },
  actionFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
