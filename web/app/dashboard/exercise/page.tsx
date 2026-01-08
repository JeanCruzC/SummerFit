"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, Plus, Trash2, Flame } from "lucide-react";
import { Card, Button, Input, Select, Alert } from "@/components/ui";
import { getUserLocalDate } from "@/lib/date";
import { createClient } from "@/lib/supabase/client";
import { getProfile, getExerciseLogs, addExerciseLog, deleteExerciseLog } from "@/lib/supabase/database";
import { calculateCaloriesBurned } from "@/lib/calculations";
import { ExerciseLog, UserProfile } from "@/types";

import { Search, ChevronRight } from "lucide-react";
import { searchExercises } from "@/lib/supabase/exercises";
import { Exercise } from "@/types";

const QUICK_CATEGORIES = {
    Aerobico: [
        { value: "Caminar", label: "🚶 Caminar", color: "bg-blue-100 text-blue-600" },
        { value: "Correr", label: "🏃 Correr", color: "bg-orange-100 text-orange-600" },
        { value: "Ciclismo", label: "🚴 Ciclismo", color: "bg-green-100 text-green-600" },
        { value: "Natación", label: "🏊 Natación", color: "bg-cyan-100 text-cyan-600" },
    ],
    Entrenamiento: [
        { value: "Pesas", label: "🏋️ Pesas", color: "bg-stone-100 text-stone-600" },
        { value: "HIIT", label: "⚡ HIIT", color: "bg-yellow-100 text-yellow-600" },
        { value: "Yoga", label: "🧘 Yoga", color: "bg-purple-100 text-purple-600" },
        { value: "Cardio", label: "❤️ Cardio", color: "bg-red-100 text-red-600" },
    ]
};

