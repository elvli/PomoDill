import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type JarItem = {
  id: string;
  name: string;
  finish: string;
  price: string;
  owned: boolean;
  rarity: 'Core' | 'Rare' | 'Limited';
};

const FILTERS = ['All', 'Owned', 'Shop', 'Rare'] as const;

const JARS: JarItem[] = [
  { id: 'classic', name: 'Classic Brine', finish: 'Soft lime glass', price: 'Owned', owned: true, rarity: 'Core' },
  { id: 'moss', name: 'Moss Studio', finish: 'Matte moss tint', price: 'Owned', owned: true, rarity: 'Rare' },
  { id: 'gold', name: 'Golden Hour', finish: 'Warm amber trim', price: '280 seeds', owned: false, rarity: 'Limited' },
  { id: 'cloud', name: 'Cloud Pantry', finish: 'Porcelain cap', price: '180 seeds', owned: false, rarity: 'Core' },
  { id: 'midnight', name: 'Midnight Dill', finish: 'Deep ink silhouette', price: '320 seeds', owned: false, rarity: 'Rare' },
  { id: 'sprout', name: 'Sprout Lab', finish: 'Fresh green glow', price: '140 seeds', owned: false, rarity: 'Core' },
  { id: 'linen', name: 'Linen Shelf', finish: 'Warm neutral glaze', price: '210 seeds', owned: false, rarity: 'Core' },
  { id: 'berry', name: 'Berry Brine', finish: 'Muted berry sheen', price: 'Owned', owned: true, rarity: 'Limited' },
  { id: 'mint', name: 'Mint Capsule', finish: 'Cool mint edge', price: '190 seeds', owned: false, rarity: 'Rare' },
];

function jarAccent(id: string) {
  const colors: Record<string, string> = {
    classic: '#CFE48E',
    moss: '#9DBB67',
    gold: '#E2C16D',
    cloud: '#DCD8CF',
    midnight: '#6C7A8F',
    sprout: '#9DD568',
    linen: '#D7C9A7',
    berry: '#B58AA4',
    mint: '#8ECFB6',
  };

  return colors[id] ?? '#CFE48E';
}

export function MarketplaceScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('All');
  const featuredJar = JARS[1];

  const filteredJars = useMemo(() => {
    return JARS.filter((jar) => {
      const matchesQuery =
        jar.name.toLowerCase().includes(query.toLowerCase()) ||
        jar.finish.toLowerCase().includes(query.toLowerCase());

      const matchesFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Owned' && jar.owned) ||
        (activeFilter === 'Shop' && !jar.owned) ||
        (activeFilter === 'Rare' && jar.rarity !== 'Core');

      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, query]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]} edges={[]}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + AppTheme.spacing.xs }]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.featuredCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <View style={styles.featuredCopy}>
            <Text style={[styles.eyebrow, { color: palette.tintStrong }]}>Selected jar</Text>
            <Text style={[styles.featuredTitle, { color: palette.text }]}>{featuredJar.name}</Text>
            <Text style={[styles.featuredBody, { color: palette.textMuted }]}>
              A calm studio finish with softened glass edges. This is the jar currently active on your timer.
            </Text>
            <View style={styles.featuredMeta}>
              <View style={[styles.metaPill, { backgroundColor: palette.accentSoft }]}>
                <Text style={[styles.metaText, { color: palette.tintStrong }]}>{featuredJar.rarity}</Text>
              </View>
              <View style={[styles.metaPill, { backgroundColor: palette.surfaceMuted }]}>
                <Text style={[styles.metaText, { color: palette.textMuted }]}>Equipped</Text>
              </View>
            </View>
          </View>
          <View style={[styles.featuredPreview, { backgroundColor: palette.surface }]}>
            <View style={[styles.featuredJar, { borderColor: palette.border, backgroundColor: palette.card }]} />
            <View style={[styles.featuredGlow, { backgroundColor: jarAccent(featuredJar.id) }]} />
          </View>
        </View>

        <View style={styles.discoveryBar}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search jars"
            placeholderTextColor={palette.textMuted}
            style={[
              styles.searchInput,
              { backgroundColor: palette.card, borderColor: palette.border, color: palette.text },
            ]}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {FILTERS.map((filter) => {
              const isActive = filter === activeFilter;

              return (
                <Pressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isActive ? palette.tintStrong : palette.card,
                      borderColor: isActive ? palette.tintStrong : palette.border,
                    },
                  ]}>
                  <Text style={[styles.filterLabel, { color: isActive ? palette.background : palette.textMuted }]}>
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.grid}>
          {filteredJars.map((jar) => (
            <Pressable
              key={jar.id}
              style={[styles.jarCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
              <View style={[styles.jarSwatch, { backgroundColor: jarAccent(jar.id) }]} />
              <Text style={[styles.jarName, { color: palette.text }]} numberOfLines={2}>
                {jar.name}
              </Text>
              <Text style={[styles.jarFinish, { color: palette.textMuted }]} numberOfLines={2}>
                {jar.finish}
              </Text>
              <View style={styles.jarFooter}>
                <Text style={[styles.jarPrice, { color: jar.owned ? palette.success : palette.tintStrong }]}>
                  {jar.price}
                </Text>
                <Text style={[styles.jarRarity, { color: palette.textMuted }]}>{jar.rarity}</Text>
              </View>
            </Pressable>
          ))}
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
  featuredCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: AppTheme.spacing.lg,
    gap: AppTheme.spacing.md,
    ...AppTheme.shadow,
  },
  featuredCopy: {
    gap: AppTheme.spacing.xs,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  featuredTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 30,
    fontWeight: '800',
  },
  featuredBody: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 420,
  },
  featuredMeta: {
    flexDirection: 'row',
    gap: AppTheme.spacing.xs,
    marginTop: AppTheme.spacing.sm,
  },
  metaPill: {
    borderRadius: AppTheme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
  },
  featuredPreview: {
    height: 160,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.26,
  },
  featuredJar: {
    width: 110,
    height: 136,
    borderWidth: 3,
    borderRadius: 30,
  },
  discoveryBar: {
    gap: AppTheme.spacing.sm,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
  },
  filterRow: {
    gap: AppTheme.spacing.xs,
    paddingRight: AppTheme.spacing.md,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm,
  },
  jarCard: {
    width: '31%',
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
    gap: AppTheme.spacing.xs,
  },
  jarSwatch: {
    height: 74,
    borderRadius: 16,
    marginBottom: AppTheme.spacing.xs,
  },
  jarName: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  jarFinish: {
    fontSize: 12,
    lineHeight: 16,
    minHeight: 32,
  },
  jarFooter: {
    gap: 2,
    marginTop: 'auto',
  },
  jarPrice: {
    fontSize: 12,
    fontWeight: '700',
  },
  jarRarity: {
    fontSize: 11,
    fontWeight: '600',
  },
});
