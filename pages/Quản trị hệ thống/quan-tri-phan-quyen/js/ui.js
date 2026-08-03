/* ============================================================
   UI.JS — Logic Giao diện Trang Quản trị phân quyền (Quản trị hệ thống)
   ============================================================ */

let selectedUserIds = new Set();
let selectedRoleIds = new Set();
let expandedGroupIds = new Set();

function initQuanTriPhanQuyen() {
  renderUserTree();
  renderRoleList();
  initSearchEvents();
  initActionButtons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuanTriPhanQuyen);
} else {
  initQuanTriPhanQuyen();
}

// HELPER: POPUP TOAST THÔNG BÁO
function showToastNotice(message = 'Thao tác hoàn tất thành công.', title = 'Thành công') {
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toast.classList.remove('error', 'danger');
  toast.classList.add('success');
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

// 1. RENDER CÂY NGƯỜI DÙNG CỘT TRÁI
function renderUserTree(filterKeyword = '') {
  const container = document.getElementById('userTreeContainer');
  if (!container || typeof orgUserTreeData === 'undefined') return;

  const keyword = filterKeyword.toLowerCase().trim();

  container.innerHTML = orgUserTreeData.map(org => {
    const hasOrgMatch = org.name.toLowerCase().includes(keyword);

    const deptsHtml = org.children.map(dept => {
      const hasDeptMatch = dept.name.toLowerCase().includes(keyword);

      const empsHtml = dept.children.filter(emp => {
        if (!keyword) return true;
        return hasOrgMatch || hasDeptMatch || emp.name.toLowerCase().includes(keyword);
      }).map(emp => {
        const isAssigned = emp.assignedRoles && emp.assignedRoles.length > 0;
        const isChecked = selectedUserIds.has(emp.id);
        return `
          <div class="ut-emp-row" data-id="${emp.id}">
            <label class="ut-label">
              <input type="checkbox" class="ut-checkbox emp-cb" data-id="${emp.id}" ${isChecked ? 'checked' : ''}>
              <span class="ut-emp-title ${isAssigned ? 'is-assigned' : ''}">${emp.name}</span>
            </label>
          </div>
        `;
      }).join('');

      if (!keyword && dept.children.length > 0 && !empsHtml) return '';

      const isDeptCollapsed = !keyword && !expandedGroupIds.has(dept.id);
      const totalDeptEmps = dept.children.length;
      const selectedDeptEmps = dept.children.filter(e => selectedUserIds.has(e.id)).length;
      const isDeptChecked = totalDeptEmps > 0 && selectedDeptEmps === totalDeptEmps;

      return `
        <div class="ut-dept-group ${isDeptCollapsed ? 'collapsed' : ''}" data-id="${dept.id}">
          <div class="ut-dept-header">
            <input type="checkbox" class="ut-checkbox dept-cb" data-id="${dept.id}" ${isDeptChecked ? 'checked' : ''}>
            <span class="ut-dept-title">${dept.name}</span>
            <i class="fa-solid fa-chevron-down ut-caret"></i>
          </div>
          <div class="ut-emp-list">
            ${empsHtml}
          </div>
        </div>
      `;
    }).join('');

    const isOrgCollapsed = !keyword && !expandedGroupIds.has(org.id);
    const allOrgEmps = org.children.flatMap(d => d.children);
    const totalOrgEmps = allOrgEmps.length;
    const selectedOrgEmps = allOrgEmps.filter(e => selectedUserIds.has(e.id)).length;
    const isOrgChecked = totalOrgEmps > 0 && selectedOrgEmps === totalOrgEmps;

    return `
      <div class="ut-org-group ${isOrgCollapsed ? 'collapsed' : ''}" data-id="${org.id}">
        <div class="ut-org-header">
          <input type="checkbox" class="ut-checkbox org-cb" data-id="${org.id}" ${isOrgChecked ? 'checked' : ''}>
          <span class="ut-org-title">${org.name}</span>
          <i class="fa-solid fa-chevron-down ut-caret"></i>
        </div>
        <div class="ut-dept-list">
          ${deptsHtml}
        </div>
      </div>
    `;
  }).join('');

  attachUserTreeEvents();
}

// CẬP NHẬT TRẠNG THÁI CHECKBOX CHA (DEPT & ORG) CẬP NHẬT ĐỘNG
function updateParentCheckboxesState() {
  const container = document.getElementById('userTreeContainer');
  if (!container || typeof orgUserTreeData === 'undefined') return;

  orgUserTreeData.forEach(org => {
    const orgEl = container.querySelector(`.ut-org-group[data-id="${org.id}"]`);
    if (!orgEl) return;
    const orgCb = orgEl.querySelector('.org-cb');

    let totalOrgEmps = 0;
    let selectedOrgEmps = 0;

    org.children.forEach(dept => {
      const deptEl = orgEl.querySelector(`.ut-dept-group[data-id="${dept.id}"]`);
      if (!deptEl) return;
      const deptCb = deptEl.querySelector('.dept-cb');

      const totalDeptEmps = dept.children.length;
      const selectedDeptEmps = dept.children.filter(e => selectedUserIds.has(e.id)).length;

      totalOrgEmps += totalDeptEmps;
      selectedOrgEmps += selectedDeptEmps;

      if (deptCb) {
        deptCb.checked = (selectedDeptEmps === totalDeptEmps && totalDeptEmps > 0);
        deptCb.indeterminate = false;
      }
    });

    if (orgCb) {
      orgCb.checked = (selectedOrgEmps === totalOrgEmps && totalOrgEmps > 0);
      orgCb.indeterminate = false;
    }
  });
}

// GẮN SỰ KIỆN EXPAND / COLLAPSE VÀ CHECKBOX ĐỆ QUY CỘT TRÁI
function attachUserTreeEvents() {
  const container = document.getElementById('userTreeContainer');
  if (!container) return;

  // Set indeterminate state on load/render
  container.querySelectorAll('.ut-checkbox[data-indeterminate="true"]').forEach(cb => {
    cb.indeterminate = true;
  });

  // Collapse / Expand on caret OR title text click
  const togglers = container.querySelectorAll('.ut-caret, .ut-org-title, .ut-dept-title');
  togglers.forEach(toggler => {
    toggler.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentGroup = toggler.closest('.ut-org-group, .ut-dept-group');
      if (parentGroup) {
        parentGroup.classList.toggle('collapsed');
        const groupId = parentGroup.getAttribute('data-id');
        if (groupId) {
          if (parentGroup.classList.contains('collapsed')) {
            expandedGroupIds.delete(groupId);
          } else {
            expandedGroupIds.add(groupId);
          }
        }
      }
    });
  });

  // Checkbox change events
  container.addEventListener('change', (e) => {
    if (!e.target.classList.contains('ut-checkbox')) return;

    const cb = e.target;
    const isChecked = cb.checked;

    if (cb.classList.contains('emp-cb')) {
      const empId = cb.getAttribute('data-id');
      if (isChecked) selectedUserIds.add(empId);
      else selectedUserIds.delete(empId);
    } else if (cb.classList.contains('dept-cb')) {
      const deptGroup = cb.closest('.ut-dept-group');
      if (deptGroup) {
        const empCbs = deptGroup.querySelectorAll('.emp-cb');
        empCbs.forEach(child => {
          child.checked = isChecked;
          const empId = child.getAttribute('data-id');
          if (isChecked) selectedUserIds.add(empId);
          else selectedUserIds.delete(empId);
        });
      }
    } else if (cb.classList.contains('org-cb')) {
      const orgGroup = cb.closest('.ut-org-group');
      if (orgGroup) {
        const childCbs = orgGroup.querySelectorAll('.ut-checkbox');
        childCbs.forEach(child => {
          child.checked = isChecked;
          if (child.classList.contains('emp-cb')) {
            const empId = child.getAttribute('data-id');
            if (isChecked) selectedUserIds.add(empId);
            else selectedUserIds.delete(empId);
          }
        });
      }
    }

    updateParentCheckboxesState();
    syncRoleListWithSelectedUsers();
  });

  updateParentCheckboxesState();
}

