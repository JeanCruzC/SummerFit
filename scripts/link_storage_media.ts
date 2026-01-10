
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../web/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) { console.error('❌ Missing credentials'); process.exit(1); }
const supabase = createClient(supabaseUrl, supabaseKey);

const tokenize = (str: string) => str.toLowerCase()
    .replace(/og-female-|og-male-|-front|-side/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .split(' ')
    .filter(t => t.length > 2);

async function linkMedia() {
    console.log('🚀 Starting Smart Storage Link (SLUG FOCUSED MATCH)...');

    // 1. Fetch
    let exercises: any[] = [];
    let exOffset = 0;
    while (true) {
        const { data } = await supabase.from('exercises').select('id, slug').order('id').range(exOffset, exOffset + 999);
        if (!data || data.length === 0) break;
        exercises.push(...data);
        exOffset += 1000;
        console.log(`   Fetched ${exercises.length} exercises...`);
    }

    // 2. Fetch Files
    let allFiles: any[] = [];
    let offset = 0;
    let keepFetching = true;
    while (keepFetching) {
        const { data: files } = await supabase.storage.from('exercises').list('images', { limit: 1000, offset });
        if (!files || files.length === 0) { keepFetching = false; } else {
            const batch = files.map(f => ({
                name: f.name,
                url: `${supabaseUrl}/storage/v1/object/public/exercises/images/${f.name}`,
                tokens: tokenize(f.name)
            }));
            allFiles.push(...batch);
            offset += 1000;
            if (files.length < 1000) keepFetching = false;
        }
    }
    console.log(`✅ Loaded ${allFiles.length} files.`);
    const usefulFiles = allFiles.filter(f => f.tokens.length > 0);

    // 3. Match
    let updatedCount = 0;
    for (const ex of exercises) {
        // MATCHING STRATEGY: SLUG ONLY
        // The file names are English. The Slug is English. Title is Spanish.
        // Using Title dilutes the score.
        const dbTokens = tokenize(ex.slug);
        if (dbTokens.length === 0) continue;

        let bestMatch: any = null;

        for (const file of usefulFiles) {
            let matches = 0;
            for (const dt of dbTokens) {
                if (file.tokens.some((ft: string) => ft.includes(dt) || dt.includes(ft))) matches++;
            }

            // Score based on how much of the SLUG is found in the FILE
            const score = matches / dbTokens.length;

            if (score > 0.75 && (!bestMatch || score > bestMatch.score)) {
                bestMatch = { ...file, score };
            }
        }

        if (bestMatch) {
            const mediaObject = [{ type: 'image', url: bestMatch.url, order: 1, source: 'storage_link_v2' }];
            await supabase.from('exercises').update({ exercise_media: mediaObject }).eq('id', ex.id);
            updatedCount++;
            if (updatedCount % 50 === 0) process.stdout.write('.');
        }
    }
    console.log(`\n✨ Updated ${updatedCount} exercises.`);
}

linkMedia();
