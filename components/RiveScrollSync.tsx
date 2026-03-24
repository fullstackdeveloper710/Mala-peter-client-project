"use client";

import { useRive, useStateMachineInput, useViewModel, useViewModelInstance, Layout, Fit, Alignment, EventType } from "@rive-app/react-webgl2";
import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useScrollProgress, UseScrollProgressOptions } from "@/hooks/useScrollProgress";
import { riveConfig } from "@/data/rive-input-config";
import { RiveDataBindingOverlay } from "@/components/rive";
import VideoFilledText from "@/components/VideoFilledText";
import type { ColumnItem } from "@/lib/microcms";

function buildRiveSrc(fileName: string): string {
  const i = fileName.indexOf("/");
  if (i === -1) return `/rive/${encodeURIComponent(fileName)}`;
  const folder = fileName.slice(0, i);
  const name = fileName.slice(i + 1);
  return `/rive/${folder}/${encodeURIComponent(name)}`;
}

const DEBUG_THROTTLE_MS = 100;
const PROGRESS_THROTTLE_MS = 50;
const TRIGGER_DELAY_SECONDS = 3.5;
const TRIGGER_MIN_SCROLL = 0.01;

const SEGMENT1_END = 1 / 3;
const SEGMENT2_END = 2 / 3;

/** スクロール 0〜1 を3段階に分け、各 number を min〜max の範囲で順にした値を返す */
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
  try {
    fn.call(ref);
    return true;
  } catch {
    return false;
  }
}

/** Section2: Philosophy / Executive / Member with click-to-navigate */
function RiveSection2Nav({
  src,
  stateMachineName,
  artboard,
  autoBind = false,
  wrapperStyle,
  canvasStyle,
}: {
  src: string;
  stateMachineName: string;
  artboard?: string;
  autoBind?: boolean;
  wrapperStyle?: React.CSSProperties;
  canvasStyle?: React.CSSProperties;
}) {
  const router = useRouter();

  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    stateMachines: stateMachineName,
    autoplay: true,
    autoBind,
    shouldDisableRiveListeners: false,
    automaticallyHandleEvents: false,
  });

  useEffect(() => {
    if (!rive) return;

    const onStateChange = (e: unknown) => {
      const ev = e as { data?: string[] };
      const states = ev?.data ?? [];
      for (const state of states) {
        const lower = state.toLowerCase();
        if (lower.includes("philosophy") && lower.includes("click")) {
          router.push("/philosophy");
          return;
        }
        if ((lower.includes("executive") || lower.includes("exective")) && lower.includes("click")) {
          router.push("/executive");
          return;
        }
        if (lower.includes("member") && lower.includes("click")) {
          router.push("/member");
          return;
        }
      }
    };

    rive.on(EventType.StateChange, onStateChange);
    return () => { rive.off(EventType.StateChange, onStateChange); };
  }, [rive, router]);

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !canvasStyle) return;
    const canvas = canvasRef.current.querySelector("canvas");
    if (canvas) {
      Object.assign(canvas.style, Object.fromEntries(
        Object.entries(canvasStyle).map(([k, v]) => [k, typeof v === "number" ? `${v}px` : v])
      ));
    }
  }, [canvasStyle, rive]);

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "auto", ...wrapperStyle }}
    >
      <div ref={canvasRef} className="w-full h-full absolute inset-0">
        <RiveComponent
          className="w-full h-full"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
    </div>
  );
}

/** Static service card matching Figma layout */
function ServiceCard({
  label,
  num,
  imageSrc,
  href,
}: {
  label: string;
  num: string;
  imageSrc: string;
  href?: string;
}) {
  const buttonRiveSrc = useMemo(() => buildRiveSrc("peterpan/button.riv"), []);
  const { RiveComponent: ButtonRive } = useRive({
    src: buttonRiveSrc,
    autoplay: true,
    shouldDisableRiveListeners: false,
  });

  const router = useRouter();

  return (
    <a
      href={href}
      onClick={(e) => { if (href) { e.preventDefault(); router.push(href); } }}
      className="flex-1 relative bg-white overflow-hidden flex flex-col items-center isolate no-underline"
      style={{ border: "1px solid #000", cursor: href ? "pointer" : "default" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={label}
        className="self-stretch object-cover z-[0] h-[200px] md:h-[375px]"
      />
      <div
        className="self-stretch flex items-center justify-between py-0 pl-2.5 pr-0 gap-5 z-[1]"
        style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: 25, color: "#004345" }}
      >
        <div className="relative" style={{ lineHeight: "36px" }}>{label}</div>
        <div style={{ width: 40, height: 40 }}>
          <ButtonRive className="w-full h-full" />
        </div>
      </div>
      <div
        className="absolute left-0 z-[2]"
        style={{ top: 15, fontSize: 100, lineHeight: "36px", fontFamily: "Syncopate, sans-serif", color: "#fff" }}
      >
        {num}
      </div>
    </a>
  );
}

