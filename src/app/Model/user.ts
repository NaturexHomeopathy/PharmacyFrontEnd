import { Role } from "../Enum/role";

export interface User {
  userId: string;
  email: string;

  firstName?: string;
  lastName?: string;

  // backend-only fields → OPTIONAL in frontend
  PasswordHash?: string;
  Role?: Role;
  CreatedAt?: string;

  isEnabled?: boolean;
  isOnline?: boolean;
  mobileNumber:string;
  address:string;
}
