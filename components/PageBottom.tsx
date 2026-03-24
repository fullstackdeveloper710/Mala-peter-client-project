"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { riveConfig } from "@/data/rive-input-config";
import { RiveDataBindingOverlay } from "@/components/rive";

function buildRiveSrc(fileName: string): string {
  const i = fileName.indexOf("/");
  if (i === -1) return `/rive/${encodeURIComponent(fileName)}`;
  const folder = fileName.slice(0, i);
  const name = fileName.slice(i + 1);
  return `/rive/${folder}/${encodeURIComponent(name)}`;
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

  return (
    <div
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className="relative w-full"
      style={{ backgroundColor: "#ffff", height: "300vh", minHeight: "300vh", transformOrigin: "center top" }}
    >
      <div className="sticky top-0 w-full h-screen">
        <div
          className="absolute inset-0"
          style={{ transform: "scale(1)", transformOrigin: "center" }}
        >
          <RiveDataBindingOverlay
            src={src}
            opacity={opacity}
            latestProgressRef={progressRef}
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
    </div>
  );
}

/** Shared bottom section: RECRUITE + Overlay7 + Footer */
export default function PageBottom({ hideRecruit = false }: { hideRecruit?: boolean }) {
  const overlay7Src = riveConfig.overlay7
    ? buildRiveSrc(riveConfig.overlay7.fileName)
    : null;

  return (
    <>
      {/* RECRUITE セクション */}
      {!hideRecruit && (
        <div className="self-stretch relative z-10 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Group_196.webp" alt="" className="w-full object-contain" />
        </div>
      )}

      {/* overlay7 */}
      {overlay7Src && riveConfig.overlay7 && (
        <Overlay7ScrollSection src={overlay7Src} />
      )}

      {/* Footer */}
      <footer
        className="w-full bg-white flex flex-col items-start pt-5 pb-[50px] box-border gap-[50px] text-left relative z-10"
        style={{ color: "#000", fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: 30, marginTop: "-40vh" }}
      >
        <div className="self-stretch flex items-start justify-between pl-[30px] pr-[150px] gap-5">
          {/* Left: Logo + tagline */}
          <div className="flex flex-col items-start justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.webp" alt="Peter Pan - ジレンマを遊び心で超えていく。" style={{ width: 430, height: "auto" }} />
          </div>
          {/* Right: Nav links */}
          <div className="flex items-start pt-[30px] gap-[15px]" style={{ fontSize: 14, fontFamily: "Syncopate, sans-serif" }}>
            <div className="flex flex-col items-start gap-[15px]">
              <Link href="/philosophy" className="relative no-underline text-inherit">PHILOSOPHY</Link>
              <Link href="/company" className="relative no-underline text-inherit">COMPANY</Link>
              <div className="flex flex-col items-start justify-between gap-[15px]">
                <div className="relative">SERVICE</div>
                <div className="self-stretch flex flex-col items-start gap-2.5" style={{ fontSize: 10, fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
                  <div className="self-stretch flex items-center gap-2.5">
                    <span style={{ display: "inline-block", width: 10, height: 1, backgroundColor: "#000" }} />
                    <Link href="/service-to-c" className="relative no-underline text-inherit">個人の方</Link>
                  </div>
                  <div className="self-stretch flex items-center gap-2.5">
                    <span style={{ display: "inline-block", width: 10, height: 1, backgroundColor: "#000" }} />
                    <Link href="/service-to-b" className="relative no-underline text-inherit">法人の方</Link>
                  </div>
                  <div className="self-stretch flex items-center gap-2.5">
                    <span style={{ display: "inline-block", width: 10, height: 1, backgroundColor: "#000" }} />
                    <Link href="/service-to-c" className="relative no-underline text-inherit">人材紹介会社様</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-[15px]">
              <Link href="/member" className="relative no-underline text-inherit">MEMBER</Link>
              <Link href="/column" className="relative no-underline text-inherit">Blog</Link>
              <div className="relative">RECRUIT</div>
              <Link href="/contact" className="relative no-underline text-inherit">CONTACT</Link>
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
    </>
  );
}
