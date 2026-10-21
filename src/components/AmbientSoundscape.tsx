import React, { useState, useEffect } from 'react';
import { ambientSound } from '../audio/ambientAudio.ts';
import { Play, Pause, Volume2, VolumeX, CloudRain, Disc, Bell, Wind, Sliders } from 'lucide-react';

interface AmbientSoundscapeProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const AmbientSoundscape: React.FC<AmbientSoundscapeProps> = ({ isPlaying, onTogglePlay }) => {
  const [rainVol, setRainVol] = useState<number>(0.5);
  const [vinylVol, setVinylVol] = useState<number>(0.35);
  const [pianoVol, setPianoVol] = useState<number>(0.4);
  const [windVol, setWindVol] = useState<number>(0.25);
  const [activePreset, setActivePreset] = useState<string>('Midnight Cafe');

  // Sync volumes to Web Audio engine whenever sliders change
  useEffect(() => {
    ambientSound.setVolumes(rainVol, vinylVol, pianoVol, windVol);
  }, [rainVol, vinylVol, pianoVol, windVol]);

  const applyPreset = (name: string, rain: number, vinyl: number, piano: number, wind: number) => {
    setActivePreset(name);
    setRainVol(rain);
    setVinylVol(vinyl);
    setPianoVol(piano);
    setWindVol(wind);
    if (!isPlaying) {
      onTogglePlay();
    }
  };

  return (
    <section id="soundscape" className="py-20 px-6 lg:px-12 border-b border-stone-800/60 bg-[#0e1116] relative">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-500/90 font-sans mb-2">
              Auditory Solace
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#f5f2eb]">
              Generative Ambient Soundscape
            </h2>
            <p className="text-stone-400 text-sm mt-2 max-w-xl font-sans">
              No recorded loop files. Every rain droplet, vinyl dust click, and pentatonic piano chord is synthesized in real-time in your browser for genuine calm.
            </p>
          </div>

          {/* Master Play / Mute Switch */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onTogglePlay}
              className={`px-5 py-2.5 rounded-xl font-medium text-xs transition-all active:scale-95 flex items-center gap-2 ${
                isPlaying
                  ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-950/30'
                  : 'bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Soundscape' : 'Immerse in Audio'}</span>
            </button>
          </div>
        </div>

        {/* Mood Presets */}
        <div className="flex items-center gap-2 flex-wrap mb-10">
          <span className="text-xs text-stone-500 font-sans mr-2 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-stone-500" /> Presets:
          </span>
          {[
            { name: 'Midnight Cafe', rain: 0.6, vinyl: 0.45, piano: 0.35, wind: 0.15 },
            { name: 'Porch Rainstorm', rain: 0.85, vinyl: 0.1, piano: 0.1, wind: 0.5 },
            { name: 'Old Library & Hearth', rain: 0.2, vinyl: 0.65, piano: 0.45, wind: 0.05 },
            { name: 'Starry Solitude', rain: 0.05, vinyl: 0.2, piano: 0.6, wind: 0.4 },
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.name, preset.rain, preset.vinyl, preset.piano, preset.wind)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors border ${
                activePreset === preset.name
                  ? 'bg-stone-800 border-amber-600/50 text-amber-300'
                  : 'border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* 4-Channel Mixer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Channel 1: Rain */}
          <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-medium text-stone-200 font-sans">Rain on Window</span>
              </div>
              <span className="text-[11px] font-mono text-stone-500 tabular-nums">
                {Math.round(rainVol * 100)}%
              </span>
            </div>
            <p className="text-xs text-stone-400 font-sans mb-6">
              Lowpass filtered pink noise with random window droplet impacts.
            </p>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={rainVol}
              onChange={(e) => {
                setRainVol(parseFloat(e.target.value));
                setActivePreset('Custom');
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Channel 2: Vinyl */}
          <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Disc className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-medium text-stone-200 font-sans">Vinyl Crackle</span>
              </div>
              <span className="text-[11px] font-mono text-stone-500 tabular-nums">
                {Math.round(vinylVol * 100)}%
              </span>
            </div>
            <p className="text-xs text-stone-400 font-sans mb-6">
              Random impulse bursts simulating an antique needle in the groove.
            </p>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={vinylVol}
              onChange={(e) => {
                setVinylVol(parseFloat(e.target.value));
                setActivePreset('Custom');
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Channel 3: Piano & Chimes */}
          <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-stone-200 font-sans">Nocturnal Notes</span>
              </div>
              <span className="text-[11px] font-mono text-stone-500 tabular-nums">
                {Math.round(pianoVol * 100)}%
              </span>
            </div>
            <p className="text-xs text-stone-400 font-sans mb-6">
              Unpredictable soft pentatonic sine chords with long warm decays.
            </p>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={pianoVol}
              onChange={(e) => {
                setPianoVol(parseFloat(e.target.value));
                setActivePreset('Custom');
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Channel 4: Wind */}
          <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-medium text-stone-200 font-sans">Nocturnal Breeze</span>
              </div>
              <span className="text-[11px] font-mono text-stone-500 tabular-nums">
                {Math.round(windVol * 100)}%
              </span>
            </div>
            <p className="text-xs text-stone-400 font-sans mb-6">
              Sweeping bandpass sub-bass resonance and nocturnal night air.
            </p>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={windVol}
              onChange={(e) => {
                setWindVol(parseFloat(e.target.value));
                setActivePreset('Custom');
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Visual equalizer animation if playing */}
        {isPlaying && (
          <div className="mt-8 flex items-center justify-center gap-1.5 h-6">
            <span className="text-[11px] text-stone-500 font-mono mr-3">AUDIO SYNTH ACTIVE</span>
            {[...Array(16)].map((_, i) => (
              <span
                key={i}
                className="w-1 bg-amber-500/60 rounded-full animate-pulse"
                style={{
                  height: `${Math.max(4, Math.sin(i * 0.8) * 18 + 6)}px`,
                  animationDuration: `${0.8 + (i % 5) * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
