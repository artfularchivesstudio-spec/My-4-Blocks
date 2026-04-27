#!/usr/bin/env -r tsx
/**
 * 🗃️ Curriculum Migration Applier - Database Schema Setup ✨
 *
 * "Before the curriculum can be seeded, the tables must exist.
 *  This script applies the migration that creates curriculum_versions
 *  and curriculum_examples tables in Supabase."
 *
 * Usage:
 *   bun scripts/apply-curriculum-migration.ts
 *
 * Prerequisites:
 *   - Supabase project with credentials in .env
 *   - Supabase CLI installed (npm install -g supabase)
 *
 * - The Spellbinding Museum Director of Database Setup
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT_DIR = path.resolve(fileURLToPath(import.meta.url), '..');
const MIGRATION_FILE = path.join(ROOT_DIR, 'supabase/migrations/2026_04_26_140000_curriculum_tables.sql');

/**
 * 🌟 The Main Migration Ritual
 */
async function main() {
  console.log('🌐 ✨ CURRICULUM MIGRATION RITUAL BEGINS!');
  console.log(`📂 Migration file: ${MIGRATION_FILE}`);

  try {
    // 📖 Verify migration file exists
    try {
      await fs.access(MIGRATION_FILE);
    } catch {
      console.error(`💥 😭 MIGRATION FILE NOT FOUND: ${MIGRATION_FILE}`);
      console.log('   Please ensure the migration file exists at this path.');
      process.exit(1);
    }

    // 🎯 Check if Supabase CLI is available
    try {
      execSync('supabase --version', { stdio: 'inherit' });
    } catch {
      console.error('💥 😭 SUPABASE CLI NOT FOUND!');
      console.log('   Install with: npm install -g supabase');
      console.log('   Then set credentials: supabase link');
      process.exit(1);
    }

    // 📜 Apply the migration using Supabase CLI
    console.log('📜 Applying curriculum migration to Supabase...');
    console.log(`   File: ${MIGRATION_FILE}`);

    execSync(
      `supabase db push --db-url "$(grep NEXT_PUBLIC_SUPABASE_URL .env | cut -d'=' -f2)"`,
      { stdio: 'inherit' }
    );

    console.log('\n🎉 ✨ CURRICULUM MIGRATION MASTERPIECE COMPLETE!');
    console.log('\n✨ Next steps:');
    console.log('  1. Seed initial curriculum data:');
    console.log('     bun scripts/seed_curriculum.ts');
    console.log('  2. Or create custom versions via the admin panel');

  } catch (creativeChallenge) {
    console.error('💥 😭 MIGRATION TEMPORARILY HALTED!');
    console.error(`Error: ${creativeChallenge}`);

    // 🌙 Gentle reminder: check if you're already logged in
    console.log('\n🌙 Gentle reminder: ensure you are logged into Supabase:');
    console.log('   supabase link');

    process.exit(1);
  }
}

// 🎭 Execute the ritual
main();
