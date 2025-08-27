import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../services/api';

interface DocumentEditorProps {
  closeWindow: () => void;
  fileId?: number;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ closeWindow, fileId }) => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('Untitled Document');
  const [loading, setLoading] = useState(!!fileId);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (fileId) {
      api.get(`/files/${fileId}`)
        .then(res => {
          setContent(res.data.content);
          setFileName(res.data.name);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load document.');
          setLoading(false);
          console.error(err);
        });
    }
  }, [fileId]);

  const handleSave = async () => {
    if (!fileName.trim()) {
      alert('Please enter a file name.');
      return;
    }
    // For now, saving only works for new files. Updating existing files would need a PUT route.
    try {
      await api.post('/files', {
        name: fileName,
        type: 'document',
        content: content,
      });
      alert('File saved successfully!');
      // Ideally, update the window title and fileId state here.
      closeWindow(); 
    } catch (err) {
      alert('Failed to save file.');
      console.error(err);
    }
  };
  
  if (loading) return <div>Loading document...</div>;
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-2 space-x-2 border-b border-border-color">
        <input 
          type="text" 
          value={fileName}
          onChange={e => setFileName(e.target.value)}
          className="flex-grow p-1 text-sm bg-transparent border rounded border-border-color"
          placeholder="Enter file name"
        />
        <button onClick={handleSave} className="px-3 py-1 text-sm text-white rounded bg-accent hover:bg-accent-hover">
          Save
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ReactQuill theme="snow" value={content} onChange={setContent} className="h-full border-0" />
      </div>
    </div>
  );
};

export default DocumentEditor;
