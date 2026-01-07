import { Supplement, DietType } from '@/types';

// Supplement database
const SUPPLEMENTS: Record<string, Supplement> = {
    whey: {
        name: 'Proteína Whey',
        description: 'Proteína de suero de leche de rápida absorción',
        benefit: 'Recuperación muscular y síntesis proteica',
        icon: '🥛',
    },
    creatine: {
        name: 'Creatina Monohidratada',
        description: '5g diarios para mejorar rendimiento y fuerza',
        benefit: 'Aumenta fuerza, potencia y volumen muscular',
        icon: '💪',
    },
    bcaa: {
        name: 'BCAA (Aminoácidos Ramificados)',
        description: 'Leucina, Isoleucina y Valina para recuperación',
        benefit: 'Reduce catabolismo muscular durante el déficit',
        icon: '⚡',
    },
    carnitine: {
        name: 'L-Carnitina',
        description: 'Transportador de ácidos grasos para oxidación',
        benefit: 'Mejora el uso de grasa como energía',
        icon: '🔥',
    },
    caffeine: {
        name: 'Cafeína',
        description: '200-400mg pre-entrenamiento',
        benefit: 'Aumenta energía, enfoque y rendimiento',
        icon: '☕',
    },
    omega3: {
        name: 'Omega-3 (EPA/DHA)',
        description: 'Ácidos grasos esenciales de pescado o algas',
        benefit: 'Salud cardiovascular y reducción de inflamación',
        icon: '🐟',
    },
    multivitamin: {
        name: 'Multivitamínico',
        description: 'Complejo de vitaminas y minerales esenciales',
        benefit: 'Cubre deficiencias nutricionales',
        icon: '💊',
    },
    vitaminD: {
        name: 'Vitamina D3',
        description: '2000-4000 IU diarias',
        benefit: 'Salud ósea, inmunidad y niveles hormonales',
        icon: '☀️',
    },
    b12: {
        name: 'Vitamina B12',
        description: 'Esencial para dietas sin productos animales',
        benefit: 'Energía, función nerviosa y producción de glóbulos rojos',
        icon: '🔴',
    },
    iron: {
        name: 'Hierro',
        description: 'Suplemento de hierro quelado',
        benefit: 'Previene anemia y mejora transporte de oxígeno',
        icon: '🩸',
    },
    zinc: {
        name: 'Zinc',
        description: '15-30mg diarios',
        benefit: 'Inmunidad, niveles de testosterona y recuperación',
        icon: '🛡️',
    },
    electrolytes: {
        name: 'Electrolitos',
        description: 'Sodio, Potasio, Magnesio',
        benefit: 'Esencial en dietas keto para prevenir "keto flu"',
        icon: '⚡',
    },
    mct: {
        name: 'Aceite MCT',
        description: 'Triglicéridos de cadena media',
        benefit: 'Energía rápida en cetosis, claridad mental',
        icon: '🥥',
    },
    betaAlanine: {
        name: 'Beta-Alanina',
        description: '3-5g diarios',
        benefit: 'Resistencia muscular y menor fatiga',
        icon: '🏃',
    },
    gainer: {
        name: 'Mass Gainer',
        description: 'Proteína + carbohidratos de alto contenido calórico',
        benefit: 'Facilita el superávit calórico para ganar masa',
        icon: '📈',
    },
    collagen: {
        name: 'Colágeno Hidrolizado',
        description: '10-15g diarios',
        benefit: 'Salud articular, piel y tejido conectivo',
        icon: '🦴',
    },
    magnesium: {
        name: 'Magnesio',
        description: '300-400mg diarios (glicinato o citrato)',
        benefit: 'Sueño, recuperación muscular y función nerviosa',
        icon: '😴',
    },
};

// Recommendations by goal
const GOAL_SUPPLEMENTS: Record<string, string[]> = {
    'Definir': ['whey', 'bcaa', 'carnitine', 'caffeine', 'omega3', 'multivitamin'],
    'Volumen': ['whey', 'creatine', 'gainer', 'betaAlanine', 'zinc', 'vitaminD'],
    'Mantener': ['multivitamin', 'omega3', 'vitaminD', 'magnesium', 'collagen'],
};

// Diet-specific supplements
const DIET_SUPPLEMENTS: Partial<Record<DietType, string[]>> = {
    'Keto': ['electrolytes', 'mct', 'omega3', 'magnesium', 'vitaminD'],
    'Vegana': ['b12', 'iron', 'zinc', 'omega3', 'vitaminD', 'creatine'],
    'Vegetariana': ['b12', 'iron', 'omega3', 'vitaminD'],
    'Alta Proteína': ['whey', 'creatine', 'bcaa', 'zinc'],
};

/**
 * Get supplement recommendations based on goal and diet
 */
export function getSupplementRecommendations(
    goal: 'Definir' | 'Mantener' | 'Volumen',
    dietType: DietType
): Supplement[] {
    const goalSupps = GOAL_SUPPLEMENTS[goal] || [];
    const dietSupps = DIET_SUPPLEMENTS[dietType] || [];

    // Merge and deduplicate
    const allKeys = [...new Set([...goalSupps, ...dietSupps])];

    // Limit to 6 recommendations
    const topKeys = allKeys.slice(0, 6);

    return topKeys
        .map(key => SUPPLEMENTS[key])
        .filter(Boolean);
}

/**
 * Get all available supplements
 */
export function getAllSupplements(): Supplement[] {
    return Object.values(SUPPLEMENTS);
}

/**
 * Get supplement by key
 */
export function getSupplement(key: string): Supplement | undefined {
    return SUPPLEMENTS[key];
}

/**
 * Get disclaimer text
 */
export function getSupplementDisclaimer(): string {
    return 'Los suplementos no sustituyen una dieta balanceada. Consulta con un profesional de la salud antes de comenzar cualquier suplementación, especialmente si tienes condiciones médicas preexistentes o tomas medicamentos.';
}
