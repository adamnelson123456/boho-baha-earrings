import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { prisma } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Create order in database
        const order = await prisma.order.create({
          data: {
            stripeId: session.id,
            amount: session.amount_total! / 100,
            status: 'completed',
            customerEmail: session.customer_email!,
            customerName: session.customer_details?.name,
            items: {
              create: session.line_items?.data.map(item => ({
                productId: item.price?.product as string,
                productName: item.description || 'Unknown Product',
                quantity: item.quantity || 1,
                price: (item.amount_total || 0) / 100,
              })) || [],
            },
          },
          include: {
            items: true,
          },
        });

        // Send order confirmation email
        await resend.emails.send({
          from: 'Billy\'s Jewelry <orders@yourdomain.com>',
          to: session.customer_email!,
          subject: 'Order Confirmation - Billy\'s Jewelry',
          html: `
            <h1>Thank you for your order!</h1>
            <p>Your order has been confirmed and is being processed.</p>
            <p>Order Details:</p>
            <ul>
              <li>Order ID: ${order.id}</li>
              <li>Amount: $${order.amount.toFixed(2)}</li>
              <li>Items:</li>
              ${order.items.map(item => `
                <li>${item.productName} x ${item.quantity} - $${item.price.toFixed(2)}</li>
              `).join('')}
            </ul>
            <p>We'll notify you when your order ships.</p>
          `,
        });

        // Send notification to admin
        await resend.emails.send({
          from: 'Billy\'s Jewelry <orders@yourdomain.com>',
          to: process.env.ADMIN_EMAIL!,
          subject: 'New Order Received',
          html: `
            <h1>New Order Received</h1>
            <p>Order ID: ${order.id}</p>
            <p>Customer: ${order.customerName || order.customerEmail}</p>
            <p>Amount: $${order.amount.toFixed(2)}</p>
          `,
        });

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);
        
        // Send payment failure email
        await resend.emails.send({
          from: 'Billy\'s Jewelry <orders@yourdomain.com>',
          to: paymentIntent.receipt_email!,
          subject: 'Payment Failed - Billy\'s Jewelry',
          html: `
            <h1>Payment Failed</h1>
            <p>We were unable to process your payment.</p>
            <p>Please try again or contact our support team for assistance.</p>
          `,
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
} 