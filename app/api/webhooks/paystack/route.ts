// app/api/webhooks/paystack/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { findBooking, updateBookingStatus } from '@/lib/actions/book.action';
import { updateSeats } from '@/lib/actions/bus.action';
import Booking from '@/lib/database/models/booking.model';
import { sendNotification } from '@/lib/actions/notification.actions';

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
        const {reference, busId, seats, name, email, phone} = await findBooking(body.data.reference)
        await updateSeats({busId:busId, seatsToBook: seats.split(", ")})
        const updatedBooking = await updateBookingStatus(reference)
        const notificationStat = await sendNotification({
          name: name,
          email: email,
          phone: `233${phone.substring(1)}`,
          ticket: reference,
        })
        console.log(updatedBooking, notificationStat)
       
      }
      //await Booking.findOneAndUpdate({reference:"3f9on44wn4"}, {seats:body.json.stringify()})
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
