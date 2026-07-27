/* -----------------------------------------------------------------------
   data.js — Dữ liệu mẫu (mock) cho phân hệ Xử lý chỉ đạo.
   Load TRƯỚC ui.js. Không chứa logic UI.
   ----------------------------------------------------------------------- */

/* -- Helpers ngày tháng ------------------------------------------------- */
const prototypeDateAtOffset = offsetDays => {
  const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });
};
const prototypeHistoryTime = (offsetDays, time = '08:00') =>
  `${time} - ${prototypeDateAtOffset(offsetDays)}`;

/* -- Danh sách nhân viên mẫu cho từng Sở -------------------------------- */
const SAMPLE_PERSONNEL = {
  'acc-so-tnmt': [
    { id: 'cv-tnmt-01', name: 'Nguyễn Minh Tuấn', title: 'Chuyên viên', dept: 'Phòng Quản lý MT' },
    { id: 'cv-tnmt-02', name: 'Lê Thị Thu Hà',   title: 'Chuyên viên',  dept: 'Phòng Quản lý MT' },
    { id: 'cv-tnmt-03', name: 'Trần Quốc Bảo',   title: 'Chuyên viên cao cấp', dept: 'Phòng TN & KH' },
  ],
  'acc-so-khdt': [
    { id: 'cv-khdt-01', name: 'Nguyễn Văn An',   title: 'Chuyên viên',  dept: 'Phòng Tổng hợp' },
    { id: 'cv-khdt-02', name: 'Phạm Thị Lan',    title: 'Chuyên viên',  dept: 'Phòng Tổng hợp' },
    { id: 'cv-khdt-03', name: 'Đỗ Hữu Nghĩa',   title: 'Chuyên viên cao cấp', dept: 'Phòng QH vùng' },
  ],
  'acc-so-nnptnt': [
    { id: 'cv-nn-01', name: 'Trần Thị Bình',    title: 'Chuyên viên',  dept: 'Phòng KH - TC' },
    { id: 'cv-nn-02', name: 'Võ Thanh Long',    title: 'Chuyên viên',  dept: 'Phòng KH - TC' },
  ],
};

