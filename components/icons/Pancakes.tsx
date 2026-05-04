import React from 'react';

export const Pancakes = ({ size = 24, strokeWidth = 2, className = "", ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M4 14c0 1.5 3.5 3 8 3s8-1.5 8-3" />
    <path d="M4 10c0 1.5 3.5 3 8 3s8-1.5 8-3" />
    <ellipse cx="12" cy="7" rx="8" ry="3" />
    <rect x="10" y="2" width="4" height="3" rx="1" />
  </svg>
);
