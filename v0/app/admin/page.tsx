'use client'

/**
 * 🎭 The Admin Portal - The Gilded Gates of System Mastery
 *
 * "Beyond these thresholds lie the levers of reality, 
 * where the Four Blocks are balanced and the digital muses 
 * are tuned to their perfect frequencies. Only the worthy 
 * of the Secret Word may enter this hallowed hall."
 *
 * - The Spellbinding Museum Director of Governance
 */

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Lock, Settings, Database, FileText, Network, ShieldCheck, MessageSquare, Book, Map } from 'lucide-react'
import { ConfigTab } from '@/components/admin/ConfigTab'
import { TrainingDataTab } from '@/components/admin/TrainingDataTab'
import { GEPAReportsTab } from '@/components/admin/GEPAReportsTab'
import { KnowledgeGraphTab } from '@/components/admin/KnowledgeGraphTab'
import { GraphWikiTab } from '@/components/admin/GraphWikiTab'
import { PageIndexTab } from '@/components/admin/PageIndexTab'

export default function AdminPage() {
  // ... rest of the code ...
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // 🌟 Check for existing session or environment defaults
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_authenticated')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  // 🔮 The Sacred Ritual of Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 🔍 Peering into the mystical variables...
    // In production, this would be checked against a server-side session or a secure environment variable
    const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    
    if (password === ADMIN_SECRET) {
      console.log('🎉 ✨ AUTHENTICATION MASTERPIECE COMPLETE!')
      setIsAuthenticated(true)
      localStorage.setItem('admin_authenticated', 'true')
      setError('')
    } else {
      console.log('💥 😭 AUTHENTICATION QUEST TEMPORARILY HALTED!')
      setError('The secret word is incorrect. The digital muses remain silent.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
    setPassword('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] dark:bg-[#1a2420] p-4">
        <Card className="w-full max-w-md shadow-xl border-none">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-serif">Admin Portal</CardTitle>
            <CardDescription>Enter the secret word to access the inner sanctum.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="The Secret Word..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted/50"
                />
              </div>
              {error && <p className="text-sm text-destructive text-center font-medium">🌩️ {error}</p>}
              <div className="flex flex-col gap-2">
                <Button type="submit" className="w-full gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Unseal the Gates
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full text-muted-foreground"
                  onClick={() => window.location.href = '/'}
                >
                  Return to Home
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] dark:bg-[#1a2420] pb-12">
      {/* 🌐 The Admin Portal Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-serif font-semibold tracking-tight">Admin Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.location.href = '/'}
              className="hidden sm:flex gap-2 text-muted-foreground hover:text-foreground"
            >
              <MessageSquare className="w-4 h-4" />
              Return to Chat
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              Seal the Gates
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-serif font-bold">System Mastery</h2>
              <p className="text-muted-foreground">Orchestrate the Four Blocks intelligence and training ecosystem.</p>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Source of Truth Verified</span>
            </div>
          </div>

          <Tabs defaultValue="config" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-1 bg-muted/50 border">
              <TabsTrigger value="config" className="py-2 gap-2">
                <Settings className="w-4 h-4" />
                Configuration
              </TabsTrigger>
              <TabsTrigger value="training" className="py-2 gap-2">
                <Database className="w-4 h-4" />
                Training Data
              </TabsTrigger>
              <TabsTrigger value="reports" className="py-2 gap-2">
                <FileText className="w-4 h-4" />
                GEPA Reports
              </TabsTrigger>
              <TabsTrigger value="wiki" className="py-2 gap-2">
                <Book className="w-4 h-4" />
                Graph Wiki
              </TabsTrigger>
              <TabsTrigger value="pageindex" className="py-2 gap-2">
                <Map className="w-4 h-4" />
                PageIndex
              </TabsTrigger>
              <TabsTrigger value="graph" className="py-2 gap-2">
                <Network className="w-4 h-4" />
                Knowledge Graph
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="mt-0">
              <ConfigTab />
            </TabsContent>
            
            <TabsContent value="training" className="mt-0">
              <TrainingDataTab />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-0">
              <GEPAReportsTab />
            </TabsContent>

            <TabsContent value="wiki" className="mt-0">
              <GraphWikiTab />
            </TabsContent>

            <TabsContent value="pageindex" className="mt-0">
              <PageIndexTab />
            </TabsContent>
            
            <TabsContent value="graph" className="mt-0">
              <KnowledgeGraphTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
