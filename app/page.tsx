"use client";

import React, { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  useGLTF,
  Bounds,
  useProgress,
  Float, 
} from "@react-three/drei";
import { RotateCcw } from "lucide-react";

const MODEL_URL = "/model.glb";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
        <span className="text-xs font-medium tracking-widest text-cyan-100">
          {progress.toFixed(0)}%
        </span>
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
  const controlsRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const dpr: [number, number] = isMobile ? [1, 1.5] : [1, 2];
  const cameraPosition: [number, number, number] = isMobile ? [0, 1.3, 4.5] : [0, 1.5, 5];

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(11,211,211,0.18),transparent_32%),radial-gradient(circle_at_50%_85%,rgba(42,59,143,0.22),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_18%,rgba(0,0,0,0.22))]" />

      <section className="relative h-[100dvh] w-full p-3 sm:p-5">
        {/* REMOVED 'touch-none' so you can actually scroll your webpage again! */}
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:rounded-[2.5rem]">
          
          <Canvas
            camera={{ position: cameraPosition, fov: isMobile ? 52 : 45 }}
            gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
            dpr={dpr}
            performance={{ min: 0.35, max: 1 }}
            onCreated={({ gl }) => gl.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))}
          >
            <ambientLight intensity={0.55} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <directionalLight position={[-5, 5, -5]} intensity={0.6} />
            <hemisphereLight color="#ffffff" groundColor="#151520" intensity={0.35} />
            
            <Suspense fallback={<Loader />}>
              <Bounds fit clip margin={isMobile ? 1.3 : 1.1}>
                <Float
                  speed={isMobile ? 2.5 : 2}
                  rotationIntensity={0.12} 
                  floatIntensity={0.18}
                  floatingRange={[-0.02, 0.02]} 
                >
                  <Model url={MODEL_URL} />
                </Float>
              </Bounds>

              {!isMobile && <Environment preset="studio" />}
            </Suspense>

            {/* FULLY UNLOCKED CONTROLS */}
            <OrbitControls
              ref={controlsRef}
              makeDefault
              enableDamping
              dampingFactor={0.04} // Smooth glide
              rotateSpeed={isMobile ? 0.65 : 0.85} 
              
              // 1. Zoom is enabled (Pinch to zoom)
              enableZoom={true}
              zoomSpeed={isMobile ? 0.8 : 1}
              
              // 2. Pan is enabled (Two fingers to drag the model up/down/left/right)
              enablePan={true} 
              panSpeed={isMobile ? 0.8 : 1}
              
              // 3. Full 360 Vertical View (Look straight down the top, and straight up the bottom)
              minPolarAngle={0} 
              maxPolarAngle={Math.PI} 
              
              autoRotate={true}
              autoRotateSpeed={0.95}
            />
          </Canvas>

          <button
            type="button"
            aria-label="Reset view"
            onClick={handleReset}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white shadow-xl backdrop-blur-md transition-all hover:bg-white/20 active:scale-90 sm:right-6 sm:top-6 sm:h-12 sm:w-12 z-10"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/50 to-transparent z-0" />
        </div>
      </section>
    </main>
  );
}

useGLTF.preload(MODEL_URL);
