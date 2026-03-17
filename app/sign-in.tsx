import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <ScreenContainer
      title="Sign In"
      subtitle="Account sync can expand later, but the route and form flow are now wired into the new menu structure."
      contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.label, { color: palette.textMuted }]}>Email</Text>
        <TextInput
          placeholder="you@example.com"
          placeholderTextColor={palette.textMuted}
          style={[styles.input, { borderColor: palette.border, color: palette.text }]}
        />
        <Text style={[styles.label, { color: palette.textMuted }]}>Password</Text>
        <TextInput
          secureTextEntry
          placeholder="Password"
          placeholderTextColor={palette.textMuted}
          style={[styles.input, { borderColor: palette.border, color: palette.text }]}
        />
        <Pressable style={[styles.button, { backgroundColor: palette.tintStrong }]}>
          <Text style={[styles.buttonLabel, { color: palette.background }]}>Continue</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: AppTheme.spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.lg,
    gap: AppTheme.spacing.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  button: {
    marginTop: AppTheme.spacing.sm,
    borderRadius: AppTheme.radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
});
