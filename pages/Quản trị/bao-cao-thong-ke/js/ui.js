/**
 * UI.JS — Báo cáo & Thống kê Chỉ đạo
 * Render giao diện, bộ lọc nâng cao, 20 mẫu báo cáo/thống kê, bảng dữ liệu động & drawer chi tiết
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof loadSharedLayout === 'function') loadSharedLayout('nav-bao-cao-thong-ke');
  normalizePrototypeData();
  initFlatpickr();
  initMultiselectEvents();
  initFilterEvents();
  initPeriodControls();
  initSearchableMultiselects();
  initTemplateCollapse();
  initChartModal();
  renderMainTabs();
  renderTemplateCards();
  renderTable();

  // Document click listener to close custom dropdowns on click outside
  document.addEventListener('click', (e) => {
    const wrap = document.getElementById('statusMultiselectWrap');
    if (wrap && !wrap.contains(e.target)) {
      wrap.classList.remove('open');
    }
    const exportWrap = document.querySelector('.export-dropdown-wrap');
    if (exportWrap && !exportWrap.contains(e.target)) {
      exportWrap.classList.remove('open');
    }
  });

  // ESC key listener to close dropdowns & drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const wrap = document.getElementById('statusMultiselectWrap');
      if (wrap) wrap.classList.remove('open');
      const exportWrap = document.querySelector('.export-dropdown-wrap');
      if (exportWrap) exportWrap.classList.remove('open');
      closeDetailDrawer();
    }
  });
});

/* ---------- INITIALIZATION ---------- */
function initFlatpickr() {
  if (typeof flatpickr !== 'undefined') {
    flatpickr('#filterFromDate', {
      locale: 'vn',
      dateFormat: 'Y-m-d',
      altInput: true,
      altFormat: 'd/m/Y',
      onChange: (selectedDates, dateStr) => {
        window.ReportState.filters.fromDate = dateStr;
      }
    });

    flatpickr('#filterToDate', {
      locale: 'vn',
      dateFormat: 'Y-m-d',
      altInput: true,
      altFormat: 'd/m/Y',
      onChange: (selectedDates, dateStr) => {
        window.ReportState.filters.toDate = dateStr;
      }
    });
  }
}

/* Custom Multiselect Trạng thái Dropdown logic */
function initMultiselectEvents() {
  const trigger = document.getElementById('statusMultiselectTrigger');
  const wrap = document.getElementById('statusMultiselectWrap');
  const cbSelectAll = document.getElementById('cbStatusSelectAll');
  const cbOpts = document.querySelectorAll('.cb-status-opt');

  if (trigger && wrap) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      wrap.classList.toggle('open');
    });
  }

  if (cbSelectAll) {
    cbSelectAll.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      cbOpts.forEach(cb => {
        cb.checked = isChecked;
      });
      updateStatusMultiselectState();
    });
  }

  cbOpts.forEach(cb => {
    cb.addEventListener('change', () => {
      const allChecked = Array.from(cbOpts).every(item => item.checked);
      if (cbSelectAll) cbSelectAll.checked = allChecked;
      updateStatusMultiselectState();
    });
  });
}

function updateStatusMultiselectState() {
  const cbOpts = document.querySelectorAll('.cb-status-opt:checked');
  const selectedStatuses = Array.from(cbOpts).map(cb => cb.value);
  window.ReportState.filters.statuses = selectedStatuses;

  const labelSpan = document.getElementById('statusMultiselectLabel');
  if (labelSpan) {
    if (selectedStatuses.length === 0 || selectedStatuses.length === 5) {
      labelSpan.textContent = 'Tất cả trạng thái';
    } else {
      labelSpan.textContent = `Đã chọn (${selectedStatuses.length}) trạng thái`;
    }
  }
}

/* Event Listeners for Filters */
function initFilterEvents() {
  const filterPeriod = document.getElementById('filterPeriod');
  const filterDataGroup = document.getElementById('filterDataGroup');
  const searchInput = document.getElementById('searchInput');
  const btnClearSearch = document.getElementById('btnClearSearch');
  const btnResetFilters = document.getElementById('btnResetFilters');

  if (filterPeriod) filterPeriod.addEventListener('change', updatePeriodUI);

  // Checkbox tags
  ['cbOntime', 'cbOverdue', 'cbRevision', 'cbHasFile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        window.ReportState.filters.isOntime = document.getElementById('cbOntime').checked;
        window.ReportState.filters.isOverdue = document.getElementById('cbOverdue').checked;
        window.ReportState.filters.isRevision = document.getElementById('cbRevision').checked;
        window.ReportState.filters.hasFile = document.getElementById('cbHasFile').checked;
      });
    }
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const val = e.target.value;
      if (btnClearSearch) btnClearSearch.hidden = (val === '');
    });
  }

  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      btnClearSearch.hidden = true;
    });
  }

  if (btnResetFilters) {
    btnResetFilters.addEventListener('click', resetFilters);
  }
  const btnApply = document.getElementById('btnApplyFilters');
  if (btnApply) btnApply.addEventListener('click', collectAndApplyFilters);
}

function resetFilters() {
  window.ReportState.filters = {
    period: 'month',
    periodValue: new Date().getMonth() + 1,
    periodYear: new Date().getFullYear(),
    fromDate: '',
    toDate: '',
    units: [],
    dataGroup: 'all',
    assigners: [],
    assignees: [],
    statuses: [],
    isOntime: false,
    isOverdue: false,
    isRevision: false,
    hasFile: false,
    keyword: ''
  };

  ['filterDataGroup'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 'all';
  });

  ['cbOntime', 'cbOverdue', 'cbRevision', 'cbHasFile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });

  const cbSelectAll = document.getElementById('cbStatusSelectAll');
  if (cbSelectAll) cbSelectAll.checked = false;
  document.querySelectorAll('.cb-status-opt').forEach(cb => cb.checked = false);
  const statusLabel = document.getElementById('statusMultiselectLabel');
  if (statusLabel) statusLabel.textContent = 'Tất cả trạng thái';

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  const btnClearSearch = document.getElementById('btnClearSearch');
  if (btnClearSearch) btnClearSearch.hidden = true;

  document.getElementById('filterPeriod').value = 'month';
  document.querySelectorAll('.searchable-multiselect').forEach(wrap => {
    wrap.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    renderMultiTags(wrap);
  });
  updatePeriodUI();
  applyFilters();
  showToast('Đã đặt lại toàn bộ bộ lọc!');
}

