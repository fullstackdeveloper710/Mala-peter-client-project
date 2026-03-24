"use client";

import { useEffect } from "react";

const DEFAULT_PC_BASE = 1024;
const DEFAULT_TABLET_BASE = 768;
const DEFAULT_SMARTPHONE_BASE = 375;

const DEFAULT_PC_MIN = 1024;
const DEFAULT_TABLET_MIN = 640;

function getUnzoomedWidth(): number {
  const currentZoom = parseFloat(document.documentElement.style.zoom) || 1;
  return window.innerWidth * currentZoom;
}

function applyZoom({
  pcBase,
  tabletBase,
  smartphoneBase,
  pcMin,
  tabletMin,
}: {
  pcBase: number;
  tabletBase: number;
  smartphoneBase: number;
  pcMin: number;
  tabletMin: number;
}) {
  const width = getUnzoomedWidth();
  let zoom: number;

  if (width >= pcMin) {
    zoom = width / pcBase;
  } else if (width >= tabletMin) {
    zoom = width / tabletBase;
  } else {
    zoom = width / smartphoneBase;
  }

  document.documentElement.style.zoom = String(zoom);
  document.documentElement.style.width = "100%";
}

function resetZoom() {
  document.documentElement.style.zoom = "";
  document.documentElement.style.width = "";
}

export default function ResponsiveZoom({
  pcBase = DEFAULT_PC_BASE,
  tabletBase = DEFAULT_TABLET_BASE,
  smartphoneBase = DEFAULT_SMARTPHONE_BASE,
  pcMin = DEFAULT_PC_MIN,
  tabletMin = DEFAULT_TABLET_MIN,
}: {
  pcBase?: number;
  tabletBase?: number;
  smartphoneBase?: number;
  pcMin?: number;
  tabletMin?: number;
} = {}) {
  useEffect(() => {
    applyZoom({ pcBase, tabletBase, smartphoneBase, pcMin, tabletMin });

    const onResize = () =>
      applyZoom({ pcBase, tabletBase, smartphoneBase, pcMin, tabletMin });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      resetZoom();
    };
  }, [pcBase, tabletBase, smartphoneBase, pcMin, tabletMin]);

  return null;
}
