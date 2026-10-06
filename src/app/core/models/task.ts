export type TaskStatus = 'open' | 'in-progress' | 'blocked' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  owner: string; // member id
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // ISO date
  estimateHours: number;
  completedAt?: string; // ISO date, set while status is 'done'
}

/** What the user enters for a new task. The store assigns id and status. */
export type NewTask = Omit<Task, 'id' | 'status' | 'completedAt'>;
