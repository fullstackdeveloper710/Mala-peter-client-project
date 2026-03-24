"use client";

import { useMemo } from "react";
import { useRive, Layout, Fit } from "@rive-app/react-webgl2";
import PageBottom from "@/components/PageBottom";

const layoutFit = new Layout({ fit: Fit.Layout });

function buildRiveSrc(fileName: string): string {
  const i = fileName.indexOf("/");
  if (i === -1) return `/rive/${encodeURIComponent(fileName)}`;
  const folder = fileName.slice(0, i);
  const name = fileName.slice(i + 1);
  return `/rive/${folder}/${encodeURIComponent(name)}`;
}

function ArticleCard() {
  return (
    <div className="w-full bg-white flex items-center p-[15px] box-border" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: 20, color: "#004345" }}>
      <div className="flex-1 flex flex-col items-end justify-center gap-[15px]">
        <div className="self-stretch flex flex-col items-start gap-2">
          <div className="self-stretch flex items-center justify-center" style={{ height: 209 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Vector%20(8).svg"
              alt=""
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/arrow_2.svg" alt="" className="shrink-0" style={{ width: 15, height: 15 }} />
        </div>
        {/* Title */}
        <div className="self-stretch flex items-center justify-center">
          <div className="flex-1 relative font-medium" style={{ lineHeight: "27px" }}>
            タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル
          </div>
        </div>
        {/* Date + arrow */}
        <div className="self-stretch flex items-center justify-between gap-5" style={{ fontSize: 14 }}>
          <div className="relative font-medium" style={{ lineHeight: "27px" }}>2025.00.00</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/arrow.svg" alt="" style={{ width: 30, height: 30 }} />
        </div>
      </div>
    </div>
  );
}

export default function ColumnPage() {
  const filterTabs = ["ALL", "候補者向け", "企業向け", "人材紹介会社向け", "会社紹介"];

  const src = useMemo(() => buildRiveSrc("peterpan/column.riv"), []);
  const { RiveComponent } = useRive({
    src,
    artboard: "main",
    stateMachines: "stateMachine",
    autoplay: true,
    layout: layoutFit,
  });

  return (
    <div
      className="relative flex flex-col items-center text-left"
      style={{ width: "100vw", maxWidth: "100%", color: "#004345", fontFamily: "Syncopate, sans-serif", fontSize: 50 }}
    >
      {/* Hero: column.riv */}
      <div className="self-stretch flex flex-col items-start relative isolate">
        <div className="w-full h-screen">
          {RiveComponent ? (
            <RiveComponent
              className="w-full h-full"
              style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">読み込み中…</div>
          )}
        </div>

        {/* Content section */}
        <div
          className="self-stretch flex flex-col items-center z-[1]"
          style={{
            backgroundColor: "#edf9ff",
            padding: "100px 50px",
            gap: 50,
            fontFamily: "'Zen Kaku Gothic New', sans-serif",
            fontSize: 20,
            color: "#000",
          }}
        >
          {/* Filter tabs */}
          <div className="self-stretch flex items-start justify-between flex-wrap content-start gap-x-5 gap-y-2.5">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                className="bg-white flex items-center cursor-pointer border-none"
                style={{
                  padding: "10px 30px",
                  gap: 30,
                  fontFamily: "'Zen Kaku Gothic New', sans-serif",
                  fontSize: 20,
                  color: "#000",
                }}
              >
                <div className="relative font-medium">{tab}</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/arrow.svg" alt="" style={{ width: 30, height: 30 }} />
              </button>
            ))}
          </div>

          {/* Article grid */}
          <div className="self-stretch flex justify-center overflow-x-auto">
            <div
              className="grid"
              style={{
                gridTemplateColumns: "repeat(3, 370px)",
                columnGap: 30,
                rowGap: 50,
                color: "#004345",
              }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <ArticleCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <PageBottom />
    </div>
  );
}
