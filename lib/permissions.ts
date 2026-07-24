export type Role = 'guest' | 'member' | 'smart_buyer' | 'investor_pro' | 'admin' | 'super_admin';

export type Permission = 
  | 'view_listings'
  | 'use_calculators'
  | 'schedule_survey'
  | 'ai_match_limited'
  | 'compare_2'
  | 'unlimited_favorites'
  | 'simulation_history'
  | 'compare_5'
  | 'ai_match_unlimited'
  | 'property_health_score'
  | 'hidden_cost_analyzer'
  | 'negotiation_estimator'
  | 'smart_decision_hub'
  | 'download_passport_pdf'
  | 'price_alert'
  | 'investment_score'
  | 'roi_forecast'
  | 'area_insight_pro'
  | 'ai_property_advisor'
  | 'market_trend'
  | 'investment_report'
  | 'admin_panel'
  | 'super_admin_panel';

// Pemetaan Hak Akses per Role (Mudah ditambah atau dimodifikasi)
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  guest: [
    'view_listings', 'use_calculators', 'schedule_survey', 
    'ai_match_limited', 'compare_2'
  ],
  member: [
    'view_listings', 'use_calculators', 'schedule_survey', 
    'ai_match_limited', 'compare_2',
    'unlimited_favorites', 'simulation_history', 'compare_5', 
    'ai_match_unlimited'
  ],
  smart_buyer: [
    'view_listings', 'use_calculators', 'schedule_survey', 
    'unlimited_favorites', 'simulation_history', 'compare_5', 
    'ai_match_unlimited',
    'property_health_score', 'hidden_cost_analyzer', 'negotiation_estimator',
    'smart_decision_hub', 'download_passport_pdf', 'price_alert'
  ],
  investor_pro: [
    'view_listings', 'use_calculators', 'schedule_survey', 
    'unlimited_favorites', 'simulation_history', 'compare_5', 
    'ai_match_unlimited',
    'property_health_score', 'hidden_cost_analyzer', 'negotiation_estimator',
    'smart_decision_hub', 'download_passport_pdf', 'price_alert',
    'investment_score', 'roi_forecast', 'area_insight_pro',
    'ai_property_advisor', 'market_trend', 'investment_report'
  ],
  admin: [
    'view_listings', 'use_calculators', 'admin_panel'
  ],
  super_admin: [
    'view_listings', 'use_calculators', 'schedule_survey', 
    'unlimited_favorites', 'simulation_history', 'compare_5', 
    'ai_match_unlimited', 'property_health_score', 'hidden_cost_analyzer', 
    'negotiation_estimator', 'smart_decision_hub', 'download_passport_pdf', 
    'price_alert', 'investment_score', 'roi_forecast', 'area_insight_pro',
    'ai_property_advisor', 'market_trend', 'investment_report',
    'admin_panel', 'super_admin_panel'
  ]
};

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}