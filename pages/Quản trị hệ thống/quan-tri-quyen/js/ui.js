/* ============================================================
   UI.JS — Logic Giao diện Trang Quản trị quyền (Quản trị hệ thống)
   ============================================================ */

let selectedRoleId = null;
let currentModalMode = 'add'; // 'add' | 'edit' | 'view'
let currentFilterStatus = 'all';

function initQuanTriQuyen() {
  renderPermissionTree();
  renderRoleTable(roleGroupsData);
  initCustomDropdown();
  initActionPopupMenu();
  initModalEvents();
  initRealtimeValidationClearing();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuanTriQuyen);
} else {
  initQuanTriQuyen();
}

// HELPER: POPUP THÔNG BÁO THÀNH CÔNG (TOAST NOTIFICATION)
function showToastNotice(message = 'Thao tác đã hoàn tất thành công.') {
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toast.classList.remove('error', 'danger', 'failure');
  toast.classList.add('success');
  if (toastTitle) toastTitle.textContent = 'Thành công';
  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// HELPER: POPUP THÔNG BÁO THẤT BẠI (ERROR TOAST NOTIFICATION)
function showToastError(message = 'Thao tác thất bại.', title = 'Thất bại') {
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toast.classList.remove('success');
  toast.classList.add('error');
  if (toastTitle) toastTitle.textContent = title;
  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// HELPER: POPUP XÁC NHẬN (CONFIRM DIALOG)
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

// 1. RENDER BẢNG DỮ LIỆU NHÓM QUYỀN
function renderRoleTable(data) {
  const tbody = document.getElementById('roleTableBody');
  const pageRangeText = document.getElementById('pageRangeText');
  if (!tbody) return;

  const filteredData = data.filter(item => {
    if (currentFilterStatus === 'active') return item.active === true;
    if (currentFilterStatus === 'inactive') return item.active === false;
    return true;
  });

  if (filteredData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-row-cell">Không tìm thấy nhóm quyền nào phù hợp.</td>
      </tr>
    `;
    if (pageRangeText) pageRangeText.textContent = '0-0/0';
    return;
  }

  tbody.innerHTML = filteredData.map(item => `
    <tr>
      <td class="col-code">${item.code}</td>
      <td class="col-name">${item.name}</td>
      <td class="col-desc">${item.description || '—'}</td>
      <td class="col-status center">
        <span class="${item.active ? 'chip-status-active' : 'chip-status-inactive'}">
          ${item.active ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      </td>
      <td class="text-right">
        <button class="btn-action-more" data-id="${item.id}" title="Tùy chọn"><i class="fa-solid fa-ellipsis-vertical"></i></button>
      </td>
    </tr>
  `).join('');

  if (pageRangeText) {
    pageRangeText.textContent = `1-${filteredData.length}/${filteredData.length}`;
  }

  attachActionMoreEvents();
}

// Gắn sự kiện click nút 3 chấm để mở Popup Xử lý (Xem / Sửa / Xóa)
function attachActionMoreEvents() {
  const moreBtns = document.querySelectorAll('.btn-action-more');
  const popupMenu = document.getElementById('actionPopupMenu');

  moreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedRoleId = btn.getAttribute('data-id');

      if (!popupMenu) return;

      const rect = btn.getBoundingClientRect();
      const popupWidth = 120;

      popupMenu.style.top = `${rect.bottom + 4}px`;
      popupMenu.style.left = `${rect.right - popupWidth}px`;
      popupMenu.removeAttribute('hidden');
    });
  });
}

// Khởi tạo các sự kiện cho Popup Action Menu (Xem / Sửa / Xóa)
function initActionPopupMenu() {
  const popupMenu = document.getElementById('actionPopupMenu');
  const actionView = document.getElementById('actionItemView');
  const actionEdit = document.getElementById('actionItemEdit');
  const actionDelete = document.getElementById('actionItemDelete');

  if (!popupMenu) return;

  if (actionView) {
    actionView.addEventListener('click', (e) => {
      e.stopPropagation();
      popupMenu.setAttribute('hidden', '');
      openRoleModal('view', selectedRoleId);
    });
  }

  if (actionEdit) {
    actionEdit.addEventListener('click', (e) => {
      e.stopPropagation();
      popupMenu.setAttribute('hidden', '');
      openRoleModal('edit', selectedRoleId);
    });
  }

  if (actionDelete) {
    actionDelete.addEventListener('click', (e) => {
      e.stopPropagation();
      popupMenu.setAttribute('hidden', '');
      if (typeof roleGroupsData === 'undefined') return;
      const role = roleGroupsData.find(r => String(r.id) === String(selectedRoleId));
      if (role) {
        showCustomConfirm('Xác nhận', 'Bạn có chắc chắn muốn xóa không?', () => {
          const index = roleGroupsData.findIndex(r => String(r.id) === String(selectedRoleId));
          if (index !== -1) {
            roleGroupsData.splice(index, 1);
            handleSearch();
            showToastNotice('Xóa thành công!');
          }
        });
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (popupMenu && !popupMenu.contains(e.target)) {
      popupMenu.setAttribute('hidden', '');
    }
  });

  window.addEventListener('scroll', () => {
    if (popupMenu) popupMenu.setAttribute('hidden', '');
  }, true);
}

// RESET VÀ XÓA TẤT CẢ LỖI VALIDATION FORM
function resetFormErrors() {
  const codeInput = document.getElementById('roleCodeInput');
  const nameInput = document.getElementById('roleNameInput');
  const treeContainer = document.getElementById('permTreeContainer');

  const codeError = document.getElementById('roleCodeError');
  const nameError = document.getElementById('roleNameError');
  const permError = document.getElementById('rolePermError');

  if (codeInput) codeInput.classList.remove('is-invalid');
  if (nameInput) nameInput.classList.remove('is-invalid');
  if (treeContainer) treeContainer.classList.remove('is-invalid');

  if (codeError) codeError.setAttribute('hidden', '');
  if (nameError) nameError.setAttribute('hidden', '');
  if (permError) permError.setAttribute('hidden', '');
}

// HIỂN THỊ VIỀN ĐỎ #E53E3E NỀN TRẮNG TINH #FFFFFF VÀ DÒNG LỖI MÀU ĐỎ KHÔNG PHÌNH FORM
function showFieldError(inputId, errorId) {
  const el = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  if (el) el.classList.add('is-invalid');
  if (err) err.removeAttribute('hidden');
}

// LẮNG NGHE TỰ ĐỘNG XÓA LỖI REAL-TIME KHI NGƯỜI DÙNG NHẬP / TICK
function initRealtimeValidationClearing() {
  const codeInput = document.getElementById('roleCodeInput');
  const nameInput = document.getElementById('roleNameInput');
  const treeContainer = document.getElementById('permTreeContainer');

  if (codeInput) {
    codeInput.addEventListener('input', () => {
      if (codeInput.value.trim() !== '') {
        codeInput.classList.remove('is-invalid');
        const err = document.getElementById('roleCodeError');
        if (err) err.setAttribute('hidden', '');
      }
    });
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim() !== '') {
        nameInput.classList.remove('is-invalid');
        const err = document.getElementById('roleNameError');
        if (err) err.setAttribute('hidden', '');
      }
    });
  }

  if (treeContainer) {
    treeContainer.addEventListener('change', () => {
      const checkedInputs = document.querySelectorAll('.tree-node-checkbox:checked');
      if (checkedInputs.length > 0) {
        treeContainer.classList.remove('is-invalid');
        const err = document.getElementById('rolePermError');
        if (err) err.setAttribute('hidden', '');
      }
    });
  }
}

// MỞ MODAL FORM (CHẾ ĐỘ: THÊM MỚI / SỬA / XEM)
function openRoleModal(mode, roleId = null) {
  currentModalMode = mode;
  selectedRoleId = roleId;
  resetFormErrors();

  const overlay = document.getElementById('roleModalOverlay');
  const modalBox = document.getElementById('roleModalBox');
  const modalTitle = document.getElementById('modalTitleText');
  const codeInput = document.getElementById('roleCodeInput');
  const nameInput = document.getElementById('roleNameInput');
  const descInput = document.getElementById('roleDescInput');
  const activeInput = document.getElementById('roleActiveInput');
  const btnSubmit = document.getElementById('btnModalSubmit');

  if (!overlay || !modalBox) return;

  modalBox.classList.remove('mode-view');

  if (mode === 'add') {
    modalTitle.textContent = 'Thêm mới nhóm quyền';
    if (codeInput) { codeInput.value = ''; codeInput.disabled = false; }
    if (nameInput) { nameInput.value = ''; nameInput.disabled = false; }
    if (descInput) { descInput.value = ''; descInput.disabled = false; }
    if (activeInput) { activeInput.checked = true; activeInput.disabled = false; }
    if (btnSubmit) { btnSubmit.removeAttribute('hidden'); btnSubmit.textContent = 'Lưu'; }
    uncheckAllTreePermissions();
  } else {
    if (typeof roleGroupsData === 'undefined') return;
    const role = roleGroupsData.find(r => String(r.id) === String(roleId));
    if (!role) return;

    if (codeInput) codeInput.value = role.code || '';
    if (nameInput) nameInput.value = role.name || '';
    if (descInput) descInput.value = role.description || '';
    if (activeInput) activeInput.checked = !!role.active;

    setTreePermissions(role.permissions || []);

    if (mode === 'edit') {
      modalTitle.textContent = 'Chỉnh sửa nhóm quyền';
      if (codeInput) codeInput.disabled = false;
      if (nameInput) nameInput.disabled = false;
      if (descInput) descInput.disabled = false;
      if (activeInput) activeInput.disabled = false;
      if (btnSubmit) { btnSubmit.removeAttribute('hidden'); btnSubmit.textContent = 'Lưu'; }
      enableTreeInputs(true);
    } else if (mode === 'view') {
      modalTitle.textContent = 'Chi tiết nhóm quyền';
      modalBox.classList.add('mode-view');
      if (codeInput) codeInput.disabled = true;
      if (nameInput) nameInput.disabled = true;
      if (descInput) descInput.disabled = true;
      if (activeInput) activeInput.disabled = true;
      if (btnSubmit) btnSubmit.setAttribute('hidden', '');
      enableTreeInputs(false);
    }
  }

  overlay.removeAttribute('hidden');
}

// ĐÓNG MODAL FORM
function closeRoleModal() {
  const overlay = document.getElementById('roleModalOverlay');
  if (overlay) overlay.setAttribute('hidden', '');
  resetFormErrors();
}

// LƯU MODAL FORM (CÓ VALIDATION & POPUP XÁC NHẬN CẬP NHẬT/THÊM MỚI KÈM TOAST THÀNH CÔNG)
function handleSaveRoleModal() {
  if (currentModalMode === 'view') {
    closeRoleModal();
    return;
  }

  const codeInput = document.getElementById('roleCodeInput');
  const nameInput = document.getElementById('roleNameInput');
  const descInput = document.getElementById('roleDescInput');
  const activeInput = document.getElementById('roleActiveInput');

  const code = (codeInput ? codeInput.value : '').trim();
  const name = (nameInput ? nameInput.value : '').trim();
  const description = (descInput ? descInput.value : '').trim();
  const active = activeInput ? activeInput.checked : true;

  const checkedTreeInputs = document.querySelectorAll('.tree-node-checkbox:checked');
  const selectedPermissions = Array.from(checkedTreeInputs).map(cb => cb.id);

  let hasError = false;
  resetFormErrors();

  if (!code) {
    showFieldError('roleCodeInput', 'roleCodeError');
    hasError = true;
  }

  if (!name) {
    showFieldError('roleNameInput', 'roleNameError');
    hasError = true;
  }

  if (selectedPermissions.length === 0) {
    showFieldError('permTreeContainer', 'rolePermError');
    hasError = true;
  }

  if (hasError) return;

  if (typeof roleGroupsData !== 'undefined') {
    if (currentModalMode === 'add') {
      showCustomConfirm('Xác nhận', 'Bạn có chắc chắn muốn thêm mới không?', () => {
        const newId = roleGroupsData.length > 0 ? Math.max(...roleGroupsData.map(r => r.id)) + 1 : 1;
        roleGroupsData.push({
          id: newId,
          code,
          name,
          description,
          active,
          permissions: selectedPermissions
        });
        closeRoleModal();
        handleSearch();
        showToastNotice('Thêm mới thành công!');
      });
    } else if (currentModalMode === 'edit') {
      showCustomConfirm('Xác nhận', 'Bạn có chắc chắn muốn cập nhật không?', () => {
        const role = roleGroupsData.find(r => String(r.id) === String(selectedRoleId));
        if (role) {
          role.code = code;
          role.name = name;
          role.description = description;
          role.active = active;
          role.permissions = selectedPermissions;
        }
        closeRoleModal();
        handleSearch();
        showToastNotice('Cập nhật thành công!');
      });
    }
  }
}

// Xử lý đóng / mở (expand / collapse) của icon mũi tên ở danh sách phân quyền
function initTreeCarets() {
  const carets = document.querySelectorAll('.tree-caret');
  carets.forEach(caret => {
    caret.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentGroup = caret.closest('.tree-group, .tree-sub-group');
      if (parentGroup) {
        parentGroup.classList.toggle('collapsed');
      }
    });
  });
}

// Xử lý tìm kiếm và lọc dữ liệu
function handleSearch() {
  const searchInput = document.getElementById('searchRoleInput');
  const keyword = (searchInput ? searchInput.value : '').toLowerCase().trim();

  if (typeof roleGroupsData === 'undefined') return;

  const result = roleGroupsData.filter(item => {
    const matchCode = item.code ? item.code.toLowerCase().includes(keyword) : false;
    const matchName = item.name ? item.name.toLowerCase().includes(keyword) : false;
    const matchDesc = item.description ? item.description.toLowerCase().includes(keyword) : false;
    return matchCode || matchName || matchDesc;
  });

  renderRoleTable(result);
}

// BẬT / TẮT TẤT CẢ INPUTS TRONG CÂY PHÂN QUYỀN
function enableTreeInputs(enabled) {
  const treeInputs = document.querySelectorAll('.tree-node-checkbox');
  treeInputs.forEach(cb => {
    cb.disabled = !enabled;
  });
}

// BỎ TICK TẤT CẢ QUYỀN TRONG CÂY
function uncheckAllTreePermissions() {
  const treeInputs = document.querySelectorAll('.tree-node-checkbox');
  treeInputs.forEach(cb => {
    cb.checked = false;
    cb.indeterminate = false;
    cb.disabled = false;
  });
}

// GÁN TRẠNG THÁI TICK QUYỀN CHO CÂY PHÂN QUYỀN VÀ ĐỒNG BỘ NÓT CHA ĐỆ QUY
function setTreePermissions(permissionIds) {
  uncheckAllTreePermissions();
  const permSet = new Set(permissionIds);

  const treeInputs = document.querySelectorAll('.tree-node-checkbox');
  treeInputs.forEach(cb => {
    if (permSet.has(cb.id)) {
      cb.checked = true;
    }
  });

  updateAllParentCheckboxes();
}

// ĐỆ QUY ĐỒNG BỘ NÓT CHA KHI NÓT CON THAY ĐỔI TRẠNG THÁI
function updateAllParentCheckboxes() {
  const container = document.getElementById('permTreeContainer');
  if (!container) return;

  const subGroups = container.querySelectorAll('.tree-sub-group');
  subGroups.forEach(subGroup => {
    const parentCb = subGroup.querySelector(':scope > .tree-group-header .tree-node-checkbox');
    const childCbs = subGroup.querySelectorAll('.nested-sub-line .tree-node-checkbox');
    if (parentCb && childCbs.length > 0) {
      updateSingleParentCheckbox(parentCb, childCbs);
    }
  });

  const rootGroups = container.querySelectorAll('.tree-group');
  rootGroups.forEach(rootGroup => {
    const parentCb = rootGroup.querySelector(':scope > .tree-group-header .tree-node-checkbox');
    const childCbs = rootGroup.querySelectorAll('.tree-sub-list-line .tree-node-checkbox');
    if (parentCb && childCbs.length > 0) {
      updateSingleParentCheckbox(parentCb, childCbs);
    }
  });
}

function updateSingleParentCheckbox(parentCb, childCbs) {
  let checkedCount = 0;
  childCbs.forEach(cb => {
    if (cb.checked) checkedCount++;
  });

  if (checkedCount === 0) {
    parentCb.checked = false;
    parentCb.indeterminate = false;
  } else {
    parentCb.checked = true;
    parentCb.indeterminate = false;
  }
}

function renderTypeBadge(type) {
  return '';
}

// 2. KHỞI TẠO CÂY PHÂN QUYỀN ĐỆ QUY TỪ DATA.JS
function renderPermissionTree() {
  const container = document.getElementById('permTreeContainer');
  if (!container || typeof permissionTreeData === 'undefined') return;

  container.innerHTML = permissionTreeData.map(group => `
    <div class="tree-group" data-id="${group.id}">
      <div class="tree-group-header">
        <label class="tree-checkbox-label">
          <input type="checkbox" class="tree-checkbox tree-node-checkbox" id="${group.id}">
          <span class="tree-group-title text-blue">${group.name || group.title}${renderTypeBadge(group.type)}</span>
        </label>
        ${group.children && group.children.length > 0 ? '<i class="fa-solid fa-chevron-down tree-caret"></i>' : ''}
      </div>
      ${group.children && group.children.length > 0 ? `
        <div class="tree-sub-list-line">
          ${group.children.map(sub => `
            <div class="tree-sub-group" data-id="${sub.id}">
              <div class="tree-group-header sub-header">
                <label class="tree-checkbox-label">
                  <input type="checkbox" class="tree-checkbox tree-node-checkbox" id="${sub.id}">
                  <span class="tree-sub-group-title">${sub.name || sub.title}${renderTypeBadge(sub.type)}</span>
                </label>
                ${sub.children && sub.children.length > 0 ? '<i class="fa-solid fa-chevron-down tree-caret"></i>' : ''}
              </div>
              ${sub.children && sub.children.length > 0 ? `
                <div class="tree-sub-list-line nested-sub-line">
                  ${sub.children.map(child => `
                    <div class="tree-sub-item-row" data-id="${child.id}">
                      <label class="tree-checkbox-label">
                        <input type="checkbox" class="tree-checkbox tree-node-checkbox" id="${child.id}">
                        <span>${child.name || child.title}${renderTypeBadge(child.type)}</span>
                      </label>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');

  attachTreeCheckboxEvents();
  initTreeCarets();
}

// ĐỒNG BỘ CHECKBOX ĐỆ QUY (CHA -> CON & CON -> CHA)
function attachTreeCheckboxEvents() {
  const container = document.getElementById('permTreeContainer');
  if (!container) return;

  container.addEventListener('change', (e) => {
    if (e.target && e.target.classList.contains('tree-node-checkbox')) {
      const checkbox = e.target;
      const isChecked = checkbox.checked;

      const currentHeader = checkbox.closest('.tree-group-header');
      if (currentHeader) {
        const currentGroup = currentHeader.parentElement;
        const directSubList = currentGroup ? currentGroup.querySelector(':scope > .tree-sub-list-line') : null;
        if (directSubList) {
          const childCheckboxes = directSubList.querySelectorAll('.tree-node-checkbox');
          childCheckboxes.forEach(childCb => {
            childCb.checked = isChecked;
            childCb.indeterminate = false;
          });
        }
      }

      updateAllParentCheckboxes();
    }
  });
}

// 3. KHỞI TẠO CUSTOM DROPDOWN BỘ LỌC MỞ RỘNG
function initCustomDropdown() {
  const trigger = document.getElementById('statusDropdownTrigger');
  const wrap = document.getElementById('statusDropdownWrap');
  const items = document.querySelectorAll('.custom-dropdown-item');
  const selectedText = document.getElementById('statusSelectedText');
  const filterPanel = document.getElementById('filterExpandPanel');
  const btnToggle = document.getElementById('btnToggleFilterPanel');

  if (btnToggle && filterPanel) {
    btnToggle.addEventListener('click', () => {
      btnToggle.classList.toggle('active');
      filterPanel.toggleAttribute('hidden');
    });
  }

  if (!trigger || !wrap) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    wrap.classList.toggle('open');
    const isOpen = wrap.classList.contains('open');
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const val = item.getAttribute('data-value');
      const text = item.textContent.trim();
      currentFilterStatus = val;

      if (selectedText) selectedText.textContent = text;
      wrap.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');

      handleSearch();
    });
  });

  document.addEventListener('click', (e) => {
    if (wrap && !wrap.contains(e.target)) {
      wrap.classList.remove('open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

// 4. KÍCH HOẠT CÁC SỰ KIỆN NÚT BẤM VÀ TÌM KIẾM
function initModalEvents() {
  const btnAdd = document.getElementById('btnAddRoleGroup');
  const btnClose = document.getElementById('btnModalClose');
  const btnCancel = document.getElementById('btnModalCancel');
  const btnSubmit = document.getElementById('btnModalSubmit');
  const overlay = document.getElementById('roleModalOverlay');

  const btnSearch = document.getElementById('btnRoleSearch');
  const btnReset = document.getElementById('btnRoleReset');
  const searchInput = document.getElementById('searchRoleInput');

  if (btnAdd) {
    btnAdd.addEventListener('click', () => openRoleModal('add'));
  }

  if (btnClose) {
    btnClose.addEventListener('click', closeRoleModal);
  }

  if (btnCancel) {
    btnCancel.addEventListener('click', closeRoleModal);
  }

  if (btnSubmit) {
    btnSubmit.addEventListener('click', handleSaveRoleModal);
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeRoleModal();
    });
  }

  if (btnSearch) {
    btnSearch.addEventListener('click', handleSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentFilterStatus = 'all';

      const selectedText = document.getElementById('statusSelectedText');
      const items = document.querySelectorAll('.custom-dropdown-item');

      if (selectedText) selectedText.textContent = 'Chọn trạng thái...';
      items.forEach(i => {
        if (i.getAttribute('data-value') === 'all') i.classList.add('active');
        else i.classList.remove('active');
      });

      handleSearch();
    });
  }
}

// Export global helpers
window.showToastNotice = showToastNotice;
window.showToastError = showToastError;
