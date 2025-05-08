"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function TestPage() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Test Page</h1>
      <p className="mb-4">Counter: {count}</p>
      <Button 
        onClick={() => setCount(count + 1)}
        className="mr-2"
      >
        Increment
      </Button>
      <Button 
        onClick={() => setCount(0)}
        variant="outline"
      >
        Reset
      </Button>
    </div>
  )
} 