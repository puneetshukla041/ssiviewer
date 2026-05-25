"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  useGLTF,
  Bounds,
  ContactShadows,
} from "@react-three/drei";
import { RotateCcw, ZoomIn, Box } from "lucide-react";

// Your GLB is inside: public/model.glb
// Browser path for public files starts from root.
const MODEL_URL = "/model.glb";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return isMobile;
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="rounded-2xl bg-white/90 px-4 py-2 text-xs font-medium text-slate-700 shadow-lg backdrop-blur sm:px-5 sm:py-3 sm:text-sm">
        Loading 3D model...
      </div>
    </Html>
  );
}

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url);
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  return <primitive object={scene} />;
}

export default function GLBModelViewerPage() {
  const [viewerKey, setViewerKey] = useState(0);
  const isMobile = useIsMobile();

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-slate-950 text-white">
      <section className="mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col px-3 py-3 sm:px-5 sm:py-5 lg:px-8">
        <header className="mb-3 flex shrink-0 flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur sm:mb-4 sm:rounded-3xl sm:p-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-200 sm:px-3 sm:text-xs sm:tracking-[0.18em]">
              <Box className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              3D GLB Viewer
            </div>

            <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
              Surgical Model Preview
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
              Drag to rotate, pinch or scroll to zoom, and drag with two fingers to pan.
            </p>
          </div>

          <button
            onClick={() => setViewerKey((value) => value + 1)}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 active:scale-[0.98] sm:w-auto sm:rounded-2xl"
          >
            <RotateCcw className="h-4 w-4" />
            Reset View
          </button>
        </header>

        <div className="relative h-[calc(100dvh-168px)] min-h-[420px] flex-1 touch-none overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,#1e3a5f_0%,#020617_58%)] shadow-2xl sm:h-[calc(100dvh-178px)] sm:min-h-[520px] sm:rounded-3xl md:h-auto md:min-h-[560px]">
          <Canvas
            key={`${viewerKey}-${isMobile ? "mobile" : "desktop"}`}
            camera={{
              position: isMobile ? [0, 1.1, 5.5] : [0, 1.2, 4],
              fov: isMobile ? 55 : 45,
            }}
            gl={{ antialias: true, alpha: true }}
            dpr={isMobile ? [1, 1.5] : [1, 2]}
          >
            <ambientLight intensity={0.9} />
            <directionalLight position={[4, 6, 5]} intensity={2.2} />
            <directionalLight position={[-3, 2, -4]} intensity={0.7} />

            <Suspense fallback={<LoadingFallback />}>
              <Bounds fit clip observe margin={isMobile ? 1.45 : 1.25}>
                <Model url={MODEL_URL} />
              </Bounds>

              <ContactShadows
                position={[0, -1.15, 0]}
                opacity={0.35}
                scale={isMobile ? 6 : 8}
                blur={2.5}
              />

              <Environment preset="studio" />
            </Suspense>

            <OrbitControls
              makeDefault
              enableDamping
              dampingFactor={0.08}
              rotateSpeed={isMobile ? 0.5 : 0.65}
              zoomSpeed={isMobile ? 0.6 : 0.8}
              panSpeed={isMobile ? 0.45 : 0.6}
              minDistance={0.6}
              maxDistance={14}
              touches={{
                ONE: 0,
                TWO: 2,
              }}
            />
          </Canvas>

          <div className="pointer-events-none absolute bottom-3 left-3 right-3 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-[10px] leading-tight text-slate-200 backdrop-blur sm:bottom-4 sm:left-4 sm:right-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-xs">
            <span>Drag: rotate</span>
            <span>Pinch/scroll: zoom</span>
            <span>Two fingers: pan</span>
            <span className="inline-flex items-center gap-1">
              <ZoomIn className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Auto-fit
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

useGLTF.preload(MODEL_URL);
