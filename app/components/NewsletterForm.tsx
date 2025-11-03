'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Wird verarbeitet...' });

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.checkoutUrl;
      } else {
        setStatus({ type: 'error', message: data.error || 'Ein Fehler ist aufgetreten.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Verbindungsfehler. Bitte versuche es erneut.' });
    }
  };

  return (
    <div className="relative h-full bg-black/40 backdrop-blur-sm border-2 border-white/30 overflow-hidden group hover:border-white/60 transition-all duration-300">
      <div className="relative z-10 h-full flex flex-col justify-center p-4 sm:p-6">
        <div className="text-center mb-4">
          <div className="text-3xl sm:text-4xl mb-3">📬</div>
          <h3 className="text-white text-lg sm:text-xl font-bold mb-2 tracking-wider">
            EXKLUSIVER NEWSLETTER
          </h3>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            Erhalte exklusive Updates zu:
          </p>
          <ul className="text-white/70 text-xs sm:text-sm mt-2 space-y-1">
            <li>🎭 Günstige Theater-Shows (Geheimtipps)</li>
            <li>🎬 Einblicke in aktuelle Dreharbeiten</li>
            <li>✨ Exklusive Website-Updates</li>
          </ul>
          <p className="text-white/60 text-xs mt-3">
            Nur <strong className="text-white">0.50 CHF</strong> pro E-Mail
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="Deine E-Mail-Adresse"
              required
              className={`w-full bg-transparent border-b-2 border-white/40 text-white placeholder-white/50 px-2 py-2 text-sm sm:text-base focus:outline-none focus:border-white transition-all duration-300 ${
                focusedField === 'email' ? 'hologram-input' : ''
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={status.type === 'loading'}
            className="w-full py-2 sm:py-3 border-2 border-white/60 text-white hover:bg-white hover:text-black transition-all duration-300 text-sm sm:text-base tracking-wider font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status.type === 'loading' ? 'WIRD VERARBEITET...' : 'JETZT ABONNIEREN'}
          </button>

          {status.message && (
            <div
              className={`text-center text-xs sm:text-sm py-2 ${
                status.type === 'success'
                  ? 'text-green-400'
                  : status.type === 'error'
                  ? 'text-red-400'
                  : 'text-white/70'
              }`}
            >
              {status.message}
            </div>
          )}
        </form>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 animate-pulse" />
      </div>
    </div>
  );
}

