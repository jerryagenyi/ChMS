export interface ContentLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  maxWidth?: string | number;
  padding?: string | number;
  spacing?: string | number;
  background?: string;
  border?: string;
  shadow?: string;
}

export interface ContentLayoutState {
  isScrolled: boolean;
  isMobile: boolean;
} 