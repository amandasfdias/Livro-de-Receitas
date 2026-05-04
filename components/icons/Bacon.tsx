import React from 'react';

export const Bacon = ({ size = 24, strokeWidth = 2, className = "", ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M3 7c2 0 3 2 5 2s3-2 5-2 3 2 5 2 3-2 5-2" />
    <path d="M3 12c2 0 3 2 5 2s3-2 5-2 3 2 5 2 3-2 5-2" />
    <path d="M3 17c2 0 3 2 5 2s3-2 5-2 3 2 5 2 3-2 5-2" />
  </svg>
);
