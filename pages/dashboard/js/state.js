/**
 * state.js — Quản lý state chỉ đạo (directives)
 * Trang: p01 - Tình hình dân cư theo giới tính
 *
 * Exports (global):
 *   - METRIC_LABELS: object — map metricId → tên hiển thị
 *   - AGENCIES: array      — danh sách cơ quan tiếp nhận
 *   - DIRECTORS: array     — danh sách người chỉ đạo
 *   - directives: array    — danh sách chỉ đạo (load từ localStorage)
 *   - saveDirectives()     — ghi directives xuống localStorage
 */

const METRIC_LABELS = {
  'metric-tong-nhan-khau': 'Tổng nhân khẩu',
  'metric-dien-tich': 'Diện tích (Km²)',
  'metric-mat-do': 'Mật độ dân số',
  'metric-tre-em': 'Trẻ em (0-14t)',
  'metric-lao-dong': 'Người lao động (15-64t)',
  'metric-nguoi-lon-tuoi': 'Người lớn tuổi (Trên 65t)',
  'metric-chart-high': 'Biểu đồ Top 5 nhân khẩu cao nhất',
  'metric-chart-low': 'Biểu đồ Top 5 nhân khẩu thấp nhất',
  'metric-map': 'Bản đồ phân bố dân cư'
};

const AGENCIES = [
  'Sở Nội vụ',
  'Sở Thông tin và Truyền thông',
  'Sở Tư pháp',
  'Sở Lao động - Thương binh và Xã hội',
  'Sở Y tế',
  'Sở Giáo dục và Đào tạo',
  'Sở Kế hoạch và Đầu tư',
  'Sở Tài chính',
  'UBND Huyện Pleiku',
  'UBND Huyện Ia Grai',
  'UBND Huyện Chư Sê',
  'UBND Huyện Đăk Đoa',
  'Cục Thống kê Gia Lai',
  'Công an Tỉnh Gia Lai'
];

const DIRECTORS = [
  'Chủ tịch UBND Tỉnh',
  'Phó Chủ tịch UBND Tỉnh (phụ trách KTXH)',
  'Phó Chủ tịch UBND Tỉnh (phụ trách Nội chính)',
  'Giám đốc Sở KHCN',
  'Phó Giám đốc Sở KHCN',
  'Chánh Văn phòng UBND Tỉnh'
];

const STORAGE_KEY = 'gialai_directives';
const DATA_VERSION = 'gialai_directives_v9';

// Helper: format Date to dd/mm/yyyy
function formatDateDMY(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
}

// Khởi tạo và kiểm tra dữ liệu từ localStorage
let directives = [];
try {
  directives = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
} catch (e) {
  console.error('Lỗi đọc dữ liệu directives từ localStorage:', e);
  directives = [];
}

// Reset nếu phiên bản dữ liệu cũ
const currentVersion = localStorage.getItem('gialai_directives_version');
if (currentVersion !== DATA_VERSION || !Array.isArray(directives) || directives.length < 30) {
  directives = [];
  localStorage.setItem('gialai_directives_version', DATA_VERSION);
  localStorage.removeItem(STORAGE_KEY);
}

