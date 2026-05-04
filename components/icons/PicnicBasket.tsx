import React from 'react';

export const PicnicBasket = ({ size = 24, strokeWidth = 2, className = "", ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
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
    <path d="M4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z" />
    <path d="M8 9V5a4 4 0 0 1 8 0v4" />
    <path d="M4 13h16" />
    <path d="M4 17h16" />
    <path d="M9 9v11" />
    <path d="M15 9v11" />
  </svg>
);
