'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

function SuccessContent() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 animate-bounce">
          <span className="text-8xl">🎉</span>
        </div>

        <h1 className="text-white text-4xl sm:text-5xl font-bold mb-6 tracking-wider">
          WILLKOMMEN!
        </h1>

        <div className="bg-white/5 backdrop-blur-sm border-2 border-white/30 rounded-lg p-8 mb-8">
          <p className="text-white text-xl sm:text-2xl mb-4">
            Danke für dein Newsletter-Abonnement! 🎭
          </p>

          <div className="text-white/80 text-base sm:text-lg space-y-3 mb-6">
            <p>Du erhältst ab sofort exklusive Updates zu:</p>
            <ul className="space-y-2">
              <li>🎭 Günstige Theater-Shows (Geheimtipps)</li>
              <li>🎬 Einblicke in aktuelle Dreharbeiten</li>
              <li>✨ Exklusive Website-Updates</li>
            </ul>
          </div>

          <div className="border-t border-white/20 pt-6 mt-6">
            <p className="text-white/70 text-sm">
              Eine Bestätigungs-E-Mail wurde an deine Adresse gesendet.
            </p>
          </div>
        </div>

        <div className="text-white/60 text-sm mb-6">
          Weiterleitung zur Startseite in <span className="text-white font-bold text-lg">{countdown}</span> Sekunden...
        </div>

        <Link
          href="/"
          className="inline-block px-8 py-3 border-2 border-white/60 text-white hover:bg-white hover:text-black transition-all duration-300 text-base tracking-wider font-semibold"
        >
          SOFORT ZUR STARTSEITE
        </Link>
      </div>
    </div>
  );
}

export default function NewsletterSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Lädt...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

