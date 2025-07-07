// src/components/DataViewer.tsx
'use client'

import React from 'react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend as RechartsLegend,
} from 'recharts'
import {
  FileText,
  Activity,
  Layers,
  BarChart3,
  Database,
  Code,
  TrendingUp,
  Zap
} from 'lucide-react'

interface DataViewerProps {
  data: any
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4']

const StatCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400", 
    green: "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400",
    orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400",
    red: "from-red-500/20 to-red-600/20 border-red-500/30 text-red-400",
    cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400"
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm border rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-6 h-6" />
        <span className={`text-xs font-medium text-${color}-300 uppercase tracking-wide`}>
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  )
}

const EnhancedTable = ({ data, title, icon: Icon }) => (
  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
    <div className="flex items-center mb-4">
      <Icon className="w-5 h-5 text-blue-400 mr-3" />
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Field</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, val]) => (
            <tr key={key} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4 text-gray-300 font-medium">{key}</td>
              <td className="py-3 px-4 text-white font-mono text-sm">{String(val)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const ChartContainer = ({ title, icon: Icon, children }) => (
  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
    <div className="flex items-center mb-6">
      <Icon className="w-6 h-6 text-purple-400 mr-3" />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
)

export function DataViewer({ data }: DataViewerProps) {
  const {
    metadata,
    instruction_statistics,
    ml_operations,
    section_analysis,
    summary,
    framework_analysis,
  } = data

  // Prepare operation breakdown for the pie chart
  const operationData = Object.entries(summary.operation_breakdown || {}).map(
    ([name, value]) => ({ name, value })
  )

  // Prepare instruction entries for the bar chart
  const instructionEntries = Object.entries(
    instruction_statistics.instruction_types || {}
  ).map(([type, count]) => ({ type, count }))

  // Prepare framework counts (for Frameworks tab)
  let frameworkData: { framework: string; count: number }[] = []
  const countsObj = framework_analysis.framework_counts || {}
  if (Object.keys(countsObj).length > 0) {
    frameworkData = Object.entries(countsObj).map(
      ([framework, count]) => ({ framework, count })
    )
  } else if (framework_analysis.sample_references) {
    const tempCounts: Record<string, number> = {}
    framework_analysis.sample_references.forEach((ref: any) => {
      tempCounts[ref.framework] = (tempCounts[ref.framework] || 0) + 1
    })
    frameworkData = Object.entries(tempCounts).map(
      ([framework, count]) => ({ framework, count })
    )
  }
  frameworkData.sort((a, b) => b.count - a.count)

  return (
    <div className="space-y-8">
      <Tabs defaultValue="metadata" className="space-y-6">
        <TabsList className="bg-slate-800/50 backdrop-blur-sm border border-white/10 p-1 rounded-xl">
          <TabsTrigger 
            value="metadata" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-gray-300"
          >
            <FileText className="w-4 h-4 mr-2" />
            Metadata
          </TabsTrigger>
          <TabsTrigger 
            value="instructions"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-gray-300"
          >
            <Code className="w-4 h-4 mr-2" />
            Instructions
          </TabsTrigger>
          <TabsTrigger 
            value="ml-ops"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-gray-300"
          >
            <Activity className="w-4 h-4 mr-2" />
            ML Operations
          </TabsTrigger>
          <TabsTrigger 
            value="sections"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-gray-300"
          >
            <Layers className="w-4 h-4 mr-2" />
            Sections
          </TabsTrigger>
          <TabsTrigger 
            value="summary"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-gray-300"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger 
            value="frameworks"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-gray-300"
          >
            <Database className="w-4 h-4 mr-2" />
            Frameworks
          </TabsTrigger>
        </TabsList>

        {/* Metadata Tab */}
        <TabsContent value="metadata">
          <EnhancedTable data={metadata} title="File Metadata" icon={FileText} />
        </TabsContent>

        {/* Instructions Tab */}
        <TabsContent value="instructions">
          <ChartContainer title="Instruction Statistics" icon={Code}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300">Total Instructions Analyzed:</span>
                <span className="text-2xl font-bold text-blue-400">
                  {instruction_statistics.total_instructions_analyzed?.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={instructionEntries}>
                  <XAxis 
                    dataKey="type" 
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    axisLine={{ stroke: '#374151' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    axisLine={{ stroke: '#374151' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '12px',
                      color: '#F1F5F9',
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {instructionEntries.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <Accordion type="single" collapsible className="bg-white/5 rounded-lg border border-white/10">
              <AccordionItem value="instr-details" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-blue-300 px-6">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Show detailed instruction counts
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-gray-300 font-medium">Instruction</th>
                          <th className="text-left py-3 px-4 text-gray-300 font-medium">Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {instructionEntries.map((entry) => (
                          <tr key={entry.type} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4 text-gray-300 font-mono">{entry.type}</td>
                            <td className="py-3 px-4 text-white font-semibold">{entry.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ChartContainer>
        </TabsContent>

        {/* ML Operations Tab */}
        <TabsContent value="ml-ops">
          <ChartContainer title="ML Operations Analysis" icon={Activity}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300">Total Operations:</span>
                <span className="text-2xl font-bold text-purple-400">
                  {ml_operations.summary.total_operations}
                </span>
              </div>
            </div>

            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={operationData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                  >
                    {operationData.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '12px',
                      color: '#F1F5F9',
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                  <RechartsLegend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ color: '#9CA3AF' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <Accordion type="single" collapsible className="bg-white/5 rounded-lg border border-white/10">
              <AccordionItem value="ops-details" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-purple-300 px-6">
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Show detailed ML operations
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <Accordion type="single" collapsible className="space-y-3">
                    {(ml_operations.operations || []).map(
                      (op: any, idx: number) => (
                        <AccordionItem key={idx} value={`op-${idx}`} className="bg-white/5 rounded-lg border border-white/10">
                          <AccordionTrigger className="text-white hover:text-blue-300 px-4">
                            <div className="flex items-center justify-between w-full mr-4">
                              <span className="font-semibold">{op.type}</span>
                              <span className="text-sm text-gray-400">
                                {op.start_address} → {op.end_address}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-gray-400">Details:</span>
                                  <p className="text-white">{op.details}</p>
                                </div>
                                <div>
                                  <span className="text-gray-400">Instructions:</span>
                                  <p className="text-white font-semibold">{op.instruction_count}</p>
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Detection Time:</span>
                                <span className="text-green-400 ml-2 font-semibold">{op.detection_time_ms} ms</span>
                              </div>
                              <div className="max-h-48 overflow-auto bg-black/20 rounded-lg p-3">
                                <div className="space-y-1">
                                  {op.instructions.map((inst: string, i: number) => (
                                    <div key={i} className="text-xs font-mono text-gray-300 hover:text-white transition-colors">
                                      {inst}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    )}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ChartContainer>
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections">
          <ChartContainer title="Section Analysis" icon={Layers}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300">Total Sections:</span>
                <span className="text-2xl font-bold text-orange-400">
                  {section_analysis.length}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Section</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Address</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Size</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Patterns Found</th>
                  </tr>
                </thead>
                <tbody>
                  {section_analysis.map((sec: any) => (
                    <tr key={sec.address} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-white font-semibold">{sec.name}</td>
                      <td className="py-3 px-4 text-gray-300 font-mono text-sm">{sec.address}</td>
                      <td className="py-3 px-4 text-gray-300">{sec.size}</td>
                      <td className="py-3 px-4 text-green-400 font-semibold">
                        {sec.ml_patterns_found}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartContainer>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary">
          <ChartContainer title="Analysis Summary" icon={BarChart3}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Metric</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(summary).map(([key, val]) => {
                    if (val !== null && typeof val === 'object') {
                      const entries = Object.entries(val)
                      if (entries.length === 0) {
                        if (key === 'framework_breakdown') {
                          return (
                            <tr key={key} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-3 px-4 text-gray-300 font-medium">Framework Breakdown</td>
                              <td className="py-3 px-4 text-white">
                                {framework_analysis.detected_frameworks.length > 0
                                  ? framework_analysis.detected_frameworks.join(', ')
                                  : '-'}
                              </td>
                            </tr>
                          )
                        }
                        return (
                          <tr key={key} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4 text-gray-300 font-medium">{key}</td>
                            <td className="py-3 px-4 text-white">-</td>
                          </tr>
                        )
                      }
                      return (
                        <tr key={key} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 font-medium">{key}</td>
                          <td className="py-3 px-4">
                            <div className="bg-white/5 rounded-lg p-3">
                              <table className="w-full">
                                <tbody>
                                  {entries.map(([item, count]) => (
                                    <tr key={item} className="border-b border-white/5">
                                      <td className="py-2 px-3 text-gray-300 text-sm">{item}</td>
                                      <td className="py-2 px-3 text-white font-semibold text-sm">{count}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )
                    }
                    return (
                      <tr key={key} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-gray-300 font-medium">{key}</td>
                        <td className="py-3 px-4 text-white font-semibold">{String(val)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </ChartContainer>
        </TabsContent>

        {/* Frameworks Tab */}
        <TabsContent value="frameworks">
          <ChartContainer title="Framework Analysis" icon={Database}>
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Framework</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {frameworkData.map((fw) => (
                      <tr key={fw.framework} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-white font-semibold">{fw.framework}</td>
                        <td className="py-3 px-4 text-green-400 font-semibold">{fw.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Accordion type="single" collapsible className="bg-white/5 rounded-lg border border-white/10">
                <AccordionItem value="sample-refs" className="border-white/10">
                  <AccordionTrigger className="text-white hover:text-green-300 px-6">
                    <div className="flex items-center">
                      <Database className="w-4 h-4 mr-2" />
                      Show sample references
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="max-h-80 overflow-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Address</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Framework</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">String</th>
                          </tr>
                        </thead>
                        <tbody>
                          {framework_analysis.sample_references.map(
                            (ref: any, idx: number) => (
                              <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                                <td className="py-3 px-4 text-gray-300 font-mono text-sm">{ref.address}</td>
                                <td className="py-3 px-4 text-green-400 font-semibold">{ref.framework}</td>
                                <td className="py-3 px-4 text-white font-mono text-sm max-w-xs truncate">{ref.string}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </div>
  )
}