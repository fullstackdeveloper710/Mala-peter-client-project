"use client";

import { useRive, useStateMachineInput, useViewModel, useViewModelInstance, useViewModelInstanceImage, Layout, Fit, Alignment, EventType, decodeImage } from "@rive-app/react-webgl2";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { riveConfig } from "@/data/rive-input-config";

function buildRiveSrc(fileName: string): string {
  const i = fileName.indexOf("/");
  if (i === -1) return `/rive/${encodeURIComponent(fileName)}`;
  const folder = fileName.slice(0, i);
  const name = fileName.slice(i + 1);
  return `/rive/${folder}/${encodeURIComponent(name)}`;
}

const SEGMENT1_END = 1 / 3;
const SEGMENT2_END = 2 / 3;
const TRIGGER_DELAY_SECONDS = 3.5;
const TRIGGER_MIN_SCROLL = 0.01;

function sequentialNumberValues(
  scroll01: number,
  min: number,
  max: number
): [number, number, number] {
  const p = Math.max(0, Math.min(1, scroll01));
  const range = max - min;
  if (p <= 0) return [min, min, min];
  let v1: number, v2: number, v3: number;
  if (p <= SEGMENT1_END) {
    v1 = min + (p / SEGMENT1_END) * range;
    v2 = min;
    v3 = min;
  } else if (p <= SEGMENT2_END) {
    v1 = max;
    v2 = min + ((p - SEGMENT1_END) / (SEGMENT2_END - SEGMENT1_END)) * range;
    v3 = min;
  } else {
    v1 = max;
    v2 = max;
    v3 = min + ((p - SEGMENT2_END) / (1 - SEGMENT2_END)) * range;
  }
  return [v1, v2, v3];
}

function lastPathSegment(path: string): string {
  const parts = path.trim().split("/").filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1]! : path;
}

type VMWithNested = { viewModel?: (name: string) => unknown };

function getViewModelAtPath(vm: VMWithNested, path: string): { target: VMWithNested; propName: string } | null {
  const pathParts = path.trim().split("/").filter(Boolean);
  const propName = pathParts.pop();
  if (!propName) return null;
  let target: VMWithNested = vm;
  for (const segment of pathParts) {
    const nested =
      target.viewModel?.(segment) ??
      target.viewModel?.(segment.toLowerCase()) ??
      target.viewModel?.(segment.charAt(0).toUpperCase() + segment.slice(1));
    if (!nested || typeof (nested as VMWithNested).viewModel !== "function") break;
    target = nested as VMWithNested;
  }
  return { target, propName };
}

function resolveViewModelNumber(
  vm: VMWithNested & { number: (name: string) => { value: number } | null },
  path: string
): { value: number } | null {
  const resolved = getViewModelAtPath(vm, path);
  return resolved ? (resolved.target as typeof vm).number(resolved.propName) : null;
}

function resolveViewModelTrigger(
  vm: VMWithNested & { trigger: (name: string) => { trigger?: () => void; fire?: () => void } | null },
  path: string
): { trigger?: () => void; fire?: () => void } | null {
  const resolved = getViewModelAtPath(vm, path);
  return resolved ? (resolved.target as typeof vm).trigger(resolved.propName) : null;
}

type RiveTriggerRef = { fire?: () => void; trigger?: () => void } | null;

function fireTrigger(ref: RiveTriggerRef): boolean {
  if (!ref) return false;
  const fn = typeof ref.fire === "function" ? ref.fire : typeof ref.trigger === "function" ? ref.trigger : null;
  if (!fn) return false;
  try { fn.call(ref); return true; } catch { return false; }
}

