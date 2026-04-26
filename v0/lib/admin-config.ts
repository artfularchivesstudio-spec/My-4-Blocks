import { supabase } from './supabase'
import { type ChatConfig } from '../shared/api/chat'

/**
 * 🛠️ Admin Configuration Helper
 * 
 * Fetches the active configuration from Supabase.
 * Falls back to defaults if something goes wrong.
 */
export async function getActiveConfig(): Promise<Partial<ChatConfig>> {
  try {
    // 🔍 Try to fetch the active config row
    const { data, error } = await supabase
      .from('admin_config')
      .select('*')
      .eq('active', true)
      .single()

    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.warn('⚠️ Supabase error fetching config:', error.message)
      }
      return {}
    }

    if (!data) return {}

    // 🎯 Map DB fields to ChatConfig
    return {
      model: data.model || undefined,
      temperature: data.temperature !== null ? data.temperature : undefined,
      ragEnabled: data.rag_enabled !== null ? data.rag_enabled : undefined,
      ragTopK: data.rag_top_k !== null ? data.rag_top_k : undefined,
      systemPrompt: data.system_prompt || undefined,
      dspyOptimizerModel: data.dspy_optimizer_model || undefined,
      dspyEvalModel: data.dspy_eval_model || undefined,
      dspyJudgeModel: data.dspy_judge_model || undefined,
    }
  } catch (err) {
    console.error('💥 Unexpected error in getActiveConfig:', err)
    return {}
  }
}

/**
 * 💾 Save new configuration
 */
export async function saveConfig(config: Partial<ChatConfig & { 
  dspyOptimizerModel?: string, 
  dspyEvalModel?: string, 
  dspyJudgeModel?: string 
}>) {
  // ⚡ Mark all existing configs as inactive
  await supabase
    .from('admin_config')
    .update({ active: false })
    .eq('active', true)

  // 📝 Insert new active config
  return await supabase
    .from('admin_config')
    .insert([{
      model: config.model,
      temperature: config.temperature,
      rag_enabled: config.ragEnabled,
      rag_top_k: config.ragTopK,
      system_prompt: config.systemPrompt,
      dspy_optimizer_model: config.dspyOptimizerModel,
      dspy_eval_model: config.dspyEvalModel,
      dspy_judge_model: config.dspyJudgeModel,
      active: true,
      created_at: new Date().toISOString(),
    }])
}
