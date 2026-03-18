import { useEffect, useMemo, useRef, useState } from 'react';

import { formatFocusSummary } from '@/lib/session';
import {
  createSessionRecord,
  DEFAULT_TIMER_SETTINGS,
  getNextSessionType,
  getSessionDurationSeconds,
  isSameDay,
  SESSION_LABELS,
  STORAGE_KEYS,
} from '@/lib/timer';
import { getStoredItem, setStoredItem } from '@/lib/storage';
import { Session, SessionType, TimerSettings } from '@/types';

export type UsePomodoroTimerResult = {
  settings: TimerSettings;
  sessions: Session[];
  currentMode: SessionType;
  modeLabel: string;
  secondsRemaining: number;
  isRunning: boolean;
  isSessionActive: boolean;
  sessionProgress: number;
  completedFocusSessions: number;
  selectedTaskLabel: string;
  todayFocusLabel: string;
  sessionsCompletedToday: number;
  progressTarget: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
};

export function usePomodoroTimer(): UsePomodoroTimerResult {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_TIMER_SETTINGS);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentMode, setCurrentMode] = useState<SessionType>('focus');
  const [secondsRemaining, setSecondsRemaining] = useState(
    getSessionDurationSeconds('focus', DEFAULT_TIMER_SETTINGS)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
  const sessionStartedAtRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTimerData() {
      const [storedSettings, storedSessions] = await Promise.all([
        getStoredItem(STORAGE_KEYS.timerSettings),
        getStoredItem(STORAGE_KEYS.sessions),
      ]);

      if (cancelled) {
        return;
      }

      const parsedSettings = storedSettings ? (JSON.parse(storedSettings) as TimerSettings) : DEFAULT_TIMER_SETTINGS;
      const parsedSessions = storedSessions ? (JSON.parse(storedSessions) as Session[]) : [];
      const focusCount = parsedSessions.filter((session) => session.type === 'focus' && session.completed).length;

      setSettings(parsedSettings);
      setSessions(parsedSessions);
      setCompletedFocusSessions(focusCount);
      setSecondsRemaining(getSessionDurationSeconds('focus', parsedSettings));
    }

    void loadTimerData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((currentSeconds) => {
        if (currentSeconds <= 1) {
          setIsRunning(false);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (secondsRemaining !== 0 || isRunning) {
      return;
    }

    if (!sessionStartedAtRef.current) {
      return;
    }

    void finalizeSession(true);
  }, [secondsRemaining, isRunning]);

  async function persistSessions(nextSessions: Session[]) {
    setSessions(nextSessions);
    await setStoredItem(STORAGE_KEYS.sessions, JSON.stringify(nextSessions));
  }

  async function finalizeSession(completed: boolean) {
    const startedAt = sessionStartedAtRef.current;

    if (!startedAt) {
      return;
    }

    const endedAt = new Date().toISOString();
    const durationSeconds = getSessionDurationSeconds(currentMode, settings) - secondsRemaining;
    const safeDuration = completed
      ? getSessionDurationSeconds(currentMode, settings)
      : Math.max(durationSeconds, 0);

    if (safeDuration > 0 || completed) {
      const session = createSessionRecord({
        type: currentMode,
        durationSeconds: safeDuration,
        completed,
        startedAt,
        endedAt,
      });

      const nextSessions = [session, ...sessions].slice(0, 50);
      await persistSessions(nextSessions);

      if (completed && currentMode === 'focus') {
        setCompletedFocusSessions((count) => count + 1);
      }
    }

    sessionStartedAtRef.current = null;
    setIsSessionActive(false);

    const nextCompletedFocusSessions = completed && currentMode === 'focus'
      ? completedFocusSessions + 1
      : completedFocusSessions;
    const nextMode = getNextSessionType(currentMode, nextCompletedFocusSessions, settings);

    setCurrentMode(nextMode);
    setSecondsRemaining(getSessionDurationSeconds(nextMode, settings));
  }

  function startTimer() {
    if (!sessionStartedAtRef.current) {
      sessionStartedAtRef.current = new Date().toISOString();
    }

    setIsSessionActive(true);
    setIsRunning(true);
  }

  function pauseTimer() {
    setIsRunning(false);
  }

  function resetTimer() {
    setIsRunning(false);
    sessionStartedAtRef.current = null;
    setIsSessionActive(false);
    setSecondsRemaining(getSessionDurationSeconds(currentMode, settings));
  }

  function skipTimer() {
    setIsRunning(false);

    if (sessionStartedAtRef.current) {
      void finalizeSession(false);
      return;
    }

    const nextMode = getNextSessionType(currentMode, completedFocusSessions, settings);
    setCurrentMode(nextMode);
    setSecondsRemaining(getSessionDurationSeconds(nextMode, settings));
  }

  const todayFocusSeconds = useMemo(
    () => sessions
      .filter((session) => session.type === 'focus' && session.completed && isSameDay(session.startedAt))
      .reduce((total, session) => total + session.durationSeconds, 0),
    [sessions]
  );

  const sessionProgress = useMemo(() => {
    const totalSeconds = getSessionDurationSeconds(currentMode, settings);

    if (totalSeconds <= 0) {
      return 0;
    }

    return Math.min(Math.max((totalSeconds - secondsRemaining) / totalSeconds, 0), 1);
  }, [currentMode, secondsRemaining, settings]);

  const sessionsCompletedToday = useMemo(
    () => sessions.filter((session) => session.type === 'focus' && session.completed && isSameDay(session.startedAt)).length,
    [sessions]
  );

  return {
    settings,
    sessions,
    currentMode,
    modeLabel: SESSION_LABELS[currentMode],
    secondsRemaining,
    isRunning,
    isSessionActive,
    sessionProgress,
    completedFocusSessions,
    selectedTaskLabel: 'Task linking arrives in phase 3',
    todayFocusLabel: formatFocusSummary(todayFocusSeconds),
    sessionsCompletedToday,
    progressTarget: settings.sessionsBeforeLongBreak,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
  };
}
