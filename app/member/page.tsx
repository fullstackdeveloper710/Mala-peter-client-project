"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useRive, Layout, Fit } from "@rive-app/react-webgl2";
import PageBottom from "@/components/PageBottom";
import MemberOverlay, { type MemberOverlayData } from "@/components/MemberOverlay";

const layoutFit = new Layout({ fit: Fit.Layout });

function buildRiveSrc(fileName: string): string {
  const i = fileName.indexOf("/");
  if (i === -1) return `/rive/${encodeURIComponent(fileName)}`;
  const folder = fileName.slice(0, i);
  const name = fileName.slice(i + 1);
  return `/rive/${folder}/${encodeURIComponent(name)}`;
}

/** Member card */
function MemberCard({
  role,
  name,
  image,
  onClick,
}: {
  role: string;
  name: string;
  image: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="relative w-full flex flex-col items-start justify-center gap-2.5 text-left bg-transparent border-none p-0 cursor-pointer"
      style={{
        width: 300,
        fontFamily: "'Zen Kaku Gothic New', sans-serif",
        fontSize: 14,
        color: "#004345",
      }}
      onClick={onClick}
    >
      <Image
        className="w-[300px] relative max-h-full object-cover"
        src={image}
        width={300}
        height={300}
        sizes="300px"
        alt={name}
      />
      <Image
        className="w-[15px] relative max-h-full"
        src="/arrow_2.svg"
        width={15}
        height={15}
        sizes="15px"
        alt=""
      />
      <div className="self-stretch flex items-end justify-between gap-5">
        <div className="flex flex-col items-start justify-end gap-0">
          <div className="relative font-medium leading-tight">
            {role}
          </div>
          <div className="relative text-[35px] font-medium text-black leading-tight">
            {name}
          </div>
        </div>
        <Image
          className="self-stretch w-[49px] max-h-full"
          src="/arrow.svg"
          width={49}
          height={49}
          sizes="49px"
          alt=""
        />
      </div>
    </button>
  );
}

const members: MemberOverlayData[] = [
  {
    role: "CEO",
    name: "笠井 基生",
    image: "/書き出し画像/member/webp/member01.webp",
    description:
      "ダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキスト",
    qa: [
      {
        question: "あなたにとってのジレンマは？",
        answer:
          "理想を追い続ける覚悟と今ある幸せを噛み締める余裕とのバランス",
      },
      {
        question: "人生背景",
        answer:
          "16年間サッカーを続けてきてプロになれなかった悔しさから ビジネスマンとして経営者として成功したい。",
      },
      { question: "好きなこと", answer: "仲間と喜び・遊びを分かち合うこと" },
      {
        question: "趣味",
        answer:
          "旅行・サウナ・美味しいご飯を食べる・キャンプ・釣り・ゴルフ・運動",
      },
      { question: "会社でのキャラ", answer: "挑戦し続ける熱い男" },
      {
        question: "人生ビジョン",
        answer:
          "世界中で支援活動を続けること。関わるすべての人の“太陽”であること。",
      },
      {
        question: "人材業界に転職した理由",
        answer: "人の人生が変わるきっかけや挑戦に本気で関わりたかった",
      },
    ],
  },
  { role: "COO", name: "赤沼 拓弥", image: "/書き出し画像/member/webp/member02.webp" },
  { role: "執行役員 CA", name: "高橋 大貴", image: "/書き出し画像/member/webp/member03.webp" },
  { role: "CA", name: "石毛 花佳", image: "/書き出し画像/member/webp/member04.webp" },
  { role: "CA", name: "大島 嵩輝", image: "/書き出し画像/member/webp/member05.webp" },
  { role: "RA", name: "馬渡 さくら", image: "/書き出し画像/member/webp/member06.webp" },
  { role: "CA", name: "駒沢 陸", image: "/書き出し画像/member/webp/member07.webp" },
  { role: "RA", name: "川口 未桜", image: "/書き出し画像/member/webp/member08.webp" },
  { role: "PCA", name: "佐々木 悠喜", image: "/書き出し画像/member/webp/member09.webp" },
  { role: "CA", name: "横山 翔太", image: "/書き出し画像/member/webp/member10.webp" },
  { role: "AD", name: "鈴本 彩", image: "/書き出し画像/member/webp/member11.webp" },
];

export default function MemberPage() {
  const src = useMemo(() => buildRiveSrc("peterpan/memebers.riv"), []);
  const { RiveComponent } = useRive({
    src,
    artboard: "main",
    stateMachines: "stateMachine",
    autoplay: true,
    layout: layoutFit,
  });

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openMember = openIndex === null ? null : members[openIndex] ?? null;

  const onClose = useCallback(() => setOpenIndex(null), []);
  const onPrev = useCallback(() => {
    setOpenIndex((i) => {
      if (i === null) return i;
      return (i - 1 + members.length) % members.length;
    });
  }, []);
  const onNext = useCallback(() => {
    setOpenIndex((i) => {
      if (i === null) return i;
      return (i + 1) % members.length;
    });
  }, []);

  const cardHandlers = useMemo(
    () => members.map((_, idx) => () => setOpenIndex(idx)),
    []
  );

  return (
    <div
      className="w-full relative flex flex-col items-center text-left"
      style={{ color: "#004345", fontFamily: "Syncopate, sans-serif", fontSize: 50 }}
    >
      <div
        className="self-stretch flex flex-col items-center overflow-x-hidden"
        style={{ backgroundColor: "#edf9ff" }}
      >
        {/* Hero: memebers.riv */}
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

        {/* Member grid */}
        <div
          className="self-stretch flex flex-col items-center"
          style={{ padding: "100px 0" }}
        >
          <div
            className="grid gap-x-[50px] gap-y-[75px]"
            style={{
              gridTemplateColumns: "repeat(3, 300px)",
              maxWidth: 1000,
            }}
          >
            {members.map((m, idx) => (
              <MemberCard
                key={m.name}
                role={m.role}
                name={m.name}
                image={m.image}
                onClick={cardHandlers[idx]!}
              />
            ))}
          </div>
        </div>
      </div>

      <PageBottom />

      {openMember && (
        <MemberOverlay
          member={openMember}
          onClose={onClose}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
    </div>
  );
}