// ĐỒNG BỘ TRẠNG THÁI NHÓM QUYỀN BÊN PHẢI THEO NGƯỜI DÙNG ĐƯỢC CHỌN
function syncRoleListWithSelectedUsers() {
  selectedRoleIds.clear();

  if (selectedUserIds.size > 0 && typeof orgUserTreeData !== 'undefined') {
    let allEmps = [];
    orgUserTreeData.forEach(org => {
      org.children.forEach(dept => {
        dept.children.forEach(emp => {
          if (selectedUserIds.has(emp.id)) {
            allEmps.push(emp);
          }
        });
      });
    });

    if (allEmps.length > 0) {
      allEmps[0].assignedRoles.forEach(r => selectedRoleIds.add(r));
    }
  }

  renderRoleList();
}

// 2. RENDER DANH SÁCH NHÓM QUYỀN CỘT PHẢI
function renderRoleList(filterKeyword = '') {
  const container = document.getElementById('roleListContainer');
  if (!container || typeof assignRoleGroupsData === 'undefined') return;

  const keyword = filterKeyword.toLowerCase().trim();

  const filteredRoles = assignRoleGroupsData.filter(r => r.name.toLowerCase().includes(keyword));

  container.innerHTML = filteredRoles.map(role => {
    const isChecked = selectedRoleIds.has(role.id);
    return `
      <div class="role-item-row" data-id="${role.id}">
        <label>
          <input type="checkbox" class="ut-checkbox role-cb" data-id="${role.id}" ${isChecked ? 'checked' : ''}>
          <span>${role.name}</span>
        </label>
      </div>
    `;
  }).join('');

  attachRoleListEvents();
}

