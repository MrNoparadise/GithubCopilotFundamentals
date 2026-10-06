export type NotificationType = 'info' | 'warning' | 'success' | 'error';

/** A message for the signed-in user. Named AppNotification so it does not clash with the browser's Notification. */
export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  at: string; // ISO datetime
  memberId?: string; // teammate it is about
  read: boolean;
}
