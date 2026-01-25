"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Policy } from "@/types/policy";
import { DATA_CATEGORIES, LEGAL_BASES, PURPOSES, DATA_SUBJECTS, CHILEAN_REGIONS, LEGAL_TEXTS, getRetentionPeriodLabel } from "@/lib/constants";

interface PolicyPreviewProps {
  policy: Policy;
}

export function PolicyPreview({ policy }: PolicyPreviewProps) {
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

  const getRegionName = (code: string) => {
    return CHILEAN_REGIONS.find((r) => r.code === code)?.name || code;
  };

  return (
    <div className="prose prose-slate max-w-none">
      {/* Header */}
      <div className="text-center mb-8 pb-8 border-b">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES
        </h1>
        {step01 && (
          <p className="text-lg text-slate-600">{step01.companyName}</p>
        )}
        {step12 && (
          <p className="text-sm text-slate-500">
            Vigente desde:{" "}
            {format(new Date(step12.effectiveDate), "d 'de' MMMM 'de' yyyy", {
              locale: es,
            })}
          </p>
        )}
      </div>

      {/* 1. Identificación del Responsable */}
      {step01 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            1. IDENTIFICACIÓN DEL RESPONSABLE
          </h2>
          <p>{LEGAL_TEXTS.policyIntro.replace("{companyName}", step01.companyName)}</p>
          
          <div className="bg-slate-50 p-4 rounded-lg mt-4">
            <p><strong>Razón Social:</strong> {step01.companyName}</p>
            <p><strong>RUT:</strong> {step01.rut}</p>
            <p><strong>Dirección:</strong> {step01.address}, {step01.city}, {getRegionName(step01.region)}</p>
            <p><strong>Teléfono:</strong> {step01.phone}</p>
            <p><strong>Email:</strong> {step01.email}</p>
            {step01.website && <p><strong>Sitio Web:</strong> {step01.website}</p>}
            
            {step01.hasDPO && step01.dpoName && (
              <div className="mt-4 pt-4 border-t">
                <p><strong>Delegado de Protección de Datos (DPO):</strong></p>
                <p>Nombre: {step01.dpoName}</p>
                <p>Email: {step01.dpoEmail}</p>
                {step01.dpoPhone && <p>Teléfono: {step01.dpoPhone}</p>}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 2. Categorías de Datos */}
      {step02 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            2. CATEGORÍAS DE DATOS PERSONALES
          </h2>
          <p>Tratamos las siguientes categorías de datos personales:</p>
          <ul>
            {Object.entries(step02.categories)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <li key={key}>
                  <strong>{DATA_CATEGORIES[key as keyof typeof DATA_CATEGORIES]?.name}</strong>
                  {DATA_CATEGORIES[key as keyof typeof DATA_CATEGORIES]?.isSensitive && (
                    <span className="text-amber-600 text-sm ml-2">(Dato Sensible)</span>
                  )}
                </li>
              ))}
          </ul>
          
          {step02.hasSensitiveData && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-4">
              <p className="text-amber-800">
                <strong>Nota:</strong> El tratamiento de datos sensibles se realiza con
                consentimiento explícito del titular o bajo las bases legales
                establecidas en el Artículo 16 ter de la Ley 21.719.
              </p>
            </div>
          )}
        </section>
      )}

      {/* 3. Titulares */}
      {step03 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            3. TITULARES DE LOS DATOS
          </h2>
          <p>Tratamos datos personales de las siguientes categorías de personas:</p>
          <ul>
            {Object.entries(step03.subjects)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <li key={key}>{DATA_SUBJECTS[key as keyof typeof DATA_SUBJECTS]?.name}</li>
              ))}
          </ul>
        </section>
      )}

      {/* 4. Finalidades */}
      {step04 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            4. FINALIDADES DEL TRATAMIENTO
          </h2>
          <p>Sus datos personales son tratados para las siguientes finalidades:</p>
          <ul>
            {Object.entries(step04.purposes)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <li key={key}>{PURPOSES[key as keyof typeof PURPOSES]?.name}</li>
              ))}
          </ul>
        </section>
      )}

      {/* 5. Bases Legales */}
      {step05 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            5. BASES LEGALES DEL TRATAMIENTO
          </h2>
          <p>El tratamiento de sus datos se fundamenta en las siguientes bases legales:</p>
          <ul>
            {Object.entries(step05.bases)
              .filter(([_, value]) => value)
              .map(([key]) => {
                const base = LEGAL_BASES[key as keyof typeof LEGAL_BASES];
                return (
                  <li key={key}>
                    <strong>{base?.name}</strong> ({base?.article}): {base?.description}
                  </li>
                );
              })}
          </ul>
        </section>
      )}

      {/* 6. Destinatarios */}
      {step06 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            6. DESTINATARIOS DE LOS DATOS
          </h2>
          {step06.sharesData && step06.recipients?.length > 0 ? (
            <>
              <p>Sus datos pueden ser comunicados a los siguientes destinatarios:</p>
              <ul>
                {step06.recipients.map((r: any) => (
                  <li key={r.id}>
                    <strong>{r.name}</strong> ({r.country}): {r.purpose}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No comunicamos sus datos personales a terceros.</p>
          )}
        </section>
      )}

      {/* 7. Transferencias Internacionales */}
      {step07 && step07.hasInternationalTransfers && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            7. TRANSFERENCIAS INTERNACIONALES
          </h2>
          <p>
            Realizamos transferencias de datos personales a los siguientes países:
          </p>
          <ul>
            {step07.transfers?.map((t: any) => (
              <li key={t.id}>
                <strong>{t.country}</strong>: {t.recipient} - {t.purpose}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 8. Plazos de Conservación */}
      {step08 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            8. PLAZOS DE CONSERVACIÓN
          </h2>
          <p>
            Los datos personales serán conservados durante el tiempo necesario para
            cumplir con las finalidades para las que fueron recopilados, con un período
            general de <strong>{getRetentionPeriodLabel(step08.defaultPeriod)}</strong>.
          </p>
          <p className="mt-4">
            <strong>Proceso de eliminación:</strong> {step08.deletionProcess}
          </p>
        </section>
      )}

      {/* 9. Derechos del Titular */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          9. DERECHOS DEL TITULAR
        </h2>
        <div className="whitespace-pre-line">{LEGAL_TEXTS.rightsSection}</div>
        
        {step12 && (
          <div className="bg-slate-50 p-4 rounded-lg mt-4">
            <p><strong>Para ejercer sus derechos, contacte a:</strong></p>
            <p>Canal: {step12.contactChannel}</p>
            <p>Responsable: {step12.responsiblePerson}</p>
            <p>Plazo de respuesta: {step12.responseTime} días hábiles</p>
          </div>
        )}
      </section>

      {/* 10. Seguridad */}
      {step11 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            10. MEDIDAS DE SEGURIDAD
          </h2>
          <p>
            Implementamos medidas técnicas, organizativas y físicas apropiadas para
            proteger sus datos personales contra acceso no autorizado, pérdida o
            alteración.
          </p>
        </section>
      )}

      {/* Disclaimer */}
      <section className="mt-8 pt-8 border-t">
        <div className="bg-slate-100 p-4 rounded-lg text-sm text-slate-600">
          <div className="whitespace-pre-line">{LEGAL_TEXTS.disclaimer}</div>
        </div>
        
        <p className="text-sm text-slate-500 mt-4">
          Última actualización:{" "}
          {format(new Date(policy.updatedAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </section>
    </div>
  );
}
