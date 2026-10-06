export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  at: string; // ISO datetime
  read: boolean;
}
