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
import { RotateCcw } from "lucide-react";

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
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-cyan-300" />
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
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(11,211,211,0.18),transparent_32%),radial-gradient(circle_at_50%_85%,rgba(42,59,143,0.22),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_18%,rgba(0,0,0,0.22))]" />

      <section className="relative h-[100dvh] w-full p-3 sm:p-5">
        <div className="relative h-full w-full touch-none overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:rounded-[2.5rem]">
          <Canvas
            key={`${viewerKey}-${isMobile ? "mobile" : "desktop"}`}
            camera={{
              position: isMobile ? [0, 0.9, 5.8] : [0, 1.15, 4.3],
              fov: isMobile ? 54 : 44,
            }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            dpr={isMobile ? [1, 1.5] : [1, 2]}
          >
            <ambientLight intensity={0.95} />
            <directionalLight position={[4, 7, 5]} intensity={2.6} />
            <directionalLight position={[-4, 2, -5]} intensity={0.8} />
            <spotLight position={[0, 5, 5]} angle={0.35} penumbra={0.7} intensity={1.4} />

            <Suspense fallback={<LoadingFallback />}>
              <Bounds fit clip observe margin={isMobile ? 1.55 : 1.3}>
                <Model url={MODEL_URL} />
              </Bounds>

              <ContactShadows
                position={[0, -1.15, 0]}
                opacity={0.42}
                scale={isMobile ? 6.5 : 9}
                blur={2.8}
                far={3}
              />

              <Environment preset="studio" />
            </Suspense>

            <OrbitControls
              makeDefault
              enableDamping
              dampingFactor={0.08}
              rotateSpeed={isMobile ? 0.45 : 0.6}
              zoomSpeed={isMobile ? 0.55 : 0.75}
              panSpeed={isMobile ? 0.42 : 0.58}
              minDistance={0.7}
              maxDistance={14}
              enablePan
              touches={{ ONE: 0, TWO: 2 }}
            />
          </Canvas>

          <button
            type="button"
            aria-label="Reset view"
            onClick={() => setViewerKey((value) => value + 1)}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white shadow-xl backdrop-blur-md transition active:scale-95 sm:right-6 sm:top-6 sm:h-12 sm:w-12"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/35 to-transparent" />
        </div>
      </section>
    </main>
  );
}

useGLTF.preload(MODEL_URL);
