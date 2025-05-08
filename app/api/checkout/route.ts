import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
// In production, store this in environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body;
    
    if (!items || !items.length) {
      return NextResponse.json(
        { error: 'Please provide cart items' },
        { status: 400 }
      );
    }
    
    // Create line items for Stripe checkout
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: `Size: ${item.size}`,
          images: [item.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_BASE_URL}${item.image}` : item.image],
        },
        unit_amount: item.price * 100, // Stripe uses cents
      },
      quantity: item.quantity,
    }));
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 995, // $9.95
              currency: 'usd',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1995, // $19.95
              currency: 'usd',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred with the payment' },
      { status: 500 }
    );
  }
} 