function applyFilters() {
  window.ReportState.pagination.currentPage = 1;
  renderTable();
}

/* ---------- TAB & CARD SELECTION ---------- */
function switchMainTab(type) {
  window.ReportState.activeTabType = type;
  document.getElementById('tabBtnReport').classList.toggle('active', type === 'report');
  document.getElementById('tabBtnStat').classList.toggle('active', type === 'stat');

  // Activate first template in the selected tab
  const list = type === 'report' ? window.ReportState.reportTemplates : window.ReportState.statTemplates;
  window.ReportState.activeTemplateId = list[0].id;

  renderTemplateCards();
  updateSelectedTemplateSummary();
  renderTable();
}

function renderMainTabs() {
  document.getElementById('tabBtnReport').classList.toggle('active', window.ReportState.activeTabType === 'report');
  document.getElementById('tabBtnStat').classList.toggle('active', window.ReportState.activeTabType === 'stat');
}

function renderTemplateCards() {
  const container = document.getElementById('templateCardsGrid');
  if (!container) return;

  const isReport = window.ReportState.activeTabType === 'report';
  const list = isReport ? window.ReportState.reportTemplates : window.ReportState.statTemplates;

  container.innerHTML = list.map(tpl => {
    const isActive = tpl.id === window.ReportState.activeTemplateId;
    return `
      <div class="template-card ${isActive ? 'active' : ''}" onclick="selectTemplate('${tpl.id}')">
        <div class="card-icon-box">
          <i class="${tpl.icon}"></i>
        </div>
        <div class="card-info"><span class="card-title" title="${tpl.name}">${tpl.name}</span></div>
      </div>
    `;
  }).join('');
}

function selectTemplate(id) {
  window.ReportState.activeTemplateId = id;
  syncPeriodWithTemplate(id);
  renderTemplateCards();
  updateSelectedTemplateSummary();
  renderTable();
}

/* ---------- TABLE RENDERING & DATA FILTERING ---------- */
function getActiveTemplateConfig() {
  const isReport = window.ReportState.activeTabType === 'report';
  const list = isReport ? window.ReportState.reportTemplates : window.ReportState.statTemplates;
  return list.find(t => t.id === window.ReportState.activeTemplateId) || list[0];
}

function getFilteredData() {
  const config = getActiveTemplateConfig();
  const f = window.ReportState.filters;

  // If aggregated template, return aggregated mock rows directly
  if (config.isAggregated) {
    return generateAggregatedRows(config.id);
  }

  // Standard directive records filtering
  return window.ReportState.mockDirectives.filter(item => {
    if (f.units.length && !f.units.includes(item.unit)) return false;
    if (f.assigners.length && !f.assigners.includes(item.assigner)) return false;
    if (f.assignees.length && !f.assignees.includes(item.assignee)) return false;
    if (f.dataGroup !== 'all' && item.dataGroup !== f.dataGroup) return false;

    if (f.statuses && f.statuses.length > 0) {
      if (!f.statuses.includes(item.status)) return false;
    }

    if (f.isOntime && item.onTimeStatus !== 'Đúng hạn') return false;
    if (f.isOverdue && item.onTimeStatus !== 'Quá hạn') return false;
    if (f.isRevision && item.revisionTimes === 0) return false;
    if (f.hasFile && !item.hasFile) return false;

    // Filter template specific criteria
    if (config.id === 'rep_2' && item.onTimeStatus !== 'Quá hạn') return false; // Chỉ đạo quá hạn
    if (config.id === 'rep_5' && item.revisionTimes === 0) return false; // Yêu cầu làm lại
    if (config.id === 'rep_8' && (item.remainingDays < 3 || item.remainingDays > 7)) return false; // Sắp đến hạn
    if (config.id === 'rep_9' && item.status === 'Đã kết thúc') return false; // Quy trình kẹt

    const issueDate = parsePrototypeDate(item.issueDate);
    const fromDate = f.fromDate ? new Date(`${f.fromDate}T00:00:00`) : null;
    const toDate = f.toDate ? new Date(`${f.toDate}T23:59:59`) : null;
    if (fromDate && issueDate < fromDate) return false;
    if (toDate && issueDate > toDate) return false;

    if (f.keyword) {
      const kw = f.keyword.toLowerCase();
      const fields = ['code', 'title', 'unit', 'assigner', 'assignee', 'note', 'dataGroup'];
      if (!fields.some(field => String(item[field] || '').toLowerCase().includes(kw))) return false;
    }

    return true;
  });
}

function renderTable() {
  const config = getActiveTemplateConfig();

  // Update title & desc
  const titleEl = document.getElementById('currentTemplateTitle');
  const descEl = document.getElementById('currentTemplateDesc');
  if (titleEl) titleEl.textContent = config.title;
  if (descEl) descEl.textContent = config.desc;

  // Render Table Header
  const thead = document.getElementById('tableHead');
  if (thead) {
    let headerHtml = '<tr>';
    headerHtml += `<th style="width: 40px; text-align: center;"><input type="checkbox" id="cbSelectAllRows" onchange="toggleSelectAllRows(this)"></th>`;
    config.columns.forEach(col => {
      const isSorted = window.ReportState.sort.field === col.key;
      const sortIcon = isSorted ? (window.ReportState.sort.dir === 'asc' ? ' <i class="fa-solid fa-sort-up"></i>' : ' <i class="fa-solid fa-sort-down"></i>') : '';
      headerHtml += `<th class="${col.sortable ? 'sortable' : ''}" onclick="${col.sortable ? `handleSort('${col.key}')` : ''}">${col.label}${sortIcon}</th>`;
    });
    headerHtml += `<th style="width: 100px; text-align: center;">Thao tác</th>`;
    headerHtml += '</tr>';
    thead.innerHTML = headerHtml;
  }

  // Get data
  let data = getFilteredData();

  // Apply Sorting
  if (window.ReportState.sort.field) {
    const key = window.ReportState.sort.field;
    const dir = window.ReportState.sort.dir === 'asc' ? 1 : -1;
    data.sort((a, b) => {
      const valA = a[key] !== undefined ? a[key] : '';
      const valB = b[key] !== undefined ? b[key] : '';
      if (typeof valA === 'number' && typeof valB === 'number') {
        return (valA - valB) * dir;
      }
      return String(valA).localeCompare(String(valB), 'vi') * dir;
    });
  }

  // Pagination calculation
  const total = data.length;
  const pageSize = window.ReportState.pagination.pageSize;
  let currentPage = window.ReportState.pagination.currentPage;
  const maxPage = Math.ceil(total / pageSize) || 1;

  if (currentPage > maxPage) {
    currentPage = maxPage;
    window.ReportState.pagination.currentPage = currentPage;
  }

  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const pageData = data.slice(startIdx, endIdx);

  // Render Table Body
  const tbody = document.getElementById('tableBody');
  if (tbody) {
    if (pageData.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${config.columns.length + 2}" style="text-align: center; color: #94a3b8; padding: 30px;">Không có dữ liệu phù hợp với bộ lọc hiện tại</td></tr>`;
    } else {
      tbody.innerHTML = pageData.map(row => {
        const rowKey = getRowKey(row);
        const isChecked = window.ReportState.selectedRowIds.has(rowKey);
        let trHtml = `<tr class="${isChecked ? 'selected' : ''}">`;
        trHtml += `<td class="cell-center"><input type="checkbox" class="cb-row" value="${escapeHtml(rowKey)}" ${isChecked ? 'checked' : ''} onchange="toggleSelectRow('${escapeHtml(rowKey)}', this.checked)"></td>`;

        config.columns.forEach(col => {
          trHtml += `<td><div class="cell-ellipsis" title="${escapeHtml(stripHtml(row[col.key]))}">${renderCellContent(col.key, row[col.key], row)}</div></td>`;
        });

        trHtml += `<td class="cell-center"><button type="button" class="btn-table-action" onclick="openDetailDrawer('${row.id || 1}')"><i class="fa-solid fa-eye"></i> Xem chi tiết</button></td>`;
        trHtml += `</tr>`;
        return trHtml;
      }).join('');
    }
  }

  // Update Pagination UI
  document.getElementById('pagStart').textContent = total === 0 ? 0 : startIdx + 1;
  document.getElementById('pagEnd').textContent = endIdx;
  document.getElementById('pagTotal').textContent = total;
  renderPaginationButtons(maxPage, currentPage);
  updateBatchActionsUI();
}

