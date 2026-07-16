/* ============================================================
   UI.JS — Admin page: menu switching, table rendering, pagination
   ============================================================ */

/* ---------------- Menu switching ---------------- */
function switchView(view, label) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('nav-' + view).classList.add('active');
  document.getElementById('pageTitle').textContent = label;
  document.getElementById('breadcrumbCurrent').textContent = label;
}

document.getElementById('navParent').addEventListener('click', function () {
  this.classList.toggle('open');
  const ch = document.getElementById('navChildren');
  ch.style.display = this.classList.contains('open') ? 'block' : 'none';
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
  html += `<button class="pg-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="gotoPage(1)"><i class="fa-solid fa-angles-left"></i></button>`;
  html += `<button class="pg-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="gotoPage(${currentPage - 1})"><i class="fa-solid fa-angle-left"></i></button>`;
  for (let p = 1; p <= totalPages; p++) {
    html += `<button class="pg-btn ${p === currentPage ? 'active' : ''}" onclick="gotoPage(${p})">${p}</button>`;
  }
  html += `<button class="pg-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="gotoPage(${currentPage + 1})"><i class="fa-solid fa-angle-right"></i></button>`;
  html += `<button class="pg-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="gotoPage(${totalPages})"><i class="fa-solid fa-angles-right"></i></button>`;
  document.getElementById('chartTypesPgBtns').innerHTML = html;
}

function gotoPage(p) { currentPage = p; renderChartTypes(); }
function changePageSize(sel) { pageSize = parseInt(sel.value); currentPage = 1; renderChartTypes(); }

renderChartTypes();
