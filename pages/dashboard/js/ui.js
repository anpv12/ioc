/**
 * ui.js — UI Interactions
 * Trang: p01 - Tình hình dân cư theo giới tính
 *
 * Phụ thuộc (load trước): state.js
 * Chức năng:
 *   - Drawer toggle, form collapse/expand
 *   - saveDirective(): lưu chỉ đạo mới (multiselect, agency, director, files)
 *   - applyDirectiveIndicators(): gắn badge + viền màu lên metric cards
 *   - populateUI(): render danh sách + phân trang + bộ lọc + deadline icons
 *   - deadline utilities: getDueDateObj(), getDeadlineStatus(), renderDeadlineIcon()
 *   - Notification panel: updateDeadlineBell(), toggleDeadlinePanel()
 *   - 3-dot menu: view, edit, cancel, remind
 *   - Event listeners
 */

// ----- DOM Elements -----
const eventDrawer = document.getElementById('eventDrawer');
const drawerBadge = document.getElementById('drawerBadge');
const directivePagination = document.getElementById('directivePagination');
const paginationLimit = document.getElementById('paginationLimit');
const paginationInfo = document.getElementById('paginationInfo');
const btnPrevPage = document.getElementById('btnPrevPage');
const btnNextPage = document.getElementById('btnNextPage');
const directiveSearch = document.getElementById('directiveSearch');
const directiveFilterStatus = document.getElementById('directiveFilterStatus');
const directiveFilterDeadline = document.getElementById('directiveFilterDeadline');

let currentPage = 1;

// ----- Flatpickr (Rule 8) -----
const fpDueDate = flatpickr(document.getElementById('formDueDate'), {
  dateFormat: 'd/m/Y',
  defaultDate: new Date(Date.now() + 7 * 86400000)
});

flatpickr(document.getElementById('filterDateFrom'), {
  dateFormat: 'd/m/Y',
  onChange: () => { currentPage = 1; populateUI(); }
});

flatpickr(document.getElementById('filterDateTo'), {
  dateFormat: 'd/m/Y',
  onChange: () => { currentPage = 1; populateUI(); }
});

// ----- Ngày tạo auto-fill -----
(function () {
  const el = document.getElementById('formCreatedAt');
  if (el) {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    el.value = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + mi;
  }
})();

// ----- Drawer -----
function toggleDrawer() { eventDrawer.classList.toggle('open'); }
function openDrawer() { eventDrawer.classList.add('open'); }

// ----- Toggle Form Tạo Chỉ Đạo & Đôn Đốc -----
let formOpen = false;
let urgeOpen = false;

window.toggleCreateFormTab = function () {
  formOpen = !formOpen;
  if (formOpen) {
    urgeOpen = false; // Tắt form đôn đốc
  }
  updateFormsVisibility();
}

window.toggleUrgeFormTab = function () {
  urgeOpen = !urgeOpen;
  if (urgeOpen) {
    formOpen = false; // Tắt form tạo mới
    renderUrgeDirectives(); // Vẽ danh sách đôn đốc
  }
  updateFormsVisibility();
}

function updateFormsVisibility() {
  const createWrap = document.getElementById('drawerCreateFormWrap');
  const urgeWrap = document.getElementById('drawerUrgePanelWrap');

  const btnCreate = document.getElementById('btnShowCreateForm');
  const btnUrge = document.getElementById('btnShowUrgeForm');

  if (createWrap) createWrap.style.display = formOpen ? 'block' : 'none';
  if (urgeWrap) urgeWrap.style.display = urgeOpen ? 'flex' : 'none';

  if (btnCreate) {
    if (formOpen) {
      btnCreate.classList.add('active');

      // Cập nhật ngày tạo mỗi lần mở (gồm cả giây)
      const now = new Date();
      const createdAtEl = document.getElementById('formCreatedAt');
      if (createdAtEl) {
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yyyy = now.getFullYear();
        const hh = String(now.getHours()).padStart(2, '0');
        const mi = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        createdAtEl.value = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + mi + ':' + ss;
      }

      // Mặc định chọn Người chỉ đạo theo tên account đăng nhập
      const directorEl = document.getElementById('formDirector');
      if (directorEl && !directorEl.value && !editingDirectiveId) {
        directorEl.value = 'Chủ tịch UBND Tỉnh';
      }
    } else {
      btnCreate.classList.remove('active');
    }
  }

  if (btnUrge) {
    if (urgeOpen) {
      btnUrge.classList.add('active');
    } else {
      btnUrge.classList.remove('active');
    }
  }
}

// ----- Multiselect Chỉ số (Tự động đẩy item checked lên đầu) -----
window.toggleMultiselect = function () {
  document.getElementById('formMetricDropdown').classList.toggle('open');
};

document.addEventListener('click', function (e) {
  const wrap = document.getElementById('formMetricMultiWrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('formMetricDropdown').classList.remove('open');
  }
});

function getSelectedMetricIds() {
  return Array.from(
    document.querySelectorAll('#formMetricDropdown input[type=checkbox]:checked')
  ).map(cb => cb.value);
}

function sortMultiselectItems() {
  const dropdown = document.getElementById('formMetricDropdown');
  if (!dropdown) return;
  const labels = Array.from(dropdown.querySelectorAll('label'));
  labels.sort((a, b) => {
    const aChecked = a.querySelector('input').checked ? 1 : 0;
    const bChecked = b.querySelector('input').checked ? 1 : 0;
    return bChecked - aChecked;
  });
  labels.forEach(lbl => dropdown.appendChild(lbl));
}

function updateMultiselectDisplay() {
  sortMultiselectItems();
  const selected = getSelectedMetricIds();
  const display = document.getElementById('formMetricDisplay');
  if (selected.length === 0) {
    display.innerHTML = '<span id="formMetricPlaceholder" style="color:var(--text-muted);">-- Chọn chỉ số --</span>';
  } else {
    const labels = selected.map(id => METRIC_LABELS[id] || id);
    display.innerHTML = labels.map(l =>
      '<span class="ms-tag">' + l + '</span>'
    ).join('') + '<span id="formMetricPlaceholder" style="display:none;"></span>';
  }
}

document.querySelectorAll('#formMetricDropdown input[type=checkbox]').forEach(cb => {
  cb.addEventListener('change', updateMultiselectDisplay);
});

// ----- File Attach với chức năng Xóa -----
let attachedFormFiles = [];

window.handleFileAttach = function (input) {
  if (!input.files || !input.files.length) return;
  Array.from(input.files).forEach(file => {
    if (!attachedFormFiles.some(f => f.name === file.name)) {
      attachedFormFiles.push({ name: file.name, source: 'leader' });
    }
  });
  renderAttachedFileList();
  input.value = '';
};

window.removeAttachedFile = function (idx) {
  attachedFormFiles.splice(idx, 1);
  renderAttachedFileList();
};

function renderAttachedFileList() {
  const list = document.getElementById('formAttachList');
  if (!list) return;
  list.innerHTML = attachedFormFiles.map((f, idx) =>
    '<span class="attach-tag" style="display:inline-flex; align-items:center; gap:6px; margin:2px 4px 2px 0; padding:3px 8px; background:#f1f5f9; border-radius:6px; font-size:11px;">' +
    '<i class="fa-solid fa-file"></i> ' + f.name +
    '<i class="fa-solid fa-xmark btn-remove-attach" onclick="removeAttachedFile(' + idx + ')" style="cursor:pointer; color:#ef4444; font-weight:bold; margin-left:4px;" title="Xóa file"></i>' +
    '</span>'
  ).join('');
}

// ----- Deadline Utilities -----
function parseDDMMYYYY(str) {
  if (!str) return null;
  const parts = str.split('/');
  if (parts.length < 3) return null;
  return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
}

function getDaysRemaining(dueDateStr) {
  const due = parseDDMMYYYY(dueDateStr);
  if (!due) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.round((due - today) / 86400000);
}

// Returns: 'overdue' | 'due-today' | 'soon' | 'normal' | null (completed / no date)
function getDeadlineStatus(dir) {
  if (dir.status === 'Hoàn thành') return null;
  if (!dir.dueDate) return null;
  const days = getDaysRemaining(dir.dueDate);
  if (days === null) return null;
  if (days < 0) return 'overdue';
  if (days === 0) return 'due-today';
  if (days <= 3) return 'soon';
  return 'normal';
}

