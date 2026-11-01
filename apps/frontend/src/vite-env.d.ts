interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_AUTH_PUBLIC_KEY_PEM: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}