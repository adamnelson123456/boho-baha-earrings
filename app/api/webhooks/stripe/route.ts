import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
// import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

// const resend = new Resend(process.env.RESEND_API_KEY);

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
        // const session = event.data.object as Stripe.Checkout.Session;
        // Optionally send order confirmation email
        // if (session.customer_email) {
        //   await resend.emails.send({
        //     from: 'Boho Baha Earrings <orders@yourdomain.com>',
        //     to: session.customer_email,
        //     subject: 'Order Confirmation - Boho Baha Earrings',
        //     html: `
        //       <h1>Thank you for your order!</h1>
        //       <p>Your order has been confirmed and is being processed.</p>
        //       <p>Order ID: ${session.id}</p>
        //       <p>Amount: $${(session.amount_total! / 100).toFixed(2)}</p>
        //       <p>We'll notify you when your order ships.</p>
        //     `,
        //   });
        // }
        break;
      }
      case 'payment_intent.succeeded': {
        // const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // console.log('Payment succeeded:', paymentIntent.id);
        break;
      }
      case 'payment_intent.payment_failed': {
        // const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // console.log('Payment failed:', paymentIntent.id);
        // Optionally send payment failure email
        // if (paymentIntent.receipt_email) {
        //   await resend.emails.send({
        //     from: 'Boho Baha Earrings <orders@yourdomain.com>',
        //     to: paymentIntent.receipt_email,
        //     subject: 'Payment Failed - Boho Baha Earrings',
        //     html: `
        //       <h1>Payment Failed</h1>
        //       <p>We were unable to process your payment.</p>
        //       <p>Please try again or contact our support team for assistance.</p>
        //     `,
        //   });
        // }
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