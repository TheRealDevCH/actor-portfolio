import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Erweiterte Liste mit obszönen/unangemessenen Wörtern inkl. Variationen und Abkürzungen
const BLOCKED_WORDS = [
  // Deutsche Begriffe
  'arschloch', 'arsch', 'scheisse', 'scheiße', 'scheiss', 'fick', 'ficken', 'gefickt',
  'hurensohn', 'huso', 'husos', 'hurensöhne', 'wichser', 'wichsen', 'fotze', 'fotzen',
  'bastard', 'schwuchtel', 'schwuchteln', 'nutte', 'nutten', 'hure', 'huren',
  'schlampe', 'schlampen', 'missgeburt', 'drecksau', 'arschgeige', 'arschgesicht',
  'pisser', 'pissen', 'kacke', 'kacken', 'scheißkerl', 'scheisskerl',
  'vollpfosten', 'vollidiot', 'spast', 'spasti', 'mongo', 'mongos',
  'behinderter', 'behinderte', 'opfer', 'penner', 'wixer', 'wixxer',

  // Englische Begriffe
  'fuck', 'fucking', 'fucked', 'fucker', 'fck', 'fuk', 'fking',
  'shit', 'shitty', 'bullshit', 'bitch', 'bitches', 'btch',
  'asshole', 'assholes', 'ass', 'arse', 'damn', 'damned',
  'cunt', 'cunts', 'cnt', 'dick', 'dicks', 'cock', 'pussy',
  'whore', 'whores', 'slut', 'sluts', 'bastard', 'bastards',
  'motherfucker', 'mofo', 'mf', 'wtf', 'stfu',
  'retard', 'retarded', 'retards', 'fag', 'faggot', 'nigger', 'nigga',

  // Leetspeak und Variationen
  'f*ck', 'f**k', 'sh*t', 'b*tch', 'a**hole', 'c*nt',
  'fvck', 'shlt', 'azz', 'phuck', 'biatch',

  // Weitere Sprachen
  'merde', 'putain', 'connard', 'salope', // Französisch
  'puta', 'puto', 'mierda', 'cabron', 'pendejo', // Spanisch
  'cazzo', 'merda', 'stronzo', 'puttana', // Italienisch
];

function containsBlockedWords(text: string): boolean {
  // Text in Kleinbuchstaben und entferne Sonderzeichen/Leerzeichen für bessere Erkennung
  const normalizedText = text.toLowerCase()
    .replace(/[^a-z0-9äöüß]/g, '') // Entfernt Sonderzeichen, behält Umlaute
    .replace(/\s+/g, ''); // Entfernt Leerzeichen

  // Prüfe auch den Original-Text (mit Leerzeichen)
  const lowerText = text.toLowerCase();

  return BLOCKED_WORDS.some(word => {
    const normalizedWord = word.replace(/[^a-z0-9äöüß]/g, '');
    // Prüfe beide Versionen: mit und ohne Sonderzeichen
    return normalizedText.includes(normalizedWord) || lowerText.includes(word);
  });
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
      subject: 'Nachricht erhalten – Christoph Philipp Karnath',
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

                  <!-- Header -->
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

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 40px 30px;">
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                        Hallo ${name},
                      </p>
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                        vielen Dank für Ihre Nachricht. Ich habe Ihre Anfrage erhalten und werde mich in Kürze bei Ihnen melden.
                      </p>
                      ${subject ? `
                      <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #666666;">
                        <strong>Betreff:</strong> ${subject}
                      </p>
                      ` : ''}
                      <div style="margin: 30px 0; height: 1px; background-color: #e0e0e0;"></div>
                      <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        Mit freundlichen Grüßen
                      </p>
                      <p style="margin: 10px 0 0; font-size: 16px; font-weight: 500; color: #000000;">
                        Christoph Philipp Karnath
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 40px; background-color: #fafafa; border-top: 1px solid #e0e0e0;">
                      <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #999999; text-align: center;">
                        Dies ist eine automatische Bestätigungsmail.<br>
                        Bitte antworten Sie nicht direkt auf diese Nachricht.
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

