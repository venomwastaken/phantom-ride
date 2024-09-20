import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const secret = process.env.SECRET_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Validate event
      const hash = crypto
        .createHmac('sha512', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (hash === req.headers['x-paystack-signature']) {
        // Retrieve the request's body
        const event = req.body;

        // Process the event here
        console.log('Paystack event:', event);

        // Respond with 200 if successful
        return res.status(200).send('Webhook received and processed');
      } else {
        // Invalid signature
        return res.status(400).send('Invalid signature');
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      return res.status(500).send('Server error');
    }
  } else {
    // Only accept POST requests
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
