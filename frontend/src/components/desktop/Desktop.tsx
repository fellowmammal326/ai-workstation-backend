import React, { useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Window from './Window';
import Icon from './Icon';
import DocumentEditor from '../apps/DocumentEditor';
import ImageStudio from '../apps/ImageStudio';
import FileExplorer from '../apps/FileExplorer';
import { WindowInstance } from '../../types';
import { FileText, Image, Folder } from 'lucide-react';

const appComponents: { [key: string]: React.FC<any> } = {
  'DocumentEditor': DocumentEditor,
  'ImageStudio': ImageStudio,
  'FileExplorer': FileExplorer,
};

const Desktop = () => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  const openWindow = (app: string, title: string, fileId?: number) => {
    const newWindow: WindowInstance = { id: uuidv4(), app, title, fileId };
    setWindows([...windows, newWindow]);
    setActiveWindow(newWindow.id);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(win => win.id !== id));
    if (activeWindow === id) {
      setActiveWindow(windows.length > 1 ? windows[windows.length-2].id : null);
    }
  };

  const focusWindow = (id: string) => {
    setActiveWindow(id);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-primary p-4">
      {/* Desktop Icons */}
      <div className="flex flex-col space-y-4">
        <Icon icon={<FileText />} label="New Document" onDoubleClick={() => openWindow('DocumentEditor', 'New Document')} />
        <Icon icon={<Image />} label="Image Studio" onDoubleClick={() => openWindow('ImageStudio', 'Image Studio')} />
        <Icon icon={<Folder />} label="File Explorer" onDoubleClick={() => openWindow('FileExplorer', 'File Explorer')} />
      </div>

      {/* Windows */}
      {windows.map((win, index) => {
        const AppComponent = appComponents[win.app];
        if (!AppComponent) return null;
        
        return (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            isActive={activeWindow === win.id}
            zIndex={activeWindow === win.id ? windows.length : index}
          >
            <AppComponent closeWindow={() => closeWindow(win.id)} openWindow={openWindow} fileId={win.fileId} />
          </Window>
        );
      })}
    </div>
  );
};

export default Desktop;
