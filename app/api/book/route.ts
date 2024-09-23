import { makeBooking } from '@/lib/actions/book.action';
import { NextResponse } from 'next/server';

 

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const bookingResult = await makeBooking(body);


    return NextResponse.json({ success: true, data: bookingResult }, { status: 200 });
  } catch (error) {
    console.error('Booking API error:', error);

    return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