function isMatchDeadlineFilter(dir, filterValue) {
  if (filterValue === 'Tất cả') return true;
  const dlStatus = getDeadlineStatus(dir);
  if (filterValue === 'Trong hạn') {
    return dlStatus === 'normal' || dlStatus === 'soon' || dlStatus === 'due-today';
  }
  if (filterValue === 'Quá hạn') {
    return dlStatus === 'overdue';
  }
  return true;
}

let activeDetailDirectiveId = null;

function getDeadlineIconHtml(dir) {
  if (dir.status === 'Hoàn thành') return '';
  if (!dir.dueDate) return '';

  const status = getDeadlineStatus(dir);
  let color = '#2e7d32'; // Green for 'normal' (còn hạn / đúng hạn)
  if (status === 'overdue') {
    color = '#d32f2f'; // Red
  } else if (status === 'soon' || status === 'due-today') {
    color = '#e65100'; // Orange
  }

  return '<span class="deadline-clock-icon" style="color:' + color + ';" data-due="' + dir.dueDate + '">' +
    '<i class="fa-solid fa-clock"></i>' +
    '<span class="deadline-tooltip">Đang tính toán...</span>' +
    '</span>';
}

function updateAllCountdowns() {
  const now = new Date();

  // Update tooltip for each clock icon in the directive list
  document.querySelectorAll('.deadline-clock-icon').forEach(el => {
    const dueDateStr = el.getAttribute('data-due');
    const tooltip = el.querySelector('.deadline-tooltip');
    if (!dueDateStr || !tooltip) return;

    const targetDate = parseDDMMYYYY(dueDateStr);
    if (!targetDate) return;
    targetDate.setHours(23, 59, 59, 999);

    const diffMs = targetDate.getTime() - now.getTime();
    const isOverdue = diffMs < 0;
    const absDiff = Math.abs(diffMs);

    const secs = Math.floor((absDiff / 1000) % 60);
    const mins = Math.floor((absDiff / (1000 * 60)) % 60);
    const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

    const timeStr = days + ' ngày ' + hours + ' giờ ' + mins + ' phút ' + secs + ' giây';
    tooltip.textContent = isOverdue ? 'Quá hạn ' + timeStr : 'Còn ' + timeStr;
  });

  // Update modal countdown if open
  if (activeDetailDirectiveId) {
    const modalEl = document.getElementById('modalCountdownText');
    if (modalEl) {
      const dir = directives.find(d => d.id === activeDetailDirectiveId);
      if (dir && dir.status !== 'Hoàn thành' && dir.dueDate) {
        const targetDate = parseDDMMYYYY(dir.dueDate);
        if (targetDate) {
          targetDate.setHours(23, 59, 59, 999);
          const diffMs = targetDate.getTime() - now.getTime();
          const isOverdue = diffMs < 0;
          const absDiff = Math.abs(diffMs);

          const secs = Math.floor((absDiff / 1000) % 60);
          const mins = Math.floor((absDiff / (1000 * 60)) % 60);
          const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
          const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

          const timeStr = days + ' ngày ' + hours + ' giờ ' + mins + ' phút ' + secs + ' giây';
          modalEl.innerHTML = isOverdue
            ? '<span style="color:#d32f2f; font-weight:bold; font-size:11px;">(Quá hạn ' + timeStr + ')</span>'
            : '<span style="color:#2e7d32; font-weight:bold; font-size:11px;">(Còn ' + timeStr + ')</span>';
        }
      } else {
        modalEl.innerHTML = '';
      }
    }
  }
}

// Start the real-time countdown interval
setInterval(updateAllCountdowns, 1000);


// ----- Deadline Bell / Notification Panel -----
function updateDeadlineBell() {
  const overdue = directives.filter(d => getDeadlineStatus(d) === 'overdue');
  const dueToday = directives.filter(d => getDeadlineStatus(d) === 'due-today');
  const soon = directives.filter(d => getDeadlineStatus(d) === 'soon');
  const total = overdue.length + dueToday.length + soon.length;

  const badge = document.getElementById('deadlineBellBadge');
  const btn = document.getElementById('deadlineBellBtn');

  if (badge && btn) {
    if (total > 0) {
      badge.textContent = total > 99 ? '99+' : total;
      badge.style.display = 'flex';
      btn.classList.add(overdue.length > 0 ? 'has-overdue' : 'has-warning');
      btn.classList.remove(overdue.length > 0 ? 'has-warning' : 'has-overdue');
    } else {
      badge.style.display = 'none';
      btn.classList.remove('has-overdue', 'has-warning');
    }
  }

  // Render notification panel content
  const panel = document.getElementById('deadlinePanel');
  if (!panel) return;

  let html = '';
  if (total === 0) {
    html = '<div class="dl-panel-empty"><i class="fa-solid fa-check-circle"></i> Không có chỉ đạo nào cần chú ý deadline.</div>';
  } else {
    if (overdue.length > 0) {
      html += '<div class="dl-group overdue"><div class="dl-group-title"><i class="fa-solid fa-circle-xmark"></i> Quá hạn (' + overdue.length + ')</div>';
      overdue.slice(0, 5).forEach(d => {
        const days = Math.abs(getDaysRemaining(d.dueDate));
        html += '<div class="dl-item">' +
          '<span class="dl-agency">' + (d.agency || 'N/A') + '</span>' +
          '<span class="dl-days">Quá ' + days + ' ngày</span>' +
          '</div>';
      });
      if (overdue.length > 5) html += '<div class="dl-more">+' + (overdue.length - 5) + ' chỉ đạo khác</div>';
      html += '</div>';
    }
    if (dueToday.length > 0) {
      html += '<div class="dl-group due-today"><div class="dl-group-title"><i class="fa-solid fa-calendar-day"></i> Đến hạn hôm nay (' + dueToday.length + ')</div>';
      dueToday.slice(0, 5).forEach(d => {
        html += '<div class="dl-item">' +
          '<span class="dl-agency">' + (d.agency || 'N/A') + '</span>' +
          '<span class="dl-days">Hôm nay</span>' +
          '</div>';
      });
      html += '</div>';
    }
    if (soon.length > 0) {
      html += '<div class="dl-group soon"><div class="dl-group-title"><i class="fa-solid fa-clock"></i> Sắp đến hạn (' + soon.length + ')</div>';
      soon.slice(0, 5).forEach(d => {
        const days = getDaysRemaining(d.dueDate);
        html += '<div class="dl-item">' +
          '<span class="dl-agency">' + (d.agency || 'N/A') + '</span>' +
          '<span class="dl-days">Còn ' + days + ' ngày</span>' +
          '</div>';
      });
      html += '</div>';
    }
  }
  panel.innerHTML = html;
}

