(function () {
  'use strict';

  const state = window.ReportState;
  const data = window.ReportData;
  const $ = selector => document.querySelector(selector);

  const METRIC_LABELS = {
    total: 'Tổng nhận',
    on_time_completed: 'Đã xử lý (Đúng hạn)',
    overdue_completed: 'Đã xử lý (Trễ hạn)',
    on_time_not_completed: 'Đang xử lý (Còn hạn)',
    overdue_not_completed: 'Đang xử lý (Quá hạn)'
  };

  /** Báo cáo chi tiết chỉ vào được qua drill-down 1 chỉ số cụ thể; mặc định coi là 'total'. */
  function getActiveMetric() {
    return state.drillDown?.metric || 'total';
  }

  const FILTER_PLACEHOLDERS = {
    statuses: 'Tất cả trạng thái',
    units: 'Tất cả đơn vị',
    leaders: 'Tất cả lãnh đạo',
    assignees: 'Tất cả người thực hiện',
    situations: 'Tất cả tình trạng'
  };

  let datePickers = [];

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]
    ));
  }

  function formatDate(value) {
    return value ? value.split('-').reverse().join('/') : '—';
  }

  function toLocalIso(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function normalizeText(text) {
    return String(text ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('vi');
  }

  function formatLateDays(item) {
    const days = data.getLateDays(item);
    return days != null ? String(days) : '—';
  }

  function formatOverdueNowDays(item) {
    const days = data.getOverdueNowDays(item, data.todayIso);
    return days != null ? String(days) : '—';
  }

  /**
   * Định nghĩa DUY NHẤT cho các cột bảng "Báo cáo chi tiết" — dùng chung cho render bảng
   * và Xuất Excel, tránh 2 nguồn label/logic khác nhau cho cùng 1 cột.
   * weight: trọng số độ rộng cột (không chia đều).
   */
  const DETAIL_COLUMN_DEFS = {
    stt: { label: 'STT', weight: 4, align: 'center', value: (row, i) => i + 1 },
    title: { label: 'Nội dung', weight: 30, align: 'left', value: row => row.title },
    unit: { label: 'Đơn vị', weight: 15, align: 'left', value: row => row.unit },
    assigner: { label: 'Người giao', weight: 12, align: 'left', value: row => row.assigner },
    assignee: { label: 'Người thực hiện', weight: 12, align: 'left', value: row => row.assignee },
    issueDate: { label: 'Ngày tạo chỉ đạo', weight: 9, align: 'center', value: row => formatDate(row.issueDate) },
    dueDate: { label: 'Hạn xử lý', weight: 9, align: 'center', value: row => formatDate(row.dueDate) },
    completedDate: { label: 'Ngày hoàn thành', weight: 9, align: 'center', value: row => formatDate(row.completedDate) },
    lateDays: { label: 'Số ngày trễ hạn', weight: 8, align: 'center', danger: true, value: row => formatLateDays(row) },
    overdueDays: { label: 'Số ngày quá hạn', weight: 8, align: 'center', danger: true, value: row => formatOverdueNowDays(row) },
    status: { label: 'Trạng thái', weight: 10, align: 'left', value: row => row.status },
    situation: {
      label: 'Tình trạng',
      weight: 12,
      align: 'left',
      value: row => {
        const key = data.getSituationKey(row);
        return data.SITUATIONS.find(item => item.key === key)?.label || '';
      }
    }
  };

  /**
   * Danh sách + thứ tự cột hiển thị ở Báo cáo chi tiết theo chỉ số drill-down đang xem.
   * Khớp đúng ma trận đã chốt (F–J: Tổng chỉ đạo / Đúng hạn / Trễ hạn / Còn hạn / Quá hạn).
   */
  function getDetailColumnKeys(metric) {
    const keys = ['stt', 'title', 'unit', 'assigner', 'assignee', 'issueDate', 'dueDate'];
    if (metric === 'total' || metric === 'on_time_completed' || metric === 'overdue_completed') {
      keys.push('completedDate');
    }
    if (metric === 'overdue_completed') keys.push('lateDays');
    if (metric === 'overdue_not_completed') keys.push('overdueDays');
    keys.push('status');
    if (metric === 'total') keys.push('situation');
    return keys;
  }

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    if (typeof window.loadSharedLayout === 'function') {
      window.loadSharedLayout('nav-bao-cao-thong-ke', 'Báo cáo & Thống kê Chỉ đạo');
    }
    initDatePickers();
    renderMultiSelects();
    bindEvents();
    render();
  }

  function initDatePickers() {
    if (!window.flatpickr) return;
    const options = {
      locale: window.flatpickr.l10ns?.vn,
      altInput: true,
      altFormat: 'd/m/Y',
      dateFormat: 'Y-m-d',
      allowInput: false
    };
    datePickers = [
      window.flatpickr('#filterFromDate', { ...options, defaultDate: state.filters.fromDate || undefined }),
      window.flatpickr('#filterToDate', { ...options, defaultDate: state.filters.toDate || undefined })
    ];
  }

  function bindEvents() {
    $('#btnApplyFilters').addEventListener('click', applyFilters);
    $('#btnResetFilters').addEventListener('click', resetFilters);
    $('#btnBackToStats').addEventListener('click', backToStatistics);
    $('#btnExportExcel').addEventListener('click', exportExcel);

    $('#pageSizeSelect').addEventListener('change', event => {
      state.pageSize = Number(event.target.value);
      state.page = 1;
      renderTable();
    });

    $('#statisticsTabs').addEventListener('click', event => {
      const button = event.target.closest('[data-tab]');
      if (!button || state.viewMode !== 'statistics') return;
      state.activeTab = button.dataset.tab;
      state.page = 1;
      render();
    });

    document.addEventListener('click', event => {
      if (!event.target.closest('.multiselect')) {
        document.querySelectorAll('.multiselect.open').forEach(item => item.classList.remove('open'));
      }
    });

    document.addEventListener('focusin', event => {
      const input = event.target.closest('.multiselect-input');
      if (!input) return;
      const wrap = input.closest('.multiselect');
      document.querySelectorAll('.multiselect.open').forEach(item => {
        if (item !== wrap) item.classList.remove('open');
      });
      wrap.classList.add('open');
      input.select();
    });

    document.addEventListener('input', event => {
      if (!event.target.classList.contains('multiselect-input')) return;
      const wrap = event.target.closest('.multiselect');
      if (!wrap) return;
      wrap.classList.add('open');
      filterAutocompleteOptions(wrap, event.target.value);
    });

    document.addEventListener('change', onMultiSelectChange);

    document.addEventListener('mousedown', event => {
      if (event.target.closest('.multiselect-menu')) event.stopPropagation();
    });

    $('#tableBody').addEventListener('click', event => {
      const cell = event.target.closest('[data-drill-metric]');
      if (cell) startDrillDown(cell.dataset.dimension, cell.dataset.drillMetric);
    });

    $('#tableBody').addEventListener('mouseleave', () => {
      const active = document.activeElement;
      if (active && active.classList.contains('metric-link')) active.blur();
    });

    $('#paginationButtons').addEventListener('click', event => {
      const button = event.target.closest('[data-page]');
      if (button) {
        state.page = Number(button.dataset.page);
        renderTable();
      }
    });
  }

  function onMultiSelectChange(event) {
    const menu = event.target.closest('.multiselect-menu');
    if (!menu) return;
    const wrap = menu.closest('.multiselect');
    if (!wrap) return;

    const filterKey = wrap.dataset.filter;
    const optionLabels = [...menu.querySelectorAll('.multi-option')];
    const isVisible = label => !label.hidden && !label.classList.contains('is-filtered-out');

    if (event.target.matches('input[type="checkbox"][data-select-all]')) {
      if (event.target.checked) {
        optionLabels.forEach(label => {
          const input = label.querySelector('input[type="checkbox"]');
          if (input) input.checked = isVisible(label);
        });
        state.filters[filterKey] = optionLabels
          .filter(isVisible)
          .map(label => label.querySelector('input[type="checkbox"]')?.value)
          .filter(Boolean);
      } else {
        optionLabels.forEach(label => {
          if (!isVisible(label)) return;
          const input = label.querySelector('input[type="checkbox"]');
          if (input) input.checked = false;
        });
        state.filters[filterKey] = [...menu.querySelectorAll('input[type="checkbox"]:not([data-select-all]):checked')]
          .map(input => input.value);
      }
      event.target.indeterminate = false;
    } else if (event.target.matches('input[type="checkbox"]')) {
      state.filters[filterKey] = [...menu.querySelectorAll('input[type="checkbox"]:not([data-select-all]):checked')]
        .map(input => input.value);
      syncSelectAllCheckbox(menu);
    } else {
      return;
    }
    updateMultiSelectText(wrap);
  }

  function getOptionValues(filterKey) {
    if (filterKey === 'units') return data.getUnique('unit');
    if (filterKey === 'leaders') return data.getUnique('assigner');
    if (filterKey === 'assignees') return data.getUnique('assignee');
    if (filterKey === 'statuses') return data.STATUSES;
    if (filterKey === 'situations') return data.SITUATIONS.map(item => item.key);
    return [];
  }

  function getOptionLabel(filterKey, value) {
    if (filterKey === 'situations') {
      return data.SITUATIONS.find(item => item.key === value)?.label || value;
    }
    return value;
  }

  function renderMultiSelects() {
    document.querySelectorAll('.multiselect').forEach(wrap => {
      const key = wrap.dataset.filter;
      const menu = wrap.querySelector('.multiselect-menu');
      const selected = state.filters[key] || [];
      const values = getOptionValues(key);
      const allChecked = selected.length === values.length && selected.length > 0;

      menu.innerHTML =
        `<label class="select-all"><input type="checkbox" data-select-all ${allChecked ? 'checked' : ''}> Chọn tất cả</label>` +
        values.map(value => {
          const label = getOptionLabel(key, value);
          const checked = selected.includes(value) ? 'checked' : '';
          return `<label class="multi-option"><input type="checkbox" value="${escapeHtml(value)}" ${checked}> <span>${escapeHtml(label)}</span></label>`;
        }).join('');

      updateMultiSelectText(wrap);
    });
  }

  function filterAutocompleteOptions(wrap, queryRaw) {
    const menu = wrap.querySelector('.multiselect-menu');
    const query = normalizeText(queryRaw.trim());
    menu.querySelectorAll('.multi-option').forEach(label => {
      const match = !query || normalizeText(label.textContent).includes(query);
      label.classList.toggle('is-filtered-out', !match);
      label.hidden = !match;
    });
    syncSelectAllCheckbox(menu);
  }

  function syncSelectAllCheckbox(menu) {
    const all = menu.querySelector('[data-select-all]');
    if (!all) return;
    const labels = [...menu.querySelectorAll('.multi-option')];
    const visibleInputs = labels
      .filter(label => !label.hidden && !label.classList.contains('is-filtered-out'))
      .map(label => label.querySelector('input[type="checkbox"]'))
      .filter(Boolean);
    const hiddenChecked = labels.some(
      label => (label.hidden || label.classList.contains('is-filtered-out')) &&
        label.querySelector('input[type="checkbox"]')?.checked
    );
    const allVisibleChecked = visibleInputs.length > 0 && visibleInputs.every(input => input.checked);
    all.checked = allVisibleChecked && !hiddenChecked;
    all.indeterminate = allVisibleChecked && hiddenChecked;
  }

  function updateMultiSelectText(wrap) {
    const key = wrap.dataset.filter;
    const values = state.filters[key] || [];
    const input = wrap.querySelector('.multiselect-input');
    if (!input) return;
    const allValues = getOptionValues(key);
    const placeholder = FILTER_PLACEHOLDERS[key] || 'Tất cả';

    // Chọn hết hoặc chưa chọn → placeholder gốc (Tất cả …)
    if (!values.length || values.length === allValues.length) {
      input.value = '';
      input.placeholder = placeholder;
      return;
    }
    if (values.length === 1) {
      input.value = getOptionLabel(key, values[0]);
      return;
    }
    input.value = `Đã chọn ${values.length} mục`;
  }

  function applyFilters() {
    state.filters.fromDate = $('#filterFromDate').value;
    state.filters.toDate = $('#filterToDate').value;
    state.page = 1;
    render();
  }

  function resetFilters() {
    state.filters.units = [];
    state.filters.leaders = [];
    state.filters.statuses = [];
    state.filters.assignees = [];
    state.filters.situations = [];
    const now = new Date();
    state.filters.fromDate = toLocalIso(new Date(now.getFullYear(), now.getMonth(), 1));
    state.filters.toDate = toLocalIso(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    datePickers[0]?.setDate(state.filters.fromDate);
    datePickers[1]?.setDate(state.filters.toDate);
    renderMultiSelects();
    state.page = 1;
    render();
  }

  function setFilterVisibility() {
    const isStatistics = state.viewMode === 'statistics';
    const showUnit = isStatistics ? state.activeTab === 'unit' : true;
    const showLeader = isStatistics ? state.activeTab === 'leader' : true;
    const showDetailFilters = !isStatistics;
    const showSituation = showDetailFilters && getActiveMetric() === 'total';

    const map = {
      unitFilterGroup: showUnit,
      leaderFilterGroup: showLeader,
      statusFilterGroup: showDetailFilters,
      assigneeFilterGroup: showDetailFilters,
      situationFilterGroup: showSituation
    };

    Object.entries(map).forEach(([id, show]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.hidden = !show;
      el.classList.toggle('is-hidden', !show);
    });
  }

  function render() {
    const isStatistics = state.viewMode === 'statistics';
    $('#statisticsTabs').hidden = !isStatistics;
    $('#btnBackToStats').hidden = isStatistics;
    setFilterVisibility();

    document.querySelectorAll('.statistics-tab').forEach(button => {
      button.classList.toggle('active', button.dataset.tab === state.activeTab);
    });

    if (isStatistics) {
      $('#viewTitle').textContent =
        state.activeTab === 'unit' ? 'Thống kê chỉ đạo theo đơn vị' : 'Thống kê chỉ đạo theo lãnh đạo Tỉnh';
      $('#viewDescription').textContent = 'Nhấn vào số liệu để xem danh sách chỉ đạo chi tiết.';
    } else {
      $('#viewTitle').textContent = 'Báo cáo / Danh sách chỉ đạo chi tiết';
      $('#viewDescription').textContent = state.drillDown
        ? `Kết quả: ${METRIC_LABELS[state.drillDown.metric] || ''}.`
        : 'Danh sách chỉ đạo theo bộ lọc.';
    }
    renderTable();
  }

  function getStatisticsRows() {
    return data.aggregateStats(
      data.getFilteredDirectives(state.filters),
      state.activeTab === 'unit' ? 'unit' : 'assigner'
    );
  }

  function getDetailRows() {
    let rows = data.getFilteredDirectives(state.filters);
    const drill = state.drillDown;
    if (drill) {
      rows = rows.filter(item => {
        const dimensionMatch =
          drill.groupBy === 'unit' ? item.unit === drill.dimension : item.assigner === drill.dimension;
        if (!dimensionMatch) return false;
        if (drill.metric === 'total') return true;
        return data.matchSituation(item, drill.metric);
      });
    }
    return rows.sort((a, b) => String(b.issueDate || '').localeCompare(String(a.issueDate || '')));
  }

  function renderTable() {
    const isStatistics = state.viewMode === 'statistics';
    const rows = isStatistics ? getStatisticsRows() : getDetailRows();
    const detailKeys = isStatistics ? [] : getDetailColumnKeys(getActiveMetric());
    const columnCount = isStatistics ? 7 : detailKeys.length;

    $('#reportDataTable').className = `report-data-table ${isStatistics ? 'is-statistics' : 'is-detail'}`;

    if (isStatistics) {
      $('#reportDataTable').querySelector('colgroup')?.remove();
      $('#tableHead').innerHTML =
        `<tr class="statistics-group-header"><th rowspan="2">STT</th><th rowspan="2">Tên ${state.activeTab === 'unit' ? 'đơn vị' : 'lãnh đạo Tỉnh'}</th><th rowspan="2">Tổng nhận</th><th colspan="2">Đã xử lý</th><th colspan="2">Đang xử lý</th></tr><tr><th class="th-on-time">Đúng hạn</th><th class="th-overdue">Trễ hạn</th><th class="th-on-time">Còn hạn</th><th class="th-overdue">Quá hạn</th></tr>`;
    } else {
      const totalWeight = detailKeys.reduce((sum, key) => sum + DETAIL_COLUMN_DEFS[key].weight, 0);
      const colgroupHtml = `<colgroup>${detailKeys
        .map(key => `<col style="width:${((DETAIL_COLUMN_DEFS[key].weight / totalWeight) * 100).toFixed(2)}%">`)
        .join('')}</colgroup>`;
      $('#reportDataTable').querySelector('colgroup')?.remove();
      $('#reportDataTable').insertAdjacentHTML('afterbegin', colgroupHtml);
      $('#tableHead').innerHTML =
        `<tr>${detailKeys.map(key => `<th class="col-${key}">${escapeHtml(DETAIL_COLUMN_DEFS[key].label)}</th>`).join('')}</tr>`;
    }

    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * state.pageSize;
    const pageRows = rows.slice(start, start + state.pageSize);

    $('#tableBody').innerHTML = pageRows.length
      ? pageRows.map((row, index) => (isStatistics
        ? `<tr class="statistics-row"><td>${start + index + 1}</td><td>${escapeHtml(row.dimension)}</td>${data.METRICS.map(metric =>
            `<td><button type="button" class="metric-link metric-${metric}" data-dimension="${escapeHtml(row.dimension)}" data-drill-metric="${metric}">${row[metric]}</button></td>`
          ).join('')}</tr>`
        : `<tr class="detail-row">${detailKeys.map(key => {
            const def = DETAIL_COLUMN_DEFS[key];
            const raw = key === 'stt' ? def.value(row, start + index) : def.value(row);
            const cellClass = [`col-${key}`, def.danger ? 'cell-danger' : ''].filter(Boolean).join(' ');
            return `<td class="${cellClass}">${escapeHtml(raw)}</td>`;
          }).join('')}</tr>`
      )).join('')
      : `<tr><td colspan="${columnCount}" class="empty-row">Không có dữ liệu phù hợp.</td></tr>`;

    $('#paginationInfo').textContent = total
      ? `Hiển thị ${start + 1}–${Math.min(start + state.pageSize, total)} trong tổng số ${total} bản ghi`
      : 'Không có bản ghi';

    $('#paginationButtons').innerHTML = totalPages > 1
      ? Array.from({ length: totalPages }, (_, index) =>
          `<button type="button" data-page="${index + 1}" class="${state.page === index + 1 ? 'active' : ''}">${index + 1}</button>`
        ).join('')
      : '';
  }

  function startDrillDown(dimension, metric) {
    const groupBy = state.activeTab === 'unit' ? 'unit' : 'assigner';
    state.drillDown = {
      dimension,
      metric,
      groupBy,
      baseFilters: JSON.parse(JSON.stringify(state.filters))
    };
    if (groupBy === 'unit') state.filters.units = [dimension];
    else state.filters.leaders = [dimension];
    state.filters.situations = metric && metric !== 'total' ? [metric] : [];
    renderMultiSelects();
    state.viewMode = 'detail';
    state.page = 1;
    render();
  }

  function backToStatistics() {
    if (state.drillDown?.baseFilters) {
      state.filters = state.drillDown.baseFilters;
    }
    state.viewMode = 'statistics';
    state.drillDown = null;
    state.page = 1;
    renderMultiSelects();
    render();
  }

  function exportExcel() {
    try {
      if (!window.XLSX) return;

      const isStatistics = state.viewMode === 'statistics';
      const rows = isStatistics ? getStatisticsRows() : getDetailRows();
      const title = isStatistics
        ? (state.activeTab === 'unit' ? 'Thống kê chỉ đạo theo đơn vị' : 'Thống kê chỉ đạo theo lãnh đạo Tỉnh')
        : 'Báo cáo danh sách chỉ đạo chi tiết';
      const dateLine = `Từ ngày tạo: ${formatDate(state.filters.fromDate) || '—'} – Đến ngày tạo: ${formatDate(state.filters.toDate) || '—'}`;

      const detailKeys = isStatistics ? [] : getDetailColumnKeys(getActiveMetric());
      const exportRows = isStatistics
        ? rows.map((row, index) => ({
            STT: index + 1,
            [state.activeTab === 'unit' ? 'Đơn vị' : 'Lãnh đạo Tỉnh']: row.dimension,
            'Tổng nhận': row.total,
            'Đã xử lý (Đúng hạn)': row.on_time_completed,
            'Đã xử lý (Trễ hạn)': row.overdue_completed,
            'Đang xử lý (Còn hạn)': row.on_time_not_completed,
            'Đang xử lý (Quá hạn)': row.overdue_not_completed
          }))
        : rows.map((row, index) => {
            const record = {};
            detailKeys.forEach(key => {
              const def = DETAIL_COLUMN_DEFS[key];
              record[def.label] = key === 'stt' ? index + 1 : def.value(row);
            });
            return record;
          });

      const headers = exportRows.length
        ? Object.keys(exportRows[0])
        : (isStatistics ? ['STT'] : detailKeys.map(key => DETAIL_COLUMN_DEFS[key].label));
      const centerKeys = isStatistics
        ? []
        : detailKeys.filter(key => DETAIL_COLUMN_DEFS[key].align === 'center');
      const centerCols = isStatistics
        ? new Set()
        : new Set(centerKeys.map(key => detailKeys.indexOf(key)));
      const aoa = [
        [title],
        [dateLine],
        headers,
        ...exportRows.map(row => headers.map(key => row[key] ?? ''))
      ];

      const sheet = window.XLSX.utils.aoa_to_sheet(aoa);
      const colCount = Math.max(headers.length, 1);
      const lastDataRow = 2 + exportRows.length;
      sheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } }
      ];

      // Auto column width, no wrap
      sheet['!cols'] = headers.map((key, colIndex) => {
        let maxLen = String(key).length;
        exportRows.forEach(row => {
          const cell = String(row[key] ?? '');
          if (cell.length > maxLen) maxLen = cell.length;
        });
        return { wch: Math.min(60, Math.max(10, maxLen + 2)) };
      });
      sheet['!rows'] = [{ hpt: 26 }, { hpt: 18 }, { hpt: 22 }];

      const border = {
        top: { style: 'thin', color: { rgb: '94A3B8' } },
        bottom: { style: 'thin', color: { rgb: '94A3B8' } },
        left: { style: 'thin', color: { rgb: '94A3B8' } },
        right: { style: 'thin', color: { rgb: '94A3B8' } }
      };

      const applyStyle = (cell, style) => {
        if (!sheet[cell]) sheet[cell] = { t: 's', v: '' };
        sheet[cell].s = style;
      };

      applyStyle('A1', {
        font: { bold: true, sz: 15, color: { rgb: '0F172A' } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
        fill: { fgColor: { rgb: 'BAE6FD' } }
      });
      applyStyle('A2', {
        font: { italic: true, sz: 11, color: { rgb: '334155' } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
        fill: { fgColor: { rgb: 'E0F2FE' } }
      });

      headers.forEach((_, index) => {
        const ref = window.XLSX.utils.encode_cell({ r: 2, c: index });
        applyStyle(ref, {
          font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } },
          alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
          fill: { fgColor: { rgb: '0284C7' } },
          border
        });
      });

      for (let r = 3; r <= lastDataRow; r += 1) {
        for (let c = 0; c < colCount; c += 1) {
          const ref = window.XLSX.utils.encode_cell({ r, c });
          if (!sheet[ref]) continue;
          const isCenter = c === 0 || (isStatistics && c >= 2) || (!isStatistics && centerCols.has(c));
          sheet[ref].s = {
            font: { sz: 11, color: { rgb: '1E293B' } },
            alignment: { horizontal: isCenter ? 'center' : 'left', vertical: 'center', wrapText: false },
            fill: { fgColor: { rgb: r % 2 === 0 ? 'F0F9FF' : 'FFFFFF' } },
            border
          };
        }
      }

      const book = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(book, sheet, 'Báo cáo');
      window.XLSX.writeFile(book, `${isStatistics ? 'thong-ke' : 'bao-cao-chi-tiet'}-chi-dao.xlsx`);
    } catch (error) {
      if (typeof window.showToast === 'function') {
        window.showToast('error', 'Xuất Excel thất bại', error.message || 'Lỗi không xác định');
      }
    }
  }
}());
