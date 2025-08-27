import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { AppFile } from '../../types';
import { FileText, Image, Trash2, RefreshCw } from 'lucide-react';

interface FileExplorerProps {
  openWindow: (app: string, title: string, fileId: number) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ openWindow }) => {
  const [files, setFiles] = useState<AppFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/files');
      setFiles(response.data);
    } catch (err) {
      setError('Failed to load files.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const deleteFile = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await api.delete(`/files/${id}`);
        setFiles(files.filter(f => f.id !== id));
      } catch (err) {
        alert('Failed to delete file.');
      }
    }
  };
  
  const handleOpenFile = (file: AppFile) => {
    const app = file.type === 'document' ? 'DocumentEditor' : 'ImageStudio';
    const title = file.name;
    openWindow(app, title, file.id);
  };

  if (loading) return <div className="p-4">Loading files...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="h-full p-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">My Files</h3>
        <button onClick={fetchFiles} className="p-1 hover:text-accent"><RefreshCw size={16} /></button>
      </div>
      <ul className="space-y-1">
        {files.length === 0 && <p className="text-text-secondary">No files found.</p>}
        {files.map(file => (
          <li key={file.id} className="flex items-center justify-between p-2 rounded hover:bg-secondary">
            <div 
                className="flex items-center space-x-2 cursor-pointer"
                onDoubleClick={() => handleOpenFile(file)}
            >
              {file.type === 'document' ? <FileText size={18} className="text-accent"/> : <Image size={18} className="text-green-400"/>}
              <span>{file.name}</span>
            </div>
            <button onClick={() => deleteFile(file.id)} className="p-1 text-text-secondary hover:text-red-500">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileExplorer;
