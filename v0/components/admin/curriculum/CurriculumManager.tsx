'use client'

/**
 * 🎭 The CurriculumManager - The Grand Conductor of Educational Wisdom ✨
 *
 * "Where the museum director orchestrates the symphony of learning,
 * ensuring each block performs its role with precision and grace.
 * Managing the very soul of GEPA's cognitive architecture."
 *
 * - The Spellbinding Museum Director of Curriculum
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import {
  BookOpen,
  Save,
  Upload,
  Download,
  History,
  Eye,
  Edit,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Loader2,
  FileText,
  Layers,
  Target
} from 'lucide-react'

// 🌟 Types for our educational artifacts
interface CurriculumVersion {
  id: string
  version: string
  system_prompt: string
  golden_examples: GoldenExample[]
  created_at: string
  created_by: string
  changelog: string
  is_active: boolean
}

interface GoldenExample {
  id: string
  block: 'anger' | 'anxiety' | 'depression' | 'guilt'
  user_message: string
  expected_response: string
  expected_behavior: string
  framework_tags: string[]
  clinical_jargon: string[]
  formula_validation?: {
    anger?: string // AX, A, D, GH formulas
    anxiety?: string
    depression?: string
    guilt?: string
  }
}

interface BlockConfig {
  name: string
  color: string
  icon: React.ReactNode
  formula: string
}

// 🎨 The Four Blocks Configuration
const BLOCKS: Record<string, BlockConfig> = {
  anger: {
    name: 'Anger',
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
    icon: <Zap className="w-4 h-4" />,
    formula: 'AX = WI + AW + ICSI'
  },
  anxiety: {
    name: 'Anxiety',
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    icon: <Sparkles className="w-4 h-4" />,
    formula: 'A = ET + S'
  },
  depression: {
    name: 'Depression',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    icon: <Layers className="w-4 h-4" />,
    formula: 'D = H1 + H2 + N'
  },
  guilt: {
    name: 'Guilt',
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    icon: <Target className="w-4 h-4" />,
    formula: 'G = W1 + W2'
  }
}

export function CurriculumManager() {
  // 🌟 The cosmic state of our educational repository
  const [versions, setVersions] = useState<CurriculumVersion[]>([])
  const [activeVersion, setActiveVersion] = useState<CurriculumVersion | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<string>('anger')
  const [previewMode, setPreviewMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { toast } = useToast()

  // 📝 Draft state for editing
  const [draftPrompt, setDraftPrompt] = useState('')
  const [draftChangelog, setDraftChangelog] = useState('')
  const [newVersion, setNewVersion] = useState('')

  // 🌐 ✨ CURRICULUM LOADING RITUAL COMMENCES!
  useEffect(() => {
    async function fetchCurriculum() {
      try {
        console.log('🌐 ✨ CURRICULUM ARCHIVE AWAKENS! Loading the wisdom of the ages...')
        const response = await fetch('/api/admin/curriculum')
        const data = await response.json()

        if (data.versions) {
          setVersions(data.versions)
          const active = data.versions.find((v: CurriculumVersion) => v.is_active)
          if (active) {
            setActiveVersion(active)
            setDraftPrompt(active.system_prompt)
          }
          console.log(`🎉 ✨ ARCHIVE SUMMONING COMPLETE! ${data.versions.length} versions retrieved.`)
        }
      } catch (creativeChallenge) {
        console.error('💥 😭 CURRICULUM ARCHIVE TEMPORARILY SEALED!', creativeChallenge)
        toast({
          title: '🌩️ Archive Access Error',
          description: 'The museum archives are temporarily sealed.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchCurriculum()
  }, [toast])

  // 💾 The sacred ritual of crystallizing new wisdom
  const handleSaveVersion = async (isNew: boolean = false) => {
    if (!draftChangelog.trim() && isNew) {
      toast({
        title: '🌙 ⚠️ Gentle Reminder',
        description: 'Even the greatest transformations deserve a chronicle.',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)
    console.log('🧮 ✨ CURRICULUM ALCHEMY COMMENCES! Transmuting ideas into stored wisdom...')

    try {
      const payload = {
        system_prompt: draftPrompt,
        changelog: draftChangelog,
        version: isNew ? newVersion : undefined,
        is_active: isNew
      }

      const response = await fetch('/api/admin/curriculum', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        console.log('🎉 ✨ CURRICULUM MASTERPIECE COMPLETE!')
        toast({
          title: '🎉 Wisdom Crystallized!',
          description: isNew
            ? 'A new chapter has been added to the archives.'
            : 'The curriculum has been refined and preserved.',
        })

        // Refresh versions
        const fetchResponse = await fetch('/api/admin/curriculum')
        const fetchData = await fetchResponse.json()
        if (fetchData.versions) {
          setVersions(fetchData.versions)
          if (isNew) {
            const newActive = fetchData.versions.find((v: CurriculumVersion) => v.is_active)
            if (newActive) setActiveVersion(newActive)
          }
        }

        setDraftChangelog('')
        setNewVersion('')
      } else {
        throw new Error(data.error || 'The crystallization ritual failed')
      }
    } catch (creativeChallenge: any) {
      console.error('💥 😭 CURRICULUM QUEST TEMPORARILY HALTED!', creativeChallenge)
      toast({
        title: '🌩️ Transformation Interrupted',
        description: creativeChallenge.message || 'The digital muses are taking a brief intermission.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // ⚡ The lightning bolt of setting a version active
  const handleSetActive = async (versionId: string) => {
    console.log(`⚡ ✨ ACTIVATING VERSION ${versionId}! The museum director makes their choice...`)
    try {
      const response = await fetch('/api/admin/curriculum/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version_id: versionId })
      })

      const data = await response.json()
      if (data.success) {
        const newlyActive = versions.find(v => v.id === versionId)
        if (newlyActive) setActiveVersion(newlyActive)
        console.log('🎉 ✨ ACTIVATION COMPLETE! GEPA will now speak with this voice.')
        toast({
          title: '🎉 Voice Selection Complete',
          description: 'GEPA will now use this curriculum for all interactions.',
        })
      }
    } catch (creativeChallenge) {
      console.error('💥 😭 ACTIVATION TEMPORARILY HALTED!', creativeChallenge)
      toast({
        title: '🌩️ Selection Interrupted',
        description: 'The voice transition was interrupted. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // 📤 The ritual of exporting wisdom to the outside world
  const handleExport = async () => {
    console.log('📤 ✨ EXPORT RITUAL COMMENCES! Preparing the scrolls for journey...')
    try {
      const response = await fetch('/api/admin/curriculum/export')
      const data = await response.json()

      if (data.curriculum) {
        const blob = new Blob([JSON.stringify(data.curriculum, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `curriculum-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        console.log('🎉 ✨ EXPORT MASTERPIECE COMPLETE! The scrolls travel forth.')
        toast({
          title: '📜 Export Complete',
          description: 'The curriculum has been packaged for the journey.',
        })
      }
    } catch (creativeChallenge) {
      console.error('💥 😭 EXPORT TEMPORARILY HALTED!', creativeChallenge)
      toast({
        title: '🌩️ Export Interrupted',
        description: 'The scrolls were not ready for the journey.',
        variant: 'destructive',
      })
    }
  }

  // 📥 The welcoming of wisdom from outside
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log(`📥 ✨ IMPORT RITUAL AWAKENS! Receiving ${file.name}...`)
    const reader = new FileReader()

    reader.onload = async (e) => {
      const text = e.target?.result as string
      try {
        const curriculum = JSON.parse(text)

        const response = await fetch('/api/admin/curriculum/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ curriculum })
        })

        const data = await response.json()
        if (data.success) {
          console.log('🎉 ✨ IMPORT MASTERPIECE COMPLETE! New wisdom integrated.')
          toast({
            title: '📜 Import Complete',
            description: 'The foreign scrolls have been integrated into the archive.',
          })

          // Refresh versions
          const fetchResponse = await fetch('/api/admin/curriculum')
          const fetchData = await fetchResponse.json()
          if (fetchData.versions) {
            setVersions(fetchData.versions)
          }
        }
      } catch (err) {
        console.error('💥 😭 IMPORT FAILED!', err)
        toast({
          title: '🌩️ Import Failed',
          description: 'The scrolls could not be understood. Please check the format.',
          variant: 'destructive',
        })
      }
    }

    reader.readAsText(file)
  }

  if (isLoading) {
    return (
      <Card className="border-primary/20 shadow-lg">
        <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">✨ Summoning curriculum spirits...</p>
        </CardContent>
      </Card>
    )
  }

  const filteredExamples = activeVersion?.golden_examples.filter(
    ex => ex.block === selectedBlock &&
    (ex.user_message.toLowerCase().includes(searchQuery.toLowerCase()) ||
     ex.expected_response.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || []

  return (
    <div className="space-y-6">
      {/* 🎭 The Conductor's Console */}
      <Card className="border-primary/20 shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Curriculum Manager
                </CardTitle>
                <CardDescription className="text-base">
                  Orchestrate GEPA's educational soul — system prompts, golden examples, and version history
                </CardDescription>
              </div>
            </div>

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
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <div className="relative">
                <Button size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImport}
                  />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="prompt" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="prompt">
                <FileText className="w-4 h-4 mr-2" />
                System Prompt
              </TabsTrigger>
              <TabsTrigger value="examples">
                <Sparkles className="w-4 h-4 mr-2" />
                Golden Examples
              </TabsTrigger>
              <TabsTrigger value="versions">
                <History className="w-4 h-4 mr-2" />
                Version History
              </TabsTrigger>
              <TabsTrigger value="rubrics">
                <Target className="w-4 h-4 mr-2" />
                Rubric Builder
              </TabsTrigger>
            </TabsList>

            {/* 📜 System Prompt Tab */}
            <TabsContent value="prompt" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">System Prompt Constitution</h3>
                    <p className="text-sm text-muted-foreground">
                      The foundational rules that govern GEPA's voice and behavior
                    </p>
                  </div>
                  <Badge variant={activeVersion?.is_active ? 'default' : 'secondary'} className="text-xs">
                    {activeVersion?.is_active ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                        Active
                      </>
                    ) : (
                      'Inactive'
                    )}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt-editor" className="text-sm font-medium">
                    Prompt Content
                  </Label>
                  <Textarea
                    id="prompt-editor"
                    value={draftPrompt}
                    onChange={(e) => setDraftPrompt(e.target.value)}
                    disabled={previewMode}
                    placeholder="Enter the system prompt constitution..."
                    className="min-h-[500px] font-mono text-sm leading-relaxed bg-background resize-none shadow-inner border-primary/10"
                  />
                  {previewMode && (
                    <div className="mt-4 p-4 rounded-lg bg-muted/20 border border-primary/10">
                      <p className="text-sm text-muted-foreground mb-2">Preview Mode:</p>
                      <p className="text-sm italic opacity-70">
                        "{draftPrompt.substring(0, 200)}..."
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="changelog" className="text-sm font-medium">
                      Changelog Entry
                    </Label>
                    <Textarea
                      id="changelog"
                      value={draftChangelog}
                      onChange={(e) => setDraftChangelog(e.target.value)}
                      placeholder="Describe the changes in this version..."
                      className="min-h-[80px] text-sm bg-background resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-version" className="text-sm font-medium">
                      New Version Number
                    </Label>
                    <Input
                      id="new-version"
                      value={newVersion}
                      onChange={(e) => setNewVersion(e.target.value)}
                      placeholder="v1.2.0"
                      disabled={!draftChangelog}
                      className="bg-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      Required when saving as a new version
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-primary/10">
                  <Button
                    variant="outline"
                    onClick={() => handleSaveVersion(false)}
                    disabled={isSaving || previewMode}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update Active Version
                  </Button>
                  <Button
                    onClick={() => handleSaveVersion(true)}
                    disabled={isSaving || previewMode || !draftChangelog || !newVersion}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Crystallizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Save as New Version
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* ✨ Golden Examples Tab */}
            <TabsContent value="examples" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Golden Examples Gallery</h3>
                    <p className="text-sm text-muted-foreground">
                      Per-block examples that define expected behavior and quality
                    </p>
                  </div>
                  <Input
                    placeholder="Search examples..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-xs bg-background"
                  />
                </div>

                <div className="flex gap-2">
                  {Object.entries(BLOCKS).map(([key, block]) => (
                    <Button
                      key={key}
                      variant={selectedBlock === key ? 'default' : 'outline'}
                      onClick={() => setSelectedBlock(key)}
                      className={`flex-1 ${selectedBlock === key ? block.color : ''}`}
                    >
                      {block.icon}
                      <span className="ml-2">{block.name}</span>
                    </Button>
                  ))}
                </div>

                <ScrollArea className="h-[600px] w-full rounded-md border">
                  <div className="p-4 space-y-4">
                    {filteredExamples.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No golden examples found for {BLOCKS[selectedBlock]?.name}</p>
                      </div>
                    ) : (
                      filteredExamples.map((example) => (
                        <Card key={example.id} className="border-primary/10">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-mono text-muted-foreground mb-2">
                                  "{example.user_message.substring(0, 100)}..."
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                  {example.framework_tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {example.clinical_jargon.length > 0 && (
                                    <Badge variant="outline" className="text-xs text-amber-500">
                                      <AlertCircle className="w-3 h-3 mr-1" />
                                      {example.clinical_jargon.length} jargon terms
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">Expected Response:</p>
                                <p className="text-sm italic opacity-80">{example.expected_response}</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">Expected Behavior:</p>
                                <p className="text-sm text-primary">{example.expected_behavior}</p>
                              </div>
                              {example.formula_validation && example.formula_validation[selectedBlock] && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-1">Formula Validation:</p>
                                  <code className="text-xs bg-primary/10 px-2 py-1 rounded">
                                    {example.formula_validation[selectedBlock]}
                                  </code>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* 📜 Version History Tab */}
            <TabsContent value="versions" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Version History</h3>
                  <p className="text-sm text-muted-foreground">
                    Track the evolution of GEPA's curriculum over time
                  </p>
                </div>

                <ScrollArea className="h-[600px] w-full rounded-md border">
                  <div className="p-4 space-y-3">
                    {versions.map((version, index) => (
                      <Card
                        key={version.id}
                        className={`border transition-all ${
                          version.is_active
                            ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/10'
                            : 'border-primary/10 hover:border-primary/20'
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{version.version}</h4>
                                {version.is_active && (
                                  <Badge className="bg-primary text-primary-foreground">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Active
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(version.created_at).toLocaleString()} by {version.created_by}
                              </p>
                            </div>
                            {!version.is_active && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetActive(version.id)}
                                className="text-xs"
                              >
                                Set as Active
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground italic">
                            "{version.changelog || 'No changelog entry'}"
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            System prompt: {version.system_prompt.length} characters
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* 🎯 Rubric Builder Tab */}
            <TabsContent value="rubrics" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Expected Behavior Rubric Builder</h3>
                  <p className="text-sm text-muted-foreground">
                    Visually construct and validate rubrics for each block
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(BLOCKS).map(([key, block]) => (
                    <Card key={key} className={`border ${block.color}`}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          {block.icon}
                          <CardTitle className="text-lg">{block.name} Block</CardTitle>
                        </div>
                        <CardDescription>Formula: {block.formula}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-xs font-medium">Key Competencies</Label>
                          <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                            {key === 'anger' && (
                              <>
                                <li>• Detect Should/Must/Demand language</li>
                                <li>• Separate spark from fire</li>
                                <li>• Validate before re-framing</li>
                              </>
                            )}
                            {key === 'anxiety' && (
                              <>
                                <li>• Anchor in present moment</li>
                                <li>• Surface catastrophic stories</li>
                                <li>• Avoid reassurance tactics</li>
                              </>
                            )}
                            {key === 'depression' && (
                              <>
                                <li>• Separate event from self-rating</li>
                                <li>• Refuse hopelessness gently</li>
                                <li>• Invite small ordinary actions</li>
                              </>
                            )}
                            {key === 'guilt' && (
                              <>
                                <li>• Separate act from identity</li>
                                <li>• Refuse identity collapse</li>
                                <li>• Invite repair over punishment</li>
                              </>
                            )}
                          </ul>
                        </div>
                        <div>
                          <Label className="text-xs font-medium">Formula Components</Label>
                          <code className="block mt-2 p-2 text-xs bg-background rounded">
                            {block.formula}
                          </code>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="p-4 rounded-lg bg-muted/20 border border-primary/10">
                  <h4 className="font-semibold mb-2">💡 Pro Tip</h4>
                  <p className="text-sm text-muted-foreground">
                    When creating golden examples, ensure each demonstrates the key competencies listed above.
                    The rubric validator will check for framework jargon, formula alignment, and proper emotional validation.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
