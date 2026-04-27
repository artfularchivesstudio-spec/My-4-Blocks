'use client'

/**
 * 🎭 The ConfigTab - The Command Center of Wisdom ✨
 *
 * "Where the seeker defines the parameters of truth,
 * and the museum director ensures the digital muses 
 * sing with technical precision and artistic beauty."
 *
 * - The Spellbinding Museum Director of Configuration
 */

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Settings, Loader2, Save, Sparkles, Zap } from 'lucide-react'
import { getActiveConfig, saveConfig } from '@/lib/admin-config'
import { type ChatConfig, SYSTEM_PROMPT } from '@/shared/api/chat'

export function ConfigTab() {
  // 🌟 The cosmic state of our digital parameters
  const [config, setConfig] = useState<Partial<ChatConfig>>({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    ragEnabled: true,
    ragTopK: 5,
    systemPrompt: SYSTEM_PROMPT,
    dspyOptimizerModel: 'openai/gpt-4o-2024-08-06',
    dspyEvalModel: 'openai/gpt-4o-mini',
    dspyJudgeModel: 'openai/gpt-4o-2024-08-06',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // 🌐 ✨ CONFIGURATION AWAKENS!
  useEffect(() => {
    async function fetchConfig() {
      try {
        console.log('🔍 🧙‍♂️ Peering into mystical configuration variables...')
        const data = await getActiveConfig()
        if (Object.keys(data).length > 0) {
          setConfig(prev => ({ ...prev, ...data }))
        }
      } catch (creativeChallenge) {
        console.error('🌩️ Temporary setback fetching config:', creativeChallenge)
        toast({
          title: '🌩️ Configuration error',
          description: 'Our digital muses had trouble retrieving the settings.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchConfig()
  }, [toast])

  // 💾 The ritual of preserving digital wisdom
  const handleSave = async () => {
    setIsSaving(true)
    console.log('🌟 Grand attempt at digital magic: Saving config...')
    
    try {
      const result = await saveConfig(config)
      if (result.error) throw result.error
      
      console.log('🎉 ✨ CONFIGURATION MASTERPIECE COMPLETE!')
      toast({
        title: '🎉 ✨ Ritual complete!',
        description: 'The cosmic parameters have been crystallized in the database.',
      })
    } catch (creativeChallenge: any) {
      console.error('💥 😭 CONFIGURATION QUEST TEMPORARILY HALTED!', creativeChallenge)
      toast({
        title: '🌩️ Temporary setback',
        description: creativeChallenge.message || 'The digital muses are taking a brief intermission.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="border-primary/20 shadow-lg">
        <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">✨ Summoning configuration spirits...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 shadow-xl bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              System Configuration
            </CardTitle>
            <CardDescription className="text-base">
              Fine-tune the digital consciousness and retrieval mechanisms.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8 p-6">
        {/* 🤖 LLM Model Realm */}
        <div className="space-y-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-primary">Intelligence Parameters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="model-select" className="text-sm font-medium">Model Selection</Label>
              <Select 
                value={config.model} 
                onValueChange={(val) => setConfig({ ...config, model: val })}
              >
                <SelectTrigger id="model-select" className="bg-background">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-2024-08-06">GPT-4o (Most Intelligent)</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o-mini (Fast & Efficient)</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Legacy Precision)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Select the brain for the Four Blocks system.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Temperature</Label>
                <span className="text-xs font-mono bg-primary/10 px-2 py-1 rounded text-primary">
                  {config.temperature}
                </span>
              </div>
              <Slider
                value={[config.temperature || 0.7]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={(vals) => setConfig({ ...config, temperature: vals[0] })}
                className="py-2"
              />
              <p className="text-xs text-muted-foreground">Higher values make the response more creative but less deterministic.</p>
            </div>
          </div>
        </div>

        {/* 🔍 RAG Retrieval Realm */}
        <div className="space-y-4 p-4 rounded-xl bg-secondary/5 border border-secondary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <h3 className="font-semibold text-secondary-foreground">RAG Retrieval Matrix</h3>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="rag-toggle" className="text-sm cursor-pointer">RAG Enabled</Label>
              <Switch
                id="rag-toggle"
                checked={config.ragEnabled}
                onCheckedChange={(val) => setConfig({ ...config, ragEnabled: val })}
              />
            </div>
          </div>

          <div className={`space-y-4 pt-2 transition-opacity duration-300 ${config.ragEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-muted-foreground">Context Window (Top-K)</Label>
              <span className="text-xs font-mono bg-secondary/10 px-2 py-1 rounded text-secondary-foreground">
                {config.ragTopK} Chunks
              </span>
            </div>
            <Slider
              value={[config.ragTopK || 5]}
              min={1}
              max={20}
              step={1}
              onValueChange={(vals) => setConfig({ ...config, ragTopK: vals[0] })}
              className="py-2"
            />
            <p className="text-xs text-muted-foreground">Number of relevant book segments to inject into the consciousness.</p>
          </div>
        </div>

        {/* 🧬 Evolution & Evaluation Matrix (DSPy) */}
        <div className="space-y-4 p-4 rounded-xl bg-accent/5 border border-accent/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded bg-accent/20">
              <Zap className="w-4 h-4 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-accent-foreground">Evolution & Evaluation Matrix (DSPy)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="optimizer-model" className="text-sm font-medium">Optimizer Model</Label>
              <Input
                id="optimizer-model"
                value={config.dspyOptimizerModel || ''}
                onChange={(e) => setConfig({ ...config, dspyOptimizerModel: e.target.value })}
                placeholder="openai/gpt-4o-2024-08-06"
                className="bg-background"
              />
              <p className="text-[10px] text-muted-foreground">The muse that optimizes the system.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eval-model" className="text-sm font-medium">Evaluator Model</Label>
              <Input
                id="eval-model"
                value={config.dspyEvalModel || ''}
                onChange={(e) => setConfig({ ...config, dspyEvalModel: e.target.value })}
                placeholder="openai/gpt-4o-mini"
                className="bg-background"
              />
              <p className="text-[10px] text-muted-foreground">The muse that evaluates performance.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="judge-model" className="text-sm font-medium">Judge Model</Label>
              <Input
                id="judge-model"
                value={config.dspyJudgeModel || ''}
                onChange={(e) => setConfig({ ...config, dspyJudgeModel: e.target.value })}
                placeholder="openai/gpt-4o-2024-08-06"
                className="bg-background"
              />
              <p className="text-[10px] text-muted-foreground">The final arbiter of truth.</p>
            </div>
          </div>
        </div>

        {/* 📜 System Prompt Console */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="system-prompt" className="text-sm font-medium flex items-center gap-2">
              System Prompt Конституция (Constitution)
            </Label>
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest bg-amber-500/10 text-amber-600 border-amber-500/20">
              Absolute Source of Truth
            </Badge>
          </div>
          <Textarea
            id="system-prompt"
            value={config.systemPrompt || ''}
            onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
            placeholder="Enter the foundational rules of the system..."
            className="min-h-[300px] font-mono text-xs leading-relaxed bg-background resize-y shadow-inner border-primary/10"
          />
          <p className="text-xs text-muted-foreground italic">
            ⚠️ Modifying the constitution can lead to conceptual drift. Use with extreme caution.
          </p>
        </div>

        {/* 🎭 The Final Act: Saving */}
        <div className="flex justify-end pt-4 border-t border-primary/10">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all hover:scale-105"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Crystallizing...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
