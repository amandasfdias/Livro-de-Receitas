import React from 'react';

export const Nuts = ({ size = 24, strokeWidth = 2, className = "", ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 4c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z" />
    <path d="M7 14c-1.5 0-3 1-3 2.5S5.5 19 7 19s3-1 3-2.5S8.5 14 7 14z" />
    <path d="M17 14c-1.5 0-3 1-3 2.5s1.5 2.5 3 2.5 3-1 3-2.5-1.5-2.5-3-2.5z" />
  </svg>
);
