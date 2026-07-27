/* ---------------- Xử lý chỉ đạo: Dữ liệu mẫu (prototype) ----------------
 * File này chứa toàn bộ dữ liệu giả lập (mock data) cho phân hệ Xử lý chỉ đạo.
 * Tách khỏi ui.js để giữ logic sạch. Được load TRƯỚC ui.js trong index.html.
 * --------------------------------------------------------------------- */

/* ---------------- Xử lý chỉ đạo: state ---------------- */
const prototypeDateAtOffset = offsetDays => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const prototypeHistoryTime = (offsetDays, time = '08:00') => `${time} - ${prototypeDateAtOffset(offsetDays)}`;

const createPrototypeDirectives = () => [
  /* ── TEST-01: Lãnh đạo Sở chờ chọn quy trình ─────────────────── */
  {
    id: `CD-${new Date().getFullYear()}-TEST-01`,
    title: 'Triển khai kế hoạch kiểm soát ô nhiễm môi trường khu công nghiệp',
    domain: 'Tài nguyên và Môi trường',
    source: 'Lãnh đạo Tỉnh',
    issuedDate: prototypeDateAtOffset(-2),
    deadline: prototypeDateAtOffset(20),
    deadlineType: 'normal',
    deadlineNote: 'Chỉ đạo mới, chờ Lãnh đạo Sở phân công quy trình',
    provinceDeadlineWarning: false,
    assignee: 'Chưa phân công',
    assigneeInitials: '--',
    stage: 'accepted',
    content: 'Tỉnh chỉ đạo Sở Tài nguyên và Môi trường triển khai kế hoạch kiểm soát ô nhiễm tại các khu công nghiệp trên địa bàn tỉnh Gia Lai trong quý III/2026.',
    attachment: 'CD_KiemSoatONhiem_KCN_2026.pdf',
    attachmentSize: '1.4 MB',
    processId: null,
    report: '',
    reportFile: null,
    timelineNotes: {},
    executionTree: {
      id: 'node-test-01-leader',
      contextId: 'leader',
      unitName: 'Sở Tài nguyên và Môi trường',
      accountId: 'acc-so-tnmt',
      accountName: 'Lãnh đạo Sở',
      parentUnit: 'Lãnh đạo Tỉnh',
      level: 1,
      canDelegate: true,
      stage: 'accepted',
      processId: null,
      handlingMode: null,
      report: '',
      reportFile: null,
      reportVersions: [],
      timelineNotes: { 1: 'Lãnh đạo Sở cần chọn mẫu quy trình và kích hoạt xử lý' },
      history: [
        { order: 1, time: prototypeHistoryTime(-2), actor: 'Hệ thống', action: 'Đồng bộ văn bản', note: 'Chỉ đạo đã được chuyển đến Sở Tài nguyên và Môi trường.' }
      ],
      children: []
    }
  },

  /* ── TEST-02: Chuyên viên đang xử lý (executionTree đa cấp) ───── */
  {
    id: `CD-${new Date().getFullYear()}-TEST-02`,
    title: 'Rà soát và cập nhật dữ liệu dân số phục vụ quy hoạch vùng',
    domain: 'Kế hoạch và Đầu tư',
    source: 'Lãnh đạo Tỉnh',
    issuedDate: prototypeDateAtOffset(-10),
    deadline: prototypeDateAtOffset(8),
    deadlineType: 'normal',
    deadlineNote: 'Đang trong hạn xử lý',
    provinceDeadlineWarning: false,
    assignee: 'Lãnh đạo Sở',
    assigneeInitials: 'LS',
    stage: 'processActivated',
    content: 'Tỉnh yêu cầu Sở Kế hoạch và Đầu tư phối hợp với các Sở liên quan rà soát, cập nhật dữ liệu dân số toàn tỉnh, phục vụ công tác quy hoạch vùng giai đoạn 2026–2030.',
    attachment: 'CD_RaSoatDanSo_QuyHoach2026.pdf',
    attachmentSize: '2.1 MB',
    processId: 'process-1',
    report: '',
    reportFile: null,
    timelineNotes: {},
    executionTree: {
      id: 'node-test-02-leader',
      contextId: 'leader',
      unitName: 'Sở Kế hoạch và Đầu tư',
      accountId: 'acc-so-khdt',
      accountName: 'Lãnh đạo Sở',
      parentUnit: 'Lãnh đạo Tỉnh',
      level: 1,
      canDelegate: true,
      stage: 'processActivated',
      processId: 'process-1',
      handlingMode: 'process',
      report: '',
      reportFile: null,
      reportVersions: [],
      slaStartDate: prototypeDateAtOffset(-9),
      slaDeadline: prototypeDateAtOffset(9),
      warningDays: 3,
      timelineNotes: { 2: 'Lãnh đạo Sở đã kích hoạt quy trình, chờ chuyên viên xử lý' },
      history: [
        { order: 1, time: prototypeHistoryTime(-10), actor: 'Hệ thống', action: 'Đồng bộ văn bản', note: 'Chỉ đạo đã được chuyển đến Sở Kế hoạch và Đầu tư.' },
        { order: 2, time: prototypeHistoryTime(-9, '09:15'), actor: 'Lãnh đạo Sở', action: 'Kích hoạt quy trình', note: 'Chọn quy trình "Xử lý PAHT" và phân công Chuyên viên Nguyễn Văn An.' }
      ],
      children: [
        {
          id: 'node-test-02-dept',
          contextId: 'department',
          unitName: 'Phòng Tổng hợp — Quy hoạch',
          accountId: 'acc-truong-phong-01',
          accountName: 'Trưởng phòng Tổng hợp',
          parentUnit: 'Sở Kế hoạch và Đầu tư',
          level: 2,
          canDelegate: true,
          stage: 'processActivated',
          processId: 'process-1',
          handlingMode: 'process',
          report: '',
          reportFile: null,
          reportVersions: [],
          slaStartDate: prototypeDateAtOffset(-9),
          slaDeadline: prototypeDateAtOffset(9),
          warningDays: 2,
          timelineNotes: { 2: 'Phòng đã nhận việc, đang phân công chuyên viên' },
          history: [
            { order: 2, time: prototypeHistoryTime(-9, '09:15'), actor: 'Lãnh đạo Sở', action: 'Kích hoạt quy trình', note: 'Phân công Phòng Tổng hợp xử lý.' }
          ],
          children: [
            {
              id: 'node-test-02-staff',
              contextId: 'individual',
              unitName: 'Chuyên viên — Phòng Tổng hợp',
              accountId: 'acc-cv-01',
              accountName: 'Nguyễn Văn An',
              parentUnit: 'Phòng Tổng hợp — Quy hoạch',
              level: 3,
              canDelegate: false,
              stage: 'staffProcessing',
              processId: 'process-1',
              handlingMode: null,
              report: '',
              reportFile: null,
              reportVersions: [],
              slaStartDate: prototypeDateAtOffset(-9),
              slaDeadline: prototypeDateAtOffset(8),
              warningDays: 2,
              timelineNotes: { 3: 'Chuyên viên đang xử lý, cần nộp báo cáo trước hạn' },
              history: [
                { order: 3, time: prototypeHistoryTime(-9, '10:00'), actor: 'Trưởng phòng', action: 'Phân công chuyên viên', note: 'Nguyễn Văn An được phân công xử lý.' }
              ],
              children: []
            }
          ]
        }
      ]
    }
  },

  /* ── TEST-03: Chờ Tỉnh phê duyệt ─────────────────────────────── */
  {
    id: `CD-${new Date().getFullYear()}-TEST-03`,
    title: 'Báo cáo kết quả triển khai chương trình chuyển đổi số nông nghiệp',
    domain: 'Nông nghiệp và Phát triển nông thôn',
    source: 'Lãnh đạo Tỉnh',
    issuedDate: prototypeDateAtOffset(-30),
    deadline: prototypeDateAtOffset(-3),
    deadlineType: 'overdue',
    deadlineNote: 'Đã trễ hạn nhưng đã có báo cáo gửi Tỉnh',
    provinceDeadlineWarning: true,
    assignee: 'Lãnh đạo Sở',
    assigneeInitials: 'LS',
    stage: 'sentProvince',
    content: 'Sở Nông nghiệp và PTNT đã hoàn thành báo cáo kết quả triển khai chương trình chuyển đổi số nông nghiệp giai đoạn 2024–2026 và gửi Tỉnh phê duyệt.',
    attachment: 'BaoCao_ChuyenDoiSo_NongNghiep_2026.pdf',
    attachmentSize: '3.8 MB',
    processId: 'process-1',
    report: 'Báo cáo đã được Lãnh đạo Sở ký duyệt và trình Tỉnh ngày ' + prototypeDateAtOffset(-1) + '.',
    reportFile: { name: 'BaoCao_Final_NNPTNT.pdf', size: 3900000 },
    timelineNotes: {},
    executionTree: {
      id: 'node-test-03-leader',
      contextId: 'leader',
      unitName: 'Sở Nông nghiệp và PTNT',
      accountId: 'acc-so-nnptnt',
      accountName: 'Lãnh đạo Sở',
      parentUnit: 'Lãnh đạo Tỉnh',
      level: 1,
      canDelegate: true,
      stage: 'sentProvince',
      processId: 'process-1',
      handlingMode: 'process',
      overdue: true,
      report: 'Báo cáo kết quả đã được hoàn thiện, trình Tỉnh phê duyệt.',
      reportFile: { name: 'BaoCao_Final_NNPTNT.pdf', size: 3900000 },
      reportVersions: [
        { version: 1, note: 'Bản nháp lần 1', time: prototypeHistoryTime(-8, '14:00') },
        { version: 2, note: 'Hoàn thiện theo góp ý của Tỉnh', time: prototypeHistoryTime(-2, '09:30') }
      ],
      slaStartDate: prototypeDateAtOffset(-28),
      slaDeadline: prototypeDateAtOffset(-3),
      warningDays: 3,
      timelineNotes: {},
      history: [
        { order: 1, time: prototypeHistoryTime(-30), actor: 'Hệ thống', action: 'Đồng bộ văn bản', note: 'Chỉ đạo đã được chuyển đến Sở Nông nghiệp và PTNT.' },
        { order: 2, time: prototypeHistoryTime(-29, '08:30'), actor: 'Lãnh đạo Sở', action: 'Kích hoạt quy trình', note: 'Phân công Chuyên viên xử lý theo quy trình.' },
        { order: 3, time: prototypeHistoryTime(-8, '14:00'), actor: 'Chuyên viên', action: 'Nộp báo cáo', note: 'Nộp bản nháp lần 1.' },
        { order: 4, time: prototypeHistoryTime(-5, '11:00'), actor: 'Lãnh đạo Sở', action: 'Yêu cầu làm lại', note: 'Bổ sung số liệu thống kê quý IV/2025.', overdue: false },
        { order: 5, time: prototypeHistoryTime(-2, '09:30'), actor: 'Chuyên viên', action: 'Nộp lại báo cáo', note: 'Đã bổ sung số liệu theo yêu cầu.' },
        { order: 6, time: prototypeHistoryTime(-1, '15:00'), actor: 'Lãnh đạo Sở', action: 'Trình Tỉnh', note: 'Ký duyệt và gửi báo cáo chính thức lên Tỉnh.', overdue: true }
      ],
      children: [
        {
          id: 'node-test-03-dept',
          contextId: 'department',
          unitName: 'Phòng Kế hoạch — Tài chính',
          accountId: 'acc-truong-phong-02',
          accountName: 'Trưởng phòng Kế hoạch',
          parentUnit: 'Sở Nông nghiệp và PTNT',
          level: 2,
          canDelegate: true,
          stage: 'completed',
          processId: 'process-1',
          report: 'Phòng đã hoàn thành và nộp báo cáo.',
          reportFile: { name: 'BaoCao_Final_NNPTNT.pdf', size: 3900000 },
          reportVersions: [],
          slaStartDate: prototypeDateAtOffset(-28),
          slaDeadline: prototypeDateAtOffset(-3),
          warningDays: 2,
          timelineNotes: {},
          history: [
            { order: 2, time: prototypeHistoryTime(-29, '08:30'), actor: 'Lãnh đạo Sở', action: 'Phân công phòng', note: 'Phòng Kế hoạch được phân công xử lý.' }
          ],
          children: [
            {
              id: 'node-test-03-staff',
              contextId: 'individual',
              unitName: 'Chuyên viên — Phòng Kế hoạch',
              accountId: 'acc-cv-02',
              accountName: 'Trần Thị Bình',
              parentUnit: 'Phòng Kế hoạch — Tài chính',
              level: 3,
              canDelegate: false,
              stage: 'completed',
              processId: 'process-1',
              report: 'Đã nộp báo cáo đầy đủ.',
              reportFile: { name: 'BaoCao_Final_NNPTNT.pdf', size: 3900000 },
              reportVersions: [],
              slaStartDate: prototypeDateAtOffset(-28),
              slaDeadline: prototypeDateAtOffset(-3),
              warningDays: 2,
              timelineNotes: {},
              history: [],
              children: []
            }
          ]
        }
      ]
    }
  }
];

