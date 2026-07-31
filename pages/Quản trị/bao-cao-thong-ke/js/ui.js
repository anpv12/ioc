(function () {
  const state = window.ReportState;
  const data = window.ReportData;
  const $ = selector => document.querySelector(selector);
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[char]);
  const formatDate = value => value ? value.split('-').reverse().join('/') : '—';
  const toLocalIso = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const metricLabels = {
    total: 'Tổng nhận', on_time_completed: 'Đã xử lý (Đúng hạn)', overdue_completed: 'Đã xử lý (Trễ hạn)', on_time_not_completed: 'Đang xử lý (Còn hạn)', overdue_not_completed: 'Đang xử lý (Quá hạn)'
  };
  const filterLabels = { statuses: 'Tất cả trạng thái', units: 'Tất cả đơn vị', leaders: 'Tất cả lãnh đạo' };
  let pickers = [];

  document.addEventListener('DOMContentLoaded', init);
  function init() {
    initDatePickers();
    initPeriodControls();
    renderMultiSelects();
    bindEvents();
    render();
  }

  function initDatePickers() {
    if (!window.flatpickr) return;
    const options = { locale: window.flatpickr.l10ns.vn, altInput: true, altFormat: 'd/m/Y', dateFormat: 'Y-m-d', allowInput: false };
    pickers = [window.flatpickr('#filterFromDate', { ...options, defaultDate: state.filters.fromDate }), window.flatpickr('#filterToDate', { ...options, defaultDate: state.filters.toDate })];
  }

  function bindEvents() {
    $('#btnApplyFilters').addEventListener('click', applyFilters);
    $('#btnResetFilters').addEventListener('click', resetFilters);
    $('#btnBackToStats').addEventListener('click', backToStatistics);
    $('#btnExportExcel').addEventListener('click', exportExcel);
    $('#pageSizeSelect').addEventListener('change', event => { state.pageSize = Number(event.target.value); state.page = 1; renderTable(); });
    $('#filterPeriod').addEventListener('change', setCurrentPeriod);
    $('#filterPeriodValue').addEventListener('change', syncPeriodDates);
    $('#filterPeriodYear').addEventListener('change', syncPeriodDates);
    document.querySelectorAll('.period-picker-toggle').forEach(button => button.addEventListener('click', event => {
      const picker = event.currentTarget.closest('.period-picker');
      document.querySelectorAll('.period-picker.open').forEach(item => { if (item !== picker) item.classList.remove('open'); });
      picker.classList.toggle('open');
      if (picker.classList.contains('open')) renderPeriodPickerMenu(picker, true);
    }));
    document.querySelectorAll('.period-picker input').forEach(input => {
      input.addEventListener('input', () => renderPeriodPickerMenu(input.closest('.period-picker')));
      input.addEventListener('change', syncPeriodDates);
    });
    document.querySelectorAll('.period-picker-menu').forEach(menu => menu.addEventListener('click', event => {
      const option = event.target.closest('[data-period-option]');
      if (!option) return;
      const picker = option.closest('.period-picker');
      picker.querySelector('input').value = option.dataset.periodOption;
      picker.classList.remove('open');
      syncPeriodDates();
    }));
    $('#statisticsTabs').addEventListener('click', event => {
      const button = event.target.closest('[data-tab]');
      if (!button || state.viewMode !== 'statistics') return;
      state.activeTab = button.dataset.tab;
      state.page = 1;
      render();
    });
    document.addEventListener('click', event => {
      const trigger = event.target.closest('.multiselect-trigger');
      if (trigger) {
        const wrap = trigger.closest('.multiselect');
        document.querySelectorAll('.multiselect.open').forEach(item => { if (item !== wrap) item.classList.remove('open'); });
        wrap.classList.toggle('open');
        return;
      }
      if (!event.target.closest('.multiselect')) document.querySelectorAll('.multiselect.open').forEach(item => item.classList.remove('open'));
      if (!event.target.closest('.period-picker')) document.querySelectorAll('.period-picker.open').forEach(item => item.classList.remove('open'));
    });
    document.querySelectorAll('.multiselect-menu').forEach(menu => menu.addEventListener('change', event => {
      const wrap = event.target.closest('.multiselect');
      const filterKey = wrap.dataset.filter;
      if (event.target.dataset.selectAll) {
        const inputs = [...menu.querySelectorAll('input:not([data-select-all])')];
        inputs.forEach(input => { input.checked = event.target.checked; });
        state.filters[filterKey] = event.target.checked ? inputs.map(input => input.value) : [];
      } else {
        state.filters[filterKey] = [...menu.querySelectorAll('input:not([data-select-all]):checked')].map(input => input.value);
        const all = menu.querySelector('[data-select-all]');
        all.checked = state.filters[filterKey].length === menu.querySelectorAll('input:not([data-select-all])').length;
      }
      updateMultiSelectText(wrap);
    }));
    document.querySelectorAll('.multiselect-menu').forEach(menu => menu.addEventListener('input', event => {
      if (!event.target.classList.contains('multiselect-search')) return;
      const query = event.target.value.trim().toLocaleLowerCase('vi');
      menu.querySelectorAll('.multi-option').forEach(label => { label.hidden = !label.textContent.toLocaleLowerCase('vi').includes(query); });
    }));
    $('#tableBody').addEventListener('click', event => {
      const cell = event.target.closest('[data-drill-metric]');
      if (cell) startDrillDown(cell.dataset.dimension, cell.dataset.drillMetric);
    });
    $('#tableHead').addEventListener('click', event => {
      const button = event.target.closest('[data-sort-key]');
      if (!button) return;
      const key = button.dataset.sortKey;
      state.sort.direction = state.sort.key === key && state.sort.direction === 'asc' ? 'desc' : 'asc';
      state.sort.key = key; state.page = 1; renderTable();
    });
    $('#paginationButtons').addEventListener('click', event => {
      const button = event.target.closest('[data-page]');
      if (button) { state.page = Number(button.dataset.page); renderTable(); }
    });
  }

  function initPeriodControls() {
    const currentYear = new Date().getFullYear();
    $('#filterPeriodYear').value = state.filters.periodYear || currentYear;
    $('#filterPeriod').value = state.filters.period;
    updatePeriodValueOptions();
    renderPeriodPickerMenu($('#periodYearPicker'));
  }

  function getCurrentWeek(date) {
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = target.getDay() || 7;
    target.setDate(target.getDate() + 4 - day);
    const yearStart = new Date(target.getFullYear(), 0, 1);
    return Math.ceil((((target - yearStart) / 86400000) + 1) / 7);
  }

  function setCurrentPeriod() {
    const now = new Date();
    const period = $('#filterPeriod').value;
    state.filters.period = period;
    state.filters.periodYear = now.getFullYear();
    state.filters.periodValue = period === 'week' ? getCurrentWeek(now)
      : period === 'month' ? now.getMonth() + 1
      : period === 'quarter' ? Math.floor(now.getMonth() / 3) + 1 : null;
    $('#filterPeriodYear').value = state.filters.periodYear;
    updatePeriodValueOptions();
    syncPeriodDates();
  }

  function updatePeriodValueOptions() {
    const period = $('#filterPeriod').value;
    const value = $('#filterPeriodValue');
    const labels = period === 'week' ? Array.from({ length: 53 }, (_, index) => [`${index + 1}`, `Tuần ${index + 1}`])
      : period === 'month' ? Array.from({ length: 12 }, (_, index) => [`${index + 1}`, `Tháng ${index + 1}`])
      : period === 'quarter' ? Array.from({ length: 4 }, (_, index) => [`${index + 1}`, `Quý ${index + 1}`]) : [];
    $('#periodValueGroup').hidden = !labels.length;
    $('#periodYearGroup').hidden = period === '' || period === 'today';
    $('#periodValueLabel').textContent = period === 'week' ? 'Tuần' : period === 'quarter' ? 'Quý' : 'Tháng';
    if (labels.length) {
      const match = labels.find(([key]) => Number(key) === Number(state.filters.periodValue));
      value.value = match ? match[1] : labels[0][1];
      value.dataset.options = JSON.stringify(labels);
      renderPeriodPickerMenu($('#periodValuePicker'));
    }
  }

  function renderPeriodPickerMenu(picker, showAll = false) {
    if (!picker) return;
    const input = picker.querySelector('input');
    const query = showAll ? '' : input.value.trim().toLocaleLowerCase('vi');
    const options = input.id === 'filterPeriodYear'
      ? Array.from({ length: 15 }, (_, index) => String(new Date().getFullYear() - 7 + index))
      : (JSON.parse(input.dataset.options || '[]').map(item => item[1]));
    picker.querySelector('.period-picker-menu').innerHTML = options.filter(option => option.toLocaleLowerCase('vi').includes(query)).map(option => `<button type="button" data-period-option="${option}">${option}</button>`).join('') || '<div class="period-picker-empty">Không có kết quả</div>';
  }

  function syncPeriodDates() {
    const period = $('#filterPeriod').value;
    state.filters.period = period;
    updatePeriodValueOptions();
    const selectedLabel = $('#filterPeriodValue').value;
    const periodOption = (JSON.parse($('#filterPeriodValue').dataset.options || '[]')).find(([, label]) => label === selectedLabel);
    state.filters.periodValue = Number(periodOption?.[0]) || state.filters.periodValue || null;
    state.filters.periodYear = Number($('#filterPeriodYear').value) || new Date().getFullYear();
    const now = new Date();
    const year = state.filters.periodYear;
    const value = state.filters.periodValue;
    let from; let to;
    if (period === 'today') { from = new Date(now.getFullYear(), now.getMonth(), now.getDate()); to = from; }
    if (period === 'week') { const date = new Date(year, 0, 1 + (value - 1) * 7); const day = date.getDay() || 7; from = new Date(date); from.setDate(date.getDate() - day + 1); to = new Date(from); to.setDate(from.getDate() + 6); }
    if (period === 'month') { from = new Date(year, value - 1, 1); to = new Date(year, value, 0); }
    if (period === 'quarter') { from = new Date(year, (value - 1) * 3, 1); to = new Date(year, value * 3, 0); }
    if (period === 'year') { from = new Date(year, 0, 1); to = new Date(year, 11, 31); }
    if (!from || !to) return;
    state.filters.fromDate = toLocalIso(from); state.filters.toDate = toLocalIso(to);
    pickers[0]?.setDate(state.filters.fromDate); pickers[1]?.setDate(state.filters.toDate);
  }

  function renderMultiSelects() {
    const values = { units: data.getUnique('unit'), leaders: data.getUnique('assigner') };
    document.querySelectorAll('.multiselect').forEach(wrap => {
      const key = wrap.dataset.filter;
      const menu = wrap.querySelector('.multiselect-menu');
      const selected = state.filters[key];
      menu.innerHTML = `<div class="multiselect-search-wrap"><i class="fa-solid fa-magnifying-glass"></i><input class="multiselect-search" type="search" placeholder="Tìm kiếm..."></div><label class="select-all"><input type="checkbox" data-select-all ${selected.length === values[key].length && selected.length ? 'checked' : ''}> Chọn tất cả</label>${values[key].map(value => `<label class="multi-option"><input type="checkbox" value="${escapeHtml(value)}" ${selected.includes(value) ? 'checked' : ''}> <span>${escapeHtml(value)}</span></label>`).join('')}`;
      updateMultiSelectText(wrap);
    });
  }

  function updateMultiSelectText(wrap) {
    const values = state.filters[wrap.dataset.filter];
    const label = values.length ? (values.length === 1 ? values[0] : `Đã chọn ${values.length} mục`) : filterLabels[wrap.dataset.filter];
    wrap.querySelector('.multiselect-trigger').childNodes[0].nodeValue = label;
  }

  function applyFilters() {
    state.filters.fromDate = $('#filterFromDate').value;
    state.filters.toDate = $('#filterToDate').value;
    state.page = 1;
    render();
  }

  function resetFilters() {
    state.filters.units = []; state.filters.leaders = [];
    const now = new Date(); state.filters.period = 'month'; state.filters.periodValue = 7; state.filters.periodYear = now.getFullYear();
    state.filters.fromDate = toLocalIso(new Date(now.getFullYear(), now.getMonth(), 1));
    state.filters.toDate = toLocalIso(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    pickers[0]?.setDate(state.filters.fromDate); pickers[1]?.setDate(state.filters.toDate); initPeriodControls();
    renderMultiSelects(); state.page = 1; render();
  }

  function render() {
    const isStatistics = state.viewMode === 'statistics';
    $('#statisticsTabs').hidden = !isStatistics;
    $('#btnBackToStats').hidden = isStatistics;
    $('#unitFilterGroup').hidden = isStatistics ? state.activeTab !== 'unit' : false;
    $('#leaderFilterGroup').hidden = isStatistics ? state.activeTab !== 'leader' : false;
    document.querySelectorAll('.statistics-tab').forEach(button => button.classList.toggle('active', button.dataset.tab === state.activeTab));
    if (isStatistics) {
      $('#viewTitle').textContent = state.activeTab === 'unit' ? 'Thống kê chỉ đạo theo đơn vị' : 'Thống kê chỉ đạo theo lãnh đạo Tỉnh';
      $('#viewDescription').textContent = 'Bấm vào ô số để xem danh sách chỉ đạo tương ứng.';
    } else {
      $('#viewTitle').textContent = 'Báo cáo / Danh sách chỉ đạo chi tiết';
      $('#viewDescription').textContent = `Kết quả drill-down: ${metricLabels[state.drillDown.metric]}.`;
    }
    renderTable();
  }

  function getStatisticsRows() {
    return data.aggregateStats(data.getFilteredDirectives(state.filters), state.activeTab === 'unit' ? 'unit' : 'assigner');
  }

  function getDetailRows() {
    const rows = data.getFilteredDirectives(state.filters);
    const drill = state.drillDown;
    return rows.filter(item => {
      const dimensionMatch = drill.groupBy === 'unit' ? item.unit === drill.dimension : item.assigner === drill.dimension;
      if (!dimensionMatch) return false;
      if (drill.metric === 'total') return true;
      if (drill.metric === 'on_time_completed') return item.status === 'Đã kết thúc' && item.onTimeStatus === 'Đúng hạn';
      if (drill.metric === 'overdue_completed') return item.status === 'Đã kết thúc' && item.onTimeStatus === 'Quá hạn';
      if (drill.metric === 'on_time_not_completed') return item.status !== 'Đã kết thúc' && item.onTimeStatus === 'Đúng hạn';
      return item.status !== 'Đã kết thúc' && item.onTimeStatus === 'Quá hạn';
    });
  }

  function renderTable() {
    const isStatistics = state.viewMode === 'statistics';
    const rows = isStatistics ? getStatisticsRows() : getDetailRows();
    const columns = isStatistics
      ? [{ key: 'stt', label: 'STT', sortable: false }, { key: 'dimension', label: state.activeTab === 'unit' ? 'Tên đơn vị' : 'Lãnh đạo Tỉnh', sortable: true }, ...data.METRICS.map(key => ({ key, label: metricLabels[key], sortable: true }))]
      : [{ key: 'stt', label: 'STT', sortable: false }, { key: 'code', label: 'Mã chỉ đạo', sortable: true }, { key: 'title', label: 'Nội dung', sortable: true }, { key: 'unit', label: 'Đơn vị', sortable: true }, { key: 'assigner', label: 'Người giao', sortable: true }, { key: 'assignee', label: 'Người xử lý', sortable: true }, { key: 'issueDate', label: 'Ngày ban hành', sortable: true }, { key: 'dueDate', label: 'Hạn xử lý', sortable: true }, { key: 'status', label: 'Trạng thái', sortable: true }, { key: 'onTimeStatus', label: 'Đúng/Quá hạn', sortable: true }];
    const sortedRows = [...rows].sort((left, right) => {
      const key = state.sort.key;
      const first = left[key]; const second = right[key];
      const compare = typeof first === 'number' && typeof second === 'number' ? first - second : String(first ?? '').localeCompare(String(second ?? ''), 'vi', { numeric: true });
      return state.sort.direction === 'asc' ? compare : -compare;
    });
    $('#reportDataTable').className = `report-data-table ${isStatistics ? 'is-statistics' : 'is-detail'}`;
    $('#tableHead').innerHTML = `<tr>${columns.map(column => `<th>${column.sortable ? `<button type="button" class="sort-header" data-sort-key="${column.key}">${escapeHtml(column.label)} <i class="fa-solid fa-sort${state.sort.key === column.key ? (state.sort.direction === 'asc' ? '-up' : '-down') : ''}"></i></button>` : escapeHtml(column.label)}</th>`).join('')}</tr>`;
    const total = sortedRows.length; const totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * state.pageSize; const pageRows = sortedRows.slice(start, start + state.pageSize);
    $('#tableBody').innerHTML = pageRows.length ? pageRows.map((row, index) => isStatistics
      ? `<tr class="statistics-row"><td>${start + index + 1}</td><td>${escapeHtml(row.dimension)}</td>${data.METRICS.map(metric => `<td><button type="button" class="metric-link" data-dimension="${escapeHtml(row.dimension)}" data-drill-metric="${metric}">${row[metric]}</button></td>`).join('')}</tr>`
      : `<tr class="detail-row"><td>${start + index + 1}</td><td>${escapeHtml(row.code)}</td><td>${escapeHtml(row.title)}</td><td>${escapeHtml(row.unit)}</td><td>${escapeHtml(row.assigner)}</td><td>${escapeHtml(row.assignee)}</td><td>${formatDate(row.issueDate)}</td><td>${formatDate(row.dueDate)}</td><td>${escapeHtml(row.status)}</td><td>${escapeHtml(row.onTimeStatus)}</td></tr>`
    ).join('') : `<tr><td colspan="${columns.length}" class="empty-row">Không có dữ liệu phù hợp.</td></tr>`;
    $('#paginationInfo').textContent = total ? `Hiển thị ${start + 1}–${Math.min(start + state.pageSize, total)} trong tổng số ${total} bản ghi` : 'Không có bản ghi';
    $('#paginationButtons').innerHTML = totalPages > 1 ? Array.from({ length: totalPages }, (_, index) => `<button type="button" data-page="${index + 1}" class="${state.page === index + 1 ? 'active' : ''}">${index + 1}</button>`).join('') : '';
  }

  function startDrillDown(dimension, metric) {
    const groupBy = state.activeTab === 'unit' ? 'unit' : 'assigner';
    state.drillDown = { dimension, metric, groupBy, baseFilters: JSON.parse(JSON.stringify(state.filters)) };
    if (groupBy === 'unit') state.filters.units = [dimension];
    else state.filters.leaders = [dimension];
    renderMultiSelects();
    state.sort = { key: 'issueDate', direction: 'desc' };
    state.viewMode = 'detail'; state.page = 1; render();
  }
  function backToStatistics() {
    state.filters = state.drillDown?.baseFilters || state.filters;
    state.viewMode = 'statistics'; state.drillDown = null; state.sort = { key: 'total', direction: 'desc' }; state.page = 1;
    renderMultiSelects(); render();
  }

  function exportExcel() {
    const isStatistics = state.viewMode === 'statistics';
    const rows = isStatistics ? getStatisticsRows() : getDetailRows();
    const title = isStatistics ? (state.activeTab === 'unit' ? 'Thống kê chỉ đạo theo đơn vị' : 'Thống kê chỉ đạo theo lãnh đạo Tỉnh') : 'Báo cáo danh sách chỉ đạo chi tiết';
    const exportRows = isStatistics ? rows.map((row, index) => ({ STT: index + 1, [state.activeTab === 'unit' ? 'Đơn vị' : 'Lãnh đạo Tỉnh']: row.dimension, ...Object.fromEntries(data.METRICS.map(key => [metricLabels[key], row[key]])) })) : rows.map((row, index) => ({ STT: index + 1, 'Mã chỉ đạo': row.code, 'Nội dung': row.title, 'Đơn vị': row.unit, 'Người giao': row.assigner, 'Người xử lý': row.assignee, 'Ngày ban hành': formatDate(row.issueDate), 'Hạn xử lý': formatDate(row.dueDate), 'Trạng thái': row.status, 'Đúng/Quá hạn': row.onTimeStatus }));
    if (!window.XLSX) return;
    const sheet = window.XLSX.utils.aoa_to_sheet([[title], [`Từ ngày: ${formatDate(state.filters.fromDate) || 'Không giới hạn'} – Đến ngày: ${formatDate(state.filters.toDate) || 'Không giới hạn'}`]]);
    window.XLSX.utils.sheet_add_json(sheet, exportRows, { origin: 'A3' });
    const exportColumnCount = isStatistics ? 7 : 10;
    sheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: exportColumnCount - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: exportColumnCount - 1 } }
    ];
    const book = window.XLSX.utils.book_new(); window.XLSX.utils.book_append_sheet(book, sheet, 'Báo cáo');
    window.XLSX.writeFile(book, `${isStatistics ? 'thong-ke' : 'bao-cao-chi-tiet'}-chi-dao.xlsx`);
  }
}());
