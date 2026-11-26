const BACKDROP_SRC = `${import.meta.env.BASE_URL}assets/aistudio/image_c706811b.png`;

interface ButterflyConfig {
  id: string;
  positionClass: string;
  flightClass: string;
  sizeClass: string;
  opacityClass: string;
  tiltClass: string;
  wingSpeed: 'fast' | 'med' | 'brisk';
}

const BUTTERFLIES: ButterflyConfig[] = [
  // Near large butterflies
  {
    id: 'bf-near-left',
    positionClass: 'top-[13%] left-[19%] sm:left-[23%]',
    flightClass: 'bf-flight-1',
    sizeClass: 'h-10 w-10 sm:h-12 sm:w-12',
    opacityClass: 'opacity-95',
    tiltClass: '-rotate-12',
    wingSpeed: 'fast',
  },
  {
    id: 'bf-near-right',
    positionClass: 'top-[22%] right-[16%] sm:right-[21%]',
    flightClass: 'bf-flight-3',
    sizeClass: 'h-10 w-10 sm:h-11 sm:w-11',
    opacityClass: 'opacity-95',
    tiltClass: 'rotate-12',
    wingSpeed: 'brisk',
  },
  // Medium butterflies
  {
    id: 'bf-mid-center-left',
    positionClass: 'top-[18%] left-[37%]',
    flightClass: 'bf-flight-2',
    sizeClass: 'h-7 w-7 sm:h-8 sm:w-8',
    opacityClass: 'opacity-90',
    tiltClass: 'rotate-6',
    wingSpeed: 'med',
  },
  {
    id: 'bf-mid-center-right',
    positionClass: 'top-[10%] right-[33%]',
    flightClass: 'bf-flight-4',
    sizeClass: 'h-7 w-7 sm:h-9 sm:w-9',
    opacityClass: 'opacity-85',
    tiltClass: '-rotate-6',
    wingSpeed: 'fast',
  },
  {
    id: 'bf-mid-lower',
    positionClass: 'top-[30%] left-[28%]',
    flightClass: 'bf-flight-7',
    sizeClass: 'h-8 w-8',
    opacityClass: 'opacity-85',
    tiltClass: 'rotate-[18deg]',
    wingSpeed: 'brisk',
  },
  // Distant small butterflies
  {
    id: 'bf-far-castle',
    positionClass: 'top-[12%] left-[48%]',
    flightClass: 'bf-flight-5',
    sizeClass: 'h-5 w-5 sm:h-6 sm:w-6',
    opacityClass: 'opacity-75',
    tiltClass: '-rotate-[15deg]',
    wingSpeed: 'fast',
  },
  {
    id: 'bf-far-moon',
    positionClass: 'top-[16%] right-[12%]',
    flightClass: 'bf-flight-6',
    sizeClass: 'h-5 w-5',
    opacityClass: 'opacity-70',
    tiltClass: 'rotate-12',
    wingSpeed: 'med',
  },
  {
    id: 'bf-far-blossom',
    positionClass: 'top-[28%] right-[30%]',
    flightClass: 'bf-flight-8',
    sizeClass: 'h-5 w-5 sm:h-6 sm:w-6',
    opacityClass: 'opacity-75',
    tiltClass: '-rotate-6',
    wingSpeed: 'brisk',
  },
];

