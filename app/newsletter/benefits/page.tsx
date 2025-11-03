'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function BenefitsContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

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
        alert(data.error || 'Ein Fehler ist aufgetreten.');
        setLoading(false);
      }
    } catch (error) {
      alert('Verbindungsfehler. Bitte versuche es erneut.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-wider">
            NEWSLETTER ABONNEMENT
          </h1>
          <p className="text-white/70 text-lg sm:text-xl">
            Exklusive Updates direkt in dein Postfach
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border-2 border-white/30 p-8 sm:p-12 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 tracking-wider text-center">
            DEINE VORTEILE
          </h2>

          <div className="space-y-6 mb-12">
            <div className="border-l-4 border-white/60 pl-6">
              <h3 className="text-xl font-bold mb-2">Günstige Theater-Shows</h3>
              <p className="text-white/70">
                Erhalte Geheimtipps zu günstigen Theater-Aufführungen und exklusive Angebote.
              </p>
            </div>

            <div className="border-l-4 border-white/60 pl-6">
              <h3 className="text-xl font-bold mb-2">Einblicke in Dreharbeiten</h3>
              <p className="text-white/70">
                Erfahre als Erster, wo gerade gedreht wird und bekomme Behind-the-Scenes Einblicke.
              </p>
            </div>

            <div className="border-l-4 border-white/60 pl-6">
              <h3 className="text-xl font-bold mb-2">Exklusive Website-Updates</h3>
              <p className="text-white/70">
                Bleib auf dem Laufenden über neue Projekte, Fotos und Updates zur Website.
              </p>
            </div>
          </div>

          <div className="border-t-2 border-white/20 pt-8 text-center">
            <p className="text-white/60 text-sm mb-2">PREIS PRO E-MAIL</p>
            <p className="text-4xl font-bold mb-8">0.50 CHF</p>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 border-2 border-white/60 text-white hover:bg-white hover:text-black transition-all duration-300 text-lg tracking-wider font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'WIRD VERARBEITET...' : 'JETZT BEZAHLEN'}
            </button>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="text-white/60 hover:text-white transition-colors duration-300 text-sm tracking-wider"
          >
            ZURÜCK ZUR STARTSEITE
          </a>
        </div>
      </div>
    </div>
  );
}

export default function BenefitsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    }>
      <BenefitsContent />
    </Suspense>
  );
}