/* Helper cell renderer */
function renderCellContent(key, value, row) {
  if (value === undefined || value === null) return '—';

  if (key === 'code') {
    return `<span class="code-badge">${value}</span>`;
  }
  if (key === 'status') {
    const stepClass = getStepClass(value);
    return `<span class="badge-step ${stepClass}">${value}</span>`;
  }
  if (key === 'onTimeStatus') {
    if (value === 'Đúng hạn') return `<span class="badge-ontime"><i class="fa-solid fa-check"></i> Đúng hạn</span>`;
    if (value === 'Quá hạn') return `<span class="badge-overdue"><i class="fa-solid fa-triangle-exclamation"></i> Quá hạn</span>`;
    return value;
  }
  if (key === 'hasFile') {
    return value ? `<i class="fa-solid fa-paperclip color-blue" title="${row.fileName || 'Có file đính kèm'}"></i>` : '—';
  }
  if (key === 'dashboardUrl') {
    return value ? `<a href="${value}" class="color-blue" style="font-size:12px; font-weight:600;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Xem</a>` : '—';
  }
  if (key === 'overdueDays' || key === 'remainingDays') {
    if (typeof value === 'number' && value < 0) {
      return `<span class="color-red font-bold">${value} ngày</span>`;
    }
    return `${value} ngày`;
  }
  return value;
}

function getStepClass(statusStr) {
  if (!statusStr) return 'step-1';
  if (statusStr.includes('Chờ phân công')) return 'step-1';
  if (statusStr.includes('Đang xử lý')) return 'step-2';
  if (statusStr.includes('Đã có báo cáo')) return 'step-3';
  if (statusStr.includes('Chờ phê duyệt')) return 'step-4';
  if (statusStr.includes('Đã kết thúc')) return 'step-5';
  return 'step-2';
}

