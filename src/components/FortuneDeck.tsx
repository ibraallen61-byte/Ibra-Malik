import React, { useState } from 'react';
import { FortuneCard } from '../types.ts';
import { FORTUNES } from '../data/fortunes.ts';
import { Sparkles, Bookmark, BookmarkCheck, Share2, Check, RefreshCw } from 'lucide-react';
import { ambientSound } from '../audio/ambientAudio.ts';

interface FortuneDeckProps {
  onSaveToPocket: (fortune: FortuneCard) => void;
  savedIds: string[];
}

export const FortuneDeck: React.FC<FortuneDeckProps> = ({ onSaveToPocket, savedIds }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const categories = ['All', 'Kintsugi', 'Kindred Spirits', 'Atmospheric Solace', 'Micro-Miracles', 'Quiet Perspective'];

  const filteredFortunes = selectedCategory === 'All'
    ? FORTUNES
    : FORTUNES.filter((f) => f.category === selectedCategory);

  const currentFortune = filteredFortunes[currentIndex % filteredFortunes.length] || FORTUNES[0];
  const isSaved = savedIds.includes(currentFortune.id);

  const handleNextFortune = () => {
    setIsFlipping(true);
    ambientSound.playCardChime();
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredFortunes.length);
      setIsFlipping(false);
    }, 200);
  };

  const handleRandomDraw = () => {
    setIsFlipping(true);
    ambientSound.playCardChime();
    setTimeout(() => {
      const nextIdx = Math.floor(Math.random() * filteredFortunes.length);
      setCurrentIndex(nextIdx);
      setIsFlipping(false);
    }, 200);
  };

  const handleCopy = () => {
    const textToCopy = `"${currentFortune.title}"\n${currentFortune.narrative}\n\n— From The Serendipity Sanctuary`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="fortunes" className="py-20 px-6 lg:px-12 border-b border-stone-800/60 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-widest text-amber-500/90 font-sans mb-2">
            Sanctuary Fortune Reel
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#f5f2eb]">
            Tokens for the Melancholy Soul
          </h2>
          <p className="text-stone-400 text-sm mt-3 font-sans">
            Draw a vignette to remind you that even inside sorrow, little miracles, kindred echoes, and quiet graces are quietly unfolding.
          </p>
        </div>

        {/* Category Filter Tabs (Interactive buttons with active state) */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap p-1.5 bg-stone-900/70 border border-stone-800 rounded-xl max-w-2xl mx-auto mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-stone-800 text-amber-300 shadow-sm border border-stone-700'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* The Card Viewport */}
        <div className="relative max-w-2xl mx-auto">
          {/* Card Frame */}
          <div
            className={`transition-all duration-300 rounded-2xl border border-stone-800 bg-[#12151b] p-8 md:p-10 shadow-2xl relative overflow-hidden ${
              isFlipping ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100'
            }`}
          >
            {/* Gentle corner ornament */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />

            {/* Unboxed Metadata (Zero-pill discipline) */}
            <div className="flex items-center justify-between text-xs text-stone-500 mb-6 border-b border-stone-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-amber-500/90 font-medium">{currentFortune.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">Token: {currentFortune.luckyToken}</span>
              </div>
              <div className="text-stone-500 font-mono tabular-nums">
                {currentIndex + 1} / {filteredFortunes.length}
              </div>
            </div>

            {/* Card Title */}
            <h3 className="text-2xl md:text-3xl font-serif text-[#f5f2eb] mb-5 leading-snug">
              {currentFortune.title}
            </h3>

            {/* Narrative text */}
            <p className="text-stone-300 font-sans leading-relaxed text-base mb-6">
              {currentFortune.narrative}
            </p>

            {/* Curated Quote */}
            {currentFortune.quote && (
              <blockquote className="my-6 p-4 rounded-xl bg-stone-900/60 border border-stone-800/80 text-stone-300 font-serif italic text-base">
                "{currentFortune.quote.text}"
                <footer className="text-xs font-sans not-italic text-amber-400/80 mt-2">
                  — {currentFortune.quote.author}
                </footer>
              </blockquote>
            )}

            {/* Small Action Callout */}
            <div className="pt-4 border-t border-stone-800/80 flex items-start gap-3">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-sans mt-0.5 shrink-0">
                Gentle Practice:
              </span>
              <p className="text-xs text-stone-300 font-sans leading-normal">
                {currentFortune.smallAction}
              </p>
            </div>

            {/* Card Bottom Controls */}
            <div className="mt-8 pt-5 border-t border-stone-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSaveToPocket(currentFortune)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-all flex items-center gap-1.5 ${
                    isSaved
                      ? 'bg-amber-950/40 border-amber-600/50 text-amber-300'
                      : 'border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                  }`}
                  title="Keep in your pocket"
                >
                  {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'In Pocket' : 'Keep in Pocket'}</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200 border border-stone-800 hover:bg-stone-800/60 rounded-lg transition-colors flex items-center gap-1.5"
                  title="Copy passage"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Share'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNextFortune}
                  className="px-3.5 py-1.5 text-xs text-stone-300 hover:text-white border border-stone-700/80 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3 text-stone-400" />
                  <span>Next Token</span>
                </button>

                <button
                  onClick={handleRandomDraw}
                  className="px-4 py-1.5 text-xs font-medium text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Random Draw</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