/** Section2 Rive with click-to-navigate */
function RiveSection2({ src }: { src: string }) {
  const router = useRouter();
  const [eventLog, setEventLog] = useState<string[]>([]);

  const addLog = useCallback((entry: string) => {
    console.log("[Section2]", entry);
    setEventLog((prev) => [entry, ...prev].slice(0, 30));
  }, []);

  const { rive, RiveComponent } = useRive({
    src,
    artboard: riveConfig.section2!.artboard,
    stateMachines: riveConfig.section2!.stateMachineName,
    autoplay: true,
    autoBind: !!riveConfig.section2!.viewModelName,
    shouldDisableRiveListeners: false,
    automaticallyHandleEvents: false,
  });

  useEffect(() => {
    if (!rive) return;

    const time = () => new Date().toLocaleTimeString();

    // Listen to ALL event types
    const onRiveEvent = (e: unknown) => {
      const ev = e as { data?: { name?: string; url?: string; type?: number; properties?: Record<string, unknown> } };
      const name = ev?.data?.name ?? "unknown";
      addLog(`[${time()}] RiveEvent: "${name}" | type: ${ev?.data?.type} | ${JSON.stringify(ev?.data)}`);

      const lower = name.toLowerCase();
      if (lower.includes("philosoph")) router.push("/philosophy");
      else if (lower.includes("exective") || lower.includes("executive")) router.push("/executive");
      else if (lower.includes("member")) router.push("/member");
    };

    const onStateChange = (e: unknown) => {
      const ev = e as { data?: string[] };
      const states = ev?.data ?? [];
      addLog(`[${time()}] StateChange: ${JSON.stringify(states)}`);

      // Navigate based on "_Clicked" state changes
      for (const state of states) {
        const lower = state.toLowerCase();
        if (lower.includes("philosophy") && lower.includes("click")) {
          addLog(`[${time()}] >>> Navigating to /philosophy`);
          router.push("/philosophy");
          return;
        }
        if ((lower.includes("executive") || lower.includes("exective")) && lower.includes("click")) {
          addLog(`[${time()}] >>> Navigating to /executive`);
          router.push("/executive");
          return;
        }
        if (lower.includes("member") && lower.includes("click")) {
          addLog(`[${time()}] >>> Navigating to /member`);
          router.push("/member");
          return;
        }
      }
    };

    const onPlay = () => addLog(`[${time()}] Play`);
    const onPause = () => addLog(`[${time()}] Pause`);
    const onLoop = () => addLog(`[${time()}] Loop`);
    const onStop = () => addLog(`[${time()}] Stop`);
    const onAdvance = () => {}; // too noisy, skip

    rive.on(EventType.RiveEvent, onRiveEvent);
    rive.on(EventType.StateChange, onStateChange);
    rive.on(EventType.Play, onPlay);
    rive.on(EventType.Pause, onPause);
    rive.on(EventType.Loop, onLoop);
    rive.on(EventType.Stop, onStop);

    addLog(`[${time()}] Rive loaded. Listening for all events.`);

    return () => {
      rive.off(EventType.RiveEvent, onRiveEvent);
      rive.off(EventType.StateChange, onStateChange);
      rive.off(EventType.Play, onPlay);
      rive.off(EventType.Pause, onPause);
      rive.off(EventType.Loop, onLoop);
      rive.off(EventType.Stop, onStop);
    };
  }, [rive, addLog, router]);

  return (
    <div className="relative w-full h-screen bg-white">
      <div
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "auto" }}
      >
        <RiveComponent
          className="w-full h-full absolute inset-0"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      {/* Event log debug panel */}
      <div className="absolute bottom-4 left-4 z-50 bg-black/80 text-white p-3 rounded-lg text-xs font-mono max-w-[600px] max-h-[250px] overflow-y-auto pointer-events-auto">
        <div className="text-cyan-400 font-bold mb-1">ALL Rive Events (click items to test):</div>
        {eventLog.length === 0 ? (
          <div className="text-gray-400">Waiting for Rive to load...</div>
        ) : (
          eventLog.map((entry, i) => (
            <div key={i} className={`break-all ${entry.includes("RiveEvent") ? "text-green-300" : entry.includes("StateChange") ? "text-yellow-300" : "text-gray-400"}`}>{entry}</div>
          ))
        )}
      </div>
    </div>
  );
}

