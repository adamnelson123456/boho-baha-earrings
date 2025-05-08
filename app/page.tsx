"use client"

import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, ChevronLeft, ChevronRight, X, ShoppingCart, Check } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import StripeCheckout from '@/components/StripeCheckout'

// Define cart item type
interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

// Product images array
const productImages = [
  "/product images/WhatsApp Image 2025-05-03 at 21.44.12.jpeg",
  "/product images/WhatsApp Image 2025-05-03 at 21.44.12 (1).jpeg",
  "/product images/WhatsApp Image 2025-05-03 at 21.44.12 (2).jpeg",
  "/product images/WhatsApp Image 2025-05-03 at 21.44.12 (3).jpeg",
  "/product images/WhatsApp Image 2025-05-03 at 21.44.12 (4).jpeg",
  "/product images/WhatsApp Image 2025-05-03 at 21.44.12 (5).jpeg",
  "/product images/WhatsApp Image 2025-05-03 at 21.44.12 (6).jpeg",
];

// Update the custom cursor styles with circular background and black arrows (smaller size)
const customCursors = {
  left: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none'%3E%3Ccircle cx='15' cy='15' r='15' fill='%23F0F0F0' fill-opacity='0.8'/%3E%3Cpath d='M18 21L12 15L18 9' stroke='%23333333' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") 15 15, pointer",
  right: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none'%3E%3Ccircle cx='15' cy='15' r='15' fill='%23F0F0F0' fill-opacity='0.8'/%3E%3Cpath d='M12 21L18 15L12 9' stroke='%23333333' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") 15 15, pointer",
  default: "auto"
};

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1)
  const [cartItems, setCartItems] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [cursorStyle, setCursorStyle] = useState(customCursors.default)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showAddedConfirmation, setShowAddedConfirmation] = useState(false)

  // Create a ref for the image container
  const imageContainerRef = useRef<HTMLDivElement>(null)

  // Add touch swipe handling for the image gallery
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50 

  // Load cart items from localStorage on component mount
  useEffect(() => {
    try {
      // Check if window is defined (i.e., we're in the browser)
      if (typeof window !== 'undefined') {
        const storedCart = localStorage.getItem('cart')
        if (storedCart) {
          const cart: CartItem[] = JSON.parse(storedCart)
          setCartItems(cart.reduce((total: number, item: CartItem) => total + item.quantity, 0))
        }
        // Set isClient to true when running in browser
        setIsClient(true)
      }
    } catch (e) {
      console.error('Failed to parse cart data:', e)
    }
  }, [])

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  // Add image navigation handlers
  const goPrevImage = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSlideDirection('right')
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
    )
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
      setSlideDirection(null)
    }, 500)
  }, [isTransitioning, productImages.length])

  const goNextImage = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSlideDirection('left')
    setCurrentImageIndex((prevIndex) => 
      prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
    )
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
      setSlideDirection(null)
    }, 500)
  }, [isTransitioning, productImages.length])

  // Add hover handler to update cursor
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return

    const { left, width } = imageContainerRef.current.getBoundingClientRect()
    const x = e.clientX - left
    
    // If mouse is on left half, show left arrow cursor, otherwise show right arrow
    if (x < width / 2) {
      setCursorStyle(customCursors.left)
    } else {
      setCursorStyle(customCursors.right)
    }
  }, [])

  // Add click handler for navigation
  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return

    const { left, width } = imageContainerRef.current.getBoundingClientRect()
    const x = e.clientX - left
    
    if (x < width / 2) {
      goPrevImage()
    } else {
      goNextImage()
    }
  }, [goPrevImage, goNextImage])

  // Reset cursor when mouse leaves the image
  const handleMouseLeave = useCallback(() => {
    setCursorStyle(customCursors.default)
  }, [])

  const handleAddToCart = () => {
    console.log("Add to cart clicked");
    
    try {
      setIsAddingToCart(true)
      
      // Check if window is defined (i.e., we're in the browser)
      if (typeof window !== 'undefined') {
        console.log("Getting cart from localStorage");
        // Get existing cart from localStorage or initialize empty array
        const storedCart = localStorage.getItem('cart') || '[]'
        console.log("Current cart in localStorage:", storedCart);
        
        const existingCart: CartItem[] = JSON.parse(storedCart)
        
        // Add new item to cart
        const newItem: CartItem = {
          id: "boho-hoop-earrings",
          name: "Handcrafted Boho Hoop Earrings",
          price: 89.00,
          size: "One Size",
          quantity,
          image: productImages[0]
        }
        console.log("New item to add:", newItem);
        
        // Check if item already exists in cart
        const existingItemIndex = existingCart.findIndex((item: CartItem) => 
          item.id === newItem.id
        )
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          console.log("Item already exists, updating quantity");
          existingCart[existingItemIndex].quantity += quantity
        } else {
          // Add new item if it doesn't exist
          console.log("Adding new item to cart");
          existingCart.push(newItem)
        }
        
        // Save updated cart to localStorage
        const cartString = JSON.stringify(existingCart);
        console.log("Saving updated cart to localStorage:", cartString);
        localStorage.setItem('cart', cartString)
        
        // Update cart count
        const newCartCount = existingCart.reduce((total: number, item: CartItem) => total + item.quantity, 0)
        console.log("New cart count:", newCartCount);
        setCartItems(newCartCount)
        
        // Show success animation
        setShowAddedConfirmation(true)
        setTimeout(() => setShowAddedConfirmation(false), 2000)
        
        toast({
          title: "Added to cart",
          description: `${quantity} × Handcrafted Boho Hoop Earrings`,
        })
      }
    } catch (e) {
      console.error('Failed to update cart:', e)
      toast({
        title: "Error adding to cart",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Update the image container with touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null) // reset values
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      goNextImage()
    }
    if (isRightSwipe) {
      goPrevImage()
    }
  }

  // Fix the review display with a clear mobile-friendly implementation
  // Add a direct event handler for onClick
  const toggleReviews = useCallback(() => {
    setShowAllReviews(prev => !prev);
  }, []);

  // Add click handler for review images
  const handleReviewImageClick = (imageSrc: string) => {
    setEnlargedImage(imageSrc)
  }

  // Add click handler to close enlarged image
  const handleCloseEnlargedImage = () => {
    setEnlargedImage(null)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-medium text-gray-900">
            Boho Baha Earrings
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/cart" className="text-gray-600 hover:text-gray-900">
              Cart ({cartItems})
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Product Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div 
              ref={imageContainerRef}
              className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm relative"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleImageClick}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{ cursor: cursorStyle }}
            >
              <div className="aspect-square relative">
                <div className="absolute inset-0">
                  <Image
                    src={productImages[currentImageIndex]}
                    alt="Boho Hoop Earrings"
                    fill
                    className="object-contain p-4"
                    priority
                  />
                </div>
              </div>
            </div>
            
            {/* Current Image Indicator */}
            <div className="flex justify-center">
              <p className="text-sm text-gray-500">
                {currentImageIndex + 1} / {productImages.length}
              </p>
            </div>
            
            {/* Thumbnails Row */}
            <div className="flex gap-3 justify-center">
              {productImages.map((src, index) => (
                <button
                  key={index}
                  className={`w-16 h-16 bg-white rounded-md overflow-hidden ${
                    currentImageIndex === index 
                      ? 'ring-2 ring-blue-500 ring-offset-2'
                      : 'border border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    if (isTransitioning) return;
                    setIsTransitioning(true);
                    // Set direction based on index comparison
                    setSlideDirection(index > currentImageIndex ? 'left' : 'right');
                    setCurrentImageIndex(index);
                    setTimeout(() => {
                      setIsTransitioning(false);
                      setSlideDirection(null);
                    }, 500);
                  }}
                  aria-label={`View image ${index + 1}`}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={src}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-3xl font-medium text-gray-900 mb-2">Handcrafted Boho Hoop Earrings</h1>
              <p className="text-lg text-gray-700 mb-1">Antique Silver Finish</p>
              <p className="text-2xl font-medium text-[#8B7355]">$89.00</p>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Channel timeless elegance with these vintage-inspired silver hoop earrings. With delicate engravings and a rustic boho charm, they're the perfect accessory for free spirits, festival lovers, or anyone who loves to mix old soul with modern flair.
            </p>

            <div className="space-y-4 pt-2">
              <div className="pt-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <div className="flex items-center gap-4 flex-col sm:flex-row w-full">
                  <div className="flex items-center border border-gray-200 rounded-md w-full sm:w-32 h-12">
                    <button 
                      onClick={handleDecreaseQuantity}
                      className="px-3 py-2 text-gray-500 hover:text-gray-700 h-full w-1/3"
                      type="button"
                    >
                      <Minus className="h-4 w-4 mx-auto" />
                      <span className="sr-only">Decrease quantity</span>
                    </button>
                    <span className="flex-1 text-center">{quantity}</span>
                    <button 
                      onClick={handleIncreaseQuantity}
                      className="px-3 py-2 text-gray-500 hover:text-gray-700 h-full w-1/3"
                      type="button"
                    >
                      <Plus className="h-4 w-4 mx-auto" />
                      <span className="sr-only">Increase quantity</span>
                    </button>
                  </div>
                  <Button 
                    size="lg" 
                    className="flex-1 bg-[#2A1A1F] hover:bg-[#1A0F13] text-white w-full sm:w-auto h-12 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    type="button"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {showAddedConfirmation ? (
                        <Check className="h-5 w-5 animate-in fade-in slide-in-from-bottom-2" />
                      ) : (
                        <ShoppingCart className="h-5 w-5" />
                      )}
                      <span className="relative">
                        {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                      </span>
                    </span>
                  </Button>
                </div>
              </div>

              {/* Add Stripe Checkout */}
              <div className="mt-4">
                <StripeCheckout
                  amount={89.00 * quantity}
                  productName="Handcrafted Boho Hoop Earrings"
                  size="One Size"
                  quantity={quantity}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details">
                  <AccordionTrigger className="text-gray-900 font-medium">Details</AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-gray-600 space-y-2 pl-1">
                      <li>• Antique silver finish</li>
                      <li>• Hoop diameter: 45mm</li>
                      <li>• Handcrafted with detailed engravings</li>
                      <li>• Nickel-free and hypoallergenic</li>
                      <li>• Comes in a premium gift box</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="good-to-know">
                  <AccordionTrigger className="text-gray-900 font-medium">Good to Know</AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-gray-600 space-y-2 pl-1">
                      <li>• Suitable for everyday wear</li>
                      <li>• Lightweight and comfortable</li>
                      <li>• Clean with a soft cloth to maintain shine</li>
                      <li>• Avoid contact with perfumes and lotions</li>
                      <li>• Store in the provided pouch when not wearing</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <p className="text-sm text-gray-500 pt-4">Tax excluded. Shipping calculated at checkout.</p>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          
          <div className="flex items-center mb-12 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star} 
                  className="w-6 h-6 text-yellow-400" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xl font-semibold text-gray-900 ml-3">4.8</span>
            <span className="text-gray-500 ml-1">out of 5</span>
            <span className="text-gray-500 ml-3">(32 reviews)</span>
          </div>
          
          {isClient ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Review 1 */}
              <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className="w-4 h-4 text-yellow-400" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Stunning craftsmanship</h3>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="font-medium text-gray-700">Sarah M.</span>
                  <span className="mx-2">•</span>
                  <span>March 12, 2023</span>
                </div>
                <p className="text-gray-600 mb-3 text-sm leading-relaxed">These earrings are absolutely beautiful. The detailing is intricate and the silver finish has a lovely vintage look without being too antique. They're lightweight and comfortable to wear all day.</p>
                <div className="w-32 h-32 relative rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => handleReviewImageClick("/product images/review images/WhatsApp Image 2025-05-06 at 22.14.54.jpeg")}>
                  <Image
                    src="/product images/review images/WhatsApp Image 2025-05-06 at 22.14.54.jpeg"
                    alt="Review image 1"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              {/* Review 2 - No Photo */}
              <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className={`w-4 h-4 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Perfect for any occasion</h3>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="font-medium text-gray-700">Jennifer L.</span>
                  <span className="mx-2">•</span>
                  <span>February 28, 2023</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">These earrings have become my go-to accessory. They're versatile enough for both work and evening events. The quality is outstanding, and they've maintained their shine perfectly.</p>
              </div>
              
              {/* Review 3 */}
              <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className="w-4 h-4 text-yellow-400" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Worth every penny</h3>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="font-medium text-gray-700">Emma J.</span>
                  <span className="mx-2">•</span>
                  <span>February 15, 2023</span>
                </div>
                <p className="text-gray-600 mb-3 text-sm leading-relaxed">I've received so many compliments on these earrings! The filigree style is eye-catching without being gaudy. They're substantial without being heavy. Perfect size too - not too small, not too large.</p>
                <div className="w-32 h-32 relative rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => handleReviewImageClick("/product images/review images/WhatsApp Image 2025-05-06 at 22.14.54 (4).jpeg")}>
                  <Image
                    src="/product images/review images/WhatsApp Image 2025-05-06 at 22.14.54 (4).jpeg"
                    alt="Review image 3"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              {/* Additional Reviews */}
              {showAllReviews && (
                <>
                  {/* Review 4 - No Photo */}
                  <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star} 
                            className="w-4 h-4 text-yellow-400" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Exceeded expectations</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="font-medium text-gray-700">Sophie K.</span>
                      <span className="mx-2">•</span>
                      <span>January 28, 2023</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">I was hesitant about ordering jewelry online, but these earrings are even more beautiful in person. The attention to detail is remarkable, and they're surprisingly comfortable for all-day wear.</p>
                  </div>

                  {/* Review 5 */}
                  <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star} 
                            className="w-4 h-4 text-yellow-400" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Gorgeous gift</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="font-medium text-gray-700">David K.</span>
                      <span className="mx-2">•</span>
                      <span>January 15, 2023</span>
                    </div>
                    <p className="text-gray-600 mb-3 text-sm leading-relaxed">Bought these as a gift for my sister's birthday. She absolutely loved them! The packaging was beautiful and the earrings themselves are stunning. Will definitely be buying more pieces from this collection.</p>
                    <div className="w-32 h-32 relative rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => handleReviewImageClick("/product images/review images/WhatsApp Image 2025-05-06 at 22.14.55.jpeg")}>
                      <Image
                        src="/product images/review images/WhatsApp Image 2025-05-06 at 22.14.55.jpeg"
                        alt="Review image 5"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Review 6 - No Photo */}
                  <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star} 
                            className={`w-4 h-4 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Great value for money</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="font-medium text-gray-700">Robert M.</span>
                      <span className="mx-2">•</span>
                      <span>December 20, 2022</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">For the price, these earrings are exceptional. The craftsmanship is evident in every detail. My wife wears them almost daily and they still look as good as new.</p>
                  </div>

                  {/* Review 7 */}
                  <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star} 
                            className="w-4 h-4 text-yellow-400" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Beautiful quality</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="font-medium text-gray-700">Lisa R.</span>
                      <span className="mx-2">•</span>
                      <span>December 5, 2022</span>
                    </div>
                    <p className="text-gray-600 mb-3 text-sm leading-relaxed">The quality of these earrings is exceptional. The silver finish is perfect and they have a nice weight to them. I've worn them several times and they still look brand new.</p>
                    <div className="w-32 h-32 relative rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => handleReviewImageClick("/product images/review images/WhatsApp Image 2025-05-06 at 22.14.54 (5).jpeg")}>
                      <Image
                        src="/product images/review images/WhatsApp Image 2025-05-06 at 22.14.54 (5).jpeg"
                        alt="Review image 7"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Review 8 - No Photo */}
                  <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star} 
                            className="w-4 h-4 text-yellow-400" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Perfect everyday wear</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="font-medium text-gray-700">Amanda T.</span>
                      <span className="mx-2">•</span>
                      <span>November 28, 2022</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">These earrings are my new favorite accessory. They're comfortable enough for all-day wear and add the perfect touch of elegance to any outfit. The quality is impressive for the price point.</p>
                  </div>

                  {/* Review 9 - No Photo */}
                  <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star} 
                            className={`w-4 h-4 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Lovely design</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="font-medium text-gray-700">Rachel B.</span>
                      <span className="mx-2">•</span>
                      <span>November 15, 2022</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">The design is beautiful and unique. I love how they catch the light. They're a bit smaller than I expected, but that actually makes them more versatile for everyday wear.</p>
                  </div>
                </>
              )}
              
              <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-8 text-center">
                <Button 
                  variant="outline" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto py-6 sm:py-2"
                  onClick={toggleReviews}
                >
                  {showAllReviews ? "Show less reviews" : "Load more reviews"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              Loading reviews...
            </div>
          )}
        </div>
      </main>

      {/* Add the modal for enlarged images */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={handleCloseEnlargedImage}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={handleCloseEnlargedImage}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-4xl w-full h-[80vh]">
            <Image
              src={enlargedImage}
              alt="Enlarged review image"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
