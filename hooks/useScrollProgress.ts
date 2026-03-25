"use client";

import { useEffect, useRef, type RefObject } from "react";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export type UseScrollProgressOptions = {
  /**
   * 0 で無効。1 に近いほど滑らか。
   * displayed = displayed + (p - displayed) * smooth
   */
  smooth?: number;
  /**
   * 画面外のとき更新を止める（IntersectionObserver）
   * true の場合、閾値外では onProgress を呼ばない
   */
  pauseWhenOffScreen?: boolean;
};

/**
 * 対象セクションのビューポート内での位置から progress 0..1 を算出し、
 * requestAnimationFrame で毎フレーム onProgress に渡す。
 *
 * 進捗式（セクションの rect 基準・他セクションへ行って戻っても正しく 0/1 に戻る）:
 *   rect.top === 0 → progress = 0（セクション上端が画面中央上）
 *   rect.top === -(sectionHeight - vh) → progress = 1（セクション下端が画面中央上）
 *   progress = clamp(-rect.top / (sectionHeight - vh), 0, 1)
 */
export function useScrollProgress(
  onProgress: (p: number) => void,
  options: UseScrollProgressOptions = {}
): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null);
  const scrollYRef = useRef(0);
  const displayedRef = useRef(0);
  const onProgressRef = useRef(onProgress);
  const { smooth = 0, pauseWhenOffScreen = false } = options;

  onProgressRef.current = onProgress;

  const SNAP_TOP_PX = 2;

  function computeProgress(el: HTMLElement): number {
    const rect = el.getBoundingClientRect();
    const vh = typeof window !== "undefined" ? window.innerHeight : 0;
    const sectionHeight = rect.height || 1;
    const maxScroll = Math.max(1, sectionHeight - vh);
    const raw = rect.top >= -SNAP_TOP_PX ? 0 : -rect.top / maxScroll;
    return clamp(raw, 0, 1);
  }

  useEffect(() => {
    let rafId: number;
    const isInViewRef = { current: true };
    let intersectionObserver: IntersectionObserver | null = null;

    const update = () => {
      const el = ref.current;
      const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
      scrollYRef.current = scrollY;

      if (!el) {
        rafId = requestAnimationFrame(update);
        return;
      }

      if (pauseWhenOffScreen && typeof IntersectionObserver !== "undefined" && !intersectionObserver) {
        intersectionObserver = new IntersectionObserver(
          (entries) => {
            const [entry] = entries;
            if (entry) isInViewRef.current = entry.isIntersecting;
          },
          { threshold: 0, rootMargin: "50% 0px" }
        );
        intersectionObserver.observe(el);
      }

      const p = computeProgress(el);
      let displayed = displayedRef.current;
      if (smooth > 0) {
        displayed = displayed + (p - displayed) * smooth;
        displayedRef.current = displayed;
      } else {
        displayed = p;
        displayedRef.current = p;
      }

      if (pauseWhenOffScreen && !isInViewRef.current) {
        rafId = requestAnimationFrame(update);
        return;
      }

      onProgressRef.current(displayed);
      rafId = requestAnimationFrame(update);
    };

    const handleScroll = () => {
      if (typeof window === "undefined") return;
      scrollYRef.current = window.scrollY;
      const el = ref.current;
      if (!el || (pauseWhenOffScreen && !isInViewRef.current)) return;
      const p = computeProgress(el);
      let displayed: number;
      if (smooth > 0) {
        displayed = displayedRef.current + (p - displayedRef.current) * smooth;
        displayedRef.current = displayed;
      } else {
        displayed = p;
        displayedRef.current = p;
      }
      onProgressRef.current(displayed);
    };

    const handleResize = () => {
      if (typeof window === "undefined") return;
      scrollYRef.current = window.scrollY;
    };

    rafId = requestAnimationFrame(update);
    if (typeof window !== "undefined") {
      scrollYRef.current = window.scrollY;
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleResize);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      }
      intersectionObserver?.disconnect();
    };
  }, [smooth, pauseWhenOffScreen]);

  return ref;
}
