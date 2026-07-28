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

