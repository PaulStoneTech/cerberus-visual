'use client'

// src/components/CerberusHomepage.tsx
import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import * as THREE from 'three'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts'
import { 
  Binary, 
  Cpu, 
  Eye, 
  Zap, 
  Shield, 
  Code, 
  Upload,
  TrendingUp,
  Activity,
  Search,
  Database,
  ArrowRight,
  Play
} from 'lucide-react'

// Sample data for visualizations
const instructionData = [
  { name: 'MOV', count: 1250 },
  { name: 'ADD', count: 890 },
  { name: 'JMP', count: 650 },
  { name: 'CMP', count: 520 },
  { name: 'LEA', count: 380 },
  { name: 'CALL', count: 290 }
]

const mlOperationsData = [
  { name: 'Matrix Ops', value: 35, color: '#8884d8' },
  { name: 'Convolution', value: 28, color: '#82ca9d' },
  { name: 'Activation', value: 20, color: '#ffc658' },
  { name: 'Pooling', value: 12, color: '#ff8042' },
  { name: 'Normalization', value: 5, color: '#8dd1e1' }
]

const analysisMetrics = [
  { time: '0ms', instructions: 0, mlOps: 0 },
  { time: '50ms', instructions: 1200, mlOps: 5 },
  { time: '100ms', instructions: 3200, mlOps: 15 },
  { time: '150ms', instructions: 5800, mlOps: 28 },
  { time: '200ms', instructions: 8500, mlOps: 45 },
  { time: '250ms', instructions: 12000, mlOps: 67 }
]

// 3D Neural Network Visualization Component
const NeuralNetworkVisualization = () => {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    const camera = new THREE.PerspectiveCamera(75, 400/300, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(400, 300)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // Create neural network nodes
    const nodes = []
    const connections = []
    const nodeCount = 25
    
    // Create nodes in 3D space
    for (let i = 0; i < nodeCount; i++) {
      const geometry = new THREE.SphereGeometry(0.1, 8, 8)
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.7, 0.5),
        transparent: true,
        opacity: 0.8
      })
      const node = new THREE.Mesh(geometry, material)
      
      // Position nodes in a 3D grid with some randomness
      node.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
      )
      
      scene.add(node)
      nodes.push({
        mesh: node,
        originalPos: node.position.clone(),
        pulsePhase: Math.random() * Math.PI * 2
      })
    }

    // Create connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = nodes[i].mesh.position.distanceTo(nodes[j].mesh.position)
        if (distance < 4 && Math.random() > 0.7) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            nodes[i].mesh.position,
            nodes[j].mesh.position
          ])
          const material = new THREE.LineBasicMaterial({ 
            color: 0x4CAF50,
            transparent: true,
            opacity: 0.3
          })
          const line = new THREE.Line(geometry, material)
          scene.add(line)
          connections.push({
            line,
            startNode: i,
            endNode: j,
            pulseOffset: Math.random() * Math.PI * 2
          })
        }
      }
    }

    // Add floating particles
    const particleCount = 50
    const particles = []
    const particleGeometry = new THREE.SphereGeometry(0.02, 4, 4)
    
    for (let i = 0; i < particleCount; i++) {
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.5 + Math.random() * 0.3, 0.8, 0.6),
        transparent: true,
        opacity: 0.6
      })
      const particle = new THREE.Mesh(particleGeometry, particleMaterial)
      particle.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8
      )
      scene.add(particle)
      particles.push({
        mesh: particle,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        )
      })
    }

    camera.position.z = 12

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      
      const time = Date.now() * 0.001

      // Animate nodes with pulsing effect
      nodes.forEach((node, i) => {
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.3 + 0.7
        node.mesh.material.opacity = pulse
        node.mesh.scale.setScalar(0.8 + pulse * 0.4)
        
        // Slight floating motion
        node.mesh.position.y = node.originalPos.y + Math.sin(time + i) * 0.2
      })

      // Animate connection opacity with data flow effect
      connections.forEach((conn, i) => {
        const flow = Math.sin(time * 3 + conn.pulseOffset) * 0.5 + 0.5
        conn.line.material.opacity = 0.1 + flow * 0.4
      })

      // Animate particles
      particles.forEach(particle => {
        particle.mesh.position.add(particle.velocity)
        
        // Boundary check and bounce
        if (Math.abs(particle.mesh.position.x) > 7) particle.velocity.x *= -1
        if (Math.abs(particle.mesh.position.y) > 5) particle.velocity.y *= -1
        if (Math.abs(particle.mesh.position.z) > 4) particle.velocity.z *= -1
        
        // Gentle pulsing
        const pulse = Math.sin(time * 4 + particle.mesh.position.x) * 0.3 + 0.7
        particle.mesh.material.opacity = pulse * 0.6
      })

      // Smooth camera movement
      camera.position.x = Math.sin(time * 0.2) * 3
      camera.position.y = Math.cos(time * 0.15) * 2
      camera.lookAt(0, 0, 0)
      
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="w-full h-full" />
}

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime = null
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = (currentTime - startTime) / duration
      
      if (progress < 1) {
        setCount(Math.floor(end * progress))
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration])

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>
}

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, gradient }) => (
  <div className={`relative p-6 rounded-xl bg-gradient-to-br ${gradient} backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group`}>
    <div className="relative z-10">
      <div className="inline-flex p-3 rounded-lg bg-white/10 mb-4 group-hover:bg-white/20 transition-colors">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/80 leading-relaxed">{description}</p>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
)

