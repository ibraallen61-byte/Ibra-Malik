import React, { useState } from 'react';
import { DUALITIES } from '../data/dualities.ts';
import { Duality } from '../types.ts';
import { ambientSound } from '../audio/ambientAudio.ts';
import { RefreshCw, Sparkles, Feather, ShieldAlert } from 'lucide-react';

export const SilverLiningCoin: React.FC = () => {
  const [selectedDuality, setSelectedDuality] = useState<Duality>(DUALITIES[0]);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [side, setSide] = useState<'sadness' | 'lucky'>('sadness');
  const [customSadness, setCustomSadness] = useState<string>('');
  const [customLucky, setCustomLucky] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  const flipCoin = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    ambientSound.playCoinTink();

    // Toggle side halfway through flip
    setTimeout(() => {
      setSide((prev) => (prev === 'sadness' ? 'lucky' : 'sadness'));
    }, 450);

    setTimeout(() => {
      setIsFlipping(false);
    }, 900);
  };

  const handleSelectDuality = (d: Duality) => {
    setSelectedDuality(d);
    setIsCustomMode(false);
    setSide('sadness');
  };

  return (
    <section id="silver-coin" className="py-20 px-6 lg:px-12 border-b border-stone-800/60 bg-[#0b0d10] relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual & 3D Interactive Coin */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-2xl bg-stone-900/40 border border-stone-800 text-center relative overflow-hidden">
            {/* Visual Kintsugi Background Thumbnail */}
            <div className="w-full h-44 rounded-xl overflow-hidden mb-8 relative border border-stone-800/80">
              <img
                src="/src/assets/images/kintsugi_golden_bowl_1792558415392.jpg"
                alt="Ceramic cup repaired with golden kintsugi seams"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 text-left">
                <span className="text-[11px] text-amber-400 font-mono uppercase tracking-wider block">Philosophy of Kintsugi</span>
                <span className="text-xs text-stone-200 font-serif italic">Every crack mended with radiant gold</span>
              </div>
            </div>

            {/* 3D Coin Graphic */}
            <div className="perspective-1000 my-4 cursor-pointer" onClick={flipCoin}>
              <div
                className={`w-36 h-36 rounded-full flex items-center justify-center p-2.5 transition-transform duration-700 shadow-2xl relative ${
                  isFlipping ? 'animate-[spin_0.9s_cubic-bezier(0.4,0,0.2,1)]' : ''
                } ${
                  side === 'lucky'
                    ? 'bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 text-stone-950 border-4 border-amber-200 ring-4 ring-amber-500/20'
                    : 'bg-gradient-to-br from-stone-600 via-stone-800 to-stone-950 text-stone-200 border-4 border-stone-500 ring-4 ring-stone-700/20'
                }`}
              >
                {/* Coin Inner Rim */}
                <div
                  className={`w-full h-full rounded-full border border-dashed flex flex-col items-center justify-center text-center p-2 ${
                    side === 'lucky' ? 'border-amber-950/40' : 'border-stone-400/40'
                  }`}
                >
                  {side === 'lucky' ? (
                    <>
                      <Sparkles className="w-6 h-6 mb-1 text-amber-950" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-amber-950 font-sans">
                        Lucky Face
                      </span>
                      <span className="text-[10px] font-serif italic text-amber-900 leading-tight">
                        The Silver Seam
                      </span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-6 h-6 mb-1 text-stone-400" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-stone-300 font-sans">
                        Sorrow Face
                      </span>
                      <span className="text-[10px] font-serif italic text-stone-400 leading-tight">
                        The Heavy Truth
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-400 mt-4 font-sans">
              Click the coin or button below to flip perspective.
            </p>

            <button
              onClick={flipCoin}
              disabled={isFlipping}
              className="mt-4 px-5 py-2.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs font-medium text-stone-200 rounded-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFlipping ? 'animate-spin' : ''}`} />
              <span>{isFlipping ? 'Tossing into air...' : 'Flip to Other Side'}</span>
            </button>
          </div>

          {/* Right Column: Duality Readings & Reconciliation */}
          <div className="lg:col-span-7">
            <div className="text-xs uppercase tracking-widest text-amber-500/90 font-sans mb-2">
              The Coin of Dualities
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#f5f2eb] mb-4">
              Two Sides of the Same Nickel
            </h2>
            <p className="text-stone-300 text-sm font-sans mb-8">
              A single coin cannot exist without both its faces. Sorrow and luck are not enemies; they are the texture of a fully lived existence. Choose a life chapter or write your own.
            </p>

            {/* Duality Preset Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {DUALITIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDuality(d)}
                  className={`p-3 text-left rounded-xl border text-xs transition-all ${
                    !isCustomMode && selectedDuality.id === d.id
                      ? 'bg-amber-950/30 border-amber-500/70 text-amber-200 shadow-sm'
                      : 'bg-stone-900/50 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <span className="font-serif block font-medium mb-1 truncate">{d.title}</span>
                  <span className="text-[10px] text-stone-500 block truncate">Inspect dual facets</span>
                </button>
              ))}
            </div>

            {/* Current Dual Facet Box */}
            <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 relative">
              <div className="flex items-center justify-between text-xs text-stone-400 mb-4 pb-3 border-b border-stone-800">
                <span className="font-serif text-amber-400 text-sm">{selectedDuality.title}</span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                  Currently Viewing: {side === 'lucky' ? 'The Fortune' : 'The Sorrow'}
                </span>
              </div>

              {side === 'sadness' ? (
                <div>
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Feather className="w-3.5 h-3.5 text-stone-400" />
                    <span>The Heavy Truth (Side A)</span>
                  </div>
                  <p className="text-stone-200 font-sans text-sm md:text-base leading-relaxed mb-6">
                    {selectedDuality.sadnessAspect}
                  </p>
                  <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800/80 text-xs text-stone-400">
                    <span className="text-stone-300 font-medium block mb-1">Acknowledge this:</span>
                    "You do not have to smile through clenched teeth. What hurts is allowed to hurt."
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>The Serendipitous Grace (Side B)</span>
                  </div>
                  <p className="text-amber-100 font-sans text-sm md:text-base leading-relaxed mb-6">
                    {selectedDuality.luckyAspect}
                  </p>
                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/40 text-xs text-amber-200/90">
                    <span className="font-medium text-amber-300 block mb-1">The Reconciliation:</span>
                    {selectedDuality.reconciliation}
                  </div>
                </div>
              )}

              {/* Bottom Quick Flip Bar */}
              <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  Ready to see {side === 'sadness' ? 'the light' : 'the root'}?
                </span>
                <button
                  onClick={flipCoin}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Flip to {side === 'sadness' ? 'Lucky Side' : 'Sorrow Side'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