window.toggleDeadlinePanel = function () {
  const panel = document.getElementById('deadlinePanel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
};

// ----- Apply Directive Indicators on Metric Cards -----
function applyDirectiveIndicators() {
  document.querySelectorAll('.metric-block').forEach(card => {
    card.classList.remove('has-directive-pending', 'has-directive-processing', 'has-directive-completed', 'has-directive-rejected');
    const old = card.querySelector('.directive-badge');
    if (old) old.remove();
  });

  const priority = {
    'Bị từ chối': 6,
    'Đã chỉ đạo': 5,
    'Chờ phân công': 4,
    'Đang xử lý': 3,
    'Đã có báo cáo': 2,
    'Hoàn thành': 1
  };
  const metricMap = {};
  directives.forEach(d => {
    const ids = d.metricIds && d.metricIds.length ? d.metricIds : (d.metricId ? [d.metricId] : []);
    ids.forEach(mid => {
      if (!metricMap[mid] || (priority[d.status] || 0) > (priority[metricMap[mid].status] || 0)) {
        metricMap[mid] = d;
      }
    });
  });

  Object.entries(metricMap).forEach(([mid, dir]) => {
    const card = document.getElementById(mid);
    if (!card) return;

    let borderClass;
    if (dir.status === 'Bị từ chối') {
      borderClass = 'has-directive-rejected';
    } else if (dir.status === 'Đã chỉ đạo' || dir.status === 'Chờ phân công') {
      borderClass = 'has-directive-pending';
    } else if (dir.status === 'Đang xử lý' || dir.status === 'Đã có báo cáo') {
      borderClass = 'has-directive-processing';
    } else {
      borderClass = 'has-directive-completed';
    }

    card.classList.add(borderClass);
  });

  // Tự động chèn hoặc cập nhật directive-ribbon trên tất cả các .metric-block
  document.querySelectorAll('.metric-block').forEach(card => {
    const mid = card.id;
    if (!mid) return;

    let ribbon = card.querySelector('directive-ribbon');
    if (!ribbon) {
      ribbon = document.createElement('directive-ribbon');
      ribbon.setAttribute('metric-id', mid);
      card.appendChild(ribbon);
    } else {
      ribbon.update();
    }
  });
}

// ----- Save & Update Directive Modal Popup (#directiveFormModal) -----
let editingDirectiveId = null;

window.openDirectiveFormModal = function (editId = null) {
  editingDirectiveId = editId;
  const modalTitle = document.getElementById('directiveFormModalTitle');
  const submitBtn = document.getElementById('btnSubmitDirectiveModal');

  if (editId) {
    const dir = directives.find(d => d.id === editId);
    if (!dir) return;
    if (modalTitle) modalTitle.textContent = 'Chỉnh sửa chỉ đạo điều hành';
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Cập nhật chỉ đạo';

    // Set form fields
    const createdAtEl = document.getElementById('formCreatedAt');
    if (createdAtEl) createdAtEl.value = dir.createdAt || '';

    const ids = dir.metricIds && dir.metricIds.length ? dir.metricIds : (dir.metricId ? [dir.metricId] : []);
    document.querySelectorAll('#formMetricDropdown input[type=checkbox]').forEach(cb => {
      cb.checked = ids.includes(cb.value);
    });
    updateMultiselectDisplay();

    if (dir.agency) document.getElementById('formAgency').value = dir.agency;
    if (dir.content) document.getElementById('formContent').value = dir.content;
    if (dir.director) document.getElementById('formDirector').value = dir.director;
    if (dir.dueDate && fpDueDate) fpDueDate.setDate(dir.dueDate);

    // Populate attach file tags
    const leaderFiles = (dir.attachments || []).filter(f => f.source === 'leader' || !f.source);
    const listEl = document.getElementById('formAttachList');
    if (listEl) {
      listEl.innerHTML = leaderFiles.map(f => '<span class="attach-tag"><i class="fa-solid fa-file"></i> ' + f.name + '</span>').join(' ');
    }
  } else {
    if (modalTitle) modalTitle.textContent = 'Thêm mới chỉ đạo điều hành';
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Gửi chỉ đạo';

    // Set current date time with seconds
    const now = new Date();
    const createdAtEl = document.getElementById('formCreatedAt');
    if (createdAtEl) {
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      const hh = String(now.getHours()).padStart(2, '0');
      const mi = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      createdAtEl.value = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + mi + ':' + ss;
    }

    // Reset form
    document.querySelectorAll('#formMetricDropdown input[type=checkbox]').forEach(cb => { cb.checked = false; });
    updateMultiselectDisplay();
    document.getElementById('formAgency').value = '';
    document.getElementById('formContent').value = '';
    const dirSelect = document.getElementById('formDirector');
    if (dirSelect) dirSelect.value = 'Chủ tịch UBND Tỉnh';
    if (fpDueDate) fpDueDate.clear();
    const listEl = document.getElementById('formAttachList');
    if (listEl) listEl.innerHTML = '';
  }

  document.getElementById('directiveFormModal').classList.add('open');
};

window.closeDirectiveFormModal = function () {
  document.getElementById('directiveFormModal').classList.remove('open');
  editingDirectiveId = null;
};

window.saveDirectiveFromModal = function () {
  const metricIds = getSelectedMetricIds();
  const agency = document.getElementById('formAgency').value;
  const content = document.getElementById('formContent').value.trim();
  const dueDate = document.getElementById('formDueDate').value;
  const director = document.getElementById('formDirector').value;

  if (!metricIds.length) { alert('Vui lòng chọn ít nhất một chỉ số cần chỉ đạo.'); return; }
  if (!agency) { alert('Vui lòng chọn cơ quan tiếp nhận.'); return; }
  if (!content) { alert('Vui lòng nhập nội dung chỉ đạo.'); return; }
  if (!director) { alert('Vui lòng chọn người chỉ đạo.'); return; }

  const attachInput = document.getElementById('formAttach');
  const attachments = attachInput ? Array.from(attachInput.files).map(f => f.name) : [];
  const createdAtEl = document.getElementById('formCreatedAt');
  const createdAt = createdAtEl ? createdAtEl.value : '';

  if (editingDirectiveId) {
    const dir = directives.find(d => d.id === editingDirectiveId);
    if (dir) {
      dir.metricIds = metricIds;
      dir.metricId = metricIds[0];
      dir.agency = agency;
      dir.content = content;
      dir.dueDate = dueDate;
      dir.director = director;
      saveDirectives();
      showToast('Cập nhật chỉ đạo thành công!');
    }
  } else {
    directives.push({
      id: 'dir_' + Date.now(),
      metricIds,
      metricId: metricIds[0],
      agency,
      director,
      creator: director,
      content,
      dueDate,
      reportDueDate: '',
      attachments: attachments.map(n => ({ name: n, source: 'leader' })),
      status: 'Đã chỉ đạo',
      report: '',
      createdAt
    });
    saveDirectives();
    showToast('Đã gửi chỉ đạo thành công!');
  }

  closeDirectiveFormModal();
  currentPage = 1;
  populateUI();
};

// ----- Flow Đôn Đốc Trực Tiếp kèm Validation 2 Cấp -----
window.submitBatchUrgeDirectives = function () {
  const organSelect = document.getElementById('directiveFilterOrganzation');
  const selectedAgency = organSelect ? organSelect.value : 'Tất cả';

  // Validation Cấp 1: Chưa chọn Đơn vị tiếp nhận (vẫn là "Tất cả")
  if (!selectedAgency || selectedAgency === 'Tất cả') {
    showToast('⚠️ Vui lòng chọn ít nhất một đơn vị để đôn đốc.');
    return;
  }

  // Validation Cấp 2: Đã chọn Đơn vị nhưng chưa tích chọn chỉ đạo nào thuộc đơn vị đó
  const checkedCbs = document.querySelectorAll('.directive-item-cb:checked');
  if (checkedCbs.length === 0) {
    showToast('⚠️ Vui lòng chọn ít nhất một chỉ đạo để đôn đốc.');
    return;
  }

  // Gửi đôn đốc thành công
  showToast('📢 Đã gửi đôn đốc ' + checkedCbs.length + ' chỉ đạo tới ' + selectedAgency + ' thành công!');

  // Reset checkboxes
  checkedCbs.forEach(cb => { cb.checked = false; });
  const selectAllCb = document.getElementById('selectAllDirectives');
  if (selectAllCb) selectAllCb.checked = false;
  updateUrgeSelectedCounts();
};

window.toggleSelectAllDirectives = function (selectAllCb) {
  document.querySelectorAll('.directive-item-cb').forEach(cb => {
    cb.checked = selectAllCb.checked;
  });
  updateUrgeSelectedCounts();
};

window.updateUrgeSelectedCounts = function () {
  const count = document.querySelectorAll('.directive-item-cb:checked').length;
  const countText = count > 0 ? ' (' + count + ')' : '';
  const el1 = document.getElementById('urgeTopCount');
  const el2 = document.getElementById('selectedUrgeInlineCount');
  if (el1) el1.textContent = countText;
  if (el2) el2.textContent = countText;
};

window.onAgencyFilterChange = function () {
  currentPage = 1;
  const selectAllCb = document.getElementById('selectAllDirectives');
  if (selectAllCb) selectAllCb.checked = false;
  populateUI();
};

// ----- Populate UI -----
function populateUI() {
  const listEl = document.getElementById('directiveList');
  listEl.innerHTML = '';

  const keyword = directiveSearch ? directiveSearch.value.trim().toLowerCase() : '';
  const filterOrg = document.getElementById('directiveFilterOrganzation') ? document.getElementById('directiveFilterOrganzation').value : 'Tất cả';
  const filterStatus = directiveFilterStatus ? directiveFilterStatus.value : 'Tất cả';
  const filterDL = directiveFilterDeadline ? directiveFilterDeadline.value : 'Tất cả';
  const fromDateStr = document.getElementById('filterDateFrom') ? document.getElementById('filterDateFrom').value : '';
  const toDateStr = document.getElementById('filterDateTo') ? document.getElementById('filterDateTo').value : '';
  const fromDate = fromDateStr ? parseDDMMYYYY(fromDateStr) : null;
  const toDate = toDateStr ? parseDDMMYYYY(toDateStr) : null;

  const filteredDirectives = directives.filter(dir => {
    const metricLabel = (dir.metricIds || []).map(id => METRIC_LABELS[id] || id).join(' ');
    const matchKW = dir.content.toLowerCase().includes(keyword) ||
      metricLabel.toLowerCase().includes(keyword) ||
      (dir.agency || '').toLowerCase().includes(keyword);
    const matchOrg = filterOrg === 'Tất cả' || dir.agency === filterOrg;
    const matchStatus = filterStatus === 'Tất cả' || dir.status === filterStatus;
    const matchDL = isMatchDeadlineFilter(dir, filterDL);

    let matchDate = true;
    if (fromDate || toDate) {
      const created = parseDDMMYYYY(dir.createdAt ? dir.createdAt.split(' ')[0] : '');
      if (created) {
        if (fromDate) { const f = new Date(fromDate); f.setHours(0, 0, 0, 0); matchDate = created >= f; }
        if (toDate && matchDate) { const t = new Date(toDate); t.setHours(23, 59, 59, 999); matchDate = created <= t; }
      }
    }

    return matchKW && matchOrg && matchStatus && matchDL && matchDate;
  });

  // Badge count
  const activeCount = directives.filter(d => d.status !== 'Đã hoàn thành').length;
  drawerBadge.textContent = activeCount;
  drawerBadge.style.display = activeCount > 0 ? 'flex' : 'none';

  // Update bell
  updateDeadlineBell();

  if (filteredDirectives.length === 0) {
    listEl.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:20px;font-size:var(--fs-xs);">Không tìm thấy chỉ đạo phù hợp.</div>';
    directivePagination.style.display = 'none';
  } else {
    directivePagination.style.display = 'flex';

    const rowsPerPage = parseInt(paginationLimit.value) || 5;
    const totalPages = Math.ceil(filteredDirectives.length / rowsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const sorted = filteredDirectives.slice().reverse();
    const startIdx = (currentPage - 1) * rowsPerPage;
    const endIdx = Math.min(startIdx + rowsPerPage, sorted.length);
    const pageDirs = sorted.slice(startIdx, endIdx);

    paginationInfo.textContent = (startIdx + 1) + '-' + endIdx + '/' + filteredDirectives.length;
    btnPrevPage.disabled = currentPage === 1;
    btnNextPage.disabled = currentPage === totalPages;

    const fragment = document.createDocumentFragment();
    pageDirs.forEach(dir => {
      const metricLabels = (dir.metricIds && dir.metricIds.length
        ? dir.metricIds
        : (dir.metricId ? [dir.metricId] : [])
      ).map(id => METRIC_LABELS[id] || id).join(', ');

      let statusClass = 'status-pending';
      if (dir.status === 'Chờ phân công') { statusClass = 'status-assigned'; }
      if (dir.status === 'Đang xử lý') { statusClass = 'status-processing'; }
      if (dir.status === 'Đã có báo cáo') { statusClass = 'status-reported'; }
      if (dir.status === 'Hoàn thành') { statusClass = 'status-completed'; }
      if (dir.status === 'Bị từ chối') { statusClass = 'status-rejected'; }

      // Lý do từ chối hiển thị mặc định màu đỏ nổi bật
      const reportHtml = (dir.report && (dir.status === 'Đã có báo cáo' || dir.status === 'Hoàn thành' || dir.status === 'Bị từ chối'))
        ? (dir.status === 'Bị từ chối'
          ? '<div class="rejection-reason-box" style="margin-top:6px;"><div class="rejection-reason-lbl"><i class="fa-solid fa-triangle-exclamation"></i> Lý do từ chối:</div>' + dir.report + '</div>'
          : '<div class="directive-report"><span class="directive-report-lbl"><i class="fa-solid fa-reply"></i> Báo cáo kết quả:</span> ' + dir.report + '</div>')
        : '';

      const deadlineIcon = getDeadlineIconHtml(dir);

      const canEdit = dir.status === 'Đã chỉ đạo';
      const canDelete = dir.status === 'Đã chỉ đạo';
      const canApproveReject = dir.status === 'Đã có báo cáo';
      const canUrge = dir.status !== 'Hoàn thành';

      const leaderFiles = (dir.attachments || []).filter(f => f.source === 'leader' || !f.source);
      const agencyFiles = (dir.attachments || []).filter(f => f.source === 'agency');

      let leaderAttachHtml = '';
      if (leaderFiles.length > 0) {
        leaderAttachHtml = '<div style="margin-top:4px; display:flex; flex-wrap:wrap; gap:3px; align-items:center;">' +
          '<span style="font-size:10px; font-weight:700; color:var(--pink);"><i class="fa-solid fa-paperclip"></i> Lãnh đạo đính kèm:</span> ' +
          leaderFiles.map(f =>
            '<span class="file-preview-link leader" style="font-size:9px; padding:2px 7px; cursor:pointer;" onclick="openFilePreviewModal(\'' + f.name + '\')">' +
            '<i class="fa-solid fa-file"></i> ' + f.name +
            '<i class="fa-solid fa-download" style="margin-left:4px; opacity:0.8;" onclick="downloadFile(\'' + f.name + '\', event)" title="Tải về"></i>' +
            '</span>'
          ).join('') +
          '</div>';
      }

      let agencyAttachHtml = '';
      if (agencyFiles.length > 0) {
        agencyAttachHtml = '<div style="margin-top:4px; display:flex; flex-wrap:wrap; gap:3px; align-items:center;">' +
          '<span style="font-size:10px; font-weight:700; color:#2e7d32;"><i class="fa-solid fa-paperclip"></i> Đơn vị đính kèm:</span> ' +
          agencyFiles.map(f =>
            '<span class="file-preview-link agency" style="font-size:9px; padding:2px 7px; cursor:pointer;" onclick="openFilePreviewModal(\'' + f.name + '\')">' +
            '<i class="fa-solid fa-file"></i> ' + f.name +
            '<i class="fa-solid fa-download" style="margin-left:4px; opacity:0.8;" onclick="downloadFile(\'' + f.name + '\', event)" title="Tải về"></i>' +
            '</span>'
          ).join('') +
          '</div>';
      }

      const item = document.createElement('div');
      item.className = 'directive-item';
      item.innerHTML =
        '<div class="directive-item-header">' +
        '<div class="directive-loc" style="flex: 1; min-width: 0;">' +
        '<input type="checkbox" class="directive-item-cb" value="' + dir.id + '" onchange="updateUrgeSelectedCounts()" style="cursor:pointer; accent-color:var(--pink); margin-right:6px; flex-shrink: 0;" title="Tích chọn đôn đốc">' +
        '<div class="metric-tooltip-wrap" style="flex: 1; min-width: 0; padding-right: 8px;">' +
        '<div style="text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' +
        '<i class="fa-solid fa-chart-bar"></i> ' + metricLabels +
        '</div>' +
        '<span class="metric-tooltip">' + metricLabels + '</span>' +
        '</div>' +
        '<span class="directive-status ' + statusClass + '" style="margin-left:6px; flex-shrink: 0;">' + dir.status + '</span>' +
        '</div>' +
        '<div class="directive-item-right" style="flex-shrink: 0;">' +
        deadlineIcon +
        '<div class="directive-actions-menu-wrap">' +
        '<button class="btn-directive-actions" onclick="toggleDirectiveActionsMenu(\'' + dir.id + '\', event)" title="Chức năng">' +
        '<i class="fa-solid fa-ellipsis-vertical"></i>' +
        '</button>' +
        '<div class="directive-actions-dropdown" id="dropdown-' + dir.id + '">' +
        '<button onclick="viewDirectiveDetail(\'' + dir.id + '\')"><i class="fa-regular fa-eye"></i> Xem</button>' +
        (canEdit ? '<button onclick="openDirectiveFormModal(\'' + dir.id + '\')"><i class="fa-regular fa-pen-to-square"></i> Sửa</button>' : '') +
        '<button onclick="openDeleteConfirmModal(\'' + dir.id + '\', event)" class="text-danger"><i class="fa-regular fa-trash-can"></i> Xoá</button>' +
        (canApproveReject ? '<button onclick="approveDirective(\'' + dir.id + '\', event)" style="color:#2e7d32;"><i class="fa-regular fa-circle-check"></i> Phê duyệt</button>' : '') +
        (canApproveReject ? '<button onclick="openRejectModal(\'' + dir.id + '\', event)" class="text-danger"><i class="fa-regular fa-circle-xmark"></i> Từ chối</button>' : '') +
        (canUrge ? '<button onclick="urgeSingleDirective(\'' + dir.id + '\', event)"><i class="fa-solid fa-bullhorn"></i> Đôn đốc</button>' : '') +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        (dir.agency ? '<div class="directive-agency"><i class="fa-regular fa-building"></i> ' + dir.agency + '</div>' : '') +
        '<p class="directive-text" style="margin-top:4px;">' + dir.content + '</p>' +
        leaderAttachHtml +
        (dir.report && (dir.status === 'Đã có báo cáo' || dir.status === 'Hoàn thành' || dir.status === 'Bị từ chối')
          ? (dir.status === 'Bị từ chối'
            ? '<div class="rejection-reason-box" style="margin-top:6px;"><div class="rejection-reason-lbl"><i class="fa-solid fa-triangle-exclamation"></i> Lý do từ chối:</div>' + dir.report + '</div>'
            : '<div class="directive-report"><span class="directive-report-lbl"><i class="fa-solid fa-reply"></i> Báo cáo kết quả:</span> ' + dir.report + '</div>')
          : '') +
        agencyAttachHtml +
        '<div class="directive-date" style="margin-top:8px; border-top:1px solid #f1f5f9; padding-top:4px;"><i class="fa-regular fa-clock"></i> Hạn: ' + (dir.dueDate || 'N/A') + ' | Tạo: ' + dir.createdAt + '</div>';

      fragment.appendChild(item);
    });
    listEl.appendChild(fragment);
  }

  updateUrgeSelectedCounts();
  applyDirectiveIndicators();
}

// ----- Interactive Directive Functions -----
window.toggleDirectiveActionsMenu = function (id, event) {
  event.stopPropagation();
  const dropdown = document.getElementById('dropdown-' + id);
  const isOpen = dropdown.classList.contains('open');
  document.querySelectorAll('.directive-actions-dropdown').forEach(el => el.classList.remove('open'));
  if (!isOpen) dropdown.classList.add('open');
};

// ----- View Detail Modal -----
window.viewDirectiveDetail = function (id) {
  const dir = directives.find(d => d.id === id);
  if (!dir) return;

  const metricLabelArray = (dir.metricIds && dir.metricIds.length
    ? dir.metricIds : (dir.metricId ? [dir.metricId] : [])
  ).map(id2 => METRIC_LABELS[id2] || id2);

  const metricTagsHtml = metricLabelArray.map(lbl =>
    '<span class="metric-tag-chip"><i class="fa-solid fa-chart-line"></i> ' + lbl + '</span>'
  ).join(' ');

  activeDetailDirectiveId = id;

  // ----- Tab 1: Thông tin chỉ đạo -----
  const leaderFiles = (dir.attachments || []).filter(f => f.source === 'leader' || !f.source);
  const agencyFiles = (dir.attachments || []).filter(f => f.source === 'agency');

  function buildFileLinks(files, cls) {
    if (!files.length) return '<span style="color:var(--text-muted); font-size:11px;">Không có</span>';
    return files.map(f =>
      '<span class="file-preview-link ' + cls + '"' +
      ' onclick="previewFile(\'' + f.name + '\')">' +
      '<i class="fa-solid fa-file"></i> ' + f.name +
      '<i class="fa-solid fa-download" style="margin-left:4px; opacity:0.7;"></i>' +
      '</span>'
    ).join(' ');
  }

  let statusClass = 'status-pending';
  if (dir.status === 'Chờ phân công') statusClass = 'status-assigned';
  if (dir.status === 'Đang xử lý') statusClass = 'status-processing';
  if (dir.status === 'Đã có báo cáo') statusClass = 'status-reported';
  if (dir.status === 'Hoàn thành') statusClass = 'status-completed';
  if (dir.status === 'Bị từ chối') statusClass = 'status-rejected';

  let deadlineNote = '';
  if (dir.status !== 'Hoàn thành' && dir.dueDate) {
    deadlineNote = '<span id="modalCountdownText"></span>';
  }

  const tabInfoHtml =
    // Nội dung chỉ đạo
    '<div style="background:#f8f9ff; border:1px solid #e8eaf6; border-left:4px solid var(--pink); border-radius:8px; padding:14px 16px;">' +
    '<div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.4px; margin-bottom:8px;">Nội dung chỉ đạo</div>' +
    '<p style="margin:0; font-size:13px; line-height:1.7; color:var(--text-dark);">' + dir.content + '</p>' +
    '</div>' +

    // Metadata với Tag chỉ số màu (Căn trái - trên cùng)
    '<div class="detail-info-grid" style="margin-top:12px; padding:10px 12px; background:#fafafa; border-radius:8px; border:1px solid #f0f0f0;">' +
    '<strong style="align-self:flex-start; margin-top:2px;">Chỉ số</strong><div style="display:flex; flex-wrap:wrap; gap:4px; align-items:flex-start;">' + metricTagsHtml + '</div>' +
    '<strong style="align-self:flex-start; margin-top:2px;">Cơ quan</strong><span style="align-self:flex-start; margin-top:2px;">' + (dir.agency || 'N/A') + '</span>' +
    '<strong>Người chỉ đạo</strong><span>' + (dir.creator || dir.director || 'N/A') + '</span>' +
    '<strong>Ngày tạo</strong><span>' + dir.createdAt + '</span>' +
    '<strong>Thời hạn xử lý</strong><span>' + (dir.dueDate || 'Không giới hạn') + ' ' + (deadlineNote || '') + '</span>' +
    '<strong>Hạn gửi báo cáo</strong><span>' + (dir.reportDueDate || 'Không có') + '</span>' +
    '</div>' +

    // Trạng thái
    '<div style="margin-top:12px; display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:8px; background:#fafafa; border:1px solid #f0f0f0;">' +
    '<span style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.4px;">Trạng thái:</span>' +
    '<span class="directive-status ' + statusClass + '" style="font-size:12px;">' + dir.status + '</span>' +
    (deadlineNote ? '<span style="margin-left:6px;">' + deadlineNote + '</span>' : '') +
    '</div>' +

    // Khối hiển thị Lý do từ chối nếu bị từ chối
    (dir.status === 'Bị từ chối' && dir.report ?
      '<div class="rejection-reason-box" style="margin-top:12px;">' +
      '<div class="rejection-reason-lbl"><i class="fa-solid fa-circle-xmark"></i> Lý do từ chối:</div>' +
      '<p style="margin:4px 0 0; font-size:12px; color:#9b2c2c; line-height:1.6;">' + dir.report + '</p>' +
      '</div>'
      : '') +

    // 2 cột Lãnh đạo / Đơn vị
    '<div class="tab-info-two-col" style="margin-top:12px;">' +
    '<div class="tab-info-col">' +
    '<div class="tab-info-col-label leader-label">Lãnh đạo chỉ đạo</div>' +
    '<div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:4px;">Tài liệu đính kèm</div>' +
    '<div style="display:flex; flex-wrap:wrap; gap:6px;">' +
    (leaderFiles.length > 0 ? buildFileLinks(leaderFiles, 'leader') : '<span style="font-size:11px; color:var(--text-muted);">Không có tài liệu</span>') +
    '</div>' +
    '</div>' +

    '<div class="tab-info-col">' +
    '<div class="tab-info-col-label agency-label">Đơn vị thực hiện</div>' +
    ((dir.report && (dir.status === 'Đã có báo cáo' || dir.status === 'Hoàn thành')) ?
      '<div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:4px;">Báo cáo kết quả</div>' +
      '<p style="margin:0 0 8px; background:#f0fdf4; padding:8px 12px; border-radius:6px; border-left:3px solid #2e7d32; color:#1b5e20; font-size:12px; line-height:1.6;">' + dir.report + '</p>'
      : '') +
    '<div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:4px;">Tài liệu đính kèm</div>' +
    '<div style="display:flex; flex-wrap:wrap; gap:6px;">' +
    (agencyFiles.length > 0 ? buildFileLinks(agencyFiles, 'agency') : '<span style="font-size:11px; color:var(--text-muted);">Chưa có tài liệu</span>') +
    '</div>' +
    '</div>' +
    '</div>';

  document.getElementById('tabContentInfo').innerHTML = tabInfoHtml;

  // ----- Tab 2: Lịch sử trạng thái (Bảng 8 cột chuẩn) -----
  const historyList = typeof getDirectiveHistory === 'function' ? getDirectiveHistory(dir) : [];

  const statusBadge = function (s) {
    let c = 'status-pending';
    if (s === 'Đang xử lý') c = 'status-processing';
    else if (s === 'Đã có báo cáo') c = 'status-reported';
    else if (s === 'Hoàn thành' || s === 'Đã phê duyệt') c = 'status-completed';
    else if (s === 'Bị từ chối') c = 'status-rejected';
    return '<span class="directive-status ' + c + '" style="font-size:10px; white-space:nowrap;">' + s + '</span>';
  };

  const overdueBadge = function (s) {
    if (!s || s === '-') return '-';
    if (s.startsWith('Trễ')) return '<span style="background:#ffebee;color:#c62828;border-radius:4px;padding:2px 6px;font-size:10px;font-weight:700;">' + s + '</span>';
    return '<span style="background:#e8f5e9;color:#2e7d32;border-radius:4px;padding:2px 6px;font-size:10px;font-weight:700;">' + s + '</span>';
  };

  const buildHistoryFiles = function (files, cls) {
    if (!files || !files.length) return '';
    return '<div style="margin-top:4px; display:flex; flex-wrap:wrap; gap:4px;">' +
      files.map(f =>
        '<span class="file-preview-link ' + cls + '" style="font-size:9px; padding:2px 6px; cursor:pointer;" onclick="openFilePreviewModal(\'' + f + '\')">' +
        '<i class="fa-solid fa-file"></i> ' + f +
        '<i class="fa-solid fa-download" style="margin-left:3px; opacity:0.8;" onclick="downloadFile(\'' + f + '\', event)" title="Tải về"></i>' +
        '</span>'
      ).join('') +
      '</div>';
  };

  let historyRowsHtml = '';
  if (historyList.length > 0) {
    historyRowsHtml = historyList.map(function (h) {
      return '<tr>' +
        '<td><strong>' + (h.agency || '-') + '</strong></td>' +
        '<td style="white-space:nowrap;">' + (h.createdAt || '-') + '</td>' +
        '<td>' + statusBadge(h.status) + '</td>' +
        '<td style="white-space:nowrap;">' + overdueBadge(h.overdue) + '</td>' +
        '<td>' + (h.approver || '-') + '</td>' +
        '<td style="white-space:nowrap;">' + (h.approvalDate || '-') + '</td>' +
        '<td style="max-width:180px;">' + (h.agencyNote || '-') + buildHistoryFiles(h.agencyFiles, 'agency') + '</td>' +
        '<td style="max-width:180px;">' + (h.leaderNote || '-') + buildHistoryFiles(h.leaderFiles, 'leader') + '</td>' +
        '</tr>';
    }).join('');
  } else {
    historyRowsHtml = '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:16px;">Chưa có lịch sử trạng thái</td></tr>';
  }

  document.getElementById('tabContentHistory').innerHTML =
    '<div style="overflow-x:auto;">' +
    '<table class="history-table">' +
    '<thead><tr>' +
    '<th>Đơn vị tiếp nhận</th>' +
    '<th>Thời gian tiếp nhận</th>' +
    '<th>Trạng thái chỉ đạo</th>' +
    '<th>Số ngày / Trễ hạn</th>' +
    '<th>Người phê duyệt</th>' +
    '<th>Thời gian phê duyệt</th>' +
    '<th>Ghi chú & Đính kèm Đơn vị</th>' +
    '<th>Ghi chú & Đính kèm Lãnh đạo</th>' +
    '</tr></thead>' +
    '<tbody>' + historyRowsHtml + '</tbody>' +
    '</table>' +
    '</div>';

  document.getElementById('detailModal').classList.add('open');
  switchModalTab('info');
};

// ----- Switch Modal Tab -----
window.switchModalTab = function (tab) {
  document.getElementById('tabBtnInfo').classList.toggle('active', tab === 'info');
  document.getElementById('tabBtnHistory').classList.toggle('active', tab === 'history');
  document.getElementById('tabContentInfo').classList.toggle('active', tab === 'info');
  document.getElementById('tabContentHistory').classList.toggle('active', tab === 'history');
};

window.closeDetailModal = function () {
  document.getElementById('detailModal').classList.remove('open');
  activeDetailDirectiveId = null;
  switchModalTab('info'); // reset về tab 1
};

window.editDirective = function (id) {
  const dir = directives.find(d => d.id === id);
  if (!dir) return;

  editingDirectiveId = id;

  // Mở form nếu đang ẩn
  if (!formOpen) toggleCreateFormTab();

  // Đổ dữ liệu vào form
  const ids = dir.metricIds && dir.metricIds.length ? dir.metricIds : (dir.metricId ? [dir.metricId] : []);
  document.querySelectorAll('#formMetricDropdown input[type=checkbox]').forEach(cb => {
    cb.checked = ids.includes(cb.value);
  });
  updateMultiselectDisplay();

  if (dir.agency) document.getElementById('formAgency').value = dir.agency;
  if (dir.content) document.getElementById('formContent').value = dir.content;
  if (dir.director) document.getElementById('formDirector').value = dir.director;
  if (dir.dueDate && fpDueDate) fpDueDate.setDate(dir.dueDate);

  const submitBtn = document.getElementById('btnSubmitDirective');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Cập nhật chỉ đạo';
  }
  const cancelBtn = document.getElementById('btnCancelEditDirective');
  if (cancelBtn) {
    cancelBtn.style.display = 'inline-block';
  }

  document.querySelector('.drawer-content').scrollTop = 0;
};

// ----- Delete Directive (Chỉ cho trạng thái 'Đã chỉ đạo') -----
window.deleteDirective = function (id, event) {
  if (event) event.stopPropagation();
  const dir = directives.find(d => d.id === id);
  if (!dir) return;

  if (confirm('Bạn có chắc chắn muốn xoá chỉ đạo này không?')) {
    directives = directives.filter(d => d.id !== id);
    saveDirectives();
    showToast('Đã xoá chỉ đạo thành công!');
    populateUI();
  }
};

// ----- Approve Directive (Chỉ đạo 'Đã có báo cáo' -> 'Hoàn thành') -----
window.approveDirective = function (id, event) {
  if (event) event.stopPropagation();
  const dir = directives.find(d => d.id === id);
  if (!dir) return;

  if (confirm('Phê duyệt báo cáo kết quả và đánh dấu Hoàn thành chỉ đạo này?')) {
    dir.status = 'Hoàn thành';
    saveDirectives();
    showToast('✅ Đã phê duyệt báo cáo chỉ đạo thành công!');
    populateUI();
  }
};

// ----- Reject Directive Modal (Chỉ đạo 'Đã có báo cáo' -> 'Bị từ chối') -----
let rejectingDirectiveId = null;

window.openRejectModal = function (id, event) {
  if (event) event.stopPropagation();
  const dir = directives.find(d => d.id === id);
  if (!dir) return;

  rejectingDirectiveId = id;
  document.getElementById('rejectReasonInput').value = '';
  document.getElementById('rejectModal').classList.add('open');
};

window.closeRejectModal = function () {
  document.getElementById('rejectModal').classList.remove('open');
  rejectingDirectiveId = null;
};

window.submitRejectDirective = function () {
  if (!rejectingDirectiveId) return;
  const dir = directives.find(d => d.id === rejectingDirectiveId);
  if (!dir) return;

  const reason = document.getElementById('rejectReasonInput').value.trim();
  if (!reason) {
    alert('Vui lòng nhập chi tiết lý do từ chối báo cáo.');
    return;
  }

  dir.status = 'Bị từ chối';
  dir.report = 'Lý do từ chối: ' + reason + ' (Yêu cầu đơn vị tiếp nhận báo cáo lại).';

  saveDirectives();
  closeRejectModal();
  showToast('❌ Đã từ chối báo cáo chỉ đạo và yêu cầu đơn vị báo cáo lại!');
  populateUI();
};

window.urgeDirective = function (id, event) {
  if (event) event.stopPropagation();
  const dir = directives.find(d => d.id === id);
  if (!dir) return;

  showToast('Đã gửi thông báo đôn đốc thực hiện chỉ đạo thành công!');
};

window.remindDirective = function () { };

window.showToast = function (msg) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMsg');
  toastMsg.textContent = msg;
  toast.style.display = 'flex';
  // trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
  });
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => { toast.style.display = 'none'; }, 320);
  }, 3500);
};

