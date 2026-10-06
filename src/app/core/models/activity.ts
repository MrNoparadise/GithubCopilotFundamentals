export type ActivityKind = 'created' | 'completed' | 'commented' | 'blocked';

export interface Activity {
  id: number;
  kind: ActivityKind;
  actor: string; // member id
  taskId: number;
  at: string; // ISO datetime
}
