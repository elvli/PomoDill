import { Session, SessionType, TimerSettings } from '@/types';

export const STORAGE_KEYS = {
  timerSettings: 'pomodill.timer-settings',
  sessions: 'pomodill.sessions',
} as const;

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  notificationsEnabled: false,
  soundEnabled: false,
  themePreference: 'system',
};

export const SESSION_LABELS: Record<SessionType, string> = {
  focus: 'Focus',
  short_break: 'Short Break',
  long_break: 'Long Break',
};

export function getSessionDurationSeconds(type: SessionType, settings: TimerSettings) {
  switch (type) {
    case 'focus':
      return settings.focusMinutes * 60;
    case 'short_break':
      return settings.shortBreakMinutes * 60;
    case 'long_break':
      return settings.longBreakMinutes * 60;
  }
}

export function getNextSessionType(
  currentType: SessionType,
  completedFocusSessions: number,
  settings: TimerSettings
): SessionType {
  if (currentType === 'focus') {
    return completedFocusSessions > 0 && completedFocusSessions % settings.sessionsBeforeLongBreak === 0
      ? 'long_break'
      : 'short_break';
  }

  return 'focus';
}

export function createSessionRecord(input: {
  type: SessionType;
  durationSeconds: number;
  completed: boolean;
  startedAt: string;
  endedAt: string;
  taskId?: string;
}): Session {
  return {
    id: `${input.type}-${input.startedAt}`,
    type: input.type,
    durationSeconds: input.durationSeconds,
    completed: input.completed,
    startedAt: input.startedAt,
    endedAt: input.endedAt,
    taskId: input.taskId,
  };
}

export function isSameDay(timestamp: string, compareDate = new Date()) {
  const date = new Date(timestamp);

  return date.toDateString() === compareDate.toDateString();
}
