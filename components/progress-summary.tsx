import { StyleSheet, Text, View } from 'react-native';

import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ProgressSummaryProps = {
  todayFocusLabel: string;
  sessionsCompletedToday: number;
  recentSessionLabel?: string;
};

export function ProgressSummary({
  todayFocusLabel,
  sessionsCompletedToday,
  recentSessionLabel,
}: ProgressSummaryProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.label, { color: palette.textMuted }]}>Today</Text>
        <Text style={[styles.value, { color: palette.text }]}>{todayFocusLabel}</Text>
        <Text style={[styles.helper, { color: palette.textMuted }]}>{sessionsCompletedToday} focus sessions</Text>
      </View>
      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.label, { color: palette.textMuted }]}>Latest</Text>
        <Text style={[styles.value, { color: palette.text }]}>{recentSessionLabel ?? 'No sessions yet'}</Text>
        <Text style={[styles.helper, { color: palette.textMuted }]}>Recent session summary</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: AppTheme.spacing.md,
  },
  card: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.lg,
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontFamily: Fonts.rounded,
    fontSize: 26,
    fontWeight: '800',
  },
  helper: {
    fontSize: 14,
    lineHeight: 20,
  },
});
