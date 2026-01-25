import type { Policy } from "@/types/policy";
import { DATA_CATEGORIES } from "@/lib/constants/data-categories";
import { LEGAL_BASES } from "@/lib/constants/legal-bases";
import { PURPOSES } from "@/lib/constants/purposes";

const RETENTION_PERIODS: Record<string, string> = {
  "1y": "1 año",
  "2y": "2 años",
  "3y": "3 años",
  "5y": "5 años",
  "6y": "6 años",
  "10y": "10 años",
  indefinite: "mientras dure la relación contractual",
};

interface GenerateHTMLOptions {
  policy: Policy;
  includeWatermark: boolean;
}

export function generateHTMLDocument({
  policy,
  includeWatermark,
}: GenerateHTMLOptions): string {
  const step01 = policy.step01Data;
  const step02 = policy.step02Data;
  const step03 = policy.step03Data;
  const step04 = policy.step04Data;
  const step05 = policy.step05Data;
  const step06 = policy.step06Data;
  const step07 = policy.step07Data;
  const step08 = policy.step08Data;
  const step09 = policy.step09Data;
  const step10 = policy.step10Data;
  const step11 = policy.step11Data;
  const step12 = policy.step12Data;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getSelectedCategories = () => {
    if (!step02?.categories) return [];
    return Object.entries(step02.categories)
      .filter(([_, selected]) => selected)
      .map(([key]) => DATA_CATEGORIES[key as keyof typeof DATA_CATEGORIES]?.label || key);
  };

  const getSelectedPurposes = () => {
    if (!step03?.purposes) return [];
    return step03.purposes.map(
      (p: string) => PURPOSES.find((purpose) => purpose.id === p)?.label || p
    );
  };

  const getSelectedLegalBases = () => {
    if (!step04?.legalBases) return [];
    return step04.legalBases.map(
      (b: string) => LEGAL_BASES.find((base) => base.id === b)?.label || b
    );
  };

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Política de Tratamiento de Datos Personales - ${step01?.companyName || "Empresa"}</title>
  <style>
    :root {
      --primary: #4F46E5;
      --primary-dark: #3730A3;
      --text: #1E293B;
      --text-light: #64748B;
      --bg: #FFFFFF;
      --bg-secondary: #F8FAFC;
      --border: #E2E8F0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
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
      border-bottom: 2px solid var(--primary);
    }
    
    .header h1 {
      font-size: 1.75rem;
      color: var(--primary-dark);
      margin-bottom: 0.5rem;
    }
    
    .header .company {
      font-size: 1.25rem;
      color: var(--text);
      font-weight: 600;
    }
    
    .header .date {
      color: var(--text-light);
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }
    
    .toc {
      background: var(--bg-secondary);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    
    .toc h2 {
      font-size: 1rem;
      color: var(--primary-dark);
      margin-bottom: 1rem;
    }
    
    .toc ol {
      padding-left: 1.5rem;
    }
    
    .toc li {
      margin-bottom: 0.5rem;
    }
    
    .toc a {
      color: var(--text);
      text-decoration: none;
    }
    
    .toc a:hover {
      color: var(--primary);
      text-decoration: underline;
    }
    
    section {
      margin-bottom: 2.5rem;
    }
    
    h2 {
      font-size: 1.25rem;
      color: var(--primary-dark);
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border);
    }
    
    h3 {
      font-size: 1rem;
      color: var(--text);
      margin: 1.5rem 0 0.75rem;
    }
    
    p {
      margin-bottom: 1rem;
    }
    
    ul, ol {
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }
    
    li {
      margin-bottom: 0.5rem;
    }
    
    .info-box {
      background: var(--bg-secondary);
      padding: 1rem;
      border-radius: 6px;
      border-left: 4px solid var(--primary);
      margin: 1rem 0;
    }
    
    .info-box p {
      margin: 0;
    }
    
    .contact-info {
      background: var(--bg-secondary);
      padding: 1.5rem;
      border-radius: 8px;
      margin: 1rem 0;
    }
    
    .contact-info h3 {
      margin-top: 0;
      color: var(--primary-dark);
    }
    
    .footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border);
      color: var(--text-light);
      font-size: 0.875rem;
    }
    
    ${includeWatermark ? `
    .watermark {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      opacity: 0.5;
      font-size: 0.75rem;
      color: var(--text-light);
      background: var(--bg);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }
    ` : ""}
    
    @media print {
      body {
        padding: 0;
      }
      .toc {
        page-break-after: always;
      }
      section {
        page-break-inside: avoid;
      }
      ${includeWatermark ? ".watermark { position: static; }" : ""}
    }
  </style>
