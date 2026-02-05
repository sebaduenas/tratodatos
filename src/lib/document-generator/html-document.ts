import type { Policy } from "@/types/policy";
import { DATA_CATEGORIES } from "@/lib/constants/data-categories";
import { LEGAL_BASES } from "@/lib/constants/legal-bases";
import { PURPOSES } from "@/lib/constants/purposes";
import { DATA_SUBJECTS, SECURITY_MEASURES, LEGAL_TEXTS, CHILEAN_REGIONS, getRetentionPeriodLabel } from "@/lib/constants";

interface GenerateHTMLOptions {
  policy: Policy;
  includeWatermark: boolean;
}

export function generateHTMLDocument({
  policy,
  includeWatermark,
}: GenerateHTMLOptions): string {
  const step01 = policy.step01Data as any;
  const step02 = policy.step02Data as any;
  const step03 = policy.step03Data as any;
  const step04 = policy.step04Data as any;
  const step05 = policy.step05Data as any;
  const step06 = policy.step06Data as any;
  const step07 = policy.step07Data as any;
  const step08 = policy.step08Data as any;
  const step09 = policy.step09Data as any;
  const step10 = policy.step10Data as any;
  const step11 = policy.step11Data as any;
  const step12 = policy.step12Data as any;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getRegionName = (code: string): string => {
    return CHILEAN_REGIONS.find((r) => r.code === code)?.name || code;
  };

  const getSelectedCategories = () => {
    if (!step02?.categories) return [];
    return Object.entries(step02.categories)
      .filter(([_, selected]) => selected)
      .map(([key]) => {
        const cat = DATA_CATEGORIES[key as keyof typeof DATA_CATEGORIES];
        return {
          name: cat?.name || key,
          description: cat?.description || "",
          isSensitive: cat?.isSensitive || false,
        };
      });
  };

  const getSensitiveCategories = () => getSelectedCategories().filter(c => c.isSensitive);
  const getNonSensitiveCategories = () => getSelectedCategories().filter(c => !c.isSensitive);

  const getSelectedPurposes = () => {
    if (!step04?.purposes) return [];
    return Object.entries(step04.purposes)
      .filter(([_, selected]) => selected)
      .map(([key]) => {
        const purpose = PURPOSES[key as keyof typeof PURPOSES];
        return {
          name: purpose?.name || key,
        };
      });
  };

  const getSelectedLegalBases = () => {
    if (!step05?.bases) return [];
    return Object.entries(step05.bases)
      .filter(([_, selected]) => selected)
      .map(([key]) => {
        const base = LEGAL_BASES[key as keyof typeof LEGAL_BASES];
        return {
          key,
          name: base?.name || key,
          article: base?.article || "",
          description: base?.description || "",
        };
      });
  };

  const getSelectedSubjects = () => {
    if (!step03?.subjects) return [];
    return Object.entries(step03.subjects)
      .filter(([_, selected]) => selected)
      .map(([key]) => DATA_SUBJECTS[key as keyof typeof DATA_SUBJECTS]?.name || key);
  };

  const getSelectedSources = () => {
    if (!step09?.sources) return { direct: false, public: false, third: false, auto: false };
    return {
      direct: step09.sources.directFromSubject,
      public: step09.sources.publicSources,
      third: step09.sources.thirdParties,
      auto: step09.sources.automaticCollection,
    };
  };

  const getSecurityMeasures = () => {
    if (!step11) return { organizational: [], technical: [], physical: [] };
    const org = Object.entries(step11.organizational || {})
      .filter(([_, v]) => v)
      .map(([k]) => SECURITY_MEASURES.organizational[k as keyof typeof SECURITY_MEASURES.organizational] || k);
    const tech = Object.entries(step11.technical || {})
      .filter(([_, v]) => v)
      .map(([k]) => SECURITY_MEASURES.technical[k as keyof typeof SECURITY_MEASURES.technical] || k);
    const phys = Object.entries(step11.physical || {})
      .filter(([_, v]) => v)
      .map(([k]) => SECURITY_MEASURES.physical[k as keyof typeof SECURITY_MEASURES.physical] || k);
    return { organizational: org, technical: tech, physical: phys };
  };

  const sources = getSelectedSources();
  const security = getSecurityMeasures();
  const companyName = step01?.companyName || "la Empresa";

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Política de Tratamiento de Datos Personales - ${companyName}</title>
  <style>
    :root {
      --primary: #1e3a5f;
      --primary-light: #2563eb;
      --text: #1E293B;
      --text-light: #64748B;
      --bg: #FFFFFF;
      --bg-secondary: #F8FAFC;
      --border: #E2E8F0;
      --warning-bg: #fef3c7;
      --warning-border: #f59e0b;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: var(--text);
      background: var(--bg);
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 3px solid var(--primary);
    }

    .header h1 {
      font-size: 1.75rem;
      color: var(--primary);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .header .company {
      font-size: 1.25rem;
      color: var(--text);
      font-weight: 600;
    }

    .header .meta {
      color: var(--text-light);
      font-size: 0.875rem;
      margin-top: 0.75rem;
    }

    .toc {
      background: var(--bg-secondary);
      padding: 1.5rem 2rem;
      border-radius: 8px;
      margin-bottom: 2.5rem;
      border: 1px solid var(--border);
    }

    .toc h2 {
      font-size: 1rem;
      color: var(--primary);
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .toc ol {
      padding-left: 1.25rem;
      columns: 2;
      column-gap: 2rem;
    }

    .toc li {
      margin-bottom: 0.4rem;
      font-size: 0.9rem;
    }

    .toc a {
      color: var(--text);
      text-decoration: none;
    }

    .toc a:hover {
      color: var(--primary-light);
      text-decoration: underline;
    }

    section {
      margin-bottom: 2.5rem;
      page-break-inside: avoid;
    }

    h2 {
      font-size: 1.15rem;
      color: var(--primary);
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--border);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    h3 {
      font-size: 1rem;
      color: var(--text);
      margin: 1.25rem 0 0.75rem;
      font-weight: 600;
    }

    p { margin-bottom: 1rem; text-align: justify; }

    ul, ol {
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }

    li { margin-bottom: 0.5rem; }

    .info-box {
      background: var(--bg-secondary);
      padding: 1.25rem;
      border-radius: 6px;
      border-left: 4px solid var(--primary);
      margin: 1rem 0;
    }

    .info-box p { margin: 0.25rem 0; }
    .info-box p:last-child { margin-bottom: 0; }

    .warning-box {
      background: var(--warning-bg);
      padding: 1rem 1.25rem;
      border-radius: 6px;
      border-left: 4px solid var(--warning-border);
      margin: 1rem 0;
      font-size: 0.95rem;
    }

    .contact-box {
      background: var(--bg-secondary);
      padding: 1.5rem;
      border-radius: 8px;
      margin: 1rem 0;
      border: 1px solid var(--border);
    }

    .contact-box h3 {
      margin-top: 0;
      color: var(--primary);
    }

    .two-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 2px solid var(--border);
      color: var(--text-light);
      font-size: 0.85rem;
    }

    .footer p { margin-bottom: 0.5rem; }

    .legal-basis-item {
      margin-bottom: 1rem;
      padding-left: 0.5rem;
    }

    .legal-basis-item strong {
      color: var(--primary);
    }

    ${includeWatermark ? `
    .watermark {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      opacity: 0.6;
      font-size: 0.75rem;
      color: var(--text-light);
      background: var(--bg);
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      border: 1px solid var(--border);
    }
    ` : ""}

    @media print {
      body { padding: 0; font-size: 11pt; }
      .toc { page-break-after: always; columns: 1; }
      section { page-break-inside: avoid; }
      h2 { page-break-after: avoid; }
      ${includeWatermark ? ".watermark { position: static; margin-top: 2rem; text-align: center; }" : ""}
    }

    @media (max-width: 600px) {
      .toc ol { columns: 1; }
      .two-columns { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header class="header">
    <h1>Política de Tratamiento de Datos Personales</h1>
    <p class="company">${companyName}</p>
    <p class="meta">
      ${step12?.effectiveDate ? `Vigente desde: ${formatDate(step12.effectiveDate)}` : `Última actualización: ${formatDate(policy.updatedAt)}`}
      &nbsp;|&nbsp; Versión ${policy.version}
    </p>
  </header>

  <nav class="toc">
    <h2>Índice de Contenidos</h2>
    <ol>
      <li><a href="#presentacion">Presentación</a></li>
      <li><a href="#introduccion">Introducción y Ámbito</a></li>
      <li><a href="#responsable">Identificación del Responsable</a></li>
      <li><a href="#titulares">A Quiénes Aplica</a></li>
      <li><a href="#categorias">Datos que Tratamos</a></li>
      <li><a href="#uso-online">Uso de Información en Línea</a></li>
      <li><a href="#fuentes">Fuentes de Información</a></li>
      <li><a href="#finalidades">Finalidades del Tratamiento</a></li>
      <li><a href="#bases">Bases Legales</a></li>
      <li><a href="#compartir">Compartir Información</a></li>
      <li><a href="#conservacion">Conservación de Datos</a></li>
      <li><a href="#derechos">Derechos del Titular</a></li>
      <li><a href="#seguridad">Protección de Datos</a></li>
      <li><a href="#menores">Datos de Menores</a></li>
      <li><a href="#automatizadas">Decisiones Automatizadas</a></li>
      <li><a href="#cambios">Cambios a la Política</a></li>
      <li><a href="#contacto">Contacto</a></li>
    </ol>
  </nav>

  <main>
    <!-- SECCIÓN 1: PRESENTACIÓN -->
    <section id="presentacion">
      <h2>1. Presentación de la Política de Privacidad</h2>
      <p>${LEGAL_TEXTS.presentacion.replace('{companyName}', companyName)}</p>
    </section>

    <!-- SECCIÓN 2: INTRODUCCIÓN Y ÁMBITO -->
    <section id="introduccion">
      <h2>2. Introducción y Ámbito de Aplicación</h2>
      <p>${LEGAL_TEXTS.introduccion}</p>
    </section>

    <!-- SECCIÓN 3: IDENTIFICACIÓN DEL RESPONSABLE -->
    <section id="responsable">
      <h2>3. Identificación del Responsable</h2>
      <p>${LEGAL_TEXTS.quienesSomos.replace('{companyName}', companyName)}</p>
      <div class="info-box">
        <p><strong>Razón Social:</strong> ${companyName}</p>
        ${step01?.rut ? `<p><strong>RUT:</strong> ${step01.rut}</p>` : ""}
        ${step01?.legalRepName ? `<p><strong>Representante Legal:</strong> ${step01.legalRepName}${step01.legalRepRut ? ` (RUT: ${step01.legalRepRut})` : ""}</p>` : ""}
        ${step01?.address ? `<p><strong>Dirección:</strong> ${step01.address}${step01.city ? `, ${step01.city}` : ""}${step01.region ? `, ${getRegionName(step01.region)}` : ""}</p>` : ""}
        ${step01?.phone ? `<p><strong>Teléfono:</strong> ${step01.phone}</p>` : ""}
        ${step01?.email ? `<p><strong>Email:</strong> ${step01.email}</p>` : ""}
        ${step01?.website ? `<p><strong>Sitio Web:</strong> ${step01.website}</p>` : ""}
      </div>
      ${step01?.hasDPO && step01?.dpoName ? `
      <h3>Delegado de Protección de Datos (DPO)</h3>
      <div class="info-box">
        <p><strong>Nombre:</strong> ${step01.dpoName}</p>
        ${step01.dpoEmail ? `<p><strong>Email:</strong> ${step01.dpoEmail}</p>` : ""}
        ${step01.dpoPhone ? `<p><strong>Teléfono:</strong> ${step01.dpoPhone}</p>` : ""}
      </div>
      ` : ""}
    </section>

    <!-- SECCIÓN 4: A QUIÉNES APLICA -->
    <section id="titulares">
      <h2>4. A Quiénes Aplica esta Política</h2>
      <p>${LEGAL_TEXTS.aQuienesAplica.replace('{companyName}', companyName)}</p>
      <ul>
        ${getSelectedSubjects().map(s => `<li>${s}</li>`).join("\n        ") || "<li>Usuarios de nuestros servicios</li>"}
        ${step03?.customSubjects?.length ? step03.customSubjects.map((s: string) => `<li>${s}</li>`).join("\n        ") : ""}
      </ul>
      <p>${LEGAL_TEXTS.noAplica}</p>
    </section>

    <!-- SECCIÓN 5: QUÉ INFORMACIÓN SE TRATA -->
    <section id="categorias">
      <h2>5. Qué Información Tratamos</h2>
      <p>${LEGAL_TEXTS.categoriasDatosIntro}</p>

      ${getNonSensitiveCategories().length ? `
      <h3>Categorías de Datos Personales</h3>
      <p>${LEGAL_TEXTS.categoriasDatosStandard}</p>
      <ul>
        ${getNonSensitiveCategories().map(c => `<li><strong>${c.name}:</strong> ${c.description}</li>`).join("\n        ")}
      </ul>
      ` : ""}

      ${getSensitiveCategories().length ? `
      <h3>Datos Sensibles</h3>
      <p>${LEGAL_TEXTS.categoriasDatosSensibles}</p>
      <ul>
        ${getSensitiveCategories().map(c => `<li><strong>${c.name}:</strong> ${c.description}</li>`).join("\n        ")}
      </ul>
      <div class="warning-box">
        <strong>Nota importante:</strong> ${LEGAL_TEXTS.notaDatosSensibles}
      </div>
      ` : ""}

      ${step02?.customCategories?.length ? `
      <h3>Otras Categorías</h3>
      <ul>
        ${step02.customCategories.map((c: any) => `<li><strong>${c.name}:</strong> ${c.description}${c.isSensitive ? " (Dato Sensible)" : ""}</li>`).join("\n        ")}
      </ul>
      ` : ""}
    </section>

    <!-- SECCIÓN 6: USO DE INFORMACIÓN EN LÍNEA -->
    <section id="uso-online">
      <h2>6. Cómo Utilizamos la Información en Línea</h2>
      <p>${LEGAL_TEXTS.usoEnLineaIntro}</p>
      <ul>
        <li><strong>Formularios de contacto y solicitudes:</strong> ${LEGAL_TEXTS.usoEnLineaFormularios}</li>
        <li><strong>Navegación del sitio:</strong> ${LEGAL_TEXTS.usoEnLineaCookies}</li>
        ${sources.auto ? `<li><strong>Análisis estadísticos:</strong> ${LEGAL_TEXTS.usoEnLineaAnalytics}</li>` : ""}
      </ul>
      ${step09?.automaticCollectionMethods?.length ? `
      <h3>Métodos de Recopilación Automática</h3>
      <ul>
        ${step09.automaticCollectionMethods.map((m: string) => `<li>${m}</li>`).join("\n        ")}
      </ul>
      ` : ""}
    </section>

    <!-- SECCIÓN 7: FUENTES DE DATOS -->
    <section id="fuentes">
      <h2>7. De Dónde Obtenemos la Información</h2>
      <p>${LEGAL_TEXTS.fuentesDatosIntro}</p>
      <ul>
        ${sources.direct ? `<li><strong>Recopilación directa:</strong> ${LEGAL_TEXTS.fuenteDirecta}</li>` : ""}
        ${sources.auto ? `<li><strong>Recopilación automática:</strong> ${LEGAL_TEXTS.fuenteAutomatica}</li>` : ""}
        ${sources.third ? `<li><strong>Terceros:</strong> ${LEGAL_TEXTS.fuenteTerceros}</li>` : ""}
        ${sources.public ? `<li><strong>Fuentes públicas:</strong> ${LEGAL_TEXTS.fuentePublica}</li>` : ""}
      </ul>
      ${step09?.thirdPartySources?.length ? `
      <h3>Fuentes de Terceros</h3>
      <ul>
        ${step09.thirdPartySources.map((s: string) => `<li>${s}</li>`).join("\n        ")}
      </ul>
      ` : ""}
      ${step09?.publicSources?.length ? `
      <h3>Fuentes Públicas Utilizadas</h3>
      <ul>
        ${step09.publicSources.map((s: string) => `<li>${s}</li>`).join("\n        ")}
      </ul>
      ` : ""}
    </section>

    <!-- SECCIÓN 8: FINALIDADES DEL TRATAMIENTO -->
    <section id="finalidades">
      <h2>8. Finalidades del Tratamiento</h2>
      <p>${LEGAL_TEXTS.finalidadesIntro}</p>
      <ul>
        ${getSelectedPurposes().map(p => `<li>${p.name}</li>`).join("\n        ")}
      </ul>
      ${step04?.customPurposes?.length ? `
      <h3>Finalidades Adicionales</h3>
      <ul>
        ${step04.customPurposes.map((p: any) => `<li>${p.description}</li>`).join("\n        ")}
      </ul>
      ` : ""}
    </section>

    <!-- SECCIÓN 9: BASES LEGALES -->
    <section id="bases">
      <h2>9. Bases Legales del Tratamiento</h2>
      <p>${LEGAL_TEXTS.basesLegalesIntro}</p>
      ${getSelectedLegalBases().map(base => `
      <div class="legal-basis-item">
        <p><strong>${base.name}</strong>${base.article ? ` (${base.article})` : ""}</p>
        <p>${getLegalBaseDescription(base.key)}</p>
      </div>
      `).join("")}
    </section>

    <!-- SECCIÓN 10: COMPARTIR INFORMACIÓN -->
    <section id="compartir">
      <h2>10. Compartir Información Personal</h2>
      <p>${LEGAL_TEXTS.compartirIntro}</p>

      ${step06?.sharesData && step06?.recipients?.length ? `
      <h3>Destinatarios de los Datos</h3>
      <ul>
        ${step06.recipients.map((r: any) => `
        <li>
          <strong>${r.name}</strong> (${r.country}): ${r.purpose}
          ${r.hasContract ? " - Con contrato de tratamiento de datos" : ""}
        </li>
        `).join("")}
      </ul>
      ` : `
      <p>No comunicamos sus datos personales a terceros, salvo cuando sea requerido por ley o con su consentimiento expreso.</p>
      `}

      ${step07?.hasInternationalTransfers && step07?.transfers?.length ? `
      <h3>Transferencias Internacionales</h3>
      <p>${LEGAL_TEXTS.transferenciasIntro}</p>
      <p>${LEGAL_TEXTS.transferenciasTexto}</p>
      <ul>
        ${step07.transfers.map((t: any) => `
        <li><strong>${t.country}</strong>: ${t.recipient} - ${t.purpose} (Mecanismo: ${t.mechanism})</li>
        `).join("")}
      </ul>
      ` : ""}
    </section>

    <!-- SECCIÓN 11: CONSERVACIÓN -->
    <section id="conservacion">
      <h2>11. Conservación de Información Personal</h2>
      <p>${LEGAL_TEXTS.conservacionIntro}</p>
      <p><strong>Período general de conservación:</strong> ${getRetentionPeriodLabel(step08?.defaultPeriod) || "el tiempo necesario para cumplir las finalidades"}</p>

      ${step08?.periods?.length ? `
      <h3>Períodos Específicos por Categoría</h3>
      <ul>
        ${step08.periods.map((p: any) => `<li><strong>${p.dataCategory}:</strong> ${p.period} - ${p.criteria}</li>`).join("\n        ")}
      </ul>
      ` : ""}

      <p>${LEGAL_TEXTS.conservacionCriterios}</p>

      ${step08?.deletionProcess ? `
      <h3>Proceso de Eliminación</h3>
      <p>${step08.deletionProcess}</p>
      ` : `<p>${LEGAL_TEXTS.conservacionSupresion}</p>`}

      <h3>Conservación Adicional</h3>
      <p>${LEGAL_TEXTS.conservacionExcepciones}</p>
    </section>

    <!-- SECCIÓN 12: DERECHOS DEL TITULAR -->
    <section id="derechos">
      <h2>12. Derechos del Titular</h2>
      <p>${LEGAL_TEXTS.derechosIntro}</p>

      <ul>
        <li><strong>Derecho de Acceso (Art. 10):</strong> ${LEGAL_TEXTS.derechoAcceso}</li>
        <li><strong>Derecho de Rectificación (Art. 11):</strong> ${LEGAL_TEXTS.derechoRectificacion}</li>
        <li><strong>Derecho de Supresión (Art. 12):</strong> ${LEGAL_TEXTS.derechoSupresion}</li>
        <li><strong>Derecho de Oposición (Art. 13):</strong> ${LEGAL_TEXTS.derechoOposicion}</li>
        <li><strong>Derecho a la Portabilidad (Art. 15):</strong> ${LEGAL_TEXTS.derechoPortabilidad}</li>
        <li><strong>Derecho frente a Decisiones Automatizadas (Art. 15 bis):</strong> ${LEGAL_TEXTS.derechoNoAutomatizado}</li>
      </ul>

      <h3>Cómo Ejercer sus Derechos</h3>
      <p>${LEGAL_TEXTS.derechosEjercicio}</p>

      ${step12?.rightsExerciseProcess ? `
      <div class="info-box">
        <p><strong>Procedimiento:</strong> ${step12.rightsExerciseProcess}</p>
      </div>
      ` : ""}

      ${step12?.responseTime ? `<p><strong>Plazo de respuesta:</strong> ${step12.responseTime} días hábiles</p>` : ""}

      <h3>Reclamos</h3>
      <p>${LEGAL_TEXTS.derechosReclamo}</p>
      ${step12?.complaintProcess ? `<p>${step12.complaintProcess}</p>` : ""}
    </section>

    <!-- SECCIÓN 13: PROTECCIÓN DE DATOS -->
    <section id="seguridad">
      <h2>13. Protección de Información Personal</h2>
      <p>${LEGAL_TEXTS.proteccionIntro}</p>
      <p>${LEGAL_TEXTS.proteccionMedidas}</p>

      ${security.technical.length ? `
      <h3>Medidas Técnicas</h3>
      <ul>
        ${security.technical.map(m => `<li>${m}</li>`).join("\n        ")}
      </ul>
      ` : ""}

      ${security.organizational.length ? `
      <h3>Medidas Organizativas</h3>
      <ul>
        ${security.organizational.map(m => `<li>${m}</li>`).join("\n        ")}
      </ul>
      ` : ""}

      ${security.physical.length ? `
      <h3>Medidas Físicas</h3>
      <ul>
        ${security.physical.map(m => `<li>${m}</li>`).join("\n        ")}
      </ul>
      ` : ""}

      ${step11?.customMeasures?.length ? `
      <h3>Medidas Adicionales</h3>
      <ul>
        ${step11.customMeasures.map((m: string) => `<li>${m}</li>`).join("\n        ")}
      </ul>
      ` : ""}

      <p>${LEGAL_TEXTS.proteccionProveedores}</p>
    </section>

    <!-- SECCIÓN 14: DATOS DE MENORES -->
    <section id="menores">
      <h2>14. Tratamiento de Datos de Menores</h2>
      <p>${LEGAL_TEXTS.menoresIntro}</p>

      ${(step02?.hasMinorData || step03?.processesMinorData) ? `
      <p>${LEGAL_TEXTS.menoresPolitica}</p>
      <ul>
        <li><strong>Menores de 14 años:</strong> ${LEGAL_TEXTS.menoresMenos14}</li>
        <li><strong>Adolescentes entre 14 y 18 años:</strong> ${LEGAL_TEXTS.menores14a18}</li>
      </ul>
      ${step03?.minorDataDetails ? `
      <div class="info-box">
        ${step03.minorDataDetails.ageRange ? `<p><strong>Rango de edad:</strong> ${step03.minorDataDetails.ageRange}</p>` : ""}
        ${step03.minorDataDetails.parentalConsentMechanism ? `<p><strong>Mecanismo de consentimiento parental:</strong> ${step03.minorDataDetails.parentalConsentMechanism}</p>` : ""}
      </div>
      ` : ""}
      ` : ""}

      <p>${LEGAL_TEXTS.menoresPrincipios}</p>
    </section>

    <!-- SECCIÓN 15: DECISIONES AUTOMATIZADAS -->
    <section id="automatizadas">
      <h2>15. Decisiones Automatizadas y Elaboración de Perfiles</h2>
      <p>${LEGAL_TEXTS.automatizadasIntro}</p>

      ${step10?.hasAutomatedDecisions && step10?.decisions?.length ? `
      <h3>Decisiones Automatizadas Implementadas</h3>
      <ul>
        ${step10.decisions.map((d: any) => `
        <li>
          <strong>${d.type}:</strong> ${d.description}
          <br><em>Lógica:</em> ${d.logic}
          <br><em>Significancia:</em> ${d.significance}
          <br><em>Salvaguardas:</em> ${d.safeguards}
        </li>
        `).join("")}
      </ul>
      ${step10.humanReviewProcess ? `<p><strong>Proceso de revisión humana:</strong> ${step10.humanReviewProcess}</p>` : ""}
      ${step10.optOutMechanism ? `<p><strong>Mecanismo para oponerse:</strong> ${step10.optOutMechanism}</p>` : ""}
      ` : `
      <p>${LEGAL_TEXTS.automatizadasActual}</p>
      `}

      ${step10?.profiling?.exists ? `
      <h3>Elaboración de Perfiles</h3>
      <div class="info-box">
        ${step10.profiling.purpose ? `<p><strong>Propósito:</strong> ${step10.profiling.purpose}</p>` : ""}
        ${step10.profiling.logic ? `<p><strong>Lógica aplicada:</strong> ${step10.profiling.logic}</p>` : ""}
        ${step10.profiling.consequences ? `<p><strong>Consecuencias:</strong> ${step10.profiling.consequences}</p>` : ""}
      </div>
      ` : ""}

      <p>${LEGAL_TEXTS.automatizadasFuturo}</p>
      <p>${LEGAL_TEXTS.automatizadasDerechos}</p>
    </section>

    <!-- SECCIÓN 16: CAMBIOS A LA POLÍTICA -->
    <section id="cambios">
      <h2>16. Cambios a esta Política</h2>
      <p>${LEGAL_TEXTS.cambiosIntro}</p>
      <p>${LEGAL_TEXTS.cambiosNotificacion}</p>
      <p>${LEGAL_TEXTS.cambiosRecomendacion}</p>

      <div class="info-box">
        <p><strong>Versión actual:</strong> ${policy.version}</p>
        <p><strong>Última actualización:</strong> ${formatDate(policy.updatedAt)}</p>
        ${step12?.reviewFrequency ? `<p><strong>Frecuencia de revisión:</strong> ${step12.reviewFrequency === 'annual' ? 'Anual' : step12.reviewFrequency === 'biannual' ? 'Semestral' : 'Según necesidad'}</p>` : ""}
        ${step12?.responsiblePerson ? `<p><strong>Responsable de la política:</strong> ${step12.responsiblePerson}</p>` : ""}
      </div>
    </section>

    <!-- SECCIÓN 17: CONTACTO -->
    <section id="contacto">
      <h2>17. Contacto</h2>
      <p>${LEGAL_TEXTS.contactoIntro}</p>

      <div class="contact-box">
        <h3>Responsable del Tratamiento</h3>
        <p><strong>${companyName}</strong></p>
        ${step01?.address ? `<p>${step01.address}${step01.city ? `, ${step01.city}` : ""}${step01.region ? `, ${getRegionName(step01.region)}` : ""}</p>` : ""}
        ${step01?.email ? `<p><strong>Email:</strong> ${step01.email}</p>` : ""}
        ${step01?.phone ? `<p><strong>Teléfono:</strong> ${step01.phone}</p>` : ""}
        ${step12?.contactChannel ? `<p><strong>Canal de contacto para ejercicio de derechos:</strong> ${step12.contactChannel}</p>` : ""}
      </div>

      ${step01?.hasDPO && step01?.dpoName ? `
      <div class="contact-box">
        <h3>Delegado de Protección de Datos</h3>
        <p><strong>${step01.dpoName}</strong></p>
        ${step01.dpoEmail ? `<p><strong>Email:</strong> ${step01.dpoEmail}</p>` : ""}
        ${step01.dpoPhone ? `<p><strong>Teléfono:</strong> ${step01.dpoPhone}</p>` : ""}
      </div>
      ` : ""}
    </section>
  </main>

  <footer class="footer">
    <p>${LEGAL_TEXTS.disclaimer}</p>
    <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--border);">
    <p>Documento generado conforme a la Ley N° 19.628, modificada por la Ley N° 21.719, de Protección de Datos Personales de Chile.</p>
    <p>&copy; ${new Date().getFullYear()} ${companyName}. Todos los derechos reservados.</p>
  </footer>

  ${includeWatermark ? '<div class="watermark">Generado con TratoDatos.cl</div>' : ""}
</body>
</html>`;

  return html;
}

// Helper function to get detailed legal basis description
function getLegalBaseDescription(key: string): string {
  const descriptions: Record<string, string> = {
    consent: LEGAL_TEXTS.baseConsentimiento,
    contract: LEGAL_TEXTS.baseContrato,
    legalObligation: LEGAL_TEXTS.baseObligacionLegal,
    vitalInterest: LEGAL_TEXTS.baseInteresVital,
    publicInterest: LEGAL_TEXTS.baseInteresPublico,
    legitimateInterest: LEGAL_TEXTS.baseInteresLegitimo,
  };
  return descriptions[key] || "";
}