/* -- Prototype directives (3 hồ sơ mẫu) --------------------------------- */
const createPrototypeDirectives = () => [

  /* ── TEST-01: Chờ phân công (leader chưa giao) ──────────────────── */
  {
    id:            `CD-${new Date().getFullYear()}-TEST-01`,
    title:         'Triển khai kế hoạch kiểm soát ô nhiễm môi trường khu công nghiệp',
    domain:        'Tài nguyên và Môi trường',
    dataGroups:    ['Kinh tế xã hội', 'Hành chính công'],
    source:        'Ông Nguyễn Văn Hùng – Phó Chủ tịch UBND Tỉnh',
    issuedDate:    prototypeDateAtOffset(-2),
    deadline:      prototypeDateAtOffset(20),
    deadlineType:  'normal',
    content:       'Tỉnh chỉ đạo Sở Tài nguyên và Môi trường triển khai kế hoạch kiểm soát ô nhiễm tại các khu công nghiệp trên địa bàn tỉnh Gia Lai trong quý III/2026. Yêu cầu hoàn thành báo cáo hiện trạng và kế hoạch hành động trước hạn.',
    dashboardLink: '../../dashboard/index.html',
    attachment:    'dashboard_mockup.png',
    attachmentSize:'1.4 MB',
    previewImage:  '../dashboard_mockup.png',
    processId:     null,
    executionTree: {
      id: 'node-01-leader', contextId: 'leader',
      unitName: 'Sở Tài nguyên và Môi trường',
      accountId: 'acc-so-tnmt', accountName: 'Lãnh đạo Sở',
      stage: 'waitingAssign',
      availableAssignees: SAMPLE_PERSONNEL['acc-so-tnmt'],
      slaDeadline: prototypeDateAtOffset(20),
      notes: '', notesFile: null,
      subReports: [],
      history: [
        { order:1, time: prototypeHistoryTime(-2), actor:'Hệ thống', action:'Đồng bộ văn bản', note:'Chỉ đạo đã được chuyển đến Sở Tài nguyên và Môi trường.' }
      ],
      children: []
    }
  },

  /* ── TEST-02: Đang xử lý (CV đang làm việc) ─────────────────────── */
  {
    id:            `CD-${new Date().getFullYear()}-TEST-02`,
    title:         'Rà soát và cập nhật dữ liệu dân số phục vụ quy hoạch vùng',
    domain:        'Kế hoạch và Đầu tư',
    dataGroups:    ['Dân cư', 'Kinh tế xã hội'],
    source:        'Bà Trần Thị Mai – Chủ tịch UBND Tỉnh',
    issuedDate:    prototypeDateAtOffset(-10),
    deadline:      prototypeDateAtOffset(8),
    deadlineType:  'normal',
    content:       'Tỉnh yêu cầu Sở Kế hoạch và Đầu tư phối hợp rà soát, cập nhật dữ liệu dân số toàn tỉnh, phục vụ công tác quy hoạch vùng giai đoạn 2026–2030. Ưu tiên số liệu di dân và biến động hộ khẩu.',
    dashboardLink: '../../dashboard/index.html',
    attachment:    'CD_RaSoatDanSo_2026.pdf',
    attachmentSize:'2.1 MB',
    previewImage:  null,
    processId:     'process-1',
    executionTree: {
      id: 'node-02-leader', contextId: 'leader',
      unitName: 'Sở Kế hoạch và Đầu tư',
      accountId: 'acc-so-khdt', accountName: 'Lãnh đạo Sở',
      stage: 'processing',
      availableAssignees: [],
      slaDeadline: prototypeDateAtOffset(8),
      notes: 'Ưu tiên rà soát địa bàn Pleiku và Ia Grai trước.',
      notesFile: null,
      subReports: [],
      history: [
        { order:1, time: prototypeHistoryTime(-10), actor:'Hệ thống', action:'Đồng bộ văn bản', note:'Chỉ đạo chuyển đến Sở Kế hoạch và Đầu tư.' },
        { order:2, time: prototypeHistoryTime(-9,'09:15'), actor:'Lãnh đạo Sở', action:'Chuyển xử lý', note:'Phân công Chuyên viên Nguyễn Văn An thực hiện.' }
      ],
      children: [
        {
          id: 'node-02-dept', contextId: 'department',
          unitName: 'Phòng Tổng hợp — Quy hoạch',
          accountId: 'acc-truong-phong-01', accountName: 'Trưởng phòng Tổng hợp',
          stage: 'processing',
          availableAssignees: [],
          slaDeadline: prototypeDateAtOffset(9),
          notes: '', notesFile: null, subReports: [],
          history: [{ order:2, time: prototypeHistoryTime(-9,'09:15'), actor:'Lãnh đạo Sở', action:'Phân công phòng', note:'Giao Phòng Tổng hợp chủ trì.' }],
          children: [
            {
              id: 'node-02-staff', contextId: 'individual',
              unitName: 'Chuyên viên — Phòng Tổng hợp',
              accountId: 'acc-cv-01', accountName: 'Nguyễn Văn An',
              stage: 'processing',
              availableAssignees: [],
              slaDeadline: prototypeDateAtOffset(8),
              notes: '', notesFile: null, subReports: [],
              history: [{ order:3, time: prototypeHistoryTime(-9,'10:00'), actor:'Trưởng phòng', action:'Phân công chuyên viên', note:'Nguyễn Văn An được phân công xử lý.' }],
              children: []
            }
          ]
        }
      ]
    }
  },

  /* ── TEST-03: Đã có báo cáo (cấp dưới đã nộp, Sở cần xét) ─────── */
  {
    id:            `CD-${new Date().getFullYear()}-TEST-03`,
    title:         'Báo cáo kết quả triển khai chương trình chuyển đổi số nông nghiệp',
    domain:        'Nông nghiệp và PTNT',
    dataGroups:    ['Kinh tế xã hội', 'Dân cư', 'Văn bản điều hành'],
    source:        'Ông Nguyễn Văn Hùng – Phó Chủ tịch UBND Tỉnh',
    issuedDate:    prototypeDateAtOffset(-30),
    deadline:      prototypeDateAtOffset(-3),
    deadlineType:  'overdue',
    content:       'Tỉnh yêu cầu Sở Nông nghiệp và PTNT báo cáo kết quả triển khai chương trình chuyển đổi số nông nghiệp giai đoạn 2024–2026. Bao gồm số liệu diện tích áp dụng, số nông dân được đào tạo và hiệu quả kinh tế.',
    dashboardLink: '../../dashboard/index.html',
    attachment:    'CD_ChuyenDoiSo_NN_2026.pdf',
    attachmentSize:'3.8 MB',
    previewImage:  null,
    processId:     'process-1',
    executionTree: {
      id: 'node-03-leader', contextId: 'leader',
      unitName: 'Sở Nông nghiệp và PTNT',
      accountId: 'acc-so-nnptnt', accountName: 'Lãnh đạo Sở',
      stage: 'reported',
      availableAssignees: [],
      slaDeadline: prototypeDateAtOffset(-3),
      notes: 'Tổng hợp kết quả từ 3 phòng trực thuộc.',
      notesFile: null,
      subReports: [
        {
          from: 'Trần Thị Bình (Chuyên viên)',
          time: prototypeHistoryTime(-5,'14:00'),
          content: 'Đã rà soát và tổng hợp số liệu từ 17 xã. Diện tích áp dụng: 12.450 ha, 2.380 nông dân được đào tạo. Báo cáo đính kèm đầy đủ số liệu chi tiết theo từng huyện.',
          file: 'BaoCao_ChuyenDoiSo_NNPTNT_ChiTiet.pdf',
          fileSize: '2.4 MB'
        }
      ],
      history: [
        { order:1, time: prototypeHistoryTime(-30), actor:'Hệ thống', action:'Đồng bộ văn bản', note:'Chỉ đạo chuyển đến Sở Nông nghiệp và PTNT.' },
        { order:2, time: prototypeHistoryTime(-29,'08:30'), actor:'Lãnh đạo Sở', action:'Chuyển xử lý', note:'Phân công Chuyên viên Trần Thị Bình.' },
        { order:3, time: prototypeHistoryTime(-5,'14:00'), actor:'Trần Thị Bình', action:'Trình duyệt', note:'Nộp báo cáo kết quả.' }
      ],
      children: [
        {
          id: 'node-03-dept', contextId: 'department',
          unitName: 'Phòng Kế hoạch — Tài chính',
          accountId: 'acc-truong-phong-02', accountName: 'Trưởng phòng Kế hoạch',
          stage: 'reported',
          availableAssignees: [],
          slaDeadline: prototypeDateAtOffset(-3),
          notes: '', notesFile: null,
          subReports: [{ from:'Trần Thị Bình', time: prototypeHistoryTime(-5,'14:00'), content:'Đã nộp báo cáo đầy đủ.', file:'BaoCao.pdf', fileSize:'2.4 MB' }],
          history: [],
          children: [
            {
              id: 'node-03-staff', contextId: 'individual',
              unitName: 'Chuyên viên — Phòng KH', accountId: 'acc-cv-02', accountName: 'Trần Thị Bình',
              stage: 'reported',
              availableAssignees: [],
              slaDeadline: prototypeDateAtOffset(-3),
              notes: '', notesFile: null,
              subReports: [],
              history: [{ order:3, time: prototypeHistoryTime(-5,'14:00'), actor:'Trần Thị Bình', action:'Trình duyệt', note:'Đã nộp báo cáo kết quả lên Sở.' }],
              children: []
            }
          ]
        }
      ]
    }
  }
];

