export type NotificationType = 'info' | 'warning' | 'success' | 'error';

/** Named AppNotification so it does not shadow the browser's own `Notification`. */
export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  memberId?: string; // the teammate it is about, if any
  at: string; // ISO datetime
  read: boolean;
}
