"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useRive, useViewModel, useViewModelInstance, Layout, Fit } from "@rive-app/react-webgl2";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import PageBottom from "@/components/PageBottom";

function buildRiveSrc(fileName: string): string {
  const i = fileName.indexOf("/");
  if (i === -1) return `/rive/${encodeURIComponent(fileName)}`;
  const folder = fileName.slice(0, i);
  const name = fileName.slice(i + 1);
  return `/rive/${folder}/${encodeURIComponent(name)}`;
}

const INTERVIEW_SCALE = 100;

function InterviewRive() {
  const src = useMemo(() => buildRiveSrc("peterpan/interview.riv"), []);
  const progressRef = useRef(0);
  const stateNumRef = useRef<{ value: number } | null>(null);

  const { rive, RiveComponent } = useRive({
    src,
    autoplay: true,
    stateMachines: "State Machine 1",
    autoBind: true,
    layout: new Layout({ fit: Fit.Layout }),
    artboard: "main"
  });

  const viewModel = useViewModel(rive, { name: "ViewModel1" });
  const viewModelInstance = useViewModelInstance(viewModel, { rive, useDefault: true });

  useEffect(() => {
    if (!viewModelInstance) { stateNumRef.current = null; return; }
    try { stateNumRef.current = viewModelInstance.number("stateNum") ?? null; }
    catch { stateNumRef.current = null; }
  }, [viewModelInstance]);

  const sectionRef = useScrollProgress(
    (p) => { progressRef.current = p; },
    { smooth: 0, pauseWhenOffScreen: false }
  );

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const prop = stateNumRef.current;
      if (prop) prop.value = progressRef.current * INTERVIEW_SCALE;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative w-full"
      style={{ height: "400vh", minHeight: "400vh" }}
    >
      <div className="sticky top-0 w-full h-screen">
        <RiveComponent className="w-full h-full" style={{ touchAction: "pan-y" }} />
      </div>
    </section>
  );
}

const ALICE = "#edf9ff";
const DARK = "#004345";

