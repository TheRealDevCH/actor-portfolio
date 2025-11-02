# E-Mail Konfiguration für Kontaktformular

## Setup-Anleitung

### 1. Gmail App-Passwort erstellen

1. Gehe zu deinem Google-Konto: https://myaccount.google.com/
2. Navigiere zu "Sicherheit"
3. Aktiviere "Bestätigung in zwei Schritten" (falls noch nicht aktiviert)
4. Gehe zu "App-Passwörter": https://myaccount.google.com/apppasswords
5. Wähle "Mail" und "Sonstiges Gerät"
6. Gib einen Namen ein (z.B. "Portfolio Website")
7. Kopiere das generierte 16-stellige Passwort

### 2. .env Datei erstellen

1. Erstelle eine `.env.local` Datei im Hauptverzeichnis
2. Füge folgende Zeilen hinzu:

```
EMAIL_USER=websitenphilipp@gmail.com
EMAIL_PASSWORD=dein-16-stelliges-app-passwort
```

3. Ersetze `dein-16-stelliges-app-passwort` mit dem kopierten App-Passwort

### 3. Deployment (Vercel)

1. Gehe zu deinem Vercel Dashboard
2. Wähle dein Projekt
3. Gehe zu "Settings" → "Environment Variables"
4. Füge hinzu:
   - `EMAIL_USER`: websitenphilipp@gmail.com
   - `EMAIL_PASSWORD`: dein-app-passwort

### Features

- ✅ Kontaktformular mit Validierung
- ✅ Spam-Filter (obszöne Wörter werden blockiert)
- ✅ Automatische Bestätigungs-E-Mail an Absender
- ✅ Benachrichtigung an websitenphilipp@gmail.com
- ✅ Holographischer Eingabe-Effekt
- ✅ Ländervorwahl-Dropdown (DE, CH, AT)
- ✅ Responsive Design

### Sicherheit

- Alle Eingaben werden validiert
- Obszöne Wörter werden blockiert
- Tracking-Warnung schreckt Spam ab
- E-Mail-Format wird überprüft

