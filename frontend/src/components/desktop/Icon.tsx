import React from 'react';

interface IconProps {
  icon: React.ReactNode;
  label: string;
  onDoubleClick: () => void;
}

const Icon: React.FC<IconProps> = ({ icon, label, onDoubleClick }) => {
  return (
    <div 
      onDoubleClick={onDoubleClick} 
      className="flex flex-col items-center justify-center w-24 h-24 p-2 space-y-2 text-center rounded-lg cursor-pointer hover:bg-secondary"
      aria-label={`Launch ${label}`}
    >
      <div className="text-accent">{React.cloneElement(icon as React.ReactElement, { size: 32 })}</div>
      <span className="text-xs text-text-primary break-words">{label}</span>
    </div>
  );
};

export default Icon;
