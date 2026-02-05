// PDF Document Generator using @react-pdf/renderer
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
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

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
  },
  watermark: {
    position: "absolute",
    top: "40%",
    left: "20%",
    fontSize: 50,
    color: "#e2e8f0",
    transform: "rotate(-45deg)",
    opacity: 0.2,
  },
  header: {
    textAlign: "center",
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a5f",
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  companyName: {
    fontSize: 13,
    color: "#334155",
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  effectiveDate: {
    fontSize: 9,
    color: "#64748b",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    textTransform: "uppercase",
  },
  subsectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#334155",
    marginTop: 10,
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 6,
    textAlign: "justify",
  },
  infoBox: {
    backgroundColor: "#f8fafc",
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#1e3a5f",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  infoLabel: {
    fontFamily: "Helvetica-Bold",
    width: 100,
    fontSize: 9,
  },
  infoValue: {
    flex: 1,
    fontSize: 9,
  },
  list: {
    marginLeft: 12,
    marginTop: 4,
  },
  listItem: {
    marginBottom: 4,
    flexDirection: "row",
  },
  bullet: {
    width: 12,
    fontSize: 10,
  },
  listText: {
    flex: 1,
    fontSize: 9,
  },
  listTextBold: {
    fontFamily: "Helvetica-Bold",
  },
  warningBox: {
    backgroundColor: "#fef3c7",
    padding: 10,
    marginTop: 8,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
  },
  warningText: {
    fontSize: 9,
    color: "#92400e",
  },
  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  disclaimer: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    fontSize: 8,
    color: "#64748b",
    borderRadius: 4,
  },
  lastUpdated: {
    fontSize: 8,
    color: "#94a3b8",
    marginTop: 8,
    textAlign: "right",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 50,
    fontSize: 8,
    color: "#94a3b8",
  },
  legalBasisItem: {
    marginBottom: 8,
    paddingLeft: 8,
  },
  contactBox: {
    backgroundColor: "#f8fafc",
    padding: 12,
    marginTop: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
});

interface PolicyPDFDocumentProps {
  policy: Policy;
  includeWatermark?: boolean;
}

const getRegionName = (code: string): string => {
  return CHILEAN_REGIONS.find((r) => r.code === code)?.name || code;
};

