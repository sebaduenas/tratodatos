// lib/constants/index.ts
// TratoDatos - Todas las constantes

export * from './data-categories';
export * from './legal-bases';
export * from './purposes';

// =====================================================
// TITULARES DE DATOS
// =====================================================

export const DATA_SUBJECTS = {
  customers: { id: 'customers', name: 'Clientes' },
  employees: { id: 'employees', name: 'Trabajadores y empleados' },
  contractors: { id: 'contractors', name: 'Contratistas y prestadores de servicios' },
  suppliers: { id: 'suppliers', name: 'Proveedores' },
  websiteVisitors: { id: 'websiteVisitors', name: 'Visitantes del sitio web' },
  appUsers: { id: 'appUsers', name: 'Usuarios de aplicaciones' },
  patients: { id: 'patients', name: 'Pacientes' },
  students: { id: 'students', name: 'Estudiantes' },
  minors: { id: 'minors', name: 'Menores de edad' },
} as const;

// =====================================================
// MEDIDAS DE SEGURIDAD
// =====================================================

export const SECURITY_MEASURES = {
  organizational: {
    privacyPolicy: 'Política de privacidad documentada',
    dataProtectionTraining: 'Capacitación en protección de datos',
    accessControl: 'Control de acceso basado en roles',
    confidentialityAgreements: 'Acuerdos de confidencialidad',
    incidentResponsePlan: 'Plan de respuesta a incidentes',
    vendorManagement: 'Gestión de proveedores',
  },
  technical: {
    encryption: 'Cifrado de datos en reposo y tránsito',
    pseudonymization: 'Pseudonimización de datos',
    accessLogs: 'Registros de acceso',
    firewalls: 'Firewalls y seguridad perimetral',
    antivirus: 'Software antivirus/antimalware',
    backups: 'Copias de seguridad periódicas',
    secureDevelopment: 'Desarrollo seguro de software',
  },
  physical: {
    accessControl: 'Control de acceso físico',
    surveillance: 'Vigilancia y monitoreo',
    secureFacilities: 'Instalaciones seguras',
    deviceSecurity: 'Seguridad de dispositivos',
  },
} as const;

// =====================================================
// REGIONES DE CHILE
// =====================================================

export const CHILEAN_REGIONS = [
  { code: 'XV', name: 'Región de Arica y Parinacota' },
  { code: 'I', name: 'Región de Tarapacá' },
  { code: 'II', name: 'Región de Antofagasta' },
  { code: 'III', name: 'Región de Atacama' },
  { code: 'IV', name: 'Región de Coquimbo' },
  { code: 'V', name: 'Región de Valparaíso' },
  { code: 'RM', name: 'Región Metropolitana' },
  { code: 'VI', name: 'Región del Libertador General Bernardo O\'Higgins' },
  { code: 'VII', name: 'Región del Maule' },
  { code: 'XVI', name: 'Región de Ñuble' },
  { code: 'VIII', name: 'Región del Biobío' },
  { code: 'IX', name: 'Región de La Araucanía' },
  { code: 'XIV', name: 'Región de Los Ríos' },
  { code: 'X', name: 'Región de Los Lagos' },
  { code: 'XI', name: 'Región de Aysén' },
  { code: 'XII', name: 'Región de Magallanes' },
] as const;

// =====================================================
// TEXTOS LEGALES PARA EL DOCUMENTO
// =====================================================

export const LEGAL_TEXTS = {
  policyIntro: `La presente Política de Tratamiento de Datos Personales tiene por objeto informar a los titulares de datos personales sobre el tratamiento que {companyName} (en adelante, el "Responsable") realiza de sus datos personales, en cumplimiento de lo dispuesto en la Ley N° 19.628 sobre Protección de la Vida Privada, modificada por la Ley N° 21.719.

Esta Política se publica en conformidad con lo establecido en el artículo 14 ter de la Ley, que obliga a los responsables de bases de datos a mantener a disposición del público una política de tratamiento de datos personales.`,

  rightsSection: `De acuerdo con la Ley N° 19.628, modificada por la Ley N° 21.719, usted tiene los siguientes derechos:

• Derecho de Acceso (Art. 10): Solicitar confirmación sobre si sus datos están siendo tratados y acceder a ellos.

• Derecho de Rectificación (Art. 11): Solicitar la rectificación de datos inexactos o incompletos.

• Derecho de Cancelación/Supresión (Art. 12): Solicitar la supresión de sus datos cuando ya no sean necesarios.

• Derecho de Oposición (Art. 13): Oponerse al tratamiento en determinadas circunstancias.

• Derecho a la Portabilidad (Art. 15): Recibir sus datos en formato estructurado.

• Derecho a no ser objeto de decisiones automatizadas (Art. 15 bis): No ser objeto de decisiones basadas únicamente en tratamiento automatizado.`,

  agencyInfo: `La Agencia de Protección de Datos Personales es el organismo encargado de velar por el cumplimiento de la normativa sobre protección de datos personales en Chile. Si considera que sus derechos han sido vulnerados, puede presentar un reclamo ante la Agencia.

Sitio web: www.agenciadeprotecciondedatos.cl`,

  disclaimer: `AVISO LEGAL

Este documento ha sido generado mediante la plataforma TratoDatos (tratodatos.cl) como herramienta de apoyo para el cumplimiento de las obligaciones establecidas en la Ley N° 19.628, modificada por la Ley N° 21.719.

La información contenida en este documento refleja las respuestas proporcionadas por el usuario. TratoDatos no verifica la exactitud de la información proporcionada.

Este documento NO constituye asesoría legal. Se recomienda que las organizaciones con tratamientos complejos consulten con un profesional especializado.`,
} as const;

// =====================================================
// PLANES Y LÍMITES
// =====================================================

export const PLAN_LIMITS = {
  FREE: {
    name: 'Gratuito',
    price: 0,
    maxPolicies: 1,
    features: [
      'PDF con marca de agua',
      'Formato HTML',
      'Soporte por email',
    ],
    restrictions: [
      'Sin exportación a Word',
      'Sin versionamiento',
    ],
  },
  PROFESSIONAL: {
    name: 'Profesional',
    price: 9990,
    maxPolicies: 5,
    features: [
      'PDF sin marca de agua',
      'Exportación a Word',
      'Versionamiento de políticas',
      'Soporte prioritario',
    ],
    restrictions: [],
  },
  ENTERPRISE: {
    name: 'Empresa',
    price: 29990,
    maxPolicies: 999,
    features: [
      'Políticas ilimitadas',
      'Multi-usuario',
      'API de acceso',
      'Soporte dedicado',
      'Personalización de marca',
    ],
    restrictions: [],
  },
} as const;
