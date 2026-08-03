/* ============================================================
   UI.JS — Logic Phân quyền Quản lý chỉ đạo cho nhóm quyền (Quản trị hệ thống)
   ============================================================ */

let currentRoleGroups = [];
let filteredRoleGroups = [];
let currentPage = 1;
let itemsPerPage = 10;

function initQuanLyChiDaoPerm() {
  if (typeof directiveRoleGroupsData !== 'undefined') {
    currentRoleGroups = JSON.parse(JSON.stringify(directiveRoleGroupsData));
  }
  filteredRoleGroups = [...currentRoleGroups];

  renderRoleGroupTable();
  initSearchEvent();
  initSaveButtonEvent();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuanLyChiDaoPerm);
} else {
  initQuanLyChiDaoPerm();
}

// 1. RENDER BẢNG PHÂN QUYỀN CHỈ ĐẠO
function renderRoleGroupTable() {
  const tbody = document.getElementById('directivePermTableBody');
  const pageRangeInfo = document.getElementById('pageRangeInfo');
  if (!tbody) return;

  const total = filteredRoleGroups.length;
  const start = (currentPage - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, total);
  const pageItems = filteredRoleGroups.slice(start, end);

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center empty-table-cell">Không tìm thấy nhóm quyền nào.</td></tr>`;
  } else {
    tbody.innerHTML = pageItems.map((role, idx) => `
      <tr data-id="${role.id}">
        <td class="text-center">${start + idx + 1}</td>
        <td class="role-code-text">${role.code}</td>
        <td class="role-name-text">${role.name}</td>
        <td class="text-center">
          <label class="switch-toggle">
            <input type="checkbox" class="toggle-view" data-id="${role.id}" ${role.canView ? 'checked' : ''}>
            <span class="switch-slider"></span>
          </label>
        </td>
        <td class="text-center">
          <label class="switch-toggle">
            <input type="checkbox" class="toggle-edit" data-id="${role.id}" ${role.canEdit ? 'checked' : ''}>
            <span class="switch-slider"></span>
          </label>
        </td>
      </tr>
    `).join('');
  }

  if (pageRangeInfo) {
    pageRangeInfo.textContent = total === 0 ? '0/0' : `${start + 1}-${end}/${total}`;
  }

  renderPaginationButtons(total);
  attachToggleEvents();
}

function renderPaginationButtons(total) {
  const container = document.getElementById('paginationContainer');
  if (!container) return;

  const totalPages = Math.ceil(total / itemsPerPage) || 1;
  let buttonsHtml = `
    <button class="pg-btn" id="pgPrev" ${currentPage === 1 ? 'disabled' : ''}>
      <i class="fa-solid fa-chevron-left"></i>
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    buttonsHtml += `<button class="pg-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }

  buttonsHtml += `
    <button class="pg-btn" id="pgNext" ${currentPage === totalPages ? 'disabled' : ''}>
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  `;

  container.innerHTML = buttonsHtml;

  container.querySelectorAll('.pg-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.getAttribute('data-page'), 10);
      renderRoleGroupTable();
    });
  });

  const prevBtn = document.getElementById('pgPrev');
  const nextBtn = document.getElementById('pgNext');
  if (prevBtn) prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderRoleGroupTable(); } });
  if (nextBtn) nextBtn.addEventListener('click', () => { if (currentPage < totalPages) { currentPage++; renderRoleGroupTable(); } });
}

// 2. SỰ KIỆN THAY ĐỔI CÔNG TẮC TOGGLE
function attachToggleEvents() {
  const tbody = document.getElementById('directivePermTableBody');
  if (!tbody) return;

  tbody.querySelectorAll('.toggle-view').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.getAttribute('data-id');
      const target = currentRoleGroups.find(r => r.id === id);
      if (target) target.canView = cb.checked;
    });
  });

  tbody.querySelectorAll('.toggle-edit').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.getAttribute('data-id');
      const target = currentRoleGroups.find(r => r.id === id);
      if (target) target.canEdit = cb.checked;
    });
  });
}

// 3. TÌM KIẾM NHÓM QUYỀN
function initSearchEvent() {
  const searchInput = document.getElementById('searchRoleGroupInput');
  const btnSearch = document.getElementById('btnRoleGroupSearch');
  const btnReset = document.getElementById('btnRoleGroupReset');
  const perPageSelect = document.getElementById('perPageSelect');

  const doSearch = () => {
    const kw = searchInput ? searchInput.value.toLowerCase().trim() : '';
    filteredRoleGroups = currentRoleGroups.filter(r => r.code.toLowerCase().includes(kw) || r.name.toLowerCase().includes(kw));
    currentPage = 1;
    renderRoleGroupTable();
  };

  if (searchInput) {
    searchInput.addEventListener('input', doSearch);
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') doSearch();
    });
  }

  if (btnSearch) {
    btnSearch.addEventListener('click', doSearch);
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      filteredRoleGroups = [...currentRoleGroups];
      currentPage = 1;
      renderRoleGroupTable();
    });
  }

  if (perPageSelect) {
    perPageSelect.addEventListener('change', () => {
      itemsPerPage = parseInt(perPageSelect.value, 10);
      currentPage = 1;
      renderRoleGroupTable();
    });
  }
}

// 4. LƯU CẤU HÌNH PHÂN QUYỀN
function initSaveButtonEvent() {
  const btnSave = document.getElementById('btnSaveDirectivePerm');

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      showCustomConfirm('Xác nhận phân quyền', 'Bạn có chắc chắn muốn lưu phân quyền?', () => {
        showToastNotice('Lưu phân quyền chỉ đạo thành công!');
      });
    });
  }
}

// HELPER: POPUP CONFIRM & TOAST NOTIFICATION
function showToastNotice(message = 'Thao tác đã hoàn tất thành công.') {
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toast.classList.remove('error', 'danger');
  toast.classList.add('success');
  if (toastTitle) toastTitle.textContent = 'Thành công';
  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function showCustomConfirm(title, message, onConfirm) {
  const overlay = document.getElementById('confirmDialogOverlay');
  const titleEl = document.getElementById('confirmDialogTitle');
  const msgEl = document.getElementById('confirmDialogMessage');
  const btnCancel = document.getElementById('confirmDialogCancel');
  const btnOk = document.getElementById('confirmDialogOk');

  if (!overlay || !msgEl || !btnCancel || !btnOk) {
    if (window.confirm(message)) onConfirm();
    return;
  }

  if (titleEl) titleEl.textContent = title || 'Xác nhận';
  msgEl.textContent = message;
  overlay.removeAttribute('hidden');

  const newBtnOk = btnOk.cloneNode(true);
  const newBtnCancel = btnCancel.cloneNode(true);
  btnOk.parentNode.replaceChild(newBtnOk, btnOk);
  btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

  newBtnOk.addEventListener('click', () => {
    overlay.setAttribute('hidden', '');
    onConfirm();
  });

  newBtnCancel.addEventListener('click', () => {
    overlay.setAttribute('hidden', '');
  });
}
