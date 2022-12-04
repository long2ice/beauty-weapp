import { ReactNode, RefObject } from "react";

interface LayoutProps {
  children?: ReactNode;
  title?: string;
  navbar?: ReactNode;
}

interface NavbarProps {
  title?: string;
  children?: ReactNode;
}

interface ContentRef {
  refresh: () => void;
  tag: string;
}

interface ContentProps {
  tag: string;
  showTags: boolean;
  limit: number;
}

interface ClickImageProps {
  picture: Picture;
  tag: string;
  offset: number;
}
