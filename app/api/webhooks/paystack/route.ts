// app/api/webhooks/paystack/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { findBooking, updateBookingStatus } from '@/lib/actions/book.action';
import { updateSeats } from '@/lib/actions/bus.action';
import { sendNotification } from '@/lib/actions/notification.actions';
import { appendData } from '@/lib/actions/sheets.action';

const secret = process.env.PAYSTACK_SECRET_KEY!;

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
      if(body.event==="charge.success"){
        const { pickup, destination, date, fullName, agent, emergencyContactName, emergencyContactPhone, bookingDate
                ,reference, busId, seats, name, email, phone, tickets} = await findBooking(body.data.reference)

        await updateSeats({busId:busId, seatsToBook: seats.split(", ")})
        await updateBookingStatus(reference)
        await sendNotification({
          name: name,
          email: email,
          phone: `233${phone.substring(1)}`,
          tickets: tickets,
        })

        const values = [busId, pickup, destination, date, fullName, email, phone, seats, 
                        agent, emergencyContactName, emergencyContactPhone, bookingDate, reference, tickets]

        await appendData(values)
      }

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
