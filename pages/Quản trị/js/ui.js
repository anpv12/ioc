/* ============================================================
   UI.JS — Admin page: menu switching, table rendering, pagination
   ============================================================ */

/* ---------------- Menu switching ---------------- */
function switchView(view, label) {
  document.querySelectorAll('.was-validated').forEach(el => el.classList.remove('was-validated'));
  document.querySelectorAll('.field-error-msg').forEach(el => el.remove());
  document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('nav-' + view).classList.add('active');
  document.getElementById('pageTitle').textContent = label;
  document.getElementById('breadcrumbCurrent').textContent = label;
  const detailOverlay = document.getElementById('detailOverlay');
  if (view !== 'handling-directives' && detailOverlay) {
    detailOverlay.hidden = true;
    document.body.style.overflow = '';
  }
  const processDetailOverlay = document.getElementById('processDetailOverlay');
  if (view !== 'dynamic-process' && processDetailOverlay) {
    processDetailOverlay.hidden = true;
    document.body.style.overflow = '';
  }
  const processEditorOverlay = document.getElementById('processEditorOverlay');
  if (view !== 'dynamic-process' && processEditorOverlay) {
    processEditorOverlay.hidden = true;
    const processListContainer = document.getElementById('processListContainer');
    if (processListContainer) processListContainer.hidden = false;
    document.body.style.overflow = '';
  }
}

function bindNavigationGroup(parentId, childrenId) {
  const parent = document.getElementById(parentId);
  const children = document.getElementById(childrenId);
  parent.addEventListener('click', () => {
    parent.classList.toggle('open');
    children.hidden = !parent.classList.contains('open');
  });
}

bindNavigationGroup('navParent', 'navChildren');
bindNavigationGroup('adminNavParent', 'adminNavChildren');

document.querySelectorAll('.nav-item[data-view]').forEach(item => {
  item.addEventListener('click', () => switchView(item.dataset.view, item.dataset.label));
});

/* ---------------- Quản lý layout (static 10 rows) ---------------- */
const qlLayoutRows = [
  ["Dev_FixYC", "6", "13"],
  ["IOC_KTXH_Chủ yếu", "7", "81"],
  ["IOC_KTXH_Chủ yếu_Nhóm 1", "2", "19"],
  ["IOC_CBCC", "5", "35"],
  ["IOC_GIAODUC", "5", "31"],
  ["IOC_TTHC", "2", "13"],
  ["IOC_C06", "6", "56"],
  ["IOC_PAKN", "2", "15"],
  ["IOC_QLVB", "1", "11"],
  ["IOC_BoTaiChinh", "5", "65"]
];

(function renderQlLayout() {
  let html = '';
  qlLayoutRows.forEach((r, i) => {
    html += `<tr><td class="center">${i + 1}</td><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td>
      <td><div class="row-actions">
        <button class="act-btn act-edit"><i class="fa-solid fa-pen"></i></button>
        <button class="act-btn act-del"><i class="fa-solid fa-trash"></i></button>
      </div></td></tr>`;
  });
  document.getElementById('qlLayoutBody').innerHTML = html;
})();

/* ---------------- Loại biểu đồ (62 rows, paginated) ---------------- */
const chartTypes = [
  ["combo", "Biểu đồ kết hợp", "COMBO"],
  ["zing_bar3D_stack", "Biểu đồ cột xếp chồng ZingChart", "BAR"],
  ["video", "Video", "OTHERS"],
  ["map", "Map", "OTHERS"],
  ["zing_bar3D_percent", "Biểu đồ cột 3d xếp chồng 100%", "BAR"],
  ["pie_of_pie", "Biểu đồ tròn trong lòng tròn (Pie of Pie)", "PIE"],
  ["contour", "Biểu đồ đường đồng mức", "SURFACE"],
  ["plotly_contour", "Biểu đồ đường viền", "SURFACE"],
  ["effectScatter", "Biểu đồ tán xạ với các đường trơn", "SCATTER"],
  ["pie_bar_of_pie", "Biểu đồ thanh của hình tròn", "PIE"],
  ["scatter_straight_lines_markers", "Biểu đồ tán xạ với các đường thẳng và đánh dấu", "SCATTER"],
  ["scatter_straight_lines", "Biểu đồ tán xạ với các đường thẳng", "SCATTER"],
  ["scatter_smooth_lines_markers", "Biểu đồ tán xạ với các đường trơn đánh dấu", "SCATTER"],
  ["scatter_smooth_lines", "Biểu đồ tán xạ với các đường trơn", "SCATTER"],
  ["slicer", "Bộ lọc dữ liệu", "OTHERS"],
  ["gauge", "Biểu đồ đồng hồ", "OTHERS"],
  ["matrix", "Matrix", "OTHERS"],
  ["text", "Văn bản", "OTHERS"],
  ["table", "Bảng", "OTHERS"],
  ["image", "Hình ảnh", "OTHERS"],
  ["funnel", "Biểu đồ hình phễu", "OTHERS"],
  ["bar_waterfall", "Biểu đồ thác nước", "OTHERS"],
  ["histogram", "Biểu đồ tần suất", "OTHERS"],
  ["sunburst", "Biểu đồ sunburst", "OTHERS"],
  ["treemap", "Biểu đồ cây (treemap)", "OTHERS"],
  ["radar_fill", "Biểu đồ radar được tô", "RADAR"],
  ["radar_mark", "Biểu đồ radar có đánh dấu", "RADAR"],
  ["radar", "Biểu đồ Radar", "RADAR"],
  ["line_smooth", "Biểu đồ đường cong", "LINE"],
  ["surface_wireframe", "Biểu đồ Mặt phẳng 3D khung dây", "SURFACE"],
  ["surface", "Biểu đồ bề mặt 3D", "SURFACE"],
  ["scatter3D_bubble", "Biểu đồ bong bóng 3D", "BUBBLE"],
  ["scatter_bubble", "Biểu đồ bong bóng", "BUBBLE"],
  ["scatter", "Biểu đồ tán xạ", "SCATTER"],
  ["percentStackedArea3d", "Biểu đồ vùng xếp chồng 100% 3D", "AREA"],
  ["percentStackedArea", "Biểu đồ vùng xếp chồng 100%", "AREA"],
  ["stackedArea3d", "Biểu đồ vùng xếp chồng 3D", "AREA"],
  ["stackedArea", "Biểu đồ vùng xếp chồng", "AREA"],
  ["area3d", "Biểu đồ vùng 3D", "AREA"],
  ["area", "Biểu đồ vùng", "AREA"],
  ["bar_horizontal3D_percent", "Biểu đồ thanh xếp chồng 100% 3D", "BAR"],
  ["bar_horizontal_percent", "Biểu đồ thanh xếp chồng 100%", "BAR"],
  ["bar_horizontal3D_stack", "Biểu đồ thanh xếp chồng 3D", "BAR"],
  ["bar_horizontal_stack", "Biểu đồ thanh xếp chồng", "BAR"],
  ["bar_horizontal3D", "Biểu đồ thanh liên cụm 3D", "BAR"],
  ["bar_horizontal", "Biểu đồ thanh liên cụm", "BAR"],
  ["pie_donut", "Biểu đồ vành khuyên bị cắt", "PIE"],
  ["pie_nested", "Biểu đồ hình tròn của hình tròn", "PIE"],
  ["pie3D", "Biểu đồ đường tròn 3D", "PIE"],
  ["pie", "Biểu đồ đường tròn", "PIE"],
  ["line3D", "Biểu đồ đường 3D", "LINE"],
  ["line_percent", "Biểu đồ đường xếp chồng 100%", "LINE"],
  ["line_stack", "Biểu đồ đường xếp chồng", "LINE"],
  ["line_mark", "Biểu đồ đường có đánh dấu", "LINE"],
  ["line", "Biểu đồ đường", "LINE"],
  ["bar3D_percent", "Biểu đồ cột xếp chồng 100% 3D", "BAR"],
  ["bar_percent", "Biểu đồ cột xếp chồng 100%", "BAR"],
  ["bar3D_stack", "Biểu đồ cột xếp chồng 3D", "BAR"],
  ["bar_stack", "Biểu đồ cột xếp chồng", "BAR"],
  ["bar3D", "Biểu đồ cột liên cụm 3D", "BAR"],
  ["bar", "Biểu đồ cột liên cụm", "BAR"],
  ["kpi", "KPI", "OTHERS"]
];

let currentPage = 1;
let pageSize = 10;

function renderChartTypes() {
  const total = chartTypes.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  let html = '';
  chartTypes.slice(start, end).forEach((r, i) => {
    html += `<tr><td class="center">${start + i + 1}</td><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td>
      <td class="center"><div class="chart-thumb"><i class="fa-solid fa-chart-simple"></i></div></td>
      <td><div class="row-actions">
        <button class="act-btn act-edit"><i class="fa-solid fa-pen"></i></button>
        <button class="act-btn act-del"><i class="fa-solid fa-trash"></i></button>
      </div></td></tr>`;
  });
  document.getElementById('chartTypesBody').innerHTML = html;
  document.getElementById('chartTypesInfo').textContent = `Hiển thị ${start + 1}-${end}/${total}`;
  renderPageButtons(totalPages);
}