</head>
<body>
  <header class="header">
    <h1>POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES</h1>
    <p class="company">${step01?.companyName || "Empresa"}</p>
    ${step01?.rut ? `<p>RUT: ${step01.rut}</p>` : ""}
    <p class="date">Última actualización: ${formatDate(policy.updatedAt)}</p>
  </header>

  <nav class="toc">
    <h2>Índice</h2>
    <ol>
      <li><a href="#identificacion">Identificación del Responsable</a></li>
      <li><a href="#categorias">Datos Personales Recopilados</a></li>
      <li><a href="#finalidades">Finalidades del Tratamiento</a></li>
      <li><a href="#bases">Bases Legales del Tratamiento</a></li>
      <li><a href="#titulares">Titulares de los Datos</a></li>
      <li><a href="#transferencias">Transferencias de Datos</a></li>
      <li><a href="#seguridad">Medidas de Seguridad</a></li>
      <li><a href="#conservacion">Plazos de Conservación</a></li>
      <li><a href="#derechos">Derechos de los Titulares</a></li>
      <li><a href="#cookies">Cookies y Tecnologías</a></li>
      <li><a href="#contacto">Información de Contacto</a></li>
      <li><a href="#modificaciones">Modificaciones</a></li>
    </ol>
  </nav>

  <main>
    <section id="identificacion">
      <h2>1. Identificación del Responsable</h2>
      <div class="info-box">
        <p><strong>Razón Social:</strong> ${step01?.companyName || "No especificado"}</p>
        ${step01?.rut ? `<p><strong>RUT:</strong> ${step01.rut}</p>` : ""}
        ${step01?.address ? `<p><strong>Dirección:</strong> ${step01.address}${step01.commune ? `, ${step01.commune}` : ""}${step01.region ? `, ${step01.region}` : ""}</p>` : ""}
        ${step01?.website ? `<p><strong>Sitio Web:</strong> ${step01.website}</p>` : ""}
        ${step01?.industry ? `<p><strong>Industria:</strong> ${step01.industry}</p>` : ""}
      </div>
    </section>

    <section id="categorias">
      <h2>2. Datos Personales Recopilados</h2>
      <p>Recopilamos las siguientes categorías de datos personales:</p>
      <ul>
        ${getSelectedCategories().map((cat) => `<li>${cat}</li>`).join("\n        ")}
      </ul>
      ${step02?.hasSensitiveData ? `
      <div class="info-box">
        <p><strong>Nota:</strong> Algunos de estos datos son considerados sensibles según la Ley 21.719 y reciben protección especial.</p>
      </div>
      ` : ""}
      ${step02?.hasMinorData ? `
      <div class="info-box">
        <p><strong>Datos de Menores:</strong> Podemos tratar datos de menores de edad, siempre con el consentimiento de sus representantes legales y con las garantías adicionales que establece la ley.</p>
      </div>
      ` : ""}
    </section>

    <section id="finalidades">
      <h2>3. Finalidades del Tratamiento</h2>
      <p>Sus datos personales serán tratados para las siguientes finalidades:</p>
      <ul>
        ${getSelectedPurposes().map((purpose) => `<li>${purpose}</li>`).join("\n        ")}
      </ul>
      ${step03?.customPurposes?.length ? `
      <h3>Finalidades Adicionales</h3>
      <ul>
        ${step03.customPurposes.map((p: { name: string; description: string }) => `<li><strong>${p.name}:</strong> ${p.description}</li>`).join("\n        ")}
      </ul>
      ` : ""}
    </section>

    <section id="bases">
      <h2>4. Bases Legales del Tratamiento</h2>
      <p>El tratamiento de sus datos se fundamenta en las siguientes bases legales conforme a la Ley 21.719:</p>
      <ul>
        ${getSelectedLegalBases().map((base) => `<li>${base}</li>`).join("\n        ")}
      </ul>
    </section>

    <section id="titulares">
      <h2>5. Titulares de los Datos</h2>
      <p>Esta política aplica a los siguientes grupos de personas:</p>
      <ul>
        ${step05?.dataSubjects?.map((subject: string) => `<li>${subject}</li>`).join("\n        ") || "<li>Clientes y usuarios</li>"}
      </ul>
    </section>

    <section id="transferencias">
      <h2>6. Transferencias de Datos</h2>
      ${step06?.hasTransfers ? `
      <p>Sus datos personales pueden ser transferidos a:</p>
      <ul>
        ${step06.recipients?.map((r: string) => `<li>${r}</li>`).join("\n        ") || ""}
      </ul>
      ${step06.hasInternationalTransfers ? `
      <div class="info-box">
        <p><strong>Transferencias Internacionales:</strong> Algunos datos pueden ser transferidos fuera de Chile. En estos casos, nos aseguramos de que existan garantías adecuadas para la protección de sus datos.</p>
        ${step06.internationalCountries?.length ? `<p>Países: ${step06.internationalCountries.join(", ")}</p>` : ""}
      </div>
      ` : ""}
      ` : `
      <p>No realizamos transferencias de sus datos personales a terceros, salvo las requeridas por ley.</p>
      `}
    </section>

    <section id="seguridad">
      <h2>7. Medidas de Seguridad</h2>
      <p>Hemos implementado las siguientes medidas para proteger sus datos personales:</p>
      <ul>
        ${step07?.securityMeasures?.map((measure: string) => `<li>${measure}</li>`).join("\n        ") || "<li>Medidas técnicas y organizativas apropiadas</li>"}
      </ul>
    </section>

    <section id="conservacion">
      <h2>8. Plazos de Conservación</h2>
      <p>Sus datos personales serán conservados durante <strong>${RETENTION_PERIODS[step08?.defaultPeriod] || step08?.defaultPeriod || "el tiempo necesario"}</strong> para cumplir con las finalidades descritas.</p>
      ${step08?.deletionProcess ? `
      <h3>Proceso de Eliminación</h3>
      <p>${step08.deletionProcess}</p>
      ` : ""}
    </section>

    <section id="derechos">
      <h2>9. Derechos de los Titulares (ARCO)</h2>
      <p>Conforme a la Ley 21.719, usted tiene los siguientes derechos:</p>
      <ul>
        <li><strong>Acceso:</strong> Conocer qué datos suyos tratamos y cómo los usamos.</li>
        <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos.</li>
        <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos cuando ya no sean necesarios.</li>
        <li><strong>Oposición:</strong> Oponerse al tratamiento en determinadas circunstancias.</li>
        <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado y de uso común.</li>
      </ul>
      ${step09?.exerciseProcess ? `
      <h3>¿Cómo Ejercer sus Derechos?</h3>
      <p>${step09.exerciseProcess}</p>
      ` : ""}
      ${step09?.responseTime ? `
      <p><strong>Plazo de Respuesta:</strong> ${step09.responseTime} días hábiles.</p>
      ` : ""}
    </section>

    <section id="cookies">
      <h2>10. Cookies y Tecnologías Similares</h2>
      ${step10?.usesCookies ? `
      <p>Utilizamos cookies y tecnologías similares en nuestro sitio web para:</p>
      <ul>
        ${step10.cookieTypes?.map((type: string) => `<li>${type}</li>`).join("\n        ") || "<li>Mejorar su experiencia de navegación</li>"}
      </ul>
      ${step10.cookieConsent ? `
      <p>Puede gestionar sus preferencias de cookies a través de la configuración de su navegador o nuestro banner de cookies.</p>
      ` : ""}
      ` : `
      <p>Actualmente no utilizamos cookies en nuestro sitio web.</p>
      `}
    </section>

    <section id="contacto">
      <h2>11. Información de Contacto</h2>
      <div class="contact-info">
        <h3>Delegado de Protección de Datos</h3>
        ${step11?.dpoName ? `<p><strong>Nombre:</strong> ${step11.dpoName}</p>` : ""}
        ${step11?.dpoEmail ? `<p><strong>Email:</strong> ${step11.dpoEmail}</p>` : ""}
        ${step11?.dpoPhone ? `<p><strong>Teléfono:</strong> ${step11.dpoPhone}</p>` : ""}
      </div>
      <p>Para consultas o solicitudes relacionadas con sus datos personales, puede contactarnos a través de los medios indicados anteriormente.</p>
    </section>

    <section id="modificaciones">
      <h2>12. Modificaciones a esta Política</h2>
      <p>Nos reservamos el derecho de modificar esta política en cualquier momento. Los cambios serán publicados en esta misma página con la fecha de última actualización.</p>
      ${step12?.notificationMethod ? `
      <p><strong>Método de Notificación:</strong> ${step12.notificationMethod}</p>
      ` : ""}
      <p><strong>Versión:</strong> ${policy.version}</p>
      <p><strong>Fecha de Vigencia:</strong> ${formatDate(policy.updatedAt)}</p>
    </section>
  </main>

  <footer class="footer">
    <p>Documento generado conforme a la Ley 21.719 de Protección de Datos Personales de Chile.</p>
    <p>© ${new Date().getFullYear()} ${step01?.companyName || "Empresa"}. Todos los derechos reservados.</p>
  </footer>

  ${includeWatermark ? '<div class="watermark">Generado con TratoDatos.cl</div>' : ""}
</body>
</html>`;

  return html;
}
