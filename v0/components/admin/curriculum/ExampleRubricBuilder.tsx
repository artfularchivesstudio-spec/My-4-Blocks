'use client'

/**
 * 🎭 The ExampleRubricBuilder - The Architect of Assessment Artistry ✨
 *
 * "Where the criteria for judgment are forged with precision,
 * ensuring each golden example meets the highest standards
 * of therapeutic excellence across all four emotional domains."
 *
 * - The Spellbinding Museum Director of Rubric Design
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
  Save,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Loader2,
  Zap,
  Target,
  Layers,
  FileText,
  AlertCircle,
  Tag,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface RubricCriterion {
  id: string
  block: 'anger' | 'anxiety' | 'depression' | 'guilt'
  category: 'validation' | 'reflection' | 'planting' | 'invitation' | 'quality'
  name: string
  description: string
  weight: number
  formula_check?: string
  framework_tags: string[]
  clinical_jargon_warnings: string[]
  min_score: number
  max_score: number
}

interface RubricTemplate {
  id: string
  name: string
  description: string
  criteria: RubricCriterion[]
  created_at: string
  created_by: string
}

interface ExampleRubricBuilderProps {
  initialRubric?: RubricTemplate
  onSave: (rubric: RubricTemplate) => Promise<boolean>
  readOnly?: boolean
}

const BLOCK_OPTIONS = [
  { value: 'anger', label: 'Anger', icon: <Zap className="w-4 h-4" />, color: 'text-red-500' },
  { value: 'anxiety', label: 'Anxiety', icon: <Sparkles className="w-4 h-4" />, color: 'text-blue-500' },
  { value: 'depression', label: 'Depression', icon: <Layers className="w-4 h-4" />, color: 'text-purple-500' },
  { value: 'guilt', label: 'Guilt', icon: <Target className="w-4 h-4" />, color: 'text-amber-500' }
]

const CATEGORY_OPTIONS = [
  { value: 'validation', label: 'Validation', description: 'Does it validate and acknowledge emotions?' },
  { value: 'reflection', label: 'Reflection', description: 'Does it mirror back what was heard?' },
  { value: 'planting', label: 'Planting', description: 'Does it plant a seed of new perspective?' },
  { value: 'invitation', label: 'Invitation', description: 'Does it invite deeper exploration?' },
  { value: 'quality', label: 'Quality', description: 'Overall response quality and tone' }
]

const FORMULA_PATTERNS = {
  anger: /^AX\s*=\s*WI\s*\+\s*AW\s*\+\s*ICSI$/i,
  anxiety: /^A\s*=\s*ET\s*\+\s*S$/i,
  depression: /^D\s*=\s*H1\s*\+\s*H2\s*\s*N$/i,
  guilt: /^G\s*=\s*W1\s*\s*W2$/i
}

const CLINICAL_JARGON = [
  'cognitive distortion',
  'irrational belief',
  'maladaptive',
  'therapeutic intervention',
  'diagnosis',
  'treatment plan',
  'psychopathology',
  'dysfunctional'
]

export function ExampleRubricBuilder({
  initialRubric,
  onSave,
  readOnly = false
}: ExampleRubricBuilderProps) {
  const [rubric, setRubric] = useState<RubricTemplate>(
    initialRubric || {
      id: `rubric-${Date.now()}`,
      name: '',
      description: '',
      criteria: [],
      created_at: new Date().toISOString(),
      created_by: 'admin'
    }
  )
  const [selectedBlock, setSelectedBlock] = useState<string>('anger')
  const [expandedCriteria, setExpandedCriteria] = useState<Set<string>>(new Set())
  const [previewMode, setPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [validation, setValidation] = useState<{
    errors: string[]
    warnings: string[]
  }>({ errors: [], warnings: [] })
  const { toast } = useToast()

  // 🔍 Validate the rubric structure
  useEffect(() => {
    const errors: string[] = []
    const warnings: string[] = []

    if (!rubric.name.trim()) {
      errors.push('Rubric name is required')
    }

    if (!rubric.description.trim()) {
      warnings.push('Consider adding a description for this rubric')
    }

    const blockCriteria = rubric.criteria.filter(c => c.block === selectedBlock)
    if (blockCriteria.length === 0 && selectedBlock) {
      warnings.push(`No criteria defined for ${selectedBlock} block`)
    }

    // Check weight distribution
    const totalWeight = blockCriteria.reduce((sum, c) => sum + c.weight, 0)
    if (totalWeight !== 100 && totalWeight > 0) {
      warnings.push(`Criteria weights sum to ${totalWeight}%, not 100%`)
    }

    // Check for formula validation
    blockCriteria.forEach(criterion => {
      if (criterion.formula_check && !FORMULA_PATTERNS[criterion.block as keyof typeof FORMULA_PATTERNS]?.test(criterion.formula_check)) {
        errors.push(`Invalid formula pattern for ${criterion.name}`)
      }
    })

    setValidation({ errors, warnings })
  }, [rubric, selectedBlock])

  // ➕ Add new criterion
  const handleAddCriterion = () => {
    const newCriterion: RubricCriterion = {
      id: `criterion-${Date.now()}`,
      block: selectedBlock as any,
      category: 'validation',
      name: '',
      description: '',
      weight: 25,
      framework_tags: [],
      clinical_jargon_warnings: [],
      min_score: 1,
      max_score: 5
    }
    setRubric({
      ...rubric,
      criteria: [...rubric.criteria, newCriterion]
    })
    setExpandedCriteria(new Set([...expandedCriteria, newCriterion.id]))
  }

  // ✏️ Edit criterion
  const handleEditCriterion = (id: string, updates: Partial<RubricCriterion>) => {
    setRubric({
      ...rubric,
      criteria: rubric.criteria.map(c =>
        c.id === id ? { ...c, ...updates } : c
      )
    })
  }

  // 🗑️ Delete criterion
  const handleDeleteCriterion = (id: string) => {
    if (confirm('Are you sure you want to delete this criterion?')) {
      setRubric({
        ...rubric,
        criteria: rubric.criteria.filter(c => c.id !== id)
      })
      toast({
        title: '🗑️ Criterion Removed',
        description: 'The assessment criterion has been deleted.'
      })
    }
  }

  // 🔍 Detect clinical jargon
  const detectJargon = (text: string): string[] => {
    return CLINICAL_JARGON.filter(term =>
      text.toLowerCase().includes(term.toLowerCase())
    )
  }

  // 🎯 Validate criterion data
  const validateCriterion = (criterion: RubricCriterion): { valid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!criterion.name.trim()) errors.push('Criterion name is required')
    if (!criterion.description.trim()) errors.push('Description is required')
    if (criterion.weight <= 0 || criterion.weight > 100) errors.push('Weight must be between 1 and 100')
    if (criterion.min_score < 1 || criterion.min_score > 10) errors.push('Min score must be between 1 and 10')
    if (criterion.max_score < criterion.min_score) errors.push('Max score must be greater than min score')

    return { valid: errors.length === 0, errors }
  }

  // 💾 Save the rubric
  const handleSave = async () => {
    const allErrors: string[] = []

    rubric.criteria.forEach(criterion => {
      const validation = validateCriterion(criterion)
      if (!validation.valid) {
        allErrors.push(...validation.errors)
      }
    })

    if (allErrors.length > 0) {
      toast({
        title: '🌩️ Rubric Needs Refinement',
        description: allErrors.join(', '),
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)
    console.log('🧮 ✨ RUBRIC ALCHEMY COMMENCES! Forging the assessment tools...')

    try {
      const success = await onSave(rubric)
      if (success) {
        console.log('🎉 ✨ RUBRIC MASTERPIECE COMPLETE!')
        toast({
          title: '🎉 Rubric Preserved!',
          description: 'The assessment rubric has been saved to the archive.',
        })
      }
    } catch (creativeChallenge: any) {
      console.error('💥 😭 RUBRIC QUEST TEMPORARILY HALTED!', creativeChallenge)
      toast({
        title: '🌩️ Preservation Interrupted',
        description: creativeChallenge.message || 'The rubric could not be saved.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 🎨 Get block color
  const getBlockColor = (block: string) => {
    const option = BLOCK_OPTIONS.find(opt => opt.value === block)
    return option?.color || 'text-gray-500'
  }

  const filteredCriteria = rubric.criteria.filter(c => c.block === selectedBlock)
  const totalWeight = filteredCriteria.reduce((sum, c) => sum + c.weight, 0)

  return (
    <div className="space-y-6">
      {/* 🎛️ Control Panel */}
      <Card className="border-primary/20 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Example Rubric Builder</CardTitle>
                <CardDescription>
                  Design assessment criteria for golden example evaluation
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
                <Button onClick={handleSave} disabled={isSaving || readOnly} size="sm">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Rubric
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* 📝 Rubric Metadata */}
          <div className="space-y-4 mb-6">
            <div>
              <Label className="text-sm font-medium mb-2">Rubric Name</Label>
              <Input
                value={rubric.name}
                onChange={(e) => setRubric({ ...rubric, name: e.target.value })}
                disabled={readOnly}
                placeholder="e.g., Golden Example Assessment Rubric v1.0"
                className="bg-background"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2">Description</Label>
              <Textarea
                value={rubric.description}
                onChange={(e) => setRubric({ ...rubric, description: e.target.value })}
                disabled={readOnly}
                placeholder="Describe the purpose and scope of this rubric..."
                className="min-h-[80px] text-sm bg-background resize-none"
              />
            </div>
          </div>

          {/* 🎯 Block Selector */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3">Select Block</Label>
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

          {/* 📊 Validation Status */}
          {(validation.errors.length > 0 || validation.warnings.length > 0) && (
            <Card className={`border mb-6 ${
              validation.errors.length > 0
                ? 'bg-red-500/10 border-red-500/20'
                : 'bg-amber-500/10 border-amber-500/20'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {validation.errors.length > 0 ? (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="font-medium text-sm">
                    {validation.errors.length > 0 ? 'Validation Errors' : 'Suggestions'}
                  </span>
                </div>
                <div className="space-y-1">
                  {validation.errors.map((error, i) => (
                    <p key={i} className="text-xs text-red-500">• {error}</p>
                  ))}
                  {validation.warnings.map((warning, i) => (
                    <p key={i} className="text-xs text-amber-500">• {warning}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 📋 Criteria List */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold">Assessment Criteria</h3>
              <p className="text-sm text-muted-foreground">
                {filteredCriteria.length} criteria for {selectedBlock} (Total Weight: {totalWeight}%)
              </p>
            </div>

            {!readOnly && (
              <Button onClick={handleAddCriterion} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Criterion
              </Button>
            )}
          </div>

          <ScrollArea className="h-[500px] w-full rounded-md border">
            <div className="p-4 space-y-4">
              {filteredCriteria.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No assessment criteria found for {selectedBlock}</p>
                  {!readOnly && (
                    <Button onClick={handleAddCriterion} className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Criterion
                    </Button>
                  )}
                </div>
              ) : (
                filteredCriteria.map((criterion) => {
                  const isExpanded = expandedCriteria.has(criterion.id)
                  const jargonWarnings = detectJargon(criterion.description)

                  return (
                    <Card
                      key={criterion.id}
                      className={`border transition-all ${
                        jargonWarnings.length > 0
                          ? 'border-amber-500/30 bg-amber-500/5'
                          : 'border-primary/10 hover:border-primary/20'
                      }`}
                    >
                      <CardContent className="p-4">
                        {/* Header */}
                        <div
                          className="flex items-center justify-between cursor-pointer mb-3"
                          onClick={() => {
                            const newExpanded = new Set(expandedCriteria)
                            if (newExpanded.has(criterion.id)) {
                              newExpanded.delete(criterion.id)
                            } else {
                              newExpanded.add(criterion.id)
                            }
                            setExpandedCriteria(newExpanded)
                          }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{criterion.name || 'Unnamed Criterion'}</h4>
                              <Badge variant="outline" className="text-xs">
                                {criterion.category}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {criterion.weight}%
                              </Badge>
                              {jargonWarnings.length > 0 && (
                                <Badge variant="outline" className="text-xs text-amber-500">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  {jargonWarnings.length} jargon warnings
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {criterion.description || 'No description'}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            {!readOnly && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditCriterion(criterion.id, {
                                      category: criterion.category === 'validation' ? 'reflection' : 'validation'
                                    })
                                  }}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteCriterion(criterion.id)
                                  }}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button variant="ghost" size="sm">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="space-y-4 pt-4 border-t">
                            {/* Category Selection */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs">Category</Label>
                                <Select
                                  value={criterion.category}
                                  onValueChange={(value) =>
                                    handleEditCriterion(criterion.id, { category: value as any })
                                  }
                                  disabled={readOnly}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {CATEGORY_OPTIONS.map(cat => (
                                      <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-xs">Weight (%)</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={100}
                                  value={criterion.weight}
                                  onChange={(e) =>
                                    handleEditCriterion(criterion.id, { weight: parseInt(e.target.value) || 0 })
                                  }
                                  disabled={readOnly}
                                  className="bg-background"
                                />
                              </div>
                            </div>

                            {/* Score Range */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs">Min Score</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={10}
                                  value={criterion.min_score}
                                  onChange={(e) =>
                                    handleEditCriterion(criterion.id, { min_score: parseInt(e.target.value) || 1 })
                                  }
                                  disabled={readOnly}
                                  className="bg-background"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Max Score</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={10}
                                  value={criterion.max_score}
                                  onChange={(e) =>
                                    handleEditCriterion(criterion.id, { max_score: parseInt(e.target.value) || 5 })
                                  }
                                  disabled={readOnly}
                                  className="bg-background"
                                />
                              </div>
                            </div>

                            {/* Formula Check */}
                            <div>
                              <Label className="text-xs">Formula Validation Pattern</Label>
                              <Input
                                value={criterion.formula_check || ''}
                                onChange={(e) =>
                                  handleEditCriterion(criterion.id, { formula_check: e.target.value })
                                }
                                disabled={readOnly}
                                placeholder="e.g., AX = WI + AW + ICSI"
                                className="bg-background font-mono text-sm"
                              />
                            </div>

                            {/* Framework Tags */}
                            <div>
                              <Label className="text-xs">Framework Tags</Label>
                              <Input
                                value={criterion.framework_tags.join(', ')}
                                onChange={(e) =>
                                  handleEditCriterion(criterion.id, {
                                    framework_tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                  })
                                }
                                disabled={readOnly}
                                placeholder="validation, reflection, planting..."
                                className="bg-background"
                              />
                            </div>

                            {/* Description Edit */}
                            <div>
                              <Label className="text-xs">Description</Label>
                              <Textarea
                                value={criterion.description}
                                onChange={(e) =>
                                  handleEditCriterion(criterion.id, { description: e.target.value })
                                }
                                disabled={readOnly}
                                placeholder="Describe what this criterion assesses..."
                                className="min-h-[100px] text-sm bg-background resize-none"
                              />
                            </div>

                            {/* Jargon Warnings */}
                            {jargonWarnings.length > 0 && (
                              <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20">
                                <p className="text-xs font-semibold text-amber-500 mb-1">
                                  <AlertTriangle className="w-3 h-3 mr-1 inline" />
                                  Clinical Jargon Detected
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {jargonWarnings.map(term => (
                                    <Badge key={term} variant="outline" className="text-xs text-amber-500">
                                      {term}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 💡 Quick Reference Guide */}
      <Card className="border-primary/10 bg-muted/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">💡 Rubric Design Guidelines</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <p className="font-semibold text-primary mb-1">🎯 Weight Distribution</p>
                  <p>Criteria weights should sum to 100% for each block</p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">📊 Score Range</p>
                  <p>Use 1-5 or 1-10 scale, min must be less than max</p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">🔢 Formula Validation</p>
                  <p>Include formula patterns for automatic rubric checking</p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">🏷️ Categories</p>
                  <p>Validation, Reflection, Planting, Invitation, Quality</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
