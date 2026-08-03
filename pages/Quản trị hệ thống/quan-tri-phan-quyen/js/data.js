/* ============================================================
   DATA.JS — Dữ liệu động Cây Người dùng & Danh sách Nhóm Quyền (Gia Lai)
   ============================================================ */

// 1. DỮ LIỆU ĐỘNG CÂY NGƯỜI DÙNG: CƠ QUAN -> PHÒNG BAN -> NHÂN VIÊN
const orgUserTreeData = [
  {
    id: 'org1',
    name: 'Sở Khoa học và Công nghệ tỉnh Gia Lai',
    children: [
      {
        id: 'dept1_1',
        name: 'Lãnh đạo Sở',
        children: [
          { id: 'emp1_1_1', name: 'Lê Quang Thanh', assignedRoles: ['role_super_admin'] },
          { id: 'emp1_1_2', name: 'Nguyễn Hoa Cương', assignedRoles: ['role_lanh_dao_so'] },
          { id: 'emp1_1_3', name: 'Đinh Ngọc Bình', assignedRoles: ['role_lanh_dao_so'] },
          { id: 'emp1_1_4', name: 'Nguyễn Thanh Hiển', assignedRoles: [] }
        ]
      },
      {
        id: 'dept1_2',
        name: 'Phòng Hành chính - Tổng hợp',
        children: [
          { id: 'emp1_2_1', name: 'Trần Văn Hoàng', assignedRoles: ['role_chuyen_vien'] },
          { id: 'emp1_2_2', name: 'Phạm Thị Mai', assignedRoles: ['role_chuyen_vien'] },
          { id: 'emp1_2_3', name: 'Vũ Đức Nam', assignedRoles: [] }
        ]
      },
      {
        id: 'dept1_3',
        name: 'Phòng Quản lý Công nghệ & Chuyển đổi số',
        children: [
          { id: 'emp1_3_1', name: 'Hoàng Quốc Việt', assignedRoles: ['admin_dv'] },
          { id: 'emp1_3_2', name: 'Nguyễn Thị Bích', assignedRoles: ['role_chuyen_vien'] }
        ]
      }
    ]
  },
  {
    id: 'org2',
    name: 'UBND Tỉnh Gia Lai',
    children: [
      {
        id: 'dept2_1',
        name: 'Thường trực UBND Tỉnh',
        children: [
          { id: 'emp2_1_1', name: 'Nguyễn Văn Minh', assignedRoles: ['role_lanh_dao_tinh'] },
          { id: 'emp2_1_2', name: 'Phạm Quốc Bảo', assignedRoles: ['role_lanh_dao_tinh'] }
        ]
      },
      {
        id: 'dept2_2',
        name: 'Văn phòng UBND Tỉnh',
        children: [
          { id: 'emp2_2_1', name: 'Trần Đình Trọng', assignedRoles: ['role_chuyen_vien'] }
        ]
      }
    ]
  }
];

// 2. DANH SÁCH NHÓM QUYỀN VAI TRÒ
const assignRoleGroupsData = [
  { id: 'role_super_admin', name: 'Super Administrator', code: 'role_super_admin' },
  { id: 'admin_dv', name: 'Admin đơn vị', code: 'admin_dv' },
  { id: 'role_lanh_dao_tinh', name: 'Lãnh đạo Tỉnh', code: 'role_lanh_dao_tinh' },
  { id: 'role_lanh_dao_so', name: 'Lãnh đạo Sở', code: 'role_lanh_dao_so' },
  { id: 'role_chuyen_vien', name: 'Chuyên viên', code: 'role_chuyen_vien' }
];
