import React, { useState } from 'react';
import { Compass, Mail, ArrowRight, Sparkles, Trees, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
    }
  };

  return (
    <footer className="relative bg-[#070b09] text-[#f3efe6] border-t border-[#1d2d21] pt-20 pb-12 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Top Dispatch Banner */}
        <div className="p-8 md:p-12 rounded-3xl bg-[#0f1712] border border-[#233729] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c89b58] flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              <span>The Seasonal Botanical Almanac Dispatch</span>
            </span>
            <h3 className="text-3xl md:text-4xl font-serif text-[#fdfbf7]">
              Receive Quarterly Harvest Chronicles
            </h3>
            <p className="text-xs md:text-sm text-[#a89d8c] leading-relaxed">
              Rare heirloom seed releases, reserve vintage cellar allocations, and seasonal solstice retreat invitations delivered directly to your inbox.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {isSubscribed ? (
              <div className="px-6 py-4 rounded-2xl bg-[#18261e] border border-[#344f3b] text-xs font-mono text-[#f5d7a1] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c89b58]" />
                <span>You are inscribed for the Autumn Equinox Dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-72 bg-[#141e17] border border-[#2b3e30] rounded-full px-5 py-3 text-xs text-[#f3efe6] placeholder-[#6b7d70] focus:outline-none focus:border-[#c89b58]"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#c89b58] text-[#0d1310] font-semibold text-xs font-mono uppercase tracking-wider hover:bg-[#e0b575] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c89b58]/20"
                >
                  <span>Inscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-4 text-xs">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#141f17] border border-[#304435] flex items-center justify-center text-[#c89b58] font-serif font-bold text-sm">
                Æ
              </div>
              <span className="font-serif text-lg tracking-wider text-[#fdfbf7] uppercase">
                Aethelgard Estate
              </span>
            </div>
            <p className="text-[#998f7e] max-w-sm leading-relaxed">
              A private agritourism sanctuary dedicated to architectural preservation, biodynamic viticulture, thermal mineral wellness, and slow culinary art.
            </p>
            <div className="font-mono text-[#8a998d] space-y-1">
              <div>Coordinates: 45°28&apos;12&quot;N 9°14&apos;45&quot;E</div>
              <div>Sub-Alpine Elevation: 420–465m a.s.l.</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-mono uppercase tracking-widest text-[#c89b58]">The Sanctuaries</h4>
            <ul className="space-y-2 text-[#b0a390]">
              <li><a href="#estate-3d-viewport" className="hover:text-white transition-colors">3D Interactive Map</a></li>
              <li><a href="#stays" className="hover:text-white transition-colors">The Granary Haven</a></li>
              <li><a href="#stays" className="hover:text-white transition-colors">The Glasshouse Villa</a></li>
              <li><a href="#stays" className="hover:text-white transition-colors">The Stone Mill Suite</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">Visual Photo Archive</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-mono uppercase tracking-widest text-[#c89b58]">Agritourism</h4>
            <ul className="space-y-2 text-[#b0a390]">
              <li><a href="#almanac" className="hover:text-white transition-colors">Biodynamic Viticulture</a></li>
              <li><a href="#almanac" className="hover:text-white transition-colors">7-Course Hearth Dinner</a></li>
              <li><a href="#almanac" className="hover:text-white transition-colors">Heirloom Seed Vault</a></li>
              <li><a href="#almanac" className="hover:text-white transition-colors">Thermal Spring Bathhouse</a></li>
              <li><a href="#almanac" className="hover:text-white transition-colors">Daily Farm Rituals</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-mono uppercase tracking-widest text-[#c89b58]">Contact & Access</h4>
            <ul className="space-y-2 text-[#b0a390]">
              <li>Estate Concierge: concierge@aethelgard.com</li>
              <li>Private Cellar Inquiries</li>
              <li>Helipad Coordinates Available on Booking</li>
              <li>Registered Agritourism No. AG-9428-EU</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#17241b] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#78887b]">
          <div>
            © {new Date().getFullYear()} Aethelgard Estate & Luxury Farmhouse. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Demeter Certified Biodynamic</span>
            <span>Zero-Emission Agritourism</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
