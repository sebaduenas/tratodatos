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
  const step11 = policy.step11Data as any;
  const step12 = policy.step12Data as any;

  const children: (Paragraph | Table)[] = [];

  // Title
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

  // Company name
  if (step01?.companyName) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: step01.companyName,
            size: 28,
            color: "475569",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      })
    );
  }

  // Effective date
  if (step12?.effectiveDate) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Vigente desde: ${format(
              new Date(step12.effectiveDate),
              "d 'de' MMMM 'de' yyyy",
              { locale: es }
            )}`,
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
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "1e40af" },
      },
      spacing: { after: 400 },
    })
  );

  // 1. Identificación del Responsable
  if (step01) {
    children.push(createSectionTitle("1. IDENTIFICACIÓN DEL RESPONSABLE"));
    children.push(
      createParagraph(
        LEGAL_TEXTS.policyIntro.replace("{companyName}", step01.companyName)
      )
    );

    // Info table
    const infoRows = [
      ["Razón Social:", step01.companyName],
      ["RUT:", step01.rut],
      [
        "Dirección:",
        `${step01.address}, ${step01.city}, ${getRegionName(step01.region)}`,
      ],
      ["Teléfono:", step01.phone],
      ["Email:", step01.email],
    ];
    if (step01.website) {
      infoRows.push(["Sitio Web:", step01.website]);
    }

    children.push(createInfoTable(infoRows));

    // DPO info
    if (step01.hasDPO && step01.dpoName) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Delegado de Protección de Datos (DPO):",
              bold: true,
            }),
          ],
          spacing: { before: 200, after: 100 },
        })
      );
      const dpoRows = [
        ["Nombre:", step01.dpoName],
        ["Email:", step01.dpoEmail],
      ];
      if (step01.dpoPhone) {
        dpoRows.push(["Teléfono:", step01.dpoPhone]);
      }
      children.push(createInfoTable(dpoRows));
    }
  }

  // 2. Categorías de Datos
  if (step02) {
    children.push(createSectionTitle("2. CATEGORÍAS DE DATOS PERSONALES"));
    children.push(
      createParagraph("Tratamos las siguientes categorías de datos personales:")
    );

    Object.entries(step02.categories || {})
      .filter(([_, value]) => value)
      .forEach(([key]) => {
        const category = DATA_CATEGORIES[key as keyof typeof DATA_CATEGORIES];
        children.push(
          createBulletPoint(
            `${category?.name || key}${category?.isSensitive ? " (Dato Sensible)" : ""}`
          )
        );
      });

    if (step02.hasSensitiveData) {
      children.push(
        createWarningBox(
          "Nota: El tratamiento de datos sensibles se realiza con consentimiento explícito del titular o bajo las bases legales establecidas en el Artículo 16 ter de la Ley 21.719."
        )
      );
    }
  }

  // 3. Titulares
  if (step03) {
    children.push(createSectionTitle("3. TITULARES DE LOS DATOS"));
    children.push(
      createParagraph(
        "Tratamos datos personales de las siguientes categorías de personas:"
      )
    );

    Object.entries(step03.subjects || {})
      .filter(([_, value]) => value)
      .forEach(([key]) => {
        children.push(
          createBulletPoint(
            DATA_SUBJECTS[key as keyof typeof DATA_SUBJECTS]?.name || key
          )
        );
      });
  }

  // 4. Finalidades
  if (step04) {
    children.push(createSectionTitle("4. FINALIDADES DEL TRATAMIENTO"));
    children.push(
      createParagraph(
        "Sus datos personales son tratados para las siguientes finalidades:"
      )
    );

    Object.entries(step04.purposes || {})
      .filter(([_, value]) => value)
      .forEach(([key]) => {
        children.push(
          createBulletPoint(PURPOSES[key as keyof typeof PURPOSES]?.name || key)
        );
      });
  }

  // 5. Bases Legales
  if (step05) {
    children.push(createSectionTitle("5. BASES LEGALES DEL TRATAMIENTO"));
    children.push(
      createParagraph(
        "El tratamiento de sus datos se fundamenta en las siguientes bases legales:"
      )
    );

    Object.entries(step05.bases || {})
      .filter(([_, value]) => value)
      .forEach(([key]) => {
        const base = LEGAL_BASES[key as keyof typeof LEGAL_BASES];
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "• ", size: 22 }),
              new TextRun({ text: base?.name || key, bold: true, size: 22 }),
              new TextRun({
                text: base?.article ? ` (${base.article}): ` : ": ",
                size: 22,
              }),
              new TextRun({ text: base?.description || "", size: 22 }),
            ],
            spacing: { before: 100, after: 100 },
            indent: { left: 360 },
          })
        );
      });
  }

  // 6. Destinatarios
  if (step06) {
    children.push(createSectionTitle("6. DESTINATARIOS DE LOS DATOS"));
    if (step06.sharesData && step06.recipients?.length > 0) {
      children.push(
        createParagraph(
          "Sus datos pueden ser comunicados a los siguientes destinatarios:"
        )
      );
      step06.recipients.forEach((r: any) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "• ", size: 22 }),
              new TextRun({ text: r.name, bold: true, size: 22 }),
              new TextRun({ text: ` (${r.country}): ${r.purpose}`, size: 22 }),
            ],
            spacing: { before: 100, after: 100 },
            indent: { left: 360 },
          })
        );
      });
    } else {
      children.push(
        createParagraph("No comunicamos sus datos personales a terceros.")
      );
    }
  }

  // 7. Transferencias Internacionales
  if (step07?.hasInternationalTransfers) {
    children.push(createSectionTitle("7. TRANSFERENCIAS INTERNACIONALES"));
    children.push(
      createParagraph(
        "Realizamos transferencias de datos personales a los siguientes países:"
      )
    );
    step07.transfers?.forEach((t: any) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "• ", size: 22 }),
            new TextRun({ text: t.country, bold: true, size: 22 }),
            new TextRun({ text: `: ${t.recipient} - ${t.purpose}`, size: 22 }),
          ],
          spacing: { before: 100, after: 100 },
          indent: { left: 360 },
        })
      );
    });
  }

  // 8. Plazos de Conservación
  if (step08) {
    children.push(createSectionTitle("8. PLAZOS DE CONSERVACIÓN"));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Los datos personales serán conservados durante el tiempo necesario para cumplir con las finalidades para las que fueron recopilados, con un período general de ",
            size: 22,
          }),
          new TextRun({
            text:
              getRetentionPeriodLabel(step08.defaultPeriod),
            bold: true,
            size: 22,
          }),
          new TextRun({ text: ".", size: 22 }),
        ],
        spacing: { before: 100, after: 100 },
      })
    );
    if (step08.deletionProcess) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Proceso de eliminación: ", bold: true, size: 22 }),
            new TextRun({ text: step08.deletionProcess, size: 22 }),
          ],
          spacing: { before: 100, after: 100 },
        })
      );
    }
  }

  // 9. Derechos del Titular
  children.push(createSectionTitle("9. DERECHOS DEL TITULAR"));
  children.push(createParagraph(LEGAL_TEXTS.rightsSection));

  if (step12) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Para ejercer sus derechos, contacte a:",
            bold: true,
          }),
        ],
        spacing: { before: 200, after: 100 },
      })
    );
    children.push(
      createInfoTable([
        ["Canal:", step12.contactChannel],
        ["Responsable:", step12.responsiblePerson],
        ["Plazo de respuesta:", `${step12.responseTime} días hábiles`],
      ])
    );
  }

  // 10. Seguridad
  if (step11) {
    children.push(createSectionTitle("10. MEDIDAS DE SEGURIDAD"));
    children.push(
      createParagraph(
        "Implementamos medidas técnicas, organizativas y físicas apropiadas para proteger sus datos personales contra acceso no autorizado, pérdida o alteración."
      )
    );
  }

  // Disclaimer
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
          text: `Última actualización: ${format(
            new Date(policy.updatedAt),
            "d 'de' MMMM 'de' yyyy",
            { locale: es }
          )}`,
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
            text: "Documento generado con el plan gratuito de TratoDatos",
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

// Helper functions
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
              width: { size: 25, type: WidthType.PERCENTAGE },
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
              width: { size: 75, type: WidthType.PERCENTAGE },
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
        text: "⚠️ " + text,
        size: 20,
        color: "92400e",
      }),
    ],
    spacing: { before: 200, after: 200 },
    shading: { fill: "fef3c7" },
  });
}
