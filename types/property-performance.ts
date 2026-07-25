export interface PropertyPerformanceItem {
  id: string;
  property_name: string;
  views: number;
  favorites: number;
  whatsapp_clicks: number;
  surveys: number;
  deals: number;
  ctr: number; // Click-Through Rate dalam persen (%)
  conversion_rate: number; // Conversion Rate dalam persen (%)
}

export type SortField = 
  | 'property_name' 
  | 'views' 
  | 'favorites' 
  | 'whatsapp_clicks' 
  | 'surveys' 
  | 'deals' 
  | 'ctr' 
  | 'conversion_rate';

export type SortOrder = 'asc' | 'desc';