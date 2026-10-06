import { Injectable, signal } from '@angular/core';
import { Member } from '../models';

@Injectable({ providedIn: 'root' })
export class MembersStore {
  readonly members = signal<Member[]>([
    { id: 'anna', name: 'Anna Keller', role: 'Frontend', initials: 'AK', capacityHours: 32, photoUrl: '/avatars/anna.jpg' },
    { id: 'tomas', name: 'Tomas Novak', role: 'Frontend', initials: 'TN', capacityHours: 40, photoUrl: '/avatars/tomas.jpg' },
    { id: 'priya', name: 'Priya Raman', role: 'Design', initials: 'PR', capacityHours: 24, photoUrl: '/avatars/priya.jpg' },
    { id: 'luis', name: 'Luis Ortega', role: 'Backend', initials: 'LO', capacityHours: 40, photoUrl: '/avatars/luis.jpg' },
    { id: 'mei', name: 'Mei Tanaka', role: 'QA', initials: 'MT', capacityHours: 36, photoUrl: '/avatars/mei.jpg' },
  ]);

  /** The signed-in user. Not on the team, so not in `members`. */
  readonly currentUser = signal<Pick<Member, 'name' | 'initials' | 'photoUrl'>>({ name: 'Kirill Moroz', initials: 'KM' });

  byId(id: string): Member | undefined {
    return this.members().find((m) => m.id === id);
  }
}
