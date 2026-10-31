export interface AuditPoint {
  id: number;
  titleEn: string;
  titleKu: string;
  status: 'passed' | 'warning' | 'critical';
  valueEn: string;
  valueKu: string;
}

export interface SecurityReportData {
  targetUrl: string;
  host: string;
  origin: string;
  isReachable: boolean;
  latencyMs: number;
  statusCode: number;
  isHttps: boolean;
  grade: 'A+' | 'A' | 'B' | 'C' | 'F';
  overallScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  headers: {
    hsts: boolean;
    csp: boolean;
    xfo: boolean;
    xcto: boolean;
    server: string;
    waf: string;
  };
  points: AuditPoint[];
  aiInsight?: string;
  scannedAt: string;
}

export interface LocationInfo {
  latitude: number;
  longitude: number;
  placeName?: string;
  source: 'gps_exif' | 'visual_estimate';
  confidence?: string;
  details?: string;
}

export interface ReconData {
  domain: string;
  ip: string;
  autonomousSystem: string;
  geo: {
    country: string;
    city: string;
    timezone: string;
  };
  portsOpen: string[];
  tlsVersion: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text?: string;
  imageSrc?: string;
  isSecurityReport?: boolean;
  securityData?: SecurityReportData;
  isReconReport?: boolean;
  reconData?: ReconData;
  thinkingProcess?: string;
  modelUsed?: string;
  timestamp: string;
}

export type StyleMode = 'Normal' | 'Shorter' | 'Detailed';
export type ToolName = 'Security / Cyber' | 'Web' | 'Agent';
