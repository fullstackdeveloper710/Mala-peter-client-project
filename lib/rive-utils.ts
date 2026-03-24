/**
 * Rive ユーティリティ関数
 */

// 許可されたフォルダ名（セキュリティ対策）
const ALLOWED_FOLDERS = ["peterpan"] as const;

// ファイル名のバリデーションパターン
const SAFE_FILENAME_PATTERN = /^[\w\-\.]+$/;

/**
 * ファイル名をバリデートしてサニタイズ
 * @throws Error 不正なファイル名の場合
 */
export function validateFileName(fileName: string): void {
  if (!fileName || typeof fileName !== "string") {
    throw new Error("ファイル名が指定されていません");
  }

  // パストラバーサル対策
  if (fileName.includes("..") || fileName.includes("//")) {
    throw new Error("不正なパスが検出されました");
  }

  const parts = fileName.split("/");

  // フォルダ名のチェック
  if (parts.length > 1) {
    const folder = parts[0];
    if (!ALLOWED_FOLDERS.includes(folder as typeof ALLOWED_FOLDERS[number])) {
      throw new Error(`許可されていないフォルダ: ${folder}`);
    }
  }

  // ファイル名のチェック
  const name = parts[parts.length - 1];
  if (!name.endsWith(".riv")) {
    throw new Error("無効なファイル拡張子です");
  }
}

/**
 * Rive ファイルの安全な URL を構築
 */
export function buildRiveSrc(fileName: string): string {
  validateFileName(fileName);

  const i = fileName.indexOf("/");
  if (i === -1) {
    return `/rive/${encodeURIComponent(fileName)}`;
  }

  const folder = fileName.slice(0, i);
  const name = fileName.slice(i + 1);
  return `/rive/${folder}/${encodeURIComponent(name)}`;
}

/**
 * 値を範囲内にクランプ
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * フェードイン/アウトの opacity を計算
 */
export function calcOpacity(
  progress: number,
  fadeStart: number,
  fadeEnd: number,
  fadeIn: boolean
): number {
  if (fadeIn) {
    if (progress <= fadeStart) return 0;
    if (progress >= fadeEnd) return 1;
    return (progress - fadeStart) / (fadeEnd - fadeStart);
  } else {
    if (progress <= fadeStart) return 1;
    if (progress >= fadeEnd) return 0;
    return 1 - (progress - fadeStart) / (fadeEnd - fadeStart);
  }
}

/**
 * スクロール駆動の値を計算（0-100）
 */
export function getScrollDrivenValue(
  progress: number,
  start: number,
  end: number,
  scale: number
): number {
  const normalized = clamp((progress - start) / (end - start), 0, 1);
  return normalized * scale;
}

/**
 * progress の値を検証
 */
export function validateProgress(value: number): number {
  if (typeof value !== "number" || !isFinite(value)) {
    return 0;
  }
  return clamp(value, 0, 1);
}

/**
 * オーバーレイの共通スタイル
 */
export const overlayStyle = {
  base: {
    willChange: "opacity" as const,
    contain: "layout style paint" as const,
  },
  getVisibility: (opacity: number) => ({
    opacity,
    pointerEvents: (opacity > 0.1 ? "auto" : "none") as "auto" | "none",
    visibility: (opacity > 0 ? "visible" : "hidden") as "visible" | "hidden",
  }),
};
