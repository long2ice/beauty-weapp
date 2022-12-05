import { ReactNode, RefObject } from "react";
import { ButtonProps } from "@tarojs/components";

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
  url: string;
  tag?: string;
  collection_id?: number;
  offset: number;
}

interface OpenButtonProps {
  children: ReactNode;
  openType: ButtonProps.OpenType;
}
