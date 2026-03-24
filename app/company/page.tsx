"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useRive, useViewModel, useViewModelInstance, Layout, Fit } from "@rive-app/react-webgl2";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import PageBottom from "@/components/PageBottom";

const layoutFit = new Layout({ fit: Fit.Layout });
const SCALE = 150;

function buildRiveSrc(fileName: string): string {
  const i = fileName.indexOf("/");
  if (i === -1) return `/rive/${encodeURIComponent(fileName)}`;
  const folder = fileName.slice(0, i);
  const name = fileName.slice(i + 1);
  return `/rive/${folder}/${encodeURIComponent(name)}`;
}

/** Company info row */
function InfoRow({
  labelJa,
  labelEn,
  children,
}: {
  labelJa: string;
  labelEn: string;
  children: React.ReactNode;
}) {
  return (
    <div className="self-stretch flex flex-col items-start gap-2.5">
      <div
        className="self-stretch"
        style={{ height: 1, backgroundColor: "#000" }}
      />
      <div className="self-stretch flex items-start justify-between gap-5">
        <div className="flex flex-col items-start gap-[5px]" style={{ minWidth: 200 }}>
          <div className="relative">{labelJa}</div>
          <div className="relative">{labelEn}</div>
        </div>
        <div
          className="relative font-medium text-right"
          style={{ fontSize: 18 }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function CompanyPage() {
  const src = useMemo(() => buildRiveSrc("peterpan/company.riv"), []);
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
    <div
      className="w-full relative flex flex-col items-center text-left"
      style={{ color: "#004345", fontFamily: "Syncopate, sans-serif", fontSize: 50 }}
    >
      {/* Hero: scroll-driven company.riv */}
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

      <div className="self-stretch flex flex-col items-center overflow-x-hidden" style={{ backgroundImage: "url('/Rectangle-271.webp')" }}>

        {/* Company info table */}
        <div
          className="self-stretch flex items-center justify-center z-[2]"
          style={{ padding: "100px 0" }}
        >
          <div
            className="w-full flex flex-col items-start relative isolate gap-[50px] box-border"
            style={{
              maxWidth: 945,
              padding: "100px 75px",
              fontSize: 14,
              color: "#000",
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
            }}
          >
            {/* Background card */}
            <div
              className="absolute inset-0 z-[0]"
              style={{ backgroundColor: "#fff", borderRadius: 10 }}
            />

            <div className="relative z-[1] self-stretch flex flex-col gap-[50px]">
              <InfoRow labelJa="会社名" labelEn="Name">
                株式会社 Peter Pan
              </InfoRow>

              <InfoRow labelJa="設立" labelEn="Establishment">
                2023.10.17
              </InfoRow>

              <InfoRow labelJa="取締役" labelEn="Director">
                <div className="flex flex-col items-end gap-[15px]">
                  <div>代表取締役CEO | 笠井 基生</div>
                  <div>取締役COO | 赤沼 拓弥</div>
                </div>
              </InfoRow>

              <InfoRow labelJa="資本金" labelEn="Capital">
                5,000,000円
              </InfoRow>

              <InfoRow labelJa="有料職業紹介事業" labelEn="Licensed Employment Agency">
                13-ユ-316388
              </InfoRow>

              <InfoRow labelJa="取引銀行" labelEn="Transaction Bank">
                三井住友銀行
                <br />
                東京シティ銀行
                <br />
                西武信用金庫
                <br />
                静岡銀行
              </InfoRow>

              <InfoRow labelJa="住所" labelEn="Residence">
                〒101-0054
                <br />
                東京都千代田区神田錦町2-2-1 KANDA SQUARE 11F
              </InfoRow>
            </div>
          </div>
        </div>
      </div>

      <PageBottom hideRecruit={true} />
    </div>
  );
}
