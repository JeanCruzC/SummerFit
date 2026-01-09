
/**
 * PROGRESSION SYSTEM ENGINE
 * Based on: Progressive Overload Principles (ACSM) & Krzysztofik et al. (2019)
 * 
 * Logic:
 * Decides when to increase weight, maintain, or deload based on user logs.
 * 
 * Rule 1: "2-for-2 Rule" (Adapted): If user completes all sets with RIR >= 2 -> Increase Load.
 * Rule 2: Technical Failure -> Maintain or reduce.
 * Rule 3: Stalling -> Suggest advanced techniques or deload.
 */

interface ProgressionDecision {
    action: 'increase' | 'maintain' | 'deload' | 'change_variant';
    amount_kg?: number;
    reason: string;
}

interface SetLog {
    reps_target: number;
    reps_done: number;
    weight: number;
    rir: number; // Reps In Reserve
}

export class ProgressionSystem {

    /**
     * Analyzes the last session for a specific exercise to determine the next move.
     */
    static analyzeProgress(lastSessionSets: SetLog[], isLowerBody: boolean = false): ProgressionDecision {

        // 1. Check for failure to meet rep target
        const failedSets = lastSessionSets.filter(s => s.reps_done < s.reps_target);
        if (failedSets.length > 0) {
            // If failed multiple sets, suggest maintaining or small deload
            if (failedSets.length >= 2) {
                return {
                    action: 'maintain',
                    reason: "Missed rep targets on multiple sets. Master current weight first."
                };
            }
        }

        // 2. Check RIR (Intensity)
        // If average RIR is >= 2, the weight is too light.
        const avgRir = lastSessionSets.reduce((sum, s) => sum + s.rir, 0) / lastSessionSets.length;
        const allSetsEasy = lastSessionSets.every(s => s.rir >= 2);

        if (allSetsEasy) {
            const increase = isLowerBody ? 5 : 2.5; // Bigger jumps for legs
            return {
                action: 'increase',
                amount_kg: increase,
                reason: `Perfect execution with RIR ${avgRir.toFixed(1)}. Ready for overload.`
            };
        }

        // 3. Perfect Zone (RIR 0-1)
        // Hard effort, but successful. Keep pushing or micro-load.
        if (avgRir < 2 && avgRir >= 0) {
            return {
                action: 'maintain',
                reason: "Good intensity (Near failure). Keep pushing this weight to solidify gains."
            };
        }

        // 4. Overshoot (RIR < 0 - Actual failure requiring help)
        // Danger zone.
        return {
            action: 'maintain',
            reason: "Reached failure. Be careful. Maintain weight until RIR improves."
        };
    }
}