// GẮN SỰ KIỆN CHECKBOX CỘT PHẢI
function attachRoleListEvents() {
  const container = document.getElementById('roleListContainer');
  if (!container) return;

  container.addEventListener('change', (e) => {
    if (!e.target.classList.contains('role-cb')) return;
    const cb = e.target;
    const roleId = cb.getAttribute('data-id');
    if (cb.checked) {
      selectedRoleIds.add(roleId);
    } else {
      selectedRoleIds.delete(roleId);
    }
  });
}

// 3. TÌM KIẾM DỮ LIỆU CỘT TRÁI VÀ CỘT PHẢI
function initSearchEvents() {
  const searchUserTree = document.getElementById('searchUserTreeInput');
  const searchRoleList = document.getElementById('searchRoleListInput');

  if (searchUserTree) {
    searchUserTree.addEventListener('input', () => {
      renderUserTree(searchUserTree.value);
    });
  }

  if (searchRoleList) {
    searchRoleList.addEventListener('input', () => {
      renderRoleList(searchRoleList.value);
    });
  }
}

// 4. THAO TÁC LƯU & HỦY PHÂN QUYỀN
function initActionButtons() {
  const btnSave = document.getElementById('btnSaveAssign');
  const btnCancel = document.getElementById('btnCancelAssign');

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      if (selectedUserIds.size === 0) {
        showCustomConfirm('Thông báo', 'Vui lòng chọn ít nhất 1 người dùng để phân quyền.', () => {});
        return;
      }

      showCustomConfirm('Xác nhận phân quyền', 'Bạn có chắc chắn muốn lưu phân quyền?', () => {
        const roleArray = Array.from(selectedRoleIds);
        orgUserTreeData.forEach(org => {
          org.children.forEach(dept => {
            dept.children.forEach(emp => {
              if (selectedUserIds.has(emp.id)) {
                emp.assignedRoles = [...roleArray];
              }
            });
          });
        });

        renderUserTree();
        showToastNotice('Lưu phân quyền thành công!');
      });
    });
  }

  if (btnCancel) {
    btnCancel.addEventListener('click', () => {
      if (selectedUserIds.size === 0) {
        showCustomConfirm('Thông báo', 'Vui lòng chọn ít nhất 1 người dùng để hủy phân quyền.', () => {});
        return;
      }

      showCustomConfirm('Xác nhận hủy phân quyền', 'Bạn có chắc chắn muốn hủy phân quyền?', () => {
        orgUserTreeData.forEach(org => {
          org.children.forEach(dept => {
            dept.children.forEach(emp => {
              if (selectedUserIds.has(emp.id)) {
                emp.assignedRoles = [];
              }
            });
          });
        });

        selectedRoleIds.clear();
        renderUserTree();
        renderRoleList();
        showToastNotice('Đã hủy phân quyền người dùng!');
      });
    });
  }
}
