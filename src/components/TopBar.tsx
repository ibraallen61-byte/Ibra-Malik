import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { ambientSound } from '../audio/ambientAudio.ts';

interface TopBarProps {
  onDrawRandomFortune: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  savedCount: number;
  onOpenSaved: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onDrawRandomFortune,
  isAudioPlaying,
  onToggleAudio,
  savedCount,
  onOpenSaved,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0d0f12]/90 border-b border-stone-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in editorial face) */}
        <a
          href="#"
          className="text-xl md:text-2xl font-serif tracking-tight text-[#f5f2eb] hover:text-[#d97706] transition-colors whitespace-nowrap shrink-0"
        >
          Lucky, But Sad
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-400">
          <a
            href="#fortunes"
            className="hover:text-stone-200 transition-colors whitespace-nowrap shrink-0"
          >
            Fortune Reel
          </a>
          <a
            href="#silver-coin"
            className="hover:text-stone-200 transition-colors whitespace-nowrap shrink-0"
          >
            Silver Lining Coin
          </a>
          <a
            href="#soundscape"
            className="hover:text-stone-200 transition-colors whitespace-nowrap shrink-0"
          >
            Ambient Soundscape
          </a>
          <a
            href="#lantern-pond"
            className="hover:text-stone-200 transition-colors whitespace-nowrap shrink-0"
          >
            Lantern Pond
          </a>
          <a
            href="#curiosities"
            className="hover:text-stone-200 transition-colors whitespace-nowrap shrink-0"
          >
            Curiosities
          </a>
        </nav>

        {/* Zone 3: Primary Action & Audio Control */}
        <div className="flex items-center gap-3 shrink-0">
          {savedCount > 0 && (
            <button
              onClick={onOpenSaved}
              className="px-3 py-1.5 text-xs text-stone-300 hover:text-white border border-stone-700/80 rounded-md transition-colors whitespace-nowrap shrink-0"
              title="View saved pocket fortunes"
            >
              Pocket ({savedCount})
            </button>
          )}

          <button
            onClick={onToggleAudio}
            className={`p-2 text-xs border rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              isAudioPlaying
                ? 'bg-stone-800 border-amber-600/40 text-amber-300'
                : 'border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
            title={isAudioPlaying ? 'Mute ambient soundscape' : 'Play ambient rain & piano soundscape'}
            aria-label="Toggle ambient sound"
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAudioPlaying ? 'Soundscape On' : 'Soundscape'}</span>
          </button>

          <button
            onClick={onDrawRandomFortune}
            className="px-4 py-2 text-xs font-medium text-stone-950 bg-[#ede7dc] hover:bg-white rounded-md transition-all active:scale-95 shadow-sm whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Draw Serendipity</span>
          </button>
        </div>
      </div>
    </header>
  );
};
