'use client'

/**
 * 🎭 The GoldenExamplesEditor - The Artisan of Educational Examples ✨
 *
 * "Where each example is a polished gem, carefully cut to show
 * how GEPA should respond in each emotional domain.
 * The museum director ensures each facet catches the light perfectly."
 *
 * - The Spellbinding Museum Director of Example Curation
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
  Zap,
  Target,
  Layers,
  FileText,
  AlertTriangle,
  Tag
} from 'lucide-react'

interface GoldenExample {
  id: string
  block: 'anger' | 'anxiety' | 'depression' | 'guilt'
  user_message: string
  expected_response: string
  expected_behavior: string
  framework_tags: string[]
  clinical_jargon: string[]
  formula_validation?: {
    anger?: string
    anxiety?: string
    depression?: string
    guilt?: string
  }
}

interface GoldenExamplesEditorProps {
  initialExamples: GoldenExample[]
  onSave: (examples: GoldenExample[]) => Promise<boolean>
  readOnly?: boolean
}

const BLOCK_OPTIONS = [
  { value: 'anger', label: 'Anger', icon: <Zap className="w-4 h-4" /> },
  { value: 'anxiety', label: 'Anxiety', icon: <Sparkles className="w-4 h-4" /> },
  { value: 'depression', label: 'Depression', icon: <Layers className="w-4 h-4" /> },
  { value: 'guilt', label: 'Guilt', icon: <Target className="w-4 h-4" /> }
]

// 🧪 Formula patterns for validation
const FORMULA_PATTERNS = {
  anger: /^AX\s*=\s*WI\s*\+\s*AW\s*\+\s*ICSI$/i,
  anxiety: /^A\s*=\s*ET\s*\+\s*S$/i,
  depression: /^D\s*=\s*H1\s*\+\s*H2\s*\s*N$/i,
  guilt: /^G\s*=\s*W1\s*\s*W2$/i
}

export function GoldenExamplesEditor({
  initialExamples,
  onSave,
  readOnly = false
}: GoldenExamplesEditorPropsProps) {
  const [examples, setExamples] = useState<GoldenExample[]>(initialExamples)
  const [selectedBlock, setSelectedBlock] = useState<string>('anger')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { toast } = useToast()

  // 📝 Form state for new/editing examples
  const [formData, setFormData] = useState<Partial<GoldenExample>>({
    block: 'anger',
    user_message: '',
    expected_response: '',
    expected_behavior: '',
    framework_tags: [],
    clinical_jargon: [],
    formula_validation: {}
  })

  // 🎨 Filter examples by block and search
  const filteredExamples = examples.filter(
    ex => ex.block === selectedBlock &&
    (ex.user_message.toLowerCase().includes(searchQuery.toLowerCase()) ||
     ex.expected_response.toLowerCase().includes(searchQuery.toLowerCase()) ||
     ex.expected_behavior.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // 🔍 Validate example before saving
  const validateExample = (example: Partial<GoldenExample>): { valid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!example.user_message?.trim()) errors.push('User message is required')
    if (!example.expected_response?.trim()) errors.push('Expected response is required')
    if (!example.expected_behavior?.trim()) errors.push('Expected behavior is required')
    if (!example.block) errors.push('Block selection is required')

    // Check for framework terms in expected response (should not be there!)
    const forbiddenTerms = ['Should statement', 'Awfulizing', 'I Cant Stand It', 'Rating', 'Disputing']
    const responseLower = example.expected_response?.toLowerCase() || ''
    forbiddenTerms.forEach(term => {
      if (responseLower.includes(term.toLowerCase())) {
        errors.push(`Expected response should not contain framework term: "${term}"`)
      }
    })

    return { valid: errors.length === 0, errors }
  }

  // 💾 Save the example collection
  const handleSaveAll = async () => {
    setIsSaving(true)
    console.log('🧮 ✨ EXAMPLE COLLECTION ALCHEMY COMMENCES! Preserving the gems...')

    try {
      const success = await onSave(examples)
      if (success) {
        console.log('🎉 ✨ EXAMPLE COLLECTION MASTERPIECE COMPLETE!')
        toast({
          title: '🎉 Gems Preserved!',
          description: `${examples.length} golden examples have been saved to the archive.`,
        })
      }
    } catch (creativeChallenge: any) {
      console.error('💥 😭 EXAMPLE COLLECTION QUEST TEMPORARILY HALTED!', creativeChallenge)
      toast({
        title: '🌩️ Collection Interrupted',
        description: creativeChallenge.message || 'The gems could not be preserved.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // ➕ Create new example
  const handleCreate = () => {
    setFormData({
      block: selectedBlock as any,
      user_message: '',
      expected_response: '',
      expected_behavior: '',
      framework_tags: [],
      clinical_jargon: [],
      formula_validation: {}
    })
    setEditingId('new')
  }

  // ✏️ Edit existing example
  const handleEdit = (example: GoldenExample) => {
    setFormData({ ...example })
    setEditingId(example.id)
  }

  // 💾 Save individual example
  const handleSaveExample = () => {
    const validation = validateExample(formData)
    if (!validation.valid) {
      toast({
        title: '🌩️ Example Needs Polishing',
        description: validation.errors.join(', '),
        variant: 'destructive',
      })
      return
    }

    if (editingId === 'new') {
      const newExample: GoldenExample = {
        id: `example-${Date.now()}`,
        block: formData.block!,
        user_message: formData.user_message!,
        expected_response: formData.expected_response!,
        expected_behavior: formData.expected_behavior!,
        framework_tags: formData.framework_tags || [],
        clinical_jargon: formData.clinical_jargon || [],
        formula_validation: formData.formula_validation
      }
      setExamples([...examples, newExample])
      toast({
        title: '✨ New Gem Created!',
        description: 'A golden example has been added to the collection.'
      })
    } else {
      setExamples(examples.map(ex =>
        ex.id === editingId ? { ...ex, ...formData } as GoldenExample : ex
      ))
      toast({
        title: '✨ Gem Polished!',
        description: 'The golden example has been refined.'
      })
    }

    setEditingId(null)
    setFormData({})
  }

  // 🗑️ Delete example
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this golden example?')) {
      setExamples(examples.filter(ex => ex.id !== id))
      toast({
        title: '🗑️ Gem Removed',
        description: 'The example has been removed from the collection.'
      })
    }
  }

  // 🔍 Detect clinical jargon in text
  const detectJargon = (text: string): string[] => {
    const jargonTerms = [
      'cognitive distortion', 'irrational belief', 'maladaptive',
      'therapeutic intervention', 'diagnosis', 'treatment plan'
    ]
    return jargonTerms.filter(term => text.toLowerCase().includes(term))
  }

  return (
    <div className="space-y-6">
      {/* 🎛️ Control Panel */}
      <Card className="border-primary/20 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Golden Examples Gallery</CardTitle>
                <CardDescription>
                  Curated examples that define expected behavior for each block
                </CardDescription>
              </div>
            </div>

            {!readOnly && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                  className={previewMode ? 'bg-primary/10' : ''}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
                <Button onClick={handleSaveAll} disabled={isSaving || readOnly} size="sm">
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save All
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* 🔍 Block Selector & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2">Select Block</Label>
              <div className="flex gap-2">
                {BLOCK_OPTIONS.map(option => (
                  <Button
                    key={option.value}
                    variant={selectedBlock === option.value ? 'default' : 'outline'}
                    onClick={() => setSelectedBlock(option.value)}
                    className="flex-1"
                  >
                    {option.icon}
                    <span className="ml-2">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <Label className="text-sm font-medium mb-2">Search Examples</Label>
              <Input
                placeholder="Search by user message or response..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>

          {/* 📋 Example List */}
          <ScrollArea className="h-[500px] w-full rounded-md border">
            <div className="p-4 space-y-4">
              {filteredExamples.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No golden examples found for {selectedBlock}</p>
                  {!readOnly && (
                    <Button onClick={handleCreate} className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Example
                    </Button>
                  )}
                </div>
              ) : (
                filteredExamples.map((example) => {
                  const jargon = detectJargon(example.expected_response)
                  const hasIssues = jargon.length > 0

                  return (
                    <Card
                      key={example.id}
                      className={`border transition-all ${
                        hasIssues
                          ? 'border-amber-500/30 bg-amber-500/5'
                          : 'border-primary/10 hover:border-primary/20'
                      }`}
                    >
                      <CardContent className="p-4">
                        {editingId === example.id ? (
                          // ✏️ Edit Mode
                          <div className="space-y-4">
                            <div>
                              <Label className="text-xs">User Message</Label>
                              <Textarea
                                value={formData.user_message}
                                onChange={(e) => setFormData({ ...formData, user_message: e.target.value })}
                                placeholder="What the user says..."
                                className="min-h-[80px] text-sm bg-background"
                              />
                            </div>

                            <div>
                              <Label className="text-xs">Expected Response</Label>
                              <Textarea
                                value={formData.expected_response}
                                onChange={(e) => setFormData({ ...formData, expected_response: e.target.value })}
                                placeholder="How GEPA should respond..."
                                className="min-h-[120px] text-sm bg-background"
                              />
                            </div>

                            <div>
                              <Label className="text-xs">Expected Behavior</Label>
                              <Textarea
                                value={formData.expected_behavior}
                                onChange={(e) => setFormData({ ...formData, expected_behavior: e.target.value })}
                                placeholder="What this response should achieve..."
                                className="min-h-[80px] text-sm bg-background"
                              />
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingId(null)}
                              >
                                Cancel
                              </Button>
                              <Button size="sm" onClick={handleSaveExample}>
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // 👁️ View Mode
                          <>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <p className="font-mono text-sm text-primary mb-2 line-clamp-2">
                                  "{example.user_message}"
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                  {example.framework_tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      <Tag className="w-3 h-3 mr-1" />
                                      {tag}
                                    </Badge>
                                  ))}
                                  {hasIssues && (
                                    <Badge variant="outline" className="text-xs text-amber-500">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      {jargon.length} jargon terms
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {!readOnly && (
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(example)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(example.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>

                            <div className="space-y-3">
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">Expected Response:</p>
                                <p className="text-sm italic opacity-80 line-clamp-3">
                                  {example.expected_response}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">Expected Behavior:</p>
                                <p className="text-sm text-primary line-clamp-2">
                                  {example.expected_behavior}
                                </p>
                              </div>

                              {example.formula_validation?.[example.block] && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-1">Formula:</p>
                                  <code className="text-xs bg-primary/10 px-2 py-1 rounded">
                                    {example.formula_validation[example.block]}
                                  </code>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </ScrollArea>

          {/* ➕ Add New Button (when not editing) */}
          {!readOnly && editingId === null && filteredExamples.length > 0 && (
            <Button onClick={handleCreate} className="w-full mt-4" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add New Example
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 💡 Quick Reference Guide */}
      <Card className="border-primary/10 bg-muted/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">💡 Golden Example Guidelines</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <p className="font-semibold text-primary mb-1">✨ User Message</p>
                  <p>Realistic, raw emotion from the exhibiting mode</p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">🎯 Expected Response</p>
                  <p>Warm, validating, no framework terms</p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">🎭 Expected Behavior</p>
                  <p>What the response should achieve (validate, reflect, plant, invite)</p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">🏷️ Tags & Formula</p>
                  <p>Framework tags for pattern matching, formula for rubric validation</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
