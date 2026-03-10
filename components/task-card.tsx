import { StyleSheet, Text, View } from 'react-native';

import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type TaskCardProps = {
  title: string;
  detail: string;
  accent?: 'default' | 'muted';
};

export function TaskCard({ title, detail, accent = 'default' }: TaskCardProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const backgroundColor = accent === 'muted' ? palette.surface : palette.card;

  return (
    <View style={[styles.card, { backgroundColor, borderColor: palette.border }]}>
      <View style={[styles.dot, { backgroundColor: accent === 'muted' ? palette.surfaceMuted : palette.accent }]} />
      <View style={styles.copy}>
        <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
        <Text style={[styles.detail, { color: palette.textMuted }]}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.md,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: AppTheme.radius.pill,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
  },
  detail: {
    fontSize: 14,
    lineHeight: 20,
  },
});
