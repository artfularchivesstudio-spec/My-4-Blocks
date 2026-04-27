'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FlaskConical, Trophy, Users, BarChart3, RefreshCw, ChevronRight, ChevronDown, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

/**
 * 🧪 The ABTestingTab - The Arena of Comparative Wisdom ⚔️
 * 
 * "Where two voices of the machine duel for the seeker's preference.
 * We watch, we measure, we evolve. For in competition, 
 * the sharpest clarity is forged."
 */
export function ABTestingTab() {
  const [tests, setTests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedTest, setExpandedTest] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    withChoice: 0,
    aWins: 0,
    bWins: 0,
    aWinRate: 0,
    bWinRate: 0
  })

  const fetchTests = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/ab-tests')
      const data = await response.json()
      setTests(data.tests || [])
      
      // Calculate stats
      const withChoice = data.tests.filter((t: any) => t.user_choice !== null)
      const aWins = withChoice.filter((t: any) => t.user_choice === 'A').length
      const bWins = withChoice.filter((t: any) => t.user_choice === 'B').length
      const total = data.tests.length
      
      setStats({
        total,
        withChoice: withChoice.length,
        aWins,
        bWins,
        aWinRate: withChoice.length > 0 ? Math.round((aWins / withChoice.length) * 100) : 0,
        bWinRate: withChoice.length > 0 ? Math.round((bWins / withChoice.length) * 100) : 0
      })
    } catch (err) {
      toast.error('Failed to summon A/B test data.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTests()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-primary" />
              Total Experiments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.withChoice} responses rated by users
            </p>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Variant A Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.aWinRate}%</div>
            <Progress value={stats.aWinRate} className="h-2 mt-2 bg-amber-500/20" />
            <p className="text-xs text-muted-foreground mt-2">
              The Structured Sage ({stats.aWins} wins)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Variant B Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.bWinRate}%</div>
            <Progress value={stats.bWinRate} className="h-2 mt-2 bg-blue-500/20" />
            <p className="text-xs text-muted-foreground mt-2">
              The Warm Friend ({stats.bWins} wins)
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Experiment History
            </CardTitle>
            <CardDescription>Review individual A/B duels and user preferences.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchTests} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {tests.length === 0 && !isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  🌙 The arena is currently empty. No duels have been fought yet.
                </div>
              ) : (
                tests.map((test) => (
                  <div 
                    key={test.id} 
                    className="border rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/30"
                  >
                    <div 
                      className={`p-4 flex items-center justify-between cursor-pointer ${expandedTest === test.id ? 'bg-muted/30' : 'bg-card'}`}
                      onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                            {new Date(test.created_at).toLocaleDateString()}
                          </Badge>
                          {test.user_choice ? (
                            <Badge className={test.user_choice === 'A' ? 'bg-amber-500' : 'bg-blue-500'}>
                              Winner: {test.user_choice}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">No Choice Made</Badge>
                          )}
                          {test.metadata?.blockType && (
                            <Badge variant="outline" className="border-primary/20 text-primary">
                              {test.metadata.blockType}
                            </Badge>
                          ) || (
                            <Badge variant="outline" className="text-muted-foreground">
                              General Inquiry
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium truncate italic text-muted-foreground">
                          "{test.user_query}"
                        </p>
                      </div>
                      {expandedTest === test.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>

                    {expandedTest === test.id && (
                      <div className="p-4 border-t bg-muted/10 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600">Variant A: Structured Sage</h4>
                            {test.user_choice === 'A' && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                            {test.user_choice === 'B' && <XCircle className="w-4 h-4 text-muted-foreground/30" />}
                          </div>
                          <div className="p-3 bg-card border rounded text-xs leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap">
                            {test.response_a}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-600">Variant B: Warm Friend</h4>
                            {test.user_choice === 'B' && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                            {test.user_choice === 'A' && <XCircle className="w-4 h-4 text-muted-foreground/30" />}
                          </div>
                          <div className="p-3 bg-card border rounded text-xs leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap">
                            {test.response_b}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
