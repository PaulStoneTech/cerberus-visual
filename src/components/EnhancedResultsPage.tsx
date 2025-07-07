'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Calendar, 
  ArrowRight, 
  Search, 
  Filter,
  Clock,
  Activity,
  Cpu,
  Database,
  TrendingUp,
  Plus
} from 'lucide-react'

interface AnalysisResult {
  id: string
  name: string
  date: string
  data?: any
}

// Sample stats for demonstration
const getAnalysisStats = (data: any) => {
  if (!data) return null
  
  return {
    instructions: data.instruction_statistics?.total_instructions_analyzed || 0,
    mlOperations: data.ml_operations?.summary?.total_operations || 0,
    frameworks: data.framework_analysis?.detected_frameworks?.length || 0,
    sections: data.section_analysis?.length || 0
  }
}

const AnalysisCard = ({ analysis }: { analysis: AnalysisResult }) => {
  const stats = getAnalysisStats(analysis.data)
  const date = new Date(analysis.date)
  const timeAgo = getTimeAgo(date)

  return (
    <Link href={`/results/${analysis.id}`}>
      <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg truncate max-w-xs group-hover:text-blue-300 transition-colors">
                {analysis.name}
              </h3>
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <Clock className="w-4 h-4 mr-1" />
                {timeAgo}
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">
                  {stats.instructions.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">Instructions</div>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">
                  {stats.mlOperations}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">ML Ops</div>
            </div>
          </div>
        )}

        {/* Framework badges */}
        {stats && stats.frameworks > 0 && (
          <div className="flex items-center text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full w-fit">
            <Database className="w-3 h-3 mr-1" />
            {stats.frameworks} framework{stats.frameworks !== 1 ? 's' : ''} detected
          </div>
        )}

        {/* Date */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </Link>
  )
}

const getTimeAgo = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export default function EnhancedResultsPage() {
  const [history, setHistory] = useState<AnalysisResult[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem('analysisResults')
        if (stored) {
          const arr = JSON.parse(stored) as any[]
          setHistory(arr.map(({ id, name, date, data }) => ({ id, name, date, data })))
        }
      } catch (error) {
        console.error('Error loading analysis history:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [])

  const filteredHistory = history.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalStats = history.reduce((acc, item) => {
    if (item.data) {
      const stats = getAnalysisStats(item.data)
      if (stats) {
        acc.instructions += stats.instructions
        acc.mlOperations += stats.mlOperations
        acc.frameworks += stats.frameworks
      }
    }
    return acc
  }, { instructions: 0, mlOperations: 0, frameworks: 0 })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white">Loading analysis history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(120,_119,_198,_0.3),_transparent)] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,_119,_198,_0.2),_transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,_rgba(120,_200,_255,_0.2),_transparent)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Analysis <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Results</span>
              </h1>
              <p className="text-gray-300 text-lg">
                {history.length} analysis{history.length !== 1 ? 'es' : ''} completed
              </p>
            </div>
            <Link 
              href="/upload"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold group"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
              New Analysis
            </Link>
          </div>

          {/* Stats Overview */}
          {history.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                  <span className="text-sm text-blue-300 font-medium">Total</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {history.length}
                </div>
                <div className="text-blue-300 text-sm">Analyses</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <Cpu className="w-8 h-8 text-purple-400" />
                  <span className="text-sm text-purple-300 font-medium">Sum</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {totalStats.instructions.toLocaleString()}
                </div>
                <div className="text-purple-300 text-sm">Instructions</div>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 text-green-400" />
                  <span className="text-sm text-green-300 font-medium">Total</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {totalStats.mlOperations}
                </div>
                <div className="text-green-300 text-sm">ML Operations</div>
              </div>

              <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <Database className="w-8 h-8 text-pink-400" />
                  <span className="text-sm text-pink-300 font-medium">Unique</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {totalStats.frameworks}
                </div>
                <div className="text-pink-300 text-sm">Frameworks</div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          {history.length > 0 && (
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search analyses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>
          )}
        </div>

        {/* Results Grid */}
        {history.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-12 max-w-2xl mx-auto">
              <div className="mb-6">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-4">
                  <FileText className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">No Analyses Yet</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Start your binary analysis journey by uploading your first file. 
                  Discover ML operations, analyze instruction patterns, and explore framework signatures.
                </p>
              </div>
              <Link 
                href="/upload" 
                className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold text-lg group"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                Upload & Analyze
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-lg mx-auto">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
              <p className="text-gray-400">
                No analyses match your search term "{searchTerm}"
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((analysis) => (
              <AnalysisCard key={analysis.id} analysis={analysis} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}