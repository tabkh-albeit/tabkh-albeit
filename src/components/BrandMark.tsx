interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = 'w-11 h-8' }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 85"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M36 30 C36 21, 50 21, 50 30"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M70 30 C70 21, 84 21, 84 30"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <ellipse
        cx="26"
        cy="44"
        rx="11"
        ry="7"
        transform="rotate(-18 26 44)"
        fill="#FF8FAB"
      />
      <path
        d="M32 45 C46 62, 74 62, 92 43"
        stroke="#FF8FAB"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M90 36 L98 28 M93 40 L101 32 M96 44 L104 36"
        stroke="#FF8FAB"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