export default function CerberusHomepage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(120,_119,_198,_0.3),_transparent)] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,_119,_198,_0.2),_transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,_rgba(120,_200,_255,_0.2),_transparent)]" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
              <Shield className="w-4 h-4 mr-2 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Advanced Binary Analysis</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                CERBERUS
              </span>
              <br />
              <span className="text-white">VISUAL</span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
              Detect ML operations, analyze instruction patterns,
              and visualize complex assembly structures. Check out the github: https://github.com/kjm-techolution/nasic-research-project
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/upload"
                className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold text-lg group"
              >
                <Upload className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Analysis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/results"
                className="inline-flex items-center px-8 py-4 rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300 font-semibold text-lg group"
              >
                <Play className="w-5 h-5 mr-2" />
                View Results
              </Link>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  <AnimatedCounter end={15000} suffix="+" />
                </div>
                <div className="text-sm text-gray-400">Instructions Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  <AnimatedCounter end={127} />
                </div>
                <div className="text-sm text-gray-400">ML Operations Found</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">
                  <AnimatedCounter end={23} />
                </div>
                <div className="text-sm text-gray-400">Frameworks Detected</div>
              </div>
            </div>
          </div>

          {/* 3D Visualization */}
          <div className={`lg:h-96 h-64 relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl" />
            <div className="relative h-full rounded-2xl border border-white/10 overflow-hidden bg-black/20 backdrop-blur-sm">
              <NeuralNetworkVisualization />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Powerful Analysis <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Capabilities</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced binary analysis powered by machine learning and intelligent pattern recognition
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Cpu}
              title="ML Operation Detection"
              description="Automatically identify machine learning operations including matrix multiplications, convolutions, and neural network patterns."
              gradient="from-blue-600/80 to-purple-600/80"
            />
            <FeatureCard
              icon={Binary}
              title="Instruction Analysis"
              description="Deep analysis of assembly instructions with statistical breakdowns and pattern recognition for optimization insights."
              gradient="from-purple-600/80 to-pink-600/80"
            />
            <FeatureCard
              icon={Eye}
              title="Visual Exploration"
              description="Interactive charts, heatmaps, and 3D visualizations to explore binary structure and execution patterns."
              gradient="from-pink-600/80 to-red-600/80"
            />
            <FeatureCard
              icon={Search}
              title="Framework Detection"
              description="Identify popular ML frameworks like TensorFlow, PyTorch, and ONNX embedded within compiled binaries."
              gradient="from-green-600/80 to-blue-600/80"
            />
            <FeatureCard
              icon={Zap}
              title="Real-time Processing"
              description="Fast analysis with progress tracking and intelligent caching for efficient workflow management."
              gradient="from-yellow-600/80 to-orange-600/80"
            />
            <FeatureCard
              icon={Database}
              title="Analysis History"
              description="Comprehensive logging and history tracking with exportable reports and comparative analysis tools."
              gradient="from-cyan-600/80 to-blue-600/80"
            />
          </div>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Live <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Analytics</span>
            </h2>
            <p className="text-xl text-gray-300">Real-time insights from binary analysis</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Instruction Distribution */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Code className="w-5 h-5 mr-2 text-blue-400" />
                Instruction Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={instructionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ML Operations Breakdown */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-400" />
                ML Operations
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={mlOperationsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {mlOperationsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Analysis Timeline */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Analysis Progress
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analysisMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="instructions" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mlOps" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl border border-white/10 p-12 backdrop-blur-sm">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Analyze Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Binaries?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Upload your binary files and discover hidden ML operations, instruction patterns, 
              and framework signatures with our advanced analysis engine.
            </p>
            <Link 
              href="/upload"
              className="inline-flex items-center px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold text-xl group"
            >
              <Upload className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Start Your Analysis
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}