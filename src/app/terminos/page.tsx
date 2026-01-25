import Link from "next/link";
import type { Metadata } from "next";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos de Servicio",
  description:
    "Términos y condiciones de uso de TratoDatos, la plataforma para generar políticas de datos personales conforme a la Ley 21.719 de Chile.",
  alternates: {
    canonical: "https://tratodatos.cl/terminos",
  },
  openGraph: {
    title: "Términos de Servicio - TratoDatos",
    description: "Términos y condiciones de uso de TratoDatos",
    url: "https://tratodatos.cl/terminos",
  },
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100">
        <div className="container mx-auto px-6 py-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-xl text-slate-900">TratoDatos</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <h1 className="text-4xl font-semibold text-slate-900 mb-8">
          Términos de Servicio
        </h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-500 text-sm mb-8">
            Última actualización: {new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar la plataforma TratoDatos (en adelante, "el Servicio"), 
            operada por TratoDatos SpA (en adelante, "nosotros", "nuestro" o "TratoDatos"), 
            usted acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo 
            con alguna parte de estos términos, no debe utilizar nuestro Servicio.
          </p>

          <h2>2. Descripción del Servicio</h2>
          <p>
            TratoDatos es una plataforma que permite a empresas y organizaciones generar 
            políticas de tratamiento de datos personales conforme a la legislación chilena, 
            específicamente la Ley N° 19.628, modificada por la Ley N° 21.719.
          </p>
          <p>
            El Servicio incluye:
          </p>
          <ul>
            <li>Un wizard guiado de 12 pasos para la creación de políticas</li>
            <li>Generación automática de documentos en formato PDF, Word y HTML</li>
            <li>Almacenamiento seguro de sus políticas</li>
            <li>Versionamiento de documentos (planes premium)</li>
          </ul>

          <h2>3. Cuenta de Usuario</h2>
          <p>
            Para utilizar el Servicio, debe crear una cuenta proporcionando información 
            veraz y actualizada. Usted es responsable de:
          </p>
          <ul>
            <li>Mantener la confidencialidad de su contraseña</li>
            <li>Todas las actividades que ocurran bajo su cuenta</li>
            <li>Notificarnos inmediatamente sobre cualquier uso no autorizado</li>
          </ul>

          <h2>4. Planes y Pagos</h2>
          <p>
            TratoDatos ofrece diferentes planes de suscripción:
          </p>
          <ul>
            <li><strong>Plan Gratuito:</strong> 1 política, PDF con marca de agua</li>
            <li><strong>Plan Profesional:</strong> 5 políticas, sin marca de agua, exportación a Word</li>
            <li><strong>Plan Empresa:</strong> Políticas ilimitadas, multi-usuario, API de acceso</li>
          </ul>
          <p>
            Los pagos se procesan de forma segura a través de nuestros proveedores de pago 
            autorizados. Las suscripciones se renuevan automáticamente salvo cancelación previa.
          </p>

          <h2>5. Uso Aceptable</h2>
          <p>
            Usted se compromete a no utilizar el Servicio para:
          </p>
          <ul>
            <li>Actividades ilegales o fraudulentas</li>
            <li>Vulnerar derechos de terceros</li>
            <li>Distribuir malware o contenido dañino</li>
            <li>Intentar acceder a sistemas sin autorización</li>
            <li>Revender o redistribuir el Servicio sin autorización</li>
          </ul>

          <h2>6. Propiedad Intelectual</h2>
          <p>
            El Servicio, incluyendo su diseño, código, textos legales base y funcionalidades, 
            es propiedad exclusiva de TratoDatos SpA y está protegido por las leyes de 
            propiedad intelectual.
          </p>
          <p>
            Los documentos generados por usted a través del Servicio son de su propiedad, 
            sujeto a los términos de su plan de suscripción.
          </p>

          <h2>7. Limitación de Responsabilidad</h2>
          <p className="font-semibold">
            IMPORTANTE: El Servicio es una herramienta de apoyo y NO constituye asesoría 
            legal. Los documentos generados deben ser revisados por profesionales legales 
            calificados antes de su implementación.
          </p>
          <p>
            TratoDatos no será responsable por:
          </p>
          <ul>
            <li>Daños directos, indirectos, incidentales o consecuentes derivados del uso del Servicio</li>
            <li>La exactitud o completitud de los documentos generados</li>
            <li>El cumplimiento normativo de su organización</li>
            <li>Interrupciones o errores en el Servicio</li>
          </ul>

          <h2>8. Privacidad y Protección de Datos</h2>
          <p>
            El tratamiento de sus datos personales se rige por nuestra{" "}
            <Link href="/privacidad" className="text-blue-600 hover:underline">
              Política de Privacidad
            </Link>
            , la cual forma parte integral de estos Términos.
          </p>

          <h2>9. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos Términos en cualquier momento. 
            Los cambios serán efectivos al publicarse en esta página. El uso continuado 
            del Servicio después de dichos cambios constituye su aceptación de los nuevos términos.
          </p>

          <h2>10. Terminación</h2>
          <p>
            Podemos suspender o terminar su acceso al Servicio por incumplimiento de estos 
            Términos, sin previo aviso. Usted puede cancelar su cuenta en cualquier momento 
            desde su panel de usuario.
          </p>

          <h2>11. Ley Aplicable y Jurisdicción</h2>
          <p>
            Estos Términos se rigen por las leyes de la República de Chile. Cualquier 
            controversia será sometida a la jurisdicción de los tribunales ordinarios 
            de la ciudad de Santiago.
          </p>

          <h2>12. Contacto</h2>
          <p>
            Para consultas sobre estos Términos, puede contactarnos en:
          </p>
          <ul>
            <li>Email: legal@tratodatos.cl</li>
            <li>Dirección: Santiago, Chile</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} TratoDatos. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
