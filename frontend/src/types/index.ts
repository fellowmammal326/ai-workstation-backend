export interface User {
  id: number;
  email: string;
}

export interface AppFile {
  id: number;
  name: string;
  type: 'document' | 'image';
  content?: string; // Content is loaded on demand
  created_at: string;
}

export interface WindowInstance {
  id: string;
  app: string;
  title: string;
  fileId?: number; // For opening existing files
}
