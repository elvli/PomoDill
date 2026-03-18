import { useEffect, useRef, useState } from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

import { MainAppMenu } from '@/components/main-app-menu';
import { MarketplaceScreen } from '@/components/screens/marketplace-screen';
import { StatsDashboardScreen } from '@/components/screens/stats-dashboard-screen';
import { TimerHomeScreen } from '@/components/screens/timer-home-screen';
import { usePomodoroTimer } from '@/hooks/use-pomodoro-timer';

const PAGE_INDEX = {
  stats: 0,
  timer: 1,
  store: 2,
} as const;

export function MainSwipeShell() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const timer = usePomodoroTimer();
  const scrollRef = useRef<ScrollView | null>(null);
  const editorOverlayOpacity = useRef(new Animated.Value(0)).current;
  const [currentPage, setCurrentPage] = useState<number>(PAGE_INDEX.timer);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTimerEditorOpen, setIsTimerEditorOpen] = useState(false);
  const isNavigationLocked = timer.currentMode === 'focus' && timer.isRunning;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: currentPage * width,
      animated: false,
    });
  }, [currentPage, width]);

  useEffect(() => {
    Animated.timing(editorOverlayOpacity, {
      toValue: isTimerEditorOpen ? 1 : 0,
      duration: isTimerEditorOpen ? 180 : 140,
      useNativeDriver: true,
    }).start();
  }, [editorOverlayOpacity, isTimerEditorOpen]);

  function jumpToPage(page: number) {
    setMenuOpen(false);
    setCurrentPage(page);
    scrollRef.current?.scrollTo({ x: page * width, animated: true });
  }

  function handleMomentumEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextPage = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(nextPage);
  }

  return (
    <View style={styles.safeArea}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={!isNavigationLocked}
        bounces={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: width * PAGE_INDEX.timer, y: 0 }}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}>
        <View style={[styles.page, { width }]}>
          <StatsDashboardScreen />
        </View>
        <View style={[styles.page, { width }]}>
          <TimerHomeScreen timer={timer} onEditorVisibilityChange={setIsTimerEditorOpen} />
        </View>
        <View style={[styles.page, { width }]}>
          <MarketplaceScreen />
        </View>
      </ScrollView>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.editorOverlay,
          {
            opacity: editorOverlayOpacity,
            backgroundColor: 'rgba(24, 32, 20, 0.34)',
          },
        ]}
      />

      <MainAppMenu
        hidden={isNavigationLocked}
        isOpen={menuOpen}
        onToggle={() => setMenuOpen((open) => !open)}
        onSignIn={() => {
          setMenuOpen(false);
          router.push('/sign-in');
        }}
        onSettings={() => {
          setMenuOpen(false);
          router.push('/settings');
        }}
        onStore={() => jumpToPage(PAGE_INDEX.store)}
        onStats={() => jumpToPage(PAGE_INDEX.stats)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  editorOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
  },
});
