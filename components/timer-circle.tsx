import { StyleSheet, Text, View } from 'react-native';

import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type TimerCircleProps = {
  modeLabel: string;
  timeLabel: string;
  detail: string;
};

export function TimerCircle({ modeLabel, timeLabel, detail }: TimerCircleProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.wrapper}>
      <View style={[styles.outerRing, { borderColor: palette.accentSoft, backgroundColor: palette.surface }]}> 
        <View style={[styles.innerRing, { borderColor: palette.accent, backgroundColor: palette.card }]}>
          <Text style={[styles.modeLabel, { color: palette.textMuted }]}>{modeLabel}</Text>
          <Text style={[styles.timeLabel, { color: palette.text }]}>{timeLabel}</Text>
          <Text style={[styles.detail, { color: palette.textMuted }]}>{detail}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  outerRing: {
    width: 290,
    height: 290,
    borderRadius: 145,
    borderWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: AppTheme.spacing.xs,
    paddingHorizontal: AppTheme.spacing.lg,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timeLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 54,
    fontWeight: '800',
  },
  detail: {
    fontSize: 15,
    textAlign: 'center',
  },
});
