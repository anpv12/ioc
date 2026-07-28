/* -----------------------------------------------------------------------
   data.js — Dữ liệu mẫu (mock) cho phân hệ Quản trị quy trình động.
   Load TRƯỚC ui.js. Không chứa logic UI.
   ----------------------------------------------------------------------- */

const orgList = [
  'Sở Thông tin và Truyền thông',
  'Sở Y tế',
  'UBND Tỉnh Gia Lai',
  'Sở Giáo dục và Đào tạo',
  'Sở Tài chính',
  'Sở Xây dựng',
  'Sở Kế hoạch và Đầu tư',
  'Sở Giao thông vận tải',
  'Sở Công Thương',
  'Sở Nội vụ',
  'Sở Lao động Thương binh và Xã hội',
  'Công an Tỉnh',
  'Cục Thống kê tỉnh Gia Lai',
  'UBND Thành phố Pleiku',
  'Phường An Bình',
  'Phường An Khê',
  'Phường An Phú',
  'Phường Ayun Pa',
  'Phường Diên Hồng',
  'Phường Hội Phú',
  'Phường Pleiku',
  'Phường Thống Nhất',
  'Sở Tài Chính',
  'UBND phường An Nhơn Bắc',
  'UBND phường An Nhơn Đông',
  'UBND phường An Nhơn Nam',
  'UBND phường An Nhơn',
  'UBND phường Bình Định',
  'UBND phường Bồng Sơn',
  'UBND phường Hoài Nhơn Bắc',
  'UBND phường Hoài Nhơn Đông',
  'UBND phường Hoài Nhơn Nam',
  'UBND phường Hoài Nhơn Tây',
  'UBND phường Hoài Nhơn',
  'UBND phường Quy Nhơn Bắc',
  'UBND phường Quy Nhơn Đông',
  'UBND phường Quy Nhơn Nam',
  'UBND phường Quy Nhơn Tây',
  'UBND phường Quy Nhơn',
  'UBND phường Tam Quan',
  'UBND xã Ân Hảo',
  'UBND xã An Hòa',
  'UBND xã An Lão',
  'UBND xã An Lương',
  'UBND xã An Nhơn Tây',
  'UBND xã An Toàn',
  'UBND xã Ân Tường',
  'UBND xã An Vinh',
  'UBND xã Bình An',
  'UBND xã Bình Dương',
  'UBND xã Bình Hiệp',
  'UBND xã Bình Khê',
  'UBND xã Bình Phú',
  'UBND xã Canh Liên',
  'UBND xã Canh Vinh',
  'UBND xã Cát Tiến',
  'UBND xã Đề Gi',
  'UBND xã Hòa Hội',
  'UBND xã Hoài Ân',
  'UBND xã Hội Sơn',
  'UBND xã Kim Sơn',
  'UBND xã Ngô Mây',
  'UBND xã Nhơn Châu',
  'UBND xã Phù Cát',
  'UBND xã Phù Mỹ Bắc',
  'UBND xã Phù Mỹ Đông',
  'UBND xã Phù Mỹ Nam',
  'UBND xã Phù Mỹ Tây',
  'UBND xã Phù Mỹ',
  'UBND xã Tây Sơn',
  'UBND xã Tuy Phước Bắc',
  'UBND xã Tuy Phước Đông',
  'UBND xã Tuy Phước Tây',
  'UBND xã Tuy Phước',
  'UBND xã Vân Canh',
  'UBND xã Vạn Đức',
  'UBND xã Vĩnh Quang',
  'UBND xã Vĩnh Sơn',
  'UBND xã Vĩnh Thạnh',
  'UBND xã Vĩnh Thịnh',
  'UBND xã Xuân An',
  'Xã Albá',
  'Xã Ayun',
  'Xã Bàu Cạn',
  'Xã Biển Hồ',
  'Xã Bờ Ngoong',
  'Xã Chơ Long',
  'Xã Chư A Thai',
  'Xã Chư Krey',
  'Xã Chư Păh',
  'Xã Chư Prông',
  'Xã Chư Pưh',
  'Xã Chư Sê',
  'Xã Cửu An',
  'Xã Đak Đoa',
  'Xã Đak Pơ',
  'Xã Đak Rong',
  'Xã Đak Sơmei',
  'Xã Đăk Song',
  'Xã Đức Cơ',
  'Xã Gào',
  'Xã Hra',
  'Xã Ia Băng',
  'Xã Ia Boòng',
  'Xã Ia Chia',
  'Xã Ia Dơk',
  'Xã Ia Dom',
  'Xã Ia Dreh',
  'Xã Ia Grai',
  'Xã Ia Hiao',
  'Xã Ia Hrung',
  'Xã Ia Hrú',
  'Xã Ia Khươl',
  'Xã Ia Ko',
  'Xã Ia Krái',
  'Xã Ia Krêl',
  'Xã Ia Lâu',
  'Xã Ia Le',
  'Xã Ia Ly',
  'Xã Ia Mơ',
  'Xã Ia Nan',
  'Xã Ia O',
  'Xã Ia Pa',
  'Xã Ia Phí',
  'Xã Ia Pia',
  'Xã Ia Pnôn',
  'Xã Ia Púch',
  'Xã Ia Rbol',
  'Xã Ia Rsai',
  'Xã Ia Sao',
  'Xã Ia Tôr',
  'Xã Ia Tul',
  'Xã Kbang',
  'Xã KDang',
  'Xã Kon Chiêng',
  'Xã Kon Gang',
  'Xã Kông Bơ La',
  'Xã Kông Chro',
  'Xã Krong',
  'Xã Lơ Pang',
  'Xã Mang Yang',
  'Xã Phú Thiện',
  'Xã Phú Túc',
  'Xã Pờ Tó',
  'Xã Sơn Lang',
  'Xã SRó',
  'Xã Tơ Tung',
  'Xã Uar',
  'Xã Ya Hội',
  'Xã Ya Ma'
];

