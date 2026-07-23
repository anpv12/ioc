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
const DATA_VERSION = 'gialai_directives_v10';

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
if (currentVersion !== DATA_VERSION || !Array.isArray(directives) || directives.length !== 20) {
  directives = [];
  localStorage.setItem('gialai_directives_version', DATA_VERSION);
  localStorage.removeItem(STORAGE_KEY);
}

// Seed mock data (20 chỉ đạo được thiết kế chuẩn các trường hợp)
if (directives.length !== 20) {
  const seedConfigs = [
    // 1 & 2: metric-tong-nhan-khau (2 active: 1 Đã chỉ đạo, 1 Đang xử lý -> TH1 Đỏ, 2 khoanh tròn)
    { metricId: 'metric-tong-nhan-khau', status: 'Đã chỉ đạo', agency: 'Sở Thông tin và Truyền thông', content: 'Rà soát hạ tầng kết nối dữ liệu dân cư trên toàn tỉnh.', dueDate: 5 },
    { metricId: 'metric-tong-nhan-khau', status: 'Đang xử lý', agency: 'Cục Thống kê Gia Lai', content: 'Đối chiếu số liệu nhân khẩu thực tế giữa các huyện.', dueDate: 7, report: 'Đã thu thập dữ liệu 8/17 huyện.' },

    // 3: metric-dien-tich (1 active: Đã chỉ đạo -> TH1 Đỏ, 1 icon cảnh báo)
    { metricId: 'metric-dien-tich', status: 'Đã chỉ đạo', agency: 'Sở Tài nguyên và Môi trường', content: 'Cập nhật biến động diện tích đất ở sau điều chỉnh ranh giới hành chính.', dueDate: 3 },

    // 4 & 5: metric-mat-do (2 active: 1 Đang xử lý, 1 Đã có báo cáo -> TH2 Cam, 2 khoanh tròn)
    { metricId: 'metric-mat-do', status: 'Đang xử lý', agency: 'UBND Huyện Pleiku', content: 'Kiểm tra biến động mật độ dân số khu vực nội thành Pleiku.', dueDate: 4, report: 'Đang tổng hợp báo cáo biến động dân số các phường.' },
    { metricId: 'metric-mat-do', status: 'Đã có báo cáo', agency: 'Sở Xây dựng', content: 'Đánh giá quy hoạch phân bố dân cư theo mật độ xây dựng.', dueDate: 2, report: 'Đã hoàn tất dự thảo báo cáo quy hoạch phân bố mật độ.' },

    // 6: metric-tre-em (1 active: Đang xử lý -> TH2 Cam, 1 icon đồng hồ)
    { metricId: 'metric-tre-em', status: 'Đang xử lý', agency: 'Sở Lao động - Thương binh và Xã hội', content: 'Lập danh sách trẻ em từ 0-14 tuổi thuộc hộ nghèo để hỗ trợ BHYT.', dueDate: 6, report: 'Đã nhận danh sách từ 12 xã vùng sâu.' },

    // 7 & 8: metric-lao-dong (1 Hoàn thành, 1 Bị từ chối -> Ribbon ẨN)
    { metricId: 'metric-lao-dong', status: 'Hoàn thành', agency: 'Sở Lao động - Thương binh và Xã hội', content: 'Thống kê tỷ lệ người lao động trong độ tuổi có việc làm.', dueDate: -2, report: 'Đã hoàn thành báo cáo thống kê lao động quý II.' },
    { metricId: 'metric-lao-dong', status: 'Bị từ chối', agency: 'Sở Kế hoạch và Đầu tư', content: 'Đánh giá ảnh hưởng chuyển dịch lao động tới thu hút đầu tư.', dueDate: -1, report: 'Báo cáo kết quả chưa đầy đủ số liệu theo yêu cầu (Yêu cầu đơn vị tiếp nhận báo cáo lại).' },

    // 9, 10, 11: metric-nguoi-lon-tuoi (3 active: 2 Đã chỉ đạo, 1 Đang xử lý -> TH1 Đỏ, 3 khoanh tròn)
    { metricId: 'metric-nguoi-lon-tuoi', status: 'Đã chỉ đạo', agency: 'Sở Y tế', content: 'Triển khai khám sức khỏe định kỳ cho người cao tuổi trên 65t.', dueDate: 8 },
    { metricId: 'metric-nguoi-lon-tuoi', status: 'Chờ phân công', agency: 'Sở Nội vụ', content: 'Rà soát chính sách bảo trợ xã hội cho người cao tuổi cô đơn.', dueDate: 10 },
    { metricId: 'metric-nguoi-lon-tuoi', status: 'Đang xử lý', agency: 'Công an Tỉnh Gia Lai', content: 'Cấp CCCD và tài khoản VNeID mức 2 cho người cao tuổi tại nhà.', dueDate: 5, report: 'Đã tổ chức 15 tổ lưu động cấp CCCD tại nhà.' },

    // 12: metric-chart-high (1 active: Đã chỉ đạo -> TH1 Đỏ)
    { metricId: 'metric-chart-high', status: 'Đã chỉ đạo', agency: 'UBND Huyện Ia Grai', content: 'Báo cáo nguyên nhân nhân khẩu tăng cao tại các xã biên giới.', dueDate: 4 },

    // 13: metric-chart-low (1 active: Đã có báo cáo -> TH2 Cam)
    { metricId: 'metric-chart-low', status: 'Đã có báo cáo', agency: 'UBND Huyện Chư Sê', content: 'Rà soát tình hình di dân tự do tại các xã có nhân khẩu thấp nhất.', dueDate: 1, report: 'Đã rà soát 5 xã có tỷ lệ di dân cao, nộp báo cáo chi tiết.' },

    // 14: metric-map (1 active: Chờ phân công -> TH1 Đỏ)
    { metricId: 'metric-map', status: 'Chờ phân công', agency: 'Sở Tư pháp', content: 'Chuẩn hóa dữ liệu địa danh hành chính trên bản đồ dân cư số.', dueDate: 12 },

    // 15 - 20: Các chỉ đạo khác để làm phong phú danh sách
    { metricId: 'metric-tong-nhan-khau', status: 'Hoàn thành', agency: 'Công an Tỉnh Gia Lai', content: 'Tăng cường công tác đăng ký quản lý cư trú đợt cao điểm.', dueDate: -5, report: 'Hoàn thành 100% chỉ tiêu cao điểm cư trú.' },
    { metricId: 'metric-dien-tich', status: 'Đang xử lý', agency: 'Sở Giáo dục và Đào tạo', content: 'Rà soát mạng lưới trường lớp theo diện tích quy hoạch mới.', dueDate: 9, report: 'Đang lấy ý kiến các phòng GD&ĐT huyện.' },
    { metricId: 'metric-tre-em', status: 'Đã chỉ đạo', agency: 'Sở Y tế', content: 'Triển khai chiến dịch tiêm chủng mở rộng cho trẻ em 0-5t.', dueDate: 3 },
    { metricId: 'metric-lao-dong', status: 'Đang xử lý', agency: 'UBND Huyện Đăk Đoa', content: 'Đào tạo nghề cho lao động nông thôn chuyển đổi sản xuất.', dueDate: 14, report: 'Đã mở 3 lớp đào tạo nghề đợt 1.' },
    { metricId: 'metric-chart-high', status: 'Đã có báo cáo', agency: 'Cục Thống kê Gia Lai', content: 'Phân tích cơ cấu dân số theo nhóm xã có nhân khẩu cao.', dueDate: 2, report: 'Đã nộp báo cáo phân tích cơ cấu dân số.' },
    { metricId: 'metric-map', status: 'Đã chỉ đạo', agency: 'Sở Thông tin và Truyền thông', content: 'Tích hợp lớp dữ liệu GIS dân cư lên hệ thống IOC tỉnh.', dueDate: 15 }
  ];

  directives = seedConfigs.map((cfg, idx) => {
    const dueDateStr = formatDateDMY(new Date(Date.now() + cfg.dueDate * 86400000));
    const createOff = Math.floor(Math.random() * 10) + 1;
    const createdAtStr = formatDateDMY(new Date(Date.now() - createOff * 86400000)) + ' 08:30';

    const attachments = [];
    if (idx % 2 === 0) {
      attachments.push({ name: 'Van_ban_chi_dao_' + (idx + 1) + '.pdf', source: 'leader' });
    }
    if (cfg.status === 'Đã có báo cáo' || cfg.status === 'Hoàn thành') {
      attachments.push({ name: 'Bao_cao_don_vi_' + (idx + 1) + '.docx', source: 'agency' });
    }

    return {
      id: 'dir_seed_' + (idx + 1),
      metricId: cfg.metricId,
      metricIds: [cfg.metricId],
      agency: cfg.agency,
      director: DIRECTORS[idx % DIRECTORS.length],
      creator: DIRECTORS[idx % DIRECTORS.length],
      attachments,
      content: cfg.content,
      dueDate: dueDateStr,
      reportDueDate: cfg.report ? formatDateDMY(new Date(Date.now() + 2 * 86400000)) : '',
      status: cfg.status,
      report: cfg.report || '',
      createdAt: createdAtStr,
      history: []
    };
  });

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


// Helper: Lấy/sinh lịch sử trạng thái 8 cột chuẩn cho chỉ đạo
function getDirectiveHistory(dir) {
  if (!dir) return [];

  const history = [];
  const creator = dir.creator || dir.director || 'Chủ tịch UBND Tỉnh';
  const createdAt = dir.createdAt || 'N/A';
  const agency = dir.agency || 'Cơ quan tiếp nhận';
  
  const leaderAttach = (dir.attachments || []).filter(f => f.source === 'leader' || !f.source).map(f => f.name);
  const agencyAttach = (dir.attachments || []).filter(f => f.source === 'agency').map(f => f.name);

  // ----- Bước 1: Đã chỉ đạo -----
  history.push({
    agency: agency,
    createdAt: createdAt,
    status: 'Đã chỉ đạo',
    overdue: 'Đúng hạn (0 ngày)',
    approver: '-',
    approvalDate: '-',
    agencyNote: '-',
    agencyFiles: [],
    leaderNote: dir.content || 'Khởi tạo và ban hành chỉ đạo.',
    leaderFiles: leaderAttach
  });

  // ----- Bước 2: Đang xử lý -----
  const hasProcessing = ['Đang xử lý', 'Đã có báo cáo', 'Hoàn thành', 'Bị từ chối'].includes(dir.status);
  if (hasProcessing) {
    const rptDate = dir.reportDueDate || dir.dueDate || createdAt;
    history.push({
      agency: agency,
      createdAt: rptDate,
      status: 'Đang xử lý',
      overdue: 'Đúng hạn',
      approver: '-',
      approvalDate: '-',
      agencyNote: 'Đơn vị đã tiếp nhận và đang tiến hành xử lý.',
      agencyFiles: [],
      leaderNote: '-',
      leaderFiles: []
    });
  }

  // ----- Bước 3: Đã có báo cáo / Bị từ chối -----
  const hasReport = ['Đã có báo cáo', 'Hoàn thành', 'Bị từ chối'].includes(dir.status);
  if (hasReport) {
    const rptDate = dir.reportDueDate || dir.dueDate || createdAt;
    const isRejected = dir.status === 'Bị từ chối';

    // Tính trễ hạn
    let overdueStr = 'Đúng hạn';
    if (dir.dueDate) {
      const dDue = parseDMY(dir.dueDate); const d2 = parseDMY(rptDate);
      if (dDue && d2 && d2 > dDue) {
        const late = Math.round((d2 - dDue) / 86400000);
        overdueStr = 'Trễ ' + late + ' ngày';
      }
    }

    history.push({
      agency: agency,
      createdAt: rptDate,
      status: isRejected ? 'Bị từ chối' : 'Đã có báo cáo',
      overdue: overdueStr,
      approver: isRejected ? creator : '-',
      approvalDate: isRejected ? rptDate : '-',
      agencyNote: dir.report || (isRejected ? 'Báo cáo kết quả chưa đạt yêu cầu.' : 'Đã nộp báo cáo kết quả thực hiện.'),
      agencyFiles: agencyAttach,
      leaderNote: isRejected ? (dir.report || 'Lãnh đạo từ chối báo cáo. Yêu cầu đơn vị báo cáo lại.') : '-',
      leaderFiles: isRejected ? leaderAttach : []
    });
  }

  // ----- Bước 4: Đã phê duyệt / Hoàn thành -----
  if (dir.status === 'Hoàn thành') {
    const aprDate = dir.reportDueDate || dir.dueDate || createdAt;
    history.push({
      agency: agency,
      createdAt: aprDate,
      status: 'Hoàn thành',
      overdue: 'Đúng hạn',
      approver: creator,
      approvalDate: aprDate,
      agencyNote: '-',
      agencyFiles: [],
      leaderNote: 'Lãnh đạo đã phê duyệt kết quả và đóng chỉ đạo.',
      leaderFiles: []
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
