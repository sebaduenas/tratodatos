// PDF Document Generator using @react-pdf/renderer
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
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
  getRetentionPeriodLabel,
} from "@/lib/constants";

// Register fonts (optional - using default for now)
// Font.register({ family: 'Inter', src: '/fonts/Inter-Regular.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  watermark: {
    position: "absolute",
    top: "40%",
    left: "25%",
    fontSize: 60,
    color: "#e2e8f0",
    transform: "rotate(-45deg)",
    opacity: 0.3,
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1e40af",
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 10,
  },
  companyName: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 5,
  },
  effectiveDate: {
    fontSize: 10,
    color: "#64748b",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  paragraph: {
    marginBottom: 8,
    textAlign: "justify",
  },
  infoBox: {
    backgroundColor: "#f8fafc",
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    fontFamily: "Helvetica-Bold",
    width: 120,
  },
  infoValue: {
    flex: 1,
  },
  list: {
    marginLeft: 15,
    marginTop: 5,
  },
  listItem: {
    marginBottom: 4,
    flexDirection: "row",
  },
  bullet: {
    width: 15,
  },
  listText: {
    flex: 1,
  },
  warningBox: {
    backgroundColor: "#fef3c7",
    padding: 12,
    marginTop: 10,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
  },
  warningText: {
    fontSize: 10,
    color: "#92400e",
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  disclaimer: {
    backgroundColor: "#f1f5f9",
    padding: 15,
    fontSize: 9,
    color: "#64748b",
    borderRadius: 4,
  },
  lastUpdated: {
    fontSize: 9,
    color: "#94a3b8",
    marginTop: 10,
    textAlign: "right",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 50,
    fontSize: 9,
    color: "#94a3b8",
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark for free plan */}
        {includeWatermark && <Text style={styles.watermark}>TratoDatos</Text>}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES
          </Text>
          {step01 && <Text style={styles.companyName}>{step01.companyName}</Text>}
          {step12?.effectiveDate && (
            <Text style={styles.effectiveDate}>
              Vigente desde:{" "}
              {format(new Date(step12.effectiveDate), "d 'de' MMMM 'de' yyyy", {
                locale: es,
              })}
            </Text>
          )}
        </View>

        {/* 1. Identificación del Responsable */}
        {step01 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              1. IDENTIFICACIÓN DEL RESPONSABLE
            </Text>
            <Text style={styles.paragraph}>
              {LEGAL_TEXTS.policyIntro.replace("{companyName}", step01.companyName)}
            </Text>

            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Razón Social:</Text>
                <Text style={styles.infoValue}>{step01.companyName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>RUT:</Text>
                <Text style={styles.infoValue}>{step01.rut}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Dirección:</Text>
                <Text style={styles.infoValue}>
                  {step01.address}, {step01.city}, {getRegionName(step01.region)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Teléfono:</Text>
                <Text style={styles.infoValue}>{step01.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{step01.email}</Text>
              </View>
              {step01.website && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Sitio Web:</Text>
                  <Text style={styles.infoValue}>{step01.website}</Text>
                </View>
              )}
            </View>

            {step01.hasDPO && step01.dpoName && (
              <View style={styles.infoBox}>
                <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 8 }}>
                  Delegado de Protección de Datos (DPO):
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nombre:</Text>
                  <Text style={styles.infoValue}>{step01.dpoName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{step01.dpoEmail}</Text>
                </View>
                {step01.dpoPhone && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Teléfono:</Text>
                    <Text style={styles.infoValue}>{step01.dpoPhone}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* 2. Categorías de Datos */}
        {step02 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              2. CATEGORÍAS DE DATOS PERSONALES
            </Text>
            <Text style={styles.paragraph}>
              Tratamos las siguientes categorías de datos personales:
            </Text>
            <View style={styles.list}>
              {Object.entries(step02.categories || {})
                .filter(([_, value]) => value)
                .map(([key]) => {
                  const category = DATA_CATEGORIES[key as keyof typeof DATA_CATEGORIES];
                  return (
                    <View key={key} style={styles.listItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.listText}>
                        {category?.name || key}
                        {category?.isSensitive ? " (Dato Sensible)" : ""}
                      </Text>
                    </View>
                  );
                })}
            </View>

            {step02.hasSensitiveData && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  Nota: El tratamiento de datos sensibles se realiza con
                  consentimiento explícito del titular o bajo las bases legales
                  establecidas en el Artículo 16 ter de la Ley 21.719.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* 3. Titulares */}
        {step03 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. TITULARES DE LOS DATOS</Text>
            <Text style={styles.paragraph}>
              Tratamos datos personales de las siguientes categorías de personas:
            </Text>
            <View style={styles.list}>
              {Object.entries(step03.subjects || {})
                .filter(([_, value]) => value)
                .map(([key]) => (
                  <View key={key} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>
                      {DATA_SUBJECTS[key as keyof typeof DATA_SUBJECTS]?.name || key}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* 4. Finalidades */}
        {step04 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. FINALIDADES DEL TRATAMIENTO</Text>
            <Text style={styles.paragraph}>
              Sus datos personales son tratados para las siguientes finalidades:
            </Text>
            <View style={styles.list}>
              {Object.entries(step04.purposes || {})
                .filter(([_, value]) => value)
                .map(([key]) => (
                  <View key={key} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>
                      {PURPOSES[key as keyof typeof PURPOSES]?.name || key}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* Page number */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Página ${pageNumber} de ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* Second page */}
      <Page size="A4" style={styles.page}>
        {includeWatermark && <Text style={styles.watermark}>TratoDatos</Text>}

        {/* 5. Bases Legales */}
        {step05 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              5. BASES LEGALES DEL TRATAMIENTO
            </Text>
            <Text style={styles.paragraph}>
              El tratamiento de sus datos se fundamenta en las siguientes bases
              legales:
            </Text>
            <View style={styles.list}>
              {Object.entries(step05.bases || {})
                .filter(([_, value]) => value)
                .map(([key]) => {
                  const base = LEGAL_BASES[key as keyof typeof LEGAL_BASES];
                  return (
                    <View key={key} style={[styles.listItem, { marginBottom: 8 }]}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.listText}>
                        <Text style={{ fontFamily: "Helvetica-Bold" }}>
                          {base?.name || key}
                        </Text>
                        {base?.article ? ` (${base.article})` : ""}: {base?.description || ""}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>
        )}

        {/* 6. Destinatarios */}
        {step06 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. DESTINATARIOS DE LOS DATOS</Text>
            {step06.sharesData && step06.recipients?.length > 0 ? (
              <>
                <Text style={styles.paragraph}>
                  Sus datos pueden ser comunicados a los siguientes destinatarios:
                </Text>
                <View style={styles.list}>
                  {step06.recipients.map((r: any) => (
                    <View key={r.id} style={[styles.listItem, { marginBottom: 6 }]}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.listText}>
                        <Text style={{ fontFamily: "Helvetica-Bold" }}>{r.name}</Text>{" "}
                        ({r.country}): {r.purpose}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text style={styles.paragraph}>
                No comunicamos sus datos personales a terceros.
              </Text>
            )}
          </View>
        )}

        {/* 7. Transferencias Internacionales */}
        {step07?.hasInternationalTransfers && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              7. TRANSFERENCIAS INTERNACIONALES
            </Text>
            <Text style={styles.paragraph}>
              Realizamos transferencias de datos personales a los siguientes países:
            </Text>
            <View style={styles.list}>
              {step07.transfers?.map((t: any) => (
                <View key={t.id} style={[styles.listItem, { marginBottom: 6 }]}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>
                    <Text style={{ fontFamily: "Helvetica-Bold" }}>{t.country}</Text>:{" "}
                    {t.recipient} - {t.purpose}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 8. Plazos de Conservación */}
        {step08 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. PLAZOS DE CONSERVACIÓN</Text>
            <Text style={styles.paragraph}>
              Los datos personales serán conservados durante el tiempo necesario
              para cumplir con las finalidades para las que fueron recopilados, con
              un período general de{" "}
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                {getRetentionPeriodLabel(step08.defaultPeriod)}
              </Text>
              .
            </Text>
            {step08.deletionProcess && (
              <Text style={styles.paragraph}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                  Proceso de eliminación:
                </Text>{" "}
                {step08.deletionProcess}
              </Text>
            )}
          </View>
        )}

        {/* 9. Derechos del Titular */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. DERECHOS DEL TITULAR</Text>
          <Text style={styles.paragraph}>{LEGAL_TEXTS.rightsSection}</Text>

          {step12 && (
            <View style={styles.infoBox}>
              <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 8 }}>
                Para ejercer sus derechos, contacte a:
              </Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Canal:</Text>
                <Text style={styles.infoValue}>{step12.contactChannel}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Responsable:</Text>
                <Text style={styles.infoValue}>{step12.responsiblePerson}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Plazo de respuesta:</Text>
                <Text style={styles.infoValue}>
                  {step12.responseTime} días hábiles
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* 10. Seguridad */}
        {step11 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. MEDIDAS DE SEGURIDAD</Text>
            <Text style={styles.paragraph}>
              Implementamos medidas técnicas, organizativas y físicas apropiadas
              para proteger sus datos personales contra acceso no autorizado,
              pérdida o alteración.
            </Text>
          </View>
        )}

        {/* Footer / Disclaimer */}
        <View style={styles.footer}>
          <View style={styles.disclaimer}>
            <Text>{LEGAL_TEXTS.disclaimer}</Text>
          </View>
          <Text style={styles.lastUpdated}>
            Última actualización:{" "}
            {format(new Date(policy.updatedAt), "d 'de' MMMM 'de' yyyy", {
              locale: es,
            })}
          </Text>
          {includeWatermark && (
            <Text style={[styles.lastUpdated, { marginTop: 5, fontStyle: "italic" }]}>
              Documento generado con el plan gratuito de TratoDatos
            </Text>
          )}
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Página ${pageNumber} de ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