export default function ExecutiveCCOPage() {
  return (
    <div
      className="w-full relative flex flex-col items-center text-left"
      style={{ fontFamily: "Syncopate, sans-serif", color: "#000" }}
    >
      <div className="w-full max-w-[1366px] flex flex-col items-center">
        <div
          className="self-stretch flex flex-col items-start relative bg-[#edf9ff]"
          style={{ backgroundColor: ALICE }}
        >
          {/* INTERVIEW header */}
          <div className="self-stretch flex flex-col items-start pt-[100px] px-[50px] pb-[50px] gap-5 relative overflow-hidden">
            
            <div className="absolute inset-0 bg-white" />
            <div className="relative z-10 leading-[148.52px]" style={{ fontSize: "clamp(80px, 15vw, 205.71px)" }}>
              INTERVIEW
            </div>
            <div
              className="relative z-10 font-medium"
              style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: 24 }}
            >
              役員インタビュー
            </div>
          </div>

          <InterviewRive />

          {/* Interview content: left column (white) + right column (dark Q&A) */}
          <div className="self-stretch overflow-hidden flex flex-col lg:flex-row items-start text-sm">
            {/* Left column - sticky CEO card + quote + image */}
            <div
              className="w-full lg:w-[342px] min-h-[768px] bg-white flex flex-col items-center justify-start pt-[100px] pb-0 box-border gap-[100px] shrink-0"
              style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
            >
              <div className="flex flex-col items-start shrink-0">
                <div className="bg-white border border-black flex p-5 -mt-px flex flex-col">
                  <div className="relative font-medium" style={{ fontSize: 14 }}>
                    インタビュー
                  </div>
                  <div className="relative font-medium whitespace-nowrap" style={{ fontSize: 35 }}>
                    CEO 笠井 基生
                  </div>
                </div>
              </div>
              <div className="self-stretch flex-1 flex flex-col items-start shrink-0 relative mt-20">
                {/* Quote box */}
                <div className="flex flex-col items-start gap-[5px] z-[1] shrink-0 absolute -top-26 left-12">
                  <div className="bg-white border border-black flex flex-col items-start justify-center py-3" style={{ paddingLeft: "30px", paddingRight: "80px" }}>
                    <div
                      className="relative font-medium leading-relaxed whitespace-nowrap"
                      style={{ fontSize: 14 }}
                    >
                      人の為に生き、
                      <br />
                      最前線を走り続ける
                      <br />
                      ヒーローでいたい。
                    </div>
                  </div>
                  <div className="h-[15px] relative">
                    <Image src="/arrow_2.svg" alt="" width={140} height={15} className="h-[15px] w-auto object-contain" />
                  </div>
                </div>
                {/* CEO image overlapping below quote */}
                <div className="w-full flex-1 relative shrink-0 min-h-[300px] -mt-[30px] overflow-hidden" style={{ overflow: "hidden" }}>
                  <Image
                    src="/書き出し画像/exective/webp/exective_02.webp"
                    alt="CEO 笠井 基生"
                    width={1024}
                    height={642}
                    className="w-full h-full object-cover object-top"
                    style={{ height: "430px", width: "340px" }}
                  />
                </div>
              </div>
            </div>

            {/* Right column - Q&A blocks */}
            <div
              className="flex-1 flex flex-col items-start min-w-0"
              style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: 24 }}
            >
              {/* Dark block - Q1, Q2, Photo */}
              <div
                className="self-stretch flex flex-col items-start py-[50px] px-[50px] md:px-[100px] lg:px-[250px] gap-[50px] text-white"
                style={{ backgroundColor: DARK, paddingTop: "5rem", paddingBottom: "10rem"}}
              >
                {/* Q1 */}
                <div className="self-stretch flex flex-col items-start gap-[30px]">
                  <div className="self-stretch relative font-medium leading-[30px]">Q. まず、幼少期はどんな子どもだったのでしょうか？</div>
                  <div className="self-stretch relative leading-[30px]" style={{ fontSize: 20 }}>
                    福岡県の須恵町という、のどかな町で育ちました。 家族はとても仲が良く、愛情に包まれた環境だったと思います。
                    <br />
                    性格は、とにかく活発。じっとしていられなくて、いつも外を走り回っているような子でしたね。
                    周りから見ると元気なムードメーカー、という印象だったと思います。
                  </div>
                </div>

                {/* Q2 */}
                <div className="self-stretch flex flex-col items-start gap-[30px]">
                  <div className="self-stretch relative font-medium leading-[30px]">Q. 幼少期から学生時代にかけて、特に打ち込んでいたことは？</div>
                  <div className="self-stretch relative leading-[30px]" style={{ fontSize: 20 }}>
                    間違いなくサッカーです。
                    <br />
                    小学校1年生のとき、友達に誘われて始めたのがきっかけでしたが、すぐに夢中になりました。
                    <br />
                    放課後も、休み時間も、朝早く集まっても、とにかくボールを蹴っていました。
                    自然と周りの仲間が集まってきて、気づけばチームの中心にいるような存在になっていました。
                    <br />
                    サッカーだけは、子どもながらに「本気」で取り組んでいましたね。
                  </div>
                </div>
                
              </div>

                  
              {/* White block - Q3, Q4, Q5 */}
              <div className="w-full pb-12 bg-white">
                <div className="self-stretch h-[433px w-2xl" style={{ marginLeft: "auto", marginRight: "auto", marginTop: "-6rem" }}>
                  <Image
                    src="/書き出し画像/interview/webp/interview02-photo_01.webp"
                    alt=""
                    width={731}
                    height={411}
                    className="w-full h-full object-cover"
                    sizes="342px"
                  />
                </div>
                <div className="self-stretch bg-white flex flex-col items-start px-[50px] md:px-[100px] lg:px-[250px] gap-[50px] text-black" style={{paddingTop: "5rem", paddingBottom: "5rem"}}>
                  <div className="self-stretch flex flex-col items-start gap-[50px]">
                    <div className="self-stretch flex flex-col items-start gap-[30px]">
                      <div className="self-stretch relative font-medium leading-[30px]">Q. 人生の大きな転機になった出来事はありますか？</div>
                      <div className="self-stretch relative leading-[30px]" style={{ fontSize: 20 }}>
                        中学生の頃です。
                        <br />
                        当時、思春期も重なって気持ちが不安定で、学校生活もうまくコントロールできていなかった時期がありました。
                        <br />
                        そんなとき、母から本気で叱られた一言がありました。
                        <br />
                        「サッカーを本気でやるなら、覚悟を決めなさい。」
                        <br />
                        その瞬間、初めて自分の人生を自分で選ぶという感覚が芽生えたのを覚えています。
                        <br />
                        さらに同じ頃、とても大切にしてくれていたサッカーの先輩が事故で亡くなりました。
                        <br />
                        この出来事は、自分の価値観を大きく変えました。 命の尊さ、生きていることの意味、仲間と本気で向き合うこと。
                        今でも福岡に帰ると、必ず手を合わせに行っています。
                      </div>
                    </div>
                    <div className="self-stretch flex flex-col items-start gap-[30px]">
                      <div className="relative font-medium leading-[30px]">Q. 高校・大学時代はどんな時間でしたか？</div>
                      <div className="self-stretch relative leading-[30px]" style={{ fontSize: 20 }}>
                        高校は、全国レベルで練習が厳しいサッカー部に進学しました。 正直、人生で一番きつい3年間だったと思います。
                        <br />
                        でもあの時間が、忍耐力、継続力、そして「逃げない姿勢」をすべて作ってくれました。
                        <br />
                        大学ではプロサッカー選手の夢を諦め、次の目標として「教育」に興味を持つようになります。
                        <br />
                        同時に、仲間とアパレルブランドを立ち上げたり、イベントを企画したりと、初めてビジネスの楽しさにも触れました。
                        <br />
                        「仕組みを作れば、人は動き、価値は生まれる」この感覚を体で理解した時期でした。
                      </div>
                    </div>
                    <div className="self-stretch flex flex-col items-start gap-[30px]">
                      <div className="relative font-medium leading-[30px]">Q. 社会人としての原点となった経験は？</div>
                      <div className="self-stretch relative leading-[30px]" style={{ fontSize: 20 }}>
                        新卒で入社したDYMでの経験です。
                        <br />
                        成果主義の世界に飛び込み、毎日自分と向き合い続けました。
                        <br />
                        うまくいかない時期もありましたが、努力を積み重ね、チームを任せてもらえるようになり、
                        組織を率いることの難しさと面白さを学びました。
                      </div>
                    </div>
                  </div>

                </div>

              </div>
              

              {/* Dark block - Q6, Q7 */}
              
              <div className="w-full pb-12" style={{ backgroundColor: DARK }}>
                <div className="self-stretch h-[433px w-2xl" style={{ marginLeft: "auto", marginRight: "auto", marginTop: "-6rem" }}>
                  <Image
                    src="/書き出し画像/interview/webp/interview02-photo_02.webp"
                    alt=""
                    width={524}
                    height={433}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 1024px) 100vw, 524px"
                  />
                </div>
                <div
                  className="self-stretch flex flex-col items-start px-[50px] md:px-[100px] lg:px-[250px] gap-[50px] text-white" style={{paddingTop: "5rem", paddingBottom: "2rem"}}
                >
                  <div className="self-stretch flex flex-col items-start gap-[30px]">
                    <div className="self-stretch relative font-medium leading-[30px]">Q. その後の転機と、現在に至るまでを教えてください。</div>
                    <div className="self-stretch relative leading-[30px]" style={{ fontSize: 20 }}>
                      ある経営者との出会いで、人生観が一変しました。
                      <br />
                      「基生君はいつ頑張ってた？」
                      <br />
                      と質問され、サッカーに打ち込んだことやDYMでの経験を語りました。
                      <br />
                      すると、「過去頑張ってたという話ダサいね」と言われました。
                      <br />
                      社会人になって今後の方が人生長いのに、なぜ今本気で頑張っているという話ができないの？」
                      <br />
                      と言われ、衝撃が走るとともに、自分の甘さを突きつけられた気がしました。
                      <br />
                      その後、金融の世界に飛び込み、営業・人間力・信頼構築のすべてを学びました。
                      <br />
                      順調な時期も、厳しい局面も経験し、最終的に「自分の足で価値を生み出したい」と独立を決意します。
                      <br />
                      そして誕生したのが、株式会社Peter Panです。
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col items-start gap-[30px]">
                    <div className="relative font-medium leading-[30px]">Q. これから、どんな未来を描いていますか？</div>
                    <div className="self-stretch relative leading-[30px]" style={{ fontSize: 20 }}>
                      挑戦する人の、人生の伴走者でありたい。
                      <br />
                      そして将来は、世界のどこかで支援を続けられる事業を持ち続けたい。
                      <br />
                      カンボジアでのボランティア経験が、 今もずっと胸の奥に残っています。
                      <br />
                      自分の人生は、振り返れば「挑戦の連続」でした。
                      <br />
                      だからこそ、誰かの挑戦にも、本気で向き合える。 それが、今の自分の原点です。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COO section */}
          <div
            className="flex"
            style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
          >
            <div className="flex flex-col items-start">
              <div
                className="relative leading-[0.9em]"
                style={{ fontFamily: "Syncopate, sans-serif", fontSize: "clamp(120px, 20vw, 292.45px)", color: DARK }}
              >
                CEO
              </div>
              <div
                className="relative leading-[0.9em]"
                style={{ fontFamily: "Syncopate, sans-serif", fontSize: "clamp(60px, 10vw, 125.07px)", color: DARK }}
              >
                INTERVIEW
              </div>
            </div>
            <div className="flex items-start gap-0 relative">
              <div className="absolute z-10" style={{top: "12px", left: "-6rem"}}>
                <img
                  src="/Vector (5).svg"
                  alt=""
                  className="absolute inset-0 z-0 w-[190px] h-[81px]"
                />
                <div className="pl-5">
                  <div className="relative text-xl font-semibold z-[1] leading-9">COO</div>
                  <a
                    href="https://www.wantedly.com/users/9020594"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative font-medium z-[2] leading-9 no-underline text-black"
                    style={{ fontSize: 35 }}
                  >
                    赤沼 拓弥
                  </a>
                </div>
                <div className="w-[190px] h-2.5 relative" style={{top: "12px", right: "-90px"}}>
                  <Image src="/arrow_2.svg" alt="" width={190} height={10} className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col items-start z-0 mt-[12px] relative" style={{ width: 485.5 }}>
                <Image
                  src="/書き出し画像/exective/webp/exective_01.webp"
                  alt="赤沼 拓弥"
                  width={486}
                  height={290}
                  className="w-full h-[290px] object-cover"
                  sizes="485px"
                />
                <a
                  href="https://www.wantedly.com/users/9020594"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-stretch bg-white border border-black flex items-center justify-between p-5 gap-5 no-underline text-black hover:bg-gray-50"
                  style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: 24 }}
                >
                  <span className="relative font-medium leading-[30px]">人物を知る</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/arrow.svg" alt="" style={{ width: 40, height: 40 }} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <PageBottom />
      </div>
    </div>
  );
}
