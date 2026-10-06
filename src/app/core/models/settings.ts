export type WeekStart = 'monday' | 'sunday';

export interface WorkspaceSettings {
  workspaceName: string;
  weekStart: WeekStart;
  capacityWarning: number; // percent of weekly hours
}
