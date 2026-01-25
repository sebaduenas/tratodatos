// lib/constants/legal-bases.ts
// Bases de Licitud - Ley 21.719

export const LEGAL_BASES = {
  consent: {
    id: 'consent',
    name: 'Consentimiento del titular',
    article: 'Art. 12',
    description: 'El titular ha dado su consentimiento libre, informado, específico e inequívoco.',
    requirements: [
      'Debe ser libre: sin presión ni condicionamiento',
      'Debe ser informado: el titular conoce qué datos se tratarán y para qué',
      'Debe ser específico: para finalidades determinadas',
      'Debe ser inequívoco: manifestación clara de voluntad',
      'Puede ser revocado en cualquier momento',
    ],
    forSensitiveData: 'Debe ser consentimiento explícito (Art. 16 ter)',
  },
  contract: {
    id: 'contract',
    name: 'Ejecución de contrato',
    article: 'Art. 13 letra c)',
    description: 'El tratamiento es necesario para ejecutar un contrato con el titular.',
    requirements: [
      'Debe existir un contrato vigente',
      'El tratamiento debe ser necesario para cumplir el contrato',
      'No puede exceder lo necesario para la finalidad contractual',
    ],
    examples: [
      'Procesar datos para entregar un servicio contratado',
      'Gestionar la relación laboral con empleados',
      'Procesar pagos de productos o servicios',
    ],
  },
  legalObligation: {
    id: 'legalObligation',
    name: 'Cumplimiento de obligación legal',
    article: 'Art. 13 letra b)',
    description: 'El tratamiento es necesario para cumplir una obligación legal.',
    requirements: [
      'Debe existir una norma legal que imponga la obligación',
      'El tratamiento debe ser necesario para cumplir dicha obligación',
    ],
    examples: [
      'Conservar registros contables por exigencia tributaria',
      'Reportar información a organismos reguladores',
      'Cumplir requerimientos de la Dirección del Trabajo',
    ],
  },
  vitalInterest: {
    id: 'vitalInterest',
    name: 'Protección de interés vital',
    article: 'Art. 13 letra a)',
    description: 'El tratamiento es necesario para proteger la vida o integridad física.',
    requirements: [
      'Debe existir una situación de emergencia o riesgo vital',
      'El titular debe estar imposibilitado de dar consentimiento',
    ],
  },
  publicInterest: {
    id: 'publicInterest',
    name: 'Interés público',
    article: 'Art. 13 letra e)',
    description: 'El tratamiento es necesario para funciones públicas.',
    requirements: [
      'Debe existir una función pública que lo justifique',
      'Generalmente aplicable a organismos públicos',
    ],
  },
  legitimateInterest: {
    id: 'legitimateInterest',
    name: 'Interés legítimo',
    article: 'Art. 13 letra d)',
    description: 'Tratamiento necesario para intereses legítimos del responsable.',
    requirements: [
      'Debe existir un interés legítimo real y actual',
      'El tratamiento debe ser necesario para satisfacer ese interés',
      'Debe realizarse un test de ponderación',
      'Los intereses del titular no deben prevalecer',
    ],
    warning: 'NO es aplicable para datos sensibles',
    balancingTest: [
      '¿Cuál es el interés legítimo que se persigue?',
      '¿Es el tratamiento necesario?',
      '¿Cuáles son los derechos del titular que podrían verse afectados?',
      '¿Existe equilibrio razonable?',
    ],
  },
} as const;

export type LegalBasisKey = keyof typeof LEGAL_BASES;
