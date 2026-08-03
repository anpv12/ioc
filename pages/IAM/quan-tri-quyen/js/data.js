/* ============================================================
   DATA.JS — Dữ liệu động Cây Phân Quyền & Danh sách Nhóm Quyền (IAM Gia Lai)
   ============================================================ */

// 1. DỮ LIỆU ĐỘNG CÂY PHÂN QUYỀN HỆ THỐNG (CẤU TRÚC PHÂN CẤP 2 CẤP VÀ 3 CẤP)
const permissionTreeData = [
  {
    id: 'permDashGroup',
    name: 'Dashboard',
    title: 'Dashboard',
    children: [
      {
        id: 'permDirectiveGroup',
        name: 'Quản trị chỉ đạo',
        title: 'Quản trị chỉ đạo',
        children: [
          { id: 'permDirectiveManage', name: 'Quản lý chỉ đạo', title: 'Quản lý chỉ đạo' },
          { id: 'permDirectiveView', name: 'Xem chỉ đạo', title: 'Xem chỉ đạo' }
        ]
      }
    ]
  },
  {
    id: 'permSys',
    name: 'Quản trị hệ thống',
    title: 'Quản trị hệ thống',
    children: [
      { id: 'permSysUser', name: 'Quản lý người dùng', title: 'Quản lý người dùng' },
      { id: 'permSysAgency', name: 'Quản lý cơ quan', title: 'Quản lý cơ quan' },
      { id: 'permSysDept', name: 'Quản lý phòng ban', title: 'Quản lý phòng ban' },
      { id: 'permSysPerm', name: 'Quản trị quyền', title: 'Quản trị quyền' },
      { id: 'permSysAssign', name: 'Quản trị phân quyền', title: 'Quản trị phân quyền' },
      { id: 'permSysConfig', name: 'Cấu hình hệ thống', title: 'Cấu hình hệ thống' },
      { id: 'permSysIntegrate', name: 'Hệ thống tích hợp', title: 'Hệ thống tích hợp' }
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
    permissions: ['permDashGroup', 'permDirectiveGroup', 'permDirectiveManage', 'permDirectiveView', 'permSys', 'permSysUser', 'permSysAgency', 'permSysDept', 'permSysPerm', 'permSysAssign', 'permSysConfig', 'permSysIntegrate']
  },
  {
    id: 2,
    code: 'admin_dv',
    name: 'Admin đơn vị',
    description: 'Quản trị danh mục và dữ liệu theo đơn vị',
    active: true,
    permissions: ['permDashGroup', 'permDirectiveGroup', 'permDirectiveView', 'permSys', 'permSysPerm']
  },
  {
    id: 3,
    code: 'role_lanh_dao_tinh',
    name: 'Lãnh đạo Tỉnh',
    description: 'Lãnh đạo Tỉnh có quyền Quản lý chỉ đạo (Tạo, sửa, xem toàn Tỉnh)',
    active: true,
    permissions: ['permDashGroup', 'permDirectiveGroup', 'permDirectiveManage']
  },
  {
    id: 4,
    code: 'role_lanh_dao_so',
    name: 'Lãnh đạo Sở',
    description: 'Lãnh đạo Sở có quyền Xem chỉ đạo thuộc phạm vi Sở quản lý',
    active: true,
    permissions: ['permDashGroup', 'permDirectiveGroup', 'permDirectiveView']
  },
  {
    id: 5,
    code: 'role_chuyen_vien',
    name: 'Chuyên viên',
    description: 'Chuyên viên có quyền Xem chỉ đạo (Quyền dữ liệu tự động lọc theo ID người dùng được giao xử lý)',
    active: true,
    permissions: ['permDashGroup', 'permDirectiveGroup', 'permDirectiveView']
  }
];
