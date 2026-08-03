/* ============================================================
   DATA.JS — Dữ liệu Phân quyền Quản lý chỉ đạo cho các nhóm quyền (Gia Lai)
   ============================================================ */

const directiveRoleGroupsData = [
  {
    id: 'role_super_admin',
    code: 'role_super_admin',
    name: 'Super Administrator',
    canView: true,
    canEdit: true
  },
  {
    id: 'admin_dv',
    code: 'admin_dv',
    name: 'Admin đơn vị',
    canView: true,
    canEdit: true
  },
  {
    id: 'role_lanh_dao_tinh',
    code: 'role_lanh_dao_tinh',
    name: 'Lãnh đạo Tỉnh',
    canView: true,
    canEdit: true
  },
  {
    id: 'role_lanh_dao_so',
    code: 'role_lanh_dao_so',
    name: 'Lãnh đạo Sở',
    canView: true,
    canEdit: false
  },
  {
    id: 'role_chuyen_vien',
    code: 'role_chuyen_vien',
    name: 'Chuyên viên',
    canView: true,
    canEdit: false
  }
];