// ----- Batch Urge Functions -----
let urgeCurrentPage = 1;
const URGE_PAGE_SIZE = 8;
let urgeFiltered = [];

window.renderUrgeDirectives = function () {
  const listContainer = document.getElementById('urgeListContainer');
  const filterAgency = document.getElementById('urgeFilterAgency').value;
  const searchInput = document.getElementById('urgeSearchInput');
  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';

  if (!listContainer) return;

  const uncompleted = directives.filter(d => d.status !== 'Hoàn thành');
  urgeFiltered = filterAgency === 'Tất cả'
    ? uncompleted
    : uncompleted.filter(d => d.agency === filterAgency);

  if (keyword) {
    urgeFiltered = urgeFiltered.filter(d =>
      d.content.toLowerCase().includes(keyword) ||
      (d.agency || '').toLowerCase().includes(keyword)
    );
  }

  renderUrgeCurrentPage();
};

function renderUrgeCurrentPage() {
  const listContainer = document.getElementById('urgeListContainer');
  listContainer.innerHTML = '';

  const totalPages = Math.max(1, Math.ceil(urgeFiltered.length / URGE_PAGE_SIZE));
  if (urgeCurrentPage > totalPages) urgeCurrentPage = totalPages;
  if (urgeCurrentPage < 1) urgeCurrentPage = 1;

  const pageItems = urgeFiltered.slice(
    (urgeCurrentPage - 1) * URGE_PAGE_SIZE,
    urgeCurrentPage * URGE_PAGE_SIZE
  );

  // Chèn dòng "Chọn tất cả" ở đầu danh sách
  const selectAllRow = document.createElement('div');
  selectAllRow.style.cssText = 'display:flex; gap:6px; align-items:center; padding:5px 6px; border-bottom:1px solid #eee; font-size:11px; font-weight:700; color:var(--text-dark); background:#fafafa; border-radius:4px; position:sticky; top:0; z-index:1;';
  selectAllRow.innerHTML = '<input type="checkbox" id="urgeSelectAll" onchange="toggleSelectAllUrge(this)" style="cursor:pointer;"> <span>Chọn tất cả (' + urgeFiltered.length + ' chỉ đạo)</span>';
  listContainer.appendChild(selectAllRow);

  if (pageItems.length === 0) {
    listContainer.innerHTML += '<div style="text-align:center; color:var(--text-muted); padding:10px; font-size:11px;">Không có chỉ đạo nào cần đôn đốc.</div>';
  } else {
    pageItems.forEach(dir => {
      const row = document.createElement('div');
      row.className = 'urge-item-row';
      row.style.cssText = 'display: flex; gap: 6px; align-items: start; padding: 6px; border-bottom: 1px solid #f5f5f5; font-size: 11px; cursor: pointer;';
      row.innerHTML =
        '<input type="checkbox" class="urge-item-cb" value="' + dir.id + '" style="margin-top: 2px; cursor:pointer;" onclick="event.stopPropagation(); updateUrgeSelectedCount();">' +
        '<div style="flex:1;" onclick="toggleRowCheckbox(this)">' +
        '<div style="display:flex; justify-content:space-between; font-weight:600; color:var(--magenta);">' +
        '<span>' + dir.agency + '</span>' +
        '<span style="font-size:10px; font-weight:normal; color:var(--text-muted);">' + (dir.dueDate || 'Không hạn') + '</span>' +
        '</div>' +
        '<div style="color:var(--text-dark); margin-top:2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 280px;" title="' + dir.content + '">' +
        dir.content +
        '</div>' +
        '</div>';
      listContainer.appendChild(row);
    });
  }

  // Cập nhật phân trang
  const paginationEl = document.getElementById('urgePagination');
  const pageInfoEl = document.getElementById('urgePageInfo');
  const prevBtn = document.getElementById('urgePrevBtn');
  const nextBtn = document.getElementById('urgeNextBtn');
  if (paginationEl) paginationEl.style.display = totalPages > 1 ? 'flex' : 'none';
  if (pageInfoEl) pageInfoEl.textContent = urgeCurrentPage + '/' + totalPages;
  if (prevBtn) prevBtn.disabled = urgeCurrentPage <= 1;
  if (nextBtn) nextBtn.disabled = urgeCurrentPage >= totalPages;

  updateUrgeSelectedCount();
}

