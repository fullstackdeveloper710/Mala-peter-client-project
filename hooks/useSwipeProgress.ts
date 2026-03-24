"use client";

import { useEffect, useRef, type RefObject } from "react";

export type UseSwipeProgressOptions = {
  /**
   * Minimum swipe distance in pixels to trigger
   */
  threshold?: number;
  /**
   * Only enable on mobile (width < 768px)
   */
  mobileOnly?: boolean;
  /**
   * Invert swipe direction (up/down swaps)
   */
  inverted?: boolean;
};

/**
 * Track vertical swipe gestures and convert to progress 0..1
 * Swipe up = progress toward 1
 * Swipe down = progress toward 0
 */
export function useSwipeProgress(
  onProgress: (p: number) => void,
  options: UseSwipeProgressOptions = {}
): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const progressRef = useRef(0);
  const onProgressRef = useRef(onProgress);
  const { threshold = 50, mobileOnly = true, inverted = false } = options;

  onProgressRef.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if mobile
    if (mobileOnly && typeof window !== "undefined" && window.innerWidth >= 768) {
      return;
    }

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaY = touch.clientY - touchStartRef.current.y;
      
      // Swipe up = negative deltaY (should increase progress)
      // Swipe down = positive deltaY (should decrease progress)
      let swipeProgress = (-deltaY / (window.innerHeight * 0.5)); // Full screen height = 2x progress
      
      if (inverted) {
        swipeProgress = -swipeProgress;
      }

      // Clamp between 0 and 1
      progressRef.current = Math.max(0, Math.min(1, swipeProgress));
      onProgressRef.current(progressRef.current);
    };

    const handleTouchEnd = () => {
      // Optionally snap back or smooth scroll
      touchStartRef.current = { x: 0, y: 0 };
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [threshold, mobileOnly, inverted]);

  return ref;
}
