"use client";

/** Executive/Member card with name plate, photo, and "人物を知る" link */
export default function MemberCard({
  role,
  name,
  href,
  image,
}: {
  role: string;
  name: string;
  href: string;
  image: string;
}) {
  return (
    <div className="flex items-start isolate shrink-0">
      {/* Name plate */}
      <div className="flex flex-col items-center z-[1]">
        <div
          className="flex flex-col items-start justify-center relative isolate gap-0 px-4"
          style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: 24, color: "#000", width: 190, height: 81, paddingBottom: 10 }}
        >
          {/* Background highlight */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Vector (5).svg"
            alt=""
            className="absolute inset-0 z-[0]"
            style={{ width: 190, height: 81 }}
          />
          <div className="relative leading-9 font-medium z-[1] shrink-0">{role}</div>
          <a
            className="relative leading-9 font-medium z-[2] shrink-0 no-underline whitespace-nowrap"
            style={{ fontSize: 35, color: "inherit" }}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {name}
          </a>
        </div>
      </div>
      {/* Photo + link */}
      <div className="flex flex-col items-start z-[0] relative" style={{ width: 485, marginLeft: -100 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="self-stretch relative overflow-hidden shrink-0 object-cover"
          style={{ height: 357 }}
        />
        {/* "人物を知る" link */}
        <div
          className="self-stretch bg-white flex items-center justify-between p-5 gap-5"
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#000",
            fontFamily: "'Zen Kaku Gothic New', sans-serif",
            fontSize: 24,
            color: "#000",
          }}
        >
          <div className="relative font-medium" style={{ lineHeight: "30px" }}>人物を知る</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/arrow.svg" alt="" style={{ width: 40, height: 40 }} />
        </div>
      </div>
    </div>
  );
}
