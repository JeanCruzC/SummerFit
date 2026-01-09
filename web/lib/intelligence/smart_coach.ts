
/**
 * SMART COACH FACADE
 * The central orchestrator that connects all intelligence engines.
 */

import { VolumeCalculator, ExperienceLevel, Goal, NutritionStatus } from './volume_calculator';
import { IntensityManager, ExerciseType } from './intensity_manager';
import { FrequencyEngine, SplitType } from './frequency_engine';
import { ProgressionSystem } from './progression_system';

export class SmartCoach {

    // 1. DIAGNOSTIC & SETUP
    static generateProfile(
        level: ExperienceLevel,
        goal: Goal,
        daysAvailable: number,
        nutrition: NutritionStatus = 'maintenance'
    ) {
        // Calculate Volume
        const volume = VolumeCalculator.calculate(level, goal, nutrition);

        // Calculate Split
        const split = FrequencyEngine.recommendSplit(daysAvailable, level);

        return {
            user_profile: { level, goal, nutrition },
            recommendations: {
                weekly_sets: volume,
                split: split
            }
        };
    }

    // 2. EXERCISE DETAILS (The "Why")
    static getExerciseRole(goal: Goal, type: ExerciseType) {
        return IntensityManager.getParameters(goal, type);
    }

    // 3. ADAPTATION (The Weekly Review)
    static checkProgress(sets: any[], isLowerBody: boolean) {
        return ProgressionSystem.analyzeProgress(sets, isLowerBody);
    }
}
