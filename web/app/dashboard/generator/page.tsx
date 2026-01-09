'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { RoutineGenerator, type GeneratedRoutine, type RoutineGoal, type RoutineLevel } from "@/lib/generation/routine_generator";
import type { UserEquipment } from "@/types";
import { useRouter } from "next/navigation";

export default function GeneratorPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [equipment, setEquipment] = useState<UserEquipment[]>([]);

    // Form State
    const [goal, setGoal] = useState<RoutineGoal>('hypertrophy');
    const [level, setLevel] = useState<RoutineLevel>('beginner');
    const [daysAvailable, setDaysAvailable] = useState<number>(4); // New Smart Input
    const [routine, setRoutine] = useState<GeneratedRoutine | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: eqData } = await supabase
                .from('user_equipment')
                .select('*')
                .eq('user_id', user.id);

            setEquipment(eqData || []);
            setLoading(false);
        }
        loadData();
    }, []);

    const handleGenerate = async () => {
        setGenerating(true);
        setError("");
        setRoutine(null);

        try {
            const generator = new RoutineGenerator();
            // Artificial delay for "processing" feel
            await new Promise(r => setTimeout(r, 1500));

            const result = await generator.generate({
                goal,
                level,
                daysAvailable,
                equipment
            });

            setRoutine(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error al generar rutina.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="text-4xl">🧠</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Smart Coach AI
                        </span>
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        El sistema diseñará la estructura (Split), volumen e intensidad perfectos para tus días disponibles.
                    </p>
                </header>

                {/* Configuration Panel */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Goal Selection */}
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Objetivo Principal</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {(['hypertrophy', 'strength', 'fat_loss', 'recomposition'] as const).map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setGoal(g)}
                                        className={`p-3 rounded-xl border text-sm font-semibold transition-all capitalize ${goal === g
                                                ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                                                : 'border-gray-200 text-gray-500 hover:border-purple-200'
                                            }`}
                                    >
                                        {g.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Level */}
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Nivel de Experiencia</label>
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value as RoutineLevel)}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none font-medium focus:ring-2 focus:ring-purple-500 text-zinc-900 dark:text-white"
                            >
                                <option value="beginner">Principiante (Prioridad Técnica)</option>
                                <option value="intermediate">Intermedio</option>
                                <option value="advanced">Avanzado (Prioridad Volumen)</option>
                            </select>
                        </div>

                        {/* Days Available (NEW) */}
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Días Disponibles por Semana</label>
                            <div className="flex gap-2">
                                {[3, 4, 5, 6].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDaysAvailable(d)}
                                        className={`flex-1 p-3 rounded-xl font-bold transition-all ${daysAvailable === d
                                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md transform scale-105'
                                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800'
                                            }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
                        <div className="text-sm text-zinc-500">
                            <span className="sr-only">Stats</span>
                            {equipment.length > 0 ? (
                                <span>✅ {equipment.length} equipos detectados</span>
                            ) : (
                                <span className="text-amber-500">⚠️ Sin equipo (usando Peso Corporal)</span>
                            )}
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={generating || loading}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {generating ? (
                                <>
                                    <span className="animate-spin">⚙️</span> Analizando Biomecánica...
                                </>
                            ) : (
                                <>
                                    ✨ Diseñar Plan Inteligente
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 mb-6 font-medium animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                {/* Results Section */}
                {routine && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
                        <div className="bg-zinc-900 dark:bg-black rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-4 uppercase tracking-widest">
                                    {routine.split.replace('_', ' ')} PROTOCOL
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{routine.name}</h2>
                                <p className="text-zinc-400 max-w-xl text-lg leading-relaxed">{routine.description}</p>

                                <div className="mt-6 flex gap-6 text-sm font-medium">
                                    <div className="flex flex-col">
                                        <span className="text-zinc-500 uppercase text-[10px] tracking-wider">Volumen Semanal</span>
                                        <span className="text-2xl font-bold text-white">{routine.weeklyVolume} <span className="text-lg text-zinc-500 font-normal">series/músculo</span></span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-zinc-500 uppercase text-[10px] tracking-wider">Frecuencia</span>
                                        <span className="text-2xl font-bold text-white">{(routine.days.length / 2).toFixed(1)}x <span className="text-lg text-zinc-500 font-normal">/semana</span></span>
                                    </div>
                                </div>
                            </div>
                            {/* Abstract decoration */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {routine.days.map((day, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden hover:border-purple-200 transition-colors shadow-lg shadow-gray-200/50 dark:shadow-none">
                                    <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="text-xs font-bold text-purple-600 uppercase tracking-widest">Día {idx + 1}</div>
                                        </div>
                                        <h3 className="text-xl font-black text-zinc-900 dark:text-white">{day.dayName}</h3>
                                        <div className="text-sm font-medium text-zinc-500">{day.focus}</div>
                                    </div>

                                    <div className="p-2 flex-1 overflow-y-auto">
                                        {day.exercises.map((exItem, i) => (
                                            <div key={i} className="p-3 mb-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                                <div className="flex gap-3">
                                                    <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 relative">
                                                        {exItem.exercise.exercise_media?.[0]?.url ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img
                                                                src={exItem.exercise.exercise_media[0].url}
                                                                className="w-full h-full object-cover"
                                                                alt={exItem.exercise.title}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">img</div>
                                                        )}
                                                        <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1 font-bold">
                                                            {i + 1}
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-zinc-900 dark:text-white text-sm truncate leading-tight">
                                                            {exItem.exercise.title}
                                                        </h4>

                                                        {/* Smart Prescription */}
                                                        <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                                                            <div className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                                <span>📊</span> {exItem.sets} x {exItem.reps}
                                                            </div>
                                                            <div className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                                <span>⏱️</span> {exItem.rest}
                                                            </div>
                                                            <div className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                                <span>🔥</span> {exItem.rir}
                                                            </div>
                                                            {exItem.tempo && (
                                                                <div className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                                    <span>🐢</span> {exItem.tempo}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Reasoning */}
                                                <div className="mt-2 ml-[76px] text-[10px] text-zinc-400 border-l-2 border-purple-200 pl-2">
                                                    {exItem.reason}
                                                    {exItem.note && <span className="block text-purple-500 font-medium mt-0.5">{exItem.note}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
