"use client";

import { useEffect, useRef } from "react";

interface IconProps {
  name: string;
  width?: number;
  className?: string;
}

export default function Icon({ name, width = 16, className = "" }: IconProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = `<iconify-icon icon="${name}" width="${width}"></iconify-icon>`;
    }
  }, [name, width]);

  return <span ref={ref} className={className} />;
}
