"use client"

import dynamic from 'next/dynamic'

// Dynamically import the debug component with no SSR
const DebugStorage = dynamic(() => import('./debug'), { ssr: false })

export default function DebugWrapper() {
  return process.env.NODE_ENV === 'development' ? <DebugStorage /> : null
} 