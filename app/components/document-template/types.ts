import type { ReactNode } from "react";

export type HeaderNavItem = {
  href: string;
  label: string;
  active?: boolean;
};

export type DocumentMetaEntry = {
  label: string;
  value: string;
};

export type DocumentNavItemVariant = "title" | "child";

export type DocumentNavItem = {
  id: string;
  label: string;
  parentId?: string;
  variant?: DocumentNavItemVariant;
};

export type FooterColumnData = {
  heading: string;
  lines: string[];
};

export type StructuredListItem = {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
};
