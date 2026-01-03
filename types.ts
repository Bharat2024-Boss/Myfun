export type Category = 
  | 'alphabet' 
  | 'colors' 
  | 'fruits' 
  | 'vegetables' 
  | 'math' 
  | 'stories' 
  | 'rhymes'
  | 'songs'
  | 'videos'
  | 'quiz' 
  | 'weekdays' 
  | 'months' 
  | 'seasons' 
  | 'home';

export type Language = 
  | 'English' 
  | 'Spanish' 
  | 'French' 
  | 'Hindi' 
  | 'Japanese' 
  | 'Chinese' 
  | 'German' 
  | 'Arabic';

export const LANGUAGES: { label: string; value: Language; flag: string }[] = [
  { label: 'English', value: 'English', flag: '🇺🇸' },
  { label: 'Español', value: 'Spanish', flag: '🇪🇸' },
  { label: 'Français', value: 'French', flag: '🇫🇷' },
  { label: 'हिन्दी', value: 'Hindi', flag: '🇮🇳' },
  { label: '日本語', value: 'Japanese', flag: '🇯🇵' },
  { label: '中文', value: 'Chinese', flag: '🇨🇳' },
  { label: 'Deutsch', value: 'German', flag: '🇩🇪' },
  { label: 'العربية', value: 'Arabic', flag: '🇸🇦' },
];

export interface LearningItem {
  id: string;
  name: string;
  image?: string;
  color?: string;
  emoji?: string;
  description?: string;
  category: Category;
}