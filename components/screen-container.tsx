import { PropsWithChildren } from 'react';
import { ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ScreenContainerProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

export function ScreenContainer({
  children,
  title,
  subtitle,
  contentContainerStyle,
}: ScreenContainerProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]} edges={[]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + AppTheme.spacing.xs }]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.content, isWide && styles.contentWide]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
            {subtitle ? <Text style={[styles.subtitle, { color: palette.textMuted }]}>{subtitle}</Text> : null}
          </View>
          <View style={contentContainerStyle}>{children}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingBottom: 120,
  },
  content: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: AppTheme.maxContentWidth,
    gap: AppTheme.spacing.lg,
  },
  contentWide: {
    paddingTop: AppTheme.spacing.md,
  },
  header: {
    gap: AppTheme.spacing.xs,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 640,
  },
});
