/**
 * PROFILE ANALYZER
 * Analiza el perfil del usuario y pre-selecciona objetivo y cardio inteligentemente
 */

export type SmartGoal = 'hypertrophy' | 'strength' | 'fat_loss' | 'recomposition';
export type CardioType = 'low_impact' | 'moderate' | 'hiit' | 'optional';

export interface ProfileAnalysis {
    bmi: number;
    bmi_category: 'underweight' | 'normal' | 'overweight' | 'obese';
    recommended_goal: SmartGoal;
    recommended_cardio: {
        type: CardioType;
        frequency: number; // días por semana
        duration: number; // minutos
        options: string[];
        reasoning: string;
    };
    warnings: string[];
}

export class ProfileAnalyzer {

    static analyze(weight_kg: number, height_cm: number, target_weight_kg: number, equipment?: string[]): ProfileAnalysis {
        const bmi = weight_kg / Math.pow(height_cm / 100, 2);
        const bmi_category = this.getBMICategory(bmi);
        const recommended_goal = this.getRecommendedGoal(bmi, weight_kg, target_weight_kg);
        const recommended_cardio = this.getRecommendedCardio(bmi_category, recommended_goal, equipment);
        const warnings = this.getWarnings(bmi, weight_kg, target_weight_kg);

        return {
            bmi: Math.round(bmi * 10) / 10,
            bmi_category,
            recommended_goal,
            recommended_cardio,
            warnings
        };
    }

    private static getBMICategory(bmi: number): 'underweight' | 'normal' | 'overweight' | 'obese' {
        if (bmi < 18.5) return 'underweight';
        if (bmi < 25) return 'normal';
        if (bmi < 30) return 'overweight';
        return 'obese';
    }

    private static getRecommendedGoal(bmi: number, weight: number, target: number): SmartGoal {
        // Obesidad → Fat Loss prioritario
        if (bmi >= 30) return 'fat_loss';

        // Sobrepeso → Recomposition
        if (bmi >= 25) return 'recomposition';

        // Bajo peso → Hypertrophy
        if (bmi < 18.5) return 'hypertrophy';

        // Normal → Basado en objetivo
        if (target < weight) return 'fat_loss';
        if (target > weight) return 'hypertrophy';
        return 'strength';
    }

    private static getRecommendedCardio(category: string, goal: SmartGoal, equipment?: string[]) {
        const hasEquipment = (type: string) => equipment?.some(e => e.toLowerCase().includes(type.toLowerCase())) || false;
        const hasCinta = hasEquipment('cinta') || hasEquipment('treadmill');
        const hasPesoCorpOnly = !equipment || equipment.length === 0 || equipment.every(e => e.toLowerCase().includes('corporal') || e.toLowerCase().includes('bodyweight'));

        // Obesidad → Bajo impacto obligatorio
        if (category === 'obese') {
            const options = [];
            if (hasCinta) options.push('Caminata inclinada en cinta');
            options.push('Caminata al aire libre', 'Marcha en el lugar');

            return {
                type: 'low_impact' as CardioType,
                frequency: 5,
                duration: 40,
                options,
                reasoning: 'Bajo impacto para proteger articulaciones. Alta frecuencia para déficit calórico.'
            };
        }

        // Sobrepeso + Fat Loss → Moderado
        if (category === 'overweight' && goal === 'fat_loss') {
            const options = [];
            if (hasCinta) options.push('Intervalos en cinta', 'Trotar en cinta');
            options.push('Trotar al aire libre', 'Caminata rápida');

            return {
                type: 'moderate' as CardioType,
                frequency: 4,
                duration: 30,
                options,
                reasoning: 'Cardio moderado para maximizar pérdida de grasa sin sobrecargar.'
            };
        }

        // Fat Loss general → LISS + HIIT
        if (goal === 'fat_loss') {
            const options = [];
            if (hasCinta) options.push('HIIT en cinta 20min');
            options.push('Sprints al aire libre 30seg', 'Burpees', 'Mountain climbers');

            return {
                type: 'moderate' as CardioType,
                frequency: 3,
                duration: 25,
                options,
                reasoning: 'Combina LISS y HIIT para eficiencia metabólica.'
            };
        }

        // Hypertrophy/Strength → Opcional
        const options = hasCinta ? ['Caminata ligera en cinta'] : ['Caminata al aire libre'];
        return {
            type: 'optional' as CardioType,
            frequency: 2,
            duration: 20,
            options,
            reasoning: 'Cardio mínimo para salud cardiovascular sin interferir con ganancias.'
        };
    }

    private static getWarnings(bmi: number, weight: number, target: number): string[] {
        const warnings: string[] = [];

        if (bmi >= 35) {
            warnings.push('⚠️ IMC >35: Consulta médica recomendada antes de iniciar programa intenso.');
        }

        if (bmi >= 30 && target < weight - 20) {
            warnings.push('💡 Objetivo ambicioso. Divide en metas de 5-10kg para mejor adherencia.');
        }

        if (bmi < 18.5) {
            warnings.push('⚠️ Bajo peso: Prioriza superávit calórico y entrenamiento de fuerza.');
        }

        return warnings;
    }
}
