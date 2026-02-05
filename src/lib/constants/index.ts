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
  // Sección 1: Presentación de la política
  presentacion: `La presente Política de Tratamiento de Datos Personales describe cómo {companyName} trata la información personal en el contexto de sus actividades comerciales, administrativas y digitales. Esta política explica qué datos recopilamos, cómo los utilizamos, las medidas de protección implementadas y los derechos que asisten a los titulares de dichos datos.

Esta Política se ajusta a lo dispuesto en la Ley N° 19.628 sobre Protección de la Vida Privada, modificada por la Ley N° 21.719, y demás normativa aplicable en la República de Chile.`,

  // Sección 2: Introducción y ámbito de aplicación
  introduccion: `Esta Política aplica a todas las interacciones que usted tenga con nosotros a través de nuestro sitio web, plataformas digitales y actividades presenciales, incluyendo la prestación de servicios, gestión de relaciones comerciales, atención al cliente y administración de servicios.

El término "tratamiento" comprende cualquier operación realizada sobre datos personales, tales como: acceso, recopilación, registro, organización, estructuración, almacenamiento, adaptación, modificación, consulta, utilización, comunicación, transmisión, difusión, cotejo, interconexión, supresión, destrucción, o cualquier otra forma de habilitación de acceso.

Nos comprometemos a respetar los principios de licitud, finalidad, proporcionalidad, calidad, seguridad, transparencia, confidencialidad e información en todo tratamiento de datos personales.`,

  // Sección 3: Quiénes somos (se usa con step01)
  quienesSomos: `{companyName}, en adelante "el Responsable", es la entidad encargada del tratamiento de sus datos personales y responsable de determinar los fines y medios de dicho tratamiento.`,

  // Sección 4: A quiénes aplica
  aQuienesAplica: `Esta Política de Tratamiento de Datos Personales aplica a todas las personas cuyos datos personales sean tratados por {companyName}, incluyendo pero no limitándose a:`,

  noAplica: `Esta Política no aplica a profesionales externos colaboradores ni a empleados, trabajadores o candidatos a procesos de selección, quienes se rigen por políticas específicas.`,

  // Sección 5: Qué información se trata - intro
  categoriasDatosIntro: `Tratamos diferentes categorías de datos personales dependiendo de la naturaleza de nuestra relación con usted y los servicios que le prestamos.`,

  categoriasDatosStandard: `Categorías de datos personales que podemos tratar:`,

  categoriasDatosSensibles: `Datos sensibles (requieren protección adicional conforme al Artículo 16 ter de la Ley):`,

  notaDatosSensibles: `El tratamiento de datos sensibles se realiza únicamente cuando existe consentimiento explícito del titular, o cuando es estrictamente necesario conforme a las bases legales establecidas en la Ley N° 21.719.`,

  // Sección 6: Uso de información en línea
  usoEnLineaIntro: `Cuando usted interactúa con nuestros canales digitales, podemos tratar su información de las siguientes maneras:`,

  usoEnLineaFormularios: `Formularios de contacto y solicitudes: Utilizamos los datos proporcionados para verificar su identidad, responder a sus consultas y gestionar sus solicitudes.`,

  usoEnLineaCookies: `Navegación del sitio (cookies técnicas): Utilizamos cookies estrictamente necesarias para administrar las funcionalidades básicas del sitio web. Estas cookies no requieren consentimiento previo.`,

  usoEnLineaAnalytics: `Análisis estadísticos: Podemos utilizar herramientas de análisis web configuradas para anonimizar direcciones IP y generar estadísticas agregadas sobre el uso del sitio.`,

  // Sección 7: Fuentes de datos
  fuentesDatosIntro: `Obtenemos información personal de las siguientes fuentes:`,

  fuenteDirecta: `Recopilación directa del titular: Información que usted nos proporciona voluntariamente a través de formularios, correos electrónicos, llamadas telefónicas, contratos o cualquier otra comunicación directa.`,

  fuenteAutomatica: `Recopilación automática: Información recopilada mediante tecnologías como cookies técnicas y herramientas de análisis web cuando usted navega por nuestro sitio.`,

  fuenteTerceros: `Fuentes de terceros: Información obtenida de proveedores de servicios, socios comerciales, registros públicos o bases de datos de acceso público, siempre conforme a la normativa vigente.`,

  fuentePublica: `Fuentes públicas: Información disponible públicamente en Internet, redes sociales con perfiles públicos, registros públicos y bases de datos de acceso público.`,

  // Sección 8: Finalidades del tratamiento
  finalidadesIntro: `Sus datos personales son tratados para las siguientes finalidades, siempre en cumplimiento de los principios de proporcionalidad y finalidad:`,

  // Sección 9: Bases legales
  basesLegalesIntro: `El tratamiento de sus datos personales se fundamenta en una o más de las siguientes bases legales establecidas en la Ley N° 19.628, modificada por la Ley N° 21.719:`,

  baseConsentimiento: `Consentimiento del titular (Art. 12): Cuando usted ha otorgado su consentimiento libre, informado, específico e inequívoco para una o más finalidades específicas. El consentimiento puede ser revocado en cualquier momento sin afectar la licitud del tratamiento previo.`,

  baseContrato: `Ejecución de un contrato (Art. 13 letra c): Cuando el tratamiento es necesario para la ejecución de un contrato del que usted es parte, o para aplicar medidas precontractuales adoptadas a su solicitud.`,

  baseObligacionLegal: `Cumplimiento de obligación legal (Art. 13 letra b): Cuando el tratamiento es necesario para cumplir una obligación legal aplicable al responsable, incluyendo normativas tributarias, laborales, sanitarias o regulatorias.`,

  baseInteresVital: `Protección de intereses vitales (Art. 13 letra a): En situaciones excepcionales donde el tratamiento es necesario para proteger su vida o integridad física o psíquica, o la de otra persona.`,

  baseInteresPublico: `Interés público (Art. 13 letra e): Cuando el tratamiento es necesario para el cumplimiento de una función pública o el ejercicio de potestades públicas.`,

  baseInteresLegitimo: `Interés legítimo del responsable (Art. 13 letra d): Cuando el tratamiento es necesario para satisfacer intereses legítimos del responsable, siempre que sobre dichos intereses no prevalezcan los intereses, derechos y libertades del titular. Esta base no es aplicable para el tratamiento de datos sensibles.`,

  // Sección 10: Compartir información
  compartirIntro: `Sus datos personales pueden ser comunicados a terceros en las siguientes circunstancias y con las garantías adecuadas:`,

  compartirProveedores: `Proveedores de servicios: Compartimos datos con proveedores que nos asisten en la prestación de servicios, incluyendo servicios tecnológicos, hosting, procesamiento de pagos y servicios profesionales. Estos proveedores están obligados contractualmente a proteger sus datos.`,

  compartirAutoridades: `Autoridades competentes: Comunicamos datos cuando es requerido por ley, regulación, proceso judicial o solicitud gubernamental válida.`,

  compartirGrupo: `Entidades relacionadas: Podemos compartir datos con empresas de nuestro grupo empresarial bajo acuerdos de confidencialidad apropiados.`,

  transferenciasIntro: `Transferencias internacionales de datos:`,

  transferenciasTexto: `Cuando transferimos datos personales a países que no cuenten con niveles de protección equivalentes a los de Chile, implementamos salvaguardas apropiadas tales como cláusulas contractuales tipo, consentimiento explícito del titular, o medidas de seguridad técnicas y organizativas adecuadas.`,

  // Sección 11: Conservación
  conservacionIntro: `Conservamos sus datos personales únicamente durante el tiempo necesario para cumplir con las finalidades para las que fueron recopilados, conforme a nuestras obligaciones legales, regulatorias y contractuales.`,

  conservacionCriterios: `Criterios para determinar los plazos de conservación: La cantidad, naturaleza y sensibilidad de los datos; el riesgo potencial de uso no autorizado; las finalidades del tratamiento; las obligaciones legales, contractuales o regulatorias aplicables.`,

  conservacionSupresion: `Una vez cumplida la finalidad o transcurrido el plazo legal de conservación, procederemos a la supresión, anonimización o bloqueo de los datos, según corresponda.`,

  conservacionExcepciones: `Podemos conservar datos por períodos adicionales cuando: (a) existan obligaciones legales o regulatorias que lo requieran; (b) sea necesario para formular, ejercer o defender reclamaciones en procedimientos judiciales o administrativos; (c) se requiera para fines históricos, estadísticos o científicos de interés público, aplicando medidas de anonimización.`,

  // Sección 12: Derechos del titular
  derechosIntro: `De acuerdo con la Ley N° 19.628, modificada por la Ley N° 21.719, usted tiene los siguientes derechos respecto a sus datos personales:`,

  derechoAcceso: `Derecho de Acceso (Art. 10): Solicitar confirmación sobre si sus datos personales están siendo tratados y, en caso afirmativo, acceder a ellos junto con información sobre las finalidades del tratamiento, categorías de datos, destinatarios y plazos de conservación.`,

  derechoRectificacion: `Derecho de Rectificación (Art. 11): Solicitar la rectificación de datos personales inexactos o incompletos.`,

  derechoSupresion: `Derecho de Cancelación/Supresión (Art. 12): Solicitar la eliminación de sus datos personales cuando ya no sean necesarios para las finalidades para las que fueron recopilados, haya retirado su consentimiento, se oponga al tratamiento, o los datos hayan sido tratados ilícitamente.`,

  derechoOposicion: `Derecho de Oposición (Art. 13): Oponerse al tratamiento de sus datos en determinadas circunstancias, particularmente cuando la base legal sea el interés legítimo o para fines de marketing directo.`,

  derechoPortabilidad: `Derecho a la Portabilidad (Art. 15): Recibir sus datos personales en un formato estructurado, de uso común y lectura mecánica, y transmitirlos a otro responsable cuando el tratamiento se base en el consentimiento o un contrato.`,

  derechoNoAutomatizado: `Derecho a no ser objeto de decisiones automatizadas (Art. 15 bis): No ser objeto de decisiones basadas únicamente en el tratamiento automatizado de datos, incluida la elaboración de perfiles, que produzcan efectos jurídicos o le afecten significativamente.`,

  derechosEjercicio: `Para ejercer cualquiera de estos derechos, puede contactarnos a través de los canales indicados en esta Política. Podremos solicitar información adicional para verificar su identidad. El ejercicio de estos derechos es gratuito, salvo las excepciones establecidas por ley.`,

  derechosReclamo: `Si considera que sus derechos han sido vulnerados, puede presentar un reclamo ante la Agencia de Protección de Datos Personales (www.agenciadeprotecciondedatos.cl).`,

  // Sección 13: Protección de datos
  proteccionIntro: `Implementamos medidas de seguridad técnicas, organizativas y físicas apropiadas para proteger sus datos personales contra acceso no autorizado, pérdida, alteración, destrucción o cualquier forma de tratamiento ilícito.`,

  proteccionMedidas: `Nuestras medidas de protección incluyen:`,

  proteccionTecnicas: `Medidas técnicas: Control de acceso lógico restringido, protección de sistemas y redes con herramientas de seguridad actualizadas, cifrado de datos sensibles, planes de respaldo y recuperación, y evaluaciones periódicas de seguridad.`,

  proteccionOrganizativas: `Medidas organizativas: Políticas y procedimientos de protección de datos, capacitación del personal, acuerdos de confidencialidad, gestión de incidentes de seguridad y auditorías periódicas.`,

  proteccionFisicas: `Medidas físicas: Control de acceso a instalaciones, vigilancia y monitoreo, almacenamiento seguro de documentos físicos y protección de dispositivos.`,

  proteccionProveedores: `Exigimos a nuestros proveedores de servicios el cumplimiento de estándares de protección de datos y seguridad de la información mediante compromisos contractuales.`,

  // Sección 14: Datos de menores
  menoresIntro: `Nuestros servicios no están dirigidos a menores de 14 años y no recopilamos intencionadamente datos personales de este grupo etario.`,

  menoresPolitica: `Política para el tratamiento de datos de menores:`,

  menoresMenos14: `Menores de 14 años: Requerimos el consentimiento de padres, representantes legales o cuidadores para cualquier tratamiento de datos personales, salvo autorización legal expresa.`,

  menores14a18: `Adolescentes entre 14 y 18 años: Para datos no sensibles, aplicamos las reglas generales. Para datos sensibles (incluyendo información de salud), requerimos el consentimiento del representante legal si el menor tiene menos de 16 años, salvo excepción legal.`,

  menoresPrincipios: `En todo tratamiento de datos de menores, priorizamos el interés superior del menor y respetamos el principio de autonomía progresiva. No comercializamos ni vendemos datos de menores para fines no autorizados legalmente.`,

  // Sección 15: Decisiones automatizadas
  automatizadasIntro: `Respecto al uso de tecnologías para el tratamiento automatizado de datos personales:`,

  automatizadasActual: `Actualmente, no utilizamos perfiles ni tomamos decisiones basadas únicamente en tratamiento automatizado que produzcan efectos jurídicos o afecten significativamente a los titulares, como exclusión de servicios, denegación de prestaciones o beneficios.`,

  automatizadasFuturo: `En caso de implementar tales decisiones en el futuro, informaremos sobre: la lógica aplicada, las consecuencias previstas del tratamiento, y los derechos disponibles incluyendo la posibilidad de solicitar intervención humana, expresar su punto de vista y oponerse a la decisión.`,

  automatizadasDerechos: `Toda decisión automatizada será validada o revisada por una persona humana conforme a los principios de licitud, proporcionalidad y transparencia.`,

  // Sección 16: Cambios a la política
  cambiosIntro: `Nos reservamos el derecho de actualizar esta Política de Tratamiento de Datos Personales para reflejar cambios en nuestras prácticas, la normativa aplicable o por otras razones operativas.`,

  cambiosNotificacion: `Publicaremos cualquier actualización en nuestro sitio web. En caso de modificaciones sustanciales, proporcionaremos un aviso destacado. Cuando la ley lo exija, le informaremos directamente mediante los datos de contacto que nos haya proporcionado.`,

  cambiosRecomendacion: `Le recomendamos revisar periódicamente esta Política para mantenerse informado sobre cómo protegemos sus datos personales.`,

  // Sección 17: Contacto
  contactoIntro: `Para cualquier consulta, solicitud o ejercicio de derechos relacionados con esta Política o el tratamiento de sus datos personales, puede contactarnos a través de los siguientes medios:`,

  // Textos legacy (mantener compatibilidad)
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

  disclaimer: `Este documento ha sido generado mediante la plataforma TratoDatos (tratodatos.cl) como herramienta de apoyo para el cumplimiento de las obligaciones establecidas en la Ley N° 19.628, modificada por la Ley N° 21.719.

La información contenida en este documento refleja las respuestas proporcionadas por el usuario. TratoDatos no verifica la exactitud de la información proporcionada.

Este documento NO constituye asesoría legal. Se recomienda que las organizaciones con tratamientos complejos consulten con un profesional especializado.`,
} as const;

// =====================================================
// PERÍODOS DE RETENCIÓN
// =====================================================

export const RETENTION_PERIODS = {
  "1y": { code: "1y", label: "1 año", days: 365 },
  "2y": { code: "2y", label: "2 años", days: 730 },
  "3y": { code: "3y", label: "3 años", days: 1095 },
  "5y": { code: "5y", label: "5 años", days: 1825 },
  "6y": { code: "6y", label: "6 años", days: 2190 },
  "10y": { code: "10y", label: "10 años", days: 3650 },
  "indefinite": { code: "indefinite", label: "mientras dure la relación contractual", days: -1 },
} as const;

// Helper function to get readable retention period
export function getRetentionPeriodLabel(code: string): string {
  return RETENTION_PERIODS[code as keyof typeof RETENTION_PERIODS]?.label || code;
}

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