window.changeUrgePage = function (delta) {
  urgeCurrentPage += delta;
  renderUrgeCurrentPage();
};

window.toggleRowCheckbox = function (el) {
  const cb = el.parentElement.querySelector('.urge-item-cb');
  if (cb) {
    cb.checked = !cb.checked;
    updateUrgeSelectedCount();
  }
};

window.filterUrgeDirectives = function () {
  urgeCurrentPage = 1;
  renderUrgeDirectives();
};

window.toggleSelectAllUrge = function (selectAllCb) {
  document.querySelectorAll('.urge-item-cb').forEach(cb => {
    cb.checked = selectAllCb.checked;
  });
  updateUrgeSelectedCount();
};

window.updateUrgeSelectedCount = function () {
  const checked = document.querySelectorAll('.urge-item-cb:checked').length;
  const countEl = document.getElementById('urgeSelectedCount');
  if (countEl) countEl.textContent = checked > 0 ? ' (' + checked + ')' : '';
};

window.submitUrgeBatch = function () {
  const selectedCbs = document.querySelectorAll('.urge-item-cb:checked');
  if (selectedCbs.length === 0) {
    alert('Vui lòng chọn ít nhất một chỉ đạo để đôn đốc.');
    return;
  }
  showToast('📢 Đã gửi đôn đốc ' + selectedCbs.length + ' chỉ đạo thành công!');
  // Uncheck sau khi gửi
  selectedCbs.forEach(cb => { cb.checked = false; });
  updateUrgeSelectedCount();
};

