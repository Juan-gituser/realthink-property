export type NotificationType =
  | "lead_new"
  | "survey_new"
  | "property_sold"
  | "property_price_changed"
  | "membership_upgrade"
  | "admin_login";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  link?: string;
}