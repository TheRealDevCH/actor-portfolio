import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Liste mit obszönen/unangemessenen Wörtern (Beispiele - erweitere nach Bedarf)
const BLOCKED_WORDS = [
  'arschloch', 'scheiße', 'fick', 'hurensohn', 'wichser', 'fotze',
  'bastard', 'idiot', 'dummkopf', 'schwuchtel', 'nutte',
  // Englische Begriffe
  'fuck', 'shit', 'bitch', 'asshole', 'damn', 'cunt', 'dick',
];

function containsBlockedWords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return BLOCKED_WORDS.some(word => lowerText.includes(word));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, countryCode, subject, message } = body;

    // Validierung (subject ist optional)
    if (!name || !email || !phone || !countryCode || !message) {
      return NextResponse.json(
        { error: 'Alle Pflichtfelder müssen ausgefüllt werden.' },
        { status: 400 }
      );
    }

    // Überprüfung auf obszöne Wörter
    if (containsBlockedWords(name) || containsBlockedWords(message)) {
      return NextResponse.json(
        { 
          error: 'Ihre Nachricht enthält unangemessene Wörter und kann nicht gesendet werden. Alle Aktivitäten werden getrackt.',
          blocked: true 
        },
        { status: 400 }
      );
    }

    // E-Mail Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' },
        { status: 400 }
      );
    }

    // Nodemailer Transporter erstellen (Gmail Beispiel)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'websitenphilipp@gmail.com',
        pass: process.env.EMAIL_PASSWORD, // App-Passwort erforderlich!
      },
    });

    const fullPhone = `${countryCode} ${phone}`;

    // E-Mail Subject mit Betreff
    const emailSubject = subject
      ? `${subject} - ${name}`
      : `Neue Kontaktanfrage von ${name}`;

    // E-Mail an dich
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'websitenphilipp@gmail.com',
      to: 'websitenphilipp@gmail.com',
      subject: emailSubject,
      html: `
        <h2>Neue Kontaktanfrage</h2>
        ${subject ? `<p><strong>Betreff:</strong> ${subject}</p>` : ''}
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${fullPhone}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Bestätigungs-E-Mail an Absender
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'websitenphilipp@gmail.com',
      to: email,
      subject: 'Ihre Nachricht wurde empfangen',
      html: `
        <h2>Vielen Dank für Ihre Nachricht!</h2>
        <p>Hallo ${name},</p>
        <p>Ihre Nachricht wurde erfolgreich übermittelt. Ich werde mich so schnell wie möglich bei Ihnen melden.</p>
        <br>
        <p>Mit freundlichen Grüßen,</p>
        <p><strong>Christoph Philipp Karnath</strong></p>
        <hr>
        <p style="color: #666; font-size: 12px;">Dies ist eine automatische Bestätigung. Bitte antworten Sie nicht auf diese E-Mail.</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Nachricht erfolgreich gesendet!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}

