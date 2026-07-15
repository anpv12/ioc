/**
 * ui.js — UI Interactions
 * Trang: p01 - Tình hình dân cư theo giới tính
 *
 * Phụ thuộc (load trước): state.js
 * Chức năng:
 *   - Drawer: toggle/open
 *   - saveDirective(): lưu chỉ đạo mới từ form trong Drawer
 *   - applyDirectiveIndicators(): gắn badge + viền màu lên metric cards
 *   - populateUI(): render danh sách drawer + cập nhật badge count
 *   - populateAdminList(), selectAdminDirective(), updateAdminDirective()
 *   - Event listeners
 */

// ----- DOM Elements -----
const eventDrawer           = document.getElementById('eventDrawer');
const drawerBadge           = document.getElementById('drawerBadge');
const adminOverlay          = document.getElementById('adminOverlay');
const adminList             = document.getElementById('adminList');
const adminDetailCard       = document.getElementById('adminDetailCard');
const adminDetailPlaceholder= document.getElementById('adminDetailPlaceholder');
const adminDetailLoc        = document.getElementById('adminDetailLoc');
const adminDetailContent    = document.getElementById('adminDetailContent');
const adminDetailDueDate    = document.getElementById('adminDetailDueDate');
const adminStatus           = document.getElementById('adminStatus');
const adminReportText       = document.getElementById('adminReportText');

let selectedAdminDirectiveId = null;

// ----- Flatpickr (Rule 8) -----
flatpickr(document.getElementById('formDueDate'), {
  dateFormat: 'd/m/Y',
  defaultDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});

// ----- Drawer -----
function toggleDrawer() { eventDrawer.classList.toggle('open'); }
function openDrawer()   { eventDrawer.classList.add('open'); }

// ----- Save Directive -----
function saveDirective() {
  const metricId = document.getElementById('formMetric').value;
  const content  = document.getElementById('formContent').value.trim();
  const dueDate  = document.getElementById('formDueDate').value;

  if (!metricId) { alert('Vui lòng chọn chỉ số cần chỉ đạo.'); return; }
  if (!content)  { alert('Vui lòng nhập nội dung chỉ đạo.'); return; }

  const now = new Date();
  const createdAt = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  directives.push({ id: 'dir_' + Date.now(), metricId, content, dueDate, status: 'Chưa xử lý', report: '', createdAt });
  saveDirectives();

  // Reset form
  document.getElementById('formMetric').value  = '';
  document.getElementById('formContent').value = '';
  document.getElementById('formDueDate').value = '';

  populateUI();
}

// ----- Apply Directive Indicators on Metric Cards -----
function applyDirectiveIndicators() {
  // Xóa badge và class cũ
  document.querySelectorAll('.metric-block').forEach(card => {
    card.classList.remove('has-directive-pending', 'has-directive-processing', 'has-directive-completed');
    const old = card.querySelector('.directive-badge');
    if (old) old.remove();
  });

  // Ưu tiên: Chưa xử lý > Đang xử lý > Đã hoàn thành (per card)
  const priority = { 'Chưa xử lý': 3, 'Đang xử lý': 2, 'Đã hoàn thành': 1 };
  const metricMap = {};
  directives.forEach(d => {
    if (!metricMap[d.metricId] || priority[d.status] > priority[metricMap[d.metricId].status]) {
      metricMap[d.metricId] = d;
    }
  });

  Object.values(metricMap).forEach(dir => {
    const card = document.getElementById(dir.metricId);
    if (!card) return;

    let borderClass, iconHtml, tooltipText;
    if (dir.status === 'Chưa xử lý') {
      borderClass = 'has-directive-pending';
      iconHtml    = '<i class="fa-solid fa-flag" style="color:#e65100;"></i>';
      tooltipText = `[Chưa xử lý] ${dir.content}`;
    } else if (dir.status === 'Đang xử lý') {
      borderClass = 'has-directive-processing';
      iconHtml    = '<i class="fa-solid fa-flag" style="color:#0288d1;"></i>';
      tooltipText = `[Đang xử lý] ${dir.content}`;
    } else {
      borderClass = 'has-directive-completed';
      iconHtml    = '<i class="fa-solid fa-flag-checkered" style="color:#2e7d32;"></i>';
      tooltipText = `[Hoàn thành] ${dir.content}`;
    }

    card.classList.add(borderClass);
    const badge = document.createElement('span');
    badge.className = 'directive-badge';
    badge.innerHTML = iconHtml;
    badge.title     = tooltipText;
    card.appendChild(badge);
  });
}

