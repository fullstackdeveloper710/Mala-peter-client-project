import type { RiveConfig } from "@/types/rive";

/** Rive スクロール同期設定（main: スクロール連動 + 遅延 trigger / overlay7: ループ再生） */
export const riveConfig: RiveConfig = {
  main: {
    fileName: "peterpan/#01_peterpan_logo_to_company.riv",
    stateMachineName: "State Machine 1",
    viewModelName: "heropage_vm",
    dataBindingNumberPath: "number_input_1",
    dataBindingNumberPaths: [
      "number_input_1",
      "number_input_2",
      "number_input_3",
      "number_input_4",
    ],
    progressScale: 100,
    numberInputMin: -5,
    numberInputMax: 120,
    progressEnd: 1,
    fadeStart: 0,
    fadeEnd: 0,
  },
  section2: {
    fileName: "peterpan/#02_philosiphy_exective_member.riv",
    stateMachineName: "State Machine 1",
    artboard: "PEM_Animation",
    viewModelName: "ViewModel1",
  },
  section3: {
    fileName: "peterpan/#03_service_layout.riv",
    stateMachineName: "State Machine 1",
    artboard: "#03_Service_Layout",
    viewModelName: "ViewModel1",
    // Data binding: text_hover, image, text1, num1, click1, hover1
  },
  section4: {
    fileName: "peterpan/#04_column_layout.riv",
    stateMachineName: "State Machine 1",
    artboard: "Column_Layout",
    viewModelName: "ViewModel1",
    // Data binding: price1, text1, hover1, image
  },
  toc: {
    fileName: "peterpan/toc_text.riv",
    stateMachineName: "State Machine 1",
  },
  toc01: {
    fileName: "peterpan/toc_01.riv",
    stateMachineName: "State Machine 1",
  },
  toc02: {
    fileName: "peterpan/toc_02.riv",
    stateMachineName: "State Machine 1",
  },
  toc03: {
    fileName: "peterpan/toc_03.riv",
    stateMachineName: "State Machine 1",
  },

  tpoc01: {
    fileName: "peterpan/serive_to_c_01_phone.riv",
    stateMachineName: "State Machine 1",
    artboard: "main",
    viewModelName: "ViewModel1",
  },
  tpoc02: {
    fileName: "peterpan/serive_to_c_02_phone.riv",
    stateMachineName: "State Machine 1",
    artboard: "main",
    viewModelName: "ViewModel1",
  },
  tpoc03: {
    fileName: "peterpan/serive_to_c_03_phone.riv",
    stateMachineName: "State Machine 1",
    artboard: "main",
    viewModelName: "ViewModel1",
  },
  tocWhiteLine: {
    fileName: "peterpan/toc_whiteline.riv",
    stateMachineName: "State Machine 1",
  },
  philosophy: {
    fileName: "peterpan/philosophy_mvv.riv",
    stateMachineName: "State Machine 1",
    artboard: "Main",
    viewModelName: "ViewModel1",
    numberInputNames: ["number1", "number2", "number3"],
    progressScale: 100,
  },
  overlay7: {
    fileName: "peterpan/#05_big_logo_animation.riv",
    stateMachineName: "State Machine 1",
    artboard: "#05_Big_Logo_Animation",
    viewModelName: "ViewModel1",
    dataBindingNumberPath: "number_input_1",
    progressScale: 100,
    progressStart: 0,
    progressEnd: 1,
    fadeStart: 0,
    fadeEnd: 0.3,
    fadeOutStart: 0.7,
    fadeOutEnd: 1,
  },
};

// 開発時のみ設定をバリデーション
if (process.env.NODE_ENV === "development") {
  const errors = (
    Object.entries(riveConfig) as [
      string,
      { fadeStart?: number; fadeEnd?: number },
    ][]
  )
    .filter(
      ([, c]) =>
        "fadeStart" in c &&
        "fadeEnd" in c &&
        (c.fadeStart ?? 0) > (c.fadeEnd ?? 0),
    )
    .map(([key]) => `${key}: fadeStart > fadeEnd`);
  if (errors.length > 0) console.warn("[RiveConfig]", errors);
}
