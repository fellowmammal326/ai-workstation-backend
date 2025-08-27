import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import { X, Square, Minus } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onFocus: () => void;
  isActive: boolean;
  zIndex: number;
}

const Window: React.FC<WindowProps> = ({ id, title, children, onClose, onFocus, isActive, zIndex }) => {
  const [size, setSize] = useState({ width: 640, height: 480 });
  const [position, setPosition] = useState({ x: window.innerWidth / 4, y: window.innerHeight / 8 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [lastState, setLastState] = useState({ size, position });

  const onResize = (event: any, { size: newSize }: any) => {
    setSize(newSize);
  };

  const handleDragStop = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };
  
  const toggleMaximize = () => {
    if (isMaximized) {
      setSize(lastState.size);
      setPosition(lastState.position);
    } else {
      setLastState({ size, position });
      setSize({ width: window.innerWidth - 300, height: window.innerHeight - 50});
      setPosition({ x: 0, y: 0 });
    }
    setIsMaximized(!isMaximized);
  };

  const windowClasses = `absolute flex flex-col bg-secondary border rounded-lg shadow-2xl ${isActive ? 'border-accent' : 'border-border-color'}`;

  return (
    <Draggable
      handle=".handle"
      position={position}
      onStop={handleDragStop}
      bounds="parent"
      disabled={isMaximized}
    >
      <Resizable width={size.width} height={size.height} onResize={onResize} minConstraints={[300, 200]}>
        <div 
          className={windowClasses} 
          style={{ width: size.width, height: size.height, zIndex }}
          onMouseDown={onFocus}
        >
          {/* Title Bar */}
          <div className={`handle flex items-center justify-between w-full px-3 py-1 border-b cursor-move ${isActive ? 'bg-accent/20 border-accent' : 'bg-primary border-border-color'}`}>
            <span className="font-medium text-sm text-text-primary">{title}</span>
            <div className="flex items-center space-x-2">
              <button className="p-1 rounded-full hover:bg-white/20" aria-label="Minimize"><Minus size={14} /></button>
              <button onClick={toggleMaximize} className="p-1 rounded-full hover:bg-white/20" aria-label="Maximize/Restore"><Square size={12} /></button>
              <button onClick={onClose} className="p-1 bg-red-500 rounded-full hover:bg-red-600" aria-label="Close"><X size={14} /></button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-2 overflow-auto bg-primary/50">
            {children}
          </div>
        </div>
      </Resizable>
    </Draggable>
  );
};

export default Window;