// ----- Populate UI (Save = Populate - Rule 16) -----
function populateUI() {
  const listEl = document.getElementById('directiveList');
  listEl.innerHTML = '';

  // Badge count
  const activeCount = directives.filter(d => d.status !== 'Đã hoàn thành').length;
  drawerBadge.textContent   = activeCount;
  drawerBadge.style.display = activeCount > 0 ? 'flex' : 'none';

  if (directives.length === 0) {
    listEl.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:10px;">Chưa có chỉ đạo nào.</div>';
  } else {
    directives.slice().reverse().forEach(dir => {
      const metricLabel = METRIC_LABELS[dir.metricId] || dir.metricId;
      let statusClass = 'status-pending';
      if (dir.status === 'Đang xử lý')   statusClass = 'status-processing';
      if (dir.status === 'Đã hoàn thành') statusClass = 'status-completed';

      const reportHtml = dir.report
        ? `<div class="directive-report"><span class="directive-report-lbl"><i class="fa-solid fa-reply"></i> Báo cáo:</span> ${dir.report}</div>`
        : '';

      const item = document.createElement('div');
      item.className = 'directive-item';
      item.innerHTML = `
        <div class="directive-loc">
          <span><i class="fa-solid fa-chart-bar"></i> ${metricLabel}</span>
          <span class="directive-status ${statusClass}">${dir.status}</span>
        </div>
        <p class="directive-text">${dir.content}</p>
        <div class="directive-date"><i class="fa-regular fa-clock"></i> Hạn: ${dir.dueDate} | Tạo: ${dir.createdAt}</div>
        ${reportHtml}
      `;
      listEl.appendChild(item);
    });
  }

  applyDirectiveIndicators();
  populateAdminList();
}

// ----- Admin Controls -----
function populateAdminList() {
  adminList.innerHTML = '';
  if (directives.length === 0) {
    adminList.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:20px;">Không có chỉ đạo nào cần xử lý.</div>';
    adminDetailCard.style.display        = 'none';
    adminDetailPlaceholder.style.display = 'flex';
    return;
  }

  directives.forEach(dir => {
    const item = document.createElement('div');
    item.className = 'admin-item' + (selectedAdminDirectiveId === dir.id ? ' selected' : '');

    let statusClass = 'status-pending';
    if (dir.status === 'Đang xử lý')   statusClass = 'status-processing';
    if (dir.status === 'Đã hoàn thành') statusClass = 'status-completed';

    item.innerHTML = `
      <div class="admin-item-info">
        <span style="font-weight:700;color:var(--magenta);"><i class="fa-solid fa-chart-bar"></i> ${METRIC_LABELS[dir.metricId] || dir.metricId}</span>
        <span style="font-size:var(--fs-sm);">${dir.content}</span>
        <span style="font-size:var(--fs-xs);color:var(--text-muted);">Tạo lúc: ${dir.createdAt}</span>
      </div>
      <span class="directive-status ${statusClass}">${dir.status}</span>
    `;
    item.addEventListener('click', () => selectAdminDirective(dir.id));
    adminList.appendChild(item);
  });
}

function selectAdminDirective(id) {
  selectedAdminDirectiveId = id;
  const dir = directives.find(d => d.id === id);
  if (!dir) return;

  adminList.querySelectorAll('.admin-item').forEach((el, idx) => {
    el.classList.toggle('selected', directives[idx].id === id);
  });

  adminDetailLoc.value      = METRIC_LABELS[dir.metricId] || dir.metricId;
  adminDetailContent.value  = dir.content;
  adminDetailDueDate.value  = dir.dueDate;
  adminStatus.value         = dir.status;
  adminReportText.value     = dir.report;

  adminDetailPlaceholder.style.display = 'none';
  adminDetailCard.style.display        = 'flex';
}

function updateAdminDirective() {
  if (!selectedAdminDirectiveId) return;
  const dir = directives.find(d => d.id === selectedAdminDirectiveId);
  if (!dir) return;

  dir.status = adminStatus.value;
  dir.report = adminReportText.value.trim();
  saveDirectives();

  alert('Cập nhật báo cáo chỉ đạo thành công!');
  populateAdminList();
  populateUI();
}

// ----- Event Listeners -----
document.getElementById('btnToggleAdmin').addEventListener('click', () => {
  adminOverlay.classList.add('open');
  populateAdminList();
});
document.getElementById('btnExitAdmin').addEventListener('click', () => {
  adminOverlay.classList.remove('open');
  populateUI();
});
document.getElementById('btnToggleDrawer').addEventListener('click', toggleDrawer);

// ----- Init -----
populateUI();
