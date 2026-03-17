import { Pressable, StyleSheet, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppTheme, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type TimerControlsProps = {
  isRunning: boolean;
  isSessionActive: boolean;
  onPrimaryPress: () => void;
  onResetPress: () => void;
  onSkipPress: () => void;
};

export function TimerControls({
  isRunning,
  isSessionActive,
  onPrimaryPress,
  onResetPress,
  onSkipPress,
}: TimerControlsProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const primaryIcon = isRunning ? 'pause.fill' : 'play.fill';
  const resetIcon = isSessionActive ? 'stop.fill' : 'arrow.counterclockwise';

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Skip timer"
        style={[styles.secondaryButton, { borderColor: palette.border, backgroundColor: palette.card }]}
        onPress={onSkipPress}>
        <IconSymbol name="forward.end.fill" size={22} color={palette.text} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isRunning ? 'Pause timer' : isSessionActive ? 'Resume timer' : 'Start timer'}
        style={[styles.primaryButton, { backgroundColor: palette.tintStrong }]}
        onPress={onPrimaryPress}>
        <IconSymbol name={primaryIcon} size={28} color={palette.background} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isSessionActive ? 'Stop timer' : 'Reset timer'}
        style={[styles.secondaryButton, { borderColor: palette.border, backgroundColor: palette.card }]}
        onPress={onResetPress}>
        <IconSymbol name={resetIcon} size={22} color={palette.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    width: 78,
    height: 78,
    borderRadius: AppTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderRadius: AppTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
