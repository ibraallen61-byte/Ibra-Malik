/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { FortuneDeck } from './components/FortuneDeck.tsx';
import { SilverLiningCoin } from './components/SilverLiningCoin.tsx';
import { AmbientSoundscape } from './components/AmbientSoundscape.tsx';
import { LanternPond } from './components/LanternPond.tsx';
import { SoftRabbitHole } from './components/SoftRabbitHole.tsx';
import { BittersweetBloom } from './components/BittersweetBloom.tsx';
import { PocketDrawer } from './components/PocketDrawer.tsx';
import { Footer } from './components/Footer.tsx';
import { FortuneCard } from './types.ts';
import { FORTUNES } from './data/fortunes.ts';
import { ambientSound } from './audio/ambientAudio.ts';

export default function App() {
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isPocketOpen, setIsPocketOpen] = useState<boolean>(false);
  const [savedFortunes, setSavedFortunes] = useState<FortuneCard[]>(() => {
    try {
      const stored = localStorage.getItem('pocket_fortunes');
      return stored ? JSON.parse(stored) : [FORTUNES[0]];
    } catch {
      return [FORTUNES[0]];
    }
  });

  const handleToggleAudio = async () => {
    if (!isAudioPlaying) {
      const ok = await ambientSound.start();
      if (ok) {
        setIsAudioPlaying(true);
      }
    } else {
      const isMuted = ambientSound.toggleMute();
      setIsAudioPlaying(!isMuted);
    }
  };

  const handleSaveToPocket = (fortune: FortuneCard) => {
    setSavedFortunes((prev) => {
      let updated: FortuneCard[];
      if (prev.some((f) => f.id === fortune.id)) {
        updated = prev.filter((f) => f.id !== fortune.id);
      } else {
        updated = [fortune, ...prev];
      }
      try {
        localStorage.setItem('pocket_fortunes', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleRemoveFromPocket = (id: string) => {
    setSavedFortunes((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem('pocket_fortunes', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#ede7dc] font-sans selection:bg-amber-600/30 selection:text-amber-200">
      {/* 3-Zone Compliant Top Navigation Bar */}
      <TopBar
        onDrawRandomFortune={() => scrollToSection('fortunes')}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        savedCount={savedFortunes.length}
        onOpenSaved={() => setIsPocketOpen(true)}
      />

      <main>
        {/* Hero Section */}
        <HeroSection
          onDrawFortune={() => scrollToSection('fortunes')}
          onExploreSound={() => {
            scrollToSection('soundscape');
            if (!isAudioPlaying) handleToggleAudio();
          }}
          onJumpToCoin={() => scrollToSection('silver-coin')}
          onJumpToLanterns={() => scrollToSection('lantern-pond')}
        />

        {/* Fortune Deck */}
        <FortuneDeck
          onSaveToPocket={handleSaveToPocket}
          savedIds={savedFortunes.map((f) => f.id)}
        />

        {/* The Silver Lining Coin */}
        <SilverLiningCoin />

        {/* Generative Ambient Soundscape Studio */}
        <AmbientSoundscape
          isPlaying={isAudioPlaying}
          onTogglePlay={handleToggleAudio}
        />

        {/* Nocturnal Lantern Pond */}
        <LanternPond />

        {/* Generative Bittersweet Bloom Journal */}
        <BittersweetBloom />

        {/* The Soft Rabbit Hole Curiosities */}
        <SoftRabbitHole />
      </main>

      {/* Pocket Drawer */}
      <PocketDrawer
        isOpen={isPocketOpen}
        onClose={() => setIsPocketOpen(false)}
        savedFortunes={savedFortunes}
        onRemove={handleRemoveFromPocket}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
