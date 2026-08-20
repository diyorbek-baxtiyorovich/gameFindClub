/**
 * Development-only Owner access switch. This is not authentication and must be
 * replaced by backend-verified role authorization before production use.
 */
export const TEMPORARY_OWNER_MODE_AVAILABLE =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_TEMP_OWNER_MODE === 'true'
