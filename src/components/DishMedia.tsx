import { useState } from 'react';
import { Utensils, Leaf, CakeSlice } from 'lucide-react';
import type { DishItem } from '@/src/data/menu';

interface DishMediaProps {
  dish: DishItem;
}

const TONE_CLASSES: Record<DishItem['fallbackTone'], string> = {
  warm: 'from-[#281b22] via-[#1a151b] to-[#110f14]',
  amber: 'from-[#282017] via-[#1a1615] to-[#110f14]',
  herb: 'from-[#18231c] via-[#141918] to-[#100f14]',
  cocoa: 'from-[#241a1d] via-[#171317] to-[#100f14]',
};

export function DishMedia({ dish }: DishMediaProps) {
  const [imgError, setImgError] = useState(false);

  if (dish.image && !imgError) {
    return (
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[14px] bg-[#1d1b22]">
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
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex w-full aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-[14px] border border-white/5 bg-gradient-to-br ${TONE_CLASSES[dish.fallbackTone]} p-4 text-center`}
      role="img"
      aria-label={dish.name}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(234,124,162,0.14),transparent_60%)]"
      />
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#ea7ca2]/30 bg-[#141318]/80 text-[#ea7ca2]">
        {dish.fallbackMotif === 'salad' ? (
          <Leaf className="h-5 w-5" />
        ) : dish.fallbackMotif === 'dessert' ? (
          <CakeSlice className="h-5 w-5" />
        ) : (
          <Utensils className="h-5 w-5" />
        )}
      </div>
      <span className="relative z-10 mt-2.5 text-sm font-bold text-white/90">
        {dish.name}
      </span>
      <span className="relative z-10 mt-0.5 text-xs text-[#b8b1c0]">
        {dish.categoryLabel}
      </span>
    </div>
  );
}
