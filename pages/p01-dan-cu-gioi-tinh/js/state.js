/**
 * state.js — Quản lý state chỉ đạo (directives)
 * Trang: p01 - Tình hình dân cư theo giới tính
 *
 * Exports (global):
 *   - METRIC_LABELS: object — map metricId → tên hiển thị
 *   - directives: array     — danh sách chỉ đạo (load từ localStorage)
 *   - saveDirectives()      — ghi directives xuống localStorage
 */

const METRIC_LABELS = {
  'metric-tong-nhan-khau':  'Tổng nhân khẩu',
  'metric-dien-tich':        'Diện tích (Km²)',
  'metric-mat-do':           'Mật độ dân số',
  'metric-tre-em':           'Trẻ em (0-14t)',
  'metric-lao-dong':         'Người lao động (15-64t)',
  'metric-nguoi-lon-tuoi':   'Người lớn tuổi (Trên 65t)',
  'metric-chart-high':       'Biểu đồ Top 5 nhân khẩu cao nhất',
  'metric-chart-low':        'Biểu đồ Top 5 nhân khẩu thấp nhất',
  'metric-map':              'Bản đồ phân bố dân cư'
};

const STORAGE_KEY = 'gialai_directives';

// Khởi tạo directives từ localStorage
let directives = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

// Migration: xóa dữ liệu cũ còn dùng trường 'location' thay vì 'metricId'
if (directives.length > 0 && directives[0].location !== undefined) {
  directives = [];
  localStorage.removeItem(STORAGE_KEY);
}

// Seed fake data nếu chưa có
if (directives.length === 0) {
  directives = [
    {
      id: 'dir_1',
      metricId: 'metric-tong-nhan-khau',
      content: 'Yêu cầu rà soát lại số liệu tổng nhân khẩu theo từng độ tuổi và đối chiếu với dữ liệu hộ khẩu thực tế.',
      dueDate: '22/07/2026',
      status: 'Chưa xử lý',
      report: '',
      createdAt: '15/07/2026 09:30'
    },
    {
      id: 'dir_2',
      metricId: 'metric-chart-high',
      content: 'Kiểm tra nguyên nhân biến động dân số tại 5 địa phương có nhân khẩu cao nhất, báo cáo trước 25/07.',
      dueDate: '25/07/2026',
      status: 'Đang xử lý',
      report: 'Chuyên viên đang phối hợp với UBND các phường để rà soát số liệu biến động theo từng hộ.',
      createdAt: '15/07/2026 10:15'
    },
    {
      id: 'dir_3',
      metricId: 'metric-nguoi-lon-tuoi',
      content: 'Hỗ trợ cập nhật cơ sở dữ liệu định danh cho đối tượng người lớn tuổi (trên 65 tuổi).',
      dueDate: '18/07/2026',
      status: 'Đã hoàn thành',
      report: 'Đã hoàn thành cập nhật 100% dữ liệu định danh cho 3.200 cụ trên địa bàn toàn tỉnh.',
      createdAt: '14/07/2026 14:00'
    }
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(directives));
}

function saveDirectives() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(directives));
}
