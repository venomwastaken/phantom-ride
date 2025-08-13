'use server'

import { getBusPrice } from "./bus.action";
import { getLuggagePrice } from "./luggage.actions";

type Data = {
    busId: string,
    luggage: string[],
    phoneNumber : string,
    networkBankCode : string,
    email : string,
    firstName : string,
    lastName : string,
    selectedSeats : string,
    reference : string,
}

export async function initializePayment({busId, luggage, phoneNumber, networkBankCode, email, firstName, lastName, selectedSeats, reference} : Data) {
    const price = await getBusPrice(busId);
    const totalLuggagePrice = await getLuggagePrice(luggage)

    const amount = ((Number(price) * selectedSeats.split(", ").length) + totalLuggagePrice);
    //console.log("Initializing payment with amount:", amount, "and reference:", reference);
    //sample request body:
    console.log({
        "amount": amount,
        "customer_number": `233${phoneNumber.substring(1)}`,
        "transaction_reference": reference,
        "transaction_description": "Phantom Ride",
        "customer_bank_code": networkBankCode,
        "currency_code": "GHS",
        "customer_email": email,
        "customer_first_name": firstName,
        "customer_last_name": lastName,
        "customer_phone_number": phoneNumber,
        "country_code": "GH"
        })

    
    const publicKey = process.env.PAYAZA_PUBLIC_KEY!
    

    if (!publicKey) {
        throw new Error('Missing Payaza public key.');
    }


    try {
        const resp = await fetch(
            `https://api.payaza.africa/live/subsidiary/collections/v1/process-collection`,
            {
            method: 'POST',
            headers: {
                'X-TenantID': 'live', 
                'X-ProductID': 'app', 
                'Authorization': `Payaza ${publicKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "amount": amount,
                "customer_number": `233${phoneNumber.substring(1)}`,
                "transaction_reference": reference,
                "transaction_description": "Phantom Ride",
                "customer_bank_code": networkBankCode,
                "currency_code": "GHS",
                "customer_email": email,
                "customer_first_name": firstName,
                "customer_last_name": lastName,
                "customer_phone_number": phoneNumber,
                "country_code": "GH"
                })
            }
        );


        const data = await resp.json();
        console.log(data);

        if (resp.ok) {
            return { status: true, message: 'Transaction initialized', data };
        } else {
            throw new Error(data.message || 'An error occurred during the transaction initialization');
        }

    } catch (error) {
        console.error('Error initializing transaction:', error);
        throw new Error('Failed to initialize transaction');
    }
}



export async function checkPaymentStatus(reference : string) {
    const publicKey = process.env.PAYAZA_PUBLIC_KEY!


    if (!publicKey) {
        throw new Error('Missing Payaza public key.');
    }

    try {
        const resp = await fetch(
            `https://api.payaza.africa/live/subsidiary/collections/v1/check-status?transaction_reference=${reference}&country_code=KE`,
            {
            method: 'GET',
            headers: {
                'X-TenantID': 'live', 
                'X-ProductID': 'app', 
                'Authorization': `Payaza ${publicKey}`,
                'Content-Type': 'application/json'
            },
            }
        );


        const data = await resp.json();
        console.log(data);

        if (resp.ok) {
            return { status: true, message: 'Check Successful', data };
        } else {
            throw new Error(data.message || 'An error occurred during the transaction check');
        }

    } catch (error) {
        console.error('Error checking transaction status:', error);
        throw new Error('Failed to check transaction status');
    }
}
