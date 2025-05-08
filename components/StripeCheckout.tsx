import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeCheckoutProps {
  amount: number;
  productName: string;
  size: string;
  quantity: number;
}

export default function StripeCheckout({ amount, productName, size, quantity }: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      // Create a payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          productName,
          size,
          quantity,
        }),
      });

      const { clientSecret } = await response.json();

      // Load Stripe
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: clientSecret,
      });

      if (error) {
        console.error('Stripe checkout error:', error);
        throw error;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong with the checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-white border-2 border-[#2A1A1F] text-[#2A1A1F] hover:bg-[#2A1A1F] hover:text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group h-12"
    >
      <span className="flex items-center justify-center gap-2">
        <CreditCard className="h-5 w-5" />
        <span className="relative">
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </span>
      </span>
    </Button>
  );
} 