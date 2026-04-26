import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Network, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function KnowledgeGraphTab() {
  const [key, setKey] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setKey((prev) => prev + 1)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            <CardTitle>Knowledge Graph</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Graph
          </Button>
        </div>
        <CardDescription>
          Explore the relationships between emotional concepts and blocks.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden relative min-h-[600px]">
        <iframe
          key={key}
          src="/admin/graph.html"
          className="w-full h-full border-none"
          title="Knowledge Graph"
        />
      </CardContent>
    </Card>
  )
}
