"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TestStoragePage() {
  const [testValue, setTestValue] = useState('')
  const [cartContents, setCartContents] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get existing test value
      const storedValue = localStorage.getItem('test-value') || ''
      setTestValue(storedValue)
      
      // Get cart contents
      const cart = localStorage.getItem('cart') || ''
      setCartContents(cart)
    }
  }, [])

  const setTestStorage = () => {
    try {
      const newValue = `Test ${Date.now()}`
      localStorage.setItem('test-value', newValue)
      setTestValue(newValue)
      setStatusMessage(`Successfully set test value: ${newValue}`)
    } catch (error) {
      console.error('Error setting test value:', error)
      setStatusMessage(`Error setting test value: ${error}`)
    }
  }

  const createDummyCart = () => {
    try {
      const dummyItem = {
        id: "test-item",
        name: "Test Item",
        price: 99.99,
        size: "M",
        quantity: 2,
        image: "/placeholder.svg?height=120&width=120"
      }
      
      localStorage.setItem('cart', JSON.stringify([dummyItem]))
      setCartContents(JSON.stringify([dummyItem]))
      setStatusMessage('Successfully created dummy cart item')
    } catch (error) {
      console.error('Error creating dummy cart:', error)
      setStatusMessage(`Error creating dummy cart: ${error}`)
    }
  }

  const clearStorage = () => {
    try {
      localStorage.clear()
      setTestValue('')
      setCartContents('')
      setStatusMessage('localStorage cleared')
    } catch (error) {
      console.error('Error clearing storage:', error)
      setStatusMessage(`Error clearing storage: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">localStorage Test Page</h1>
      
      <div className="space-y-6">
        <div className="p-4 border rounded-md">
          <h2 className="text-lg font-semibold mb-2">Test Value</h2>
          <p className="mb-4">Current value: <span className="font-mono">{testValue || 'none'}</span></p>
          <Button onClick={setTestStorage} className="mr-2">Set Test Value</Button>
        </div>
        
        <div className="p-4 border rounded-md">
          <h2 className="text-lg font-semibold mb-2">Cart Contents</h2>
          <pre className="bg-gray-100 p-4 rounded-md mb-4 whitespace-pre-wrap overflow-auto max-h-40">
            {cartContents || 'No cart found'}
          </pre>
          <Button onClick={createDummyCart} className="mr-2">Create Dummy Cart</Button>
        </div>
        
        <div className="p-4 border rounded-md">
          <h2 className="text-lg font-semibold mb-2">Clear Storage</h2>
          <Button onClick={clearStorage} variant="destructive">Clear All localStorage</Button>
        </div>
        
        {statusMessage && (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-md">
            {statusMessage}
          </div>
        )}
        
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
          {' | '}
          <Link href="/cart" className="text-blue-600 hover:underline">View Cart</Link>
        </div>
      </div>
    </div>
  )
} 