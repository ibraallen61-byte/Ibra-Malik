import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sparkles, Droplets, BookOpen } from 'lucide-react';
import { ambientSound } from '../audio/ambientAudio.ts';

interface HeroSectionProps {
  onDrawFortune: () => void;
  onExploreSound: () => void;
  onJumpToCoin: () => void;
  onJumpToLanterns: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onDrawFortune,
  onExploreSound,
  onJumpToCoin,
  onJumpToLanterns,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; r: number; opacity: number }[]>([]);

  // Rain droplet canvas overlay over window image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let localRipples: { x: number; y: number; r: number; opacity: number }[] = [];

    // Periodic gentle rain drop on glass
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        localRipples.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: 2,
          opacity: 0.6,
        });
      }
    }, 600);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      localRipples.forEach((ripple, idx) => {
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217, 119, 6, ${ripple.opacity * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.r * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * 0.3})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ripple.r += 0.4;
        ripple.opacity -= 0.008;

        if (ripple.opacity <= 0) {
          localRipples.splice(idx, 1);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(interval);
    };
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    ambientSound.playWaterDrop();

    // Trigger ripple
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.8)';
      ctx.stroke();
    }
  };

  return (
    <section className="relative pt-8 pb-16 px-6 lg:px-12 border-b border-stone-800/60 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch min-h-[520px]">
          {/* Left Column: Editorial Manifesto & Action */}
          <div className="lg:col-span-7 flex flex-col justify-between py-2">
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-500/90 font-sans mb-4 flex items-center gap-2">
                <span>The Serendipity Sanctuary</span>
                <span aria-hidden="true">·</span>
                <span>Vol. I</span>
                <span aria-hidden="true">·</span>
                <span>For Bittersweet Hours</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#f5f2eb] font-normal leading-[1.12] mb-6 text-balance">
                You are allowed to feel lucky, <br className="hidden sm:inline" />
                <span className="italic text-[#d97706]">and still carry sadness.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 font-sans font-light leading-relaxed max-w-2xl mb-8">
                Sometimes good fortune arrives without erasing what hurt. You found the silver coin on a rain-slicked windowsill; the world continues turning; you are breathing. Here is a place to rest between joy and grief—where unexpected luck and honest melancholy sit quietly at the same warm table.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-stone-800/70">
              <button
                onClick={onDrawFortune}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium text-sm rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-amber-950/20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-stone-900" />
                <span>Draw a Bittersweet Fortune</span>
              </button>

              <button
                onClick={onJumpToCoin}
                className="px-5 py-3.5 bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700/80 text-sm rounded-lg transition-all active:scale-[0.98] flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Flip the Silver Lining</span>
              </button>

              <button
                onClick={onExploreSound}
                className="px-4 py-3.5 text-stone-400 hover:text-stone-200 text-sm transition-colors flex items-center gap-2"
              >
                <Droplets className="w-4 h-4 text-stone-400" />
                <span>Listen to Rain & Vinyl</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual with Interactive Water Ripple Canvas */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900/40 group min-h-[380px] lg:min-h-full">
            <img
              src="/src/assets/images/lucky_melancholy_hero_1792558414833.jpg"
              alt="Rain trickling down window pane with silver lucky coin resting on mahogany sill"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-transparent to-black/20 pointer-events-none" />

            {/* Interactive Ripple Canvas */}
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              onClick={handleCanvasClick}
              className="absolute inset-0 w-full h-full cursor-pointer"
              title="Click the glass to create rain ripples"
            />

            {/* Subtle aesthetic caption */}
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-md bg-stone-950/60 border border-stone-800/60 text-xs text-stone-300 flex items-center justify-between">
              <span className="italic font-serif">"The silver coin on the tavern sill — click to ripple the rain"</span>
              <span className="text-[11px] text-amber-400/80 font-mono tabular-nums">01 / DUALITY</span>
            </div>
          </div>
        </div>

        {/* Operational / Curatorial Ribbon (Constitution 3-4 Column Strip) */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-stone-400">
          <div>
            <span className="text-stone-500 uppercase tracking-wider block text-[11px] mb-1">State of Mind</span>
            <span className="text-stone-200 font-serif text-sm">Bittersweet · Receptive</span>
          </div>
          <div>
            <span className="text-stone-500 uppercase tracking-wider block text-[11px] mb-1">Sanctuary Companions</span>
            <span className="text-stone-200 font-mono tabular-nums text-sm">1,482 Lanterns Adrift</span>
          </div>
          <div>
            <span className="text-stone-500 uppercase tracking-wider block text-[11px] mb-1">Serendipity Odds</span>
            <span className="text-stone-200 font-mono tabular-nums text-sm">100% Worth Surviving</span>
          </div>
          <div>
            <span className="text-stone-500 uppercase tracking-wider block text-[11px] mb-1">Curatorial Note</span>
            <span className="text-stone-200 font-serif text-sm">Rain feeds the deepest roots</span>
          </div>
        </div>
      </div>
    </section>
  );
};
