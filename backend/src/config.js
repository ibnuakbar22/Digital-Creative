const bool = (v, d = false) => (v === undefined ? d : ['1', 'true', 'yes'].includes(String(v).toLowerCase()));

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL,
  databaseSsl: bool(process.env.DATABASE_SSL, false),
  jwtSecret: process.env.JWT_SECRET,
  adminEmail: (process.env.ADMIN_EMAIL || '').toLowerCase(),
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,
  frontendOrigins: (process.env.FRONTEND_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim()),
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseBucket: process.env.SUPABASE_BUCKET || 'project-covers',
};
export const isProd = config.env === 'production';

export function assertConfig() {
  const missing = ['databaseUrl', 'jwtSecret', 'adminEmail', 'adminPasswordHash'].filter((k) => !config[k]);
  if (missing.length) throw new Error(`Konfigurasi .env belum lengkap: ${missing.join(', ')}`);
  if (config.jwtSecret.length < 32) throw new Error('JWT_SECRET minimal 32 karakter.');
}
