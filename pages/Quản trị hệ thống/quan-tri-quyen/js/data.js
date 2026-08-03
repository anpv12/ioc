/* ============================================================
   DATA.JS — Dữ liệu động Cây Phân Quyền & Danh sách Nhóm Quyền (Gia Lai)
   ============================================================ */

// 1. DỮ LIỆU ĐỘNG CÂY PHÂN QUYỀN HỆ THỐNG (CẤU TRÚC PHÂN CẤP 2 CẤP VÀ 3 CẤP)
const permissionTreeData = [
  {
    id: 'permDashGroup',
    name: 'Dashboard',
    type: 'menu',
    title: 'Dashboard'
  },
  {
    id: 'permSys',
    name: 'Quản trị hệ thống',
    type: 'group',
    title: 'Quản trị hệ thống',
    children: [
      { id: 'permSysUser', name: 'Quản lý người dùng', type: 'menu', title: 'Quản lý người dùng' },
      { id: 'permSysAgency', name: 'Quản lý cơ quan', type: 'menu', title: 'Quản lý cơ quan' },
      { id: 'permSysDept', name: 'Quản lý phòng ban', type: 'menu', title: 'Quản lý phòng ban' },
      { id: 'permSysPerm', name: 'Quản trị quyền', type: 'menu', title: 'Quản trị quyền' },
      { id: 'permSysAssign', name: 'Quản trị phân quyền', type: 'menu', title: 'Quản trị phân quyền' },
      { id: 'permSysConfig', name: 'Cấu hình hệ thống', type: 'menu', title: 'Cấu hình hệ thống' },
      { id: 'permSysIntegrate', name: 'Hệ thống tích hợp', type: 'menu', title: 'Hệ thống tích hợp' }
    ]
  }
];

// 2. MOCK DATA DANH SÁCH CÁC NHÓM QUYỀN VAI TRÒ
const roleGroupsData = [
  {
    id: 1,
    code: 'role_super_admin',
    name: 'Admin',
    description: 'Quyền quản trị cao nhất hệ thống',
    active: true,
    permissions: ['permDashGroup', 'permSys', 'permSysUser', 'permSysAgency', 'permSysDept', 'permSysPerm', 'permSysAssign', 'permSysConfig', 'permSysIntegrate']
  },
  {
    id: 2,
    code: 'admin_dv',
    name: 'Admin đơn vị',
    description: 'Quản trị danh mục và dữ liệu theo đơn vị',
    active: true,
    permissions: ['permDashGroup', 'permSys', 'permSysPerm']
  },
  {
    id: 3,
    code: 'role_lanh_dao_tinh',
    name: 'Lãnh đạo Tỉnh',
    description: 'Lãnh đạo Tỉnh có quyền Quản lý chỉ đạo (Tạo, sửa, xem toàn Tỉnh)',
    active: true,
    permissions: ['permDashGroup']
  },
  {
    id: 4,
    code: 'role_lanh_dao_so',
    name: 'Lãnh đạo Sở',
    description: 'Lãnh đạo Sở có quyền Xem chỉ đạo thuộc phạm vi Sở quản lý',
    active: true,
    permissions: ['permDashGroup']
  },
  {
    id: 5,
    code: 'role_chuyen_vien',
    name: 'Chuyên viên',
    description: 'Chuyên viên có quyền Xem chỉ đạo',
    active: true,
    permissions: ['permDashGroup']
  }
];
