/**
 * data.js — Dữ liệu mẫu (Mock Data) cho Dashboard Phân tích Dân cư Gia Lai
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

// Helper: format Date to dd/mm/yyyy
function formatDateDMY(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
}

// Helper: Giả lập 105 đơn vị toàn tỉnh
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
