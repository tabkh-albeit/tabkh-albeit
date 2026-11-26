import { useState } from 'react';
import { Utensils, Leaf, CakeSlice } from 'lucide-react';
import type { DishItem } from '@/src/data/menu';

interface DishMediaProps {
  dish: DishItem;
}

const TONE_CLASSES: Record<DishItem['fallbackTone'], string> = {
  warm: 'from-[#2A2025] to-[#3A2A30]',
  amber: 'from-[#2A221A] to-[#3A2D22]',
  herb: 'from-[#1C2620] to-[#26342B]',
  cocoa: 'from-[#261B1F] to-[#36242A]',
};

export function DishMedia({ dish }: DishMediaProps) {
  const [imgError, setImgError] = useState(false);

  if (dish.image && !imgError) {
    return (
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#2A2025]">
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex w-full aspect-[4/3] flex-col items-center justify-center bg-gradient-to-br ${TONE_CLASSES[dish.fallbackTone]} p-4 text-center`}
      role="img"
      aria-label={dish.name}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#FF8FAB]/40 bg-[#1E1A1E]/90 text-[#FF8FAB]">
        {dish.fallbackMotif === 'salad' ? (
          <Leaf className="h-5 w-5" />
        ) : dish.fallbackMotif === 'dessert' ? (
          <CakeSlice className="h-5 w-5" />
        ) : (
          <Utensils className="h-5 w-5" />
        )}
      </div>
      <span className="mt-2 text-sm font-bold text-white/90">{dish.name}</span>
    </div>
  );
}
