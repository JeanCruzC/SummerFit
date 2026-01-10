/**
 * ADAPTATION ENGINE
 * Ajusta rutinas automáticamente basado en progreso de peso y cambios de equipo
 */

import { ProfileAnalyzer } from './profile_analyzer';

export interface AdaptationTrigger {
    type: 'weight_change' | 'equipment_change' | 'plateau';
    severity: 'minor' | 'moderate' | 'major';
    recommendation: string;
    action: 'adjust_calories' | 'change_split' | 'add_cardio' | 'reduce_cardio' | 'increase_volume' | 'deload';
}

export class AdaptationEngine {
    
    /**
     * Analiza cambio de peso y recomienda ajustes
     */
    static analyzeWeightProgress(
        currentWeight: number,
        previousWeight: number,
        targetWeight: number,
        goal: string,
        weeksElapsed: number
    ): AdaptationTrigger[] {
        const triggers: AdaptationTrigger[] = [];
        const weightChange = currentWeight - previousWeight;
        const weeklyRate = weightChange / weeksElapsed;

        // Fat Loss: debería perder 0.5-1% peso corporal/semana
        if (goal === 'fat_loss') {
            const optimalLoss = -(currentWeight * 0.005 * weeksElapsed); // 0.5% por semana
            
            if (weightChange > 0) {
                // Ganando peso en fat loss
                triggers.push({
                    type: 'weight_change',
                    severity: 'major',
                    recommendation: 'No estás perdiendo peso. Aumenta déficit calórico o cardio.',
                    action: 'add_cardio'
                });
            } else if (weightChange < optimalLoss * 2) {
                // Perdiendo muy rápido
                triggers.push({
                    type: 'weight_change',
                    severity: 'moderate',
                    recommendation: 'Pérdida muy rápida. Reduce déficit para preservar músculo.',
                    action: 'adjust_calories'
                });
            }
        }

        // Hypertrophy: debería ganar 0.25-0.5% peso corporal/semana
        if (goal === 'hypertrophy') {
            const optimalGain = currentWeight * 0.00375 * weeksElapsed; // 0.375% por semana
            
            if (weightChange < 0) {
                triggers.push({
                    type: 'weight_change',
                    severity: 'major',
                    recommendation: 'Perdiendo peso en fase de volumen. Aumenta calorías.',
                    action: 'adjust_calories'
                });
            } else if (weightChange > optimalGain * 2) {
                triggers.push({
                    type: 'weight_change',
                    severity: 'moderate',
                    recommendation: 'Ganancia muy rápida. Reduce superávit para minimizar grasa.',
                    action: 'adjust_calories'
                });
            }
        }

        return triggers;
    }

    /**
     * Detecta cambios de equipo y recomienda ajustes
     */
    static analyzeEquipmentChange(
        oldEquipment: string[],
        newEquipment: string[]
    ): AdaptationTrigger | null {
        const added = newEquipment.filter(e => !oldEquipment.includes(e));
        const removed = oldEquipment.filter(e => !newEquipment.includes(e));

        if (removed.length > 0) {
            return {
                type: 'equipment_change',
                severity: 'major',
                recommendation: `Perdiste acceso a: ${removed.join(', ')}. Regenera rutina con equipo disponible.`,
                action: 'change_split'
            };
        }

        if (added.length > 0 && added.some(e => ['Barra', 'Mancuernas', 'Máquinas'].includes(e))) {
            return {
                type: 'equipment_change',
                severity: 'moderate',
                recommendation: `Nuevo equipo disponible: ${added.join(', ')}. Considera regenerar para ejercicios más efectivos.`,
                action: 'change_split'
            };
        }

        return null;
    }

    /**
     * Detecta estancamiento (plateau)
     */
    static detectPlateau(
        weightHistory: { date: string; weight: number }[],
        goal: string
    ): AdaptationTrigger | null {
        if (weightHistory.length < 4) return null;

        // Últimas 4 semanas
        const recent = weightHistory.slice(-4);
        const weights = recent.map(h => h.weight);
        const avgChange = (weights[weights.length - 1] - weights[0]) / 4;

        // Plateau: menos de 0.2kg cambio en 4 semanas
        if (Math.abs(avgChange) < 0.2) {
            return {
                type: 'plateau',
                severity: 'moderate',
                recommendation: 'Sin progreso en 4 semanas. Considera refeed, deload o ajuste de calorías.',
                action: goal === 'fat_loss' ? 'add_cardio' : 'increase_volume'
            };
        }

        return null;
    }

    /**
     * Genera plan de acción completo
     */
    static generateAdaptationPlan(
        profile: any,
        weightHistory: any[],
        equipment: string[]
    ): {
        triggers: AdaptationTrigger[];
        priority: 'none' | 'low' | 'medium' | 'high';
        summary: string;
    } {
        const triggers: AdaptationTrigger[] = [];

        // Analizar peso
        if (weightHistory.length >= 2) {
            const current = weightHistory[weightHistory.length - 1];
            const previous = weightHistory[0];
            const weeks = Math.max(1, (new Date(current.date).getTime() - new Date(previous.date).getTime()) / (7 * 24 * 60 * 60 * 1000));
            
            const weightTriggers = this.analyzeWeightProgress(
                current.weight,
                previous.weight,
                profile.target_weight_kg,
                profile.goal,
                weeks
            );
            triggers.push(...weightTriggers);
        }

        // Detectar plateau
        const plateauTrigger = this.detectPlateau(weightHistory, profile.goal);
        if (plateauTrigger) triggers.push(plateauTrigger);

        // Prioridad
        let priority: 'none' | 'low' | 'medium' | 'high' = 'none';
        if (triggers.some(t => t.severity === 'major')) priority = 'high';
        else if (triggers.some(t => t.severity === 'moderate')) priority = 'medium';
        else if (triggers.length > 0) priority = 'low';

        // Resumen
        let summary = 'Todo en orden. Continúa con tu plan actual.';
        if (priority === 'high') {
            summary = '⚠️ Acción requerida: Tu progreso necesita ajustes inmediatos.';
        } else if (priority === 'medium') {
            summary = '💡 Considera ajustar tu plan para optimizar resultados.';
        }

        return { triggers, priority, summary };
    }
}
