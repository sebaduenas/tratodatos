import Link from "next/link";
import type { Metadata } from "next";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad de TratoDatos. Conoce cómo tratamos tus datos personales conforme a la Ley 21.719 de Chile.",
  alternates: {
    canonical: "https://tratodatos.cl/privacidad",
  },
  openGraph: {
    title: "Política de Privacidad - TratoDatos",
    description: "Política de privacidad y tratamiento de datos personales de TratoDatos",
    url: "https://tratodatos.cl/privacidad",
  },
};

export default function PrivacidadPage() {
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
          Política de Privacidad
        </h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-500 text-sm mb-8">
            Última actualización: {new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          <h2>1. Identificación del Responsable</h2>
          <p>
            TratoDatos SpA (en adelante, "TratoDatos", "nosotros" o "nuestro") es el 
            responsable del tratamiento de sus datos personales. Puede contactarnos en:
          </p>
          <ul>
            <li>Email: privacidad@tratodatos.cl</li>
            <li>Sitio web: https://tratodatos.cl</li>
            <li>Dirección: Santiago, Chile</li>
          </ul>

          <h2>2. Datos que Recopilamos</h2>
          <h3>2.1 Datos de cuenta</h3>
          <ul>
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Nombre de empresa (opcional)</li>
            <li>Contraseña (almacenada de forma encriptada)</li>
          </ul>

          <h3>2.2 Datos de uso</h3>
          <ul>
            <li>Dirección IP</li>
            <li>Tipo de navegador y dispositivo</li>
            <li>Páginas visitadas y acciones realizadas</li>
            <li>Fecha y hora de acceso</li>
          </ul>

          <h3>2.3 Datos de las políticas</h3>
          <p>
            La información que usted ingresa al crear sus políticas de datos, incluyendo 
            datos de su empresa, categorías de datos que trata, finalidades, etc.
          </p>

          <h2>3. Finalidades del Tratamiento</h2>
          <p>
            Utilizamos sus datos para:
          </p>
          <ul>
            <li>Proporcionar y mantener el Servicio</li>
            <li>Crear y gestionar su cuenta de usuario</li>
            <li>Procesar pagos y facturación</li>
            <li>Enviar comunicaciones relacionadas con el Servicio</li>
            <li>Mejorar nuestro Servicio mediante análisis de uso</li>
            <li>Cumplir con obligaciones legales</li>
            <li>Enviar comunicaciones de marketing (solo con su consentimiento)</li>
          </ul>

          <h2>4. Base Legal del Tratamiento</h2>
          <p>
            El tratamiento de sus datos se fundamenta en:
          </p>
          <ul>
            <li><strong>Ejecución de contrato:</strong> Para prestar el Servicio contratado</li>
            <li><strong>Consentimiento:</strong> Para comunicaciones de marketing</li>
            <li><strong>Obligación legal:</strong> Para cumplir con la normativa tributaria y otras</li>
            <li><strong>Interés legítimo:</strong> Para mejorar el Servicio y prevenir fraudes</li>
          </ul>

          <h2>5. Destinatarios de los Datos</h2>
          <p>
            Podemos compartir sus datos con:
          </p>
          <ul>
            <li><strong>Proveedores de servicios:</strong> Hosting (Vercel), base de datos (Supabase), 
            email (Resend), pagos (MercadoPago/Flow)</li>
            <li><strong>Autoridades:</strong> Cuando sea requerido por ley</li>
          </ul>
          <p>
            Todos nuestros proveedores están obligados contractualmente a proteger sus datos 
            y utilizarlos únicamente para los fines especificados.
          </p>

          <h2>6. Transferencias Internacionales</h2>
          <p>
            Algunos de nuestros proveedores están ubicados fuera de Chile (principalmente 
            en Estados Unidos). En estos casos, nos aseguramos de que existan garantías 
            adecuadas para la protección de sus datos, como cláusulas contractuales tipo 
            o certificaciones de privacidad.
          </p>

          <h2>7. Plazos de Conservación</h2>
          <p>
            Conservamos sus datos durante:
          </p>
          <ul>
            <li><strong>Datos de cuenta:</strong> Mientras mantenga su cuenta activa, 
            más 5 años adicionales por obligaciones legales</li>
            <li><strong>Datos de uso:</strong> 2 años</li>
            <li><strong>Datos de políticas:</strong> Mientras mantenga su cuenta activa</li>
            <li><strong>Datos de facturación:</strong> 6 años (obligación tributaria)</li>
          </ul>

          <h2>8. Sus Derechos</h2>
          <p>
            De acuerdo con la Ley N° 19.628 y la Ley N° 21.719, usted tiene derecho a:
          </p>
          <ul>
            <li><strong>Acceso:</strong> Conocer qué datos tenemos sobre usted</li>
            <li><strong>Rectificación:</strong> Corregir datos inexactos</li>
            <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos</li>
            <li><strong>Oposición:</strong> Oponerse al tratamiento en ciertos casos</li>
            <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
            <li><strong>Limitación:</strong> Restringir el tratamiento temporalmente</li>
          </ul>
          <p>
            Para ejercer estos derechos, contáctenos en: privacidad@tratodatos.cl
          </p>
          <p>
            Responderemos su solicitud en un plazo máximo de 15 días hábiles.
          </p>

          <h2>9. Seguridad</h2>
          <p>
            Implementamos medidas técnicas y organizativas para proteger sus datos:
          </p>
          <ul>
            <li>Encriptación de datos en tránsito (TLS/SSL)</li>
            <li>Encriptación de contraseñas (bcrypt)</li>
            <li>Acceso restringido basado en roles</li>
            <li>Monitoreo de seguridad continuo</li>
            <li>Copias de seguridad regulares</li>
          </ul>

          <h2>10. Cookies</h2>
          <p>
            Utilizamos cookies esenciales para el funcionamiento del Servicio:
          </p>
          <ul>
            <li><strong>Sesión:</strong> Mantener su sesión iniciada</li>
            <li><strong>Preferencias:</strong> Recordar sus configuraciones</li>
            <li><strong>Seguridad:</strong> Proteger contra ataques</li>
          </ul>
          <p>
            No utilizamos cookies de publicidad de terceros.
          </p>

          <h2>11. Menores de Edad</h2>
          <p>
            El Servicio no está dirigido a menores de 18 años. No recopilamos 
            intencionalmente datos de menores. Si detectamos que hemos recopilado 
            datos de un menor, los eliminaremos inmediatamente.
          </p>

          <h2>12. Cambios a esta Política</h2>
          <p>
            Podemos actualizar esta Política ocasionalmente. Le notificaremos sobre 
            cambios significativos por email o mediante un aviso en el Servicio. 
            La fecha de última actualización aparece al inicio de este documento.
          </p>

          <h2>13. Contacto y Reclamos</h2>
          <p>
            Para consultas sobre privacidad o para ejercer sus derechos:
          </p>
          <ul>
            <li>Email: privacidad@tratodatos.cl</li>
          </ul>
          <p>
            Si considera que sus derechos no han sido respetados, puede presentar un 
            reclamo ante el Consejo para la Transparencia o los tribunales de justicia.
          </p>
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