// ----- File Preview / Download -----
window.previewFile = function (fileName) {
  showToast('📄 Đang mở file: ' + fileName);
  // Trong thực tế: window.open(fileUrl) hoặc hiển thị preview modal
};

// ----- Event Listeners -----
document.getElementById('btnToggleDrawer').addEventListener('click', toggleDrawer);

document.addEventListener('click', () => {
  document.querySelectorAll('.directive-actions-dropdown').forEach(el => el.classList.remove('open'));
});

directiveSearch.addEventListener('input', () => { currentPage = 1; populateUI(); });
directiveFilterStatus.addEventListener('change', () => { currentPage = 1; populateUI(); });
directiveFilterDeadline.addEventListener('change', () => { currentPage = 1; populateUI(); });

paginationLimit.addEventListener('change', () => { currentPage = 1; populateUI(); });

btnPrevPage.addEventListener('click', () => { if (currentPage > 1) { currentPage--; populateUI(); } });

btnNextPage.addEventListener('click', () => {
  const keyword = directiveSearch ? directiveSearch.value.trim().toLowerCase() : '';
  const filterStatus = directiveFilterStatus ? directiveFilterStatus.value : 'Tất cả';
  const filterDL = directiveFilterDeadline ? directiveFilterDeadline.value : 'Tất cả';
  const filteredLen = directives.filter(dir => {
    const metricLabel = (dir.metricIds || []).map(id => METRIC_LABELS[id] || id).join(' ');
    const matchKW = dir.content.toLowerCase().includes(keyword) || metricLabel.toLowerCase().includes(keyword) || (dir.agency || '').toLowerCase().includes(keyword);
    const matchStatus = filterStatus === 'Tất cả' || dir.status === filterStatus;
    const matchDL = isMatchDeadlineFilter(dir, filterDL);
    return matchKW && matchStatus && matchDL;
  }).length;

  const rowsPerPage = parseInt(paginationLimit.value) || 5;
  const totalPages = Math.ceil(filteredLen / rowsPerPage) || 1;
  if (currentPage < totalPages) { currentPage++; populateUI(); }
});

