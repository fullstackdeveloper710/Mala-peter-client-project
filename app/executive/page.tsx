"use client";

import { useMemo } from "react";
import { useRive, Layout, Fit } from "@rive-app/react-webgl2";
import MemberCard from "@/components/MemberCard";
import PageBottom from "@/components/PageBottom";

const layoutFit = new Layout({ fit: Fit.Layout });

function buildRiveSrc(fileName: string): string {
  const i = fileName.indexOf("/");
  if (i === -1) return `/rive/${encodeURIComponent(fileName)}`;
  const folder = fileName.slice(0, i);
  const name = fileName.slice(i + 1);
  return `/rive/${folder}/${encodeURIComponent(name)}`;
}

export default function ExecutivePage() {
  const src = useMemo(() => buildRiveSrc("peterpan/executive.riv"), []);
  const { RiveComponent } = useRive({
    src,
    artboard: "main",
    stateMachines: "stateMachine",
    autoplay: true,
    layout: layoutFit,
  });

  return (
    <div
      className="w-full relative flex flex-col items-center text-left"
      style={{ color: "#004345", fontFamily: "Syncopate, sans-serif", fontSize: 50 }}
    >
      {/* Hero: executive.riv */}
      <div className="self-stretch flex flex-col items-center relative">
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

        {/* Members section */}
        <div
          className="self-stretch flex items-center justify-center z-[1]"
          style={{
            minHeight: 768,
            backgroundColor: "#edf9ff",
            padding: "50px 100px",
            gap: 50,
          }}
        >
          <MemberCard
            role="代表取締役"
            name="笠井 基生"
            href="https://www.wantedly.com/users/187051323"
            image="/書き出し画像/exective/webp/exective_01.webp"
          />
          <MemberCard
            role="COO"
            name="赤沼 拓弥"
            href="https://www.wantedly.com/users/9020594"
            image="/書き出し画像/exective/webp/exective_02.webp"
          />
        </div>
      </div>

      <PageBottom />
    </div>
  );
}
