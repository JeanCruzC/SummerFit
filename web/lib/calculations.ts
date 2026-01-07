import { UserProfile, BMICategory, HealthMetrics, MacroGrams, GoalProjection, DietType } from '@/types';
import { getMacroDistribution } from './diets';

// Activity level multipliers for TDEE calculation
const ACTIVITY_MULTIPLIERS: Record<string, number> = {
    'Sedentario': 1.2,
    'Ligero': 1.375,
    'Moderado': 1.55,
    'Activo': 1.725,
    'Muy activo': 1.9,
};

// Calories per gram of macronutrient
const CALORIES_PER_GRAM = {
    protein: 4,
    carbs: 4,
    fat: 9,
};

/**
 * Calculate BMI (Body Mass Index)
 * Formula: weight(kg) / height(m)²
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return Math.round(bmi * 10) / 10;
}

/**
 * Get BMI category based on value
 */
export function getBMICategory(bmi: number): BMICategory {
    if (bmi < 18.5) return 'Bajo peso';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidad';
}

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor equation
 * Men: BMR = 10×weight + 6.25×height - 5×age + 5
 * Women: BMR = 10×weight + 6.25×height - 5×age - 161
 */
export function calculateBMR(
    weightKg: number,
    heightCm: number,
    age: number,
    gender: 'M' | 'F'
): number {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    const bmr = gender === 'M' ? base + 5 : base - 161;
    return Math.round(bmr);
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * Formula: BMR × Activity Multiplier
 */
export function calculateTDEE(bmr: number, activityLevel: string): number {
    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
    return Math.round(bmr * multiplier);
}

/**
 * Calculate target calories based on goal
 */
export function calculateTargetCalories(
    tdee: number,
    goal: 'Definir' | 'Mantener' | 'Volumen',
    mode: 'conservador' | 'moderado' | 'acelerado' = 'moderado'
): number {
    const deficits = {
        conservador: 250,
        moderado: 450,
        acelerado: 700,
    };

    const surplus = {
        conservador: 200,
        moderado: 350,
        acelerado: 500,
    };

    switch (goal) {
        case 'Definir':
            return Math.round(tdee - deficits[mode]);
        case 'Volumen':
            return Math.round(tdee + surplus[mode]);
        default:
            return tdee;
    }
}

/**
 * Calculate macros in grams based on calories and diet type
 */
export function calculateMacros(
    targetCalories: number,
    dietType: DietType
): MacroGrams {
    const distribution = getMacroDistribution(dietType);

    const proteinCals = targetCalories * (distribution.protein_pct / 100);
    const carbsCals = targetCalories * (distribution.carbs_pct / 100);
    const fatCals = targetCalories * (distribution.fat_pct / 100);

    return {
        protein_g: Math.round(proteinCals / CALORIES_PER_GRAM.protein),
        carbs_g: Math.round(carbsCals / CALORIES_PER_GRAM.carbs),
        fat_g: Math.round(fatCals / CALORIES_PER_GRAM.fat),
        calories: targetCalories,
    };
}

/**
 * Calculate goal projection (time to reach target weight)
 */
export function calculateProjection(
    currentWeight: number,
    targetWeight: number,
    tdee: number,
    goal: 'Definir' | 'Mantener' | 'Volumen',
    mode: 'conservador' | 'moderado' | 'acelerado' = 'moderado'
): GoalProjection {
    const targetCalories = calculateTargetCalories(tdee, goal, mode);
    const dailyDeficit = tdee - targetCalories;

    // 7700 kcal ≈ 1 kg of body fat
    const weeklyDeficit = dailyDeficit * 7;
    const weeklyRate = Math.abs(weeklyDeficit / 7700);

    const weightDiff = Math.abs(currentWeight - targetWeight);
    const weeks = weeklyRate > 0 ? Math.ceil(weightDiff / weeklyRate) : 0;
    const months = Math.round(weeks / 4.33 * 10) / 10;

    // Calculate target date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + weeks * 7);

    // Determine risk level
    let risk_level: 'safe' | 'moderate' | 'high' = 'safe';
    let risk_msg = 'Ritmo saludable y sostenible';
    let color = '#22c55e'; // green
    const warnings: string[] = [];

    if (weeklyRate > 1) {
        risk_level = 'high';
        risk_msg = 'Ritmo agresivo - Riesgo para la salud';
        color = '#ef4444'; // red
        warnings.push('⚠️ Un ritmo mayor a 1 kg/semana puede causar pérdida muscular y problemas metabólicos.');
    } else if (weeklyRate > 0.75) {
        risk_level = 'moderate';
        risk_msg = 'Ritmo acelerado - Monitorear de cerca';
        color = '#f59e0b'; // amber
        warnings.push('Este ritmo es exigente. Asegúrate de mantener una buena nutrición.');
    }

    if (targetCalories < 1200 && goal === 'Definir') {
        risk_level = 'high';
        warnings.push('⚠️ Las calorías son muy bajas. Mínimo recomendado: 1200 kcal para mujeres, 1500 kcal para hombres.');
    }

    if (Math.abs(dailyDeficit) > 1000) {
        risk_level = 'high';
        warnings.push('⚠️ Déficit calórico extremo. Esto puede afectar tu metabolismo y energía.');
    }

    return {
        daily_calories: targetCalories,
        weekly_rate: Math.round(weeklyRate * 100) / 100,
        weeks,
        months,
        target_date: targetDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        risk_level,
        risk_msg,
        color,
        warnings,
    };
}

/**
 * Calculate all health metrics for a user profile
 */
export function calculateHealthMetrics(
    profile: UserProfile,
    mode: 'conservador' | 'moderado' | 'acelerado' = 'moderado'
): HealthMetrics {
    const bmi = calculateBMI(profile.weight_kg, profile.height_cm);
    const bmi_category = getBMICategory(bmi);
    const bmr = calculateBMR(profile.weight_kg, profile.height_cm, profile.age, profile.gender);
    const tdee = calculateTDEE(bmr, profile.activity_level);
    const projection = calculateProjection(
        profile.weight_kg,
        profile.target_weight_kg,
        tdee,
        profile.goal,
        mode
    );

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + projection.weeks * 7);

    return {
        bmi,
        bmi_category,
        bmr,
        tdee,
        target_calories: projection.daily_calories,
        deficit_or_surplus: tdee - projection.daily_calories,
        weekly_rate: projection.weekly_rate,
        weeks_to_goal: projection.weeks,
        target_date: targetDate,
        warnings: projection.warnings,
    };
}

