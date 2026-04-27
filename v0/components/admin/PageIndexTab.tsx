'use client'

/**
 * 🎭 The PageIndexTab - The Oracle of Structural Wisdom ✨
 * 
 * "Where every chapter is a branch and every page a leaf
 * in the great tree of emotional mastery. 
 * Witness the geometry of the printed word as it becomes digital light."
 * 
 * - The Spellbinding Museum Director of Structure
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Map, Search, RefreshCw, ChevronRight, Loader2, FileText, TreePine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface PageIndexNode {
  title: string
  node_id: string
  start_page: number
  end_page: number
  summary: string
  nodes?: PageIndexNode[]
}

interface PageIndexData {
  title: string
  pages: { [key: number]: string }
  tree: PageIndexNode
}

export function PageIndexTab() {
  const [data, setData] = useState<PageIndexData | null>(null)
  const [selectedNode, setSelectedNode] = useState<PageIndexNode | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 🌐 ✨ PAGEINDEX QUEST AWAKENS!
  const fetchPageIndex = async () => {
    setIsLoading(true)
    console.log('🌐 ✨ PAGEINDEX QUEST AWAKENS! Summoning the structural oracle...')
    try {
      // 🔮 Try to fetch the crystallized index from the page-index corpus
      const response = await fetch('/api/admin/data?path=shared/data/page_index.json')
      const result = await response.json()
      
      if (result.content) {
        const parsed = JSON.parse(result.content)
        setData(parsed)
        setSelectedNode(parsed.tree)
        console.log('🎉 ✨ SUMMONING COMPLETE! The tree of knowledge is revealed.')
      } else {
        console.log('🌙 ⚠️ The PageIndex hasn\'t been crystallized yet.')
      }
    } catch (creativeChallenge) {
      console.error('💥 😭 PAGEINDEX QUEST TEMPORARILY HALTED!', creativeChallenge)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPageIndex()
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchPageIndex().finally(() => {
      setTimeout(() => setIsRefreshing(false), 1000)
    })
  }

  const renderTree = (node: PageIndexNode, depth = 0) => {
    return (
      <div key={node.node_id} className="space-y-1">
        <button
          onClick={() => setSelectedNode(node)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all flex items-center gap-3 ${
            selectedNode?.node_id === node.node_id
              ? 'bg-primary/10 text-primary border-l-4 border-primary'
              : 'hover:bg-muted text-muted-foreground'
          }`}
          style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
        >
          {node.nodes && node.nodes.length > 0 ? (
            <BookOpen className={`w-4 h-4 flex-shrink-0 ${selectedNode?.node_id === node.node_id ? 'text-primary' : 'text-muted-foreground'}`} />
          ) : (
            <FileText className={`w-4 h-4 flex-shrink-0 ${selectedNode?.node_id === node.node_id ? 'text-primary' : 'text-muted-foreground'}`} />
          )}
          <span className="truncate flex-grow font-medium">{node.title}</span>
          <Badge variant="outline" className="text-[10px] px-1.5 h-4 opacity-70">
            p.{node.start_page}-{node.end_page}
          </Badge>
        </button>
        {node.nodes && node.nodes.map(child => renderTree(child, depth + 1))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-280px)]">
      {/* 🌲 Sidebar: Structural Tree */}
      <Card className="lg:col-span-1 flex flex-col border-primary/20 shadow-lg overflow-hidden">
        <CardHeader className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TreePine className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Structural Tree</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading} className="h-8 w-8">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <CardDescription className="text-xs">
            The hierarchical map of the book.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow p-0 overflow-hidden">
          <ScrollArea className="h-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary/40" />
                <p className="text-xs text-muted-foreground italic">Summoning tree...</p>
              </div>
            ) : data ? (
              <div className="p-2">
                {renderTree(data.tree)}
              </div>
            ) : (
              <div className="p-8 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center opacity-20">
                  <TreePine className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">No Tree Crystallized</p>
                  <p className="text-xs text-muted-foreground">The PageIndex ritual hasn't been performed yet.</p>
                </div>
                <Button size="sm" variant="outline" className="w-full text-[10px]" disabled>
                  Commence Ritual (CLI Only)
                </Button>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 🗺️ Main Area: Node Mapping */}
      <Card className="lg:col-span-3 flex flex-col border-primary/20 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-4 border-b bg-background/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-primary/10">
                <Map className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-serif">
                  {selectedNode ? selectedNode.title : 'Structural Mapping'}
                </CardTitle>
                {selectedNode && (
                  <CardDescription className="text-xs">
                    Pages {selectedNode.start_page} to {selectedNode.end_page} · ID: {selectedNode.node_id}
                  </CardDescription>
                )}
              </div>
            </div>
            {selectedNode && (
              <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">
                {selectedNode.nodes ? 'Section' : 'Leaf Node'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-0 overflow-hidden relative">
          <ScrollArea className="h-full">
            {!data ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground p-8 opacity-30 text-center">
                <Map className="w-24 h-24 mb-4" />
                <p className="text-xl font-serif italic">Waiting for the structural oracle to awaken...</p>
                <p className="text-sm max-w-md mt-2">Run `npm run generate-page-index` from the root to crystallize the book's geometry.</p>
              </div>
            ) : selectedNode ? (
              <div className="p-8 space-y-8">
                {/* 🌟 Node Summary Section */}
                <section className="space-y-4">
                  <h3 className="text-lg font-serif font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    Wisdom Summary
                  </h3>
                  <div className="bg-muted/30 p-6 rounded-xl border border-primary/5 italic leading-relaxed text-lg">
                    "{selectedNode.summary}"
                  </div>
                </section>

                {/* 📜 Page Content Previews */}
                <section className="space-y-4">
                  <h3 className="text-lg font-serif font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    Page Mapping
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: Math.min(selectedNode.end_page - selectedNode.start_page + 1, 6) }).map((_, i) => {
                      const pageNum = selectedNode.start_page + i
                      return (
                        <Card key={pageNum} className="bg-background/40 border-primary/5 hover:border-primary/20 transition-all group">
                          <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
                            <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Page {pageNum}</span>
                            <Badge variant="ghost" className="h-4 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">
                              Crystallized
                            </Badge>
                          </CardHeader>
                          <CardContent className="p-3">
                            <p className="text-[10px] leading-relaxed line-clamp-4 text-muted-foreground">
                              {data.pages[pageNum] || "Page content in the void..."}
                            </p>
                          </CardContent>
                        </Card>
                      )
                    })}
                    {selectedNode.end_page - selectedNode.start_page + 1 > 6 && (
                      <div className="md:col-span-2 text-center py-4 text-xs text-muted-foreground italic">
                        ... and {selectedNode.end_page - selectedNode.start_page + 1 - 6} more pages in this section ...
                      </div>
                    )}
                  </div>
                </section>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground p-8 opacity-30">
                <TreePine className="w-24 h-24 mb-4" />
                <p className="text-xl font-serif italic">Select a branch to explore its wisdom.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
