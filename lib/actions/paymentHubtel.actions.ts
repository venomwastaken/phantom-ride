'use server'

export async function hubtelPay(email: string, price: number, selectedSeats: string[]) {
    const mobileNumber = process.env.HUBTEL_PHONE_NUMBER;
    const username = process.env.HUBTEL_USERNAME;
    const password = process.env.HUBTEL_SECRET_KEY;

    const amount = (price * selectedSeats.length)

    if (!mobileNumber) {
        throw new Error('Missing Paystack secret key.');
    }


    try {
        const resp = await fetch(
            `https://devp-reqsendmoney-230622-api.hubtel.com/request-money/${mobileNumber}`,
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
            },
            body: JSON.stringify({
                amount: amount,
                title: 'PHANTOM RIDE',
                description: 'Please follow the steps below to complete payment.',
                clientReference: email,
                callbackUrl: 'http://example.com',
                //cancellationUrl: 'http://example.com',
                //returnUrl: 'http://example.com',
                //logo: 'http://example.com'
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
