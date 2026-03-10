import { StyleSheet, Text, View } from 'react-native';

import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
};

export function StatCard({ label, value, helper }: StatCardProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <Text style={[styles.label, { color: palette.textMuted }]}>{label}</Text>
      <Text style={[styles.value, { color: palette.text }]}>{value}</Text>
      {helper ? <Text style={[styles.helper, { color: palette.textMuted }]}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.lg,
    gap: AppTheme.spacing.xs,
    ...AppTheme.shadow,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  value: {
    fontFamily: Fonts.rounded,
    fontSize: 28,
    fontWeight: '800',
  },
  helper: {
    fontSize: 14,
    lineHeight: 20,
  },
});
