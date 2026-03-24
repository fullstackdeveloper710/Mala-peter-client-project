"use client";

import { useRive, useViewModel, useViewModelInstance, useStateMachineInput, EventType, Layout } from "@rive-app/react-webgl2";
import { useEffect, useRef, useState } from "react";
import { overlayStyle } from "@/lib/rive-utils";
import type { RiveOverlayProps, DataBindingOverlayProps, DebugInfo } from "@/types/rive";

/**
 * 基本オーバーレイコンポーネント
 * - 自動再生
 * - アニメーション終了検知（オプション）
 */
export function RiveOverlay({
  src,
  stateMachineName,
  opacity,
  onAnimationEnd,
}: RiveOverlayProps) {
  const hasEndedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: stateMachineName,
    autoplay: true,
  });

  useEffect(() => {
    if (rive && !isLoaded) setIsLoaded(true);
  }, [rive, isLoaded]);

  // 非表示時は pause して負荷軽減
  useEffect(() => {
    if (!rive) return;
    if (opacity < 0.01) {
      rive.pause();
    } else if (!rive.isPlaying) {
      rive.play(stateMachineName);
    }
  }, [rive, opacity, stateMachineName]);

  // アニメーション終了検知（Loop/Stop）
  useEffect(() => {
    if (!rive || !isLoaded || !onAnimationEnd) return;

    const handleEnd = () => {
      if (hasEndedRef.current) return;
      hasEndedRef.current = true;
      onAnimationEnd();
    };

    rive.on(EventType.Loop, handleEnd);
    rive.on(EventType.Stop, handleEnd);

    return () => {
      rive.off(EventType.Loop, handleEnd);
      rive.off(EventType.Stop, handleEnd);
    };
  }, [rive, isLoaded, onAnimationEnd]);

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        ...overlayStyle.base,
        ...overlayStyle.getVisibility(opacity),
      }}
    >
      <RiveComponent
        className="w-full h-full absolute inset-0"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>
  );
}

/**
 * イントロオーバーレイコンポーネント（01-1用）
 * - 自動再生
 * - タイムアウトでの終了検知
 */
export function RiveIntroOverlay({
  src,
  stateMachineName,
  opacity,
  onAnimationEnd,
  duration = 3.5,
}: RiveOverlayProps & { duration?: number }) {
  const hasEndedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: stateMachineName,
    autoplay: true,
  });

  useEffect(() => {
    if (rive && !isLoaded) {
      setIsLoaded(true);
      if (!rive.isPlaying) rive.play(stateMachineName);
    }
  }, [rive, isLoaded, stateMachineName]);

  useEffect(() => {
    if (!rive) return;
    if (opacity < 0.01) {
      rive.pause();
    } else if (!rive.isPlaying) {
      rive.play(stateMachineName);
    }
  }, [rive, opacity, stateMachineName]);

  // アニメーション終了検知
  useEffect(() => {
    if (!rive || !isLoaded) return;

    const handleEnd = () => {
      if (hasEndedRef.current) return;
      hasEndedRef.current = true;
      onAnimationEnd?.();
    };

    rive.on(EventType.Loop, handleEnd);
    rive.on(EventType.Stop, handleEnd);

    // タイムアウトフォールバック
    const timeoutId = setTimeout(handleEnd, duration * 1000);

    return () => {
      clearTimeout(timeoutId);
      rive.off(EventType.Loop, handleEnd);
      rive.off(EventType.Stop, handleEnd);
    };
  }, [rive, isLoaded, duration, onAnimationEnd]);

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        ...overlayStyle.base,
        ...overlayStyle.getVisibility(opacity),
        transition: "opacity 0.5s ease-out",
      }}
    >
      <RiveComponent
        className="w-full h-full absolute inset-0"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>
  );
}

/**
 * Data Binding オーバーレイ用の共通フック
 */