const scopeList = [
  'Dân cư',
  'Phản ánh hiện trường',
  'Giáo dục',
  'Kinh tế xã hội',
  'Cán bộ công chức',
  'Văn bản điều hành',
  'CSDL quốc gia về tài chính',
  'Hành chính công'
];

const statusList = [
  'Chờ phân công',
  'Đang xử lý',
  'Đã có báo cáo',
  'Chờ phê duyệt',
  'Đã kết thúc'
];

const legacyProcessStatusMap = {
  'Chuyển xử lý': 'Chờ phân công',
  'Trình duyệt': 'Đã có báo cáo',
  'Phê duyệt': 'Chờ phê duyệt',
  'Đã hoàn thành': 'Đã kết thúc'
};

const userList = [
  'Lãnh đạo Đơn vị',
  'Trưởng phòng Chuyên môn',
  'Chuyên viên Xử lý',
  'Lãnh đạo UBND',
  'Chuyên viên Tổng hợp'
];

const formatStepOrgs = (orgs) => {
  if (!orgs || orgs.length === 0) return 'Chưa chọn cơ quan';
  if (orgs.length <= 2) return orgs.join(', ');
  return `${orgs.slice(0, 2).join(', ')}... (+${orgs.length - 2} cơ quan khác)`;
};

const getOrgsTooltip = (orgs) => {
  if (!orgs || orgs.length === 0) return 'Chưa chọn cơ quan';
  return orgs.join('\n');
};

const ALL_ORGS = ['Sở Thông tin và Truyền thông', 'Sở Y tế', 'UBND Tỉnh Gia Lai', 'Sở Giáo dục và Đào tạo', 'Sở Tài chính', 'Sở Xây dựng', 'Sở Kế hoạch và Đầu tư', 'Sở Giao thông vận tải', 'Sở Công Thương', 'Sở Nội vụ', 'Sở Lao động Thương binh và Xã hội', 'Công an Tỉnh', 'Cục Thống kê tỉnh Gia Lai', 'UBND Thành phố Pleiku'];