/** Rive ボタンアイコン（button.riv） */
function RiveButtonIcon({ width = 40, height = 40 }: { width?: number, height?: number }) {
  const buttonRiveSrc = useMemo(() => buildRiveSrc("peterpan/button.riv"), []);
  const { RiveComponent: ButtonRive } = useRive({
    src: buttonRiveSrc,
    autoplay: true,
    shouldDisableRiveListeners: false,
  });
  return (
    <div style={{ width: width, height: height }}>
      <ButtonRive className="w-full h-full" />
    </div>
  );
}


/** Column card showing thumbnail, title, date from microCMS */
function ColumnCard({ item }: { item: ColumnItem }) {
  const buttonRiveSrc = useMemo(() => buildRiveSrc("peterpan/button.riv"), []);
  const buttonRef = useRef<HTMLDivElement>(null);
  const { RiveComponent: ButtonRive } = useRive({
    src: buttonRiveSrc,
    artboard: "Box_Cursor",
    stateMachines: "Box_Cursor_SM",
    autoplay: true,
    autoBind: true,
    shouldDisableRiveListeners: false,
  });
  const fireRiveClick = () => {
    const canvas = buttonRef.current?.querySelector("canvas");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const opts: PointerEventInit = { clientX: cx, clientY: cy, bubbles: true, pointerId: 1, pointerType: "mouse", isPrimary: true };
    canvas.dispatchEvent(new PointerEvent("pointerdown", opts));
    requestAnimationFrame(() => {
      canvas.dispatchEvent(new PointerEvent("pointerup", opts));
    });
  };
  const router = useRouter();
  const date = new Date(item.publishedAt);
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

  const onCardClick = (e: React.MouseEvent) => {
    // If clicked directly on the canvas, Rive handles animation natively; just navigate
    if ((e.target as HTMLElement).tagName !== "CANVAS") {
      fireRiveClick();
    }
    setTimeout(() => router.push(`/column/${item.id}`), 300);
  };

  return (
    <div
      className="flex-1 flex flex-col bg-white overflow-hidden relative cursor-pointer"
      onClick={onCardClick}
    >
      <div className="w-full" style={{ padding: "6%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.thumbnail.url}
          alt={item.title}
          className="w-full object-cover rounded"
          style={{ aspectRatio: "16/9",
            borderRadius: "0",
            clipPath: "polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px"
           }}
        />
        <img src="/arrow_2.svg" alt="" className="shrink-0 pt-1" style={{ width: 17, height: 17 }} />
      </div>
      <div className="flex flex-col gap-2 py-3 px-3" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#000" }}>
        <p className="text-sm leading-snug line-clamp-3 m-0 break-words" style={{ color: "#333" }}>
          {item.title}
        </p>
        <div className="flex items-center justify-between pr-2">
          <span className="text-xs" style={{ color: "#666" }}>{dateStr}</span>
          <div ref={buttonRef} className="relative" style={{ width: 30, height: 30 }}>
            <ButtonRive className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

type RiveScrollSyncProps = {
  demoMode?: boolean;
  scrollOptions?: UseScrollProgressOptions;
  spacerHeight?: number | string;
  debug?: boolean;
  columns?: ColumnItem[];
};

// デバッグ表示の制御（環境変数で設定）
const isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";

export function RiveScrollSync({
  demoMode = false,
  scrollOptions = {},
  spacerHeight = "1200vh",
  debug = false,
  columns = [],
}: RiveScrollSyncProps) {
  const showDebug = debug && isDebugEnabled;
  const mainSrc = useMemo(() => buildRiveSrc(riveConfig.main.fileName), []);
  const section2Src = useMemo(
    () => (riveConfig.section2 ? buildRiveSrc(riveConfig.section2.fileName) : null),
    []
  );

  const overlay7Src = useMemo(
    () => (riveConfig.overlay7 ? buildRiveSrc(riveConfig.overlay7.fileName) : null),
    []
  );

  // overlay7 のソースが正しく設定されているかを一度だけログに出す
  // eslint-disable-next-line no-console
  //console.log("[RiveScrollSync] overlay7Src:", overlay7Src, "overlay7:", riveConfig.overlay7);

  const paths = riveConfig.main.dataBindingNumberPaths;
  const sequentialMode = paths && paths.length >= 3;
  const numberInputMin = riveConfig.main.numberInputMin ?? 0;
  const numberInputMax = riveConfig.main.numberInputMax ?? riveConfig.main.progressScale;

  const latestProgressRef = useRef(0);
  const numberInputRef = useRef<{ value: number } | null>(null);
  const numberInputRefs = useRef<({ value: number } | null)[]>([null, null, null]);
  const triggerInputRef = useRef<RiveTriggerRef>(null);
  const [hasNumberInput, setHasNumberInput] = useState(false);
  const [hasTriggerInput, setHasTriggerInput] = useState(false);
  const [progressDisplay, setProgressDisplay] = useState(0);
  const [numberInputValue, setNumberInputValue] = useState<number | null>(null);
  const [sequentialValues, setSequentialValues] = useState<[number, number, number]>([0, 0, 0]);
  const [mainOpacity, setMainOpacity] = useState(1);
  const [trigger1Fired, setTrigger1Fired] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [debugTriggerInfo, setDebugTriggerInfo] = useState<string>("");
  const startTimeRef = useRef<number>(Date.now());
  const firstSegmentCompletedRef = useRef(false);
  const [firstSegmentCompleted, setFirstSegmentCompleted] = useState(false);

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
  const mainNumberInputName =
    riveConfig.main.numberInputName ?? lastPathSegment(riveConfig.main.dataBindingNumberPath);
  const inputName1 = pathList[0] ? lastPathSegment(pathList[0]) : mainNumberInputName;
  const inputName2 = pathList[1] ? lastPathSegment(pathList[1]) : inputName1;
  const inputName3 = pathList[2] ? lastPathSegment(pathList[2]) : inputName1;
  const mainTriggerInputName =
    riveConfig.main.triggerInputName ??
    lastPathSegment(riveConfig.main.dataBindingTriggerPath ?? "trigger_1");
  const mainTriggerPath =
    riveConfig.main.dataBindingTriggerPath ?? mainTriggerInputName;

  const numberInputSM = useStateMachineInput(
    rive,
    riveConfig.main.stateMachineName,
    mainNumberInputName
  );
  const numberInputSM2 = useStateMachineInput(
    rive,
    riveConfig.main.stateMachineName,
    inputName2
  );
  const numberInputSM3 = useStateMachineInput(
    rive,
    riveConfig.main.stateMachineName,
    inputName3
  );
  const triggerInputSM = useStateMachineInput(
    rive,
    riveConfig.main.stateMachineName,
    mainTriggerInputName
  );

  useEffect(() => {
    if (!rive || !showDebug) return;
    try {
      const sm = (rive as { stateMachines?: Array<{ inputs?: unknown }> }).stateMachines?.[0];
      console.log("[RiveDebug] State machine inputs:", sm?.inputs);
    } catch {
      // ignore
    }
  }, [rive, showDebug]);

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
          try {
            numberInputRefs.current[i] = resolveViewModelNumber(vm, pathList[i]!) ?? null;
          } catch {
            numberInputRefs.current[i] = null;
          }
        } else {
          numberInputRefs.current[i] = null;
        }
      }
      numberInputRef.current = numberInputRefs.current[0];
      setHasNumberInput(numberInputRefs.current.some(Boolean));
    } else {
      const path = pathList[0] ?? riveConfig.main.dataBindingNumberPath;
      if (numberInputSM) {
        numberInputRef.current = numberInputSM as unknown as { value: number };
        setHasNumberInput(true);
        return;
      }
      if (!rive || !vm) {
        numberInputRef.current = null;
        setHasNumberInput(false);
        return;
      }
      try {
        const prop = resolveViewModelNumber(vm, path);
        numberInputRef.current = prop;
        setHasNumberInput(!!prop);
      } catch {
        numberInputRef.current = null;
        setHasNumberInput(false);
      }
    }
  }, [numberInputSM, numberInputSM2, numberInputSM3, rive, viewModelInstance, sequentialMode]);

  useEffect(() => {
    if (triggerInputSM) {
      triggerInputRef.current = triggerInputSM as unknown as RiveTriggerRef;
      setHasTriggerInput(true);
      return;
    }
    if (!rive || !viewModelInstance) {
      triggerInputRef.current = null;
      setHasTriggerInput(false);
      return;
    }
    try {
      const prop = resolveViewModelTrigger(
        viewModelInstance as Parameters<typeof resolveViewModelTrigger>[0],
        mainTriggerPath
      );
      if (prop) {
        triggerInputRef.current = prop;
        setHasTriggerInput(true);
      } else {
        triggerInputRef.current = null;
        setHasTriggerInput(false);
      }
    } catch (e) {
      triggerInputRef.current = null;
      setHasTriggerInput(false);
    }
  }, [triggerInputSM, rive, viewModelInstance, mainTriggerPath]);

  useEffect(() => {
    if (!rive) return;
    if (mainOpacity < 0.01) rive.pause();
    else if (!rive.isPlaying) rive.play(riveConfig.main.stateMachineName);
  }, [rive, mainOpacity]);

  useEffect(() => {
    if (demoMode) return;
    let rafId: number;
    let lastDisplayUpdate = 0;
    let lastDebugUpdate = 0;

    const tick = () => {
      const rawP = latestProgressRef.current;
      const now = Date.now();

      if (now - lastDisplayUpdate > PROGRESS_THROTTLE_MS) {
        lastDisplayUpdate = now;
        setProgressDisplay(rawP);
      }

      // スクロール位置に常に同期（戻したときに min に戻るよう mainOpacity に依存しない）
      const scale = riveConfig.main.progressScale;
      if (sequentialMode) {
        const [v1, v2, v3] = sequentialNumberValues(rawP, numberInputMin, numberInputMax);
        const refs = numberInputRefs.current;
        // 戻し時に number_input_1 が確実に更新されるよう、v3→v2→v1 の順で代入（Rive の反映順対策）
        if (refs[2]) refs[2].value = v3;
        if (refs[1]) refs[1].value = v2;
        if (refs[0]) refs[0].value = v1;
        setSequentialValues([v1, v2, v3]);
        setNumberInputValue(v3);
      } else {
        const value = rawP * scale;
        const input = numberInputRef.current;
        if (input) {
          input.value = value;
          setNumberInputValue(input.value);
        }
      }

      if (mainOpacity >= 0.01) {
        const elapsed = (now - startTimeRef.current) / 1000;

        if (now - lastDebugUpdate > DEBUG_THROTTLE_MS) {
          lastDebugUpdate = now;
          setElapsedTime(elapsed);
          const trigger = triggerInputRef.current;
          const canFire =
            !trigger1Fired && elapsed > TRIGGER_DELAY_SECONDS && rawP > TRIGGER_MIN_SCROLL;
          setDebugTriggerInfo(
            `hasTrigger: ${!!trigger}, elapsed: ${elapsed.toFixed(2)}s, rawP: ${rawP.toFixed(3)}, canFire: ${canFire}, fired: ${trigger1Fired}`
          );
        }

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
  }, [demoMode, mainOpacity, trigger1Fired]);

  const sectionRef = useScrollProgress(
    (p) => {
      if (p >= SEGMENT1_END && !firstSegmentCompletedRef.current) {
        firstSegmentCompletedRef.current = true;
        setFirstSegmentCompleted(true);
      }
      const effective =
        sequentialMode && !firstSegmentCompletedRef.current
          ? Math.min(p, SEGMENT1_END)
          : p;
      latestProgressRef.current = effective;
      setMainOpacity(1);
    },
    { smooth: 0, pauseWhenOffScreen: false, ...scrollOptions }
  );

  const setProgress = (p: number) => {
    const clamped = Math.max(0, Math.min(1, p));
    latestProgressRef.current = clamped;
    setProgressDisplay(clamped);
    const el = sectionRef.current;
    if (el && typeof window !== "undefined") {
      const vh = window.innerHeight;
      const sectionHeight = el.getBoundingClientRect().height || 1;
      const maxScroll = Math.max(1, sectionHeight - vh);
      window.scrollTo({ top: clamped * maxScroll, behavior: "auto" });
    }
    const scale = riveConfig.main.progressScale;
    if (sequentialMode) {
      const [v1, v2, v3] = sequentialNumberValues(clamped, numberInputMin, numberInputMax);
      const refs = numberInputRefs.current;
      if (refs[2]) refs[2].value = v3;
      if (refs[1]) refs[1].value = v2;
      if (refs[0]) refs[0].value = v1;
      setSequentialValues([v1, v2, v3]);
      setNumberInputValue(v3);
    } else {
      const value = clamped * scale;
      const input = numberInputRef.current;
      if (input) {
        input.value = value;
        setNumberInputValue(value);
      }
    }
  };

  return (
    <div className="w-full">
      {/* アニメーションセクション */}
      <div
        ref={sectionRef as React.RefObject<HTMLDivElement>}
        className="relative w-full"
        style={{ height: spacerHeight, minHeight: spacerHeight }}
      >
        {/* Rive sticky 表示（スクロール中は画面に固定、セクション終了で流れる） */}
        <div
          className="sticky top-0 w-full h-screen pointer-events-none bg-white"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        >
          {/* メイン: Test_File_02.riv */}
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

          {/* スクラバー（デバッグ時のみ表示） */}
          {showDebug && rive && (
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1 pointer-events-auto bg-black/60 p-3 rounded-lg">
              <div className="text-white text-xs font-sans mb-1">
                {riveConfig.main.fileName.split("/").pop() ?? "main"}
              </div>
              <label className="text-white/80 text-xs font-sans flex items-center justify-between gap-4">
                <span>再生位置</span>
                <span className="font-mono">{(progressDisplay * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={progressDisplay * 100}
                onChange={(e) => setProgress(Number(e.target.value) / 100)}
                className="w-full h-2 accent-amber-500 bg-white/20 rounded cursor-pointer"
              />
            </div>
          )}

          {/* デバッグ情報（開発環境でのみ表示） */}
          {showDebug && rive && (
            <div className="absolute top-2 left-2 p-4 bg-black/90 text-white text-xs font-mono rounded max-h-[90vh] overflow-y-auto pointer-events-auto z-50 min-w-[320px]">
              <div className="text-cyan-400 font-bold mb-2">scroll: {progressDisplay.toFixed(3)}</div>

              <div className="text-amber-300 mt-2">{riveConfig.main.fileName.split("/").pop()} (main)</div>
              <div className="pl-2 text-[10px] text-gray-400">State Machine: {riveConfig.main.stateMachineName}</div>

              <div className="text-purple-300 mt-2">number_input{sequentialMode ? "_1 / _2 / _3" : "_1"}</div>
              <div className="pl-2 text-[10px] text-gray-400">
                Path: {sequentialMode ? (riveConfig.main.dataBindingNumberPaths ?? []).join(", ") : riveConfig.main.dataBindingNumberPath}
              </div>
              {sequentialMode ? (
                <div className="pl-2">
                  v1: {sequentialValues[0].toFixed(1)} / v2: {sequentialValues[1].toFixed(1)} / v3: {sequentialValues[2].toFixed(1)}
                </div>
              ) : (
                <div className="pl-2">value: {numberInputValue?.toFixed(1) ?? "—"}</div>
              )}
              <div className="pl-2 text-green-400">hasInput: {hasNumberInput ? "✓" : "✗"}</div>

              <div className="text-purple-300 mt-2">trigger_1</div>
              <div className="pl-2 text-green-400">hasInput: {hasTriggerInput ? "✓" : "✗"}</div>
              <div className="pl-2 text-green-400">fired: {trigger1Fired ? "✓" : "✗"}</div>
              <div className="pl-2 text-gray-400">Time elapsed: {elapsedTime.toFixed(2)}s</div>
              <div className="pl-2 text-[10px] text-gray-400 mt-1 break-words">{debugTriggerInfo}</div>

              <div className="text-purple-300 mt-2">Conditions</div>
              <div className="pl-2 text-gray-400">elapsed &gt; {TRIGGER_DELAY_SECONDS}s: {elapsedTime > TRIGGER_DELAY_SECONDS ? "✓" : "✗"}</div>
              <div className="pl-2 text-gray-400">scroll &gt; {TRIGGER_MIN_SCROLL}: {progressDisplay > TRIGGER_MIN_SCROLL ? "✓" : "✗"}</div>
              <div className="pl-2 text-gray-400">not fired yet: {!trigger1Fired ? "✓" : "✗"}</div>
            </div>
          )}
        </div>
      </div>

      {/* COMPANY セクションタイトル */}
      <div
        className="w-full bg-white flex flex-col items-center overflow-hidden"
        style={{ fontFamily: "Syncopate, sans-serif" }}
      >
        <div className="flex flex-col items-center w-full" style={{marginTop: "4rem"}}>
          <div style={{ fontSize: "clamp(80px, 18vw, 240px)", lineHeight: 0.9, fontFamily: "Syncopate, sans-serif", color: "#38999A" }}>
            COMPANY
          </div>
          <div className="w-full" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: 18, fontWeight: 500, lineHeight: 1, color: "#144445" }}>
            会社概要
          </div>
        </div>
      </div>

      {/* section2: 01 終了後に表示（#02 philosophy / executive member） */}
      {section2Src && riveConfig.section2 && (
        <div className="hidden md:block relative w-full h-screen bg-white overflow-hidden">
          <RiveSection2Nav
            src={section2Src}
            stateMachineName={riveConfig.section2.stateMachineName}
            artboard={riveConfig.section2.artboard}
            autoBind={!!riveConfig.section2.viewModelName}
            wrapperStyle={{ left: "calc(-3vw)", top: "-3rem" }}
            canvasStyle={{ width: "calc(104vw)", height: "calc(110vh - 2rem)", paddingBottom: "2rem" }}
          />
        </div>
      )}

      {/* section2 mobile: モバイル用 philosophy / executive / member */}
      <div className="block md:hidden w-full bg-white flex flex-col gap-2 px-3 py-4">
        {/* PHILOSOPHY (default artboard) */}
        <div className="relative w-full" style={{ aspectRatio: "350/300" }}>
          <RiveSection2Nav
            src={buildRiveSrc("peterpan/philosophy_executive_member.riv")}
            stateMachineName="State Machine 1"
            autoBind={true}
          />
        </div>
        <div className="relative flex-1" style={{ aspectRatio: "170/150" }}>
          <RiveSection2Nav
            src={buildRiveSrc("peterpan/philosophy_executive_member.riv")}
            stateMachineName="State Machine 1"
            artboard="EXECTIVE"
            autoBind={true}
          />
        </div>
        <div className="relative flex-1" style={{ aspectRatio: "170/150" }}>
          <RiveSection2Nav
            src={buildRiveSrc("peterpan/philosophy_executive_member.riv")}
            stateMachineName="State Machine 1"
            artboard="MEMBER"
            autoBind={true}
          />
        </div>
        
      </div>

      {/* section3: SERVICE セクション */}
      <div className="w-full relative flex flex-col items-center" style={{ color: "#fff", fontFamily: "Syncopate, sans-serif", paddingBottom: "1rem" }}>
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
        <div className="relative z-[1] flex flex-col items-center w-full pb-6 pt-12 md:pb-[75px]">
          <div className="flex flex-col items-center w-full">
            <div style={{ fontSize: "clamp(60px, 20vw, 295px)", lineHeight: 0.8 }}>SERVICE</div>
            <div className="w-full" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: 24, fontWeight: 500, lineHeight: 1 }}>
              サービス
            </div>
          </div>
        </div>
        {/* Cards */}
        <div className="self-stretch relative z-[1] flex flex-col md:flex-row items-stretch gap-5 mb-10 mx-4 md:mx-[calc(max(30px,3vw))] bg-white" style={{padding: "clamp(1.5rem, 2.5vw, 2.5rem)"}}>
          <ServiceCard
            label="人材紹介"
            num="01"
            imageSrc="/書き出し画像/top/WebP/service01.webp"
            href="/service-to-b"
          />
          <ServiceCard
            label="キャリア支援"
            num="02"
            imageSrc="/書き出し画像/top/WebP/service02.webp"
            href="/service-to-c"
          />
          <ServiceCard
            label="求人プラットフォーム"
            num="03"
            imageSrc="/書き出し画像/top/WebP/service03.webp"
          />
        </div>
      </div>

      {/* section4: COLUMN セクション */}
      <div
        className="w-full relative overflow-hidden flex flex-col items-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/Rectangle-271.webp')", color: "#000", fontFamily: "Syncopate, sans-serif" }}
      >
        {/* Title */}
        <div
          className="w-full flex flex-col items-center overflow-hidden"
          style={{ fontFamily: "Syncopate, sans-serif", paddingBottom: "10px" }}
        >
          <div className="flex flex-col items-center w-full">
            <div style={{ fontSize: "clamp(80px, 18vw, 270px)", lineHeight: 0.9, fontFamily: "Syncopate, sans-serif", color: "#38999A", marginTop: "-15px" }}>
              COLUMN
            </div>
            <div className="w-full text-center" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: 24, fontWeight: 500, lineHeight: 1, color: "#144445", paddingBottom: "4rem", marginTop: "-2rem" }}>
              ピーターパンの記事
            </div>
          </div>
        </div>
        {/* Cards - desktop: 3 in a row */}
        {columns.length > 0 && (
          <div className="hidden md:flex items-stretch gap-5 w-full max-w-[1200px] mx-auto" style={{ padding: "0 50px 80px" }}>
            {columns.slice(0, 3).map((item) => (
              <ColumnCard key={item.id} item={item} />
            ))}
          </div>
        )}
        {/* Cards - mobile: 2x2 grid */}
        {columns.length > 0 && (
          <div className="self-stretch grid grid-cols-2 gap-4 px-5 pb-10 md:hidden">
            {columns.slice(0, 4).map((item) => (
              <ColumnCard key={item.id} item={item} />
            ))}
          </div>
        )}
        {/* ブログ一覧へ ボタン */}
        <div className="flex justify-center w-full" style={{ padding: "0 50px 80px" }}>
          <a
            href="/column"
            className="inline-flex items-center gap-3 no-underline"
            style={{
              backgroundColor: "#004345",
              color: "#fff",
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontSize: 24,
              fontWeight: 500,
              padding: "18px 50px",
              borderRadius: 0,
            }}
          >
            ブログ一覧へ
            <RiveButtonIcon/>
          </a>
        </div>
      </div>

      {/* RECRUITE セクション - desktop */}
      <div
        className="hidden md:flex w-full relative z-10 items-center justify-center bg-cover bg-no-repeat bg-center text-left"
        style={{
          backgroundImage: "url('/Frame 1452.png')",
          color: "#004345",
          fontFamily: "Syncopate, sans-serif",
          fontSize: 50,
          minHeight: "clamp(400px, 35vw, 600px)",
          aspectRatio: "1440 / 491",
        }}
      >
        {/* Content - text block positioned absolutely relative to recruiter image */}
        {/* Adjust left: to move horizontally, top: to move vertically (% of recruiter image) */}
        {/* Adjust fontSize clamp values to change text size */}
        <div className="absolute z-[2] flex flex-col items-start justify-center gap-3 text-left" style={{ left: "19%", top: "48%", transform: "translateY(-50%)", color: "#004345", fontFamily: "Syncopate, sans-serif", fontSize: "clamp(32px, 5vw, 49px)", lineHeight: 1 }}>
            <VideoFilledText
              text="RECRUITE"
              videoSrc="/rive/peterpan/250129_PP_water surface_06 (3).webm"
            />
            <div className="flex flex-col items-start justify-center gap-[8px]" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: "clamp(22px, 4vw, 30px)", lineHeight: 1.2 }}>
              <div className="relative font-medium">Peter Pan症候群であれ</div>
              <div className="flex flex-col items-start gap-[4px]" style={{ fontSize: "clamp(17px, 1.5vw, 20px)" }}>
                <div className="relative" style={{ lineHeight: "24px" }}>ピーターパンでは、 一人一人が主人公。</div>
                <div className="relative" style={{ lineHeight: "24px" }}>世の中の変革の軸となる人が活躍しています。</div>
              </div>
            </div>
          </div>
          {/* Round spinning button - positioned relative to the right side of background image */}
          {/* Adjust right: to move horizontally (% of recruiter image width) */}
          <div className="absolute z-[2] flex items-center justify-center" style={{ right: "30%", top: "47%", transform: "translateY(-50%)", width: 110, height: 110 }}>
            <div className="absolute inset-0 rounded-full bg-white flex items-center justify-center" style={{ animation: "spin-slow 10s linear infinite" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="object-contain" style={{ width: "72%", height: "72%" }} src="/517c5fb84343625d3074830111ac69c5ba36b3c2.png" alt="" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="relative z-10" style={{ width: 24, height: 16 }} src="/書き出し画像/top/WebP/Vector (4).svg" alt="" />
          </div>
      </div>
      {/* RECRUITE セクション - mobile */}
      <div className="block md:hidden w-full relative z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/書き出し画像/sp/Frame 1550.png" alt="RECRUITE" className="w-full h-auto" />
      </div>

      {/* overlay7: コンテンツ後に表示（スクロール連動 number_input_1） */}
      {overlay7Src && riveConfig.overlay7 && (
        <Overlay7ScrollSection src={overlay7Src} />
      )}

      {/* Footer */}
      <footer
        className="w-full bg-white flex flex-col items-center pt-5 pb-[50px] box-border gap-[50px] text-left relative z-10"
        style={{ color: "#000", fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: 30, marginTop: "-40vh" }}
      >
        <div className="w-full flex items-start justify-between px-[2.5%] gap-5">
          {/* Left: Logo + tagline */}
          <div className="flex flex-col items-start justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.webp" alt="Peter Pan - ジレンマを遊び心で超えていく。" style={{ width: "clamp(350px, 50vw, 680px)", height: "auto" }} />
          </div>
          {/* Right: Nav links */}
          <div className="flex items-start pt-[30px] gap-[15px]" style={{ fontSize: 14, fontFamily: "Syncopate, sans-serif", paddingRight: "10%" }}>
            <div className="flex flex-col items-start gap-[15px]">
              <div className="relative">PHILOSOPHY</div>
              <div className="relative">COMPANY</div>
              <div className="flex flex-col items-start justify-between gap-[15px]">
                <div className="relative">SERVICE</div>
                <div className="self-stretch flex flex-col items-start gap-2.5" style={{ fontSize: 10, fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
                  <div className="self-stretch flex items-center gap-2.5">
                    <span style={{ display: "inline-block", width: 10, height: 1, backgroundColor: "#000" }} />
                    <div className="relative">個人の方</div>
                  </div>
                  <div className="self-stretch flex items-center gap-2.5">
                    <span style={{ display: "inline-block", width: 10, height: 1, backgroundColor: "#000" }} />
                    <div className="relative">法人の方</div>
                  </div>
                  <div className="self-stretch flex items-center gap-2.5">
                    <span style={{ display: "inline-block", width: 10, height: 1, backgroundColor: "#000" }} />
                    <div className="relative">人材紹介会社様</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-[15px]">
              <div className="relative">MEMBER</div>
              <div className="relative">Blog</div>
              <div className="relative">RECRUIT</div>
              <div className="relative">CONTACT</div>
              <div className="flex items-center gap-5 text-right" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
                <div className="flex items-center gap-[3px]">
                  <div className="rounded-[5px] flex items-center justify-center py-[5px] px-2.5" style={{ backgroundColor: "#06c755", color: "#fff" }}>
                    <div className="relative font-medium">LINE</div>
                  </div>
                  <div className="relative" style={{ color: "#000" }}>で転職相談</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch relative text-center" style={{ fontSize: 14, lineHeight: "50px", fontFamily: "'Noto Sans JP', sans-serif" }}>
          &copy; 2026 by Peter Pan Inc.
        </div>
      </footer>
    </div>
  );
}

function Overlay7ScrollSection({ src }: { src: string }) {
  const progressRef = useRef(0);
  const [opacity, setOpacity] = useState(0);
  const sectionRef = useScrollProgress(
    (p) => {
      const clamped = Math.max(0, Math.min(1, p));
      progressRef.current = clamped;
      setOpacity(1);
    },
    { smooth: 0, pauseWhenOffScreen: false }
  );

  const cfg = riveConfig.overlay7!;

  const overlay7Layout = useMemo(
    () => new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
    []
  );

  return (
    <div
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className="relative w-full bg-white"
      style={{ height: "300vh", minHeight: "300vh", marginTop: "-15vh" }}
    >
      {/* Rive sticky 表示 */}
      <div className="sticky top-0 w-full h-screen">
        <RiveDataBindingOverlay
            src={src}
            opacity={opacity}
            latestProgressRef={progressRef}
            layout={overlay7Layout}
            config={{
              stateMachineName: cfg.stateMachineName,
              artboard: cfg.artboard,
              viewModelName: cfg.viewModelName,
              dataBindingNumberPath: cfg.dataBindingNumberPath,
              progressScale: cfg.progressScale,
              progressStart: cfg.progressStart,
              progressEnd: cfg.progressEnd,
              inputName: "number_input_1",
            }}
          />
      </div>
    </div>
  );
}
