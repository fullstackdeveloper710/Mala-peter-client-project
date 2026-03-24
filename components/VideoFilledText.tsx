'use client';

import { useRef, useEffect, useCallback } from 'react';

export default function VideoFilledText({
  text,
  lines,
  videoSrc,
  imageSrc,
  bgColor,
  className,
  style,
}: {
  /** Single-line text */
  text?: string;
  /** Multi-line text (takes precedence over text) */
  lines?: string[];
  videoSrc?: string;
  /** Static image source (used instead of videoSrc when provided) */
  imageSrc?: string;
  /** If provided, uses CSS mix-blend-mode (more reliable for multi-line). Must match parent background color. */
  bgColor?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const allLines = lines ?? (text ? [text] : []);

  // CSS blend-mode approach: works on any text, multi-line, no canvas needed
  if (bgColor) {
    return (
      <div
        className={className}
        style={{
          position: 'relative',
          overflow: 'hidden',
          isolation: 'isolate',
          ...style,
        }}
      >
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        ) : videoSrc ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          >
            <source src={videoSrc} type="video/webm" />
          </video>
        ) : null}
        <div
          style={{
            position: 'relative',
            background: bgColor,
            color: '#000',
            mixBlendMode: 'screen',
            whiteSpace: 'pre-line',
          }}
        >
          {allLines.join('\n')}
        </div>
      </div>
    );
  }

  // Canvas approach: works on any background (single-line optimized)
  return <VideoFilledTextCanvas text={allLines[0] ?? ''} videoSrc={videoSrc ?? imageSrc ?? ''} className={className} style={style} />;
}

function VideoFilledTextCanvas({
  text,
  videoSrc,
  className,
  style,
}: {
  text: string;
  videoSrc: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const textEl = textRef.current;
    if (!canvas || !video || !textEl) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = textEl.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.ceil(rect.width);
    const h = Math.ceil(rect.height);

    if (w === 0 || h === 0) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (video.readyState >= 2) {
      ctx.drawImage(video, 0, 0, w, h);
    }

    ctx.globalCompositeOperation = 'destination-in';
    const cs = getComputedStyle(textEl);
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'alphabetic';

    const m = ctx.measureText(text);
    const y = (h + m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
    ctx.fillText(text, 0, y);

    ctx.globalCompositeOperation = 'source-over';
    rafRef.current = requestAnimationFrame(draw);
  }, [text]);

  useEffect(() => {
    document.fonts.ready.then(() => {
      rafRef.current = requestAnimationFrame(draw);
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div className={className} style={{ position: 'relative', ...style }}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <source src={videoSrc} type="video/webm" />
      </video>
      <div ref={textRef} aria-hidden="true" style={{ visibility: 'hidden' }}>
        {text}
      </div>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        aria-label={text}
        role="img"
      />
    </div>
  );
}
