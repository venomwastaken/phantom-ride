// // app/api/webhooks/paystack/route.ts
// import { NextResponse } from 'next/server';
// import { findBooking, updateBookingStatus } from '@/lib/actions/book.action';
// import { updateSeats } from '@/lib/actions/bus.action';
// import { sendNotification } from '@/lib/actions/notification.actions';

// const secret = process.env.PAYAZA_PUBLIC_KEY!;

// export async function POST(req: Request) {
//   try {
//     // Read the request body as a JSON object
//     const body = await req.json();
//     console.log(req.headers)

//     if (secret === req.headers.get('authorization')) {
//       console.log(body);
//       // Process the event here
//       if(body.status === "Completed"){
//         console.log("Payment completed successfully");
//         const { reference, busId, seats, fullName, email, phone, tickets} = await findBooking(body.transaction_reference)
//         const name = fullName.split(' ')[0]

//         await updateSeats({busId:busId, seatsToBook: seats.split(", ")})
//         await updateBookingStatus(reference)
//         await sendNotification({
//           name: name,
//           email: email,
//           phone: `233${phone.substring(1)}`,
//           tickets: tickets,
//         })


//       }

//       // Return a success response
//       return NextResponse.json({ message: 'Webhook received and processed' }, { status: 200 });
//     } else {
//       // Invalid signature
//       return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
//     }
//   } catch (error) {
//     console.error('Error processing webhook:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }

// export function GET() {
//   // Return a 405 if it's not a POST request
//   return new Response(`Method Not Allowed`, { status: 405, headers: { Allow: 'POST' } });
// }


import crypto from "crypto";
import { NextResponse } from "next/server";


export default async function handler(req: Request) {

  try {
    const body = await req.json();

    const providedSignature = req.headers.get("x-payaza-signature");

    const secret = process.env.PAYAZA_SECRET_KEY!;
    const computedSignature = crypto
      .createHmac("sha512", secret)
      .update(body, "utf8")
      .digest("base64");

    console.log("Provided:", providedSignature);
    console.log("Computed:", computedSignature);

    if (providedSignature !== computedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }


    console.log("Webhook verified and received:", body);

    return NextResponse.json({ message: 'Webhook received and processed' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export function GET() {
  // Return a 405 if it's not a POST request
  return new Response(`Method Not Allowed`, { status: 405, headers: { Allow: 'POST' } });
}