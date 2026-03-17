import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const DASHBOARD_CARDS = [
  { label: 'Focus time', value: '3h 20m', helper: 'Today across 8 blocks' },
  { label: 'Consistency', value: '6 days', helper: 'Current study streak' },
  { label: 'Deep work', value: '81%', helper: 'Sessions finished without skips' },
  { label: 'Best window', value: '9 AM', helper: 'Your strongest focus hour' },
];

const WEEK_DATA = [
  { day: 'M', height: 54 },
  { day: 'T', height: 88 },
  { day: 'W', height: 72 },
  { day: 'T', height: 98 },
  { day: 'F', height: 64 },
  { day: 'S', height: 42 },
  { day: 'S', height: 58 },
];

export function StatsDashboardScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const useTwoColumns = width > 420;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]} edges={[]}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + AppTheme.spacing.xs }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: palette.tintStrong }]}>Stats</Text>
          <Text style={[styles.title, { color: palette.text }]}>Your study rhythm at a glance.</Text>
          <Text style={[styles.subtitle, { color: palette.textMuted }]}>
            Swipe here anytime to check streaks, focus quality, and weekly pacing without leaving the main flow.
          </Text>
        </View>

        <View style={[styles.cardGrid, useTwoColumns && styles.cardGridWide]}>
          {DASHBOARD_CARDS.map((card) => (
            <View
              key={card.label}
              style={[
                styles.metricCard,
                { backgroundColor: palette.card, borderColor: palette.border },
                useTwoColumns && styles.metricCardWide,
              ]}>
              <Text style={[styles.metricLabel, { color: palette.textMuted }]}>{card.label}</Text>
              <Text style={[styles.metricValue, { color: palette.text }]}>{card.value}</Text>
              <Text style={[styles.metricHelper, { color: palette.textMuted }]}>{card.helper}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.chartCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: palette.text }]}>Weekly focus trend</Text>
            <Text style={[styles.chartMeta, { color: palette.textMuted }]}>24.5 hours this week</Text>
          </View>

          <View style={styles.chart}>
            {WEEK_DATA.map((item, index) => (
              <View key={`${item.day}-${index}`} style={styles.chartColumn}>
                <View style={[styles.chartBarTrack, { backgroundColor: palette.surfaceMuted }]}>
                  <View style={[styles.chartBar, { backgroundColor: palette.tintStrong, height: item.height }]} />
                </View>
                <Text style={[styles.chartLabel, { color: palette.textMuted }]}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={[styles.detailCard, { backgroundColor: palette.cardAlt, borderColor: palette.border }]}>
            <Text style={[styles.detailTitle, { color: palette.text }]}>Most productive pattern</Text>
            <Text style={[styles.detailText, { color: palette.textMuted }]}>
              Two focused sessions before noon is your most repeatable high-quality study block.
            </Text>
          </View>
          <View style={[styles.detailCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <Text style={[styles.detailTitle, { color: palette.text }]}>Recovery signal</Text>
            <Text style={[styles.detailText, { color: palette.textMuted }]}>
              You tend to skip more often after 90 minutes of continuous work. Add a break before that drop.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingTop: AppTheme.spacing.sm,
    paddingBottom: 120,
    gap: AppTheme.spacing.md,
  },
  header: { gap: AppTheme.spacing.xs },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 420,
  },
  cardGrid: {
    gap: AppTheme.spacing.sm,
  },
  cardGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricCard: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.md,
    gap: AppTheme.spacing.xs,
    ...AppTheme.shadow,
  },
  metricCardWide: {
    width: '48%',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontFamily: Fonts.rounded,
    fontSize: 28,
    fontWeight: '800',
  },
  metricHelper: {
    fontSize: 14,
    lineHeight: 19,
  },
  chartCard: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.md,
    gap: AppTheme.spacing.md,
    ...AppTheme.shadow,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
  },
  chartTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
  },
  chartMeta: {
    fontSize: 13,
    fontWeight: '600',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  chartColumn: {
    alignItems: 'center',
    gap: AppTheme.spacing.xs,
  },
  chartBarTrack: {
    width: 24,
    height: 110,
    borderRadius: 999,
    justifyContent: 'flex-end',
    padding: 3,
  },
  chartBar: {
    width: '100%',
    borderRadius: 999,
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  bottomRow: {
    gap: AppTheme.spacing.sm,
  },
  detailCard: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.md,
    gap: AppTheme.spacing.xs,
  },
  detailTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 17,
    fontWeight: '700',
  },
  detailText: {
    fontSize: 14,
    lineHeight: 21,
  },
});
