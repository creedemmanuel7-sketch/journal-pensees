"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => m.HeroScene),
  { ssr: false, loading: () => <HeroSceneFallback /> },
);

function HeroSceneFallback() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-rose/10 via-transparent to-teal/10" />
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose/20" />
      <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal/10" />
      <div className="absolute bottom-8 right-8 h-16 w-12 rounded-sm bg-bg3/80 shadow-lg shadow-rose/5" />
    </div>
  );
}

function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function HeroSceneWrapper() {
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    setCanRender3D(supportsWebGL());
  }, []);

  if (!canRender3D) return <HeroSceneFallback />;

  return (
    <div className="h-full w-full overflow-hidden">
      <HeroScene />
    </div>
  );
}
