// Word Document Generator using docx library
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Packer,
} from "docx";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Policy } from "@/types/policy";
import {
  DATA_CATEGORIES,
  LEGAL_BASES,
  PURPOSES,
  DATA_SUBJECTS,
  CHILEAN_REGIONS,
  LEGAL_TEXTS,
  SECURITY_MEASURES,
  getRetentionPeriodLabel,
} from "@/lib/constants";

const getRegionName = (code: string): string => {
  return CHILEAN_REGIONS.find((r) => r.code === code)?.name || code;
};

interface GenerateWordDocumentOptions {
  policy: Policy;
  includeWatermark?: boolean;
}

export async function generateWordDocument({
  policy,
  includeWatermark = false,
}: GenerateWordDocumentOptions): Promise<Buffer> {
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

  const companyName = step01?.companyName || "la Empresa";

  // Helper functions
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

  const getSources = () => {
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

  const getLegalBaseDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      consent: LEGAL_TEXTS.baseConsentimiento,
      contract: LEGAL_TEXTS.baseContrato,
      legalObligation: LEGAL_TEXTS.baseObligacionLegal,
      vitalInterest: LEGAL_TEXTS.baseInteresVital,
      publicInterest: LEGAL_TEXTS.baseInteresPublico,
      legitimateInterest: LEGAL_TEXTS.baseInteresLegitimo,
    };
    return descriptions[key] || "";
  };

  const sources = getSources();
  const security = getSecurityMeasures();

  const children: (Paragraph | Table)[] = [];

  // ============ HEADER ============
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES",
          bold: true,
          size: 32,
          color: "1e3a5f",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: companyName,
          size: 28,
          color: "334155",
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    })
  );

  if (step12?.effectiveDate) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Vigente desde: ${format(new Date(step12.effectiveDate), "d 'de' MMMM 'de' yyyy", { locale: es })} | Versión ${policy.version}`,
            size: 20,
            color: "64748b",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  }

  // Separator line
  children.push(
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 12, color: "1e3a5f" },
      },
      spacing: { after: 400 },
    })
  );

  // ============ SECTION 1: PRESENTACIÓN ============
  children.push(createSectionTitle("1. PRESENTACIÓN DE LA POLÍTICA DE PRIVACIDAD"));
  children.push(createParagraph(LEGAL_TEXTS.presentacion.replace('{companyName}', companyName)));

  // ============ SECTION 2: INTRODUCCIÓN ============
  children.push(createSectionTitle("2. INTRODUCCIÓN Y ÁMBITO DE APLICACIÓN"));
  children.push(createParagraph(LEGAL_TEXTS.introduccion));

  // ============ SECTION 3: IDENTIFICACIÓN DEL RESPONSABLE ============
  children.push(createSectionTitle("3. IDENTIFICACIÓN DEL RESPONSABLE"));
  children.push(createParagraph(LEGAL_TEXTS.quienesSomos.replace('{companyName}', companyName)));

  const infoRows: string[][] = [
    ["Razón Social:", companyName],
  ];
  if (step01?.rut) infoRows.push(["RUT:", step01.rut]);
  if (step01?.legalRepName) {
    infoRows.push(["Representante Legal:", `${step01.legalRepName}${step01.legalRepRut ? ` (RUT: ${step01.legalRepRut})` : ""}`]);
  }
  if (step01?.address) {
    infoRows.push(["Dirección:", `${step01.address}${step01.city ? `, ${step01.city}` : ""}${step01.region ? `, ${getRegionName(step01.region)}` : ""}`]);
  }
  if (step01?.phone) infoRows.push(["Teléfono:", step01.phone]);
  if (step01?.email) infoRows.push(["Email:", step01.email]);
  if (step01?.website) infoRows.push(["Sitio Web:", step01.website]);

  children.push(createInfoTable(infoRows));

  if (step01?.hasDPO && step01?.dpoName) {
    children.push(createSubsectionTitle("Delegado de Protección de Datos (DPO)"));
    const dpoRows: string[][] = [["Nombre:", step01.dpoName]];
    if (step01.dpoEmail) dpoRows.push(["Email:", step01.dpoEmail]);
    if (step01.dpoPhone) dpoRows.push(["Teléfono:", step01.dpoPhone]);
    children.push(createInfoTable(dpoRows));
  }

  // ============ SECTION 4: A QUIÉNES APLICA ============
  children.push(createSectionTitle("4. A QUIÉNES APLICA ESTA POLÍTICA"));
  children.push(createParagraph(LEGAL_TEXTS.aQuienesAplica.replace('{companyName}', companyName)));

  getSelectedSubjects().forEach((subject) => {
    children.push(createBulletPoint(subject));
  });
  step03?.customSubjects?.forEach((subject: string) => {
    children.push(createBulletPoint(subject));
  });

  children.push(createParagraph(LEGAL_TEXTS.noAplica));

  // ============ SECTION 5: QUÉ INFORMACIÓN TRATAMOS ============
  children.push(createSectionTitle("5. QUÉ INFORMACIÓN TRATAMOS"));
  children.push(createParagraph(LEGAL_TEXTS.categoriasDatosIntro));

  if (getNonSensitiveCategories().length > 0) {
    children.push(createSubsectionTitle("Categorías de Datos Personales"));
    getNonSensitiveCategories().forEach((cat) => {
      children.push(createBulletPointWithDescription(cat.name, cat.description));
    });
  }

  if (getSensitiveCategories().length > 0) {
    children.push(createSubsectionTitle("Datos Sensibles"));
    getSensitiveCategories().forEach((cat) => {
      children.push(createBulletPointWithDescription(cat.name, cat.description));
    });
    children.push(createWarningBox(`Nota importante: ${LEGAL_TEXTS.notaDatosSensibles}`));
  }

  // ============ SECTION 6: USO EN LÍNEA ============
  children.push(createSectionTitle("6. CÓMO UTILIZAMOS LA INFORMACIÓN EN LÍNEA"));
  children.push(createParagraph(LEGAL_TEXTS.usoEnLineaIntro));
  children.push(createBulletPointWithDescription("Formularios de contacto", LEGAL_TEXTS.usoEnLineaFormularios));
  children.push(createBulletPointWithDescription("Navegación del sitio", LEGAL_TEXTS.usoEnLineaCookies));
  if (sources.auto) {
    children.push(createBulletPointWithDescription("Análisis estadísticos", LEGAL_TEXTS.usoEnLineaAnalytics));
  }

  // ============ SECTION 7: FUENTES DE DATOS ============
  children.push(createSectionTitle("7. DE DÓNDE OBTENEMOS LA INFORMACIÓN"));
  children.push(createParagraph(LEGAL_TEXTS.fuentesDatosIntro));
  if (sources.direct) children.push(createBulletPointWithDescription("Recopilación directa", LEGAL_TEXTS.fuenteDirecta));
  if (sources.auto) children.push(createBulletPointWithDescription("Recopilación automática", LEGAL_TEXTS.fuenteAutomatica));
  if (sources.third) children.push(createBulletPointWithDescription("Terceros", LEGAL_TEXTS.fuenteTerceros));
  if (sources.public) children.push(createBulletPointWithDescription("Fuentes públicas", LEGAL_TEXTS.fuentePublica));

  // ============ SECTION 8: FINALIDADES ============
  children.push(createSectionTitle("8. FINALIDADES DEL TRATAMIENTO"));
  children.push(createParagraph(LEGAL_TEXTS.finalidadesIntro));
  getSelectedPurposes().forEach((purpose) => {
    children.push(createBulletPoint(purpose.name));
  });

  // ============ SECTION 9: BASES LEGALES ============
  children.push(createSectionTitle("9. BASES LEGALES DEL TRATAMIENTO"));
  children.push(createParagraph(LEGAL_TEXTS.basesLegalesIntro));
  getSelectedLegalBases().forEach((base) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: base.name, bold: true, size: 22, color: "1e3a5f" }),
          new TextRun({ text: base.article ? ` (${base.article})` : "", size: 22 }),
        ],
        spacing: { before: 200, after: 50 },
      })
    );
    children.push(createParagraph(getLegalBaseDescription(base.key)));
  });

  // ============ SECTION 10: COMPARTIR INFORMACIÓN ============
  children.push(createSectionTitle("10. COMPARTIR INFORMACIÓN PERSONAL"));
  children.push(createParagraph(LEGAL_TEXTS.compartirIntro));

  if (step06?.sharesData && step06?.recipients?.length > 0) {
    children.push(createSubsectionTitle("Destinatarios de los Datos"));
    step06.recipients.forEach((r: any) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "• ", size: 22 }),
            new TextRun({ text: r.name, bold: true, size: 22 }),
            new TextRun({ text: ` (${r.country}): ${r.purpose}${r.hasContract ? " - Con contrato" : ""}`, size: 22 }),
          ],
          spacing: { before: 50, after: 50 },
          indent: { left: 360 },
        })
      );
    });
  } else {
    children.push(createParagraph("No comunicamos sus datos personales a terceros, salvo cuando sea requerido por ley o con su consentimiento expreso."));
  }

  if (step07?.hasInternationalTransfers && step07?.transfers?.length > 0) {
    children.push(createSubsectionTitle("Transferencias Internacionales"));
    children.push(createParagraph(LEGAL_TEXTS.transferenciasTexto));
    step07.transfers.forEach((t: any) => {
      children.push(createBulletPointWithDescription(t.country, `${t.recipient} - ${t.purpose}`));
    });
  }

  // ============ SECTION 11: CONSERVACIÓN ============
  children.push(createSectionTitle("11. CONSERVACIÓN DE INFORMACIÓN PERSONAL"));
  children.push(createParagraph(LEGAL_TEXTS.conservacionIntro));
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Período general de conservación: ", bold: true, size: 22 }),
        new TextRun({ text: getRetentionPeriodLabel(step08?.defaultPeriod) || "el tiempo necesario para cumplir las finalidades", size: 22 }),
      ],
      spacing: { before: 100, after: 100 },
    })
  );
  children.push(createParagraph(LEGAL_TEXTS.conservacionCriterios));

  if (step08?.deletionProcess) {
    children.push(createSubsectionTitle("Proceso de Eliminación"));
    children.push(createParagraph(step08.deletionProcess));
  }

  children.push(createParagraph(LEGAL_TEXTS.conservacionExcepciones));

  // ============ SECTION 12: DERECHOS DEL TITULAR ============
  children.push(createSectionTitle("12. DERECHOS DEL TITULAR"));
  children.push(createParagraph(LEGAL_TEXTS.derechosIntro));
  children.push(createBulletPointWithDescription("Derecho de Acceso (Art. 10)", "Solicitar confirmación y acceder a sus datos personales."));
  children.push(createBulletPointWithDescription("Derecho de Rectificación (Art. 11)", "Corregir datos inexactos o incompletos."));
  children.push(createBulletPointWithDescription("Derecho de Supresión (Art. 12)", "Solicitar la eliminación de sus datos."));
  children.push(createBulletPointWithDescription("Derecho de Oposición (Art. 13)", "Oponerse al tratamiento en ciertas circunstancias."));
  children.push(createBulletPointWithDescription("Derecho a la Portabilidad (Art. 15)", "Recibir sus datos en formato estructurado."));
  children.push(createBulletPointWithDescription("Decisiones Automatizadas (Art. 15 bis)", "No ser objeto de decisiones basadas únicamente en tratamiento automatizado."));

  children.push(createSubsectionTitle("Cómo Ejercer sus Derechos"));
  children.push(createParagraph(LEGAL_TEXTS.derechosEjercicio));

  if (step12?.rightsExerciseProcess) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Procedimiento: ", bold: true, size: 22 }),
          new TextRun({ text: step12.rightsExerciseProcess, size: 22 }),
        ],
        spacing: { before: 100, after: 100 },
        shading: { fill: "f8fafc" },
      })
    );
  }

  if (step12?.responseTime) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Plazo de respuesta: ", bold: true, size: 22 }),
          new TextRun({ text: `${step12.responseTime} días hábiles`, size: 22 }),
        ],
        spacing: { before: 100, after: 100 },
      })
    );
  }

  children.push(createParagraph(LEGAL_TEXTS.derechosReclamo));

  // ============ SECTION 13: PROTECCIÓN ============
  children.push(createSectionTitle("13. PROTECCIÓN DE INFORMACIÓN PERSONAL"));
  children.push(createParagraph(LEGAL_TEXTS.proteccionIntro));

  if (security.technical.length > 0) {
    children.push(createSubsectionTitle("Medidas Técnicas"));
    security.technical.forEach((m) => children.push(createBulletPoint(m)));
  }

  if (security.organizational.length > 0) {
    children.push(createSubsectionTitle("Medidas Organizativas"));
    security.organizational.forEach((m) => children.push(createBulletPoint(m)));
  }

  if (security.physical.length > 0) {
    children.push(createSubsectionTitle("Medidas Físicas"));
    security.physical.forEach((m) => children.push(createBulletPoint(m)));
  }

  children.push(createParagraph(LEGAL_TEXTS.proteccionProveedores));

  // ============ SECTION 14: DATOS DE MENORES ============
  children.push(createSectionTitle("14. TRATAMIENTO DE DATOS DE MENORES"));
  children.push(createParagraph(LEGAL_TEXTS.menoresIntro));

  if (step02?.hasMinorData || step03?.processesMinorData) {
    children.push(createParagraph(LEGAL_TEXTS.menoresPolitica));
    children.push(createBulletPointWithDescription("Menores de 14 años", LEGAL_TEXTS.menoresMenos14));
    children.push(createBulletPointWithDescription("Adolescentes 14-18 años", LEGAL_TEXTS.menores14a18));

    if (step03?.minorDataDetails) {
      const minorRows: string[][] = [];
      if (step03.minorDataDetails.ageRange) minorRows.push(["Rango de edad:", step03.minorDataDetails.ageRange]);
      if (step03.minorDataDetails.parentalConsentMechanism) minorRows.push(["Mecanismo de consentimiento:", step03.minorDataDetails.parentalConsentMechanism]);
      if (minorRows.length > 0) children.push(createInfoTable(minorRows));
    }
  }

  children.push(createParagraph(LEGAL_TEXTS.menoresPrincipios));

  // ============ SECTION 15: DECISIONES AUTOMATIZADAS ============
  children.push(createSectionTitle("15. DECISIONES AUTOMATIZADAS Y ELABORACIÓN DE PERFILES"));
  children.push(createParagraph(LEGAL_TEXTS.automatizadasIntro));

  if (step10?.hasAutomatedDecisions && step10?.decisions?.length > 0) {
    children.push(createSubsectionTitle("Decisiones Automatizadas Implementadas"));
    step10.decisions.forEach((d: any) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "• ", size: 22 }),
            new TextRun({ text: d.type, bold: true, size: 22 }),
            new TextRun({ text: `: ${d.description}`, size: 22 }),
          ],
          spacing: { before: 100, after: 50 },
          indent: { left: 360 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Lógica: ", bold: true, size: 20 }),
            new TextRun({ text: d.logic, size: 20 }),
            new TextRun({ text: " | Salvaguardas: ", bold: true, size: 20 }),
            new TextRun({ text: d.safeguards, size: 20 }),
          ],
          spacing: { after: 100 },
          indent: { left: 720 },
        })
      );
    });
    if (step10.humanReviewProcess) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Proceso de revisión humana: ", bold: true, size: 22 }),
            new TextRun({ text: step10.humanReviewProcess, size: 22 }),
          ],
          spacing: { before: 100, after: 100 },
        })
      );
    }
  } else {
    children.push(createParagraph(LEGAL_TEXTS.automatizadasActual));
  }

  if (step10?.profiling?.exists) {
    children.push(createSubsectionTitle("Elaboración de Perfiles"));
    const profilingRows: string[][] = [];
    if (step10.profiling.purpose) profilingRows.push(["Propósito:", step10.profiling.purpose]);
    if (step10.profiling.logic) profilingRows.push(["Lógica:", step10.profiling.logic]);
    if (step10.profiling.consequences) profilingRows.push(["Consecuencias:", step10.profiling.consequences]);
    if (profilingRows.length > 0) children.push(createInfoTable(profilingRows));
  }

  children.push(createParagraph(LEGAL_TEXTS.automatizadasDerechos));

  // ============ SECTION 16: CAMBIOS ============
  children.push(createSectionTitle("16. CAMBIOS A ESTA POLÍTICA"));
  children.push(createParagraph(LEGAL_TEXTS.cambiosIntro));
  children.push(createParagraph(LEGAL_TEXTS.cambiosNotificacion));

  const versionRows: string[][] = [
    ["Versión actual:", String(policy.version)],
    ["Última actualización:", format(new Date(policy.updatedAt), "d 'de' MMMM 'de' yyyy", { locale: es })],
  ];
  if (step12?.reviewFrequency) {
    const freq = step12.reviewFrequency === 'annual' ? 'Anual' : step12.reviewFrequency === 'biannual' ? 'Semestral' : 'Según necesidad';
    versionRows.push(["Frecuencia de revisión:", freq]);
  }
  if (step12?.responsiblePerson) versionRows.push(["Responsable:", step12.responsiblePerson]);
  children.push(createInfoTable(versionRows));

  // ============ SECTION 17: CONTACTO ============
  children.push(createSectionTitle("17. CONTACTO"));
  children.push(createParagraph(LEGAL_TEXTS.contactoIntro));

  children.push(createSubsectionTitle("Responsable del Tratamiento"));
  const contactRows: string[][] = [["Razón Social:", companyName]];
  if (step01?.address) {
    contactRows.push(["Dirección:", `${step01.address}${step01.city ? `, ${step01.city}` : ""}${step01.region ? `, ${getRegionName(step01.region)}` : ""}`]);
  }
  if (step01?.email) contactRows.push(["Email:", step01.email]);
  if (step01?.phone) contactRows.push(["Teléfono:", step01.phone]);
  if (step12?.contactChannel) contactRows.push(["Canal para derechos:", step12.contactChannel]);
  children.push(createInfoTable(contactRows));

  if (step01?.hasDPO && step01?.dpoName) {
    children.push(createSubsectionTitle("Delegado de Protección de Datos"));
    const dpoContactRows: string[][] = [["Nombre:", step01.dpoName]];
    if (step01.dpoEmail) dpoContactRows.push(["Email:", step01.dpoEmail]);
    if (step01.dpoPhone) dpoContactRows.push(["Teléfono:", step01.dpoPhone]);
    children.push(createInfoTable(dpoContactRows));
  }

  // ============ FOOTER / DISCLAIMER ============
  children.push(
    new Paragraph({
      border: {
        top: { style: BorderStyle.SINGLE, size: 6, color: "e2e8f0" },
      },
      spacing: { before: 400, after: 200 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "AVISO LEGAL",
          bold: true,
          size: 18,
          color: "64748b",
        }),
      ],
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: LEGAL_TEXTS.disclaimer,
          size: 18,
          color: "64748b",
        }),
      ],
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Documento generado conforme a la Ley N° 19.628, modificada por la Ley N° 21.719",
          size: 18,
          color: "94a3b8",
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { before: 100 },
    })
  );

  if (includeWatermark) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Documento generado con el plan gratuito de TratoDatos.cl",
            size: 18,
            italics: true,
            color: "94a3b8",
          }),
        ],
        alignment: AlignmentType.RIGHT,
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

// ============ HELPER FUNCTIONS ============

function createSectionTitle(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26,
        color: "1e3a5f",
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "e2e8f0" },
    },
  });
}

function createSubsectionTitle(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 22,
        color: "334155",
      }),
    ],
    spacing: { before: 200, after: 100 },
  });
}

function createParagraph(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    spacing: { before: 100, after: 100 },
  });
}

function createBulletPoint(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: "• ", size: 22 }),
      new TextRun({ text, size: 22 }),
    ],
    spacing: { before: 50, after: 50 },
    indent: { left: 360 },
  });
}

function createBulletPointWithDescription(title: string, description: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: "• ", size: 22 }),
      new TextRun({ text: title, bold: true, size: 22 }),
      new TextRun({ text: `: ${description}`, size: 22 }),
    ],
    spacing: { before: 50, after: 50 },
    indent: { left: 360 },
  });
}

function createInfoTable(rows: string[][]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(
      ([label, value]) =>
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: label, bold: true, size: 22 })],
                }),
              ],
              width: { size: 30, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: value, size: 22 })],
                }),
              ],
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
            }),
          ],
        })
    ),
  });
}

function createWarningBox(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 20,
        color: "92400e",
      }),
    ],
    spacing: { before: 200, after: 200 },
    shading: { fill: "fef3c7" },
  });
}
