'use client'

/**
 * 🎭 The GraphWikiTab - The Living Library of Emotional Mastery ✨
 * 
 * "Where every scroll is a node in the constellation of peace,
 * and every link a path to deeper understanding.
 * Explore the chronicles of the Four Blocks with a seeker's heart."
 * 
 * - The Spellbinding Museum Director of Knowledge
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Book, FileText, Search, RefreshCw, ChevronRight, Loader2, Network } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'

interface WikiFile {
  path: string
  corpus: string
  size?: number
}

export function GraphWikiTab() {
  const [files, setFiles] = useState<WikiFile[]>([])
  const [filteredFiles, setFilteredFiles] = useState<WikiFile[]>([])
  const [selectedFile, setSelectedFile] = useState<WikiFile | null>(null)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // 🌐 ✨ WIKI QUEST AWAKENS!
  const fetchWikiFiles = async () => {
    setIsLoading(true)
    console.log('🌐 ✨ WIKI QUEST AWAKENS! Summoning the knowledge scrolls...')
    try {
      const response = await fetch('/api/admin/data')
      const data = await response.json()
      if (data.entries) {
        // 🔮 Filter for wiki corpus entries
        const wikiEntries = data.entries.filter((e: any) => e.corpus === 'wiki')
        setFiles(wikiEntries)
        setFilteredFiles(wikiEntries)
        console.log(`🎉 ✨ SUMMONING COMPLETE! ${wikiEntries.length} wiki scrolls retrieved.`)
        
        // 🌟 Auto-select INDEX.md if it exists
        const indexFile = wikiEntries.find((e: any) => e.path.endsWith('INDEX.md'))
        if (indexFile) {
          handleReadFile(indexFile)
        }
      }
    } catch (creativeChallenge) {
      console.error('💥 😭 WIKI QUEST TEMPORARILY HALTED!', creativeChallenge)
      toast.error('Failed to summon the wiki index. The spirits are restless.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWikiFiles()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFiles(files)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredFiles(files.filter(f => f.path.toLowerCase().includes(query)))
    }
  }, [searchQuery, files])

  const handleReadFile = async (file: WikiFile) => {
    setSelectedFile(file)
    setIsReading(true)
    console.log(`🔍 🧙‍♂️ Peering into wiki scroll: ${file.path}`)
    try {
      const response = await fetch(`/api/admin/data?path=${encodeURIComponent(file.path)}`)
      const data = await response.json()
      if (data.content !== undefined) {
        setContent(data.content)
        console.log('💎 Wisdom crystallization complete! Wiki entry opened.')
      } else {
        toast.error('The wiki entry appears to be empty or missing.')
      }
    } catch (creativeChallenge) {
      console.error('🌩️ Temporary setback:', creativeChallenge)
      toast.error('Could not read the wiki entry. Perhaps the ink has faded?')
    } finally {
      setIsReading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-280px)]">
      {/* 📜 Sidebar: Knowledge Index */}
      <Card className="lg:col-span-1 flex flex-col border-primary/20 shadow-lg overflow-hidden">
        <CardHeader className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Book className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Wiki Index</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={fetchWikiFiles} disabled={isLoading} className="h-8 w-8">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scrolls..."
              className="pl-8 bg-background/50 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              {filteredFiles.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm italic">
                  No scrolls found matching your quest.
                </div>
              ) : (
                filteredFiles.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => handleReadFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all flex items-center gap-3 ${
                      selectedFile?.path === file.path
                        ? 'bg-primary/10 text-primary border-l-4 border-primary'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <FileText className={`w-4 h-4 flex-shrink-0 ${selectedFile?.path === file.path ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="truncate flex-grow">
                      {file.path.split('/').pop()?.replace('.md', '').replace('_', ' ')}
                    </span>
                    {selectedFile?.path === file.path && <ChevronRight className="w-3 h-3" />}
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 📖 Main Area: Scroll Content */}
      <Card className="lg:col-span-3 flex flex-col border-primary/20 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-4 border-b bg-background/50 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-primary/10">
              <Network className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-serif">
                {selectedFile ? selectedFile.path.split('/').pop()?.replace('.md', '').replace('_', ' ') : 'Select a Knowledge Scroll'}
              </CardTitle>
              {selectedFile && (
                <CardDescription className="text-xs font-mono opacity-60">
                  docs/WIKI/{selectedFile.path.split('docs/WIKI/').pop()}
                </CardDescription>
              )}
            </div>
          </div>
          {selectedFile && (
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Wiki Node
            </Badge>
          )}
        </CardHeader>
        <CardContent className="flex-grow p-0 overflow-hidden relative">
          <ScrollArea className="h-full">
            {isReading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
                <p className="text-muted-foreground animate-pulse font-serif italic">Unrolling the parchment...</p>
              </div>
            ) : content ? (
              <div className="p-8 prose prose-slate dark:prose-invert max-w-none prose-headings:font-serif prose-a:text-primary">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground p-8 opacity-30">
                <Book className="w-24 h-24 mb-4" />
                <p className="text-xl font-serif italic">The digital muses await your selection.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
