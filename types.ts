
export enum GrievanceCategory {
  SOLID_WASTE = 'SOLID_WASTE',
  ROADS = 'ROADS',
  WATER = 'WATER',
  ELECTRICITY = 'ELECTRICITY',
  OTHER = 'OTHER'
}

export enum Jurisdiction {
  BCC = 'BCC',
  CANTONMENT = 'CANTONMENT',
  VTU = 'VTU'
}

export interface GrievanceReport {
  id: string;
  category: GrievanceCategory;
  severity_score: number;
  description_summary: string;
  suggested_jurisdiction: Jurisdiction;
  timestamp: number;
  imageUrl?: string;
  status: 'SUBMITTED' | 'PROCESSING' | 'RESOLVED' | 'OPEN';
  location?: {
    lat: number;
    lng: number;
  };
}

export interface UserProfile {
  name: string;
  civicScore: number;
  totalReports: number;
}