// Seed mock data (123 chỉ đạo) nếu cần
if (directives.length < 123) {
  const metricKeys = Object.keys(METRIC_LABELS);
  const statuses = ['Đã chỉ đạo', 'Chờ phân công', 'Đang xử lý', 'Đã có báo cáo', 'Hoàn thành', 'Bị từ chối'];
  const contents = [
    'Rà soát toàn bộ số liệu thống kê dân cư định kỳ, đối chiếu dữ liệu hộ khẩu thực tế.',
    'Báo cáo tình hình biến động nhân khẩu đột xuất tại địa phương trong quý.',
    'Kiểm tra hạ tầng mạng và kết nối dữ liệu quốc gia về dân cư, khắc phục sự cố.',
    'Tăng cường tuyên truyền, hướng dẫn công dân cập nhật định danh điện tử VNeID.',
    'Tổng hợp danh sách đối tượng chính sách ưu tiên, trình phê duyệt trước cuối tháng.',
    'Hỗ trợ kỹ thuật cho các điểm tiếp nhận thông tin người dân trên địa bàn.',
    'Đẩy nhanh tiến độ nhập liệu hồ sơ hộ tịch còn tồn đọng theo chỉ tiêu.',
    'Cập nhật bản đồ phân bố dân số theo phân cấp hành chính mới sau sáp nhập.',
    'Theo dõi tỷ lệ sinh và mất tại các khu vực vùng sâu vùng xa, báo cáo kịp thời.',
    'Thực hiện báo cáo định kỳ tình hình lao động có việc làm và tỷ lệ thất nghiệp.'
  ];
  const reports = [
    'Đang tiến hành rà soát dữ liệu thu thập từ các đơn vị cơ sở.',
    'Đã phối hợp khắc phục xong các điểm nghẽn kết nối dữ liệu.',
    'Đã hoàn thành đợt tuyên truyền lưu động đầu tiên, đạt kết quả tốt.',
    'Đang lập danh sách chi tiết, dự kiến trình lãnh đạo trong tuần tới.',
    'Đã hoàn tất rà soát số liệu và cập nhật dữ liệu báo cáo hệ thống.'
  ];

  // Tạo ngày deadline đa dạng: quá hạn, đến hạn, sắp đến hạn, còn xa
  function randomDueDate() {
    const roll = Math.random();
    let offset;
    if (roll < 0.15) offset = -(Math.floor(Math.random() * 10) + 1); // quá hạn
    else if (roll < 0.25) offset = 0;                                      // đúng hạn hôm nay
    else if (roll < 0.40) offset = Math.floor(Math.random() * 3) + 1;     // sắp đến hạn (1-3 ngày)
    else offset = Math.floor(Math.random() * 25) + 4;     // còn nhiều thời gian
    return formatDateDMY(new Date(Date.now() + offset * 86400000));
  }

  directives = [];
  for (let i = 0; i < 123; i++) {
    const status = statuses[i % statuses.length]; // phân bổ đều các trạng thái
    const metricId = metricKeys[Math.floor(Math.random() * metricKeys.length)];
    const numMets = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...metricKeys].sort(() => 0.5 - Math.random());
    const metricIds = shuffled.slice(0, numMets);

    let report = '';
    if (status === 'Đang xử lý') {
      report = reports[Math.floor(Math.random() * (reports.length - 2))];
    } else if (status === 'Đã có báo cáo') {
      report = reports[3];
    } else if (status === 'Hoàn thành') {
      report = reports[4];
    } else if (status === 'Bị từ chối') {
      report = 'Lý do từ chối: Báo cáo kết quả chưa đầy đủ số liệu theo yêu cầu (Yêu cầu đơn vị tiếp nhận báo cáo lại).';
    }

    const dueDate = randomDueDate();
    const createOff = Math.floor(Math.random() * 14) + 1;
    const createdAt = formatDateDMY(new Date(Date.now() - createOff * 86400000)) + ' 08:30';

    // Thời hạn đơn vị gửi báo cáo (chỉ cho các trạng thái có báo cáo)
    let reportDueDate = '';
    if (status === 'Đã có báo cáo' || status === 'Hoàn thành' || status === 'Bị từ chối' || status === 'Đang xử lý') {
      const rptOff = Math.floor(Math.random() * 10) + 3;
      reportDueDate = formatDateDMY(new Date(Date.now() + rptOff * 86400000));
    }

    const attachments = [];
    if (i % 3 === 0) {
      attachments.push({ name: 'Chi_dao_so_' + (i + 1) + '.pdf', source: 'leader' });
    }
    if (status === 'Đã có báo cáo' || status === 'Hoàn thành') {
      attachments.push({ name: 'Bao_cao_don_vi_' + (i + 1) + '.docx', source: 'agency' });
    }

    directives.push({
      id: 'dir_mock_' + (i + 1),
      metricId,
      metricIds,
      agency: AGENCIES[Math.floor(Math.random() * AGENCIES.length)],
      director: DIRECTORS[Math.floor(Math.random() * DIRECTORS.length)],
      creator: DIRECTORS[Math.floor(Math.random() * DIRECTORS.length)],
      attachments,
      content: contents[i % contents.length],
      dueDate,
      reportDueDate,
      status,
      report,
      createdAt,
      history: [] // sẽ sinh động qua getDirectiveHistory
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(directives));
}

// Migration backward-compat: bổ sung trường mới cho bản ghi cũ thiếu trường
directives = directives.map(function (d) {
  const normalizedAttachments = Array.isArray(d.attachments)
    ? d.attachments.map(att => typeof att === 'string' ? { name: att, source: 'leader' } : att)
    : [];
  return Object.assign({
    metricIds: d.metricId ? [d.metricId] : [],
    agency: AGENCIES[0],
    director: DIRECTORS[0],
    creator: d.director || DIRECTORS[0],
    reportDueDate: '',
    history: []
  }, d, { attachments: normalizedAttachments });
});

function saveDirectives() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(directives));
}

