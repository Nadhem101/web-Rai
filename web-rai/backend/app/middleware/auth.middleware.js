const { createClient } = require('@supabase/supabase-js');

let supabaseAdmin = null;

const getAdmin = () => {
  if (supabaseAdmin) return supabaseAdmin;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    supabaseAdmin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  }
  return supabaseAdmin;
};

module.exports = async (req, res, next) => {
  // Health check is always public
  if (req.path === '/health') return next();

  const admin = getAdmin();

  // If Supabase admin is not configured, warn and allow all (dev without env vars)
  if (!admin) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[Auth] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — auth disabled');
    }
    return next();
  }

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Non authentifié — veuillez vous connecter' });
  }

  const token = auth.slice(7);

  const { data: { user }, error } = await admin.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ message: 'Session invalide ou expirée — veuillez vous reconnecter' });
  }

  req.user = user;
  next();
};
