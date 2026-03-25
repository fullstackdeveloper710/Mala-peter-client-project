"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRive, useViewModel, useViewModelInstance, Layout, Fit } from "@rive-app/react-webgl2";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { riveConfig } from "@/data/rive-input-config";
import PageBottom from "@/components/PageBottom";

/** Flow step component */
function FlowStep({
  number,
  title,
  description,
  isMobile,
}: {
  number: string;
  title: string;
  description: string;
  isMobile: boolean;
}) {
  return (
    <div className="flex-1 flex flex-col items-start justify-center isolate gap-[20px]">
      <div className="self-stretch flex flex-col items-start isolate z-[1]">
        <div className="flex items-center px-5 z-[1]">
          <div className="flex flex-col items-start gap-[3px]">
            <div
              className="flex flex-col items-center justify-center gap-0"
              style={{
                border: "1px solid #004345",
                backgroundColor: "#fff",
                padding: isMobile ? 8 : 10,
                fontSize: isMobile ? 8 : 10,
                color: "#004345",
                fontFamily: "Syncopate, sans-serif",
              }}
            >
              <div className="relative" style={{ lineHeight: isMobile ? "14px" : "16px" }}>FLOW</div>
              <div className="relative" style={{ fontSize: isMobile ? 18 : 24, lineHeight: isMobile ? "22px" : "28px" }}>{number}</div>
            </div>
          </div>
        </div>
        <div
          className="self-stretch flex flex-col items-center justify-center z-[0]"
          style={{
            backgroundColor: "#004345",
            padding: isMobile ? "25px 20px" : "40px 30px",
            marginTop: isMobile ? -15 : -20,
            fontSize: isMobile ? 18 : 24,
            color: "#fff",
            fontFamily: "'Zen Kaku Gothic New', sans-serif",
            textAlign: "center",
          }}
        >
          <div className="relative" style={{ lineHeight: isMobile ? "28px" : "36px" }}>{title}</div>
        </div>
      </div>
      <div
        className="relative font-medium z-[0]"
        style={{
          fontSize: isMobile ? 12 : 14,
          fontFamily: "'Zen Kaku Gothic New', sans-serif",
          color: "#21202a",
        }}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}

/** FAQ item with expandable answer */
function FaqItem({ question, answer, isMobile }: { question: string; answer: string; isMobile: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="self-stretch"
        style={{ height: 1, backgroundColor: "#004345", opacity: 0.2 }}
      />
      <button
        type="button"
        className="self-stretch flex items-center justify-between gap-5 bg-transparent border-none p-0 cursor-pointer text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex-1 flex items-center gap-5">
          <div
            className="relative font-medium"
            style={{ fontSize: isMobile ? 18 : 24, color: "#004345" }}
          >
            Q
          </div>
          <div
            className="flex-1 relative font-medium"
            style={{ fontSize: isMobile ? 16 : 24, color: "#004345" }}
          >
            {question}
          </div>
        </div>
        <svg
          width={isMobile ? 16 : 20}
          height={isMobile ? 16 : 20}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
        >
          <path d="M5 8L10 13L15 8" stroke="#004345" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="self-stretch flex items-start gap-5">
          <div
            className="relative font-medium"
            style={{ fontSize: isMobile ? 18 : 24, color: "#004345" }}
          >
            A
          </div>
          <div
            className="flex-1 relative font-medium"
            style={{ fontSize: isMobile ? 14 : 24, color: "#004345" }}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      )}
    </>
  );
}

