import React, { useState } from 'react';
import { WONDERS } from '../data/stumbleWonders.ts';
import { WonderItem } from '../types.ts';
import { BookOpen, Sparkles, X, Compass, ExternalLink } from 'lucide-react';

export const SoftRabbitHole: React.FC = () => {
  const [activeWonder, setActiveWonder] = useState<WonderItem | null>(null);

  const handleRandomStumble = () => {
    const randomItem = WONDERS[Math.floor(Math.random() * WONDERS.length)];
    setActiveWonder(randomItem);
  };

  return (
    <section id="curiosities" className="py-20 px-6 lg:px-12 border-b border-stone-800/60 bg-[#0c0e12] relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-500/90 font-sans mb-2">
              The Soft Archive
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#f5f2eb]">
              Curiosities for Tired Minds
            </h2>
            <p className="text-stone-400 text-sm mt-2 max-w-xl font-sans">
              Real-world wonders that prove the cosmos has room for both cold expanse and miraculous, stubborn tenderness.
            </p>
          </div>

          <button
            onClick={handleRandomStumble}
            className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-medium rounded-xl transition-all active:scale-95 flex items-center gap-2 self-start md:self-end"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Take Me Somewhere Soft</span>
          </button>
        </div>

        {/* Curated Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {WONDERS.map((wonder) => (
            <div
              key={wonder.id}
              onClick={() => setActiveWonder(wonder)}
              className="p-8 rounded-2xl bg-stone-900/40 border border-stone-800 hover:border-stone-700 hover:bg-stone-900/70 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-3 font-sans">
                  <span>Archive Dispatch</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{wonder.readTime}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-[#f5f2eb] group-hover:text-amber-300 transition-colors mb-2">
                  {wonder.title}
                </h3>
                <p className="text-xs text-stone-400 font-sans mb-4">
                  {wonder.subtitle}
                </p>
                <p className="text-stone-300 text-sm font-sans line-clamp-3 leading-relaxed">
                  {wonder.story}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs text-amber-400/90 font-sans">
                <span>Read Full Chronicle</span>
                <BookOpen className="w-4 h-4 text-stone-400 group-hover:text-amber-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Reading Modal */}
      {activeWonder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#12151b] border border-stone-700/80 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
            <button
              onClick={() => setActiveWonder(null)}
              className="sticky top-0 float-right -mt-2 -mr-2 p-2 text-stone-400 hover:text-white bg-stone-900/90 rounded-full border border-stone-700 z-10"
              aria-label="Close reading view"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-xs uppercase tracking-widest text-amber-500/90 font-sans mb-2">
              Chronicle of Solace
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-[#f5f2eb] mb-2 leading-tight">
              {activeWonder.title}
            </h3>

            <p className="text-xs text-stone-400 font-sans mb-8 border-b border-stone-800 pb-4">
              {activeWonder.subtitle} · {activeWonder.readTime}
            </p>

            {/* Essay with drop cap */}
            <div className="space-y-4 text-stone-200 font-sans text-sm sm:text-base leading-relaxed">
              {activeWonder.story.split('\n\n').map((paragraph, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-amber-400'
                      : ''
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Why it Matters callout */}
            <div className="mt-8 p-5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-stone-300 text-xs sm:text-sm font-sans leading-relaxed">
              <span className="font-semibold text-amber-300 block mb-1">Why this matters when you feel sad:</span>
              {activeWonder.whyItMatters}
            </div>

            {/* Quote */}
            <blockquote className="mt-6 p-4 rounded-xl bg-stone-900/60 border border-stone-800 text-stone-300 font-serif italic text-sm">
              "{activeWonder.quote}"
            </blockquote>

            <div className="mt-8 pt-6 border-t border-stone-800 flex justify-end">
              <button
                onClick={() => setActiveWonder(null)}
                className="px-5 py-2 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors"
              >
                Return to Sanctuary
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
