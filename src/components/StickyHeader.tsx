"use client";
import { ReactNode, useEffect, useRef, useState } from "react";

interface StickyHeaderProps {
  children: ReactNode;
  className?: string;
}

export const StickyHeader = ({
  children,
  className = "",
}: StickyHeaderProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = headerRef.current?.parentElement;
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setHasScrolled(target.scrollTop > 0);
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={headerRef}
      className={`sticky top-0 z-10 py-4 bg-white transition-shadow mb-4 ${
        hasScrolled ? "border-b shadow-sm" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};
