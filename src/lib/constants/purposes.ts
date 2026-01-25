// lib/constants/purposes.ts
// Finalidades del Tratamiento

export const PURPOSES = {
  contractExecution: {
    id: 'contractExecution',
    name: 'Ejecución y cumplimiento de contratos',
    category: 'contractual',
  },
  serviceProvision: {
    id: 'serviceProvision',
    name: 'Prestación de servicios',
    category: 'contractual',
  },
  billing: {
    id: 'billing',
    name: 'Facturación y cobranza',
    category: 'contractual',
  },
  customerSupport: {
    id: 'customerSupport',
    name: 'Atención al cliente',
    category: 'operational',
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing y comunicaciones comerciales',
    category: 'commercial',
    requiresConsent: true,
  },
  profiling: {
    id: 'profiling',
    name: 'Elaboración de perfiles',
    category: 'commercial',
    requiresConsent: true,
    warning: 'Puede requerir consentimiento específico',
  },
  analytics: {
    id: 'analytics',
    name: 'Análisis y mejora de servicios',
    category: 'operational',
  },
  legalCompliance: {
    id: 'legalCompliance',
    name: 'Cumplimiento de obligaciones legales',
    category: 'legal',
  },
  taxObligations: {
    id: 'taxObligations',
    name: 'Cumplimiento de obligaciones tributarias',
    category: 'legal',
  },
  employmentManagement: {
    id: 'employmentManagement',
    name: 'Gestión de relaciones laborales',
    category: 'operational',
  },
  security: {
    id: 'security',
    name: 'Seguridad y prevención de fraudes',
    category: 'operational',
  },
  qualityControl: {
    id: 'qualityControl',
    name: 'Control de calidad',
    category: 'operational',
  },
  research: {
    id: 'research',
    name: 'Investigación y desarrollo',
    category: 'operational',
  },
} as const;

export type PurposeKey = keyof typeof PURPOSES;
