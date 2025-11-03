'use client';

import { useState } from 'react';

export default function NewsletterEmailField() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = `/newsletter/benefits?email=${encodeURIComponent(email)}`;
      } else {
        setError(data.error || 'Ein Fehler ist aufgetreten.');
        setLoading(false);
      }
    } catch (error) {
      setError('Verbindungsfehler. Bitte versuche es erneut.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-lg">Wird geprüft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-white text-3xl sm:text-4xl font-bold mb-4 tracking-wider">
        NEWSLETTER
      </h2>
      <p className="text-white/70 text-base sm:text-lg mb-8">
        Bleib auf dem Laufenden
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Deine E-Mail-Adresse"
          required
          className="w-full bg-transparent border-2 border-white/40 text-white placeholder-white/50 px-6 py-4 text-base sm:text-lg focus:outline-none focus:border-white transition-all duration-300"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 border-2 border-white/60 text-white hover:bg-white hover:text-black transition-all duration-300 text-base sm:text-lg tracking-wider font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          WEITER
        </button>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </form>
    </div>
  );
}

