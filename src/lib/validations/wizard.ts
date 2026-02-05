// lib/validations/wizard.ts
// TratoDatos - Schemas de Validación Zod

import { z } from 'zod';
import { validateRut, formatRut, cleanRut } from '@/lib/rut';

// =====================================================
// VALIDADOR DE RUT CHILENO MEJORADO
// =====================================================

// Custom RUT schema with auto-formatting
const rutSchema = z.string()
  .min(8, 'El RUT debe tener al menos 8 caracteres')
  .max(12, 'RUT demasiado largo')
  .refine((value) => {
    // Allow empty for optional fields
    if (!value || value.trim() === '') return true;
    return validateRut(value);
  }, { message: 'RUT inválido. Verifica el dígito verificador.' })
  .transform((value) => {
    if (!value || value.trim() === '') return value;
    return formatRut(value);
  });

// =====================================================
// PASO 1: Identificación del Responsable
// =====================================================

export const step01Schema = z.object({
  companyName: z.string().min(2, 'Mínimo 2 caracteres').max(200),
  rut: rutSchema,
  legalRepName: z.string().min(2, 'Mínimo 2 caracteres').max(200),
  legalRepRut: rutSchema,
  address: z.string().min(5, 'Mínimo 5 caracteres').max(300),
  city: z.string().min(2, 'Seleccione una ciudad'),
  region: z.string().min(1, 'Seleccione una región'),
  phone: z.string().regex(/^\+?56\s?\d{9}$/, 'Formato: +56 912345678'),
  email: z.string().email('Email inválido'),
  website: z.string(),
  hasDPO: z.boolean(),
  dpoName: z.string().optional().or(z.literal('')),
  dpoEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  dpoPhone: z.string().optional().or(z.literal('')),
}).refine((data) => !data.hasDPO || (data.dpoName && data.dpoEmail), {
  message: 'DPO requiere nombre y correo',
  path: ['dpoName'],
});

// =====================================================
// PASO 2: Categorías de Datos
// =====================================================

export const step02Schema = z.object({
  categories: z.object({
    identification: z.boolean(),
    contact: z.boolean(),
    financial: z.boolean(),
    employment: z.boolean(),
    health: z.boolean(),
    biometric: z.boolean(),
    genetic: z.boolean(),
    ethnic: z.boolean(),
    political: z.boolean(),
    religious: z.boolean(),
    sexualOrientation: z.boolean(),
    criminal: z.boolean(),
    minors: z.boolean(),
    geolocation: z.boolean(),
    behavioral: z.boolean(),
    other: z.boolean(),
  }).refine((c) => Object.values(c).some(v => v), { message: 'Seleccione al menos una categoría' }),
  customCategories: z.array(z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    isSensitive: z.boolean(),
  })),
  hasSensitiveData: z.boolean(),
  hasMinorData: z.boolean(),
});

// =====================================================
// PASO 3: Titulares de Datos
// =====================================================

export const step03Schema = z.object({
  subjects: z.object({
    customers: z.boolean(),
    employees: z.boolean(),
    contractors: z.boolean(),
    suppliers: z.boolean(),
    websiteVisitors: z.boolean(),
    appUsers: z.boolean(),
    patients: z.boolean(),
    students: z.boolean(),
    minors: z.boolean(),
    other: z.boolean(),
  }).refine((s) => Object.values(s).some(v => v), { message: 'Seleccione al menos un tipo de titular' }),
  customSubjects: z.array(z.string()),
  processesMinorData: z.boolean(),
  minorDataDetails: z.object({
    ageRange: z.string(),
    parentalConsentMechanism: z.string(),
  }).optional(),
});

// =====================================================
// PASO 4: Finalidades
// =====================================================

export const step04Schema = z.object({
  purposes: z.object({
    contractExecution: z.boolean(),
    serviceProvision: z.boolean(),
    billing: z.boolean(),
    customerSupport: z.boolean(),
    marketing: z.boolean(),
    profiling: z.boolean(),
    analytics: z.boolean(),
    legalCompliance: z.boolean(),
    taxObligations: z.boolean(),
    employmentManagement: z.boolean(),
    security: z.boolean(),
    qualityControl: z.boolean(),
    research: z.boolean(),
    other: z.boolean(),
  }).refine((p) => Object.values(p).some(v => v), { message: 'Seleccione al menos una finalidad' }),
  customPurposes: z.array(z.object({
    description: z.string().min(10),
    category: z.string(),
  })),
});

// =====================================================
// PASO 5: Base Legal
// =====================================================

export const step05Schema = z.object({
  bases: z.object({
    consent: z.boolean(),
    contract: z.boolean(),
    legalObligation: z.boolean(),
    vitalInterest: z.boolean(),
    publicInterest: z.boolean(),
    legitimateInterest: z.boolean(),
  }).refine((b) => Object.values(b).some(v => v), { message: 'Seleccione al menos una base legal' }),
  consentDetails: z.object({
    mechanism: z.string().optional(),
    withdrawalProcess: z.string().optional(),
    recordKeeping: z.boolean().optional(),
  }).optional(),
  legitimateInterestAssessment: z.object({
    interest: z.string().optional(),
    necessity: z.string().optional(),
    balancingTest: z.string().optional(),
  }).optional(),
});

// =====================================================
// PASO 6: Destinatarios
// =====================================================

