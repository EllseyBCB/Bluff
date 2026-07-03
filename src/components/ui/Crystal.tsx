/** Kleines Kristall-SVG als wiederkehrendes Deko-Element. */
export function Crystal({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2 L18 8 L12 22 L6 8 Z" fill="url(#crystalGrad)" stroke="#b394ff" strokeWidth="1" />
      <path d="M12 2 L12 22 M6 8 L18 8" stroke="#efe8ff" strokeWidth="0.6" opacity="0.7" />
      <defs>
        <linearGradient id="crystalGrad" x1="6" y1="2" x2="18" y2="22">
          <stop offset="0%" stopColor="#7ef3e1" />
          <stop offset="55%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#3d2480" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Schwebende Hintergrund-Kristalle für Stimmung auf jedem Screen. */
export function CrystalBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <Crystal className="absolute left-[8%] top-[12%] h-10 w-10 opacity-20 animate-float-slow" />
      <Crystal className="absolute right-[10%] top-[28%] h-6 w-6 opacity-15 animate-float-slow [animation-delay:1.5s]" />
      <Crystal className="absolute left-[15%] bottom-[18%] h-8 w-8 opacity-15 animate-float-slow [animation-delay:3s]" />
      <Crystal className="absolute right-[18%] bottom-[8%] h-12 w-12 opacity-10 animate-float-slow [animation-delay:2s]" />
      <span className="absolute left-[30%] top-[8%] h-1.5 w-1.5 rounded-full bg-crystal opacity-40 animate-sparkle" />
      <span className="absolute right-[25%] top-[15%] h-1 w-1 rounded-full bg-wiz-300 opacity-40 animate-sparkle [animation-delay:0.8s]" />
      <span className="absolute left-[60%] bottom-[20%] h-1.5 w-1.5 rounded-full bg-wiz-300 opacity-40 animate-sparkle [animation-delay:1.6s]" />
    </div>
  );
}