/* Generate Aggregated Rows for Stat templates */
function generateAggregatedRows(templateId) {
  if (templateId === 'rep_3' || templateId === 'stat_2' || templateId === 'stat_3') {
    return [
      { unit: 'Sở Thông tin và Truyền thông', totalAssigned: 15, completed: 12, onTimeCount: 11, overdueCount: 1, completionRate: '80%', onTimeRate: '91.6%', revisionCount: 1, total: 15, completionRatePct: '80%', rank: 'Hạng 1', overdueRatePct: '6.6%', avgOverdueDays: '2.5 ngày' },
      { unit: 'Công an Tỉnh Gia Lai', totalAssigned: 28, completed: 18, onTimeCount: 14, overdueCount: 4, completionRate: '64.3%', onTimeRate: '77.7%', revisionCount: 2, total: 28, completionRatePct: '64.3%', rank: 'Hạng 4', overdueRatePct: '14.2%', avgOverdueDays: '5.0 ngày' },
      { unit: 'Sở Tài nguyên và Môi trường', totalAssigned: 10, completed: 9, onTimeCount: 9, overdueCount: 0, completionRate: '90%', onTimeRate: '100%', revisionCount: 0, total: 10, completionRatePct: '90%', rank: 'Hạng 2', overdueRatePct: '0%', avgOverdueDays: '0 ngày' },
      { unit: 'Sở Lao động - TB&XH', totalAssigned: 20, completed: 18, onTimeCount: 16, overdueCount: 2, completionRate: '90%', onTimeRate: '88.8%', revisionCount: 1, total: 20, completionRatePct: '90%', rank: 'Hạng 3', overdueRatePct: '10%', avgOverdueDays: '3.0 ngày' },
      { unit: 'Sở Giáo dục và Đào tạo', totalAssigned: 12, completed: 8, onTimeCount: 8, overdueCount: 0, completionRate: '66.6%', onTimeRate: '100%', revisionCount: 0, total: 12, completionRatePct: '66.6%', rank: 'Hạng 5', overdueRatePct: '0%', avgOverdueDays: '0 ngày' },
      { unit: 'Sở Y tế', totalAssigned: 22, completed: 14, onTimeCount: 11, overdueCount: 3, completionRate: '63.6%', onTimeRate: '78.5%', revisionCount: 2, total: 22, completionRatePct: '63.6%', rank: 'Hạng 6', overdueRatePct: '13.6%', avgOverdueDays: '4.2 ngày' }
    ];
  }

  if (templateId === 'rep_6' || templateId === 'stat_5') {
    return [
      { dataGroup: 'Dân cư theo địa giới', totalDirectives: 25, processingCount: 8, completedCount: 15, overdueCount: 2, completionRate: '60%', total: 25, completed: 15, overdue: 2, ratePct: '60%' },
      { dataGroup: 'Độ tuổi & Giới tính', totalDirectives: 36, processingCount: 10, completedCount: 22, overdueCount: 4, completionRate: '61.1%', total: 36, completed: 22, overdue: 4, ratePct: '61.1%' },
      { dataGroup: 'Lao động & Việc làm', totalDirectives: 20, processingCount: 2, completedCount: 18, overdueCount: 0, completionRate: '90%', total: 20, completed: 18, overdue: 0, ratePct: '90%' },
      { dataGroup: 'Giáo dục & Độ tuổi', totalDirectives: 12, processingCount: 4, completedCount: 8, overdueCount: 0, completionRate: '66.6%', total: 12, completed: 8, overdue: 0, ratePct: '66.6%' },
      { dataGroup: 'Bảo trợ xã hội', totalDirectives: 14, processingCount: 4, completedCount: 10, overdueCount: 3, completionRate: '71.4%', total: 14, completed: 10, overdue: 3, ratePct: '71.4%' }
    ];
  }

  if (templateId === 'rep_7') {
    return [
      { assigner: 'Chủ tịch UBND Tỉnh', totalDirectives: 65, completedCount: 50, processingCount: 12, overdueCount: 3, completionRate: '76.9%' },
      { assigner: 'Phó Chủ tịch UBND Tỉnh', totalDirectives: 42, completedCount: 31, processingCount: 9, overdueCount: 2, completionRate: '73.8%' }
    ];
  }

  if (templateId === 'stat_1') {
    const f = window.ReportState.filters;
    const month = f.period === 'month' ? f.periodValue : new Date().getMonth() + 1;
    const year = f.periodYear || new Date().getFullYear();
    const periodRows = window.ReportState.mockDirectives.filter(item => {
      const date = parsePrototypeDate(item.issueDate);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    });
    const completed = periodRows.filter(item => item.status === 'Đã kết thúc').length;
    const overdue = periodRows.filter(item => item.onTimeStatus === 'Quá hạn').length;
    return [{
      period: `Tháng ${String(month).padStart(2, '0')}/${year}`,
      totalReceived: periodRows.length,
      completed,
      processing: periodRows.length - completed,
      overdue,
      completionRate: periodRows.length ? `${(completed / periodRows.length * 100).toFixed(1)}%` : '0%'
    }];
  }

  if (templateId === 'stat_4') {
    return [
      { stepName: 'Chờ phân công', count: 5, sharePct: '4.7%', avgStuckHours: '12 giờ' },
      { stepName: 'Đang xử lý', count: 30, sharePct: '28.0%', avgStuckHours: '4.2 ngày' },
      { stepName: 'Đã có báo cáo', count: 8, sharePct: '7.4%', avgStuckHours: '1.0 ngày' },
      { stepName: 'Chờ phê duyệt', count: 6, sharePct: '5.6%', avgStuckHours: '2.0 ngày' },
      { stepName: 'Đã kết thúc', count: 58, sharePct: '54.2%', avgStuckHours: '0 ngày' }
    ];
  }

  if (templateId === 'stat_6') {
    return [
      { assignee: 'Trần Văn Mạnh', assignedCount: 15, completed: 12, onTime: 11, overdue: 1, ratePct: '80%' },
      { assignee: 'Lê Thị Thu', assignedCount: 28, completed: 18, onTime: 14, overdue: 4, ratePct: '64.3%' },
      { assignee: 'Nguyễn Văn Minh', assignedCount: 10, completed: 9, onTime: 9, overdue: 0, ratePct: '90%' },
      { assignee: 'Phạm Thị Mai', assignedCount: 20, completed: 18, onTime: 16, overdue: 2, ratePct: '90%' },
      { assignee: 'Hoàng Văn Nam', assignedCount: 12, completed: 8, onTime: 8, overdue: 0, ratePct: '66.6%' }
    ];
  }

  if (templateId === 'stat_7') {
    const today = new Date();
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
      const items = window.ReportState.mockDirectives.filter(item => {
        const issueDate = parsePrototypeDate(item.issueDate);
        return issueDate.getMonth() === date.getMonth() && issueDate.getFullYear() === date.getFullYear();
      });
      const completed = items.filter(item => item.status === 'Đã kết thúc').length;
      return {
        month: `T${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`,
        received: items.length,
        completed,
        ratePct: items.length ? `${(completed / items.length * 100).toFixed(1)}%` : '0%',
        momGrowth: index === 0 ? '—' : `${items.length >= 1 ? '+' : ''}${items.length}`
      };
    });
  }

  if (templateId === 'stat_8') {
    return [
      { targetOwner: 'Công an Tỉnh Gia Lai', revisionCount: 2, revisionRatePct: '7.1%', topReason: 'Thiếu số liệu phân bổ xã phường miền núi' },
      { targetOwner: 'Sở Y tế', revisionCount: 2, revisionRatePct: '9.0%', topReason: 'Chưa đối soát xong số liệu BHYT hộ nghèo' },
      { targetOwner: 'Sở Thông tin và Truyền thông', revisionCount: 1, revisionRatePct: '6.6%', topReason: 'Thiếu đính kèm file báo cáo chi tiết' },
      { targetOwner: 'Sở Lao động - TB&XH', revisionCount: 1, revisionRatePct: '5.0%', topReason: 'Chưa cập nhật biểu đồ biến động' }
    ];
  }

  if (templateId === 'stat_9') {
    return [
      { period: 'Quý I/2026', onTimeCount: 83, lateCount: 2, onTimePct: '97.6%', avgDiffDays: '-2.1 ngày' },
      { period: 'Quý II/2026', onTimeCount: 104, lateCount: 5, onTimePct: '95.4%', avgDiffDays: '-1.5 ngày' },
      { period: 'Tháng 07/2026', onTimeCount: 45, lateCount: 3, onTimePct: '93.7%', avgDiffDays: '-1.0 ngày' }
    ];
  }

  if (templateId === 'stat_10') {
    return [
      { metricName: 'Số chỉ đạo trễ hạn toàn tỉnh', valueStr: '7 chỉ đạo', diffPrev: '+2 chỉ đạo', alertLevel: '<span class="badge-overdue">Cảnh báo Đỏ</span>', recommendation: 'Phát văn bản đôn đốc khẩn Công an Tỉnh & Sở Y tế' },
      { metricName: 'Tỷ lệ hoàn thành nhiệm vụ cấp Sở', valueStr: '76.4%', diffPrev: '+1.8%', alertLevel: '<span class="badge-ontime">Bình thường</span>', recommendation: 'Duy trì nhịp độ thực hiện hiện tại' },
      { metricName: 'Thời gian nghẽn quy trình TB', valueStr: '3.2 ngày', diffPrev: '-0.5 ngày', alertLevel: '<span class="tag-label tag-orange">Cảnh báo Vàng</span>', recommendation: 'Rà soát bước 3 (Thực hiện) tại các đơn vị châm trễ' }
    ];
  }

  return [];
}