export const step06Schema = z.object({
  sharesData: z.boolean(),
  recipients: z.array(z.object({
    id: z.string(),
    name: z.string().min(2),
    type: z.enum(['processor', 'controller', 'authority', 'other']),
    purpose: z.string().min(5),
    country: z.string(),
    hasContract: z.boolean(),
  })),
  processorCategories: z.array(z.string()),
  authorityDisclosures: z.array(z.string()),
});

// =====================================================
// PASO 7: Transferencias Internacionales
// =====================================================

export const step07Schema = z.object({
  hasInternationalTransfers: z.boolean(),
  transfers: z.array(z.object({
    id: z.string(),
    country: z.string(),
    recipient: z.string(),
    purpose: z.string(),
    mechanism: z.string(),
    hasAdequacy: z.boolean(),
  })),
  mechanisms: z.object({
    adequacyDecision: z.boolean(),
    standardClauses: z.boolean(),
    bindingCorporateRules: z.boolean(),
    explicitConsent: z.boolean(),
    contractNecessity: z.boolean(),
  }),
});

// =====================================================
// PASO 8: Plazos de Conservación
// =====================================================

export const step08Schema = z.object({
  defaultPeriod: z.string().min(1, 'Seleccione un período'),
  periods: z.array(z.object({
    dataCategory: z.string(),
    period: z.string(),
    criteria: z.string(),
    legalBasis: z.string().optional(),
  })),
  deletionProcess: z.string().min(10, 'Describa el proceso de eliminación'),
  archivingPolicy: z.string().optional(),
});

// =====================================================
// PASO 9: Fuentes de Datos
// =====================================================

export const step09Schema = z.object({
  sources: z.object({
    directFromSubject: z.boolean(),
    publicSources: z.boolean(),
    thirdParties: z.boolean(),
    automaticCollection: z.boolean(),
  }).refine((s) => Object.values(s).some(v => v), { message: 'Seleccione al menos una fuente' }),
  thirdPartySources: z.array(z.string()),
  publicSources: z.array(z.string()),
  automaticCollectionMethods: z.array(z.string()),
});

// =====================================================
// PASO 10: Decisiones Automatizadas
// =====================================================

export const step10Schema = z.object({
  hasAutomatedDecisions: z.boolean(),
  decisions: z.array(z.object({
    id: z.string(),
    type: z.string(),
    description: z.string(),
    logic: z.string(),
    significance: z.string(),
    safeguards: z.string(),
  })),
  profiling: z.object({
    exists: z.boolean(),
    purpose: z.string().optional(),
    logic: z.string().optional(),
    consequences: z.string().optional(),
  }),
  humanReviewProcess: z.string().optional(),
  optOutMechanism: z.string().optional(),
});

// =====================================================
// PASO 11: Medidas de Seguridad
// =====================================================

export const step11Schema = z.object({
  organizational: z.object({
    privacyPolicy: z.boolean(),
    dataProtectionTraining: z.boolean(),
    accessControl: z.boolean(),
    confidentialityAgreements: z.boolean(),
    incidentResponsePlan: z.boolean(),
    vendorManagement: z.boolean(),
  }),
  technical: z.object({
    encryption: z.boolean(),
    pseudonymization: z.boolean(),
    accessLogs: z.boolean(),
    firewalls: z.boolean(),
    antivirus: z.boolean(),
    backups: z.boolean(),
    secureDevelopment: z.boolean(),
  }),
  physical: z.object({
    accessControl: z.boolean(),
    surveillance: z.boolean(),
    secureFacilities: z.boolean(),
    deviceSecurity: z.boolean(),
  }),
  customMeasures: z.array(z.string()),
});

// =====================================================
// PASO 12: Revisión y Configuración Final
// =====================================================

export const step12Schema = z.object({
  effectiveDate: z.string().min(1, 'Seleccione una fecha'),
  reviewFrequency: z.enum(['annual', 'biannual', 'asNeeded']),
  responsiblePerson: z.string().min(2, 'Ingrese el nombre del responsable'),
  contactChannel: z.string().min(5, 'Especifique el canal de contacto'),
  responseTime: z.string().min(1, 'Seleccione el plazo de respuesta'),
  rightsExerciseProcess: z.string().min(20, 'Describa el proceso de ejercicio de derechos'),
  complaintProcess: z.string().min(20, 'Describa el proceso de reclamos'),
});

// Export all schemas
export const wizardSchemas = {
  1: step01Schema,
  2: step02Schema,
  3: step03Schema,
  4: step04Schema,
  5: step05Schema,
  6: step06Schema,
  7: step07Schema,
  8: step08Schema,
  9: step09Schema,
  10: step10Schema,
  11: step11Schema,
  12: step12Schema,
} as const;

// Types from schemas
export type Step01FormData = z.infer<typeof step01Schema>;
export type Step02FormData = z.infer<typeof step02Schema>;
export type Step03FormData = z.infer<typeof step03Schema>;
export type Step04FormData = z.infer<typeof step04Schema>;
export type Step05FormData = z.infer<typeof step05Schema>;
export type Step06FormData = z.infer<typeof step06Schema>;
export type Step07FormData = z.infer<typeof step07Schema>;
export type Step08FormData = z.infer<typeof step08Schema>;
export type Step09FormData = z.infer<typeof step09Schema>;
export type Step10FormData = z.infer<typeof step10Schema>;
export type Step11FormData = z.infer<typeof step11Schema>;
export type Step12FormData = z.infer<typeof step12Schema>;
