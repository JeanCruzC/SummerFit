"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Zap, Smartphone, Utensils, TrendingUp, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui";
import { useState, useEffect } from "react";

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900 selection:bg-[#ccff00] selection:text-black font-sans antialiased">

      {/* 1. Navbar Premium Sticky (Apple Style) */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-zinc-100 py-3" : "bg-transparent py-5"}`}>
        <div className="container mx-auto flex items-center justify-between px-6 max-w-6xl">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-[#ccff00]">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">SummerFit</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <Link href="#como-funciona" className="hover:text-black transition-colors">Cómo funciona</Link>
            <Link href="#resultados" className="hover:text-black transition-colors">Resultados</Link>
            <Link href="#faq" className="hover:text-black transition-colors">FAQ</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-zinc-600 hover:text-black transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/register">
              <Button className="h-9 bg-black text-white hover:bg-zinc-800 font-semibold rounded-full px-5 text-sm transition-all shadow-lg hover:shadow-xl">
                Empezar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section: Compact & Clean */}
      <section className="relative pt-32 pb-16 overflow-hidden flex flex-col items-center">

        <div className="container relative z-10 mx-auto px-6 text-center max-w-4xl">

          <div className="animate-fade-in-up space-y-6 flex flex-col items-center">
            {/* Minimal Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-1.5 animate-fade-in">
              <Star className="h-3.5 w-3.5 text-black fill-current" />
              <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">La nueva forma de cuidarte</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] text-black">
              Tu cuerpo de verano, <br />
              <span className="text-[#88aa00]">todo el año.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-zinc-500 max-w-xl mx-auto leading-relaxed">
              La alternativa inteligente a las dietas estrictas.
              <span className="text-black font-medium"> Sin sufrimiento, solo ciencia.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full justify-center">
              <Link href="/register">
                <Button className="h-14 bg-[#ccff00] text-black hover:bg-[#bbe000] text-lg font-bold rounded-full px-10 transition-all transform hover:-translate-y-0.5 shadow-xl hover:shadow-[#ccff00]/50">
                  Crear mi plan gratis
                </Button>
              </Link>
            </div>
            <p className="text-xs text-zinc-400 font-medium">No requiere tarjeta de crédito</p>
          </div>

          {/* Floating App Mockup - Compact */}
          <div className="mt-12 relative mx-auto w-full max-w-[800px] flex justify-center animate-fade-in-up delay-[200ms]">
            <div className="relative w-[280px] md:w-[320px] aspect-[9/18] transition-transform duration-700 hover:scale-[1.02]">
              <Image
                src="/app-mockup.png"
                alt="App Interface"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Brands - Minimal Gray */}
      <section className="bg-zinc-50 border-y border-zinc-100 py-6">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center flex-wrap gap-x-12 gap-y-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {["MEN'S HEALTH", "TEEN VOGUE", "VICE", "BUZZFEED"].map(brand => (
              <span key={brand} className="text-lg font-bold text-black">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Feature Grid - Clean Cards */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
              Tecnología vs Voluntad.
            </h2>
            <p className="text-lg text-zinc-500">
              Deja de luchar contra tu cuerpo y empieza a trabajar con él.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Utensils}
              title="Comidas a tu medida"
              desc="El algoritmo aprende qué te gusta y ajusta tus macros automáticamente."
            />
            <FeatureCard
              icon={Smartphone}
              title="Escáner Inteligente"
              desc="Reconocimiento de alimentos con IA en menos de 10 segundos."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Datos Reales"
              desc="Gráficos precisos para entender cómo reacciona tu cuerpo."
            />
          </div>
        </div>
      </section>

      {/* 5. Step by Step - Minimal */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Es ridículamente <span className="text-[#88aa00]">fácil</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <Step number="1" title="Perfil" desc="Dinos tu objetivo. Calculamos tus números." />
            <Step number="2" title="Plan" desc="Sigue el plan diario sin estrés." />
            <Step number="3" title="Progreso" desc="Mira los resultados cada semana." />
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section id="faq" className="py-20 max-w-3xl mx-auto px-6">
        <h2 className="text-2xl font-bold tracking-tight text-center mb-10">Preguntas Frecuentes</h2>
        <div className="space-y-3">
          <FaqItem q="¿Funciona para perder grasa?" a="Absolutamente. Creamos un déficit calórico cómodo que prioriza la pérdida de grasa manteniendo el músculo." />
          <FaqItem q="¿Es seguro para adolescentes?" a="Sí. Nos enfocamos en nutrientes de calidad y hábitos sostenibles para el crecimiento." />
          <FaqItem q="¿Es gratis?" a="Sí, el plan básico es gratis para siempre." />
        </div>
      </section>

      {/* 7. Footer CTA Clean */}
      <section className="py-20 bg-zinc-900 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Tu transformación <br /> empieza hoy.
          </h2>
          <Link href="/register">
            <Button className="h-14 bg-[#ccff00] text-black hover:bg-[#bbe000] text-lg font-bold rounded-full px-12 shadow-lg hover:scale-105 transition-transform w-full sm:w-auto">
              Empezar Gratis
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-white py-8 border-t border-zinc-100">
        <div className="container mx-auto px-6 text-center text-zinc-400 text-sm">
          <p>© 2024 SummerFit. Diseñado para ganar.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="group p-8 rounded-3xl bg-zinc-50 border border-zinc-100 hover:border-[#ccff00] transition-colors duration-300">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-black group-hover:text-[#88aa00] transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-3 text-lg font-bold text-black">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-start p-6 bg-white rounded-2xl shadow-sm border border-zinc-100">
      <span className="text-4xl font-black text-zinc-100 mb-4">{number}</span>
      <h3 className="text-lg font-bold text-black mb-2">{title}</h3>
      <p className="text-zinc-500 text-sm">{desc}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-zinc-100 first:border-t">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-5 text-left hover:bg-zinc-50/50 transition-colors px-2"
      >
        <h3 className="text-base font-semibold text-zinc-800">{q}</h3>
        <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`px-2 text-zinc-500 text-sm leading-relaxed transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        {a}
      </div>
    </div>
  );
}
