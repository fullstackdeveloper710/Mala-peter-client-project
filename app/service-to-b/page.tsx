"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useRive, useViewModel, useViewModelInstance, Layout, Fit } from "@rive-app/react-webgl2";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import VideoFilledText from "@/components/VideoFilledText";
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

/** tob_people_and_white_line_1 a セクション */
function TobPeopleSection({ source, bg, style, riveStyle }: { source: string; bg: string | string[]; style?: React.CSSProperties; riveStyle?: React.CSSProperties }) {
  const src = useMemo(() => buildRiveSrc(source), [source]);
  const { RiveComponent } = useRive({
    src,
    artboard: "landscapeCharacter",
    autoplay: true,
    layout: new Layout({ fit: Fit.Layout }),
  });
  const bgs = Array.isArray(bg) ? bg : [bg];
  const bgStyle = {
    backgroundImage: bgs.map((b) => `url('${b}')`).join(", "),
    backgroundSize: bgs.map(() => "cover").join(", "),
    backgroundPosition: bgs.map(() => "center").join(", "),
  };
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9", ...bgStyle, ...style }}>
      <div className="absolute inset-0" style={riveStyle}>
        <RiveComponent className="w-full h-full" style={{ touchAction: "pan-y" }} />
      </div>
    </div>
  );
}