/* -- State object -------------------------------------------------------- */
const directiveState = {
  role:        'leader',
  activeTab:   'active',   // 'active' | 'done'
  selectedId:  null,
  page:        1,
  pageSize:    10,
  filters:     { search: '', status: '', deadlineRange: [], timeCondition: '' },

  statusMeta: {
    waitingAssign:   { label: 'Chờ phân công', color: '#f59e0b', icon: 'fa-clock-rotate-left' },
    processing:      { label: 'Đang xử lý',    color: '#3b82f6', icon: 'fa-spinner' },
    reported:        { label: 'Đã có báo cáo', color: '#8b5cf6', icon: 'fa-file-circle-check' },
    waitingApproval: { label: 'Chờ phê duyệt', color: '#f97316', icon: 'fa-hourglass-half' },
    completed:       { label: 'Đã kết thúc',   color: '#22c55e', icon: 'fa-circle-check' },
  },

  DATA_GROUPS: [
    'Dân cư', 'Phản ánh hiện trường', 'Giáo dục', 'Kinh tế xã hội',
    'Cán bộ công chức', 'Văn bản điều hành', 'CSDL quốc gia về tài chính', 'Hành chính công'
  ],

  processes:   JSON.parse(localStorage.getItem('gialai_processes') || '[]'),
  directives:  createPrototypeDirectives(),
};
