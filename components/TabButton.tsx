
import React from 'react';

interface TabButtonProps {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  special?: boolean;
}

export const TabButton: React.FC<TabButtonProps> = ({ icon, active, onClick, special }) => {
  if (special) {
    return (
      <div className="flex items-center justify-center w-[20%] h-full">
        <button 
          onClick={onClick}
          className="flex items-center justify-center w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full active:scale-90 transition-transform z-50"
        >
          {React.cloneElement(icon as React.ReactElement, { 
            size: 24,
            strokeWidth: 2.5
          })}
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center w-[20%] h-full transition-all
        ${active ? 'text-black dark:text-white scale-105 font-bold' : 'text-black opacity-40 hover:opacity-60 dark:text-white dark:opacity-40'}
      `}
    >
      <div className="flex items-center justify-center">
        {React.cloneElement(icon as React.ReactElement, { 
          size: 22,
          strokeWidth: active ? 2.5 : 1.5
        })}
      </div>
    </button>
  );
};
