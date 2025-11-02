'use client';

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    "/2f73d626-1320-4306-bf88-ab67839492b7.jpg",
    "/45d0c922-b937-49bf-b341-34c7d35ca5d5.jpg",
    "/4a4ec72c-c06d-4038-b949-5f1c082d5072.jpg",
    "/cff6f52d-64c0-48bb-a9aa-835753e5c14a.jpg",
    "/dbf34008-adb2-4b78-92bc-69afe38de63d.jpg",
  ];

  const headerImage = "/0cb335e9-d87d-4607-8769-ebd54c7707f6.jpg";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Name Overlay */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src={headerImage}
          alt="Christoph Philipp Karnath"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        {/* Name Overlay */}
        <div className="absolute bottom-20 md:bottom-32 left-0 right-0">
          <div className="text-center px-4">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider mb-4 text-white drop-shadow-2xl">
              CHRISTOPH
            </h1>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-widest text-white/90 drop-shadow-2xl">
              PHILIPP KARNATH
            </h2>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-0">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`Portfolio ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <a
            href="mailto:kontakt@christoph-karnath.de"
            className="inline-block px-8 py-4 border-2 border-white/60 hover:bg-white hover:text-black transition-all duration-300 text-lg tracking-wider"
          >
            KONTAKT AUFNEHMEN
          </a>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>
          <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="Portfolio Detail"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
