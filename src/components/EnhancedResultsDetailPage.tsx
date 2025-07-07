'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { DataViewer } from '@/components/DataViewer'
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Download, 
  Share2,
  MoreVertical,
  Cpu,
  Activity,
  Database,
  Layers,
  Clock,
  CheckCircle
} from 'lucide-react'

interface AnalysisEntry {
  id: string
  name: string
  date: string
  data: any
}

const StatCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400", 
    green: "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400",
    orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400"
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm border rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-6 h-6" />
        <span className={`text-xs font-medium text-${color}-300`}>
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  )
}

export default function EnhancedResultsDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [entry, setEntry] = useState<AnalysisEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadEntry = () => {
      try {
        const stored = localStorage.getItem('analysisResults')
        if (!stored) {
          router.push('/results')
          return
        }
        
        const arr = JSON.parse(stored) as AnalysisEntry[]
        const found = arr.find(e => e.id === id)
        if (!found) {
          router.push('/results')
          return
        }
        
        setEntry(found)
      } catch (error) {
        console.error('Error loading analysis entry:', error)
        router.push('/results')
      } finally {
        setIsLoading(false)
      }
    }

    loadEntry()
  }, [id, router])

  const handleExport = () => {
    if (!entry) return
    
    const dataStr = JSON.stringify(entry.data, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${entry.name}-analysis.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (navigator.share && entry) {
      try {
        await navigator.share({
          title: `Analysis: ${entry.name}`,
          text: 'Check out this binary analysis result',
          url: window.location.href
        })
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white">Loading analysis...</p>
        </div>
      </div>
    )
  }

  if (!entry || !entry.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Analysis not found</p>
        </div>
      </div>
    )
  }

  const date = new Date(entry.date)
  const stats = {
    instructions: entry.data.instruction_statistics?.total_instructions_analyzed || 0,
    mlOperations: entry.data.ml_operations?.summary?.total_operations || 0,
    frameworks: entry.data.framework_analysis?.detected_frameworks?.length || 0,
    sections: entry.data.section_analysis?.length || 0
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
          {/* Navigation */}
          <div className="flex items-center mb-6">
            <Link 
              href="/results" 
              className="inline-flex items-center text-gray-300 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Results
            </Link>
          </div>

          {/* Title Section */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{entry.name}</h1>
                  <div className="flex items-center space-x-6 text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center text-green-400">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Analysis Complete
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                  title="Share Analysis"
                >
                  <Share2 className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>
                <button
                  onClick={handleExport}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                  title="Export Data"
                >
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Cpu}
              label="Instructions"
              value={stats.instructions}
              color="blue"
            />
            <StatCard
              icon={Activity}
              label="ML Operations" 
              value={stats.mlOperations}
              color="purple"
            />
            <StatCard
              icon={Database}
              label="Frameworks"
              value={stats.frameworks}
              color="green"
            />
            <StatCard
              icon={Layers}
              label="Sections"
              value={stats.sections}
              color="orange"
            />
          </div>
        </div>

        {/* Analysis Data */}
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <div className="flex items-center mb-6">
            <Activity className="w-6 h-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold">
              Analysis <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Details</span>
            </h2>
          </div>
          
          <DataViewer data={entry.data} />
        </div>
      </div>
    </div>
  )
}