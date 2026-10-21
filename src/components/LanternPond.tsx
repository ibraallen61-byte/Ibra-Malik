import React, { useRef, useEffect, useState } from 'react';
import { LanternReflection } from '../types.ts';
import { INITIAL_REFLECTIONS } from '../data/reflections.ts';
import { ambientSound } from '../audio/ambientAudio.ts';
import { Send, Eye, X, Plus, Sparkles } from 'lucide-react';

export const LanternPond: React.FC = () => {
  const [reflections, setReflections] = useState<LanternReflection[]>(() => {
    const saved = localStorage.getItem('pond_reflections');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_REFLECTIONS;
      }
    }
    return INITIAL_REFLECTIONS;
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedReflection, setSelectedReflection] = useState<LanternReflection | null>(null);

  // New lantern form
  const [newThought, setNewThought] = useState<string>('');
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newTone, setNewTone] = useState<'amber' | 'gold' | 'indigo' | 'lotus'>('amber');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas floating lantern particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const lanterns = reflections.map((r, i) => ({
      id: r.id,
      x: 50 + (i * 90) % 700 + Math.random() * 40,
      y: 120 + ((i * 45) % 260) + Math.random() * 20,
      speedX: 0.15 + (i % 3) * 0.08,
      speedY: Math.sin(i) * 0.05,
      radius: 12 + (i % 4) * 2,
      flicker: Math.random() * Math.PI,
      tone: r.tone,
      thought: r.thought,
      author: r.authorOrLocation,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lanterns.forEach((l) => {
        l.x += l.speedX;
        l.y += Math.sin(l.flicker) * 0.15;
        l.flicker += 0.03;

        // Wrap around pond width
        if (l.x > canvas.width + 30) {
          l.x = -30;
          l.y = 80 + Math.random() * 260;
        }

        // Color tone determination
        let glowColor = 'rgba(245, 158, 11, 0.4)';
        let coreColor = '#fbbf24';
        if (l.tone === 'indigo') {
          glowColor = 'rgba(99, 102, 241, 0.4)';
          coreColor = '#818cf8';
        } else if (l.tone === 'lotus') {
          glowColor = 'rgba(244, 114, 182, 0.4)';
          coreColor = '#fbcfe8';
        } else if (l.tone === 'gold') {
          glowColor = 'rgba(234, 179, 8, 0.45)';
          coreColor = '#fef08a';
        }

        const currentRadius = l.radius + Math.sin(l.flicker) * 1.5;

        // Outer ambient glow
        const grad = ctx.createRadialGradient(l.x, l.y, 2, l.x, l.y, currentRadius * 2.5);
        grad.addColorStop(0, glowColor);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(l.x, l.y, currentRadius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Water reflection below
        const reflGrad = ctx.createRadialGradient(l.x, l.y + 16, 1, l.x, l.y + 20, currentRadius * 1.8);
        reflGrad.addColorStop(0, glowColor);
        reflGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = reflGrad;
        ctx.beginPath();
        ctx.ellipse(l.x, l.y + 16, currentRadius * 1.2, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Lantern body (faceted paper polygon)
        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.roundRect(l.x - 7, l.y - 9, 14, 18, 3);
        ctx.fill();

        // Inner glowing candle wick
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(l.x, l.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [reflections]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Pick closest lantern to show
    let closest: LanternReflection | null = null;
    let minDistance = 50;

    reflections.forEach((r, i) => {
      const lx = 50 + (i * 90) % 700;
      const ly = 120 + ((i * 45) % 260);
      const dist = Math.hypot(clickX - lx, clickY - ly);
      if (dist < minDistance) {
        minDistance = dist;
        closest = r;
      }
    });

    if (closest) {
      setSelectedReflection(closest);
      ambientSound.playWaterDrop();
    } else {
      ambientSound.playWaterDrop();
    }
  };

  const handleReleaseLantern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThought.trim()) return;

    const newRefl: LanternReflection = {
      id: `r-${Date.now()}`,
      thought: newThought.trim(),
      authorOrLocation: newAuthor.trim() || 'A Kindred Soul',
      timestamp: 'Just now',
      tone: newTone,
    };

    const updated = [newRefl, ...reflections];
    setReflections(updated);
    try {
      localStorage.setItem('pond_reflections', JSON.stringify(updated));
    } catch {
      // ignore
    }

    ambientSound.playWaterDrop();
    setNewThought('');
    setNewAuthor('');
    setIsModalOpen(false);
  };

  return (
    <section id="lantern-pond" className="py-20 px-6 lg:px-12 border-b border-stone-800/60 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-500/90 font-sans mb-2">
              Shared Catharsis
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#f5f2eb]">
              The Nocturnal Lantern Pond
            </h2>
            <p className="text-stone-400 text-sm mt-2 max-w-xl font-sans">
              Every light drifting across this calm water is a truth whispered by someone who also stood between good fortune and an aching heart. Click any lantern to listen, or release one of your own.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium text-xs rounded-xl transition-all active:scale-95 shadow-md flex items-center gap-2 shrink-0 self-start md:self-end"
          >
            <Plus className="w-4 h-4" />
            <span>Cast Your Lantern</span>
          </button>
        </div>

        {/* The Pond Viewer */}
        <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 shadow-2xl mb-12">
          {/* Base Image */}
          <img
            src="/src/assets/images/sanctuary_lantern_pond_1792558415703.jpg"
            alt="Nocturnal pond with warm glowing lanterns floating on dark water"
            referrerPolicy="no-referrer"
            className="w-full h-[440px] object-cover opacity-75"
          />
          {/* Measured Dark Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-stone-950/40 to-transparent pointer-events-none" />

          {/* Interactive Floating Lantern Canvas */}
          <canvas
            ref={canvasRef}
            width={900}
            height={440}
            onClick={handleCanvasClick}
            className="absolute inset-0 w-full h-full cursor-pointer"
            title="Click lanterns to read thoughts"
          />

          {/* Quiet Overlay Guide */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-400 pointer-events-none">
            <span className="font-serif italic text-stone-300">
              {reflections.length} lanterns adrift on calm midnight waters
            </span>
            <span className="font-mono text-[11px] text-amber-400">CLICK ANY LANTERN TO READ</span>
          </div>
        </div>

        {/* Selected Reflection Card (if clicked on pond) */}
        {selectedReflection && (
          <div className="mb-12 p-6 rounded-2xl bg-stone-900/80 border border-stone-700/80 shadow-xl relative animate-in fade-in">
            <button
              onClick={() => setSelectedReflection(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs text-amber-400 mb-3 font-sans">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Whisper from the Water</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-400">{selectedReflection.authorOrLocation}</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-500 font-mono tabular-nums">{selectedReflection.timestamp}</span>
            </div>
            <p className="text-lg md:text-xl font-serif italic text-stone-100 leading-relaxed">
              "{selectedReflection.thought}"
            </p>
          </div>
        )}

        {/* Curated Grid of Reflections (Card Stream) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reflections.slice(0, 6).map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedReflection(item);
                ambientSound.playWaterDrop();
              }}
              className="p-6 rounded-2xl bg-stone-900/50 border border-stone-800 hover:border-stone-700 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <p className="text-stone-300 text-sm font-sans leading-relaxed mb-6 group-hover:text-stone-100 transition-colors">
                "{item.thought}"
              </p>
              <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-500">
                <span className="text-amber-400/90 font-medium font-serif">{item.authorOrLocation}</span>
                <span className="font-mono tabular-nums">{item.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Cast Your Lantern */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#13161c] border border-stone-700 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-serif text-[#f5f2eb] mb-2">
              Cast a Paper Lantern
            </h3>
            <p className="text-stone-400 text-xs font-sans mb-6">
              Name the lucky thing and name the sorrow. Giving words to the duality sets it gently adrift.
            </p>

            <form onSubmit={handleReleaseLantern} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5 font-sans">
                  Your Bittersweet Reflection
                </label>
                <textarea
                  rows={4}
                  required
                  value={newThought}
                  onChange={(e) => setNewThought(e.target.value)}
                  placeholder="e.g. Found the old letters we wrote during university. We grew apart, but what a miracle that we once loved each other with such clean laughter..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700/80 text-stone-100 text-sm focus:outline-none focus:border-amber-500 placeholder:text-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5 font-sans">
                  Your Signature or Location (Optional)
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Sarah · Seattle or A midnight wanderer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700/80 text-stone-100 text-sm focus:outline-none focus:border-amber-500 placeholder:text-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5 font-sans">
                  Lantern Flame Hue
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'amber', label: 'Amber', color: 'bg-amber-500' },
                    { id: 'gold', label: 'Gold', color: 'bg-yellow-400' },
                    { id: 'indigo', label: 'Indigo', color: 'bg-indigo-400' },
                    { id: 'lotus', label: 'Lotus', color: 'bg-pink-400' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewTone(t.id as 'amber' | 'gold' | 'indigo' | 'lotus')}
                      className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 justify-center transition-all ${
                        newTone === t.id
                          ? 'border-amber-400 bg-stone-800 text-white'
                          : 'border-stone-800 text-stone-400 hover:bg-stone-900'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-400 hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Release to the Water</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
