import { UserRole } from './user-role';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  userRole: UserRole;
}