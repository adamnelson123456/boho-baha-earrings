"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

// Define cart item type
interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

// Load Stripe outside of component render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    console.log("Cart page - useEffect running");
    
    // Check if window is defined (i.e., we're in the browser)
    if (typeof window !== 'undefined') {
      // Load cart from localStorage
      const storedCart = localStorage.getItem('cart')
      console.log("Cart page - retrieved from localStorage:", storedCart);
      
      if (storedCart) {
        try {
          const cart: CartItem[] = JSON.parse(storedCart)
          console.log("Cart page - parsed cart:", cart);
          setCartItems(cart)
          
          // Calculate total
          const cartTotal = cart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)
          console.log("Cart page - calculated total:", cartTotal);
          setTotal(cartTotal)
        } catch (e) {
          console.error('Failed to parse cart data', e)
        }
      } else {
        console.log("Cart page - no cart found in localStorage");
      }
    }
  }, [])

  const handleRemoveItem = (index: number) => {
    const updatedCart = [...cartItems]
    updatedCart.splice(index, 1)
    
    // Update state
    setCartItems(updatedCart)
    
    // Recalculate total
    const newTotal = updatedCart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)
    setTotal(newTotal)
    
    // Update localStorage if in browser context
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(updatedCart))
    }
  }

  const handleCheckout = async () => {
    try {
      // Verify all products have sizes selected
      const invalidItems = cartItems.filter(item => !item.size);
      if (invalidItems.length > 0) {
        toast({
          title: "Missing Information",
          description: "Please select a style for all items in your cart",
          variant: "destructive",
        });
        return;
      }
      
      setIsProcessing(true)
      
      // Call our API route to create a Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
        }),
      })
      
      const { url, error } = await response.json()
      
      if (error) {
        toast({
          title: "Checkout Error",
          description: error,
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }
      
      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error('Error during checkout:', error)
      toast({
        title: "Checkout Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-medium text-gray-900">
            Billy's Jewelry
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-medium text-gray-900 mb-8">Your Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">Your cart is empty</p>
              <Link href="/">
                <Button className="bg-black hover:bg-gray-800">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.size}-${index}`} className="border border-gray-200 rounded-lg p-6 mb-4">
                  <div className="flex items-start gap-6">
                    <div className="bg-gray-50 rounded-md p-2 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={120}
                        height={120}
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Style: {item.size}</p>
                      <p className="text-sm text-gray-600">Antique Silver Finish</p>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        </div>
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Summary */}
              <div className="border border-gray-200 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="text-gray-900">${total.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Shipping</p>
                    <p className="text-gray-900">Calculated at checkout</p>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between font-medium">
                    <p className="text-gray-900">Total</p>
                    <p className="text-gray-900">${total.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-gray-500 pt-2">Tax excluded. Shipping calculated at checkout.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
                <Button 
                  className="w-full sm:w-auto px-8 bg-black hover:bg-gray-800"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
