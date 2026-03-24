"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [showNav, setShowNav] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);
  const [solidBg, setSolidBg] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setShowNav(true);
      return;
    }

    const onScroll = () => {
      setShowNav(window.scrollY > window.innerHeight);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Transparent over header, white after leaving header
  useEffect(() => {
    const HERO_HEIGHT = 778;
    const updateBg = () => {
      const threshold = isHome ? window.innerHeight : HERO_HEIGHT;
      setSolidBg(window.scrollY >= threshold);
    };
    updateBg();
    window.addEventListener("scroll", updateBg, { passive: true } as AddEventListenerOptions);
    window.addEventListener("resize", updateBg);
    return () => {
      window.removeEventListener("scroll", updateBg as () => void);
      window.removeEventListener("resize", updateBg);
    };
  }, [isHome]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <div
        className="fixed top-0 left-1/2 z-50 flex items-center justify-between transition-all duration-300"
        style={{
          width: "100vw",
          height: 70,
          padding: "0 10px",
          opacity: showNav ? 1 : 0,
          pointerEvents: showNav ? "auto" : "none",
          transitionProperty: "transform, opacity, background-color",
          transform: showNav
            ? "translate(-50%, 0)"
            : "translate(-50%, -100%)",
          transformOrigin: "top left",
          backgroundColor: menuOpen ? "transparent" : solidBg ? "#fff" : "transparent",
        }}
      >
        <div className="flex items-center p-2.5" style={{ opacity: menuOpen ? 0 : 1, transition: "opacity 0.3s" }}>
          <img
            src="/logo_01.svg"
            alt="Peter Pan"
            style={{ height: 40, width: "auto" }}
          />
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-center p-2.5 bg-transparent border-none cursor-pointer"
          style={{ width: 82, height: 70 }}
        >
          <div className="flex flex-col items-end gap-1.5">
            <span
              style={{
                width: 26,
                height: 2,
                backgroundColor: menuOpen ? "#fff" : "#000",
                display: "block",
                transition: "all 0.3s",
                transform: menuOpen ? "rotate(45deg) translateY(5px)" : "none",
              }}
            />
            <span
              style={{
                width: 26,
                height: 2,
                backgroundColor: menuOpen ? "#fff" : "#000",
                display: "block",
                transition: "all 0.3s",
                transform: menuOpen ? "rotate(-45deg) translateY(-5px)" : "none",
              }}
            />
          </div>
        </button>
      </div>

      {/* Dropdown Menu Overlay */}
      <div
        className="fixed inset-0 z-[55] flex flex-col transition-all duration-300"
        style={{
          transform: menuOpen ? "translateY(0)" : "translateY(-100%)",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/rive/peterpan/navbar_bg.webp"
          alt=""
          className="absolute inset-0 w-full h-full z-0 object-contain"
          style={{ backgroundColor: "#000" }}
        />

        {/* Close button (top right) */}
        <div className="self-stretch flex items-center justify-end z-[2]" style={{ height: 70, padding: "0 10px", flexShrink: 0 }}>
          <button
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center p-2.5 bg-transparent border-none cursor-pointer"
            style={{ width: 82, height: 70 }}
          >
            <div className="flex flex-col items-end gap-1.5">
              <span style={{ width: 26, height: 2, backgroundColor: "#fff", display: "block", transform: "rotate(45deg) translateY(5px)" }} />
              <span style={{ width: 26, height: 2, backgroundColor: "#fff", display: "block", transform: "rotate(-45deg) translateY(-5px)" }} />
            </div>
          </button>
        </div>

        {/* Menu content */}
        <div
          className="self-stretch flex-1 flex items-center justify-center z-[2]"
          style={{
            padding: 25,
            color: "#fff",
            fontFamily: "Syncopate, sans-serif",
            fontSize: 35,
          }}
        >
          <div className="flex flex-col items-center gap-[50px]">
            <div className="flex items-start gap-[100px]">
              {/* Left column */}
              <div className="flex flex-col items-start gap-[50px]">
                <Link href="/philosophy" className="relative no-underline text-inherit">PHILOSOPHY</Link>
                <Link href="/company" className="relative no-underline text-inherit">COMPANY</Link>
                <div className="flex flex-col items-start gap-[15px]" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: 14 }}>
                  <div className="relative" style={{ fontSize: 35, fontFamily: "Syncopate, sans-serif" }}>SERVICE</div>
                  <div className="self-stretch flex items-center gap-2.5">
                    <span style={{ display: "inline-block", width: 10, height: 1, backgroundColor: "#fff" }} />
                    <Link href="/service-to-c" className="relative no-underline text-inherit">個人の方</Link>
                  </div>
                  <div className="self-stretch flex items-center gap-2.5">
                    <span style={{ display: "inline-block", width: 10, height: 1, backgroundColor: "#fff" }} />
                    <Link href="/service-to-b" className="relative no-underline text-inherit">法人の方</Link>
                  </div>
                  <div className="self-stretch flex items-center gap-2.5">
                    <span style={{ display: "inline-block", width: 10, height: 1, backgroundColor: "#fff" }} />
                    <Link href="/service-to-c" className="relative no-underline text-inherit">人材紹介会社様</Link>
                  </div>
                </div>
              </div>
              {/* Right column */}
              <div className="flex flex-col items-start gap-[48px]">
                <Link href="/member" className="relative no-underline text-inherit">MEMBER</Link>
                <Link href="/executive-ceo" className="relative no-underline text-inherit">EXECUTIVE / CEO</Link>
                <Link href="/executive-cco" className="relative no-underline text-inherit">EXECUTIVE / CCO</Link>
                <Link href="/column" className="relative no-underline text-inherit">BLOG</Link>
                <div className="relative">RECRUIT</div>
                <Link href="/contact" className="relative no-underline text-inherit">CONTACT</Link>
              </div>
            </div>
            {/* LINE button */}
            <div
              className="self-stretch rounded-[500px] flex items-center justify-between"
              style={{
                backgroundColor: "#06c755",
                padding: "15px 30px",
                fontSize: 20,
                fontFamily: "'Zen Kaku Gothic New', sans-serif",
                gap: 20,
              }}
            >
              <div className="flex items-center gap-[3px]">
                <span className="relative font-medium">LINE</span>
                <span className="relative">で転職相談</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/書き出し画像/top/WebP/Vector (4).svg" alt="" style={{ width: 10, height: 10, filter: "brightness(0) invert(1)" }} />
            </div>
          </div>
        </div>

        {/* Bottom-left logo */}
        <div className="z-[2] flex items-end justify-start" style={{ padding: "10px 0 15px 15px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/LOGO.svg" alt="Peter Pan" style={{ height: 20, width: "auto" }} />
        </div>
      </div>
    </>
  );
}
