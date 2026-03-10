import { StyleSheet, Text, View } from 'react-native';

import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ProgressJarProps = {
  completedSessions: number;
  goalSessions: number;
};

export function ProgressJar({ completedSessions, goalSessions }: ProgressJarProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const fillRatio = goalSessions > 0 ? Math.min(completedSessions / goalSessions, 1) : 0;

  return (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <Text style={[styles.title, { color: palette.text }]}>Pickle jar</Text>
      <View style={[styles.jar, { borderColor: palette.border, backgroundColor: palette.surface }]}>
        <View style={[styles.fill, { backgroundColor: palette.accentSoft, height: `${fillRatio * 100}%` }]} />
        <Text style={[styles.count, { color: palette.tintStrong }]}>
          {completedSessions}/{goalSessions}
        </Text>
      </View>
      <Text style={[styles.helper, { color: palette.textMuted }]}>Placeholder progress visual for today&apos;s sessions.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.lg,
    alignItems: 'center',
    gap: AppTheme.spacing.md,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
  },
  jar: {
    width: 140,
    height: 180,
    borderWidth: 2,
    borderRadius: 36,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  count: {
    marginBottom: AppTheme.spacing.md,
    fontFamily: Fonts.rounded,
    fontSize: 28,
    fontWeight: '800',
  },
  helper: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
