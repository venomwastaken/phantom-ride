'use server'

type Data = {
    price : number,
    phoneNumber : string,
    networkBankCode : string,
    email : string,
    firstName : string,
    lastName : string,
    selectedSeats : string,
    reference : string,
}

export async function initializePayment({price, phoneNumber, networkBankCode, email, firstName, lastName, selectedSeats, reference} : Data) {
    const amount = (price * selectedSeats.split(", ").length);
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
