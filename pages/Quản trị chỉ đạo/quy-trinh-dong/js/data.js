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
  if (orgs.length <= 3) return orgs.join(', ');
  return `${orgs.slice(0, 3).join(', ')}... (+${orgs.length - 3} cơ quan khác)`;
};

const ALL_ORGS = ['Sở Thông tin và Truyền thông', 'Sở Y tế', 'UBND Tỉnh Gia Lai', 'Sở Giáo dục và Đào tạo', 'Sở Tài chính', 'Sở Xây dựng', 'Sở Kế hoạch và Đầu tư', 'Sở Giao thông vận tải', 'Sở Công Thương', 'Sở Nội vụ', 'Sở Lao động Thương binh và Xã hội', 'Công an Tỉnh', 'Cục Thống kê tỉnh Gia Lai', 'UBND Thành phố Pleiku'];

const orgPersonnelCache = {};

const generateOrgPersonnel = (orgName) => {
  const leaders = [
    'Nguyễn Thế Anh', 'Trần Hữu Bằng', 'Lê Minh Cường', 'Phạm Hồng Dương', 'Vũ Hoàng Hải',
    'Đặng Quốc Khánh', 'Bùi Xuân Lâm', 'Ngô Văn Minh', 'Dương Đức Nam', 'Phan Văn Phong',
    'Hoàng Quốc Việt', 'Lý Đại Nghĩa', 'Đỗ Tiến Quyết', 'Tạ Minh Tâm', 'Đinh Văn Thắng'
  ];
  const staffFirstNames = ['Văn', 'Thị', 'Hữu', 'Đức', 'Xuân', 'Thu', 'Minh', 'Thanh', 'Hồng', 'Tuấn'];
  const staffLastNames = ['An', 'Bình', 'Chấn', 'Dũng', 'Giang', 'Hải', 'Khánh', 'Linh', 'Nam', 'Phúc', 'Quỳnh', 'Sơn', 'Trang', 'Vinh', 'Yến'];
  const familyNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Vũ', 'Đặng', 'Bùi', 'Hoàng', 'Đỗ', 'Phan'];

  let hash = 0;
  const nameStr = orgName || 'DefaultOrg';
  for (let i = 0; i < nameStr.length; i++) {
    hash = (hash << 5) - hash + nameStr.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  const leaderName = leaders[absHash % leaders.length];
  const leaderObj = {
    name: leaderName,
    title: 'Lãnh đạo',
    fullName: `${leaderName} - Lãnh đạo`
  };

  const staffObjs = [];
  const staff = [];
  for (let i = 1; i <= 5; i++) {
    const fIdx = (absHash + i * 17) % familyNames.length;
    const mIdx = (absHash + i * 31) % staffFirstNames.length;
    const lIdx = (absHash + i * 47) % staffLastNames.length;
    const sName = `${familyNames[fIdx]} ${staffFirstNames[mIdx]} ${staffLastNames[lIdx]}`;
    const sObj = {
      name: sName,
      title: 'Chuyên viên',
      fullName: `${sName} - Chuyên viên`
    };
    staffObjs.push(sObj);
    staff.push(sObj.fullName);
  }

  return {
    leader: leaderObj.fullName,
    leaderObj,
    staff,
    staffObjs
  };
};

const getOrgPersonnel = (orgName) => {
  const key = orgName || 'DefaultOrg';
  if (!orgPersonnelCache[key]) {
    orgPersonnelCache[key] = generateOrgPersonnel(key);
  }
  return orgPersonnelCache[key];
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
    assignee: getFakeAssigneeArray(orgsList)[0] || '',
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
    assignee: getFakeAssigneeArray(orgsList)[0] || '',
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
    name: 'Quy trình tiếp nhận và xử lý Phản ánh hiện trường',
    version: '1.0',
    scope: 'Phản ánh hiện trường',
    orgs: ['Sở Thông tin và Truyền thông', 'Sở Y tế'],
    active: true,
    processStatus: 'active',
    createdAt: '23/07/2026 09:30',
    description: 'Quy trình chuẩn xử lý phản ánh kiến nghị của người dân qua trung tâm IOC.',
    nodes: [
      {
        id: 'node-p1-1',
        unitName: 'Tiếp nhận và Phân công xử lý',
        status: 'Chờ phân công',
        org: 'Sở Thông tin và Truyền thông, Sở Y tế',
        orgs: ['Sở Thông tin và Truyền thông', 'Sở Y tế'],
        assignee: 'Nguyễn Thế Anh - Lãnh đạo, Phạm Hồng Dương - Lãnh đạo',
        assignees: [getOrgPersonnel('Sở Thông tin và Truyền thông').leader, getOrgPersonnel('Sở Y tế').leader],
        description: 'Lãnh đạo đơn vị tiếp nhận phản ánh và phân công cán bộ chuyên trách.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-p1-2' }]
      },
      {
        id: 'node-p1-2',
        unitName: 'Thực hiện xác minh & Xử lý hiện trường',
        status: 'Đang xử lý',
        org: 'Sở Thông tin và Truyền thông, Sở Y tế',
        orgs: ['Sở Thông tin và Truyền thông', 'Sở Y tế'],
        assignee: 'Đặng Tuấn An - Chuyên viên, Phạm Thu Bình - Chuyên viên',
        assignees: [getOrgPersonnel('Sở Thông tin và Truyền thông').staff[0], getOrgPersonnel('Sở Y tế').staff[0]],
        description: 'Chuyên viên các đơn vị kiểm tra thông tin thực tế và xử lý kiến nghị.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-p1-3' }]
      },
      {
        id: 'node-p1-3',
        unitName: 'Tổng hợp Báo cáo kết quả',
        status: 'Đã có báo cáo',
        org: 'Sở Thông tin và Truyền thông, Sở Y tế',
        orgs: ['Sở Thông tin và Truyền thông', 'Sở Y tế'],
        assignee: 'Nguyễn Thế Anh - Lãnh đạo, Phạm Hồng Dương - Lãnh đạo',
        assignees: [getOrgPersonnel('Sở Thông tin và Truyền thông').leader, getOrgPersonnel('Sở Y tế').leader],
        description: 'Lập báo cáo tổng hợp kết quả xử lý gửi Lãnh đạo phê duyệt.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-p1-4' }]
      },
      {
        id: 'node-p1-4',
        unitName: 'Trình Lãnh đạo Tỉnh phê duyệt',
        status: 'Chờ phê duyệt',
        org: 'Tỉnh Gia Lai',
        orgs: ['Tỉnh Gia Lai'],
        assignee: 'Lãnh đạo Tỉnh',
        assignees: ['Lãnh đạo Tỉnh'],
        description: 'Lãnh đạo UBND Tỉnh xem xét và ban hành phê duyệt báo cáo.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-p1-5' }, { name: 'Trả về', nextNodeId: 'node-p1-3' }]
      },
      {
        id: 'node-p1-5',
        unitName: 'Kết thúc chỉ đạo & Đóng phản ánh',
        status: 'Đã kết thúc',
        org: 'Tỉnh Gia Lai',
        orgs: ['Tỉnh Gia Lai'],
        assignee: 'Lãnh đạo Tỉnh',
        assignees: ['Lãnh đạo Tỉnh'],
        description: 'Công khai kết quả xử lý và kết thúc luồng chỉ đạo.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'end' }]
      }
    ]
  },
  {
    id: 'process-2',
    code: 'QT-2026-002',
    name: 'Quy trình Tổng hợp Báo cáo Kinh tế - Xã hội Định kỳ',
    version: '1.0',
    scope: 'Kinh tế xã hội',
    orgs: ['Sở Kế hoạch và Đầu tư', 'Sở Tài chính', 'Sở Công Thương'],
    active: true,
    processStatus: 'active',
    createdAt: '02/08/2026 08:00',
    description: 'Quy trình báo cáo tổng hợp các chỉ số phát triển kinh tế xã hội định kỳ.',
    nodes: [
      {
        id: 'node-p2-1',
        unitName: 'Phân công thu thập chỉ số báo cáo',
        status: 'Chờ phân công',
        org: 'Sở Kế hoạch và Đầu tư, Sở Tài chính, Sở Công Thương',
        orgs: ['Sở Kế hoạch và Đầu tư', 'Sở Tài chính', 'Sở Công Thương'],
        assignee: 'Lê Minh Cường - Lãnh đạo',
        assignees: getFakeAssigneeArray(['Sở Kế hoạch và Đầu tư', 'Sở Tài chính', 'Sở Công Thương']),
        description: 'Phân công các phòng chuyên môn tổng hợp dữ liệu ngành.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-p2-2' }]
      },
      {
        id: 'node-p2-2',
        unitName: 'Nghiên cứu & Tổng hợp dữ liệu chỉ số',
        status: 'Đang xử lý',
        org: 'Sở Kế hoạch và Đầu tư, Sở Tài chính, Sở Công Thương',
        orgs: ['Sở Kế hoạch và Đầu tư', 'Sở Tài chính', 'Sở Công Thương'],
        assignee: 'Nguyễn Văn Bình - Chuyên viên',
        assignees: getFakeStaffArray(['Sở Kế hoạch và Đầu tư', 'Sở Tài chính', 'Sở Công Thương']),
        description: 'Chuyên viên các đơn vị tổng hợp số liệu ngành.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-p2-3' }]
      },
      {
        id: 'node-p2-3',
        unitName: 'Hoàn thiện dự thảo báo cáo Kinh tế - Xã hội',
        status: 'Đã có báo cáo',
        org: 'Sở Kế hoạch và Đầu tư, Sở Tài chính, Sở Công Thương',
        orgs: ['Sở Kế hoạch và Đầu tư', 'Sở Tài chính', 'Sở Công Thương'],
        assignee: 'Lê Minh Cường - Lãnh đạo',
        assignees: getFakeAssigneeArray(['Sở Kế hoạch và Đầu tư', 'Sở Tài chính', 'Sở Công Thương']),
        description: 'Duyệt dự thảo báo cáo và trình Uỷ ban Tỉnh.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-p2-4' }]
      },
      {
        id: 'node-p2-4',
        unitName: 'Trình Lãnh đạo Tỉnh kết luận',
        status: 'Chờ phê duyệt',
        org: 'Tỉnh Gia Lai',
        orgs: ['Tỉnh Gia Lai'],
        assignee: 'Lãnh đạo Tỉnh',
        assignees: ['Lãnh đạo Tỉnh'],
        description: 'Lãnh đạo Tỉnh họp nghe báo cáo và kết luận chỉ đạo.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-p2-5' }, { name: 'Trả về', nextNodeId: 'node-p2-3' }]
      },
      {
        id: 'node-p2-5',
        unitName: 'Ban hành kết luận & Lưu hồ sơ',
        status: 'Đã kết thúc',
        org: 'Tỉnh Gia Lai',
        orgs: ['Tỉnh Gia Lai'],
        assignee: 'Lãnh đạo Tỉnh',
        assignees: ['Lãnh đạo Tỉnh'],
        description: 'Ban hành văn bản kết luận chỉ đạo kinh tế xã hội.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'end' }]
      }
    ]
  },
  {
    id: 'process-3',
    code: 'QT-2026-003',
    name: 'Quy trình Đánh giá & Thẩm định Trường chuẩn Quốc gia',
    version: '1.0',
    scope: 'Giáo dục',
    orgs: ['Sở Giáo dục và Đào tạo', 'Sở Giao thông vận tải', 'Sở Xây dựng'],
    active: false,
    processStatus: 'draft',
    createdAt: '03/08/2026 08:00',
    description: 'Quy trình bản nháp thẩm định các tiêu chí trường chuẩn quốc gia trên địa bàn tỉnh.',
    nodes: [
      {
        id: 'node-p3-1',
        unitName: 'Tiếp nhận hồ sơ & Phân công hội đồng',
        status: 'Chờ phân công',
        org: 'Sở Giáo dục và Đào tạo, Sở Giao thông vận tải, Sở Xây dựng',
        orgs: ['Sở Giáo dục và Đào tạo', 'Sở Giao thông vận tải', 'Sở Xây dựng'],
        assignee: 'Bùi Xuân Lâm - Lãnh đạo',
        assignees: getFakeAssigneeArray(['Sở Giáo dục và Đào tạo', 'Sở Giao thông vận tải', 'Sở Xây dựng']),
        description: 'Thành lập đoàn kiểm tra và phân công cán bộ chuyên môn.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-p3-2' }]
      },
      {
        id: 'node-p3-2',
        unitName: 'Thẩm định thực tế tại cơ sở giáo dục',
        status: 'Đang xử lý',
        org: 'Sở Giáo dục và Đào tạo, Sở Giao thông vận tải, Sở Xây dựng',
        orgs: ['Sở Giáo dục và Đào tạo', 'Sở Giao thông vận tải', 'Sở Xây dựng'],
        assignee: 'Phạm Văn Dũng - Chuyên viên',
        assignees: getFakeStaffArray(['Sở Giáo dục và Đào tạo', 'Sở Giao thông vận tải', 'Sở Xây dựng']),
        description: 'Kiểm tra cơ sở vật chất và chất lượng giảng dạy thực tế.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-p3-3' }]
      },
      {
        id: 'node-p3-3',
        unitName: 'Lập biên bản thẩm định chuẩn quốc gia',
        status: 'Đã có báo cáo',
        org: 'Sở Giáo dục và Đào tạo, Sở Giao thông vận tải, Sở Xây dựng',
        orgs: ['Sở Giáo dục và Đào tạo', 'Sở Giao thông vận tải', 'Sở Xây dựng'],
        assignee: 'Bùi Xuân Lâm - Lãnh đạo',
        assignees: getFakeAssigneeArray(['Sở Giáo dục và Đào tạo', 'Sở Giao thông vận tải', 'Sở Xây dựng']),
        description: 'Tổng hợp biên bản kết quả thẩm định trình cấp có thẩm quyền.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-p3-4' }]
      },
      {
        id: 'node-p3-4',
        unitName: 'Trình Quyết định công nhận trường chuẩn',
        status: 'Chờ phê duyệt',
        org: 'Tỉnh Gia Lai',
        orgs: ['Tỉnh Gia Lai'],
        assignee: 'Lãnh đạo Tỉnh',
        assignees: ['Lãnh đạo Tỉnh'],
        description: 'Trình UBND Tỉnh ký quyết định công nhận.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-p3-5' }, { name: 'Trả về', nextNodeId: 'node-p3-3' }]
      },
      {
        id: 'node-p3-5',
        unitName: 'Trao quyết định & Hoàn tất luồng',
        status: 'Đã kết thúc',
        org: 'Tỉnh Gia Lai',
        orgs: ['Tỉnh Gia Lai'],
        assignee: 'Lãnh đạo Tỉnh',
        assignees: ['Lãnh đạo Tỉnh'],
        description: 'Công bố quyết định và kết thúc quy trình.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'end' }]
      }
    ]
  },
  {
    id: 'process-4',
    code: 'QT-2026-004',
    name: 'Quy trình Thẩm định Dự án Đầu tư Công',
    version: '1.0',
    scope: 'Hành chính công',
    orgs: ['Sở Nội vụ', 'Sở Lao động Thương binh và Xã hội', 'Công an Tỉnh'],
    active: false,
    processStatus: 'draft',
    createdAt: '04/08/2026 08:00',
    description: 'Quy trình phối hợp liên ngành thẩm định chủ trương đầu tư dự án công.',
    nodes: [
      {
        id: 'node-p4-1',
        unitName: 'Phân công tổ thẩm định dự án',
        status: 'Chờ phân công',
        org: 'Sở Nội vụ, Sở Lao động Thương binh và Xã hội, Công an Tỉnh',
        orgs: ['Sở Nội vụ', 'Sở Lao động Thương binh và Xã hội', 'Công an Tỉnh'],
        assignee: 'Hoàng Quốc Việt - Lãnh đạo',
        assignees: getFakeAssigneeArray(['Sở Nội vụ', 'Sở Lao động Thương binh và Xã hội', 'Công an Tỉnh']),
        description: 'Phân công các chuyên viên liên ngành thẩm định đề xuất dự án.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-p4-2' }]
      },
      {
        id: 'node-p4-2',
        unitName: 'Thẩm định nguồn vốn & Khả năng cân đối',
        status: 'Đang xử lý',
        org: 'Sở Nội vụ, Sở Lao động Thương binh và Xã hội, Công an Tỉnh',
        orgs: ['Sở Nội vụ', 'Sở Lao động Thương binh và Xã hội', 'Công an Tỉnh'],
        assignee: 'Lê Hữu Giang - Chuyên viên',
        assignees: getFakeStaffArray(['Sở Nội vụ', 'Sở Lao động Thương binh và Xã hội', 'Công an Tỉnh']),
        description: 'Đánh giá tính khả thi tài chính và quy hoạch xây dựng.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-p4-3' }]
      },
      {
        id: 'node-p4-3',
        unitName: 'Báo cáo kết quả thẩm định chủ trương',
        status: 'Đã có báo cáo',
        org: 'Sở Nội vụ, Sở Lao động Thương binh và Xã hội, Công an Tỉnh',
        orgs: ['Sở Nội vụ', 'Sở Lao động Thương binh và Xã hội', 'Công an Tỉnh'],
        assignee: 'Hoàng Quốc Việt - Lãnh đạo',
        assignees: getFakeAssigneeArray(['Sở Nội vụ', 'Sở Lao động Thương binh và Xã hội', 'Công an Tỉnh']),
        description: 'Lập báo cáo thẩm định dự án hoàn chỉnh.',
        persisted: true,
        actions: [{ name: 'Chuyển xử lý', nextNodeId: 'end' }]
      }
    ]
  }
];
