import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, ChevronRight, Loader2, Download, ExternalLink, Calendar, Clock, BarChart3, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'

interface ReportFile {
  name: string
  path: string
  size: number
  mtime: string
}

interface ReportGroup {
  id: string
  date: Date
  files: ReportFile[]
}

export function GEPAReportsTab() {
  const [reports, setReports] = useState<ReportGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<ReportFile | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [loadingContent, setLoadingContent] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/reports')
      const data = await response.json()
      
      // Group files by directory
      const groups: Record<string, ReportFile[]> = {}
      data.reports.forEach((file: ReportFile) => {
        const dirName = file.path.split('/').slice(-2, -1)[0]
        if (!groups[dirName]) groups[dirName] = []
        groups[dirName].push(file)
      })

      // Convert to array and sort by date (from mtime of files in group)
      const sortedGroups = Object.entries(groups).map(([id, files]) => {
        // Try to parse date from ID (e.g., run_2026-04-26_18-10-00) or use mtime
        const mtime = new Date(files[0].mtime)
        return { id, date: mtime, files: files.sort((a, b) => a.name.localeCompare(b.name)) }
      }).sort((a, b) => b.date.getTime() - a.date.getTime())

      // 📜 Add RUN_HISTORY.md as a special group at the top
      const historyGroup: ReportGroup = {
        id: 'CHRONICLES',
        date: new Date(),
        files: [{
          name: 'RUN_HISTORY.md',
          path: 'docs/GEPA-DSPy-m1/RUN_HISTORY.md',
          size: 0,
          mtime: new Date().toISOString()
        }]
      }

      setReports([historyGroup, ...sortedGroups])
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileClick = async (file: ReportFile) => {
    setSelectedFile(file)
    setLoadingContent(true)
    try {
      // 🔮 Determine which API to use based on the path
      const apiUrl = file.path.startsWith('docs/GEPA-DSPy-m1/hermes-agent-self-evolution/output')
        ? `/api/admin/reports?path=${encodeURIComponent(file.path)}`
        : `/api/admin/data?path=${encodeURIComponent(file.path)}`

      const response = await fetch(apiUrl)
      const data = await response.json()
      setFileContent(data.content || 'No content found.')
    } catch (error) {
      setFileContent('Error loading file content.')
    } finally {
      setLoadingContent(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
      {/* Sidebar: Report List */}
      <Card className="md:col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Runs
          </CardTitle>
          <CardDescription>Select a run to view its artifacts.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow p-0 overflow-hidden">
          <ScrollArea className="h-full">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : reports.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No reports found.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {reports.map((group) => (
                  <div key={group.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate max-w-[150px]" title={group.id}>
                        {group.id === 'CHRONICLES' ? (
                          <div className="flex items-center gap-2 text-primary">
                            <History className="w-4 h-4" />
                            <span>Chronicles</span>
                          </div>
                        ) : group.id}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(group.date, 'MMM d, HH:mm')}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {group.files.map((file) => (
                        <button
                          key={file.path}
                          onClick={() => handleFileClick(file)}
                          className={`text-left px-2 py-1.5 rounded-md text-xs flex items-center gap-2 transition-colors ${
                            selectedFile?.path === file.path
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted text-muted-foreground'
                          }`}
                        >
                          {file.name.endsWith('.md') ? (
                            <FileText className="w-3 h-3" />
                          ) : file.name.endsWith('.json') ? (
                            <BarChart3 className="w-3 h-3" />
                          ) : (
                            <FileText className="w-3 h-3" />
                          )}
                          <span className="truncate">{file.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Area: Content Viewer */}
      <Card className="md:col-span-2 flex flex-col">
        <CardHeader className="flex-none border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg truncate max-w-[300px]">
                {selectedFile ? selectedFile.name : 'Select a Report'}
              </CardTitle>
              {selectedFile && (
                <CardDescription className="text-xs truncate max-w-[300px]">
                  {selectedFile.path}
                </CardDescription>
              )}
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                  <a href={`/api/admin/reports?path=${encodeURIComponent(selectedFile.path)}`} download={selectedFile.name}>
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-0 overflow-hidden relative">
          <ScrollArea className="h-full">
            {loadingContent ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : fileContent ? (
              <div className="p-6">
                {selectedFile?.name.endsWith('.md') ? (
                  <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-serif prose-a:text-primary">
                    <ReactMarkdown>{fileContent}</ReactMarkdown>
                  </div>
                ) : (
                  <pre className="text-sm font-mono whitespace-pre-wrap break-words bg-muted/50 p-4 rounded-lg border">
                    {fileContent}
                  </pre>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground p-8">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p>Select a run and artifact from the sidebar to view its content.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
