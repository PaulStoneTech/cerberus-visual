'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronDown,
  Home,
  Upload,
  BarChart3,
  Eye,
  Settings,
  Activity,
  Shield,
  Menu,
  X
} from 'lucide-react'

const NavLink = ({ href, children, icon: Icon, isActive }) => (
  <Link 
    href={href}
    className={`inline-flex items-center px-4 py-2 rounded-lg transition-all duration-300 group ${
      isActive 
        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30' 
        : 'text-gray-300 hover:text-white hover:bg-white/10'
    }`}
  >
    {Icon && <Icon className="w-4 h-4 mr-2" />}
    {children}
  </Link>
)

const DropdownMenu = ({ trigger, children, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 group"
      >
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {trigger}
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl z-20 py-2">
            {children}
          </div>
        </>
      )}
    </div>
  )
}

const DropdownItem = ({ href, children, icon: Icon }) => (
  <Link 
    href={href}
    className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors group"
  >
    {Icon && <Icon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-400" />}
    {children}
  </Link>
)

export default function EnhancedSiteHeader() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/')

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-xl' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                CERBERUS
              </span>
              <div className="text-xs text-gray-400 -mt-1">VISUAL</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink href="/" icon={Home} isActive={isActive('/')}>
              Home
            </NavLink>

            <DropdownMenu trigger="Analysis" icon={Activity}>
              <DropdownItem href="/upload" icon={Upload}>
                Upload & Analyze
              </DropdownItem>
              <DropdownItem href="/options" icon={Settings}>
                Options
              </DropdownItem>
            </DropdownMenu>

            <NavLink href="/results" icon={BarChart3} isActive={isActive('/results')}>
              Results
            </NavLink>

            <DropdownMenu trigger="Visualizations" icon={Eye}>
              <DropdownItem href="/visualizations/heatmaps" icon={Activity}>
                Heatmaps
              </DropdownItem>
              <DropdownItem href="/visualizations/stride-patterns" icon={BarChart3}>
                Stride Patterns
              </DropdownItem>
            </DropdownMenu>

            <NavLink href="/logs" isActive={isActive('/logs')}>
              Logs & Diagnostics
            </NavLink>

            <DropdownMenu trigger="Settings" icon={Settings}>
              <DropdownItem href="/settings/config" icon={Settings}>
                Config Paths
              </DropdownItem>
              <DropdownItem href="/settings/about" icon={Shield}>
                About
              </DropdownItem>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-md border border-white/10 rounded-xl mt-2 mb-4 p-4 space-y-2">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive('/') ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-4 h-4 mr-3" />
              Home
            </Link>

            <div className="border-t border-white/10 pt-2 mt-2">
              <div className="text-sm text-gray-400 px-4 py-2 font-medium">Analysis</div>
              <Link 
                href="/upload" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Upload className="w-4 h-4 mr-3" />
                Upload & Analyze
              </Link>
              <Link 
                href="/options" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Settings className="w-4 h-4 mr-3" />
                Options
              </Link>
            </div>

            <Link 
              href="/results" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive('/results') ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-3" />
              Results
            </Link>

            <div className="border-t border-white/10 pt-2 mt-2">
              <div className="text-sm text-gray-400 px-4 py-2 font-medium">Visualizations</div>
              <Link 
                href="/visualizations/heatmaps" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Activity className="w-4 h-4 mr-3" />
                Heatmaps
              </Link>
              <Link 
                href="/visualizations/stride-patterns" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                Stride Patterns
              </Link>
            </div>

            <Link 
              href="/logs" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Logs & Diagnostics
            </Link>

            <div className="border-t border-white/10 pt-2 mt-2">
              <div className="text-sm text-gray-400 px-4 py-2 font-medium">Settings</div>
              <Link 
                href="/settings/config" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Settings className="w-4 h-4 mr-3" />
                Config Paths
              </Link>
              <Link 
                href="/settings/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Shield className="w-4 h-4 mr-3" />
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}