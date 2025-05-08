# Billy's Jewelry E-commerce Site

A modern e-commerce site for Billy's Jewelry built with Next.js, Stripe, and Prisma.

## Features

- Product catalog with image gallery
- Shopping cart functionality
- Secure Stripe checkout
- Order management
- Email notifications
- Responsive design

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account
- Resend account for emails

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/billys_jewelry"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key
ADMIN_EMAIL=your@email.com

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Set up Stripe webhook:
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the webhook signing secret to your `.env.local` file

## Deployment

1. Set up a PostgreSQL database (e.g., on Railway, Supabase, or AWS RDS)

2. Deploy to Vercel:
   ```bash
   vercel
   ```

3. Add environment variables in your hosting platform

4. Update Stripe webhook endpoint to your production URL

## Production Checklist

- [ ] Set up SSL certificate
- [ ] Configure domain in Stripe
- [ ] Set up production database
- [ ] Configure email templates
- [ ] Test checkout flow
- [ ] Set up monitoring and error tracking
- [ ] Configure backup strategy

## Support

For support, email support@billysjewelry.com 