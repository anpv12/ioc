/* -----------------------------------------------------------------------
   ui.js — Logic UI Xử lý chỉ đạo
   Yêu cầu: data.js phải được load trước.
   ----------------------------------------------------------------------- */
(() => {
  const state = directiveState;

  /* ── DOM elements ────────────────────────────────────────────────── */
  const el = {
    roleSelect:    () => document.getElementById('roleSelect'),
    tabActive:     () => document.getElementById('tabActive'),
    tabDone:       () => document.getElementById('tabDone'),
    countActive:   () => document.getElementById('countActive'),
    countDone:     () => document.getElementById('countDone'),
    search:        () => document.getElementById('directiveSearch'),
    statusFilter:  () => document.getElementById('statusFilterSelect'),
    deadlineRange: () => document.getElementById('deadlineRange'),
    clearDeadline: () => document.getElementById('clearDeadlineRange'),
    resetFilters:  () => document.getElementById('resetFilters'),
    tbody:         () => document.getElementById('directiveTableBody'),
    emptyState:    () => document.getElementById('emptyState'),
    pageInfo:      () => document.getElementById('directivePageInfo'),
    pageButtons:   () => document.getElementById('directivePageButtons'),
    pageSize:      () => document.getElementById('directivePageSize'),
    listContainer: () => document.getElementById('directiveListContainer'),
    detailOverlay: () => document.getElementById('detailOverlay'),
    detailTitle:   () => document.getElementById('detailTitle'),
    detailStatus:  () => document.getElementById('detailStatusBadge'),
    detailLeft:    () => document.getElementById('detailLeft'),
    detailRight:   () => document.getElementById('detailRight'),
    closeDetail:   () => document.getElementById('closeDetail'),
    timePopover:   () => document.getElementById('timeCalendarPopover'),
    timeTitle:     () => document.getElementById('timeCalendarTitle'),
    timeSummary:   () => document.getElementById('timeCalendarSummary'),
    closeTime:     () => document.getElementById('closeTimeCalendar'),
    timeCalInput:  () => document.getElementById('timeCalendarInput'),
    imageOverlay:  () => document.getElementById('imageViewerOverlay'),
    viewerImage:   () => document.getElementById('viewerImage'),
    closeImage:    () => document.getElementById('closeImageViewer'),
  };

  /* ── Utils ──────────────────────────────────────────────────────── */
  const escHtml = v => String(v ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');

  const parseViDate = str => {
    if (!str) return null;
    const [d,m,y] = String(str).split('/').map(Number);
    return new Date(y, m-1, d, 0,0,0);
  };

  const flattenNodes = root =>
    root ? [root, ...(root.children||[]).flatMap(flattenNodes)] : [];

  const nodeForRole = (item, role = state.role) =>
    flattenNodes(item.executionTree).find(n => n.contextId === role) || null;

  /* ── Stage → Status mapping ──────────────────────────────────────── */
  const STAGE_STATUS = {
    waitingAssign:   'waitingAssign',
    processing:      'processing',
    reported:        'reported',
    waitingApproval: 'waitingApproval',
    completed:       'completed',
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
        `${item.id} ${item.title}`.toLowerCase().includes(search);

      const itemStatus = statusFor(item);
      const matchStatus = !statusF || itemStatus === statusF;

      const dl = deadlineDate(item);
      const matchDl = !selDate || (dl && dl.toDateString() === selDate.toDateString());

      const matchTc = !tcF || deadlineCondition(item) === tcF;

      return matchSearch && matchStatus && matchDl && matchTc;
    });
  };

  /* ── Render table ────────────────────────────────────────────────── */
  const render = () => {
    const activeItems = filteredForTab('active');
    const doneItems   = filteredForTab('done');

    // Update tab counts
    const totalActive = state.directives.filter(i => isVisibleForRole(i) && tabFor(i)==='active').length;
    const totalDone   = state.directives.filter(i => isVisibleForRole(i) && tabFor(i)==='done').length;
    el.countActive().textContent = totalActive;
    el.countDone().textContent   = totalDone;

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
      const status     = statusFor(item);
      const cond       = deadlineCondition(item);
      const dlLabel    = deadlineLabel(item);
      const firstGroup = (item.dataGroups && item.dataGroups.length > 0) ? item.dataGroups[0] : '—';

      const contentText = item.content || item.title || '';

      return `<tr>
        <td class="center col-stt">${start + idx + 1}</td>
        <td class="col-title" title="${escHtml(contentText)}">
          <span class="dir-title-main" title="${escHtml(contentText)}">${escHtml(contentText)}</span>
        </td>
        <td class="col-groups">${escHtml(firstGroup)}</td>
        <td class="col-date">${escHtml(item.issuedDate)}</td>
        <td class="col-deadline">
          <span class="${escHtml(cond)}">${escHtml(dlLabel)}</span>
        </td>
        <td class="col-status">${statusBadgeHtml(status)}</td>
        <td class="col-act center">
          <div class="row-actions" style="display: flex; justify-content: center;">
            <button class="act-btn act-edit" data-open-id="${escHtml(item.id)}" type="button" title="Xem chi tiết">
              <i class="fa-solid fa-pen"></i>
            </button>
          </div>
        </td>
      </tr>`;
    }).join('');

    // Page info
    el.pageInfo().textContent = `Hiển thị ${start+1}–${Math.min(start+pageSize, total)} / ${total} chỉ đạo`;

    // Pagination buttons
    const btns = [];
    for (let p = 1; p <= maxPage; p++) {
      btns.push(`<button class="pg-btn${p===state.page?' active':''}" data-page="${p}" type="button">${p}</button>`);
    }
    el.pageButtons().innerHTML = btns.join('');
  };

  /* ── Render Detail ───────────────────────────────────────────────── */
  const openDetail = (id) => {
    const item = state.directives.find(d => d.id === id);
    if (!item) return;
    state.selectedId = id;

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

  const renderDetailLeft = (item, node, status) => {
    const groups = (item.dataGroups||[])
      .map(g => `<span class="dg-tag"><i class="fa-solid fa-tag"></i>${escHtml(g)}</span>`).join('');

    const subReports = (node?.subReports || []);
    const subReportsHtml = subReports.length
      ? subReports.map(r => `
          <div class="sub-report-item">
            <div class="sub-report-header">
              <span class="sub-report-from"><i class="fa-solid fa-user"></i> ${escHtml(r.from)}</span>
              <span class="sub-report-time">${escHtml(r.time)}</span>
            </div>
            <div class="sub-report-content">${escHtml(r.content)}</div>
            ${r.file ? `<div class="sub-report-file">
              <i class="fa-solid fa-paperclip"></i>
              <span>${escHtml(r.file)}</span>
              <span style="color:var(--admin-muted)">(${escHtml(r.fileSize)})</span>
            </div>` : ''}
          </div>`).join('')
      : `<div style="font-size:13px;color:var(--admin-muted);padding:8px 0">Chưa có báo cáo từ cấp dưới.</div>`;

    const cond = deadlineCondition(item);
    const dlLabel = deadlineLabel(item);
    const dlClass = cond === 'overdue' ? 'overdue' : cond === 'warning' ? 'warning' : 'normal';

    return `
      <!-- Thông tin chỉ đạo -->
      <div class="info-block">
        <div class="info-block-header"><i class="fa-solid fa-file-lines"></i> Thông tin chỉ đạo</div>
        <div class="info-block-body">
          <div class="info-row">
            <span class="info-label">Nội dung</span>
            <span class="info-value">${escHtml(item.content)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Nhóm dữ liệu</span>
            <span class="info-value"><div class="data-group-tags">${groups || '<i style="color:var(--admin-muted)">Chưa phân nhóm</i>'}</div></span>
          </div>
          <div class="info-row">
            <span class="info-label">Hạn xử lý</span>
            <span class="info-value ${dlClass}" style="font-weight:600">${escHtml(dlLabel)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Người giao</span>
            <span class="info-value">${escHtml(item.source)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Ngày ban hành</span>
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
          ${item.attachment ? `<div class="info-row">
            <span class="info-label">Tài liệu đính kèm</span>
            <span class="info-value" style="color:var(--admin-primary);font-weight:600">
              <i class="fa-solid fa-paperclip"></i> ${escHtml(item.attachment)}
              <span style="color:var(--admin-muted);font-weight:400">(${escHtml(item.attachmentSize||'')})</span>
            </span>
          </div>` : ''}
          ${item.previewImage ? `<div class="info-row">
            <span class="info-label">Hình ảnh</span>
            <span class="info-value">
              <div class="preview-image-wrap">
                <img src="${escHtml(item.previewImage)}" alt="Ảnh chỉ đạo" data-img-view="${escHtml(item.previewImage)}">
              </div>
            </span>
          </div>` : ''}
        </div>
      </div>

      <!-- Ghi chú Sở (option) -->
      ${['leader','department'].includes(state.role) && status !== 'completed' ? `
      <div class="notes-input-block info-block">
        <div class="info-block-header"><i class="fa-solid fa-note-sticky"></i> Ghi chú thêm của đơn vị (tuỳ chọn)</div>
        <textarea id="notesInput" class="action-textarea" placeholder="Nhập ghi chú bổ sung..." rows="3"
        >${escHtml(node?.notes||'')}</textarea>
        <div class="notes-file-row">
          <label for="notesFileInput"><i class="fa-solid fa-paperclip"></i> Đính kèm file</label>
          <input type="file" id="notesFileInput">
          <span id="notesFileName" class="notes-file-name">${node?.notesFile ? escHtml(node.notesFile.name) : ''}</span>
        </div>
      </div>` : ''}

      <!-- Báo cáo từ cấp dưới -->
      ${['leader','department'].includes(state.role) ? `
      <div class="info-block">
        <div class="info-block-header"><i class="fa-solid fa-file-circle-check"></i> Báo cáo từ cấp dưới</div>
        <div class="info-block-body">
          <div class="sub-reports-list">${subReportsHtml}</div>
        </div>
      </div>` : ''}
    `;
  };

  const renderDetailRight = (item, node, status) => {
    return `
      ${renderUML(item, status)}
      ${renderAssigneePanel(item, node, status)}
      ${renderActionPanel(item, node, status)}
    `;
  };

  /* ── UML flow ──────────────────────────────────────────────────── */
  const UML_STEPS = [
    { key: 'waitingAssign',   label: '① Chờ phân công' },
    { key: 'processing',      label: '② Đang xử lý' },
    { key: 'reported',        label: '③ Đã có báo cáo' },
    { key: 'waitingApproval', label: '④ Chờ phê duyệt' },
    { key: 'completed',       label: '⑤ Đã kết thúc' },
  ];

  const renderUML = (item, currentStatus) => {
    const statusOrder = UML_STEPS.map(s => s.key);
    const currentIdx  = statusOrder.indexOf(currentStatus);

    const steps = UML_STEPS.map((step, i) => {
      let cls = 'uml-step-box';
      if (i < currentIdx)  cls += ' done';
      if (i === currentIdx) cls += ' current';
      const arrowHtml = i < UML_STEPS.length - 1 ? '<div class="uml-arrow"></div>' : '';
      return `<div class="uml-step">
        <div class="${cls}">${escHtml(step.label)}</div>
        ${arrowHtml}
      </div>`;
    }).join('');

    return `
      <div class="uml-panel">
        <div class="uml-panel-header"><i class="fa-solid fa-diagram-project"></i> Sơ đồ luồng quy trình</div>
        <div class="uml-flow">${steps}</div>
      </div>`;
  };

  /* ── Assignee panel (chỉ leader + waitingAssign) ─────────────── */
  const renderAssigneePanel = (item, node, status) => {
    if (state.role !== 'leader' || status !== 'waitingAssign') return '';
    const assignees = node?.availableAssignees || [];
    if (!assignees.length) return `
      <div class="assignee-panel">
        <div class="assignee-panel-header"><i class="fa-solid fa-users"></i> Danh sách nhân viên</div>
        <div style="padding:12px;font-size:13px;color:var(--admin-muted)">
          Chưa có danh sách nhân viên. Vui lòng cấu hình trong Quy trình động.
        </div>
      </div>`;

    const rows = assignees.map(a => `
      <label class="assignee-item" for="assignee-${escHtml(a.id)}">
        <input type="radio" class="assignee-radio" name="assigneeSelect" id="assignee-${escHtml(a.id)}" value="${escHtml(a.id)}">
        <div class="assignee-info">
          <div class="assignee-name">${escHtml(a.name)}</div>
          <div class="assignee-dept">${escHtml(a.dept)}</div>
          <div class="assignee-title">${escHtml(a.title)}</div>
        </div>
      </label>`).join('');

    return `
      <div class="assignee-panel">
        <div class="assignee-panel-header"><i class="fa-solid fa-users"></i> Chọn người xử lý</div>
        <div class="assignee-list">${rows}</div>
      </div>`;
  };

  /* ── Action panel (buttons theo vai trò & stage) ─────────────── */
  const renderActionPanel = (item, node, status) => {
    const role = state.role;
    let content = '';

    if (role === 'leader' && status === 'waitingAssign') {
      content = `
        <p class="action-panel-title">Hành động</p>
        <button class="btn-primary-action" id="btnChuyen" type="button">
          <i class="fa-solid fa-share"></i> Chuyển xử lý
        </button>`;
    }

    else if (role === 'individual' && status === 'processing') {
      content = `
        <p class="action-panel-title">Nộp báo cáo kết quả</p>
        <textarea id="reportInput" class="action-textarea" placeholder="Nhập nội dung báo cáo..." rows="4"></textarea>
        <div class="action-file-row">
          <label for="reportFileInput"><i class="fa-solid fa-paperclip"></i> Đính kèm file</label>
          <input type="file" id="reportFileInput">
          <span id="reportFileName" class="action-file-selected"></span>
        </div>
        <div class="action-buttons">
          <button class="btn-primary-action" id="btnTrinhDuyet" type="button">
            <i class="fa-solid fa-paper-plane"></i> Trình duyệt
          </button>
        </div>`;
    }

    else if (role === 'leader' && status === 'reported') {
      content = `
        <p class="action-panel-title">Xem xét báo cáo</p>
        <textarea id="leaderReportInput" class="action-textarea" placeholder="Nhập nội dung báo cáo trình Tỉnh..." rows="4"></textarea>
        <div class="action-file-row">
          <label for="leaderReportFile"><i class="fa-solid fa-paperclip"></i> Đính kèm file</label>
          <input type="file" id="leaderReportFile">
          <span id="leaderFileName" class="action-file-selected"></span>
        </div>
        <div class="action-buttons">
          <button class="btn-primary-action" id="btnTrinhTinh" type="button">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Trình Tỉnh
          </button>
          <button class="btn-danger-action" id="btnTraVe" type="button">
            <i class="fa-solid fa-rotate-left"></i> Trả về
          </button>
        </div>`;
    }

    else if (status === 'waitingApproval' && role === 'leader') {
      content = `
        <p class="action-panel-title">Trạng thái</p>
        <div style="font-size:13px;color:var(--admin-muted);padding:4px 0">
          Báo cáo đã được gửi Tỉnh. Đang chờ phê duyệt từ Lãnh đạo Tỉnh.
        </div>`;
    }

    else if (status === 'completed') {
      content = `
        <div style="display:flex;align-items:center;gap:8px;padding:8px 0;font-size:14px;color:#166534;font-weight:600">
          <i class="fa-solid fa-circle-check" style="font-size:20px"></i>
          Chỉ đạo đã được hoàn thành và phê duyệt.
        </div>`;
    }

    if (!content) return '';

    return `<div class="action-panel">${content}</div>`;
  };

  /* ── Bind detail action buttons ──────────────────────────────── */
  const bindDetailActions = (item, node, status) => {
    const role = state.role;

    // File input displays
    const bindFile = (inputId, nameId) => {
      const inp = document.getElementById(inputId);
      const lbl = document.getElementById(nameId);
      if (inp && lbl) inp.addEventListener('change', () => {
        lbl.textContent = inp.files[0]?.name || '';
      });
    };
    bindFile('reportFileInput','reportFileName');
    bindFile('leaderReportFile','leaderFileName');
    bindFile('notesFileInput','notesFileName');

    // Image viewer
    document.querySelectorAll('[data-img-view]').forEach(img => {
      img.addEventListener('click', () => {
        el.viewerImage().src = img.dataset.imgView;
        el.imageOverlay().hidden = false;
      });
    });

    // CHUYỂN XỬ LÝ (leader + waitingAssign)
    if (role === 'leader' && status === 'waitingAssign') {
      const btn = document.getElementById('btnChuyen');
      if (btn) btn.addEventListener('click', () => {
        const selected = document.querySelector('input[name="assigneeSelect"]:checked');
        if (!selected) { showNotice('Vui lòng chọn người xử lý.'); return; }
        const assignee = (node.availableAssignees||[]).find(a => a.id === selected.value);
        showCustomConfirm(
          'Xác nhận chuyển xử lý',
          `Chuyển chỉ đạo cho ${assignee?.name || selected.value}?`,
          () => {
            // Cập nhật stage
            node.stage = 'processing';
            // Thêm child individual node nếu chưa có
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
                history: [{ order:1, time: new Date().toLocaleString('vi-VN'), actor: 'Lãnh đạo', action:'Chuyển xử lý', note:`Phân công cho ${assignee.name}` }],
                children: []
              });
            }
            // Ghi chú
            const notesEl = document.getElementById('notesInput');
            if (notesEl && notesEl.value.trim()) node.notes = notesEl.value.trim();

            closeDetail();
            state.activeTab = 'done'; // leader xem ở Đã xử lý
            render();
            showNotice(`Đã chuyển xử lý cho ${assignee?.name || 'người được chọn'}.`);
          }
        );
      });
    }

    // TRÌNH DUYỆT (individual + processing)
    if (role === 'individual' && status === 'processing') {
      const btn = document.getElementById('btnTrinhDuyet');
      if (btn) btn.addEventListener('click', () => {
        const reportEl = document.getElementById('reportInput');
        const content = reportEl?.value.trim() || '';
        if (!content) { showNotice('Vui lòng nhập nội dung báo cáo.'); return; }
        showCustomConfirm('Xác nhận trình duyệt', 'Gửi báo cáo lên cấp trên?', () => {
          // Đổi stage individual → reported
          node.stage = 'reported';
          // Đổi stage leader → reported (để leader thấy ở tab Đang xử lý)
          const leaderNode = flattenNodes(item.executionTree).find(n => n.contextId === 'leader');
          if (leaderNode) {
            leaderNode.stage = 'reported';
            leaderNode.subReports = leaderNode.subReports || [];
            leaderNode.subReports.push({
              from: node.accountName,
              time: new Date().toLocaleString('vi-VN'),
              content,
              file: document.getElementById('reportFileInput')?.files[0]?.name || null,
              fileSize: ''
            });
          }
          closeDetail();
          state.activeTab = 'done';
          render();
          showNotice('Đã trình duyệt. Chờ Sở xem xét.');
        });
      });
    }

    // TRÌNH TỈNH (leader + reported)
    if (role === 'leader' && status === 'reported') {
      const btnTrinh = document.getElementById('btnTrinhTinh');
      if (btnTrinh) btnTrinh.addEventListener('click', () => {
        const content = document.getElementById('leaderReportInput')?.value.trim() || '';
        if (!content) { showNotice('Vui lòng nhập nội dung báo cáo trình Tỉnh.'); return; }
        showCustomConfirm('Xác nhận trình Tỉnh', 'Gửi báo cáo lên Tỉnh để phê duyệt?', () => {
          node.stage = 'waitingApproval';
          flattenNodes(item.executionTree).forEach(n => {
            if (n.contextId !== 'leader') n.stage = 'waitingApproval';
          });
          closeDetail();
          render();
          showNotice('Đã trình Tỉnh. Đang chờ phê duyệt.');
        });
      });

      const btnTra = document.getElementById('btnTraVe');
      if (btnTra) btnTra.addEventListener('click', () => {
        showCustomConfirm('Xác nhận trả về', 'Trả lại chỉ đạo cho cấp dưới?', () => {
          node.stage = 'processing';
          const indivNode = flattenNodes(item.executionTree).find(n => n.contextId === 'individual');
          if (indivNode) indivNode.stage = 'processing';
          // Xóa sub-report đã có để làm lại
          node.subReports = [];
          closeDetail();
          state.activeTab = 'active';
          render();
          showNotice('Đã trả về. Cấp dưới cần xử lý lại.');
        });
      });
    }
  };

  /* ── Close detail ────────────────────────────────────────────────── */
  const closeDetail = () => {
    el.detailOverlay().hidden = true;
    if (el.listContainer()) el.listContainer().hidden = false;
    state.selectedId = null;
  };

  /* ── Time calendar (SLA) ─────────────────────────────────────────── */
  let timePickerInst = null;

  const openTimeCalendar = (itemId) => {
    const item = state.directives.find(d => d.id === itemId);
    if (!item) return;
    const node = nodeForRole(item);
    const cond = deadlineCondition(item);
    const dl   = deadlineDate(item);
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

    // Status filter
    el.statusFilter().addEventListener('change', () => {
      state.filters.status = el.statusFilter().value;
      state.page = 1;
      render();
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
      el.statusFilter().value = '';
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

    // Deadline flatpickr (single date selection)
    flatpickr(el.deadlineRange(), {
      dateFormat: 'd/m/Y',
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
