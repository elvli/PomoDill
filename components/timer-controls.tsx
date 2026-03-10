import { Pressable, StyleSheet, Text, View } from 'react-native';

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
  const primaryLabel = isRunning ? 'Pause' : isSessionActive ? 'Resume' : 'Start';
  const resetLabel = isSessionActive ? 'Stop' : 'Reset';

  return (
    <View style={styles.row}>
      <Pressable style={[styles.primaryButton, { backgroundColor: palette.tintStrong }]} onPress={onPrimaryPress}>
        <Text style={[styles.primaryLabel, { color: palette.background }]}>{primaryLabel}</Text>
      </Pressable>
      <Pressable style={[styles.secondaryButton, { borderColor: palette.border }]} onPress={onSkipPress}>
        <Text style={[styles.secondaryLabel, { color: palette.text }]}>Skip</Text>
      </Pressable>
      <Pressable style={[styles.secondaryButton, { borderColor: palette.border }]} onPress={onResetPress}>
        <Text style={[styles.secondaryLabel, { color: palette.text }]}>{resetLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm,
    justifyContent: 'center',
  },
  primaryButton: {
    minWidth: 128,
    borderRadius: AppTheme.radius.pill,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  primaryLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    minWidth: 96,
    borderWidth: 1,
    borderRadius: AppTheme.radius.pill,
    paddingVertical: 15,
    paddingHorizontal: 18,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
