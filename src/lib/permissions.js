export const permissions = {
  admin: {
    can: [
      'view_all_dashboards',
      'manage_users',
      'manage_feeders',
      'manage_billing',
      'view_analytics',
      'verify_customers',
      'manage_officers',
    ],
  },
  'field-officer': {
    can: [
      'view_feeders',
      'record_readings',
      'inspect_meters',
      'report_outages',
      'verify_customers',
      'view_assigned_area',
    ],
  },
  customer: {
    can: [
      'view_own_bills',
      'view_own_usage',
      'report_outage',
      'declare_vacation',
      'view_own_profile',
    ],
  },
};

export function hasPermission(userRole, permission) {
  return permissions[userRole]?.can.includes(permission) || false;
}

export function getCustomerCategoryPermissions(category) {
  // Different customer categories might have different permissions
  const basePermissions = permissions.customer.can;
  
  // Add category-specific permissions if needed
  if (category?.startsWith('C')) {
    // Commercial customers might have additional permissions
    return [...basePermissions, 'view_tax_invoices', 'request_higher_load'];
  }
  
  return basePermissions;
}