const getOrgPersonnel = (orgName) => {
  const leaders = [
    'Nguyễn Thế Anh', 'Trần Hữu Bằng', 'Lê Minh Cường', 'Phạm Hồng Dương', 'Vũ Hoàng Hải',
    'Đặng Quốc Khánh', 'Bùi Xuân Lâm', 'Ngô Văn Minh', 'Dương Đức Nam', 'Phan Văn Phong',
    'Hoàng Quốc Việt', 'Lý Đại Nghĩa', 'Đỗ Tiến Quyết', 'Tạ Minh Tâm', 'Đinh Văn Thắng'
  ];
  const staffFirstNames = ['Văn', 'Thị', 'Hữu', 'Đức', 'Xuân', 'Thu', 'Minh', 'Thanh', 'Hồng', 'Tuấn'];
  const staffLastNames = ['An', 'Bình', 'Chấn', 'Dũng', 'Giang', 'Hải', 'Khánh', 'Linh', 'Nam', 'Phúc', 'Quỳnh', 'Sơn', 'Trang', 'Vinh', 'Yến'];
  const familyNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Vũ', 'Đặng', 'Bùi', 'Hoàng', 'Đỗ', 'Phan'];

  let hash = 0;
  for (let i = 0; i < orgName.length; i++) {
    hash = (hash << 5) - hash + orgName.charCodeAt(i);
    hash |= 0;
  }

  const absHash = Math.abs(hash);
  const leader = leaders[absHash % leaders.length];

  const staff = [];
  for (let i = 1; i <= 5; i++) {
    const fIdx = (absHash + i * 17) % familyNames.length;
    const mIdx = (absHash + i * 31) % staffFirstNames.length;
    const lIdx = (absHash + i * 47) % staffLastNames.length;
    staff.push(`${familyNames[fIdx]} ${staffFirstNames[mIdx]} ${staffLastNames[lIdx]}`);
  }
  return { leader, staff };
};

const getFakeAssigneeArray = (orgsList) => {
  return orgsList.map(org => getOrgPersonnel(org).leader);
};

const getFakeStaffArray = (orgsList) => {
  return orgsList.map(org => getOrgPersonnel(org).staff[0]);
};

const FULL_STEPS = (orgsList) => [
  {
    id: 'node-x-1',
    unitName: 'Tiếp nhận và Phân công xử lý',
    status: 'Chờ phân công',
    org: orgsList[0] || 'Sở Thông tin và Truyền thông',
    orgs: orgsList,
    assignee: getFakeAssigneeArray(orgsList)[0] || 'Tạ Minh Tâm',
    assignees: getFakeAssigneeArray(orgsList),
    description: 'Lãnh đạo đơn vị tiếp nhận và phân công việc xử lý chỉ đạo cho chuyên viên.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-x-2' }]
  },
  {
    id: 'node-x-2',
    unitName: 'Thực hiện nhiệm vụ',
    status: 'Đang xử lý',
    org: orgsList[0] || 'Sở Thông tin và Truyền thông',
    orgs: orgsList,
    assignee: getFakeStaffArray(orgsList)[0] || 'Đặng Tuấn An',
    assignees: getFakeStaffArray(orgsList),
    description: 'Chuyên viên nghiên cứu thực hiện nhiệm vụ được giao.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-x-3' }]
  },
  {
    id: 'node-x-3',
    unitName: 'Báo cáo kết quả',
    status: 'Đã có báo cáo',
    org: orgsList[0] || 'Sở Thông tin và Truyền thông',
    orgs: orgsList,
    assignee: getFakeAssigneeArray(orgsList)[0] || 'Tạ Minh Tâm',
    assignees: getFakeAssigneeArray(orgsList),
    description: 'Xây dựng dự thảo báo cáo kết quả xử lý.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-x-4' }]
  },
  {
    id: 'node-x-4',
    unitName: 'Trình Lãnh đạo phê duyệt',
    status: 'Chờ phê duyệt',
    org: 'Tỉnh Gia Lai',
    orgs: ['Tỉnh Gia Lai'],
    assignee: 'Lãnh đạo Tỉnh',
    assignees: ['Lãnh đạo Tỉnh'],
    description: 'Trình lãnh đạo xem xét và ký duyệt báo cáo.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-x-5' }, { name: 'Trả về', nextNodeId: 'node-x-3' }]
  },
  {
    id: 'node-x-5',
    unitName: 'Kết thúc chỉ đạo',
    status: 'Đã kết thúc',
    org: 'Tỉnh Gia Lai',
    orgs: ['Tỉnh Gia Lai'],
    assignee: 'Lãnh đạo Tỉnh',
    assignees: ['Lãnh đạo Tỉnh'],
    description: 'Lưu trữ hồ sơ xử lý và kết thúc quy trình.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'end' }]
  }
];

