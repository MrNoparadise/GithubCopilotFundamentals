import { BadgeTone, IconName } from '../../shared/ui';
import { ActivityKind, NotificationType, TaskPriority, TaskStatus } from '../models';

export const STATUS_LABEL: Record<TaskStatus, string> = {
  open: 'Open',
  'in-progress': 'In progress',
  blocked: 'Blocked',
  done: 'Done',
};

export const STATUS_TONE: Record<TaskStatus, BadgeTone> = {
  open: 'info',
  'in-progress': 'neutral',
  blocked: 'danger',
  done: 'success',
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const PRIORITY_TONE: Record<TaskPriority, BadgeTone> = {
  low: 'neutral',
  medium: 'warning',
  high: 'danger',
};

export const ACTIVITY_TEXT: Record<ActivityKind, string> = {
  created: 'created',
  completed: 'completed',
  commented: 'commented on',
  blocked: 'flagged as blocked',
};

export const ACTIVITY_ICON: Record<ActivityKind, IconName> = {
  created: 'plus',
  completed: 'check',
  commented: 'message',
  blocked: 'alert',
};

export const ACTIVITY_TONE: Record<ActivityKind, BadgeTone> = {
  created: 'info',
  completed: 'success',
  commented: 'neutral',
  blocked: 'danger',
};

export const STATUSES: TaskStatus[] = ['open', 'in-progress', 'blocked', 'done'];

export const PRIORITIES: TaskPriority[] = ['high', 'medium', 'low'];

export const NOTIFICATION_LABEL: Record<NotificationType, string> = {
  info: 'Info',
  warning: 'Warning',
  success: 'Success',
  error: 'Error',
};

export const NOTIFICATION_TONE: Record<NotificationType, BadgeTone> = {
  info: 'info',
  warning: 'warning',
  success: 'success',
  error: 'danger',
};

export const NOTIFICATION_ICON: Record<NotificationType, IconName> = {
  info: 'info',
  warning: 'alert',
  success: 'check-circle',
  error: 'x-circle',
};

export const NOTIFICATION_TYPES: NotificationType[] = ['info', 'warning', 'success', 'error'];
