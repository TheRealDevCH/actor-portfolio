'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

function SuccessContent() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-white text-4xl sm:text-5xl font-bold mb-8 tracking-wider">
          VIELEN DANK
        </h1>

        <div className="bg-white/5 backdrop-blur-sm border-2 border-white/30 p-8 sm:p-12 mb-8">
          <p className="text-white text-xl sm:text-2xl mb-6">
            Deine Zahlung war erfolgreich.
          </p>

          <div className="border-t-2 border-white/20 pt-6">
            <p className="text-white/70 text-base sm:text-lg">
              Bitte überprüfe dein E-Mail-Postfach für weitere Informationen.
            </p>
          </div>
        </div>

        {showButton && (
          <Link
            href="/"
            className="inline-block px-8 py-4 border-2 border-white/60 text-white hover:bg-white hover:text-black transition-all duration-300 text-base sm:text-lg tracking-wider font-semibold"
          >
            ZURÜCK ZUR STARTSEITE
          </Link>
        )}
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

