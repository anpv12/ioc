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
const DATA_VERSION = 'gialai_directives_v11';

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
if (currentVersion !== DATA_VERSION || !Array.isArray(directives) || directives.length > 20) {
  directives = [];
  localStorage.setItem('gialai_directives_version', DATA_VERSION);
  localStorage.removeItem(STORAGE_KEY);
}

// Seed mock data chuẩn (bao phủ toàn bộ trường hợp) nếu cần
if (directives.length === 0) {
  const todayStr = formatDateDMY(new Date());
  const dueOverdue = formatDateDMY(new Date(Date.now() - 2 * 86400000));
  const dueSoon = formatDateDMY(new Date(Date.now() + 2 * 86400000));
  const dueNormal = formatDateDMY(new Date(Date.now() + 7 * 86400000));

  directives = [
    // --- Metric Tổng nhân khẩu: 3 chỉ đạo active (2 Đỏ + 1 Cam -> Ưu tiên Đỏ, hiện số 3 khoanh tròn) ---
    {
      id: 'dir_mock_1',
      metricIds: ['metric-tong-nhan-khau'],
      metricId: 'metric-tong-nhan-khau',
      agency: 'Công an Tỉnh Gia Lai',
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Rà soát dữ liệu hộ khẩu và cập nhật biến động nhân khẩu khu vực thành phố Pleiku.',
      dueDate: dueSoon,
      reportDueDate: '',
      attachments: [{ name: 'Kế_hoạch_rà_soát_C06.pdf', source: 'leader' }],
      status: 'Đã chỉ đạo',
      report: '',
      createdAt: todayStr
    },
    {
      id: 'dir_mock_2',
      metricIds: ['metric-tong-nhan-khau'],
      metricId: 'metric-tong-nhan-khau',
      agency: 'Sở Thông tin và Truyền thông',
      director: 'Phó Chủ tịch UBND Tỉnh (phụ trách KTXH)',
      creator: 'Phó Chủ tịch UBND Tỉnh (phụ trách KTXH)',
      content: 'Kiểm tra hạ tầng mạng kết nối dữ liệu dân cư quốc gia trên địa bàn tỉnh.',
      dueDate: dueOverdue,
      reportDueDate: '',
      attachments: [{ name: 'Công_văn_chỉ_đạo_hạ_tầng.pdf', source: 'leader' }],
      status: 'Chờ phân công',
      report: '',
      createdAt: todayStr
    },
    {
      id: 'dir_mock_3',
      metricIds: ['metric-tong-nhan-khau'],
      metricId: 'metric-tong-nhan-khau',
      agency: 'Cục Thống kê Gia Lai',
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Tổng hợp số liệu thống kê dân số phục vụ lập quy hoạch phát triển đợt mới.',
      dueDate: dueNormal,
      reportDueDate: dueNormal,
      attachments: [{ name: 'Đề_đánh_giá_thống_kê.pdf', source: 'leader' }],
      status: 'Đang xử lý',
      report: 'Đơn vị đang tiến hành tổng hợp dữ liệu thu thập từ các huyện cơ sở.',
      createdAt: todayStr
    },

    // --- Metric Diện tích: 1 chỉ đạo Đỏ active (hiển thị Icon Cảnh báo màu Đỏ) ---
    {
      id: 'dir_mock_4',
      metricIds: ['metric-dien-tich'],
      metricId: 'metric-dien-tich',
      agency: 'Sở Kế hoạch và Đầu tư',
      director: 'Phó Chủ tịch UBND Tỉnh (phụ trách Nội chính)',
      creator: 'Phó Chủ tịch UBND Tỉnh (phụ trách Nội chính)',
      content: 'Cập nhật bản đồ địa giới hành chính các xã phường sau quy hoạch sáp nhập.',
      dueDate: dueNormal,
      reportDueDate: '',
      attachments: [{ name: 'Chi_dao_dia_gioi.pdf', source: 'leader' }],
      status: 'Đã chỉ đạo',
      report: '',
      createdAt: todayStr
    },

    // --- Metric Mật độ dân số: 2 chỉ đạo Cam active (hiển thị Số 2 khoanh tròn màu Cam) ---
    {
      id: 'dir_mock_5',
      metricIds: ['metric-mat-do'],
      metricId: 'metric-mat-do',
      agency: 'UBND Huyện Pleiku',
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Báo cáo mật độ dân cư tập trung tại các vùng đô thị trọng điểm.',
      dueDate: dueNormal,
      reportDueDate: dueNormal,
      attachments: [{ name: 'Chi_dao_mat_do.pdf', source: 'leader' }],
      status: 'Đang xử lý',
      report: 'Đang thu thập báo cáo từ các phường xã trực thuộc.',
      createdAt: todayStr
    },
    {
      id: 'dir_mock_6',
      metricIds: ['metric-mat-do'],
      metricId: 'metric-mat-do',
      agency: 'Sở Lao động - Thương binh và Xã hội',
      director: 'Giám đốc Sở KHCN',
      creator: 'Giám đốc Sở KHCN',
      content: 'Khảo sát biến động phân bố lực lượng lao động di cư theo mật độ dân số.',
      dueDate: dueSoon,
      reportDueDate: dueSoon,
      attachments: [
        { name: 'Khảo_sát_lao_động.pdf', source: 'leader' },
        { name: 'Báo_cáo_kết_quả_bước_1.docx', source: 'agency' }
      ],
      status: 'Đã có báo cáo',
      report: 'Đã hoàn tất khảo sát đợt 1 tại 5 khu công nghiệp lớn.',
      createdAt: todayStr
    },

    // --- Metric Trẻ em (0-14t): 1 chỉ đạo Cam active (hiển thị Icon Đồng hồ màu Cam) ---
    {
      id: 'dir_mock_7',
      metricIds: ['metric-tre-em'],
      metricId: 'metric-tre-em',
      agency: 'Sở Y tế',
      director: 'Phó Chủ tịch UBND Tỉnh (phụ trách KTXH)',
      creator: 'Phó Chủ tịch UBND Tỉnh (phụ trách KTXH)',
      content: 'Lập danh sách trẻ em trong độ tuổi tiêm chủng đợt 2 năm 2026.',
      dueDate: dueSoon,
      reportDueDate: dueSoon,
      attachments: [{ name: 'Ke_hoach_tiem_chung.pdf', source: 'leader' }],
      status: 'Đang xử lý',
      report: 'Đã gửi công văn hướng dẫn xuống các trung tâm y tế huyện.',
      createdAt: todayStr
    },

    // --- Metric Người lao động: 1 chỉ đạo Hoàn thành (Không hiện Ribbon active) ---
    {
      id: 'dir_mock_8',
      metricIds: ['metric-lao-dong'],
      metricId: 'metric-lao-dong',
      agency: 'Sở Lao động - Thương binh và Xã hội',
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Tổng hợp tỷ lệ giải quyết việc làm cho người lao động Quý 2.',
      dueDate: todayStr,
      reportDueDate: todayStr,
      attachments: [
        { name: 'Yeu_cau_viec_lam.pdf', source: 'leader' },
        { name: 'Bao_cao_viec_lam_Q2.pdf', source: 'agency' }
      ],
      status: 'Hoàn thành',
      report: 'Đã hoàn thành phê duyệt kết quả báo cáo giải quyết việc làm Quý 2.',
      createdAt: todayStr
    },

    // --- Metric Người lớn tuổi: 1 chỉ đạo Bị từ chối (Không hiện Ribbon active) ---
    {
      id: 'dir_mock_9',
      metricIds: ['metric-nguoi-lon-tuoi'],
      metricId: 'metric-nguoi-lon-tuoi',
      agency: 'Sở Y tế',
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Thực hiện đợt khám sức khỏe định kỳ cho người cao tuổi trên 65 tuổi.',
      dueDate: dueSoon,
      reportDueDate: dueSoon,
      attachments: [
        { name: 'Kham_suc_khoe_NCT.pdf', source: 'leader' },
        { name: 'Bao_cao_kham_suc_khoe_NCT_draft.pdf', source: 'agency' }
      ],
      status: 'Bị từ chối',
      report: 'Số liệu thống kê chưa đầy đủ các huyện miền núi. Yêu cầu đơn vị rà soát và báo cáo lại chi tiết.',
      createdAt: todayStr
    }
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(directives));
}

