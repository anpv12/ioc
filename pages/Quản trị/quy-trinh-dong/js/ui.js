/* -----------------------------------------------------------------------
   ui.js — Logic Giao diện và Thao tác DOM cho Quản trị quy trình động.
   Yêu cầu: Nạp js/data.js TRƯỚC file này.
   ----------------------------------------------------------------------- */

(() => {

  const state = { rows: processCatalog, search: '', active: '', scope: '', org: '', version: '', page: 1, pageSize: 10, draft: null, editingId: null, selectedStepId: null, viewOnly: false, zoom: 1.0, panX: 0, panY: 0, isPanning: false, startX: 0, startY: 0 };
  /*Lọc*/
  const elements = {
    list: document.getElementById('processListContainer'), search: document.getElementById('processSearch'), searchButton: document.getElementById('processSearchButton'), filterToggle: document.getElementById('processFilterToggle'), filterPanel: document.getElementById('processFilterPanel'), activeContainer: document.getElementById('filterProcessActiveContainer'), orgs: document.getElementById('processOrgsContainer'), description: document.getElementById('processDescriptionInput'), steps: document.getElementById('processEditorNodeList'), diagram: document.getElementById('processEditorDiagram'), addStep: document.getElementById('addProcessNode'), clone: document.getElementById('cloneProcessEditor'), save: document.querySelector('[form="processEditorForm"]'), cancel: document.getElementById('cancelProcessEditor'), error: document.getElementById('processEditorError'), nodeOverlay: document.getElementById('nodeConfigOverlay'), nodeForm: document.getElementById('processEditorNodeForm'), closeNode: document.getElementById('closeNodeConfig'), saveNode: document.getElementById('saveNodeConfig'),
    filterOrgContainer: document.getElementById('filterProcessOrgContainer'),
    version: document.getElementById('filterProcessVersion'),
    refresh: document.getElementById('processRefreshButton'),
    add: document.getElementById('processAddButton'),
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
  const normalizeStep = (step, index, rows) => ({ id: step.id || `step-${Date.now()}-${index}`, order: index + 1, unitName: step.unitName || step.name || `Bước xử lý ${index + 1}`, status: legacyProcessStatusMap[step.status] || step.status || statusList[Math.min(index, statusList.length - 1)], org: step.org || '', orgs: Array.isArray(step.orgs) ? step.orgs : (step.org ? [step.org] : []), assignees: step.assignees?.length ? step.assignees : [step.accountName || userList[0]], description: step.description || '', actions: step.actions?.length ? step.actions : [{ name: 'Chuyển xử lý', nextNodeId: rows[index + 1]?.id || 'end' }], persisted: true, parentNodeId: index ? rows[index - 1]?.id || null : null });
  state.rows.forEach(process => {
    const sourceNodes = process.nodes || [];
    process.version ||= '1.0'; process.scope ||= scopeList[0]; process.orgs = process.orgs || []; process.createdAt ||= process.updatedAt || nowText(); process.deleted ||= false;
    process.processStatus ||= 'active';
    process.nodes = sourceNodes.map((step, index) => normalizeStep(step, index, sourceNodes));
  });
  const showError = message => { elements.error.textContent = message; elements.error.hidden = !message; };
  const refreshFilterOptions = () => {
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
      } else {
        statusBadge = '<span class="status-badge active-proc">Hoạt động</span>';
      }
      return `<tr><td title="${escapeText(row.name)}">${escapeText(row.name)}</td><td title="${escapeText(row.version)}">${escapeText(row.version)}</td><td title="${escapeText(row.orgs.join(', '))}">${escapeText(row.orgs.join(', '))}</td><td class="center">${statusBadge}</td><td title="${escapeText(row.createdAt)}">${escapeText(row.createdAt)}</td><td class="center"><div class="row-actions"><button class="act-btn act-edit" type="button" data-process-action="edit" data-process-id="${row.id}" title="Sửa"><i class="fa-solid fa-pen"></i></button><button class="act-btn act-del" type="button" data-process-action="delete" data-process-id="${row.id}" title="Xóa"><i class="fa-solid fa-trash"></i></button></div></td></tr>`;
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
    process.nodes.forEach((step, index) => { step.order = index + 1; step.parentNodeId = index ? process.nodes[index - 1].id : null; step.accountName = step.assignees[0] || ''; step.accountId = `account-${index + 1}`; step.contextId = index ? 'department' : 'leader'; });
    process.handlingMode = process.nodes.length > 1 ? 'delegated' : 'direct'; process.modeLabel = process.handlingMode === 'direct' ? 'Trực tiếp' : 'Phân công'; process.assignee = process.nodes[0]?.org || process.orgs[0]; process.steps = process.nodes.map(step => step.unitName); process.updatedAt = process.createdAt;
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
    if (!elements.scopeContainer) return;
    const selectedVal = state.draft ? state.draft.scope : '';
    updateDropdownSummary(elements.scopeContainer, selectedVal ? [selectedVal] : [], false);
  };
  const renderScopeChoices = selected => {
    if (!elements.scopeContainer) return;
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

    showCustomConfirm("Bạn có chắc chắn muốn xóa bước này?", () => {
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
      showNotice('Đã xóa bước xử lý');
    });
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

  const getAssignedOrgs = (step) => {
    if (!state.draft || !state.draft.nodes) return [];
    const assignStep = state.draft.nodes.find(n => n.status === 'Chờ phân công');
    if (assignStep) {
      return assignStep.orgs || [];
    }
    return step ? (step.orgs || []) : [];
  };

  const syncOrgsFromAssignStep = () => {
    if (!state.draft || !state.draft.nodes) return;
    const assignStep = state.draft.nodes.find(n => n.status === 'Chờ phân công');
    if (!assignStep) return;

    const processingNodes = state.draft.nodes.filter(n => n.status === 'Đang xử lý');
    const reportedNodes = state.draft.nodes.filter(n => n.status === 'Đã có báo cáo');

    const newOrgs = assignStep.orgs || [];
    const newOrgsStr = JSON.stringify(newOrgs);
    let isAnyChanged = false;

    processingNodes.forEach(node => {
      const oldOrgsStr = JSON.stringify(node.orgs || []);
      if (oldOrgsStr !== newOrgsStr) {
        node.orgs = [...newOrgs];
        node.org = newOrgs.join(', ');
        node.assignees = newOrgs.map(org => getOrgPersonnel(org).leader);
        node.persisted = true;
        isAnyChanged = true;
      }
    });

    reportedNodes.forEach(node => {
      const oldOrgsStr = JSON.stringify(node.orgs || []);
      if (oldOrgsStr !== newOrgsStr) {
        node.orgs = [...newOrgs];
        node.org = newOrgs.join(', ');
        node.assignees = newOrgs.map(org => getOrgPersonnel(org).leader);
        node.persisted = true;
        isAnyChanged = true;
      }
    });

    if (isAnyChanged) {
      renderSteps();
    }
  };

  const getDirectiveCreator = (directiveId) => {
    const creators = JSON.parse(localStorage.getItem('gialai_directives_creators') || '{}');
    return creators[directiveId] || 'Lãnh đạo Tỉnh';
  };

  const updateStepAssigneeSummary = (step) => {
    const container = elements.nodeForm.querySelector('.process-assignee-multiselect');
    if (!container) return;
    const selectBox = container.querySelector('.select-box');
    if (!selectBox) return;

    const status = step.status;
    let selected = [];
    if (status === 'Chờ phân công') {
      const orgs = step.orgs || [];
      selected = orgs.map(org => getOrgPersonnel(org).leader);
    } else if (status === 'Đang xử lý') {
      const checked = [...container.querySelectorAll('[data-step-assignee]:checked')];
      selected = checked.map(input => input.value);
    } else if (status === 'Đã có báo cáo') {
      const assignedOrgs = getAssignedOrgs(step);
      selected = assignedOrgs.map(org => getOrgPersonnel(org).leader);
    } else if (status === 'Đã kết thúc' || status === 'Chờ phê duyệt' || status === 'Phê duyệt báo cáo') {
      selected = [getDirectiveCreator(state.selectedId)];
    } else {
      selected = step.assignees || [];
    }

    step.assignees = selected;

    const isLocked = (status === 'Chờ phân công' || status === 'Đã có báo cáo' || status === 'Đã kết thúc' || status === 'Chờ phê duyệt' || status === 'Phê duyệt báo cáo');
    const showAsMulti = (status === 'Chờ phân công' || status === 'Đang xử lý' || status === 'Đã có báo cáo');
    updateDropdownSummary(container, selected, showAsMulti);

    if (isLocked) {
      selectBox.style.backgroundColor = '#f1f5f9';
      selectBox.style.cursor = 'not-allowed';
      selectBox.style.opacity = '0.85';
      selectBox.classList.add('disabled-view');
      selectBox.setAttribute('title', selected.join('\n'));
    } else {
      selectBox.style.backgroundColor = '#ffffff';
      selectBox.style.cursor = 'pointer';
      selectBox.style.opacity = '1';
      selectBox.classList.remove('disabled-view');
      selectBox.removeAttribute('title');
    }
  };

  const renderStepAssigneeChoices = step => {
    const container = elements.nodeForm.querySelector('.process-assignee-multiselect');
    if (!container) return;

    const status = step.status;
    const isStepFieldsDisabled = state.viewOnly || state.draft.processStatus === 'active';

    let selectedAssignees = [];
    let isLocked = false;
    let availableAssignees = [];
    let grouped = false;

    if (status === 'Chờ phân công') {
      const orgs = step.orgs || [];
      selectedAssignees = orgs.map(org => getOrgPersonnel(org).leader);
      isLocked = true;
    } else if (status === 'Đang xử lý') {
      const assignedOrgs = getAssignedOrgs(step);
      assignedOrgs.forEach(org => {
        const personnel = getOrgPersonnel(org);
        personnel.staff.forEach(name => {
          availableAssignees.push({ name, org });
        });
      });
      selectedAssignees = step.assignees || [];
      isLocked = false;
      grouped = true;
    } else if (status === 'Đã có báo cáo') {
      const assignedOrgs = getAssignedOrgs(step);
      selectedAssignees = assignedOrgs.map(org => getOrgPersonnel(org).leader);
      isLocked = true;
    } else if (status === 'Đã kết thúc' || status === 'Chờ phê duyệt' || status === 'Phê duyệt báo cáo') {
      selectedAssignees = [getDirectiveCreator(state.selectedId)];
      isLocked = true;
    } else {
      selectedAssignees = step.assignees || [];
      isLocked = isStepFieldsDisabled;
    }

    step.assignees = selectedAssignees;

    let menuContent = '';
    if (grouped) {
      const orgGroups = {};
      availableAssignees.forEach(item => {
        if (!orgGroups[item.org]) orgGroups[item.org] = [];
        orgGroups[item.org].push(item.name);
      });

      menuContent = `
        <label class="dropdown-item select-all-item">
          <input type="checkbox" id="selectAllAssignees" ${availableAssignees.length > 0 && availableAssignees.every(item => selectedAssignees.includes(item.name)) ? 'checked' : ''} ${isStepFieldsDisabled ? 'disabled' : ''}>
          <span style="font-weight: bold; color: var(--admin-text);">Chọn tất cả</span>
        </label>
      `;

      for (const org in orgGroups) {
        menuContent += `
          <div class="dropdown-group-header" style="font-weight: bold; padding: 6px 12px; background: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; border-top: 1px solid #e2e8f0;">
            ${escapeText(org)}
          </div>
        `;
        orgGroups[org].forEach(name => {
          menuContent += `
            <label class="dropdown-item" data-search-text="${escapeText(org)} ${escapeText(name)}">
              <input type="checkbox" data-step-assignee value="${escapeText(name)}" ${selectedAssignees.includes(name) ? 'checked' : ''} ${isStepFieldsDisabled ? 'disabled' : ''}>
              <span>${escapeText(name)}</span>
            </label>
          `;
        });
      }
    } else {
      menuContent = selectedAssignees.map(user => `
        <div class="dropdown-item select-only-item">
          <span>${escapeText(user)}</span>
        </div>
      `).join('');
    }

    container.innerHTML = `
      <div class="select-box ${isLocked ? 'disabled-view' : ''}" 
           style="${isLocked ? 'background-color: #f1f5f9; cursor: not-allowed; opacity: 0.85;' : ''}"
           title="${isLocked ? escapeText(selectedAssignees.join('\n')) : ''}">
        <span class="placeholder" style="${(isLocked && selectedAssignees.length === 0) ? 'color: transparent;' : ''}">Chọn người xử lý...</span>
        ${!isLocked ? '<input type="text" placeholder="Gõ để tìm kiếm nhanh..." class="dropdown-search-input" style="display: none; width: 100%; border: none; outline: none; background: transparent; font-size: 13px; font-weight: normal; color: var(--admin-text); padding: 0;">' : ''}
        <svg class="arrow-icon" viewBox="0 0 24 24" style="${isLocked ? 'display: none;' : ''}"><path d="M7 10l5 5 5-5z"/></svg>
      </div>
      <div class="dropdown-menu" style="${isLocked ? 'display: none !important;' : ''}">
        ${menuContent}
      </div>
    `;

    updateStepAssigneeSummary(step);

    if (!isLocked) {
      const searchInput = container.querySelector('.dropdown-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', () => {
          const query = searchInput.value.toLowerCase().trim();
          const items = container.querySelectorAll('.dropdown-menu .dropdown-item:not(.select-all-item)');
          items.forEach(item => {
            const searchText = item.dataset.searchText ? item.dataset.searchText.toLowerCase() : item.textContent.toLowerCase();
            item.style.display = searchText.includes(query) ? 'flex' : 'none';
          });
          const groups = container.querySelectorAll('.dropdown-group-header');
          groups.forEach(group => {
            let next = group.nextElementSibling;
            let hasVisible = false;
            while (next && !next.classList.contains('dropdown-group-header')) {
              if (next.style.display !== 'none') {
                hasVisible = true;
              }
              next = next.nextElementSibling;
            }
            group.style.display = hasVisible ? 'block' : 'none';
          });
        });
      }
    }
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
    const status = step.status;
    if (status === 'Chờ phân công') {
      const orgs = step.orgs || [];
      step.assignees = orgs.map(org => getOrgPersonnel(org).leader);
    } else if (status === 'Đang xử lý') {
      const assignedOrgs = getAssignedOrgs(step);
      const validStaff = new Set();
      assignedOrgs.forEach(org => {
        getOrgPersonnel(org).staff.forEach(name => validStaff.add(name));
      });
      step.assignees = (step.assignees || []).filter(name => validStaff.has(name));
    } else if (status === 'Đã có báo cáo') {
      const assignedOrgs = getAssignedOrgs(step);
      step.assignees = assignedOrgs.map(org => getOrgPersonnel(org).leader);
    } else if (status === 'Đã kết thúc' || status === 'Chờ phê duyệt' || status === 'Phê duyệt báo cáo') {
      step.assignees = [getDirectiveCreator(state.selectedId)];
    }
  };

  const updateStepOrgSummary = (step) => {
    const container = elements.nodeForm.querySelector('.process-step-org-dropdown');
    if (!container) return;
    const selectBox = container.querySelector('.select-box');
    if (!selectBox) return;

    const status = step.status;
    let selected = [];
    if (status === 'Chờ phân công') {
      const checkedCheckboxes = [...container.querySelectorAll('.dropdown-menu input.org-item-checkbox:checked')];
      selected = checkedCheckboxes.map(input => input.value);
    } else if (status === 'Đang xử lý' || status === 'Đã có báo cáo') {
      selected = getAssignedOrgs(step);
    } else if (status === 'Đã kết thúc' || status === 'Chờ phê duyệt' || status === 'Phê duyệt báo cáo') {
      selected = ['Tỉnh Gia Lai'];
    } else {
      selected = step.orgs || [];
    }

    step.orgs = selected;
    step.org = selected.join(', ');
    if (status === 'Chờ phân công') {
      syncOrgsFromAssignStep();
    }

    const isLocked = (status === 'Đang xử lý' || status === 'Đã có báo cáo' || status === 'Đã kết thúc' || status === 'Chờ phê duyệt' || status === 'Phê duyệt báo cáo');
    const showOrgsAsMulti = (status === 'Chờ phân công' || status === 'Đang xử lý' || status === 'Đã có báo cáo');
    updateDropdownSummary(container, selected, showOrgsAsMulti);

    if (isLocked) {
      selectBox.style.backgroundColor = '#f1f5f9';
      selectBox.style.cursor = 'not-allowed';
      selectBox.style.opacity = '0.85';
      selectBox.classList.add('disabled-view');
      selectBox.setAttribute('title', selected.join('\n'));
    } else {
      const isStepFieldsDisabled = state.viewOnly || state.draft.processStatus === 'active';
      selectBox.style.backgroundColor = isStepFieldsDisabled ? '#f1f5f9' : '#ffffff';
      selectBox.style.cursor = isStepFieldsDisabled ? 'not-allowed' : 'pointer';
      selectBox.style.opacity = isStepFieldsDisabled ? '0.8' : '1';
      selectBox.classList.remove('disabled-view');
      selectBox.removeAttribute('title');
    }
  };

  const renderStepOrgChoices = step => {
    const container = elements.nodeForm.querySelector('.process-step-org-dropdown');
    if (!container) return;

    const status = step.status;
    const isStepFieldsDisabled = state.viewOnly || state.draft.processStatus === 'active';

    let selectedOrgs = [];
    let isLocked = false;

    if (status === 'Chờ phân công') {
      selectedOrgs = step.orgs || [];
      isLocked = false;
    } else if (status === 'Đang xử lý' || status === 'Đã có báo cáo') {
      selectedOrgs = getAssignedOrgs(step);
      isLocked = true;
    } else if (status === 'Đã kết thúc' || status === 'Chờ phê duyệt' || status === 'Phê duyệt báo cáo') {
      selectedOrgs = ['Tỉnh Gia Lai'];
      isLocked = true;
    } else {
      selectedOrgs = step.orgs || [];
      isLocked = isStepFieldsDisabled;
    }

    step.orgs = selectedOrgs;
    step.org = selectedOrgs.join(', ');



    const isAllSelected = orgList.length > 0 && orgList.every(org => selectedOrgs.includes(org));

    let menuContent = '';
    if (status === 'Chờ phân công') {
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
      menuContent = selectedOrgs.map(org => `
        <div class="dropdown-item select-only-item">
          <span>${escapeText(org)}</span>
        </div>
      `).join('');
    }

    container.innerHTML = `
      <div class="select-box ${isLocked ? 'disabled-view' : ''}" 
           style="${isLocked ? 'background-color: #f1f5f9; cursor: not-allowed; opacity: 0.85;' : ''}"
           title="${isLocked ? escapeText(selectedOrgs.join('\n')) : ''}">
        <span class="placeholder" style="${(isLocked && selectedOrgs.length === 0) ? 'color: transparent;' : ''}">Chọn cơ quan...</span>
        ${!isLocked ? '<input type="text" placeholder="Gõ để tìm kiếm nhanh..." class="dropdown-search-input" style="display: none; width: 100%; border: none; outline: none; background: transparent; font-size: 13px; font-weight: normal; color: var(--admin-text); padding: 0;">' : ''}
        <svg class="arrow-icon" viewBox="0 0 24 24" style="${isLocked ? 'display: none;' : ''}"><path d="M7 10l5 5 5-5z"/></svg>
      </div>
      <div class="dropdown-menu" style="${isLocked ? 'display: none !important;' : ''}">
        ${menuContent}
      </div>
    `;

    updateStepOrgSummary(step);
    if (!isLocked) {
      bindAutoComplete(container);
    }
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
    const status = step.status;
    const isAssigneeLocked = (status === 'Chờ phân công' || status === 'Đã có báo cáo' || status === 'Đã kết thúc' || status === 'Chờ phê duyệt' || status === 'Phê duyệt báo cáo');
    const assignees = isAssigneeLocked
      ? (step.assignees || [])
      : [...elements.nodeForm.querySelectorAll('[data-step-assignee]:checked')].map(input => input.value);
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
    if (step.status === 'Chờ phân công') {
      syncOrgsFromAssignStep();
    }
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
    showNotice(isPublish ? 'Đã lưu quy trình' : 'Đã lưu quy trình');
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
  if (elements.version) {
    elements.version.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); applyProcessFilters(); } });
  }
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
        showCustomAlert("Quy trình đang hoạt động, không được phép xóa!");
      } else {
        showCustomConfirm("Bạn có chắc chắn muốn xóa quy trình này?", () => {
          row.deleted = true;
          row.active = false;
          renderList();
          showNotice('Đã xóa quy trình');
        });
      }
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.process-more')) closeMenus();
    if (!event.target.closest('#processOrgsContainer')) { elements.orgs.classList.remove('open'); }
    if (elements.scopeContainer && !event.target.closest('#processScopeContainer')) { elements.scopeContainer.classList.remove('open'); }
    if (!event.target.closest('#filterProcessOrgContainer')) { elements.filterOrgContainer.classList.remove('open'); }
    if (elements.filterScopeContainer && !event.target.closest('#filterProcessScopeContainer')) { elements.filterScopeContainer.classList.remove('open'); }
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

  if (elements.scopeContainer) {
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
  }

  // Filter Nhóm giám sát
  if (elements.filterScopeContainer) {
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
  }

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
        syncOrgsFromAssignStep();
        if (state.selectedStepId === currentActionsStepId && !elements.nodeOverlay.hidden) {
          renderStepForm(step);
        }
        renderSteps();
        showNotice('Đã lưu bước xử lý');
      }
      elements.actionsOverlay.hidden = true;
    });
  }

  renderList();
})();

