export interface DevProgressData {
  label: string;
  id?: number;
  children?: DevProgressData[];
  finished?: boolean;
}
export const devProgressRawData: DevProgressData[] = [
  {
    label: "App Launcher",
    finished: true,
  },
  {
    label: "Commands",
    children: [{ label: "System Commands", finished: true }],
  },
  {
    label: "Extensions",
    children: [
      { label: "UI Extension", finished: true },
      { label: "Inline Extension", finished: false },
      { label: "GUI Extension Editor (like Alfred)", finished: false },
      { label: "Quick Link", finished: false },
      {
        label: "API",
        children: [
          { label: "Extension Storage", finished: false },
          { label: "File Search", finished: false },
          { label: "Clipboard", finished: true },
          { label: "Notification", finished: true },
          { label: "File System", finished: true },
          { label: "Dialog", finished: true },
          { label: "Window", finished: true },
          { label: "Shell", finished: true },
          { label: "System Info (CPU, Battery, etc.)", finished: false },
          { label: "Network", finished: false },
        ],
      },
      { label: "Use HTTPS for Extension Loading", finished: false },
      {
        label: "Installation System",
        children: [
          { label: "Through Tarball File", finished: true },
          { label: "Through Tarball URL", finished: true },
          { label: "Through Remote Website", finished: true },
          { label: "Extension Store", finished: false },
        ],
      },
    ],
  },
  {
    label: "Search",
    children: [
      { label: "Basic Keyword Search", finished: true },
      { label: "Search Bar Debouncing", finished: true },
      { label: "Regex Search", finished: false },
      { label: "Fuzzy Search", finished: false },
      { label: "Sort by Keyword Similarity", finished: false },
      { label: "Sort by use frequency", finished: false },
      { label: "Unit Conversion", finished: false },
      { label: "Currency Conversion", finished: false },
      { label: "File Search", finished: false },
    ],
  },
  {
    label: "Security",
    children: [
      { label: "Isolated Extension Build Environment", finished: true },
      { label: "Extension Permission Control System (requires API declaration)", finished: false },
    ],
  },
];

let count = 0;
export const finishedIds: number[] = [];
let overallProgress = 0;
// fill in devProgressRawData id field with count using DPS
function fillId(data: DevProgressData): void {
  data.id = count++;
  if (data.finished) {
    overallProgress++;
  }
  if (data.finished) {
    finishedIds.push(data.id);
  }
  if (data.children) {
    data.children.forEach(fillId);
  }
}
devProgressRawData.forEach(fillId);
export const overallProgressPercentage = Math.round((overallProgress / count) * 100);



export interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}
