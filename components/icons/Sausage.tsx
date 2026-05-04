import React from 'react';

export const Sausage = ({ size = 24, strokeWidth = 2, className = "", ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M4 10c0-2 2-4 5-4h6c3 0 5 2 5 4v4c0 2-2 4-5 4H9c-3 0-5-2-5-4v-4z" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M7 10v4" />
    <path d="M17 10v4" />
  </svg>
);
