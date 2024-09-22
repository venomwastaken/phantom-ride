// app/api/webhooks/paystack/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const secret = process.env.SECRET_KEY!;

export async function POST(req: Request) {
  try {
    // Read the request body as a JSON object
    const body = await req.json();

    // Validate event signature
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (hash === req.headers.get('x-paystack-signature')) {
      // Process the event here
      if(body.event==="paymentrequest.success"){
        
      }
      console.log('Paystack event:', body);

      // Return a success response
      return NextResponse.json({ message: 'Webhook received and processed' }, { status: 200 });
    } else {
      // Invalid signature
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export function GET() {
  // Return a 405 if it's not a POST request
  return new Response(`Method Not Allowed`, { status: 405, headers: { Allow: 'POST' } });
}
