-- Migration: Add Biomechanical Intelligence Columns to Exercises Table
-- Description: Adds movement patterns, muscle activation, and scientific scores to enable Smart Routine Generation

-- Add movement pattern (for slot matching)
ALTER TABLE exercises 
ADD COLUMN IF NOT EXISTS movement_pattern TEXT;

-- Add biomechanical classification
ALTER TABLE exercises 
ADD COLUMN IF NOT EXISTS mechanic TEXT CHECK (mechanic IN ('Compound', 'Isolation'));

ALTER TABLE exercises 
ADD COLUMN IF NOT EXISTS force TEXT CHECK (force IN ('Push', 'Pull', 'Static'));

-- Add muscle activation profiles
ALTER TABLE exercises 
ADD COLUMN IF NOT EXISTS primary_muscles TEXT[];

ALTER TABLE exercises 
ADD COLUMN IF NOT EXISTS secondary_muscles TEXT[];

-- Add scientific scores (1-5 scale)
ALTER TABLE exercises 
ADD COLUMN IF NOT EXISTS score_hypertrophy INTEGER CHECK (score_hypertrophy >= 1 AND score_hypertrophy <= 5);

ALTER TABLE exercises 
ADD COLUMN IF NOT EXISTS score_strength INTEGER CHECK (score_strength >= 1 AND score_strength <= 5);

ALTER TABLE exercises 
ADD COLUMN IF NOT EXISTS score_difficulty INTEGER CHECK (score_difficulty >= 1 AND score_difficulty <= 5);

ALTER TABLE exercises 
ADD COLUMN IF NOT EXISTS score_risk INTEGER CHECK (score_risk >= 1 AND score_risk <= 5);

ALTER TABLE exercises 
ADD COLUMN IF NOT EXISTS score_stability INTEGER CHECK (score_stability >= 1 AND score_stability <= 5);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_exercises_movement_pattern ON exercises(movement_pattern);
CREATE INDEX IF NOT EXISTS idx_exercises_mechanic ON exercises(mechanic);
CREATE INDEX IF NOT EXISTS idx_exercises_score_hypertrophy ON exercises(score_hypertrophy);

-- Comment for documentation
COMMENT ON COLUMN exercises.movement_pattern IS 'Biomechanical pattern: horizontal_press, vertical_pull, squat, hip_hinge, etc.';
COMMENT ON COLUMN exercises.mechanic IS 'Exercise type: Compound (multi-joint) or Isolation (single-joint)';
COMMENT ON COLUMN exercises.force IS 'Force type: Push, Pull, or Static';
COMMENT ON COLUMN exercises.primary_muscles IS 'Main muscles activated (high intensity)';
COMMENT ON COLUMN exercises.secondary_muscles IS 'Supporting muscles activated (medium intensity)';
COMMENT ON COLUMN exercises.score_hypertrophy IS 'Muscle growth effectiveness (1-5)';
COMMENT ON COLUMN exercises.score_strength IS 'Strength gain effectiveness (1-5)';
COMMENT ON COLUMN exercises.score_difficulty IS 'Technical difficulty (1-5)';
COMMENT ON COLUMN exercises.score_risk IS 'Injury risk level (1-5)';