export default function ExercisePage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string>("");
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [date, setDate] = useState(getUserLocalDate());
    const [exercises, setExercises] = useState<ExerciseLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Tabs
    const [activeTab, setActiveTab] = useState<"quick" | "db">("quick");

    // DB Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Exercise[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedDbExercise, setSelectedDbExercise] = useState<Exercise | null>(null);

    // Form state
    const [exerciseType, setExerciseType] = useState("Correr");
    const [duration, setDuration] = useState(30);
    const [intensity, setIntensity] = useState<"Baja" | "Media" | "Alta">("Media");

    // Search effect
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length > 2 && activeTab === "db") {
                setSearching(true);
                try {
                    const results = await searchExercises(searchQuery);
                    setSearchResults(results);
                } catch (e) {
                    console.error(e);
                } finally {
                    setSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, activeTab]);

    const handleQuickSelect = (type: string) => {
        setExerciseType(type);
        setSelectedDbExercise(null); // Clear DB selection
        setShowForm(true);
    };

    const handleDbSelect = (exercise: Exercise) => {
        setExerciseType(exercise.title);
        setSelectedDbExercise(exercise);
        setShowForm(true);
    };

    useEffect(() => {
        const load = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push("/login"); return; }
            setUserId(session.user.id);

            const [prof, logs] = await Promise.all([
                getProfile(session.user.id),
                getExerciseLogs(session.user.id, date),
            ]);
            setProfile(prof);
            setExercises(logs);
            setLoading(false);
        };
        load();
    }, [router, date]);

    const handleAdd = async () => {
        if (!profile) return;
        setAdding(true);

        setAdding(true);

        let caloriesBurned = 0;

        if (selectedDbExercise && selectedDbExercise.met) {
            // Precise DB calculation
            // Formula: MET * Weight * Hours
            caloriesBurned = Math.round(selectedDbExercise.met * profile.weight_kg * (duration / 60));
        } else {
            // Generic calculation
            caloriesBurned = calculateCaloriesBurned(profile.weight_kg, exerciseType, duration, intensity);
        }

        const success = await addExerciseLog({
            user_id: userId,
            log_date: date,
            exercise_type: exerciseType,
            duration_minutes: duration,
            intensity,
            calories_burned: caloriesBurned,
        });

        if (success) {
            const logs = await getExerciseLogs(userId, date);
            setExercises(logs);
            setShowForm(false);
        }
        setAdding(false);
    };

    const handleDelete = async (id: number) => {
        await deleteExerciseLog(id);
        setExercises(e => e.filter(ex => ex.id !== id));
    };

    const totalCalories = exercises.reduce((a, e) => a + (e.calories_burned || 0), 0);
    const totalMinutes = exercises.reduce((a, e) => a + (e.duration_minutes || 0), 0);

    // Preview calories
    // Preview calories
    const previewCalories = profile ? (
        selectedDbExercise && selectedDbExercise.met
            ? Math.round(selectedDbExercise.met * profile.weight_kg * (duration / 60))
            : calculateCaloriesBurned(profile.weight_kg, exerciseType, duration, intensity)
    ) : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Registro de Ejercicio</h1>
                    <p className="text-gray-500 mt-1">Registra tu actividad física diaria.</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab("quick")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex-1 ${activeTab === "quick" ? "bg-white dark:bg-gray-700 shadow text-purple-600" : "text-gray-500"}`}
                    >
                        Registro Rápido
                    </button>
                    <button
                        onClick={() => setActiveTab("db")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex-1 ${activeTab === "db" ? "bg-white dark:bg-gray-700 shadow text-purple-600" : "text-gray-500"}`}
                    >
                        Catálogo Completo
                    </button>
                </div>
            </div>


            {
                activeTab === "quick" ? (
                    <div className="grid gap-6">
                        {/* Aerobic Block */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Flame className="h-5 w-5 text-orange-500" /> Aeróbico
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {QUICK_CATEGORIES.Aerobico.map((item) => (
                                    <button
                                        key={item.value}
                                        onClick={() => handleQuickSelect(item.value)}
                                        className={`p-4 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all text-left group ${item.color.replace('text', 'bg').replace('100', '50')}`}
                                    >
                                        <div className={`h-10 w-10 rounded-xl mb-3 grid place-items-center ${item.color}`}>
                                            <span className="text-xl">{item.label.split(' ')[0]}</span>
                                        </div>
                                        <div className="font-semibold text-gray-900 dark:text-gray-100">{item.value}</div>
                                        <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Registrar &rarr;</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Strength Block */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Dumbbell className="h-5 w-5 text-purple-500" /> Entrenamiento
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {QUICK_CATEGORIES.Entrenamiento.map((item) => (
                                    <button
                                        key={item.value}
                                        onClick={() => handleQuickSelect(item.value)}
                                        className={`p-4 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all text-left group ${item.color.replace('text', 'bg').replace('100', '50')}`}
                                    >
                                        <div className={`h-10 w-10 rounded-xl mb-3 grid place-items-center ${item.color}`}>
                                            <span className="text-xl">{item.label.split(' ')[0]}</span>
                                        </div>
                                        <div className="font-semibold text-gray-900 dark:text-gray-100">{item.value}</div>
                                        <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Registrar &rarr;</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar entre 2,900 ejercicios (ej: Press de Banca)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                autoFocus
                            />
                        </div>

                        {searching && (
                            <div className="text-center py-8 text-gray-500">Buscando...</div>
                        )}

                        {!searching && searchQuery.length > 2 && searchResults.length === 0 && (
                            <div className="text-center py-8 text-gray-500">No se encontraron resultados.</div>
                        )}

                        <div className="grid gap-3">
                            {searchResults.map((ex) => (
                                <button
                                    key={ex.id}
                                    onClick={() => handleDbSelect(ex)}
                                    className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors text-left group"
                                >
                                    <div>
                                        <h4 className="font-semibold text-lg">{ex.title}</h4>
                                        <div className="text-sm text-gray-500 flex gap-2">
                                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">{ex.body_part}</span>
                                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">{ex.type}</span>
                                            {ex.met && <span className="text-purple-600 dark:text-purple-400 text-xs font-mono">MET: {ex.met}</span>}
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="text-center">
                    <Flame className="h-8 w-8 text-orange-500 mx-auto" />
                    <div className="text-3xl font-bold mt-2">{totalCalories}</div>
                    <div className="text-sm text-gray-500">Calorías quemadas</div>
                </Card>
                <Card className="text-center">
                    <Dumbbell className="h-8 w-8 text-purple-500 mx-auto" />
                    <div className="text-3xl font-bold mt-2">{totalMinutes}</div>
                    <div className="text-sm text-gray-500">Minutos de ejercicio</div>
                </Card>
            </div>

            {/* Exercise List */}
            <Card>
                <h2 className="text-lg font-semibold mb-4">Actividades del día</h2>

                {exercises.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No hay ejercicios registrados.</p>
                ) : (
                    <div className="space-y-3">
                        {exercises.map(ex => (
                            <div key={ex.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 grid place-items-center">
                                        <Dumbbell className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{ex.exercise_type}</div>
                                        <div className="text-sm text-gray-500">
                                            {ex.duration_minutes} min · {ex.intensity}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-lg font-semibold text-orange-500">{ex.calories_burned} kcal</div>
                                    </div>
                                    <button onClick={() => ex.id && handleDelete(ex.id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Add Form Modal */}
            {
                showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <Card className="max-w-md w-full">
                            <h3 className="text-xl font-semibold mb-4">
                                {selectedDbExercise ? `Registrar: ${selectedDbExercise.title}` : "Agregar Ejercicio"}
                            </h3>

                            <div className="space-y-4">
                                {!selectedDbExercise && (
                                    <Select
                                        label="Tipo de ejercicio"
                                        options={[...QUICK_CATEGORIES.Aerobico, ...QUICK_CATEGORIES.Entrenamiento]}
                                        value={exerciseType}
                                        onChange={e => setExerciseType(e.target.value)}
                                    />
                                )}

                                <Input
                                    label="Duración (minutos)"
                                    type="number"
                                    min={5}
                                    max={300}
                                    value={duration}
                                    onChange={e => setDuration(parseInt(e.target.value) || 30)}
                                />

                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Intensidad</label>
                                    <div className="flex gap-2">
                                        {(["Baja", "Media", "Alta"] as const).map(i => (
                                            <button
                                                key={i}
                                                onClick={() => setIntensity(i)}
                                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${intensity === i ? "bg-purple-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600"}`}
                                            >
                                                {i}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-center">
                                    <div className="text-sm text-orange-600 dark:text-orange-400">Calorías estimadas</div>
                                    <div className="text-3xl font-bold text-orange-600">{previewCalories} kcal</div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button variant="secondary" className="flex-1" onClick={() => setShowForm(false)}>
                                    Cancelar
                                </Button>
                                <Button className="flex-1" onClick={handleAdd} disabled={adding}>
                                    {adding ? "Agregando..." : "Agregar"}
                                </Button>
                            </div>
                        </Card>
                    </div>
                )
            }
        </div >
    );
}
