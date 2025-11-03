# Stripe Newsletter Setup Anleitung

## 1. Stripe Account erstellen

1. Gehe zu [https://stripe.com](https://stripe.com)
2. Erstelle einen kostenlosen Account
3. Verifiziere deine E-Mail-Adresse

## 2. API Keys holen

1. Gehe zu [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Kopiere den **Secret Key** (beginnt mit `sk_test_...`)
3. Füge ihn in deine `.env.local` Datei ein:
   ```
   STRIPE_SECRET_KEY=sk_test_dein_key_hier
   ```

## 3. Webhook einrichten

### Lokal testen (mit Stripe CLI):

1. Installiere Stripe CLI: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Starte Webhook forwarding:
   ```bash
   stripe listen --forward-to localhost:3000/api/newsletter/webhook
   ```
4. Kopiere den Webhook Secret (beginnt mit `whsec_...`)
5. Füge ihn in `.env.local` ein:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_dein_secret_hier
   ```

### Für Production (Vercel):

1. Gehe zu [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Klicke auf "Add endpoint"
3. URL: `https://actor-portfolio-phi.vercel.app/api/newsletter/webhook`
4. Events auswählen: `checkout.session.completed`
5. Kopiere den Webhook Secret
6. Füge ihn in Vercel Environment Variables ein

## 4. Environment Variables in Vercel setzen

1. Gehe zu deinem Vercel Dashboard
2. Wähle dein Projekt aus
3. Gehe zu Settings → Environment Variables
4. Füge hinzu:
   - `STRIPE_SECRET_KEY` = dein Live Secret Key (beginnt mit `sk_live_...`)
   - `STRIPE_WEBHOOK_SECRET` = dein Production Webhook Secret
   - `NEXT_PUBLIC_BASE_URL` = `https://actor-portfolio-phi.vercel.app`

## 5. Live Mode aktivieren

1. Gehe zu [https://dashboard.stripe.com/settings/account](https://dashboard.stripe.com/settings/account)
2. Fülle alle erforderlichen Informationen aus
3. Aktiviere Live Mode
4. Hole die Live API Keys (beginnen mit `sk_live_...`)
5. Ersetze die Test Keys in Vercel mit den Live Keys

## 6. Testen

### Test Mode:
- Verwende Testkarten: `4242 4242 4242 4242`
- Beliebiges Ablaufdatum in der Zukunft
- Beliebiger CVC

### Live Mode:
- Echte Kreditkarten werden belastet
- 0.50 CHF pro Newsletter-Anmeldung

## Kosten

- **Stripe Gebühren:** 2.9% + 0.30 CHF pro Transaktion
- **Bei 0.50 CHF Newsletter:**
  - Stripe Gebühr: ~0.32 CHF
  - Dein Gewinn: ~0.18 CHF pro Anmeldung

## Support

Bei Fragen: [https://support.stripe.com](https://support.stripe.com)