function renderPageButtons(totalPages) {
  let html = '';
  html += `<button class="pg-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="1"><i class="fa-solid fa-angles-left"></i></button>`;
  html += `<button class="pg-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}"><i class="fa-solid fa-angle-left"></i></button>`;
  for (let p = 1; p <= totalPages; p++) {
    html += `<button class="pg-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
  }
  html += `<button class="pg-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}"><i class="fa-solid fa-angle-right"></i></button>`;
  html += `<button class="pg-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${totalPages}"><i class="fa-solid fa-angles-right"></i></button>`;
  document.getElementById('chartTypesPgBtns').innerHTML = html;
}

function gotoPage(p) { currentPage = p; renderChartTypes(); }

document.getElementById('chartPageSize').addEventListener('change', event => {
  pageSize = parseInt(event.target.value, 10);
  currentPage = 1;
  renderChartTypes();
});

document.getElementById('chartTypesPgBtns').addEventListener('click', event => {
  const button = event.target.closest('[data-page]');
  if (button && !button.disabled) gotoPage(Number(button.dataset.page));
});

renderChartTypes();

/* ---------------- Quản trị quy trình động ---------------- */
const orgList = [
  'Sở Thông tin và Truyền thông',
  'Sở Y tế',
  'UBND Tỉnh Gia Lai',
  'Sở Giáo dục và Đào tạo',
  'Sở Tài chính',
  'Sở Xây dựng',
  'Sở Kế hoạch và Đầu tư',
  'Sở Giao thông vận tải',
  'Sở Công Thương',
  'Sở Nội vụ',
  'Sở Lao động Thương binh và Xã hội',
  'Công an Tỉnh',
  'Cục Thống kê tỉnh Gia Lai',
  'UBND Thành phố Pleiku',
  'Phường An Bình',
  'Phường An Khê',
  'Phường An Phú',
  'Phường Ayun Pa',
  'Phường Diên Hồng',
  'Phường Hội Phú',
  'Phường Pleiku',
  'Phường Thống Nhất',
  'Sở Tài Chính',
  'UBND phường An Nhơn Bắc',
  'UBND phường An Nhơn Đông',
  'UBND phường An Nhơn Nam',
  'UBND phường An Nhơn',
  'UBND phường Bình Định',
  'UBND phường Bồng Sơn',
  'UBND phường Hoài Nhơn Bắc',
  'UBND phường Hoài Nhơn Đông',
  'UBND phường Hoài Nhơn Nam',
  'UBND phường Hoài Nhơn Tây',
  'UBND phường Hoài Nhơn',
  'UBND phường Quy Nhơn Bắc',
  'UBND phường Quy Nhơn Đông',
  'UBND phường Quy Nhơn Nam',
  'UBND phường Quy Nhơn Tây',
  'UBND phường Quy Nhơn',
  'UBND phường Tam Quan',
  'UBND xã Ân Hảo',
  'UBND xã An Hòa',
  'UBND xã An Lão',
  'UBND xã An Lương',
  'UBND xã An Nhơn Tây',
  'UBND xã An Toàn',
  'UBND xã Ân Tường',
  'UBND xã An Vinh',
  'UBND xã Bình An',
  'UBND xã Bình Dương',
  'UBND xã Bình Hiệp',
  'UBND xã Bình Khê',
  'UBND xã Bình Phú',
  'UBND xã Canh Liên',
  'UBND xã Canh Vinh',
  'UBND xã Cát Tiến',
  'UBND xã Đề Gi',
  'UBND xã Hòa Hội',
  'UBND xã Hoài Ân',
  'UBND xã Hội Sơn',
  'UBND xã Kim Sơn',
  'UBND xã Ngô Mây',
  'UBND xã Nhơn Châu',
  'UBND xã Phù Cát',
  'UBND xã Phù Mỹ Bắc',
  'UBND xã Phù Mỹ Đông',
  'UBND xã Phù Mỹ Nam',
  'UBND xã Phù Mỹ Tây',
  'UBND xã Phù Mỹ',
  'UBND xã Tây Sơn',
  'UBND xã Tuy Phước Bắc',
  'UBND xã Tuy Phước Đông',
  'UBND xã Tuy Phước Tây',
  'UBND xã Tuy Phước',
  'UBND xã Vân Canh',
  'UBND xã Vạn Đức',
  'UBND xã Vĩnh Quang',
  'UBND xã Vĩnh Sơn',
  'UBND xã Vĩnh Thạnh',
  'UBND xã Vĩnh Thịnh',
  'UBND xã Xuân An',
  'Xã Albá',
  'Xã Ayun',
  'Xã Bàu Cạn',
  'Xã Biển Hồ',
  'Xã Bờ Ngoong',
  'Xã Chơ Long',
  'Xã Chư A Thai',
  'Xã Chư Krey',
  'Xã Chư Păh',
  'Xã Chư Prông',
  'Xã Chư Pưh',
  'Xã Chư Sê',
  'Xã Cửu An',
  'Xã Đak Đoa',
  'Xã Đak Pơ',
  'Xã Đak Rong',
  'Xã Đak Sơmei',
  'Xã Đăk Song',
  'Xã Đức Cơ',
  'Xã Gào',
  'Xã Hra',
  'Xã Ia Băng',
  'Xã Ia Boòng',
  'Xã Ia Chia',
  'Xã Ia Dơk',
  'Xã Ia Dom',
  'Xã Ia Dreh',
  'Xã Ia Grai',
  'Xã Ia Hiao',
  'Xã Ia Hrung',
  'Xã Ia Hrú',
  'Xã Ia Khươl',
  'Xã Ia Ko',
  'Xã Ia Krái',
  'Xã Ia Krêl',
  'Xã Ia Lâu',
  'Xã Ia Le',
  'Xã Ia Ly',
  'Xã Ia Mơ',
  'Xã Ia Nan',
  'Xã Ia O',
  'Xã Ia Pa',
  'Xã Ia Phí',
  'Xã Ia Pia',
  'Xã Ia Pnôn',
  'Xã Ia Púch',
  'Xã Ia Rbol',
  'Xã Ia Rsai',
  'Xã Ia Sao',
  'Xã Ia Tôr',
  'Xã Ia Tul',
  'Xã Kbang',
  'Xã KDang',
  'Xã Kon Chiêng',
  'Xã Kon Gang',
  'Xã Kông Bơ La',
  'Xã Kông Chro',
  'Xã Krong',
  'Xã Lơ Pang',
  'Xã Mang Yang',
  'Xã Phú Thiện',
  'Xã Phú Túc',
  'Xã Pờ Tó',
  'Xã Sơn Lang',
  'Xã SRó',
  'Xã Tơ Tung',
  'Xã Uar',
  'Xã Ya Hội',
  'Xã Ya Ma'
];
const scopeList = [
  'Dân cư',
  'Phản ánh hiện trường',
  'Giáo dục',
  'Kinh tế xã hội',
  'Cán bộ công chức',
  'Văn bản điều hành',
  'CSDL quốc gia về tài chính',
  'Hành chính công'
];
const statusList = [
  'Chờ phân công',
  'Đang xử lý',
  'Đã có báo cáo',
  'Chờ phê duyệt',
  'Đã kết thúc'
];
const legacyProcessStatusMap = {
  'Chuyển xử lý': 'Chờ phân công',
  'Trình duyệt': 'Đã có báo cáo',
  'Phê duyệt': 'Chờ phê duyệt',
  'Đã hoàn thành': 'Đã kết thúc'
};
const userList = [
  'Lãnh đạo Đơn vị',
  'Trưởng phòng Chuyên môn',
  'Chuyên viên Xử lý',
  'Lãnh đạo UBND',
  'Chuyên viên Tổng hợp',
  'Nguyễn Văn A',
  'Nguyễn Văn B',
  'Nguyễn Văn C',
  'Nguyễn Văn D',
  'Nguyễn Văn E',
  'Nguyễn Văn F',
  'Nguyễn Văn G',
  'Nguyễn Văn H',
  'Nguyễn Văn I',
  'Nguyễn Văn J',
  'Nguyễn Văn K',
  'Nguyễn Văn L',
  'Nguyễn Văn M',
  'Nguyễn Văn N',
  'Nguyễn Văn O',
  'Nguyễn Văn P',
  'Nguyễn Văn Q',
  'Nguyễn Văn R',
  'Nguyễn Văn S',
  'Nguyễn Văn T',
  'Nguyễn Văn U',
  'Nguyễn Văn V',
  'Nguyễn Văn W',
  'Nguyễn Văn X',
  'Nguyễn Văn Y',
  'Nguyễn Văn Z',
  'Phùng Văn A',
  'Phùng Văn B',
  'Phùng Văn C',
  'Phùng Văn D',
  'Phùng Văn E',
  'Phùng Văn F',
  'Phùng Văn G',
  'Phùng Văn H',
  'Phùng Văn I',
  'Phùng Văn J',
  'Phùng Văn K',
  'Phùng Văn L',
  'Phùng Văn M',
  'Phùng Văn N',
  'Phùng Văn O',
  'Phùng Văn P',
  'Phùng Văn Q',
  'Phùng Văn R',
  'Phùng Văn S',
  'Phùng Văn T',
  'Phùng Văn U',
  'Phùng Văn V',
  'Phùng Văn W',
  'Phùng Văn X',
  'Phùng Văn Y',
  'Phùng Văn Z'
];

const formatStepOrgs = (orgs) => {
  if (!orgs || orgs.length === 0) return 'Chưa chọn cơ quan';
  if (orgs.length <= 2) return orgs.join(', ');
  return `${orgs.slice(0, 2).join(', ')}... (+${orgs.length - 2} cơ quan khác)`;
};

const getOrgsTooltip = (orgs) => {
  if (!orgs || orgs.length === 0) return 'Chưa chọn cơ quan';
  return orgs.join('\n');
};

const ALL_ORGS = ['Sở Thông tin và Truyền thông', 'Sở Y tế', 'UBND Tỉnh Gia Lai', 'Sở Giáo dục và Đào tạo', 'Sở Tài chính', 'Sở Xây dựng', 'Sở Kế hoạch và Đầu tư', 'Sở Giao thông vận tải', 'Sở Công Thương', 'Sở Nội vụ', 'Sở Lao động Thương binh và Xã hội', 'Công an Tỉnh', 'Cục Thống kê tỉnh Gia Lai', 'UBND Thành phố Pleiku'];

const getFakeAssigneeArray = (orgsList) => {
  const names = ['Nguyễn Văn Anh', 'Trần Thị Bích Vân', 'Lê Văn Cường', 'Phạm Văn Dũng', 'Hoàng Thị Mỹ Linh', 'Vũ Văn Hải', 'Đặng Thị Lan Hương', 'Bùi Văn Hùng'];
  return orgsList.map(org => {
    let hash = 0;
    for (let i = 0; i < org.length; i++) hash += org.charCodeAt(i);
    return names[hash % names.length];
  });
};

const FULL_STEPS = (orgsList) => [
  {
    id: 'node-x-1',
    unitName: 'Tiếp nhận và Phân công xử lý',
    status: 'Chờ phân công',
    org: orgsList[0] || 'Sở Thông tin và Truyền thông',
    orgs: orgsList,
    assignee: getFakeAssigneeArray(orgsList)[0] || 'Nguyễn Văn Anh',
    assignees: getFakeAssigneeArray(orgsList),
    description: 'Lãnh đạo đơn vị tiếp nhận và phân công việc xử lý chỉ đạo cho chuyên viên.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-x-2' }]
  },
  {
    id: 'node-x-2',
    unitName: 'Thực hiện nhiệm vụ',
    status: 'Đang xử lý',
    org: orgsList[0] || 'Sở Thông tin và Truyền thông',
    orgs: orgsList,
    assignee: getFakeAssigneeArray(orgsList)[0] || 'Nguyễn Văn Anh',
    assignees: getFakeAssigneeArray(orgsList),
    description: 'Chuyên viên nghiên cứu thực hiện nhiệm vụ được giao.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-x-3' }]
  },
  {
    id: 'node-x-3',
    unitName: 'Báo cáo kết quả',
    status: 'Đã có báo cáo',
    org: orgsList[0] || 'Sở Thông tin và Truyền thông',
    orgs: orgsList,
    assignee: getFakeAssigneeArray(orgsList)[0] || 'Nguyễn Văn Anh',
    assignees: getFakeAssigneeArray(orgsList),
    description: 'Xây dựng dự thảo báo cáo kết quả xử lý.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-x-4' }]
  },
  {
    id: 'node-x-4',
    unitName: 'Trình Lãnh đạo phê duyệt',
    status: 'Chờ phê duyệt',
    org: orgsList[0] || 'Sở Thông tin và Truyền thông',
    orgs: orgsList,
    assignee: getFakeAssigneeArray(orgsList)[0] || 'Nguyễn Văn Anh',
    assignees: getFakeAssigneeArray(orgsList),
    description: 'Trình lãnh đạo xem xét và ký duyệt báo cáo.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-x-5' }, { name: 'Trả về', nextNodeId: 'node-x-3' }]
  },
  {
    id: 'node-x-5',
    unitName: 'Kết thúc chỉ đạo',
    status: 'Đã kết thúc',
    org: orgsList[0] || 'Sở Thông tin và Truyền thông',
    orgs: orgsList,
    assignee: getFakeAssigneeArray(orgsList)[0] || 'Nguyễn Văn Anh',
    assignees: getFakeAssigneeArray(orgsList),
    description: 'Lưu trữ hồ sơ xử lý và kết thúc quy trình.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'end' }]
  }
];

const THREE_STEPS = (orgsList) => [
  {
    id: 'node-x-1',
    unitName: 'Phân công xử lý',
    status: 'Chờ phân công',
    org: orgsList[0] || 'Sở Thông tin và Truyền thông',
    orgs: orgsList,
    assignee: getFakeAssigneeArray(orgsList)[0] || 'Nguyễn Văn Anh',
    assignees: getFakeAssigneeArray(orgsList),
    description: 'Lãnh đạo đơn vị tiếp nhận và phân công việc xử lý chỉ đạo cho chuyên viên.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-x-2' }]
  },
  {
    id: 'node-x-2',
    unitName: 'Thực hiện nhiệm vụ',
    status: 'Đang xử lý',
    org: orgsList[0] || 'Sở Thông tin và Truyền thông',
    orgs: orgsList,
    assignee: getFakeAssigneeArray(orgsList)[0] || 'Nguyễn Văn Anh',
    assignees: getFakeAssigneeArray(orgsList),
    description: 'Chuyên viên nghiên cứu thực hiện nhiệm vụ được giao.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'node-x-3' }]
  },
  {
    id: 'node-x-3',
    unitName: 'Báo cáo kết quả',
    status: 'Đã có báo cáo',
    org: orgsList[0] || 'Sở Thông tin và Truyền thông',
    orgs: orgsList,
    assignee: getFakeAssigneeArray(orgsList)[0] || 'Nguyễn Văn Anh',
    assignees: getFakeAssigneeArray(orgsList),
    description: 'Báo cáo kết quả xử lý và kết thúc quy trình.',
    persisted: true,
    actions: [{ name: 'Chuyển xử lý', nextNodeId: 'end' }]
  }
];

const processCatalog = [
  {
    id: 'process-1',
    code: 'QT-2026-001',
    name: 'Quy trình xử lý PAHT',
    version: '1.0',
    scope: 'Phản ánh hiện trường',
    orgs: ['Sở Thông tin và Truyền thông', 'Sở Y tế'],
    active: true,
    processStatus: 'active',
    createdAt: '23/07/2026 09:30',
    description: 'Mô phỏng quy trình đang hoạt động, full tất cả các bước xử lý, 2 cơ quan áp dụng.',
    nodes: FULL_STEPS(['Sở Thông tin và Truyền thông', 'Sở Y tế'])
  },
  {
    id: 'process-2',
    code: 'QT-2026-002',
    name: 'Quy trình Báo cáo Kinh tế - Xã hội',
    version: '1.0',
    scope: 'Kinh tế xã hội',
    orgs: ALL_ORGS,
    active: true,
    processStatus: 'active',
    createdAt: '02/08/2026 08:00',
    description: 'Mô phỏng quy trình đang hoạt động, yêu cầu báo cáo định kỳ từ tất cả các Sở, Ban, Ngành trên địa bàn.',
    nodes: FULL_STEPS(ALL_ORGS)
  },
  {
    id: 'process-3',
    code: 'QT-2026-003',
    name: 'Quy trình Đánh giá Trường chuẩn Quốc gia',
    version: '1.0',
    scope: 'Giáo dục',
    orgs: ['Sở Giáo dục và Đào tạo'],
    active: false,
    processStatus: 'draft',
    createdAt: '03/08/2026 08:00',
    description: 'Bản nháp quy trình thẩm định, lấy ý kiến hiệp thương từ tất cả các cơ quan (mô phỏng phân công toàn bộ).',
    nodes: FULL_STEPS(ALL_ORGS)
  },
  {
    id: 'process-4',
    code: 'QT-2026-004',
    name: 'Quy trình Thẩm định Dự án Đầu tư',
    version: '1.0',
    scope: 'Hành chính công',
    orgs: ['Sở Xây dựng', 'Sở Kế hoạch và Đầu tư'],
    active: false,
    processStatus: 'draft',
    createdAt: '04/08/2026 08:00',
    description: 'Bản nháp quy trình thẩm định, phối hợp ngắn gọn 3 bước giữa Sở Xây dựng và Sở KH&ĐT.',
    nodes: THREE_STEPS(['Sở Xây dựng', 'Sở Kế hoạch và Đầu tư'])
  }
];
(() => {

  const state = { rows: processCatalog, search: '', active: '', scope: '', org: '', version: '', page: 1, pageSize: 10, draft: null, editingId: null, selectedStepId: null, viewOnly: false, zoom: 1.0, panX: 0, panY: 0, isPanning: false, startX: 0, startY: 0 };
  /*Lọc*/
  const elements = {
    list: document.getElementById('processListContainer'), search: document.getElementById('processSearch'), searchButton: document.getElementById('processSearchButton'), filterToggle: document.getElementById('processFilterToggle'), filterPanel: document.getElementById('processFilterPanel'), activeContainer: document.getElementById('filterProcessActiveContainer'), scopeContainer: document.getElementById('processScopeContainer'), orgs: document.getElementById('processOrgsContainer'), description: document.getElementById('processDescriptionInput'), steps: document.getElementById('processEditorNodeList'), diagram: document.getElementById('processEditorDiagram'), addStep: document.getElementById('addProcessNode'), clone: document.getElementById('cloneProcessEditor'), save: document.querySelector('[form="processEditorForm"]'), close: document.getElementById('closeProcessEditor'), cancel: document.getElementById('cancelProcessEditor'), error: document.getElementById('processEditorError'), nodeOverlay: document.getElementById('nodeConfigOverlay'), nodeForm: document.getElementById('processEditorNodeForm'), closeNode: document.getElementById('closeNodeConfig'), saveNode: document.getElementById('saveNodeConfig'),
    filterOrgContainer: document.getElementById('filterProcessOrgContainer'),
    filterScopeContainer: document.getElementById('filterProcessScopeContainer'),
    version: document.getElementById('filterProcessVersion'),
    refresh: document.getElementById('processRefreshButton'),
    add: document.getElementById('processAddButton'),
    notice: document.getElementById('processListNotice'),
    body: document.getElementById('processTableBody'),
    empty: document.getElementById('processEmptyState'),
    pageSize: document.getElementById('processPageSize'),
    pageInfo: document.getElementById('processPageInfo'),
    pages: document.getElementById('processPageButtons'),
    overlay: document.getElementById('processEditorOverlay'),
    form: document.getElementById('processEditorForm'),
    title: document.getElementById('processEditorTitle'),
    eyebrow: document.getElementById('processEditorEyebrow'),
    name: document.getElementById('processNameInput'),
    versionInput: document.getElementById('processVersionInput'),
    actionsOverlay: document.getElementById('stepActionsOverlay'),
    actionsTitle: document.getElementById('stepActionsTitle'),
    actionsTable: document.getElementById('stepActionsTableContainer'),
    addStepActionBtn: document.getElementById('addStepActionBtn'),
    closeActions: document.getElementById('closeStepActions'),
    cancelActions: document.getElementById('cancelStepActions'),
    saveActions: document.getElementById('saveStepActions')
  };
  const escapeText = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  const clone = value => JSON.parse(JSON.stringify(value));

  const bindAutoComplete = (container) => {
    const searchInput = container.querySelector('.dropdown-search-input');
    if (!searchInput) return;
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      const items = container.querySelectorAll('.dropdown-menu .dropdown-item:not(.select-all-item)');
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
      });
    });
  };

  const updateDropdownSummary = (container, selectedList, isMulti = true) => {
    const selectBox = container.querySelector('.select-box');
    if (!selectBox) return;
    selectBox.querySelectorAll('.selected-val-label, .tag-summary-container').forEach(el => el.remove());
    const placeholder = selectBox.querySelector('.placeholder');
    if (!selectedList || selectedList.length === 0) {
      container.classList.add('is-empty');
      if (placeholder) placeholder.style.display = 'inline';
      selectBox.removeAttribute('title');
      const oldTooltip = selectBox.querySelector('.custom-dropdown-tooltip');
      if (oldTooltip) oldTooltip.remove();
      return;
    }
    container.classList.remove('is-empty');
    if (placeholder) placeholder.style.display = 'none';
    const summaryWrap = document.createElement('div');
    summaryWrap.className = 'tag-summary-container';
    summaryWrap.style.display = 'flex';
    summaryWrap.style.alignItems = 'center';
    summaryWrap.style.gap = '4px';
    summaryWrap.style.width = 'calc(100% - 30px)';
    summaryWrap.style.overflow = 'hidden';
    summaryWrap.style.pointerEvents = 'none';
    const textSpan = document.createElement('span');
    textSpan.className = 'selected-val-label';
    textSpan.style.fontSize = '14px';
    textSpan.style.fontWeight = 'normal';
    textSpan.style.color = '#0f172a';
    textSpan.style.whiteSpace = 'nowrap';
    textSpan.style.overflow = 'hidden';
    textSpan.style.textOverflow = 'ellipsis';
    textSpan.style.maxWidth = '100%';
    if (!isMulti || selectedList.length === 1) {
      textSpan.textContent = selectedList[0];
      summaryWrap.appendChild(textSpan);
    } else {
      const selectBoxWidth = selectBox.clientWidth || 300;
      const maxAllowedWidth = selectBoxWidth - 65;
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.fontSize = '14px';
      tempSpan.style.fontWeight = 'normal';
      tempSpan.style.whiteSpace = 'nowrap';
      document.body.appendChild(tempSpan);
      let displayText = selectedList.join(', ');
      tempSpan.textContent = displayText;
      if (tempSpan.offsetWidth <= maxAllowedWidth) {
        textSpan.textContent = displayText;
        summaryWrap.appendChild(textSpan);
      } else {
        let fitIdx = selectedList.length - 1;
        let text = '';
        for (let i = selectedList.length - 1; i >= 1; i--) {
          text = selectedList.slice(0, i).join(', ') + '...';
          tempSpan.textContent = text;
          if (tempSpan.offsetWidth <= maxAllowedWidth - 40) {
            fitIdx = i;
            break;
          }
        }
        textSpan.textContent = selectedList.slice(0, fitIdx).join(', ') + '...';
        summaryWrap.appendChild(textSpan);
        const plusSpan = document.createElement('span');
        plusSpan.style.fontSize = '11px';
        plusSpan.style.fontWeight = '600';
        plusSpan.style.color = '#0284c7';
        plusSpan.style.background = '#e0f2fe';
        plusSpan.style.padding = '2px 6px';
        plusSpan.style.borderRadius = '4px';
        plusSpan.style.flexShrink = '0';
        plusSpan.textContent = `+${selectedList.length - fitIdx}`;
        summaryWrap.appendChild(plusSpan);
      }
      document.body.removeChild(tempSpan);
    }
    selectBox.insertBefore(summaryWrap, selectBox.querySelector('.arrow-icon'));
    selectBox.setAttribute('title', selectedList.join(', '));
  };
  const processCode = () => `QT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  const nowText = () => {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const normalizeStep = (step, index, rows) => ({ id: step.id || `step-${Date.now()}-${index}`, order: index + 1, unitName: step.unitName || step.name || `Bước xử lý ${index + 1}`, status: legacyProcessStatusMap[step.status] || step.status || statusList[Math.min(index, statusList.length - 1)], org: step.org || '', assignees: step.assignees?.length ? step.assignees : [step.accountName || userList[0]], description: step.description || '', actions: step.actions?.length ? step.actions : [{ name: 'Chuyển xử lý', nextNodeId: rows[index + 1]?.id || 'end' }], persisted: true, parentNodeId: index ? rows[index - 1]?.id || null : null });
  state.rows.forEach(process => {
    const sourceNodes = process.nodes || [];
    process.version ||= '1.0'; process.scope ||= scopeList[0]; process.orgs = process.orgs || []; process.createdAt ||= process.updatedAt || nowText(); process.deleted ||= false;
    process.processStatus ||= 'active';
    process.nodes = sourceNodes.map((step, index) => normalizeStep(step, index, sourceNodes));
  });
  let noticeTimeout = null;
  const showNotice = (message, autoHideMs = 2500) => {
    if (!message) return;

    const toast = document.getElementById('toast');
    if (!toast) return;

    const titleEl = document.getElementById('toast-title');
    const msgEl = document.getElementById('toast-message');
    if (titleEl) titleEl.innerText = 'Thành công';
    if (msgEl) msgEl.innerText = message;

    toast.classList.add('show');

    if (noticeTimeout) {
      clearTimeout(noticeTimeout);
    }

    if (autoHideMs > 0) {
      noticeTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, autoHideMs);
    }
  };
  const showError = message => { elements.error.textContent = message; elements.error.hidden = !message; };
  const refreshFilterOptions = () => {
    renderFilterScopeChoices();
    renderFilterOrgChoices();
    renderFilterActiveChoices();
    elements.version.value = state.version;
  };
  const filteredRows = () => { const keyword = state.search.trim().toLocaleLowerCase('vi'); const version = state.version.trim().toLocaleLowerCase('vi'); return state.rows.filter(row => !row.deleted && (!keyword || `${row.code} ${row.name}`.toLocaleLowerCase('vi').includes(keyword)) && (!state.active || row.processStatus === state.active) && (!state.scope || row.scope === state.scope) && (!state.org || row.orgs.includes(state.org)) && (!version || String(row.version).toLocaleLowerCase('vi').includes(version))); };
  const closeMenus = () => document.querySelectorAll('.process-action-menu').forEach(menu => { menu.hidden = true; });
  const renderList = () => {
    refreshFilterOptions(); const rows = filteredRows(); const pages = Math.max(1, Math.ceil(rows.length / state.pageSize)); state.page = Math.min(state.page, pages); const start = (state.page - 1) * state.pageSize; const visible = rows.slice(start, start + state.pageSize);
    elements.body.innerHTML = visible.map(row => {
      let statusBadge = '';
      if (row.processStatus === 'draft') {
        statusBadge = '<span class="status-badge draft-proc">Bản nháp</span>';
      } else if (row.processStatus === 'active') {
        statusBadge = '<span class="status-badge active-proc">Hoạt động</span>';
      } else {
        statusBadge = '<span class="status-badge inactive-proc">Ngừng hoạt động</span>';
      }
      return `<tr><td title="${escapeText(row.code)}">${escapeText(row.code)}</td><td title="${escapeText(row.name)}">${escapeText(row.name)}</td><td title="${escapeText(row.version)}">${escapeText(row.version)}</td><td title="${escapeText(row.scope)}">${escapeText(row.scope)}</td><td title="${escapeText(row.orgs.join(', '))}">${escapeText(row.orgs.join(', '))}</td><td class="center">${statusBadge}</td><td title="${escapeText(row.createdAt)}">${escapeText(row.createdAt)}</td><td class="center"><div class="row-actions"><button class="act-btn act-edit" type="button" data-process-action="edit" data-process-id="${row.id}" title="Sửa"><i class="fa-solid fa-pen"></i></button><button class="act-btn act-del" type="button" data-process-action="delete" data-process-id="${row.id}" title="Xóa"><i class="fa-solid fa-trash"></i></button></div></td></tr>`;
    }).join('');
    elements.empty.hidden = rows.length > 0; elements.pageInfo.textContent = `Hiển thị ${rows.length ? start + 1 : 0}-${Math.min(start + state.pageSize, rows.length)}/${rows.length}`;

    const pgBtns = [];
    pgBtns.push(`<button class="pg-btn" type="button" data-process-page="1" ${state.page === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} title="Trang đầu"><i class="fa-solid fa-angles-left"></i></button>`);
    pgBtns.push(`<button class="pg-btn" type="button" data-process-page="${Math.max(1, state.page - 1)}" ${state.page === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} title="Trang trước"><i class="fa-solid fa-angle-left"></i></button>`);
    for (let i = 1; i <= pages; i++) {
      pgBtns.push(`<button class="pg-btn ${state.page === i ? 'active' : ''}" type="button" data-process-page="${i}">${i}</button>`);
    }
    pgBtns.push(`<button class="pg-btn" type="button" data-process-page="${Math.min(pages, state.page + 1)}" ${state.page === pages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} title="Trang sau"><i class="fa-solid fa-angle-right"></i></button>`);
    pgBtns.push(`<button class="pg-btn" type="button" data-process-page="${pages}" ${state.page === pages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} title="Trang cuối"><i class="fa-solid fa-angles-right"></i></button>`);

    elements.pages.innerHTML = pgBtns.join('');
  };
  const compatibilityFields = process => {
    process.nodes.forEach((step, index) => { step.order = index + 1; step.parentNodeId = index ? process.nodes[index - 1].id : null; step.accountName = step.assignees[0] || ''; step.accountId = `account-${index + 1}`; step.contextId = index ? 'department' : 'leader'; step.permissions = { receive: true, handle: true, assign: index < process.nodes.length - 1, approve: true, revise: true, report: true }; step.requireAcceptance = true; step.canDelegate = step.permissions.assign; step.canApproveChildren = true; step.requireReport = true; step.requireFile = false; });
    process.handlingMode = process.nodes.length > 1 ? 'delegated' : 'direct'; process.modeLabel = process.handlingMode === 'direct' ? 'Trực tiếp' : 'Phân công'; process.assignee = process.nodes[0]?.org || process.orgs[0]; process.assigneeInitials = 'CQ'; process.levelCount = process.nodes.length + 2; process.steps = process.nodes.map(step => step.unitName); process.updatedAt = process.createdAt;
  };
  state.rows.forEach(compatibilityFields);
  const updateOrganizationSummary = () => {
    const checkedCheckboxes = [...elements.orgs.querySelectorAll('.dropdown-item input.process-org-checkbox:checked')];
    const selected = checkedCheckboxes.map(input => input.value);
    updateDropdownSummary(elements.orgs, selected, true);
  };
  const renderOrganizationChoices = selected => {
    const isAllSelected = orgList.length > 0 && orgList.every(org => selected.includes(org));
    elements.orgs.innerHTML = `
      <div class="select-box" ${state.viewOnly ? 'style="background-color: #f1f5f9; cursor: not-allowed; opacity: 0.8;"' : ''}>
        <span class="placeholder">Chọn cơ quan...</span>
        <input type="text" placeholder="Gõ để tìm kiếm nhanh..." class="dropdown-search-input" style="display: none; width: 100%; border: none; outline: none; background: transparent; font-size: 13px; font-weight: normal; color: var(--admin-text); padding: 0;">
        <svg class="arrow-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
      </div>
      <div class="dropdown-menu">
        <label class="dropdown-item select-all-item">
          <input type="checkbox" id="selectAllProcessOrgs" ${isAllSelected ? 'checked' : ''} ${state.viewOnly ? 'disabled' : ''}>
          <span style="font-weight: bold; color: var(--admin-text);">Chọn tất cả</span>
        </label>
        ${orgList.map(org => `
          <label class="dropdown-item">
            <input type="checkbox" class="process-org-checkbox" value="${escapeText(org)}" ${selected.includes(org) ? 'checked' : ''} ${state.viewOnly ? 'disabled' : ''}>
            <span>${escapeText(org)}</span>
          </label>
        `).join('')}
      </div>
    `;
    updateOrganizationSummary();
    bindAutoComplete(elements.orgs);
  };
  const updateScopeSummary = () => {
    const selectedVal = state.draft ? state.draft.scope : '';
    updateDropdownSummary(elements.scopeContainer, selectedVal ? [selectedVal] : [], false);
  };
  const renderScopeChoices = selected => {
    elements.scopeContainer.innerHTML = `
      <div class="select-box">
        <span class="placeholder">Chọn phạm vi...</span>
        <input type="text" placeholder="Gõ để tìm kiếm nhanh..." class="dropdown-search-input" style="display: none; width: 100%; border: none; outline: none; background: transparent; font-size: 13px; font-weight: normal; color: var(--admin-text); padding: 0;">
        <svg class="arrow-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
      </div>
      <div class="dropdown-menu">
        ${scopeList.map(scope => `
          <div class="dropdown-item" data-scope-val="${escapeText(scope)}">
            <span>${escapeText(scope)}</span>
          </div>
        `).join('')}
      </div>
    `;
    updateScopeSummary();
    bindAutoComplete(elements.scopeContainer);
  };

  const renderFilterScopeChoices = () => {
    elements.filterScopeContainer.innerHTML = `
      <div class="select-box">
        <span class="placeholder">Chọn nhóm...</span>
        <input type="text" placeholder="Gõ để tìm kiếm nhanh..." class="dropdown-search-input" style="display: none; width: 100%; border: none; outline: none; background: transparent; font-size: 13px; font-weight: normal; color: var(--admin-text); padding: 0;">
        <svg class="arrow-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
      </div>
      <div class="dropdown-menu">
        ${scopeList.map(scope => `
          <div class="dropdown-item" data-filter-scope-val="${escapeText(scope)}">
            <span>${escapeText(scope)}</span>
          </div>
        `).join('')}
      </div>
    `;
    updateDropdownSummary(elements.filterScopeContainer, state.scope ? [state.scope] : [], false);
    bindAutoComplete(elements.filterScopeContainer);
  };

  const renderFilterOrgChoices = () => {
    const allOrgs = orgList;
    elements.filterOrgContainer.innerHTML = `
      <div class="select-box">
        <span class="placeholder">Chọn cơ quan...</span>
        <input type="text" placeholder="Gõ để tìm kiếm nhanh..." class="dropdown-search-input" style="display: none; width: 100%; border: none; outline: none; background: transparent; font-size: 13px; font-weight: normal; color: var(--admin-text); padding: 0;">
        <svg class="arrow-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
      </div>
      <div class="dropdown-menu">
        ${allOrgs.map(org => `
          <div class="dropdown-item" data-filter-org-val="${escapeText(org)}">
            <span>${escapeText(org)}</span>
          </div>
        `).join('')}
      </div>
    `;
    updateDropdownSummary(elements.filterOrgContainer, state.org ? [state.org] : [], false);
    bindAutoComplete(elements.filterOrgContainer);
  };

  const renderFilterActiveChoices = () => {
    if (!elements.activeContainer) return;
    const statusOptions = [
      { value: 'draft', label: 'Bản nháp' },
      { value: 'active', label: 'Hoạt động' }
    ];
    elements.activeContainer.innerHTML = `
      <div class="select-box">
        <span class="placeholder">Chọn trạng thái...</span>
        <input type="text" placeholder="Gõ để tìm kiếm..." class="dropdown-search-input" style="display: none; width: 100%; border: none; outline: none; background: transparent; font-size: 13px; font-weight: normal; color: var(--admin-text); padding: 0;">
        <svg class="arrow-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
      </div>
      <div class="dropdown-menu">
        ${statusOptions.map(opt => `
          <div class="dropdown-item" data-filter-active-val="${escapeText(opt.value)}">
            <span>${escapeText(opt.label)}</span>
          </div>
        `).join('')}
      </div>
    `;
    const getLabel = val => statusOptions.find(o => o.value === val)?.label || '';
    updateDropdownSummary(elements.activeContainer, state.active ? [getLabel(state.active)] : [], false);
    bindAutoComplete(elements.activeContainer);
  };

  const renderSteps = () => {
    const draft = state.draft; if (!draft) return;

    // Tự động cập nhật thứ tự và bước liền trước (parentNodeId) cho toàn bộ các bước trong luồng
    draft.nodes.forEach((node, index) => {
      node.order = index + 1;
      node.parentNodeId = index > 0 ? draft.nodes[index - 1].id : null;
    });

    const hasCompletion = draft.nodes.some(step => step.status === 'Đã kết thúc');
    const processSteps = [{ id: 'start', unitName: 'Start', fixed: true }, ...draft.nodes];
    if (hasCompletion) processSteps.push({ id: 'end', unitName: 'Kết thúc', fixed: true });

    // Render danh sách bên trái
    elements.steps.innerHTML = processSteps.map((step, index) => {
      const isStart = step.id === 'start';
      const isEnd = step.id === 'end';
      const icon = isStart ? '<i class="fa-solid fa-play" style="font-size: 12px;"></i>' : isEnd ? '<i class="fa-solid fa-flag-checkered" style="font-size: 12px;"></i>' : index;
      return `
        <div class="process-flow-node ${step.id === state.selectedStepId ? 'active' : ''} ${step.fixed ? 'fixed' : ''}" data-new-step-id="${step.id}">
          <span>${icon}</span>
          <div class="node-info" style="display: flex; flex-direction: column; justify-content: center; flex: 1; min-width: 0;">
            <strong>${escapeText(step.unitName)}</strong>
            ${step.fixed ? '' : `<small>${escapeText(step.status)} · <span title="${escapeText(getOrgsTooltip(step.orgs || [step.org]))}">${escapeText(formatStepOrgs(step.orgs || [step.org]))}</span></small>`}
          </div>
          ${(step.fixed || state.flowLocked) ? '<i class="fa-solid fa-lock" style="color: #94a3b8; margin-left: auto;" title="Luồng xử lý đã khóa"></i>' : `
            <div class="step-action-menu-container" style="flex: none; margin-left: auto;">
              <button class="step-menu-toggle" type="button" data-step-menu-toggle="${step.id}" title="Thao tác"><i class="fa-solid fa-pen"></i></button>
              <div class="step-action-dropdown" data-step-menu-panel="${step.id}" hidden>
                <button type="button" data-step-act-edit="${step.id}"><i class="fa-solid fa-pen"></i> Sửa</button>
                <button type="button" data-step-act-add-action="${step.id}"><i class="fa-solid fa-plus"></i> Thêm hành động</button>
                ${state.viewOnly ? '' : `<button type="button" class="act-del-item" data-step-act-del="${step.id}"><i class="fa-solid fa-trash"></i> Xóa </button>`}
              </div>
            </div>
          `}
        </div>
      `;
    }).join('');

    // Render biểu đồ trực quan (chỉ chứa các circle-node)
    const diagramHtml = [];
    processSteps.forEach((step, index) => {
      const isStart = step.id === 'start';
      const isEnd = step.id === 'end';
      const icon = isStart ? 'fa-play' : isEnd ? 'fa-flag-checkered' : '';

      diagramHtml.push(`
        <div class="circle-node ${step.id === state.selectedStepId ? 'active' : ''} ${step.fixed ? 'fixed' : ''}" data-new-step-id="${step.id}" style="margin-bottom: 70px; position: relative; z-index: 2;">
          <span class="node-number">${icon ? `<i class="fa-solid ${icon}" style="font-size: 13px;"></i>` : index}</span>
          ${(step.fixed || state.flowLocked) ? '' : `
            <div class="step-action-menu-container" style="position: absolute; top: -8px; right: -12px; z-index: 10;">
              <button class="edit-btn" type="button" data-step-menu-toggle="${step.id}" title="Thao tác ${escapeText(step.unitName)}">
                <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              </button>
              <div class="step-action-dropdown" data-step-menu-panel="${step.id}" hidden>
                <button type="button" data-step-act-edit="${step.id}"><i class="fa-solid fa-pen"></i> Sửa </button>
                <button type="button" data-step-act-add-action="${step.id}"><i class="fa-solid fa-plus"></i> Thêm hành động</button>
                ${state.viewOnly ? '' : `<button type="button" class="act-del-item" data-step-act-del="${step.id}"><i class="fa-solid fa-trash"></i> Xóa </button>`}
              </div>
            </div>
          `}
          <div style="position: absolute; left: calc(50% + 40px); top: 50%; transform: translateY(-50%); text-align: left; width: 220px; font-size: 12px; font-weight: 600; color: var(--admin-text); line-height: 1.3; pointer-events: auto;">
            <div style="font-size: 12px; font-weight: 700; white-space: nowrap;" title="${escapeText(step.unitName)}">${escapeText(step.unitName)}</div>
            ${step.fixed ? '' : `
              <div style="font-size: 10px; font-weight: normal; color: var(--admin-muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeText(step.status)} – ${escapeText(formatStepOrgs(step.orgs || [step.org]))}">
                ${escapeText(step.status)} – ${escapeText(formatStepOrgs(step.orgs || [step.org]))}
              </div>
            `}
          </div>
        </div>
      `);
    });

    elements.diagram.innerHTML = `<div class="pe-diagram-zoom-wrapper" style="transform: translate(${state.panX}px, ${state.panY}px) scale(${state.zoom}); transform-origin: top center; width: 100%; display: flex; flex-direction: column; align-items: center; transition: none; cursor: grab;">
      <div class="process-simple-diagram" style="position: relative; width: 100%; display: flex; flex-direction: column; align-items: center;">${diagramHtml.join('')}</div>
    </div>`;

    // Vẽ động tất cả các mũi tên UML dựa trên vị trí thực tế của các node
    setTimeout(renderDiagramLinks, 50);
    bindDragDropEvents();
  };

  const renderDiagramLinks = () => {
    const diagram = elements.diagram;
    const wrapper = diagram.querySelector('.pe-diagram-zoom-wrapper');
    if (!wrapper) return;
    const oldSvg = wrapper.querySelector('.uml-svg-overlay-global');
    if (oldSvg) oldSvg.remove();
    const simpleDiagram = wrapper.querySelector('.process-simple-diagram');
    if (!simpleDiagram) return;

    const nodes = [...simpleDiagram.querySelectorAll('.circle-node')];
    const nodeCoords = {};

    nodes.forEach(nodeEl => {
      const id = nodeEl.dataset.newStepId;
      nodeCoords[id] = {
        x: nodeEl.offsetLeft + nodeEl.offsetWidth / 2,
        y: nodeEl.offsetTop + nodeEl.offsetHeight / 2,
        width: nodeEl.offsetWidth,
        height: nodeEl.offsetHeight
      };
    });

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'uml-svg-overlay-global');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '1';

    svg.innerHTML = `
      <defs>
        <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#f87171" />
        </marker>
        <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#4ade80" />
        </marker>
      </defs>
    `;

    const draft = state.draft;
    const processSteps = [{ id: 'start', unitName: 'Start' }, ...draft.nodes];
    const hasCompletion = draft.nodes.some(step => step.status === 'Đã kết thúc');
    if (hasCompletion) processSteps.push({ id: 'end', unitName: 'Kết thúc' });

    processSteps.forEach((step, idx) => {
      if (step.id === 'end') return;
      let actions = [];
      if (step.id === 'start') {
        actions = [{ name: 'Bắt đầu', nextNodeId: draft.nodes[0]?.id || 'end' }];
      } else {
        actions = step.actions || [];
      }

      actions.forEach((act, actIdx) => {
        const targetId = act.nextNodeId;
        if (!nodeCoords[step.id] || !nodeCoords[targetId]) return;

        const from = nodeCoords[step.id];
        const to = nodeCoords[targetId];
        const fromIdx = processSteps.findIndex(s => s.id === step.id);
        const toIdx = processSteps.findIndex(s => s.id === targetId);

        let pathD = '';

        if (toIdx === fromIdx + 1) {
          // Đi thẳng xuống
          const startY = from.y + from.height / 2;
          const endY = to.y - to.height / 2;
          pathD = `M ${from.x} ${startY} L ${from.x} ${endY}`;
        } else {
          // Đi vòng qua bên trái
          const stepDiff = Math.abs(fromIdx - toIdx);
          const offset = 45 + stepDiff * 20 + actIdx * 10;
          const startX = from.x - from.width / 2;
          const endX = to.x - to.width / 2;
          pathD = `M ${startX} ${from.y} L ${from.x - offset} ${from.y} L ${from.x - offset} ${to.y} L ${endX} ${to.y}`;
        }

        const isReject = toIdx < fromIdx;
        const color = isReject ? '#f87171' : '#4ade80';
        const marker = isReject ? 'url(#arrow-red)' : 'url(#arrow-green)';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathD);
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-dasharray', '4 4');
        path.setAttribute('fill', 'none');
        path.setAttribute('marker-end', marker);
        svg.appendChild(path);
      });
    });

    simpleDiagram.appendChild(svg);
  };

  const bindDragDropEvents = () => {
    const stepsList = elements.steps;
    const nodes = stepsList.querySelectorAll('.process-flow-node:not(.fixed)');

    nodes.forEach(node => {
      const stepObj = state.draft.nodes.find(n => n.id === node.dataset.newStepId);
      const isEndStep = stepObj && stepObj.status === 'Đã kết thúc';

      if (!isEndStep) {
        node.setAttribute('draggable', 'true');
      } else {
        node.removeAttribute('draggable');
        node.style.cursor = 'not-allowed';
      }

      node.addEventListener('dragstart', event => {
        if (state.viewOnly || state.flowLocked || isEndStep) {
          event.preventDefault();
          return;
        }
        event.dataTransfer.setData('text/plain', node.dataset.newStepId);
        node.classList.add('dragging');
      });
      node.addEventListener('dragend', () => {
        node.classList.remove('dragging');
        stepsList.querySelectorAll('.process-flow-node').forEach(el => el.classList.remove('drag-over'));
      });
      node.addEventListener('dragover', event => {
        event.preventDefault();
        const draggingNode = stepsList.querySelector('.dragging');
        if (draggingNode && draggingNode !== node && !isEndStep) {
          node.classList.add('drag-over');
        }
      });
      node.addEventListener('dragleave', () => {
        node.classList.remove('drag-over');
      });
      node.addEventListener('drop', event => {
        event.preventDefault();
        node.classList.remove('drag-over');
        if (isEndStep) return;
        const srcId = event.dataTransfer.getData('text/plain');
        const dstId = node.dataset.newStepId;
        if (!srcId || !dstId || srcId === dstId) return;

        const draft = state.draft;
        const srcIdx = draft.nodes.findIndex(n => n.id === srcId);
        const dstIdx = draft.nodes.findIndex(n => n.id === dstId);
        if (srcIdx === -1 || dstIdx === -1) return;

        const [movedNode] = draft.nodes.splice(srcIdx, 1);
        draft.nodes.splice(dstIdx, 0, movedNode);

        draft.nodes.forEach((n, idx) => {
          n.order = idx + 1;
          n.parentNodeId = idx > 0 ? draft.nodes[idx - 1].id : null;
          if (n.actions) {
            n.actions.forEach(act => {
              if (act.name === 'Chuyển xử lý' || act.name === 'Phê duyệt') {
                act.nextNodeId = draft.nodes[idx + 1]?.id || 'end';
              } else if (act.name === 'Trả về' || act.name === 'Từ chối') {
                act.nextNodeId = idx > 0 ? draft.nodes[idx - 1].id : 'start';
              }
            });
          }
        });

        renderSteps();
        if (state.selectedStepId && !elements.nodeOverlay.hidden) {
          const currentStep = draft.nodes.find(n => n.id === state.selectedStepId);
          if (currentStep) renderStepForm(currentStep);
        }
      });
    });
  };
  const deleteStep = stepId => {
    if (state.viewOnly) return;
    const draft = state.draft;
    if (!draft) return;
    const index = draft.nodes.findIndex(n => n.id === stepId);
    if (index === -1) return;
    const stepToDelete = draft.nodes[index];
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bước "${stepToDelete.unitName}"?`)) return;

    const nextStepId = draft.nodes[index + 1]?.id || 'end';
    draft.nodes.forEach(node => {
      if (node.actions) {
        node.actions.forEach(action => {
          if (action.nextNodeId === stepId) {
            action.nextNodeId = nextStepId;
          }
        });
      }
    });

    draft.nodes.splice(index, 1);
    if (state.selectedStepId === stepId) {
      state.selectedStepId = draft.nodes[Math.max(0, index - 1)]?.id || null;
    }

    renderSteps();
    showNotice(`Đã xóa bước "${stepToDelete.unitName}" và tự động nối luồng xử lý.`);
  };

  const openEditor = (id, viewOnly = false, copyMode = false) => {
    state.zoom = 1.0; state.panX = 0; state.panY = 0; state.isPanning = false;
    const source = id ? state.rows.find(row => row.id === id) : null;
    state.editingId = copyMode ? null : source?.id || null;
    state.viewOnly = viewOnly;

    if (source) {
      state.draft = clone(source);
    } else {
      state.draft = { id: null, code: processCode(), name: '', version: '1.0', scope: scopeList[0], orgs: [], description: '', processStatus: 'draft', createdAt: nowText(), nodes: [] };
    }

    if (copyMode) {
      const idMap = new Map(state.draft.nodes.map((step, index) => [step.id, `step-${Date.now()}-${index + 1}`]));
      state.draft.nodes.forEach(step => {
        step.id = idMap.get(step.id);
        step.actions.forEach(action => {
          action.nextNodeId = idMap.get(action.nextNodeId) || action.nextNodeId;
        });
      });
      state.draft.id = null;
      state.draft.code = processCode();
      state.draft.name = `${source.name} - bản sao`;
      state.draft.createdAt = nowText();
      state.draft.version = '1.0';
      state.draft.processStatus = 'draft';
    }

    const draftStatus = state.draft.processStatus || 'draft';
    const btnDraft = document.getElementById('draftProcessEditor');
    const btnPublish = document.getElementById('publishProcessEditor');
    const btnClone = document.getElementById('cloneProcessEditor');

    if (viewOnly) {
      state.flowLocked = true;
      if (btnDraft) btnDraft.hidden = true;
      if (btnPublish) {
        btnPublish.hidden = false;
        btnPublish.disabled = true;
        btnPublish.style.opacity = '0.5';
        btnPublish.style.pointerEvents = 'none';
        btnPublish.style.cursor = 'not-allowed';
      }
    } else {
      if (btnDraft) btnDraft.hidden = false;
      if (btnPublish) {
        btnPublish.hidden = false;
        if (draftStatus === 'active') {
          btnPublish.disabled = true;
          btnPublish.style.opacity = '0.5';
          btnPublish.style.pointerEvents = 'none';
          btnPublish.style.cursor = 'not-allowed';
        } else {
          btnPublish.disabled = false;
          btnPublish.style.opacity = '';
          btnPublish.style.pointerEvents = '';
          btnPublish.style.cursor = '';
        }
      }

      if (draftStatus === 'active') {
        state.flowLocked = true;
      } else {
        state.flowLocked = false;
      }

      if (btnPublish) {
        btnPublish.innerHTML = '<i class="fa-solid fa-arrow-up-from-bracket"></i> Phát hành';
        btnPublish.dataset.actionType = 'publish';
      }
    }

    state.selectedStepId = state.draft.nodes[0]?.id || null;
    elements.title.textContent = viewOnly ? 'Xem chi tiết quy trình' : state.editingId ? 'Chỉnh sửa quy trình' : copyMode ? 'Tạo bản sao quy trình' : 'Thêm mới quy trình';
    elements.eyebrow.textContent = state.draft.code;
    elements.name.value = state.draft.name;
    elements.versionInput.value = state.draft.version;

    elements.list.hidden = true;
    elements.overlay.hidden = false;
    document.body.style.overflow = 'hidden';

    renderScopeChoices(state.draft.scope);
    elements.description.value = state.draft.description || '';
    renderOrganizationChoices(state.draft.orgs);

    elements.form.querySelectorAll('input, select, textarea').forEach(field => {
      if (field.id === 'processVersionInput') {
        field.disabled = true;
      } else {
        field.disabled = viewOnly;
      }
    });

    elements.addStep.hidden = viewOnly || state.flowLocked;
    if (elements.save) elements.save.hidden = viewOnly;
    if (btnClone) btnClone.hidden = !source || copyMode;
    showError('');
    renderSteps();
  };
  const closeEditor = () => {
    document.querySelectorAll('.was-validated').forEach(el => el.classList.remove('was-validated'));
    document.querySelectorAll('.field-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    elements.overlay.hidden = true;
    elements.list.hidden = false;
    elements.nodeOverlay.hidden = true;
    document.body.style.overflow = '';
    state.draft = null;
  };

  const actionOptions = (draft, selectedId, currentStepId, actionName) => {
    if (!currentStepId) {
      return draft.nodes.map(step => `<option value="${step.id}" ${step.id === selectedId ? 'selected' : ''}>${escapeText(step.unitName)}</option>`).join('');
    }
    const currentIndex = draft.nodes.findIndex(n => n.id === currentStepId);
    const validNodes = draft.nodes.filter((step, index) => {
      if (actionName === 'Trả về') return index < currentIndex;
      return index > currentIndex;
    });
    let html = validNodes.map(step => `<option value="${step.id}" ${step.id === selectedId ? 'selected' : ''}>${escapeText(step.unitName)}</option>`).join('');
    return html;
  };

  const updateStepAssigneeSummary = (step) => {
    const container = elements.nodeForm.querySelector('.process-assignee-multiselect');
    if (!container) return;
    const selectBox = container.querySelector('.select-box');
    if (!selectBox) return;

    if (step.status === 'Chờ phê duyệt' || step.status === 'Phê duyệt báo cáo') {
      selectBox.style.backgroundColor = '#ffffff';
      selectBox.style.cursor = 'not-allowed';
      selectBox.style.opacity = '1';
      selectBox.querySelectorAll('.selected-val-label, .tag-summary-container').forEach(el => el.remove());
      const placeholder = selectBox.querySelector('.placeholder');
      if (placeholder) {
        placeholder.style.display = 'inline';
        placeholder.style.color = 'transparent';
      }
      return;
    }

    selectBox.style.backgroundColor = '#f1f5f9';
    selectBox.style.cursor = 'not-allowed';
    selectBox.style.opacity = '0.8';

    const selected = step ? (step.assignees || []) : [];
    updateDropdownSummary(container, selected, true);
  };

  const renderStepAssigneeChoices = step => {
    const container = elements.nodeForm.querySelector('.process-assignee-multiselect');
    if (!container) return;
    const selectedOrgs = step.orgs || (step.org ? [step.org] : []);

    const getFakeAssignee = (org) => {
      const names = ['Nguyễn Văn Anh', 'Trần Thị Bích Vân', 'Lê Văn Cường', 'Phạm Văn Dũng', 'Hoàng Thị Mỹ Linh', 'Vũ Văn Hải', 'Đặng Thị Lan Hương', 'Bùi Văn Hùng'];
      let hash = 0;
      for (let i = 0; i < org.length; i++) hash += org.charCodeAt(i);
      return names[hash % names.length];
    };
    step.assignees = selectedOrgs.map(getFakeAssignee);
    const availableAssignees = step.assignees;

    const isApproval = step.status === 'Chờ phê duyệt' || step.status === 'Phê duyệt báo cáo';

    container.innerHTML = `
      <div class="select-box" style="${isApproval ? 'background-color: #ffffff; cursor: not-allowed; opacity: 1;' : 'background-color: #f1f5f9; cursor: not-allowed; opacity: 0.8;'}">
        <span class="placeholder" style="${isApproval ? 'color: transparent;' : ''}">Chọn người xử lý...</span>
        <svg class="arrow-icon" viewBox="0 0 24 24" style="${isApproval ? 'display: none;' : ''}"><path d="M7 10l5 5 5-5z"/></svg>
      </div>
      <div class="dropdown-menu" style="${isApproval ? 'display: none !important;' : ''}">
        ${availableAssignees.map(user => `
          <label class="dropdown-item" style="cursor: not-allowed; opacity: 0.8;">
            <input type="checkbox" data-step-assignee value="${escapeText(user)}" checked disabled style="cursor: not-allowed;">
            <span>${escapeText(user)}</span>
          </label>
        `).join('')}
      </div>
    `;
    updateStepAssigneeSummary(step);
  };

  const updateStepStatusSummary = (step) => {
    const container = elements.nodeForm.querySelector('.process-step-status-dropdown');
    if (!container) return;
    updateDropdownSummary(container, step ? [step.status] : [], false);
  };

  const renderStepStatusChoices = step => {
    const container = elements.nodeForm.querySelector('.process-step-status-dropdown');
    if (!container) return;
    const isStepFieldsDisabled = state.viewOnly || state.draft.processStatus === 'active';
    container.innerHTML = `
      <div class="select-box" ${isStepFieldsDisabled ? 'style="background-color: #f1f5f9; cursor: not-allowed; opacity: 0.8;"' : ''}>
        <span class="placeholder">Chọn trạng thái...</span>
        <input type="text" placeholder="Gõ để tìm kiếm nhanh..." class="dropdown-search-input" style="display: none; width: 100%; border: none; outline: none; background: transparent; font-size: 13px; font-weight: normal; color: var(--admin-text); padding: 0;">
        <svg class="arrow-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
      </div>
      <div class="dropdown-menu">
        ${statusList.map(status => `
          <div class="dropdown-item" data-step-status-val="${escapeText(status)}">
            <span>${escapeText(status)}</span>
          </div>
        `).join('')}
      </div>
    `;
    updateStepStatusSummary(step);
    bindAutoComplete(container);
  };

  const checkDefaultAssignee = (step) => {
    const selectedOrgs = step.orgs || [];
    if (!selectedOrgs.length) {
      step.assignees = [];
      return;
    }
    const getFakeAssignee = (org) => {
      const names = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Văn D', 'Hoàng Thị E', 'Vũ Văn F', 'Đặng Thị G', 'Bùi Văn H'];
      let hash = 0;
      for (let i = 0; i < org.length; i++) hash += org.charCodeAt(i);
      return names[hash % names.length];
    };
    step.assignees = selectedOrgs.map(getFakeAssignee);
  };

  const updateStepOrgSummary = (step) => {
    const container = elements.nodeForm.querySelector('.process-step-org-dropdown');
    if (!container) return;
    const selectBox = container.querySelector('.select-box');
    if (!selectBox) return;

    if (step.status === 'Chờ phê duyệt' || step.status === 'Phê duyệt báo cáo') {
      selectBox.style.backgroundColor = '#ffffff';
      selectBox.style.cursor = 'not-allowed';
      selectBox.style.opacity = '1';
      selectBox.querySelectorAll('.selected-val-label, .tag-summary-container').forEach(el => el.remove());
      const placeholder = selectBox.querySelector('.placeholder');
      if (placeholder) {
        placeholder.style.display = 'inline';
        placeholder.style.color = 'transparent';
      }
      return;
    }

    const isStepFieldsDisabled = state.viewOnly || state.draft.processStatus === 'active';
    selectBox.style.backgroundColor = isStepFieldsDisabled ? '#f1f5f9' : '#ffffff';
    selectBox.style.cursor = isStepFieldsDisabled ? 'not-allowed' : 'pointer';
    selectBox.style.opacity = isStepFieldsDisabled ? '0.8' : '1';

    const checkedCheckboxes = [...container.querySelectorAll('.dropdown-menu input.org-item-checkbox:checked')];
    const selected = step.status === 'Chờ phân công'
      ? checkedCheckboxes.map(input => input.value)
      : (step.orgs || []);

    step.orgs = selected;
    step.org = selected.join(', ');

    updateDropdownSummary(container, selected, step.status === 'Chờ phân công');
  };

  const renderStepOrgChoices = step => {
    const container = elements.nodeForm.querySelector('.process-step-org-dropdown');
    if (!container) return;
    const selectedOrgs = step.orgs || (step.org ? [step.org] : []);
    const isStepFieldsDisabled = state.viewOnly || state.draft.processStatus === 'active';

    const isApproval = step.status === 'Phê duyệt' || step.status === 'Phê duyệt báo cáo';
    const isMulti = step.status === 'Chờ phân công';

    if (isApproval) {
      container.innerHTML = `
        <div class="select-box" style="background-color: #ffffff; cursor: not-allowed; opacity: 1;">
          <span class="placeholder" style="color: transparent;">Chọn cơ quan...</span>
          <svg class="arrow-icon" viewBox="0 0 24 24" style="display: none;"><path d="M7 10l5 5 5-5z"/></svg>
        </div>
        <div class="dropdown-menu" style="display: none !important;"></div>
      `;
      updateStepOrgSummary(step);
      return;
    }

    const isAllSelected = orgList.length > 0 && orgList.every(org => selectedOrgs.includes(org));

    let menuContent = '';
    if (isMulti) {
      menuContent = `
        <label class="dropdown-item select-all-item">
          <input type="checkbox" id="selectAllOrgs" ${isAllSelected ? 'checked' : ''} ${isStepFieldsDisabled ? 'disabled' : ''}>
          <span style="font-weight: bold; color: var(--admin-text);">Chọn tất cả</span>
        </label>
        ${orgList.map(org => `
          <label class="dropdown-item">
            <input type="checkbox" class="org-item-checkbox" value="${escapeText(org)}" ${selectedOrgs.includes(org) ? 'checked' : ''} ${isStepFieldsDisabled ? 'disabled' : ''}>
            <span>${escapeText(org)}</span>
          </label>
        `).join('')}
      `;
    } else {
      menuContent = orgList.map(org => `
        <div class="dropdown-item" data-step-org-val="${escapeText(org)}">
          <span>${escapeText(org)}</span>
        </div>
      `).join('');
    }

    container.innerHTML = `
      <div class="select-box" ${isStepFieldsDisabled ? 'style="background-color: #f1f5f9; cursor: not-allowed; opacity: 0.8;"' : ''}>
        <span class="placeholder">Chọn cơ quan...</span>
        <input type="text" placeholder="Gõ để tìm kiếm nhanh..." class="dropdown-search-input" style="display: none; width: 100%; border: none; outline: none; background: transparent; font-size: 13px; font-weight: normal; color: var(--admin-text); padding: 0;">
        <svg class="arrow-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
      </div>
      <div class="dropdown-menu">
        ${menuContent}
      </div>
    `;
    updateStepOrgSummary(step);
    bindAutoComplete(container);
  };
  const getActionName = (stepId, targetNodeId) => {
    if (targetNodeId === 'end') return 'Chuyển xử lý';
    if (targetNodeId === 'start') return 'Trả về';
    const nodes = state.draft?.nodes || [];
    const currentIdx = nodes.findIndex(n => n.id === stepId);
    const targetIdx = nodes.findIndex(n => n.id === targetNodeId);
    if (currentIdx !== -1 && targetIdx !== -1 && targetIdx < currentIdx) {
      return 'Trả về';
    }
    return 'Chuyển xử lý';
  };

  const renderStepForm = step => {
    const isStepFieldsDisabled = state.viewOnly || state.draft.processStatus === 'active';

    elements.nodeForm.innerHTML = `
      <div class="form-grid">
        <div class="form-group full-width">
          <label>Tên bước <span class="required">*</span></label>
          <input type="text" class="form-control" data-step-field="unitName" value="${escapeText(step.unitName)}" ${isStepFieldsDisabled ? 'disabled style="background-color: #f1f5f9; cursor: not-allowed;"' : ''}>
        </div>
        <div class="form-group full-width">
          <label>Trạng thái xử lý <span class="required">*</span></label>
          <div class="multiselect-container process-step-status-dropdown">
            <!-- Render động -->
          </div>
        </div>
        <div class="form-group full-width">
          <label>Cơ quan xử lý <span class="required">*</span></label>
          <div class="multiselect-container process-step-org-dropdown">
            <!-- Render động -->
          </div>
        </div>
        <div class="form-group full-width">
          <label>Người xử lý <span class="required">*</span></label>
          <div class="multiselect-container process-assignee-multiselect">
            <!-- Render động -->
          </div>
        </div>
        <div class="form-group full-width">
          <label>Mô tả ngắn</label>
          <input type="text" class="form-control" data-step-field="description" placeholder="Nhập mô tả ngắn cho bước này..." value="${escapeText(step.description)}" ${state.draft.processStatus === 'active' ? 'disabled style="background-color: #f1f5f9; cursor: not-allowed;"' : ''}>
        </div>
      </div>
    `;
    elements.saveNode.hidden = state.viewOnly;
    elements.nodeOverlay.hidden = false;

    renderStepStatusChoices(step);
    renderStepOrgChoices(step);
    renderStepAssigneeChoices(step);
  };
  const clearValidationErrors = container => {
    if (!container) return;
    container.querySelectorAll('.field-error-msg').forEach(el => el.remove());
    container.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
  };
  const showFieldError = (targetElement, message) => {
    if (!targetElement) return;
    targetElement.classList.add('has-error');
    const parent = targetElement.closest('.form-group') || targetElement.closest('.form-row') || targetElement.parentElement;
    if (parent) {
      parent.querySelectorAll('.field-error-msg').forEach(el => el.remove());
      const msg = document.createElement('span');
      msg.className = 'field-error-msg';
      msg.textContent = `* ${message}`;
      parent.appendChild(msg);
    }
  };
  const openStep = id => { const step = state.draft?.nodes.find(item => item.id === id); if (!step) return; state.selectedStepId = id; renderSteps(); renderStepForm(step); };
  const saveStep = () => {
    clearValidationErrors(elements.nodeForm);
    let isValid = true;
    const step = state.draft?.nodes.find(item => item.id === state.selectedStepId);
    if (!step) return;
    const assignees = [...elements.nodeForm.querySelectorAll('[data-step-assignee]:checked')].map(input => input.value);
    const unitNameInput = elements.nodeForm.querySelector('[data-step-field="unitName"]');
    const statusContainer = elements.nodeForm.querySelector('.process-step-status-dropdown');
    const orgContainer = elements.nodeForm.querySelector('.process-step-org-dropdown');
    const assigneeContainer = elements.nodeForm.querySelector('.process-assignee-multiselect');

    if (!step.unitName.trim()) {
      showFieldError(unitNameInput, 'Tên bước không được để trống.');
      isValid = false;
    }
    if (!step.status) {
      showFieldError(statusContainer, 'Vui lòng chọn trạng thái xử lý.');
      isValid = false;
    }
    const isApproval = step.status === 'Chờ phê duyệt' || step.status === 'Phê duyệt báo cáo';
    if (!isApproval) {
      if (!step.org) {
        showFieldError(orgContainer, 'Vui lòng chọn cơ quan xử lý.');
        isValid = false;
      }
      if (!assignees.length) {
        showFieldError(assigneeContainer, 'Vui lòng chọn ít nhất một người xử lý.');
        isValid = false;
      }
    }
    if (!isValid) return;

    step.assignees = assignees;
    step.persisted = true;
    if (!step.actions.length) step.actions.push({ name: 'Chuyển xử lý', nextNodeId: 'end' });
    elements.nodeOverlay.hidden = true;
    showError('');
    renderSteps();
  };
  const showCustomConfirm = (message, onConfirm) => {
    const overlay = document.getElementById('confirmDialogOverlay');
    const msgEl = document.getElementById('confirmDialogMessage');
    const btnCancel = document.getElementById('confirmDialogCancel');
    const btnOk = document.getElementById('confirmDialogOk');

    if (!overlay || !msgEl || !btnCancel || !btnOk) {
      if (window.confirm(message)) onConfirm();
      return;
    }

    msgEl.textContent = message;
    overlay.hidden = false;

    const newBtnOk = btnOk.cloneNode(true);
    const newBtnCancel = btnCancel.cloneNode(true);
    btnOk.parentNode.replaceChild(newBtnOk, btnOk);
    btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

    newBtnOk.addEventListener('click', () => {
      overlay.hidden = true;
      onConfirm();
    });
    newBtnCancel.addEventListener('click', () => {
      overlay.hidden = true;
    });
  };

  const showCustomAlert = (message) => {
    const overlay = document.getElementById('confirmDialogOverlay');
    const msgEl = document.getElementById('confirmDialogMessage');
    const btnCancel = document.getElementById('confirmDialogCancel');
    const btnOk = document.getElementById('confirmDialogOk');

    if (!overlay || !msgEl || !btnCancel || !btnOk) {
      window.alert(message);
      return;
    }

    msgEl.textContent = message;
    overlay.hidden = false;
    btnCancel.style.display = 'none';

    const newBtnOk = btnOk.cloneNode(true);
    btnOk.parentNode.replaceChild(newBtnOk, btnOk);
    newBtnOk.textContent = 'Đóng';

    newBtnOk.addEventListener('click', () => {
      overlay.hidden = true;
      btnCancel.style.display = '';
      newBtnOk.textContent = 'Đồng ý';
    });
  };

  const saveProcess = (isPublish = false) => {
    clearValidationErrors(elements.form);
    let isValid = true;
    const draft = state.draft;
    draft.name = elements.name.value.trim();
    draft.version = elements.versionInput.value.trim();
    draft.scope = state.draft.scope;
    draft.description = elements.description.value.trim();
    draft.orgs = [...elements.orgs.querySelectorAll('.process-org-checkbox:checked')].map(input => input.value);

    if (!draft.name) {
      showFieldError(elements.name, 'Tên quy trình không được để trống.');
      isValid = false;
    }
    if (!draft.version) {
      showFieldError(elements.versionInput, 'Phiên bản không được để trống.');
      isValid = false;
    }
    if (!draft.scope) {
      showFieldError(elements.scopeContainer, 'Vui lòng chọn phạm vi.');
      isValid = false;
    }
    if (!draft.orgs.length) {
      showFieldError(elements.orgs, 'Vui lòng chọn ít nhất một cơ quan áp dụng.');
      isValid = false;
    }
    if (!draft.nodes.length) {
      showError('Quy trình phải có ít nhất một bước xử lý giữa Bắt đầu và Kết thúc.');
      isValid = false;
    } else if (draft.nodes.some(step => !step.persisted)) {
      showError('Vui lòng lưu cấu hình các bước mới trước khi lưu quy trình.');
      isValid = false;
    } else {
      showError('');
    }
    if (!isValid) return;

    draft.id ||= `process-${Date.now()}`;
    draft.deleted = false;

    if (isPublish) {
      draft.processStatus = 'active';
      draft.active = true;
    } else {
      if (state.editingId) {
        const original = state.rows.find(row => row.id === state.editingId);
        if (original) {
          draft.processStatus = original.processStatus;
          draft.active = original.active;
        } else {
          draft.processStatus = 'draft';
          draft.active = false;
        }
      } else {
        draft.processStatus = 'draft';
        draft.active = false;
      }
    }

    compatibilityFields(draft);
    if (state.editingId) {
      Object.assign(state.rows.find(row => row.id === state.editingId), clone(draft));
    } else {
      state.rows.push(clone(draft));
    }
    closeEditor();
    state.page = 1;
    renderList();
    showNotice(`Đã ${isPublish ? 'phát hành' : 'lưu'} quy trình "${draft.name}".`);
  };
  const closeFilterPanel = () => { elements.filterPanel.classList.remove('show'); elements.filterToggle.classList.remove('active'); };
  const applyProcessFilters = () => {
    state.search = elements.search.value;
    state.version = elements.version.value;
    state.page = 1;
    renderList();
  };
  elements.searchButton.addEventListener('click', applyProcessFilters);
  elements.search.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); applyProcessFilters(); } });
  elements.filterToggle.addEventListener('click', () => { elements.filterPanel.classList.toggle('show'); elements.filterToggle.classList.toggle('active'); });
  elements.refresh.addEventListener('click', () => {
    state.search = state.active = state.scope = state.org = state.version = '';
    elements.search.value = '';
    elements.version.value = '';
    state.page = 1;
    showNotice('');
    renderList();
  });
  elements.add.addEventListener('click', () => openEditor());
  elements.pageSize.addEventListener('change', () => { state.pageSize = Number(elements.pageSize.value); state.page = 1; renderList(); });
  elements.pages.addEventListener('click', event => { const button = event.target.closest('[data-process-page]'); if (button) { state.page = Number(button.dataset.processPage); renderList(); } });
  elements.body.addEventListener('click', event => {
    const toggle = event.target.closest('[data-process-toggle]'); if (toggle) { const row = state.rows.find(item => item.id === toggle.dataset.processToggle); row.active = !row.active; renderList(); return; } const menuButton = event.target.closest('[data-process-menu]'); if (menuButton) { const panel = elements.body.querySelector(`[data-process-menu-panel="${menuButton.dataset.processMenu}"]`); const wasHidden = panel.hidden; closeMenus(); panel.hidden = !wasHidden; return; } const action = event.target.closest('[data-process-action]'); if (!action) return; const row = state.rows.find(item => item.id === action.dataset.processId); closeMenus(); if (action.dataset.processAction === 'view') openEditor(row.id, true); if (action.dataset.processAction === 'edit') openEditor(row.id); if (action.dataset.processAction === 'clone') openEditor(row.id, false, true); if (action.dataset.processAction === 'delete') {
      if (row.processStatus === 'active') {
        showCustomAlert(`Quy trình "${row.name}" đang hoạt động, không được phép xóa!`);
      } else {
        showCustomConfirm(`Bạn có chắc chắn muốn xóa quy trình "${row.name}"?`, () => {
          row.deleted = true;
          row.active = false;
          renderList();
          showNotice(`Đã xóa quy trình "${row.name}".`);
        });
      }
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.process-more')) closeMenus();
    if (!event.target.closest('#processOrgsContainer')) { elements.orgs.classList.remove('open'); }
    if (!event.target.closest('#processScopeContainer')) { elements.scopeContainer.classList.remove('open'); }
    if (!event.target.closest('#filterProcessOrgContainer')) { elements.filterOrgContainer.classList.remove('open'); }
    if (!event.target.closest('#filterProcessScopeContainer')) { elements.filterScopeContainer.classList.remove('open'); }
    if (elements.activeContainer && !event.target.closest('#filterProcessActiveContainer')) { elements.activeContainer.classList.remove('open'); }
    if (!event.target.closest('.process-assignee-multiselect')) {
      const container = elements.nodeForm.querySelector('.process-assignee-multiselect');
      if (container) container.classList.remove('open');
    }
    if (!event.target.closest('.process-step-status-dropdown')) {
      const container = elements.nodeForm.querySelector('.process-step-status-dropdown');
      if (container) container.classList.remove('open');
    }
    if (!event.target.closest('.process-step-org-dropdown')) {
      const container = elements.nodeForm.querySelector('.process-step-org-dropdown');
      if (container) container.classList.remove('open');
    }
    if (!event.target.closest('.step-action-menu-container')) {
      document.querySelectorAll('.step-action-dropdown').forEach(menu => { menu.hidden = true; });
    }
  });

  elements.orgs.addEventListener('click', event => {
    if (state.viewOnly) return;
    if (event.target.closest('.select-box') && !event.target.classList.contains('remove-tag') && !event.target.classList.contains('dropdown-search-input')) {
      elements.orgs.classList.toggle('open');
      if (elements.orgs.classList.contains('open')) {
        const searchInput = elements.orgs.querySelector('.dropdown-search-input');
        if (searchInput) {
          searchInput.value = '';
          elements.orgs.querySelectorAll('.dropdown-item').forEach(item => item.style.display = 'flex');
          setTimeout(() => searchInput.focus(), 50);
        }
      }
    }
  });

  elements.orgs.addEventListener('input', event => {
    if (event.target.classList.contains('dropdown-search-input')) {
      const query = event.target.value.toLowerCase().trim();
      const items = elements.orgs.querySelectorAll('.dropdown-item:not(.select-all-item)');
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
      });
    }
  });
  elements.orgs.addEventListener('change', event => {
    if (event.target.id === 'selectAllProcessOrgs') {
      const checked = event.target.checked;
      const checkBoxes = elements.orgs.querySelectorAll('.process-org-checkbox');
      checkBoxes.forEach(cb => {
        if (!cb.disabled) cb.checked = checked;
      });
    } else {
      const selectAllCb = elements.orgs.querySelector('#selectAllProcessOrgs');
      const checkBoxes = [...elements.orgs.querySelectorAll('.process-org-checkbox')];
      if (selectAllCb) {
        selectAllCb.checked = checkBoxes.length > 0 && checkBoxes.every(cb => cb.checked);
      }
    }
    updateOrganizationSummary();
  });

  elements.scopeContainer.addEventListener('click', event => {
    if (state.viewOnly) return;
    const selectBox = event.target.closest('.select-box');
    if (selectBox && !event.target.classList.contains('dropdown-search-input')) {
      elements.scopeContainer.classList.toggle('open');
      if (elements.scopeContainer.classList.contains('open')) {
        const searchInput = elements.scopeContainer.querySelector('.dropdown-search-input');
        if (searchInput) {
          searchInput.value = '';
          elements.scopeContainer.querySelectorAll('.dropdown-item').forEach(item => item.style.display = 'flex');
          setTimeout(() => searchInput.focus(), 50);
        }
      }
      return;
    }
    const item = event.target.closest('[data-scope-val]');
    if (item) {
      state.draft.scope = item.dataset.scopeVal;
      updateScopeSummary();
      elements.scopeContainer.classList.remove('open');
    }
  });

  elements.scopeContainer.addEventListener('input', event => {
    if (event.target.classList.contains('dropdown-search-input')) {
      const query = event.target.value.toLowerCase().trim();
      const items = elements.scopeContainer.querySelectorAll('.dropdown-item');
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
      });
    }
  });

  // Filter Nhóm giám sát
  elements.filterScopeContainer.addEventListener('click', event => {
    const selectBox = event.target.closest('.select-box');
    if (selectBox && !event.target.classList.contains('dropdown-search-input')) {
      elements.filterScopeContainer.classList.toggle('open');
      if (elements.filterScopeContainer.classList.contains('open')) {
        const searchInput = elements.filterScopeContainer.querySelector('.dropdown-search-input');
        if (searchInput) {
          searchInput.value = '';
          elements.filterScopeContainer.querySelectorAll('.dropdown-item').forEach(item => item.style.display = 'flex');
          setTimeout(() => searchInput.focus(), 50);
        }
      }
      return;
    }
    const item = event.target.closest('[data-filter-scope-val]');
    if (item) {
      state.scope = item.dataset.filterScopeVal;
      updateDropdownSummary(elements.filterScopeContainer, state.scope ? [state.scope] : [], false);
      elements.filterScopeContainer.classList.remove('open');
      applyProcessFilters();
    }
  });

  // Filter Cơ quan
  elements.filterOrgContainer.addEventListener('click', event => {
    const selectBox = event.target.closest('.select-box');
    if (selectBox && !event.target.classList.contains('dropdown-search-input')) {
      elements.filterOrgContainer.classList.toggle('open');
      if (elements.filterOrgContainer.classList.contains('open')) {
        const searchInput = elements.filterOrgContainer.querySelector('.dropdown-search-input');
        if (searchInput) {
          searchInput.value = '';
          elements.filterOrgContainer.querySelectorAll('.dropdown-item').forEach(item => item.style.display = 'flex');
          setTimeout(() => searchInput.focus(), 50);
        }
      }
      return;
    }
    const item = event.target.closest('[data-filter-org-val]');
    if (item) {
      state.org = item.dataset.filterOrgVal;
      updateDropdownSummary(elements.filterOrgContainer, state.org ? [state.org] : [], false);
      elements.filterOrgContainer.classList.remove('open');
      applyProcessFilters();
    }
  });

  if (elements.activeContainer) {
    elements.activeContainer.addEventListener('click', event => {
      const selectBox = event.target.closest('.select-box');
      if (selectBox && !event.target.classList.contains('dropdown-search-input')) {
        elements.activeContainer.classList.toggle('open');
        if (elements.activeContainer.classList.contains('open')) {
          const searchInput = elements.activeContainer.querySelector('.dropdown-search-input');
          if (searchInput) {
            searchInput.value = '';
            elements.activeContainer.querySelectorAll('.dropdown-item').forEach(item => item.style.display = 'flex');
            setTimeout(() => searchInput.focus(), 50);
          }
        }
        return;
      }
      const item = event.target.closest('[data-filter-active-val]');
      if (item) {
        state.active = item.dataset.filterActiveVal;
        const label = item.querySelector('span').textContent;
        updateDropdownSummary(elements.activeContainer, state.active ? [label] : [], false);
        elements.activeContainer.classList.remove('open');
        applyProcessFilters();
      }
    });
  }

  elements.addStep.addEventListener('click', () => {
    const step = {
      id: `step-${Date.now()}`,
      unitName: `Bước xử lý ${state.draft.nodes.length + 1}`,
      status: statusList[0],
      orgs: [],
      org: '',
      assignees: [],
      description: '',
      actions: [{ name: 'Chuyển xử lý', nextNodeId: 'end' }],
      persisted: false
    };
    state.draft.nodes.push(step);

    state.draft.nodes.forEach((n, idx) => {
      n.order = idx + 1;
      n.parentNodeId = idx > 0 ? state.draft.nodes[idx - 1].id : null;
      if (n.actions) {
        n.actions.forEach(act => {
          if (act.name === 'Chuyển xử lý' || act.name === 'Phê duyệt') {
            act.nextNodeId = state.draft.nodes[idx + 1]?.id || 'end';
          } else if (act.name === 'Trả về' || act.name === 'Từ chối') {
            act.nextNodeId = idx > 0 ? state.draft.nodes[idx - 1].id : 'start';
          }
        });
      }
    });

    state.selectedStepId = step.id;
    renderSteps();
    renderStepForm(step);
  });

  elements.steps.addEventListener('click', event => {
    const menuToggle = event.target.closest('[data-step-menu-toggle]');
    if (menuToggle) {
      event.stopPropagation();
      const stepId = menuToggle.dataset.stepMenuToggle;
      const menu = elements.steps.querySelector(`[data-step-menu-panel="${stepId}"]`);
      if (menu) {
        const wasHidden = menu.hidden;
        document.querySelectorAll('.step-action-dropdown').forEach(m => { m.hidden = true; });
        menu.hidden = !wasHidden;
      }
      return;
    }
    const editAct = event.target.closest('[data-step-act-edit]');
    if (editAct) {
      event.stopPropagation();
      document.querySelectorAll('.step-action-dropdown').forEach(m => { m.hidden = true; });
      openStep(editAct.dataset.stepActEdit);
      return;
    }
    const addAct = event.target.closest('[data-step-act-add-action]');
    if (addAct) {
      event.stopPropagation();
      document.querySelectorAll('.step-action-dropdown').forEach(m => { m.hidden = true; });
      openStepActions(addAct.dataset.stepActAddAction);
      return;
    }
    const delAct = event.target.closest('[data-step-act-del]');
    if (delAct && !state.viewOnly) {
      event.stopPropagation();
      document.querySelectorAll('.step-action-dropdown').forEach(m => { m.hidden = true; });
      deleteStep(delAct.dataset.stepActDel);
      return;
    }
    const item = event.target.closest('[data-new-step-id]');
    if (item && !item.classList.contains('fixed')) openStep(item.dataset.newStepId);
  });

  elements.diagram.addEventListener('click', event => {
    const menuToggle = event.target.closest('[data-step-menu-toggle]');
    if (menuToggle) {
      event.stopPropagation();
      const stepId = menuToggle.dataset.stepMenuToggle;
      const menu = elements.diagram.querySelector(`[data-step-menu-panel="${stepId}"]`);
      if (menu) {
        const wasHidden = menu.hidden;
        document.querySelectorAll('.step-action-dropdown').forEach(m => { m.hidden = true; });
        menu.hidden = !wasHidden;
      }
      return;
    }
    const editAct = event.target.closest('[data-step-act-edit]');
    if (editAct) {
      event.stopPropagation();
      document.querySelectorAll('.step-action-dropdown').forEach(m => { m.hidden = true; });
      openStep(editAct.dataset.stepActEdit);
      return;
    }
    const addAct = event.target.closest('[data-step-act-add-action]');
    if (addAct) {
      event.stopPropagation();
      document.querySelectorAll('.step-action-dropdown').forEach(m => { m.hidden = true; });
      openStepActions(addAct.dataset.stepActAddAction);
      return;
    }
    const delAct = event.target.closest('[data-step-act-del]');
    if (delAct && !state.viewOnly) {
      event.stopPropagation();
      document.querySelectorAll('.step-action-dropdown').forEach(m => { m.hidden = true; });
      deleteStep(delAct.dataset.stepActDel);
      return;
    }
    const node = event.target.closest('.circle-node');
    if (node) {
      const stepId = node.dataset.newStepId;
      if (stepId && stepId !== 'start' && stepId !== 'end') openStep(stepId);
    }
  });

  const updateDiagramTransform = () => {
    const wrapper = elements.diagram.querySelector('.pe-diagram-zoom-wrapper');
    if (wrapper) {
      wrapper.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
    }
  };

  elements.diagram.style.overflow = 'hidden';
  elements.diagram.style.position = 'relative';

  elements.diagram.addEventListener('mousedown', event => {
    if (event.target.closest('button') || event.target.closest('.step-action-dropdown') || event.target.closest('.circle-node') || event.target.closest('.decision-wrapper')) return;
    state.isPanning = true;
    const wrapper = elements.diagram.querySelector('.pe-diagram-zoom-wrapper');
    if (wrapper) wrapper.style.cursor = 'grabbing';
    state.startX = event.clientX - state.panX;
    state.startY = event.clientY - state.panY;
  });

  elements.diagram.addEventListener('mousemove', event => {
    if (!state.isPanning) return;
    state.panX = event.clientX - state.startX;
    state.panY = event.clientY - state.startY;
    updateDiagramTransform();
  });

  const stopPanning = () => {
    state.isPanning = false;
    const wrapper = elements.diagram.querySelector('.pe-diagram-zoom-wrapper');
    if (wrapper) wrapper.style.cursor = 'grab';
  };

  elements.diagram.addEventListener('mouseup', stopPanning);
  elements.diagram.addEventListener('mouseleave', stopPanning);

  elements.diagram.addEventListener('wheel', event => {
    event.preventDefault();
    const zoomFactor = 0.05;
    if (event.deltaY < 0) {
      state.zoom = Math.min(3.0, state.zoom + zoomFactor);
    } else {
      state.zoom = Math.max(0.5, state.zoom - zoomFactor);
    }
    updateDiagramTransform();
  }, { passive: false });

  elements.nodeForm.addEventListener('input', event => {
    if (event.target.classList.contains('dropdown-search-input')) {
      const container = event.target.closest('.multiselect-container');
      if (container) {
        const query = event.target.value.toLowerCase().trim();
        const items = container.querySelectorAll('.dropdown-item:not(.select-all-item)');
        items.forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(query) ? 'flex' : 'none';
        });
      }
      return;
    }
    const step = state.draft?.nodes.find(item => item.id === state.selectedStepId);
    if (!step) return;
    const field = event.target.dataset.stepField;
    if (field) {
      step[field] = event.target.value;
      if (field === 'status' && event.target.value === 'Chờ phê duyệt') {
        step.actions = [{ name: 'Chuyển xử lý', nextNodeId: 'end' }, { name: 'Trả xử lý', nextNodeId: step.parentNodeId || 'start' }];
        renderStepForm(step);
      } else if (field === 'status' && event.target.value !== 'Chờ phê duyệt') {
        step.actions = [{ name: 'Chuyển xử lý', nextNodeId: 'end' }];
        renderStepForm(step);
      }
      if (field === 'unitName') renderSteps();
    }
    const actionName = event.target.dataset.stepActionName;
    if (actionName !== undefined) step.actions[Number(actionName)].name = event.target.value;
  });

  elements.nodeForm.addEventListener('change', event => {
    const step = state.draft?.nodes.find(item => item.id === state.selectedStepId);
    if (!step) return;

    if (event.target.id === 'selectAllOrgs') {
      const checked = event.target.checked;
      const container = elements.nodeForm.querySelector('.process-step-org-dropdown');
      if (container) {
        const checkBoxes = container.querySelectorAll('.org-item-checkbox');
        checkBoxes.forEach(cb => {
          if (!cb.disabled) cb.checked = checked;
        });
      }
      updateStepOrgSummary(step);
      checkDefaultAssignee(step);
      renderStepAssigneeChoices(step);
      renderSteps();
      return;
    }

    const next = event.target.dataset.stepActionNext;
    if (next !== undefined) {
      step.actions[Number(next)].nextNodeId = event.target.value;
      renderSteps();
      return;
    }
    const nameIdx = event.target.dataset.stepActionName;
    if (nameIdx !== undefined) {
      step.actions[Number(nameIdx)].name = event.target.value;
      renderSteps();
      return;
    }
    const approvalNext = event.target.dataset.stepApprovalActionNext;
    if (approvalNext !== undefined) {
      if (!step.actions || step.actions.length < 2) {
        step.actions = [{ name: 'Phê duyệt', nextNodeId: 'end' }, { name: 'Từ chối', nextNodeId: step.parentNodeId || 'start' }];
      }
      step.actions[Number(approvalNext)].nextNodeId = event.target.value;
      renderSteps();
    }
    if (event.target.closest('.process-step-org-dropdown')) {
      const container = elements.nodeForm.querySelector('.process-step-org-dropdown');
      if (container) {
        const selectAllCb = container.querySelector('#selectAllOrgs');
        const checkBoxes = [...container.querySelectorAll('.org-item-checkbox')];
        if (selectAllCb) {
          selectAllCb.checked = checkBoxes.length > 0 && checkBoxes.every(cb => cb.checked);
        }
      }
      updateStepOrgSummary(step);
      checkDefaultAssignee(step);
      renderStepAssigneeChoices(step);
      renderSteps();
    }

    if (event.target.id === 'selectAllAssignees') {
      const checked = event.target.checked;
      const container = elements.nodeForm.querySelector('.process-assignee-multiselect');
      if (container) {
        const checkBoxes = container.querySelectorAll('[data-step-assignee]');
        checkBoxes.forEach(cb => {
          if (!cb.disabled) cb.checked = checked;
        });
      }
      updateStepAssigneeSummary(step);
      renderSteps();
      return;
    }

    if (event.target.closest('.process-assignee-multiselect')) {
      const container = elements.nodeForm.querySelector('.process-assignee-multiselect');
      if (container) {
        const selectAllCb = container.querySelector('#selectAllAssignees');
        const checkBoxes = [...container.querySelectorAll('[data-step-assignee]')];
        if (selectAllCb) {
          selectAllCb.checked = checkBoxes.length > 0 && checkBoxes.every(cb => cb.checked);
        }
      }
      updateStepAssigneeSummary(step);
      renderSteps();
    }
  });

  elements.nodeForm.addEventListener('click', event => {
    const step = state.draft?.nodes.find(item => item.id === state.selectedStepId);
    if (!step) return;
    const isStepFieldsDisabled = state.viewOnly || state.draft.processStatus === 'active';
    const statusSelectBox = event.target.closest('.process-step-status-dropdown .select-box');
    if (statusSelectBox && !event.target.classList.contains('dropdown-search-input')) {
      if (isStepFieldsDisabled) return;
      const container = elements.nodeForm.querySelector('.process-step-status-dropdown');
      if (container) container.classList.toggle('open');
      return;
    }
    const statusItem = event.target.closest('[data-step-status-val]');
    if (statusItem) {
      if (isStepFieldsDisabled) return;
      step.status = statusItem.dataset.stepStatusVal;

      if (step.status === 'Chờ phê duyệt' || step.status === 'Phê duyệt báo cáo') {
        step.orgs = [];
        step.org = '';
        step.assignees = [];
      }

      updateStepStatusSummary(step);
      const container = elements.nodeForm.querySelector('.process-step-status-dropdown');
      if (container) container.classList.remove('open');
      if (step.status === 'Chờ phê duyệt') {
        step.actions = [{ name: 'Chuyển xử lý', nextNodeId: 'end' }, { name: 'Trả về', nextNodeId: step.parentNodeId || 'start' }];
      } else {
        step.actions = [{ name: 'Chuyển xử lý', nextNodeId: 'end' }];
      }
      renderStepForm(step);
      renderSteps();
      return;
    }
    const orgSelectBox = event.target.closest('.process-step-org-dropdown .select-box');
    if (orgSelectBox && !event.target.classList.contains('remove-tag') && !event.target.classList.contains('dropdown-search-input')) {
      if (isStepFieldsDisabled || step.status === 'Chờ phê duyệt') return;
      const container = elements.nodeForm.querySelector('.process-step-org-dropdown');
      if (container) {
        container.classList.toggle('open');
        if (container.classList.contains('open')) {
          const searchInput = container.querySelector('.dropdown-search-input');
          if (searchInput) {
            searchInput.value = '';
            container.querySelectorAll('.dropdown-item').forEach(item => item.style.display = 'flex');
            setTimeout(() => searchInput.focus(), 50);
          }
        }
      }
      return;
    }
    const orgItem = event.target.closest('[data-step-org-val]');
    if (orgItem) {
      if (isStepFieldsDisabled || step.status === 'Chờ phê duyệt') return;
      step.orgs = [orgItem.dataset.stepOrgVal];
      step.org = orgItem.dataset.stepOrgVal;
      updateStepOrgSummary(step);
      checkDefaultAssignee(step);
      renderStepAssigneeChoices(step);
      renderSteps();
      const container = elements.nodeForm.querySelector('.process-step-org-dropdown');
      if (container) container.classList.remove('open');
      return;
    }
    const assigneeSelectBox = event.target.closest('.process-assignee-multiselect .select-box');
    if (assigneeSelectBox) {
      if (isStepFieldsDisabled || step.status === 'Chờ phê duyệt' || step.status === 'Phê duyệt báo cáo') return;
      const container = elements.nodeForm.querySelector('.process-assignee-multiselect');
      if (container) container.classList.toggle('open');
      return;
    }
    const addActionIcon = event.target.closest('#addStepActionIcon');
    if (addActionIcon && !isStepFieldsDisabled) {
      if (!step.actions) step.actions = [];
      step.actions.push({ name: 'Chuyển xử lý', nextNodeId: 'end' });
      renderStepForm(step);
      renderSteps();
      return;
    }
    const removeBtn = event.target.closest('[data-delete-step-action]');
    if (removeBtn && !isStepFieldsDisabled) {
      const idx = Number(removeBtn.dataset.deleteStepAction);
      step.actions.splice(idx, 1);
      renderStepForm(step);
      renderSteps();
      return;
    }
  });

  elements.saveNode.addEventListener('click', saveStep);
  elements.closeNode.addEventListener('click', () => { elements.nodeOverlay.hidden = true; });
  elements.form.addEventListener('submit', event => { event.preventDefault(); });

  const btnDraft = document.getElementById('draftProcessEditor');
  const btnPublish = document.getElementById('publishProcessEditor');

  if (btnDraft) {
    btnDraft.addEventListener('click', () => {
      saveProcess(false);
    });
  }

  if (btnPublish) {
    btnPublish.addEventListener('click', () => {
      const isCurrentlyActive = state.draft && state.draft.processStatus === 'active';
      if (isCurrentlyActive) {
        showCustomConfirm("Bạn có xác nhận nâng cấp phiên bản của quy trình này không?", () => {
          const currentVer = parseFloat(state.draft.version) || 1.0;
          state.draft.version = (currentVer + 0.1).toFixed(1);
          elements.versionInput.value = state.draft.version;
          saveProcess(true);
        });
      } else {
        showCustomConfirm("Bạn có xác nhận phát hành quy trình này không?", () => {
          saveProcess(true);
        });
      }
    });
  }

  elements.clone.addEventListener('click', () => { if (state.draft?.id) openEditor(state.draft.id, false, true); });
  if (elements.close) elements.close.addEventListener('click', closeEditor);
  elements.cancel.addEventListener('click', closeEditor);
  elements.overlay.addEventListener('click', event => { if (event.target === elements.overlay) closeEditor(); });


  let currentActionsDraft = [];
  let currentActionsStepId = null;

  const openStepActions = (stepId) => {
    currentActionsStepId = stepId;
    const step = state.draft?.nodes.find(n => n.id === stepId);
    if (!step) return;

    if (!step.actions || step.actions.length === 0) {
      currentActionsDraft = [{ name: 'Chuyển xử lý', nextNodeId: 'end' }];
    } else {
      currentActionsDraft = clone(step.actions);
    }
    elements.actionsOverlay.hidden = false;
    renderActionsPopupList();
  };

  const renderActionsPopupList = () => {
    const isLocked = state.viewOnly || state.draft.processStatus === 'active';
    const currentStep = state.draft?.nodes.find(n => n.id === currentActionsStepId);
    const isEndStep = currentStep && currentStep.status === 'Đã kết thúc';

    elements.actionsTable.innerHTML = currentActionsDraft.map((action, index) => {
      const actName = action.name || 'Chuyển xử lý';

      let nextSelectHtml = '';
      if (isEndStep && actName === 'Chuyển xử lý') {
        nextSelectHtml = `
          <select data-popup-action-next="${index}" disabled style="padding: 6px 10px; border: 1px solid var(--admin-line); border-radius: var(--admin-radius-md); font-size: 13px; background-color: #f1f5f9; cursor: not-allowed; width: 100%;">
            <option value="end" selected> </option>
          </select>
        `;
      } else {
        nextSelectHtml = `
          <select data-popup-action-next="${index}" ${isLocked ? 'disabled style="background-color: #f1f5f9; cursor: not-allowed;"' : ''} style="padding: 6px 10px; border: 1px solid var(--admin-line); border-radius: var(--admin-radius-md); font-size: 13px; width: 100%;">
            ${actionOptions(state.draft, action.nextNodeId, currentActionsStepId, actName)}
          </select>
        `;
      }

      return `
        <div class="process-step-action-row" style="display: grid; grid-template-columns: 1.5fr 2fr auto; gap: 10px; align-items: center; margin-bottom: 8px;">
          <select data-popup-action-name="${index}" ${isLocked ? 'disabled style="background-color: #f1f5f9; cursor: not-allowed;"' : ''} style="padding: 6px 10px; border: 1px solid var(--admin-line); border-radius: var(--admin-radius-md); font-size: 13px; font-weight: bold; color: var(--admin-text);">
            <option value="Chuyển xử lý" ${actName === 'Chuyển xử lý' ? 'selected' : ''}>Chuyển xử lý</option>
            <option value="Trả về" ${actName === 'Trả về' ? 'selected' : ''}>Trả về</option>
          </select>
          ${nextSelectHtml}
          <button class="act-btn act-del" type="button" data-popup-delete-action="${index}" ${isLocked ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} style="padding: 6px 10px; border: 1px solid #ef4444; color: #ef4444; background: none; border-radius: var(--admin-radius-md); cursor: pointer;">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
    }).join('');
    elements.addStepActionBtn.hidden = isLocked;
  };

  // Popup Event Listeners
  if (elements.addStepActionBtn) {
    elements.addStepActionBtn.addEventListener('click', () => {
      currentActionsDraft.push({ name: 'Chuyển xử lý', nextNodeId: 'end' });
      renderActionsPopupList();
    });
  }

  if (elements.actionsTable) {
    elements.actionsTable.addEventListener('change', event => {
      const idx = event.target.dataset.popupActionNext;
      if (idx !== undefined) {
        currentActionsDraft[Number(idx)].nextNodeId = event.target.value;
        renderActionsPopupList();
        return;
      }
      const nameIdx = event.target.dataset.popupActionName;
      if (nameIdx !== undefined) {
        const actionType = event.target.value;
        currentActionsDraft[Number(nameIdx)].name = actionType;

        const draft = state.draft;
        const currentStepIdx = draft.nodes.findIndex(n => n.id === currentActionsStepId);
        if (actionType === 'Trả về') {
          currentActionsDraft[Number(nameIdx)].nextNodeId = currentStepIdx > 0 ? draft.nodes[currentStepIdx - 1].id : 'start';
        } else {
          currentActionsDraft[Number(nameIdx)].nextNodeId = draft.nodes[currentStepIdx + 1]?.id || 'end';
        }

        renderActionsPopupList();
      }
    });

    elements.actionsTable.addEventListener('click', event => {
      const delBtn = event.target.closest('[data-popup-delete-action]');
      if (delBtn) {
        const idx = Number(delBtn.dataset.popupDeleteAction);
        currentActionsDraft.splice(idx, 1);
        renderActionsPopupList();
      }
    });
  }

  if (elements.closeActions) elements.closeActions.addEventListener('click', () => { elements.actionsOverlay.hidden = true; });
  if (elements.cancelActions) elements.cancelActions.addEventListener('click', () => { elements.actionsOverlay.hidden = true; });

  if (elements.saveActions) {
    elements.saveActions.addEventListener('click', () => {
      const step = state.draft?.nodes.find(n => n.id === currentActionsStepId);
      if (step) {
        step.actions = clone(currentActionsDraft);
        if (state.selectedStepId === currentActionsStepId && !elements.nodeOverlay.hidden) {
          renderStepForm(step);
        }
        renderSteps();
        showNotice(`Đã lưu cấu hình hành động cho bước "${step.unitName}".`);
      }
      elements.actionsOverlay.hidden = true;
    });
  }

  renderList();
})();