/* SORTING & PAGINATION */
function handleSort(field) {
  if (window.ReportState.sort.field === field) {
    window.ReportState.sort.dir = window.ReportState.sort.dir === 'asc' ? 'desc' : 'asc';
  } else {
    window.ReportState.sort.field = field;
    window.ReportState.sort.dir = 'asc';
  }
  renderTable();
}

function changePageSize(val) {
  window.ReportState.pagination.pageSize = parseInt(val, 10);
  window.ReportState.pagination.currentPage = 1;
  renderTable();
}

function goToPage(p) {
  window.ReportState.pagination.currentPage = p;
  renderTable();
}

function renderPaginationButtons(maxPage, current) {
  const container = document.getElementById('paginationButtons');
  if (!container) return;

  let html = '';
  html += `<button type="button" class="btn-page" ${current === 1 ? 'disabled' : ''} onclick="goToPage(${current - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;

  for (let i = 1; i <= maxPage; i++) {
    html += `<button type="button" class="btn-page ${i === current ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }

  html += `<button type="button" class="btn-page" ${current === maxPage ? 'disabled' : ''} onclick="goToPage(${current + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;
  container.innerHTML = html;
}

/* BATCH ACTIONS & SELECTION */
function toggleSelectAllRows(masterCb) {
  const isChecked = masterCb.checked;
  const cbRows = document.querySelectorAll('.cb-row');
  cbRows.forEach(cb => {
    cb.checked = isChecked;
    toggleSelectRow(cb.value, isChecked, false);
  });
  updateBatchActionsUI();
}

function toggleSelectRow(id, isChecked, updateUI = true) {
  if (isChecked) {
    window.ReportState.selectedRowIds.add(id);
  } else {
    window.ReportState.selectedRowIds.delete(id);
  }
  if (updateUI) updateBatchActionsUI();
}

function updateBatchActionsUI() {
  const count = window.ReportState.selectedRowIds.size;
  const batchWrap = document.getElementById('batchActionsWrap');
  const countLabel = document.getElementById('selectedCount');
  if (batchWrap) {
    batchWrap.hidden = count === 0;
  }
  if (countLabel) {
    countLabel.textContent = count;
  }
}

function handleBatchAction(action) {
  const count = window.ReportState.selectedRowIds.size;
  if (count === 0) return;
  exportData('excel', true);
}

/* EXPORT MENU & TOAST */
function toggleExportMenu() {
  const exportWrap = document.querySelector('.export-dropdown-wrap');
  if (exportWrap) {
    exportWrap.classList.toggle('open');
  }
}

async function exportData(type, selectedOnly = false) {
  const exportWrap = document.querySelector('.export-dropdown-wrap');
  if (exportWrap) exportWrap.classList.remove('open');
  if (type === 'print') {
    window.print();
    return;
  }
  const config = getActiveTemplateConfig();
  let rows = getFilteredData();
  if (selectedOnly) rows = rows.filter(row => window.ReportState.selectedRowIds.has(getRowKey(row)));
  if (!rows.length) {
    showToast('Không có dữ liệu phù hợp để xuất.');
    return;
  }
  const headers = config.columns.map(column => column.label);
  const values = rows.map(row => config.columns.map(column => stripHtml(row[column.key])));
  const filename = `${slugify(config.title)}-${new Date().toISOString().slice(0, 10)}`;
  try {
    if (type === 'excel') {
      if (!window.XLSX) throw new Error('Thư viện Excel chưa tải');
      const sheet = XLSX.utils.aoa_to_sheet([headers, ...values]);
      const book = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, sheet, 'Bao cao');
      XLSX.writeFile(book, `${filename}.xlsx`);
    } else if (type === 'pdf') {
      if (!window.jspdf) throw new Error('Thư viện PDF chưa tải');
      const doc = new window.jspdf.jsPDF({ orientation: headers.length > 6 ? 'landscape' : 'portrait' });
      doc.text(removeVietnamese(config.title), 14, 14);
      doc.autoTable({ head: [headers.map(removeVietnamese)], body: values.map(row => row.map(removeVietnamese)), startY: 20, styles: { fontSize: 7 } });
      doc.save(`${filename}.pdf`);
    } else if (type === 'word') {
      if (!window.docx) throw new Error('Thư viện Word chưa tải');
      const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } = window.docx;
      const tableRows = [headers, ...values].map((row, rowIndex) => new TableRow({
        children: row.map(cell => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(cell), bold: rowIndex === 0 })] })] }))
      }));
      const documentFile = new Document({ sections: [{ children: [new Paragraph({ text: config.title, heading: 'Heading1' }), new Table({ rows: tableRows })] }] });
      downloadBlob(await Packer.toBlob(documentFile), `${filename}.docx`);
    }
    showToast(`Đã xuất ${rows.length} bản ghi.`);
  } catch (error) {
    showToast(`Không thể xuất: ${error.message}`);
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  if (toast && msgEl) {
    msgEl.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

/* ---------- DETAIL SLIDE-OVER DRAWER ---------- */
function openDetailDrawer(id) {
  const directive = window.ReportState.mockDirectives.find(d => d.id == id) || window.ReportState.mockDirectives[0];

  const drawerOverlay = document.getElementById('detailDrawerOverlay');
  const drawer = document.getElementById('detailDrawer');
  const codeBadge = document.getElementById('drawerCodeBadge');
  const titleEl = document.getElementById('drawerDirectiveTitle');
  const bodyEl = document.getElementById('drawerBody');
  const dashLink = document.getElementById('drawerDashboardLink');

  if (codeBadge) codeBadge.textContent = directive.code;
  if (titleEl) titleEl.textContent = directive.title;
  if (dashLink) dashLink.href = directive.dashboardUrl || '#';

  if (bodyEl) {
    bodyEl.innerHTML = `
      <!-- Thẻ thông tin chính -->
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-circle-info"></i> Thông tin chung chỉ đạo</div>
        <div class="drawer-grid-2">
          <div class="drawer-field">
            <span class="field-label">Nhóm dữ liệu</span>
            <span class="field-value">${directive.dataGroup}</span>
          </div>
          <div class="drawer-field">
            <span class="field-label">Đơn vị chủ trì</span>
            <span class="field-value">${directive.unit}</span>
          </div>
          <div class="drawer-field">
            <span class="field-label">Người giao chỉ đạo</span>
            <span class="field-value">${directive.assigner}</span>
          </div>
          <div class="drawer-field">
            <span class="field-label">Người xử lý chính</span>
            <span class="field-value">${directive.assignee}</span>
          </div>
          <div class="drawer-field">
            <span class="field-label">Ngày ban hành</span>
            <span class="field-value">${directive.issueDate}</span>
          </div>
          <div class="drawer-field">
            <span class="field-label">Hạn xử lý</span>
            <span class="field-value color-red font-bold">${directive.dueDate}</span>
          </div>
        </div>
      </div>

      <!-- Đánh giá SLA & File đính kèm -->
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-paperclip"></i> Đánh giá & File đính kèm</div>
        <div class="drawer-grid-2">
          <div class="drawer-field">
            <span class="field-label">Đánh giá hạn</span>
            <span class="field-value">${directive.onTimeStatus === 'Đúng hạn' ? '<span class="badge-ontime">Đúng hạn</span>' : '<span class="badge-overdue">Quá hạn</span>'}</span>
          </div>
          <div class="drawer-field">
            <span class="field-label">Số lần yêu cầu làm lại</span>
            <span class="field-value">${directive.revisionTimes} lần</span>
          </div>
        </div>
        <div class="drawer-field" style="margin-top: 10px;">
          <span class="field-label">Ghi chú xử lý</span>
          <span class="field-value">${directive.note || 'Không có'}</span>
        </div>
        ${directive.hasFile ? `
          <div class="drawer-field" style="margin-top: 10px;">
            <span class="field-label">File báo cáo đính kèm</span>
            <span class="field-value"><i class="fa-solid fa-file-pdf color-red"></i> <a href="#" class="color-blue">${directive.fileName}</a></span>
          </div>
        ` : ''}
      </div>

      <!-- Tiến trình 5 trạng thái chỉ đạo -->
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-diagram-project"></i> Tiến trình trạng thái chỉ đạo</div>
        <div class="workflow-timeline">
          ${renderDirectiveTimeline(directive)}
        </div>
      </div>
    `;
  }

  if (drawerOverlay) drawerOverlay.classList.add('open');
  if (drawer) drawer.classList.add('open');
}

function renderDirectiveTimeline(directive) {
  const statuses = ['Chờ phân công', 'Đang xử lý', 'Đã có báo cáo', 'Chờ phê duyệt', 'Đã kết thúc'];
  const currentIndex = Math.max(0, statuses.indexOf(directive.status));
  return statuses.map((status, index) => {
    const stateClass = index < currentIndex ? 'completed' : index === currentIndex ? 'active' : '';
    const dot = index < currentIndex || directive.status === 'Đã kết thúc' ? '<i class="fa-solid fa-check"></i>' : index + 1;
    const meta = status === 'Đang xử lý' ? `Người xử lý: ${directive.assignee}` : status === 'Đã kết thúc' ? 'Lưu hồ sơ chỉ đạo vào hệ thống' : `Trạng thái ${status.toLowerCase()}`;
    return `<div class="timeline-step ${stateClass}"><div class="timeline-dot">${dot}</div><span class="step-title">${status}</span><span class="step-meta">${meta}</span></div>`;
  }).join('');
}

function closeDetailDrawer() {
  const drawerOverlay = document.getElementById('detailDrawerOverlay');
  const drawer = document.getElementById('detailDrawer');
  if (drawerOverlay) drawerOverlay.classList.remove('open');
  if (drawer) drawer.classList.remove('open');
}

/* ---------- ENHANCED FILTERS, PERIODS, CHARTS & EXPORT HELPERS ---------- */
function normalizePrototypeData() {
  const assigneeLabels = {
    'Trần Văn Mạnh (Chuyên viên)': 'ManhTV - Trần Văn Mạnh - Sở Thông tin và Truyền thông',
    'Lê Thị Thu (Đội trưởng C06)': 'ThuLT - Lê Thị Thu - Công an Tỉnh Gia Lai',
    'Nguyễn Văn Minh (Phó Trưởng phòng)': 'MinhNV - Nguyễn Văn Minh - Sở Tài nguyên và Môi trường',
    'Phạm Thị Mai (Trưởng phòng Việc làm)': 'MaiPT - Phạm Thị Mai - Sở Lao động - TB&XH',
    'Hoàng Văn Nam (Chuyên viên)': 'NamHV - Hoàng Văn Nam - Sở Giáo dục và Đào tạo',
    'Nguyễn Thị Hoa (Phó Giám đốc Sở)': 'HoaNT - Nguyễn Thị Hoa - Sở Y tế',
    'Vũ Minh Tuấn (Chuyên viên Dân số)': 'TuanVM - Vũ Minh Tuấn - Sở Y tế',
    'Ksor Nét (Phó Trưởng ban)': 'NetK - Ksor Nét - Ban Dân tộc Tỉnh Gia Lai'
  };
  window.ReportState.mockDirectives.forEach(item => {
    item.assignee = assigneeLabels[item.assignee] || item.assignee;
  });
  setPeriodRange('month', new Date().getMonth() + 1, new Date().getFullYear());
}

function initPeriodControls() {
  const year = new Date().getFullYear();
  const yearSelect = document.getElementById('filterPeriodYear');
  yearSelect.innerHTML = [year - 1, year, year + 1].map(value => `<option value="${value}">${value}</option>`).join('');
  yearSelect.value = year;
  document.getElementById('filterPeriodValue').addEventListener('change', updatePeriodRangeFromUI);
  yearSelect.addEventListener('change', updatePeriodRangeFromUI);
  updatePeriodUI();
}

function updatePeriodUI() {
  const mode = document.getElementById('filterPeriod').value;
  const group = document.getElementById('periodDetailGroup');
  const valueSelect = document.getElementById('filterPeriodValue');
  const label = document.getElementById('periodDetailLabel');
  group.hidden = !['week', 'month', 'quarter'].includes(mode);
  if (mode === 'week') {
    label.textContent = 'Tuần / Năm';
    valueSelect.innerHTML = Array.from({ length: 53 }, (_, index) => `<option value="${index + 1}">Tuần ${index + 1}</option>`).join('');
    valueSelect.value = getIsoWeek(new Date());
  } else if (mode === 'month') {
    label.textContent = 'Tháng / Năm';
    valueSelect.innerHTML = Array.from({ length: 12 }, (_, index) => `<option value="${index + 1}">Tháng ${index + 1}</option>`).join('');
    valueSelect.value = new Date().getMonth() + 1;
  } else if (mode === 'quarter') {
    label.textContent = 'Quý / Năm';
    valueSelect.innerHTML = [1, 2, 3, 4].map(value => `<option value="${value}">Quý ${value}</option>`).join('');
    valueSelect.value = Math.floor(new Date().getMonth() / 3) + 1;
  }
  if (mode === 'today') setDateInputs(new Date(), new Date());
  if (['week', 'month', 'quarter'].includes(mode)) updatePeriodRangeFromUI();
  if (!mode || mode === 'custom') group.hidden = true;
}

function updatePeriodRangeFromUI() {
  setPeriodRange(
    document.getElementById('filterPeriod').value,
    Number(document.getElementById('filterPeriodValue').value),
    Number(document.getElementById('filterPeriodYear').value)
  );
}

function setPeriodRange(mode, value, year) {
  let from;
  let to;
  if (mode === 'month') {
    from = new Date(year, value - 1, 1);
    to = new Date(year, value, 0);
  } else if (mode === 'quarter') {
    from = new Date(year, (value - 1) * 3, 1);
    to = new Date(year, value * 3, 0);
  } else if (mode === 'week') {
    const jan4 = new Date(year, 0, 4);
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (value - 1) * 7);
    from = monday;
    to = new Date(monday);
    to.setDate(monday.getDate() + 6);
  }
  if (from && to) setDateInputs(from, to);
}

function setDateInputs(from, to) {
  const fromEl = document.getElementById('filterFromDate');
  const toEl = document.getElementById('filterToDate');
  if (fromEl && fromEl._flatpickr) {
    fromEl._flatpickr.setDate(from, false, 'Y-m-d');
    if (fromEl._flatpickr.altInput) fromEl._flatpickr.altInput.value = formatDisplayDate(from);
  }
  if (toEl && toEl._flatpickr) {
    toEl._flatpickr.setDate(to, false, 'Y-m-d');
    if (toEl._flatpickr.altInput) toEl._flatpickr.altInput.value = formatDisplayDate(to);
  }
  if (fromEl) fromEl.value = formatIsoDate(from);
  if (toEl) toEl.value = formatIsoDate(to);
  window.ReportState.filters.fromDate = formatIsoDate(from);
  window.ReportState.filters.toDate = formatIsoDate(to);
}

function syncPeriodWithTemplate(templateId) {
  const periodByTemplate = {
    stat_1: 'month',
    stat_9: 'quarter'
  };
  if (templateId === 'stat_7') {
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    document.getElementById('filterPeriod').value = 'custom';
    updatePeriodUI();
    setDateInputs(from, to);
    return;
  }
  const mode = periodByTemplate[templateId];
  if (!mode) return;
  const periodSelect = document.getElementById('filterPeriod');
  periodSelect.value = mode;
  updatePeriodUI();
}

function collectAndApplyFilters() {
  const f = window.ReportState.filters;
  f.period = document.getElementById('filterPeriod').value;
  f.periodValue = Number(document.getElementById('filterPeriodValue').value) || null;
  f.periodYear = Number(document.getElementById('filterPeriodYear').value) || null;
  f.fromDate = document.getElementById('filterFromDate').value;
  f.toDate = document.getElementById('filterToDate').value;
  f.dataGroup = document.getElementById('filterDataGroup').value;
  f.statuses = Array.from(document.querySelectorAll('.cb-status-opt:checked')).map(cb => cb.value);
  f.isOntime = document.getElementById('cbOntime').checked;
  f.isOverdue = document.getElementById('cbOverdue').checked;
  f.isRevision = document.getElementById('cbRevision').checked;
  f.hasFile = document.getElementById('cbHasFile').checked;
  f.keyword = document.getElementById('searchInput').value.trim();
  document.querySelectorAll('.searchable-multiselect').forEach(wrap => {
    f[wrap.dataset.filter] = Array.from(wrap.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
  });
  applyFilters();
}

function initSearchableMultiselects() {
  const options = {
    units: [...new Set(window.ReportState.mockDirectives.map(item => item.unit))],
    assigners: [...new Set(window.ReportState.mockDirectives.map(item => item.assigner))],
    assignees: [...new Set(window.ReportState.mockDirectives.map(item => item.assignee))]
  };
  document.querySelectorAll('.searchable-multiselect').forEach(wrap => {
    const list = wrap.querySelector('.multi-options');
    list.innerHTML = options[wrap.dataset.filter].map(value => `<label title="${escapeHtml(value)}"><input type="checkbox" value="${escapeHtml(value)}"><span>${escapeHtml(value)}</span></label>`).join('');
    wrap.querySelector('.multi-control').addEventListener('click', event => {
      event.stopPropagation();
      document.querySelectorAll('.searchable-multiselect.open').forEach(item => { if (item !== wrap) item.classList.remove('open'); });
      wrap.classList.toggle('open');
    });
    wrap.querySelector('input[type="search"]').addEventListener('input', event => {
      const keyword = event.target.value.toLowerCase();
      list.querySelectorAll('label').forEach(label => { label.hidden = !label.textContent.toLowerCase().includes(keyword); });
    });
    list.addEventListener('change', () => renderMultiTags(wrap));
    wrap.querySelector('.multi-clear').addEventListener('click', () => {
      list.querySelectorAll('input').forEach(input => { input.checked = false; });
      renderMultiTags(wrap);
    });
    renderMultiTags(wrap);
  });
  document.addEventListener('click', event => {
    document.querySelectorAll('.searchable-multiselect').forEach(wrap => { if (!wrap.contains(event.target)) wrap.classList.remove('open'); });
  });
}

function renderMultiTags(wrap) {
  const selected = Array.from(wrap.querySelectorAll('.multi-options input:checked'));
  const tags = wrap.querySelector('.multi-tags');
  tags.innerHTML = selected.map(input => `<button type="button" class="multi-tag" data-value="${escapeHtml(input.value)}" title="${escapeHtml(input.value)}">${escapeHtml(input.value)} <span>×</span></button>`).join('');
  wrap.querySelector('.multi-placeholder').hidden = selected.length > 0;
  tags.querySelectorAll('.multi-tag').forEach(tag => tag.addEventListener('click', event => {
    event.stopPropagation();
    const input = Array.from(wrap.querySelectorAll('.multi-options input')).find(item => item.value === tag.dataset.value);
    if (input) input.checked = false;
    renderMultiTags(wrap);
  }));
}

function initTemplateCollapse() {
  document.getElementById('btnToggleTemplates').addEventListener('click', event => {
    const section = document.getElementById('templatesSection');
    const collapsed = section.classList.toggle('collapsed');
    document.getElementById('templatesCollapsible').hidden = collapsed;
    event.currentTarget.setAttribute('aria-expanded', String(!collapsed));
    event.currentTarget.querySelector('span').textContent = collapsed ? 'Mở rộng' : 'Thu gọn';
    event.currentTarget.querySelector('i').className = `fa-solid fa-chevron-${collapsed ? 'down' : 'up'}`;
  });
  updateSelectedTemplateSummary();
}

function updateSelectedTemplateSummary() {
  const config = getActiveTemplateConfig();
  document.getElementById('selectedTemplateName').textContent = config.name;
  document.getElementById('selectedTemplateName').title = config.name;
  document.getElementById('selectedTemplateIcon').className = config.icon;
}

function initChartModal() {
  document.getElementById('btnShowChart').addEventListener('click', showReportChart);
  document.getElementById('btnCloseChart').addEventListener('click', closeChartModal);
  document.getElementById('chartModal').addEventListener('click', event => {
    if (event.target.id === 'chartModal') closeChartModal();
  });
}

function showReportChart() {
  if (!window.Chart) {
    showToast('Thư viện biểu đồ chưa tải.');
    return;
  }
  const rows = getFilteredData();
  const config = getActiveTemplateConfig();
  const labelColumn = config.columns.find(column => rows.some(row => typeof row[column.key] === 'string' && !String(row[column.key]).includes('%'))) || config.columns[0];
  const numericColumns = config.columns.filter(column => rows.some(row => parseChartNumber(row[column.key]) !== null));
  const valueColumn = numericColumns.find(column => !/id|code|rank|day/i.test(column.key)) || numericColumns[0];
  if (!rows.length || !valueColumn) {
    showToast('Mẫu hiện tại không có dữ liệu số để vẽ.');
    return;
  }
  const modal = document.getElementById('chartModal');
  modal.hidden = false;
  const chartType = document.getElementById('chartType').value;
  const values = rows.map(row => parseChartNumber(row[valueColumn.key]) || 0);
  const total = values.reduce((sum, value) => sum + value, 0);
  document.getElementById('chartSummary').innerHTML = `<span>Chỉ số: <strong>${escapeHtml(valueColumn.label)}</strong></span><span>Tổng: <strong>${formatChartValue(total)}</strong></span><span>Số nhóm: <strong>${rows.length}</strong></span>`;
  if (window.reportChartInstance) window.reportChartInstance.destroy();
  const percentageLabelsPlugin = {
    id: 'percentageLabels',
    afterDatasetsDraw(chart) {
      if (chart.config.type !== 'pie') return;
      const context = chart.ctx;
      const dataset = chart.data.datasets[0];
      const datasetTotal = dataset.data.reduce((sum, value) => sum + Number(value || 0), 0);
      context.save();
      context.fillStyle = '#FFFFFF';
      context.font = '700 12px Roboto, Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      chart.getDatasetMeta(0).data.forEach((arc, index) => {
        const value = Number(dataset.data[index] || 0);
        const percentage = datasetTotal ? value / datasetTotal * 100 : 0;
        if (percentage < 4) return;
        const point = arc.tooltipPosition();
        context.fillText(`${percentage.toFixed(1)}%`, point.x, point.y);
      });
      context.restore();
    }
  };
  window.reportChartInstance = new Chart(document.getElementById('reportChart'), {
    type: chartType,
    data: {
      labels: rows.map(row => String(row[labelColumn.key] || 'Không xác định')),
      datasets: [{
        label: valueColumn.label,
        data: values,
        backgroundColor: chartType === 'pie' ? ['#0284C7', '#0EA5E9', '#38BDF8', '#0369A1', '#7DD3FC', '#075985', '#BAE6FD', '#0C4A6E'] : 'rgba(2, 132, 199, .72)',
        borderColor: chartType === 'pie' ? '#FFFFFF' : '#0284C7',
        borderWidth: chartType === 'pie' ? 2 : 2,
        tension: chartType === 'line' ? .3 : 0
      }]
    },
    plugins: [percentageLabelsPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 10 },
      plugins: {
        legend: { display: true, position: chartType === 'pie' ? 'right' : 'top', labels: { boxWidth: 12, usePointStyle: true } },
        tooltip: {
          callbacks: {
            label(context) {
              const value = Number(context.raw || 0);
              const percentage = total ? value / total * 100 : 0;
              return chartType === 'pie'
                ? `${context.label}: ${formatChartValue(value)} (${percentage.toFixed(1)}%)`
                : `${valueColumn.label}: ${formatChartValue(value)}`;
            }
          }
        }
      },
      scales: chartType === 'pie' ? {} : {
        x: { grid: { display: false }, ticks: { maxRotation: 35, minRotation: 0 } },
        y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, .2)' } }
      }
    }
  });
}

function closeChartModal() {
  document.getElementById('chartModal').hidden = true;
}

function getRowKey(row) {
  return String(row.id || row.unit || row.dataGroup || row.assigner || row.assignee || row.period || row.month || row.metricName);
}

function parsePrototypeDate(value) {
  return new Date(`${value}T12:00:00`);
}

function formatIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDisplayDate(date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function parseChartNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;
  const normalized = value.replace(',', '.').match(/-?\d+(?:\.\d+)?/);
  return normalized ? Number(normalized[0]) : null;
}

function formatChartValue(value) {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value);
}

function getIsoWeek(date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  target.setUTCDate(target.getUTCDate() + 4 - (target.getUTCDay() || 7));
  return Math.ceil((((target - new Date(Date.UTC(target.getUTCFullYear(), 0, 1))) / 86400000) + 1) / 7);
}

function stripHtml(value) {
  const holder = document.createElement('div');
  holder.innerHTML = String(value === undefined || value === null ? '' : value);
  return holder.textContent.trim();
}

function removeVietnamese(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function slugify(value) {
  return removeVietnamese(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function downloadBlob(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
}
