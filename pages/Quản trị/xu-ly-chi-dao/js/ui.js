/* -----------------------------------------------------------------------
   ui.js — Logic UI Xử lý chỉ đạo
   Yêu cầu: data.js phải được load trước.
   ----------------------------------------------------------------------- */
(() => {
  const state = directiveState;

  /* ── DOM elements ────────────────────────────────────────────────── */
  const el = {
    roleSelect: () => document.getElementById('roleSelect'),
    tabActive: () => document.getElementById('tabActive'),
    tabDone: () => document.getElementById('tabDone'),
    countActive: () => document.getElementById('countActive'),
    countDone: () => document.getElementById('countDone'),
    search: () => document.getElementById('directiveSearch'),
    timeConditionFilter: () => document.getElementById('timeConditionFilterSelect'),
    statusFilter: () => document.getElementById('statusFilterSelect'),
    deadlineRange: () => document.getElementById('deadlineRange'),
    clearDeadline: () => document.getElementById('clearDeadlineRange'),
    resetFilters: () => document.getElementById('resetFilters'),
    tbody: () => document.getElementById('directiveTableBody'),
    emptyState: () => document.getElementById('emptyState'),
    pageInfo: () => document.getElementById('directivePageInfo'),
    pageButtons: () => document.getElementById('directivePageButtons'),
    pageSize: () => document.getElementById('directivePageSize'),
    listContainer: () => document.getElementById('directiveListContainer'),
    detailOverlay: () => document.getElementById('detailOverlay'),
    detailTitle: () => document.getElementById('detailTitle'),
    detailStatus: () => document.getElementById('detailStatusBadge'),
    detailLeft: () => document.getElementById('detailLeft'),
    detailRight: () => document.getElementById('detailRight'),
    closeDetail: () => document.getElementById('closeDetail'),
    timePopover: () => document.getElementById('timeCalendarPopover'),
    timeTitle: () => document.getElementById('timeCalendarTitle'),
    timeSummary: () => document.getElementById('timeCalendarSummary'),
    closeTime: () => document.getElementById('closeTimeCalendar'),
    timeCalInput: () => document.getElementById('timeCalendarInput'),
    imageOverlay: () => document.getElementById('imageViewerOverlay'),
    viewerImage: () => document.getElementById('viewerImage'),
    closeImage: () => document.getElementById('closeImageViewer'),
  };

  /* ── Utils ──────────────────────────────────────────────────────── */
  const escHtml = v => String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  const parseViDate = str => {
    if (!str) return null;
    const [d, m, y] = String(str).split('/').map(Number);
    return new Date(y, m - 1, d, 0, 0, 0);
  };

  const flattenNodes = root =>
    root ? [root, ...(root.children || []).flatMap(flattenNodes)] : [];

  const nodeForRole = (item, role = state.role) =>
    flattenNodes(item.executionTree).find(n => n.contextId === role) || null;

  /* ── Stage → Status mapping ──────────────────────────────────────── */
  const STAGE_STATUS = {
    waitingAssign: 'waitingAssign',
    processing: 'processing',
    reported: 'reported',
    waitingApproval: 'waitingApproval',
    completed: 'completed',
  };

  const statusFor = (item, role = state.role) => {
    const node = nodeForRole(item, role);
    if (!node) return null;
    return STAGE_STATUS[node.stage] || null;
  };

  /* ── Tab logic: active = "Đang xử lý", done = "Đã xử lý" ───────── */
  const tabFor = (item, role = state.role) => {
    const status = statusFor(item, role);
    if (!status) return null;

    if (role === 'leader') {
      // leader thấy ở "Đang xử lý" khi: chờ phân công HOẶC đã có báo cáo cần xét
      if (status === 'waitingAssign' || status === 'reported') return 'active';
      return 'done'; // processing (đã giao), waitingApproval, completed
    }

    if (role === 'department' || role === 'individual') {
      if (status === 'processing') return 'active'; // đang làm
      return 'done'; // đã nộp (reported, completed)
    }

    return null;
  };

  const isVisibleForRole = item => statusFor(item) !== null;

  /* ── Deadline helpers ────────────────────────────────────────────── */
  const deadlineDate = item => {
    const node = nodeForRole(item);
    const dl = node?.slaDeadline || item.deadline;
    return parseViDate(dl) || parseViDate(item.deadline);
  };

  const deadlineCondition = item => {
    const d = deadlineDate(item);
    if (!d) return 'normal';
    const days = Math.ceil((d.getTime() - Date.now()) / 86400000);
    if (days < 0) return 'overdue';
    if (days <= 3) return 'warning';
    return 'normal';
  };

  const deadlineLabel = item => {
    const node = nodeForRole(item);
    return node?.slaDeadline || item.deadline || '—';
  };

  /* ── Status badge HTML ───────────────────────────────────────────── */
  const statusBadgeHtml = (statusKey) => {
    if (!statusKey) return '';
    const meta = state.statusMeta[statusKey];
    if (!meta) return '';
    return `<span class="status-badge ${escHtml(statusKey)}">${escHtml(meta.label)}</span>`;
  };

  /* ── Filtering ───────────────────────────────────────────────────── */
  const filteredForTab = (tab) => {
    const search = (state.filters.search || '').trim().toLowerCase();
    const statusF = state.filters.status || '';
    const selDate = state.filters.deadlineDate;
    const tcF = state.filters.timeCondition || '';

    return state.directives.filter(item => {
      if (!isVisibleForRole(item)) return false;
      if (tabFor(item) !== tab) return false;

      const matchSearch = !search ||
        `${item.id} ${item.title} ${item.content} ${item.domain || ''} ${item.source || ''}`.toLowerCase().includes(search);

      const itemStatus = statusFor(item);
      const matchStatus = !statusF || itemStatus === statusF;

      const dl = deadlineDate(item);
      const matchDl = !selDate || (dl && dl.toDateString() === selDate.toDateString());

      const cond = deadlineCondition(item);
      const matchTc = !tcF || (tcF === 'overdue' ? cond === 'overdue' : cond !== 'overdue');

      return matchSearch && matchStatus && matchDl && matchTc;
    });
  };

  /* ── Render table ────────────────────────────────────────────────── */
  const render = () => {
    // Tự động đồng bộ class active cho nút tab UI
    activateTab(state.activeTab);

    const activeItems = filteredForTab('active');
    const doneItems = filteredForTab('done');

    const items = state.activeTab === 'active' ? activeItems : doneItems;

    // Pagination
    const total = items.length;
    const pageSize = state.pageSize;
    const maxPage = Math.max(1, Math.ceil(total / pageSize));
    state.page = Math.min(state.page, maxPage);
    const start = (state.page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);

    // Empty
    const tbody = el.tbody();
    const empty = el.emptyState();
    if (!paged.length) {
      tbody.innerHTML = '';
      empty.hidden = false;
      el.pageInfo().textContent = '';
      el.pageButtons().innerHTML = '';
      return;
    }
    empty.hidden = true;

    // Rows
    tbody.innerHTML = paged.map((item, idx) => {
      const status = statusFor(item);
      const cond = deadlineCondition(item);
      const dlLabel = deadlineLabel(item);
      const firstGroup = (item.dataGroups && item.dataGroups.length > 0) ? item.dataGroups[0] : '—';

      const contentText = item.content || item.title || '';

      return `<tr>
        <td class="center col-stt">${start + idx + 1}</td>
        <td class="col-title" title="${escHtml(contentText)}">
          <span class="dir-title-main" title="${escHtml(contentText)}">${escHtml(contentText)}</span>
        </td>
        <td class="col-groups">${escHtml(firstGroup)}</td>
        <td class="center col-date">${escHtml(item.issuedDate)}</td>
        <td class="center col-deadline">
          <span class="deadline-tag ${cond === 'overdue' ? 'overdue' : 'in-time'}" title="${cond === 'overdue' ? 'Trễ hạn' : 'Còn hạn'}">
            <span>${escHtml(dlLabel)}</span>
            <i class="fa-regular fa-clock"></i>
          </span>
        </td>
        <td class="center col-status">${statusBadgeHtml(status)}</td>
        <td class="center col-act">
          <div class="row-actions centered">
            <button class="act-btn act-edit" data-open-id="${escHtml(item.id)}" type="button" title="${state.activeTab === 'done' ? 'Xem chi tiết' : 'Xử lý chỉ đạo'}">
              <i class="${state.activeTab === 'done' ? 'fa-regular fa-eye' : 'fa-solid fa-pen'}"></i>
            </button>
          </div>
        </td>
      </tr>`;
    }).join('');

    // Page info
    el.pageInfo().textContent = `Hiển thị ${start + 1}–${Math.min(start + pageSize, total)} / ${total} chỉ đạo`;

    // Pagination buttons (Matching Quy trình động: First, Prev, Pages, Next, Last)
    const btns = [];
    btns.push(`<button class="pg-btn" type="button" data-page="1" ${state.page === 1 ? 'disabled' : ''} title="Trang đầu"><i class="fa-solid fa-angles-left"></i></button>`);
    btns.push(`<button class="pg-btn" type="button" data-page="${Math.max(1, state.page - 1)}" ${state.page === 1 ? 'disabled' : ''} title="Trang trước"><i class="fa-solid fa-angle-left"></i></button>`);
    for (let p = 1; p <= maxPage; p++) {
      btns.push(`<button class="pg-btn${p === state.page ? ' active' : ''}" type="button" data-page="${p}">${p}</button>`);
    }
    btns.push(`<button class="pg-btn" type="button" data-page="${Math.min(maxPage, state.page + 1)}" ${state.page === maxPage ? 'disabled' : ''} title="Trang sau"><i class="fa-solid fa-angle-right"></i></button>`);
    btns.push(`<button class="pg-btn" type="button" data-page="${maxPage}" ${state.page === maxPage ? 'disabled' : ''} title="Trang cuối"><i class="fa-solid fa-angles-right"></i></button>`);
    el.pageButtons().innerHTML = btns.join('');
  };

  /* ── Close detail ────────────────────────────────────────────────── */
  const closeDetail = () => {
    if (el.detailOverlay()) el.detailOverlay().hidden = true;
    if (el.listContainer()) el.listContainer().hidden = false;
    state.selectedId = null;
  };

  /* ── Helper format Thời gian tệp đính kèm (HH:mm - DD/MM/YYYY) ────── */
  const formatDateTimeFormatted = (val) => {
    if (!val) {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${hh}:${mm} - ${dd}/${mo}/${yyyy}`;
    }
    const str = String(val).trim();
    const mTimeDate = str.match(/(\d{1,2}):(\d{1,2})(?::\d{1,2})?\s*(?:-\s*)?(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (mTimeDate) {
      const hh = mTimeDate[1].padStart(2, '0');
      const mm = mTimeDate[2].padStart(2, '0');
      const dd = mTimeDate[3].padStart(2, '0');
      const mo = mTimeDate[4].padStart(2, '0');
      const yyyy = mTimeDate[5];
      return `${hh}:${mm} - ${dd}/${mo}/${yyyy}`;
    }
    const mDate = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mDate) {
      const dd = mDate[1].padStart(2, '0');
      const mo = mDate[2].padStart(2, '0');
      const yyyy = mDate[3];
      return `08:00 - ${dd}/${mo}/${yyyy}`;
    }
    return str;
  };

  /* ── Helper render Danh sách Tệp đính kèm Full 1 dòng ────── */
  const renderFileTable = (filesArray, options = {}) => {
    const { allowDelete = false, deleteAttr = '' } = options;
    if (!filesArray || !filesArray.length) {
      return '';
    }

    const itemsHtml = filesArray.map((fileObj, index) => {
      const fileName = typeof fileObj === 'string' ? fileObj : fileObj.name || 'Tệp đính kèm';
      const fileSize = typeof fileObj === 'object' && fileObj.size ? fileObj.size : '1.5 MB';
      const rawDate = typeof fileObj === 'object' && fileObj.date ? fileObj.date : null;
      const fileDate = formatDateTimeFormatted(rawDate);
      const ext = fileName.split('.').pop().toLowerCase();

      let iconClass = 'fa-file-lines';
      let typeClass = 'default';
      if (ext === 'pdf') {
        iconClass = 'fa-file-pdf';
        typeClass = 'pdf';
      } else if (['xls', 'xlsx'].includes(ext)) {
        iconClass = 'fa-file-excel';
        typeClass = 'excel';
      } else if (['doc', 'docx'].includes(ext)) {
        iconClass = 'fa-file-word';
        typeClass = 'word';
      } else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
        iconClass = 'fa-file-image';
        typeClass = 'image';
      }

      return `
        <div class="file-card-item full-width">
          <div class="file-card-main">
            <i class="fa-regular ${iconClass} file-type-icon ${typeClass}"></i>
            <div class="file-card-info">
              <a href="javascript:void(0)" class="file-card-name" title="${escHtml(fileName)}" data-view-file="${escHtml(fileName)}">
                ${escHtml(fileName)}
              </a>
              <span class="file-card-meta">${escHtml(fileSize)} • ${escHtml(fileDate)}</span>
            </div>
          </div>
          ${allowDelete ? `
          <div class="file-card-actions">
            <button class="file-card-btn btn-delete" type="button" title="Xóa tệp" ${deleteAttr}="${index}">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="file-grid-container single-column">
        ${itemsHtml}
      </div>
    `;
  };

  /* ── Render Detail ───────────────────────────────────────────────── */
  const openDetail = (id) => {
    const item = state.directives.find(d => d.id === id);
    if (!item) return;
    state.selectedId = id;

    // Reset draft files state for this modal session
    state.draftReportFiles = [];
    state.draftLeaderFiles = [];

    const node = nodeForRole(item);
    const status = statusFor(item);

    // Header
    el.detailTitle().textContent = item.id;
    el.detailStatus().innerHTML = statusBadgeHtml(status);

    // LEFT column
    el.detailLeft().innerHTML = renderDetailLeft(item, node, status);

    // RIGHT column
    el.detailRight().innerHTML = renderDetailRight(item, node, status);

    // Show
    if (el.listContainer()) el.listContainer().hidden = true;
    el.detailOverlay().hidden = false;

    // Bind action buttons
    bindDetailActions(item, node, status);
  };

  const getLeaderReports = (item, node) => {
    const list = [
      ...(node?.leaderReports || []),
      ...(item?.leaderReports || [])
    ];
    if (!list.length && (node?.leaderReport || item?.leaderReport)) {
      list.push(node?.leaderReport || item?.leaderReport);
    }
    const unique = [];
    const seen = new Set();
    for (const r of list) {
      const key = `${r.time || ''}-${(r.content || '').trim()}`;
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push(r);
      }
    }
    return unique;
  };

  const renderLeaderReportCards = (reports) => {
    if (!reports || !reports.length) return '';
    return reports.map(lr => `
      <div class="submitted-report-card">
        <div class="report-content">${escHtml(lr.content)}</div>
        ${renderFileTable(lr.files || (lr.file ? [{ name: lr.file, size: lr.fileSize || '1.8 MB', date: lr.time }] : []), { allowDelete: false })}

        ${lr.rejection ? `
          <div class="report-rejection">
            <div class="rejection-label">
              Lý do từ chối của Tỉnh:
            </div>
            <div class="rejection-reason">${escHtml(lr.rejection.reason)}</div>
            <div class="rejection-time">
              <i class="fa-regular fa-clock"></i>${escHtml(formatDateTimeFormatted(lr.rejection.time || ''))}
            </div>
          </div>` : ''}
      </div>
    `).join('');
  };

  const renderDetailLeft = (item, node, status) => {
    const groupVal = Array.isArray(item.dataGroups) ? item.dataGroups[0] : (item.dataGroup || item.dataGroups);
    const groups = groupVal
      ? escHtml(groupVal)
      : '';

    const cond = deadlineCondition(item);
    const dlLabel = deadlineLabel(item);
    const dlClass = cond === 'overdue' ? 'overdue' : cond === 'warning' ? 'warning' : 'normal';

    const origFiles = item.attachments || [
      { name: item.attachment || 'CD_DanCu_GiaLai_2026.pdf', size: item.attachmentSize || '1.8 MB', date: item.issuedDate },
      { name: 'PhuLuc_HuongDan_TrienKhai.docx', size: '540 KB', date: item.issuedDate }
    ];

    return `
      <!-- Thông tin chỉ đạo -->
      <div class="info-block">
        <div class="info-block-header">Thông tin chỉ đạo</div>
        <div class="info-block-body">
          <div class="info-row">
            <span class="info-label">Nội dung</span>
            <span class="info-value">${escHtml(item.content)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Nhóm dữ liệu</span>
            <span class="info-value">${groups || '<i class="text-muted">Chưa phân nhóm</i>'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Hạn xử lý</span>
            <span class="info-value ${dlClass}">${escHtml(dlLabel)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Người giao</span>
            <span class="info-value">${escHtml(item.source)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Ngày chỉ đạo</span>
            <span class="info-value">${escHtml(item.issuedDate)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Link Dashboard</span>
            <span class="info-value">
              <a href="${escHtml(item.dashboardLink)}" class="dashboard-link" target="_blank">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Xem tại Dashboard
              </a>
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">Hình ảnh</span>
            <span class="info-value">
              <a href="javascript:void(0)" class="dashboard-link" data-view-img="${escHtml(item.previewImage || 'assets/dashboard_gialai.png')}">
                <i class="fa-regular fa-image"></i> Xem sơ đồ/hình ảnh đính kèm
              </a>
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">Tệp đính kèm</span>
            <span class="info-value">
              <div class="info-file-list">
                ${origFiles.map(f => {
                  const fname = typeof f === 'string' ? f : f.name;
                  return `<a href="javascript:void(0)" class="file-plain-link" data-open-file="${escHtml(fname)}">${escHtml(fname)}</a>`;
                }).join('<span class="file-comma-sep">,</span> ')}
              </div>
            </span>
          </div>
        </div>
      </div>

      <!-- Chọn người xử lý & Nút Chuyển xử lý (chỉ leader + waitingAssign) -->
      ${state.role === 'leader' && status === 'waitingAssign' ? `
      <div class="assignee-dropdown-block info-block">
        <div class="info-block-header">Chọn người xử lý</div>
        <div class="info-block-body">
          <input type="hidden" id="assigneeSelect" value="">
          <div class="directive-assignee-autocomplete" id="assigneeAutocompleteContainer">
            <div class="select-box" tabindex="0">
              <span class="placeholder">-- Chọn người xử lý --</span>
              <span class="selected-text" hidden></span>
              <input type="text" class="dropdown-search-input" placeholder="Gõ từ khóa tìm kiếm..." hidden>
              <svg class="arrow-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
            </div>
            <div class="dropdown-menu" hidden>
              ${(node?.availableAssignees || []).map(a => `
                <div class="dropdown-item" data-assignee-id="${escHtml(a.id)}" data-assignee-name="${escHtml(a.name)}">
                  <span>${escHtml(a.name)}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div id="assigneeSelectError" class="assignee-select-error" hidden>* Vui lòng chọn người xử lý.</div>
          <div class="assignee-actions-row">
            <button class="btn-primary-action btn-assign-inline" id="btnChuyen" type="button">
              Chuyển xử lý
            </button>
          </div>
        </div>
      </div>` : ''}

      <!-- Người xử lý Read-Only (khi đã giao / đang xử lý / đã báo cáo) -->
      ${status !== 'waitingAssign' ? `
      <div class="assignee-readonly-block info-block">
        <div class="info-block-header">Người xử lý</div>
        <div class="info-block-body">
          <div class="info-row">
            <span class="info-label">Cán bộ xử lý</span>
            <span class="info-value assignee-read-value">
              ${(() => {
                const indivChild = flattenNodes(item.executionTree).find(n => n.contextId === 'individual');
                if (indivChild) return escHtml(indivChild.accountName);
                return 'Đã phân công cán bộ xử lý';
              })()}
            </span>
          </div>
        </div>
      </div>` : ''}

      <!-- Báo cáo kết quả đã nộp (khi status === 'reported', 'waitingApproval', 'completed') -->
      ${(() => {
        const treeReports = flattenNodes(item.executionTree).flatMap(n => n.subReports || []);
        const allReports = [
          ...treeReports,
          ...(node?.subReports || [])
        ];
        const uniqueReports = [];
        const seen = new Set();
        for (const r of allReports) {
          const key = (r.content || '').trim();
          if (key && !seen.has(key)) {
            seen.add(key);
            uniqueReports.push(r);
          }
        }
        if (!uniqueReports.length && !['reported', 'waitingApproval', 'completed'].includes(status)) {
          return '';
        }
        return `
        <div class="report-submitted-block info-block">
          <div class="info-block-header">Báo cáo kết quả của đơn vị</div>
          <div class="info-block-body">
            ${uniqueReports.length ? uniqueReports.map(r => `
              <div class="submitted-report-card">
                <div class="submitted-report-text">${escHtml(r.content)}</div>
                ${renderFileTable(r.files || (r.file ? [{ name: r.file, size: r.fileSize || '1.5 MB', date: r.time }] : []), { allowDelete: false })}

                ${r.rejection ? `
                  <div class="rejection-box-wrapper">
                    <div class="rejection-box-title">
                      Lý do trả về:
                    </div>
                    <div class="rejection-box-content">${escHtml(r.rejection.reason)}</div>
                    <div class="rejection-meta-row">
                      <div>
                        ${renderFileTable(r.rejection.files || (r.rejection.file ? [{ name: r.rejection.file, size: '1.2 MB', date: r.rejection.time }] : []), { allowDelete: false })}
                      </div>
                      <div class="rejection-time-tag">
                        <i class="fa-regular fa-clock"></i>${escHtml(r.rejection.time || '')}
                      </div>
                    </div>
                  </div>` : ''}
              </div>
            `).join('') : '<div class="report-recorded-note">Báo cáo đã được ghi nhận.</div>'}
          </div>
        </div>`;
      })()}

      <!-- Báo cáo trình Tỉnh của Sở (hiển thị khi Lãnh đạo xem và đã từng trình Tỉnh) -->
      ${(() => {
        if (state.role !== 'leader') return '';
        const reports = getLeaderReports(item, node);
        if (!reports.length) return '';
        if (['waitingApproval', 'completed'].includes(status)) return '';
        return `
        <div class="leader-report-submitted-block info-block">
          <div class="info-block-header">Báo cáo trình Tỉnh của Sở</div>
          <div class="info-block-body">
            ${renderLeaderReportCards(reports)}
          </div>
        </div>`;
      })()}

      <!-- Khung nhập báo cáo / xử lý phía Cột Trái -->
      ${renderActionPanel(item, node, status)}
    `;
  };

  const renderDetailRight = (item, node, status) => {
    return `
      ${renderUML(item, status)}
    `;
  };

  /* ── Dynamic Graphical UML Diagram (matching Quy trình động) ────── */
  /* ── Dynamic Graphical UML Diagram (matching Quy trình động) ────── */
  const UML_NODES_SPEC = [
    { id: 'start', title: 'Start', type: 'start', icon: 'fa-play' },
    { id: 'waitingAssign', title: 'Tiếp nhận và Phân công xử lý', type: 'step', num: 1 },
    { id: 'processing', title: 'Thực hiện nhiệm vụ', type: 'step', num: 2 },
    { id: 'reported', title: 'Báo cáo kết quả', type: 'step', num: 3 },
    { id: 'waitingApproval', title: 'Trình Lãnh đạo phê duyệt', type: 'step', num: 4 },
    { id: 'completed', title: 'Kết thúc chỉ đạo', type: 'step', num: 5 },
    { id: 'end', title: 'Kết thúc', type: 'end', icon: 'fa-flag-checkered' }
  ];

  const renderUML = (item, currentStatus) => {
    const statusOrder = ['start', 'waitingAssign', 'processing', 'reported', 'waitingApproval', 'completed', 'end'];
    let currentIdx = statusOrder.indexOf(currentStatus);
    if (currentIdx === -1) currentIdx = 1;

    const nodesHtml = UML_NODES_SPEC.map((node, i) => {
      let stateCls = '';
      if (i < currentIdx) stateCls = 'done';
      else if (i === currentIdx) stateCls = 'current';
      else stateCls = 'future';

      const isStart = node.type === 'start';
      const isEnd = node.type === 'end';

      let circleContent = '';
      if (isStart) {
        circleContent = '<i class="fa-solid fa-play uml-icon-play"></i>';
      } else if (isEnd) {
        circleContent = '<i class="fa-solid fa-flag-checkered uml-icon-flag"></i>';
      } else {
        circleContent = `<span>${node.num}</span>`;
      }

      return `
        <div class="uml-canvas-node ${stateCls} ${isStart ? 'start-node' : ''} ${isEnd ? 'end-node' : ''}" data-step-id="${node.id}">
          <div class="uml-canvas-circle">
            ${circleContent}
          </div>
          <div class="uml-canvas-text">
            <div class="uml-canvas-title">${escHtml(node.title)}</div>
            ${stateCls === 'current' ? '<span class="uml-canvas-badge current">Đang ở bước này</span>' : ''}
            ${stateCls === 'done' ? '<span class="uml-canvas-badge done">Đã hoàn thành</span>' : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="uml-panel">
        <div class="uml-panel-header">
          Sơ đồ luồng quy trình
        </div>
        <div class="uml-diagram-canvas-wrap">
          <div class="uml-diagram-canvas">
            <svg class="uml-svg-routes" viewBox="0 0 280 530" preserveAspectRatio="none">
              <defs>
                <marker id="uml-arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#22c55e" />
                </marker>
                <marker id="uml-arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#f87171" />
                </marker>
              </defs>
              <!-- Forward vertical green dashed lines between node circles -->
              <line x1="58" y1="32" x2="58" y2="80" stroke="#22c55e" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#uml-arrow-green)" />
              <line x1="58" y1="112" x2="58" y2="160" stroke="#22c55e" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#uml-arrow-green)" />
              <line x1="58" y1="192" x2="58" y2="240" stroke="#22c55e" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#uml-arrow-green)" />
              <line x1="58" y1="272" x2="58" y2="320" stroke="#22c55e" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#uml-arrow-green)" />
              <line x1="58" y1="352" x2="58" y2="400" stroke="#22c55e" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#uml-arrow-green)" />
              <line x1="58" y1="432" x2="58" y2="480" stroke="#22c55e" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#uml-arrow-green)" />

              <!-- Return Rejection red dashed curved loops (Both aligned to same X-axis = 6px) -->
              <!-- 1. Step 3 upper-left (y=248) -> Step 2 (y=176): Sở từ chối -->
              <path d="M 44 248 L 6 248 L 6 176 L 36 176" stroke="#f87171" stroke-width="2" stroke-dasharray="4 4" fill="none" marker-end="url(#uml-arrow-red)" />

              <!-- 2. Step 4 (y=336) -> Step 3 lower-left (y=264): Tỉnh từ chối -->
              <path d="M 42 336 L 6 336 L 6 264 L 36 264" stroke="#f87171" stroke-width="2" stroke-dasharray="4 4" fill="none" marker-end="url(#uml-arrow-red)" />
            </svg>

            <div class="uml-nodes-layer">
              ${nodesHtml}
            </div>
          </div>
        </div>
      </div>`;
  };

  /* ── Action panel (buttons theo vai trò & stage) ─────────────── */
  const renderActionPanel = (item, node, status) => {
    const role = state.role;

    // Khi đứng ở tab "Đã xử lý" (state.activeTab === 'done')
    if (state.activeTab === 'done') {
      let statusText = '';
      let textColor = '#1e293b';

      if (status === 'completed') {
        statusText = 'Chỉ đạo đã được hoàn thành và phê duyệt.';
        textColor = '#166534';
      } else if (status === 'waitingApproval') {
        statusText = 'Chỉ đạo đang chờ Lãnh đạo Tỉnh phê duyệt.';
      } else if (status === 'processing') {
        statusText = 'Chỉ đạo đang trong quá trình xử lý.';
      } else if (status === 'reported') {
        statusText = 'Báo cáo đã được trình Lãnh đạo. Đang chờ xét duyệt.';
      }

      if (['completed', 'waitingApproval', 'processing', 'reported'].includes(status)) {
        const reports = (role === 'leader') ? getLeaderReports(item, node) : [];
        return `
        ${reports.length ? `
        <div class="leader-report-submitted-block info-block">
          <div class="info-block-header">Báo cáo trình Tỉnh của Sở</div>
          <div class="info-block-body">
            ${renderLeaderReportCards(reports)}
          </div>
        </div>` : ''}
        <div class="report-input-block info-block">
          <div class="info-block-header">Trạng thái</div>
          <div class="info-block-body">
            <div class="status-notice-text">
              ${statusText}
            </div>
            ${(status === 'waitingApproval' && role === 'leader') ? `
            <div class="status-notice-actions">
              <button class="btn-primary-action btn-province-accept" id="btnTinhDongY" type="button">
                Mô phỏng: Tỉnh đồng ý
              </button>
              <button class="btn-danger-action btn-province-reject" id="btnTinhTuChoi" type="button">
                Mô phỏng: Tỉnh từ chối
              </button>
            </div>` : ''}
          </div>
        </div>`;
      }
    }

    if (role === 'individual' && status === 'processing') {
      return `
      <div class="report-input-block info-block">
        <div class="info-block-header">Nộp báo cáo kết quả</div>
        <div class="info-block-body">
          <textarea id="reportInput" class="action-textarea" placeholder="Nhập nội dung báo cáo..." rows="2"></textarea>
          <div id="reportInputError" class="report-input-error">* Vui lòng nhập nội dung báo cáo.</div>
          
          <div class="report-attach-section">
            <div class="notes-file-row notes-file-row-flex">
              <label for="reportFileInput"><i class="fa-solid fa-paperclip"></i> Đính kèm file</label>
              <input type="file" id="reportFileInput" multiple hidden>
            </div>
            <div id="reportFileTableContainer" class="report-file-container">
              ${renderFileTable(state.draftReportFiles || [], { allowDelete: true, deleteAttr: 'data-del-draft-report' })}
            </div>
          </div>

          <div class="report-action-footer">
            <button class="btn-primary-action" id="btnTrinhDuyet" type="button">
              Trình phê duyệt
            </button>
          </div>
        </div>
      </div>`;
    }

    if (role === 'leader' && status === 'reported') {
      return `
      <div class="report-input-block info-block">
        <div class="info-block-header">Xem xét báo cáo & Trình phê duyệt</div>
        <div class="info-block-body">
          <textarea id="leaderReportInput" class="action-textarea" placeholder="Nhập nội dung từ chối hoặc báo cáo..." rows="2"></textarea>
          <div id="leaderReportInputError" class="report-input-error">* Vui lòng nhập nội dung.</div>
          
          <div class="report-attach-section">
            <div class="notes-file-row notes-file-row-flex">
              <label for="leaderReportFile"><i class="fa-solid fa-paperclip"></i> Đính kèm file</label>
              <input type="file" id="leaderReportFile" multiple hidden>
            </div>
            <div id="leaderFileTableContainer" class="report-file-container">
              ${renderFileTable(state.draftLeaderFiles || [], { allowDelete: true, deleteAttr: 'data-del-draft-leader' })}
            </div>
          </div>

          <div class="action-buttons report-action-footer">
            <button class="btn-primary-action" id="btnTrinhTinh" type="button">
              Trình phê duyệt
            </button>
            <button class="btn-danger-action" id="btnTraVe" type="button">
              Trả về
            </button>
          </div>
        </div>
      </div>`;
    }

    if (status === 'waitingApproval') {
      if (role === 'leader') {
        let reports = getLeaderReports(item, node);
        if (!reports.length) {
          reports = [{
            content: 'Sở đã tổng hợp báo cáo kết quả từ các đơn vị chuyên môn và chính thức trình Lãnh đạo Tỉnh xem xét, phê duyệt.',
            file: 'TrinhTinh_BaoCao_TongHop.pdf',
            time: new Date().toLocaleString('vi-VN')
          }];
        }
        return `
        <div class="leader-report-submitted-block info-block">
          <div class="info-block-header">Báo cáo trình Tỉnh của Sở</div>
          <div class="info-block-body">
            ${renderLeaderReportCards(reports)}
            <div class="status-notice-actions">
              <button class="btn-primary-action btn-province-accept" id="btnTinhDongY" type="button">
                Mô phỏng: Tỉnh đồng ý
              </button>
              <button class="btn-danger-action btn-province-reject" id="btnTinhTuChoi" type="button">
                Mô phỏng: Tỉnh từ chối
              </button>
            </div>
          </div>
        </div>`;
      }
      return `
      <div class="report-input-block info-block">
        <div class="info-block-header">Trạng thái</div>
        <div class="info-block-body">
          <div class="status-notice-text text-slate">
            Chỉ đạo đang chờ Lãnh đạo Tỉnh phê duyệt.
          </div>
        </div>
      </div>`;
    }

    if (status === 'completed') {
      const reports = (role === 'leader') ? getLeaderReports(item, node) : [];
      return `
      ${reports.length ? `
      <div class="leader-report-submitted-block info-block">
        <div class="info-block-header">Báo cáo trình Tỉnh của Sở</div>
        <div class="info-block-body">
          ${renderLeaderReportCards(reports)}
        </div>
      </div>` : ''}
      <div class="report-input-block info-block">
        <div class="info-block-header">Trạng thái</div>
        <div class="info-block-body">
          <div class="status-notice-text text-green">
            Chỉ đạo đã được hoàn thành và phê duyệt.
          </div>
        </div>
      </div>`;
    }

    return '';
  };

  /* ── Bind detail action buttons ──────────────────────────────── */
  const bindDetailActions = (item, node, status) => {
    const role = state.role;
    state.draftReportFiles = state.draftReportFiles || [];
    state.draftLeaderFiles = state.draftLeaderFiles || [];

    // Multiple File input handlers
    const reportFileInput = document.getElementById('reportFileInput');
    if (reportFileInput) {
      reportFileInput.addEventListener('change', () => {
        if (reportFileInput.files && reportFileInput.files.length) {
          Array.from(reportFileInput.files).forEach(f => {
            const sizeStr = f.size / (1024 * 1024) >= 0.1
              ? (f.size / (1024 * 1024)).toFixed(1) + ' MB'
              : (f.size / 1024).toFixed(0) + ' KB';
            state.draftReportFiles.push({
              name: f.name,
              size: sizeStr,
              date: formatDateTimeFormatted()
            });
          });
          reportFileInput.value = '';
          const container = document.getElementById('reportFileTableContainer');
          if (container) {
            container.innerHTML = renderFileTable(state.draftReportFiles, { allowDelete: true, deleteAttr: 'data-del-draft-report' });
          }
        }
      });
    }

    const leaderReportFileInput = document.getElementById('leaderReportFile');
    if (leaderReportFileInput) {
      leaderReportFileInput.addEventListener('change', () => {
        if (leaderReportFileInput.files && leaderReportFileInput.files.length) {
          Array.from(leaderReportFileInput.files).forEach(f => {
            const sizeStr = f.size / (1024 * 1024) >= 0.1
              ? (f.size / (1024 * 1024)).toFixed(1) + ' MB'
              : (f.size / 1024).toFixed(0) + ' KB';
            state.draftLeaderFiles.push({
              name: f.name,
              size: sizeStr,
              date: formatDateTimeFormatted()
            });
          });
          leaderReportFileInput.value = '';
          const container = document.getElementById('leaderFileTableContainer');
          if (container) {
            container.innerHTML = renderFileTable(state.draftLeaderFiles, { allowDelete: true, deleteAttr: 'data-del-draft-leader' });
          }
        }
      });
    }

    // Delegate click events for deleting draft files & viewing files
    const detailLeftEl = el.detailLeft();
    if (detailLeftEl && !detailLeftEl._fileDelegated) {
      detailLeftEl._fileDelegated = true;
      detailLeftEl.addEventListener('click', e => {
        const delReportBtn = e.target.closest('[data-del-draft-report]');
        if (delReportBtn) {
          const idx = Number(delReportBtn.dataset.delDraftReport);
          if (!isNaN(idx)) {
            state.draftReportFiles.splice(idx, 1);
            const container = document.getElementById('reportFileTableContainer');
            if (container) {
              container.innerHTML = renderFileTable(state.draftReportFiles, { allowDelete: true, deleteAttr: 'data-del-draft-report' });
            }
          }
          return;
        }

        const delLeaderBtn = e.target.closest('[data-del-draft-leader]');
        if (delLeaderBtn) {
          const idx = Number(delLeaderBtn.dataset.delDraftLeader);
          if (!isNaN(idx)) {
            state.draftLeaderFiles.splice(idx, 1);
            const container = document.getElementById('leaderFileTableContainer');
            if (container) {
              container.innerHTML = renderFileTable(state.draftLeaderFiles, { allowDelete: true, deleteAttr: 'data-del-draft-leader' });
            }
          }
          return;
        }

        const openFileBtn = e.target.closest('[data-open-file]');
        if (openFileBtn) {
          const fname = openFileBtn.dataset.openFile || '';
          const lower = fname.toLowerCase();
          if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.docx') || lower.endsWith('.doc')) {
            showNotice(`Đang tải xuống tệp "${fname}"...`);
          } else {
            showNotice(`Đang mở xem tệp "${fname}"...`);
          }
          return;
        }

        const viewFileBtn = e.target.closest('[data-view-file]');
        if (viewFileBtn) {
          const fname = viewFileBtn.dataset.viewFile || '';
          const lower = fname.toLowerCase();
          if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.docx') || lower.endsWith('.doc')) {
            showNotice(`Đang tải xuống tệp "${fname}"...`);
          } else {
            showNotice(`Đang mở xem tệp "${fname}"...`);
          }
          return;
        }
      });
    }

    // CHUYỂN XỬ LÝ (leader + waitingAssign)
    if (role === 'leader' && status === 'waitingAssign') {
      const container = document.getElementById('assigneeAutocompleteContainer');
      const selectEl = document.getElementById('assigneeSelect');
      const errorEl = document.getElementById('assigneeSelectError');

      if (container) {
        const selectBox = container.querySelector('.select-box');
        const menu = container.querySelector('.dropdown-menu');
        const placeholder = container.querySelector('.placeholder');
        const selectedText = container.querySelector('.selected-text');
        const searchInput = container.querySelector('.dropdown-search-input');
        const items = menu.querySelectorAll('.dropdown-item');

        const openMenu = () => {
          container.classList.add('open');
          menu.hidden = false;
          if (!selectEl.value) {
            placeholder.style.display = 'none';
            selectedText.style.display = 'none';
            searchInput.style.display = 'block';
            searchInput.value = '';
            searchInput.focus();
            items.forEach(item => item.style.display = 'flex');
          }
        };

        const closeMenu = () => {
          container.classList.remove('open');
          menu.hidden = true;
          searchInput.style.display = 'none';
          if (selectEl.value) {
            placeholder.style.display = 'none';
            selectedText.style.display = 'block';
          } else {
            placeholder.style.display = 'block';
            selectedText.style.display = 'none';
          }
        };

        selectBox.addEventListener('click', (e) => {
          if (e.target === searchInput) return;
          if (container.classList.contains('open')) {
            closeMenu();
          } else {
            openMenu();
          }
        });

        searchInput.addEventListener('input', () => {
          const query = searchInput.value.toLowerCase().trim();
          items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        });

        items.forEach(item => {
          item.addEventListener('click', () => {
            const id = item.dataset.assigneeId;
            const name = item.dataset.assigneeName;
            selectEl.value = id;
            selectedText.textContent = name;
            items.forEach(el => el.classList.remove('selected'));
            item.classList.add('selected');
            if (errorEl) errorEl.style.display = 'none';
            if (selectBox) selectBox.style.borderColor = '#d0d5dd';
            closeMenu();
          });
        });

        document.addEventListener('click', (e) => {
          if (!container.contains(e.target)) {
            closeMenu();
          }
        });
      }

      const btn = document.getElementById('btnChuyen');
      if (btn) btn.addEventListener('click', () => {
        const selectedVal = selectEl?.value;
        if (!selectedVal) {
          const selectBox = container?.querySelector('.select-box');
          if (selectBox) {
            selectBox.style.setProperty('border-color', '#dc2626', 'important');
          }
          if (errorEl) errorEl.style.display = 'block';
          return;
        }

        const assignee = (node.availableAssignees || []).find(a => a.id === selectedVal);
        showCustomConfirm(
          'Xác nhận',
          'Bạn có chắc chắn muốn chuyển xử lý chỉ đạo này?',
          () => {
            node.stage = 'processing';
            const existingIndiv = node.children?.find(c => c.contextId === 'individual');
            if (!existingIndiv && assignee) {
              node.children = node.children || [];
              node.children.push({
                id: `node-${item.id}-staff-${Date.now()}`,
                contextId: 'individual',
                unitName: `${assignee.dept}`,
                accountId: assignee.id,
                accountName: assignee.name,
                stage: 'processing',
                availableAssignees: [],
                slaDeadline: node.slaDeadline,
                notes: '', notesFile: null, subReports: [],
                history: [{ order: 1, time: new Date().toLocaleString('vi-VN'), actor: 'Lãnh đạo', action: 'Chuyển xử lý', note: `Phân công cho ${assignee.name}` }],
                children: []
              });
            }

            render();
            openDetail(item.id);
            showNotice('Đã chuyển xử lý thành công!');
          }
        );
      });
    }

    // TRÌNH DUYỆT (individual + processing)
    if (role === 'individual' && status === 'processing') {
      const reportEl = document.getElementById('reportInput');
      const btn = document.getElementById('btnTrinhDuyet');
      if (btn) btn.addEventListener('click', () => {
        const content = reportEl?.value.trim() || '';
        if (!content) {
          reportEl.classList.add('is-invalid');
          reportEl.style.setProperty('border-color', '#dc2626', 'important');
          document.getElementById('reportInputError').style.display = 'block';
          return;
        }

        showCustomConfirm('Xác nhận', 'Bạn có chắc chắn muốn trình phê duyệt báo cáo này?', () => {
          node.stage = 'reported';
          node.subReports = node.subReports || [];
          const filesToSubmit = state.draftReportFiles && state.draftReportFiles.length
            ? [...state.draftReportFiles]
            : [{ name: 'BaoCao_KetQua_ChiTiet.pdf', size: '1.8 MB', date: new Date().toLocaleString('vi-VN') }];

          const reportObj = {
            from: node.accountName || 'Chuyên viên',
            time: new Date().toLocaleString('vi-VN'),
            content,
            files: filesToSubmit
          };
          state.draftReportFiles = [];
          node.subReports.push(reportObj);

          const leaderNode = flattenNodes(item.executionTree).find(n => n.contextId === 'leader');
          if (leaderNode) {
            leaderNode.stage = 'reported';
            leaderNode.subReports = leaderNode.subReports || [];
            leaderNode.subReports.push(reportObj);
          }
          render();
          openDetail(item.id);
          showNotice('Đã trình phê duyệt thành công!');
        });
      });
    }

    // TRÌNH TỈNH (leader + reported)
    if (role === 'leader' && status === 'reported') {
      const leaderReportEl = document.getElementById('leaderReportInput');
      const btnTrinh = document.getElementById('btnTrinhTinh');
      if (btnTrinh) btnTrinh.addEventListener('click', () => {
        const content = leaderReportEl?.value.trim() || '';
        if (!content) {
          leaderReportEl.classList.add('is-invalid');
          leaderReportEl.style.setProperty('border-color', '#dc2626', 'important');
          document.getElementById('leaderReportInputError').style.display = 'block';
          return;
        }

        showCustomConfirm('Xác nhận', 'Bạn có chắc chắn muốn trình Lãnh đạo Tỉnh phê duyệt?', () => {
          const filesToSubmit = state.draftLeaderFiles && state.draftLeaderFiles.length
            ? [...state.draftLeaderFiles]
            : [{ name: 'BaoCao_TrinhTinh_TongHop.pdf', size: '2.4 MB', date: new Date().toLocaleString('vi-VN') }];

          const lrObj = {
            content: content,
            files: filesToSubmit,
            time: new Date().toLocaleString('vi-VN')
          };
          state.draftLeaderFiles = [];
          node.leaderReports = node.leaderReports || [];
          node.leaderReports.push(lrObj);
          node.stage = 'waitingApproval';
          flattenNodes(item.executionTree).forEach(n => {
            if (n.contextId !== 'leader') n.stage = 'waitingApproval';
          });
          render();
          openDetail(item.id);
          showNotice('Đã trình Tỉnh thành công!');
        });
      });

      const btnTra = document.getElementById('btnTraVe');
      if (btnTra) btnTra.addEventListener('click', () => {
        const reason = leaderReportEl?.value.trim() || '';
        if (!reason) {
          leaderReportEl.classList.add('is-invalid');
          leaderReportEl.style.setProperty('border-color', '#dc2626', 'important');
          document.getElementById('leaderReportInputError').style.display = 'block';
          return;
        }

        showCustomConfirm('Xác nhận', 'Bạn có chắc chắn muốn trả về báo cáo này?', () => {
          node.stage = 'processing';
          const indivNode = flattenNodes(item.executionTree).find(n => n.contextId === 'individual');
          if (indivNode) indivNode.stage = 'processing';

          const rejObj = {
            reason: reason,
            files: [...state.draftLeaderFiles],
            time: new Date().toLocaleString('vi-VN')
          };
          state.draftLeaderFiles = [];
          const allSub = node.subReports || [];
          if (allSub.length) allSub[allSub.length - 1].rejection = rejObj;
          
          render();
          openDetail(item.id);
          showNotice('Đã trả về báo cáo!');
        });
      });
    }

    // MÔ PHỎNG TỈNH PHÊ DUYỆT / TỪ CHỐI (status === 'waitingApproval')
    if (status === 'waitingApproval') {
      const btnDongY = document.getElementById('btnTinhDongY');
      if (btnDongY) btnDongY.addEventListener('click', () => {
        showCustomConfirm('Xác nhận', 'Bạn có chắc chắn muốn phê duyệt chỉ đạo này?', () => {
          node.stage = 'completed';
          flattenNodes(item.executionTree).forEach(n => n.stage = 'completed');
          render();
          openDetail(item.id);
          showNotice('Lãnh đạo Tỉnh đã phê duyệt thành công!');
        });
      });

      const btnTuChoi = document.getElementById('btnTinhTuChoi');
      if (btnTuChoi) btnTuChoi.addEventListener('click', () => {
        showCustomConfirm('Xác nhận', 'Bạn có chắc chắn muốn từ chối báo cáo chỉ đạo này?', () => {
          const reason = prompt('Nhập nội dung Tỉnh từ chối:', 'Tỉnh yêu cầu Sở bổ sung chi tiết số liệu báo cáo.') || 'Tỉnh yêu cầu bổ sung số liệu báo cáo.';
          node.stage = 'reported';
          flattenNodes(item.executionTree).forEach(n => n.stage = 'reported');

          let reports = getLeaderReports(item, node);
          if (!reports.length) {
            const defaultLr = {
              content: 'Sở đã tổng hợp báo cáo kết quả từ các đơn vị chuyên môn và chính thức trình Lãnh đạo Tỉnh xem xét, phê duyệt.',
              file: 'TrinhTinh_BaoCao_TongHop.pdf',
              time: new Date().toLocaleString('vi-VN')
            };
            node.leaderReports = [defaultLr];
            item.leaderReports = [defaultLr];
            reports = [defaultLr];
          }

          const lastLr = reports[reports.length - 1];
          lastLr.rejection = {
            reason: reason,
            time: new Date().toLocaleString('vi-VN')
          };

          render();
          openDetail(item.id);
          showNotice('Tỉnh đã từ chối báo cáo!');
        });
      });
    }
  };

  /* ── Time calendar (SLA) ─────────────────────────────────────────── */
  let timePickerInst = null;

  const openTimeCalendar = (itemId) => {
    const item = state.directives.find(d => d.id === itemId);
    if (!item) return;
    const node = nodeForRole(item);
    const cond = deadlineCondition(item);
    const dl = deadlineDate(item);
    const issued = parseViDate(item.issuedDate);

    el.timeTitle().textContent = cond === 'overdue' ? '⛔ Trễ hạn' : cond === 'warning' ? '⚠ Sắp đến hạn' : '✅ Còn hạn';
    el.timeSummary().textContent = ` — Hạn: ${deadlineLabel(item)}`;

    if (timePickerInst) { timePickerInst.destroy(); timePickerInst = null; }
    timePickerInst = flatpickr(el.timeCalInput(), {
      inline: true, mode: 'single', locale: 'vn',
      defaultDate: dl || new Date(),
      onDayCreate: (_dObj, _dStr, _fp, dayElem) => {
        const d = dayElem.dateObj;
        if (issued && d.toDateString() === issued.toDateString())
          dayElem.classList.add('flatpickr-day--issued');
        if (d.toDateString() === new Date().toDateString())
          dayElem.classList.add('flatpickr-day--today');
        if (dl && d.toDateString() === dl.toDateString())
          dayElem.classList.add('flatpickr-day--deadline');
      }
    });
    el.timePopover().hidden = false;
  };

  /* ── Event binding ───────────────────────────────────────────────── */
  const bind = () => {
    // Role select
    el.roleSelect().addEventListener('change', () => {
      state.role = el.roleSelect().value;
      state.page = 1;
      state.activeTab = 'active';
      activateTab('active');
      render();
    });

    // Tab buttons
    document.getElementById('tabBar').addEventListener('click', e => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      const tab = btn.dataset.tab;
      activateTab(tab);
      state.page = 1;
      render();
    });

    // Search
    el.search().addEventListener('input', () => {
      state.filters.search = el.search().value;
      state.page = 1;
      render();
    });

    document.getElementById('directiveSearchBtn')?.addEventListener('click', () => {
      state.filters.search = el.search().value;
      state.page = 1;
      render();
    });

    // Custom Select Dropdown setup
    const bindCustomSelect = (wrapId, onSelect) => {
      const wrap = document.getElementById(wrapId);
      if (!wrap) return;
      const btn = wrap.querySelector('.custom-select-trigger');
      const menu = wrap.querySelector('.custom-select-dropdown');
      const text = wrap.querySelector('.selected-text');
      const options = menu.querySelectorAll('.custom-option');

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = wrap.classList.contains('open');
        document.querySelectorAll('.custom-select-wrap').forEach(w => {
          w.classList.remove('open');
          w.querySelector('.custom-select-dropdown').hidden = true;
        });
        if (!isOpen) {
          wrap.classList.add('open');
          menu.hidden = false;
        }
      });

      options.forEach(opt => {
        opt.addEventListener('click', () => {
          options.forEach(o => o.classList.remove('active'));
          opt.classList.add('active');
          text.textContent = opt.textContent.trim();
          wrap.classList.remove('open');
          menu.hidden = true;
          onSelect(opt.dataset.value || '');
        });
      });
    };

    bindCustomSelect('statusFilterWrap', val => {
      state.filters.status = val;
      state.page = 1;
      render();
    });

    bindCustomSelect('timeConditionWrap', val => {
      state.filters.timeCondition = val;
      state.page = 1;
      render();
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-select-wrap')) {
        document.querySelectorAll('.custom-select-wrap').forEach(w => {
          w.classList.remove('open');
          const m = w.querySelector('.custom-select-dropdown');
          if (m) m.hidden = true;
        });
      }
    });

    // Clear deadline
    el.clearDeadline().addEventListener('click', () => {
      state.filters.deadlineDate = null;
      el.deadlineRange().value = '';
      el.clearDeadline().hidden = true;
      state.page = 1;
      render();
    });

    // Reset filters
    el.resetFilters().addEventListener('click', () => {
      state.filters = { search: '', status: '', deadlineDate: null, timeCondition: '' };
      el.search().value = '';

      const statusText = document.getElementById('statusFilterText');
      if (statusText) statusText.textContent = '-- Tất cả trạng thái --';
      document.querySelectorAll('#statusFilterMenu .custom-option').forEach(o => {
        o.classList.toggle('active', o.dataset.value === '');
      });

      const timeText = document.getElementById('timeConditionText');
      if (timeText) timeText.textContent = '-- Tất cả tình trạng --';
      document.querySelectorAll('#timeConditionMenu .custom-option').forEach(o => {
        o.classList.toggle('active', o.dataset.value === '');
      });

      el.deadlineRange().value = '';
      el.clearDeadline().hidden = true;
      state.page = 1;
      render();
    });

    // Page size
    el.pageSize().addEventListener('change', () => {
      state.pageSize = Number(el.pageSize().value);
      state.page = 1;
      render();
    });

    // Table body clicks (delegate)
    el.tbody().addEventListener('click', e => {
      const openBtn = e.target.closest('[data-open-id]');
      if (openBtn) { openDetail(openBtn.dataset.openId); return; }
      const timeBtn = e.target.closest('[data-time-id]');
      if (timeBtn) { openTimeCalendar(timeBtn.dataset.timeId); return; }
    });

    // Pagination delegate
    el.pageButtons().addEventListener('click', e => {
      const btn = e.target.closest('[data-page]');
      if (btn) { state.page = Number(btn.dataset.page); render(); }
    });

    // Close detail
    el.closeDetail().addEventListener('click', closeDetail);
    el.detailOverlay().addEventListener('click', e => {
      if (e.target === el.detailOverlay()) closeDetail();
    });

    // Close time calendar
    el.closeTime().addEventListener('click', () => { el.timePopover().hidden = true; });

    // Close image viewer
    const closeImgBtn = document.getElementById('closeImageViewer');
    if (closeImgBtn) closeImgBtn.addEventListener('click', () => { el.imageOverlay().hidden = true; });
    const imgOverlay = el.imageOverlay();
    if (imgOverlay) imgOverlay.addEventListener('click', e => { if (e.target === imgOverlay) imgOverlay.hidden = true; });

    // Click to view image modal
    document.addEventListener('click', e => {
      const imgTarget = e.target.closest('[data-view-img]');
      if (imgTarget) {
        const src = imgTarget.dataset.viewImg;
        if (el.viewerImage()) el.viewerImage().src = src;
        if (el.imageOverlay()) el.imageOverlay().hidden = false;
      }
    });

    // Deadline flatpickr (Material Calendar Theme)
    flatpickr(el.deadlineRange(), {
      dateFormat: 'd/m/Y',
      animate: true,
      disableMobile: true,
      onReady: (_, __, fp) => {
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        if (fp.weekdayContainer) {
          fp.weekdayContainer.querySelectorAll('.flatpickr-weekday').forEach((w, i) => {
            w.textContent = days[i % 7];
          });
        }
      },
      onChange: dates => {
        state.filters.deadlineDate = dates.length === 1 ? dates[0] : null;
        el.clearDeadline().hidden = dates.length === 0;
        state.page = 1;
        render();
      }
    });
  };

  /* ── Tab helper ─────────────────────────────────────────────────── */
  const activateTab = tab => {
    state.activeTab = tab;
    el.tabActive().classList.toggle('active', tab === 'active');
    el.tabDone().classList.toggle('active', tab === 'done');
  };

  /* ── Init ────────────────────────────────────────────────────────── */
  bind();
  render();

})();
