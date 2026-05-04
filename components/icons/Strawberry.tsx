import React from 'react';

export const Strawberry = ({ size = 24, strokeWidth = 2, className = "", ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 2c-.5 0-1.5 1.5-1.5 2.5S11 7 12 7s1.5-1.5 1.5-2.5S12.5 2 12 2z" />
    <path d="M7 6c0-1 1-2 2-2s2 1 2 2" />
    <path d="M13 6c0-1 1-2 2-2s2 1 2 2" />
    <path d="M12 7c-4 0-7 3-7 8a7 7 0 0 0 14 0c0-5-3-8-7-8z" />
    <circle cx="9" cy="11" r="0.5" fill="currentColor" />
    <circle cx="15" cy="11" r="0.5" fill="currentColor" />
    <circle cx="12" cy="14" r="0.5" fill="currentColor" />
    <circle cx="9" cy="17" r="0.5" fill="currentColor" />
    <circle cx="15" cy="17" r="0.5" fill="currentColor" />
  </svg>
);
