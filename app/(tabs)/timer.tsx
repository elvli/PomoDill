import { useEffect, useMemo, useRef } from 'react';
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
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PickleJarProgress } from '@/components/pickle-jar-progress';
import { ProgressSummary } from '@/components/progress-summary';
import { TaskSummary } from '@/components/task-summary';
import { TimerControls } from '@/components/timer-controls';
import { TimerDisplay } from '@/components/timer-display';
import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePomodoroTimer } from '@/hooks/use-pomodoro-timer';
import { formatClock } from '@/lib/session';
import { SESSION_LABELS } from '@/lib/timer';

export default function TimerScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
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
  } = usePomodoroTimer();
  const focusValue = useRef(new Animated.Value(0)).current;
  const showFocusMode = isSessionActive || isRunning;
  const recentSession = sessions[0];

  useEffect(() => {
    Animated.timing(focusValue, {
      toValue: showFocusMode ? 1 : 0,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [focusValue, showFocusMode]);

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: showFocusMode
        ? { display: 'none' }
        : {
            backgroundColor: palette.card,
            borderTopColor: palette.border,
            height: Platform.select({ ios: 84, default: 70 }),
            paddingTop: 8,
          },
    });
  }, [navigation, palette.border, palette.card, showFocusMode]);

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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]} edges={['top']}>
      <View style={styles.backgroundLayer}>
        <View style={[styles.bgOrb, styles.bgOrbLeft, { backgroundColor: palette.accentSoft }]} />
        <View style={[styles.bgOrb, styles.bgOrbRight, { backgroundColor: palette.surfaceMuted }]} />
      </View>

      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.screenContent, showFocusMode && styles.screenContentFocus]}
        scrollEnabled={!showFocusMode}
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
              {
                transform: [{ translateY: jarTranslateY }, { scale: jarScale }],
              },
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
            <TimerControls
              isRunning={isRunning}
              isSessionActive={isSessionActive}
              onPrimaryPress={isRunning ? pauseTimer : startTimer}
              onSkipPress={skipTimer}
              onResetPress={resetTimer}
            />
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
  screen: {
    flex: 1,
    paddingHorizontal: AppTheme.spacing.md,
  },
  screenContent: {
    paddingTop: AppTheme.spacing.sm,
    paddingBottom: Platform.select({ ios: 26, default: 18 }),
    gap: AppTheme.spacing.md,
  },
  screenContentFocus: {
    justifyContent: 'center',
    minHeight: '100%',
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