function useDataBinding(
  rive: ReturnType<typeof useRive>["rive"],
  config: {
    stateMachineName: string;
    viewModelName?: string;
    dataBindingNumberPath?: string;
    inputName?: string;
  }
) {
  const numberInputRef = useRef<{ value: number } | null>(null);

  // State Machine Input を取得
  const stateMachineInput = useStateMachineInput(
    rive,
    config.stateMachineName,
    config.inputName || "companyBlendInput"
  );

  // View Model も試す（バックアップ）
  const viewModel = useViewModel(rive, { name: config.viewModelName });
  const viewModelInstance = useViewModelInstance(viewModel, { rive, useDefault: true });

  useEffect(() => {
    if (stateMachineInput) {
      numberInputRef.current = stateMachineInput as unknown as { value: number };
      return;
    }

    if (!rive || !config.dataBindingNumberPath) return;

    const vm = viewModelInstance ?? (rive as { viewModelInstance?: typeof viewModelInstance }).viewModelInstance;
    if (!vm) return;

    const pathParts = config.dataBindingNumberPath.split("/");
    const propName = pathParts.pop()!;

    let prop = vm.number(propName);
    if (prop) {
      numberInputRef.current = prop;
      return;
    }

    // ネストされたパスを探索
    let target = vm;
    for (const segment of pathParts) {
      const nested = target.viewModel(segment)
        ?? target.viewModel(segment.toLowerCase())
        ?? target.viewModel(segment.charAt(0).toUpperCase() + segment.slice(1));
      if (!nested) break;
      target = nested;
    }

    prop = target.number(propName);
    if (prop) numberInputRef.current = prop;
  }, [rive, stateMachineInput, viewModelInstance, config.dataBindingNumberPath]);

  return numberInputRef;
}

/**
 * Data Binding オーバーレイコンポーネント
 * - スクロール駆動
 * - View Model または State Machine Input で値を更新
 */
export function RiveDataBindingOverlay({
  src,
  opacity,
  latestProgressRef,
  onDebugInfo,
  onAnimationEnd,
  config,
  layout,
}: DataBindingOverlayProps & {
  config: {
    stateMachineName: string;
    artboard?: string;
    viewModelName?: string;
    dataBindingNumberPath?: string;
    progressScale?: number;
    progressStart?: number;
    progressEnd?: number;
    inputName?: string;
  };
  layout?: Layout;
}) {
  const hasEndedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { rive, RiveComponent } = useRive({
    src,
    artboard: config.artboard,
    stateMachines: config.stateMachineName,
    autoplay: true,
    autoBind: true,
    ...(layout ? { layout } : {}),
  });

  const numberInputRef = useDataBinding(rive, config);

  useEffect(() => {
    if (rive && !isLoaded) setIsLoaded(true);
  }, [rive, isLoaded]);

  useEffect(() => {
    if (!rive) return;
    if (opacity < 0.01) {
      rive.pause();
    } else if (!rive.isPlaying) {
      rive.play(config.stateMachineName);
    }
  }, [rive, opacity, config.stateMachineName]);

  // アニメーション終了検知
  useEffect(() => {
    if (!rive || !isLoaded || !onAnimationEnd) return;

    const handleEnd = () => {
      if (hasEndedRef.current) return;
      hasEndedRef.current = true;
      onAnimationEnd();
    };

    rive.on(EventType.Loop, handleEnd);
    rive.on(EventType.Stop, handleEnd);

    return () => {
      rive.off(EventType.Loop, handleEnd);
      rive.off(EventType.Stop, handleEnd);
    };
  }, [rive, isLoaded, onAnimationEnd]);

  // RAF: progress を Rive に渡す
  useEffect(() => {
    if (opacity < 0.01) return;

    let rafId: number;
    let lastLog = 0;

    const tick = () => {
      const input = numberInputRef.current;
      const p = latestProgressRef.current ?? 0;
      const start = config.progressStart ?? 0;
      const end = config.progressEnd ?? 1;
      const scale = config.progressScale ?? 100;

      const normalized = Math.max(0, Math.min(1, (p - start) / (end - start)));
      const value = normalized * scale;

      if (input) input.value = value;

      if (onDebugInfo && Date.now() - lastLog > 100) {
        lastLog = Date.now();
        onDebugInfo({ hasBinding: !!input, value });
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [opacity, latestProgressRef, onDebugInfo, config]);

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        ...overlayStyle.base,
        ...overlayStyle.getVisibility(opacity),
      }}
    >
      <RiveComponent
        className="w-full h-full absolute inset-0"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>
  );
}
