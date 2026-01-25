// Plantillas predefinidas por industria

export interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  icon: string;
  tier: "FREE" | "PROFESSIONAL" | "ENTERPRISE";
  data: {
    step01Data?: Record<string, unknown>;
    step02Data?: Record<string, unknown>;
    step03Data?: Record<string, unknown>;
    step04Data?: Record<string, unknown>;
    step05Data?: Record<string, unknown>;
    step06Data?: Record<string, unknown>;
    step07Data?: Record<string, unknown>;
    step08Data?: Record<string, unknown>;
    step09Data?: Record<string, unknown>;
    step10Data?: Record<string, unknown>;
    step11Data?: Record<string, unknown>;
    step12Data?: Record<string, unknown>;
  };
}

export const POLICY_TEMPLATES: PolicyTemplate[] = [
  {
    id: "ecommerce",
    name: "E-commerce / Tienda Online",
    description: "Ideal para tiendas online que procesan pagos y envíos",
    industry: "retail",
    icon: "🛒",
    tier: "FREE",
    data: {
      step02Data: {
        categories: {
          identification: true,
          contact: true,
          financial: true,
          location: true,
          professional: false,
          health: false,
          biometric: false,
          political: false,
          religious: false,
          sexual: false,
          criminal: false,
          minors: false,
          digital: true,
          other: false,
        },
        hasSensitiveData: false,
        hasMinorData: false,
      },
      step03Data: {
        purposes: [
          "service_provision",
          "communications",
          "marketing",
          "legal_compliance",
        ],
      },
      step04Data: {
        legalBases: ["consent", "contract", "legal_obligation"],
      },
      step05Data: {
        dataSubjects: ["Clientes", "Visitantes del sitio web", "Suscriptores newsletter"],
      },
      step07Data: {
        securityMeasures: [
          "Cifrado de datos en tránsito (HTTPS/TLS)",
          "Cifrado de datos en reposo",
          "Control de acceso basado en roles",
          "Copias de seguridad periódicas",
          "Pasarela de pago segura (PCI DSS)",
        ],
      },
      step08Data: {
        defaultPeriod: "5y",
        deletionProcess: "Los datos se eliminan automáticamente tras 5 años de inactividad o a solicitud del titular.",
      },
    },
  },
  {
    id: "saas",
    name: "SaaS / Software",
    description: "Para empresas de software y servicios digitales",
    industry: "technology",
    icon: "💻",
    tier: "FREE",
    data: {
      step02Data: {
        categories: {
          identification: true,
          contact: true,
          financial: true,
          location: false,
          professional: true,
          health: false,
          biometric: false,
          political: false,
          religious: false,
          sexual: false,
          criminal: false,
          minors: false,
          digital: true,
          other: false,
        },
        hasSensitiveData: false,
        hasMinorData: false,
      },
      step03Data: {
        purposes: [
          "service_provision",
          "product_improvement",
          "support",
          "analytics",
        ],
      },
      step04Data: {
        legalBases: ["consent", "contract"],
      },
      step05Data: {
        dataSubjects: ["Usuarios de la plataforma", "Administradores de cuenta", "Contactos de facturación"],
      },
      step07Data: {
        securityMeasures: [
          "Cifrado de datos en tránsito (HTTPS/TLS)",
          "Cifrado de datos en reposo",
          "Autenticación de dos factores",
          "Control de acceso basado en roles",
          "Auditorías de seguridad periódicas",
          "Copias de seguridad automatizadas",
        ],
      },
      step08Data: {
        defaultPeriod: "3y",
        deletionProcess: "Los datos se eliminan a los 30 días de cancelar la suscripción o a solicitud.",
      },
    },
  },
  {
    id: "healthcare",
    name: "Salud / Clínica",
    description: "Para centros médicos y profesionales de la salud",
    industry: "healthcare",
    icon: "🏥",
    tier: "PROFESSIONAL",
    data: {
      step02Data: {
        categories: {
          identification: true,
          contact: true,
          financial: true,
          location: true,
          professional: false,
          health: true,
          biometric: true,
          political: false,
          religious: false,
          sexual: false,
          criminal: false,
          minors: true,
          digital: false,
          other: false,
        },
        hasSensitiveData: true,
        hasMinorData: true,
      },
      step03Data: {
        purposes: [
          "service_provision",
          "legal_compliance",
          "research",
        ],
      },
      step04Data: {
        legalBases: ["consent", "legal_obligation", "vital_interest"],
      },
      step05Data: {
        dataSubjects: ["Pacientes", "Representantes legales", "Personal médico"],
      },
      step07Data: {
        securityMeasures: [
          "Cifrado de datos en tránsito (HTTPS/TLS)",
          "Cifrado de datos en reposo",
          "Control de acceso basado en roles",
          "Registros de auditoría",
          "Anonimización de datos para investigación",
          "Copias de seguridad cifradas",
          "Capacitación en protección de datos de salud",
        ],
      },
      step08Data: {
        defaultPeriod: "10y",
        deletionProcess: "Los datos clínicos se conservan según normativa vigente (mínimo 10 años). Datos administrativos se eliminan a los 6 años.",
      },
    },
  },
  {
    id: "education",
    name: "Educación",
    description: "Para instituciones educativas y plataformas de aprendizaje",
    industry: "education",
    icon: "🎓",
    tier: "PROFESSIONAL",
    data: {
      step02Data: {
        categories: {
          identification: true,
          contact: true,
          financial: true,
          location: true,
          professional: false,
          health: false,
          biometric: false,
          political: false,
          religious: false,
          sexual: false,
          criminal: false,
          minors: true,
          digital: true,
          other: false,
        },
        hasSensitiveData: false,
        hasMinorData: true,
      },
      step03Data: {
        purposes: [
          "service_provision",
          "communications",
          "legal_compliance",
          "analytics",
        ],
      },
      step04Data: {
        legalBases: ["consent", "contract", "legal_obligation"],
      },
      step05Data: {
        dataSubjects: ["Estudiantes", "Apoderados", "Personal docente", "Personal administrativo"],
      },
      step07Data: {
        securityMeasures: [
          "Cifrado de datos en tránsito (HTTPS/TLS)",
          "Control de acceso basado en roles",
          "Protección especial para datos de menores",
          "Copias de seguridad periódicas",
          "Capacitación del personal",
        ],
      },
      step08Data: {
        defaultPeriod: "6y",
        deletionProcess: "Los datos académicos se conservan según normativa vigente. Datos de contacto se eliminan al finalizar la relación.",
      },
    },
  },
  {
    id: "fintech",
    name: "Fintech / Servicios Financieros",
    description: "Para empresas de tecnología financiera",
    industry: "finance",
    icon: "💳",
    tier: "ENTERPRISE",
    data: {
      step02Data: {
        categories: {
          identification: true,
          contact: true,
          financial: true,
          location: true,
          professional: true,
          health: false,
          biometric: true,
          political: false,
          religious: false,
          sexual: false,
          criminal: true,
          minors: false,
          digital: true,
          other: false,
        },
        hasSensitiveData: true,
        hasMinorData: false,
      },
      step03Data: {
        purposes: [
          "service_provision",
          "fraud_prevention",
          "legal_compliance",
          "risk_assessment",
        ],
      },
      step04Data: {
        legalBases: ["consent", "contract", "legal_obligation", "legitimate_interest"],
      },
      step05Data: {
        dataSubjects: ["Clientes", "Solicitantes de crédito", "Beneficiarios"],
      },
      step07Data: {
        securityMeasures: [
          "Cifrado de datos en tránsito (HTTPS/TLS)",
          "Cifrado de datos en reposo",
          "Autenticación multifactor",
          "Control de acceso basado en roles",
          "Monitoreo de transacciones",
          "Registros de auditoría inmutables",
          "Pruebas de penetración periódicas",
          "Cumplimiento PCI DSS",
        ],
      },
      step08Data: {
        defaultPeriod: "10y",
        deletionProcess: "Los datos financieros se conservan según normativa bancaria y tributaria (mínimo 6 años). Documentos KYC por 10 años.",
      },
    },
  },
  {
    id: "hr",
    name: "Recursos Humanos",
    description: "Para gestión de personal y reclutamiento",
    industry: "hr",
    icon: "👥",
    tier: "PROFESSIONAL",
    data: {
      step02Data: {
        categories: {
          identification: true,
          contact: true,
          financial: true,
          location: true,
          professional: true,
          health: true,
          biometric: true,
          political: false,
          religious: false,
          sexual: false,
          criminal: true,
          minors: false,
          digital: false,
          other: false,
        },
        hasSensitiveData: true,
        hasMinorData: false,
      },
      step03Data: {
        purposes: [
          "hr_management",
          "legal_compliance",
          "service_provision",
        ],
      },
      step04Data: {
        legalBases: ["consent", "contract", "legal_obligation"],
      },
      step05Data: {
        dataSubjects: ["Empleados", "Candidatos", "Ex-empleados", "Contratistas"],
      },
      step07Data: {
        securityMeasures: [
          "Cifrado de datos en tránsito (HTTPS/TLS)",
          "Control de acceso basado en roles",
          "Acceso restringido a datos sensibles",
          "Copias de seguridad cifradas",
          "Capacitación en protección de datos",
        ],
      },
      step08Data: {
        defaultPeriod: "6y",
        deletionProcess: "Datos de empleados se conservan 5 años post-término. CVs de candidatos no seleccionados se eliminan a los 6 meses.",
      },
    },
  },
];

export function getTemplateById(id: string): PolicyTemplate | undefined {
  return POLICY_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByTier(tier: "FREE" | "PROFESSIONAL" | "ENTERPRISE"): PolicyTemplate[] {
  const tierOrder = ["FREE", "PROFESSIONAL", "ENTERPRISE"];
  const userTierIndex = tierOrder.indexOf(tier);
  
  return POLICY_TEMPLATES.filter((t) => {
    const templateTierIndex = tierOrder.indexOf(t.tier);
    return templateTierIndex <= userTierIndex;
  });
}
