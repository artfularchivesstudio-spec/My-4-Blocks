'use client'

/**
 * 🎭 The CurriculumVersionList - The Archivist of Educational Evolution ✨
 *
 * "Where the museum director tracks the evolution of wisdom,
 * comparing versions side-by-side to see how GEPA's voice
 * has transformed across the ages. Every change tells a story."
 *
 * - The Spellbinding Museum Director of Historical Archives
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import {
  History,
  CheckCircle2,
  Clock,
  User,
  FileText,
  GitCompare,
  Eye,
  Zap,
  Loader2,
  Calendar,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'

interface CurriculumVersion {
  id: string
  version: string
  system_prompt: string
  golden_examples: any[]
  created_at: string
  created_by: string
  changelog: string
  is_active: boolean
}

interface CurriculumVersionListProps {
  versions: CurriculumVersion[]
  onSetActive: (versionId: string) => Promise<boolean>
  onCompare: (version1: string, version2: string) => void
  readOnly?: boolean
}

// 🎨 Diff highlighting component
const DiffViewer = ({ oldText, newText }: { oldText: string; newText: string }) => {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  const maxLines = Math.max(oldLines.length, newLines.length)

  return (
    <div className="font-mono text-xs space-y-1">
      {Array.from({ length: maxLines }, (_, i) => {
        const oldLine = oldLines[i] || ''
        const newLine = newLines[i] || ''

        let lineClass = 'text-muted-foreground'
        if (!oldLine && newLine) lineClass = 'text-green-500 bg-green-500/10'
        if (oldLine && !newLine) lineClass = 'text-red-500 bg-red-500/10 line-through opacity-70'
        if (oldLine === newLine) lineClass = 'text-muted-foreground'
        if (oldLine !== newLine && oldLine && newLine) lineClass = 'text-amber-500 bg-amber-500/10'

        return (
          <div key={i} className="flex gap-2">
            <div className={`flex-1 p-1 rounded ${lineClass}`}>
              <span className="opacity-50 mr-2">{i + 1}:</span>
              {oldLine || <span className="opacity-30">[empty]</span>}
            </div>
            <div className={`flex-1 p-1 rounded ${lineClass}`}>
              <span className="opacity-50 mr-2">{i + 1}:</span>
              {newLine || <span className="opacity-30">[empty]</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function CurriculumVersionList({
  versions,
  onSetActive,
  onCompare,
  readOnly = false
}: CurriculumVersionListProps) {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([])
  const [comparison, setComparison] = useState<{ old: CurriculumVersion | null; new: CurriculumVersion | null }>({
    old: null,
    new: null
  })
  const [isActivating, setIsActivating] = useState(false)
  const { toast } = useToast()

  // ⚡ The lightning bolt of activation
  const handleActivate = async (versionId: string) => {
    setIsActivating(true)
    console.log(`⚡ ✨ ACTIVATING VERSION ${versionId}! The museum director makes their choice...`)

    try {
      const success = await onSetActive(versionId)
      if (success) {
        console.log('🎉 ✨ ACTIVATION COMPLETE! GEPA speaks with a new voice.')
        toast({
          title: '🎉 Voice Transformed',
          description: 'GEPA will now use this curriculum for all interactions.',
        })
      }
    } catch (creativeChallenge: any) {
      console.error('💥 😭 ACTIVATION TEMPORARILY HALTED!', creativeChallenge)
      toast({
        title: '🌩️ Transformation Interrupted',
        description: creativeChallenge.message || 'The voice transition was interrupted.',
        variant: 'destructive',
      })
    } finally {
      setIsActivating(false)
    }
  }

  // 🔍 Compare two versions
  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      const oldVersion = versions.find(v => v.id === selectedVersions[0])
      const newVersion = versions.find(v => v.id === selectedVersions[1])
      setComparison({ old: oldVersion || null, new: newVersion || null })
      onCompare(selectedVersions[0], selectedVersions[1])
    }
  }

  const clearComparison = () => {
    setComparison({ old: null, new: null })
    setSelectedVersions([])
  }

  // 📊 Get statistics about a version
  const getVersionStats = (version: CurriculumVersion) => ({
    promptLength: version.system_prompt.length,
    exampleCount: version.golden_examples.length,
    blocksCovered: new Set(version.golden_examples.map((ex: any) => ex.block)).size
  })

  return (
    <div className="space-y-6">
      {/* 🎛️ Version Control Panel */}
      <Card className="border-primary/20 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <History className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Version History</CardTitle>
                <CardDescription>
                  Track the evolution of GEPA's curriculum across {versions.length} versions
                </CardDescription>
              </div>
            </div>

            {comparison.old && comparison.new && (
              <Button variant="outline" size="sm" onClick={clearComparison}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to List
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {!comparison.old && !comparison.new ? (
            <>
              {/* 🔍 Selection Controls */}
              <div className="mb-4 p-3 rounded-lg bg-muted/20 border border-primary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <GitCompare className="w-4 h-4 text-primary" />
                    <span className="font-medium">
                      Compare {selectedVersions.length > 0 ? selectedVersions.length : 'two'} versions
                    </span>
                  </div>
                  {selectedVersions.length === 2 && (
                    <Button size="sm" onClick={handleCompare}>
                      <Eye className="w-4 h-4 mr-2" />
                      Compare
                    </Button>
                  )}
                </div>
              </div>

              {/* 📜 Version List */}
              <ScrollArea className="h-[500px] w-full rounded-md border">
                <div className="p-2 space-y-2">
                  {versions.map((version, index) => {
                    const stats = getVersionStats(version)
                    const isSelected = selectedVersions.includes(version.id)

                    return (
                      <Card
                        key={version.id}
                        className={`transition-all cursor-pointer ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-primary/10 hover:border-primary/30'
                        } ${version.is_active ? 'ring-2 ring-primary/20' : ''}`}
                        onClick={() => {
                          if (selectedVersions.includes(version.id)) {
                            setSelectedVersions(selectedVersions.filter(id => id !== version.id))
                          } else if (selectedVersions.length < 2) {
                            setSelectedVersions([...selectedVersions, version.id])
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{version.version}</h4>
                                {version.is_active && (
                                  <Badge className="bg-primary text-primary-foreground">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Active
                                  </Badge>
                                )}
                              </div>

                              <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{new Date(version.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span>{version.created_by}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  <span>{stats.promptLength} chars</span>
                                </div>
                              </div>
                            </div>

                            {isSelected && (
                              <Badge variant="default" className="text-xs">
                                {selectedVersions.indexOf(version.id) + 1}
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground italic line-clamp-2">
                              "{version.changelog || 'No changelog entry'}"
                            </p>

                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {stats.exampleCount} examples
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {stats.blocksCovered} blocks
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>
            </>
          ) : (
            <>
              {/* 🔍 Side-by-Side Comparison */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Version Comparison</h3>
                    <p className="text-sm text-muted-foreground">
                      Comparing {comparison.old?.version} vs {comparison.new?.version}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-amber-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4 text-amber-500" />
                        {comparison.old?.version}
                      </CardTitle>
                      <CardDescription>
                        {new Date(comparison.old?.created_at || '').toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          <p className="font-semibold mb-1">Changelog:</p>
                          <p className="italic line-clamp-2">"{comparison.old?.changelog}"</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <p className="font-semibold mb-1">Stats:</p>
                          {comparison.old && (
                            <div>
                              {getVersionStats(comparison.old).exampleCount} examples •{' '}
                              {getVersionStats(comparison.old).promptLength} chars
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        {comparison.new?.version}
                        <ArrowRight className="w-4 h-4 text-green-500" />
                      </CardTitle>
                      <CardDescription>
                        {new Date(comparison.new?.created_at || '').toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          <p className="font-semibold mb-1">Changelog:</p>
                          <p className="italic line-clamp-2">"{comparison.new?.changelog}"</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <p className="font-semibold mb-1">Stats:</p>
                          {comparison.new && (
                            <div>
                              {getVersionStats(comparison.new).exampleCount} examples •{' '}
                              {getVersionStats(comparison.new).promptLength} chars
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 📜 Diff Viewer */}
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">System Prompt Diff</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      {comparison.old && comparison.new && (
                        <DiffViewer
                          oldText={comparison.old.system_prompt}
                          newText={comparison.new.system_prompt}
                        />
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>

                {!readOnly && comparison.new && !comparison.new.is_active && (
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => comparison.new && handleActivate(comparison.new.id)}
                      disabled={isActivating}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isActivating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Activating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Set {comparison.new.version} as Active
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
