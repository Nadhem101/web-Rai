// Mirrors frontend/src/contexts/AuthContext.jsx PERMISSIONS.
// Maintenance and Indus supervisors currently run the whole app day-to-day,
// so all three roles are equivalent for now — full access, same as admin.
// Tools still declare a `sections` field (see tools.js) so the gate has
// something real to check if roles are ever differentiated again later.
const ALL_SECTIONS = ['dashboard', 'inventaire', 'maintenance', 'curatif', 'ecme', 'indus', 'admin'];
const PERMISSIONS = {
  admin: ALL_SECTIONS,
  maintenance: ALL_SECTIONS,
  indus: ALL_SECTIONS,
};

// True if any of the user's roles grants any of the required sections.
const canAny = (userRoles = [], requiredSections = []) =>
  userRoles.some((r) => (PERMISSIONS[r] || []).some((s) => requiredSections.includes(s)));

module.exports = { PERMISSIONS, canAny };
