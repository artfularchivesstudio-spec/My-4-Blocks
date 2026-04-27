'use client';

/**
 * 🎭 The Knowledge Graph Tab - Gateway to the Constellation ✨
 *
 * "Behold the sacred tab that reveals the web of wisdom,
 *  where each node is a star and each edge a thread of meaning.
 *  Click, drag, zoom — and explore the cosmic tapestry."
 *
 * - The Spellbinding Museum Director of Graph Interfaces
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, RefreshCw, ExternalLink, Maximize2, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KnowledgeGraphView from './knowledge/KnowledgeGraphView';

export function KnowledgeGraphTab() {
  const [key, setKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'embed' | 'popout'>('embed');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setKey((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handlePopout = () => {
    window.open('/admin/graph.html', '_blank');
  };

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
                Interactive visualization of the wisdom constellation.
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
          Interactive visualization of the wisdom constellation.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow p-0 overflow-hidden relative min-h-[500px] sm:min-h-[700px] lg:min-h-[800px]">
        <Tabs defaultValue="react" className="h-full flex flex-col">
          <div className="flex-none px-4 pt-4 border-b">
            <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50 border">
              <TabsTrigger value="react" className="gap-2">
                <Layout className="w-4 h-4" />
                React Visualization
              </TabsTrigger>
              <TabsTrigger value="legacy" className="gap-2">
                <Network className="w-4 h-4" />
                Legacy View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="react" className="flex-grow mt-0">
            <div className="w-full h-full relative">
              <KnowledgeGraphView key={key} />
            </div>
          </TabsContent>

          <TabsContent value="legacy" className="flex-grow mt-0">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <Network className="w-32 h-32 text-primary" />
              </div>
              <iframe
                key={key}
                src="/admin/graph.html"
                className="w-full h-full border-none relative z-10"
                title="Knowledge Graph (Legacy)"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
