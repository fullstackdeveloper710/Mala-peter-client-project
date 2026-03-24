"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRive, useViewModel, useViewModelInstance } from "@rive-app/react-webgl2";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { riveConfig } from "@/data/rive-input-config";

const SEGMENT1_END = 1 / 3;
const SEGMENT2_END = 2 / 3;

const DEBUG_VALUES_THROTTLE_MS = 100;
const isPhilosophyDebug = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";

function sequentialNumberValues(scroll01: number, min: number, max: number): [number, number, number] {
  const p = Math.max(0, Math.min(1, scroll01));
  const range = max - min;
  if (p <= 0) return [min, min, min];

  let v1: number, v2: number, v3: number;
  if (p <= SEGMENT1_END) {
    const t = p / SEGMENT1_END;
    v1 = min + t * range;
    v2 = min;
    v3 = min;
  } else if (p <= SEGMENT2_END) {
    const t = (p - SEGMENT1_END) / (SEGMENT2_END - SEGMENT1_END);
    v1 = max;
    v2 = min + t * range;
    v3 = min;
  } else {
    const t = (p - SEGMENT2_END) / (1 - SEGMENT2_END);
    v1 = max;
    v2 = max;
    v3 = min + t * range;
  }
  return [v1, v2, v3];
}

function buildRiveSrc(fileName: string): string {
  const i = fileName.indexOf("/");
  if (i === -1) return `/rive/${encodeURIComponent(fileName)}`;
  const folder = fileName.slice(0, i);
  const name = fileName.slice(i + 1);
  return `/rive/${folder}/${encodeURIComponent(name)}`;
}

export default function PhilosophyScroll() {
  const latestProgressRef = useRef(0);

  const cfg = riveConfig.philosophy;
  const [progressDisplay, setProgressDisplay] = useState(0);
  const [debugValues, setDebugValues] = useState<[number, number, number] | null>(null);
  const src = useMemo(() => {
    if (!cfg) return null;
    return buildRiveSrc(cfg.fileName);
  }, [cfg]);

  const { rive, RiveComponent } = useRive(
    src && cfg
      ? {
          src,
          artboard: cfg.artboard,
          stateMachines: cfg.stateMachineName,
          autoplay: true,
        }
      : undefined
  );

  const viewModel = useViewModel(
    rive,
    cfg?.viewModelName ? { name: cfg.viewModelName } : undefined
  );
  const viewModelInstance = useViewModelInstance(viewModel, { rive, useDefault: true });

  const number1Ref = useRef<{ value: number } | null>(null);
  const number2Ref = useRef<{ value: number } | null>(null);
  const number3Ref = useRef<{ value: number } | null>(null);

  // Resolve the 3 numeric inputs from the ViewModel
  useEffect(() => {
    if (!viewModelInstance || !cfg) {
      number1Ref.current = null;
      number2Ref.current = null;
      number3Ref.current = null;
      return;
    }

    const [n1, n2, n3] = cfg.numberInputNames;
    try {
      number1Ref.current = viewModelInstance.number(n1) ?? null;
    } catch {
      number1Ref.current = null;
    }
    try {
      number2Ref.current = viewModelInstance.number(n2) ?? null;
    } catch {
      number2Ref.current = null;
    }
    try {
      number3Ref.current = viewModelInstance.number(n3) ?? null;
    } catch {
      number3Ref.current = null;
    }
  }, [viewModelInstance, cfg]);

  // Scroll progress (0..1)
  const sectionRef = useScrollProgress(
    (p) => {
      latestProgressRef.current = p;
      setProgressDisplay(p);
    },
    { smooth: 0, pauseWhenOffScreen: false }
  );

  // Continuously write numbers into the ViewModel so the Rive entry/loop states follow scroll.
  useEffect(() => {
    let rafId: number;
    let lastDebugUpdate = 0;
    const tick = () => {
      const p = latestProgressRef.current;
      const scale = cfg?.progressScale ?? 100;
      const [v1, v2, v3] = sequentialNumberValues(p, 0, scale);

      if (number1Ref.current) number1Ref.current.value = v1;
      if (number2Ref.current) number2Ref.current.value = v2;
      if (number3Ref.current) number3Ref.current.value = v3;

      if (isPhilosophyDebug) {
        const now = Date.now();
        if (now - lastDebugUpdate >= DEBUG_VALUES_THROTTLE_MS) {
          lastDebugUpdate = now;
          setDebugValues([v1, v2, v3]);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [cfg]);

  if (!cfg) return null;

  return (
    <div className="w-full min-h-screen bg-white text-black">
      <div
        ref={sectionRef as React.RefObject<HTMLDivElement>}
        className="relative w-full"
        style={{ height: "1200vh", minHeight: "1200vh" }}
      >
        <div className="sticky top-0 w-full h-screen bg-white">
          {!RiveComponent ? (
            <div className="w-full h-full flex items-center justify-center text-sm">
              Rive loading / failed
            </div>
          ) : (
            <RiveComponent
              className="w-full h-full"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                touchAction: "pan-y",
              }}
            />
          )}
        </div>
      </div>

      {isPhilosophyDebug && (
        <div className="fixed bottom-4 left-4 px-3 py-2 bg-black/70 text-white text-xs font-mono rounded pointer-events-none">
          <div>philosophy scroll: {(progressDisplay * 100).toFixed(1)}%</div>
          {debugValues && (
            <div className="mt-1">
              <div>v1: {debugValues[0].toFixed(1)}</div>
              <div>v2: {debugValues[1].toFixed(1)}</div>
              <div>v3: {debugValues[2].toFixed(1)}</div>
              <div>
                hasVMNumbers:{" "}
                {(number1Ref.current ? "1" : "-") +
                  (number2Ref.current ? "2" : "-") +
                  (number3Ref.current ? "3" : "-")}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

