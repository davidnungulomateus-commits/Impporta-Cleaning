import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, amount, currency = 'eur', booking_id, name, email, phone } = body;

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    if (action === 'generate_link') {
      // Generate a Stripe Checkout Session for Card and Multibanco
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'multibanco'],
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: 'Serviço de Limpeza Impporta',
                description: `Agendamento #${booking_id || 'Avulso'}`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${origin}/success?payment=success`,
        cancel_url: `${origin}/`,
        metadata: {
          booking_id: booking_id,
          customer_name: name || 'Unknown',
          customer_phone: phone || 'Unknown',
        },
      });

      return NextResponse.json({ url: session.url });
    } 
    
    if (action === 'create_intent') {
      // Create a PaymentIntent specifically for MB Way admin processing
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency,
        payment_method_types: ['mb_way'],
        receipt_email: email || undefined,
        metadata: {
          booking_id: booking_id,
          customer_name: name || 'Unknown',
          customer_phone: phone || 'Unknown',
          is_admin_request: 'true'
        }
      });

      return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    }

    return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });

  } catch (error) {
    console.error('Error in admin-payment API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
