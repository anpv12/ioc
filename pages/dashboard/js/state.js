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
const DATA_VERSION = 'gialai_directives_v31';

// Helper: format Date to dd/mm/yyyy
function formatDateDMY(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
}

// Helper: Giả lập 105 đơn vị toàn tỉnh (cho trường hợp cá biệt)
function generate105Agencies(dueStr, forcedStatus) {
  const baseAgencies = [
    'Sở Nội vụ', 'Sở TT&TT', 'Sở Tư pháp', 'Sở LĐ-TB&XH', 'Sở Y tế', 'Sở GD&ĐT', 'Sở KH&ĐT', 'Sở Tài chính',
    'UBND TP Pleiku', 'UBND TX An Khê', 'UBND TX Ayun Pa', 'UBND Huyện Chư Păh', 'UBND Huyện Chư Prông', 'UBND Huyện Chư Sê', 'UBND Huyện Đăk Đoa'
  ];
  const statuses = ['Chờ phân công', 'Đang xử lý', 'Đã có báo cáo', 'Chờ phê duyệt', 'Kết thúc', 'Bị từ chối'];
  const list = [];
  for (let i = 1; i <= 105; i++) {
    const baseName = baseAgencies[(i - 1) % baseAgencies.length];
    const name = i <= baseAgencies.length ? baseName : `${baseName} (Đơn vị cơ sở ${Math.floor(i / baseAgencies.length) + 1})`;
    const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
    const middleNames = ['Văn', 'Thị', 'Hữu', 'Đức', 'Hoài', 'Thanh', 'Minh', 'Ngọc', 'Quang', 'Xuân', 'Đình', 'Hải', 'Thành', 'Thu'];
    const lastNames = ['An', 'Bình', 'Châu', 'Dũng', 'Giang', 'Hùng', 'Hương', 'Khánh', 'Linh', 'Minh', 'Nga', 'Phong', 'Quân', 'Sơn', 'Trang', 'Tuấn', 'Hải', 'Yến'];
    
    const randomName = firstNames[(i * 3) % firstNames.length] + ' ' + 
                       middleNames[(i * 5) % middleNames.length] + ' ' + 
                       lastNames[(i * 7) % lastNames.length];

    // forcedStatus: gán cùng một trạng thái cho toàn bộ đơn vị (mô phỏng case đồng loạt)
    const status = forcedStatus || statuses[i % statuses.length];
    const hasReport = forcedStatus ? ['Đã có báo cáo', 'Chờ phê duyệt', 'Kết thúc', 'Bị từ chối'].includes(status)
                                   : (i % 4 === 2 || i % 4 === 3);

    list.push({
      name: name,
      pic: randomName,
      dueDate: dueStr,
      status: status,
      report: hasReport ? 'Đã hoàn thành nội dung báo cáo theo yêu cầu của Lãnh đạo UBND tỉnh. Số liệu đính kèm bên dưới.' : '',
      attachments: hasReport ? [
        { name: 'Bao_cao_chi_tiet_' + i + '.pdf', source: 'agency' }, 
        { name: 'Phu_luc_so_lieu.xlsx', source: 'agency' },
        { name: 'Hinh_anh_minh_chung.png', source: 'agency' },
        { name: 'Danh_sach_don_vi.docx', source: 'agency' }
      ] : []
    });
  }
  return list;
}

