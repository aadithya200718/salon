'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { artworkSources, type ArtworkName } from '@/lib/dither/types';

const Canvas = dynamic(() => import('./DitherCanvas'), { ssr: false });

export default function DitherArtwork({ name, lazy = false }: { name: ArtworkName; lazy?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(!lazy);
  useEffect(() => {
    if (!lazy || !host.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setActive(true); observer.disconnect(); }
    }, { rootMargin: '350px 0px' });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [lazy]);
  return <div ref={host} className={`dither-artwork dither-${name}`} data-preset={name} data-render={active ? 'loading' : 'deferred'} data-running="false" aria-hidden="true">
    {/* Exact same source is retained for first paint, JavaScript failure and canvas errors. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="dither-fallback" src={artworkSources[name]} alt="" width={1536} height={864} loading={lazy ? 'lazy' : 'eager'} fetchPriority={lazy ? 'low' : 'high'} decoding="async" />
    {active && <Canvas name={name} />}
  </div>;
}
