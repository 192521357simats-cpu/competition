
export type AnalysisVerdict = 'REAL' | 'AI' | 'UNCERTAIN';

export type Platform = 'YOUTUBE' | 'INSTAGRAM' | 'X' | 'TIKTOK' | 'STANDALONE';

export interface ForensicReport {
  verdict: AnalysisVerdict;
  probability: number;
  confidence: number;
  findings: string[];
  generatorSource?: string; // e.g. "Midjourney v6", "DALL-E 3", "Sora"
  anomalies: {
    label: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];
  summary: string;
}

export interface ScanResult {
  id: string;
  timestamp: number;
  sourceName: string;
  sourceType: 'FILE' | 'URL' | 'CAMERA' | 'INTEGRATED';
  platform?: Platform;
  imagePreview: string;
  report: ForensicReport;
}

export interface GuardianPlatform {
  id: Platform;
  name: string;
  connected: boolean;
  accountName?: string;
}