/** Rive service card with data-binding text + image support */
function RiveServiceCard({
  src,
  stateMachineName,
  artboard,
  viewModelName,
  text1,
  num1,
  imageSrc,
}: {
  src: string;
  stateMachineName: string;
  artboard?: string;
  viewModelName?: string;
  text1?: string;
  num1?: string;
  imageSrc?: string;
}) {
  const imageSrcRef = useRef(imageSrc);
  imageSrcRef.current = imageSrc;

  const assetLoader = useCallback((asset: { isImage: boolean; name: string; decode: (bytes: Uint8Array) => void }, bytes: Uint8Array) => {
    if (asset.isImage && imageSrcRef.current) {
      // Copy default bytes immediately before Rive frees them
      const defaultBytesCopy = new Uint8Array(bytes);
      const customSrc = imageSrcRef.current;

      // Decode default to get target dimensions, then resize custom image to match
      const defaultBlob = new Blob([defaultBytesCopy]);
      const defaultUrl = URL.createObjectURL(defaultBlob);
      const defaultImg = new window.Image();
      defaultImg.onload = () => {
        const targetW = defaultImg.naturalWidth;
        const targetH = defaultImg.naturalHeight;
        URL.revokeObjectURL(defaultUrl);

        const customImg = new window.Image();
        customImg.crossOrigin = "anonymous";
        customImg.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext("2d")!;
          // Fit to height, center horizontally
          const scale = targetH / customImg.naturalHeight;
          const w = customImg.naturalWidth * scale;
          ctx.drawImage(customImg, (targetW - w) / 2, 0, w, targetH);
          canvas.toBlob((blob) => {
            if (!blob) return;
            blob.arrayBuffer().then((buf) => {
              asset.decode(new Uint8Array(buf));
            });
          }, "image/png");
        };
        customImg.src = customSrc;
      };
      defaultImg.src = defaultUrl;
      return true;
    }
    return false;
  }, []);

  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    stateMachines: stateMachineName,
    autoplay: true,
    autoBind: !!viewModelName,
    shouldDisableRiveListeners: false,
    assetLoader: assetLoader as never,
  });

  const viewModel = useViewModel(
    rive,
    viewModelName ? { name: viewModelName } : undefined
  );
  const viewModelInstance = useViewModelInstance(viewModel, { rive, useDefault: true });

  // Set text via data binding
  useEffect(() => {
    if (!viewModelInstance) return;
    const vm = viewModelInstance as VMWithNested & {
      string?: (name: string) => { value: string } | null;
    };
    try {
      if (text1 && typeof vm.string === "function") {
        const prop = vm.string("text1");
        if (prop) prop.value = text1;
      }
      if (num1 && typeof vm.string === "function") {
        const prop = vm.string("num1");
        if (prop) prop.value = num1;
      }
    } catch {
      // binding not available
    }
  }, [viewModelInstance, text1, num1]);

  return (
    <div className="flex-1 overflow-hidden relative" style={{ height: 375 }}>
      <div
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "auto" }}
      >
        <RiveComponent
          className="w-full h-full absolute inset-0"
        />
      </div>
    </div>
  );
}

function ServiceSection() {
  const section3Src = useMemo(
    () => (riveConfig.section3 ? buildRiveSrc(riveConfig.section3.fileName) : null),
    []
  );

  if (!section3Src || !riveConfig.section3) return null;

  const cfg = riveConfig.section3;

  return (
    <div
      className="w-full relative flex flex-col items-center"
      style={{ color: "#fff", fontFamily: "Syncopate, sans-serif" }}
    >
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <source src="/rive/peterpan/250129_PP_water surface_06 (3).webm" type="video/webm" />
      </video>
      {/* Title */}
      <div
        className="relative z-[1] flex flex-col items-start"
        style={{ padding: "100px 50px 75px" }}
      >
        <div style={{ fontSize: "clamp(80px, 18vw, 268px)", lineHeight: 0.8 }}>SERVICE</div>
        <div
          style={{
            fontFamily: "'Zen Kaku Gothic New', sans-serif",
            fontSize: 24,
            fontWeight: 500,
            lineHeight: 1,
          }}
        >
          サービス
        </div>
      </div>
      {/* Cards in white bg container */}
      <div
        className="self-stretch relative z-[1] bg-white flex items-center justify-center gap-5"
        style={{ padding: "0 50px 0", margin: "0 50px 100px" }}
      >
        <RiveServiceCard
          src={section3Src}
          stateMachineName={cfg.stateMachineName}
          artboard={cfg.artboard}
          viewModelName={cfg.viewModelName}
          text1="人材紹介"
          num1="01"
          imageSrc="/書き出し画像/top/WebP/service01.webp"
        />
        <RiveServiceCard
          src={section3Src}
          stateMachineName={cfg.stateMachineName}
          artboard={cfg.artboard}
          viewModelName={cfg.viewModelName}
          text1="キャリア支援"
          num1="02"
          imageSrc="/書き出し画像/top/WebP/service02.webp"
        />
        <RiveServiceCard
          src={section3Src}
          stateMachineName={cfg.stateMachineName}
          artboard={cfg.artboard}
          viewModelName={cfg.viewModelName}
          text1="求人プラットフォーム"
          num1="03"
          imageSrc="/書き出し画像/top/WebP/service03.webp"
        />
      </div>
    </div>
  );
}

