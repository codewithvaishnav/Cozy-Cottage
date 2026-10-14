import React, { useState } from 'react';
import { SEASONAL_HARVEST, DAILY_RITUALS } from '../../data/estateData';
import { Leaf, Sparkles, Sun, Moon, Utensils, Droplets, Wind, ShieldAlert, HeartHandshake, Compass } from 'lucide-react';

export const SeasonalAlmanac: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'harvest' | 'rituals' | 'regenerative'>('harvest');

  return (
    <section id="almanac" className="relative py-28 px-6 lg:px-12 bg-[#0c120e] text-[#f3efe6]">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#233528] pb-8">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-widest text-[#c89b58] uppercase flex items-center gap-2">
              <Leaf className="w-3.5 h-3.5" />
              <span>The Biodynamic Almanac & Ephemera</span>
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-[#fdfbf7] tracking-tight">
              Rooted in the Soil Rhythm
            </h2>
            <p className="text-[#a69c8c] max-w-xl text-sm md:text-base leading-relaxed">
              We farm without synthetic chemistry, guided by lunar cycles, volcanic mineral soil, and heirloom biodiversity.
            </p>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex items-center gap-2 bg-[#121b15] p-1.5 rounded-2xl border border-[#25372a]">
            <button
              id="almanac-tab-harvest"
              onClick={() => setActiveTab('harvest')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'harvest'
                  ? 'bg-[#c89b58] text-[#0d1310] font-semibold'
                  : 'text-[#9bae97] hover:text-white'
              }`}
            >
              Seasonal Harvests
            </button>
            <button
              id="almanac-tab-rituals"
              onClick={() => setActiveTab('rituals')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'rituals'
                  ? 'bg-[#c89b58] text-[#0d1310] font-semibold'
                  : 'text-[#9bae97] hover:text-white'
              }`}
            >
              Daily Farm Rituals
            </button>
            <button
              id="almanac-tab-regenerative"
              onClick={() => setActiveTab('regenerative')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'regenerative'
                  ? 'bg-[#c89b58] text-[#0d1310] font-semibold'
                  : 'text-[#9bae97] hover:text-white'
              }`}
            >
              Regenerative Soil
            </button>
          </div>
        </div>

        {/* Tab 1: Seasonal Harvest & Culinary Tasting Notes */}
        {activeTab === 'harvest' && (
          <div className="space-y-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SEASONAL_HARVEST.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#111914] border border-[#233527] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-[#c89b58]/60 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#c89b58] uppercase tracking-wider">{item.category}</span>
                      <span className="text-[#899a8d]">{item.peakSeason}</span>
                    </div>

                    <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#25392b] relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c120e]/80 via-transparent to-transparent" />
                    </div>

                    <h3 className="text-lg font-serif font-medium text-[#fcf9f2] group-hover:text-[#f5d7a1] transition-colors">
                      {item.name}
                    </h3>

                    <div className="space-y-1 text-xs">
                      <span className="text-[#5e7062] font-mono block">Aroma & Profile:</span>
                      <p className="text-[#ded6c8]">{item.flavorProfile}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#213225] text-xs text-[#9eb09f] italic font-serif">
                    &ldquo;{item.culinaryUse}&rdquo;
                  </div>
                </div>
              ))}
            </div>

            {/* Farm-to-Table 7-Course Wood-Fired Hearth Menu Teaser */}
            <div className="p-8 rounded-3xl bg-[#131c16] border border-[#2b3e30] flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs font-mono uppercase tracking-widest text-[#c89b58]">
                  Zero-Kilometer Hearth Gastronomy
                </span>
                <h3 className="text-2xl md:text-3xl font-serif text-[#fdfbf7]">
                  The Daily Seven-Course Harvest Hearth Dinner
                </h3>
                <p className="text-xs md:text-sm text-[#b0a390] leading-relaxed">
                  Every evening, Executive Chef & Forager assemble a menu derived solely from morning greenhouse pickings, pasture-raised meats, forest fungi, and our stone cellar vintages.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-right sm:border-r border-[#2d4032] sm:pr-6">
                  <div className="text-2xl font-serif text-white">$165</div>
                  <div className="text-xs font-mono text-[#8a998d]">Per Guest (Pairings Included)</div>
                </div>
                <a
                  href="#stays"
                  className="px-6 py-3 rounded-full bg-[#c89b58] text-[#0d1310] font-semibold text-xs uppercase tracking-wider font-mono hover:bg-[#e0b575] transition-colors"
                >
                  Reserve Table & Stay
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Daily Farm Rituals */}
        {activeTab === 'rituals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {DAILY_RITUALS.map((ritual, idx) => (
              <div
                key={idx}
                className="bg-[#111914] border border-[#233527] rounded-3xl p-6 md:p-8 space-y-4 hover:border-[#c89b58]/60 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono tracking-widest text-[#c89b58] px-3 py-1 rounded-full bg-[#1b271f] border border-[#2e4033]">
                      {ritual.time} • {ritual.period}
                    </span>
                    <span className="text-xs font-mono text-[#839487]">{ritual.location}</span>
                  </div>

                  <h3 className="text-2xl font-serif text-[#fdfbf7]">{ritual.title}</h3>
                  <p className="text-sm text-[#b8ab97] leading-relaxed font-sans">{ritual.description}</p>
                </div>

                <div className="pt-4 border-t border-[#203124] flex items-center justify-between text-xs font-mono text-[#88998c]">
                  <span>Open to all resident guests</span>
                  <span className="text-[#c89b58] font-serif italic">Complimentary</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Regenerative Agriculture Pillars */}
        {activeTab === 'regenerative' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="bg-[#111914] border border-[#233527] rounded-3xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1b2b20] border border-[#344d3b] flex items-center justify-center text-[#4ade80]">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-[#fdfbf7]">Living Geothermal & Spring Cycle</h3>
              <p className="text-sm text-[#b8ab97] leading-relaxed">
                Natural sub-alpine spring water feeds our gravity-driven irrigation channels, geothermal greenhouse heating pipes, and pure mineral bathhouse plunge pools with zero chemical additives.
              </p>
              <div className="pt-2 text-xs font-mono text-[#c89b58]">100% Gravity & Sub-Alpine Sourced</div>
            </div>

            <div className="bg-[#111914] border border-[#233527] rounded-3xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1b2b20] border border-[#344d3b] flex items-center justify-center text-[#fbbf24]">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-[#fdfbf7]">Micro-Grid Solar & Wood Biomass</h3>
              <p className="text-sm text-[#b8ab97] leading-relaxed">
                The entire 120-acre estate operates on a self-contained 240kW rooftop solar array paired with fallen-timber pyrolytic biochar heating that returns pure carbon to our orchard soils.
              </p>
              <div className="pt-2 text-xs font-mono text-[#c89b58]">Net Carbon Negative Estate</div>
            </div>

            <div className="bg-[#111914] border border-[#233527] rounded-3xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1b2b20] border border-[#344d3b] flex items-center justify-center text-[#c89b58]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-[#fdfbf7]">400-Variety Heirloom Seed Vault</h3>
              <p className="text-sm text-[#b8ab97] leading-relaxed">
                Preserving endangered non-GMO European heirloom vegetables, medicinal botanical cultivars, and wild berry strains dating back to the 18th century.
              </p>
              <div className="pt-2 text-xs font-mono text-[#c89b58]">Demeter Certified Biodynamic</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
