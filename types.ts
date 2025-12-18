export interface SermonFormData {
  department: string;
  frequency: string;
  period: string;
  sermonType: string;
  coreTheme: string;
  details: string;
  scripture: string;
  direction: string;
  referenceFile: string | null; // Base64 encoded string
  referenceFileName: string | null;
  sermonTime: string;
}

export interface GeneratedResult {
  prompt: string;
  aiResponse?: string;
}

export const DEPARTMENTS = [
  { id: 'infant', label: '영아부' },
  { id: 'preschool', label: '유치부' },
  { id: 'lower_elem', label: '유년부' },
  { id: 'upper_elem', label: '초등부' },
  { id: 'middle', label: '중등부' },
  { id: 'high', label: '고등부' },
  { id: 'university', label: '대학부' },
  { id: '3040', label: '30-40' },
  { id: 'adult', label: '장년부' },
  { id: 'senior', label: '실버' },
];

export const FREQUENCY_OPTIONS = [
  "1주 (단 회)",
  "4주 (1개월)",
  "12주 (3개월)",
  "기타 (직접 입력)"
];

export const SERMON_TIME_OPTIONS = [
  "5분",
  "10분",
  "20분",
  "30분",
  "40분"
];

export const SERMON_TYPES = [
  '인물설교',
  '사건설교',
  '주제설교',
  '강해설교',
  '장례설교',
  '심방설교',
  '새벽설교'
];
