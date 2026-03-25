/**
 * Rive アニメーション設定の型定義
 */

/** 基本オーバーレイ設定 */
export interface BaseOverlayConfig {
  fileName: string;
  stateMachineName: string;
  artboard?: string;
  fadeStart: number;
  fadeEnd: number;
  fadeOutStart?: number;
  fadeOutEnd?: number;
}

/** Data Binding 対応オーバーレイ設定 */
export interface DataBindingOverlayConfig extends BaseOverlayConfig {
  viewModelName: string;
  dataBindingNumberPath: string;
  progressScale: number;
  progressStart: number;
  progressEnd: number;
  fadeOutStart: number;
  fadeOutEnd: number;
}

/** 自動再生オーバーレイ設定 */
export interface AutoPlayOverlayConfig extends BaseOverlayConfig {
  animEndProgress?: number;
  fadeOutStart?: number;
  fadeOutEnd?: number;
}

/** メインアニメーション設定 */
export interface MainConfig {
  fileName: string;
  stateMachineName: string;
  artboard?: string;
  viewModelName?: string;
  /** Data Binding の number プロパティパス（単一入力時） */
  dataBindingNumberPath: string;
  /** 複数 number を順次 0→100 にする場合のパス配列 [1, 2, 3]。指定時は dataBindingNumberPath より優先 */
  dataBindingNumberPaths?: [string, string, string] | string[];
  /** Data Binding の trigger プロパティパス（View Model 用、未指定時は triggerInputName を使用） */
  dataBindingTriggerPath?: string;
  /** State Machine の number 入力名（未指定時は dataBindingNumberPath の最終セグメントを使用） */
  numberInputName?: string;
  /** State Machine の trigger 入力名 */
  triggerInputName?: string;
  progressScale: number;
  /** 複数 number 時の最小値（未指定時は 0） */
  numberInputMin?: number;
  /** 複数 number 時の最大値（未指定時は progressScale） */
  numberInputMax?: number;
  progressEnd: number;
  fadeStart: number;
  fadeEnd: number;
}

/** 01 の直後に続くセクション用（単一 Rive 表示） */
export interface Section2Config {
  fileName: string;
  stateMachineName: string;
  artboard?: string;
  viewModelName?: string;
}

/** 全体設定 */
export interface RiveConfig {
  main: MainConfig;
  /** 01 終了後に表示するセクション */
  section2?: Section2Config;
  /** #03 service layout（375×375 × 3） */
  section3?: Section2Config;
  /** #04 column layout（375×375 × 3） */
  section4?: Section2Config;
  overlay1?: BaseOverlayConfig;
  overlay2?: DataBindingOverlayConfig;
  overlay3?: DataBindingOverlayConfig;
  overlay4?: AutoPlayOverlayConfig;
  overlay5?: DataBindingOverlayConfig;
  overlay6?: BaseOverlayConfig;
  overlay7?: DataBindingOverlayConfig;
  toc?: Section2Config;
  toc01?: Section2Config;
  toc02?: Section2Config;
  toc03?: Section2Config;
  tpoc01?: Section2Config;
  tpoc02?: Section2Config;
  tpoc03?: Section2Config;
  tocWhiteLine?: Section2Config;

  /** philosophy_mvv.riv: scroll-driven MVV header */
  philosophy?: {
    fileName: string;
    stateMachineName: string;
    artboard?: string;
    viewModelName: string;
    numberInputNames: [string, string, string];
    progressScale: number;
  };
}

/** オーバーレイ共通 Props */
export interface RiveOverlayProps {
  src: string;
  stateMachineName: string;
  opacity: number;
  onAnimationEnd?: () => void;
  artboard?: string;
  autoBind?: boolean;
  enableListeners?: boolean;
}

/** Data Binding オーバーレイ Props */
export interface DataBindingOverlayProps extends Omit<RiveOverlayProps, 'stateMachineName'> {
  latestProgressRef: React.RefObject<number>;
  onDebugInfo?: (info: DebugInfo) => void;
}

/** デバッグ情報 */
export interface DebugInfo {
  hasBinding: boolean;
  value: number;
}

/** スクロール同期コンポーネント Props */
export interface RiveScrollSyncProps {
  /** デモモード（スクロール連動を無効化） */
  demoMode?: boolean;
  /** スクロールオプション */
  scrollOptions?: {
    smooth?: number;
    pauseWhenOffScreen?: boolean;
  };
  /** スペーサーの高さ（デフォルト: 1200vh） */
  spacerHeight?: number | string;
  /** デバッグ情報を表示 */
  debug?: boolean;
}
