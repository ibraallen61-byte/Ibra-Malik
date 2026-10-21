import React from 'react';
import { Heart, Compass, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 px-6 lg:px-12 border-t border-stone-800/80 bg-[#090b0e] text-stone-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="text-xl font-serif text-[#f5f2eb] mb-2">
            Lucky, But Sad
          </div>
          <p className="text-xs text-stone-400 font-sans max-w-md leading-relaxed">
            A quiet sanctuary dedicated to anyone standing at the crossroad of good fortune and heavy memory. You are not required to pick one over the other.
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-stone-400">
            <span>Built for quiet hours</span>
            <span aria-hidden="true">·</span>
            <span>Web Audio Real-Time Synth</span>
            <span aria-hidden="true">·</span>
            <span>No algorithms, only human words</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-sans">
          <button
            onClick={scrollToTop}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 rounded-lg transition-colors"
          >
            Return to Top of Sanctuary
          </button>
        </div>
      </div>
    </footer>
  );
};