// Helper: Lấy/sinh lịch sử trạng thái đầy đủ 13 cột cho chỉ đạo
function getDirectiveHistory(dir) {
  if (!dir) return [];

  const history = [];
  const creator = dir.creator || dir.director || 'Chủ tịch UBND Tỉnh';
  const createdAt = dir.createdAt || 'N/A';
  const agency = dir.agency || 'Cơ quan tiếp nhận';
  const agencyRep = 'Đại diện ' + agency;
  const content1st = dir.content ? (dir.content.length > 60 ? dir.content.substring(0, 60) + '...' : dir.content) : '';

  // ----- Bước 1: Đã chỉ đạo -----
  history.push({
    status: 'Đã chỉ đạo',
    creator: creator,
    createdAt: createdAt,
    agency: agency,
    reporter: '-',
    reportDate: '-',
    approver: '-',
    approvalDate: '-',
    processDays: '0 ngày',
    overdue: 'Đúng hạn',
    contentNote: content1st,
    progressNote: 'Khởi tạo và ban hành chỉ đạo.',
    attachments: (dir.attachments || []).filter(f => f.source === 'leader' || !f.source).map(f => f.name).join(', ') || '-'
  });

  // ----- Bước 2: Đang xử lý -----
  const hasProcessing = ['Đang xử lý', 'Đã có báo cáo', 'Hoàn thành', 'Bị từ chối'].includes(dir.status);
  if (hasProcessing) {
    const rptDate = dir.reportDueDate || dir.dueDate || createdAt;
    history.push({
      status: 'Đang xử lý',
      creator: creator,
      createdAt: createdAt,
      agency: agency,
      reporter: agencyRep,
      reportDate: rptDate,
      approver: '-',
      approvalDate: '-',
      processDays: '—',
      overdue: 'Đúng hạn',
      contentNote: '-',
      progressNote: 'Đơn vị đã tiếp nhận và đang tiến hành xử lý.',
      attachments: '-'
    });
  }

  // ----- Bước 3: Đã có báo cáo / Bị từ chối -----
  const hasReport = ['Đã có báo cáo', 'Hoàn thành', 'Bị từ chối'].includes(dir.status);
  if (hasReport) {
    const rptDate = dir.reportDueDate || dir.dueDate || createdAt;
    const agencyAttach = (dir.attachments || []).filter(f => f.source === 'agency').map(f => f.name).join(', ') || '-';
    const isRejected = dir.status === 'Bị từ chối';

    // Tính số ngày xử lý
    let processDays = '-';
    const d1 = parseDMY(createdAt); const d2 = parseDMY(rptDate);
    if (d1 && d2) {
      const diff = Math.round((d2 - d1) / 86400000);
      processDays = diff + ' ngày';
    }

    // Kiểm tra trễ hạn
    let overdueStr = 'Đúng hạn';
    if (dir.dueDate) {
      const dDue = parseDMY(dir.dueDate);
      if (dDue && d2 && d2 > dDue) {
        const late = Math.round((d2 - dDue) / 86400000);
        overdueStr = 'Trễ ' + late + ' ngày';
      }
    }

    history.push({
      status: isRejected ? 'Bị từ chối' : 'Đã có báo cáo',
      creator: creator,
      createdAt: createdAt,
      agency: agency,
      reporter: agencyRep,
      reportDate: rptDate,
      approver: '-',
      approvalDate: '-',
      processDays: processDays,
      overdue: overdueStr,
      contentNote: '-',
      progressNote: dir.report || (isRejected ? 'Lãnh đạo từ chối báo cáo. Yêu cầu đơn vị báo cáo lại.' : 'Đã nộp báo cáo kết quả thực hiện.'),
      attachments: agencyAttach
    });
  }

  // ----- Bước 4: Đã phê duyệt / Hoàn thành -----
  if (dir.status === 'Hoàn thành') {
    const aprDate = dir.reportDueDate || dir.dueDate || createdAt;
    history.push({
      status: 'Đã phê duyệt',
      creator: creator,
      createdAt: createdAt,
      agency: agency,
      reporter: agencyRep,
      reportDate: aprDate,
      approver: creator,
      approvalDate: aprDate,
      processDays: '—',
      overdue: 'Đúng hạn',
      contentNote: '-',
      progressNote: 'Lãnh đạo đã phê duyệt kết quả và đóng chỉ đạo.',
      attachments: '-'
    });
  }

  return history;
}

// Helper parse ngày dd/mm/yyyy
function parseDMY(str) {
  if (!str) return null;
  const p = (str.split(' ')[0]).split('/');
  if (p.length < 3) return null;
  const d = new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]));
  return isNaN(d.getTime()) ? null : d;
}
