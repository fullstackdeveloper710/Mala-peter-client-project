"use client";

import { useMemo } from "react";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-webgl2";

export default function HeroRive({
  src,
  artboard,
  stateMachineName,
  animations,
  fit = "cover",
  alignment = "center",
  className,
}: {
  src: string;
  artboard?: string;
  stateMachineName?: string;
  /** Timeline animation names (use instead of stateMachineName for simple animations) */
  animations?: string | string[];
  fit?: "cover" | "contain";
  alignment?: "center" | "bottomCenter" | "topCenter";
  className?: string;
}) {
  const riveLayout = useMemo(
    () =>
      new Layout({
        fit: fit === "contain" ? Fit.Contain : Fit.Cover,
        alignment:
          alignment === "bottomCenter"
            ? Alignment.BottomCenter
            : alignment === "topCenter"
              ? Alignment.TopCenter
              : Alignment.Center,
      }),
    [fit, alignment]
  );

  const { RiveComponent } = useRive({
    src,
    artboard,
    ...(animations
      ? { animations: Array.isArray(animations) ? animations : [animations] }
      : { stateMachines: stateMachineName ?? "State Machine 1" }),
    autoplay: true,
    layout: riveLayout,
  });

  if (!RiveComponent) return <div className={className ?? ""} />;

  return (
    <div className={className ?? ""}>
      <RiveComponent className="absolute inset-0 w-full h-full" />
    </div>
  );
}
