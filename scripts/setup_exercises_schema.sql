-- ============================================================
-- EXERCISES SYSTEM SCHEMA
-- ============================================================

-- EXERCISES TABLE (2,919 ejercicios)
CREATE TABLE IF NOT EXISTS public.exercises (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT, -- 'Fuerza' | 'Cardio' | 'Flexibilidad'
  level TEXT, -- 'Principiante' | 'Intermedio' | 'Avanzado'
  body_part TEXT,
  equipment_required TEXT[], -- Array de equipamiento necesario
  training_location TEXT[], -- ['Casa', 'Gimnasio', 'Aire libre']
  met NUMERIC, -- Equivalente metabólico para calcular calorías
  ranking_score NUMERIC,
  rating NUMERIC,
  rating_desc TEXT,
  -- Media and Instructions
  video_url TEXT,
  gif_url TEXT,
  instructions TEXT[], -- Array of step-by-step instructions
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON exercises USING GIN (equipment_required);
CREATE INDEX IF NOT EXISTS idx_exercises_body_part ON exercises (body_part);
CREATE INDEX IF NOT EXISTS idx_exercises_level ON exercises (level);
CREATE INDEX IF NOT EXISTS idx_exercises_type ON exercises (type);
CREATE INDEX IF NOT EXISTS idx_exercises_ranking ON exercises (ranking_score DESC);

-- ============================================================
-- USER EQUIPMENT TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_equipment (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  equipment_type TEXT NOT NULL, -- 'Barra', 'Mancuernas', 'Bandas', etc.
  quantity INT DEFAULT 1, -- Cuántos tiene (ej: 2 mancuernas)
  weight_kg NUMERIC, -- Para pesas: peso disponible por unidad
  notes TEXT, -- "2 mancuernas de 10kg cada una"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, equipment_type, weight_kg)
);

CREATE INDEX IF NOT EXISTS idx_user_equipment_user ON user_equipment (user_id);

-- ============================================================
-- WORKOUT PLANS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  days_per_week INT DEFAULT 3,
  total_met_hours NUMERIC DEFAULT 0, -- MET-hours totales del plan
  estimated_calories_weekly NUMERIC DEFAULT 0, -- Estimación semanal
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_plans_user ON workout_plans (user_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_active ON workout_plans (user_id, is_active);

-- ============================================================
-- WORKOUT PLAN EXERCISES (relación plan-ejercicios)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.workout_plan_exercises (
  id BIGSERIAL PRIMARY KEY,
  workout_plan_id BIGINT REFERENCES workout_plans(id) ON DELETE CASCADE,
  exercise_id BIGINT REFERENCES exercises(id) ON DELETE CASCADE,
  day_of_week INT CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Lunes, 7=Domingo
  sets INT DEFAULT 3,
  reps INT,
  duration_minutes INT, -- Para cardio o tiempo total
  rest_seconds INT DEFAULT 60,
  notes TEXT,
  order_in_day INT DEFAULT 0, -- Orden de ejecución en el día
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_plan_exercises_plan ON workout_plan_exercises (workout_plan_id);
CREATE INDEX IF NOT EXISTS idx_workout_plan_exercises_day ON workout_plan_exercises (workout_plan_id, day_of_week);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- User Equipment RLS
ALTER TABLE user_equipment ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own equipment" ON user_equipment;
CREATE POLICY "Users can view their own equipment"
  ON user_equipment FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own equipment" ON user_equipment;
CREATE POLICY "Users can insert their own equipment"
  ON user_equipment FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own equipment" ON user_equipment;
CREATE POLICY "Users can update their own equipment"
  ON user_equipment FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own equipment" ON user_equipment;
CREATE POLICY "Users can delete their own equipment"
  ON user_equipment FOR DELETE
  USING (auth.uid() = user_id);

-- Workout Plans RLS
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own workout plans" ON workout_plans;
CREATE POLICY "Users can view their own workout plans"
  ON workout_plans FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own workout plans" ON workout_plans;
CREATE POLICY "Users can insert their own workout plans"
  ON workout_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own workout plans" ON workout_plans;
CREATE POLICY "Users can update their own workout plans"
  ON workout_plans FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own workout plans" ON workout_plans;
CREATE POLICY "Users can delete their own workout plans"
  ON workout_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Workout Plan Exercises RLS (hereda permisos del plan)
ALTER TABLE workout_plan_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view exercises from their plans" ON workout_plan_exercises;
CREATE POLICY "Users can view exercises from their plans"
  ON workout_plan_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_plans
      WHERE workout_plans.id = workout_plan_exercises.workout_plan_id
      AND workout_plans.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert exercises to their plans" ON workout_plan_exercises;
CREATE POLICY "Users can insert exercises to their plans"
  ON workout_plan_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_plans
      WHERE workout_plans.id = workout_plan_exercises.workout_plan_id
      AND workout_plans.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update exercises in their plans" ON workout_plan_exercises;
CREATE POLICY "Users can update exercises in their plans"
  ON workout_plan_exercises FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workout_plans
      WHERE workout_plans.id = workout_plan_exercises.workout_plan_id
      AND workout_plans.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete exercises from their plans" ON workout_plan_exercises;
CREATE POLICY "Users can delete exercises from their plans"
  ON workout_plan_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workout_plans
      WHERE workout_plans.id = workout_plan_exercises.workout_plan_id
      AND workout_plans.user_id = auth.uid()
    )
  );

