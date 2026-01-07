import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Activity, Zap, Shield, TrendingUp, Users, Smartphone, Heart } from "lucide-react";
import { Button } from "@/components/ui";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-[#ccff00] selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-[#ccff00]" />
            <span className="text-xl font-bold tracking-tighter">SummerFit</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/register">
              <Button className="bg-[#ccff00] text-black hover:bg-[#bbe000] font-bold rounded-full px-6">
                Regístrate
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Jóvenes entrenando"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="inline-flex items-center rounded-full border border-[#ccff00]/30 bg-[#ccff00]/10 px-4 py-1.5 backdrop-blur-sm">
              <Zap className="mr-2 h-4 w-4 text-[#ccff00]" />
              <span className="text-sm font-bold text-[#ccff00] uppercase tracking-wide">La App #1 para Jóvenes</span>
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tighter md:text-7xl lg:text-8xl">
              TU MEJOR VERSIÓN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-[#00ff9d]">
                EMPIEZA HOY
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl leading-relaxed">
              Olvídate de las rutinas aburridas. SummerFit es la plataforma diseñada para nuestra generación.
              Entrena inteligente, come rico y consigue el cuerpo que quieres sin sacrificios imposibles.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="h-14 w-full bg-[#ccff00] text-black hover:scale-105 transition-transform hover:bg-[#bbe000] text-lg font-black rounded-full px-8 sm:min-w-[200px]">
                  EMPEZAR GRATIS
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" className="h-14 w-full border-white/20 hover:bg-white/10 text-white text-lg font-bold rounded-full px-8 sm:min-w-[200px]">
                  YA TENGO CUENTA
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition / Features */}
      <section className="bg-black py-24 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#ccff00]/20 rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00ff9d]/10 rounded-full blur-[128px] translate-x-1/3 translate-y-1/3" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div className="order-2 lg:order-1 relative">
              <div className="relative mx-auto w-full max-w-[400px] aspect-[9/19]">
                <Image
                  src="/app-mockup.png"
                  alt="App Interface"
                  fill
                  className="object-contain drop-shadow-[0_0_50px_rgba(204,255,0,0.3)]"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tighter md:text-5xl">
                  MÁS QUE UNA APP, <br />
                  <span className="text-[#ccff00]">TU ENTRENADOR DE BOLSILLO</span>
                </h2>
                <p className="text-xl text-gray-400">
                  Hemos simplificado todo lo complejo del fitness. Sin hojas de cálculo, sin confusión. Solo resultados.
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <FeatureCard
                  icon={Smartphone}
                  title="Tracking Inteligente"
                  desc="Registra tus comidas y entrenos en segundos. La app calcula todo por ti."
                />
                <FeatureCard
                  icon={TrendingUp}
                  title="Progreso Real"
                  desc="Visualiza tus cambios con gráficos futuristas que te mantendrán motivado."
                />
                <FeatureCard
                  icon={Shield}
                  title="Privacidad Total"
                  desc="Tus datos son tuyos. Entorno seguro y protegido para que solo te preocupes de mejorar."
                />
                <FeatureCard
                  icon={Heart}
                  title="Salud Integral"
                  desc="Recomendaciones de suplementos y dietas adaptadas a tu estilo de vida."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Call to Action */}
      <section className="border-t border-white/10 bg-zinc-900 py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-8">
            <Users className="mx-auto h-16 w-16 text-[#ccff00]" />
            <h2 className="text-4xl font-black tracking-tighter md:text-5xl">
              ¿LISTO PARA EL CAMBIO?
            </h2>
            <p className="text-xl text-gray-400">
              Únete a miles de personas que ya están transformando su vida con SummerFit.
              Tu futuro empieza cuando tú decides.
            </p>
            <div className="pt-8">
              <Link href="/register">
                <Button className="h-16 bg-white text-black hover:bg-gray-200 text-xl font-black rounded-full px-12 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all">
                  CREAR CUENTA AHORA <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 border-t border-white/10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© 2024 SummerFit Premium. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-[#ccff00]">Términos</Link>
            <Link href="#" className="hover:text-[#ccff00]">Privacidad</Link>
            <Link href="#" className="hover:text-[#ccff00]">Soporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="group rounded-2xl bg-white/5 p-6 hover:bg-white/10 transition-colors border border-white/5 hover:border-[#ccff00]/50">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#ccff00]/10 text-[#ccff00] group-hover:bg-[#ccff00] group-hover:text-black transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-white group-hover:text-[#ccff00] transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