export default function TestPage() {
  const mainSrc = useMemo(() => buildRiveSrc(riveConfig.main.fileName), []);
  const spacerHeight = "1200vh";

  const paths = riveConfig.main.dataBindingNumberPaths;
  const sequentialMode = paths && paths.length >= 3;
  const numberInputMin = riveConfig.main.numberInputMin ?? 0;
  const numberInputMax = riveConfig.main.numberInputMax ?? riveConfig.main.progressScale;

  const latestProgressRef = useRef(0);
  const numberInputRef = useRef<{ value: number } | null>(null);
  const numberInputRefs = useRef<({ value: number } | null)[]>([null, null, null]);
  const triggerInputRef = useRef<RiveTriggerRef>(null);
  const [mainOpacity, setMainOpacity] = useState(1);
  const [trigger1Fired, setTrigger1Fired] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const firstSegmentCompletedRef = useRef(false);

  // Full-width: scale to match container width, height adjusts naturally
  const riveLayout = useMemo(
    () => new Layout({ fit: Fit.FitWidth, alignment: Alignment.TopCenter }),
    []
  );

  const { rive, RiveComponent } = useRive({
    src: mainSrc,
    artboard: riveConfig.main.artboard,
    stateMachines: riveConfig.main.stateMachineName,
    autoplay: true,
    autoBind: true,
    shouldDisableRiveListeners: true,
    layout: riveLayout,
  });

  const viewModel = useViewModel(
    rive,
    riveConfig.main.viewModelName ? { name: riveConfig.main.viewModelName } : undefined
  );
  const viewModelInstance = useViewModelInstance(viewModel, { rive, useDefault: true });

  const pathList = paths ?? [riveConfig.main.dataBindingNumberPath];
  const mainNumberInputName = riveConfig.main.numberInputName ?? lastPathSegment(riveConfig.main.dataBindingNumberPath);
  const inputName1 = pathList[0] ? lastPathSegment(pathList[0]) : mainNumberInputName;
  const inputName2 = pathList[1] ? lastPathSegment(pathList[1]) : inputName1;
  const inputName3 = pathList[2] ? lastPathSegment(pathList[2]) : inputName1;
  const mainTriggerInputName = riveConfig.main.triggerInputName ?? lastPathSegment(riveConfig.main.dataBindingTriggerPath ?? "trigger_1");
  const mainTriggerPath = riveConfig.main.dataBindingTriggerPath ?? mainTriggerInputName;

  const numberInputSM = useStateMachineInput(rive, riveConfig.main.stateMachineName, mainNumberInputName);
  const numberInputSM2 = useStateMachineInput(rive, riveConfig.main.stateMachineName, inputName2);
  const numberInputSM3 = useStateMachineInput(rive, riveConfig.main.stateMachineName, inputName3);
  const triggerInputSM = useStateMachineInput(rive, riveConfig.main.stateMachineName, mainTriggerInputName);

  // Bind number inputs
  useEffect(() => {
    const pathList = riveConfig.main.dataBindingNumberPaths ?? [riveConfig.main.dataBindingNumberPath];
    const smInputs = [numberInputSM, numberInputSM2, numberInputSM3];
    const vm = viewModelInstance as Parameters<typeof resolveViewModelNumber>[0] | null;

    if (sequentialMode && pathList.length >= 3) {
      for (let i = 0; i < 3; i++) {
        const sm = smInputs[i];
        if (sm) {
          numberInputRefs.current[i] = sm as unknown as { value: number };
        } else if (rive && vm) {
          try { numberInputRefs.current[i] = resolveViewModelNumber(vm, pathList[i]!) ?? null; } catch { numberInputRefs.current[i] = null; }
        } else {
          numberInputRefs.current[i] = null;
        }
      }
      numberInputRef.current = numberInputRefs.current[0];
    } else {
      const path = pathList[0] ?? riveConfig.main.dataBindingNumberPath;
      if (numberInputSM) {
        numberInputRef.current = numberInputSM as unknown as { value: number };
        return;
      }
      if (!rive || !vm) { numberInputRef.current = null; return; }
      try { numberInputRef.current = resolveViewModelNumber(vm, path); } catch { numberInputRef.current = null; }
    }
  }, [numberInputSM, numberInputSM2, numberInputSM3, rive, viewModelInstance, sequentialMode]);

  // Bind trigger
  useEffect(() => {
    if (triggerInputSM) {
      triggerInputRef.current = triggerInputSM as unknown as RiveTriggerRef;
      return;
    }
    if (!rive || !viewModelInstance) { triggerInputRef.current = null; return; }
    try {
      const prop = resolveViewModelTrigger(viewModelInstance as Parameters<typeof resolveViewModelTrigger>[0], mainTriggerPath);
      triggerInputRef.current = prop;
    } catch { triggerInputRef.current = null; }
  }, [triggerInputSM, rive, viewModelInstance, mainTriggerPath]);

  // Pause/play based on opacity
  useEffect(() => {
    if (!rive) return;
    if (mainOpacity < 0.01) rive.pause();
    else if (!rive.isPlaying) rive.play(riveConfig.main.stateMachineName);
  }, [rive, mainOpacity]);

  // RAF loop
  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const rawP = latestProgressRef.current;
      const now = Date.now();

      if (sequentialMode) {
        const [v1, v2, v3] = sequentialNumberValues(rawP, numberInputMin, numberInputMax);
        const refs = numberInputRefs.current;
        if (refs[2]) refs[2].value = v3;
        if (refs[1]) refs[1].value = v2;
        if (refs[0]) refs[0].value = v1;
      } else {
        const value = rawP * riveConfig.main.progressScale;
        const input = numberInputRef.current;
        if (input) input.value = value;
      }

      if (mainOpacity >= 0.01) {
        const elapsed = (now - startTimeRef.current) / 1000;
        if (
          !trigger1Fired &&
          elapsed > TRIGGER_DELAY_SECONDS &&
          rawP > TRIGGER_MIN_SCROLL &&
          fireTrigger(triggerInputRef.current)
        ) {
          setTrigger1Fired(true);
        }
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [mainOpacity, trigger1Fired, sequentialMode, numberInputMin, numberInputMax]);

  // Scroll progress
  const sectionRef = useScrollProgress(
    (p) => {
      if (p >= SEGMENT1_END && !firstSegmentCompletedRef.current) {
        firstSegmentCompletedRef.current = true;
      }
      const effective = sequentialMode && !firstSegmentCompletedRef.current ? Math.min(p, SEGMENT1_END) : p;
      latestProgressRef.current = effective;
      setMainOpacity(1);
    },
    { smooth: 0, pauseWhenOffScreen: false }
  );

  const section2Src = useMemo(
    () => (riveConfig.section2 ? buildRiveSrc(riveConfig.section2.fileName) : null),
    []
  );

  return (
    <div className="w-full">
      {/* Label */}
      <div className="fixed top-4 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-mono">
        TEST PAGE - Section2 click navigation
      </div>

      {/* Main Rive animation section */}
      <div
        ref={sectionRef as React.RefObject<HTMLDivElement>}
        className="relative w-full"
        style={{ height: spacerHeight, minHeight: spacerHeight }}
      >
        <div
          className="sticky top-0 w-full h-screen pointer-events-none bg-white"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        >
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              opacity: mainOpacity,
              pointerEvents: mainOpacity > 0.1 ? "auto" : "none",
              visibility: mainOpacity > 0 ? "visible" : "hidden",
              willChange: "opacity",
              contain: "layout style paint",
            }}
          >
            <RiveComponent
              className="w-full h-full absolute inset-0"
              style={{ touchAction: "pan-y" }}
            />
          </div>

          {!rive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white/70 text-sm">
              読み込み中…
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Philosophy / Executive / Member with click navigation */}
      {section2Src && riveConfig.section2 && (
        <RiveSection2 src={section2Src} />
      )}

      {/* SERVICE section with static cards */}
      <ServiceSection />

      {/* Spacer so you can see it ends */}
      <div className="w-full bg-gray-100 flex items-center justify-center" style={{ height: "50vh" }}>
        <p className="text-2xl text-gray-500">End of test page</p>
      </div>
    </div>
  );
}
