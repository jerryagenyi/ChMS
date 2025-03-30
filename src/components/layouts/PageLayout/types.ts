export interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarWidth?: string | number;
  maxWidth?: string | number;
  padding?: string | number;
  isSidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export interface PageLayoutState {
  isSidebarOpen: boolean;
  isMobile: boolean;
} 