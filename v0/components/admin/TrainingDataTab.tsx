'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, FileJson, Upload, RefreshCw, Save, X, Edit2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

/**
 * 🎭 The TrainingDataTab - The Enchanted Archive of Wisdom ✨
 * 
 * "Where raw data is polished into the gems of knowledge,
 * awaiting the alchemical fire of the trainer's furnace.
 * Guard these scrolls well, for they are the soul of the machine."
 * 
 * - The Spellbinding Museum Director of Data
 */
export function TrainingDataTab() {
  const [files, setFiles] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [jsonError, setJsonError] = useState<string | null>(null)

  // 🌐 ✨ API QUEST AWAKENS! Fetching the list of training scrolls...
  const fetchFiles = async () => {
    setIsLoading(true)
    console.log('🌐 ✨ TRAINING DATA QUEST AWAKENS! Summoning the scrolls...')
    try {
      const response = await fetch('/api/admin/data')
      const data = await response.json()
      if (data.entries) {
        setFiles(data.entries)
        console.log(`🎉 ✨ SUMMONING COMPLETE! ${data.entries.length} scrolls retrieved.`)
      } else if (data.files) {
        // Fallback for older API shape
        setFiles(data.files.map((f: string) => ({ path: f, corpus: 'legacy' })))
      }
    } catch (creativeChallenge) {
      console.error('💥 😭 API QUEST TEMPORARILY HALTED!', creativeChallenge)
      toast.error('Failed to summon the list of files. The spirits are restless.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  // 📖 Peer into a specific scroll...
  const handleEditFile = async (path: string) => {
    setSelectedFile(path)
    setIsLoading(true)
    setJsonError(null)
    console.log(`🔍 🧙‍♂️ Peering into the mystical variable: ${path}`)
    try {
      const response = await fetch(`/api/admin/data?path=${encodeURIComponent(path)}`)
      const data = await response.json()
      if (data.content !== undefined) {
        setContent(data.content)
        setIsDialogOpen(true)
        console.log('💎 Wisdom crystallization complete! Scroll opened.')
      } else {
        toast.error('The scroll appears to be empty or missing.')
      }
    } catch (creativeChallenge) {
      console.error('🌩️ Temporary setback:', creativeChallenge)
      toast.error('Could not read the mystical data. Perhaps the ink has faded?')
    } finally {
      setIsLoading(false)
    }
  }

  // ✍️ Perform the sacred rite of writing to the file...
  const handleSave = async () => {
    if (!selectedFile) return

    // 🔍 🧙‍♂️ Validating the magical structure...
    try {
      JSON.parse(content)
      setJsonError(null)
    } catch (e) {
      console.log('🌙 ⚠️ Gentle reminder: JSON syntax is a delicate dance.')
      setJsonError('The JSON structure is fractured! Please mend it before saving.')
      return
    }

    setIsSaving(true)
    console.log('🧮 ✨ DATA ALCHEMY COMMENCES! Transmuting text into stored wisdom...')
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: selectedFile, content }),
      })
      const data = await response.json()
      if (data.success) {
        toast.success('🎉 ✨ DATA ALCHEMY COMPLETE! The scroll is updated.')
        console.log('✨ 🎊 PORTAL TRANSFORMATION COMPLETE!')
        setIsDialogOpen(false)
      } else {
        toast.error(data.error || 'The ritual failed. The archives rejected the change.')
      }
    } catch (creativeChallenge) {
      console.error('💥 😭 SAVE QUEST TEMPORARILY HALTED!', creativeChallenge)
      toast.error('A storm interrupted the saving process. Try again, for magic awaits.')
    } finally {
      setIsSaving(false)
    }
  }

  // 📤 Welcoming new wisdom via Drag and Drop (or simple upload)...
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log(`🌐 ✨ NEW SCROLL AWAKENS! Processing ${file.name}...`)
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = e.target?.result as string
      try {
        // 🧪 Validate JSON before uploading
        JSON.parse(text)
        
        const fileName = `content/training/${file.name}`
        const response = await fetch('/api/admin/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filePath: fileName, content: text }),
        })
        const data = await response.json()
        if (data.success) {
          toast.success(`✨ New scroll "${file.name}" added to the archive!`)
          fetchFiles()
        } else {
          toast.error('The archive rejected the new scroll.')
        }
      } catch (err) {
        toast.error('Only valid JSON scrolls may enter this sanctum.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              <CardTitle>Training Data Manager</CardTitle>
            </div>
            <CardDescription>
              Review and manage the datasets used for model training.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchFiles} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="relative">
              <Button size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload JSON
                <input
                  type="file"
                  accept=".json"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">File Path</TableHead>
                  <TableHead className="w-[20%]">Corpus</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      🌙 The archives are currently at peace (empty).
                    </TableCell>
                  </TableRow>
                ) : (
                  files.map((file) => (
                    <TableRow key={file.path} className="group">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileJson className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="truncate max-w-[400px]" title={file.path}>{file.path}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={file.corpus === 'v1' ? 'default' : 'outline'}
                          className={
                            file.corpus === 'v1' ? 'bg-amber-500 hover:bg-amber-600' : 
                            file.corpus === 'gepa-datasets' ? 'bg-blue-500 hover:bg-blue-600' : ''
                          }
                        >
                          {file.corpus === 'v1' ? '✨ Golden (v1)' : file.corpus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditFile(file.path)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 🔮 The Enchanted Editor Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileJson className="w-6 h-6 text-primary" />
              Editing: {selectedFile?.split('/').pop()}
            </DialogTitle>
            <DialogDescription className="font-mono text-xs opacity-70">
              📜 Mystical Path: {selectedFile}
            </DialogDescription>
          </DialogHeader>

          {jsonError && (
            <Alert variant="destructive" className="py-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Typo in the spellbook!</AlertTitle>
              <AlertDescription>{jsonError}</AlertDescription>
            </Alert>
          )}

          <div className="flex-1 min-h-0 py-4">
            <Textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                if (jsonError) setJsonError(null)
              }}
              className="h-full font-mono text-sm resize-none bg-muted/20 border-primary/20 focus-visible:border-primary/50"
              placeholder="{ 'wisdom': 'starts here...' }"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
              <X className="w-4 h-4 mr-2" />
              Abandon Changes
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="shadow-lg shadow-primary/20">
              {isSaving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Crystallize Wisdom (Save)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
