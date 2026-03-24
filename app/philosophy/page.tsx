"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRive, useViewModel, useViewModelInstance, Layout, Fit } from "@rive-app/react-webgl2";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import PageBottom from "@/components/PageBottom";
import PhilosophyScroll from "@/components/PhilosophyScroll";

const layoutFit = new Layout({ fit: Fit.Layout });
const SCALE = 150;

function buildRiveSrc(fileName: string): string {
  const i = fileName.indexOf("/");
  if (i === -1) return `/rive/${encodeURIComponent(fileName)}`;
  const folder = fileName.slice(0, i);
  const name = fileName.slice(i + 1);
  return `/rive/${folder}/${encodeURIComponent(name)}`;
}

export default function PhilosophyPage() {
  const src = useMemo(() => buildRiveSrc("peterpan/philosphy.riv"), []);
  const latestProgressRef = useRef(0);
  const stateNumRef = useRef<{ value: number } | null>(null);

  const { rive, RiveComponent } = useRive({
    src,
    artboard: "main",
    stateMachines: "stateMachine",
    autoplay: true,
    autoBind: true,
    layout: layoutFit,
  });

  const viewModel = useViewModel(rive, { name: "ViewModel2" });
  const viewModelInstance = useViewModelInstance(viewModel, { rive, useDefault: true });

  useEffect(() => {
    if (!viewModelInstance) {
      stateNumRef.current = null;
      return;
    }
    try {
      stateNumRef.current = viewModelInstance.number("stateNum") ?? null;
    } catch {
      stateNumRef.current = null;
    }
  }, [viewModelInstance]);

  const sectionRef = useScrollProgress(
    (p) => { latestProgressRef.current = p; },
    { smooth: 0, pauseWhenOffScreen: false }
  );

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const value = latestProgressRef.current * SCALE;
      const prop = stateNumRef.current;
      if (prop) prop.value = value;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="relative w-full bg-white text-left"
      style={{ color: "#004345", fontFamily: "Syncopate, sans-serif", fontSize: 50 }}
    >
      {/* PhilosophyIntroScroll: scroll-driven philosphy.riv */}
      <div className="relative z-20">
        <section
          ref={sectionRef as React.RefObject<HTMLElement>}
          className="relative w-full bg-white"
          style={{ height: "600vh", minHeight: "600vh" }}
        >
          <div className="sticky top-0 w-full h-screen">
            {RiveComponent ? (
              <RiveComponent
                className="w-full h-full"
                style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">読み込み中…</div>
            )}
          </div>
        </section>
      </div>

      {/* PhilosophyScroll: scroll-driven philosophy_mvv.riv */}
      <div className="relative z-10" style={{ marginTop: "-70rem"}}>
        <PhilosophyScroll />
      </div>

      {/* VISION MAP section */}
      <div className="w-full bg-white flex flex-col items-start" style={{ fontSize: 40, color: "#000" }}>
        <div
          className="self-stretch flex items-center justify-center"
          style={{ height: 150, padding: "50px 0" }}
        >
          <div className="flex items-center py-0 px-[50px]">
            <div className="relative shrink-0">VISION MAP</div>
          </div>
        </div>
        <div
          className="self-stretch flex flex-col items-center justify-center"
          style={{ backgroundImage: "url('/Rectangle-271.webp')", backgroundSize: "cover", backgroundPosition: "center", padding: "50px 100px", minHeight: 518 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/書き出し画像/philosophy/webp/visionmap.webp"
            alt="Vision Map"
            className="w-full relative object-contain"
            style={{ maxWidth: 732 }}
          />
        </div>
      </div>

      <PageBottom hideRecruit />
    </div>
  );
}