const directiveState = {
  role: 'leader',
  displayMode: 'table',
  selectedId: null,
  page: 1,
  pageSize: 10,
  filters: { search: '', statuses: [], issuedRange: [], deadlineRange: [], timeCondition: '' },
  statusMeta: {
    needsHandling: { label: 'Cần phân công', icon: 'fa-list-check', step: 1 },
    processing: { label: 'Đang xử lý', icon: 'fa-spinner', step: 2 },
    waitingApproval: { label: 'Chờ duyệt', icon: 'fa-clock', step: 3 },
    needsApproval: { label: 'Cần duyệt', icon: 'fa-user-check', step: 4 },
    completed: { label: 'Đã hoàn thành', icon: 'fa-circle-check', step: 5 }
  },
  statusByStage: {
    new: {
      province: { key: 'waitingAcceptance', label: 'Chờ tiếp nhận' },
      leader: { key: 'needsAcceptance', label: 'Cần tiếp nhận' },
      staff: null
    },
    accepted: {
      province: { key: 'processing', label: 'Đang xử lý' },
      leader: { key: 'needsHandling', label: 'Cần xử lý' },
      staff: null
    },
    directProcessing: {
      province: { key: 'processing', label: 'Đang xử lý' },
      leader: { key: 'directProcessing', label: 'Đang xử lý trực tiếp' },
      staff: null
    },
    processActivated: {
      province: { key: 'processing', label: 'Đang xử lý' },
      leader: { key: 'waitingAcceptance', label: 'Chờ tiếp nhận' },
      staff: { key: 'needsAcceptance', label: 'Cần tiếp nhận' }
    },
    staffProcessing: {
      province: { key: 'processing', label: 'Đang xử lý' },
      leader: { key: 'assignedProcessing', label: 'Đang xử lý theo phân công' },
      staff: { key: 'processing', label: 'Đang xử lý' }
    },
    reportSubmitted: {
      province: { key: 'processing', label: 'Đang xử lý' },
      leader: { key: 'internalApproval', label: 'Chờ duyệt nội bộ' },
      staff: { key: 'internalApproval', label: 'Chờ duyệt nội bộ' }
    },
    revisionRequired: {
      province: { key: 'processing', label: 'Đang xử lý' },
      leader: { key: 'revisionRequired', label: 'Cần làm lại' },
      staff: { key: 'revisionRequired', label: 'Cần làm lại' }
    },
    reportApproved: {
      province: { key: 'processing', label: 'Đang xử lý' },
      leader: { key: 'internalApproved', label: 'Đã duyệt nội bộ' },
      staff: { key: 'internalApproved', label: 'Đã duyệt nội bộ' }
    },
    readyForProvince: {
      province: { key: 'processing', label: 'Đang xử lý' },
      leader: { key: 'readyForProvince', label: 'Chờ trình Tỉnh' },
      staff: null
    },
    sentProvince: {
      province: { key: 'provinceApproval', label: 'Chờ phê duyệt' },
      leader: { key: 'provinceApproval', label: 'Chờ Tỉnh phê duyệt' },
      staff: { key: 'provinceApproval', label: 'Chờ Tỉnh phê duyệt' }
    },
    completed: {
      province: { key: 'completed', label: 'Đã hoàn thành' },
      leader: { key: 'completed', label: 'Đã hoàn thành' },
      staff: { key: 'completed', label: 'Đã hoàn thành' }
    }
  },
  processes: JSON.parse(localStorage.getItem('gialai_processes') || '[]'),
  directives: createPrototypeDirectives(),
  timeline: [
    { title: 'Tỉnh ban hành chỉ đạo', description: 'Chỉ đạo được đồng bộ về phân hệ Xử lý chỉ đạo.' },
    { title: 'Sở tiếp nhận và phân công', description: 'Lãnh đạo Sở chọn mẫu quy trình đã cấu hình.' },
    { title: 'Cấp dưới xử lý', description: 'Cấp dưới thực hiện nhiệm vụ và gửi báo cáo kết quả.' },
    { title: 'Sở phê duyệt và gửi Tỉnh', description: 'Lãnh đạo Sở duyệt báo cáo nội bộ và gửi Tỉnh.' },
    { title: 'Tỉnh phê duyệt kết quả', description: 'Kết thúc luồng xử lý chỉ đạo.' }
  ]
};
