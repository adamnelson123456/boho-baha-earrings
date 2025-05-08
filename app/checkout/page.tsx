import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CheckoutPage() {
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-medium text-gray-900 mb-8">Checkout</h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Customer Information */}
            <div className="md:col-span-2 space-y-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" className="mt-1" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="updates" className="rounded text-[#8B7355]" />
                    <Label htmlFor="updates" className="text-sm text-gray-600">
                      Keep me updated on news and exclusive offers
                    </Label>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" className="mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" className="mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                    <Input id="apartment" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP / Postal Code</Label>
                    <Input id="zip" className="mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" className="mt-1" />
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Method</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border border-gray-200 rounded-md p-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="standard"
                        name="shipping"
                        className="rounded-full text-[#8B7355]"
                        checked
                      />
                      <Label htmlFor="standard">Standard Shipping (5-7 business days)</Label>
                    </div>
                    <span className="font-medium">$9.95</span>
                  </div>
                  <div className="flex items-center justify-between border border-gray-200 rounded-md p-4">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="express" name="shipping" className="rounded-full text-[#8B7355]" />
                      <Label htmlFor="express">Express Shipping (2-3 business days)</Label>
                    </div>
                    <span className="font-medium">$19.95</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Link href="/cart" className="flex items-center text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Cart
                </Link>
                <Button className="bg-black hover:bg-gray-800">Continue to Payment</Button>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="border border-gray-200 rounded-lg p-6 sticky top-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

                <div className="flex items-start gap-4 py-4 border-b border-gray-100">
                  <div className="bg-gray-50 rounded-md p-2 relative">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Custom Gold Ring"
                      width={80}
                      height={80}
                      className="object-contain rounded-md"
                    />
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      1
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">Custom Engraved Gold Ring</h3>
                    <p className="text-xs text-gray-600 mt-1">Size: 7</p>
                    <p className="text-xs text-gray-600">14k Yellow Gold</p>
                  </div>
                  <p className="font-medium text-gray-900">$249.00</p>
                </div>

                <div className="py-4 space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="text-gray-900">$249.00</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Shipping</p>
                    <p className="text-gray-900">$9.95</p>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between font-medium">
                    <p className="text-gray-900">Total</p>
                    <p className="text-gray-900">$258.95</p>
                  </div>
                  <p className="text-sm text-gray-500 pt-2">Tax excluded. Shipping calculated at checkout.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