export function PolicyPDFDocument({
  policy,
  includeWatermark = false,
}: PolicyPDFDocumentProps) {
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

  return (
    <Document>
      {/* PAGE 1 */}
      <Page size="A4" style={styles.page}>
        {includeWatermark && <Text style={styles.watermark}>TratoDatos</Text>}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Política de Tratamiento de Datos Personales</Text>
          <Text style={styles.companyName}>{companyName}</Text>
          {step12?.effectiveDate && (
            <Text style={styles.effectiveDate}>
              Vigente desde: {format(new Date(step12.effectiveDate), "d 'de' MMMM 'de' yyyy", { locale: es })}
              {" | "}Versión {policy.version}
            </Text>
          )}
        </View>

        {/* 1. Presentación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Presentación de la Política de Privacidad</Text>
          <Text style={styles.paragraph}>
            {LEGAL_TEXTS.presentacion.replace('{companyName}', companyName)}
          </Text>
        </View>

        {/* 2. Introducción y Ámbito */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Introducción y Ámbito de Aplicación</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.introduccion}</Text>
        </View>

        {/* 3. Identificación del Responsable */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Identificación del Responsable</Text>
          <Text style={styles.paragraph}>
            {LEGAL_TEXTS.quienesSomos.replace('{companyName}', companyName)}
          </Text>

          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Razón Social:</Text>
              <Text style={styles.infoValue}>{companyName}</Text>
            </View>
            {step01?.rut && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>RUT:</Text>
                <Text style={styles.infoValue}>{step01.rut}</Text>
              </View>
            )}
            {step01?.legalRepName && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rep. Legal:</Text>
                <Text style={styles.infoValue}>
                  {step01.legalRepName}{step01.legalRepRut ? ` (RUT: ${step01.legalRepRut})` : ""}
                </Text>
              </View>
            )}
            {step01?.address && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Dirección:</Text>
                <Text style={styles.infoValue}>
                  {step01.address}{step01.city ? `, ${step01.city}` : ""}{step01.region ? `, ${getRegionName(step01.region)}` : ""}
                </Text>
              </View>
            )}
            {step01?.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Teléfono:</Text>
                <Text style={styles.infoValue}>{step01.phone}</Text>
              </View>
            )}
            {step01?.email && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{step01.email}</Text>
              </View>
            )}
            {step01?.website && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sitio Web:</Text>
                <Text style={styles.infoValue}>{step01.website}</Text>
              </View>
            )}
          </View>

          {step01?.hasDPO && step01?.dpoName && (
            <>
              <Text style={styles.subsectionTitle}>Delegado de Protección de Datos (DPO)</Text>
              <View style={styles.infoBox}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nombre:</Text>
                  <Text style={styles.infoValue}>{step01.dpoName}</Text>
                </View>
                {step01.dpoEmail && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{step01.dpoEmail}</Text>
                  </View>
                )}
                {step01.dpoPhone && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Teléfono:</Text>
                    <Text style={styles.infoValue}>{step01.dpoPhone}</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </View>

        {/* 4. A Quiénes Aplica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. A Quiénes Aplica esta Política</Text>
          <Text style={styles.paragraph}>
            {LEGAL_TEXTS.aQuienesAplica.replace('{companyName}', companyName)}
          </Text>
          <View style={styles.list}>
            {getSelectedSubjects().map((subject, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{subject}</Text>
              </View>
            ))}
            {step03?.customSubjects?.map((subject: string, index: number) => (
              <View key={`custom-${index}`} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{subject}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.noAplica}</Text>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} fixed />
      </Page>

      {/* PAGE 2 */}
      <Page size="A4" style={styles.page}>
        {includeWatermark && <Text style={styles.watermark}>TratoDatos</Text>}

        {/* 5. Qué Información Tratamos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Qué Información Tratamos</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.categoriasDatosIntro}</Text>

          {getNonSensitiveCategories().length > 0 && (
            <>
              <Text style={styles.subsectionTitle}>Categorías de Datos Personales</Text>
              <View style={styles.list}>
                {getNonSensitiveCategories().map((cat, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>
                      <Text style={styles.listTextBold}>{cat.name}:</Text> {cat.description}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {getSensitiveCategories().length > 0 && (
            <>
              <Text style={styles.subsectionTitle}>Datos Sensibles</Text>
              <View style={styles.list}>
                {getSensitiveCategories().map((cat, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>
                      <Text style={styles.listTextBold}>{cat.name}:</Text> {cat.description}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  Nota importante: {LEGAL_TEXTS.notaDatosSensibles}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* 6. Uso de Información en Línea */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Cómo Utilizamos la Información en Línea</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.usoEnLineaIntro}</Text>
          <View style={styles.list}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>
                <Text style={styles.listTextBold}>Formularios:</Text> {LEGAL_TEXTS.usoEnLineaFormularios}
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>
                <Text style={styles.listTextBold}>Navegación:</Text> {LEGAL_TEXTS.usoEnLineaCookies}
              </Text>
            </View>
            {sources.auto && (
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>
                  <Text style={styles.listTextBold}>Analytics:</Text> {LEGAL_TEXTS.usoEnLineaAnalytics}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 7. Fuentes de Datos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. De Dónde Obtenemos la Información</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.fuentesDatosIntro}</Text>
          <View style={styles.list}>
            {sources.direct && (
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>
                  <Text style={styles.listTextBold}>Recopilación directa:</Text> {LEGAL_TEXTS.fuenteDirecta}
                </Text>
              </View>
            )}
            {sources.auto && (
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>
                  <Text style={styles.listTextBold}>Recopilación automática:</Text> {LEGAL_TEXTS.fuenteAutomatica}
                </Text>
              </View>
            )}
            {sources.third && (
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>
                  <Text style={styles.listTextBold}>Terceros:</Text> {LEGAL_TEXTS.fuenteTerceros}
                </Text>
              </View>
            )}
            {sources.public && (
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>
                  <Text style={styles.listTextBold}>Fuentes públicas:</Text> {LEGAL_TEXTS.fuentePublica}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 8. Finalidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Finalidades del Tratamiento</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.finalidadesIntro}</Text>
          <View style={styles.list}>
            {getSelectedPurposes().map((purpose, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{purpose.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} fixed />
      </Page>

      {/* PAGE 3 */}
      <Page size="A4" style={styles.page}>
        {includeWatermark && <Text style={styles.watermark}>TratoDatos</Text>}

        {/* 9. Bases Legales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Bases Legales del Tratamiento</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.basesLegalesIntro}</Text>
          {getSelectedLegalBases().map((base, index) => (
            <View key={index} style={styles.legalBasisItem}>
              <Text style={[styles.paragraph, { fontFamily: "Helvetica-Bold", color: "#1e3a5f" }]}>
                {base.name}{base.article ? ` (${base.article})` : ""}
              </Text>
              <Text style={[styles.paragraph, { fontSize: 9 }]}>
                {getLegalBaseDescription(base.key)}
              </Text>
            </View>
          ))}
        </View>

        {/* 10. Compartir Información */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Compartir Información Personal</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.compartirIntro}</Text>

          {step06?.sharesData && step06?.recipients?.length > 0 ? (
            <>
              <Text style={styles.subsectionTitle}>Destinatarios de los Datos</Text>
              <View style={styles.list}>
                {step06.recipients.map((r: any, index: number) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>
                      <Text style={styles.listTextBold}>{r.name}</Text> ({r.country}): {r.purpose}
                      {r.hasContract ? " - Con contrato" : ""}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.paragraph}>
              No comunicamos sus datos personales a terceros, salvo cuando sea requerido por ley o con su consentimiento expreso.
            </Text>
          )}

          {step07?.hasInternationalTransfers && step07?.transfers?.length > 0 && (
            <>
              <Text style={styles.subsectionTitle}>Transferencias Internacionales</Text>
              <Text style={styles.paragraph}>{LEGAL_TEXTS.transferenciasTexto}</Text>
              <View style={styles.list}>
                {step07.transfers.map((t: any, index: number) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>
                      <Text style={styles.listTextBold}>{t.country}:</Text> {t.recipient} - {t.purpose}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        {/* 11. Conservación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Conservación de Información Personal</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.conservacionIntro}</Text>
          <Text style={styles.paragraph}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Período general de conservación: </Text>
            {getRetentionPeriodLabel(step08?.defaultPeriod) || "el tiempo necesario para cumplir las finalidades"}
          </Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.conservacionCriterios}</Text>
          {step08?.deletionProcess && (
            <>
              <Text style={styles.subsectionTitle}>Proceso de Eliminación</Text>
              <Text style={styles.paragraph}>{step08.deletionProcess}</Text>
            </>
          )}
          <Text style={styles.paragraph}>{LEGAL_TEXTS.conservacionExcepciones}</Text>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} fixed />
      </Page>

      {/* PAGE 4 */}
      <Page size="A4" style={styles.page}>
        {includeWatermark && <Text style={styles.watermark}>TratoDatos</Text>}

        {/* 12. Derechos del Titular */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Derechos del Titular</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.derechosIntro}</Text>
          <View style={styles.list}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>
                <Text style={styles.listTextBold}>Acceso (Art. 10):</Text> Solicitar confirmación y acceder a sus datos.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>
                <Text style={styles.listTextBold}>Rectificación (Art. 11):</Text> Corregir datos inexactos o incompletos.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>
                <Text style={styles.listTextBold}>Supresión (Art. 12):</Text> Solicitar eliminación de sus datos.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>
                <Text style={styles.listTextBold}>Oposición (Art. 13):</Text> Oponerse al tratamiento en ciertas circunstancias.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>
                <Text style={styles.listTextBold}>Portabilidad (Art. 15):</Text> Recibir sus datos en formato estructurado.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>
                <Text style={styles.listTextBold}>Decisiones Automatizadas (Art. 15 bis):</Text> No ser objeto de decisiones automatizadas.
              </Text>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Cómo Ejercer sus Derechos</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.derechosEjercicio}</Text>

          {step12?.rightsExerciseProcess && (
            <View style={styles.infoBox}>
              <Text style={[styles.paragraph, { marginBottom: 0, fontSize: 9 }]}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Procedimiento: </Text>
                {step12.rightsExerciseProcess}
              </Text>
            </View>
          )}

          {step12?.responseTime && (
            <Text style={styles.paragraph}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Plazo de respuesta: </Text>
              {step12.responseTime} días hábiles
            </Text>
          )}

          <Text style={styles.paragraph}>{LEGAL_TEXTS.derechosReclamo}</Text>
        </View>

        {/* 13. Protección de Datos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Protección de Información Personal</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.proteccionIntro}</Text>

          {security.technical.length > 0 && (
            <>
              <Text style={styles.subsectionTitle}>Medidas Técnicas</Text>
              <View style={styles.list}>
                {security.technical.map((m, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>{m}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {security.organizational.length > 0 && (
            <>
              <Text style={styles.subsectionTitle}>Medidas Organizativas</Text>
              <View style={styles.list}>
                {security.organizational.map((m, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>{m}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {security.physical.length > 0 && (
            <>
              <Text style={styles.subsectionTitle}>Medidas Físicas</Text>
              <View style={styles.list}>
                {security.physical.map((m, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>{m}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <Text style={styles.paragraph}>{LEGAL_TEXTS.proteccionProveedores}</Text>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} fixed />
      </Page>

      {/* PAGE 5 */}
      <Page size="A4" style={styles.page}>
        {includeWatermark && <Text style={styles.watermark}>TratoDatos</Text>}

        {/* 14. Datos de Menores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Tratamiento de Datos de Menores</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.menoresIntro}</Text>

          {(step02?.hasMinorData || step03?.processesMinorData) && (
            <>
              <Text style={styles.paragraph}>{LEGAL_TEXTS.menoresPolitica}</Text>
              <View style={styles.list}>
                <View style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>
                    <Text style={styles.listTextBold}>Menores de 14 años:</Text> {LEGAL_TEXTS.menoresMenos14}
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>
                    <Text style={styles.listTextBold}>14 a 18 años:</Text> {LEGAL_TEXTS.menores14a18}
                  </Text>
                </View>
              </View>
              {step03?.minorDataDetails && (
                <View style={styles.infoBox}>
                  {step03.minorDataDetails.ageRange && (
                    <Text style={[styles.paragraph, { marginBottom: 2, fontSize: 9 }]}>
                      <Text style={{ fontFamily: "Helvetica-Bold" }}>Rango de edad: </Text>
                      {step03.minorDataDetails.ageRange}
                    </Text>
                  )}
                  {step03.minorDataDetails.parentalConsentMechanism && (
                    <Text style={[styles.paragraph, { marginBottom: 0, fontSize: 9 }]}>
                      <Text style={{ fontFamily: "Helvetica-Bold" }}>Mecanismo de consentimiento: </Text>
                      {step03.minorDataDetails.parentalConsentMechanism}
                    </Text>
                  )}
                </View>
              )}
            </>
          )}

          <Text style={styles.paragraph}>{LEGAL_TEXTS.menoresPrincipios}</Text>
        </View>

        {/* 15. Decisiones Automatizadas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>15. Decisiones Automatizadas y Elaboración de Perfiles</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.automatizadasIntro}</Text>

          {step10?.hasAutomatedDecisions && step10?.decisions?.length > 0 ? (
            <>
              <Text style={styles.subsectionTitle}>Decisiones Automatizadas Implementadas</Text>
              <View style={styles.list}>
                {step10.decisions.map((d: any, index: number) => (
                  <View key={index} style={[styles.listItem, { marginBottom: 8 }]}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>
                      <Text style={styles.listTextBold}>{d.type}:</Text> {d.description}
                      {"\n"}Lógica: {d.logic}
                      {"\n"}Salvaguardas: {d.safeguards}
                    </Text>
                  </View>
                ))}
              </View>
              {step10.humanReviewProcess && (
                <Text style={styles.paragraph}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>Revisión humana: </Text>
                  {step10.humanReviewProcess}
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.paragraph}>{LEGAL_TEXTS.automatizadasActual}</Text>
          )}

          {step10?.profiling?.exists && (
            <>
              <Text style={styles.subsectionTitle}>Elaboración de Perfiles</Text>
              <View style={styles.infoBox}>
                {step10.profiling.purpose && (
                  <Text style={[styles.paragraph, { marginBottom: 2, fontSize: 9 }]}>
                    <Text style={{ fontFamily: "Helvetica-Bold" }}>Propósito: </Text>
                    {step10.profiling.purpose}
                  </Text>
                )}
                {step10.profiling.logic && (
                  <Text style={[styles.paragraph, { marginBottom: 2, fontSize: 9 }]}>
                    <Text style={{ fontFamily: "Helvetica-Bold" }}>Lógica: </Text>
                    {step10.profiling.logic}
                  </Text>
                )}
                {step10.profiling.consequences && (
                  <Text style={[styles.paragraph, { marginBottom: 0, fontSize: 9 }]}>
                    <Text style={{ fontFamily: "Helvetica-Bold" }}>Consecuencias: </Text>
                    {step10.profiling.consequences}
                  </Text>
                )}
              </View>
            </>
          )}

          <Text style={styles.paragraph}>{LEGAL_TEXTS.automatizadasDerechos}</Text>
        </View>

        {/* 16. Cambios a la Política */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>16. Cambios a esta Política</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.cambiosIntro}</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.cambiosNotificacion}</Text>

          <View style={styles.infoBox}>
            <Text style={[styles.paragraph, { marginBottom: 2, fontSize: 9 }]}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Versión actual: </Text>
              {policy.version}
            </Text>
            <Text style={[styles.paragraph, { marginBottom: 2, fontSize: 9 }]}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Última actualización: </Text>
              {format(new Date(policy.updatedAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
            </Text>
            {step12?.reviewFrequency && (
              <Text style={[styles.paragraph, { marginBottom: 2, fontSize: 9 }]}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Frecuencia de revisión: </Text>
                {step12.reviewFrequency === 'annual' ? 'Anual' : step12.reviewFrequency === 'biannual' ? 'Semestral' : 'Según necesidad'}
              </Text>
            )}
            {step12?.responsiblePerson && (
              <Text style={[styles.paragraph, { marginBottom: 0, fontSize: 9 }]}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Responsable: </Text>
                {step12.responsiblePerson}
              </Text>
            )}
          </View>
        </View>

        {/* 17. Contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>17. Contacto</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.contactoIntro}</Text>

          <View style={styles.contactBox}>
            <Text style={[styles.paragraph, { fontFamily: "Helvetica-Bold", color: "#1e3a5f", marginBottom: 6 }]}>
              Responsable del Tratamiento
            </Text>
            <Text style={[styles.paragraph, { marginBottom: 2, fontSize: 9 }]}>{companyName}</Text>
            {step01?.address && (
              <Text style={[styles.paragraph, { marginBottom: 2, fontSize: 9 }]}>
                {step01.address}{step01.city ? `, ${step01.city}` : ""}{step01.region ? `, ${getRegionName(step01.region)}` : ""}
              </Text>
            )}
            {step01?.email && (
              <Text style={[styles.paragraph, { marginBottom: 2, fontSize: 9 }]}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Email: </Text>{step01.email}
              </Text>
            )}
            {step01?.phone && (
              <Text style={[styles.paragraph, { marginBottom: 2, fontSize: 9 }]}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Teléfono: </Text>{step01.phone}
              </Text>
            )}
            {step12?.contactChannel && (
              <Text style={[styles.paragraph, { marginBottom: 0, fontSize: 9 }]}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Canal para derechos: </Text>{step12.contactChannel}
              </Text>
            )}
          </View>

          {step01?.hasDPO && step01?.dpoName && (
            <View style={[styles.contactBox, { marginTop: 8 }]}>
              <Text style={[styles.paragraph, { fontFamily: "Helvetica-Bold", color: "#1e3a5f", marginBottom: 6 }]}>
                Delegado de Protección de Datos
              </Text>
              <Text style={[styles.paragraph, { marginBottom: 2, fontSize: 9 }]}>{step01.dpoName}</Text>
              {step01.dpoEmail && (
                <Text style={[styles.paragraph, { marginBottom: 2, fontSize: 9 }]}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>Email: </Text>{step01.dpoEmail}
                </Text>
              )}
              {step01.dpoPhone && (
                <Text style={[styles.paragraph, { marginBottom: 0, fontSize: 9 }]}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>Teléfono: </Text>{step01.dpoPhone}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.disclaimer}>
            <Text>{LEGAL_TEXTS.disclaimer}</Text>
          </View>
          <Text style={styles.lastUpdated}>
            Documento generado conforme a la Ley N° 19.628, modificada por Ley N° 21.719
          </Text>
          {includeWatermark && (
            <Text style={[styles.lastUpdated, { fontStyle: "italic" }]}>
              Generado con el plan gratuito de TratoDatos.cl
            </Text>
          )}
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} fixed />
      </Page>
    </Document>
  );
}