/**
 * Calculate calories burned from exercise
 * Based on MET (Metabolic Equivalent of Task) values
 */
export function calculateCaloriesBurned(
    weightKg: number,
    exerciseType: string,
    durationMinutes: number,
    intensity: 'Baja' | 'Media' | 'Alta'
): number {
    // MET values for common exercises
    const MET_VALUES: Record<string, Record<string, number>> = {
        'Caminar': { 'Baja': 2.5, 'Media': 3.5, 'Alta': 4.5 },
        'Correr': { 'Baja': 6, 'Media': 8, 'Alta': 11 },
        'Ciclismo': { 'Baja': 4, 'Media': 6, 'Alta': 10 },
        'Natación': { 'Baja': 5, 'Media': 7, 'Alta': 10 },
        'Pesas': { 'Baja': 3, 'Media': 5, 'Alta': 6 },
        'HIIT': { 'Baja': 6, 'Media': 8, 'Alta': 12 },
        'Yoga': { 'Baja': 2, 'Media': 3, 'Alta': 4 },
        'Cardio': { 'Baja': 5, 'Media': 7, 'Alta': 9 },
    };

    const exerciseMETs = MET_VALUES[exerciseType] || MET_VALUES['Cardio'];
    const met = exerciseMETs[intensity] || 5;

    // Calories = MET × weight(kg) × duration(hours)
    const hours = durationMinutes / 60;
    const calories = met * weightKg * hours;

    return Math.round(calories);
}

/**
 * Calculate ideal weight range based on height (using BMI 18.5-24.9)
 */
export function calculateIdealWeightRange(heightCm: number): { min: number; max: number } {
    const heightM = heightCm / 100;
    const heightSquared = heightM * heightM;

    return {
        min: Math.round(18.5 * heightSquared * 10) / 10,
        max: Math.round(24.9 * heightSquared * 10) / 10,
    };
}

/**
 * Calculate water intake recommendation (in liters)
 * Basic formula: 30-35ml per kg of body weight
 */
export function calculateWaterIntake(weightKg: number, activityLevel: string): number {
    const baseIntake = weightKg * 0.033; // 33ml per kg
    const activityBonus = ACTIVITY_MULTIPLIERS[activityLevel] > 1.5 ? 0.5 : 0;
    return Math.round((baseIntake + activityBonus) * 10) / 10;
}
