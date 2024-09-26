'use server'
import nodemailer from 'nodemailer';
type Recipient = {
    ticket: string;
  };
  
  type RecipientData = {
    [key: string]: Recipient;
  };



async function sendSms(recipients : RecipientData) {
  try {
    const data = {
      sender: 'PHANTOMRIDE',
      message: `We are delighted to confirm your booking with Phantom Ride! 
                Please note that you must present your ticket code "<%ticket%>" on the day of departure. 
                We are confident that you will have a smooth ride, and we look forward to having you on board. 
                Thank you for choosing Phantom Ride.`,
      recipients: recipients,
    };

    // Send SMS request using fetch
    const response = await fetch('https://sms.arkesel.com/api/v2/sms/template/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': 'SWJMaHRKSGxZQVJVbGFrbmJybUI'
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log(responseData);


    return responseData;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send SMS');
  }
}



type EmailPayload = {
  to: string;
  name: string;
  ticket: string;
};

async function sendEmail({ to, name, ticket}: EmailPayload) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"Phantom Ride" <${process.env.EMAIL_USER}>`, 
      to : to,
      subject : "Booking Confirmed!!!", 
      text : `Hey ${name}, We are delighted to confirm your booking with Phantom Ride! 
              Please note that you must present your ticket code "${ticket}" on the day of departure. 
              We are confident that you will have a smooth ride and look forward to having you on board. 
              Thank you for choosing Phantom Ride.`, 
      html : `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Booking Confirmation</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 0;
                                padding: 20px;
                                background-color: #f4f4f4;
                            }
                            .container {
                                background-color: #ffffff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                max-width: 600px;
                                margin: 0 auto;
                            }
                            h1 {
                                color: #333333;
                            }
                            p {
                                color: #666666;
                                line-height: 1.6;
                            }
                            .ticket-code {
                                font-size: 1.2em;
                                font-weight: bold;
                                color: #333333;
                            }
                            .footer {
                                margin-top: 20px;
                                font-size: 0.9em;
                                color: #999999;
                                text-align: center;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Booking Confirmation</h1>
                            <p>Hey ${name},</p>
                            <p>We are delighted to confirm your booking with Phantom Ride! Please note that you must present your ticket code 
                            <span class="ticket-code">"${ticket}"</span> on the day of departure.</p>
                            <p>We are confident that you will have a smooth ride and look forward to having you on board. Thank you for choosing Phantom Ride.</p>
                            <p class="footer">© 2024 Phantom Ride. All rights reserved.</p>
                        </div>
                    </body>
                    </html>
                    `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

type customerDetails = {
    name: string
    email: string;
    phone: string;
    ticket: string;
}

export async function sendNotification({name, email, phone, ticket}: customerDetails) {
    try {
        const smsStat = await sendSms({[phone]:{ticket: ticket}});
        const emailStat = await sendEmail({to: email, name:name, ticket:ticket})
        console.log(smsStat, emailStat);
    } catch (error) {
        console.log(error)
    }
    

}