import React from 'react';

interface IconProps {
  // FIX: Changed icon type to `React.ReactElement<any>` to resolve the overload error.
  // The previous `React.ReactElement` type was not specific enough for TypeScript to allow passing the `size` prop.
  icon: React.ReactElement<any>;
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
      {/* FIX: Correctly typed `icon` prop allows passing `size` to `cloneElement` without type errors. */}
      <div className="text-accent">{React.cloneElement(icon, { size: 32 })}</div>
      <span className="text-xs text-text-primary break-words">{label}</span>
    </div>
  );
};

export default Icon;