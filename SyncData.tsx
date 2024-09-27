import { ReactNode } from "react";

interface ContentProps {
  children?: ReactNode;
}

export default function SyncData({ children }: ContentProps) {
  return children;
}