// Helper: Tạo danh sách đơn vị từ AGENCIES thật
function generateRealAgencies(dueStr, forcedStatus) {
  const statuses = ['Chờ phân công', 'Đang xử lý', 'Đã có báo cáo', 'Chờ phê duyệt', 'Kết thúc', 'Bị từ chối'];
  return AGENCIES.map((name, i) => {
    const status = forcedStatus || statuses[i % statuses.length];
    const hasReport = ['Đã có báo cáo', 'Chờ phê duyệt', 'Kết thúc', 'Bị từ chối'].includes(status);
    return {
      name: name,
      pic: `Phụ trách ${name}`,
      dueDate: dueStr,
      status: status,
      report: hasReport ? 'Đã rà soát và gửi báo cáo theo quy định.' : ''
    };
  });
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
if (currentVersion !== DATA_VERSION || !Array.isArray(directives) || directives.length > 25) {
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
    // --- Giả lập Chỉ đạo Toàn tỉnh (105 đơn vị) ---
    // --- Metric Tổng nhân khẩu: Chờ phân công ---
    {
      id: 'dir_mock_1',
      title: 'Rà soát dữ liệu hộ khẩu khu vực Pleiku',
      layoutGroup: 'du-lieu-khac',
      dataPageIds: ['dlk-1'],
      dataPageNames: ['Trang Phân bố Dân cư theo Giới tính'],
      dataSourceUrls: [{ name: 'Trang Phân bố Dân cư theo Giới tính', url: 'https://gialai.gov.vn/giam-sat/dan-cu/gioi-tinh' }],
      metricIds: ['metric-tong-nhan-khau'],
      metricId: 'metric-tong-nhan-khau',
      agency: 'Công an Tỉnh Gia Lai',
      agencies: [{name: 'Công an Tỉnh Gia Lai', pic: 'Nguyễn Văn A', dueDate: dueSoon, status: 'Chờ phân công', report: ''}, {name: 'Sở Y tế', pic: 'Trần Thị B', dueDate: dueSoon, status: 'Đang xử lý', report: ''}, {name: 'UBND TP Pleiku', pic: 'Lê Văn C', dueDate: dueSoon, status: 'Kết thúc', report: 'Đã hoàn thành rà soát.'}],
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Rà soát dữ liệu hộ khẩu và cập nhật biến động nhân khẩu khu vực thành phố Pleiku.',
      dueDate: dueSoon,
      reportDueDate: '',
      attachments: [
        { name: 'Kế_hoạch_rà_soát_C06.png', source: 'leader' },
        { name: 'Screenshot_Trang_Phan_bo_Dan_cu_theo_Gioi_tinh.png', source: 'leader', isScreenshot: true }
      ],
      status: 'Chờ phân công',
      report: '',
      createdAt: todayStr
    },
    {
      id: 'dir_mock_province_105',
      title: 'Tổng kiểm tra chuẩn hóa dữ liệu định danh điện tử toàn tỉnh',
      layoutGroup: 'du-lieu-khac',
      dataPageIds: ['dlk-1'],
      dataPageNames: ['Trang Phân bố Dân cư theo Giới tính'],
      dataSourceUrls: [{ name: 'Trang Phân bố Dân cư theo Giới tính', url: 'https://gialai.gov.vn/giam-sat/dan-cu/gioi-tinh' }],
      metricIds: ['metric-tong-nhan-khau'],
      metricId: 'metric-tong-nhan-khau',
      agency: 'Chỉ đạo toàn tỉnh',
      agencies: generateRealAgencies(dueSoon),
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Tổng kiểm tra, rà soát và chuẩn hóa dữ liệu định danh điện tử VNeID của toàn bộ công dân trên địa bàn tỉnh Gia Lai.',
      dueDate: dueSoon,
      reportDueDate: '',
      attachments: [
        { name: 'Kế_hoạch_rà_soát_C06.pdf', source: 'leader' },
        { name: 'Ke_hoach_trien_khai_chi_tiet_2026.docx', source: 'leader' },
        { name: 'Screenshot_Trang_Phan_bo_Dan_cu_theo_Gioi_tinh.png', source: 'leader', isScreenshot: true }
      ],
      status: 'Đang xử lý',
      report: '',
      createdAt: todayStr
    },
    {
      id: 'dir_mock_2',
      title: 'Kiểm tra hạ tầng mạng kết nối C06',
      layoutGroup: 'dich-vu-cong',
      dataPageIds: ['dvc-1'],
      dataPageNames: ['Trang Tỷ lệ Hồ sơ Đúng hạn & Quá hạn'],
      dataSourceUrls: [{ name: 'Trang Tỷ lệ Hồ sơ Đúng hạn & Quá hạn', url: 'https://gialai.gov.vn/giam-sat/dich-vu-cong/ty-le-ho-so' }],
      metricIds: ['metric-tong-nhan-khau'],
      metricId: 'metric-tong-nhan-khau',
      agency: 'Sở Thông tin và Truyền thông, Sở Kế hoạch và Đầu tư, Sở Nội vụ, Sở Tư pháp',
      agencies: [
        {name: 'Sở Thông tin và Truyền thông', pic: 'Nguyễn Văn D', dueDate: dueOverdue, status: 'Chờ phân công', report: ''}, 
        {name: 'Sở Kế hoạch và Đầu tư', pic: 'Trần Văn E', dueDate: dueOverdue, status: 'Đang xử lý', report: ''},
        {name: 'Sở Nội vụ', pic: 'Lê Văn F', dueDate: dueOverdue, status: 'Chờ phân công', report: ''},
        {name: 'Sở Tư pháp', pic: 'Phạm Văn G', dueDate: dueOverdue, status: 'Đang xử lý', report: ''},
        {name: 'Sở Tài chính', pic: 'Vũ Văn H', dueDate: dueOverdue, status: 'Chờ phân công', report: ''}
      ],
      director: 'Phó Chủ tịch UBND Tỉnh (phụ trách KTXH)',
      creator: 'Phó Chủ tịch UBND Tỉnh (phụ trách KTXH)',
      content: 'Kiểm tra hạ tầng mạng kết nối dữ liệu dân cư quốc gia trên địa bàn tỉnh.',
      dueDate: dueOverdue,
      reportDueDate: '',
      attachments: [
        { name: 'Công_văn_chỉ_đạo_hạ_tầng.jpg', source: 'leader' },
        { name: 'Biên_bản_kiểm_tra_hạ_tầng.png', source: 'leader' }
      ],
      status: 'Chờ phân công',
      report: '',
      createdAt: todayStr
    },
    {
      id: 'dir_mock_3',
      title: 'Tổng hợp số liệu thống kê dân số 2026',
      layoutGroup: 'quan-ly-van-ban',
      dataPageIds: ['vb-3'],
      dataPageNames: ['Trang Theo dõi Chỉ đạo Điều hành'],
      dataSourceUrls: [{ name: 'Trang Theo dõi Chỉ đạo Điều hành', url: 'https://gialai.gov.vn/giam-sat/van-ban/theo-doi-chi-dao' }],
      metricIds: ['metric-tong-nhan-khau'],
      metricId: 'metric-tong-nhan-khau',
      agency: 'Cục Thống kê Gia Lai',
      agencies: [{name: 'Cục Thống kê Gia Lai', pic: 'Nguyễn Văn E', dueDate: dueNormal, status: 'Đã có báo cáo', report: 'Đã gửi file tổng hợp số liệu.'}],
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Tổng hợp số liệu thống kê dân số phục vụ lập quy hoạch phát triển đợt mới.',
      dueDate: dueNormal,
      reportDueDate: dueNormal,
      attachments: [
        { name: 'Đề_đánh_giá_thống_kê.png', source: 'leader' },
        { name: 'Bang_tong_hop_dan_so.png', source: 'agency' }
      ],
      status: 'Đang xử lý',
      report: 'Đơn vị đang tiến hành tổng hợp dữ liệu thu thập từ các huyện cơ sở.',
      createdAt: todayStr
    },

    // --- Metric Diện tích: Chờ phân công ---
    {
      id: 'dir_mock_4',
      title: 'Cập nhật bản đồ địa giới hành chính sáp nhập',
      metricIds: ['metric-dien-tich'],
      metricId: 'metric-dien-tich',
      agency: 'Sở Kế hoạch và Đầu tư',
      director: 'Phó Chủ tịch UBND Tỉnh (phụ trách Nội chính)',
      creator: 'Phó Chủ tịch UBND Tỉnh (phụ trách Nội chính)',
      content: 'Cập nhật bản đồ địa giới hành chính các xã phường sau quy hoạch sáp nhập.',
      dueDate: dueNormal,
      reportDueDate: '',
      attachments: [
        { name: 'Chi_dao_dia_gioi.png', source: 'leader' },
        { name: 'Screenshot_DiaTich_2026.png', source: 'leader', isScreenshot: true }
      ],
      status: 'Chờ phân công',
      report: '',
      createdAt: todayStr
    },

    // --- Metric Mật độ dân số: Đang xử lý + Đã có báo cáo ---
    {
      id: 'dir_mock_5',
      title: 'Báo cáo mật độ dân cư vùng đô thị trọng điểm',
      metricIds: ['metric-mat-do'],
      metricId: 'metric-mat-do',
      agency: 'UBND Huyện Pleiku',
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Báo cáo mật độ dân cư tập trung tại các vùng đô thị trọng điểm.',
      dueDate: dueNormal,
      reportDueDate: dueNormal,
      attachments: [{ name: 'Chi_dao_mat_do.jpg', source: 'leader' }],
      status: 'Đang xử lý',
      report: 'Đang thu thập báo cáo từ các phường xã trực thuộc.',
      createdAt: todayStr
    },
    {
      id: 'dir_mock_6',
      title: 'Khảo sát biến động lực lượng lao động di cư',
      metricIds: ['metric-mat-do'],
      metricId: 'metric-mat-do',
      agency: 'Sở Lao động - Thương binh và Xã hội',
      director: 'Giám đốc Sở KHCN',
      creator: 'Giám đốc Sở KHCN',
      content: 'Khảo sát biến động phân bố lực lượng lao động di cư theo mật độ dân số.',
      dueDate: dueSoon,
      reportDueDate: dueSoon,
      attachments: [
        { name: 'Khảo_sát_lao_động.png', source: 'leader' },
        { name: 'Báo_cáo_kết_quả_bước_1.png', source: 'agency' },
        { name: 'Hinh_anh_thuc_te.jpg', source: 'agency' }
      ],
      status: 'Đã có báo cáo',
      report: 'Đã hoàn tất khảo sát đợt 1 tại 5 khu công nghiệp lớn.',
      createdAt: todayStr
    },

    // --- Metric Trẻ em: Đang xử lý ---
    {
      id: 'dir_mock_7',
      title: 'Lập danh sách trẻ em tiêm chủng đợt 2',
      metricIds: ['metric-tre-em'],
      metricId: 'metric-tre-em',
      agency: 'Chỉ đạo toàn tỉnh (105 đơn vị)',
      agencies: generate105Agencies(dueSoon),
      director: 'Phó Chủ tịch UBND Tỉnh (phụ trách KTXH)',
      creator: 'Phó Chủ tịch UBND Tỉnh (phụ trách KTXH)',
      content: 'Lập danh sách trẻ em trong độ tuổi tiêm chủng đợt 2 năm 2026 trên toàn tỉnh.',
      dueDate: dueSoon,
      reportDueDate: dueSoon,
      attachments: [{ name: 'Ke_hoach_tiem_chung.png', source: 'leader' }],
      status: 'Đang xử lý',
      report: 'Đã có 50 đơn vị bắt đầu triển khai.',
      createdAt: todayStr
    },

    // --- Metric Người lao động: Kết thúc ---
    {
      id: 'dir_mock_8',
      title: 'Tổng hợp giải quyết việc làm Quý 2',
      metricIds: ['metric-lao-dong'],
      metricId: 'metric-lao-dong',
      agency: 'Sở Lao động - Thương binh và Xã hội',
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Tổng hợp tỷ lệ giải quyết việc làm cho người lao động Quý 2.',
      dueDate: todayStr,
      reportDueDate: todayStr,
      attachments: [
        { name: 'Yeu_cau_viec_lam.png', source: 'leader' },
        { name: 'Bao_cao_viec_lam_Q2.png', source: 'agency' }
      ],
      status: 'Kết thúc',
      report: 'Đã hoàn thành phê duyệt kết quả báo cáo giải quyết việc làm Quý 2.',
      createdAt: todayStr
    },

    // --- Metric Người lớn tuổi: Bị từ chối ---
    {
      id: 'dir_mock_9',
      title: 'Khám sức khỏe định kỳ cho người cao tuổi',
      metricIds: ['metric-nguoi-lon-tuoi'],
      metricId: 'metric-nguoi-lon-tuoi',
      agency: 'Sở Y tế',
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Thực hiện đợt khám sức khỏe định kỳ cho người cao tuổi trên 65 tuổi.',
      dueDate: dueSoon,
      reportDueDate: dueSoon,
      attachments: [
        { name: 'Kham_suc_khoe_NCT.png', source: 'leader' },
        { name: 'Bao_cao_kham_suc_khoe_NCT_draft.png', source: 'agency' }
      ],
      status: 'Bị từ chối',
      report: 'Số liệu thống kê chưa đầy đủ các huyện miền núi. Yêu cầu đơn vị rà soát và báo cáo lại chi tiết.',
      createdAt: todayStr
    },

    // --- Metric Bản đồ: Chờ phê duyệt ---
    {
      id: 'dir_mock_10',
      title: 'Phê duyệt bản đồ phân bố dân cư năm 2026',
      metricIds: ['metric-map'],
      metricId: 'metric-map',
      agency: 'Sở Nội vụ',
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Phê duyệt bản đồ phân bố dân cư hành chính năm 2026 trình HĐND tỉnh.',
      dueDate: dueNormal,
      reportDueDate: dueNormal,
      attachments: [
        { name: 'Ban_do_phan_bo_dan_cu_2026.png', source: 'leader' },
        { name: 'Bao_cao_ket_qua_tong_hop.png', source: 'agency' },
        { name: 'Screenshot_BanDo_2026.png', source: 'agency', isScreenshot: true }
      ],
      status: 'Chờ phê duyệt',
      report: 'Đơn vị đã hoàn chỉnh báo cáo và đang chờ lãnh đạo phê duyệt.',
      createdAt: todayStr
    },
    {
      id: 'dir_mock_province_new',
      title: 'Đôn đốc triển khai nhiệm vụ chuyển đổi số toàn diện',
      layoutGroup: 'du-lieu-khac',
      dataPageIds: ['dlk-1'],
      dataPageNames: ['Trang Phân bố Dân cư theo Giới tính'],
      dataSourceUrls: [{ name: 'Trang Phân bố Dân cư theo Giới tính', url: 'https://gialai.gov.vn/giam-sat/dan-cu/gioi-tinh' }],
      metricIds: ['metric-tong-nhan-khau'],
      metricId: 'metric-tong-nhan-khau',
      agency: 'Chỉ đạo toàn tỉnh',
      agencies: generate105Agencies(dueSoon),
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Yêu cầu 105 cơ quan, đơn vị trên toàn tỉnh khẩn trương báo cáo tiến độ triển khai các nền tảng số dùng chung.',
      dueDate: dueSoon,
      reportDueDate: dueSoon,
      attachments: [{ name: 'Ke_hoach_chuyen_doi_so.pdf', source: 'leader' }],
      status: 'Đang xử lý',
      report: '',
      createdAt: todayStr
    },
    // ----- Mô phỏng chỉ đạo NHIỀU ĐƠN VỊ cho 4 trạng thái còn thiếu -----
    {
      id: 'dir_mock_multi_reported',
      title: 'Tổng hợp báo cáo biến động nhân khẩu các sở ngành',
      layoutGroup: 'du-lieu-khac',
      dataPageIds: ['dlk-1'],
      dataPageNames: ['Trang Phân bố Dân cư theo Giới tính'],
      dataSourceUrls: [{ name: 'Trang Phân bố Dân cư theo Giới tính', url: 'https://gialai.gov.vn/giam-sat/dan-cu/gioi-tinh' }],
      metricIds: ['metric-tong-nhan-khau'],
      metricId: 'metric-tong-nhan-khau',
      agency: 'Sở Nội vụ, Sở Y tế, Sở Tư pháp, Sở Tài chính',
      agencies: [
        { name: 'Sở Nội vụ', pic: 'Nguyễn Thanh Bình', dueDate: dueNormal, status: 'Đã có báo cáo', report: 'Đã gửi báo cáo tổng hợp biến động nhân khẩu.' },
        { name: 'Sở Y tế', pic: 'Trần Ngọc Hương', dueDate: dueNormal, status: 'Đã có báo cáo', report: 'Đã gửi báo cáo tổng hợp biến động nhân khẩu.' },
        { name: 'Sở Tư pháp', pic: 'Lê Minh Quân', dueDate: dueNormal, status: 'Đang xử lý', report: '' },
        { name: 'Sở Tài chính', pic: 'Phạm Hải Yến', dueDate: dueNormal, status: 'Chờ phân công', report: '' }
      ],
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Yêu cầu các sở ngành tổng hợp và gửi báo cáo biến động nhân khẩu trong kỳ.',
      dueDate: dueNormal,
      reportDueDate: dueNormal,
      attachments: [{ name: 'De_cuong_bao_cao_nhan_khau.docx', source: 'leader' }],
      status: 'Đã có báo cáo',
      report: '',
      createdAt: todayStr
    },
    {
      id: 'dir_mock_multi_waiting',
      title: 'Rà soát dữ liệu dân cư toàn tỉnh — chờ phê duyệt đồng loạt',
      layoutGroup: 'du-lieu-khac',
      dataPageIds: ['dlk-1'],
      dataPageNames: ['Trang Phân bố Dân cư theo Giới tính'],
      dataSourceUrls: [{ name: 'Trang Phân bố Dân cư theo Giới tính', url: 'https://gialai.gov.vn/giam-sat/dan-cu/gioi-tinh' }],
      metricIds: ['metric-tong-nhan-khau'],
      metricId: 'metric-tong-nhan-khau',
      agency: 'Chỉ đạo toàn tỉnh',
      // Toàn bộ 105 đơn vị đều ở trạng thái Chờ phê duyệt
      agencies: generate105Agencies(dueNormal, 'Chờ phê duyệt'),
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Toàn bộ 105 cơ quan, đơn vị đã hoàn thành báo cáo rà soát dữ liệu dân cư, đang chờ Lãnh đạo phê duyệt.',
      dueDate: dueNormal,
      reportDueDate: dueNormal,
      attachments: [{ name: 'Ke_hoach_ra_soat_du_lieu.pdf', source: 'leader' }],
      status: 'Chờ phê duyệt',
      report: 'Toàn bộ đơn vị đã hoàn chỉnh báo cáo và đang chờ lãnh đạo phê duyệt.',
      createdAt: todayStr
    },
    {
      id: 'dir_mock_multi_rejected',
      title: 'Báo cáo tỷ lệ định danh điện tử các huyện — bị từ chối',
      layoutGroup: 'dich-vu-cong',
      dataPageIds: ['dvc-1'],
      dataPageNames: ['Trang Tỷ lệ Hồ sơ Đúng hạn & Quá hạn'],
      dataSourceUrls: [{ name: 'Trang Tỷ lệ Hồ sơ Đúng hạn & Quá hạn', url: 'https://gialai.gov.vn/giam-sat/dich-vu-cong/ty-le-ho-so' }],
      metricIds: ['metric-mat-do'],
      metricId: 'metric-mat-do',
      agency: 'UBND Huyện Pleiku, UBND Huyện Ia Grai, UBND Huyện Chư Sê',
      agencies: [
        { name: 'UBND Huyện Pleiku', pic: 'Hoàng Đức Sơn', dueDate: dueOverdue, status: 'Bị từ chối', report: 'Lý do từ chối: Số liệu chưa khớp với hệ thống C06.' },
        { name: 'UBND Huyện Ia Grai', pic: 'Huỳnh Thị Trang', dueDate: dueOverdue, status: 'Bị từ chối', report: 'Lý do từ chối: Thiếu phụ lục số liệu chi tiết.' },
        { name: 'UBND Huyện Chư Sê', pic: 'Võ Quang Linh', dueDate: dueOverdue, status: 'Đang xử lý', report: '' }
      ],
      director: 'Phó Chủ tịch UBND Tỉnh (phụ trách Nội chính)',
      creator: 'Phó Chủ tịch UBND Tỉnh (phụ trách Nội chính)',
      content: 'Yêu cầu các huyện báo cáo lại tỷ lệ định danh điện tử sau khi đối chiếu số liệu với C06.',
      dueDate: dueOverdue,
      reportDueDate: dueOverdue,
      attachments: [{ name: 'Cong_van_yeu_cau_bao_cao_lai.pdf', source: 'leader' }],
      status: 'Bị từ chối',
      report: 'Lý do từ chối: Số liệu chưa khớp với hệ thống C06. Yêu cầu các đơn vị đối chiếu và báo cáo lại.',
      createdAt: todayStr
    },
    {
      id: 'dir_mock_multi_finished',
      title: 'Cập nhật dữ liệu hộ tịch các sở ngành — đã kết thúc',
      layoutGroup: 'du-lieu-khac',
      dataPageIds: ['dlk-1'],
      dataPageNames: ['Trang Phân bố Dân cư theo Giới tính'],
      dataSourceUrls: [{ name: 'Trang Phân bố Dân cư theo Giới tính', url: 'https://gialai.gov.vn/giam-sat/dan-cu/gioi-tinh' }],
      metricIds: ['metric-tre-em'],
      metricId: 'metric-tre-em',
      agency: 'Sở Tư pháp, Sở Giáo dục và Đào tạo, Cục Thống kê Gia Lai',
      agencies: [
        { name: 'Sở Tư pháp', pic: 'Đặng Hoài An', dueDate: dueNormal, status: 'Kết thúc', report: 'Đã hoàn thành cập nhật dữ liệu hộ tịch.' },
        { name: 'Sở Giáo dục và Đào tạo', pic: 'Bùi Xuân Khánh', dueDate: dueNormal, status: 'Kết thúc', report: 'Đã hoàn thành cập nhật dữ liệu hộ tịch.' },
        { name: 'Cục Thống kê Gia Lai', pic: 'Đỗ Thành Nga', dueDate: dueNormal, status: 'Kết thúc', report: 'Đã hoàn thành cập nhật dữ liệu hộ tịch.' }
      ],
      director: 'Chủ tịch UBND Tỉnh',
      creator: 'Chủ tịch UBND Tỉnh',
      content: 'Cập nhật dữ liệu hộ tịch trẻ em vào hệ thống dữ liệu dân cư quốc gia.',
      dueDate: dueNormal,
      reportDueDate: dueNormal,
      attachments: [{ name: 'Huong_dan_cap_nhat_ho_tich.docx', source: 'leader' }],
      status: 'Kết thúc',
      report: 'Toàn bộ đơn vị đã hoàn thành, Lãnh đạo đã phê duyệt và kết thúc chỉ đạo.',
      createdAt: todayStr
    }
  ].reverse();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(directives));
}

