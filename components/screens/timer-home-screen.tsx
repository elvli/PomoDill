import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
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
import { TaskSummary } from '@/components/task-summary';
import { TimerControls } from '@/components/timer-controls';
import { TimerDisplay } from '@/components/timer-display';
import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { UsePomodoroTimerResult } from '@/hooks/use-pomodoro-timer';
import { formatClock } from '@/lib/session';
import { SESSION_LABELS } from '@/lib/timer';

type TimerHomeScreenProps = {
  timer: UsePomodoroTimerResult;
};

export function TimerHomeScreen({ timer }: TimerHomeScreenProps) {
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
    selectedTaskLabel,
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
  const previousIsRunningRef = useRef(isRunning);
  const previousIsSessionActiveRef = useRef(isSessionActive);
  const [areFocusControlsVisible, setAreFocusControlsVisible] = useState(true);
  const showFocusMode = isSessionActive || isRunning;
  const shouldAutoHideControls = currentMode === 'focus' && isRunning;
  const recentSession = sessions[0];

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
  const recentSessionLabel = useMemo(() => {
    if (!recentSession) {
      return undefined;
    }

    return `${SESSION_LABELS[recentSession.type]} · ${recentSession.completed ? 'done' : 'skipped'}`;
  }, [recentSession]);

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

      {showFocusMode ? (
        <View style={styles.touchLayer} onTouchStart={handleScreenInteraction}>
          <View style={[styles.focusScreen, isWide && styles.mainColumnWide]}>
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
            style={styles.screen}
            contentContainerStyle={[styles.screenContent, { paddingTop: insets.top + AppTheme.spacing.xs }]}
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
                  <TaskSummary title={selectedTaskLabel} isSessionActive={showFocusMode} />
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
                <View style={[styles.modeStrip, { backgroundColor: palette.card, borderColor: palette.border }]}>
                  {Object.entries(SESSION_LABELS).map(([modeKey, label]) => {
                    const isActive = modeKey === currentMode;

                    return (
                      <View
                        key={modeKey}
                        style={[
                          styles.modeChip,
                          {
                            backgroundColor: isActive ? palette.tintStrong : 'transparent',
                            borderColor: isActive ? palette.tintStrong : palette.border,
                          },
                        ]}>
                        <Text style={[styles.modeChipLabel, { color: isActive ? palette.background : palette.textMuted }]}>
                          {label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </Animated.View>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
    paddingBottom: Platform.select({ ios: 26, default: 18 }),
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
  modeStrip: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm,
    justifyContent: 'center',
  },
  modeChip: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  modeChipLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
});
