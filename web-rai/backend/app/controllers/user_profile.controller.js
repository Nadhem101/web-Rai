const { UserProfile } = require('../models');
const { createClient } = require('@supabase/supabase-js');

// Admin Supabase client (service role) — only used server-side
const getAdminClient = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
};

// GET /api/user-profiles/me — return current user's role
exports.getMe = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Non authentifié' });

    const profile = await UserProfile.findByPk(userId);
    // Default to 'admin' if no profile exists yet (backwards compat)
    return res.json({ user_id: userId, role: profile?.role || 'admin', display_name: profile?.display_name || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/user-profiles — list all users with their roles (admin only)
exports.findAll = async (req, res) => {
  try {
    const supabase = getAdminClient();
    if (!supabase) return res.status(503).json({ error: 'Admin client non configuré' });

    // Fetch all Supabase auth users
    const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (error) return res.status(500).json({ error: error.message });

    const users = data?.users || [];

    // Get all profiles
    const profiles = await UserProfile.findAll();
    const profileMap = {};
    profiles.forEach(p => { profileMap[p.user_id] = p; });

    const result = users.map(u => ({
      user_id:      u.id,
      email:        u.email,
      role:         profileMap[u.id]?.role || 'admin',
      display_name: profileMap[u.id]?.display_name || u.email?.split('@')[0] || '',
      last_sign_in: u.last_sign_in_at,
      created_at:   u.created_at,
    }));

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// PUT /api/user-profiles/:userId — set role for a user (admin only)
exports.upsert = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, display_name } = req.body;

    const VALID_ROLES = ['admin', 'maintenance', 'indus'];
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: `Rôle invalide. Valeurs acceptées: ${VALID_ROLES.join(', ')}` });
    }

    const [profile] = await UserProfile.upsert(
      { user_id: userId, role, display_name: display_name || null },
      { returning: true }
    );

    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};
