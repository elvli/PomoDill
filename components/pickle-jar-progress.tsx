import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppTheme, Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type PickleJarProgressProps = {
  progress: number;
  isSessionActive: boolean;
  isCompleted?: boolean;
  compact?: boolean;
};

const STAGE_LABELS = ['Fresh', 'In Brine', 'Pickling', 'Ready'];

export const PickleJarProgress = memo(function PickleJarProgress({
  progress,
  isSessionActive,
  isCompleted = false,
  compact = false,
}: PickleJarProgressProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const stageIndex = Math.min(Math.floor(clampedProgress * 4), 3);
  const stageLabel = isCompleted ? 'Done' : STAGE_LABELS[stageIndex];
  const brineHeight = 18 + clampedProgress * 64;
  const produceTint = [palette.surfaceMuted, '#B6C96B', '#85AC4A', palette.tintStrong][stageIndex];
  const bubbleOpacity = isSessionActive ? 0.95 : 0.35;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.glow,
          compact && styles.glowCompact,
          {
            backgroundColor: isCompleted ? palette.accent : palette.accentSoft,
            opacity: isSessionActive ? 0.22 : 0.08,
          },
        ]}
      />
      <View style={[styles.jarShell, compact && styles.jarShellCompact, { borderColor: palette.border, backgroundColor: palette.card }]}>
        <View style={[styles.jarLip, { backgroundColor: palette.surface, borderColor: palette.border }]} />
        <View style={styles.jarBody}>
          <View
            style={[
              styles.brine,
              {
                height: `${brineHeight}%`,
                backgroundColor: isCompleted ? 'rgba(127, 180, 77, 0.62)' : 'rgba(185, 213, 126, 0.48)',
              },
            ]}
          />
          <View style={[styles.highlight, { backgroundColor: 'rgba(255,255,255,0.30)' }]} />
          <View style={styles.produceColumn}>
            <ProducePiece tint={produceTint} rotate="-12deg" progress={clampedProgress} />
            <ProducePiece tint={produceTint} rotate="8deg" progress={Math.min(clampedProgress + 0.18, 1)} />
            <ProducePiece tint={produceTint} rotate="-6deg" progress={Math.min(clampedProgress + 0.1, 1)} />
            <ProducePiece tint={produceTint} rotate="14deg" progress={Math.min(clampedProgress + 0.24, 1)} />
          </View>
          <Bubble left="26%" bottom="22%" size={8} opacity={bubbleOpacity * 0.8} />
          <Bubble left="70%" bottom="31%" size={10} opacity={bubbleOpacity} />
          <Bubble left="55%" bottom="48%" size={6} opacity={bubbleOpacity * 0.75} />
          <Bubble left="34%" bottom="61%" size={5} opacity={bubbleOpacity * 0.6} />
        </View>
      </View>
      <Text style={[styles.stage, { color: palette.textMuted }]}>{stageLabel}</Text>
    </View>
  );
});

function ProducePiece({
  tint,
  rotate,
  progress,
}: {
  tint: string;
  rotate: string;
  progress: number;
}) {
  return (
    <View
      style={[
        styles.produce,
        {
          backgroundColor: tint,
          transform: [{ rotate }],
          borderRadius: 20 + progress * 10,
          width: 22 + progress * 3,
        },
      ]}
    />
  );
}

function Bubble({
  left,
  bottom,
  size,
  opacity,
}: {
  left: `${number}%`;
  bottom: `${number}%`;
  size: number;
  opacity: number;
}) {
  return (
    <View
      style={[
        styles.bubble,
        {
          left,
          bottom,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 360,
    width: '100%',
  },
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  glowCompact: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  jarShell: {
    width: 220,
    height: 300,
    borderWidth: 2,
    borderRadius: 56,
    paddingTop: 22,
    overflow: 'visible',
  },
  jarShellCompact: {
    width: 188,
    height: 254,
    borderRadius: 48,
  },
  jarLip: {
    position: 'absolute',
    top: -10,
    left: 28,
    right: 28,
    height: 24,
    borderWidth: 1,
    borderRadius: AppTheme.radius.pill,
  },
  jarBody: {
    flex: 1,
    borderRadius: 48,
    marginHorizontal: 10,
    marginBottom: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  brine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  highlight: {
    position: 'absolute',
    top: 22,
    left: 18,
    width: 24,
    height: 152,
    borderRadius: AppTheme.radius.pill,
  },
  produceColumn: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 24,
  },
  produce: {
    height: 58,
    borderWidth: 1,
    borderColor: 'rgba(54, 78, 31, 0.18)',
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  stage: {
    marginTop: AppTheme.spacing.md,
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
