import React from 'react';

export const FloatingWhatsApp: React.FC = () => {
  const waUrl = "https://wa.me/919052310001?text=Hi%2C%20I%27d%20like%20to%20book%20Cozy%20Cottage%21%20%F0%9F%8F%A1%0A%0AHere%20are%20my%20details%3A%0A%0A%F0%9F%93%85%20Date%20of%20Booking%3A%20%0A%F0%9F%91%A5%20Number%20of%20Guests%3A%20%0A%F0%9F%8E%89%20Purpose%20of%20Visit%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you%21";

  return (
    <a
      id="floating-whatsapp-btn"
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp Booking"
      className="fixed right-3.5 xs:right-5 sm:right-6 bottom-3.5 xs:bottom-5 sm:bottom-6 z-50 w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-[#25d366] to-[#169c4e] text-white shadow-[0_18px_34px_rgba(37,211,102,0.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_24px_40px_rgba(37,211,102,0.45)] group"
    >
      <div className="absolute inset-0 rounded-full border-2 border-[#25d366]/40 animate-wa-pulse pointer-events-none" />
      <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.943l6.284-1.649A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-4.988-1.362l-.357-.213-3.732.98.998-3.641-.234-.374A9.818 9.818 0 1112 21.818z" />
      </svg>
    </a>
  );
};
