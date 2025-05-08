'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
  const [status, setStatus] = useState<'processing' | 'succeeded' | 'failed'>('processing');
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment_intent = searchParams.get('payment_intent');
    const payment_intent_client_secret = searchParams.get('payment_intent_client_secret');
    const redirect_status = searchParams.get('redirect_status');

    if (redirect_status === 'succeeded') {
      setStatus('succeeded');
    } else if (redirect_status === 'failed') {
      setStatus('failed');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === 'processing' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-gray-900">Processing your payment...</h1>
            <p className="text-gray-600">Please wait while we confirm your payment.</p>
          </div>
        )}

        {status === 'succeeded' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Payment Successful!</h1>
            <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
            <div className="pt-4">
              <Link href="/">
                <Button className="bg-[#2A1A1F] hover:bg-[#1A0F13] text-white">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Payment Failed</h1>
            <p className="text-gray-600">We couldn't process your payment. Please try again.</p>
            <div className="pt-4">
              <Link href="/">
                <Button className="bg-[#2A1A1F] hover:bg-[#1A0F13] text-white">
                  Try Again
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 