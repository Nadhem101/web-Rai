const { UserProfile } = require('../../models');

const VALID_ROLES = ['admin', 'maintenance', 'indus'];

// Resolve a Supabase user id to their app roles, server-side, from the same
// user_profiles table the rest of the app uses (see user_profile.controller.js).
//
// Deliberately fails CLOSED (returns []) when there's no profile or no role
// set — unlike the frontend's AuthContext.fetchRoles(), which defaults an
// unresolved user to ['admin']. That default is tolerable for a dashboard
// that just hides nav links; it would be a real privilege-escalation bug in
// something that's actively answering "how many X" questions with
// role-scoped tools, so the assistant does not inherit it.
async function resolveRoles(userId) {
  if (!userId) return [];
  const profile = await UserProfile.findByPk(userId);
  if (!profile?.role) return [];
  return profile.role.split(',').map((r) => r.trim()).filter((r) => VALID_ROLES.includes(r));
}

module.exports = { resolveRoles };
