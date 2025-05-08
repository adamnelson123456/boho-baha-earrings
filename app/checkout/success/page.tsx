"use client"

import Link from "next/link"
import { useEffect } from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  useEffect(() => {
    // Clear the cart after successful payment
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart')
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-medium text-gray-900">
            Billy's Jewelry
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-medium text-gray-900 mb-4">Thank You For Your Order!</h1>
          
          <p className="text-gray-600 mb-8">
            Your order has been placed successfully. We will send you a confirmation email with order details and tracking information once your item ships.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Order Summary</h2>
            <p className="text-sm text-gray-600 mb-1">Order ID: #ORD-{Math.floor(100000 + Math.random() * 900000)}</p>
            <p className="text-sm text-gray-600">Order Date: {new Date().toLocaleDateString()}</p>
          </div>
          
          <Link href="/">
            <Button className="bg-black hover:bg-gray-800">Return to Shop</Button>
          </Link>
        </div>
      </main>
    </div>
  )
} 