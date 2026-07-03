import type { ReactNode } from 'react';
import { CrystalBackdrop } from './Crystal';

/** Gemeinsames Layout: zentrierte, mobilefreundliche Spalte mit Kristall-Hintergrund. */
export function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh justify-center px-4 py-8">
      <CrystalBackdrop />
      <main className="relative z-10 w-full max-w-md animate-fade-up">{children}</main>
    </div>
  );
}
