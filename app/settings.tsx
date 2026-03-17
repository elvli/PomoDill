import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { StatCard } from '@/components/stat-card';
import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <ScreenContainer
      title="Settings"
      subtitle="Timer presets and interface preferences now live as standard stack screens outside the swipe shell."
      contentContainerStyle={styles.content}>
      <View style={styles.grid}>
        <StatCard label="Focus" value="25 min" helper="Editable next" />
        <StatCard label="Short break" value="5 min" helper="Editable next" />
        <StatCard label="Long break" value="15 min" helper="Editable next" />
        <StatCard label="Cycle" value="4 sessions" helper="Before long break" />
      </View>

      <View style={[styles.preferenceCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.preferenceTitle, { color: palette.text }]}>Preferences</Text>
        <Text style={[styles.preferenceItem, { color: palette.textMuted }]}>Notifications: coming next</Text>
        <Text style={[styles.preferenceItem, { color: palette.textMuted }]}>Sound profile: mellow</Text>
        <Text style={[styles.preferenceItem, { color: palette.textMuted }]}>Theme sync: automatic</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: AppTheme.spacing.lg,
  },
  grid: {
    gap: AppTheme.spacing.md,
  },
  preferenceCard: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.lg,
    gap: AppTheme.spacing.sm,
  },
  preferenceTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
  },
  preferenceItem: {
    fontSize: 15,
    lineHeight: 22,
  },
});
