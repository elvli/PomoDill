import { StyleSheet, Text, View } from 'react-native';

import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type TaskSummaryProps = {
  title: string;
  isSessionActive: boolean;
};

export function TaskSummary({ title, isSessionActive }: TaskSummaryProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isSessionActive ? palette.surface : palette.card,
          borderColor: palette.border,
        },
      ]}>
      <Text style={[styles.eyebrow, { color: palette.textMuted }]}>Current task</Text>
      <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: AppTheme.radius.lg,
    paddingVertical: AppTheme.spacing.md,
    paddingHorizontal: AppTheme.spacing.lg,
    gap: 6,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
});
