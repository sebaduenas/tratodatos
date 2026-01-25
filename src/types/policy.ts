// types/policy.ts
// TratoDatos - Tipos TypeScript

// =====================================================
// DATOS DE CADA PASO DEL WIZARD
// =====================================================

// PASO 1: Identificación del Responsable
export interface Step01Data {
  companyName: string;
  rut: string;
  legalRepName: string;
  legalRepRut: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  email: string;
  website?: string;
  hasDPO: boolean;
  dpoName?: string;
  dpoEmail?: string;
  dpoPhone?: string;
}

// PASO 2: Categorías de Datos
export interface Step02Data {
  categories: {
    identification: boolean;
    contact: boolean;
    financial: boolean;
    employment: boolean;
    health: boolean;
    biometric: boolean;
    genetic: boolean;
    ethnic: boolean;
    political: boolean;
    religious: boolean;
    sexualOrientation: boolean;
    criminal: boolean;
    minors: boolean;
    geolocation: boolean;
    behavioral: boolean;
    other: boolean;
  };
  customCategories: Array<{
    name: string;
    description: string;
    isSensitive: boolean;
  }>;
  hasSensitiveData: boolean;
  hasMinorData: boolean;
}

// PASO 3: Titulares de Datos
export interface Step03Data {
  subjects: {
    customers: boolean;
    employees: boolean;
    contractors: boolean;
    suppliers: boolean;
    websiteVisitors: boolean;
    appUsers: boolean;
    patients: boolean;
    students: boolean;
    minors: boolean;
    other: boolean;
  };
  customSubjects: string[];
  processesMinorData: boolean;
  minorDataDetails?: {
    ageRange: string;
    parentalConsentMechanism: string;
  };
}

// PASO 4: Finalidades
export interface Step04Data {
  purposes: {
    contractExecution: boolean;
    serviceProvision: boolean;
    billing: boolean;
    customerSupport: boolean;
    marketing: boolean;
    profiling: boolean;
    analytics: boolean;
    legalCompliance: boolean;
    taxObligations: boolean;
    employmentManagement: boolean;
    security: boolean;
    qualityControl: boolean;
    research: boolean;
    other: boolean;
  };
  customPurposes: Array<{
    description: string;
    category: string;
  }>;
}

// PASO 5: Base Legal
export interface Step05Data {
  bases: {
    consent: boolean;
    contract: boolean;
    legalObligation: boolean;
    vitalInterest: boolean;
    publicInterest: boolean;
    legitimateInterest: boolean;
  };
  consentDetails?: {
    mechanism: string;
    withdrawalProcess: string;
    recordKeeping: boolean;
  };
  legitimateInterestAssessment?: {
    interest: string;
    necessity: string;
    balancingTest: string;
  };
  sensitiveDataBasis?: {
    explicitConsent: boolean;
    healthProfessional: boolean;
    employmentLaw: boolean;
    publicHealth: boolean;
  };
}

// PASO 6: Destinatarios
export interface Recipient {
  id: string;
  name: string;
  type: 'processor' | 'controller' | 'authority' | 'other';
  purpose: string;
  country: string;
  hasContract: boolean;
}

export interface Step06Data {
  sharesData: boolean;
  recipients: Recipient[];
  processorCategories: string[];
  authorityDisclosures: string[];
}

// PASO 7: Transferencias Internacionales
export interface InternationalTransfer {
  id: string;
  country: string;
  recipient: string;
  purpose: string;
  mechanism: string;
  hasAdequacy: boolean;
}

export interface Step07Data {
  hasInternationalTransfers: boolean;
  transfers: InternationalTransfer[];
  mechanisms: {
    adequacyDecision: boolean;
    standardClauses: boolean;
    bindingCorporateRules: boolean;
    explicitConsent: boolean;
    contractNecessity: boolean;
  };
}

// PASO 8: Plazos de Conservación
export interface RetentionPeriod {
  dataCategory: string;
  period: string;
  criteria: string;
  legalBasis?: string;
}

export interface Step08Data {
  defaultPeriod: string;
  periods: RetentionPeriod[];
  deletionProcess: string;
  archivingPolicy?: string;
}

// PASO 9: Fuentes de Datos
export interface Step09Data {
  sources: {
    directFromSubject: boolean;
    publicSources: boolean;
    thirdParties: boolean;
    automaticCollection: boolean;
  };
  thirdPartySources?: string[];
  publicSources?: string[];
  automaticCollectionMethods?: string[];
}

// PASO 10: Decisiones Automatizadas
export interface AutomatedDecision {
  id: string;
  type: string;
  description: string;
  logic: string;
  significance: string;
  safeguards: string;
}

export interface Step10Data {
  hasAutomatedDecisions: boolean;
  decisions: AutomatedDecision[];
  profiling: {
    exists: boolean;
    purpose?: string;
    logic?: string;
    consequences?: string;
  };
  humanReviewProcess?: string;
  optOutMechanism?: string;
}

// PASO 11: Medidas de Seguridad
export interface Step11Data {
  organizational: {
    privacyPolicy: boolean;
    dataProtectionTraining: boolean;
    accessControl: boolean;
    confidentialityAgreements: boolean;
    incidentResponsePlan: boolean;
    vendorManagement: boolean;
  };
  technical: {
    encryption: boolean;
    pseudonymization: boolean;
    accessLogs: boolean;
    firewalls: boolean;
    antivirus: boolean;
    backups: boolean;
    secureDevelopment: boolean;
  };
  physical: {
    accessControl: boolean;
    surveillance: boolean;
    secureFacilities: boolean;
    deviceSecurity: boolean;
  };
  customMeasures: string[];
}

