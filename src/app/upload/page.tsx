'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  Upload,
  FileText,
  Cpu,
  Settings,
  Zap,
  CheckCircle,
  AlertCircle,
  Code,
  Database,
  Activity,
  Info
} from 'lucide-react'

interface FormValues {
  includeStrings: boolean
  runDisassemble: boolean
  logLevel: string
}

const FeatureCard = ({ icon: Icon, title, description, enabled }) => (
  <div className={`p-4 rounded-xl border transition-all duration-300 ${
    enabled 
      ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30' 
      : 'bg-white/5 border-white/10 hover:border-white/20'
  }`}>
    <div className="flex items-start space-x-3">
      <div className={`p-2 rounded-lg ${
        enabled ? 'bg-blue-500/20' : 'bg-white/10'
      }`}>
        <Icon className={`w-4 h-4 ${enabled ? 'text-blue-400' : 'text-gray-400'}`} />
      </div>
      <div>
        <h4 className={`font-medium mb-1 ${enabled ? 'text-blue-300' : 'text-gray-300'}`}>
          {title}
        </h4>
        <p className="text-sm text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </div>
)

export default function EnhancedUploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysisStage, setAnalysisStage] = useState('')
  const router = useRouter()

  const form = useForm<FormValues>({
    defaultValues: {
      includeStrings: true,
      runDisassemble: false,
      logLevel: 'info',
    },
  })
  const { control, handleSubmit, watch } = form
  const watchedValues = watch()

  const onDrop = useCallback((accepted: File[]) => {
    setFiles(accepted)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    // Accept any file - backend handles validation
  })

  const simulateProgress = () => {
    const stages = [
      'Initializing analysis...',
      'Reading binary structure...',
      'Analyzing instructions...',
      'Detecting ML operations...',
      'Scanning for frameworks...',
      'Generating report...',
      'Finalizing results...'
    ]
    
    let currentStage = 0
    let currentProgress = 0
    
    const updateProgress = () => {
      if (currentProgress < 100) {
        currentProgress += Math.random() * 15
        currentProgress = Math.min(currentProgress, 100)
        setProgress(currentProgress)
        
        const stageIndex = Math.floor((currentProgress / 100) * stages.length)
        if (stageIndex < stages.length) {
          setAnalysisStage(stages[stageIndex])
        }
        
        setTimeout(updateProgress, 200 + Math.random() * 300)
      }
    }
    
    updateProgress()
  }

  const onSubmit = async (data: FormValues) => {
    if (!files[0]) return
    setIsAnalyzing(true)
    setProgress(0)
    setAnalysisStage('Preparing analysis...')
    
    simulateProgress()
    
    try {
      const formData = new FormData()
      formData.append('file', files[0])
      formData.append('includeStrings', data.includeStrings.toString())
      formData.append('runDisassemble', data.runDisassemble.toString())
      formData.append('logLevel', data.logLevel)

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })
      
      if (!res.ok) {
        console.error(await res.text())
        return
      }
      
      const resultJson = await res.json()

      // Assign an ID and persist
      const id = Date.now().toString()
      const entry = {
        id,
        name: files[0].name,
        date: new Date().toISOString(),
        data: resultJson,
      }
      
      const stored = localStorage.getItem('analysisResults')
      const history = stored ? JSON.parse(stored) : []
      localStorage.setItem(
        'analysisResults',
        JSON.stringify([entry, ...history])
      )

      setProgress(100)
      setAnalysisStage('Analysis complete!')
      
      // Redirect to detail view
      setTimeout(() => {
        router.push(`/results/${id}`)
      }, 1000)
      
    } catch (err) {
      console.error(err)
      setAnalysisStage('Analysis failed')
    } finally {
      // Keep loading state until redirect
    }
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      // Windows PE files
      case 'exe': case 'dll': case 'sys': case 'ocx': case 'cpl': case 'drv': return '🔧'
      // macOS Mach-O files  
      case 'dylib': case 'bundle': case 'framework': return '🍎'
      // Linux/Unix ELF files
      case 'so': case 'o': case 'a': return '🐧'
      // Archive formats
      case 'ar': case 'lib': return '📦'
      // Raw binaries
      case 'bin': case 'raw': case 'img': return '💾'
      // Firmware
      case 'fw': case 'rom': case 'bios': return '🔌'
      // Mobile
      case 'apk': case 'ipa': case 'dex': return '📱'
      // Other executables
      case 'com': case 'scr': case 'pif': return '⚙️'
      default: return '📄'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pt-20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(120,_119,_198,_0.3),_transparent)] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,_119,_198,_0.2),_transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,_rgba(120,_200,_255,_0.2),_transparent)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-6">
            <Upload className="w-4 h-4 mr-2 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Binary Analysis Engine</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Upload & <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Analyze</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload any binary file or executable to discover ML operations, instruction patterns, 
            and framework signatures.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Drop Zone */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <FileText className="w-6 h-6 text-blue-400 mr-3" />
                <h2 className="text-2xl font-bold">Select Binary or Executable</h2>
              </div>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-500/10'
                    : files[0]
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5'
                }`}
              >
                <input {...getInputProps()} />
                
                <div className="space-y-4">
                  {files[0] ? (
                    <>
                      <div className="text-6xl">{getFileIcon(files[0].name)}</div>
                      <div>
                        <p className="text-lg font-medium text-green-400 mb-1">
                          {files[0].name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {(files[0].size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="flex items-center justify-center mt-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                          <span className="text-green-400 font-medium">Ready for analysis</span>
                        </div>
                      </div>
                    </>
                  ) : isDragActive ? (
                    <>
                      <Upload className="w-16 h-16 mx-auto text-blue-400 animate-bounce" />
                      <p className="text-lg font-medium text-blue-400">Drop your file here</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-16 h-16 mx-auto text-gray-400" />
                      <div>
                        <p className="text-lg font-medium text-white mb-2">
                          Drag & drop any binary or executable here
                        </p>
                        <p className="text-gray-400">
                          or <span className="text-blue-400 font-medium">click to browse</span>
                        </p>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 flex-wrap">
                        <span>PE</span>
                        <span>•</span>
                        <span>ELF</span>
                        <span>•</span>
                        <span>Mach-O</span>
                        <span>•</span>
                        <span>APK</span>
                        <span>•</span>
                        <span>+ hundreds more</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Analysis Options */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <Settings className="w-6 h-6 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold">Analysis Configuration</h2>
              </div>

              <Form {...form}>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={control}
                      name="includeStrings"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                          <div>
                            <FormLabel className="text-base font-medium text-white">
                              String Analysis
                            </FormLabel>
                            <p className="text-sm text-gray-400 mt-1">
                              Extract and analyze string patterns
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="runDisassemble"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                          <div>
                            <FormLabel className="text-base font-medium text-white">
                              Disassembly
                            </FormLabel>
                            <p className="text-sm text-gray-400 mt-1">
                              Generate detailed assembly output
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={control}
                    name="logLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-white flex items-center">
                          <Activity className="w-4 h-4 mr-2" />
                          Logging Level
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue placeholder="Select logging level" />
                            </SelectTrigger>
                            <SelectContent>
                              {['debug', 'info', 'warn', 'error'].map(level => (
                                <SelectItem key={level} value={level}>
                                  {level.toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={files.length === 0 || isAnalyzing}
                    className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-pulse" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Cpu className="w-5 h-5 mr-2" />
                        Start Analysis
                      </>
                    )}
                  </Button>
                </div>
              </Form>

              {/* Progress Section */}
              {isAnalyzing && (
                <div className="mt-6 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-blue-300">{analysisStage}</span>
                    <span className="text-blue-300">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>
          </div>

          {/* Feature Overview Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <Info className="w-6 h-6 text-green-400 mr-3" />
                <h3 className="text-xl font-bold">Analysis Features</h3>
              </div>
              
              <div className="space-y-4">
                <FeatureCard
                  icon={Code}
                  title="Instruction Analysis"
                  description="Deep analysis of assembly instructions with pattern recognition"
                  enabled={true}
                />
                
                <FeatureCard
                  icon={Activity}
                  title="ML Operation Detection"
                  description="Identify machine learning operations and neural network patterns"
                  enabled={true}
                />
                
                <FeatureCard
                  icon={Database}
                  title="Framework Detection"
                  description="Recognize popular ML frameworks like TensorFlow and PyTorch"
                  enabled={true}
                />
                
                <FeatureCard
                  icon={FileText}
                  title="String Extraction"
                  description="Extract and analyze embedded strings and identifiers"
                  enabled={watchedValues.includeStrings}
                />
                
                <FeatureCard
                  icon={Cpu}
                  title="Disassembly Output"
                  description="Generate detailed assembly code for manual inspection"
                  enabled={watchedValues.runDisassemble}
                />
              </div>
            </div>

            {/* Quick Tips */}
            {/* <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
                <h4 className="font-medium text-yellow-300">Quick Tips</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Supports PE, ELF, Mach-O, and hundreds of binary formats</li>
                <li>• Larger files may take longer to analyze</li>
                <li>• Enable disassembly for detailed code inspection</li>
                <li>• String analysis helps identify embedded frameworks</li>
                <li>• Debug logging provides detailed analysis information</li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}