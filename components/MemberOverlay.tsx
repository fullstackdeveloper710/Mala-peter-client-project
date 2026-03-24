"use client";

import Image from "next/image";
import { useEffect } from "react";

export type MemberOverlayQA = {
  question: string;
  answer: string;
};

export type MemberOverlayData = {
  role: string;
  name: string;
  image: string;
  description?: string;
  qa?: MemberOverlayQA[];
};

export default function MemberOverlay({
  member,
  onClose,
  onPrev,
  onNext,
}: {
  member: MemberOverlayData;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const qa = member.qa ?? [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-[50px] box-border"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Panel (overlay modal, not full screen) */}
      <div
        className="relative z-[1] overflow-hidden"
        style={{
          width: 1266,
          height: 668,
          maxWidth: "calc(100vw - 100px)",
          maxHeight: "calc(100vh - 100px)",
          fontFamily: "'Zen Kaku Gothic New', sans-serif",
        }}
      >
        {/* Background image INSIDE panel */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="/260120_preterpan_texture01.webp"
          alt=""
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-[50px] box-border isolate gap-[30px] text-left text-[14px] text-white">
          <button
            type="button"
            onClick={onClose}
            className="w-[50px] h-[50px] absolute top-0 right-0 z-[3] shrink-0"
            aria-label="Close"
          >
            <span className="block w-full h-full text-[28px] leading-[50px] text-center text-white">
              ×
            </span>
          </button>

          <div className="self-stretch flex-1 min-h-0 flex items-center z-[2] shrink-0">
            <Image
              className="h-[498px] w-[382.4px] relative"
              src={member.image}
              width={382.4}
              height={498}
              sizes="382px"
              alt={member.name}
            />

            <div className="self-stretch flex-1 min-h-0 flex flex-col items-start py-0 px-[30px] gap-[30px]">
              <div className="self-stretch flex flex-col items-start gap-[30px]">
                <div className="flex flex-col items-start gap-[15px]">
                  <div className="relative font-medium">{member.role}</div>
                  <div className="relative text-[35px] font-medium">
                    {member.name}
                  </div>
                </div>

                {member.description && (
                  <div className="self-stretch relative">{member.description}</div>
                )}
              </div>

              <div className="self-stretch flex-1 min-h-0 rounded-[10px] bg-[#edf9ff] overflow-hidden flex items-start p-[30px] gap-[15px] text-[#004345]">
                <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-start gap-[15px] shrink-0">
                  {qa.map((item) => (
                    <div
                      key={item.question}
                      className="self-stretch flex items-start gap-[5px]"
                    >
                      <Image
                        className="h-2.5 w-2.5"
                        src="/arrow_2.svg"
                        width={10}
                        height={10}
                        sizes="10px"
                        alt=""
                      />
                      <div className="flex-1 flex flex-col items-start gap-[15px]">
                        <div className="self-stretch flex items-center">
                          <div className="relative font-medium">
                            {item.question}
                          </div>
                        </div>
                        <div className="self-stretch relative text-black">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="self-stretch w-0 flex items-start justify-center [transform:_rotate(180deg)] shrink-0">
                  <div className="self-stretch w-[5px] bg-[#004345] [transform:_rotate(-180deg)]" />
                  <div className="h-[147px] w-[5px] bg-[#004345] [transform:_rotate(-180deg)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[500px] flex items-center justify-center p-2.5 gap-[50px] z-[3] shrink-0 text-[18px]">
            <button
              type="button"
              onClick={onPrev}
              className="flex items-center gap-[15px]"
            >
              <Image
                className="w-[15.1px] relative max-h-full object-contain rotate-180"
                src="/arrow.svg"
                width={15.1}
                height={20}
                sizes="15px"
                alt=""
              />
              <div className="relative">PREV</div>
            </button>
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-[15px]"
            >
              <div className="relative">NEXT</div>
              <Image
                className="w-[14.3px] relative max-h-full object-contain"
                src="/arrow.svg"
                width={14.3}
                height={19}
                sizes="15px"
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

