"use client";

import VideoFilledText from "@/components/VideoFilledText";
import PageBottom from "@/components/PageBottom";

function PolicySection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="self-stretch flex flex-col items-start gap-[30px]">
      <div className="self-stretch flex items-start gap-2.5" style={{ fontSize: 24, fontFamily: "Syncopate, sans-serif" }}>
        <div className="relative">{`${number}. `}</div>
        <div className="relative font-medium" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>{title}</div>
      </div>
      <div className="self-stretch relative text-[14px] font-medium" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", lineHeight: "28px" }}>
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div
      className="w-full relative flex flex-col items-center text-left"
      style={{ color: "#004345", fontFamily: "Syncopate, sans-serif" }}
    >
      {/* Hero */}
      <div className="self-stretch flex flex-col items-start relative isolate bg-white">
        <div
          className="self-stretch flex flex-col items-start z-[0]"
          style={{ padding: "100px 0 50px", gap: 20 }}
        >
          <VideoFilledText
            text="PRIVACY POLICY"
            imageSrc="/260120_preterpan_texture01.webp"
            bgColor="#fff"
            style={{ fontSize: 138, lineHeight: 1, fontFamily: "Syncopate, sans-serif", whiteSpace: "nowrap" }}
          />
          <div
            className="relative font-medium"
            style={{
              fontSize: 24,
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              color: "#004345",
            }}
          >
            プライバシーポリシー
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="self-stretch flex flex-col items-center justify-center relative z-10"
        style={{ backgroundColor: "#edf9ff", padding: "100px 50px" }}
      >
        <div
          className="w-full rounded-[20px] bg-white flex flex-col items-start justify-center box-border gap-[50px]"
          style={{ maxWidth: 1066, padding: 50, color: "#004345" }}
        >
          {/* Intro */}
          <div
            className="self-stretch relative font-medium"
            style={{ fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", lineHeight: "28px" }}
          >
            株式会社 Peter Pan（以下、「当社」といいます）は、当社が提供するサービスにおいて取得する個人情報の重要性を認識し、個人情報の保護に関する法律その他関連法令を遵守するとともに、以下の方針に基づき個人情報を適切に取り扱います。
          </div>

          <PolicySection number={1} title="個人情報の取得について">
            当社は、お問い合わせ、資料請求、サービスのご利用、採用応募等の際に、お名前、メールアドレス、電話番号、会社名、住所などの個人情報を取得することがあります。
          </PolicySection>

          <PolicySection number={2} title="個人情報の利用目的">
            <div className="mb-4">
              当社は取得した個人情報を、以下の目的の範囲内で利用いたします。
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                "お問い合わせへの対応",
                "当社サービスに関する情報提供",
                "人材紹介サービスの提供およびそれに付随する業務",
                "求職者への求人情報の提供および企業への人材紹介",
                "サービス改善および新サービス開発のための分析",
                "採用活動における選考・連絡",
              ].map((item) => (
                <div key={item} className="self-stretch flex items-start">
                  <div className="relative font-medium">・</div>
                  <div className="flex-1 relative font-medium">{item}</div>
                </div>
              ))}
            </div>
          </PolicySection>

          <PolicySection number={3} title="個人情報の第三者提供">
            当社は、法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供することはありません。
            <br />
            ただし、人材紹介サービスの提供に必要な範囲において、求職者の同意を得たうえで求人企業へ情報を提供する場合があります。
          </PolicySection>

          <PolicySection number={4} title="個人情報の管理">
            当社は、個人情報の漏えい、滅失または毀損を防止するため、適切な安全管理措置を講じ、個人情報を厳重に管理いたします。
          </PolicySection>

          <PolicySection number={5} title="個人情報の開示・訂正・削除">
            ご本人からご自身の個人情報について、開示・訂正・利用停止・削除等の請求があった場合には、本人確認のうえ、合理的な範囲で速やかに対応いたします。
          </PolicySection>

          <PolicySection number={6} title="プライバシーポリシーの変更">
            当社は、必要に応じて本プライバシーポリシーの内容を変更することがあります。変更後のポリシーは、当社ウェブサイトに掲載した時点から効力を生じるものとします。
          </PolicySection>
        </div>
      </div>

      <PageBottom hideRecruit={true}/>
    </div>
  );
}