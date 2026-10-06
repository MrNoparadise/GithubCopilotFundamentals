export interface Member {
  id: string;
  name: string;
  role: string;
  initials: string;
  capacityHours: number; // per week
  photoUrl?: string; // served from public/avatars; initials show when missing
}
