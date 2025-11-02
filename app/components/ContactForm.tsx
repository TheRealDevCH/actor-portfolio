'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

const COUNTRY_CODES = [
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+43', country: 'AT', flag: '🇦🇹' },
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+49',
    message: '',
  });

  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Wird gesendet...' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: data.message });
        setFormData({
          name: '',
          email: '',
          phone: '',
          countryCode: '+49',
          message: '',
        });
      } else {
        setStatus({ 
          type: 'error', 
          message: data.error || 'Ein Fehler ist aufgetreten.' 
        });
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: 'Verbindungsfehler. Bitte versuchen Sie es später erneut.' 
      });
    }
  };

  return (
    <div className="relative aspect-[3/4] overflow-hidden group bg-black/20 backdrop-blur-sm border border-white/20">
      <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-center">
        <h3 className="text-white text-xl sm:text-2xl font-bold mb-4 tracking-wider text-center">
          KONTAKT
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              placeholder="Voller Name"
              required
              className={`w-full bg-transparent border-b-2 border-white/40 text-white placeholder-white/50 px-2 py-2 text-sm sm:text-base focus:outline-none focus:border-white transition-all duration-300 ${
                focusedField === 'name' ? 'hologram-input' : ''
              }`}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="E-Mail-Adresse"
              required
              className={`w-full bg-transparent border-b-2 border-white/40 text-white placeholder-white/50 px-2 py-2 text-sm sm:text-base focus:outline-none focus:border-white transition-all duration-300 ${
                focusedField === 'email' ? 'hologram-input' : ''
              }`}
            />
          </div>

          {/* Telefon mit Vorwahl */}
          <div className="relative flex gap-2">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="bg-transparent border-b-2 border-white/40 text-white px-2 py-2 text-sm sm:text-base focus:outline-none focus:border-white transition-all duration-300 cursor-pointer"
              style={{ width: '80px' }}
            >
              {COUNTRY_CODES.map(({ code, country, flag }) => (
                <option key={code} value={code} className="bg-black text-white">
                  {flag} {code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              placeholder="Telefonnummer"
              required
              className={`flex-1 bg-transparent border-b-2 border-white/40 text-white placeholder-white/50 px-2 py-2 text-sm sm:text-base focus:outline-none focus:border-white transition-all duration-300 ${
                focusedField === 'phone' ? 'hologram-input' : ''
              }`}
            />
          </div>

          {/* Nachricht */}
          <div className="relative">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              placeholder="Ihre Nachricht"
              required
              rows={3}
              className={`w-full bg-transparent border-b-2 border-white/40 text-white placeholder-white/50 px-2 py-2 text-sm sm:text-base focus:outline-none focus:border-white transition-all duration-300 resize-none ${
                focusedField === 'message' ? 'hologram-input' : ''
              }`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status.type === 'loading'}
            className="w-full py-2 sm:py-3 border-2 border-white/60 text-white hover:bg-white hover:text-black transition-all duration-300 text-sm sm:text-base tracking-wider font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status.type === 'loading' ? 'WIRD GESENDET...' : 'ABSENDEN'}
          </button>

          {/* Status Message */}
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

      {/* Hologram Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 animate-pulse" />
      </div>
    </div>
  );
}

