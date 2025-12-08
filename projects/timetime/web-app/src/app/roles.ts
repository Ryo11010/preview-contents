import { ADMIN_ROLE_LABELS, ROLE_LABELS } from './designTokens';

export const isAdminRole = (role: string) => ADMIN_ROLE_LABELS.includes(role);
export const isOrgLevelRole = (role: string) =>
  role === ROLE_LABELS.superAdmin || role === ROLE_LABELS.orgAdmin;
export const isGroupLevelRole = (role: string) =>
  isOrgLevelRole(role) || role === ROLE_LABELS.groupAdmin;
export const isSubgroupLevelRole = (role: string) =>
  isGroupLevelRole(role) || role === ROLE_LABELS.subAdmin;

