#!/usr/bin/env -r tsx
/**
 * 🌱 Curriculum Seeding Ritual - From Filesystem to Supabase ✨
 *
 * "The system prompt v1 lives in markdown, the golden examples in JSON.
 *  Supabase awaits their arrival. This script performs the sacred migration,
 *  transforming file-based wisdom into database-stored truth."
 *
 * Usage:
 *   bun scripts/seed_curriculum.ts                # Seed v1 curriculum from filesystem
 *
 * - The Spellbinding Museum Director of Curriculum Migration
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 🔮 Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('💥 😭 SUPABASE CREDENTIALS MISSING! Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 🎭 Paths to curriculum files (relative to repo root)
const ROOT_DIR = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const SYSTEM_PROMPT_PATH = path.join(ROOT_DIR, 'docs/GEPA-DSPy-m1/four_blocks_runner/curriculum/system_prompt.md');
const CURRICUM_DIR = path.join(ROOT_DIR, 'docs/GEPA-DSPy-m1/four_blocks_runner/curriculum');

/**
 * 🌟 The Main Seeding Ritual
 */
async function main() {
  console.log('🌐 ✨ CURRICULUM SEEDING RITUAL BEGINS!');
  console.log(`📂 Root directory: ${ROOT_DIR}`);

  try {
    // 📖 Read the system prompt v1
    console.log('📜 Reading system prompt v1 from filesystem...');
    const systemPromptContent = await fs.readFile(SYSTEM_PROMPT_PATH, 'utf-8');
    console.log(`✨ System prompt loaded: ${systemPromptContent.length} characters`);

    // 🎯 Create curriculum version v1
    console.log('🎯 Creating curriculum version "v1" in Supabase...');
    const { data: version, error: versionError } = await supabase
      .from('curriculum_versions')
      .insert([{
        version: 'v1',
        system_prompt: systemPromptContent,
        notes: 'Initial version: 9-section constitution with per-block examples. Grounded in Dr. Vincent Parr framework.',
        status: 'draft',
        metadata: {
          source: 'filesystem',
          created_by: 'seed_curriculum.ts script'
        }
      }])
      .select()
      .single();

    if (versionError) {
      // Check if it's a duplicate version error
      if (versionError.code === '23505') {
        console.log('🌙 ⚠️ Version "v1" already exists. Skipping creation.');
        const { data: existing } = await supabase
          .from('curriculum_versions')
          .select('id')
          .eq('version', 'v1')
          .single();
        version = existing;
      } else {
        throw versionError;
      }
    }

    console.log(`🎉 Curriculum version "${version.version}" created/verified! ID: ${version.id}`);

    // 🎭 Seed golden examples for each block
    const blocks = ['anger', 'anxiety', 'depression', 'guilt'] as const;
    let totalExamplesSeeded = 0;

    for (const block of blocks) {
      const examplesPath = path.join(CURRICUM_DIR, block, 'golden_examples.json');
      console.log(`📖 Reading ${block} examples from ${examplesPath}...`);

      try {
        const examplesContent = await fs.readFile(examplesPath, 'utf-8');
        const examples = JSON.parse(examplesContent);

        console.log(`✨ Found ${examples.length} ${block} examples`);

        // 📝 Transform to DB format and insert
        const examplesToInsert = examples.map(ex => ({
          curriculum_version_id: version.id,
          example_id: ex.id,
          block,
          task_input: ex.task_input,
          expected_behavior: ex.expected_behavior,
          category: ex.category,
          difficulty: ex.difficulty,
          primary_tool: ex.primary_tool || null,
          notes: ex.notes || null,
          metadata: {
            source: 'filesystem',
            original_file: 'golden_examples.json'
          }
        }));

        const { data: insertedExamples, error: insertError } = await supabase
          .from('curriculum_examples')
          .insert(examplesToInsert)
          .select('example_id');

        if (insertError) {
          // Check if it's a duplicate key error (example already exists)
          if (insertError.code === '23505') {
            console.log(`🌙 ⚠️ Some ${block} examples already exist. Skipping duplicates.`);
            const uniqueExamples = [...new Set(examples.map(e => e.id))];
            console.log(`  📊 Unique example IDs: ${uniqueExamples.join(', ')}`);
          } else {
            throw insertError;
          }
        } else {
          console.log(`🎉 ${insertedExamples.length} ${block} examples seeded!`);
          totalExamplesSeeded += insertedExamples.length;
        }
      } catch (fileError) {
        console.error(`💥 😭 Failed to read ${examplesPath}: ${fileError.message}`);
      }
    }

    console.log(`\n🎊 CURRICULUM SEEDING MASTERPIECE COMPLETE!`);
    console.log(`📚 Version: ${version.version} (${version.id})`);
    console.log(`🎭 Total golden examples seeded: ${totalExamplesSeeded}`);
    console.log(`\n✨ Next steps:`);
    console.log(`  1. Review the draft version in the admin panel`);
    console.log(`  2. When ready, activate it via POST /api/admin/curriculum/versions/${version.id}/activate`);
    console.log(`  3. GEPA will automatically fetch from GET /api/admin/curriculum/active`);

  } catch (creativeChallenge) {
    console.error('💥 😭 CURRICULUM SEEDING TEMPORARILY HALTED!');
    console.error(`Error: ${creativeChallenge}`);
    process.exit(1);
  }
}

// 🎭 Execute the ritual
main();
