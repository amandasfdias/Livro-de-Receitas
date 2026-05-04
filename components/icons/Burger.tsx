import React from 'react';

export const Burger = ({ size = 24, strokeWidth = 2, className = "", ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    <path d="M4 12h16" />
    <path d="M4 15h16" />
    <path d="M4 18c0 1.1 0.9 2 2 2h12c1.1 0 2-0.9 2-2" />
  </svg>
);
