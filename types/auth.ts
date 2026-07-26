export type UserRole =
  "guest" | "member" | "smart_buyer" | "investor_pro" | "admin" | "super_admin";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

// Matriks bobot hierarki untuk perbandingan hak akses (RBAC)
export const roleHierarchy: Record<UserRole, number> = {
  guest: 0,
  member: 1,
  smart_buyer: 2,
  investor_pro: 3,
  admin: 4,
  super_admin: 5,
};
