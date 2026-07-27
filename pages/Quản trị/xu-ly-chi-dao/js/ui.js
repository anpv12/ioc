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
  processes: JSON.parse(localStorage.getItem('gialai_processes') || '[]'),
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
  const syncDirectivesFromStorage = () => {
    let storageDirectives = JSON.parse(localStorage.getItem('gialai_directives') || '[]');
    let creators = JSON.parse(localStorage.getItem('gialai_directives_creators') || '{}');
    let updated = false;
    storageDirectives.forEach(dir => {
      if (!creators[dir.id]) {
        creators[dir.id] = dir.source || 'Lãnh đạo Tỉnh';
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem('gialai_directives_creators', JSON.stringify(creators));
    }
  };
  syncDirectivesFromStorage();

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
        <td><button class="act-btn act-edit" type="button" data-id="${item.id}" title="Xử lý" aria-label="Xử lý ${item.id}"><i class="fa-solid fa-pen"></i></button></td>
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

  function renderDirectiveViews() {
    renderDirectiveTable();
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
})();