// Migration backward-compat: bổ sung trường mới cho bản ghi cũ thiếu trường
const STATUS_MAP_EN = {
  'Chờ phân công': 'cho_phan_cong',
  'Đang xử lý': 'dang_xu_ly',
  'Đã có báo cáo': 'da_co_bao_cao',
  'Chờ phê duyệt': 'cho_phe_duyet',
  'Kết thúc': 'ket_thuc',
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
  base.title = d.title || d.content || '';
  base.statusEnum = STATUS_MAP_EN[base.status] || 'da_chi_dao';

  return base;
});

saveDirectives();

function saveDirectives() {
  const STATUS_MAP_EN = {
    'Chờ phân công': 'cho_phan_cong',
    'Đang xử lý': 'dang_xu_ly',
    'Đã có báo cáo': 'da_co_bao_cao',
    'Chờ phê duyệt': 'cho_phe_duyet',
    'Kết thúc': 'ket_thuc',
    'Bị từ chối': 'bi_tu_choi'
  };
  directives.forEach(d => {
    d.indicatorKeys = d.metricIds && d.metricIds.length ? d.metricIds : (d.metricId ? [d.metricId] : []);
    d.title = d.title || d.content || '';
    d.statusEnum = STATUS_MAP_EN[d.status] || 'cho_phan_cong';
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(directives));
}

// Selector lấy danh sách chỉ đạo active của chỉ số đó
function getActiveDirectivesByIndicator(indicatorKey) {
  const STATUS_MAP_EN = {
    'Chờ phân công': 'cho_phan_cong',
    'Đang xử lý': 'dang_xu_ly',
    'Đã có báo cáo': 'da_co_bao_cao',
    'Chờ phê duyệt': 'cho_phe_duyet',
    'Kết thúc': 'ket_thuc',
    'Bị từ chối': 'bi_tu_choi'
  };

  return directives.filter(d => {
    const keys = d.metricIds && d.metricIds.length ? d.metricIds : (d.metricId ? [d.metricId] : []);
    const isActive = d.status !== 'Kết thúc';
    return keys.includes(indicatorKey) && isActive;
  }).map(d => {
    return Object.assign({}, d, {
      indicatorKeys: d.metricIds && d.metricIds.length ? d.metricIds : (d.metricId ? [d.metricId] : []),
      title: d.content || '',
      statusEnum: STATUS_MAP_EN[d.status] || 'cho_phan_cong'
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

  const leaderFiles = (dir.attachments || []).filter(f => f.source === 'leader' || !f.source).map(f => f.name).join(', ') || 'Cong_van_chi_dao_102.pdf, Screenshot_P01_GioiTinh.png';
  const agencyFiles = (dir.attachments || []).filter(f => f.source === 'agency').map(f => f.name).join(', ') || 'Bao_cao_ket_qua_thuc_hien.pdf, Anh_minh_hoa_thuc_te.jpg';

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
  const hasProcessing = ['Đang xử lý', 'Đã có báo cáo', 'Chờ phê duyệt', 'Kết thúc', 'Bị từ chối'].includes(dir.status);
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
      agencyAttach: 'Ke_hoach_trien_khai_chi_tiet.docx',
      leaderNote: '-',
      leaderAttach: '-'
    });
  }

  // ----- Bước 3: Đã có báo cáo / Bị từ chối -----
  const hasReport = ['Đã có báo cáo', 'Chờ phê duyệt', 'Kết thúc', 'Bị từ chối'].includes(dir.status);
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
      agencyNote: dir.report || 'Đã nộp báo cáo kết quả thực hiện kèm tài liệu minh chứng.',
      agencyAttach: agencyFiles,
      leaderNote: isRejected ? (dir.report || 'Lãnh đạo từ chối báo cáo. Yêu cầu đơn vị báo cáo lại.') : '-',
      leaderAttach: isRejected ? 'Cong_van_yeu_cau_giai_trinh.pdf' : '-'
    });
  }

  // ----- Bước 4: Chờ phê duyệt -----
  if (dir.status === 'Chờ phê duyệt' || dir.status === 'Kết thúc') {
    const aprDate = dir.reportDueDate || dir.dueDate || createdAt;
    history.push({
      status: 'Chờ phê duyệt',
      agency: agency,
      createdAt: aprDate,
      overdue: 'Đúng hạn',
      approver: '-',
      approvalDate: '-',
      agencyNote: '-',
      agencyAttach: '-',
      leaderNote: 'Đang chờ lãnh đạo phê duyệt kết quả.',
      leaderAttach: '-'
    });
  }

  // ----- Bước 5: Kết thúc -----
  if (dir.status === 'Kết thúc') {
    const aprDate = dir.reportDueDate || dir.dueDate || createdAt;
    history.push({
      status: 'Kết thúc',
      agency: agency,
      createdAt: aprDate,
      overdue: 'Đúng hạn',
      approver: creator,
      approvalDate: aprDate,
      agencyNote: '-',
      agencyAttach: '-',
      leaderNote: 'Lãnh đạo đã phê duyệt kết quả và kết thúc chỉ đạo.',
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

