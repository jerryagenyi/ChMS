export interface SectionLayoutProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  spacing?: string | number;
  padding?: string | number;
  background?: string;
  border?: string;
  shadow?: string;
  variant?: 'default' | 'subtle' | 'elevated' | 'bordered';
}

export interface SectionLayoutState {
  isHovered: boolean;
  isFocused: boolean;
} 