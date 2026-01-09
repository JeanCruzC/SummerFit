
/**
 * VOLUME CALCULATOR ENGINE
 * Based on: Schoenfeld et al. (2017) - Dose-response relationship between weekly resistance training volume
 * 
 * Logic:
 * Determines effective weekly sets per muscle group.
 * - Beginners: 8-12 sets (Neural adaptation focus)
 * - Intermediates: 12-18 sets (Myofibrillar hypertrophy)
 * - Advanced: 15-22 sets (High volume tolerance needed)
 * 
 * Adjustments:
 * - Strength Goal: Reduces volume (-20%) to prioritize intensity.
 * - Caloric Deficit: Reduces volume (-15%) to prevent overtraining/cortisol spikes.
 */

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type Goal = 'hypertrophy' | 'strength' | 'recomposition' | 'fat_loss' | 'maintenance';
export type NutritionStatus = 'surplus' | 'maintenance' | 'deficit' | 'unknown';

interface VolumeResult {
    min_sets: number;
    optimal_sets: number;
    max_sets: number;
    reason: string;
}

export class VolumeCalculator {

    static calculate(level: ExperienceLevel, goal: Goal, nutrition: NutritionStatus = 'maintenance'): VolumeResult {
        // 1. Establish Baselines by Level (Schoenfeld 2017)
        let base: VolumeResult;

        switch (level) {
            case 'beginner':
                base = { min_sets: 8, optimal_sets: 10, max_sets: 12, reason: "Neural adaptation primary" };
                break;
            case 'intermediate':
                base = { min_sets: 12, optimal_sets: 15, max_sets: 18, reason: "Optimal hypertrophy range" };
                break;
            case 'advanced':
                base = { min_sets: 15, optimal_sets: 18, max_sets: 22, reason: "High volume tolerance required" };
                break;
        }

        // 2. Adjust for Goal
        if (goal === 'strength') {
            // Strength requires higher intensity, lower volume to manage CNS fatigue
            base.min_sets = Math.round(base.min_sets * 0.7);
            base.optimal_sets = Math.round(base.optimal_sets * 0.8);
            base.max_sets = Math.round(base.max_sets * 0.8);
            base.reason += ", Adjusted for Strength Intensity";
        } else if (goal === 'maintenance') {
            base.min_sets = 6;
            base.optimal_sets = 8;
            base.max_sets = 10;
            base.reason = "Maintenance Volume (MEV)";
        }

        // 3. Adjust for Nutrition (Deficit)
        if (nutrition === 'deficit' || goal === 'fat_loss') {
            // In deficit, recovery is compromised. Reduce volume to maintain intensity.
            base.optimal_sets = Math.round(base.optimal_sets * 0.85);
            base.max_sets = Math.round(base.max_sets * 0.85);
            base.reason += ", Reduced for Caloric Deficit Recovery";
        }

        return base;
    }
}
