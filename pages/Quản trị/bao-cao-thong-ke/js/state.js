/* Nguồn mock chi tiết. Khi nối API, thay mockDirectives nhưng giữ các field aggregate bên dưới. */
(function () {
  const statuses = ['Chờ phân công', 'Đang xử lý', 'Đã có báo cáo', 'Chờ phê duyệt', 'Đã kết thúc'];
  const units = ['Sở Thông tin và Truyền thông', 'Công an Tỉnh Gia Lai', 'Sở Tài nguyên và Môi trường', 'Sở Lao động - Thương binh và Xã hội', 'Sở Giáo dục và Đào tạo', 'Sở Y tế', 'Ban Dân tộc Tỉnh Gia Lai'];
  const groups = ['Dân cư theo địa giới', 'Độ tuổi & Giới tính', 'Lao động & Việc làm', 'Giáo dục & Độ tuổi', 'Bảo trợ xã hội', 'Dân tộc & Tôn giáo'];
  const leaders = ['Chủ tịch UBND Tỉnh', 'Phó Chủ tịch UBND Tỉnh'];
  const assignees = ['Trần Văn Mạnh', 'Lê Thị Thu', 'Nguyễn Văn Minh', 'Phạm Thị Mai', 'Hoàng Văn Nam', 'Nguyễn Thị Hoa'];
  const directives = [];

  [4, 5, 6, 7].forEach((month, monthIndex) => {
    for (let index = 0; index < 10; index += 1) {
      const number = monthIndex * 10 + index + 1;
      const issueDay = String(2 + index * 2).padStart(2, '0');
      const dueDay = String(Math.min(10 + index * 2, 28)).padStart(2, '0');
      const status = statuses[(index + monthIndex) % statuses.length];
      const overdue = index % 4 === 0;
      const monthText = String(month).padStart(2, '0');
      directives.push({
        id: number,
        code: `CD-2026-${String(number).padStart(3, '0')}`,
        title: `Rà soát và tổng hợp dữ liệu chỉ đạo tháng ${monthText}/2026 – hồ sơ ${index + 1}`,
        dataGroup: groups[(index + monthIndex) % groups.length],
        unit: units[(index + monthIndex) % units.length],
        assigner: leaders[index % leaders.length],
        assignee: assignees[(index + monthIndex) % assignees.length],
        issueDate: `2026-${monthText}-${issueDay}`,
        dueDate: `2026-${monthText}-${dueDay}`,
        completedDate: status === 'Đã kết thúc' ? `2026-${monthText}-${dueDay}` : '',
        status,
        onTimeStatus: overdue ? 'Quá hạn' : 'Đúng hạn'
      });
    }
  });

  const now = new Date();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1);
  const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  // Không dùng toISOString: UTC làm ngày hiển thị lệch một ngày tại múi giờ Việt Nam.
  const toIso = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  window.ReportState = {
    mockDirectives: directives,
    viewMode: 'statistics',
    activeTab: 'unit',
    filters: {
      period: 'month',
      periodValue: now.getMonth() + 1,
      periodYear: now.getFullYear(),
      fromDate: toIso(defaultFrom),
      toDate: toIso(defaultTo),
      statuses: [],
      units: [],
      leaders: []
    },
    drillDown: null,
    sort: { key: 'total', direction: 'desc' },
    page: 1,
    pageSize: 10
  };

  window.ReportData = {
    STATUSES: statuses,
    METRICS: ['total', 'on_time_completed', 'overdue_completed', 'on_time_not_completed', 'overdue_not_completed'],
    getUnique(key) {
      return [...new Set(window.ReportState.mockDirectives.map(item => item[key]))].sort((a, b) => a.localeCompare(b, 'vi'));
    },
    getFilteredDirectives(filters) {
      const source = window.ReportState.mockDirectives;
      return source.filter(item => {
        const filterDate = item.issueDate;
        const timeMatch = (!filters.fromDate || (filterDate && filterDate >= filters.fromDate)) && (!filters.toDate || (filterDate && filterDate <= filters.toDate));
        const statusMatch = !filters.statuses.length || filters.statuses.includes(item.status);
        const unitMatch = !filters.units.length || filters.units.includes(item.unit);
        const leaderMatch = !filters.leaders.length || filters.leaders.includes(item.assigner);
        return timeMatch && statusMatch && unitMatch && leaderMatch;
      });
    },
    aggregateStats(rows, groupByKey) {
      const byDimension = new Map();
      rows.forEach(item => {
        const key = item[groupByKey];
        if (!byDimension.has(key)) {
          byDimension.set(key, { dimension: key, total: 0, completed: 0, in_progress: 0, not_processed: 0, on_time: 0, on_time_completed: 0, on_time_not_completed: 0, overdue: 0, overdue_completed: 0, overdue_not_completed: 0 });
        }
        const result = byDimension.get(key);
        result.total += 1;
        if (item.status === 'Đã kết thúc') result.completed += 1;
        else if (item.status === 'Chờ phân công') result.not_processed += 1;
        else result.in_progress += 1;
        if (item.onTimeStatus === 'Đúng hạn') {
          result.on_time += 1;
          if (item.status === 'Đã kết thúc') result.on_time_completed += 1;
          else result.on_time_not_completed += 1;
        } else {
          result.overdue += 1;
          if (item.status === 'Đã kết thúc') result.overdue_completed += 1;
          else result.overdue_not_completed += 1;
        }
      });
      return [...byDimension.values()].sort((a, b) => b.total - a.total || a.dimension.localeCompare(b.dimension, 'vi'));
    }
  };
}());
