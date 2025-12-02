export interface ProductData {
  productName: string;
  features: string;
  targetAudience: string;
  cta: string;
}

export interface BrandData {
  personality: string; // e.g., "Professional, Trustworthy" or "Playful, Energetic"
  tone: string; // e.g., "Formal" or "Conversational"
  primaryColor: string; // Hex or description
  brandingDocument?: string; // Content of an uploaded branding file
}

export type AppStep = 
  | 'input' 
  | 'agent1_working' 
  | 'agent1_review' 
  | 'agent2_working' 
  | 'final_review'
  | 'agent3_working' // New: Auditor working
  | 'audit_report';  // New: Audit results

export interface AgentResult {
  html: string;
  prompt: string;
}

export interface AuditItem {
  criteria: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
}

export interface EngineSimulation {
  engineName: string;
  simulatedResponse: string;
  verdict: string;
}

export interface AuditData {
  overallScore: number;
  summary: string;
  checklist: AuditItem[];
  engineSimulations: EngineSimulation[];
}

export interface AgentResponse {
  html: string;
  thinking?: string;
}