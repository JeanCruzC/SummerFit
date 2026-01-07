"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Zap, Smartphone, Utensils, TrendingUp, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui";
import { useState, useEffect } from "react";

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-[#ccff00] selection:text-black font-sans overflow-x-hidden">

      {/* Navbar Premium Sticky */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/10 py-4" : "bg-transparent py-6"}`}>
        <div className="container mx-auto flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ccff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.4)]">
              <Zap className="h-6 w-6 fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tighter">SummerFit</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-400">
            <Link href="#como-funciona" className="hover:text-white hover:text-[#ccff00] transition-colors">CÓMO FUNCIONA</Link>
            <Link href="#resultados" className="hover:text-white hover:text-[#ccff00] transition-colors">RESULTADOS</Link>
            <Link href="#faq" className="hover:text-white hover:text-[#ccff00] transition-colors">FAQ</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-white hover:text-[#ccff00] transition-colors">
              LOGIN
            </Link>
            <Link href="/register">
              <Button className="h-10 bg-[#ccff00] text-black hover:bg-[#bbe000] font-black rounded-full px-6 text-sm tracking-wide transform hover:scale-105 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                EMPEZAR
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section: Centered & Animated */}
      <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Animated Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ccff00]/10 rounded-full blur-[120px] animate-pulse" />

        <div className="container relative z-10 mx-auto px-6 text-center">

          <div className="animate-fade-in-up space-y-8 flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ccff00]/30 bg-[#ccff00]/5 px-5 py-2 backdrop-blur-sm animate-bounce-slow">
              <Star className="h-4 w-4 text-[#ccff00] fill-current" />
              <span className="text-xs font-bold text-[#ccff00] tracking-widest uppercase">La alternativa #1 a Fitia</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] max-w-5xl mx-auto">
              TU CUERPO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] via-[#eeff00] to-[#ccff00] bg-300% animate-gradient">
                DE VERANO
              </span> <br />
              TODO EL AÑO.
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              La única app diseñada para jóvenes que quieren resultados reales.
              <span className="text-white font-bold"> Sin dietas aburridas. Sin restricciones absurdas.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full justify-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="h-16 w-full sm:w-auto bg-[#ccff00] text-black hover:bg-[#bbe000] text-xl font-black rounded-full px-12 shadow-[0_0_40px_rgba(204,255,0,0.5)] hover:shadow-[0_0_60px_rgba(204,255,0,0.7)] transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95">
                  CREAR MI PLAN GRATIS
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 pt-6 opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex text-[#ccff00]">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-5 w-5 fill-current" />)}
              </div>
              <span className="text-sm font-bold text-gray-300">4.9/5 por +10,000 usuarios</span>
            </div>
          </div>

          {/* Floating App Mockup */}
          <div className="mt-16 relative mx-auto w-full max-w-[1000px] flex justify-center animate-fade-in-up delay-300">
            <div className="relative w-[300px] md:w-[400px] aspect-[9/18] transform rotate-[-5deg] hover:rotate-0 transition-transform duration-700 z-10">
              <Image
                src="/app-mockup.png"
                alt="App Interface"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
            {/* Secondary phone for depth */}
            <div className="absolute top-12 right-[10%] w-[280px] md:w-[350px] aspect-[9/18] transform rotate-[10deg] opacity-50 blur-[2px] z-0 hidden md:block">
              <Image
                src="/app-mockup.png"
                alt="App Interface Depth"
                fill
                className="object-contain drop-shadow-2xl grayscale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brands Ticker */}
      <section className="bg-white/5 border-y border-white/5 py-8 overflow-hidden">
        <div className="container mx-auto px-6">
          <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">Mencionado en</p>
          <div className="flex justify-center flex-wrap gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {["MEN'S HEALTH", "TEEN VOGUE", "VICE", "BUZZFEED", "IGN"].map(brand => (
              <span key={brand} className="text-xl font-black text-white">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid: Centered & Clean */}
      <section id="como-funciona" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              TECNOLOGÍA <span className="text-[#ccff00]">VS</span> VOLUNTAD
            </h2>
            <p className="text-xl text-gray-400">
              No necesitas "más fuerza de voluntad". Necesitas un sistema que funcione.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={Utensils}
              title="Comidas Que Te Gustan"
              desc="El algoritmo aprende qué te gusta comer y ajusta tus macros automáticamente. Cero sufrimiento."
              delay="0"
            />
            <FeatureCard
              icon={Smartphone}
              title="Escáner Ultra-Rápido"
              desc="Apunta, dispara y listo. Reconocimiento de alimentos con IA para que tardar menos de 10s."
              delay="100"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Tu Cuerpo en Datos"
              desc="Gráficos de nivel NASA para entender cómo tu cuerpo reacciona a cada caloría y entreno."
              delay="200"
            />
          </div>
        </div>
      </section>

      {/* Step by Step - Visual */}
      <section className="py-32 bg-zinc-900/50 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">ES RIDÍCULAMENTE <span className="text-[#ccff00]">FÁCIL</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-[#ccff00]/30 to-transparent" />

            <Step number="1" title="Crea tu Perfil" desc="Dinos tu edad, peso y objetivo. Calculamos tus números mágicos." />
            <Step number="2" title="Sigue el Plan" desc="Come rico. Registra rápido. Entrena inteligente." />
            <Step number="3" title="Evoluciona" desc="Mira cómo tu cuerpo cambia semana tras semana." />
          </div>
        </div>
      </section>

      {/* Image Showcase */}
      <section id="resultados" className="py-0 relative h-[600px] md:h-[800px]">
        <Image src="/hero-bg.png" alt="Lifestyle" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-end justify-center pb-32">
          <div className="text-center space-y-6 px-6">
            <div className="inline-block bg-[#ccff00] text-black font-black text-sm px-4 py-1 rounded-full uppercase tracking-wider">Resultados Reales</div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
              ÚNETE AL <br /> MOVIMIENTO
            </h2>
            <p className="text-xl text-gray-200 max-w-md mx-auto">
              No estás solo. Miles de jóvenes ya están consiguiendo su mejor versión.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-black tracking-tighter text-center mb-12">DUDAS COMUNES</h2>
        <div className="space-y-4">
          <FaqItem q="¿Funciona para perder grasa?" a="Absolutamente. Es nuestra especialidad. Creamos un déficit calórico cómodo que prioriza la pérdida de grasa manteniendo el músculo." />
          <FaqItem q="¿Es seguro para adolescentes?" a="Sí. No promovemos dietas extremas. Nos enfocamos en nutrientes de calidad y hábitos sostenibles para el crecimiento." />
          <FaqItem q="¿Tengo que pagar?" a="El registro es 100% gratuito. Tienes acceso a todas las funciones esenciales sin pagar un centavo." />
        </div>
      </section>

      {/* Footer CTA Big */}
      <section className="py-24 relative overflow-hidden bg-[#ccff00] text-black text-center">
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            EMPIEZA <br /> AHORA
          </h2>
          <Link href="/register">
            <Button className="h-20 bg-black text-white hover:bg-zinc-800 text-2xl font-black rounded-full px-16 shadow-2xl hover:scale-105 transition-all w-full md:w-auto">
              CREAR CUENTA GRATIS
            </Button>
          </Link>
          <p className="mt-6 font-bold opacity-60 text-sm tracking-widest uppercase">Sin letra chica. Cancela cuando quieras.</p>
        </div>
      </section>

      <footer className="bg-black py-12">
        <div className="container mx-auto px-6 text-center text-gray-600 text-sm">
          <p>© 2024 SummerFit. The Next Gen Fitness App.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: string }) {
  return (
    <div className="group p-8 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-[#ccff00] transition-all duration-300 hover:shadow-[0_0_30px_rgba(204,255,0,0.1)] text-center relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 bg-[#ccff00] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-800 text-white group-hover:bg-[#ccff00] group-hover:text-black transition-all duration-300 mb-8">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="mb-4 text-2xl font-black text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center relative z-10">
      <div className="h-16 w-16 bg-black border-2 border-[#ccff00] rounded-full flex items-center justify-center text-2xl font-black text-[#ccff00] mb-6 shadow-[0_0_20px_rgba(204,255,0,0.2)]">
        {number}
      </div>
      <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-gray-400 max-w-xs">{desc}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-6 text-left hover:bg-white/5 transition-colors"
      >
        <h3 className="text-lg font-bold text-white">{q}</h3>
        <ChevronDown className={`h-5 w-5 text-[#ccff00] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`px-6 text-gray-400 leading-relaxed transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        {a}
      </div>
    </div>
  );
}
