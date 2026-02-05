import Link from "next/link";
import type { Metadata } from "next";
import {
  Shield,
  CheckCircle,
  ArrowRight,
  FileText,
  Clock,
  Lock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing/header";

export const metadata: Metadata = {
  title: "TratoDatos - Genera tu Política de Datos en Minutos | Ley 21.719 Chile",
  description:
    "Crea tu política de tratamiento de datos personales conforme a la Ley 21.719 de Chile. Proceso guiado de 12 pasos, genera documentos PDF y Word profesionales en 30 minutos. Comienza gratis.",
  alternates: {
    canonical: "https://tratodatos.cl",
  },
  openGraph: {
    title: "TratoDatos - Genera tu Política de Datos en Minutos",
    description:
      "Cumple con la Ley 21.719 de Chile. Proceso guiado de 12 pasos para crear tu política de datos personales. Sin abogados, sin complicaciones.",
    url: "https://tratodatos.cl",
  },
};

// Modern Mondrian-inspired illustration with animations
function MondrianIllustration() {
  return (
    <div className="relative w-full h-full min-h-[420px] flex items-center justify-center">
      {/* Main grid container with dark lines */}
      <div className="relative w-[400px] h-[400px] grid grid-cols-6 grid-rows-6 gap-[3px] bg-slate-800 p-[3px] shadow-2xl">
        {/* Row 1 */}
        <div className="col-span-2 row-span-2 bg-blue-500 transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-xl cursor-pointer" />
        <div className="col-span-3 bg-white transition-all duration-300 hover:bg-slate-100" />
        <div className="row-span-2 bg-amber-400 transition-all duration-300 hover:scale-110 hover:z-10 hover:shadow-xl hover:rotate-1 cursor-pointer" />
        
        {/* Row 2 */}
        <div className="col-span-2 bg-slate-50 transition-all duration-300 hover:bg-blue-50" />
        <div className="bg-rose-500 transition-all duration-500 hover:scale-125 hover:z-20 hover:shadow-xl hover:-rotate-2 cursor-pointer" />
        
        {/* Row 3 */}
        <div className="bg-white transition-all duration-300 hover:bg-amber-50" />
        <div className="col-span-2 row-span-2 bg-blue-600 transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-xl hover:rotate-1 cursor-pointer" />
        <div className="col-span-2 bg-slate-50 transition-all duration-300 hover:bg-teal-50" />
        <div className="row-span-3 bg-blue-400 transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-xl cursor-pointer" />
        
        {/* Row 4 */}
        <div className="row-span-2 bg-amber-300 transition-all duration-500 hover:scale-110 hover:z-10 hover:shadow-xl hover:-rotate-1 cursor-pointer" />
        <div className="bg-white transition-all duration-300 hover:bg-rose-50" />
        <div className="bg-teal-400 transition-all duration-500 hover:scale-150 hover:z-20 hover:shadow-xl hover:rotate-3 cursor-pointer" />
        
        {/* Row 5 */}
        <div className="col-span-2 bg-slate-50 transition-all duration-300 hover:bg-slate-100" />
        <div className="col-span-2 bg-white transition-all duration-300 hover:bg-blue-50" />
        
        {/* Row 6 */}
        <div className="bg-rose-400 transition-all duration-500 hover:scale-125 hover:z-20 hover:shadow-xl hover:rotate-2 cursor-pointer" />
        <div className="col-span-3 bg-white transition-all duration-300 hover:bg-amber-50" />
        <div className="bg-blue-700 transition-all duration-500 hover:scale-125 hover:z-20 hover:shadow-xl hover:-rotate-2 cursor-pointer" />
        <div className="bg-slate-50 transition-all duration-300 hover:bg-teal-50" />
      </div>
      
      {/* Floating accent blocks with animations */}
      <div className="absolute top-4 left-0 w-8 h-20 bg-blue-500 shadow-lg transition-all duration-700 hover:translate-y-2 hover:shadow-2xl animate-pulse" />
      <div className="absolute bottom-8 right-8 w-24 h-6 bg-amber-400 shadow-lg transition-all duration-700 hover:-translate-x-2 hover:shadow-2xl" />
      <div className="absolute top-1/2 -left-4 w-6 h-6 bg-rose-500 shadow-lg transition-all duration-500 hover:scale-150 animate-bounce" style={{ animationDuration: '3s' }} />
    </div>
  );
}

const features = [
  {
    icon: Zap,
    title: "Proceso guiado de 12 pasos",
    description: "Proceso simple con preguntas claras. Sin jerga legal.",
  },
  {
    icon: FileText,
    title: "Múltiples formatos",
    description: "Descarga en PDF, Word o HTML. Listo para publicar.",
  },
  {
    icon: Lock,
    title: "Conforme a la ley",
    description: "100% alineado con la Ley 21.719 chilena.",
  },
  {
    icon: Clock,
    title: "Listo en 30 minutos",
    description: "Completa tu política rápidamente.",
  },
];

const plans = [
  {
    name: "Gratuito",
    price: "0",
    description: "Para empezar",
    features: ["1 política", "PDF con marca de agua", "Formato HTML"],
    cta: "Comenzar gratis",
    href: "/registro",
    popular: false,
  },
  {
    name: "Profesional",
    price: "9.990",
    description: "Para PYMEs",
    features: ["5 políticas", "PDF sin marca", "Exportar a Word", "Versionamiento"],
    cta: "Elegir plan",
    href: "/registro?plan=professional",
    popular: true,
  },
  {
    name: "Empresa",
    price: "29.990",
    description: "Para grandes empresas",
    features: ["Políticas ilimitadas", "Multi-usuario", "API de acceso", "Soporte dedicado"],
    cta: "Contactar ventas",
    href: "/registro?plan=enterprise",
    popular: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with mobile menu */}
      <LandingHeader />

      {/* Hero - Fintual style with geometric illustration */}
      <section className="pt-40 pb-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-semibold text-slate-900 leading-[1.1] tracking-tight">
                Una forma simple
                <br />
                de cumplir con la
                <br />
                <span className="text-blue-600">Ley 21.719</span>
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                Genera tu política de datos personales en minutos.
                <br />
                Sin abogados. Sin complicaciones.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/registro">
                  <Button 
                    size="lg" 
                    className="rounded-full px-10 h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                  >
                    Crear cuenta
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right side - Mondrian illustration */}
            <div className="hidden lg:block">
              <MondrianIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "1.2M", label: "Empresas deben cumplir" },
              { value: "Dic 2026", label: "Fecha límite ley" },
              { value: "$500K+", label: "Costo asesoría legal" },
              { value: "30 min", label: "Con TratoDatos" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-semibold text-slate-900">
                  {stat.value}
                </div>
                <div className="text-slate-500 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Clean grid */}
      <section id="caracteristicas" className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-slate-900">
              Todo lo que necesitas
            </h2>
            <p className="text-xl text-slate-500 mt-4 max-w-2xl mx-auto">
              Diseñado para empresas chilenas que necesitan cumplir con la nueva ley.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.title} 
                className="p-8 rounded-3xl bg-slate-50 hover:bg-blue-50 transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - Simple steps */}
      <section id="como-funciona" className="py-24 px-6 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-slate-900">
              Cómo funciona
            </h2>
            <p className="text-xl text-slate-500 mt-4">
              Tres pasos simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              { num: "1", title: "Crea tu cuenta", desc: "Registro gratuito en 30 segundos" },
              { num: "2", title: "Completa el proceso", desc: "Responde preguntas simples sobre tu empresa" },
              { num: "3", title: "Descarga tu política", desc: "Obtén tu documento en PDF listo para usar" },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white text-3xl font-semibold flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                  {step.num}
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Clean cards */}
      <section id="precios" className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-slate-900">
              Planes simples
            </h2>
            <p className="text-xl text-slate-500 mt-4">
              Comienza gratis. Escala cuando necesites.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`p-8 rounded-3xl ${
                  plan.popular 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-600 ring-offset-4' 
                    : 'bg-white border-2 border-slate-100'
                }`}
              >
                {plan.popular && (
                  <div className="text-blue-200 text-sm font-medium mb-4">
                    Más popular
                  </div>
                )}
                <h3 className={`text-2xl font-semibold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <div className="mt-4 mb-6">
                  <span className={`text-5xl font-semibold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    ${plan.price}
                  </span>
                  <span className={plan.popular ? 'text-blue-200' : 'text-slate-500'}>/mes</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 ${plan.popular ? 'text-blue-200' : 'text-blue-600'}`} />
                      <span className={plan.popular ? 'text-blue-100' : 'text-slate-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button 
                    className={`w-full rounded-full h-12 ${
                      plan.popular 
                        ? 'bg-white text-blue-600 hover:bg-blue-50' 
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Simple and clean */}
      <section className="py-24 px-6 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
            ¿Listo para cumplir con la ley?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            No esperes hasta el último momento. Crea tu política hoy y protege tu empresa.
          </p>
          <Link href="/registro">
            <Button 
              size="lg" 
              className="rounded-full px-12 h-14 text-lg bg-white text-blue-600 hover:bg-blue-50"
            >
              Crear mi política
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - Minimal like Fintual */}
      <footer className="py-16 px-6 border-t border-slate-100">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-5 gap-12">
            {/* Logo and description */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-lg text-slate-900">TratoDatos</span>
              </Link>
              <p className="text-slate-500 leading-relaxed">
                Simplificamos el cumplimiento de la Ley 21.719 para empresas chilenas.
              </p>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Producto</h4>
              <ul className="space-y-3">
                <li><Link href="#caracteristicas" className="text-slate-500 hover:text-slate-900">Características</Link></li>
                <li><Link href="#precios" className="text-slate-500 hover:text-slate-900">Precios</Link></li>
                <li><Link href="#como-funciona" className="text-slate-500 hover:text-slate-900">Cómo funciona</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/terminos" className="text-slate-500 hover:text-slate-900">Términos</Link></li>
                <li><Link href="/privacidad" className="text-slate-500 hover:text-slate-900">Privacidad</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Contacto</h4>
              <ul className="space-y-3">
                <li className="text-slate-500">contacto@tratodatos.cl</li>
                <li className="text-slate-500">Santiago, Chile</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-100 mt-16 pt-8 text-center text-slate-400">
            © {new Date().getFullYear()} TratoDatos. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
