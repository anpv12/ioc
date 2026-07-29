/**
 * STATE.JS — Báo cáo thống kê chỉ đạo
 * Quản lý trạng thái, dữ liệu mẫu chỉ đạo & cấu hình 20 mẫu (10 Báo cáo + 10 Thống kê)
 */

window.ReportState = {
  // Loại tab hiện tại: 'report' (Mẫu Báo cáo) hoặc 'stat' (Mẫu Thống kê)
  activeTabType: 'report',
  activeTemplateId: 'rep_1',

  // Bộ lọc hiện tại
  filters: {
    period: 'month',
    periodValue: new Date().getMonth() + 1,
    periodYear: new Date().getFullYear(),
    fromDate: '',
    toDate: '',
    units: [],
    dataGroup: 'all',
    assigners: [],
    assignees: [],
    statuses: [], // multi-select array
    isOntime: false,
    isOverdue: false,
    isRevision: false,
    hasFile: false,
    keyword: ''
  },

  // Phân trang
  pagination: {
    currentPage: 1,
    pageSize: 10
  },

  // Đang chọn dòng (IDs)
  selectedRowIds: new Set(),

  // Sắp xếp
  sort: {
    field: null,
    dir: 'asc' // 'asc' | 'desc'
  },

  // 10 MẪU BÁO CÁO CONFIG
  reportTemplates: [
    {
      id: 'rep_1',
      name: '1. Báo cáo tổng hợp lãnh đạo',
      title: 'Báo cáo tổng hợp dành cho lãnh đạo',
      desc: 'Theo dõi bức tranh tổng thể các chỉ đạo, trạng thái và tiến độ quy trình',
      icon: 'fa-solid fa-user-shield',
      columns: [
        { key: 'code', label: 'Mã chỉ đạo', sortable: true },
        { key: 'title', label: 'Nội dung tóm tắt', sortable: true },
        { key: 'unit', label: 'Đơn vị chủ trì', sortable: true },
        { key: 'assigner', label: 'Người giao', sortable: true },
        { key: 'issueDate', label: 'Ngày ban hành', sortable: true },
        { key: 'dueDate', label: 'Hạn xử lý', sortable: true },
        { key: 'status', label: 'Trạng thái quy trình', sortable: true },
        { key: 'onTimeStatus', label: 'Đúng/Quá hạn', sortable: true },
        { key: 'progressStep', label: 'Tiến độ quy trình', sortable: false }
      ]
    },
    {
      id: 'rep_2',
      name: '2. Báo cáo chỉ đạo quá hạn',
      title: 'Danh sách chỉ đạo quá hạn xử lý',
      desc: 'Cảnh báo các chỉ đạo đã vượt mốc thời gian SLA cần đôn đốc khẩn',
      icon: 'fa-solid fa-clock-rotate-left',
      columns: [
        { key: 'code', label: 'Mã chỉ đạo', sortable: true },
        { key: 'title', label: 'Nội dung', sortable: true },
        { key: 'unit', label: 'Đơn vị', sortable: true },
        { key: 'dueDate', label: 'Hạn xử lý', sortable: true },
        { key: 'overdueDays', label: 'Số ngày quá hạn', sortable: true },
        { key: 'assignee', label: 'Người xử lý', sortable: true },
        { key: 'status', label: 'Trạng thái', sortable: true },
        { key: 'note', label: 'Ghi chú', sortable: false }
      ]
    },
    {
      id: 'rep_3',
      name: '3. Báo cáo hiệu suất theo đơn vị',
      title: 'Báo cáo hiệu suất thực hiện theo Đơn vị',
      desc: 'Đánh giá tổng số chỉ đạo giao, tỷ lệ đúng hạn và yêu cầu làm lại của các đơn vị',
      icon: 'fa-solid fa-chart-user',
      isAggregated: true,
      columns: [
        { key: 'unit', label: 'Đơn vị chủ trì', sortable: true },
        { key: 'totalAssigned', label: 'Tổng giao', sortable: true },
        { key: 'completed', label: 'Hoàn thành', sortable: true },
        { key: 'onTimeCount', label: 'Đúng hạn', sortable: true },
        { key: 'overdueCount', label: 'Quá hạn', sortable: true },
        { key: 'completionRate', label: 'Tỷ lệ hoàn thành', sortable: true },
        { key: 'onTimeRate', label: 'Tỷ lệ đúng hạn', sortable: true },
        { key: 'revisionCount', label: 'Yêu cầu làm lại', sortable: true }
      ]
    },
    {
      id: 'rep_4',
      name: '4. Báo cáo đúng hạn / trễ hạn',
      title: 'Chi tiết thời gian thực hiện đúng hạn vs trễ hạn',
      desc: 'So sánh ngày giao, hạn xử lý và ngày hoàn thành thực tế',
      icon: 'fa-solid fa-calendar-check',
      columns: [
        { key: 'code', label: 'Mã chỉ đạo', sortable: true },
        { key: 'title', label: 'Nội dung', sortable: true },
        { key: 'unit', label: 'Đơn vị', sortable: true },
        { key: 'issueDate', label: 'Ngày giao', sortable: true },
        { key: 'dueDate', label: 'Hạn xử lý', sortable: true },
        { key: 'completedDate', label: 'Ngày hoàn thành', sortable: true },
        { key: 'onTimeStatus', label: 'Đúng/Trễ', sortable: true },
        { key: 'diffDays', label: 'Số ngày chênh lệch', sortable: true }
      ]
    },
    {
      id: 'rep_5',
      name: '5. Báo cáo yêu cầu làm lại',
      title: 'Danh sách chỉ đạo bị yêu cầu làm lại',
      desc: 'Thống kê chỉ đạo chưa đạt chất lượng bị trả về chỉnh sửa',
      icon: 'fa-solid fa-rotate-left',
      columns: [
        { key: 'code', label: 'Mã chỉ đạo', sortable: true },
        { key: 'title', label: 'Nội dung', sortable: true },
        { key: 'unit', label: 'Đơn vị', sortable: true },
        { key: 'assignee', label: 'Người xử lý', sortable: true },
        { key: 'revisionTimes', label: 'Số lần làm lại', sortable: true },
        { key: 'revisionReason', label: 'Lý do làm lại', sortable: false },
        { key: 'status', label: 'Trạng thái', sortable: true },
        { key: 'newDueDate', label: 'Hạn mới', sortable: true }
      ]
    },
    {
      id: 'rep_6',
      name: '6. Báo cáo theo nhóm dữ liệu',
      title: 'Báo cáo tình hình xử lý theo Nhóm dữ liệu',
      desc: 'Phân tích chỉ đạo theo các chuyên mục dữ liệu dân cư',
      icon: 'fa-solid fa-layer-group',
      isAggregated: true,
      columns: [
        { key: 'dataGroup', label: 'Nhóm dữ liệu', sortable: true },
        { key: 'totalDirectives', label: 'Tổng chỉ đạo', sortable: true },
        { key: 'processingCount', label: 'Đang xử lý', sortable: true },
        { key: 'completedCount', label: 'Hoàn thành', sortable: true },
        { key: 'overdueCount', label: 'Quá hạn', sortable: true },
        { key: 'completionRate', label: 'Tỷ lệ hoàn thành', sortable: true }
      ]
    },
    {
      id: 'rep_7',
      name: '7. Báo cáo theo người giao',
      title: 'Báo cáo tổng hợp theo Lãnh đạo giao chỉ đạo',
      desc: 'Thống kê khối lượng công việc được giao từ từng lãnh đạo',
      icon: 'fa-solid fa-user-tie',
      isAggregated: true,
      columns: [
        { key: 'assigner', label: 'Người giao chỉ đạo', sortable: true },
        { key: 'totalDirectives', label: 'Tổng chỉ đạo giao', sortable: true },
        { key: 'completedCount', label: 'Đã hoàn thành', sortable: true },
        { key: 'processingCount', label: 'Đang xử lý', sortable: true },
        { key: 'overdueCount', label: 'Quá hạn', sortable: true },
        { key: 'completionRate', label: 'Tỷ lệ hoàn thành', sortable: true }
      ]
    },
    {
      id: 'rep_8',
      name: '8. Báo cáo sắp đến hạn (3–7 ngày)',
      title: 'Cảnh báo chỉ đạo sắp đến hạn xử lý',
      desc: 'Danh sách công việc còn 3 đến 7 ngày là đến hạn hoàn thành',
      icon: 'fa-solid fa-hourglass-half',
      columns: [
        { key: 'code', label: 'Mã chỉ đạo', sortable: true },
        { key: 'title', label: 'Nội dung', sortable: true },
        { key: 'unit', label: 'Đơn vị', sortable: true },
        { key: 'dueDate', label: 'Hạn xử lý', sortable: true },
        { key: 'remainingDays', label: 'Còn lại (ngày)', sortable: true },
        { key: 'assignee', label: 'Người xử lý', sortable: true },
        { key: 'status', label: 'Trạng thái', sortable: true }
      ]
    },
    {
      id: 'rep_9',
      name: '9. Báo cáo quy trình đang kẹt',
      title: 'Danh sách chỉ đạo đang bị kẹt tại các bước quy trình',
      desc: 'Phát hiện điểm nghẽn quy trình và thời gian dừng quá lâu',
      icon: 'fa-solid fa-triangle-exclamation',
      columns: [
        { key: 'code', label: 'Mã chỉ đạo', sortable: true },
        { key: 'title', label: 'Nội dung chỉ đạo', sortable: true },
        { key: 'currentStep', label: 'Bước quy trình kẹt', sortable: true },
        { key: 'stuckTime', label: 'Thời gian dừng', sortable: true },
        { key: 'stepOwner', label: 'Người phụ trách bước', sortable: true },
        { key: 'unit', label: 'Đơn vị', sortable: true },
        { key: 'dueDate', label: 'Hạn xử lý', sortable: true }
      ]
    },
    {
      id: 'rep_10',
      name: '10. Báo cáo chi tiết đầy đủ để quyết định',
      title: 'Báo cáo chi tiết toàn diện thông tin chỉ đạo',
      desc: 'Báo cáo tổng hợp đầy đủ 14+ trường thông tin phục vụ họp điều hành',
      icon: 'fa-solid fa-table-list',
      columns: [
        { key: 'code', label: 'Mã', sortable: true },
        { key: 'title', label: 'Nội dung đầy đủ', sortable: true },
        { key: 'dataGroup', label: 'Nhóm dữ liệu', sortable: true },
        { key: 'unit', label: 'Đơn vị', sortable: true },
        { key: 'assigner', label: 'Người giao', sortable: true },
        { key: 'assignee', label: 'Người xử lý', sortable: true },
        { key: 'issueDate', label: 'Ngày ban hành', sortable: true },
        { key: 'dueDate', label: 'Hạn', sortable: true },
        { key: 'status', label: 'Trạng thái', sortable: true },
        { key: 'onTimeStatus', label: 'Đúng/Quá hạn', sortable: true },
        { key: 'hasFile', label: 'Có file', sortable: false },
        { key: 'dashboardUrl', label: 'Link Dashboard', sortable: false },
        { key: 'note', label: 'Ghi chú', sortable: false }
      ]
    }
  ],

  // 10 MẪU THỐNG KÊ CONFIG
  statTemplates: [
    {
      id: 'stat_1',
      name: '1. Thống kê tổng hợp theo thời gian',
      title: 'Thống kê tổng hợp biến động theo kỳ thời gian',
      desc: 'Theo dõi tổng tiếp nhận, hoàn thành, đang xử lý và quá hạn qua các kỳ',
      icon: 'fa-solid fa-chart-line',
      isAggregated: true,
      columns: [
        { key: 'period', label: 'Kỳ thống kê', sortable: true },
        { key: 'totalReceived', label: 'Tổng tiếp nhận', sortable: true },
        { key: 'completed', label: 'Hoàn thành', sortable: true },
        { key: 'processing', label: 'Đang xử lý', sortable: true },
        { key: 'overdue', label: 'Quá hạn', sortable: true },
        { key: 'completionRate', label: 'Tỷ lệ hoàn thành (%)', sortable: true }
      ]
    },
    {
      id: 'stat_2',
      name: '2. Thống kê tỷ lệ hoàn thành theo đơn vị',
      title: 'Bảng xếp hạng tỷ lệ hoàn thành theo Đơn vị',
      desc: 'So sánh mức độ hoàn thành nhiệm vụ và xếp hạng thực thi',
      icon: 'fa-solid fa-ranking-star',
      isAggregated: true,
      columns: [
        { key: 'unit', label: 'Đơn vị chủ trì', sortable: true },
        { key: 'total', label: 'Tổng số việc', sortable: true },
        { key: 'completed', label: 'Hoàn thành', sortable: true },
        { key: 'completionRatePct', label: 'Tỷ lệ %', sortable: true },
        { key: 'rank', label: 'Xếp hạng', sortable: true }
      ]
    },
    {
      id: 'stat_3',
      name: '3. Thống kê quá hạn theo đơn vị',
      title: 'Thống kê tình hình trễ hạn theo Đơn vị',
      desc: 'Phân tích số ca quá hạn, tỷ lệ quá hạn và số ngày trễ trung bình',
      icon: 'fa-solid fa-triangle-exclamation',
      isAggregated: true,
      columns: [
        { key: 'unit', label: 'Đơn vị', sortable: true },
        { key: 'overdueCount', label: 'Số quá hạn', sortable: true },
        { key: 'overdueRatePct', label: 'Tỷ lệ quá hạn (%)', sortable: true },
        { key: 'avgOverdueDays', label: 'Số ngày quá hạn TB', sortable: true }
      ]
    },
    {
      id: 'stat_4',
      name: '4. Thống kê theo trạng thái quy trình',
      title: 'Thống kê phân bổ theo trạng thái chỉ đạo',
      desc: 'Đo lường số lượng chỉ đạo tại từng bước và thời gian dừng trung bình',
      icon: 'fa-solid fa-diagram-project',
      isAggregated: true,
      columns: [
        { key: 'stepName', label: 'Bước quy trình', sortable: true },
        { key: 'count', label: 'Số lượng chỉ đạo', sortable: true },
        { key: 'sharePct', label: 'Tỷ lệ %', sortable: true },
        { key: 'avgStuckHours', label: 'Thời gian TB dừng', sortable: true }
      ]
    },
    {
      id: 'stat_5',
      name: '5. Thống kê theo nhóm dữ liệu',
      title: 'Thống kê khối lượng chỉ đạo theo Nhóm dữ liệu',
      desc: 'Phân tích cơ cấu nhiệm vụ theo chuyên môn dữ liệu dân cư',
      icon: 'fa-solid fa-folder-tree',
      isAggregated: true,
      columns: [
        { key: 'dataGroup', label: 'Nhóm dữ liệu', sortable: true },
        { key: 'total', label: 'Tổng số', sortable: true },
        { key: 'completed', label: 'Hoàn thành', sortable: true },
        { key: 'overdue', label: 'Quá hạn', sortable: true },
        { key: 'ratePct', label: 'Tỷ lệ hoàn thành (%)', sortable: true }
      ]
    },
    {
      id: 'stat_6',
      name: '6. Thống kê người xử lý (Top)',
      title: 'Thống kê khối lượng & kết quả xử lý của Chuyên viên',
      desc: 'Top cán bộ thụ lý nhiều chỉ đạo nhất và tỷ lệ hoàn thành',
      icon: 'fa-solid fa-user-gear',
      isAggregated: true,
      columns: [
        { key: 'assignee', label: 'Người xử lý', sortable: true },
        { key: 'assignedCount', label: 'Số được giao', sortable: true },
        { key: 'completed', label: 'Hoàn thành', sortable: true },
        { key: 'onTime', label: 'Đúng hạn', sortable: true },
        { key: 'overdue', label: 'Quá hạn', sortable: true },
        { key: 'ratePct', label: 'Tỷ lệ %', sortable: true }
      ]
    },
    {
      id: 'stat_7',
      name: '7. Thống kê xu hướng 6–12 tháng',
      title: 'Xu hướng chỉ đạo & hoàn thành 6–12 tháng',
      desc: 'So sánh tốc độ xử lý chỉ đạo qua các tháng',
      icon: 'fa-solid fa-chart-column',
      isAggregated: true,
      columns: [
        { key: 'month', label: 'Tháng', sortable: true },
        { key: 'received', label: 'Tiếp nhận', sortable: true },
        { key: 'completed', label: 'Hoàn thành', sortable: true },
        { key: 'ratePct', label: 'Tỷ lệ %', sortable: true },
        { key: 'momGrowth', label: 'So với tháng trước', sortable: true }
      ]
    },
    {
      id: 'stat_8',
      name: '8. Thống kê yêu cầu làm lại',
      title: 'Thống kê tỷ lệ & lý do yêu cầu làm lại',
      desc: 'Phân tích các đơn vị/cá nhân bị trả hồ sơ nhiều nhất',
      icon: 'fa-solid fa-arrow-rotate-left',
      isAggregated: true,
      columns: [
        { key: 'targetOwner', label: 'Đơn vị / Người xử lý', sortable: true },
        { key: 'revisionCount', label: 'Số lần làm lại', sortable: true },
        { key: 'revisionRatePct', label: 'Tỷ lệ %', sortable: true },
        { key: 'topReason', label: 'Lý do phổ biến', sortable: false }
      ]
    },
    {
      id: 'stat_9',
      name: '9. Thống kê đúng hạn vs trễ hạn',
      title: 'Thống kê đối sánh đúng hạn vs trễ hạn theo Kỳ',
      desc: 'Phân tích độ lệch chuẩn thời gian hoàn thành công việc',
      icon: 'fa-solid fa-scale-balanced',
      isAggregated: true,
      columns: [
        { key: 'period', label: 'Kỳ báo cáo', sortable: true },
        { key: 'onTimeCount', label: 'Đúng hạn', sortable: true },
        { key: 'lateCount', label: 'Trễ hạn', sortable: true },
        { key: 'onTimePct', label: 'Tỷ lệ đúng hạn (%)', sortable: true },
        { key: 'avgDiffDays', label: 'Chênh lệch ngày TB', sortable: true }
      ]
    },
    {
      id: 'stat_10',
      name: '10. Thống kê hỗ trợ ra quyết định (Executive)',
      title: 'Chỉ số cảnh báo chiến lược cho Lãnh đạo (Executive Dashboard)',
      desc: 'Các chỉ số trọng yếu, mức độ cảnh báo và đề xuất hành động cho Lãnh đạo tỉnh',
      icon: 'fa-solid fa-lightbulb',
      isAggregated: true,
      columns: [
        { key: 'metricName', label: 'Chỉ số', sortable: true },
        { key: 'valueStr', label: 'Giá trị', sortable: true },
        { key: 'diffPrev', label: 'So với kỳ trước', sortable: true },
        { key: 'alertLevel', label: 'Mức độ cảnh báo', sortable: true },
        { key: 'recommendation', label: 'Đề xuất hành động', sortable: false }
      ]
    }
  ],

  // DỮ LIỆU MẪU MÔ PHỎNG CHI TIẾT (Full 14+ fields)
  mockDirectives: [
    {
      id: 1,
      code: 'CD-2026-001',
      title: 'Kiểm tra biến động nhân khẩu bất thường tại xã Chư Hdrông',
      dataGroup: 'Dân cư theo địa giới',
      unit: 'Sở Thông tin và Truyền thông',
      assigner: 'Chủ tịch UBND Tỉnh',
      assignee: 'Trần Văn Mạnh (Chuyên viên)',
      issueDate: '2026-07-10',
      dueDate: '2026-07-20',
      completedDate: '2026-07-18',
      status: 'Đã kết thúc',
      onTimeStatus: 'Đúng hạn',
      overdueDays: 0,
      remainingDays: 0,
      diffDays: -2,
      revisionTimes: 0,
      revisionReason: 'Không có',
      newDueDate: '2026-07-20',
      progressStep: 'Bước 6: Kết thúc',
      currentStep: 'Kết thúc',
      stuckTime: '0 ngày',
      stepOwner: 'Lãnh đạo Tỉnh',
      hasFile: true,
      fileName: 'BaoCao_BienDong_ChuHdrong.pdf',
      fileUrl: '#',
      dashboardUrl: '/pages/dashboard/index.html?metric=nhan-khau',
      imageUrl: 'https://via.placeholder.com/600x300?text=BieuDoBienDongNhanKhau',
      note: 'Đã xác minh 450 nhân khẩu mới chuyển từ huyện Ia Grai về do quy hoạch khu công nghiệp.',
      data: {
        totalAssigned: 15,
        completed: 12,
        onTimeCount: 11,
        overdueCount: 1,
        completionRate: '80%',
        onTimeRate: '91.6%',
        revisionCount: 1
      }
    },
    {
      id: 2,
      code: 'CD-2026-002',
      title: 'Rà soát danh sách công dân chưa làm CCCD gắn chip đợt 3',
      dataGroup: 'Độ tuổi & Giới tính',
      unit: 'Công an Tỉnh Gia Lai',
      assigner: 'Phó Chủ tịch UBND Tỉnh',
      assignee: 'Lê Thị Thu (Đội trưởng C06)',
      issueDate: '2026-07-12',
      dueDate: '2026-07-22',
      completedDate: '',
      status: 'Đang xử lý',
      onTimeStatus: 'Quá hạn',
      overdueDays: 7,
      remainingDays: -7,
      diffDays: 7,
      revisionTimes: 1,
      revisionReason: 'Báo cáo thiếu số liệu phân bổ theo xã phường miền núi.',
      newDueDate: '2026-07-28',
      progressStep: 'Bước 3: Thực hiện',
      currentStep: 'Thực hiện',
      stuckTime: '5 ngày',
      stepOwner: 'Lê Thị Thu',
      hasFile: true,
      fileName: 'DanhSach_ChuaLamCCCD.xlsx',
      fileUrl: '#',
      dashboardUrl: '/pages/dashboard/index.html?metric=cccd',
      imageUrl: 'https://via.placeholder.com/600x300?text=ThongKeCCCD',
      note: 'Gặp khó khăn trong việc vận động người dân vùng sâu vùng xa đi chụp ảnh.',
      data: {
        totalAssigned: 28,
        completed: 18,
        onTimeCount: 14,
        overdueCount: 4,
        completionRate: '64.3%',
        onTimeRate: '77.7%',
        revisionCount: 2
      }
    },
    {
      id: 3,
      code: 'CD-2026-003',
      title: 'Thống kê biến động mật độ dân số vùng ô nhiễm công nghiệp Pleiku',
      dataGroup: 'Dân cư theo địa giới',
      unit: 'Sở Tài nguyên và Môi trường',
      assigner: 'Chủ tịch UBND Tỉnh',
      assignee: 'Nguyễn Văn Minh (Phó Trưởng phòng)',
      issueDate: '2026-07-15',
      dueDate: '2026-07-30',
      completedDate: '',
      status: 'Đã có báo cáo',
      onTimeStatus: 'Đúng hạn',
      overdueDays: 0,
      remainingDays: 1,
      diffDays: -1,
      revisionTimes: 0,
      revisionReason: '',
      newDueDate: '2026-07-30',
      progressStep: 'Bước 4: Báo cáo',
      currentStep: 'Báo cáo',
      stuckTime: '1 ngày',
      stepOwner: 'Nguyễn Văn Minh',
      hasFile: true,
      fileName: 'BaoCao_MatDo_Pleiku.pdf',
      fileUrl: '#',
      dashboardUrl: '/pages/dashboard/index.html?metric=mat-do',
      imageUrl: '',
      note: 'Đã tổng hợp xong tờ trình trình UBND Tỉnh phê duyệt.',
      data: {
        totalAssigned: 10,
        completed: 9,
        onTimeCount: 9,
        overdueCount: 0,
        completionRate: '90%',
        onTimeRate: '100%',
        revisionCount: 0
      }
    },
    {
      id: 4,
      code: 'CD-2026-004',
      title: 'Phân tích dữ liệu lao động di cư từ ngoài tỉnh về Pleiku quý II',
      dataGroup: 'Lao động & Việc làm',
      unit: 'Sở Lao động - Thương binh và Xã hội',
      assigner: 'Chủ tịch UBND Tỉnh',
      assignee: 'Phạm Thị Mai (Trưởng phòng Việc làm)',
      issueDate: '2026-07-01',
      dueDate: '2026-07-15',
      completedDate: '2026-07-14',
      status: 'Đã kết thúc',
      onTimeStatus: 'Đúng hạn',
      overdueDays: 0,
      remainingDays: 0,
      diffDays: -1,
      revisionTimes: 0,
      revisionReason: '',
      newDueDate: '2026-07-15',
      progressStep: 'Bước 6: Kết thúc',
      currentStep: 'Kết thúc',
      stuckTime: '0 ngày',
      stepOwner: 'Lãnh đạo Tỉnh',
      hasFile: true,
      fileName: 'BaoCao_LaoDong_Q2.docx',
      fileUrl: '#',
      dashboardUrl: '/pages/dashboard/index.html?metric=lao-dong',
      imageUrl: '',
      note: 'Số lượng lao động hồi hương tăng 12% so với cùng kỳ 2025.',
      data: {
        totalAssigned: 20,
        completed: 18,
        onTimeCount: 16,
        overdueCount: 2,
        completionRate: '90%',
        onTimeRate: '88.8%',
        revisionCount: 1
      }
    },
    {
      id: 5,
      code: 'CD-2026-005',
      title: 'Cập nhật biến động số trẻ em dưới 6 tuổi nhập học mầm non đợt 1',
      dataGroup: 'Giáo dục & Độ tuổi',
      unit: 'Sở Giáo dục và Đào tạo',
      assigner: 'Phó Chủ tịch UBND Tỉnh',
      assignee: 'Hoàng Văn Nam (Chuyên viên)',
      issueDate: '2026-07-18',
      dueDate: '2026-08-01',
      completedDate: '',
      status: 'Đang xử lý',
      onTimeStatus: 'Đúng hạn',
      overdueDays: 0,
      remainingDays: 3,
      diffDays: -3,
      revisionTimes: 0,
      revisionReason: '',
      newDueDate: '2026-08-01',
      progressStep: 'Bước 2: Tiếp nhận',
      currentStep: 'Tiếp nhận',
      stuckTime: '2 ngày',
      stepOwner: 'Sở Giáo dục',
      hasFile: false,
      fileName: '',
      fileUrl: '',
      dashboardUrl: '/pages/dashboard/index.html?metric=tre-em',
      imageUrl: '',
      note: 'Đang tập hợp dữ liệu từ 17 phòng GD&ĐT huyện thị.',
      data: {
        totalAssigned: 12,
        completed: 8,
        onTimeCount: 8,
        overdueCount: 0,
        completionRate: '66.6%',
        onTimeRate: '100%',
        revisionCount: 0
      }
    },
    {
      id: 6,
      code: 'CD-2026-006',
      title: 'Kiểm tra tỷ lệ biến động người cao tuổi hưởng chính sách bảo trợ xã hội',
      dataGroup: 'Bảo trợ xã hội',
      unit: 'Sở Y tế',
      assigner: 'Chủ tịch UBND Tỉnh',
      assignee: 'Nguyễn Thị Hoa (Phó Giám đốc Sở)',
      issueDate: '2026-07-05',
      dueDate: '2026-07-15',
      completedDate: '',
      status: 'Chờ phê duyệt',
      onTimeStatus: 'Quá hạn',
      overdueDays: 14,
      remainingDays: -14,
      diffDays: 14,
      revisionTimes: 2,
      revisionReason: 'Chưa đối soát xong số liệu bảo hiểm y tế hộ nghèo.',
      newDueDate: '2026-07-25',
      progressStep: 'Bước 5: Phê duyệt',
      currentStep: 'Phê duyệt',
      stuckTime: '8 ngày',
      stepOwner: 'Chủ tịch UBND Tỉnh',
      hasFile: true,
      fileName: 'BaoCao_NguoiCaoTuoi_BHYT.pdf',
      fileUrl: '#',
      dashboardUrl: '/pages/dashboard/index.html?metric=nguoi-lon-tuoi',
      imageUrl: '',
      note: 'Cần Lãnh đạo tỉnh xem xét ký duyệt quyết định hỗ trợ bổ sung.',
      data: {
        totalAssigned: 14,
        completed: 10,
        onTimeCount: 7,
        overdueCount: 3,
        completionRate: '71.4%',
        onTimeRate: '70%',
        revisionCount: 2
      }
    },
    {
      id: 7,
      code: 'CD-2026-007',
      title: 'Xử lý phản ánh chênh lệch tỷ lệ giới tính sinh đẻ tại huyện Đăk Đoa',
      dataGroup: 'Độ tuổi & Giới tính',
      unit: 'Sở Y tế',
      assigner: 'Phó Chủ tịch UBND Tỉnh',
      assignee: 'Vũ Minh Tuấn (Chuyên viên Dân số)',
      issueDate: '2026-07-20',
      dueDate: '2026-08-05',
      completedDate: '',
      status: 'Chờ phân công',
      onTimeStatus: 'Đúng hạn',
      overdueDays: 0,
      remainingDays: 7,
      diffDays: -7,
      revisionTimes: 0,
      revisionReason: '',
      newDueDate: '2026-08-05',
      progressStep: 'Bước 1: Chờ phân công',
      currentStep: 'Chờ phân công',
      stuckTime: '1 ngày',
      stepOwner: 'Văn phòng UBND Tỉnh',
      hasFile: false,
      fileName: '',
      fileUrl: '',
      dashboardUrl: '/pages/dashboard/index.html?metric=gioi-tinh',
      imageUrl: '',
      note: 'Đề xuất phân công Sở Y tế phối hợp UBND huyện Đăk Đoa thanh tra.',
      data: {
        totalAssigned: 8,
        completed: 4,
        onTimeCount: 4,
        overdueCount: 0,
        completionRate: '50%',
        onTimeRate: '100%',
        revisionCount: 0
      }
    },
    {
      id: 8,
      code: 'CD-2026-008',
      title: 'Tổng hợp số liệu biến động hộ gia đình dân tộc thiểu số tại Chư Sê',
      dataGroup: 'Dân tộc & Tôn giáo',
      unit: 'Ban Dân tộc Tỉnh Gia Lai',
      assigner: 'Chủ tịch UBND Tỉnh',
      assignee: 'Ksor Nét (Phó Trưởng ban)',
      issueDate: '2026-07-08',
      dueDate: '2026-07-25',
      completedDate: '2026-07-24',
      status: 'Đã kết thúc',
      onTimeStatus: 'Đúng hạn',
      overdueDays: 0,
      remainingDays: 0,
      diffDays: -1,
      revisionTimes: 0,
      revisionReason: '',
      newDueDate: '2026-07-25',
      progressStep: 'Bước 6: Kết thúc',
      currentStep: 'Kết thúc',
      stuckTime: '0 ngày',
      stepOwner: 'Lãnh đạo Tỉnh',
      hasFile: true,
      fileName: 'BaoCao_DanToc_ChuSe.pdf',
      fileUrl: '#',
      dashboardUrl: '/pages/dashboard/index.html?metric=dan-toc',
      imageUrl: '',
      note: '100% hộ đồng bào DTTS đã được cập nhật thông tin trên cơ sở dữ liệu quốc gia.',
      data: {
        totalAssigned: 16,
        completed: 15,
        onTimeCount: 15,
        overdueCount: 0,
        completionRate: '93.7%',
        onTimeRate: '100%',
        revisionCount: 0
      }
    }
  ]
};
