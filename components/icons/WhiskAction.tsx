import React from 'react';

export const WhiskAction = ({ size = 24, strokeWidth = 2, className = "", ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M16 8l4-4" />
    <path d="M14 10c-2 2-6 4-8 8-1 2-2 2-3 1s-1-2 1-3c4-2 6-6 8-8" />
    <path d="M14 10c-1 3-4 6-6 8" />
    <path d="M14 10c-3 1-6 4-8 6" />
    <circle cx="6" cy="6" r="1" />
    <circle cx="18" cy="18" r="1" />
    <circle cx="20" cy="10" r="1" />
  </svg>
);
