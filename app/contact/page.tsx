"use client";

import { useState } from "react";
import VideoFilledText from "@/components/VideoFilledText";
import PageBottom from "@/components/PageBottom";

/** Label tag with texture background */
function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden flex items-center justify-center"
      style={{ padding: "10px 15px" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/260120_preterpan_texture01.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="relative font-medium" style={{ color: "#fff" }}>{children}</div>
    </div>
  );
}

/** Form field wrapper */
function FormField({
  label,
  required,
  placeholder,
}: {
  label: string;
  required?: boolean;
  placeholder: string;
}) {
  return (
    <div className="self-stretch flex flex-col items-start gap-[15px]">
      <div className="flex items-start gap-[5px]">
        <FormLabel>{label}</FormLabel>
        {required && (
          <div className="relative font-medium" style={{ color: "#004345" }}>
            *
          </div>
        )}
      </div>
      <div
        className="self-stretch bg-white flex items-start"
        style={{
          borderRadius: 5,
          border: "1px solid #000",
          padding: "10px 10px 10px 20px",
        }}
      >
        <div
          className="relative font-medium"
          style={{ lineHeight: "28px", color: "#b0b0b0" }}
        >
          {placeholder}
        </div>
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
      {/* Background shape */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Vector%20(9).svg"
        alt=""
        className="absolute inset-0 w-full h-full z-[0] pointer-events-none"
        style={{ objectFit: "fill" }}
      />
      <div className="self-stretch flex flex-col items-start p-[50px] box-border gap-[50px] z-[1]">
        <div className="self-stretch flex items-center relative isolate gap-[50px]">
          <div className="flex flex-col items-start justify-center gap-8 z-[0] shrink-0">
            <div className="relative font-medium" style={{ fontSize: 40 }}>
              {title}
            </div>
            <div
              className="relative font-medium"
              style={{ fontSize: 20 }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
          {/* Decorative image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Frame%20164.svg"
            alt=""
            className="z-[1] shrink-0 pointer-events-none"
            style={{ width: 187, height: 137 }}
          />
        </div>
        <div
          className="self-stretch flex items-center justify-between gap-5"
          style={{
            borderRadius: 500,
            backgroundColor: "#06c755",
            padding: "20px 50px",
            fontSize: 24,
            color: "#fff",
          }}
        >
          <div className="relative font-medium">無料でLINEで相談</div>
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 6L20 14L10 22"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className="w-full relative flex flex-col items-center text-left"
      style={{ color: "#000", fontFamily: "Syncopate, sans-serif" }}
    >
      {/* Hero */}
      <div className="self-stretch flex flex-col items-start relative isolate bg-white">
        <div
          className="self-stretch flex flex-col items-start z-[0]"
          style={{ padding: "100px 0 50px", gap: 20 }}
        >
          <VideoFilledText
            text="CONTACT"
            imageSrc="/260120_preterpan_texture01.webp"
            bgColor="#fff"
            style={{ fontSize: 236, lineHeight: 1, fontFamily: "Syncopate, sans-serif", whiteSpace: "nowrap" }}
          />
          <div
            className="relative font-medium"
            style={{
              fontSize: 24,
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              color: "#004345",
            }}
          >
            お問い合わせ
          </div>
        </div>

        {/* Form section */}
        <div
          className="self-stretch flex flex-col items-start z-[1]"
          style={{
            backgroundColor: "#edf9ff",
            fontFamily: "'Zen Kaku Gothic New', sans-serif",
            fontSize: 14,
            color: "#000",
          }}
        >
          <div
            className="self-stretch flex flex-col items-center justify-center"
            style={{ padding: "100px clamp(50px, 10vw, 300px)" }}
          >
            <div
              className="w-full bg-white flex flex-col items-center justify-center box-border gap-[50px] max-w-full"
              style={{ borderRadius: 20, padding: 50 }}
            >
              <div className="self-stretch flex flex-col items-start gap-[30px]">
                {/* 会社名 */}
                <FormField label="会社名" placeholder="会社名をご入力ください" />

                {/* お名前 */}
                <div className="self-stretch flex flex-col items-start gap-[15px]">
                  <FormLabel>お名前</FormLabel>
                  <div className="self-stretch flex items-start gap-[30px]">
                    <div className="flex-1 flex items-center gap-2.5">
                      <div className="relative font-medium">姓*</div>
                      <div
                        className="flex-1 bg-white flex items-start"
                        style={{
                          borderRadius: 5,
                          border: "1px solid #000",
                          padding: "10px 10px 10px 20px",
                        }}
                      >
                        <div
                          className="relative font-medium"
                          style={{ lineHeight: "28px", color: "#b0b0b0" }}
                        >
                          お名前をご入力ください
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2.5">
                      <div className="relative font-medium">名*</div>
                      <div
                        className="flex-1 bg-white flex items-start"
                        style={{
                          borderRadius: 5,
                          border: "1px solid #000",
                          padding: "10px 10px 10px 20px",
                        }}
                      >
                        <div
                          className="relative font-medium"
                          style={{ lineHeight: "28px", color: "#b0b0b0" }}
                        >
                          お名前をご入力ください
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 電話番号 */}
                <FormField
                  label="電話番号(ハイフンなし)"
                  required
                  placeholder="電話番号をご入力ください"
                />

                {/* メールアドレス */}
                <FormField
                  label="メールアドレス"
                  required
                  placeholder="メールアドレスをご入力ください"
                />

                {/* お問い合わせ内容 */}
                <div className="self-stretch flex flex-col items-start gap-[15px]">
                  <div className="flex items-start gap-[5px]">
                    <FormLabel>お問い合わせ内容</FormLabel>
                    <div
                      className="relative font-medium"
                      style={{ color: "#004345" }}
                    >
                      *
                    </div>
                  </div>
                  <div
                    className="self-stretch bg-white flex items-center justify-between gap-5"
                    style={{
                      borderRadius: 5,
                      border: "1px solid #000",
                      padding: "10px 10px 10px 20px",
                    }}
                  >
                    <div
                      className="relative font-medium"
                      style={{ lineHeight: "28px" }}
                    >
                      お問い合わせ内容をご選択ください
                    </div>
                    <svg
                      width="18"
                      height="13"
                      viewBox="0 0 18 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L9 11L17 1"
                        stroke="#000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Privacy policy checkbox */}
              <div className="flex items-center gap-5" style={{ fontSize: 20 }}>
                <div
                  className="bg-white box-border"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    border: "1px solid #000",
                  }}
                />
                <div className="relative font-medium">
                  <a
                    href="/privacy-policy"
                    className="underline"
                    style={{ color: "#005eff" }}
                  >
                    プライバシーポリシー
                  </a>
                  <span>に同意する</span>
                </div>
              </div>

              {/* Submit button */}
              <div
                className="flex items-center justify-center bg-cover bg-no-repeat bg-[top]"
                style={{
                  borderRadius: 5,
                  padding: "15px 30px",
                  fontSize: 24,
                  color: "#fff",
                  backgroundColor: "#004345",
                  cursor: "pointer",
                }}
                onClick={() => setShowModal(true)}
              >
                <div className="relative font-medium">送信する</div>
              </div>
            </div>
          </div>

          {/* SPECIAL SUPPORT section */}
          <div className="w-full overflow-hidden flex flex-col items-center justify-center">
            <div
              className="self-stretch flex flex-col items-center"
              style={{ padding: "50px 0" }}
            >
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
                  style={{
                    fontFamily: "'Zen Kaku Gothic New', sans-serif",
                    fontSize: 24,
                    paddingRight: 50,
                    paddingBottom: 10,
                  }}
                >
                  <div className="w-full flex flex-col items-start justify-center max-w-full">
                    <div
                      className="bg-white flex items-center justify-center"
                      style={{ padding: "10px 15px" }}
                    >
                      <div className="relative font-medium">
                        通常はご紹介のみのご支援ですが
                      </div>
                    </div>
                    <div
                      className="bg-white flex items-center justify-center"
                      style={{ padding: "10px 15px" }}
                    >
                      <div className="relative font-medium">
                        このページを見つけてくれた方には
                      </div>
                    </div>
                    <div
                      className="bg-white flex items-center justify-center"
                      style={{ padding: "10px 15px" }}
                    >
                      <div className="relative font-medium">
                        特別にご支援します！
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LINE cards */}
              <div
                className="self-stretch flex items-center justify-center gap-[50px]"
                style={{
                  padding: 50,
                  fontFamily: "'Zen Kaku Gothic New', sans-serif",
                  color: "#004345",
                }}
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
        </div>
      </div>

      <PageBottom />

      {/* Thank You Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white flex flex-col items-center gap-[30px]"
            style={{
              borderRadius: 20,
              padding: "1rem 0rem",
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              maxWidth: 500,
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <VideoFilledText
              text="THANK YOU"
              imageSrc="/260120_preterpan_texture01.webp"
              bgColor="#fff"
              style={{
                fontSize: 48,
                lineHeight: 1,
                fontFamily: "Syncopate, sans-serif",
                whiteSpace: "nowrap",
              }}
            />
            <div
              className="font-medium text-center"
              style={{ fontSize: 24, color: "#000" }}
            >
              送信完了
            </div>
            <div
              className="font-medium text-center"
              style={{ fontSize: 14, lineHeight: 2, color: "#666" }}
            >
              お問い合わせありがとうございます。
              <br />
              担当者が確認し返信いたします。
              <br />
              今しばらくお待ちくださいませ。
            </div>
            <div
              className="flex items-center justify-center"
              style={{
                borderRadius: 5,
                padding: "12px 40px",
                fontSize: 16,
                color: "#fff",
                backgroundColor: "#004345",
                cursor: "pointer",
              }}
              onClick={() => setShowModal(false)}
            >
              <div className="relative font-medium">閉じる</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