// Migration backward-compat: bổ sung trường mới cho bản ghi cũ thiếu trường
const STATUS_MAP_EN = {
  'Đã chỉ đạo': 'da_chi_dao',
  'Chờ phân công': 'da_chi_dao',
  'Đang xử lý': 'dang_xu_ly',
  'Đã có báo cáo': 'da_co_bao_cao',
  'Hoàn thành': 'hoan_thanh',
  'Bị từ chối': 'bi_tu_choi'
};

directives = directives.map(function (d) {
  const normalizedAttachments = Array.isArray(d.attachments)
    ? d.attachments.map(att => typeof att === 'string' ? { name: att, source: 'leader' } : att)
    : [];
  const base = Object.assign({
    metricIds: d.metricId ? [d.metricId] : [],
    agency: AGENCIES[0],
    director: DIRECTORS[0],
    creator: d.director || DIRECTORS[0],
    reportDueDate: '',
    history: []
  }, d, { attachments: normalizedAttachments });

  base.indicatorKeys = base.metricIds;
  base.title = base.content || '';
  base.statusEnum = STATUS_MAP_EN[base.status] || 'da_chi_dao';

  return base;
});

function saveDirectives() {
  const STATUS_MAP_EN = {
    'Đã chỉ đạo': 'da_chi_dao',
    'Chờ phân công': 'da_chi_dao',
    'Đang xử lý': 'dang_xu_ly',
    'Đã có báo cáo': 'da_co_bao_cao',
    'Hoàn thành': 'hoan_thanh',
    'Bị từ chối': 'bi_tu_choi'
  };
  directives.forEach(d => {
    d.indicatorKeys = d.metricIds && d.metricIds.length ? d.metricIds : (d.metricId ? [d.metricId] : []);
    d.title = d.content || '';
    d.statusEnum = STATUS_MAP_EN[d.status] || 'da_chi_dao';
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(directives));
}

// Selector lấy danh sách chỉ đạo active của chỉ số đó
function getActiveDirectivesByIndicator(indicatorKey) {
  const STATUS_MAP_EN = {
    'Đã chỉ đạo': 'da_chi_dao',
    'Chờ phân công': 'da_chi_dao',
    'Đang xử lý': 'dang_xu_ly',
    'Đã có báo cáo': 'da_co_bao_cao',
    'Hoàn thành': 'hoan_thanh',
    'Bị từ chối': 'bi_tu_choi'
  };

  return directives.filter(d => {
    const keys = d.metricIds && d.metricIds.length ? d.metricIds : (d.metricId ? [d.metricId] : []);
    const isActive = d.status !== 'Hoàn thành' && d.status !== 'Bị từ chối';
    return keys.includes(indicatorKey) && isActive;
  }).map(d => {
    return Object.assign({}, d, {
      indicatorKeys: d.metricIds && d.metricIds.length ? d.metricIds : (d.metricId ? [d.metricId] : []),
      title: d.content || '',
      statusEnum: STATUS_MAP_EN[d.status] || 'da_chi_dao'
    });
  });
}
window.getActiveDirectivesByIndicator = getActiveDirectivesByIndicator;


// Helper: Lấy/sinh lịch sử trạng thái đầy đủ các cột mới cho chỉ đạo
function getDirectiveHistory(dir) {
  if (!dir) return [];

  const history = [];
  const creator = dir.creator || dir.director || 'Chủ tịch UBND Tỉnh';
  const createdAt = dir.createdAt || 'N/A';
  const agency = dir.agency || 'Cơ quan tiếp nhận';
  const agencyRep = 'Đại diện ' + agency;
  const content1st = dir.content ? (dir.content.length > 60 ? dir.content.substring(0, 60) + '...' : dir.content) : '';

  const leaderFiles = (dir.attachments || []).filter(f => f.source === 'leader' || !f.source).map(f => f.name).join(', ') || '-';
  const agencyFiles = (dir.attachments || []).filter(f => f.source === 'agency').map(f => f.name).join(', ') || '-';

  // ----- Bước 1: Đã chỉ đạo -----
  history.push({
    status: 'Đã chỉ đạo',
    agency: agency,
    createdAt: createdAt,
    overdue: 'Đúng hạn',
    approver: '-',
    approvalDate: '-',
    agencyNote: '-',
    agencyAttach: '-',
    leaderNote: 'Khởi tạo chỉ đạo: ' + content1st,
    leaderAttach: leaderFiles
  });

  // ----- Bước 2: Đang xử lý -----
  const hasProcessing = ['Đang xử lý', 'Đã có báo cáo', 'Hoàn thành', 'Bị từ chối'].includes(dir.status);
  if (hasProcessing) {
    const rptDate = dir.reportDueDate || dir.dueDate || createdAt;
    history.push({
      status: 'Đang xử lý',
      agency: agency,
      createdAt: rptDate,
      overdue: 'Đúng hạn',
      approver: '-',
      approvalDate: '-',
      agencyNote: 'Đơn vị đã tiếp nhận và đang tiến hành xử lý.',
      agencyAttach: '-',
      leaderNote: '-',
      leaderAttach: '-'
    });
  }

  // ----- Bước 3: Đã có báo cáo / Bị từ chối -----
  const hasReport = ['Đã có báo cáo', 'Hoàn thành', 'Bị từ chối'].includes(dir.status);
  if (hasReport) {
    const rptDate = dir.reportDueDate || dir.dueDate || createdAt;
    const isRejected = dir.status === 'Bị từ chối';

    // Kiểm tra trễ hạn
    let overdueStr = 'Đúng hạn';
    if (dir.dueDate) {
      const dDue = parseDMY(dir.dueDate);
      const d2 = parseDMY(rptDate);
      if (dDue && d2 && d2 > dDue) {
        const late = Math.round((d2 - dDue) / 86400000);
        overdueStr = 'Trễ ' + late + ' ngày';
      }
    }

    history.push({
      status: isRejected ? 'Bị từ chối' : 'Đã có báo cáo',
      agency: agency,
      createdAt: rptDate,
      overdue: overdueStr,
      approver: isRejected ? creator : '-',
      approvalDate: isRejected ? rptDate : '-',
      agencyNote: dir.report || 'Đã nộp báo cáo kết quả thực hiện.',
      agencyAttach: agencyFiles,
      leaderNote: isRejected ? (dir.report || 'Lãnh đạo từ chối báo cáo. Yêu cầu đơn vị báo cáo lại.') : '-',
      leaderAttach: '-'
    });
  }

  // ----- Bước 4: Đã phê duyệt / Hoàn thành -----
  if (dir.status === 'Hoàn thành') {
    const aprDate = dir.reportDueDate || dir.dueDate || createdAt;
    history.push({
      status: 'Hoàn thành',
      agency: agency,
      createdAt: aprDate,
      overdue: 'Đúng hạn',
      approver: creator,
      approvalDate: aprDate,
      agencyNote: '-',
      agencyAttach: '-',
      leaderNote: 'Lãnh đạo đã phê duyệt kết quả và đóng chỉ đạo.',
      leaderAttach: '-'
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

