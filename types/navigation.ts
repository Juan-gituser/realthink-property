import { LucideIcon } from "lucide-react";

export type UserRole = "admin" | "member" | "smart_buyer" | "smart-buyer" | string;

export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

export interface NavConfig {
  dashboardName: string;
  dashboardPath: string;
  navItems: NavItem[];
}