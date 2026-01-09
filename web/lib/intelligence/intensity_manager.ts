
/**
 * INTENSITY MANAGER ENGINE
 * Based on: Schoenfeld et al. (2021) - Loading Recommendations for Muscle Strength, Hypertrophy, and Local Endurance
 * 
 * Logic:
 * Dictates Rep Ranges, RIR (Reps in Reserve), and Rest Periods.
 * 
 * - Hypertrophy: Wide rep range (6-30) is effective if close to failure (RIR 0-3).
 * - Strength: Low reps (1-5), High loads (>85%), Long rest (3-5min).
 * - Fat Loss: Focus on Metabolic Stress (Short rest).
 */

import { Goal } from './volume_calculator';

export type ExerciseType = 'compound_heavy' | 'compound_medium' | 'isolation' | 'bodyweight';

interface IntensityParameters {
    reps: [number, number]; // [min, max]
    rir: [number, number];  // [min, max] Reps In Reserve
    rest: [number, number]; // [min, max] seconds
    tempo: string;          // e.g., "2-0-1-0"
    note: string;
}

export class IntensityManager {

    static getParameters(goal: Goal, type: ExerciseType): IntensityParameters {

        // 1. STRENGTH FOCUS
        if (goal === 'strength') {
            if (type === 'compound_heavy') {
                return {
                    reps: [3, 5],
                    rir: [1, 3], // Never total failure on heavy compounds to avoid injury
                    rest: [180, 300], // 3-5 min
                    tempo: "1-0-X-0", // Explosive concentric
                    note: "Max Force Output. Do not grind reps."
                };
            } else {
                return {
                    reps: [6, 10],
                    rir: [1, 2],
                    rest: [120, 180],
                    tempo: "2-0-1-0",
                    note: "Accessory work for hypertrophy base."
                };
            }
        }

        // 2. HYPERTROPHY FOCUS (Standard)
        if (goal === 'hypertrophy' || goal === 'recomposition') {
            if (type === 'compound_heavy' || type === 'compound_medium') {
                return {
                    reps: [6, 10],
                    rir: [1, 2],
                    rest: [90, 150], // 1.5 - 2.5 min
                    tempo: "2-0-1-0", // Controlled eccentric
                    note: "Mechanical Tension Focus."
                };
            } else { // Isolation
                return {
                    reps: [10, 15],
                    rir: [0, 1], // Safer to go near failure
                    rest: [60, 90],
                    tempo: "2-1-1-0", // Squeeze at peak
                    note: "Metabolic Stress & Pump."
                };
            }
        }

        // 3. FAT LOSS / METABOLIC
        if (goal === 'fat_loss') {
            return {
                reps: type.includes('compound') ? [8, 12] : [12, 20],
                rir: [0, 2],
                rest: [45, 75], // Short rest for EPOC
                tempo: "2-0-1-0",
                note: "High density training. Keep heart rate up."
            };
        }

        // Default Maintenance
        return {
            reps: [8, 12],
            rir: [2, 3],
            rest: [60, 120],
            tempo: "2-0-1-0",
            note: "Standard maintenance volume."
        };
    }
}
