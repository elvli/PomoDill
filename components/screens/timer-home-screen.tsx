import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { PickleJarProgress } from '@/components/pickle-jar-progress';
import { ProgressSummary } from '@/components/progress-summary';
import { TaskEditorSheet } from '@/components/task-editor-sheet';
import { TaskQueue } from '@/components/task-queue';
import { TaskSummary } from '@/components/task-summary';
import { TimerControls } from '@/components/timer-controls';
import { TimerDisplay } from '@/components/timer-display';
import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { UsePomodoroTimerResult } from '@/hooks/use-pomodoro-timer';
import { formatClock } from '@/lib/session';
import { SESSION_LABELS } from '@/lib/timer';
import { Task } from '@/types';

type TimerHomeScreenProps = {
  timer: UsePomodoroTimerResult;
  onEditorVisibilityChange?: (isVisible: boolean) => void;
};

const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Refine Pomodill timer interactions',
    notes: 'Tighten the focus flow and confirm the card rhythm.',
    estimatedPomodoros: 2,
    completedPomodoros: 1,
    isCurrent: true,
    isCompleted: false,
    createdAt: '2026-03-18T08:00:00.000Z',
    updatedAt: '2026-03-18T08:00:00.000Z',
  },
  {
    id: 'task-2',
    title: 'Wire task queue swipe delete',
    notes: 'Reveal a native-feeling red delete action.',
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    isCurrent: false,
    isCompleted: false,
    createdAt: '2026-03-18T08:10:00.000Z',
    updatedAt: '2026-03-18T08:10:00.000Z',
  },
  {
    id: 'task-3',
    title: 'Review break state copy',
    notes: 'Keep supporting text short and calm.',
    estimatedPomodoros: 3,
    completedPomodoros: 0,
    isCurrent: false,
    isCompleted: false,
    createdAt: '2026-03-18T08:20:00.000Z',
    updatedAt: '2026-03-18T08:20:00.000Z',
  },
];

