// FIX: Replaced /// <reference types="vite/client" /> with manual type definitions
// to resolve "Cannot find type definition file" and "Property 'env' does not exist" errors.

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