const THREE_STEPS = (orgsList) => [
  {
    id: 'node-x-1',
    unitName: 'Phân công xử lý',
    status: 'Chờ phân công',
    org: orgsList[0] || 'Sở Thông tin và Truyền thông',
    orgs: orgsList,
    assignee: getFakeAssigneeArray(orgsList)[0] || 'Nguyễn Văn Anh',
    assignees: getFakeAssigneeArray(orgsList),
    description: 'Lãnh đạo đơn vị tiếp nhận và phân công việc xử lý chỉ đạo cho chuyên viên.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-x-2' }]
  },
  {
    id: 'node-x-2',
    unitName: 'Thực hiện nhiệm vụ',
    status: 'Đang xử lý',
    org: orgsList[0] || 'Sở Thông tin và Truyền thông',
    orgs: orgsList,
    assignee: getFakeStaffArray(orgsList)[0] || 'Nguyễn Văn Anh',
    assignees: getFakeStaffArray(orgsList),
    description: 'Chuyên viên nghiên cứu thực hiện nhiệm vụ được giao.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-x-3' }]
  },
  {
    id: 'node-x-3',
    unitName: 'Báo cáo kết quả',
    status: 'Đã có báo cáo',
    org: orgsList[0] || 'Sở Thông tin và Truyền thông',
    orgs: orgsList,
    assignee: getFakeAssigneeArray(orgsList)[0] || 'Nguyễn Văn Anh',
    assignees: getFakeAssigneeArray(orgsList),
    description: 'Báo cáo kết quả xử lý và kết thúc quy trình.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'end' }]
  }
];

const processCatalog = [
  {
    id: 'process-1',
    code: 'QT-2026-001',
    name: 'Quy trình xử lý PAHT',
    version: '1.0',
    scope: 'Phản ánh hiện trường',
    orgs: ['Sở Thông tin và Truyền thông', 'Sở Y tế'],
    active: true,
    processStatus: 'active',
    createdAt: '23/07/2026 09:30',
    description: 'Mô phỏng quy trình đang hoạt động, full tất cả các bước xử lý, 2 cơ quan áp dụng.',
    nodes: FULL_STEPS(['Sở Thông tin và Truyền thông', 'Sở Y tế'])
  },
  {
    id: 'process-2',
    code: 'QT-2026-002',
    name: 'Quy trình Báo cáo Kinh tế - Xã hội',
    version: '1.0',
    scope: 'Kinh tế xã hội',
    orgs: ALL_ORGS,
    active: true,
    processStatus: 'active',
    createdAt: '02/08/2026 08:00',
    description: 'Mô phỏng quy trình đang hoạt động, yêu cầu báo cáo định kỳ từ tất cả các Sở, Ban, Ngành trên địa bàn.',
    nodes: FULL_STEPS(ALL_ORGS)
  },
  {
    id: 'process-3',
    code: 'QT-2026-003',
    name: 'Quy trình Đánh giá Trường chuẩn Quốc gia',
    version: '1.0',
    scope: 'Giáo dục',
    orgs: ['Sở Giáo dục và Đào tạo'],
    active: false,
    processStatus: 'draft',
    createdAt: '03/08/2026 08:00',
    description: 'Bản nháp quy trình thẩm định, lấy ý kiến hiệp thương từ tất cả các cơ quan (mô phỏng phân công toàn bộ).',
    nodes: FULL_STEPS(ALL_ORGS)
  },
  {
    id: 'process-4',
    code: 'QT-2026-004',
    name: 'Quy trình Thẩm định Dự án Đầu tư',
    version: '1.0',
    scope: 'Hành chính công',
    orgs: ['Sở Xây dựng', 'Sở Kế hoạch và Đầu tư'],
    active: false,
    processStatus: 'draft',
    createdAt: '04/08/2026 08:00',
    description: 'Bản nháp quy trình thẩm định, phối hợp ngắn gọn 3 bước giữa Sở Xây dựng và Sở KH&ĐT.',
    nodes: THREE_STEPS(['Sở Xây dựng', 'Sở Kế hoạch và Đầu tư'])
  }
];