-- Exercises table: pública para lectura
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Exercises are publicly readable" ON exercises;
CREATE POLICY "Exercises are publicly readable"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Función para calcular calorías quemadas
CREATE OR REPLACE FUNCTION calculate_exercise_calories(
  p_met NUMERIC,
  p_weight_kg NUMERIC,
  p_duration_minutes INT
)
RETURNS NUMERIC AS $$
BEGIN
  RETURN ROUND(p_met * p_weight_kg * (p_duration_minutes / 60.0));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para actualizar totales del plan
CREATE OR REPLACE FUNCTION update_workout_plan_totals(p_plan_id BIGINT, p_user_weight_kg NUMERIC)
RETURNS VOID AS $$
DECLARE
  v_total_calories NUMERIC := 0;
  v_total_met_hours NUMERIC := 0;
  v_exercise RECORD;
BEGIN
  FOR v_exercise IN
    SELECT wpe.*, e.met
    FROM workout_plan_exercises wpe
    JOIN exercises e ON e.id = wpe.exercise_id
    WHERE wpe.workout_plan_id = p_plan_id
  LOOP
    v_total_calories := v_total_calories + 
      calculate_exercise_calories(
        v_exercise.met, 
        p_user_weight_kg, 
        v_exercise.duration_minutes * COALESCE(v_exercise.sets, 1)
      );
    
    v_total_met_hours := v_total_met_hours + 
      (v_exercise.met * (v_exercise.duration_minutes / 60.0) * COALESCE(v_exercise.sets, 1));
  END LOOP;
  
  UPDATE workout_plans
  SET 
    estimated_calories_weekly = v_total_calories,
    total_met_hours = v_total_met_hours,
    updated_at = NOW()
  WHERE id = p_plan_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- COMENTARIOS
-- ============================================================
COMMENT ON TABLE exercises IS 'Catálogo de 2,919 ejercicios con equipamiento y valores MET';
COMMENT ON TABLE user_equipment IS 'Equipamiento disponible de cada usuario';
COMMENT ON TABLE workout_plans IS 'Planes de entrenamiento semanales';
COMMENT ON TABLE workout_plan_exercises IS 'Ejercicios específicos en cada plan';
COMMENT ON FUNCTION calculate_exercise_calories IS 'Calcula calorías: MET × peso × duración(horas)';
COMMENT ON FUNCTION update_workout_plan_totals IS 'Recalcula totales de calorías y MET-hours del plan';
