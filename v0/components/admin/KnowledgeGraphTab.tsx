import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Network, RefreshCw, ExternalLink, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function KnowledgeGraphTab() {
  const [key, setKey] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setKey((prev) => prev + 1)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handlePopout = () => {
    window.open('/admin/graph.html', '_blank')
  }

  return (
    <Card className="h-full flex flex-col border-primary/20 shadow-xl overflow-hidden">
      <CardHeader className="flex-none bg-background/50 backdrop-blur-sm border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Network className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Knowledge Graph</CardTitle>
              <CardDescription className="hidden sm:block">
                Visualizing the constellations of emotional concepts.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              className="gap-2 bg-background/50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">Refresh</span>
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handlePopout} 
              className="gap-2 shadow-lg transition-all hover:scale-105"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Full Screen Popout</span>
            </Button>
          </div>
        </div>
        <CardDescription className="sm:hidden mt-2">
          Visualizing the constellations of emotional concepts.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden relative min-h-[500px] sm:min-h-[700px] lg:min-h-[800px] bg-[#f8f7f4] dark:bg-[#1a2420]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <Network className="w-32 h-32 text-primary" />
        </div>
        <iframe
          key={key}
          src="/admin/graph.html"
          className="w-full h-full border-none relative z-10"
          title="Knowledge Graph"
        />
        
        {/* 📱 Mobile optimization tip */}
        <div className="absolute bottom-4 left-4 right-4 sm:hidden bg-background/80 backdrop-blur-md p-3 rounded-lg border border-primary/20 shadow-lg z-20 pointer-events-none">
          <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
            <Maximize2 className="w-3 h-3" />
            Tip: Use the "Full Screen Popout" button above for the best mobile experience.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
