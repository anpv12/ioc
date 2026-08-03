/* -----------------------------------------------------------------------
   data.js — Dữ liệu mẫu (mock) cho phân hệ Xử lý chỉ đạo.
   Load TRƯỚC ui.js. Không chứa logic UI.
   ----------------------------------------------------------------------- */

/* -- Helpers ngày tháng ------------------------------------------------- */
const prototypeDateAtOffset = offsetDays => {
  const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
const prototypeHistoryTime = (offsetDays, time = '08:00') =>
  `${time} - ${prototypeDateAtOffset(offsetDays)}`;

/* -- Danh sách nhân viên mẫu cho từng Sở -------------------------------- */
const SAMPLE_PERSONNEL = {
  'acc-so-tnmt': [
    { id: 'cv-tnmt-01', name: 'Nguyễn Minh Tuấn', title: 'Chuyên viên', dept: 'Phòng Quản lý MT' },
    { id: 'cv-tnmt-02', name: 'Lê Thị Thu Hà', title: 'Chuyên viên', dept: 'Phòng Quản lý MT' },
    { id: 'cv-tnmt-03', name: 'Trần Quốc Bảo', title: 'Chuyên viên cao cấp', dept: 'Phòng TN & KH' },
  ],
  'acc-so-khdt': [
    { id: 'cv-khdt-01', name: 'Nguyễn Văn An', title: 'Chuyên viên', dept: 'Phòng Tổng hợp' },
    { id: 'cv-khdt-02', name: 'Phạm Thị Lan', title: 'Chuyên viên', dept: 'Phòng Tổng hợp' },
    { id: 'cv-khdt-03', name: 'Đỗ Hữu Nghĩa', title: 'Chuyên viên cao cấp', dept: 'Phòng QH vùng' },
  ],
  'acc-so-nnptnt': [
    { id: 'cv-nn-01', name: 'Trần Thị Bình', title: 'Chuyên viên', dept: 'Phòng KH - TC' },
    { id: 'cv-nn-02', name: 'Võ Thanh Long', title: 'Chuyên viên', dept: 'Phòng KH - TC' },
  ],
};

/* -- Prototype directives (3 hồ sơ mẫu) --------------------------------- */
const createPrototypeDirectives = () => [

  /* ── TEST-01: Chờ phân công (leader chưa giao) ──────────────────── */
  {
    id: `CD-${new Date().getFullYear()}-TEST-01`,
    title: 'Triển khai kế hoạch kiểm soát ô nhiễm môi trường khu công nghiệp',
    domain: 'Tài nguyên và Môi trường',
    dataGroups: ['Kinh tế xã hội'],
    source: 'Ông Nguyễn Văn Hùng – Phó Chủ tịch UBND Tỉnh',
    issuedDate: prototypeDateAtOffset(-2),
    deadline: prototypeDateAtOffset(20),
    deadlineType: 'normal',
    content: 'Tỉnh chỉ đạo Sở Tài nguyên và Môi trường triển khai kế hoạch kiểm soát ô nhiễm tại các khu công nghiệp trên địa bàn tỉnh Gia Lai trong quý III/2026. Yêu cầu hoàn thành báo cáo hiện trạng và kế hoạch hành động trước hạn.',
    dashboardLink: '../../dashboard/index.html',
    attachment:    'CD_DanCu_GiaLai_2026.png',
    attachmentSize:'1.8 MB',
    attachments: [
      { name: 'CD_DanCu_GiaLai_2026.png', size: '1.8 MB', date: prototypeDateAtOffset(-2) },
      { name: 'PhuLuc_HuongDan_TrienKhai.docx', size: '540 KB', date: prototypeDateAtOffset(-2) }
    ],
    previewImage:  'assets/dashboard_gialai.png',
    processId: null,
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
        { order: 1, time: prototypeHistoryTime(-2), actor: 'Hệ thống', action: 'Đồng bộ văn bản', note: 'Chỉ đạo đã được chuyển đến Sở Tài nguyên và Môi trường.' }
      ],
      children: []
    }
  },

  /* ── TEST-02: Đang xử lý (CV đang làm việc) ─────────────────────── */
  {
    id: `CD-${new Date().getFullYear()}-TEST-02`,
    title: 'Rà soát và cập nhật dữ liệu dân số phục vụ quy hoạch vùng',
    domain: 'Kế hoạch và Đầu tư',
    dataGroups: ['Dân cư'],
    source: 'Bà Trần Thị Mai – Chủ tịch UBND Tỉnh',
    issuedDate: prototypeDateAtOffset(-10),
    deadline: prototypeDateAtOffset(8),
    deadlineType: 'normal',
    content: 'Tỉnh yêu cầu Sở Kế hoạch và Đầu tư phối hợp rà soát, cập nhật dữ liệu dân số toàn tỉnh, phục vụ công tác quy hoạch vùng giai đoạn 2026–2030. Ưu tiên số liệu di dân và biến động hộ khẩu.',
    dashboardLink: '../../dashboard/index.html',
    attachment: 'CD_RaSoatDanSo_2026.pdf',
    attachmentSize: '2.1 MB',
    previewImage: null,
    processId: 'process-1',
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
        { order: 1, time: prototypeHistoryTime(-10), actor: 'Hệ thống', action: 'Đồng bộ văn bản', note: 'Chỉ đạo chuyển đến Sở Kế hoạch và Đầu tư.' },
        { order: 2, time: prototypeHistoryTime(-9, '09:15'), actor: 'Lãnh đạo Sở', action: 'Chuyển xử lý', note: 'Phân công Chuyên viên Nguyễn Văn An thực hiện.' }
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
          history: [{ order: 2, time: prototypeHistoryTime(-9, '09:15'), actor: 'Lãnh đạo Sở', action: 'Phân công phòng', note: 'Giao Phòng Tổng hợp chủ trì.' }],
          children: [
            {
              id: 'node-02-staff', contextId: 'individual',
              unitName: 'Chuyên viên — Phòng Tổng hợp',
              accountId: 'acc-cv-01', accountName: 'Nguyễn Văn An',
              stage: 'processing',
              availableAssignees: [],
              slaDeadline: prototypeDateAtOffset(8),
              notes: '', notesFile: null, subReports: [],
              history: [{ order: 3, time: prototypeHistoryTime(-9, '10:00'), actor: 'Trưởng phòng', action: 'Phân công chuyên viên', note: 'Nguyễn Văn An được phân công xử lý.' }],
              children: []
            }
          ]
        }
      ]
    }
  },

  /* ── TEST-03: Đã có báo cáo (cấp dưới đã nộp, Sở cần xét) ─────── */
  {
    id: `CD-${new Date().getFullYear()}-TEST-03`,
    title: 'Báo cáo kết quả triển khai chương trình chuyển đổi số nông nghiệp',
    domain: 'Nông nghiệp và PTNT',
    dataGroups: ['Hành chính công'],
    source: 'Ông Nguyễn Văn Hùng – Phó Chủ tịch UBND Tỉnh',
    issuedDate: prototypeDateAtOffset(-30),
    deadline: prototypeDateAtOffset(-3),
    deadlineType: 'overdue',
    content: 'Tỉnh yêu cầu Sở Nông nghiệp và PTNT báo cáo kết quả triển khai chương trình chuyển đổi số nông nghiệp giai đoạn 2024–2026. Bao gồm số liệu diện tích áp dụng, số nông dân được đào tạo và hiệu quả kinh tế.',
    dashboardLink: '../../dashboard/index.html',
    attachment: 'CD_ChuyenDoiSo_NN_2026.pdf',
    attachmentSize: '3.8 MB',
    previewImage: null,
    processId: 'process-1',
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
          time: prototypeHistoryTime(-5, '14:00'),
          content: 'Đã rà soát và tổng hợp số liệu từ 17 xã. Diện tích áp dụng: 12.450 ha, 2.380 nông dân được đào tạo. Báo cáo đính kèm đầy đủ số liệu chi tiết theo từng huyện.',
          files: [
            { name: 'BaoCao_ChuyenDoiSo_NNPTNT_ChiTiet.pdf', size: '2.4 MB', date: prototypeHistoryTime(-5, '14:00') },
            { name: 'Dashboard_CapNhat_ThoiDiemTrinh.png', size: '1.2 MB', date: prototypeHistoryTime(-5, '14:00'), path: 'assets/dashboard_gialai.png', url: 'assets/dashboard_gialai.png' }
          ]
        }
      ],
      history: [
        { order: 1, time: prototypeHistoryTime(-30), actor: 'Hệ thống', action: 'Đồng bộ văn bản', note: 'Chỉ đạo chuyển đến Sở Nông nghiệp và PTNT.' },
        { order: 2, time: prototypeHistoryTime(-29, '08:30'), actor: 'Lãnh đạo Sở', action: 'Chuyển xử lý', note: 'Phân công Chuyên viên Trần Thị Bình.' },
        { order: 3, time: prototypeHistoryTime(-5, '14:00'), actor: 'Trần Thị Bình', action: 'Trình duyệt', note: 'Nộp báo cáo kết quả.' }
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
          subReports: [],
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
              history: [{ order: 3, time: prototypeHistoryTime(-5, '14:00'), actor: 'Trần Thị Bình', action: 'Trình duyệt', note: 'Đã nộp báo cáo kết quả lên Sở.' }],
              children: []
            }
          ]
        }
      ]
    }
  },

  /* ── TEST-04: Chờ phê duyệt (Lãnh đạo Sở đã trình Tỉnh) ────────── */
  {
    id: `CD-${new Date().getFullYear()}-TEST-04`,
    title: 'Kiểm tra và nâng cấp hạ tầng y tế cơ sở tại các huyện miền núi',
    domain: 'Y tế',
    dataGroups: ['Kinh tế xã hội'],
    source: 'Ông Nguyễn Văn Hùng – Phó Chủ tịch UBND Tỉnh',
    issuedDate: prototypeDateAtOffset(-15),
    deadline: prototypeDateAtOffset(5),
    deadlineType: 'normal',
    content: 'Tỉnh giao Sở Y tế chủ trì khảo sát, đánh giá hiện trạng hạ tầng và trang thiết bị tại các trạm y tế xã, trung tâm y tế huyện miền núi. Tổng hợp nhu cầu nâng cấp giai đoạn 2026–2028 trình UBND Tỉnh.',
    dashboardLink: '../../dashboard/index.html',
    attachment: 'CD_YTeCoSo_2026.pdf',
    attachmentSize: '1.8 MB',
    previewImage: null,
    processId: 'process-1',
    leaderReport: {
      content: 'Sở Y tế đã hoàn thành khảo sát 42 trạm y tế xã tại 5 huyện miền núi. Đã tổng hợp danh mục 15 trạm cần nâng cấp cấp bách với tổng kinh phí dự kiến 45 tỷ đồng. Kính trình UBND Tỉnh xem xét phê duyệt.',
      files: [
        { name: 'BaoCao_TrinhTinh_HaTangYTe.pdf', size: '2.8 MB', date: prototypeHistoryTime(-1, '16:30') },
        { name: 'Dashboard_CapNhat_ThoiDiemTrinh.png', size: '1.2 MB', date: prototypeHistoryTime(-1, '16:30'), path: 'assets/dashboard_gialai.png', url: 'assets/dashboard_gialai.png' }
      ],
      time: prototypeHistoryTime(-1, '16:30')
    },
    leaderReports: [
      {
        content: 'Sở Y tế đã hoàn thành khảo sát 42 trạm y tế xã tại 5 huyện miền núi. Đã tổng hợp danh mục 15 trạm cần nâng cấp cấp bách với tổng kinh phí dự kiến 45 tỷ đồng. Kính trình UBND Tỉnh xem xét phê duyệt.',
        files: [
          { name: 'BaoCao_TrinhTinh_HaTangYTe.pdf', size: '2.8 MB', date: prototypeHistoryTime(-1, '16:30') },
          { name: 'Dashboard_CapNhat_ThoiDiemTrinh.png', size: '1.2 MB', date: prototypeHistoryTime(-1, '16:30'), path: 'assets/dashboard_gialai.png', url: 'assets/dashboard_gialai.png' }
        ],
        time: prototypeHistoryTime(-1, '16:30')
      }
    ],
    executionTree: {
      id: 'node-04-leader', contextId: 'leader',
      unitName: 'Sở Y tế',
      accountId: 'acc-so-yte', accountName: 'Lãnh đạo Sở',
      stage: 'waitingApproval',
      availableAssignees: [],
      slaDeadline: prototypeDateAtOffset(5),
      notes: 'Đã hoàn thành tổng hợp toàn tỉnh.',
      notesFile: null,
      subReports: [
        {
          from: 'Phạm Văn Nam (Chuyên viên)',
          time: prototypeHistoryTime(-3, '10:15'),
          content: 'Đã hoàn thành khảo sát thực tế 42 trạm y tế xã tại 5 huyện miền núi (Kông Chro, Krông Pa, Ia Pa, Mang Yang, KBang).',
          files: [
            { name: 'BaoCao_KhaoSat_YTe.pdf', size: '3.1 MB', date: prototypeHistoryTime(-3, '10:15') },
            { name: 'Dashboard_CapNhat_ThoiDiemTrinh.png', size: '1.2 MB', date: prototypeHistoryTime(-3, '10:15'), path: 'assets/dashboard_gialai.png', url: 'assets/dashboard_gialai.png' }
          ]
        }
      ],
      leaderReport: {
        content: 'Sở Y tế đã hoàn thành khảo sát 42 trạm y tế xã tại 5 huyện miền núi. Đã tổng hợp danh mục 15 trạm cần nâng cấp cấp bách với tổng kinh phí dự kiến 45 tỷ đồng. Kính trình UBND Tỉnh xem xét phê duyệt.',
        files: [
          { name: 'BaoCao_TrinhTinh_HaTangYTe.pdf', size: '2.8 MB', date: prototypeHistoryTime(-1, '16:30') },
          { name: 'Dashboard_CapNhat_ThoiDiemTrinh.png', size: '1.2 MB', date: prototypeHistoryTime(-1, '16:30'), path: 'assets/dashboard_gialai.png', url: 'assets/dashboard_gialai.png' }
        ],
        time: prototypeHistoryTime(-1, '16:30')
      },
      leaderReports: [
        {
          content: 'Sở Y tế đã hoàn thành khảo sát 42 trạm y tế xã tại 5 huyện miền núi. Đã tổng hợp danh mục 15 trạm cần nâng cấp cấp bách với tổng kinh phí dự kiến 45 tỷ đồng. Kính trình UBND Tỉnh xem xét phê duyệt.',
          files: [
            { name: 'BaoCao_TrinhTinh_HaTangYTe.pdf', size: '2.8 MB', date: prototypeHistoryTime(-1, '16:30') },
            { name: 'Dashboard_CapNhat_ThoiDiemTrinh.png', size: '1.2 MB', date: prototypeHistoryTime(-1, '16:30'), path: 'assets/dashboard_gialai.png', url: 'assets/dashboard_gialai.png' }
          ],
          time: prototypeHistoryTime(-1, '16:30')
        }
      ],
      history: [
        { order: 1, time: prototypeHistoryTime(-15), actor: 'Hệ thống', action: 'Đồng bộ văn bản', note: 'Chỉ đạo chuyển đến Sở Y tế.' },
        { order: 2, time: prototypeHistoryTime(-14, '08:30'), actor: 'Lãnh đạo Sở', action: 'Chuyển xử lý', note: 'Phân công Chuyên viên Phạm Văn Nam.' },
        { order: 3, time: prototypeHistoryTime(-3, '10:15'), actor: 'Phạm Văn Nam', action: 'Trình duyệt', note: 'Nộp báo cáo kết quả khảo sát.' },
        { order: 4, time: prototypeHistoryTime(-1, '16:30'), actor: 'Lãnh đạo Sở', action: 'Trình Tỉnh', note: 'Đã trình UBND Tỉnh phê duyệt.' }
      ],
      children: [
        {
          id: 'node-04-dept', contextId: 'department',
          unitName: 'Phòng Nghiệp vụ Y', accountId: 'acc-truong-phong-04', accountName: 'Trưởng phòng Nghiệp vụ Y',
          stage: 'waitingApproval',
          availableAssignees: [],
          slaDeadline: prototypeDateAtOffset(5),
          notes: '', notesFile: null, subReports: [], history: [],
          children: [
            {
              id: 'node-04-staff', contextId: 'individual',
              unitName: 'Chuyên viên — Phòng Nghiệp vụ Y', accountId: 'acc-cv-04', accountName: 'Phạm Văn Nam',
              stage: 'waitingApproval',
              availableAssignees: [],
              slaDeadline: prototypeDateAtOffset(5),
              notes: '', notesFile: null, subReports: [], history: [],
              children: []
            }
          ]
        }
      ]
    }
  },

  /* ── TEST-05: Đã kết thúc (Tỉnh đã phê duyệt hoàn thành) ────────── */
  {
    id: `CD-${new Date().getFullYear()}-TEST-05`,
    title: 'Đảm bảo cơ sở vật chất và công tác chuẩn bị cho kỳ thi tốt nghiệp THPT 2026',
    domain: 'Giáo dục và Đào tạo',
    dataGroups: ['Giáo dục'],
    source: 'Bà Trần Thị Mai – Chủ tịch UBND Tỉnh',
    issuedDate: prototypeDateAtOffset(-25),
    deadline: prototypeDateAtOffset(-5),
    deadlineType: 'normal',
    content: 'Tỉnh chỉ đạo Sở Giáo dục và Đào tạo chủ trì phối hợp với các sở ngành đảm bảo an toàn tuyệt đối, cơ sở vật chất và điện nước cho các điểm thi tốt nghiệp THPT 2026 trên toàn tỉnh.',
    dashboardLink: '../../dashboard/index.html',
    attachment: 'CD_GiaoDuc_ThiTHPT_2026.pdf',
    attachmentSize: '1.5 MB',
    previewImage: null,
    processId: 'process-1',
    leaderReport: {
      content: 'Sở Giáo dục & Đào tạo đã chuẩn bị đầy đủ 41 điểm thi với 820 phòng thi trên địa bàn 17 huyện, thị xã, thành phố. Tất cả phương án an ninh, y tế, điện nước và hỗ trợ học sinh vùng xa đã sẵn sàng.',
      files: [
        { name: 'BaoCao_TrinhTinh_ThiTHPT2026_HoanTat.pdf', size: '1.9 MB', date: prototypeHistoryTime(-6, '15:00') },
        { name: 'Dashboard_CapNhat_ThoiDiemTrinh.png', size: '1.2 MB', date: prototypeHistoryTime(-6, '15:00'), path: 'assets/dashboard_gialai.png', url: 'assets/dashboard_gialai.png' }
      ],
      time: prototypeHistoryTime(-6, '15:00')
    },
    leaderReports: [
      {
        content: 'Sở Giáo dục & Đào tạo đã chuẩn bị đầy đủ 41 điểm thi với 820 phòng thi trên địa bàn 17 huyện, thị xã, thành phố. Tất cả phương án an ninh, y tế, điện nước và hỗ trợ học sinh vùng xa đã sẵn sàng.',
        files: [
          { name: 'BaoCao_TrinhTinh_ThiTHPT2026_HoanTat.pdf', size: '1.9 MB', date: prototypeHistoryTime(-6, '15:00') },
          { name: 'Dashboard_CapNhat_ThoiDiemTrinh.png', size: '1.2 MB', date: prototypeHistoryTime(-6, '15:00'), path: 'assets/dashboard_gialai.png', url: 'assets/dashboard_gialai.png' }
        ],
        time: prototypeHistoryTime(-6, '15:00')
      }
    ],
    executionTree: {
      id: 'node-05-leader', contextId: 'leader',
      unitName: 'Sở Giáo dục và Đào tạo',
      accountId: 'acc-so-gddt', accountName: 'Lãnh đạo Sở',
      stage: 'completed',
      availableAssignees: [],
      slaDeadline: prototypeDateAtOffset(-5),
      notes: 'Đã hoàn thành phê duyệt.',
      notesFile: null,
      subReports: [
        {
          from: 'Hoàng Minh Đức (Chuyên viên)',
          time: prototypeHistoryTime(-8, '11:00'),
          content: 'Đã kiểm tra 41/41 điểm thi. Đảm bảo đầy đủ thiết bị, máy phát điện dự phòng và lực lượng công an hỗ trợ.',
          files: [
            { name: 'BaoCao_KiemTra_DiemThi.pdf', size: '1.9 MB', date: prototypeHistoryTime(-8, '11:00') },
            { name: 'Dashboard_CapNhat_ThoiDiemTrinh.png', size: '1.2 MB', date: prototypeHistoryTime(-8, '11:00'), path: 'assets/dashboard_gialai.png', url: 'assets/dashboard_gialai.png' }
          ]
        }
      ],
      leaderReport: {
        content: 'Sở Giáo dục & Đào tạo đã chuẩn bị đầy đủ 41 điểm thi với 820 phòng thi trên địa bàn 17 huyện, thị xã, thành phố. Tất cả phương án an ninh, y tế, điện nước và hỗ trợ học sinh vùng xa đã sẵn sàng.',
        files: [
          { name: 'BaoCao_TrinhTinh_ThiTHPT2026_HoanTat.pdf', size: '1.9 MB', date: prototypeHistoryTime(-6, '15:00') },
          { name: 'Dashboard_CapNhat_ThoiDiemTrinh.png', size: '1.2 MB', date: prototypeHistoryTime(-6, '15:00'), path: 'assets/dashboard_gialai.png', url: 'assets/dashboard_gialai.png' }
        ],
        time: prototypeHistoryTime(-6, '15:00')
      },
      leaderReports: [
        {
          content: 'Sở Giáo dục & Đào tạo đã chuẩn bị đầy đủ 41 điểm thi với 820 phòng thi trên địa bàn 17 huyện, thị xã, thành phố. Tất cả phương án an ninh, y tế, điện nước và hỗ trợ học sinh vùng xa đã sẵn sàng.',
          files: [
            { name: 'BaoCao_TrinhTinh_ThiTHPT2026_HoanTat.pdf', size: '1.9 MB', date: prototypeHistoryTime(-6, '15:00') },
            { name: 'Dashboard_CapNhat_ThoiDiemTrinh.png', size: '1.2 MB', date: prototypeHistoryTime(-6, '15:00'), path: 'assets/dashboard_gialai.png', url: 'assets/dashboard_gialai.png' }
          ],
          time: prototypeHistoryTime(-6, '15:00')
        }
      ],
      history: [
        { order: 1, time: prototypeHistoryTime(-25), actor: 'Hệ thống', action: 'Đồng bộ văn bản', note: 'Chỉ đạo chuyển đến Sở Giáo dục và Đào tạo.' },
        { order: 2, time: prototypeHistoryTime(-24, '09:00'), actor: 'Lãnh đạo Sở', action: 'Chuyển xử lý', note: 'Phân công Chuyên viên Hoàng Minh Đức.' },
        { order: 3, time: prototypeHistoryTime(-8, '11:00'), actor: 'Hoàng Minh Đức', action: 'Trình duyệt', note: 'Nộp báo cáo công tác chuẩn bị.' },
        { order: 4, time: prototypeHistoryTime(-6, '15:00'), actor: 'Lãnh đạo Sở', action: 'Trình Tỉnh', note: 'Trình UBND Tỉnh báo cáo tổng hợp.' },
        { order: 5, time: prototypeHistoryTime(-5, '10:00'), actor: 'Lãnh đạo Tỉnh', action: 'Phê duyệt', note: 'Tỉnh đã phê duyệt hoàn thành chỉ đạo.' }
      ],
      children: [
        {
          id: 'node-05-dept', contextId: 'department',
          unitName: 'Phòng Khảo thí và Quản lý CLGD', accountId: 'acc-truong-phong-05', accountName: 'Trưởng phòng Khảo thí',
          stage: 'completed',
          availableAssignees: [],
          slaDeadline: prototypeDateAtOffset(-5),
          notes: '', notesFile: null, subReports: [], history: [],
          children: [
            {
              id: 'node-05-staff', contextId: 'individual',
              unitName: 'Chuyên viên — Phòng Khảo thí', accountId: 'acc-cv-05', accountName: 'Hoàng Minh Đức',
              stage: 'completed',
              availableAssignees: [],
              slaDeadline: prototypeDateAtOffset(-5),
              notes: '', notesFile: null, subReports: [], history: [],
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
  role: 'leader',
  activeTab: 'active',   // 'active' | 'done'
  selectedId: null,
  page: 1,
  pageSize: 10,
  filters: { search: '', status: '', deadlineRange: [], timeCondition: '' },

  statusMeta: {
    waitingAssign: { label: 'Chờ phân công', color: '#f59e0b', icon: 'fa-clock-rotate-left' },
    processing: { label: 'Đang xử lý', color: '#3b82f6', icon: 'fa-spinner' },
    reported: { label: 'Đã có báo cáo', color: '#8b5cf6', icon: 'fa-file-circle-check' },
    waitingApproval: { label: 'Chờ phê duyệt', color: '#f97316', icon: 'fa-hourglass-half' },
    completed: { label: 'Đã kết thúc', color: '#22c55e', icon: 'fa-circle-check' },
  },

  DATA_GROUPS: [
    'Dân cư', 'Phản ánh hiện trường', 'Giáo dục', 'Kinh tế xã hội',
    'Cán bộ công chức', 'Văn bản điều hành', 'CSDL quốc gia về tài chính', 'Hành chính công'
  ],

  processes: JSON.parse(localStorage.getItem('gialai_processes') || '[]'),
  directives: createPrototypeDirectives(),
};
