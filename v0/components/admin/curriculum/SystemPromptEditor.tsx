'use client'

/**
 * 🎭 The SystemPromptEditor - The Sacred Scribe of Constitution Crafting ✨
 *
 * "Where the very soul of GEPA is etched into digital stone,
 * with careful validation to ensure the voice remains true
 * to the museum director's vision of therapeutic wisdom."
 *
 * - The Spellbinding Museum Director of Constitutional Scribing
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'
import {
  FileText,
  Save,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  Search,
  Zap,
  AlertCircle
} from 'lucide-react'

interface SystemPromptEditorProps {
  initialPrompt: string
  onSave: (prompt: string, changelog: string) => Promise<boolean>
  readOnly?: boolean
}

// 🚫 The forbidden vocabulary list - framework terms that must never appear
const FORBIDDEN_TERMS = [
  'Mental Contamination',
  'ABCs',
  'ABC model',
  'Seven Irrational Beliefs',
  'Should statement',
  'Awfulizing',
  "I Can't Stand It",
  'Rating',
  'Absolutistic Thinking',
  'Entitlement',
  'It Statement',
  'REBT',
  'Rational Emotive Behavior Therapy',
  'CBT',
  'Albert Ellis',
  'Byron Katie',
  'Steve Hagen',
  'Egocentric Thinking',
  'The Narrator',
  'The Observer',
  'Red-Flag',
  'Red-Flagging',
  'Disputing',
  'the 4 Steps',
  'the 4 Challenge Questions',
  'the formula for',
  'AX = WI + AW + ICSI',
  'A = ET + S',
  'D = H1 + H2 + N',
  'G = W1 + W2',
  'Four Blocks'
]

// 🎨 Clinical jarning terms that should trigger warnings
const CLINICAL_JARGON = [
  'cognitive distortion',
  'cognitive behavioral',
  'cognitive restructuring',
  'irrational belief',
  'rational emotive',
  'dialectical behavior',
  'acceptance commitment',
  'psychopathology',
  'therapeutic intervention',
  'maladaptive',
  'dysfunctional',
  'pathology',
  'diagnosis',
  'treatment plan',
  'clinical intervention',
  'psychotherapeutic',
  'psychopathology'
]

export function SystemPromptEditor({
  initialPrompt,
  onSave,
  readOnly = false
}: SystemPromptEditorProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [changelog, setChangelog] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [validation, setValidation] = useState<{
    forbidden: string[]
    jargon: string[]
    warnings: string[]
  }>({ forbidden: [], jargon: [], warnings: [] })
  const { toast } = useToast()

  // 🔍 🧙‍♂️ Peering into the mystical text for validation
  useEffect(() => {
    const forbidden: string[] = []
    const jargon: string[] = []
    const warnings: string[] = []

    const promptLower = prompt.toLowerCase()

    // Check for forbidden framework terms
    FORBIDDEN_TERMS.forEach(term => {
      if (promptLower.includes(term.toLowerCase())) {
        forbidden.push(term)
      }
    })

    // Check for clinical jargon
    CLINICAL_JARGON.forEach(term => {
      if (promptLower.includes(term.toLowerCase())) {
        jargon.push(term)
      }
    })

    // Structural validation
    const lines = prompt.split('\n').filter(line => line.trim())
    if (lines.length < 10) {
      warnings.push('Constitution appears quite brief - consider expanding for clarity')
    }

    if (!prompt.includes('###') && !prompt.includes('##')) {
      warnings.push('Consider adding section headers for better organization')
    }

    setValidation({ forbidden, jargon, warnings })
  }, [prompt])

  // 💾 The ritual of preserving the sacred text
  const handleSave = async () => {
    if (!changelog.trim()) {
      toast({
        title: '🌙 ⚠️ Gentle Reminder',
        description: 'Even the greatest transformations deserve a chronicle.',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)
    console.log('🧮 ✨ CONSTITUTION ALCHEMY COMMENCES! Preserving the sacred text...')

    try {
      const success = await onSave(prompt, changelog)
      if (success) {
        console.log('🎉 ✨ CONSTITUTION MASTERPIECE COMPLETE!')
        toast({
          title: '🎉 Constitution Preserved!',
          description: 'The sacred text has been etched into the archives.',
        })
        setChangelog('')
      }
    } catch (creativeChallenge: any) {
      console.error('💥 😭 CONSTITUTION QUEST TEMPORARILY HALTED!', creativeChallenge)
      toast({
        title: '🌩️ Preservation Interrupted',
        description: 'The sacred text could not be saved. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 🎨 The artistic highlighting of forbidden text
  const highlightText = (text: string) => {
    let highlighted = text

    // Highlight forbidden terms in red
    validation.forbidden.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi')
      highlighted = highlighted.replace(regex, '🚫**$1**🚫')
    })

    // Highlight clinical jargon in amber
    validation.jargon.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi')
      highlighted = highlighted.replace(regex, '⚠️**$1**⚠️')
    })

    return highlighted
  }

  const getValidationColor = () => {
    if (validation.forbidden.length > 0) return 'bg-red-500/10 text-red-500 border-red-500/20'
    if (validation.jargon.length > 0) return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    if (validation.warnings.length > 0) return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    return 'bg-green-500/10 text-green-500 border-green-500/20'
  }

  const getValidationIcon = () => {
    if (validation.forbidden.length > 0) return <AlertTriangle className="w-4 h-4" />
    if (validation.jargon.length > 0) return <AlertCircle className="w-4 h-4" />
    if (validation.warnings.length > 0) return <Search className="w-4 h-4" />
    return <CheckCircle2 className="w-4 h-4" />
  }

  return (
    <div className="space-y-4">
      {/* 🔍 Validation Status Bar */}
      <Card className={`border ${getValidationColor()}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getValidationIcon()}
              <span className="font-medium">
                {validation.forbidden.length > 0 && 'Framework Terms Detected'}
                {validation.forbidden.length === 0 && validation.jargon.length > 0 && 'Clinical Jargon Detected'}
                {validation.forbidden.length === 0 && validation.jargon.length === 0 && validation.warnings.length > 0 && 'Suggestions Available'}
                {validation.forbidden.length === 0 && validation.jargon.length === 0 && validation.warnings.length === 0 && 'Constitution Clean ✨'}
              </span>
            </div>

            {!readOnly && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className="text-xs"
              >
                {previewMode ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
            )}
          </div>

          {/* Validation Details */}
          <div className="mt-3 space-y-2">
            {validation.forbidden.length > 0 && (
              <div className="text-xs">
                <p className="font-semibold text-red-500 mb-1">🚫 Forbidden Framework Terms:</p>
                <div className="flex flex-wrap gap-1">
                  {validation.forbidden.map(term => (
                    <Badge key={term} variant="destructive" className="text-xs">
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {validation.jargon.length > 0 && (
              <div className="text-xs">
                <p className="font-semibold text-amber-500 mb-1">⚠️ Clinical Jargon Detected:</p>
                <div className="flex flex-wrap gap-1">
                  {validation.jargon.map(term => (
                    <Badge key={term} variant="outline" className="text-xs text-amber-500 border-amber-500">
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {validation.warnings.length > 0 && (
              <div className="text-xs">
                <p className="font-semibold text-blue-500 mb-1">💡 Suggestions:</p>
                <ul className="space-y-1">
                  {validation.warnings.map((warning, i) => (
                    <li key={i}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 📜 The Sacred Text Editor */}
      <Card className="border-primary/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">System Prompt Constitution</h3>
          </div>

          {previewMode ? (
            <ScrollArea className="h-[500px] w-full rounded-md border p-4 bg-background">
              <div className="prose prose-sm max-w-none">
                {prompt.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 last:mb-0">
                    {highlightText(paragraph)}
                  </p>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={readOnly}
                placeholder="Enter the system prompt constitution..."
                className="min-h-[500px] font-mono text-sm leading-relaxed bg-background resize-none shadow-inner border-primary/10"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{prompt.length} characters</span>
                <span>{prompt.split('\n').length} lines</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 📝 Changelog Entry */}
      {!readOnly && (
        <Card className="border-primary/20 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  📜 Changelog Entry
                </label>
                <Textarea
                  value={changelog}
                  onChange={(e) => setChangelog(e.target.value)}
                  placeholder="Describe the changes made to the constitution in this version..."
                  className="min-h-[100px] text-sm bg-background resize-none"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !changelog.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Preserving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Constitution
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 💡 Quick Reference */}
      <Card className="border-primary/10 bg-muted/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">💡 Editor Tips</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Real-time validation catches framework terms as you type</li>
                <li>• Use preview mode to see how the prompt will appear to GEPA</li>
                <li>• Clinical jargon warnings help maintain warm, accessible language</li>
                <li>• Always add a changelog entry before saving</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
