"use client";

import { useEffect, useMemo, useRef } from "react";
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

/** Pill badge for the candidate/company diagram */
function PillBadge({ number, label }: { number: string; label: string }) {
  return (
    <div
      className="flex items-center gap-[15px]"
      style={{
        borderRadius: 6,
        backgroundColor: "#004345",
        padding: 20,
        fontSize: 14,
        color: "#fff",
        fontFamily: "Syncopate, sans-serif",
      }}
    >
      <div className="relative">{number}</div>
      <div
        className="relative font-medium text-center shrink-0"
        style={{ width: 144, fontSize: 18, fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
      >
        {label}
      </div>
    </div>
  );
}

/** Voice/testimonial card */
function VoiceCard({
  name,
  age,
  transition,
}: {
  name: string;
  age: string;
  transition: string;
}) {
  return (
    <div className="h-[540px] flex flex-col items-center justify-end isolate" style={{ flex: 1 }}>
      <div className="self-stretch flex items-start justify-between pr-[50px] gap-5 z-[1]">
        <div className="flex flex-col items-end justify-center gap-[5px]">
          <div
            className="flex flex-col items-start justify-center relative isolate gap-5"
            style={{ padding: 15 }}
          >
            <div
              className="absolute z-[0]"
              style={{
                top: "calc(50% - 37px)",
                left: "calc(50% - 119px)",
                width: 238,
                height: 74,
                backgroundColor: "#edf9ff",
                borderRadius: 5,
              }}
            />
            <div className="flex items-center gap-[15px] z-[1]">
              <b className="relative" style={{ fontSize: 20, lineHeight: "36px" }}>{name}</b>
              <b className="relative" style={{ fontSize: 10, lineHeight: "36px" }}>{age}</b>
            </div>
            <b className="relative z-[2]" style={{ fontSize: 14, lineHeight: "36px" }}>{transition}</b>
          </div>
        </div>
        {/* Avatar placeholder */}
        <div className="flex items-center justify-center" style={{ height: 170, width: 66 }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", backgroundColor: "#d1d5db" }} />
        </div>
      </div>
      <div
        className="self-stretch flex-1 bg-white flex items-center justify-center z-[0] relative"
        style={{ padding: "50px 30px", marginTop: -36, fontSize: 14 }}
      >
        <b
          className="self-stretch relative inline-block"
          style={{ lineHeight: "25px", width: 329, color: "#000" }}
        >
          ダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキスト
        </b>
      </div>
    </div>
  );
}

/** Advisor card */
function AdvisorCard({ name, image }: { name: string; image: string }) {
  return (
    <div className="flex flex-col items-start justify-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={name} className="object-cover" style={{ width: 300, height: 300 }} />
      <div className="self-stretch flex items-end justify-between gap-5">
        <div className="flex flex-col items-start justify-end gap-[15px]">
          <div className="relative font-medium" style={{ fontSize: 14, lineHeight: "45px", color: "#313131" }}>
            キャリアアドバイザー
          </div>
          <div className="relative font-medium" style={{ fontSize: 35, color: "#000" }}>
            {name}
          </div>
        </div>
        <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24.5" cy="24.5" r="24" stroke="#004345" />
          <path d="M20 16L30 24.5L20 33" stroke="#004345" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/** Dilemma card */
function DilemmaCard({ text }: { text: string }) {
  return (
    <div className="flex-1 bg-white flex items-center gap-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/書き出し画像/Service%20-%20to%20B採用企業/webP/Group%20(1).svg"
        alt=""
        className="shrink-0"
        style={{ width: 69, height: 100 }}
      />
      <div
        className="flex-1 relative font-medium"
        style={{ fontSize: 18, lineHeight: "28px" }}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}

/** Dilemma section with label + 3 cards */
function DilemmaSection({
  label,
  cards,
}: {
  label: string;
  cards: string[];
}) {
  return (
    <div className="self-stretch flex flex-col items-start gap-10">
      <div className="flex flex-col items-start" style={{ paddingLeft: 100 }}>
        <div
          className="flex items-center justify-center"
          style={{
            backgroundColor: "#004345",
            padding: "12px 41px",
            fontSize: 24,
            color: "#fff",
          }}
        >
          <div className="relative font-medium">{label}</div>
        </div>
      </div>
      <div
        className="self-stretch flex items-center gap-[15px]"
        style={{ backgroundColor: "#edf9ff", padding: "30px 100px" }}
      >
        {cards.map((text, i) => (
          <div key={i} className="flex-1 flex items-center gap-[15px]">
            {i > 0 && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/arrow_2.svg" alt="" className="shrink-0" style={{ width: 15, height: 15 }} />
            )}
            <DilemmaCard text={text} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** LINE card */
function LineCard({ title, description }: { title: string; description: string }) {
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

export default function ServiceToC2Page() {
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
          backgroundColor: "#edf9ff",
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
            <div className="relative font-medium">RAはプロに任せる時代</div>
          </div>
          <div className="bg-white flex items-center">
            <div className="relative font-medium">仲間になれる人材紹介会社を</div>
          </div>
          <div className="bg-white flex items-center">
            <div className="relative font-medium">探しています！</div>
          </div>
          <div className="relative font-medium" style={{ fontSize: 14, color: "#838383" }}>
            ※人材紹介会社様向けのページです
          </div>
        </div>
      </div>

      {/* ジレンマ section */}
      <div
        className="self-stretch bg-white flex flex-col items-center justify-center py-[100px] px-0 gap-[100px]"
        style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
      >
        {/* Header */}
        <div className="self-stretch flex items-center px-[100px] gap-[30px]" style={{ color: "#004345", fontSize: 24 }}>
          <div className="relative font-medium shrink-0">多くの人材紹介会社が抱えるジレンマ...</div>
          <div className="flex-1" style={{ height: 1, backgroundColor: "#004345", opacity: 0.3 }} />
        </div>

        {/* Dilemma 01 */}
        <DilemmaSection
          label="ジレンマ 01"
          cards={[
            "目の前の候補者に<br/>集中したい...",
            "企業開拓から書類対応、<br/>面接調整まで業務が多すぎる",
            "キャリアアドバイザーとして<br/>候補者に集中したい",
          ]}
        />

        {/* Dilemma 02 */}
        <DilemmaSection
          label="ジレンマ 02"
          cards={[
            "人材紹介会社は<br/>企業開拓と候補者対応で大変",
            "良い企業を開拓したいけど<br/>なかなかリストが集まらない",
            "結果的に候補者さんの<br/>希望を叶えきれない時がある",
          ]}
        />

        {/* Dilemma 03 */}
        <DilemmaSection
          label="ジレンマ 03"
          cards={[
            "人材紹介の仕事を<br/>日々こなすので手一杯",
            "社内体制の構築や<br/>スケールに向けた動きができない",
            "社内にリソースを割けずに<br/>スケールの未来が見えない",
          ]}
        />

        {/* Bottom CTA */}
        <div className="self-stretch relative font-medium text-center" style={{ fontSize: 56, color: "#000" }}>
          Peter Panが解決します！
        </div>
      </div>

      {/* STRENGTH section */}
      <div
        className="self-stretch flex flex-col items-center"
        style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
      >
        {/* Title */}
        <div className="flex flex-col items-start gap-5" style={{ padding: "100px 0 50px" }}>
          <div
            className="relative"
            style={{ fontSize: "clamp(80px, 15vw, 207px)", lineHeight: "150px", fontFamily: "Syncopate, sans-serif", color: "#000" }}
          >
            STRENGTH
          </div>
          <div className="relative font-medium text-center" style={{ fontSize: 24, color: "#004345" }}>
            ピーターパンの強み
          </div>
        </div>

        {/* Strength diagram card */}
        <div
          className="self-stretch flex items-center justify-center"
          style={{ backgroundColor: "#edf9ff", padding: "50px 100px" }}
        >
          <div
            className="flex-1 bg-white flex flex-col items-center box-border gap-[30px]"
            style={{ borderRadius: 20, padding: 50, maxWidth: 1166 }}
          >
            {/* 提携先企業 pill */}
            <div
              className="self-stretch flex flex-col items-center justify-center relative overflow-hidden"
              style={{ height: 128, borderRadius: 500 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/260120_preterpan_texture01.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="relative text-center font-medium text-white" style={{ fontSize: 24 }}>
                提携先企業
                <br />
                300社以上
              </div>
            </div>

            {/* Arrow down */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/arrow_2.svg" alt="" style={{ width: 34, height: 50, transform: "rotate(90deg)" }} />

            {/* Strength image (Frame 1610) */}
            <div className="flex items-center justify-center" style={{ padding: "10px 0" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/書き出し画像/Service%20-%20to%20B採用企業/webP/Frame%201610.webp"
                alt="Peter Pan"
                style={{ maxWidth: 270, height: "auto" }}
              />
            </div>

            {/* Arrow down */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/arrow_2.svg" alt="" style={{ width: 34, height: 50, transform: "rotate(90deg)" }} />

            {/* 人材会社 A/B/C with candidates */}
            <div className="self-stretch flex items-start gap-5" style={{ fontSize: 18 }}>
              {["人材会社A", "人材会社B", "人材会社C"].map((company) => (
                <div key={company} className="flex-1 flex flex-col items-center gap-[15px]">
                  <div
                    className="self-stretch flex items-center justify-center"
                    style={{ backgroundColor: "#004345", padding: "15px 0", color: "#fff" }}
                  >
                    <div className="relative font-medium">{company}</div>
                  </div>
                  <div className="flex items-start gap-[53px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/arrow_2.svg" alt="" style={{ width: 34, height: 50, transform: "rotate(90deg)" }} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/arrow_2.svg" alt="" style={{ width: 34, height: 50, transform: "rotate(90deg)" }} />
                  </div>
                  <div className="self-stretch flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/書き出し画像/Service%20-%20to%20B採用企業/webP/Group%20(1).svg"
                        alt=""
                        style={{ width: 69, height: 100 }}
                      />
                      <div className="relative font-extrabold text-center" style={{ fontSize: 12 }}>候補者</div>
                    </div>
                    <div className="flex flex-col items-center gap-2.5" style={{ marginLeft: -30 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/書き出し画像/Service%20-%20to%20B採用企業/webP/Group%20(1).svg"
                        alt=""
                        style={{ width: 69, height: 100 }}
                      />
                      <div className="relative font-extrabold text-center" style={{ fontSize: 12 }}>候補者</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ご提供内容 */}
        <div
          className="self-stretch flex flex-col items-center gap-[65px]"
          style={{ backgroundColor: "#edf9ff", padding: "50px 100px" }}
        >
          <div className="self-stretch flex items-center gap-[30px]" style={{ fontSize: 24, color: "#004345" }}>
            <div className="relative font-medium shrink-0">ご提供内容</div>
            <div className="flex-1" style={{ height: 1, backgroundColor: "#004345", opacity: 0.3 }} />
          </div>
          <div className="self-stretch flex flex-col items-center gap-[30px]" style={{ fontSize: 18, color: "#fff" }}>
            {[
              ["自社企業のリスト共有", "企業Pick UP代行"],
              ["書類作成代行", "面接対策支援"],
              ["KPI設計の伴走", "送客"],
              ["企業説明会", "プラットフォーム提供"],
            ].map((row, i) => (
              <div key={i} className="self-stretch flex items-center gap-[30px]">
                {row.map((item) => (
                  <div
                    key={item}
                    className="flex-1 flex items-center justify-center text-center"
                    style={{ backgroundColor: "#004345", padding: "30px 50px" }}
                  >
                    <div className="relative font-medium">{item}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 実績 */}
        <div className="self-stretch flex flex-col items-center" style={{ backgroundColor: "#edf9ff" }}>
          <div className="self-stretch flex items-center gap-[30px] px-[100px] pt-[50px]" style={{ fontSize: 24, color: "#004345" }}>
            <div className="relative font-medium shrink-0">実績</div>
            <div className="flex-1" style={{ height: 1, backgroundColor: "#004345", opacity: 0.3 }} />
          </div>
          <div className="self-stretch flex items-center justify-center gap-[50px]" style={{ padding: "100px 50px", fontSize: 18 }}>
            {[
              "支援開始6ヶ月で<br/>月商100万円→1000万円",
              "立ち上げ間もない企業の<br/>組織化を支援",
            ].map((title) => (
              <div key={title} className="flex-1 flex flex-col items-center justify-end isolate relative">
                <div className="flex items-start justify-center z-[1]">
                  <div className="flex flex-col items-end justify-center gap-[5px]">
                    <div className="flex flex-col items-start justify-center p-[15px] relative isolate gap-5">
                      <div
                        className="absolute z-[0]"
                        style={{
                          top: "calc(50% - 37px)",
                          left: "calc(50% - 119px)",
                          width: 238,
                          height: 74,
                          backgroundColor: "#edf9ff",
                          borderRadius: 5,
                        }}
                      />
                      <div
                        className="relative font-medium z-[1] shrink-0"
                        dangerouslySetInnerHTML={{ __html: title }}
                      />
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/arrow_2.svg" alt="" style={{ width: 15, height: 15 }} />
                  </div>
                  <div className="flex items-end justify-center px-[30px]" style={{ height: 170 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/書き出し画像/Service%20-%20to%20B採用企業/webP/Group%20(1).svg"
                      alt=""
                      style={{ width: 116, height: 168 }}
                    />
                  </div>
                </div>
                <div
                  className="self-stretch bg-white flex flex-col items-start justify-center z-[0] -mt-5 relative"
                  style={{ padding: "50px 30px", fontSize: 14 }}
                >
                  <b className="relative inline-block" style={{ lineHeight: "25px", width: 329 }}>
                    ダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキスト
                  </b>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 独自のプラットフォーム開発 */}
        <div className="self-stretch flex flex-col items-center" style={{ backgroundColor: "#edf9ff" }}>
          <div className="self-stretch flex items-center gap-[30px] px-[100px]" style={{ fontSize: 24, color: "#004345" }}>
            <div className="relative font-medium shrink-0">独自のプラットフォーム開発</div>
            <div className="flex-1" style={{ height: 1, backgroundColor: "#004345", opacity: 0.3 }} />
          </div>
          <div className="self-stretch flex items-center justify-center" style={{ padding: "50px 50px 100px" }}>
            <div
              className="flex-1 bg-white flex items-center justify-center gap-[50px] box-border"
              style={{ borderRadius: 20, padding: 50, maxWidth: 1266 }}
            >
              {/* COMING SOON */}
              <div
                className="flex-1 flex flex-col items-center justify-center relative overflow-hidden gap-[30px]"
                style={{ height: 405, borderRadius: 10 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/260120_preterpan_texture01.webp"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <div
                  className="relative text-center"
                  style={{ fontSize: 60, fontFamily: "Syncopate, sans-serif", color: "#fff" }}
                >
                  COMMING SOON
                </div>
                <div className="self-stretch flex items-center gap-2.5 px-[50px] relative" style={{ fontSize: 24, color: "#fff" }}>
                  <div className="relative font-medium">&#9679;</div>
                  <div className="flex-1" style={{ height: 1, backgroundColor: "#fff", opacity: 0.5 }} />
                </div>
              </div>

              {/* Info card */}
              <div
                className="flex flex-col items-start justify-center gap-[30px]"
                style={{ backgroundColor: "#004345", borderRadius: 20, padding: 30, fontSize: 24, color: "#fff" }}
              >
                <div className="relative font-medium">
                  独自のプラットフォームにより
                  <br />
                  スムーズな連携！
                </div>
                <div className="relative font-medium" style={{ fontSize: 14 }}>
                  弊社求人群の閲覧〜検索までスムーズに行い、
                  <br />
                  現在進行中の選考状況が一目でわかります。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageBottom />
    </div>
  );
}
