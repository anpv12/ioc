/* Mock data source. Replace mockDirectives when wiring API; keep aggregate fields. */
(function () {
  'use strict';

  const STATUSES = ['Chờ phân công', 'Đang xử lý', 'Đã có báo cáo', 'Chờ phê duyệt', 'Đã kết thúc'];

  const UNITS = [
    'Sở Thông tin và Truyền thông',
    'Công an Tỉnh Gia Lai',
    'Sở Tài nguyên và Môi trường',
    'Sở Lao động - Thương binh và Xã hội',
    'Sở Giáo dục và Đào tạo',
    'Sở Y tế',
    'Ban Dân tộc Tỉnh Gia Lai',
    'Sở Khoa học và Công nghệ',
    'Sở Kế hoạch và Đầu tư',
    'Sở Tài chính',
    'Sở Nội vụ',
    'Sở Tư pháp',
    'Sở Công Thương',
    'Sở Xây dựng',
    'Sở Giao thông Vận tải',
    'Sở Văn hóa, Thể thao và Du lịch',
    'Sở Nông nghiệp và Phát triển nông thôn',
    'Thanh tra Tỉnh',
    'Văn phòng UBND Tỉnh',
    'Ban Quản lý Khu kinh tế',
    'Chi cục Thủy lợi',
    'Chi cục Trồng trọt và Bảo vệ thực vật',
    'Chi cục Chăn nuôi và Thú y',
    'Chi cục Kiểm lâm',
    'Trung tâm Kiểm soát bệnh tật tỉnh',
    'Trung tâm Y tế thành phố Pleiku',
    'Trung tâm Y tế huyện Chư Păh',
    'Trung tâm Y tế huyện Chư Prông',
    'Đài Phát thanh – Truyền hình Gia Lai',
    'Báo Gia Lai',
    'Hội Liên hiệp Phụ nữ Tỉnh',
    'Đoàn Thanh niên Cộng sản Hồ Chí Minh Tỉnh',
    'Liên đoàn Lao động Tỉnh',
    'Ban Quản lý rừng phòng hộ Bắc Gia Lai',
    'Ban Quản lý rừng phòng hộ Nam Gia Lai',
    'UBND thành phố Pleiku',
    'UBND thị xã An Khê',
    'UBND thị xã Ayun Pa',
    'UBND huyện Chư Păh',
    'UBND huyện Chư Prông',
    'UBND huyện Chư Sê',
    'UBND huyện Đăk Đoa',
    'UBND huyện Đăk Pơ',
    'UBND huyện Đức Cơ',
    'UBND huyện Ia Grai',
    'UBND huyện Ia Pa',
    'UBND huyện KBang',
    'UBND huyện Kông Chro',
    'UBND huyện Krông Pa',
    'UBND huyện Mang Yang',
    'UBND huyện Phú Thiện',
    'UBND huyện Chư Pưh',
    'Phòng Tài chính – Kế hoạch thành phố Pleiku',
    'Phòng Nội vụ thành phố Pleiku',
    'Phòng Giáo dục và Đào tạo thành phố Pleiku',
    'Phòng Y tế thành phố Pleiku',
    'Phòng Kinh tế thành phố Pleiku',
    'Phòng Văn hóa – Thông tin thành phố Pleiku',
    'Phòng Tài nguyên và Môi trường thành phố Pleiku',
    'Phòng Lao động – TBXH thành phố Pleiku',
    'Công an thành phố Pleiku',
    'Ban Quản lý Dự án đầu tư xây dựng thành phố Pleiku',
    'Phòng Tài chính – Kế hoạch thị xã An Khê',
    'Phòng Giáo dục và Đào tạo thị xã An Khê',
    'Công an thị xã An Khê',
    'Phòng Tài chính – Kế hoạch thị xã Ayun Pa',
    'Phòng Giáo dục và Đào tạo thị xã Ayun Pa',
    'Công an thị xã Ayun Pa',
    'Phòng Tài chính – Kế hoạch huyện Chư Păh',
    'Phòng Nông nghiệp và PTNT huyện Chư Păh',
    'Công an huyện Chư Păh',
    'Phòng Tài chính – Kế hoạch huyện Chư Prông',
    'Phòng Nông nghiệp và PTNT huyện Chư Prông',
    'Công an huyện Chư Prông',
    'Phòng Tài chính – Kế hoạch huyện Chư Sê',
    'Phòng Nông nghiệp và PTNT huyện Chư Sê',
    'Công an huyện Chư Sê',
    'Phòng Tài chính – Kế hoạch huyện Đăk Đoa',
    'Phòng Nông nghiệp và PTNT huyện Đăk Đoa',
    'Công an huyện Đăk Đoa',
    'Phòng Tài chính – Kế hoạch huyện Ia Grai',
    'Phòng Nông nghiệp và PTNT huyện Ia Grai',
    'Công an huyện Ia Grai'
  ];

  const DATA_GROUPS = [
    'Dân cư theo địa giới',
    'Độ tuổi & Giới tính',
    'Lao động & Việc làm',
    'Giáo dục & Độ tuổi',
    'Bảo trợ xã hội',
    'Dân tộc & Tôn giáo'
  ];

  const TITLE_TEMPLATES = [
    'Rà soát biến động dân số theo địa bàn — kỳ {month}/{year}',
    'Kiểm tra tiến độ cập nhật dữ liệu C06 — đợt {index}',
    'Báo cáo tỷ lệ đăng ký thường trú / tạm trú — {month}/{year}',
    'Đôn đốc xử lý hồ sơ hộ tịch tồn đọng — nhóm {index}',
    'Tổng hợp số liệu lao động – việc làm theo huyện — kỳ {month}',
    'Giám sát chỉ tiêu bảo trợ xã hội — tháng {month}/{year}',
    'Rà soát danh sách hộ nghèo / cận nghèo — đợt {index}',
    'Báo cáo công tác dân tộc & tôn giáo — kỳ {month}/{year}',
    'Kiểm tra dữ liệu độ tuổi – giới tính trên dashboard — hồ sơ {index}',
    'Chỉ đạo khắc phục sai lệch số liệu dân cư — đơn vị liên quan #{index}',
    'Theo dõi tiến độ số hóa sổ hộ khẩu — giai đoạn {month}',
    'Báo cáo nhanh tình hình di cư trong tỉnh — tuần {index}',
    'Rà soát cấp CCCD gắn chip theo địa bàn — đợt {index}',
    'Đôn đốc báo cáo định kỳ trung tâm điều hành — kỳ {month}/{year}',
    'Tổng hợp phản ánh chỉ số bất thường trên dashboard — mã {index}'
  ];

  const LEADERS = [
    'Chủ tịch UBND Tỉnh',
    'Phó Chủ tịch UBND Tỉnh',
    'Phó Chủ tịch UBND Tỉnh (KTXH)',
    'Phó Chủ tịch UBND Tỉnh (VHXH)'
  ];

  const ASSIGNEES = [
    'Trần Văn Mạnh', 'Lê Thị Thu', 'Nguyễn Văn Minh', 'Phạm Thị Mai',
    'Hoàng Văn Nam', 'Nguyễn Thị Hoa', 'Đặng Văn Hùng', 'Bùi Thị Lan',
    'Võ Minh Tuấn', 'Phan Thị Hương', 'Lý Văn Khoa', 'Trịnh Thị Nga'
  ];

  const SITUATIONS = [
    { key: 'on_time_completed', label: 'Đã xử lý đúng hạn' },
    { key: 'overdue_completed', label: 'Đã xử lý trễ hạn' },
    { key: 'on_time_not_completed', label: 'Đang xử lý còn hạn' },
    { key: 'overdue_not_completed', label: 'Đang xử lý quá hạn' }
  ];

  const METRICS = [
    'total',
    'on_time_completed',
    'overdue_completed',
    'on_time_not_completed',
    'overdue_not_completed'
  ];

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function toIso(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function parseIso(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function daysBetween(fromIso, toIso) {
    const a = parseIso(fromIso);
    const b = parseIso(toIso);
    if (!a || !b) return null;
    return Math.round((b - a) / 86400000);
  }

  /** Số ngày trễ hạn (chỉ đạo ĐÃ hoàn thành nhưng trễ) = Ngày hoàn thành − Hạn xử lý. */
  function getLateDays(item) {
    if (item.status !== 'Đã kết thúc' || item.onTimeStatus !== 'Quá hạn') return null;
    if (!item.completedDate || !item.dueDate) return null;
    const days = daysBetween(item.dueDate, item.completedDate);
    return days != null && days > 0 ? days : null;
  }

  /** Số ngày quá hạn (chỉ đạo CHƯA hoàn thành và đã quá hạn) = Ngày hiện tại − Hạn xử lý. */
  function getOverdueNowDays(item, todayIso) {
    if (item.status === 'Đã kết thúc' || item.onTimeStatus !== 'Quá hạn') return null;
    if (!item.dueDate) return null;
    const days = daysBetween(item.dueDate, todayIso);
    return days != null && days > 0 ? days : null;
  }

  /** Xác định khóa Tình trạng của 1 chỉ đạo (dùng cho cột "Tình trạng"). */
  function getSituationKey(item) {
    if (item.status === 'Đã kết thúc') {
      return item.onTimeStatus === 'Đúng hạn' ? 'on_time_completed' : 'overdue_completed';
    }
    return item.onTimeStatus === 'Đúng hạn' ? 'on_time_not_completed' : 'overdue_not_completed';
  }

  function buildTitle(month, year, index) {
    const tpl = TITLE_TEMPLATES[(index + month) % TITLE_TEMPLATES.length];
    return tpl
      .replace(/\{month\}/g, String(month))
      .replace(/\{year\}/g, String(year))
      .replace(/\{index\}/g, String(index + 1));
  }

  function buildDirectives() {
    const list = [];
    let id = 1;
    const year = 2026;

    // Tháng 8: đảm bảo mỗi đơn vị (80 đơn vị) có tối thiểu 8 chỉ đạo (Tổng nhận).
    // AUG_UNIT_BASE * UNITS.length = số dòng tối thiểu để mọi đơn vị đạt ngưỡng 8;
    // cộng thêm phần dư để có đơn vị vượt mốc, dữ liệu đa dạng hơn.
    const AUG_UNIT_BASE = 8;
    const AUG_COUNT = AUG_UNIT_BASE * UNITS.length + 60;
    // Số chỉ đạo tháng 8 bị cưỡng bức "Quá hạn — chưa xử lý" (hạn xử lý trước hôm nay),
    // rải đều theo cả 4 lãnh đạo (LEADERS[index % 4]) lẫn 40 đơn vị đầu tiên
    // (UNITS[index % 80]) để đảm bảo mọi lãnh đạo và nhiều đơn vị đều có dữ liệu quá hạn.
    const AUG_FORCED_OVERDUE = 40;

    const monthCounts = {
      1: 8, 2: 8, 3: 10, 4: 10, 5: 12, 6: 12,
      7: 50,
      8: AUG_COUNT,
      9: 10, 10: 8, 11: 8, 12: 8
    };

    Object.keys(monthCounts).forEach(monthKey => {
      const month = Number(monthKey);
      const count = monthCounts[month];
      const monthText = pad2(month);
      for (let index = 0; index < count; index += 1) {
        let issueDay = Math.min(1 + (index % 15) * 2, 26);
        let dueDay = Math.min(issueDay + 6 + (index % 4), 28);
        let status = STATUSES[(index + month) % STATUSES.length];

        const isForcedOverdueAug = month === 8 && index < AUG_FORCED_OVERDUE;
        if (isForcedOverdueAug) {
          // Hạn xử lý gấp (ngày 2) — đã trôi qua so với todayIso (ngày 3) — tạo case
          // "Quá hạn — chưa xử lý" thật trong tháng hiện tại. Loại trừ "Đã kết thúc"
          // để chắc chắn rơi đúng nhánh chưa xử lý.
          issueDay = 1;
          dueDay = 2;
          status = STATUSES[index % (STATUSES.length - 1)];
        }

        const dueDate = `${year}-${monthText}-${pad2(dueDay)}`;

        // Đơn vị: tháng 7 và tháng 8 rải đều tuần hoàn theo index % 80 để mọi đơn vị
        // đều nhận đủ số lượng; các tháng khác rải theo công thức chung.
        const unit = (month === 7 || month === 8)
          ? UNITS[index % UNITS.length]
          : UNITS[(index * 3 + month * 5) % UNITS.length];

        // Chỉ đạo ĐÃ kết thúc: xác định đúng/trễ hạn dựa trên completedDate so với dueDate.
        // Chỉ đạo CHƯA kết thúc: chỉ tính là Quá hạn nếu dueDate đã trôi qua so với hôm nay
        // (todayIso) — bắt buộc để cột "Số ngày quá hạn" (dueDate → todayIso) tính ra được.
        const completedLate = index % 3 === 0;
        let completedDate = '';
        let onTimeStatus;
        if (status === 'Đã kết thúc') {
          const completeOffset = completedLate ? dueDay + 2 + (index % 5) : Math.max(issueDay + 1, dueDay - (index % 3));
          const cDay = Math.min(completeOffset, 28);
          completedDate = `${year}-${monthText}-${pad2(cDay)}`;
          onTimeStatus = completedLate ? 'Quá hạn' : 'Đúng hạn';
        } else {
          onTimeStatus = dueDate < todayIso ? 'Quá hạn' : 'Đúng hạn';
        }

        list.push({
          id,
          code: `CD-2026-${String(id).padStart(3, '0')}`,
          title: buildTitle(month, year, index),
          dataGroup: DATA_GROUPS[(index + month) % DATA_GROUPS.length],
          unit,
          assigner: LEADERS[index % LEADERS.length],
          assignee: ASSIGNEES[(index + month) % ASSIGNEES.length],
          issueDate: `${year}-${monthText}-${pad2(issueDay)}`,
          dueDate,
          completedDate,
          status,
          onTimeStatus
        });
        id += 1;
      }
    });
    return list;
  }

  function matchSituation(item, key) {
    if (key === 'on_time_completed') return item.status === 'Đã kết thúc' && item.onTimeStatus === 'Đúng hạn';
    if (key === 'overdue_completed') return item.status === 'Đã kết thúc' && item.onTimeStatus === 'Quá hạn';
    if (key === 'on_time_not_completed') return item.status !== 'Đã kết thúc' && item.onTimeStatus === 'Đúng hạn';
    if (key === 'overdue_not_completed') return item.status !== 'Đã kết thúc' && item.onTimeStatus === 'Quá hạn';
    return true;
  }

  const now = new Date();
  const todayIso = toIso(now);
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1);
  const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  window.ReportState = {
    mockDirectives: buildDirectives(),
    viewMode: 'statistics',
    activeTab: 'unit',
    filters: {
      fromDate: toIso(defaultFrom),
      toDate: toIso(defaultTo),
      statuses: [],
      units: [],
      leaders: [],
      assignees: [],
      situations: []
    },
    drillDown: null,
    page: 1,
    pageSize: 10
  };

  window.ReportData = {
    ALL_UNITS: UNITS,
    STATUSES,
    SITUATIONS,
    METRICS,
    todayIso,
    daysBetween,
    getLateDays,
    getOverdueNowDays,
    getSituationKey,

    getUnique(key) {
      if (key === 'unit') {
        return [...UNITS].sort((a, b) => a.localeCompare(b, 'vi'));
      }
      return [...new Set(window.ReportState.mockDirectives.map(item => item[key]))]
        .sort((a, b) => a.localeCompare(b, 'vi'));
    },

    getFilteredDirectives(filters) {
      return window.ReportState.mockDirectives.filter(item => {
        const date = item.issueDate;
        const timeMatch =
          (!filters.fromDate || (date && date >= filters.fromDate)) &&
          (!filters.toDate || (date && date <= filters.toDate));

        const statusMatch = !filters.statuses.length || filters.statuses.includes(item.status);
        const unitMatch = !filters.units.length || filters.units.includes(item.unit);
        const leaderMatch = !filters.leaders.length || filters.leaders.includes(item.assigner);
        const assigneeMatch = !filters.assignees?.length || filters.assignees.includes(item.assignee);
        const situationMatch =
          !filters.situations?.length ||
          filters.situations.some(key => matchSituation(item, key));

        return timeMatch && statusMatch && unitMatch &&
          leaderMatch && assigneeMatch && situationMatch;
      });
    },

    matchSituation,

    aggregateStats(rows, groupByKey) {
      const byDimension = new Map();
      rows.forEach(item => {
        const key = item[groupByKey];
        if (!byDimension.has(key)) {
          byDimension.set(key, {
            dimension: key,
            total: 0,
            on_time_completed: 0,
            on_time_not_completed: 0,
            overdue_completed: 0,
            overdue_not_completed: 0
          });
        }
        const result = byDimension.get(key);
        result.total += 1;
        if (item.onTimeStatus === 'Đúng hạn') {
          if (item.status === 'Đã kết thúc') result.on_time_completed += 1;
          else result.on_time_not_completed += 1;
        } else if (item.status === 'Đã kết thúc') {
          result.overdue_completed += 1;
        } else {
          result.overdue_not_completed += 1;
        }
      });
      return [...byDimension.values()].sort(
        (a, b) => b.total - a.total || a.dimension.localeCompare(b.dimension, 'vi')
      );
    }
  };
}());