/* ---------------- Báo cáo thống kê ---------------- */
(() => {
  const elements = {
    role: document.getElementById('reportRole'),
    period: document.getElementById('reportPeriod'), from: document.getElementById('reportFromDate'), to: document.getElementById('reportToDate'),
    unitLabel: document.getElementById('reportUnitLabel'), unit: document.getElementById('reportUnit'),
    apply: document.getElementById('reportApplyButton'), reset: document.getElementById('reportResetButton'),
    total: document.getElementById('reportKpiTotal'), completed: document.getElementById('reportKpiCompleted'), onTime: document.getElementById('reportKpiOnTime'), late: document.getElementById('reportKpiLate'), processing: document.getElementById('reportKpiProcessing'), active: document.getElementById('reportKpiActive'), overdue: document.getElementById('reportKpiOverdue'), revision: document.getElementById('reportKpiRevision'), pie: document.getElementById('reportPieChart'), pieTooltip: document.getElementById('reportPieTooltip'), legend: document.getElementById('reportStatusLegend'), line: document.getElementById('reportLineChart'), lineTooltip: document.getElementById('reportLineTooltip'), performance: document.getElementById('reportPerformanceBody'),
    performanceTitle: document.getElementById('reportPerformanceTitle'),
    performanceDesc: document.getElementById('reportPerformanceDesc'),
    performanceColHeader: document.getElementById('reportPerformanceColHeader')
  };
  if (!elements.period) return;
  const statuses = [
    { key: 'needsHandling', label: 'Cần phân công', color: 'var(--chart-color-needsHandling)' },
    { key: 'processing', label: 'Đang xử lý', color: 'var(--chart-color-processing)' },
    { key: 'waitingApproval', label: 'Chờ duyệt', color: 'var(--chart-color-waitingApproval)' },
    { key: 'needsApproval', label: 'Cần duyệt', color: 'var(--chart-color-needsApproval)' },
    { key: 'completed', label: 'Đã hoàn thành', color: 'var(--chart-color-completed)' }
  ];
  const agencyNames = ['Sở Khoa học và Công nghệ', 'Sở Y tế', 'Sở Tư pháp', 'Sở Giáo dục và Đào tạo', 'Sở Nội vụ'];
  const departmentNames = ['Phòng Hành chính - Tổng hợp', 'Phòng Quản lý Khoa học', 'Phòng Quản lý Công nghệ', 'Phòng Kế hoạch - Tài chính', 'Thanh tra Sở'];
  const reportStatusSequence = ['needsHandling', 'processing', 'waitingApproval', 'needsApproval', 'completed', 'completed', 'processing', 'completed', 'needsHandling', 'needsApproval', 'completed', 'processing', 'completed', 'waitingApproval', 'completed'];
  const records = reportStatusSequence.map((status, index) => ({
    id: `CD-2026-${String(index + 1).padStart(3, '0')}`, status, done: status === 'completed', overdue: [5, 8, 11].includes(index), unit: agencyNames[index % agencyNames.length], department: departmentNames[index % departmentNames.length], revision: [1, 8, 12].includes(index), issued: new Date(2026, 6, 1 + index), deadline: new Date(2026, 6, 5 + index)
  }));
  const state = { role: 'province', period: 'month', from: null, to: null, unit: 'all' };
  const percent = (value, total) => total ? `${Math.round(value / total * 100)}%` : '0%';
  const filteredRecords = () => records.filter(record =>
    (!state.from || record.issued >= state.from) &&
    (!state.to || record.issued <= state.to) &&
    (state.unit === 'all' || (state.role === 'province' ? record.unit === state.unit : record.department === state.unit))
  );
  const dateValue = date => date.toISOString().slice(0, 10);
  const setPeriodDates = period => {
    const now = new Date(2026, 6, 20); let from = new Date(now); let to = new Date(now);
    if (period === 'week') from.setDate(now.getDate() - 6);
    if (period === 'month') from = new Date(now.getFullYear(), now.getMonth(), 1);
    if (period === 'quarter') from = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    if (period === 'year') from = new Date(now.getFullYear(), 0, 1);
    if (period !== 'custom') { elements.from.value = dateValue(from); elements.to.value = dateValue(to); state.from = from; state.to = new Date(to.setHours(23, 59, 59, 999)); }
  };
  const polarPoint = (cx, cy, radius, angle) => ({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
  const positionTooltip = (wrapper, tooltip, event) => { const bounds = wrapper.getBoundingClientRect(); tooltip.style.left = `${event.clientX - bounds.left}px`; tooltip.style.top = `${event.clientY - bounds.top}px`; };
  const renderPie = rows => {
    const counts = statuses.map(status => rows.filter(record => record.status === status.key).length); const total = rows.length || 1; const cx = 280; const cy = 155; const radius = 105; let startAngle = -Math.PI / 2;
    const sectors = counts.map((count, index) => {
      if (!count) return '';
      const angle = count / total * Math.PI * 2; const endAngle = startAngle + angle; const start = polarPoint(cx, cy, radius, startAngle); const end = polarPoint(cx, cy, radius, endAngle); const middle = startAngle + angle / 2; const leaderStart = polarPoint(cx, cy, radius + 4, middle); const leaderElbow = polarPoint(cx, cy, radius + 25, middle); const right = Math.cos(middle) >= 0; const labelX = leaderElbow.x + (right ? 34 : -34); const lineEndX = labelX + (right ? -5 : 5); const value = Math.round(count / total * 100); startAngle = endAngle;
      return `<g><path class="report-pie-sector" tabindex="0" data-status="${statuses[index].label}" data-count="${count}" data-percent="${value}%" fill="${statuses[index].color}" d="M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${angle > Math.PI ? 1 : 0} 1 ${end.x} ${end.y} Z"></path><path class="report-pie-leader" d="M ${leaderStart.x} ${leaderStart.y} L ${leaderElbow.x} ${leaderElbow.y} L ${lineEndX} ${leaderElbow.y}"></path><text class="report-pie-label" x="${labelX}" y="${leaderElbow.y + 4}" text-anchor="${right ? 'start' : 'end'}">${value}%</text></g>`;
    }).join('');
    elements.pie.innerHTML = sectors;
    elements.legend.innerHTML = statuses.map(status => `<div class="report-legend-item"><i style="background:${status.color}"></i><span>${status.label}</span></div>`).join('');
    elements.pie.querySelectorAll('.report-pie-sector').forEach(sector => {
      const show = event => { elements.pieTooltip.innerHTML = `<strong>${sector.dataset.status}</strong><span>${sector.dataset.count} chỉ đạo · ${sector.dataset.percent}</span>`; elements.pieTooltip.hidden = false; positionTooltip(elements.pie.parentElement, elements.pieTooltip, event); };
      sector.addEventListener('pointerenter', show); sector.addEventListener('pointermove', show); sector.addEventListener('pointerleave', () => { elements.pieTooltip.hidden = true; }); sector.addEventListener('focus', event => { const bounds = sector.getBoundingClientRect(); show({ clientX: bounds.left + bounds.width / 2, clientY: bounds.top }); }); sector.addEventListener('blur', () => { elements.pieTooltip.hidden = true; });
    });
  };
  const renderLine = rows => {
    const labels = ['01/07', '05/07', '09/07', '13/07', '17/07', '20/07']; const incoming = labels.map(() => 0); const completed = labels.map(() => 0); rows.forEach(record => { const bucket = Math.min(labels.length - 1, Math.floor((record.issued.getDate() - 1) / 4)); incoming[bucket] += 1; if (record.done) completed[bucket] += 1; }); const left = 65; const right = 615; const top = 28; const bottom = 235; const maxValue = Math.max(4, ...incoming, ...completed); const x = index => left + index * ((right - left) / (labels.length - 1)); const y = value => bottom - value * ((bottom - top) / maxValue);
    const path = values => values.map((value, index) => `${index ? 'L' : 'M'} ${x(index)} ${y(value)}`).join(' ');
    elements.line.innerHTML = `<g>${[0, 1, 2, 3, 4].map(value => `<line class="report-line-grid" x1="${left}" y1="${y(value)}" x2="${right}" y2="${y(value)}"></line><text class="report-line-axis-label" x="${left - 12}" y="${y(value) + 4}" text-anchor="end">${value}</text>`).join('')}</g><line class="report-line-axis" x1="${left}" y1="${top}" x2="${left}" y2="${bottom}"></line><line class="report-line-axis" x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}"></line><text class="report-line-axis-title" x="${(left + right) / 2}" y="284" text-anchor="middle">Thời gian</text><text class="report-line-axis-title" x="17" y="${(top + bottom) / 2}" text-anchor="middle" transform="rotate(-90 17 ${(top + bottom) / 2})">Số chỉ đạo</text><path class="report-line-new" d="${path(incoming)}"></path><path class="report-line-done" d="${path(completed)}"></path>${incoming.map((value, index) => `<circle class="report-line-point-new" tabindex="0" data-series="Tiếp nhận mới" data-date="${labels[index]}" data-value="${value}" cx="${x(index)}" cy="${y(value)}" r="5"></circle><circle class="report-line-point-done" tabindex="0" data-series="Đã hoàn thành" data-date="${labels[index]}" data-value="${completed[index]}" cx="${x(index)}" cy="${y(completed[index])}" r="5"></circle><text class="report-line-axis-label" x="${x(index)}" y="${bottom + 22}" text-anchor="middle">${labels[index]}</text>`).join('')}`;
    elements.line.querySelectorAll('circle[data-series]').forEach(point => {
      const show = event => { elements.lineTooltip.innerHTML = `<strong>${point.dataset.series}</strong><span>${point.dataset.date} · ${point.dataset.value} chỉ đạo</span>`; elements.lineTooltip.hidden = false; positionTooltip(elements.line.parentElement, elements.lineTooltip, event); };
      point.addEventListener('pointerenter', show); point.addEventListener('pointermove', show); point.addEventListener('pointerleave', () => { elements.lineTooltip.hidden = true; }); point.addEventListener('focus', event => { const bounds = point.getBoundingClientRect(); show({ clientX: bounds.left + bounds.width / 2, clientY: bounds.top }); }); point.addEventListener('blur', () => { elements.lineTooltip.hidden = true; });
    });
  };
  const renderPerformance = recordsInScope => {
    const names = state.unit === 'all'
      ? (state.role === 'province' ? agencyNames : departmentNames)
      : [state.unit];
    elements.performance.innerHTML = names.map(name => {
      const agencyRows = recordsInScope.filter(record => state.role === 'province' ? record.unit === name : record.department === name);
      const completed = agencyRows.filter(record => record.done);
      const onTime = completed.filter(record => !record.overdue);
      const revisions = agencyRows.filter(record => record.revision);
      return `<tr><td><strong>${name}</strong></td><td>${agencyRows.length}</td><td>${completed.length}</td><td>${onTime.length}</td><td>${revisions.length}</td></tr>`;
    }).join('');
  };
  const render = () => {
    const rows = filteredRecords(); const completed = rows.filter(row => row.done); const processing = rows.filter(row => !row.done); const lateCompleted = completed.filter(row => row.overdue); const lateProcessing = processing.filter(row => row.overdue); const revisions = rows.filter(row => row.revision).length;
    elements.total.textContent = rows.length; elements.completed.textContent = completed.length; elements.onTime.textContent = percent(completed.length - lateCompleted.length, completed.length); elements.late.textContent = percent(lateCompleted.length, completed.length); elements.processing.textContent = processing.length; elements.active.textContent = percent(processing.length - lateProcessing.length, processing.length); elements.overdue.textContent = percent(lateProcessing.length, processing.length); elements.revision.textContent = percent(revisions, rows.length); renderPie(rows); renderLine(rows); renderPerformance(rows);
  };
  const handleRoleChange = () => {
    state.role = elements.role.value;
    state.unit = 'all';
    if (state.role === 'province') {
      elements.unitLabel.textContent = 'Sở/Ban/Ngành';
      elements.unit.innerHTML = `<option value="all">-- Chọn --</option>` + agencyNames.map(name => `<option value="${name}">${name}</option>`).join('');
      elements.performanceTitle.textContent = 'Hiệu suất theo Sở/Ban/Ngành';
      elements.performanceDesc.textContent = 'Tổng hợp số việc và kết quả thực hiện ở cấp Sở/Ban/Ngành';
      elements.performanceColHeader.textContent = 'Sở/Ban/Ngành';
    } else {
      elements.unitLabel.textContent = 'Phòng chuyên môn';
      elements.unit.innerHTML = `<option value="all">-- Chọn --</option>` + departmentNames.map(name => `<option value="${name}">${name}</option>`).join('');
      elements.performanceTitle.textContent = 'Hiệu suất theo Phòng chuyên môn';
      elements.performanceDesc.textContent = 'Tổng hợp số việc và kết quả thực hiện ở cấp Phòng chuyên môn';
      elements.performanceColHeader.textContent = 'Phòng chuyên môn';
    }
    render();
  };
  elements.role.addEventListener('change', handleRoleChange);
  elements.period.addEventListener('change', event => { state.period = event.target.value; setPeriodDates(state.period); });
  elements.apply.addEventListener('click', () => { state.from = elements.from.value ? new Date(`${elements.from.value}T00:00:00`) : null; state.to = elements.to.value ? new Date(`${elements.to.value}T23:59:59`) : null; state.unit = elements.unit.value; render(); });
  elements.reset.addEventListener('click', () => { elements.role.value = 'province'; elements.period.value = 'month'; handleRoleChange(); setPeriodDates('month'); render(); });
  document.querySelectorAll('[data-report-export]').forEach(button => button.addEventListener('click', () => { const format = button.dataset.reportExport.toUpperCase(); const original = button.innerHTML; button.innerHTML = `<i class="fa-solid fa-check"></i> Đã chuẩn bị ${format}`; setTimeout(() => { button.innerHTML = original; }, 1400); }));
  setPeriodDates('month'); render();
})();

/* ---------------- Xử lý chỉ đạo: state ---------------- */
const prototypeDateAtOffset = offsetDays => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const prototypeHistoryTime = (offsetDays, time = '08:00') => `${time} - ${prototypeDateAtOffset(offsetDays)}`;

const createPrototypeDirectives = () => [
  {
    id: `CD-${new Date().getFullYear()}-TEST-01`,
    title: 'Chạy thử toàn bộ quy trình xử lý chỉ đạo đa cấp',
    domain: 'Y tế',
    source: 'Lãnh đạo Tỉnh',
    issuedDate: prototypeDateAtOffset(-1),
    deadline: prototypeDateAtOffset(14),
    deadlineType: 'normal',
    deadlineNote: 'Hồ sơ chạy thử còn thời gian xử lý',
    provinceDeadlineWarning: false,
    assignee: 'Chưa phân công',
    assigneeInitials: '--',
    stage: 'accepted',
    content: 'Hồ sơ mẫu dùng để chạy liên tục luồng Tỉnh → Sở → Phòng chuyên môn, nghiệp vụ → Cá nhân và phê duyệt ngược trở lại.',
    attachment: 'Chi_dao_chay_thu_quy_trinh.pdf',
    attachmentSize: '1,2 MB',
    processId: null,
    report: '',
    reportFile: null,
    timelineNotes: {},
    executionTree: {
      id: 'node-test-flow-leader',
      contextId: 'leader',
      unitName: 'Sở Y tế',
      accountId: 'acc-so-01',
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
      timelineNotes: { 1: 'Hồ sơ đang chờ Lãnh đạo Sở chọn quy trình phân công' },
      history: [{ order: 1, time: prototypeHistoryTime(-1), actor: 'Hệ thống', action: 'Đồng bộ văn bản', note: 'Hồ sơ đã được chuyển đến Sở, chờ phân công.' }],
      children: []
    }
  },
  {
    id: `CD-${new Date().getFullYear()}-TEST-02`,
    title: 'Chạy thử tiếp tục xử lý hồ sơ đã trễ hạn',
    domain: 'Khoa học và Công nghệ',
    source: 'Lãnh đạo Tỉnh',
    issuedDate: prototypeDateAtOffset(-20),
    deadline: prototypeDateAtOffset(-5),
    deadlineType: 'overdue',
    deadlineNote: 'Hồ sơ đã trễ hạn nhưng vẫn được xử lý',
    provinceDeadlineWarning: false,
    assignee: 'Lãnh đạo Sở',
    assigneeInitials: 'LĐ',
    stage: 'directProcessing',
    content: 'Hồ sơ mẫu dùng để kiểm tra việc tiếp tục nhập báo cáo, trình Tỉnh và hoàn thành sau khi đã trễ hạn.',
    attachment: 'Chi_dao_chay_thu_tre_han.pdf',
    attachmentSize: '980 KB',
    processId: 'process-1',
    report: '',
    reportFile: null,
    timelineNotes: {},
    executionTree: {
      id: 'node-test-overdue-leader',
      contextId: 'leader',
      unitName: 'Sở Khoa học và Công nghệ',
      accountId: 'acc-so-01',
      accountName: 'Lãnh đạo Sở',
      parentUnit: 'Lãnh đạo Tỉnh',
      level: 1,
      canDelegate: true,
      stage: 'directProcessing',
      processId: 'process-1',
      handlingMode: 'direct',
      overdue: true,
      report: '',
      reportFile: null,
      reportVersions: [],
      timelineNotes: { 1: 'Sở đang tiếp tục xử lý trực tiếp sau hạn' },
      history: [
        { order: 1, time: prototypeHistoryTime(-20), actor: 'Hệ thống', action: 'Đồng bộ văn bản', note: 'Hồ sơ đã được chuyển đến Sở, chờ phân công.' },
        { order: 2, time: prototypeHistoryTime(-19, '09:00'), actor: 'Sở Khoa học và Công nghệ', action: 'Kích hoạt quy trình', note: 'Lãnh đạo Sở chọn xử lý trực tiếp.' },
        { order: 3, time: prototypeHistoryTime(-5, '00:00'), actor: 'Hệ thống', action: 'Ghi nhận trễ hạn', note: 'Hồ sơ chưa hoàn thành khi hết hạn xử lý.', overdue: true }
      ],
      children: []
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
  processes: processCatalog,
  directives: createPrototypeDirectives(),
  timeline: [
    { title: 'Tỉnh ban hành chỉ đạo', description: 'Chỉ đạo được đồng bộ về phân hệ Xử lý chỉ đạo.' },
    { title: 'Sở tiếp nhận và phân công', description: 'Lãnh đạo Sở chọn mẫu quy trình đã cấu hình.' },
    { title: 'Cấp dưới xử lý', description: 'Cấp dưới thực hiện nhiệm vụ và gửi báo cáo kết quả.' },
    { title: 'Sở phê duyệt và gửi Tỉnh', description: 'Lãnh đạo Sở duyệt báo cáo nội bộ và gửi Tỉnh.' },
    { title: 'Tỉnh phê duyệt kết quả', description: 'Kết thúc luồng xử lý chỉ đạo.' }
  ]
};

/* ---------------- Xử lý chỉ đạo: UI ---------------- */
(() => {
  const state = directiveState;
  const elements = {
    role: document.getElementById('roleSelect'), search: document.getElementById('directiveSearch'),
    searchButton: document.getElementById('directiveSearchButton'),
    statusSelect: document.getElementById('statusFilterSelect'),
    deadlineRange: document.getElementById('deadlineRange'),
    clearDeadlineRange: document.getElementById('clearDeadlineRange'),
    timeCondition: document.getElementById('timeCondition'),
    reset: document.getElementById('resetFilters'), tbody: document.getElementById('directiveTableBody'),
    empty: document.getElementById('emptyState'), count: document.getElementById('resultCount'),
    detailOverlay: document.getElementById('detailOverlay'), detailTitle: document.getElementById('detailTitle'),
    detailBody: document.getElementById('detailBody'), detailActions: document.getElementById('detailActions'),
    closeDetail: document.getElementById('closeDetail'), historyEventOverlay: document.getElementById('historyEventOverlay'),
    historyEventTitle: document.getElementById('historyEventTitle'), historyEventBody: document.getElementById('historyEventBody'),
    closeHistoryEvent: document.getElementById('closeHistoryEvent'), tableView: document.getElementById('tableView'),
    kanbanView: document.getElementById('kanbanView'), viewButtons: document.querySelectorAll('[data-display-mode]'),
    timeCalendarPopover: document.getElementById('timeCalendarPopover'), timeCalendarInput: document.getElementById('timeCalendarInput'),
    timeCalendarTitle: document.getElementById('timeCalendarTitle'), timeCalendarSummary: document.getElementById('timeCalendarSummary'),
    closeTimeCalendar: document.getElementById('closeTimeCalendar')
  };

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  const selectedDirective = () => state.directives.find(item => item.id === state.selectedId);
  const flattenNodes = root => root ? [root, ...(root.children || []).flatMap(flattenNodes)] : [];
  const nodeForContext = item => flattenNodes(item.executionTree).find(node => node.contextId === state.role) || null;
  const selectedProcess = subject => state.processes.find(process => process.id === subject.processId) || null;
  const nodeStatusByStage = {
    new: { key: 'needsHandling', label: 'Cần phân công' },
    accepted: { key: 'needsHandling', label: 'Cần phân công' },
    directProcessing: { key: 'processing', label: 'Đang xử lý' },
    assignedProcessing: { key: 'processing', label: 'Đang xử lý' },
    processActivated: { key: 'processing', label: 'Đang xử lý' },
    staffProcessing: { key: 'processing', label: 'Đang xử lý' },
    revisionRequired: { key: 'processing', label: 'Đang xử lý' },
    internalApproval: { key: 'needsApproval', label: 'Cần duyệt' },
    reportSubmitted: { key: 'waitingApproval', label: 'Chờ duyệt' },
    reportApproved: { key: 'waitingApproval', label: 'Chờ duyệt' },
    readyForParent: { key: 'waitingApproval', label: 'Chờ duyệt' },
    readyForProvince: { key: 'waitingApproval', label: 'Chờ duyệt' },
    sentProvince: { key: 'waitingApproval', label: 'Chờ duyệt' },
    completed: { key: 'completed', label: 'Đã hoàn thành' }
  };
  const overviewColumns = [
    { key: 'needsHandling', label: 'Cần phân công', colorKey: 'needsHandling' },
    { key: 'processing', label: 'Đang xử lý', colorKey: 'processing' },
    { key: 'waitingApproval', label: 'Chờ duyệt', colorKey: 'waitingApproval' },
    { key: 'needsApproval', label: 'Cần duyệt', colorKey: 'needsApproval' },
    { key: 'completed', label: 'Đã hoàn thành', colorKey: 'completed' }
  ];
  const isDirectiveOverdue = item => {
    const [day, month, year] = item.deadline.split('/').map(Number);
    const deadline = new Date(year, month - 1, day, 23, 59, 59);
    return item.deadlineType === 'overdue' || deadline.getTime() < Date.now();
  };
  const effectiveDeadlineType = item => isDirectiveOverdue(item) ? 'overdue' : item.deadlineType;
  const directiveDeadline = item => {
    const [day, month, year] = item.deadline.split('/').map(Number);
    return new Date(year, month - 1, day, 23, 59, 59);
  };
  const directiveIssuedDate = item => {
    const [day, month, year] = item.issuedDate.split('/').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0);
  };
  const formatPrototypeDate = date => date.toLocaleDateString('vi-VN');
  const parsePrototypeDate = value => {
    const [day, month, year] = String(value || '').split('/').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0);
  };
  const timeWindowFor = item => {
    const node = nodeForContext(item);
    if (state.role === 'leader' || !node) {
      return { start: directiveIssuedDate(item), deadline: directiveDeadline(item), warningDays: null, source: 'Thời hạn do Tỉnh giao' };
    }
    return {
      start: parsePrototypeDate(node.slaStartDate),
      deadline: parsePrototypeDate(node.slaDeadline),
      warningDays: node.warningDays,
      source: `Thời hạn bước ${node.unitName} theo quy trình động`
    };
  };
  const timeConditionFor = item => {
    const window = timeWindowFor(item);
    const remainingDays = Math.ceil((window.deadline.getTime() - Date.now()) / 86400000);
    if (remainingDays < 0) return 'overdue';
    if (remainingDays <= 3) return 'warning';
    return 'available';
  };
  const timeConditionLabel = key => ({ available: 'Còn hạn', warning: 'Sắp đến hạn', overdue: 'Trễ hạn' }[key] || 'Quỹ thời gian');
  const renderTimeButton = item => {
    const condition = timeConditionFor(item);
    return `<button class="time-budget-button ${condition}" type="button" data-time-id="${item.id}" aria-label="Xem quỹ thời gian ${item.id}" title="${timeConditionLabel(condition)}"><i class="fa-regular fa-clock"></i></button>`;
  };
  const statusFor = (item, role = state.role) => {
    const makeStatus = key => ({ key, label: state.statusMeta[key].label });
    if (item.executionTree) {
      const node = flattenNodes(item.executionTree).find(entry => entry.contextId === role);
      if (!node) return null;
      if (['new', 'accepted'].includes(node.stage)) return makeStatus('needsHandling');
      if (['directProcessing', 'assignedProcessing', 'processActivated', 'staffProcessing', 'revisionRequired', 'readyForParent', 'readyForProvince'].includes(node.stage)) return makeStatus('processing');
      if (['internalApproval', 'reportApproved'].includes(node.stage)) {
        const children = node.children || [];
        const allChildrenReported = children.length > 0 && children.every(c => c.stage === 'reportSubmitted' || c.stage === 'completed');
        if (allChildrenReported && node.stage === 'internalApproval') return makeStatus('needsApproval');
        return makeStatus('processing');
      }
      if (node.stage === 'reportSubmitted') return makeStatus('waitingApproval');
      if (node.stage === 'sentProvince') return makeStatus('waitingApproval');
      if (node.stage === 'completed') return makeStatus('completed');
      return null;
    }
    if (role !== 'leader') return null;
    if (['new', 'accepted'].includes(item.stage)) return makeStatus('needsHandling');
    if (['processActivated', 'staffProcessing', 'directProcessing', 'revisionRequired', 'readyForProvince'].includes(item.stage)) return makeStatus('processing');
    if (['reportSubmitted', 'reportApproved'].includes(item.stage)) return makeStatus('needsApproval');
    if (item.stage === 'sentProvince') return makeStatus('waitingApproval');
    if (item.stage === 'completed') return makeStatus('completed');
    return null;
  };
  const isVisibleForRole = item => statusFor(item, state.role) !== null;
  const subjectForItem = item => item.executionTree ? nodeForContext(item) : item;
  const overviewFor = item => statusFor(item)?.key || null;
  const isOverdueForContext = (item, subject) => {
    if (subject.contextId && subject.contextId !== 'leader') return parsePrototypeDate(subject.slaDeadline).getTime() < Date.now();
    return isDirectiveOverdue(item);
  };
  let historySequence = 0;
  let issuedRangePicker = null;
  let deadlineRangePicker = null;
  let timeCalendarPicker = null;
  const addHistory = (subject, actor, action, note, fromStage, toStage, attachment = null) => {
    subject.history ||= [];
    const now = new Date();
    subject.history.push({ order: (Date.now() * 100) + (++historySequence), time: `${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${now.toLocaleDateString('vi-VN')}`, actor, action, note, fromStage, toStage, attachment, overdue: Boolean(subject.overdue || action === 'Khóa hồ sơ trễ hạn') });
  };

  function renderStatusFilter() {
    if (elements.statusSelect) {
      elements.statusSelect.value = state.filters.statuses[0] || '';
    }
  }

  function filteredDirectives() {
    const search = state.filters.search.trim().toLocaleLowerCase('vi');
    return state.directives.filter(item => {
      const status = statusFor(item);
      const matchesSearch = !search || `${item.id} ${item.title}`.toLocaleLowerCase('vi').includes(search);
      const matchesStatus = state.filters.statuses.length === 0 || state.filters.statuses.includes(status?.key);
      const issuedDate = directiveIssuedDate(item);
      const deadline = directiveDeadline(item);
      const [issuedFrom, issuedTo] = state.filters.issuedRange;
      const [deadlineFrom, deadlineTo] = state.filters.deadlineRange;
      const matchesIssuedRange = (!issuedFrom || issuedDate >= issuedFrom) && (!issuedTo || issuedDate <= issuedTo);
      const matchesDeadlineRange = (!deadlineFrom || deadline >= deadlineFrom) && (!deadlineTo || deadline <= deadlineTo);
      const matchesTimeCondition = !state.filters.timeCondition || timeConditionFor(item) === state.filters.timeCondition;
      return isVisibleForRole(item) && matchesSearch && matchesStatus && matchesIssuedRange && matchesDeadlineRange && matchesTimeCondition;
    });
  }

  function renderStatus(item) {
    const status = statusFor(item);
    if (!status) return '';
    return `<span class="status-badge ${status.key}">${escapeHtml(status.label)}</span>`;
  }

  function renderDirectiveTable() {
    const items = filteredDirectives();
    const pages = Math.max(1, Math.ceil(items.length / state.pageSize));
    state.page = Math.min(state.page, pages);
    const start = (state.page - 1) * state.pageSize;
    const visible = items.slice(start, start + state.pageSize);

    elements.tbody.innerHTML = visible.map((item, index) => `
      <tr data-id="${item.id}">
        <td class="center">${start + index + 1}</td>
        <td><span class="directive-code">${item.id}</span></td>
        <td class="directive-title">${escapeHtml(item.title)}</td>
        <td>${item.issuedDate}</td>
        <td><span class="deadline ${effectiveDeadlineType(item)}">${item.deadline}</span>${renderTimeButton(item)}</td>
        <td>${renderStatus(item)}</td>
        <td><button class="view-button" type="button" data-id="${item.id}" aria-label="Xem chi tiết ${item.id}"><i class="fa-regular fa-eye"></i></button></td>
      </tr>`).join('');

    elements.empty.hidden = items.length > 0;

    const pageInfo = document.getElementById('directivePageInfo');
    if (pageInfo) {
      pageInfo.textContent = `Hiển thị ${items.length ? start + 1 : 0}-${Math.min(start + state.pageSize, items.length)}/${items.length}`;
    }

    const pageButtons = document.getElementById('directivePageButtons');
    if (pageButtons) {
      const pgBtns = [];
      pgBtns.push(`<button class="pg-btn" type="button" data-directive-page="1" ${state.page === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} title="Trang đầu"><i class="fa-solid fa-angles-left"></i></button>`);
      pgBtns.push(`<button class="pg-btn" type="button" data-directive-page="${Math.max(1, state.page - 1)}" ${state.page === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} title="Trang trước"><i class="fa-solid fa-angle-left"></i></button>`);
      for (let i = 1; i <= pages; i++) {
        pgBtns.push(`<button class="pg-btn ${state.page === i ? 'active' : ''}" type="button" data-directive-page="${i}">${i}</button>`);
      }
      pgBtns.push(`<button class="pg-btn" type="button" data-directive-page="${Math.min(pages, state.page + 1)}" ${state.page === pages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} title="Trang sau"><i class="fa-solid fa-angle-right"></i></button>`);
      pgBtns.push(`<button class="pg-btn" type="button" data-directive-page="${pages}" ${state.page === pages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} title="Trang cuối"><i class="fa-solid fa-angles-right"></i></button>`);
      pageButtons.innerHTML = pgBtns.join('');
    }
  }

  function renderKanbanCard(item) {
    const overdueClass = timeConditionFor(item) === 'overdue' ? 'overdue' : '';
    return `<article class="kanban-card ${overdueClass}" data-id="${item.id}" role="button" tabindex="0" aria-label="Xem chi tiết ${item.id}">
      <span class="directive-code">${item.id}</span>
      <strong>${escapeHtml(item.title)}</strong>
      <span class="kanban-deadline ${effectiveDeadlineType(item)}"><span>${item.deadline}</span>${renderTimeButton(item)}</span>
      ${renderStatus(item)}
    </article>`;
  }

  function renderKanban() {
    const items = filteredDirectives();
    elements.kanbanView.innerHTML = overviewColumns.map(column => {
      const columnItems = items.filter(item => overviewFor(item) === column.key);
      const meta = state.statusMeta[column.colorKey];
      return `<section class="kanban-column" aria-label="${escapeHtml(column.label)}">
        <header class="kanban-column-heading"><div><span class="kanban-status-dot overview-${column.key}"></span><h3>${escapeHtml(column.label)}</h3></div><span>${columnItems.length}</span></header>
        <div class="kanban-column-cards">${columnItems.length ? columnItems.map(renderKanbanCard).join('') : `<div class="kanban-empty"><i class="fa-regular ${meta.icon === 'fa-circle-check' ? 'fa-circle-check' : 'fa-folder-open'}"></i><span>Chưa có chỉ đạo</span></div>`}</div>
      </section>`;
    }).join('');
  }

  function renderDirectiveViews() {
    renderDirectiveTable();
    renderKanban();
  }

  function setDisplayMode(mode) {
    state.displayMode = mode === 'kanban' ? 'kanban' : 'table';
    elements.tableView.hidden = state.displayMode !== 'table';
    elements.kanbanView.hidden = state.displayMode !== 'kanban';
    elements.viewButtons.forEach(button => {
      const active = button.dataset.displayMode === state.displayMode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function currentStep(item) {
    const stageSteps = { new: 1, accepted: 2, directProcessing: 3, processActivated: 3, staffProcessing: 3, revisionRequired: 3, reportSubmitted: 3, reportApproved: 4, readyForProvince: 4, sentProvince: 4, completed: 5 };
    return stageSteps[item.stage] || 1;
  }

  function renderTimeline(item) {
    const current = currentStep(item);
    return `<ol class="timeline">${state.timeline.map((step, index) => {
      const number = index + 1;
      const stateClass = number < current ? 'done' : number === current ? 'current' : '';
      return `<li class="timeline-item ${stateClass}"><span class="timeline-dot"></span><p class="timeline-title">${step.title}</p><p class="timeline-meta">${escapeHtml(item.timelineNotes[number] || step.description)}</p></li>`;
    }).join('')}</ol>`;
  }

  const getProcessMaxOffset = process => {
    if (!process || process.handlingMode === 'direct') return 0;
    const nodeOffset = nodeConfig => {
      const children = process.nodes.filter(n => n.parentNodeId === nodeConfig.id);
      if (children.length === 0) return 0;
      return Math.max(...children.map(c => Number(c.deadlineOffsetDays || 0) + nodeOffset(c)));
    };
    const rootNode = process.nodes.find(n => !n.parentNodeId);
    return rootNode ? nodeOffset(rootNode) : 0;
  };

  const checkProcessDeadlineWarning = (item, process) => {
    if (!process || process.handlingMode === 'direct') return null;
    const maxOffset = getProcessMaxOffset(process);
    const deadline = directiveDeadline(item);
    const minStartDate = new Date(deadline);
    minStartDate.setDate(minStartDate.getDate() - maxOffset);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    minStartDate.setHours(0, 0, 0, 0);
    if (minStartDate.getTime() < today.getTime()) {
      const diffDays = Math.ceil((today.getTime() - minStartDate.getTime()) / 86400000);
      return `Cảnh báo quỹ thời gian: Quy trình yêu cầu tổng khoảng lùi các cấp là ${maxOffset} ngày. Với hạn xử lý của Tỉnh (${item.deadline}), ngày bắt đầu trễ nhất là ${formatPrototypeDate(minStartDate)} (quá hạn ${diffDays} ngày so với hôm nay). Vui lòng điều chỉnh lại thời hạn các cấp dưới để tránh hồ sơ bị trễ hạn tự động.`;
    }
    return null;
  };

  function renderMultiLevelProcess(item, node) {
    const rootNode = item.executionTree;
    if (rootNode && rootNode.isRejectedByProvince) {
      if (node.level === 1) {
        const allNodes = flattenNodes(rootNode).filter(n => n.id !== rootNode.id);
        let nodeCheckboxes = allNodes.map(n => `
          <label class="node-rework-option" style="display: flex; align-items: center; gap: 6px; margin: 6px 0; font-size: 13px; cursor: pointer;">
            <input type="checkbox" name="reworkNode" value="${n.id}" checked>
            <span><strong>${escapeHtml(n.unitName)}</strong> (${escapeHtml(n.accountName)} - ${escapeHtml(nodeStatusByStage[n.stage]?.label || n.stage)})</span>
          </label>
        `).join('');

        return `<section class="detail-section">
          <h3>Phương án khắc phục (Tỉnh từ chối phê duyệt)</h3>
          <div class="rejection-options" style="border: 1px dashed var(--pink); padding: 12px; border-radius: 4px; margin-bottom: 12px; background-color: rgba(238, 82, 45, 0.05);">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: var(--magenta);">Chọn phương án khắc phục báo cáo bị từ chối:</p>
            <div style="margin-bottom: 10px;">
              <label style="font-weight: 600; display: block; margin-bottom: 6px; cursor: pointer;">
                <input type="radio" name="rejectionResolution" value="inherit" checked> 1. Kế thừa quy trình cũ & yêu cầu làm lại các node lỗi
              </label>
              <div id="reworkNodesList" style="margin-left: 20px; padding: 8px; border: 1px solid #ddd; background: #fff; max-height: 150px; overflow-y: auto; border-radius: 4px;">
                ${nodeCheckboxes || '<em>Không tìm thấy node con nào trong quy trình cũ</em>'}
              </div>
            </div>
            <div>
              <label style="font-weight: 600; display: block; cursor: pointer;">
                <input type="radio" name="rejectionResolution" value="reset"> 2. Hủy quy trình cũ và thiết lập quy trình mới
              </label>
            </div>
          </div>
          <div id="inheritActions" style="margin-top: 10px; text-align: right;">
            <button class="button button-primary" type="button" data-action="nodeApplyResolution">Áp dụng phương án</button>
          </div>
        </section>`;
      } else {
        return `<section class="detail-section">
          <h3>Quy trình xử lý</h3>
          <div style="border: 1px solid #ffe69c; background-color: #fff3cd; color: #664d03; padding: 12px; border-radius: 4px; font-size: 13px; text-align: center;">
            <i class="fa-solid fa-circle-info" style="margin-right: 6px; font-size: 16px; vertical-align: middle;"></i>
            <strong>Hồ sơ đang tạm dừng.</strong> Chờ Lãnh đạo Sở quyết định phương án khắc phục báo cáo sau khi bị Tỉnh từ chối phê duyệt.
          </div>
        </section>`;
      }
    }

    const process = selectedProcess(node);
    const canChoose = node.level === 1 && (node.stage === 'accepted' || node.isProcessDraft);
    const availableProcesses = state.processes.filter(entry => entry.active && !entry.deleted);
    const selector = canChoose
      ? `<label class="form-field"><span>Mẫu quy trình động tại ${escapeHtml(node.unitName)}</span><select id="processSelect" required><option value="">-- Chọn mẫu quy trình --</option>${availableProcesses.map(entry => `<option value="${entry.id}" ${entry.id === node.processId ? 'selected' : ''}>${escapeHtml(entry.name)}</option>`).join('')}</select></label>`
      : `<div class="info-item process-name"><span>Quy trình áp dụng tại cấp này</span><strong>${escapeHtml(process?.name || 'Chưa chọn quy trình')}</strong></div>`;

    const deadlineWarningMsg = canChoose && process ? checkProcessDeadlineWarning(item, process) : null;
    const warningAlert = deadlineWarningMsg
      ? `<div class="deadline-warning-alert" style="border: 1px solid #f5c2c7; background-color: #f8d7da; color: #842029; padding: 8px 12px; border-radius: 4px; margin-bottom: 12px; font-size: 13px;"><i class="fa-solid fa-triangle-exclamation" style="margin-right: 6px;"></i>${deadlineWarningMsg}</div>`
      : '';

    const directForm = canChoose && process?.handlingMode === 'direct'
      ? `<form class="report-form process-direct-form" id="reportForm"><label class="form-field"><span>Nội dung báo cáo kết quả</span><textarea name="report" required placeholder="Nhập nội dung báo cáo...">${escapeHtml(node.draftReport || '')}</textarea></label><label class="form-field"><span>File báo cáo</span><input name="evidence" type="file" required>${node.draftFile?.name ? `<small class="draft-file-note">File nháp đã chọn: ${escapeHtml(node.draftFile.name)} — vui lòng chọn lại trước khi gửi.</small>` : ''}</label></form>` : '';
    const assignments = '';
    return `<section class="detail-section"><h3>Quy trình xử lý</h3>${selector}${warningAlert}<div id="processPreview">${renderProcessPreview(process)}</div>${directForm}${assignments}</section>`;
  }

  function renderMultiLevelReport(node) {
    if ((!node.isProcessDraft && node.stage === 'directProcessing') || node.stage === 'revisionRequired' || (node.stage === 'readyForParent' && !node.report)) {
      return `<section class="detail-section"><h3>Báo cáo của ${escapeHtml(node.unitName)}</h3><form class="report-form" id="reportForm"><label class="form-field"><span>Nội dung báo cáo</span><textarea name="report" required placeholder="Nhập kết quả xử lý...">${escapeHtml(node.stage === 'revisionRequired' ? node.report : '')}</textarea></label><label class="form-field"><span>File báo cáo</span><input name="evidence" type="file" required></label></form></section>`;
    }
    return '';
  }

  function renderMultiLevelActions(item, node) {
    const actions = [];
    const children = node.children || [];
    const activeChildren = children;
    const allChildrenReported = activeChildren.length > 0 && activeChildren.every(child => child.stage === 'reportSubmitted');
    if (node.level === 1 && (node.stage === 'accepted' || node.stage === 'new' || node.isProcessDraft) && selectedProcess(node)) actions.push([selectedProcess(node).handlingMode === 'direct' ? 'nodeSubmitDirect' : 'nodeActivateProcess', selectedProcess(node).handlingMode === 'direct' ? 'Trình duyệt báo cáo' : 'Chuyển xử lý', 'button-primary']);
    if (node.stage === 'directProcessing' && !node.isProcessDraft) actions.push(['nodeSubmitReport', node.level === 1 ? 'Trình Tỉnh' : 'Gửi báo cáo cấp trên', 'button-primary']);
    if (node.stage === 'revisionRequired') actions.push(['nodeResubmitReport', 'Gửi lại báo cáo', 'button-primary']);
    if (node.stage === 'internalApproval' && allChildrenReported && !node.showRevisionForm) actions.push(['nodeShowRevisionForm', 'Yêu cầu làm lại', 'button-secondary'], ['nodeApproveChildren', 'Phê duyệt cấp dưới', 'button-primary']);
    if (node.stage === 'internalApproval' && node.showRevisionForm) actions.push(['nodeCancelRevision', 'Hủy', 'button-secondary'], ['nodeSubmitRevision', 'Gửi yêu cầu làm lại', 'button-primary']);
    if (node.stage === 'readyForParent') actions.push(['nodeSendParent', node.level === 1 ? 'Trình Tỉnh' : `Trình ${node.parentUnit}`, 'button-primary']);
    if (node.stage === 'sentProvince' && !node.showProvinceRejectionForm) actions.push(['nodeShowProvinceRejection', 'Mô phỏng Tỉnh không phê duyệt', 'button-secondary'], ['nodeProvinceApprove', 'Mô phỏng Tỉnh phê duyệt', 'button-primary']);
    if (node.stage === 'sentProvince' && node.showProvinceRejectionForm) actions.push(['nodeCancelProvinceRejection', 'Hủy', 'button-secondary'], ['nodeSubmitProvinceRejection', 'Gửi lý do từ chối', 'button-primary']);
    elements.detailActions.innerHTML = actions.length ? actions.map(([action, label, style]) => `<button class="button ${style}" type="button" data-action="${action}">${escapeHtml(label)}</button>`).join('') : '';
  }

  function createDelegatedChildren(item, node) {
    const process = selectedProcess(node);
    if (!process || process.handlingMode === 'direct') return;
    const configs = process.nodes.filter(config => config.parentNodeId);
    const buildChildren = (parentConfig, parentRuntime, visible) => configs.filter(config => config.parentNodeId === parentConfig.id).map(config => {
      const slaStart = new Date();
      const parentDeadline = parentRuntime.slaDeadlineDate || directiveDeadline(item);
      const slaDeadlineDate = new Date(parentDeadline);
      slaDeadlineDate.setDate(slaDeadlineDate.getDate() - Number(config.deadlineOffsetDays || 0));
      const runtime = { id: `${parentRuntime.id}-${config.id}`, contextId: config.contextId, unitName: config.unitName, accountId: config.accountId, accountName: config.accountName, parentUnit: parentRuntime.unitName, level: parentRuntime.level + 1, canDelegate: Boolean(config.permissions?.assign), stage: visible ? (config.permissions?.assign ? 'accepted' : 'directProcessing') : 'pending', processId: process.id, handlingMode: 'assigned', permissions: config.permissions, slaStartDate: formatPrototypeDate(slaStart), slaDeadline: formatPrototypeDate(slaDeadlineDate), slaDeadlineDate, slaDays: Number(config.deadlineOffsetDays || 0), warningDays: Number(config.warningDays || 0), report: '', reportFile: null, reportVersions: [], history: [], timelineNotes: {}, children: [] };
      runtime.children = buildChildren(config, runtime, false);
      return runtime;
    });
    const rootConfig = process.nodes.find(config => !config.parentNodeId);
    if (rootConfig) node.children = buildChildren(rootConfig, { id: node.id, unitName: node.unitName, level: node.level, slaDeadlineDate: directiveDeadline(item) }, true);
  }

  function renderAttachment(name, size, label) {
    return `
      <div class="attachment-card">
        <div class="attachment-left">
          <div class="file-icon-pdf">PDF</div>
          <div class="file-details">
            <span class="file-name" title="${escapeHtml(name)}">${escapeHtml(name)}</span>
            <span class="file-size">${escapeHtml(label)} • ${escapeHtml(size)}</span>
          </div>
        </div>
        <button class="btn-view-file" type="button" aria-label="Xem file ${escapeHtml(name)}" onclick="return false;">
          <i class="fa-solid fa-link"></i>
          Xem file
        </button>
      </div>
    `;
  }

  function documentHistory(item) {
    const activeSubjects = item.executionTree ? flattenNodes(item.executionTree) : [item];
    const archivedSubjects = (item.executionTree?.archivedRuns || []).flatMap(run => (run.children || []).flatMap(flattenNodes));
    const subjects = [...activeSubjects, ...archivedSubjects];
    const history = subjects.flatMap(subject => (subject.history || []).map(event => ({ ...event, actor: event.actor || subject.unitName })));
    const overdueEvent = history.filter(event => event.action === 'Khóa hồ sơ trễ hạn').sort((first, second) => first.order - second.order)[0];
    history.forEach(event => { event.overdue = Boolean(event.overdue || (overdueEvent && event.order >= overdueEvent.order)); });
    subjects.forEach((subject, index) => {
      if (subject.report && !history.some(event => event.attachment?.name === subject.reportFile?.name)) {
        history.push({ order: index, time: 'Đã ghi nhận', actor: subject.unitName || item.assignee || 'Đơn vị xử lý', action: 'Gửi báo cáo kết quả', note: subject.report, attachment: subject.reportFile });
      }
    });
    return history.filter(event => event.action !== 'Bị từ chối').sort((first, second) => (second.order || 0) - (first.order || 0));
  }

  function renderHistory(item) {
    const history = documentHistory(item);
    return `
      <details class="history-card">
        <summary class="history-header" style="list-style: none; outline: none;">
          <div class="head-left">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0084e8" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span class="head-title">Lịch sử xử lý văn bản</span>
            <span class="head-count">${history.length} bước</span>
          </div>
          <div class="head-right">
            <span class="toggle-text-open" style="display: none;">Thu gọn</span>
            <span class="toggle-text-closed">Xem chi tiết</span>
            <svg class="icon-chevron" viewBox="0 0 24 24" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </summary>
        <div class="history-body">
          <div class="timeline-wrapper">
            ${history.length ? history.map(event => {
      const isDanger = event.action === 'Yêu cầu làm lại' || event.action === 'Từ chối' || event.action === 'Bị từ chối';
      const isOverdue = event.overdue || event.action === 'Khóa hồ sơ trễ hạn' || event.action === 'Ghi nhận trễ hạn';
      const fileBadge = event.attachment
        ? `<a href="#" class="file-chip" onclick="return false;">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    ${escapeHtml(event.attachment.name)}
                   </a>`
        : '';
      return `
                <div class="step-item ${isDanger ? 'danger' : ''} ${isOverdue ? 'overdue' : ''}">
                  <div class="dot-col">
                    <span class="dot-node"></span>
                  </div>
                  <div class="step-box">
                    <div class="step-top">
                      <div>
                        <span class="step-name">${escapeHtml(event.action)}</span>
                        <span class="step-badge">${escapeHtml(event.actor)}</span>
                      </div>
                      <span class="step-time">${escapeHtml(event.time)}</span>
                    </div>
                    <div class="step-bottom">
                      <span>${isDanger ? 'Lý do: ' : ''}${escapeHtml(event.note || '')}</span>
                      ${fileBadge}
                    </div>
                  </div>
                </div>
              `;
    }).join('') : '<div class="process-empty">Chưa có lịch sử xử lý.</div>'}
          </div>
        </div>
      </details>
    `;
  }

  function openHistoryEvent(order) {
    const item = selectedDirective();
    const event = item ? documentHistory(item).find(entry => String(entry.order) === String(order)) : null;
    if (!event) return;
    elements.historyEventTitle.textContent = event.action;
    elements.historyEventBody.innerHTML = `<div class="info-grid"><div class="info-item"><span>Thời gian</span><strong>${escapeHtml(event.time)}</strong></div><div class="info-item"><span>Đơn vị/Người thực hiện</span><strong>${escapeHtml(event.actor)}</strong></div></div>${event.note ? `<div class="info-item"><span>Nội dung chi tiết</span><strong>${escapeHtml(event.note)}</strong></div>` : ''}${event.attachment ? renderAttachment(event.attachment.name, event.attachment.size || 'File đính kèm', 'Dữ liệu đính kèm') : ''}`;
    elements.historyEventOverlay.hidden = false;
  }

  function closeHistoryEvent() {
    elements.historyEventOverlay.hidden = true;
  }

  function renderOverdueNotice() {
    return '';
  }

  function renderProvinceInformation(item) {
    const status = statusFor(item);
    const badgeKey = status ? status.key : 'needsHandling';
    const badgeLabel = status ? status.label : 'Chờ xử lý';
    return `
      <div class="directive-card">
        <div class="directive-header">
          <span class="directive-section-title">Thông tin chỉ đạo của Tỉnh</span>
          <span class="status-badge ${badgeKey}">${escapeHtml(badgeLabel)}</span>
        </div>

        <h2 class="directive-title">${escapeHtml(item.title)}</h2>
        <p class="directive-description">
          <strong>Mô tả ngắn gọn:</strong> ${escapeHtml(item.content)}
        </p>

        <div class="meta-grid">
          <div class="meta-box">
            <span class="meta-label">Ngày phân công</span>
            <span class="meta-value">${escapeHtml(item.issuedDate)}</span>
          </div>
          <div class="meta-box">
            <span class="meta-label">Hạn xử lý</span>
            <span class="meta-value">${escapeHtml(item.deadline)}</span>
          </div>
          <div class="meta-box">
            <span class="meta-label">Nhóm lĩnh vực</span>
            <span class="meta-value">${escapeHtml(item.domain || 'Y tế')}</span>
          </div>
        </div>

        <div class="directive-links-section" style="margin-top: 16px; display: flex; gap: 12px; border-top: 1px solid var(--admin-line); padding-top: 12px;">
          <div style="flex: 1;">
            <span class="meta-label" style="font-size: 11px; color: var(--admin-muted); display: block; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">1. Liên kết</span>
            <a href="../dashboard/index.html" target="_blank" class="pe-btn pe-btn-publish" style="text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; padding: 6px 12px; width: 100%; justify-content: center; box-sizing: border-box;">
              <i class="fa-solid fa-chart-simple"></i> Link Dashboard
            </a>
          </div>
          <div style="flex: 1;">
            <span class="meta-label" style="font-size: 11px; color: var(--admin-muted); display: block; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">2. Hình ảnh</span>
            <button type="button" class="pe-btn pe-btn-draft" id="btnViewAttachedImage" data-img-src="dashboard_mockup.png" style="display: inline-flex; align-items: center; gap: 8px; font-size: 13px; padding: 6px 12px; width: 100%; justify-content: center; box-sizing: border-box;">
              <i class="fa-solid fa-image"></i> Xem hình ảnh
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderProcessPreview(process) {
    if (!process) return '<div class="process-empty"><i class="fa-regular fa-rectangle-list"></i><span>Chọn quy trình để xem cấu hình và người thực hiện.</span></div>';
    return `<div class="process-preview">
      <p>${escapeHtml(process.description)}</p><ol class="process-steps">${process.steps.map((step, index) => `<li><span>${index + 1}</span>${escapeHtml(step)}</li>`).join('')}</ol></div>`;
  }

  function renderProcessSection(item) {
    const process = selectedProcess(item);
    const canChoose = state.role === 'leader' && (item.stage === 'accepted' || item.isProcessDraft);
    const selector = canChoose
      ? `<label class="form-field"><span>Mẫu quy trình động</span><select id="processSelect" required><option value="">-- Chọn mẫu quy trình --</option>${state.processes.filter(entry => entry.active && !entry.deleted).map(entry => `<option value="${entry.id}" ${entry.id === item.processId ? 'selected' : ''}>${escapeHtml(entry.name)}</option>`).join('')}</select></label>`
      : `<div class="info-item process-name"><span>Quy trình áp dụng</span><strong>${escapeHtml(process?.name || 'Chưa chọn quy trình')}</strong></div>`;
    const directForm = canChoose && process?.handlingMode === 'direct'
      ? `<form class="report-form process-direct-form" id="reportForm"><label class="form-field"><span>Nội dung báo cáo kết quả</span><textarea name="report" required placeholder="Nhập nội dung báo cáo...">${escapeHtml(item.draftReport || '')}</textarea></label><label class="form-field"><span>File báo cáo</span><input name="evidence" type="file" required>${item.draftFile?.name ? `<small class="draft-file-note">File nháp đã chọn: ${escapeHtml(item.draftFile.name)} — vui lòng chọn lại trước khi gửi.</small>` : ''}</label></form>` : '';
    return `<section class="detail-section"><h3>Quy trình xử lý tại Sở/Ngành</h3>${selector}<div id="processPreview">${renderProcessPreview(process)}</div>${directForm}</section>`;
  }

  function renderReportSection(item) {
    if (item.stage === 'revisionRequired') {
      return `<section class="detail-section"><h3>Làm lại báo cáo kết quả</h3><form class="report-form" id="reportForm"><label class="form-field"><span>Nội dung báo cáo</span><textarea name="report" required>${escapeHtml(item.report)}</textarea></label><label class="form-field"><span>File báo cáo cập nhật</span><input name="evidence" type="file" required></label></form></section>`;
    }
    if (state.role === 'leader' && item.stage === 'directProcessing' && !item.isProcessDraft) {
      return `<section class="detail-section"><h3>Báo cáo kết quả xử lý trực tiếp</h3><form class="report-form" id="reportForm"><label class="form-field"><span>Nội dung báo cáo</span><textarea name="report" required placeholder="Nhập kết quả xử lý trực tiếp..."></textarea></label><label class="form-field"><span>File báo cáo và tài liệu minh chứng</span><input name="evidence" type="file" required></label></form></section>`;
    }
    if (state.role === 'staff' && item.stage === 'staffProcessing') {
      return `<section class="detail-section"><h3>Báo cáo kết quả xử lý</h3><form class="report-form" id="reportForm"><label class="form-field"><span>Nội dung báo cáo</span><textarea name="report" required placeholder="Nhập kết quả thực hiện nhiệm vụ..."></textarea></label><label class="form-field"><span>File báo cáo và tài liệu minh chứng</span><input name="evidence" type="file" required></label></form></section>`;
    }
    return '';
  }

  function renderActions(item) {
    const actions = [];
    if (state.role === 'leader') {
      if (item.stage === 'new') actions.push(['accept', 'Tiếp nhận', 'button-primary']);
      if ((item.stage === 'accepted' || item.isProcessDraft) && selectedProcess(item)) actions.push([selectedProcess(item).handlingMode === 'direct' ? 'submitDirectLegacy' : 'activateProcess', selectedProcess(item).handlingMode === 'direct' ? 'Trình duyệt báo cáo' : 'Chuyển xử lý', 'button-primary']);
      if (item.stage === 'directProcessing' && !item.isProcessDraft) actions.push(['completeDirectReport', 'Hoàn tất báo cáo', 'button-primary']);
      if (item.stage === 'reportSubmitted' && !item.showRevisionForm) actions.push(['showRevisionForm', 'Yêu cầu làm lại', 'button-secondary'], ['approve', 'Phê duyệt báo cáo', 'button-primary']);
      if (item.stage === 'reportSubmitted' && item.showRevisionForm) actions.push(['cancelRevision', 'Hủy', 'button-secondary'], ['submitRevision', 'Gửi yêu cầu làm lại', 'button-primary']);
      if (item.stage === 'revisionRequired') actions.push(['resubmitReport', 'Gửi lại báo cáo', 'button-primary']);
      if (item.stage === 'reportApproved' || item.stage === 'readyForProvince') actions.push(['sendProvince', 'Trình Tỉnh', 'button-primary']);
      if (item.stage === 'sentProvince') actions.push(['provinceApprove', 'Mô phỏng Tỉnh phê duyệt', 'button-primary']);
    } else {
      if (item.stage === 'processActivated') actions.push(['staffAccept', 'Tiếp nhận chỉ đạo', 'button-primary']);
      if (item.stage === 'staffProcessing') actions.push(['submitReport', 'Gửi báo cáo kết quả', 'button-primary']);
    }
    elements.detailActions.innerHTML = actions.length
      ? actions.map(([action, label, style]) => `<button class="button ${style}" type="button" data-action="${action}">${label}</button>`).join('')
      : '';
  }

  function renderDetail() {
    const item = selectedDirective();
    if (!item) return;
    elements.detailTitle.textContent = item.id;
    elements.detailBody.className = 'detail-body';

    if (item.executionTree) {
      const node = nodeForContext(item);
      if (!node) return;
      const revision = node.showRevisionForm ? `<section class="detail-section"><h3>Yêu cầu làm lại</h3><form class="report-form" id="revisionForm"><label class="form-field"><span>Lý do chưa đạt</span><textarea name="reason" required placeholder="Nhập nội dung cần chỉnh sửa..."></textarea></label></form></section>` : '';
      const provinceRejection = node.showProvinceRejectionForm ? `<section class="detail-section"><h3>Tỉnh không phê duyệt báo cáo</h3><form class="report-form" id="provinceRejectionForm"><label class="form-field"><span>Lý do không phê duyệt</span><textarea name="reason" required placeholder="Nhập lý do và nội dung yêu cầu Sở xử lý lại..."></textarea></label></form></section>` : '';
      const hideProcess = node.stage === 'new';

      elements.detailBody.innerHTML = `
        <div class="form-body-2col">
          <div class="col-left">
            ${renderProvinceInformation(item)}
            ${hideProcess ? '' : renderMultiLevelProcess(item, node)}
            ${hideProcess ? '' : renderMultiLevelReport(node)}
            ${hideProcess ? '' : revision}
            ${hideProcess ? '' : provinceRejection}
          </div>
          <div class="col-right">
            ${renderHistory(item)}
          </div>
        </div>
      `;
      renderMultiLevelActions(item, node);
      return;
    }

    if (item.stage === 'new') {
      elements.detailBody.innerHTML = `
        <div class="form-body-2col">
          <div class="col-left">
            ${renderProvinceInformation(item)}
            <div class="process-empty"><i class="fa-regular fa-rectangle-list"></i><span>Chưa phân công quy trình xử lý.</span></div>
          </div>
          <div class="col-right">
            ${renderHistory(item)}
          </div>
        </div>
      `;
    } else {
      const revision = item.showRevisionForm ? `<section class="detail-section"><h3>Yêu cầu làm lại</h3><form class="report-form" id="revisionForm"><label class="form-field"><span>Lý do chưa đạt</span><textarea name="reason" required placeholder="Nhập nội dung cần chỉnh sửa..."></textarea></label></form></section>` : '';
      elements.detailBody.innerHTML = `
        <div class="form-body-2col">
          <div class="col-left">
            ${renderProvinceInformation(item)}
            ${renderProcessSection(item)}
            ${renderReportSection(item)}
            ${revision}
          </div>
          <div class="col-right">
            ${renderHistory(item)}
          </div>
        </div>
      `;
    }
    renderActions(item);
  }

  function openDetail(id) {
    state.selectedId = id;
    renderDetail();
    const heading = document.querySelector('.directive-view-heading');
    const listCard = document.querySelector('.directive-list-card');
    if (heading) heading.style.display = 'none';
    if (listCard) listCard.style.display = 'none';
    elements.detailOverlay.hidden = false;
    document.body.style.overflow = '';
  }

  function closeDetail() {
    closeHistoryEvent();
    const heading = document.querySelector('.directive-view-heading');
    const listCard = document.querySelector('.directive-list-card');
    if (heading) heading.style.display = '';
    if (listCard) listCard.style.display = '';
    elements.detailOverlay.hidden = true;
    document.body.style.overflow = '';
  }

  function closeTimeCalendar() {
    elements.timeCalendarPopover.hidden = true;
    timeCalendarPicker?.destroy();
    timeCalendarPicker = null;
  }

  function openTimeCalendar(item, anchor) {
    const windowData = timeWindowFor(item);
    const condition = timeConditionFor(item);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    elements.timeCalendarTitle.textContent = timeConditionLabel(condition);
    elements.timeCalendarSummary.textContent = `${windowData.source}: ${formatPrototypeDate(windowData.start)} – ${formatPrototypeDate(windowData.deadline)}`;
    elements.timeCalendarPopover.className = `time-calendar-popover ${condition}`;
    elements.timeCalendarPopover.hidden = false;
    timeCalendarPicker?.destroy();
    timeCalendarPicker = window.flatpickr(elements.timeCalendarInput, {
      inline: true, dateFormat: 'd/m/Y', defaultDate: today,
      onDayCreate: (_, __, ___, dayElement) => {
        const date = new Date(dayElement.dateObj); date.setHours(0, 0, 0, 0);
        const start = new Date(windowData.start); start.setHours(0, 0, 0, 0);
        const deadline = new Date(windowData.deadline); deadline.setHours(0, 0, 0, 0);
        if (date >= start && date <= deadline) dayElement.classList.add('time-window-day');
        if (date.getTime() === start.getTime()) dayElement.classList.add('time-issued-day');
        if (date.getTime() === today.getTime()) dayElement.classList.add('time-today-day');
        if (date.getTime() === deadline.getTime()) dayElement.classList.add('time-deadline-day');
      }
    });

    // Position popover dynamically after flatpickr layout is fully rendered
    const rect = anchor.getBoundingClientRect();
    const popoverWidth = elements.timeCalendarPopover.offsetWidth || 322;
    const popoverHeight = elements.timeCalendarPopover.offsetHeight || 370;

    // Determine optimal vertical position (show above if overflowing bottom)
    let top = rect.bottom + 6;
    if (top + popoverHeight > window.innerHeight) {
      top = rect.top - popoverHeight - 6;
    }
    top = Math.max(10, Math.min(window.innerHeight - popoverHeight - 10, top));
    const left = Math.min(window.innerWidth - popoverWidth - 10, Math.max(10, rect.left));

    elements.timeCalendarPopover.style.left = `${left}px`;
    elements.timeCalendarPopover.style.top = `${top}px`;
  }

  function applyDirectiveAction(action) {
    const item = selectedDirective();
    if (!item) return;
    if (item.executionTree && action.startsWith('node')) {
      const node = nodeForContext(item);
      if (!node) return;
      if (isDirectiveOverdue(item)) flattenNodes(item.executionTree).forEach(entry => { entry.overdue = true; });
      if (action === 'nodeAccept') {
        const before = node.stage;
        if (node.level === 1) node.stage = 'accepted';
        else if ((node.children || []).length) {
          node.stage = 'assignedProcessing';
          node.children.forEach(child => { if (child.stage === 'pending') child.stage = 'new'; });
        } else node.stage = 'directProcessing';
        addHistory(node, node.unitName, 'Tiếp nhận', `Tiếp nhận nhiệm vụ từ ${node.parentUnit}.`, before, node.stage);
      }
      if (action === 'nodeSubmitDirect') {
        const process = selectedProcess(node); const form = document.getElementById('reportForm');
        if (form) form.classList.add('was-validated');
        if (!process || process.handlingMode !== 'direct' || !form?.checkValidity()) return;
        const data = new FormData(form); const file = data.get('evidence'); const before = node.stage;
        node.handlingMode = 'direct'; node.report = data.get('report'); node.reportFile = { name: file.name, size: file.size ? `${Math.max(1, Math.round(file.size / 1024))} KB` : 'File mô phỏng' };
        const parent = flattenNodes(item.executionTree).find(entry => (entry.children || []).some(child => child.id === node.id));
        node.stage = parent ? 'reportSubmitted' : 'sentProvince';
        node.isProcessDraft = false; node.draftReport = ''; node.draftFile = null;
        if (parent) parent.stage = 'internalApproval';
        addHistory(node, node.unitName, 'Trình duyệt báo cáo', `Hoàn tất xử lý trực tiếp và gửi báo cáo lên ${node.parentUnit}.`, before, node.stage, node.reportFile);
      }
      if (action === 'nodeActivateProcess') {
        const process = selectedProcess(node);
        if (!process) {
          const select = document.getElementById('processSelect');
          if (select) {
            select.focus();
            select.closest('.form-field')?.classList.add('was-validated');
          }
          return;
        }
        node.handlingMode = process.handlingMode; node.isProcessDraft = false; node.draftReport = ''; node.draftFile = null;
        const before = node.stage;
        if (process.handlingMode === 'direct' || !node.canDelegate) node.stage = 'directProcessing';
        else { node.stage = 'assignedProcessing'; createDelegatedChildren(item, node); }
        addHistory(node, node.unitName, 'Kích hoạt quy trình', process.name, before, node.stage);
      }
      if (action === 'nodeSubmitReport' || action === 'nodeResubmitReport') {
        const form = document.getElementById('reportForm');
        if (form) form.classList.add('was-validated');
        if (!form?.checkValidity()) return;
        const data = new FormData(form); const file = data.get('evidence');
        const before = node.stage;
        const parent = flattenNodes(item.executionTree).find(entry => (entry.children || []).some(child => child.id === node.id));
        node.report = data.get('report');
        node.reportFile = { name: file.name, size: file.size ? `${Math.max(1, Math.round(file.size / 1024))} KB` : 'File mô phỏng' };
        node.stage = parent ? 'reportSubmitted' : 'sentProvince';
        if (action === 'nodeResubmitReport') addHistory(node, node.unitName, 'Làm lại', 'Đã chỉnh sửa báo cáo theo lý do từ chối.', before, before);
        addHistory(node, node.unitName, action === 'nodeResubmitReport' ? 'Gửi lại báo cáo' : parent ? 'Gửi báo cáo' : 'Trình Tỉnh', `Gửi báo cáo lên ${node.parentUnit}.`, before, node.stage, node.reportFile);
        if (parent) parent.stage = 'internalApproval';
      }
      if (action === 'nodeShowRevisionForm') node.showRevisionForm = true;
      if (action === 'nodeCancelRevision') node.showRevisionForm = false;
      if (action === 'nodeSubmitRevision') {
        const form = document.getElementById('revisionForm');
        if (form) form.classList.add('was-validated');
        if (!form?.checkValidity()) return;
        const reason = new FormData(form).get('reason');
        (node.children || []).filter(child => child.stage === 'reportSubmitted').forEach(child => {
          child.reportVersions ||= [];
          child.reportVersions.push({ report: child.report, file: child.reportFile, rejectedAt: new Date().toLocaleString('vi-VN'), reason });
          const before = child.stage; child.stage = 'revisionRequired';
          addHistory(child, node.unitName, 'Bị từ chối', reason, before, child.stage);
        });
        node.showRevisionForm = false;
        node.stage = 'assignedProcessing';
        addHistory(node, node.unitName, 'Yêu cầu làm lại', reason, 'internalApproval', node.stage);
      }
      if (action === 'nodeApproveChildren') {
        (node.children || []).filter(child => child.stage === 'reportSubmitted').forEach(child => {
          const before = child.stage; child.stage = 'completed';
          addHistory(child, node.unitName, 'Phê duyệt', 'Báo cáo đã đạt yêu cầu.', before, child.stage);
        });
        const before = node.stage; node.stage = 'readyForParent';
        addHistory(node, node.unitName, 'Phê duyệt cấp dưới', 'Đã phê duyệt toàn bộ báo cáo cấp dưới còn hiệu lực.', before, node.stage);
      }
      if (action === 'nodeSendParent') {
        if (!node.report) {
          const form = document.getElementById('reportForm');
          if (form) form.classList.add('was-validated');
          if (!form?.checkValidity()) return;
          const data = new FormData(form); const file = data.get('evidence');
          node.report = data.get('report'); node.reportFile = { name: file.name, size: file.size ? `${Math.max(1, Math.round(file.size / 1024))} KB` : 'File mô phỏng' };
        }
        const parent = flattenNodes(item.executionTree).find(entry => (entry.children || []).some(child => child.id === node.id));
        node.stage = parent ? 'reportSubmitted' : 'sentProvince';
        if (parent) parent.stage = 'internalApproval';
        addHistory(node, node.unitName, 'Trình cấp trên', `Gửi báo cáo lên ${node.parentUnit}.`, 'readyForParent', node.stage, node.reportFile);
      }
      if (action === 'nodeProvinceApprove') {
        flattenNodes(item.executionTree).forEach(entry => { const before = entry.stage; entry.stage = 'completed'; addHistory(entry, 'Lãnh đạo Tỉnh', 'Phê duyệt', 'Kết quả xử lý đã được phê duyệt.', before, entry.stage); });
      }
      if (action === 'nodeShowProvinceRejection') node.showProvinceRejectionForm = true;
      if (action === 'nodeCancelProvinceRejection') node.showProvinceRejectionForm = false;
      if (action === 'nodeSubmitProvinceRejection') {
        const form = document.getElementById('provinceRejectionForm');
        if (form) form.classList.add('was-validated');
        if (!form?.checkValidity()) return;
        const reason = new FormData(form).get('reason');
        const previousProcess = selectedProcess(node);
        node.archivedRuns ||= [];
        node.archivedRuns.push({
          processId: node.processId,
          processName: previousProcess?.name || 'Quy trình đã thực hiện',
          report: node.report,
          reportFile: node.reportFile,
          rejectedAt: new Date().toLocaleString('vi-VN'),
          reason,
          children: structuredClone(node.children || [])
        });
        node.reportVersions ||= [];
        node.reportVersions.push({ report: node.report, file: node.reportFile, rejectedAt: new Date().toLocaleString('vi-VN'), reason, processName: previousProcess?.name });
        const before = node.stage;
        addHistory(node, 'Lãnh đạo Tỉnh', 'Bị từ chối', reason, before, 'accepted', node.reportFile);
        node.stage = 'accepted';
        node.showProvinceRejectionForm = false;
        node.report = '';
        node.reportFile = null;
        if (node.handlingMode === 'direct') {
          node.isRejectedByProvince = false;
          node.processId = null;
          node.handlingMode = null;
          node.children = [];
          node.isProcessDraft = false;
          node.draftReport = '';
          node.draftFile = null;
        } else {
          node.isRejectedByProvince = true;
        }
      }
      if (action === 'nodeApplyResolution') {
        const resolution = document.querySelector('input[name="rejectionResolution"]:checked')?.value;
        if (resolution === 'inherit') {
          const selectedNodeIds = Array.from(document.querySelectorAll('input[name="reworkNode"]:checked')).map(cb => cb.value);
          if (selectedNodeIds.length === 0) {
            alert('Vui lòng chọn ít nhất một node con để yêu cầu làm lại, hoặc chọn phương án Hủy quy trình.');
            return;
          }
          const allNodes = flattenNodes(node);
          allNodes.forEach(n => {
            if (selectedNodeIds.includes(n.id)) {
              const before = n.stage;
              n.stage = 'revisionRequired';
              n.report = '';
              n.reportFile = null;
              addHistory(n, node.unitName, 'Yêu cầu làm lại', 'Lãnh đạo Sở yêu cầu làm lại theo quyết định từ chối của Tỉnh.', before, n.stage);
            }
          });
          node.isRejectedByProvince = false;
          node.stage = 'assignedProcessing';
          addHistory(node, node.unitName, 'Áp dụng phương án khắc phục', `Kế thừa quy trình và yêu cầu làm lại tại ${selectedNodeIds.length} đơn vị cấp dưới.`, 'accepted', node.stage);
        } else if (resolution === 'reset') {
          node.isRejectedByProvince = false;
          node.processId = null;
          node.handlingMode = null;
          node.report = '';
          node.reportFile = null;
          node.children = [];
          node.isProcessDraft = false;
          node.draftReport = '';
          node.draftFile = null;
          node.stage = 'accepted';
          addHistory(node, node.unitName, 'Hủy quy trình cũ', 'Hủy toàn bộ quy trình và cấu hình thực thi cũ để chọn lại quy trình mới.', 'accepted', 'accepted');
        }
        renderDirectiveViews();
        renderDetail();
        return;
      }
      renderDirectiveViews(); renderDetail(); return;
    }
    if (action === 'submitDirectLegacy') {
      const process = selectedProcess(item); const form = document.getElementById('reportForm');
      if (form) form.classList.add('was-validated');
      if (!process || process.handlingMode !== 'direct' || !form?.checkValidity()) return;
      const data = new FormData(form); const file = data.get('evidence'); const before = item.stage;
      item.handlingMode = 'direct'; item.report = data.get('report'); item.reportFile = { name: file.name, size: file.size ? `${Math.max(1, Math.round(file.size / 1024))} KB` : 'File mô phỏng' }; item.stage = 'sentProvince';
      item.isProcessDraft = false; item.draftReport = ''; item.draftFile = null;
      addHistory(item, 'Lãnh đạo Sở/Ngành', 'Trình duyệt báo cáo', 'Hoàn tất xử lý trực tiếp và gửi báo cáo lên Tỉnh.', before, item.stage, item.reportFile);
    }
    if (action === 'accept') {
      const before = item.stage;
      item.stage = 'accepted';
      item.timelineNotes[2] = 'Lãnh đạo Sở đã tiếp nhận, chờ lựa chọn quy trình xử lý';
      addHistory(item, 'Lãnh đạo Sở/Ngành', 'Tiếp nhận', 'Tiếp nhận chỉ đạo từ Tỉnh.', before, item.stage);
    }
    if (action === 'activateProcess') {
      const process = selectedProcess(item);
      if (!process) {
        const select = document.getElementById('processSelect');
        if (select) {
          select.focus();
          select.closest('.form-field')?.classList.add('was-validated');
        }
        return;
      }
      const before = item.stage; item.assignee = process.assignee; item.assigneeInitials = process.assigneeInitials; item.handlingMode = process.handlingMode; item.isProcessDraft = false; item.draftReport = ''; item.draftFile = null;
      item.stage = process.handlingMode === 'direct' ? 'directProcessing' : 'processActivated';
      item.timelineNotes[2] = process.handlingMode === 'direct' ? `Đã kích hoạt ${process.name}; Sở trực tiếp xử lý` : `Đã kích hoạt ${process.name}; giao ${process.assignee}`;
      addHistory(item, 'Lãnh đạo Sở/Ngành', 'Chuyển xử lý', `${process.name} — ${process.assignee}.`, before, item.stage);
    }
    if (action === 'staffAccept') { const before = item.stage; item.stage = 'staffProcessing'; item.timelineNotes[3] = 'Cấp dưới đã tiếp nhận và đang thực hiện nhiệm vụ'; addHistory(item, 'Đơn vị được giao', 'Tiếp nhận', 'Tiếp nhận nhiệm vụ được phân công.', before, item.stage); }
    if (action === 'submitReport') {
      const form = document.getElementById('reportForm');
      if (form) form.classList.add('was-validated');
      if (!form?.checkValidity()) return;
      const formData = new FormData(form); const file = formData.get('evidence');
      const before = item.stage; item.report = formData.get('report'); item.reportFile = { name: file.name, size: file.size ? `${Math.max(1, Math.round(file.size / 1024))} KB` : 'File mô phỏng' };
      item.stage = 'reportSubmitted'; item.timelineNotes[3] = 'Đã gửi báo cáo kết quả chờ Giám đốc Sở duyệt';
      addHistory(item, 'Đơn vị xử lý', 'Gửi báo cáo kết quả', item.report, before, item.stage, item.reportFile);
    }
    if (action === 'completeDirectReport') {
      const form = document.getElementById('reportForm');
      if (form) form.classList.add('was-validated');
      if (!form?.checkValidity()) return;
      const formData = new FormData(form); const file = formData.get('evidence');
      const before = item.stage; item.report = formData.get('report'); item.reportFile = { name: file.name, size: file.size ? `${Math.max(1, Math.round(file.size / 1024))} KB` : 'File mô phỏng' };
      item.stage = 'readyForProvince'; item.timelineNotes[4] = 'Sở đã hoàn tất báo cáo xử lý trực tiếp, chờ trình Tỉnh';
      addHistory(item, 'Lãnh đạo Sở/Ngành', 'Hoàn tất báo cáo', item.report, before, item.stage, item.reportFile);
    }
    if (action === 'showRevisionForm') item.showRevisionForm = true;
    if (action === 'cancelRevision') item.showRevisionForm = false;
    if (action === 'submitRevision') {
      const form = document.getElementById('revisionForm');
      if (form) form.classList.add('was-validated');
      if (!form?.checkValidity()) return;
      const reason = new FormData(form).get('reason');
      item.reportVersions ||= [];
      item.reportVersions.push({ report: item.report, file: item.reportFile, rejectedAt: new Date().toLocaleString('vi-VN'), reason });
      const before = item.stage; item.stage = 'revisionRequired'; item.showRevisionForm = false;
      addHistory(item, 'Lãnh đạo Sở/Ngành', 'Bị từ chối', reason, before, item.stage);
    }
    if (action === 'resubmitReport') {
      const form = document.getElementById('reportForm');
      if (form) form.classList.add('was-validated');
      if (!form?.checkValidity()) return;
      const formData = new FormData(form); const file = formData.get('evidence'); const before = item.stage;
      item.report = formData.get('report'); item.reportFile = { name: file.name, size: file.size ? `${Math.max(1, Math.round(file.size / 1024))} KB` : 'File mô phỏng' };
      addHistory(item, 'Đơn vị xử lý', 'Làm lại', 'Đã chỉnh sửa báo cáo theo lý do từ chối.', before, before);
      item.stage = 'reportSubmitted'; addHistory(item, 'Đơn vị xử lý', 'Gửi lại báo cáo', 'Đã hoàn thiện báo cáo theo yêu cầu làm lại.', before, item.stage, item.reportFile);
    }
    if (action === 'approve') { const before = item.stage; item.stage = 'reportApproved'; item.timelineNotes[4] = 'Giám đốc Sở đã phê duyệt báo cáo nội bộ'; addHistory(item, 'Lãnh đạo Sở/Ngành', 'Phê duyệt nội bộ', 'Báo cáo đạt yêu cầu.', before, item.stage); }
    if (action === 'sendProvince') { const before = item.stage; item.stage = 'sentProvince'; item.timelineNotes[4] = 'Báo cáo đã gửi lên Tỉnh và đang chờ Tỉnh phê duyệt'; addHistory(item, 'Lãnh đạo Sở/Ngành', 'Trình Tỉnh', 'Đã gửi báo cáo kết quả lên Tỉnh.', before, item.stage, item.reportFile); }
    if (action === 'provinceApprove') { const before = item.stage; item.stage = 'completed'; item.timelineNotes[5] = 'Tỉnh đã phê duyệt kết quả; chỉ đạo hoàn thành'; addHistory(item, 'Lãnh đạo Tỉnh', 'Phê duyệt kết quả', 'Chỉ đạo đã hoàn thành.', before, item.stage); }
    renderDirectiveViews(); renderDetail();
  }

  elements.role.addEventListener('change', event => {
    state.role = event.target.value;
    state.filters.statuses = [];
    renderStatusFilter();
    renderDirectiveViews();
    const item = selectedDirective();
    if (!elements.detailOverlay.hidden && item && isVisibleForRole(item)) renderDetail();
    else if (!elements.detailOverlay.hidden) closeDetail();
  });
  const applySearch = () => { state.filters.search = elements.search.value; renderDirectiveViews(); };
  elements.searchButton.addEventListener('click', applySearch);
  elements.search.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); applySearch(); } });
  // Mở/Đóng bộ lọc dạng Quy trình động
  const directiveFilterToggle = document.getElementById('directiveFilterToggle');
  const directiveFilterPanel = document.getElementById('directiveFilterPanel');
  if (directiveFilterToggle && directiveFilterPanel) {
    directiveFilterToggle.addEventListener('click', () => {
      directiveFilterPanel.classList.toggle('show');
      directiveFilterToggle.classList.toggle('active');
    });
  }

  // Sự kiện thay đổi bộ lọc trạng thái select
  if (elements.statusSelect) {
    elements.statusSelect.addEventListener('change', event => {
      state.filters.statuses = event.target.value ? [event.target.value] : [];
      renderDirectiveViews();
    });
  }

  // Sự kiện thay đổi tình trạng quỹ thời gian select
  if (elements.timeCondition) {
    elements.timeCondition.addEventListener('change', () => {
      state.filters.timeCondition = elements.timeCondition.value;
      renderDirectiveViews();
    });
  }

  document.addEventListener('click', event => {
    if (!elements.timeCalendarPopover.hidden && !elements.timeCalendarPopover.contains(event.target) && !event.target.closest('[data-time-id]')) closeTimeCalendar();
  });

  // Đặt lại bộ lọc (Làm mới)
  elements.reset.addEventListener('click', () => {
    state.filters = { search: '', statuses: [], issuedRange: [], deadlineRange: [], timeCondition: '' };
    elements.search.value = '';
    if (elements.statusSelect) elements.statusSelect.value = '';
    if (elements.timeCondition) elements.timeCondition.value = '';
    deadlineRangePicker?.clear();
    if (elements.clearDeadlineRange) elements.clearDeadlineRange.hidden = true;
    renderDirectiveViews();
  });

  // Xóa khoảng hạn xử lý
  if (elements.clearDeadlineRange) {
    elements.clearDeadlineRange.addEventListener('click', event => {
      event.stopPropagation();
      deadlineRangePicker?.clear();
      state.filters.deadlineRange = [];
      elements.clearDeadlineRange.hidden = true;
      renderDirectiveViews();
    });
  }

  // Lắng nghe thay đổi số lượng dòng hiển thị (Page Size) cho Chỉ đạo
  const directivePageSize = document.getElementById('directivePageSize');
  if (directivePageSize) {
    directivePageSize.addEventListener('change', event => {
      state.pageSize = Number(event.target.value);
      state.page = 1;
      renderDirectiveViews();
    });
  }

  // Lắng nghe click các nút chuyển trang (Phân trang) cho Chỉ đạo
  const directivePageButtons = document.getElementById('directivePageButtons');
  if (directivePageButtons) {
    directivePageButtons.addEventListener('click', event => {
      const button = event.target.closest('[data-directive-page]');
      if (button) {
        state.page = Number(button.dataset.directivePage);
        renderDirectiveViews();
      }
    });
  }
  const handleDirectiveClick = event => {
    const timeButton = event.target.closest('[data-time-id]');
    if (timeButton) {
      event.preventDefault(); event.stopPropagation();
      const item = state.directives.find(entry => entry.id === timeButton.dataset.timeId);
      if (item) openTimeCalendar(item, timeButton);
      return;
    }
    const target = event.target.closest('[data-id]'); if (target) openDetail(target.dataset.id);
  };
  elements.tbody.addEventListener('click', handleDirectiveClick);
  elements.kanbanView.addEventListener('click', handleDirectiveClick);
  elements.kanbanView.addEventListener('keydown', event => {
    if (!['Enter', ' '].includes(event.key) || event.target.closest('[data-time-id]')) return;
    const card = event.target.closest('[data-id]');
    if (!card) return;
    event.preventDefault();
    openDetail(card.dataset.id);
  });
  elements.viewButtons.forEach(button => button.addEventListener('click', () => setDisplayMode(button.dataset.displayMode)));
  elements.closeDetail.addEventListener('click', closeDetail);
  elements.detailOverlay.addEventListener('click', event => { if (event.target === elements.detailOverlay) closeDetail(); });
  elements.detailBody.addEventListener('change', event => {
    const item = selectedDirective(); const subject = item.executionTree ? nodeForContext(item) : item;
    if (event.target.name === 'evidence' && subject.isProcessDraft) {
      const file = event.target.files?.[0];
      subject.draftFile = file ? { name: file.name, size: file.size } : null;
      return;
    }
    if (event.target.id !== 'processSelect') return;
    subject.processId = event.target.value || null;
    const process = selectedProcess(subject);
    subject.isProcessDraft = Boolean(process);
    subject.stage = process?.handlingMode === 'direct' ? 'directProcessing' : 'accepted';
    if (!process) { subject.draftReport = ''; subject.draftFile = null; }
    renderDirectiveViews();
    renderDetail();
  });
  elements.detailBody.addEventListener('input', event => {
    if (event.target.name !== 'report') return;
    const item = selectedDirective(); const subject = item.executionTree ? nodeForContext(item) : item;
    if (subject?.isProcessDraft) subject.draftReport = event.target.value;
  });
  const imgOverlay = document.getElementById('imageViewerOverlay');
  const closeImgBtn = document.getElementById('closeImageViewer');
  if (closeImgBtn) {
    closeImgBtn.addEventListener('click', () => {
      if (imgOverlay) imgOverlay.hidden = true;
    });
  }
  if (imgOverlay) {
    imgOverlay.addEventListener('click', event => {
      if (event.target === imgOverlay) imgOverlay.hidden = true;
    });
  }

  elements.detailBody.addEventListener('click', event => {
    const historyButton = event.target.closest('[data-history-order]');
    if (historyButton) { openHistoryEvent(historyButton.dataset.historyOrder); return; }
    const btnViewImg = event.target.closest('#btnViewAttachedImage');
    if (btnViewImg) {
      const src = btnViewImg.dataset.imgSrc;
      const img = document.getElementById('viewerImage');
      if (imgOverlay && img) {
        img.src = src;
        imgOverlay.hidden = false;
      }
      return;
    }
    const button = event.target.closest('[data-action]'); if (button) applyDirectiveAction(button.dataset.action);
  });
  elements.detailActions.addEventListener('click', event => { const button = event.target.closest('[data-action]'); if (button) applyDirectiveAction(button.dataset.action); });
  elements.closeHistoryEvent.addEventListener('click', closeHistoryEvent);
  elements.closeTimeCalendar.addEventListener('click', closeTimeCalendar);
  elements.historyEventOverlay.addEventListener('click', event => { if (event.target === elements.historyEventOverlay) closeHistoryEvent(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !elements.timeCalendarPopover.hidden) closeTimeCalendar();
    else if (event.key === 'Escape' && !elements.historyEventOverlay.hidden) closeHistoryEvent();
    else if (event.key === 'Escape' && imgOverlay && !imgOverlay.hidden) imgOverlay.hidden = true;
    else if (event.key === 'Escape' && !elements.detailOverlay.hidden) closeDetail();
  });

  renderStatusFilter();
  if (window.flatpickr) {
    if (elements.deadlineRange) {
      deadlineRangePicker = window.flatpickr(elements.deadlineRange, {
        mode: 'range', dateFormat: 'd/m/Y', allowInput: false,
        onChange: selectedDates => {
          state.filters.deadlineRange = selectedDates.map(date => { const value = new Date(date); value.setHours(selectedDates.indexOf(date) ? 23 : 0, selectedDates.indexOf(date) ? 59 : 0, selectedDates.indexOf(date) ? 59 : 0, selectedDates.indexOf(date) ? 999 : 0); return value; });
          elements.clearDeadlineRange.hidden = selectedDates.length === 0;
          renderDirectiveViews();
        }
      });
    }
  }
  renderDirectiveViews();
  setDisplayMode(state.displayMode);
})();
