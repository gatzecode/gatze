interface ImportMetaEnv {
  readonly API_URL: string;
  readonly ENVIRONMENT: 'development' | 'staging' | 'production';
  readonly ENABLE_DEBUG: boolean;
  readonly VERSION: string;
  readonly FEATURE_FLAGS: { analytics: boolean; beta: boolean };
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
