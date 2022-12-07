import { ReactNode } from "react";
import { ButtonProps } from "@tarojs/components";
import { CommonEventFunction } from "@tarojs/components/types/common";

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
  favorite?: boolean;
}

interface ClickImageProps {
  url: string;
  tag?: string;
  collection_id?: number;
  favorite?: boolean;
  offset: number;
}

interface OpenButtonProps {
  children: ReactNode;
  openType: ButtonProps.OpenType;
  onChooseAvatar?: CommonEventFunction;
}
