import React, { useState } from 'react';
import { CottageSuite, BookingInquiryData } from '../../types';
import { Calendar, Users, Sparkles, CheckCircle2, X, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';

interface BookingModalProps {
  suite: CottageSuite | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ suite, onClose }) => {
  if (!suite) return null;

  const [checkIn, setCheckIn] = useState('2026-09-15');
  const [checkOut, setCheckOut] = useState('2026-09-18');
  const [guests, setGuests] = useState(2);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([
    "Chef's 7-Course Biodynamic Hearth Banquet"
  ]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculate nights
  const nights = 3; // default calculated
  const totalStayCost = suite.ratePerNight * nights;
  const experienceCost = selectedExperiences.length * 160 * guests;
  const grandTotal = totalStayCost + experienceCost;

  const toggleExperience = (exp: string) => {
    if (selectedExperiences.includes(exp)) {
      setSelectedExperiences(selectedExperiences.filter((e) => e !== exp));
    } else {
      setSelectedExperiences([...selectedExperiences, exp]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div
      id="booking-modal-overlay"
      className="fixed inset-0 z-50 bg-[#071910]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-fade-in text-[#f3efe6]"
    >
      <div className="bg-[#0c2418] border border-[#52b788]/25 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 md:p-10 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-[#18241d] border border-[#304435] text-[#b8ad9c] hover:text-white hover:border-[#c89b58] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-12 space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#c89b58]/20 border border-[#c89b58] flex items-center justify-center mx-auto text-[#c89b58]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono tracking-widest text-[#c89b58] uppercase">Inquiry Received</span>
              <h3 className="text-3xl md:text-4xl font-serif text-[#fdfbf7]">We Await Your Arrival</h3>
              <p className="text-sm text-[#b8ab97] max-w-md mx-auto leading-relaxed">
                Our estate concierge has reserved your inquiry for <span className="text-[#f5d7a1] font-semibold">{suite.name}</span>. A bespoke itinerary and personalized confirmation will be sent to <span className="text-[#f5d7a1]">{email || 'your email'}</span> within 4 hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141f18] border border-[#25392b] max-w-md mx-auto text-left space-y-2 text-xs font-mono text-[#a39886]">
              <div className="flex justify-between">
                <span>Dates:</span>
                <span className="text-[#e2d8c8]">{checkIn} to {checkOut} ({nights} Nights)</span>
              </div>
              <div className="flex justify-between">
                <span>Guests:</span>
                <span className="text-[#e2d8c8]">{guests} Adults</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Haven Total:</span>
                <span className="text-[#c89b58] font-bold">${grandTotal} USD</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-[#c89b58] text-[#0d1310] font-semibold hover:bg-[#e0b575] transition-colors text-sm"
            >
              Return to Estate Experience
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2 border-b border-[#25392b] pb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#c89b58]">
                Boutique Agritourism Reservation
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-[#fdfbf7]">{suite.name}</h2>
              <p className="text-xs md:text-sm text-[#b0a390]">{suite.tagline}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dates & Guests */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#a89e8d] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#c89b58]" />
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                    className="w-full bg-[#131d16] border border-[#2c3f30] rounded-xl px-3.5 py-2.5 text-sm text-[#f3efe6] focus:outline-none focus:border-[#c89b58]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#a89e8d] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#c89b58]" />
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="w-full bg-[#131d16] border border-[#2c3f30] rounded-xl px-3.5 py-2.5 text-sm text-[#f3efe6] focus:outline-none focus:border-[#c89b58]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#a89e8d] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#c89b58]" />
                    Guests (Max {suite.maxGuests})
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-[#131d16] border border-[#2c3f30] rounded-xl px-3.5 py-2.5 text-sm text-[#f3efe6] focus:outline-none focus:border-[#c89b58]"
                  >
                    {Array.from({ length: suite.maxGuests }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num} className="bg-[#0f1712] text-[#f3efe6]">
                        {num} Guest{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#a89e8d]">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Eleanor Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#131d16] border border-[#2c3f30] rounded-xl px-3.5 py-2.5 text-sm text-[#f3efe6] focus:outline-none focus:border-[#c89b58]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#a89e8d]">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="eleanor@estate.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#131d16] border border-[#2c3f30] rounded-xl px-3.5 py-2.5 text-sm text-[#f3efe6] focus:outline-none focus:border-[#c89b58]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#a89e8d]">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 349-2810"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#131d16] border border-[#2c3f30] rounded-xl px-3.5 py-2.5 text-sm text-[#f3efe6] focus:outline-none focus:border-[#c89b58]"
                  />
                </div>
              </div>

              {/* Curated Seasonal Experiences Add-ons */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-mono text-[#c89b58] uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Curate Agricultural Experiences
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Chef's 7-Course Biodynamic Hearth Banquet",
                    "Private Sommelier Underground Cellar Tasting",
                    "Dawn Wild Herb & Chanterelle Foraging Expedition",
                    "Private Mineral Spring Thermal Bathhouse Ritual"
                  ].map((exp) => {
                    const isSelected = selectedExperiences.includes(exp);
                    return (
                      <button
                        type="button"
                        key={exp}
                        onClick={() => toggleExperience(exp)}
                        className={`text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between text-xs ${
                          isSelected
                            ? 'bg-[#1b2b20] border-[#c89b58] text-[#fbf8f2]'
                            : 'bg-[#121b15] border-[#25372a] text-[#a89e8d] hover:border-[#3a5240]'
                        }`}
                      >
                        <span className="font-medium pr-2">{exp}</span>
                        <span className="font-mono text-[#c89b58] shrink-0">+$160/ea</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#a89e8d]">Dietary Notes & Special Requests</label>
                <textarea
                  rows={2}
                  placeholder="Dietary allergies, arrival time preferences, or bespoke anniversary celebrations..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-[#131d16] border border-[#2c3f30] rounded-xl px-3.5 py-2.5 text-sm text-[#f3efe6] focus:outline-none focus:border-[#c89b58]"
                />
              </div>

              {/* Cost Summary & Submission */}
              <div className="p-4 rounded-2xl bg-[#141e17] border border-[#2a3c2e] flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5 text-left w-full md:w-auto">
                  <span className="text-xs text-[#8a998d] font-mono">Estimated Haven Stay (3 Nights + Experiences)</span>
                  <div className="text-2xl font-serif text-[#fdfbf7]">
                    ${grandTotal} <span className="text-xs font-mono text-[#c89b58] font-normal">USD Total</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-full border border-[#2e4233] text-xs font-medium text-[#b5a997] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 md:flex-initial px-8 py-3 rounded-full bg-[#c89b58] text-[#0d1310] font-semibold hover:bg-[#e0b575] transition-colors text-xs uppercase tracking-wider font-mono shadow-lg shadow-[#c89b58]/20"
                  >
                    Request Reservation
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
