"use client";

import { useMemo } from "react";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-webgl2";

function SimpleRive({
  src,
  label,
  stateMachineName = "State Machine 1",
  artboard,
  animations,
  fit = "cover",
}: {
  src: string;
  label: string;
  stateMachineName?: string;
  artboard?: string;
  animations?: string | string[];
  fit?: "cover" | "contain";
}) {
  const riveLayout = useMemo(
    () =>
      new Layout({
        fit: fit === "contain" ? Fit.Contain : Fit.Cover,
        alignment: Alignment.Center,
      }),
    [fit]
  );

  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    ...(animations
      ? { animations: Array.isArray(animations) ? animations : [animations] }
      : { stateMachines: stateMachineName }),
    autoplay: true,
    layout: riveLayout,
  });

  return (
    <div className="w-full relative" style={{ height: "100vh" }}>
      <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-1 rounded text-sm font-mono">
        {label} — {rive ? "loaded" : "loading..."}
      </div>
      <RiveComponent className="absolute inset-0 w-full h-full" />
    </div>
  );
}

export default function TestRivePage() {
  return (
    <div className="w-full">
      <SimpleRive
        src="/rive/peterpan/philosphy.riv"
        label="philosphy.riv (animation: start)"
        animations="start"
      />
      <SimpleRive
        src="/rive/peterpan/%2301_mission.riv"
        label="#01_mission.riv (SM: mission_SM, artboard: mission)"
        stateMachineName="mission_SM"
        artboard="mission"
        fit="contain"
      />
    </div>
  );
}