export function TimerHomeScreen({ timer, onEditorVisibilityChange }: TimerHomeScreenProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isWide = width >= 900;
  const isCompact = width < 390 || height < 780;
  const {
    currentMode,
    modeLabel,
    secondsRemaining,
    isRunning,
    isSessionActive,
    sessionProgress,
    sessions,
    todayFocusLabel,
    sessionsCompletedToday,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
  } = timer;
  const focusValue = useRef(new Animated.Value(0)).current;
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const hideControlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const previousIsRunningRef = useRef(isRunning);
  const previousIsSessionActiveRef = useRef(isSessionActive);
  const [areFocusControlsVisible, setAreFocusControlsVisible] = useState(true);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [editorTask, setEditorTask] = useState<Task | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const showFocusMode = isSessionActive || isRunning;
  const shouldAutoHideControls = currentMode === 'focus' && isRunning;
  const recentSession = sessions[0];
  const currentTask = useMemo(
    () => tasks.find((task) => task.isCurrent) ?? tasks[0] ?? null,
    [tasks]
  );

  const clearHideControlsTimeout = useCallback(() => {
    if (!hideControlsTimeoutRef.current) {
      return;
    }

    clearTimeout(hideControlsTimeoutRef.current);
    hideControlsTimeoutRef.current = null;
  }, []);

  const animateControlsVisibility = useCallback((visible: boolean) => {
    Animated.timing(controlsOpacity, {
      toValue: visible ? 1 : 0,
      duration: visible ? 180 : 260,
      easing: visible ? Easing.out(Easing.cubic) : Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [controlsOpacity]);

  const scheduleControlsFadeOut = useCallback(() => {
    clearHideControlsTimeout();
    hideControlsTimeoutRef.current = setTimeout(() => {
      setAreFocusControlsVisible(false);
      animateControlsVisibility(false);
    }, 5000);
  }, [animateControlsVisibility, clearHideControlsTimeout]);

  const handleScreenInteraction = useCallback(() => {
    if (!shouldAutoHideControls) {
      return;
    }

    if (!areFocusControlsVisible) {
      setAreFocusControlsVisible(true);
      animateControlsVisibility(true);
    }

    scheduleControlsFadeOut();
  }, [animateControlsVisibility, areFocusControlsVisible, scheduleControlsFadeOut, shouldAutoHideControls]);

  useEffect(() => {
    Animated.timing(focusValue, {
      toValue: showFocusMode ? 1 : 0,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [focusValue, showFocusMode]);

  useEffect(() => {
    const wasRunning = previousIsRunningRef.current;
    const wasSessionActive = previousIsSessionActiveRef.current;
    const isResumingFocusSession = shouldAutoHideControls && !wasRunning && wasSessionActive;

    if (shouldAutoHideControls) {
      clearHideControlsTimeout();
      if (isResumingFocusSession) {
        setAreFocusControlsVisible(true);
        controlsOpacity.setValue(1);
        scheduleControlsFadeOut();
      } else {
        setAreFocusControlsVisible(false);
        controlsOpacity.setValue(0);
      }
    } else {
      clearHideControlsTimeout();
      setAreFocusControlsVisible(true);
      controlsOpacity.setValue(1);
    }

    previousIsRunningRef.current = isRunning;
    previousIsSessionActiveRef.current = isSessionActive;
  }, [
    clearHideControlsTimeout,
    controlsOpacity,
    isRunning,
    isSessionActive,
    scheduleControlsFadeOut,
    shouldAutoHideControls,
  ]);

  useEffect(() => () => clearHideControlsTimeout(), [clearHideControlsTimeout]);

  useEffect(() => {
    onEditorVisibilityChange?.(!!editorTask);
  }, [editorTask, onEditorVisibilityChange]);

  const jarTranslateY = focusValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -Math.min(height * 0.04, 28)],
  });
  const jarScale = focusValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, isWide ? 1.08 : 1.04],
  });
  const supportOpacity = focusValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const supportTranslateY = focusValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 18],
  });
  const focusScreenPaddingTop = insets.top + AppTheme.spacing.xs;
  const focusScreenPaddingBottom = Math.max(insets.bottom + AppTheme.spacing.sm, AppTheme.spacing.lg);
  const recentSessionLabel = useMemo(() => {
    if (!recentSession) {
      return undefined;
    }

    return `${SESSION_LABELS[recentSession.type]} · ${recentSession.completed ? 'done' : 'skipped'}`;
  }, [recentSession]);

  const openTaskEditor = useCallback((taskId: string) => {
    const nextTask = tasks.find((task) => task.id === taskId);

    if (!nextTask) {
      return;
    }

    setEditorTask(nextTask);
    setIsCreatingTask(false);
  }, [tasks]);

  const handleSetCurrentTask = useCallback((taskId: string) => {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === taskId
        ? {
            ...task,
            isCurrent: true,
            updatedAt: new Date().toISOString(),
          }
        : task.isCurrent
          ? {
              ...task,
              isCurrent: false,
            }
          : task
    )));
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks((currentTasks) => {
      const nextTasks = currentTasks.filter((task) => task.id !== taskId);
      const deletedTask = currentTasks.find((task) => task.id === taskId);

      if (deletedTask?.isCurrent && nextTasks.length > 0) {
        return nextTasks.map((task, index) => ({
          ...task,
          isCurrent: index === 0,
          updatedAt: index === 0 ? new Date().toISOString() : task.updatedAt,
        }));
      }

      return nextTasks;
    });
    setEditorTask((currentEditorTask) => (currentEditorTask?.id === taskId ? null : currentEditorTask));
    setIsCreatingTask(false);
  }, []);

  const handlePressAddTask = useCallback(() => {
    const timestamp = new Date().toISOString();
    setEditorTask({
      id: `task-${Date.now()}`,
      title: '',
      notes: '',
      estimatedPomodoros: 1,
      completedPomodoros: 0,
      isCurrent: tasks.length === 0,
      isCompleted: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    setIsCreatingTask(true);
  }, [tasks.length]);

  const handleSaveTask = useCallback((updatedTask: Task) => {
    const normalizedTask = {
      ...updatedTask,
      isCompleted: updatedTask.completedPomodoros >= updatedTask.estimatedPomodoros,
    };

    setTasks((currentTasks) => {
      const exists = currentTasks.some((task) => task.id === normalizedTask.id);
      const nextTasks = exists
        ? currentTasks.map((task) => (task.id === normalizedTask.id ? normalizedTask : task))
        : [...currentTasks, normalizedTask];

      if (!normalizedTask.isCurrent) {
        return nextTasks;
      }

      return nextTasks.map((task) => (
        task.id === normalizedTask.id
          ? task
          : {
              ...task,
              isCurrent: false,
            }
      ));
    });
    setEditorTask(null);
    setIsCreatingTask(false);
  }, []);

  const handleCloseTaskEditor = useCallback(() => {
    setEditorTask(null);
    setIsCreatingTask(false);
  }, []);

  const controlsAnimatedStyle = {
    opacity: controlsOpacity,
    transform: [
      {
        translateY: controlsOpacity.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]} edges={[]}>
      <View style={styles.backgroundLayer}>
        <View style={[styles.bgOrb, styles.bgOrbLeft, { backgroundColor: palette.accentSoft }]} />
        <View style={[styles.bgOrb, styles.bgOrbRight, { backgroundColor: palette.surfaceMuted }]} />
      </View>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {showFocusMode ? (
          <View style={styles.touchLayer} onTouchStart={handleScreenInteraction}>
            <View
              style={[
                styles.focusScreen,
                isWide && styles.mainColumnWide,
                {
                  paddingTop: focusScreenPaddingTop,
                  paddingBottom: focusScreenPaddingBottom,
                },
              ]}>
              <Animated.View
                style={[
                  styles.jarStage,
                  styles.focusJarStage,
                  isWide && styles.jarStageWide,
                  isCompact && styles.jarStageCompact,
                  { transform: [{ translateY: jarTranslateY }, { scale: jarScale }] },
                ]}>
                <TimerDisplay
                  modeLabel={modeLabel}
                  timeLabel={formatClock(secondsRemaining)}
                  isSessionActive={showFocusMode}
                  compact={isCompact}
                />
                <PickleJarProgress
                  progress={sessionProgress}
                  isSessionActive={showFocusMode}
                  isCompleted={sessionProgress >= 1 && !isRunning}
                  compact={isCompact}
                />
                <Animated.View
                  pointerEvents={shouldAutoHideControls && !areFocusControlsVisible ? 'none' : 'auto'}
                  style={[styles.focusControlsWrap, controlsAnimatedStyle]}>
                  <TimerControls
                    isRunning={isRunning}
                    isSessionActive={isSessionActive}
                    onPrimaryPress={isRunning ? pauseTimer : startTimer}
                    onSkipPress={skipTimer}
                    onResetPress={resetTimer}
                  />
                </Animated.View>
              </Animated.View>
            </View>
          </View>
        ) : (
          <View style={styles.touchLayer}>
            <ScrollView
              ref={scrollRef}
              style={styles.screen}
              contentContainerStyle={[
                styles.screenContent,
                {
                  flexGrow: 1,
                  paddingTop: insets.top + AppTheme.spacing.xs,
                  paddingBottom: 120,
                },
              ]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <Animated.View style={[styles.supportBlock, { opacity: supportOpacity, transform: [{ translateY: supportTranslateY }] }]}>
                <Text style={[styles.screenTitle, { color: palette.text }]}>Pomodill</Text>
                <Text style={[styles.screenSubtitle, { color: palette.textMuted }]}>
                  A clean countdown with a jar that pickles as the session progresses.
                </Text>
              </Animated.View>

              <View style={[styles.mainColumn, isWide && styles.mainColumnWide]}>
                <Animated.View
                  style={[
                    styles.jarStage,
                    isWide && styles.jarStageWide,
                    isCompact && styles.jarStageCompact,
                    { transform: [{ translateY: jarTranslateY }, { scale: jarScale }] },
                  ]}>
                  <TimerDisplay
                    modeLabel={modeLabel}
                    timeLabel={formatClock(secondsRemaining)}
                    isSessionActive={showFocusMode}
                    compact={isCompact}
                  />
                  <PickleJarProgress
                    progress={sessionProgress}
                    isSessionActive={showFocusMode}
                    isCompleted={sessionProgress >= 1 && !isRunning}
                    compact={isCompact}
                  />
                  <Animated.View style={[styles.controlsWrap, controlsAnimatedStyle]}>
                    <TimerControls
                      isRunning={isRunning}
                      isSessionActive={isSessionActive}
                      onPrimaryPress={isRunning ? pauseTimer : startTimer}
                      onSkipPress={skipTimer}
                      onResetPress={resetTimer}
                    />
                  </Animated.View>
                  <Animated.View style={[styles.taskWrap, { opacity: supportOpacity, transform: [{ translateY: supportTranslateY }] }]}>
                    <TaskSummary
                      title={currentTask?.title ?? 'Add a task to start your queue'}
                      isSessionActive={showFocusMode}
                    />
                  </Animated.View>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.footerBlock,
                    isWide && styles.footerBlockWide,
                    { opacity: supportOpacity, transform: [{ translateY: supportTranslateY }] },
                  ]}>
                  <ProgressSummary
                    todayFocusLabel={todayFocusLabel}
                    sessionsCompletedToday={sessionsCompletedToday}
                    recentSessionLabel={recentSessionLabel}
                  />
                  <Animated.View style={{ opacity: supportOpacity, transform: [{ translateY: supportTranslateY }] }}>
                    <TaskQueue
                      tasks={tasks}
                      currentTaskId={currentTask?.id}
                      onPressAddTask={handlePressAddTask}
                      onDeleteTask={handleDeleteTask}
                      onSetCurrentTask={handleSetCurrentTask}
                      onEditTask={openTaskEditor}
                    />
                  </Animated.View>
                </Animated.View>
              </View>
            </ScrollView>
          </View>
        )}
        <TaskEditorSheet
          visible={!!editorTask}
          task={editorTask}
          onClose={handleCloseTaskEditor}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          isNewTask={isCreatingTask}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  bgOrb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.55,
  },
  bgOrbLeft: {
    width: 220,
    height: 220,
    top: 80,
    left: -70,
  },
  bgOrbRight: {
    width: 260,
    height: 260,
    right: -100,
    bottom: 140,
  },
  touchLayer: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: AppTheme.spacing.md,
  },
  focusScreen: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: AppTheme.spacing.md,
  },
  screenContent: {
    paddingTop: AppTheme.spacing.sm,
    gap: AppTheme.spacing.md,
  },
  supportBlock: {
    gap: 6,
  },
  screenTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 32,
    fontWeight: '800',
  },
  screenSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 520,
  },
  mainColumn: {
    alignItems: 'center',
    gap: AppTheme.spacing.lg,
  },
  mainColumnWide: {
    width: '100%',
    maxWidth: AppTheme.maxContentWidth,
    alignSelf: 'center',
  },
  jarStage: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: AppTheme.spacing.md,
  },
  jarStageWide: {
    maxWidth: 560,
  },
  jarStageCompact: {
    gap: AppTheme.spacing.sm,
  },
  focusJarStage: {
    justifyContent: 'center',
  },
  controlsWrap: {
    zIndex: 2,
  },
  focusControlsWrap: {
    minHeight: 78,
  },
  taskWrap: {
    width: '100%',
    maxWidth: 420,
  },
  footerBlock: {
    width: '100%',
    gap: AppTheme.spacing.md,
  },
  footerBlockWide: {
    maxWidth: 720,
  },
});
