
import json
import statistics

# Load the file
try:
    with open('ejercicios_enriquecidos_es.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
except FileNotFoundError:
    print("File not found")
    exit(1)

exercises = data.get('exercises', [])
total = len(exercises)
print(f"Total exercises in JSON: {total}")

# Metrics
missing_scores = 0
low_hypertrophy_count = 0 
generic_emg = 0
missing_muscles = 0

sample_errors = []

for ex in exercises:
    # Check scores
    scores = ex.get('puntuaciones_1a5', {})
    if any(s == 0 for s in scores.values()):
        missing_scores += 1
    
    # Check if hypertrophy is suspiciously low for known builders? (subjective, skip)
    
    # Check EMG state
    if ex.get('emg', {}).get('estado') == 'proxy_sin_tabla_emg':
        generic_emg += 1
        
    # Check muscles
    if not ex.get('musculos_principales'):
        missing_muscles += 1
        sample_errors.append(f"{ex['nombre_en']}: No main muscles")

    # Check consistent IDs logic
    if not isinstance(ex.get('id'), int):
         sample_errors.append(f"{ex['nombre_en']}: Invalid ID")

print(f"--- Quality Report ---")
print(f"Missing/Zero Scores: {missing_scores} ({missing_scores/total*100:.1f}%)")
print(f"Generic EMG Proxy: {generic_emg} ({generic_emg/total*100:.1f}%)")
print(f"Missing Muscle Targets: {missing_muscles}")

if sample_errors:
    print("Sample Errors:", sample_errors[:5])

# Print a specific sample to manual verify biomechanics
target_ex = next((x for x in exercises if "Bench Press" in x['nombre_en'] and "Barbell" in x['nombre_en']), None)
if target_ex:
    print("\n--- Sample: Bench Press ---")
    print(json.dumps(target_ex, indent=2, ensure_ascii=False))

