import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type MainAppMenuProps = {
  hidden?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onSignIn: () => void;
  onSettings: () => void;
  onStore: () => void;
  onStats: () => void;
};

function MenuRow({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.menuRow, pressed && { opacity: 0.82 }]}>
      <MaterialIcons name={icon} size={20} color={palette.textMuted} />
      <Text style={[styles.menuText, { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}

export function MainAppMenu({
  hidden = false,
  isOpen,
  onToggle,
  onSignIn,
  onSettings,
  onStore,
  onStats,
}: MainAppMenuProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: hidden ? 0 : 1,
      duration: hidden ? 220 : 180,
      useNativeDriver: true,
    }).start();
  }, [hidden, opacity]);

  return (
    <Animated.View
      style={[styles.wrapper, { opacity, top: insets.top + 8 }]}
      pointerEvents={hidden ? 'none' : 'box-none'}>
      <Pressable
        onPress={onToggle}
        style={[
          styles.trigger,
          {
            backgroundColor: palette.card,
            borderColor: palette.border,
          },
        ]}>
        <MaterialIcons name={isOpen ? 'close' : 'menu'} size={22} color={palette.text} />
      </Pressable>

      {isOpen ? (
        <View style={[styles.dropdown, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <MenuRow label="Sign In" icon="person-outline" onPress={onSignIn} />
          <MenuRow label="Settings" icon="settings" onPress={onSettings} />
          <MenuRow label="Store" icon="storefront" onPress={onStore} />
          <MenuRow label="Stats" icon="bar-chart" onPress={onStats} />
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: AppTheme.spacing.md,
    alignItems: 'flex-end',
    zIndex: 20,
  },
  trigger: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...AppTheme.shadow,
  },
  dropdown: {
    marginTop: AppTheme.spacing.sm,
    minWidth: 180,
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    gap: 2,
    ...AppTheme.shadow,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 14,
  },
  menuText: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '700',
  },
});
