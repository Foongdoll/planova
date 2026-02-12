export const API_BASE = '/api';

// Design tokens
export const COLORS = {
  bgMain: '#F7F2E8',
  bgSidebar: '#FFF9EF',
  bgCard: '#FFFFFF',
  greenLight: '#E8F3D8',
  greenMedium: '#CFE8A9',
  greenHover: '#DDF0C4',
  greenDark: '#BEE38A',
  greenBorder: '#B9D98C',
  border: '#E7DDCB',
  hoverBg: '#F2E9DA',
  textPrimary: '#171717',   // neutral-900
  textSecondary: '#525252', // neutral-600
  textMuted: '#737373',     // neutral-500
  textPlaceholder: '#A3A3A3', // neutral-400
} as const;

export const STATUS_LABELS: Record<string, string> = {
  TODO: '할 일',
  DOING: '진행중',
  DONE: '완료',
  BLOCKED: '차단됨',
};

export const STATUS_COLORS: Record<string, string> = {
  TODO: '#E7DDCB',
  DOING: '#CFE8A9',
  DONE: '#86EFAC',
  BLOCKED: '#FCA5A5',
};

export const NODE_COLOR_PRESETS = [
  { value: '', label: '기본', bg: '#FFFFFF', border: '#E7DDCB' },
  { value: '#E8F3D8', label: '연두', bg: '#E8F3D8', border: '#B9D98C' },
  { value: '#DBEAFE', label: '파랑', bg: '#DBEAFE', border: '#93C5FD' },
  { value: '#FEF3C7', label: '노랑', bg: '#FEF3C7', border: '#FCD34D' },
  { value: '#FCE7F3', label: '분홍', bg: '#FCE7F3', border: '#F9A8D4' },
  { value: '#F3E8FF', label: '보라', bg: '#F3E8FF', border: '#C4B5FD' },
  { value: '#FFEDD5', label: '주황', bg: '#FFEDD5', border: '#FDBA74' },
  { value: '#FEE2E2', label: '빨강', bg: '#FEE2E2', border: '#FCA5A5' },
  { value: '#E0F2FE', label: '하늘', bg: '#E0F2FE', border: '#7DD3FC' },
];
