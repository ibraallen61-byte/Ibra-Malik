import React from 'react';
import { FortuneCard } from '../types.ts';
import { X, Trash2, Sparkles, Bookmark } from 'lucide-react';

interface PocketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedFortunes: FortuneCard[];
  onRemove: (id: string) => void;
}

export const PocketDrawer: React.FC<PocketDrawerProps> = ({
  isOpen,
  onClose,
  savedFortunes,
  onRemove,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#13161c] border-l border-stone-800 h-full p-6 sm:p-8 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500" />
              <h3 className="text-xl font-serif text-[#f5f2eb]">Your Pocket Archive</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-stone-400 font-sans mb-6">
            Tokens of luck and solace you tucked away to carry through the days ahead.
          </p>

          {/* List */}
          {savedFortunes.length === 0 ? (
            <div className="text-center py-16 text-stone-500 text-xs font-sans">
              Your pocket is empty right now. Draw a fortune and click "Keep in Pocket".
            </div>
          ) : (
            <div className="space-y-4 max-h-[68vh] overflow-y-auto pr-1">
              {savedFortunes.map((fortune) => (
                <div
                  key={fortune.id}
                  className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 relative group"
                >
                  <div className="flex items-center justify-between text-[11px] text-amber-500/90 mb-1 font-sans">
                    <span>{fortune.category}</span>
                    <button
                      onClick={() => onRemove(fortune.id)}
                      className="text-stone-500 hover:text-rose-400 transition-colors p-1"
                      title="Remove from pocket"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-base font-serif text-stone-100 mb-2">
                    {fortune.title}
                  </h4>
                  <p className="text-xs text-stone-300 font-sans line-clamp-3 leading-relaxed mb-3">
                    {fortune.narrative}
                  </p>
                  <div className="text-[11px] text-stone-400 italic font-serif border-t border-stone-800/80 pt-2">
                    Token: {fortune.luckyToken}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-xl transition-colors font-sans"
          >
            Close Pocket
          </button>
        </div>
      </div>
    </div>
  );
};
