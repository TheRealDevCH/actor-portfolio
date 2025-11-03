import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.metadata?.type === 'newsletter_subscription') {
      const email = session.metadata.email || session.customer_email;

      if (email) {
        await sendWelcomeEmail(email);
      }
    }
  }

  return NextResponse.json({ received: true });
}

async function sendWelcomeEmail(email: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'websitenphilipp@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'websitenphilipp@gmail.com',
      to: email,
      subject: 'Willkommen beim CPK Newsletter! 🎭',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0;">

                  <tr>
                    <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #e0e0e0;">
                      <h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px; color: #000000;">
                        CHRISTOPH PHILIPP KARNATH
                      </h1>
                      <p style="margin: 8px 0 0; font-size: 12px; letter-spacing: 1px; color: #666666; text-transform: uppercase;">
                        Schauspieler
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 40px 30px;">
                      <div style="text-align: center; font-size: 48px; margin-bottom: 20px;">🎭</div>
                      
                      <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 400; color: #000000; text-align: center;">
                        Willkommen beim Newsletter!
                      </h2>
                      
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                        Vielen Dank für dein Abonnement! Du erhältst ab sofort exklusive Updates zu:
                      </p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                        <tr>
                          <td style="padding: 12px 0;">
                            <span style="font-size: 20px; margin-right: 10px;">🎭</span>
                            <span style="font-size: 15px; color: #333333;">Günstige Theater-Shows und Geheimtipps</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0;">
                            <span style="font-size: 20px; margin-right: 10px;">🎬</span>
                            <span style="font-size: 15px; color: #333333;">Einblicke in aktuelle Dreharbeiten</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0;">
                            <span style="font-size: 20px; margin-right: 10px;">✨</span>
                            <span style="font-size: 15px; color: #333333;">Exklusive Website-Updates</span>
                          </td>
                        </tr>
                      </table>
                      
                      <div style="margin: 30px 0; height: 1px; background-color: #e0e0e0;"></div>
                      
                      <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">
                        Ich freue mich, dich auf dem Laufenden zu halten!
                      </p>
                      
                      <p style="margin: 10px 0 0; font-size: 16px; font-weight: 500; color: #000000;">
                        Christoph Philipp Karnath
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 20px 40px; background-color: #fafafa; border-top: 1px solid #e0e0e0;">
                      <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #999999; text-align: center;">
                        Du erhältst diese E-Mail, weil du dich für den CPK Newsletter angemeldet hast.<br>
                        Kosten: 0.50 CHF pro E-Mail
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

