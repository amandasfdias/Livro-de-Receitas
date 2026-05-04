import React from 'react';

export const Champagne = ({ size = 24, strokeWidth = 2, className = "", ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M8 22h8" />
    <path d="M12 17v5" />
    <path d="M7 4l2 13h6l2-13z" />
    <path d="M7 4c0-1 1-2 2-2h6c1 0 2 1 2 2" />
    <circle cx="10" cy="8" r="0.5" fill="currentColor" />
    <circle cx="14" cy="10" r="0.5" fill="currentColor" />
    <circle cx="12" cy="6" r="0.5" fill="currentColor" />
  </svg>
);
