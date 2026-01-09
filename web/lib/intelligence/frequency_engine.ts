
/**
 * FREQUENCY ENGINE
 * Based on: Ralston et al. (2018) - Weekly Training Frequency Effects on Strength Gain
 * 
 * Logic:
 * Determines the optimal Training Split based on available days.
 * - 3 Days: Full Body (Frequency x3). Best for beginners/recomp.
 * - 4 Days: Upper/Lower (Frequency x2). Best for strength/hypertrophy balance.
 * - 5 Days: ULPPL (Hybrid) or Bro Split (High volume per session).
 * - 6 Days: PPL (Push/Pull/Legs) or Arnold (Antagonist).
 */

export type SplitType = 'full_body' | 'upper_lower' | 'ppl' | 'arnold' | 'bro_split' | 'ulppl';

interface SplitRecommendation {
    split: SplitType;
    frequency_per_muscle: number;
    description: string;
    example_schedule: string[];
    warnings: string[];
}

export class FrequencyEngine {

    static recommendSplit(daysAvailable: number, experience: 'beginner' | 'intermediate' | 'advanced'): SplitRecommendation {

        // Safety / Reality Check
        if (daysAvailable < 3) throw new Error("Minimum 3 days required for effective hypertrophy training.");
        if (daysAvailable > 6) console.warn("7 days not recommended. Recovery is crucial.");

        // 3 DAYS -> FULL BODY
        if (daysAvailable === 3) {
            return {
                split: 'full_body',
                frequency_per_muscle: 3,
                description: "High Frequency, Moderate Volume per session.",
                example_schedule: ["Full Body", "Rest", "Full Body", "Rest", "Full Body", "Rest", "Rest"],
                warnings: ["Do not pair Heavy Squat + Heavy Deadlift on the same day if possible."]
            };
        }

        // 4 DAYS -> UPPER / LOWER
        if (daysAvailable === 4) {
            return {
                split: 'upper_lower',
                frequency_per_muscle: 2,
                description: "Balanced frequency (x2). Allows good recovery.",
                example_schedule: ["Upper", "Lower", "Rest", "Upper", "Lower", "Rest", "Rest"],
                warnings: []
            };
        }

        // 5 DAYS
        if (daysAvailable === 5) {
            if (experience === 'advanced') {
                return {
                    split: 'bro_split',
                    frequency_per_muscle: 1,
                    description: "Maximum volume per session. Focus on metabolic stress.",
                    example_schedule: ["Chest", "Back", "Legs", "Shoulders", "Arms", "Rest", "Rest"],
                    warnings: ["Ensure intensity is very high to justify x1 frequency."]
                };
            } else {
                return {
                    split: 'ulppl', // Upper Lower Push Pull Legs (Hybrid)
                    frequency_per_muscle: 2, // Average
                    description: "Hybrid approach. Upper/Lower for strength, PPL for hypertrophy.",
                    example_schedule: ["Upper", "Lower", "Rest", "Push", "Pull", "Legs", "Rest"],
                    warnings: ["Volume management is key on the 3-day block."]
                };
            }
        }

        // 6 DAYS
        if (daysAvailable >= 6) {
            if (experience === 'advanced') {
                // Arnold Split allows prioritizing weak points (e.g. Arms/Shoulders)
                return {
                    split: 'arnold',
                    frequency_per_muscle: 1.5, // 2x for major, 1x for minor overlap
                    description: "Antagonist selection. Chest/Back, Shoulders/Arms, Legs.",
                    example_schedule: ["Chest/Back", "Shoulders/Arms", "Legs", "Chest/Back", "Shoulders/Arms", "Legs", "Rest"],
                    warnings: ["High systemic fatigue. Deload every 4-6 weeks required."]
                };
            } else {
                // Classic PPL
                return {
                    split: 'ppl',
                    frequency_per_muscle: 2,
                    description: "Standard Push/Pull/Legs. Logical biomechanical grouping.",
                    example_schedule: ["Push", "Pull", "Legs", "Push", "Pull", "Legs", "Rest"],
                    warnings: []
                };
            }
        }

        // Fallback
        return {
            split: 'full_body',
            frequency_per_muscle: 3,
            description: "Fallback configuration.",
            example_schedule: [],
            warnings: []
        };
    }
}
