export interface Habit {
  id: string;
  habit_name: string;
  target: number;
  cron: string;
  created: string;
  updated: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
  created: string;
  updated: string;
}

export interface HabitStatus {
  id: string;
  habit: Habit;
  date: string;
  time: number;
  done: boolean;
  created: string;
  updated: string;
}
