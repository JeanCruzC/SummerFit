
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../web/.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

async function verify() {
    console.log("🔍 Verifying Specific Exercises...");

    // 1. Search for "Preacher Curl" (User mentioned "Curl predicador")
    console.log("\n🔎 Searching for 'Preacher Curl'...");
    const { data: preachers } = await supabase
        .from('exercises')
        .select('slug, title, exercise_media')
        .ilike('slug', '%preacher%');

    if (preachers) {
        preachers.forEach(p => {
            console.log(`   - ${p.title} (${p.slug})`);
            console.log(`     Media: ${p.exercise_media && p.exercise_media.length > 0 ? '✅ YES' : '❌ NO'}`);
            if (p.exercise_media?.[0]) console.log(`     URL: ${p.exercise_media[0].url}`);
        });
    }

    // 2. Search for "Lateral Raises" (User mentioned "Elevaciones Laterales")
    console.log("\n🔎 Searching for 'Lateral Raises'...");
    const { data: laterals } = await supabase
        .from('exercises')
        .select('slug, title, exercise_media')
        .ilike('slug', '%lateral%raise%');

    if (laterals) {
        laterals.forEach(p => {
            console.log(`   - ${p.title} (${p.slug})`);
            console.log(`     Media: ${p.exercise_media && p.exercise_media.length > 0 ? '✅ YES' : '❌ NO'}`);
            if (p.exercise_media?.[0]) console.log(`     URL: ${p.exercise_media[0].url}`);
        });
    }
}

verify();