function AnimatedButterfly({ butterfly }: { butterfly: ButterflyConfig }) {
  const leftWingClass =
    butterfly.wingSpeed === 'fast'
      ? 'bf-wing-l-fast'
      : butterfly.wingSpeed === 'med'
        ? 'bf-wing-l-med'
        : 'bf-wing-l-brisk';

  const rightWingClass =
    butterfly.wingSpeed === 'fast'
      ? 'bf-wing-r-fast'
      : butterfly.wingSpeed === 'med'
        ? 'bf-wing-r-med'
        : 'bf-wing-r-brisk';

  const gradientId = `wing-grad-${butterfly.id}`;

  return (
    <div className={`pointer-events-none absolute ${butterfly.positionClass}`}>
      <div className={`relative ${butterfly.flightClass} ${butterfly.opacityClass}`}>
        {/* Small golden sparkle trail behind the flying butterfly */}
        <span className="bf-sparkle-a absolute -bottom-1 -left-2.5 h-1.5 w-1.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_2px_rgba(255,215,0,0.95)]" />
        <span className="bf-sparkle-b absolute -bottom-2.5 -left-5 h-1 w-1 rounded-full bg-[#FFF3B0] shadow-[0_0_6px_2px_rgba(255,215,0,0.85)]" />
        <span className="bf-sparkle-c absolute top-1 -left-4 h-1 w-1 rounded-full bg-[#FFD700] shadow-[0_0_6px_1px_rgba(255,215,0,0.8)]" />

        {/* Luminous Pink Butterfly SVG with rapid dual-wing flutter */}
        <svg
          viewBox="0 0 64 64"
          className={`${butterfly.sizeClass} ${butterfly.tiltClass} drop-shadow-[0_0_10px_rgba(255,143,171,0.9)]`}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE3EC" />
              <stop offset="55%" stopColor="#FF8FAB" />
              <stop offset="100%" stopColor="#F472A0" />
            </linearGradient>
          </defs>

          {/* Left Forewing & Hindwing */}
          <g className={leftWingClass}>
            <path
              d="M31 30 C23 14, 6 10, 8 24 C10 34, 22 36, 31 33 Z"
              fill={`url(#${gradientId})`}
              stroke="#FFD700"
              strokeWidth="0.6"
              strokeOpacity="0.65"
            />
            <path
              d="M31 34 C22 35, 11 41, 14 49 C17 56, 28 49, 31 38 Z"
              fill={`url(#${gradientId})`}
              fillOpacity="0.92"
            />
          </g>

          {/* Right Forewing & Hindwing */}
          <g className={rightWingClass}>
            <path
              d="M33 30 C41 14, 58 10, 56 24 C54 34, 42 36, 33 33 Z"
              fill={`url(#${gradientId})`}
              stroke="#FFD700"
              strokeWidth="0.6"
              strokeOpacity="0.65"
            />
            <path
              d="M33 34 C42 35, 53 41, 50 49 C47 56, 36 49, 33 38 Z"
              fill={`url(#${gradientId})`}
              fillOpacity="0.92"
            />
          </g>

          {/* Slender body & golden antennae */}
          <ellipse cx="32" cy="34" rx="1.6" ry="8.5" fill="#FFE6EF" />
          <circle cx="32" cy="24.5" r="1.8" fill="#FFD700" />
          <path
            d="M31.2 23.5 C29 19, 26.5 18, 25 18.5 M32.8 23.5 C35 19, 37.5 18, 39 18.5"
            fill="none"
            stroke="#FFD700"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

export function EnchantedSky() {
  return (
    <>
      {/* Fixed full-viewport enchanted castle backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#121010] select-none"
      >
        <img
          src={BACKDROP_SRC}
          alt=""
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-top"
        />

        {/* Softly drifting atmospheric cloud wisps */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen">
          <div className="cloud-wisp-rose cloud-drift-1 absolute top-[24%] left-[4%] h-40 w-[44vw] min-w-[260px] rounded-full blur-2xl" />
          <div className="cloud-wisp-lavender cloud-drift-2 absolute top-[26%] right-[2%] h-44 w-[46vw] min-w-[280px] rounded-full blur-2xl" />
          <div className="cloud-wisp-warm cloud-drift-3 absolute top-[31%] left-[24%] h-36 w-[52vw] min-w-[300px] rounded-full blur-3xl" />
          <div className="cloud-wisp-rose cloud-drift-4 absolute top-[38%] -left-[6%] h-40 w-[48vw] min-w-[260px] rounded-full blur-3xl" />
          <div className="cloud-wisp-lavender cloud-drift-5 absolute top-[36%] -right-[6%] h-44 w-[50vw] min-w-[280px] rounded-full blur-3xl" />
        </div>

        {/* Animated pink butterflies with golden sparkle trails */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {BUTTERFLIES.map((butterfly) => (
            <AnimatedButterfly key={butterfly.id} butterfly={butterfly} />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#121010]/45 via-[#121010]/15 to-transparent" />
      </div>

      {/* Top viewport showcase frame revealing the castle, moon, and cherry blossoms above the header */}
      <div
        aria-hidden="true"
        className="relative z-10 h-[250px] w-full sm:h-[320px] md:h-[370px]"
      />
    </>
  );
}
