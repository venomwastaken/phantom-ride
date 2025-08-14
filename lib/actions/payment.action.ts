'use server'

import { getBusPrice } from "./bus.action";
import { getLuggagePrice } from "./luggage.actions";



export async function initializeTransaction(email: string, busId: string, selectedSeats: string[], location: string, luggage: string[]) {

  const pickups = [
    "Amasaman",
    "Pokuase (Frimps Oil Filling Station)",
    "Ofankor Barrier",
    "Taifa Junction Bus Stop",
    "Nsawam (Total Filling Station)",
    "Medie"
  ];

  const paystackUrl = 'https://api.paystack.co/transaction/initialize';
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const price = (pickups.includes(location))? 150:await getBusPrice(busId);
  const totalLuggagePrice = await getLuggagePrice(luggage)

  const amount = ((price * selectedSeats.length * 100) + (totalLuggagePrice * 100)).toString()
  // Ensure the secret key is available
  if (!secretKey) {
    throw new Error('Missing Paystack secret key.');
  }

  try {
    // Fetch request to Paystack
    const response = await fetch(paystackUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, amount }),
    });

    // Parse the response
    const data = await response.json();

    // Check if the request was successful
    if (response.ok) {
      return { status: true, message: 'Transaction initialized', data };
    } else {
      throw new Error(data.message || 'An error occurred during the transaction initialization');
    }
  } catch (error) {
    console.error('Error initializing transaction:', error);
    throw new Error('Failed to initialize transaction');
  }
}


