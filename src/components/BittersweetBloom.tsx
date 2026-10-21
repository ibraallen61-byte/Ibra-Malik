import React, { useState, useId } from 'react';
import { Flower2, Sparkles, Download, Check } from 'lucide-react';
import { ambientSound } from '../audio/ambientAudio.ts';

export const BittersweetBloom: React.FC = () => {
  const [sadnessInput, setSadnessInput] = useState<string>('');
  const [luckyInput, setLuckyInput] = useState<string>('');
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Generate flower parameters from text
  const sorrowSeed = (sadnessInput || 'gentle sorrow').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const luckySeed = (luckyInput || 'unexpected light').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const petalCount = 8 + (sorrowSeed % 8);
  const innerPetalCount = 6 + (luckySeed % 6);
  const petalLength = 70 + (sorrowSeed % 40);
  const coreRadius = 24 + (luckySeed % 16);

  const handleCultivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sadnessInput.trim() && !luckyInput.trim()) return;
    setIsGenerated(true);
    ambientSound.playCardChime();
  };

  const handleExportSvg = () => {
    const svgEl = document.getElementById('bittersweet-flower-svg');
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgEl);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bittersweet-bloom-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 px-6 lg:px-12 border-b border-stone-800/60 bg-[#0d1015] relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-widest text-amber-500/90 font-sans mb-2">
            Metaphor & Catharsis
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#f5f2eb]">
            The Bittersweet Bloom
          </h2>
          <p className="text-stone-400 text-sm mt-3 font-sans">
            In botany, the deepest roots are nourished by heavy rainfall, while the petals open only toward the sun. Type what weighs on you and what spark lucky touched you to grow your bloom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Form */}
          <form onSubmit={handleCultivate} className="lg:col-span-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5 font-sans">
                The Sorrow (What is weighing on you today?)
              </label>
              <textarea
                rows={3}
                value={sadnessInput}
                onChange={(e) => setSadnessInput(e.target.value)}
                placeholder="e.g. A deep tiredness, a feeling of being left out, or missing an old friend..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-sm focus:outline-none focus:border-stone-600 placeholder:text-stone-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-amber-300 mb-1.5 font-sans">
                The Lucky Spark (What small gift or mercy occurred?)
              </label>
              <textarea
                rows={3}
                value={luckyInput}
                onChange={(e) => setLuckyInput(e.target.value)}
                placeholder="e.g. A hot cup of tea, a stranger held the elevator, the rain stopped just as I stepped outside..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-amber-900/50 text-amber-100 text-sm focus:outline-none focus:border-amber-500 placeholder:text-stone-600"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium text-xs rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Flower2 className="w-4 h-4" />
                <span>Cultivate Generative Bloom</span>
              </button>
            </div>
          </form>

          {/* Procedural SVG Bloom Display */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 rounded-2xl bg-stone-950/70 border border-stone-800 relative min-h-[380px]">
            <svg
              id="bittersweet-flower-svg"
              width="280"
              height="280"
              viewBox="-140 -140 280 280"
              className="drop-shadow-[0_0_25px_rgba(217,119,6,0.2)]"
            >
              <defs>
                <radialGradient id="sorrowGlow" cx="0" cy="0" r="100%">
                  <stop offset="0%" stopColor="#4338ca" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="luckyGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="sorrowIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#312e81" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Background ambient glow */}
              <circle cx="0" cy="0" r="120" fill="url(#sorrowGlow)" />

              {/* Outer Sorrow Petals (Deep roots) */}
              {[...Array(petalCount)].map((_, i) => {
                const angle = (i * 360) / petalCount;
                return (
                  <ellipse
                    key={`outer-${i}`}
                    cx="0"
                    cy={-petalLength * 0.65}
                    rx={18}
                    ry={petalLength * 0.55}
                    transform={`rotate(${angle})`}
                    fill="url(#sorrowIndigo)"
                    stroke="rgba(129, 140, 248, 0.4)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Inner Lucky Core Petals (Golden light) */}
              {[...Array(innerPetalCount)].map((_, i) => {
                const angle = (i * 360) / innerPetalCount + 180 / innerPetalCount;
                return (
                  <ellipse
                    key={`inner-${i}`}
                    cx="0"
                    cy={-coreRadius * 1.5}
                    rx={12}
                    ry={coreRadius * 1.2}
                    transform={`rotate(${angle})`}
                    fill="url(#luckyGold)"
                    stroke="#fef08a"
                    strokeWidth="1.2"
                    opacity="0.85"
                  />
                );
              })}

              {/* Core Stamen */}
              <circle cx="0" cy="0" r={coreRadius * 0.75} fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
              <circle cx="0" cy="0" r={coreRadius * 0.35} fill="#d97706" />
            </svg>

            <div className="mt-4 text-center">
              <span className="font-serif italic text-stone-300 text-sm block">
                {isGenerated ? 'Your Personal Bittersweet Bloom' : 'Contemplative Seed Bloom'}
              </span>
              <span className="text-[11px] text-stone-500 font-mono">
                {petalCount} Roots of Memory · {innerPetalCount} Petals of Serendipity
              </span>
            </div>

            {isGenerated && (
              <button
                onClick={handleExportSvg}
                className="mt-4 px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200 border border-stone-800 hover:border-stone-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                <span>{copied ? 'Saved' : 'Export SVG Keepsake'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