/** LINE consultation card */
function LineCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-start relative isolate gap-[50px]">
      <div className="absolute inset-0 z-[0]" style={{ backgroundColor: "#f0f0f0", borderRadius: 10 }} />
      <div className="self-stretch flex flex-col items-start p-[50px] box-border gap-[50px] z-[1]">
        <div className="flex flex-col items-start justify-center gap-8 z-[0] shrink-0">
          <div className="relative font-medium" style={{ fontSize: 40, color: "#004345" }}>{title}</div>
          <div className="relative font-medium" style={{ fontSize: 20, color: "#004345" }} dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        <div
          className="self-stretch flex items-center justify-between gap-5"
          style={{ borderRadius: 500, backgroundColor: "#06c755", padding: "20px 50px", fontSize: 24, color: "#fff" }}
        >
          <div className="relative font-medium">無料でLINEで相談</div>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 6L20 14L10 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function ServiceToBPage() {
  const src = useMemo(() => buildRiveSrc("peterpan/service_to_b.riv"), []);
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
      style={{ color: "#000", fontFamily: "Syncopate, sans-serif", fontSize: 50 }}
    >
      {/* Hero: scroll-driven service_to_b.riv */}
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

      {/* 人材紹介 section */}
      <div
        className="self-stretch flex flex-col items-start justify-center relative isolate"
        style={{
          height: 768,
          padding: "0 100px",
          fontSize: 40,
          fontFamily: "'Zen Kaku Gothic New', sans-serif",
          backgroundImage: "url('/Rectangle-271.webp')",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/書き出し画像/Service%20-%20to%20B採用企業/webP/service-toB.webp"
          alt=""
          className="absolute z-[0]"
          style={{ top: 50, right: 50, maxWidth: "55%", height: "auto" }}
        />
        <div className="flex flex-col items-start gap-[33px] z-[1]">
          <div className="relative font-medium" style={{ fontSize: 24, color: "#004345" }}>人材紹介</div>
          <div className="bg-white flex items-center">
            <div className="relative font-medium">&quot;人&quot;の未来に</div>
          </div>
          <div className="bg-white flex items-center">
            <div className="relative font-medium">本気で寄り添い</div>
          </div>
          <div className="bg-white flex items-center">
            <div className="relative font-medium">採用を最大化する支援</div>
          </div>
        </div>
      </div>

      {/* Candidate × Company diagram */}
      <div
        className="self-stretch flex items-center justify-center"
        style={{ backgroundImage: "url('/Rectangle-271.webp')", padding: "50px 100px" }}
      >
        <div
          className="w-full bg-white flex flex-col items-center justify-between box-border relative"
          style={{ borderRadius: 20, padding: 50, maxWidth: 1166, height: 632 }}
        >
          {/* Title */}
          <div
            className="relative font-medium text-center"
            style={{ fontSize: 35, fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
          >
            人と企業を理解するから、<br />本質的なご紹介を実現。
          </div>

          {/* Diagram area */}
          <div className="w-full flex items-center justify-center relative" style={{ height: 426 }}>
            {/* Background circles image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/書き出し画像/Service%20-%20to%20B採用企業/webP/Frame%201201%20(1).webp"
              alt=""
              className="absolute"
              style={{ maxWidth: "115%", height: "auto" }}
            />
            {/* Central Venn diagram image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/書き出し画像/Service%20-%20to%20B採用企業/webP/Frame%201201.webp"
              alt=""
              className="relative z-[1]"
              style={{ maxWidth: "115%", height: "auto" }}
            />
          </div>

        </div>
      </div>

      {/* FEATURES section */}
      <div className="self-stretch flex flex-col items-center" style={{ backgroundImage: "url('/Rectangle-271.webp')" }}>
        <div className="flex flex-col items-start gap-5" style={{ padding: "50px 0 0" }}>
          <div
            className="relative"
            style={{ fontSize: "clamp(80px, 16vw, 242px)", lineHeight: "160px", fontFamily: "Syncopate, sans-serif", color: "#000" }}
          >
            FEATURES
          </div>
          <div
            className="relative font-medium text-center"
            style={{ fontSize: 24, color: "#004345", fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
          >
            ピーターパンの特徴
          </div>
        </div>

        <div className="w-full flex items-center justify-center" style={{ padding: "50px 50px 100px" }}>
          <div
            className="flex-1 bg-white flex items-center justify-center gap-[50px] box-border"
            style={{ borderRadius: 20, padding: 50, maxWidth: 1266 }}
          >
            {/* Left: Frame 1118 image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/書き出し画像/Service%20-%20to%20B採用企業/webP/Frame%201118.webp"
              alt=""
              style={{ maxWidth: "50%", height: "auto" }}
            />

            {/* Right: Feature pills */}
            <div
              className="flex flex-col items-start gap-[15px]"
              style={{ fontSize: 24, color: "#fff", fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
            >
              <div className="flex items-center" style={{ borderRadius: 500, backgroundColor: "#004345", padding: "30px 50px", minHeight: 112 }}>
                <div className="relative font-medium" style={{ lineHeight: "120.3%" }}>
                  完全紹介のみで<br />毎月100~150名を集客
                </div>
              </div>
              <div className="flex items-center" style={{ borderRadius: 500, backgroundColor: "#004345", padding: "30px 50px", minHeight: 112 }}>
                <div className="relative font-medium">
                  早期退職率3%以下<br />
                  <span style={{ fontSize: 14 }}>※業界平均30%ほど</span>
                </div>
              </div>
              <div className="flex items-center" style={{ borderRadius: 500, backgroundColor: "#004345", padding: "30px 50px", minHeight: 112 }}>
                <div className="relative font-medium" style={{ lineHeight: "120.3%" }}>
                  企業様と候補者様の両方を<br />真摯に考えるメンバー
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* tob_people_and_white_line_1.riv */}
      <TobPeopleSection source="peterpan/tob_people_and_white_line_1.riv" bg="/書き出し画像/Service - to B採用企業/webP/recruitingadviser_bg.webp" riveStyle={{ left: "5rem" }}/>

      {/* RECRUITING ADVISOR */}
      <div
        className="self-stretch flex flex-col items-center"
        style={{ backgroundImage: "url('/Rectangle-271.webp')", fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
      >
        <div className="flex flex-col items-start">
          <div
            className="relative"
            style={{ fontSize: "clamp(80px, 16vw, 202px)", lineHeight: "160px", fontFamily: "Syncopate, sans-serif", color: "#000" }}
          >
            RECRUITING ADVISOR
          </div>
          <div
            className="relative font-medium"
            style={{ fontSize: 24, color: "#004345" }}
          >
            リクルーティングアドバイザーを知る
          </div>
        </div>

        <div
          className="flex items-start justify-center gap-[50px]"
          style={{ padding: "50px 50px 0" }}
        >
          {[
            { role: "CA", name: "駒沢 陸", image: "/書き出し画像/member/webp/member07.webp" },
            { role: "RA", name: "川口 未桜", image: "/書き出し画像/member/webp/member08.webp" },
            { role: "CA", name: "石毛 花佳", image: "/書き出し画像/member/webp/member04.webp" },
          ].map((m) => (
            <div
              key={m.name}
              className="flex flex-col items-start justify-center gap-2.5"
              style={{ width: 300, fontSize: 14, color: "#004345" }}
            >
              <Image
                className="w-[300px] relative max-h-full object-cover"
                src={m.image}
                width={300}
                height={300}
                sizes="300px"
                alt={m.name}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/arrow_2.svg" alt="" style={{ width: 15, height: 15 }} />
              <div className="self-stretch flex items-end justify-between gap-5">
                <div className="flex flex-col items-start justify-end gap-0">
                  <div className="relative font-medium leading-tight">{m.role}</div>
                  <div className="relative text-[35px] font-medium text-black leading-tight">{m.name}</div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/arrow.svg" alt="" style={{ width: 49, height: 49 }} />
              </div>
            </div>
          ))}
        </div>

        {/* メンバーページへ button */}
        <div className="flex items-center justify-center" style={{ padding: "50px 0 100px" }}>
          <a
            href="/member"
            className="flex items-center justify-center gap-5 no-underline"
            style={{
              borderRadius: 500,
              backgroundColor: "#004345",
              padding: "20px 50px",
              fontSize: 24,
              color: "#fff",
            }}
          >
            <span className="relative font-medium">メンバーページへ</span>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6L20 14L10 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* VOICE */}
      <div
        className="self-stretch flex flex-col items-center"
        style={{ backgroundImage: "url('/Rectangle-271.webp')", fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
      >
        <div className="flex flex-col">
          <div
            className="relative"
            style={{ fontSize: "410px", lineHeight: 1, fontFamily: "Syncopate, sans-serif", color: "#000" }}
          >
            VOICE
          </div>
          <div
            className="relative font-medium"
            style={{ fontSize: 24, color: "#004345", marginTop: "-5rem" }}
          >
            お客様の声
          </div>
        </div>

        <div
          className="self-stretch flex items-center justify-between gap-5"
          style={{ padding: "100px 50px" }}
        >
          {[
            { name: "M.Kさん", age: "28歳男性", career: "IT会社派遣社員→エンジニア正社員" },
            { name: "S.Tさん", age: "25歳女性", career: "飲食業→IT企業マーケティング" },
            { name: "Y.Hさん", age: "30歳男性", career: "営業職→Webエンジニア正社員" },
          ].map((v) => (
            <div
              key={v.name}
              className="flex-1 flex flex-col items-center justify-end isolate"
              style={{ height: 540 }}
            >
              {/* Header: name badge + avatar */}
              <div className="self-stretch flex items-start justify-between pr-[50px] gap-5 z-[1]">
                <div className="flex flex-col items-end justify-center gap-[5px]">
                  <div
                    className="flex flex-col items-start justify-center p-[15px] relative isolate gap-5"
                    style={{ fontSize: 20 }}
                  >
                    {/* Badge background */}
                    <div
                      className="absolute z-[0]"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 238,
                        height: 74,
                        backgroundColor: "#edf9ff",
                        border: "1px solid #004345",
                        borderRadius: 10,
                      }}
                    />
                    <div className="flex items-center gap-[15px] z-[1]">
                      <b className="relative" style={{ lineHeight: "36px" }}>{v.name}</b>
                      <b className="relative" style={{ fontSize: 10, lineHeight: "36px" }}>{v.age}</b>
                    </div>
                    <b className="relative z-[2]" style={{ fontSize: 14, lineHeight: "36px" }}>{v.career}</b>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/arrow_2.svg" alt="" style={{ width: 15, height: 15 }} />
                </div>
                <div className="flex items-center justify-center" style={{ height: 170, width: 66 }}>
                  <div className="relative" style={{ width: 116, height: 100 }}>
                    <div
                      className="absolute rounded-full overflow-hidden"
                      style={{ width: 50, height: 50, top: 0, left: "50%", transform: "translateX(-50%)", backgroundColor: "#ccc" }}
                    />
                    <div
                      className="absolute overflow-hidden"
                      style={{ width: 116, height: 55, bottom: 0, left: 0, backgroundColor: "#e0e0e0", borderRadius: "0 0 10px 10px" }}
                    />
                  </div>
                </div>
              </div>
              {/* Body: testimonial text */}
              <div
                className="self-stretch flex-1 bg-white flex items-center justify-center z-[0] relative"
                style={{ marginTop: -36, padding: "50px 30px", fontSize: 14 }}
              >
                <b className="self-stretch relative" style={{ lineHeight: "25px", width: 329 }}>
                  ダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキスト
                </b>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TobPeopleSection source="peterpan/tob_people_and_white_line_2.riv" bg={["/書き出し画像/top/WebP/top_bg02.webp", "/書き出し画像/top/WebP/member_bg.webp"]} riveStyle={{ left: "5rem" }} />
      {/* SPECIAL SUPPORT */}
      <div
        className="w-full overflow-hidden flex flex-col items-center justify-center"
        style={{ backgroundColor: "#edf9ff", fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
      >
        <div className="self-stretch flex flex-col items-center" style={{ padding: "50px 0" }}>
          {/* Title */}
          <div
            className="self-stretch flex items-end gap-[50px]"
            style={{ padding: "0 50px" }}
          >
            <VideoFilledText
              lines={["SPECIAL", "SUPPORT"]}
              imageSrc="/260120_preterpan_texture01.webp"
              bgColor="#edf9ff"
              style={{
                fontFamily: "Syncopate, sans-serif",
                fontSize: 121,
                lineHeight: "106px",
              }}
            />
            <div
              className="flex flex-col items-center justify-center"
              style={{ fontSize: 24, paddingRight: 50, paddingBottom: 10 }}
            >
              <div className="w-full flex flex-col items-start justify-center max-w-full">
                <div className="bg-white flex items-center justify-center" style={{ padding: "10px 15px" }}>
                  <div className="relative font-medium">通常はご紹介のみのご支援ですが</div>
                </div>
                <div className="bg-white flex items-center justify-center" style={{ padding: "10px 15px" }}>
                  <div className="relative font-medium">このページを見つけてくれた方には</div>
                </div>
                <div className="bg-white flex items-center justify-center" style={{ padding: "10px 15px" }}>
                  <div className="relative font-medium">特別にご支援します！</div>
                </div>
              </div>
            </div>
          </div>

          {/* LINE cards */}
          <div
            className="self-stretch flex items-center justify-center gap-[50px]"
            style={{ padding: 50, color: "#004345" }}
          >
            <LineCard
              title="転職相談"
              description="転職したい<br/>自分に合った仕事を見つけたい"
            />
            <LineCard
              title="お悩み相談"
              description="はっきりしてないけど話してみたい<br/>想いを誰かに聞いて欲しい"
            />
          </div>
        </div>
      </div>

      <PageBottom hideRecruit={true}/>
    </div>
  );
}