// ----- Init -----
populateUI();

// ----- Custom Web Component: DirectiveRibbon -----
class DirectiveRibbon extends HTMLElement {
  static get observedAttributes() {
    return ['metric-id'];
  }

  constructor() {
    super();
    this.metricId = '';
    this.activeDirectives = [];
    this.isPopoverOpen = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'metric-id') {
      this.metricId = newValue;
      this.update();
    }
  }

  connectedCallback() {
    this.metricId = this.getAttribute('metric-id') || '';
    this.update();
    
    // Đóng popover khi click ra ngoài
    this._outsideClickListener = (e) => {
      if (this.isPopoverOpen && !this.contains(e.target)) {
        this.closePopover();
      }
    };
    document.addEventListener('click', this._outsideClickListener);
  }

  disconnectedCallback() {
    if (this._outsideClickListener) {
      document.removeEventListener('click', this._outsideClickListener);
    }
  }

  update() {
    if (!this.metricId) {
      this.style.display = 'none';
      return;
    }

    // Lấy danh sách chỉ đạo active từ state
    if (typeof window.getActiveDirectivesByIndicator === 'function') {
      this.activeDirectives = window.getActiveDirectivesByIndicator(this.metricId);
    } else {
      this.activeDirectives = [];
    }

    if (this.activeDirectives.length === 0) {
      this.style.display = 'none';
      // Đảm bảo card cha không bị dính class open
      const parent = this.closest('.metric-block');
      if (parent) parent.classList.remove('popover-open');
      return;
    }

    this.style.display = 'block';
    this.render();
  }

  render() {
    // 1. Xác định màu sắc và icon theo độ ưu tiên
    const hasPending = this.activeDirectives.some(d => d.status === 'Đã chỉ đạo' || d.status === 'Chờ phân công');
    const colorClass = hasPending ? 'red' : 'orange';
    const colorHex = hasPending ? '#E24B4A' : '#EF9F27';
    this.style.color = colorHex; // Dùng cho currentColor

    // Tabler icons outline
    const alertTriangleSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 9v4"></path>
        <path d="M12 17h.01"></path>
        <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"></path>
      </svg>
    `;
    const clockSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
        <path d="M12 12v-4"></path>
        <path d="M12 12l3 2"></path>
      </svg>
    `;
    const iconSvg = hasPending ? alertTriangleSvg : clockSvg;

    // 2. Icon hoặc Số đếm khoanh tròn ở giữa ribbon
    let centerHtml = '';
    if (this.activeDirectives.length === 1) {
      centerHtml = `<div class="directive-ribbon-icon">${iconSvg}</div>`;
    } else {
      centerHtml = `<div class="directive-ribbon-center-count">${this.activeDirectives.length}</div>`;
    }

    // 3. Popover HTML (khi có >= 2 chỉ đạo)
    let popoverHtml = '';
    if (this.activeDirectives.length >= 2) {
      const itemsHtml = this.activeDirectives.map(d => {
        let statusClass = 'status-pending';
        if (d.status === 'Chờ phân công') statusClass = 'status-assigned';
        if (d.status === 'Đang xử lý') statusClass = 'status-processing';
        if (d.status === 'Đã có báo cáo') statusClass = 'status-reported';

        let iconColor = '#E24B4A';
        let itemIcon = alertTriangleSvg;
        if (d.status === 'Đang xử lý' || d.status === 'Đã có báo cáo') {
          iconColor = '#EF9F27';
          itemIcon = clockSvg;
        }

        const shortTitle = d.content && d.content.length > 35 
          ? d.content.substring(0, 35) + '...' 
          : (d.content || '');

        return `
          <div class="directive-ribbon-popover-item" data-id="${d.id}">
            <div class="directive-ribbon-popover-item-icon" style="color: ${iconColor}; width: 14px; height: 14px;">
              ${itemIcon}
            </div>
            <div class="directive-ribbon-popover-item-text" title="${d.content || ''}">${shortTitle}</div>
            <span class="directive-ribbon-popover-item-status ${statusClass}">${d.status}</span>
          </div>
        `;
      }).join('');

      popoverHtml = `
        <div class="directive-ribbon-popover">
          ${itemsHtml}
        </div>
      `;
    }

    this.innerHTML = `
      <div class="directive-ribbon-triangle ${colorClass}"></div>
      ${centerHtml}
      ${popoverHtml}
    `;

    // Gắn click handler
    const triangle = this.querySelector('.directive-ribbon-triangle');
    const icon = this.querySelector('.directive-ribbon-icon');
    
    const handleClick = (e) => {
      e.stopPropagation();
      
      // Đóng các popover khác đang mở
      document.querySelectorAll('directive-ribbon').forEach(rb => {
        if (rb !== this) rb.closePopover();
      });

      if (this.activeDirectives.length === 1) {
        if (typeof window.viewDirectiveDetail === 'function') {
          window.viewDirectiveDetail(this.activeDirectives[0].id);
        }
      } else if (this.activeDirectives.length >= 2) {
        if (this.isPopoverOpen) {
          this.closePopover();
        } else {
          this.openPopover();
        }
      }
    };

    if (triangle) triangle.addEventListener('click', handleClick);
    if (icon) icon.addEventListener('click', handleClick);

    this.querySelectorAll('.directive-ribbon-popover-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const dirId = item.getAttribute('data-id');
        this.closePopover();
        if (typeof window.viewDirectiveDetail === 'function') {
          window.viewDirectiveDetail(dirId);
        }
      });
    });
  }

  openPopover() {
    const popover = this.querySelector('.directive-ribbon-popover');
    const parent = this.closest('.metric-block');
    if (popover) {
      popover.classList.add('open');
      this.isPopoverOpen = true;
      if (parent) parent.classList.add('popover-open');
    }
  }

  closePopover() {
    const popover = this.querySelector('.directive-ribbon-popover');
    const parent = this.closest('.metric-block');
    if (popover) {
      popover.classList.remove('open');
      this.isPopoverOpen = false;
      if (parent) parent.classList.remove('popover-open');
    }
  }
}

