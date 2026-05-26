"use client";

import React, { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  useGLTF,
  Bounds,
  useProgress,
  Float,
  Environment, // <-- Brought this back!
} from "@react-three/drei";
import { RotateCcw } from "lucide-react";

const MODEL_URL = "/model.glb";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-slate-600 shadow-[0_0_8px_rgba(0,0,0,0.12)]" />
        <span className="text-xs font-medium tracking-widest text-slate-700">
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
    <main className="relative min-h-[100dvh] overflow-hidden bg-white text-black">

      <section className="relative h-[100dvh] w-full p-3 sm:p-5">
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.1)] sm:rounded-[2.5rem]">
          
          <Canvas
            camera={{ position: cameraPosition, fov: isMobile ? 52 : 45 }}
            gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
            dpr={dpr}
            performance={{ min: 0.35, max: 1 }}
            onCreated={({ gl }) => gl.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))}
          >
            {/* 🌟 BRIGHT MEDICAL STUDIO LIGHTING SETUP 🌟 */}
            
            {/* 1. High ambient light to instantly lift all dark shadows */}
            <ambientLight intensity={1.5} />
            
            {/* 2. Main Key Light (Bright white, hitting from the top front right) */}
            <directionalLight color="#ffffff" position={[10, 10, 10]} intensity={2.5} />
            
            {/* 3. Fill Light (Soft cool light from the opposite side to eliminate black spots) */}
            <directionalLight color="#f0f5ff" position={[-10, 5, -10]} intensity={1.5} />
            
            {/* 4. Bottom Light (Looking under the model won't be dark anymore) */}
            <directionalLight color="#ffffff" position={[0, -10, 0]} intensity={1.0} />

            <Suspense fallback={<Loader />}>
              
              {/* 5. The Environment HDRI - This provides realistic physical reflections */}
              {/* environmentIntensity multiplies the brightness of the reflections */}
              <Environment preset="city" environmentIntensity={1.2} />

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
            </Suspense>

            <OrbitControls
              ref={controlsRef}
              makeDefault
              enableDamping
              dampingFactor={0.04} 
              rotateSpeed={isMobile ? 0.65 : 0.85} 
              enableZoom={true}
              zoomSpeed={isMobile ? 0.8 : 1}
              enablePan={true} 
              panSpeed={isMobile ? 0.8 : 1}
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
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-black/5 text-black shadow transition-all hover:bg-black/10 active:scale-90 sm:right-6 sm:top-6 sm:h-12 sm:w-12 z-10"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

        </div>
      </section>
    </main>
  );
}

useGLTF.preload(MODEL_URL);
