export type SessionType = 'focus' | 'short_break' | 'long_break';

export interface User {
  id: string;
  isGuest: boolean;
  displayName?: string;
}

export interface TimerSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  themePreference: 'system' | 'light' | 'dark';
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  estimatedPomodoros?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  type: SessionType;
  durationSeconds: number;
  completed: boolean;
  startedAt: string;
  endedAt?: string;
  taskId?: string;
}

export interface DailyStats {
  date: string;
  focusSeconds: number;
  sessionsCompleted: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}
