import { DietType, MacroDistribution } from '@/types';

// Diet macro distributions (percentages)
export const DIET_MACROS: Record<DietType, MacroDistribution> = {
    'Estándar': { protein_pct: 25, carbs_pct: 50, fat_pct: 25 },
    'Keto': { protein_pct: 25, carbs_pct: 5, fat_pct: 70 },
    'Low-Carb': { protein_pct: 30, carbs_pct: 25, fat_pct: 45 },
    'Vegana': { protein_pct: 20, carbs_pct: 55, fat_pct: 25 },
    'Vegetariana': { protein_pct: 20, carbs_pct: 55, fat_pct: 25 },
    'Paleo': { protein_pct: 30, carbs_pct: 35, fat_pct: 35 },
    'Mediterránea': { protein_pct: 20, carbs_pct: 50, fat_pct: 30 },
    'Alta Proteína': { protein_pct: 40, carbs_pct: 35, fat_pct: 25 },
};

// Diet descriptions
export const DIET_INFO: Record<DietType, { description: string; benefits: string[]; restrictions: string[] }> = {
    'Estándar': {
        description: 'Dieta balanceada con distribución equilibrada de macronutrientes.',
        benefits: ['Fácil de seguir', 'Variedad de alimentos', 'Sostenible a largo plazo'],
        restrictions: [],
    },
    'Keto': {
        description: 'Dieta muy baja en carbohidratos que induce cetosis para quemar grasa.',
        benefits: ['Pérdida de peso rápida', 'Control del apetito', 'Estabilidad energética'],
        restrictions: ['Pan, pasta, arroz', 'Frutas altas en azúcar', 'Azúcares y dulces'],
    },
    'Low-Carb': {
        description: 'Reducción moderada de carbohidratos sin llegar a cetosis.',
        benefits: ['Pérdida de peso', 'Control de glucosa', 'Más flexible que Keto'],
        restrictions: ['Azúcares refinados', 'Granos en exceso'],
    },
    'Vegana': {
        description: 'Alimentación 100% basada en plantas, sin productos animales.',
        benefits: ['Alto en fibra', 'Rica en antioxidantes', 'Sostenible ambientalmente'],
        restrictions: ['Carne, pescado', 'Lácteos, huevos', 'Miel'],
    },
    'Vegetariana': {
        description: 'Sin carne ni pescado, pero permite lácteos y huevos.',
        benefits: ['Rica en fibra', 'Más flexible que vegana', 'Variedad de proteínas'],
        restrictions: ['Carne', 'Pescado', 'Mariscos'],
    },
    'Paleo': {
        description: 'Basada en alimentos que consumían nuestros ancestros cazadores-recolectores.',
        benefits: ['Alimentos naturales', 'Alta en proteína', 'Sin procesados'],
        restrictions: ['Granos', 'Lácteos', 'Legumbres', 'Azúcares refinados'],
    },
    'Mediterránea': {
        description: 'Inspirada en la alimentación tradicional de países mediterráneos.',
        benefits: ['Salud cardiovascular', 'Grasas saludables', 'Variedad y sabor'],
        restrictions: ['Carnes rojas en exceso', 'Procesados'],
    },
    'Alta Proteína': {
        description: 'Enfocada en maximizar la ingesta de proteína para desarrollo muscular.',
        benefits: ['Ganancia muscular', 'Saciedad', 'Recuperación deportiva'],
        restrictions: [],
    },
};

// Foods to avoid per diet
export const DIET_AVOID_CATEGORIES: Partial<Record<DietType, string[]>> = {
    'Keto': ['Baked Foods', 'Sweets', 'Fruits', 'Grains and Pasta'],
    'Vegana': ['Beef Products', 'Poultry Products', 'Pork Products', 'Lamb, Veal, and Game Products', 'Finfish and Shellfish Products', 'Dairy and Egg Products', 'Sausages and Luncheon Meats'],
    'Vegetariana': ['Beef Products', 'Poultry Products', 'Pork Products', 'Lamb, Veal, and Game Products', 'Finfish and Shellfish Products', 'Sausages and Luncheon Meats'],
    'Paleo': ['Baked Foods', 'Dairy and Egg Products', 'Legumes', 'Grains and Pasta'],
};

// Get macro distribution for a diet type
export function getMacroDistribution(dietType: DietType): MacroDistribution {
    return DIET_MACROS[dietType] || DIET_MACROS['Estándar'];
}

// Check if a food category is allowed for a diet
export function isCategoryAllowed(dietType: DietType, category: string): boolean {
    const avoided = DIET_AVOID_CATEGORIES[dietType];
    if (!avoided) return true;
    return !avoided.some(cat => category.toLowerCase().includes(cat.toLowerCase()));
}
