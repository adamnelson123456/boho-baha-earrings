"use client"

import { useState, useEffect } from "react"

export default function DebugStorage() {
  const [localStorageItems, setLocalStorageItems] = useState<Record<string, string>>({})
  
  useEffect(() => {
    // Function to get all localStorage items
    const getLocalStorageItems = () => {
      const items: Record<string, string> = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          items[key] = localStorage.getItem(key) || ''
        }
      }
      return items
    }

    // Set initial items
    setLocalStorageItems(getLocalStorageItems())

    // Update on localStorage changes
    const handleStorageChange = () => {
      setLocalStorageItems(getLocalStorageItems())
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Force refresh every second to catch changes
    const interval = setInterval(() => {
      setLocalStorageItems(getLocalStorageItems())
    }, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])
  
  return (
    <div className="fixed bottom-0 right-0 bg-black bg-opacity-80 text-white p-4 max-w-md max-h-64 overflow-auto text-xs z-50">
      <h3 className="font-bold mb-2">localStorage Debug</h3>
      {Object.keys(localStorageItems).length === 0 ? (
        <p>No items in localStorage</p>
      ) : (
        <div>
          {Object.entries(localStorageItems).map(([key, value]) => (
            <div key={key} className="mb-2">
              <div className="font-semibold">{key}:</div>
              <pre className="whitespace-pre-wrap break-words">{value}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 