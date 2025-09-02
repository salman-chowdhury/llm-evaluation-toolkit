/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TRAFFIC_API_URL?: string;
  readonly VITE_DIRECTIONS_API_KEY?: string;
  readonly VITE_MAP_TILES_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}