if (!customElements.get('directive-ribbon')) {
  customElements.define('directive-ribbon', DirectiveRibbon);
}

// ----- Actions & Modals mới (Confirm Delete, File Preview, Download, Single Urge) -----
let pendingDeleteId = null;
let currentPreviewingFileName = '';

window.openDeleteConfirmModal = function (id, event) {
  if (event) event.stopPropagation();
  closeAllDirectiveActionsMenus();
  pendingDeleteId = id;
  const modal = document.getElementById('deleteConfirmModal');
  if (modal) modal.classList.add('open');
};

window.closeDeleteConfirmModal = function () {
  pendingDeleteId = null;
  const modal = document.getElementById('deleteConfirmModal');
  if (modal) modal.classList.remove('open');
};

window.confirmDeleteDirectiveSubmit = function () {
  if (!pendingDeleteId) return;
  const idx = directives.findIndex(d => d.id === pendingDeleteId);
  if (idx !== -1) {
    directives.splice(idx, 1);
    saveDirectives();
    applyDirectiveIndicators();
    populateDirectiveList();
    showToast('🗑️ Đã xóa chỉ đạo thành công!');
  }
  closeDeleteConfirmModal();
};

window.openFilePreviewModal = function (fileName) {
  currentPreviewingFileName = fileName;
  const elName = document.getElementById('previewFileName');
  if (elName) elName.textContent = fileName;
  const modal = document.getElementById('filePreviewModal');
  if (modal) modal.classList.add('open');
};

window.closeFilePreviewModal = function () {
  currentPreviewingFileName = '';
  const modal = document.getElementById('filePreviewModal');
  if (modal) modal.classList.remove('open');
};

window.downloadFile = function (fileName, event) {
  if (event) event.stopPropagation();
  showToast('📥 Đã khởi tạo tải xuống file: ' + fileName);
};

window.downloadPreviewFileAction = function () {
  if (currentPreviewingFileName) {
    showToast('📥 Đã khởi tạo tải xuống file: ' + currentPreviewingFileName);
  }
  closeFilePreviewModal();
};

window.urgeSingleDirective = function (id, event) {
  if (event) event.stopPropagation();
  closeAllDirectiveActionsMenus();
  const dir = directives.find(d => d.id === id);
  if (dir) {
    showToast('📢 Đã gửi đôn đốc chỉ đạo tới: ' + (dir.agency || 'đơn vị tiếp nhận'));
  }
};
