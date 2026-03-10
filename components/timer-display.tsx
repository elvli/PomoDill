import { StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type TimerDisplayProps = {
  modeLabel: string;
  timeLabel: string;
  isSessionActive: boolean;
  compact?: boolean;
};

export function TimerDisplay({ modeLabel, timeLabel, isSessionActive, compact = false }: TimerDisplayProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      <Text style={[styles.mode, { color: palette.textMuted }]}>{modeLabel}</Text>
      <Text style={[styles.time, compact && styles.timeCompact, { color: palette.text }]}>{timeLabel}</Text>
      <Text style={[styles.helper, compact && styles.helperCompact, { color: palette.textMuted }]}>
        {isSessionActive ? 'Stay with this block.' : 'Settle in before you start.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  mode: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  time: {
    fontFamily: Fonts.rounded,
    fontSize: 64,
    lineHeight: 72,
    fontWeight: '800',
  },
  timeCompact: {
    fontSize: 52,
    lineHeight: 58,
  },
  helper: {
    fontSize: 15,
    lineHeight: 21,
  },
  helperCompact: {
    fontSize: 14,
    lineHeight: 18,
  },
});