// PASO 12: Revisión y Configuración Final
export interface Step12Data {
  effectiveDate: string;
  reviewFrequency: 'annual' | 'biannual' | 'asNeeded';
  responsiblePerson: string;
  contactChannel: string;
  responseTime: string;
  rightsExerciseProcess: string;
  complaintProcess: string;
}

// =====================================================
// WIZARD STATE
// =====================================================

export interface WizardState {
  policyId: string;
  currentStep: number;
  completedSteps: number[];
  data: {
    step01: Step01Data | null;
    step02: Step02Data | null;
    step03: Step03Data | null;
    step04: Step04Data | null;
    step05: Step05Data | null;
    step06: Step06Data | null;
    step07: Step07Data | null;
    step08: Step08Data | null;
    step09: Step09Data | null;
    step10: Step10Data | null;
    step11: Step11Data | null;
    step12: Step12Data | null;
  };
  validation: {
    [key: string]: {
      isValid: boolean;
      errors: string[];
      warnings: string[];
    };
  };
}

// =====================================================
// POLICY & USER TYPES
// =====================================================

import type { Policy as PrismaPolicy, PolicyStatus as PrismaPolicyStatus } from '@prisma/client';

export type PolicyStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'PUBLISHED' | 'ARCHIVED';
export type SubscriptionTier = 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

// Tipo para el Policy tal como viene de Prisma (con JsonValue para campos JSON)
export type PolicyFromPrisma = PrismaPolicy;

// Función helper para convertir Policy de Prisma a nuestro tipo
export function toPolicyType(prismaPolicy: PrismaPolicy): Policy {
  return {
    ...prismaPolicy,
    status: prismaPolicy.status as PolicyStatus,
    step01Data: prismaPolicy.step01Data as Step01Data | null,
    step02Data: prismaPolicy.step02Data as Step02Data | null,
    step03Data: prismaPolicy.step03Data as Step03Data | null,
    step04Data: prismaPolicy.step04Data as Step04Data | null,
    step05Data: prismaPolicy.step05Data as Step05Data | null,
    step06Data: prismaPolicy.step06Data as Step06Data | null,
    step07Data: prismaPolicy.step07Data as Step07Data | null,
    step08Data: prismaPolicy.step08Data as Step08Data | null,
    step09Data: prismaPolicy.step09Data as Step09Data | null,
    step10Data: prismaPolicy.step10Data as Step10Data | null,
    step11Data: prismaPolicy.step11Data as Step11Data | null,
    step12Data: prismaPolicy.step12Data as Step12Data | null,
  };
}

export interface Policy {
  id: string;
  userId: string;
  name: string;
  status: PolicyStatus;
  version: number;
  step01Data: Step01Data | null;
  step02Data: Step02Data | null;
  step03Data: Step03Data | null;
  step04Data: Step04Data | null;
  step05Data: Step05Data | null;
  step06Data: Step06Data | null;
  step07Data: Step07Data | null;
  step08Data: Step08Data | null;
  step09Data: Step09Data | null;
  step10Data: Step10Data | null;
  step11Data: Step11Data | null;
  step12Data: Step12Data | null;
  currentStep: number;
  completedSteps: number[];
  completionPct: number;
  generatedAt: Date | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  companyName: string | null;
  companyRut: string | null;
  companyAddress: string | null;
  companyCity: string | null;
  companyRegion: string | null;
  companyPhone: string | null;
  companyEmail: string | null;
  companyWebsite: string | null;
  industry: string | null;
  employeeCount: string | null;
  subscriptionTier: SubscriptionTier;
  role: UserRole;
  createdAt: Date;
  lastLoginAt: Date | null;
  loginCount: number;
  marketingConsent: boolean;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// =====================================================
// ADMIN TYPES
// =====================================================

export interface AdminStats {
  users: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    byTier: {
      FREE: number;
      PROFESSIONAL: number;
      ENTERPRISE: number;
    };
  };
  policies: {
    total: number;
    completed: number;
    published: number;
    completionRate: number;
  };
  downloads: {
    today: number;
    thisWeek: number;
    byFormat: {
      pdf: number;
      docx: number;
      html: number;
    };
  };
  revenue: {
    mrr: number;
    thisMonth: number;
  };
}

export interface UserExport {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  companyName: string | null;
  companyRut: string | null;
  industry: string | null;
  subscriptionTier: SubscriptionTier;
  createdAt: Date;
  lastLoginAt: Date | null;
  policiesCount: number;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

// =====================================================
// WIZARD STEP INFO
// =====================================================

export interface WizardStepInfo {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export const WIZARD_STEPS: WizardStepInfo[] = [
  { number: 1, title: 'Identificación', description: 'Datos del responsable', icon: 'Building2' },
  { number: 2, title: 'Categorías', description: 'Tipos de datos', icon: 'Database' },
  { number: 3, title: 'Titulares', description: 'A quién pertenecen', icon: 'Users' },
  { number: 4, title: 'Finalidades', description: 'Para qué se usan', icon: 'Target' },
  { number: 5, title: 'Base Legal', description: 'Fundamento jurídico', icon: 'Scale' },
  { number: 6, title: 'Destinatarios', description: 'Con quién se comparten', icon: 'Share2' },
  { number: 7, title: 'Transferencias', description: 'Envíos internacionales', icon: 'Globe' },
  { number: 8, title: 'Conservación', description: 'Plazos de retención', icon: 'Clock' },
  { number: 9, title: 'Fuentes', description: 'Origen de los datos', icon: 'Download' },
  { number: 10, title: 'Automatización', description: 'Decisiones automatizadas', icon: 'Cpu' },
  { number: 11, title: 'Seguridad', description: 'Medidas de protección', icon: 'Shield' },
  { number: 12, title: 'Finalización', description: 'Revisión y publicación', icon: 'CheckCircle' },
];
