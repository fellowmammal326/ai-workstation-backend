import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface ImageStudioProps {
  closeWindow: () => void;
  fileId?: number;
}

const ImageStudio: React.FC<ImageStudioProps> = ({ closeWindow, fileId }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (fileId) {
      setLoading(true);
      api.get(`/files/${fileId}`)
        .then(res => {
          setImage(res.data.content);
          setFileName(res.data.name);
          setPrompt(res.data.name);
          setLoading(false);
        })
        .catch(err => {
          alert('Failed to load image');
          setLoading(false);
        });
    }
  }, [fileId]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImage(null);
    try {
      const response = await api.post('/ai/generate-image', { prompt });
      setImage(response.data.image);
      setFileName(prompt);
    } catch (err) {
      alert('Failed to generate image.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!image || !fileName.trim()) {
        alert('Nothing to save or file name is missing.');
        return;
    };
    try {
      await api.post('/files', {
        name: fileName,
        type: 'image',
        content: image,
      });
      alert('Image saved successfully!');
      closeWindow();
    } catch (err) {
      alert('Failed to save image.');
    }
  };

  return (
    <div className="flex flex-col h-full p-2 space-y-2">
      <div className="flex space-x-2">
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Enter a prompt to generate an image..."
          className="flex-grow p-2 text-sm bg-primary border rounded border-border-color"
          disabled={loading}
        />
        <button onClick={handleGenerate} disabled={loading} className="px-4 py-2 text-sm text-white rounded bg-accent hover:bg-accent-hover disabled:bg-gray-500">
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center bg-primary rounded border border-dashed border-border-color">
        {loading && !image && <p>Generating your image...</p>}
        {image && <img src={`data:image/png;base64,${image}`} alt={prompt} className="object-contain max-h-full max-w-full" />}
        {!loading && !image && <p className="text-text-secondary">Image will appear here</p>}
      </div>
      {image && (
        <div className="flex items-center space-x-2">
          <input 
            type="text" 
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="flex-grow p-2 text-sm bg-primary border rounded border-border-color"
            placeholder="Enter file name to save"
          />
          <button onClick={handleSave} className="px-4 py-2 text-sm text-white rounded bg-green-600 hover:bg-green-700">Save</button>
        </div>
      )}
    </div>
  );
};

export default ImageStudio;