/** Feature card (01/02/03 summary cards) */
function FeatureCard({
  number,
  title,
  points,
  isMobile,
}: {
  number: string;
  title: string;
  points: string[];
  isMobile: boolean;
}) {
  const isEnd = number === "01" || number === "03";
  const imgSize = isMobile ? (number === "01" ? 400 : number === "02" ? 350 : 300) : (number === "01" ? 1096 : number === "02" ? 961.5 : 863.9);
  const imgTop = isMobile ? (number === "01" ? 20 : number === "02" ? 50 : 60) : (number === "01" ? 67 : number === "02" ? 200 : 232);
  const imgLeft = isMobile ? (number === "01" ? -200 : number === "03" ? -150 : -150) : (number === "01" ? -547 : number === "03" ? -309 : -309);
  const imgShift = isMobile ? (number === "01" ? 50 : 0) : (number === "01" ? 200 : 0);

  return (
    <div
      className={`flex-none sm:flex-1  bg-white overflow-hidden flex flex-col ${isEnd ? "items-end" : "items-start"} justify-between relative isolate self-stretch`}
      style={{ padding: number === "02" ? "15px 15px 100px" : 15, gap: number === "02" ? 50 : 20 }}
    >
      <div
        className="absolute z-[0] overflow-hidden flex items-center justify-center"
        style={{ top: imgTop, left: imgLeft, width: imgSize, height: imgSize }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/書き出し画像/Service%20-%20to%20C%20候補者/%20webP/service_toC-${number}.webp`}
          alt=""
          className="w-full h-full object-cover absolute"
          style={{ left: imgShift, top: 0, transform: "scale(1)" }}
        />
      </div>
      <div className="self-stretch flex flex-col items-start z-[1]">
        <div
          className="relative"
          style={{
            fontSize: isMobile ? "clamp(60px, 8vw, 154px)" : 154,
            fontFamily: "Syncopate, sans-serif",
            color: "#004345",
            letterSpacing: "-0.1em",
            lineHeight: 0.9,
          }}
        >
          {number}
        </div>
        <div
          className="relative font-medium"
          style={{ fontSize: isMobile ? "clamp(20px, 3vw, 35px)" : 35, fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
      <div className="flex flex-col items-start gap-[20px] z-[2]" style={{ fontSize: isMobile ? 12 : 14, fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
        {points.map((p, i) => (
          <div key={i} className="relative font-medium" dangerouslySetInnerHTML={{ __html: p }} />
        ))}
      </div>
    </div>
  );
}

/** Career advisor card */
function AdvisorCard({ role, name, image, isMobile }: { role: string; name: string; image: string; isMobile: boolean }) {
  return (
    <div
      className="flex flex-col items-start justify-center gap-2.5"
      style={{
        width: isMobile ? "100%" : 300,
        fontFamily: "'Zen Kaku Gothic New', sans-serif",
        fontSize: isMobile ? 12 : 14,
        color: "#004345"
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={name}
        className="object-cover"
        style={{
          width: isMobile ? "100%" : 300,
          height: isMobile ? "auto" : 300,
          maxHeight: isMobile ? 250 : undefined
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/arrow_2.svg" alt="" style={{ width: isMobile ? 12 : 15, height: isMobile ? 12 : 15 }} />
      <div className="self-stretch flex items-end justify-between gap-5">
        <div className="flex flex-col items-start justify-end gap-0">
          <div className="relative font-medium leading-tight" style={{ fontSize: isMobile ? 12 : "inherit" }}>{role}</div>
          <div className="relative text-[35px] font-medium text-black leading-tight" style={{ fontSize: isMobile ? "clamp(20px, 4vw, 35px)" : 35 }}>{name}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/arrow.svg"
          alt=""
          style={{
            width: isMobile ? 35 : 49,
            height: isMobile ? 35 : 49
          }}
        />
      </div>
    </div>
  );
}

/** LINE consultation card */
function LineCard({
  title,
  description,
  isMobile,
}: {
  title: string;
  description: string;
  isMobile: boolean;
}) {
  return (
    <div className={`relative isolate ${isMobile ? "w-full" : "w-1/3"}`}>
      {/* Border shape using Vector (9).svg */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Vector (9).svg"
        alt=""
        className="absolute z-[0]"
        style={{
          pointerEvents: "none",
          width: "100%",
          height: isMobile ? "250px" : "300px",
          top: "-5%"
        }}
      />
      <div className="self-stretch flex flex-col items-start p-[50px] box-border gap-[20px] z-[1] pb-5 w-full" style={{ padding: isMobile ? "30px 25px" : "50px" }}>
        <div className="flex items-center justify-between relative isolate gap-[20px]">
          <div className="flex flex-col items-start justify-center gap-4 z-[0] shrink-0 w-full" >
            <div
              className="relative font-medium"
              style={{ fontSize: isMobile ? 20 : 24, color: "#004345" }}
            >
              {title}
            </div>
            <div
              className="relative"
              style={{ fontSize: isMobile ? 12 : 14, color: "#004345" }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/書き出し画像/Service - to C 候補者/png/icon.png"
            alt=""
            style={{
              width: isMobile ? 100 : 130,
              height: "auto",
              flexShrink: 0,
              display: isMobile ? "none" : "block"
            }}
          />
        </div>
        <div
          className="flex items-center justify-between gap-5 cursor-pointer opacity-90 transition-opacity"
          style={{
            borderRadius: 500,
            backgroundColor: "#06c755",
            padding: isMobile ? "10px 20px" : "12px 30px",
            fontSize: isMobile ? 14 : 16,
            color: "#fff",
            width: "100%"
          }}
        >
          <div className="relative font-medium">無料でLINEで相談</div>
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 6L20 14L10 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const layoutCover = new Layout({ fit: Fit.Cover });
const layoutFit = new Layout({ fit: Fit.Layout });
const HERO_SCALE = 150;

function buildRiveSrc(fileName: string): string {
  const i = fileName.indexOf("/");
  if (i === -1) return `/rive/${encodeURIComponent(fileName)}`;
  const folder = fileName.slice(0, i);
  const name = fileName.slice(i + 1);
  return `/rive/${folder}/${encodeURIComponent(name)}`;
}

/** 転職支援テキストアニメーション */
function RiveTextOverlay() {
  const src = useMemo(() => buildRiveSrc("peterpan/toc_text.riv"), []);
  const { RiveComponent } = useRive({
    src,
    autoplay: true,
    layout: new Layout({ fit: Fit.Layout }),
  });
  return (
    <div className="absolute inset-0 w-full h-full">
      <RiveComponent className="w-full h-full" style={{ touchAction: "pan-y" }} />
    </div>
  );
}

export default function ServiceToCPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Hero: service_to_c.riv (scroll-driven)
  const heroSrc = useMemo(() => buildRiveSrc("peterpan/service_to_c.riv"), []);
  const heroProgressRef = useRef(0);
  const heroStateNumRef = useRef<{ value: number } | null>(null);

  const { rive: heroRive, RiveComponent: HeroRiveComponent } = useRive({
    src: heroSrc,
    artboard: "main",
    stateMachines: "stateMachine",
    autoplay: true,
    autoBind: true,
    layout: layoutFit,
  });

  const heroViewModel = useViewModel(heroRive, { name: "ViewModel2" });
  const heroVMInstance = useViewModelInstance(heroViewModel, { rive: heroRive, useDefault: true });

  useEffect(() => {
    if (!heroVMInstance) {
      heroStateNumRef.current = null;
      return;
    }
    try {
      heroStateNumRef.current = heroVMInstance.number("stateNum") ?? null;
    } catch {
      heroStateNumRef.current = null;
    }
  }, [heroVMInstance]);

  const heroSectionRef = useScrollProgress(
    (p) => { heroProgressRef.current = p; },
    { smooth: 0, pauseWhenOffScreen: false }
  );

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const value = heroProgressRef.current * HERO_SCALE;
      const prop = heroStateNumRef.current;
      if (prop) prop.value = value;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // TOC sections
  const cfg = riveConfig.toc;
  const cfg01 = riveConfig.toc01;
  const cfg02 = riveConfig.toc02;
  const cfg03 = riveConfig.toc03;
  const cfgWhite = riveConfig.tocWhiteLine;

  const src = useMemo(() => (cfg ? buildRiveSrc(cfg.fileName) : null), [cfg]);
  const src01 = useMemo(() => (cfg01 ? buildRiveSrc(cfg01.fileName) : null), [cfg01]);
  const src02 = useMemo(() => (cfg02 ? buildRiveSrc(cfg02.fileName) : null), [cfg02]);
  const src03 = useMemo(() => (cfg03 ? buildRiveSrc(cfg03.fileName) : null), [cfg03]);
  const srcWhite = useMemo(() => (cfgWhite ? buildRiveSrc(cfgWhite.fileName) : null), [cfgWhite]);

  const [scrollProgress, setScrollProgress] = useState(0);

  const { RiveComponent } = useRive(
    src && cfg
      ? { src, artboard: cfg.artboard, stateMachines: cfg.stateMachineName, autoplay: true, layout: layoutCover }
      : undefined
  );
  const { RiveComponent: RiveComponent01 } = useRive(
    src01 && cfg01
      ? { src: src01, artboard: cfg01.artboard, stateMachines: cfg01.stateMachineName, autoplay: true, layout: layoutCover }
      : undefined
  );
  const { RiveComponent: RiveComponent02 } = useRive(
    src02 && cfg02
      ? { src: src02, artboard: cfg02.artboard, stateMachines: cfg02.stateMachineName, autoplay: true, layout: layoutCover }
      : undefined
  );
  const { RiveComponent: RiveComponent03 } = useRive(
    src03 && cfg03
      ? { src: src03, artboard: cfg03.artboard, stateMachines: cfg03.stateMachineName, autoplay: true, layout: layoutCover }
      : undefined
  );
  const { RiveComponent: RiveComponentWhite } = useRive(
    srcWhite && cfgWhite
      ? { src: srcWhite, artboard: cfgWhite.artboard, stateMachines: cfgWhite.stateMachineName, autoplay: true, layout: layoutCover }
      : undefined
  );

  const section23Ref = useScrollProgress(
    (p) => setScrollProgress(p),
    { smooth: 0.25, pauseWhenOffScreen: false }
  );

  const section2Progress = Math.min(1, scrollProgress * 2);
  const section3Progress = scrollProgress <= 0.5 ? 0 : Math.min(1, (scrollProgress - 0.5) * 2);

  const riveStyle = { width: "100%", height: "100%", minWidth: "100%", minHeight: "100%", objectFit: "cover" as const, objectPosition: "center" as const, touchAction: "pan-y" as const };

  return (
    <div
      className="w-full min-h-screen bg-white text-left"
      style={{
        color: "#000",
        fontFamily: "'Zen Kaku Gothic New', sans-serif",
        fontSize: isMobile ? 16 : 35
      }}
    >
      {/* Hero: service_to_c.riv (scroll-driven) */}
      <section
        ref={heroSectionRef as React.RefObject<HTMLElement>}
        className="relative w-full bg-white"
        style={{ height: isMobile ? "300vh" : "600vh", minHeight: isMobile ? "300vh" : "600vh" }}
      >
        <div className="sticky top-0 w-full h-screen">
          {HeroRiveComponent ? (
            <HeroRiveComponent
              className="w-full h-full canva relative"
              style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">読み込み中…</div>
          )}
        </div>
      </section>

      {/* 転職支援カード: image + toc_text.riv */}
      <div className="relative w-full flex items-stretch" style={{
        height: isMobile ? "auto" : "85vh",
        backgroundImage: "url('/Rectangle-271.webp')",
        paddingBottom: isMobile ? "3rem" : "5rem",
        flexDirection: isMobile ? "column" : "row"
      }}>
        {/* Left: Rive text animation */}
        <div className={`${isMobile ? "w-full" : "w-1/4"} relative`} style={{
          bottom: isMobile ? "0" : "6rem",
          left: isMobile ? "0" : "6rem",
          zIndex: "5",
          marginBottom: isMobile ? "2rem" : "0",
          height: isMobile ? "200px" : "auto"
        }}>
          <RiveTextOverlay />
        </div>
        {/* Right: Image */}
        <div className={`${isMobile ? "w-full" : "w-3/4"} relative`} style={{
          top: isMobile ? "0" : "3rem"
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/書き出し画像/Service - to C 候補者/ webP/service_to_C_Careerchangesupport.webp"
            alt="転職支援"
            className="w-full h-full object-contain"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* セクション2+3: toc_01 → 02 slides up → 03 slides up */}
      <div
        ref={section23Ref as React.RefObject<HTMLDivElement>}
        className="relative w-full pt-20"
        style={{ height: "400vh", minHeight: "400vh" }}
      >
        <div
          className="sticky top-0 bg-white overflow-hidden"
          style={{ width: "100vw", height: "100vh", minWidth: "100%", minHeight: "100vh" }}
        >
          {/* Base: toc_01 */}
          <div className="absolute inset-0 w-full h-full bg-white" style={{ minHeight: "100vh" }}>
            {RiveComponent01 ? (
              <RiveComponent01 className="w-full h-full" style={riveStyle} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">toc_01 読み込み中…</div>
            )}
          </div>
          {/* toc_02 slides up in first half */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none bg-white"
            style={{ minHeight: "100vh", transform: `translateY(${(1 - section2Progress) * 100}%)`, willChange: "transform" }}
          >
            {RiveComponent02 ? (
              <RiveComponent02 className="w-full h-full" style={riveStyle} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">toc_02 読み込み中…</div>
            )}
          </div>
          {/* toc_03 slides up in second half */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none bg-white"
            style={{ minHeight: "100vh", transform: `translateY(${(1 - section3Progress) * 100}%)`, willChange: "transform" }}
          >
            {RiveComponent03 ? (
              <RiveComponent03 className="w-full h-full" style={riveStyle} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">toc_03 読み込み中…</div>
            )}
          </div>
        </div>
      </div>


      {/* Three summary cards on dark teal background */}
      <div
        className={`w-full ${isMobile ? "flex-col" : "flex-row"} flex items-start gap-[30px] flex-wrap`}
        style={{ backgroundColor: "#004345", padding: isMobile ? "30px 20px" : 50, height: isMobile ? "auto" : "auto" }}
      >
        <FeatureCard
          number="01"
          title="ピーターパンの<br/>強みは<br/>ここにあります。"
          points={[
            "お客様からのご紹介だけで<br/>成り立っています",
            "転職先のご紹介からではなく<br/>キャリア設計から一緒にします",
            "辞退や年収交渉など<br/>企業側に言いにくことも対応します",
          ]}
          isMobile={isMobile}
        />
        <FeatureCard
          number="02"
          title="ピーターパンは、<br/>あなたの<br/>人生に本気です。"
          points={[
            "時に厳しいことも<br/>本気だから伝えます",
            "ワクワクする未来に挑戦する<br/>あなたの味方です",
            "あなたの個性や<br/>想いを尊重します",
          ]}
          isMobile={isMobile}
        />
        <FeatureCard
          number="03"
          title="こんな気持ちを<br/>抱えたあなたの、<br/>背中を押します。"
          points={[
            "もっと挑戦的で<br/>ワクワクする生き方をしたい",
            "挑戦はしたいけど<br/>この先に不安がある",
            "何かしたい気持ちはあるけど<br/>やりたいことが定まっていない",
          ]}
          isMobile={isMobile}
        />
      </div>

      {/* CAREER ADVISOR section */}
      <div
        className="self-stretch flex flex-col items-center"
        style={{ backgroundImage: "url('/Rectangle-271.webp')" }}
      >
        <div className="overflow-hidden flex flex-col items-start gap-1" style={{ padding: "16px 10px 0" }}>
          <div
            className="relative"
            style={{
              fontSize: "clamp(55px, 16vw, 272px)",
              lineHeight: isMobile ? "80px" : "182px",
              fontFamily: "Syncopate, sans-serif",
              color: "#004345",
            }}
          >
            CAREER <br /> ADVISOR
          </div>
          <div
            className="relative font-medium text-center"
            style={{ fontSize: 24, color: "#004345" }}
          >
            キャリアアドバイザーを知る
          </div>
        </div>

        {/* Advisor cards */}
        <div
          className={`self-stretch ${isMobile ? "flex-col" : "flex-row"} flex items-center ${isMobile ? "items-stretch" : "justify-center"} gap-[${isMobile ? 30 : 50}px]`}
          style={{ padding: isMobile ? "50px 20px" : "75px 0 100px" }}
        >
          <div className="transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] cursor-pointer">
            <AdvisorCard role="キャリアアドバイザー" name="山田 太郎" image="/書き出し画像/Service%20-%20to%20C%20候補者/%20webP/ca_01.webp" isMobile={isMobile} />
          </div>
          <div className="transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] cursor-pointer">
            <AdvisorCard role="キャリアアドバイザー" name="山田 太郎" image="/書き出し画像/Service%20-%20to%20C%20候補者/%20webP/ca_02.webp" isMobile={isMobile} />
          </div>
          <div className="transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] cursor-pointer">
            <AdvisorCard role="キャリアアドバイザー" name="山田 太郎" image="/書き出し画像/Service%20-%20to%20C%20候補者/%20webP/ca_03.webp" isMobile={isMobile} />
          </div>
        </div>

        {/* Member page link */}
        <div
          className="flex items-center justify-center"
          style={{
            border: "3px solid #004345",
            backgroundColor: "#fff",
            fontSize: isMobile ? 18 : 24,
            color: "#004345",
            marginBottom: isMobile ? 50 : 100,
          }}
        >
          <div className="flex-1 flex items-center justify-center" style={{ padding: isMobile ? "5px 20px" : "7px 30px" }}>
            <div className="relative font-medium" style={{ lineHeight: isMobile ? "28px" : "36px" }}>メンバーページへ</div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/arrow.svg"
            alt=""
            style={{
              width: isMobile ? 40 : 50,
              height: isMobile ? 40 : 50,
              marginRight: "-2px",
              borderLeft: "2px solid #004345",
              borderTop: "2px solid #004345"
            }}
          />
        </div>
      </div>

      {/* FLOW section */}
      <div className="self-stretch flex flex-col items-center text-center" style={{ backgroundImage: "url('/Rectangle-271.webp')" }}>
        <div className="flex flex-col items-start gap-1" style={{ padding: "0 0 0" }}>


          <div
            className="relative font-syncopate text-[#004345] leading-[1] sm:leading-[0.8] text-[100px] sm:text-[408px]"
            style={{

              fontFamily: "Syncopate, sans-serif",

            }}
          >
            FLOW
          </div>
          <div
            className="relative font-medium"
            style={{ fontSize: isMobile ? 18 : 24, color: "#004345", marginTop: isMobile ? "-1rem" : "-2rem" }}
          >
            支援フロー
          </div>
        </div>

        {/* Flow steps */}
        <div
          className="self-stretch flex flex-col items-center justify-center text-left"
          style={{ padding: isMobile ? "50px 20px" : "75px 100px 100px" }}
        >
          <div
            className="w-full bg-white flex flex-col items-center justify-center gap-[30px] box-border"
            style={{ borderRadius: 10, padding: isMobile ? 30 : 50, maxWidth: 1293 }}
          >
            {/* Row 1: steps 01-03 */}
            <div className={`self-stretch ${isMobile ? "flex-col" : "flex-row"} flex items-center gap-[15px]`}>
              <FlowStep
                number="01"
                title="ご紹介"
                description="LINEグループにて初回面談の日程を<br/>決定させていただきます。"
                isMobile={isMobile}
              />
              {!isMobile && (
                <img src="/書き出し画像/Service%20-%20to%20C%20候補者/%20webP/Vector%20(10).svg" alt="" className="shrink-0" style={{ width: 21, height: 27 }} />
              )}
              <FlowStep
                number="02"
                title="初回面談"
                description="今回の転職相談の背景や、今後の目指したい<br/>姿をざっくばらんにお聞かせください！"
                isMobile={isMobile}
              />
              {!isMobile && (
                <img src="/書き出し画像/Service%20-%20to%20C%20候補者/%20webP/Vector%20(10).svg" alt="" className="shrink-0" style={{ width: 21, height: 27 }} />
              )}
              <FlowStep
                number="03"
                title="企業提案"
                description="初回面談で取り決めた転職軸を元に、<br/>1社5分ほどかけてご説明させていただきます！"
                isMobile={isMobile}
              />
            </div>
            {/* Row 2: steps 04-06 */}
            <div className={`self-stretch ${isMobile ? "flex-col" : "flex-row"} flex items-center gap-[15px]`}>
              <FlowStep
                number="04"
                title="応募書類作成"
                description="履歴書や職務経歴書など必要な書類は<br/>弊社で作成いたします！"
                isMobile={isMobile}
              />
              {!isMobile && (
                <img src="/書き出し画像/Service%20-%20to%20C%20候補者/%20webP/Vector%20(10).svg" alt="" className="shrink-0" style={{ width: 21, height: 27 }} />
              )}
              <FlowStep
                number="05"
                title="内定獲得支援"
                description="条件交渉や、採用に至るまでのサポートを<br/>行います。面接対策なども選考企業ごとに<br/>実施もします！"
                isMobile={isMobile}
              />
              {!isMobile && (
                <img src="/書き出し画像/Service%20-%20to%20C%20候補者/%20webP/Vector%20(10).svg" alt="" className="shrink-0" style={{ width: 21, height: 27 }} />
              )}
              <FlowStep
                number="06"
                title="キャリア相談"
                description="内定後に実際に歩みたいキャリアも元に、<br/>ご面談をさせていただきます！"
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      </div>

      {/* セクション4: toc_whiteline.riv */}
      <div className="relative w-full" style={{ height: "200vh", minHeight: "200vh" }}>
        <div
          className="sticky top-0"
          style={{ width: "100vw", height: "100vh", minWidth: "100%", minHeight: "100vh", backgroundImage: "url('/書き出し画像/top/WebP/top_bg02.webp'),url('/書き出し画像/top/WebP/top_bg01.webp')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
          {RiveComponentWhite ? (
            <RiveComponentWhite className="w-full h-full" style={riveStyle} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">toc_whiteline 読み込み中…</div>
          )}
        </div>
      </div>

      {/* SPECIAL SUPPORT section */}
      <div
        className="w-full overflow-hidden flex flex-col items-center justify-center"
        style={{ backgroundImage: "url('/Rectangle-271.webp')", paddingBottom: "5rem" }}
      >
        <div className="self-stretch flex flex-col">
          {/* Title */}
          <div className={`flex ${isMobile ? "flex-col" : "flex-row"} items-center gap-[${isMobile ? "20" : "50"}px]`} style={{ marginTop: "-1px" }}>
            <div
              className="relative overflow-hidden"
              style={{
                fontFamily: "Syncopate, sans-serif",
                fontSize: isMobile ? "clamp(40px, 8vw, 132px)" : "clamp(60px, 9vw, 132px)",
                lineHeight: isMobile ? "60px" : "106px",
                isolation: "isolate",
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              >
                <source src="/rive/peterpan/250129_PP_water surface_06 (3).webm" type="video/webm" />
              </video>
              <div
                className="relative"
                style={{ background: "#edf9ff", color: "#000", mixBlendMode: "screen" }}
              >
                SPECIAL<br />SUPPORT
              </div>
            </div>
            <div
              className="flex flex-col items-center justify-center"
              style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: isMobile ? 18 : 24, paddingRight: isMobile ? 20 : 50 }}
            >
              <div className="w-full flex flex-col items-start justify-center max-w-full">
                <div className="bg-white flex items-center justify-center" style={{ padding: "10px 15px" }}>
                  <div className="relative font-medium" style={{ fontSize: isMobile ? 14 : "inherit" }}>通常はご紹介のみのご支援ですが</div>
                </div>
                <div className="bg-white flex items-center justify-center" style={{ padding: "10px 15px" }}>
                  <div className="relative font-medium" style={{ fontSize: isMobile ? 14 : "inherit" }}>このページを見つけてくれた方には</div>
                </div>
              </div>
            </div>
          </div>

          {/* LINE cards */}
          <div
            className={`self-stretch ${isMobile ? "flex-col" : "flex-row"} flex items-center ${isMobile ? "items-stretch" : "justify-center"} gap-[${isMobile ? "20" : "50"}px]`}
            style={{ padding: isMobile ? "30px 20px" : 50, fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
          >
            <LineCard
              title="転職相談"
              description="転職したい<br/>自分に合った仕事を見つけたい"
              isMobile={isMobile}
            />
            <LineCard
              title="お悩み相談"
              description="はっきりしてないけど話してみたい<br/>想いを誰かに聞いて欲しい"
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div
        className="self-stretch bg-white flex flex-col items-center gap-[50px]"
        style={{ padding: isMobile ? "50px 20px" : 100, fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
      >
        <div className="relative font-medium" style={{ fontSize: isMobile ? 28 : 35, color: "#000" }}>よくあるご質問</div>
        <div className="self-stretch flex flex-col items-center justify-center gap-[30px]" style={{ maxWidth: 1166, margin: "0 auto", width: "100%" }}>
          <FaqItem
            question="未経験でも転職できますか？"
            answer="はい、可能です。未経験からでも挑戦できる求人は多くあります。<br/>特に営業・販売・ITサポートなどは未経験歓迎の求人が多いです。<br/>これまでのご経験の中で活かせるスキルを整理しながら、未経験でも通過しやすい企業をご紹介します。"
            isMobile={isMobile}
          />
          <FaqItem
            question="転職するなら今のタイミングがベストですか？"
            answer="基本的に「転職したいと思ったタイミング」が一番良いです。<br/>ただし企業の採用は4〜6月、9〜11月が活発な傾向があります。<br/>まずは市場にどんな求人があるか確認してから判断するのがおすすめです。"
            isMobile={isMobile}
          />
          <FaqItem
            question="今の年収より上げることはできますか？"
            answer="可能です。年収アップは業界・職種・経験年数によって変わります。<br/>まずは現在の経験でどのくらいの年収レンジが狙えるかを一緒に整理していきましょう。"
            isMobile={isMobile}
          />
          <FaqItem
            question="自分に向いている仕事がわかりません"
            answer="多くの方が同じ悩みを持っています。<br/>これまでの経験や価値観を一緒に整理しながら、向いている仕事を見つけていきましょう。"
            isMobile={isMobile}
          />
          <FaqItem
            question="転職回数が多いのですが大丈夫ですか？"
            answer="転職回数だけで判断されることは少なく、<br/>「なぜ転職したのか」「次は長く働けそうか」が見られます。<br/>面接で納得感のある説明ができれば問題ないケースも多いので、対策も一緒に考えましょう。"
            isMobile={isMobile}
          />
          <FaqItem
            question="今の会社にバレませんか？"
            answer="はい、基本的にバレることはありません。<br/>企業側には個人情報を伏せた状態で推薦することもできますし、<br/>応募のタイミングもご本人の許可をいただいてから進めます。"
            isMobile={isMobile}
          />
          <FaqItem
            question="どのくらいで転職できますか？"
            answer="平均すると1〜2ヶ月で決まる方が多いです。<br/>一般的な流れは、面談→求人紹介→応募・面接→内定<br/>という形で進みます。<br/>早い方だと2〜3週間で内定が出るケースもあります。"
            isMobile={isMobile}
          />
          <FaqItem
            question="書類の書き方がわかりません"
            answer="ご安心ください。<br/>履歴書や職務経歴書は添削サポートをしています。<br/>企業がどこを見ているかを踏まえて修正すると、通過率が上がるケースが多いです。"
            isMobile={isMobile}
          />
          <FaqItem
            question="面接が苦手です"
            answer="面接が得意な方は少ないので大丈夫です。<br/>よく聞かれる質問や回答の作り方、話し方のポイントを事前にお伝えします。<br/>希望があれば模擬面接もできます。"
            isMobile={isMobile}
          />
          <FaqItem
            question="相談だけでも大丈夫ですか？"
            answer="もちろん大丈夫です。<br/>まずは転職市場の情報収集として相談される方も多いです。<br/>無理に転職をすすめることはないので、気軽にご相談ください。"
            isMobile={isMobile}
          />
          <div className="self-stretch" style={{ height: 1, backgroundColor: "#004345", opacity: 0.2 }} />
        </div>
      </div>

      <PageBottom hideRecruit={true} />
    </div>
  );
}
