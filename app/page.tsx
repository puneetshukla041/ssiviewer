'use client'
import React, { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, useGLTF, Bounds, ContactShadows } from "@react-three/drei";
import { RotateCcw, ZoomIn, Box } from "lucide-react";

// Put your GLB file inside: public/models/810b12ef-f0ec-4295-b565-e2c07a4f48d2.glb
// Then keep this path as it is.
const MODEL_URL = "/model.glb";

function LoadingFallback() {
  return (
    <Html center>
      <div className="rounded-2xl bg-white/90 px-5 py-3 text-sm font-medium text-slate-700 shadow-lg backdrop-blur">
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

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-4 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
              <Box className="h-3.5 w-3.5" />
              3D GLB Viewer
            </div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Surgical Model Preview
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-300">
              Drag to rotate, scroll to zoom, and right-click drag to pan the model.
            </p>
          </div>

          <button
            onClick={() => setViewerKey((value) => value + 1)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            <RotateCcw className="h-4 w-4" />
            Reset View
          </button>
        </header>

        <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,#1e3a5f_0%,#020617_55%)] shadow-2xl">
          <Canvas
            key={viewerKey}
            camera={{ position: [0, 1.2, 4], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.9} />
            <directionalLight position={[4, 6, 5]} intensity={2.2} />
            <directionalLight position={[-3, 2, -4]} intensity={0.7} />

            <Suspense fallback={<LoadingFallback />}>
              <Bounds fit clip observe margin={1.25}>
                <Model url={MODEL_URL} />
              </Bounds>
              <ContactShadows position={[0, -1.15, 0]} opacity={0.35} scale={8} blur={2.5} />
              <Environment preset="studio" />
            </Suspense>

            <OrbitControls
              makeDefault
              enableDamping
              dampingFactor={0.08}
              rotateSpeed={0.65}
              zoomSpeed={0.8}
              panSpeed={0.6}
              minDistance={0.6}
              maxDistance={12}
            />
          </Canvas>

          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-xs text-slate-200 backdrop-blur">
            <span>Left drag: rotate</span>
            <span>Scroll: zoom</span>
            <span>Right drag: pan</span>
            <span className="inline-flex items-center gap-1">
              <ZoomIn className="h-3.5 w-3.5" />
              Auto-fit enabled
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

useGLTF.preload(MODEL_URL);
