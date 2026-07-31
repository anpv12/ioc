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
// NOTE: directiveFilterStatus and directiveFilterDeadline removed (replaced by multiselect)

let currentDirectiveTab = 'inprogress'; // 'inprogress' | 'done'
let currentPage = 1;

// ----- Flatpickr (Rule 8) -----
const fpDueDate = flatpickr(document.getElementById('formDueDate'), {
  dateFormat: 'd/m/Y',
  minDate: 'today',
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
    el.value = dd + '/' + mm + '/' + yyyy;
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

      // Cập nhật ngày tạo mỗi lần mở (chỉ ngày)
      const now = new Date();
      const createdAtEl = document.getElementById('formCreatedAt');
      if (createdAtEl) {
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yyyy = now.getFullYear();
        createdAtEl.value = dd + '/' + mm + '/' + yyyy;
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

// ----- Multiselect Chỉ số -----
window.toggleMultiselect = function () {
  document.getElementById('formMetricDropdown').classList.toggle('open');
};

document.addEventListener('click', function (e) {
  // 1. Metric Multiselect
  const metricWrap = document.getElementById('formMetricMultiWrap');
  if (metricWrap && !metricWrap.contains(e.target)) {
    const drop = document.getElementById('formMetricDropdown');
    if (drop) drop.classList.remove('open');
  }

  // 2. Agency Multiselect
  const agencyWrap = document.getElementById('formAgencyWrap');
  if (agencyWrap && !agencyWrap.contains(e.target)) {
    const drop = document.getElementById('formAgencyDropdown');
    if (drop) drop.classList.remove('open');
  }

  // 3. Layout Group Radio Dropdown
  const groupWrap = document.getElementById('formLayoutGroupWrap');
  if (groupWrap && !groupWrap.contains(e.target)) {
    const drop = document.getElementById('formLayoutGroupDropdown');
    if (drop) drop.classList.remove('open');
  }

  // 4. Data Page Multiselect
  const pageWrap = document.getElementById('formDataPageMultiWrap');
  if (pageWrap && !pageWrap.contains(e.target)) {
    const drop = document.getElementById('formDataPageDropdown');
    if (drop) drop.classList.remove('open');
  }

  // 5. Directive Action 3-dots Dropdowns
  if (!e.target.closest('.directive-actions-menu-wrap')) {
    document.querySelectorAll('.directive-actions-dropdown.open').forEach(el => el.classList.remove('open'));
  }
});

function getSelectedMetricIds() {
  return Array.from(
    document.querySelectorAll('#formMetricDropdown input[type=checkbox]:checked')
  ).map(cb => cb.value);
}

let selectedFormFiles = [];

function updateMultiselectDisplay() {
  const selected = getSelectedMetricIds();
  const display = document.getElementById('formMetricDisplay');
  if (display) {
    if (selected.length === 0) {
      display.innerHTML = '<span id="formMetricPlaceholder" style="color:var(--text-muted);">-- Chọn chỉ số --</span>';
    } else {
      const labels = selected.map(id => METRIC_LABELS[id] || id);
      display.innerHTML = selected.map(id => {
        const l = METRIC_LABELS[id] || id;
        return '<span class="ms-tag-chip">' + l + ' <i class="fa-solid fa-xmark btn-remove-chip" onclick="uncheckMetricChip(\'' + id + '\', event)"></i></span>';
      }).join('');
    }
  }

  // Tự động sắp xếp các label có checkbox:checked lên đầu dropdown list
  const dropdown = document.getElementById('formMetricDropdown');
  if (dropdown) {
    const labels = Array.from(dropdown.querySelectorAll('label'));
    labels.sort((a, b) => {
      const cbA = a.querySelector('input[type=checkbox]');
      const cbB = b.querySelector('input[type=checkbox]');
      const checkedA = cbA && cbA.checked ? 1 : 0;
      const checkedB = cbB && cbB.checked ? 1 : 0;
      return checkedB - checkedA;
    });
    labels.forEach(lbl => dropdown.appendChild(lbl));
  }
}

window.uncheckMetricChip = function (metricId, event) {
  if (event) event.stopPropagation();
  const cb = document.querySelector('#formMetricDropdown input[value="' + metricId + '"]');
  if (cb) {
    cb.checked = false;
    updateMultiselectDisplay();
  }
};

document.querySelectorAll('#formMetricDropdown input[type=checkbox]').forEach(cb => {
  cb.addEventListener('change', updateMultiselectDisplay);
});

// ----- File Attach & 3-Mode Screen Capture -----
window.toggleCaptureMenu = function (event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById('captureMenuDropdown');
  if (dropdown) {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  }
};

document.addEventListener('click', function () {
  const dropdown = document.getElementById('captureMenuDropdown');
  if (dropdown) dropdown.style.display = 'none';
});

window.executeScreenCapture = function (mode) {
  const dropdown = document.getElementById('captureMenuDropdown');
  if (dropdown) dropdown.style.display = 'none';

  let modeText = 'toàn trang';
  let fileNamePrefix = 'Ảnh_chụp_toàn_trang_';
  if (mode === 'single') {
    modeText = '1 biểu đồ';
    fileNamePrefix = 'Ảnh_chụp_1_biểu_đồ_';
  } else if (mode === 'multi') {
    modeText = 'nhiều biểu đồ';
    fileNamePrefix = 'Ảnh_chụp_nhiều_biểu_đồ_';
  }

  const capName = fileNamePrefix + Date.now().toString().slice(-4) + '.png';
  selectedFormFiles.push({ name: capName, source: 'leader' });
  renderAttachFileList();
  showToast('📷 Đã chụp ảnh màn hình (' + modeText + ') và đính kèm!');
};

window.handleFileAttach = function (input) {
  if (input.files && input.files.length) {
    Array.from(input.files).forEach(f => {
      if (!selectedFormFiles.some(existing => existing.name === f.name)) {
        selectedFormFiles.push({ name: f.name, fileObj: f, source: 'leader' });
      }
    });
  }
  renderAttachFileList();
};

window.removeFormFile = function (index) {
  if (index >= 0 && index < selectedFormFiles.length) {
    selectedFormFiles.splice(index, 1);
    renderAttachFileList();
  }
};

function renderAttachFileList() {
  const list = document.getElementById('formAttachList');
  if (!list) return;
  list.innerHTML = selectedFormFiles.map((f, idx) =>
    '<div class="attach-chip-large" onclick="previewFile(\'' + f.name + '\')">' +
    '<i class="fa-solid fa-file-image" style="color:#1e293b; font-size: var(--fs-md);"></i> ' +
    '<span>' + f.name + '</span>' +
    '<button type="button" class="btn-remove-attach" onclick="event.stopPropagation(); removeFormFile(' + idx + ')" title="Xoá file">&times;</button>' +
    '</div>'
  ).join(' ');
}

// ----- Reject Modal Attachments -----
let rejectFormFiles = [];

window.handleRejectFileAttach = function (input) {
  if (input.files && input.files.length) {
    Array.from(input.files).forEach(f => {
      if (!rejectFormFiles.some(existing => existing.name === f.name)) {
        rejectFormFiles.push({ name: f.name, fileObj: f });
      }
    });
  }
  renderRejectAttachFileList();
};

window.captureRejectScreenAttachment = function () {
  const capName = 'Ảnh_từ_chối_chụp_màn_hình_' + Date.now().toString().slice(-4) + '.png';
  rejectFormFiles.push({ name: capName });
  renderRejectAttachFileList();
  showToast('📷 Đã chụp ảnh màn hình và đính kèm vào lý do từ chối!');
};

window.removeRejectFormFile = function (index) {
  if (index >= 0 && index < rejectFormFiles.length) {
    rejectFormFiles.splice(index, 1);
    renderRejectAttachFileList();
  }
};

function renderRejectAttachFileList() {
  const list = document.getElementById('rejectAttachList');
  if (!list) return;
  list.innerHTML = rejectFormFiles.map((f, idx) =>
    '<div class="attach-chip-large" onclick="previewFile(\'' + f.name + '\')">' +
    '<i class="fa-solid fa-file-image" style="color:#1e293b; font-size: var(--fs-md);"></i> ' +
    '<span>' + f.name + '</span>' +
    '<button type="button" class="btn-remove-attach" onclick="event.stopPropagation(); removeRejectFormFile(' + idx + ')" title="Xoá file">&times;</button>' +
    '</div>'
  ).join(' ');
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
  if (dir.status === 'Kết thúc') return null;
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
  if (dir.status === 'Kết thúc') return '';
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
  // Update tooltip for each clock icon in the directive list (Chỉ lấy ngày dd/mm/yyyy)
  document.querySelectorAll('.deadline-clock-icon').forEach(el => {
    const dueDateStr = el.getAttribute('data-due');
    const tooltip = el.querySelector('.deadline-tooltip');
    if (!dueDateStr || !tooltip) return;

    const targetDate = parseDDMMYYYY(dueDateStr);
    if (!targetDate) {
      tooltip.textContent = 'Hạn: ' + dueDateStr;
      return;
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target.getTime() - now.getTime()) / 86400000);
    if (diffDays < 0) {
      tooltip.textContent = 'Quá hạn ' + Math.abs(diffDays) + ' ngày';
    } else if (diffDays === 0) {
      tooltip.textContent = 'Hôm nay là hạn xử lý';
    } else {
      tooltip.textContent = 'Còn ' + diffDays + ' ngày';
    }
  });

  // Update modal countdown if open (Chỉ hiển thị ngày)
  if (activeDetailDirectiveId) {
    const modalEl = document.getElementById('modalCountdownText');
    if (modalEl) {
      const dir = directives.find(d => d.id === activeDetailDirectiveId);
      if (dir && dir.status !== 'Kết thúc' && dir.dueDate) {
        const dueDateClean = dir.dueDate.split(' ')[0];
        modalEl.innerHTML = '<span style="color:#2e7d32; font-weight:bold; font-size: var(--fs-xs);">(Hạn xử lý: ' + dueDateClean + ')</span>';
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

  const countEl = document.getElementById('drawerNotificationCount');
  const bannerEl = document.getElementById('drawerNotificationBanner');
  if (countEl) {
    if (total > 0) {
      countEl.textContent = 'Có ' + total + ' chỉ đạo cần xử lý';
      if (bannerEl) {
        bannerEl.style.background = '#fef2f2';
        bannerEl.style.borderColor = '#fca5a5';
        bannerEl.style.color = '#dc2626';
        const bellIcon = bannerEl.querySelector('i');
        if (bellIcon) {
          bellIcon.style.color = '#dc2626';
          bellIcon.className = 'fa-solid fa-triangle-exclamation'; // Warning icon
        }
      }
    } else {
      countEl.textContent = 'Không có chỉ đạo cần xử lý';
      if (bannerEl) {
        bannerEl.style.background = '#f8fafc';
        bannerEl.style.borderColor = '#e2e8f0';
        bannerEl.style.color = '#64748b';
        const bellIcon = bannerEl.querySelector('i');
        if (bellIcon) {
          bellIcon.style.color = '#64748b';
          bellIcon.className = 'fa-solid fa-bell'; // Reset icon
        }
      }
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
  return; // Disable ribbon indicator creation
  document.querySelectorAll('.metric-block').forEach(card => {
    card.classList.remove('has-directive-pending', 'has-directive-processing', 'has-directive-completed', 'has-directive-rejected');
    const old = card.querySelector('.directive-badge');
    if (old) old.remove();
  });

  const orders = {
    'Bị từ chối': 4,
    'Chờ phê duyệt': 3,
    'Đã có báo cáo': 2,
    'Kết thúc': 1
  };
  const metricMap = {};
  directives.forEach(d => {
    const ids = d.metricIds && d.metricIds.length ? d.metricIds : (d.metricId ? [d.metricId] : []);
    ids.forEach(mid => {
      if (!metricMap[mid] || (orders[d.status] || 0) > (orders[metricMap[mid].status] || 0)) {
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
// Các đơn vị đã tiếp nhận chỉ đạo khi mở luồng Sửa: chỉ được thêm mới, không được xoá
let lockedAgencies = [];

window.isAgencyLocked = function (name) {
  return lockedAgencies.includes((name || '').trim());
};

// Khoá checkbox + gắn nhãn ổ khoá cho các đơn vị đã tiếp nhận chỉ đạo.
// Không dùng tooltip title — chỉ dấu trực quan là icon ổ khoá; sai thao tác thì báo bằng toast.
window.applyAgencyLockUI = function () {
  document.querySelectorAll('#formAgencyDropdown input[name="agencyCb"]').forEach(cb => {
    const label = cb.closest('.ms-opt');
    const locked = isAgencyLocked(cb.value);

    cb.disabled = locked;
    if (locked) cb.checked = true;

    if (label) label.classList.toggle('ms-opt-locked', locked);
  });
};

window.openDirectiveFormModal = function (editId = null) {
  editingDirectiveId = editId;
  const modalTitle = document.getElementById('directiveFormModalTitle');
  const submitBtn = document.getElementById('btnSubmitDirectiveModal');

  if (editId) {
    const dir = directives.find(d => d.id === editId);
    if (!dir) return;
    if (modalTitle) modalTitle.textContent = 'Chỉnh sửa chỉ đạo điều hành';
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Cập nhật chỉ đạo';

    if (fpDueDate) {
      fpDueDate.set('minDate', null); // Cho phép giữ ngày cũ nếu đang edit
    }

    // Set form fields
    const createdAtEl = document.getElementById('formCreatedAt');
    if (createdAtEl) createdAtEl.value = dir.createdAt ? dir.createdAt.split(' ')[0] : '';

    // Nguồn dữ liệu & Hình ảnh (Mặc định Dashboard theo UI mới)
    const pageGroup = document.getElementById('formDataPageGroup');
    const sourceGroup = document.getElementById('formDataSourceGroup');
    const sourceLinks = document.getElementById('formDataSourceLinks');
    const screenshotPreview = document.getElementById('formScreenshotPreview');

    if (pageGroup) pageGroup.style.display = 'none';
    if (sourceGroup) sourceGroup.style.display = 'block';

    if (sourceLinks) {
      sourceLinks.innerHTML = `<a href="index.html" class="ds-link" target="_blank" style="display:inline-flex; align-items:center; gap:4px; font-size: var(--fs-xs); font-weight:600; color:#0284c7; text-decoration:none; padding:4px 8px; background:#e0f2fe; border-radius:4px; border:1px solid #bae6fd; align-self:flex-start;"><i class="fa-solid fa-link"></i> Tình hình dân cư theo giới tính</a>`;
    }

    if (screenshotPreview) {
      screenshotPreview.innerHTML = `<div style="position:relative; border:1px solid #cbd5e1; border-radius:6px; overflow:hidden; cursor:pointer;" onclick="openImageZoomModal('image/IOC_TinhHinhDanCuTheoGioiTinh.png')">
        <img src="image/IOC_TinhHinhDanCuTheoGioiTinh.png" onerror="this.src='https://via.placeholder.com/600x300?text=Dashboard+Screenshot'" alt="Dashboard Screenshot" style="width:100%; max-height:220px; object-fit:cover; display:block; object-position: top;">
        <div style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.7); color:#fff; font-size: var(--fs-2xs); padding:3px 8px; border-radius:4px; font-weight:600; display:flex; align-items:center; gap:4px;" onclick="event.stopPropagation(); openImageZoomModal('image/IOC_TinhHinhDanCuTheoGioiTinh.png')"><i class="fa-solid fa-expand"></i> Xem toàn bộ hình ảnh</div>
      </div>`;
    }

    // Khôi phục Đơn vị xử lý (Checkbox Multi-select)
    const agencyCbs = Array.from(document.querySelectorAll('#formAgencyDropdown input[name="agencyCb"]'));
    const isAllProvinceDir = dir.agency === 'Chỉ đạo toàn tỉnh' || dir.agency === 'Toàn tỉnh';

    if (dir.agency) {
      const agencies = isAllProvinceDir
        ? agencyCbs.map(cb => cb.value)
        : dir.agency.split(',').map(s => s.trim()).filter(Boolean);

      agencyCbs.forEach(cb => { cb.checked = agencies.includes(cb.value); });
      const cbAll = document.getElementById('selectAllAgencyForm');
      if (cbAll) cbAll.checked = isAllProvinceDir;

      // Các đơn vị đang có trong chỉ đạo = đã tiếp nhận => khoá, không cho xoá
      lockedAgencies = agencyCbs.filter(cb => cb.checked).map(cb => cb.value);
    } else {
      agencyCbs.forEach(cb => { cb.checked = false; });
      lockedAgencies = [];
    }

    applyAgencyLockUI();
    if (typeof selectAgencyMulti === 'function') selectAgencyMulti();
    // (dir.title is removed)
    if (dir.content) document.getElementById('formContent').value = dir.content;
    const dirSelect = document.getElementById('formDirector');
    if (dirSelect) dirSelect.value = 'Chủ tịch UBND Tỉnh';
    if (dir.dueDate && fpDueDate) fpDueDate.setDate(dir.dueDate);

    // Populate attach files
    selectedFormFiles = (dir.attachments || []).filter(f => f.source === 'leader' || !f.source).map(f => ({ name: f.name, source: 'leader' }));
    renderAttachFileList();
  } else {
    if (modalTitle) modalTitle.textContent = 'Thêm mới chỉ đạo điều hành';
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Gửi chỉ đạo';

    if (fpDueDate) {
      fpDueDate.set('minDate', 'today');
      fpDueDate.setDate(new Date(Date.now() + 7 * 86400000));
    }

    // Set current date dd/mm/yyyy
    const now = new Date();
    const createdAtEl = document.getElementById('formCreatedAt');
    if (createdAtEl) {
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      createdAtEl.value = dd + '/' + mm + '/' + yyyy;
    }

    // Reset form
    const groupSelect = document.getElementById('formLayoutGroup');
    if (groupSelect) groupSelect.value = '';
    const pageGroup = document.getElementById('formDataPageGroup');
    const sourceGroup = document.getElementById('formDataSourceGroup');
    const sourceLinks = document.getElementById('formDataSourceLinks');
    const screenshotPreview = document.getElementById('formScreenshotPreview');

    if (pageGroup) pageGroup.style.display = 'none';
    if (sourceGroup) sourceGroup.style.display = 'block';

    // Sinh link page hiện tại
    if (sourceLinks) {
      sourceLinks.innerHTML = `<a href="index.html" class="ds-link" target="_blank" style="display:inline-flex; align-items:center; gap:4px; font-size: var(--fs-xs); font-weight:600; color:#0284c7; text-decoration:none; padding:4px 8px; background:#e0f2fe; border-radius:4px; border:1px solid #bae6fd; align-self:flex-start;"><i class="fa-solid fa-link"></i> Tình hình dân cư theo giới tính</a>`;
    }

    // Sinh ảnh page hiện tại
    if (screenshotPreview) {
      screenshotPreview.innerHTML = `<div style="position:relative; border:1px solid #cbd5e1; border-radius:6px; overflow:hidden; cursor:pointer;" onclick="openImageZoomModal('image/IOC_TinhHinhDanCuTheoGioiTinh.png')">
        <img src="image/IOC_TinhHinhDanCuTheoGioiTinh.png" onerror="this.src='https://via.placeholder.com/600x300?text=Dashboard+Screenshot'" alt="Dashboard Screenshot" style="width:100%; max-height:220px; object-fit:cover; display:block; object-position: top;">
        <div style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.7); color:#fff; font-size: var(--fs-2xs); padding:3px 8px; border-radius:4px; font-weight:600; display:flex; align-items:center; gap:4px;" onclick="event.stopPropagation(); openImageZoomModal('image/IOC_TinhHinhDanCuTheoGioiTinh.png')"><i class="fa-solid fa-expand"></i> Xem toàn bộ hình ảnh</div>
      </div>`;
    }

    document.getElementById('formAgency').value = '';
    document.querySelectorAll('#formAgencyDropdown input[type=checkbox]').forEach(cb => cb.checked = false);
    lockedAgencies = [];
    applyAgencyLockUI();
    if (typeof selectAgencyMulti === 'function') selectAgencyMulti();

    // formTitle is removed
    document.getElementById('formContent').value = '';
    const dirSelect = document.getElementById('formDirector');
    if (dirSelect) dirSelect.value = 'Chủ tịch UBND Tỉnh';
    if (fpDueDate) fpDueDate.clear();
    selectedFormFiles = [];
    renderAttachFileList();
  }

  document.getElementById('directiveFormModal').classList.add('open');
};

window.closeDirectiveFormModal = function () {
  document.getElementById('directiveFormModal').classList.remove('open');
  editingDirectiveId = null;
  lockedAgencies = [];
  applyAgencyLockUI();
};

window.saveDirectiveFromModal = function () {
  const layoutGroup = document.getElementById('formLayoutGroup').value;
  const checkedPages = Array.from(document.querySelectorAll('.data-page-cb:checked'));
  const dataPageIds = checkedPages.map(cb => cb.value);
  const dataPageNames = checkedPages.map(cb => cb.getAttribute('data-name'));
  const dataSourceUrls = checkedPages.map(cb => ({ name: cb.getAttribute('data-name'), url: cb.getAttribute('data-url') }));

  const agency = document.getElementById('formAgency').value;
  // title is removed
  const contentEl = document.getElementById('formContent');
  const content = contentEl ? contentEl.value.trim() : '';
  const dueDate = document.getElementById('formDueDate').value;
  const director = 'Chủ tịch UBND Tỉnh';

  if (!agency || !content) {
    showToast('Vui lòng nhập đầy đủ các thông tin bắt buộc (*)', 'error');
    return;
  }

  if (!dueDate) {
    showToast('Vui lòng chọn Hạn xử lý', 'error');
    return;
  }
  const dateParts = dueDate.split('/');
  if (dateParts.length === 3) {
    const selectedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today && !editingDirectiveId) {
      showToast('Hạn xử lý phải là ngày trong tương lai (từ hôm nay trở đi)', 'error');
      return;
    }
  }
  
  let agencies = [];
  const isAllProvince = agency === 'Chỉ đạo toàn tỉnh' || agency === 'Toàn tỉnh';
  const finalAgency = isAllProvince ? 'Chỉ đạo toàn tỉnh' : agency;

  // Ràng buộc luồng Sửa: không được bỏ đơn vị đã tiếp nhận chỉ đạo
  if (editingDirectiveId && lockedAgencies.length && !isAllProvince) {
    const submitted = agency.split(',').map(s => s.trim());
    const removed = lockedAgencies.filter(name => !submitted.includes(name));
    if (removed.length) {
      showToast('Không thể xoá đơn vị đã tiếp nhận chỉ đạo: ' + removed.join(', '), 'error');
      return;
    }
  }

  if (isAllProvince) {
    agencies = generate105Agencies(dueDate);
  } else {
    const agenciesList = agency.split(', ').filter(a => a.trim());
    agencies = agenciesList.map(name => ({
      name: name.trim(),
      pic: 'Đại diện ' + name.trim(),
      dueDate: dueDate,
      status: 'Chờ phân công',
      report: ''
    }));
  }

  const attachments = selectedFormFiles.map(f => ({ name: f.name, source: 'leader' }));
  const createdAtEl = document.getElementById('formCreatedAt');
  const createdAt = createdAtEl ? createdAtEl.value.split(' ')[0] : formatDateDMY(new Date());

  if (editingDirectiveId) {
    const dir = directives.find(d => d.id === editingDirectiveId);
    if (dir) {
      dir.layoutGroup = layoutGroup;
      dir.dataPageIds = dataPageIds;
      dir.dataPageNames = dataPageNames;
      dir.dataSourceUrls = dataSourceUrls;
      dir.agency = finalAgency;
      // title removed
      dir.content = content;
      dir.dueDate = dueDate;
      dir.director = director;
      dir.attachments = attachments;
      if (!dir.agencies) dir.agencies = [];
      const prevAgencies = dir.agencies;
      // Merge agencies
      const merged = agencies.map(newAg => {
        const existing = prevAgencies.find(x => x.name === newAg.name);
        return existing ? { ...existing, dueDate } : newAg;
      });
      // Giữ lại đơn vị đã tiếp nhận chỉ đạo nếu danh sách mới không chứa (vd. nâng lên toàn tỉnh)
      prevAgencies.forEach(oldAg => {
        if (!merged.some(x => x.name === oldAg.name)) {
          merged.push({ ...oldAg, dueDate });
        }
      });
      dir.agencies = merged;

      saveDirectives();
      showToast('Cập nhật chỉ đạo thành công!');
    }
  } else {
    directives.unshift({
      id: 'dir_' + Date.now(),
      layoutGroup,
      dataPageIds,
      dataPageNames,
      dataSourceUrls,
      metricIds: dataPageIds,
      metricId: dataPageIds[0],
      agency: finalAgency,
      agencies, // for multi-agency
      director,
      creator: director,
      // title removed
      content,
      dueDate,
      reportDueDate: '',
      attachments,
      status: 'Chờ phân công',
      report: '',
      createdAt
    });
    saveDirectives();
    showToast('Tạo và gửi chỉ đạo mới thành công!');
  }

  closeDirectiveFormModal();
  currentPage = 1;
  populateUI();
};

// ----- Flow Đôn Đốc Trực Tiếp kèm Validation -----
window.submitBatchUrgeDirectives = function () {
  const organSelect = document.getElementById('directiveFilterOrganzation');
  const selectedAgency = organSelect ? organSelect.value : 'Tất cả';

  // Kiểm tra đã chọn chỉ đạo nào để đôn đốc chưa
  const checkedCbs = document.querySelectorAll('.directive-item-cb:checked');
  if (checkedCbs.length === 0) {
    showToast('Vui lòng chọn ít nhất một chỉ đạo để đôn đốc.', 'error');
    return;
  }

  // Gửi đôn đốc thành công
  const targetText = selectedAgency && selectedAgency !== 'Tất cả' ? (' tới ' + selectedAgency) : '';
  showToast('📢 Đã gửi đôn đốc ' + checkedCbs.length + ' chỉ đạo' + targetText + ' thành công!');

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
  const filterOrgValues = Array.from(document.querySelectorAll('#filterOrgDropdown input[type=checkbox]:checked'))
    .map(cb => cb.value).filter(val => val && val !== 'on');
  const filterStatusValues = Array.from(document.querySelectorAll('#filterStatusDropdown input[type=checkbox]:checked'))
    .map(cb => cb.value).filter(val => val && val !== 'on');
  const filterDeadlineValues = Array.from(document.querySelectorAll('#filterDeadlineDropdown input[type=checkbox]:checked'))
    .map(cb => cb.value).filter(val => val && val !== 'on');

  const fromDateStr = document.getElementById('filterDateFrom') ? document.getElementById('filterDateFrom').value : '';
  const toDateStr = document.getElementById('filterDateTo') ? document.getElementById('filterDateTo').value : '';
  const fromDate = fromDateStr ? parseDDMMYYYY(fromDateStr) : null;
  const toDate = toDateStr ? parseDDMMYYYY(toDateStr) : null;

  // Tab filter groups
  const TAB_STATUSES = {
    inprogress: ['Chờ phân công', 'Đang xử lý', 'Đã có báo cáo', 'Chờ phê duyệt', 'Bị từ chối'],
    done: ['Kết thúc']
  };
  const tabStatuses = TAB_STATUSES[currentDirectiveTab] || TAB_STATUSES.inprogress;

  const filteredDirectives = directives.filter(dir => {
    const metricLabel = (dir.metricIds || []).map(id => METRIC_LABELS[id] || id).join(' ');
    const matchKW = dir.content.toLowerCase().includes(keyword) ||
      (dir.title || '').toLowerCase().includes(keyword) ||
      metricLabel.toLowerCase().includes(keyword) ||
      (dir.agency || '').toLowerCase().includes(keyword);

    const isAllProvinceDir = dir.agency === 'Chỉ đạo toàn tỉnh' || dir.agency === 'Toàn tỉnh';
    const matchOrg = filterOrgValues.length === 0 ||
      isAllProvinceDir ||
      filterOrgValues.includes(dir.agency) ||
      (dir.agencies && dir.agencies.some(a => filterOrgValues.includes(a.name)));

    const matchStatus = filterStatusValues.length === 0 || filterStatusValues.includes(dir.status);
    const matchTab = tabStatuses.includes(dir.status);
    const matchDL = filterDeadlineValues.length === 0 || filterDeadlineValues.some(val => isMatchDeadlineFilter(dir, val));

    let matchDate = true;
    if (fromDate || toDate) {
      const created = parseDDMMYYYY(dir.createdAt ? dir.createdAt.split(' ')[0] : '');
      if (created) {
        if (fromDate) { const f = new Date(fromDate); f.setHours(0, 0, 0, 0); matchDate = created >= f; }
        if (toDate && matchDate) { const t = new Date(toDate); t.setHours(23, 59, 59, 999); matchDate = created <= t; }
      }
    }

    return matchKW && matchOrg && matchStatus && matchTab && matchDL && matchDate;
  });

  // Badge count — only count non-Kết thúc
  const activeCount = directives.filter(d => d.status !== 'Kết thúc').length;
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

    const sorted = filteredDirectives;
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
      if (dir.status === 'Kết thúc') { statusClass = 'status-completed'; }
      if (dir.status === 'Bị từ chối') { statusClass = 'status-rejected'; }
      if (dir.status === 'Chờ phê duyệt') { statusClass = 'status-waiting-approve'; }

      // Lý do từ chối hiển thị mặc định màu đỏ nổi bật
      // Báo cáo / Lý do từ chối
      const reportHtml = (dir.report && (dir.status === 'Đã có báo cáo' || dir.status === 'Kết thúc' || dir.status === 'Chờ phê duyệt' || dir.status === 'Bị từ chối'))
        ? (dir.status === 'Bị từ chối'
          ? '<div class="rejection-reason-box" style="margin-top:6px;"><div class="rejection-reason-lbl"><i class="fa-solid fa-triangle-exclamation"></i> Lý do từ chối:</div>' + dir.report + '</div>'
          : '<div class="directive-report"><span class="directive-report-lbl"><i class="fa-solid fa-reply"></i> Báo cáo kết quả:</span> ' + dir.report + '</div>')
        : '';

      const deadlineIcon = getDeadlineIconHtml(dir);

      const canEdit = dir.status === 'Chờ phân công' || dir.status === 'Đã chỉ đạo';
      const canDelete = dir.status === 'Chờ phân công' || dir.status === 'Đã chỉ đạo';
      // Ngoài màn danh sách: chỉ ĐƠN VỊ DUY NHẤT ở trạng thái Chờ phê duyệt mới được
      // phê duyệt/từ chối tại đây. Chỉ đạo nhiều đơn vị hoặc toàn tỉnh phải xử lý
      // từng đơn vị trong tab Chi tiết đơn vị, nên ẩn hẳn hai nút.
      const isAllProvinceDirMenu = dir.agency === 'Chỉ đạo toàn tỉnh' || dir.agency === 'Toàn tỉnh';
      const menuAgencyCount = isAllProvinceDirMenu ? 105
        : (dir.agencies ? dir.agencies.length : (dir.agency ? dir.agency.split(',').length : 0));
      const showApproveReject = !isAllProvinceDirMenu && menuAgencyCount <= 1 && dir.status === 'Chờ phê duyệt';

      const leaderFiles = (dir.attachments || []).filter(f => f.source === 'leader' || !f.source);
      const agencyFiles = (dir.attachments || []).filter(f => f.source === 'agency');

      let leaderAttachHtml = '';
      if (leaderFiles.length > 0) {
        leaderAttachHtml = '<div style="margin-top:4px; display:flex; flex-wrap:wrap; gap:3px; align-items:center;">' +
          '<span style="font-size: var(--fs-2xs); font-weight:700; color:#dc2626;"><i class="fa-solid fa-paperclip"></i> Lãnh đạo đính kèm:</span> ' +
          leaderFiles.map(f =>
            '<span class="file-preview-link leader" style="font-size: var(--fs-2xs); padding:2px 7px;" onclick="previewFile(\'' + f.name + '\')">' +
            '<i class="fa-solid fa-file"></i> ' + f.name +
            '<i class="fa-solid fa-download" style="margin-left:4px; opacity:0.8; cursor:pointer;" onclick="event.stopPropagation(); downloadFile(\'' + f.name + '\')" title="Tải về"></i>' +
            '</span>'
          ).join('') +
          '</div>';
      }

      let agencyAttachHtml = '';
      if (agencyFiles.length > 0) {
        agencyAttachHtml = '<div style="margin-top:4px; display:flex; flex-wrap:wrap; gap:3px; align-items:center;">' +
          '<span style="font-size: var(--fs-2xs); font-weight:700; color:#2e7d32;"><i class="fa-solid fa-paperclip"></i> Đơn vị đính kèm:</span> ' +
          agencyFiles.map(f =>
            '<span class="file-preview-link agency" style="font-size: var(--fs-2xs); padding:2px 7px;" onclick="previewFile(\'' + f.name + '\')">' +
            '<i class="fa-solid fa-file"></i> ' + f.name +
            '<i class="fa-solid fa-download" style="margin-left:4px; opacity:0.8; cursor:pointer;" onclick="event.stopPropagation(); downloadFile(\'' + f.name + '\')" title="Tải về"></i>' +
            '</span>'
          ).join('') +
          '</div>';
      }

      const item = document.createElement('div');
      item.className = 'directive-item';
      let totalReceived = dir.agencies ? dir.agencies.length : 1;
      let totalReported = dir.agencies ? dir.agencies.filter(a => a.status === 'Đã có báo cáo' || a.status === 'Chờ phê duyệt' || a.status === 'Kết thúc').length : (dir.status === 'Đã có báo cáo' || dir.status === 'Kết thúc' ? 1 : 0);
      
      const statsHtml = '<div style="margin-top:6px; font-size: var(--fs-xs); color:#475569;">' + 
                        '<strong>Tổng chỉ đạo:</strong> ' + totalReceived + ' đơn vị' + 
                        ' | <strong>Đơn vị đã báo cáo:</strong> ' + totalReported + 
                        '</div>';

      item.innerHTML =
        '<div class="directive-item-header">' +
        '<div class="directive-loc" style="flex: 1; min-width: 0;">' +
        '<div class="metric-tooltip-wrap" style="flex: 1; min-width: 0; padding-right: 8px;">' +
        '<div style="text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight:bold; font-size: var(--fs-sm); color:#0b3d91;">' +
        '<i class="fa-solid fa-chart-bar"></i> ' + dir.content +
        '</div>' +
        '<span class="metric-tooltip">' + dir.content + '</span>' +
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
        '<button onclick="viewDirectiveDetail(\'' + dir.id + '\')" ><i class="fa-regular fa-eye"></i> Xem</button>' +
        (canEdit ? '<button onclick="openDirectiveFormModal(\'' + dir.id + '\')"><i class="fa-regular fa-pen-to-square"></i> Sửa</button>' : '') +
        (canDelete ? '<button onclick="deleteDirective(\'' + dir.id + '\', event)" class="text-danger"><i class="fa-regular fa-trash-can"></i> Xoá</button>' : '') +
        (showApproveReject ? '<button onclick="approveDirective(\'' + dir.id + '\', event)" style="color:#2e7d32;"><i class="fa-regular fa-circle-check"></i> Phê duyệt</button>' : '') +
        (showApproveReject ? '<button onclick="openRejectModal(\'' + dir.id + '\', event)" class="text-danger"><i class="fa-regular fa-circle-xmark"></i> Từ chối</button>' : '') +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
        
      let agenciesHtml = '';
      if (dir.agency === 'Chỉ đạo toàn tỉnh' || dir.agency === 'Toàn tỉnh') {
         agenciesHtml = '<div class="directive-agency" style="color:#059669; font-weight:700;"><i class="fa-solid fa-sitemap"></i> Chỉ đạo toàn tỉnh</div>';
      } else if (dir.agencies && dir.agencies.length > 0) {
        let max3 = dir.agencies.slice(0, 3);
        agenciesHtml = max3.map(a => '<div class="directive-agency" style="margin-bottom:4px;"><i class="fa-regular fa-building"></i> ' + a.name + '</div>').join('');
        if (dir.agencies.length > 3) {
           let others = dir.agencies.slice(3).map(a => a.name).join('&#10;');
           agenciesHtml += `<div class="directive-agency" style="margin-bottom:2px; color:#3b82f6; cursor:pointer;" title="${others}" onclick="viewDirectiveDetail('${dir.id}'); setTimeout(() => switchModalTab('history'), 50)">+ ${(dir.agencies.length - 3)} đơn vị khác (Nhấn để xem chi tiết)</div>`;
        }
      } else if (dir.agency) {
        agenciesHtml = '<div class="directive-agency"><i class="fa-regular fa-building"></i> ' + dir.agency + '</div>';
      }

      item.innerHTML += agenciesHtml + leaderAttachHtml +
        reportHtml +
        agencyAttachHtml +
        statsHtml +
        '<div class="directive-date" style="margin-top:6px;"><i class="fa-regular fa-clock"></i> Hạn: ' + (dir.dueDate ? dir.dueDate.split(' ')[0] : 'N/A') + ' | Tạo: ' + (dir.createdAt ? dir.createdAt.split(' ')[0] : 'N/A') + '</div>';

      fragment.appendChild(item);
    });
    listEl.appendChild(fragment);
  }

  updateUrgeSelectedCounts();
  applyDirectiveIndicators();
}

// ----- Tab switching -----
window.switchDirectiveTab = function (tab) {
  currentDirectiveTab = tab;
  document.querySelectorAll('.drawer-tab').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(tab === 'inprogress' ? 'tabInProgress' : 'tabDone');
  if (activeBtn) activeBtn.classList.add('active');

  // Cập nhật các lựa chọn trạng thái theo từng tab
  const statusDropdown = document.getElementById('filterStatusDropdown');
  if (statusDropdown) {
    const statuses = tab === 'inprogress'
      ? ['Chờ phân công', 'Đang xử lý', 'Đã có báo cáo', 'Chờ phê duyệt', 'Bị từ chối']
      : ['Kết thúc'];
    
    let html = '<div class="fms-select-all-wrap" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 4px;">' +
      '<label class="ms-opt" style="font-weight: 600;"><input type="checkbox" id="selectAllStatus" onchange="toggleSelectAllFilter(\'status\')"> <span>Chọn tất cả</span></label>' +
      '</div>';

    html += statuses.map(s =>
      '<label class="ms-opt"><input type="checkbox" value="' + s + '" onchange="onMultiFilterChange(\'status\')"> <span>' + s + '</span></label>'
    ).join('');

    statusDropdown.innerHTML = html;
  }

  updateFilterLabel('status');
  currentPage = 1;
  populateUI();
};

// ----- Filter multiselect helpers -----
window.toggleFilterDropdown = function (type) {
  const wrapId = type === 'org' ? 'filterOrgWrap' : (type === 'deadline' ? 'filterDeadlineWrap' : 'filterStatusWrap');
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  const isOpen = wrap.classList.contains('open');
  // Close all
  document.querySelectorAll('.filter-multiselect-wrap.open').forEach(w => w.classList.remove('open'));
  if (!isOpen) wrap.classList.add('open');
};

window.toggleSelectAllFilter = function (type) {
  const selectAllId = type === 'org' ? 'selectAllOrg' : (type === 'status' ? 'selectAllStatus' : 'selectAllDeadline');
  const dropId = type === 'org' ? 'filterOrgDropdown' : (type === 'status' ? 'filterStatusDropdown' : 'filterDeadlineDropdown');
  const selectAllCb = document.getElementById(selectAllId);
  if (!selectAllCb) return;

  const isChecked = selectAllCb.checked;
  document.querySelectorAll('#' + dropId + ' input[type=checkbox]').forEach(cb => {
    if (cb !== selectAllCb) cb.checked = isChecked;
  });
  updateFilterLabel(type);
  currentPage = 1;
  populateUI();
};

window.onMultiFilterChange = function (type) {
  updateFilterLabel(type);
};

window.uncheckFilterCb = function(type, value, event) {
  event.stopPropagation();
  if (value === 'all') {
    const selectAllId = type === 'org' ? 'selectAllOrg' : (type === 'status' ? 'selectAllStatus' : 'selectAllDeadline');
    const selectAllCb = document.getElementById(selectAllId);
    if (selectAllCb) {
      selectAllCb.checked = false;
      toggleSelectAllFilter(type);
    }
  } else {
    const dropId = type === 'org' ? 'filterOrgDropdown' : (type === 'deadline' ? 'filterDeadlineDropdown' : 'filterStatusDropdown');
    const cb = document.querySelector(`#${dropId} input[type=checkbox][value="${value}"]`);
    if (cb) {
      cb.checked = false;
      onMultiFilterChange(type);
      applyDirectiveFilters();
    }
  }
};

function updateFilterLabel(type) {
  const dropId = type === 'org' ? 'filterOrgDropdown' : (type === 'deadline' ? 'filterDeadlineDropdown' : 'filterStatusDropdown');
  const labelId = type === 'org' ? 'filterOrgLabel' : (type === 'deadline' ? 'filterDeadlineLabel' : 'filterStatusLabel');
  const wrapId = type === 'org' ? 'filterOrgWrap' : (type === 'deadline' ? 'filterDeadlineWrap' : 'filterStatusWrap');
  const displayId = type === 'org' ? 'filterOrgDisplay' : (type === 'deadline' ? 'filterDeadlineDisplay' : 'filterStatusDisplay');
  const selectAllId = type === 'org' ? 'selectAllOrg' : (type === 'status' ? 'selectAllStatus' : 'selectAllDeadline');

  const allCbs = Array.from(document.querySelectorAll('#' + dropId + ' input[type=checkbox]'));
  const selectAllCb = document.getElementById(selectAllId);
  const optionCbs = allCbs.filter(cb => cb !== selectAllCb);
  const checked = optionCbs.filter(cb => cb.checked);

  if (selectAllCb) {
    selectAllCb.checked = (checked.length === optionCbs.length && optionCbs.length > 0);
  }

  const allChecked = selectAllCb ? selectAllCb.checked : false;

  const display = document.getElementById(displayId);
  const label = document.getElementById(labelId);

  if (!display || !label) return;

  if (checked.length === 0) {
    label.style.display = 'inline';
    label.textContent = type === 'org' ? 'Tất cả đơn vị' : (type === 'deadline' ? 'Tất cả tình trạng' : 'Tất cả trạng thái');
    label.className = 'fms-placeholder';
    display.querySelectorAll('.fms-tag, .fms-count-badge').forEach(el => el.remove());
  } else {
    label.style.display = 'none';
    display.querySelectorAll('.fms-tag, .fms-count-badge').forEach(el => el.remove());
    const chevron = display.querySelector('.filter-multiselect-chevron');

    if (allChecked && type === 'org') {
      const tag = document.createElement('span');
      tag.className = 'fms-tag';
      tag.innerHTML = `Chỉ đạo toàn tỉnh <i class="fa-solid fa-xmark" style="margin-left:4px; cursor:pointer;" onclick="uncheckFilterCb('${type}', 'all', event)"></i>`;
      tag.title = 'Chỉ đạo toàn tỉnh';
      if (chevron) display.insertBefore(tag, chevron);
      else display.appendChild(tag);
    } else {
      const visibleItems = checked.slice(0, 1);
      visibleItems.forEach(cb => {
        const tag = document.createElement('span');
        tag.className = 'fms-tag';
        tag.innerHTML = `${cb.value} <i class="fa-solid fa-xmark" style="margin-left:4px; cursor:pointer;" onclick="uncheckFilterCb('${type}', '${cb.value}', event)"></i>`;
        tag.title = cb.value;
        if (chevron) display.insertBefore(tag, chevron);
        else display.appendChild(tag);
      });

      if (checked.length > 1) {
        const remainingCount = checked.length - 1;
        const badge = document.createElement('span');
        badge.className = 'fms-count-badge';
        badge.textContent = '+' + remainingCount;
        badge.title = 'Đã chọn tổng cộng ' + checked.length + ' mục';
        if (chevron) display.insertBefore(badge, chevron);
        else display.appendChild(badge);
      }
    }
  }
}

window.applyDirectiveFilters = function () {
  currentPage = 1;
  populateUI();
};

window.resetDirectiveFilters = function () {
  // Uncheck all multiselect
  document.querySelectorAll('#filterOrgDropdown input[type=checkbox], #filterStatusDropdown input[type=checkbox], #filterDeadlineDropdown input[type=checkbox]').forEach(cb => {
    cb.checked = false;
  });
  updateFilterLabel('org');
  updateFilterLabel('status');
  updateFilterLabel('deadline');
  // Clear search
  const search = document.getElementById('directiveSearch');
  if (search) search.value = '';
  // Clear dates via flatpickr
  const fpFrom = document.getElementById('filterDateFrom');
  const fpTo = document.getElementById('filterDateTo');
  if (fpFrom && fpFrom._flatpickr) fpFrom._flatpickr.clear();
  else if (fpFrom) fpFrom.value = '';
  if (fpTo && fpTo._flatpickr) fpTo._flatpickr.clear();
  else if (fpTo) fpTo.value = '';
  currentPage = 1;
  populateUI();
};

// ----- Close filter dropdown on outside click -----
document.addEventListener('click', function (e) {
  if (!e.target.closest('.filter-multiselect-wrap')) {
    document.querySelectorAll('.filter-multiselect-wrap.open').forEach(w => w.classList.remove('open'));
  }
});

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
    if (!files.length) return '<span style="color:var(--text-muted); font-size: var(--fs-xs);">Không có</span>';
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
  if (dir.status === 'Kết thúc') statusClass = 'status-completed';
  if (dir.status === 'Bị từ chối') statusClass = 'status-rejected';
  if (dir.status === 'Chờ phê duyệt') statusClass = 'status-waiting-approve';

  let deadlineNote = '';
  if (dir.status !== 'Kết thúc' && dir.dueDate) {
    deadlineNote = '<span id="modalCountdownText"></span>';
  }

  // Build Nhóm dữ liệu, Trang dữ liệu, Nguồn dữ liệu HTML
  const groupNameMap = {
    'giao-duc': 'Giáo dục',
    'quan-ly-van-ban': 'Quản lý văn bản',
    'y-te': 'Y tế',
    'doanh-nghiep': 'Doanh nghiệp',
    'kinh-te-xa-hoi': 'Kinh tế - Xã hội',
    'dich-vu-cong': 'Dịch vụ công',
    'dau-tu-cong': 'Đầu tư công',
    'du-lieu-khac': 'Dữ liệu khác / Dân cư'
  };
  const layoutGroupName = groupNameMap[dir.layoutGroup] || dir.layoutGroup || 'Giám sát Dân cư';

  const dataPagesHtml = (dir.dataPageNames && dir.dataPageNames.length)
    ? dir.dataPageNames.map(p => '<span class="ms-tag-chip" style="font-size: var(--fs-2xs);"><i class="fa-solid fa-file-lines"></i> ' + p + '</span>').join(' ')
    : metricTagsHtml;

  const sourceLinksHtml = (dir.dataSourceUrls && dir.dataSourceUrls.length)
    ? dir.dataSourceUrls.map(u => '<a href="' + u.url + '" target="_blank" class="ds-link" style="display:inline-flex; align-items:center; gap:4px; font-size: var(--fs-xs); font-weight:600; color:#0284c7; text-decoration:none; padding:4px 8px; background:#e0f2fe; border-radius:4px; border:1px solid #bae6fd; align-self:flex-start;"><i class="fa-solid fa-link"></i> ' + u.name + '</a>').join(' ')
    : '<a href="index.html" class="ds-link" target="_blank" style="display:inline-flex; align-items:center; gap:4px; font-size: var(--fs-xs); font-weight:600; color:#0284c7; text-decoration:none; padding:4px 8px; background:#e0f2fe; border-radius:4px; border:1px solid #bae6fd; align-self:flex-start;"><i class="fa-solid fa-link"></i> Tình hình dân cư theo giới tính</a>';

  const imageSrc = 'image/IOC_TinhHinhDanCuTheoGioiTinh.png';

  const tabInfoHtml =
    // 1. Nguồn dữ liệu
    '<div class="form-group" style="margin-bottom:12px;">' +
    '<label style="font-weight:700; font-size: var(--fs-sm); color:#1e293b; display:block; margin-bottom:6px;">Nguồn dữ liệu</label>' +
    '<div style="padding:8px 12px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; display:flex; flex-wrap:wrap; gap:4px; min-height:36px; align-items:center;">' + sourceLinksHtml + '</div>' +
    '</div>' +

    // 2. Hình ảnh chỉ đạo
    '<div class="form-group" style="margin-bottom:12px;">' +
    '<label style="font-weight:700; font-size: var(--fs-sm); color:#1e293b; display:block; margin-bottom:6px;">Hình ảnh chỉ đạo</label>' +
    '<div style="margin-top:4px;">' +
    '<div style="position:relative; border:1px solid #cbd5e1; border-radius:6px; overflow:hidden; cursor:pointer;" onclick="openImageZoomModal(\'' + imageSrc + '\')"><img src="' + imageSrc + '" onerror="this.src=\'https://via.placeholder.com/600x300?text=Dashboard+Screenshot\'" alt="Dashboard Screenshot" style="width:100%; max-height:180px; object-fit:cover; display:block; object-position: top;"><div style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.7); color:#fff; font-size: var(--fs-2xs); padding:3px 8px; border-radius:4px; font-weight:600; display:flex; align-items:center; gap:4px;" onclick="event.stopPropagation(); openImageZoomModal(\'' + imageSrc + '\')"><i class="fa-solid fa-expand"></i> Xem toàn bộ hình ảnh</div></div>' +
    '</div>' +
    '</div>' +

    // 3. Nội dung chỉ đạo
    '<div class="form-group" style="margin-bottom:12px;">' +
    '<label style="font-weight:700; font-size: var(--fs-sm); color:#1e293b; display:block; margin-bottom:6px;">Nội dung chỉ đạo</label>' +
    '<div style="padding:10px 12px; background:#fef2f2; border:1px solid #fca5a5; border-radius:6px; font-size: var(--fs-sm); line-height:1.6; color:#dc2626; font-weight:600;">' + dir.content + '</div>' +
    '</div>' +

    // 4. Hàng đôi: Đơn vị xử lý & Hạn xử lý
    '<div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px;">' +
    '<div class="form-group" style="flex:1; min-width:200px;">' +
    '<label style="font-weight:700; font-size: var(--fs-sm); color:#1e293b; display:block; margin-bottom:6px;">Đơn vị xử lý</label>' +
    '<div style="padding:8px 12px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; font-size: var(--fs-sm); color:#0f172a;">' + ((dir.agency === 'Chỉ đạo toàn tỉnh' || dir.agency === 'Toàn tỉnh') ? '<span style="color:#059669; font-weight:bold;">Chỉ đạo toàn tỉnh (105 đơn vị)</span>' : (dir.agencies ? dir.agencies.map(a => a.name).join(', ') : (dir.agency || 'N/A'))) + '</div>' +
    '</div>' +
    '<div class="form-group" style="flex:1; min-width:130px;">' +
    '<label style="font-weight:700; font-size: var(--fs-sm); color:#1e293b; display:block; margin-bottom:6px;">Hạn xử lý</label>' +
    '<div style="padding:8px 12px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; font-size: var(--fs-sm); color:#0f172a;">' + (dir.dueDate ? dir.dueDate.split(' ')[0] : 'Không giới hạn') + '</div>' +
    '</div>' +
    '</div>' +

    // 5. Hàng đôi: Người chỉ đạo & Ngày tạo
    '<div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px;">' +
    '<div class="form-group" style="flex:1; min-width:130px;">' +
    '<label style="font-weight:700; font-size: var(--fs-sm); color:#1e293b; display:block; margin-bottom:6px;">Người chỉ đạo</label>' +
    '<div style="padding:8px 12px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; font-size: var(--fs-sm); color:#475569;">' + (dir.creator || dir.director || 'Chủ tịch UBND Tỉnh') + '</div>' +
    '</div>' +
    '<div class="form-group" style="flex:1; min-width:130px;">' +
    '<label style="font-weight:700; font-size: var(--fs-sm); color:#1e293b; display:block; margin-bottom:6px;">Ngày tạo</label>' +
    '<div style="padding:8px 12px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; font-size: var(--fs-sm); color:#475569;">' + (dir.createdAt ? dir.createdAt.split(' ')[0] : 'N/A') + '</div>' +
    '</div>' +
    '</div>' +

    // 6. Tài liệu đính kèm
    '<div class="form-group" style="margin-bottom:12px;">' +
    '<label style="font-weight:700; font-size: var(--fs-sm); color:#1e293b; display:block; margin-bottom:6px;">Tài liệu đính kèm</label>' +
    '<div style="padding:8px 12px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; display:flex; flex-wrap:wrap; gap:6px;">' +
    (leaderFiles.length > 0 ? buildFileLinks(leaderFiles, 'leader') : '<span style="font-size: var(--fs-sm); color:var(--text-muted);">Không có tài liệu</span>') +
    '</div>' +
    '</div>' +

    // 7. Trạng thái (và lý do từ chối nếu bị từ chối)
    '<div class="form-group" style="margin-bottom:12px;">' +
    '<label style="font-weight:700; font-size: var(--fs-sm); color:#1e293b; display:block; margin-bottom:6px;">Trạng thái</label>' +
    '<div style="padding:8px 12px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; font-size: var(--fs-sm); display:flex; align-items:center;">' +
    '<span class="directive-status ' + statusClass + '">' + dir.status + '</span>' +
    '</div>' +
    '</div>' +

    (dir.status === 'Bị từ chối' && dir.report ?
      '<div class="form-group" style="margin-bottom:12px;">' +
      '<label style="font-weight:700; font-size: var(--fs-sm); color:#9b2c2c; display:block; margin-bottom:6px;"><i class="fa-solid fa-circle-xmark"></i> Lý do từ chối</label>' +
      '<div style="padding:10px 12px; background:#fef2f2; border:1px solid #fca5a5; border-radius:6px; font-size: var(--fs-sm); color:#9b2c2c; line-height:1.6;">' + dir.report + '</div>' +
      '</div>'
    : '');

  document.getElementById('tabContentInfo').innerHTML = tabInfoHtml;

  // ----- Tab 2: Chi tiết đơn vị -----
  let agencies = dir.agencies;
  if (!agencies || (agencies.length === 1 && (agencies[0].name === 'Chỉ đạo toàn tỉnh' || agencies[0].name === 'Toàn tỉnh'))) {
    if (dir.agency === 'Chỉ đạo toàn tỉnh' || dir.agency === 'Toàn tỉnh') {
      agencies = generate105Agencies(dir.dueDate);
      dir.agencies = agencies;
    } else {
      agencies = dir.agency ? [{ name: dir.agency, pic: 'Đại diện', dueDate: dir.dueDate, status: dir.status, report: dir.report }] : [];
    }
  }

  const detailModalCard = document.querySelector('#detailModal .modal-card');
  if (detailModalCard) detailModalCard.style.height = 'auto'; // Reset height

  const tabHistory = document.getElementById('tabContentHistory');
  if (tabHistory) {
    if (agencies.length > 5) {
      tabHistory.style.flex = 'none';
      tabHistory.style.height = '480px'; // Cố định chiều cao tab để khi chọn số dòng lớn hơn không làm pop-up bị nhảy kích thước
    } else {
      tabHistory.style.flex = '1';
      tabHistory.style.height = 'auto';
    }
  }

  const approveAllContainer = document.getElementById('approveAllContainer');
  if (approveAllContainer) {
    if (agencies.length > 1) {
      approveAllContainer.innerHTML = '<button id="btnApproveChecked" class="btn-submit-directive" style="display:none; padding:6px 14px; background:#10b981; color:#fff; border:none; border-radius:6px; font-size: var(--fs-xs); font-weight:bold; cursor:pointer; align-items:center; gap:4px; box-shadow:0 1px 2px rgba(0,0,0,0.05);" onclick="approveAllAgencies(\'' + dir.id + '\')">Phê duyệt các đơn vị đã chọn</button>';
    } else {
      approveAllContainer.innerHTML = '';
    }
  }

  // Pagination logic
  window.currentHistoryPage = 1;
  if (!window.currentHistoryRowsPerPage) window.currentHistoryRowsPerPage = 5;
  window.currentHistoryAgencies = agencies;
  window.currentHistoryDir = dir;

  window.renderHistoryTable = function(page = 1) {
    window.currentHistoryPage = page;
    const itemsPerPage = window.currentHistoryRowsPerPage;
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const currentAgencies = window.currentHistoryAgencies.slice(startIdx, endIdx);
    const totalPages = Math.ceil(window.currentHistoryAgencies.length / itemsPerPage);
    const dir = window.currentHistoryDir;

    let historyHtml = '';
    if (window.currentHistoryAgencies.length === 0) {
      historyHtml = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size: var(--fs-xs);">Không có dữ liệu đơn vị.</div>';
    } else {
      const showCheckbox = window.currentHistoryAgencies.length > 1;
      const headerCbHtml = showCheckbox ? '<input type="checkbox" id="cbAllAgencies" onchange="toggleSelectAllAgencies(this)" style="margin-right:8px; cursor:pointer;"> ' : '';
      
      historyHtml = '<table class="history-table" style="width:100%; border-collapse:collapse; text-align:left; font-size: var(--fs-xs);">' +
        '<thead><tr>' +
        '<th style="padding:10px; border-bottom:1px solid #e2e8f0;"><div style="display:flex; align-items:center;">' + headerCbHtml + 'Đơn vị thực hiện</div></th>' +
        '<th style="padding:10px; border-bottom:1px solid #e2e8f0;">Người phụ trách</th>' +
        '<th style="padding:10px; border-bottom:1px solid #e2e8f0;">Thời hạn</th>' +
        '<th style="padding:10px; border-bottom:1px solid #e2e8f0;">Trạng thái</th>' +
        '<th style="padding:10px; border-bottom:1px solid #e2e8f0;">Kết quả</th>' +
        '<th style="padding:10px; border-bottom:1px solid #e2e8f0;">Thao tác</th>' +
        '</tr></thead><tbody>';

      currentAgencies.forEach(a => {
        let stClass = 'status-pending';
        if (a.status === 'Đang xử lý') stClass = 'status-processing';
        if (a.status === 'Đã có báo cáo') stClass = 'status-reported';
        if (a.status === 'Kết thúc') stClass = 'status-completed';
        if (a.status === 'Bị từ chối') stClass = 'status-rejected';
        if (a.status === 'Chờ phê duyệt') stClass = 'status-waiting-approve';
        
        // Chỉ đơn vị ở Chờ phê duyệt mới thao tác được; các trạng thái khác vẫn
        // hiển thị nút nhưng khoá (chưa báo cáo, đã duyệt, đã từ chối).
        const canApprove = a.status === 'Chờ phê duyệt';
        const canReject = a.status === 'Chờ phê duyệt';

        const btnShared = 'border-radius:6px; font-weight:bold; font-size: var(--fs-xs); display:inline-flex; align-items:center; gap:4px; box-shadow:0 1px 2px rgba(0,0,0,0.05); white-space:nowrap;';

        const approveBtn = canApprove
          ? '<button onclick="approveAgency(\'' + dir.id + '\', \'' + a.name + '\', event)" style="background:#10b981; color:#fff; border:none; padding:6px 12px; cursor:pointer; ' + btnShared + '"><i class="fa-solid fa-check"></i> Phê duyệt</button>'
          : '<button style="background:#a7f3d0; color:#fff; border:none; padding:6px 12px; cursor:not-allowed; ' + btnShared + '" disabled><i class="fa-solid fa-check"></i> Phê duyệt</button>';

        const rejectBtn = canReject
          ? '<button onclick="rejectAgency(\'' + dir.id + '\', \'' + a.name + '\', event)" style="background:#fff; color:#ef4444; border:1px solid #ef4444; padding:5px 12px; cursor:pointer; ' + btnShared + '"><i class="fa-solid fa-xmark"></i> Từ chối</button>'
          : '<button style="background:#fff; color:#fca5a5; border:1px solid #fca5a5; padding:5px 12px; cursor:not-allowed; ' + btnShared + '" disabled><i class="fa-solid fa-xmark"></i> Từ chối</button>';

        const actionHtml = '<div style="display:flex; flex-wrap:nowrap; gap:4px;">' + approveBtn + rejectBtn + '</div>';

        let reportContent = a.report || '<span style="color:#94a3b8; font-style:italic;">Chưa có báo cáo</span>';
        let reportAttachHtml = '';
        if (a.attachments && a.attachments.length > 0) {
           reportAttachHtml = '<div style="margin-top:6px; display:flex; gap:4px; flex-wrap:wrap;">' + 
             a.attachments.map(f => '<span style="font-size: var(--fs-xs); padding:3px 8px; background:#e0f2fe; color:#0284c7; border-radius:4px; cursor:pointer; display:inline-flex; align-items:center; gap:4px;" onclick="previewFile(\'' + f.name + '\')"><i class="fa-solid fa-paperclip"></i> ' + f.name + '</span>').join('') +
             '</div>';
        }

        const rowCbHtml = showCheckbox ? '<input type="checkbox" class="agency-cb" value="' + a.name + '" style="margin-right:8px; cursor:pointer;" onchange="updateCbAllAgencies()"> ' : '';
        
        historyHtml += '<tr style="border-bottom:1px solid #f1f5f9;">' +
          '<td style="padding:10px; font-weight:600; color:#334155;"><div style="display:flex; align-items:center;">' + rowCbHtml + a.name + '</div></td>' +
          '<td style="padding:10px; color:#64748b;">' + a.pic + '</td>' +
          '<td style="padding:10px; color:#64748b;">' + (a.dueDate || dir.dueDate || 'N/A').split(' ')[0] + '</td>' +
          '<td style="padding:10px;"><span class="directive-status ' + stClass + '" style="font-size: var(--fs-2xs); padding:3px 8px;">' + (a.status || 'Chờ phân công') + '</span></td>' +
          '<td style="padding:10px; color:#334155; min-width:200px;">' + reportContent + reportAttachHtml + '</td>' +
          '<td style="padding:10px;">' + actionHtml + '</td>' +
          '</tr>';
      });
      historyHtml += '</tbody></table>';
      
      if (window.currentHistoryAgencies.length > 5) {
        let optionsHtml = [5, 10, 25, 50, 100].map(v => 
          `<option value="${v}" ${itemsPerPage === v ? 'selected' : ''}>${v}</option>`
        ).join('');
        
        let paginationInfo = `${startIdx + 1}-${Math.min(endIdx, window.currentHistoryAgencies.length)}/${window.currentHistoryAgencies.length}`;
        
        historyHtml += `
          <div class="directive-pagination">
            <div class="pagination-limit">
              <span>Hiện:</span>
              <select onchange="window.currentHistoryRowsPerPage=parseInt(this.value); window.renderHistoryTable(1)">
                ${optionsHtml}
              </select>
            </div>
            <div class="pagination-controls">
              <button title="Trang trước" ${page === 1 ? 'disabled' : ''} onclick="renderHistoryTable(${page - 1})"><i class="fa-solid fa-chevron-left"></i></button>
              <span>${paginationInfo}</span>
              <button title="Trang sau" ${page === totalPages ? 'disabled' : ''} onclick="renderHistoryTable(${page + 1})"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
        `;
      }
    }
    document.getElementById('tabContentHistory').innerHTML = historyHtml;
    // Keep cbAllAgencies in sync
    window.updateCbAllAgencies();
  };

  renderHistoryTable(1);

  document.getElementById('detailModal').classList.add('open');
  switchModalTab('info');
};

// ----- Toggle Agency Checkboxes -----
window.toggleSelectAllAgencies = function(el) {
  document.querySelectorAll('.agency-cb').forEach(cb => cb.checked = el.checked);
  window.updateCbAllAgencies();
};
window.updateCbAllAgencies = function() {
  const total = document.querySelectorAll('.agency-cb').length;
  const checked = document.querySelectorAll('.agency-cb:checked').length;
  const cbAll = document.getElementById('cbAllAgencies');
  if (cbAll) {
    cbAll.checked = (total > 0 && total === checked);
    cbAll.indeterminate = (checked > 0 && checked < total);
  }
  const btnApprove = document.getElementById('btnApproveChecked');
  if (btnApprove) {
    btnApprove.style.display = checked > 0 ? 'inline-flex' : 'none';

    // Chỉ mở nút khi trong các đơn vị đang chọn có ít nhất 1 đơn vị Chờ phê duyệt
    const agencies = window.currentHistoryAgencies || [];
    const approvable = Array.from(document.querySelectorAll('.agency-cb:checked')).filter(cb => {
      const a = agencies.find(x => x.name === cb.value);
      return a && a.status === 'Chờ phê duyệt';
    });
    btnApprove.disabled = approvable.length === 0;
    btnApprove.style.opacity = btnApprove.disabled ? '0.5' : '1';
    btnApprove.style.cursor = btnApprove.disabled ? 'not-allowed' : 'pointer';
  }
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

// ----- Reject Directive Modal -----
let rejectingDirectiveId = null;
let rejectingAgencyName = null;

window.openRejectModal = function (id, event) {
  if (event) event.stopPropagation();
  const dir = directives.find(d => d.id === id);
  if (!dir) return;

  rejectingDirectiveId = id;
  document.getElementById('rejectReasonInput').value = '';
  rejectFormFiles = [];
  renderRejectAttachFileList();
  document.getElementById('rejectModal').classList.add('open');
};

window.closeRejectModal = function () {
  document.getElementById('rejectModal').classList.remove('open');
  rejectingDirectiveId = null;
  rejectingAgencyName = null;
  rejectFormFiles = [];
};

window.submitRejectDirective = function () {
  if (!rejectingDirectiveId) return;
  const dir = directives.find(d => d.id === rejectingDirectiveId);
  if (!dir) return;

  const reason = document.getElementById('rejectReasonInput').value.trim();
  if (!reason) {
    showToast('Vui lòng nhập nội dung / lý do từ chối (*)', 'error');
    return;
  }

  if (rejectingAgencyName) {
      const a = dir.agencies.find(x => x.name === rejectingAgencyName);
      if (a) {
          a.status = 'Bị từ chối';
          a.report = (a.report ? a.report + ' | ' : '') + 'Lý do từ chối: ' + reason;
      }
      showToast('❌ Đã từ chối báo cáo của ' + rejectingAgencyName);
  } else {
      dir.status = 'Bị từ chối';
      dir.report = 'Lý do từ chối: ' + reason + ' (Yêu cầu đơn vị tiếp nhận báo cáo lại).';
      if (rejectFormFiles && rejectFormFiles.length > 0) {
        if (!dir.attachments) dir.attachments = [];
        rejectFormFiles.forEach(f => {
          if (!dir.attachments.some(att => att.name === f.name)) {
            dir.attachments.push({ name: f.name, source: 'leader' });
          }
        });
      }
      showToast('❌ Đã từ chối báo cáo chỉ đạo!');
  }

  saveDirectives();
  closeRejectModal();
  populateUI();
  if (rejectingAgencyName) {
      viewDirectiveDetail(rejectingDirectiveId);
  }
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

  // Default filter (exclude Kết thúc)
  const uncompleted = directives.filter(d => d.status !== 'Kết thúc');
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
  selectAllRow.style.cssText = 'display:flex; gap:6px; align-items:center; padding:5px 6px; border-bottom:1px solid #eee; font-size: var(--fs-xs); font-weight:700; color:var(--text-dark); background:#fafafa; border-radius:4px; position:sticky; top:0; z-index:1;';
  selectAllRow.innerHTML = '<input type="checkbox" id="urgeSelectAll" onchange="toggleSelectAllUrge(this)" style="cursor:pointer;"> <span>Chọn tất cả (' + urgeFiltered.length + ' chỉ đạo)</span>';
  listContainer.appendChild(selectAllRow);

  if (pageItems.length === 0) {
    listContainer.innerHTML += '<div style="text-align:center; color:var(--text-muted); padding:10px; font-size: var(--fs-xs);">Không có chỉ đạo nào cần đôn đốc.</div>';
  } else {
    pageItems.forEach(dir => {
      const row = document.createElement('div');
      row.className = 'urge-item-row';
      row.style.cssText = 'display: flex; gap: 6px; align-items: start; padding: 6px; border-bottom: 1px solid #f5f5f5; font-size: var(--fs-xs); cursor: pointer;';
      row.innerHTML =
        '<input type="checkbox" class="urge-item-cb" value="' + dir.id + '" style="margin-top: 2px; cursor:pointer;" onclick="event.stopPropagation(); updateUrgeSelectedCount();">' +
        '<div style="flex:1;" onclick="toggleRowCheckbox(this)">' +
        '<div style="display:flex; justify-content:space-between; font-weight:600; color:var(--magenta);">' +
        '<span>' + dir.agency + '</span>' +
        '<span style="font-size: var(--fs-2xs); font-weight:normal; color:var(--text-muted);">' + (dir.dueDate || 'Không hạn') + '</span>' +
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
document.getElementById('btnToggleDrawer').addEventListener('click', () => {
  const roleSelect = document.getElementById('mockRoleSelect');
  if (roleSelect && roleSelect.value === 'leader_department') {
    window.location.href = '../Quản trị/xu-ly-chi-dao/index.html';
  } else {
    toggleDrawer();
  }
});

document.addEventListener('click', () => {
  document.querySelectorAll('.directive-actions-dropdown').forEach(el => el.classList.remove('open'));
});

directiveSearch.addEventListener('input', () => { currentPage = 1; populateUI(); });
// directiveFilterStatus and directiveFilterDeadline removed — now using multiselect

paginationLimit.addEventListener('change', () => { currentPage = 1; populateUI(); });

btnPrevPage.addEventListener('click', () => { if (currentPage > 1) { currentPage--; populateUI(); } });

btnNextPage.addEventListener('click', () => {
  const keyword = directiveSearch ? directiveSearch.value.trim().toLowerCase() : '';
  const filterOrgValues = Array.from(document.querySelectorAll('#filterOrgDropdown input[type=checkbox]:checked')).map(cb => cb.value);
  const filterStatusValues = Array.from(document.querySelectorAll('#filterStatusDropdown input[type=checkbox]:checked')).map(cb => cb.value);
  const TAB_STATUSES = { inprogress: ['Chờ phân công', 'Đang xử lý', 'Đã có báo cáo', 'Chờ phê duyệt', 'Bị từ chối'], done: ['Kết thúc'] };
  const tabStatuses = TAB_STATUSES[currentDirectiveTab] || TAB_STATUSES.inprogress;
  const filteredLen = directives.filter(dir => {
    const metricLabel = (dir.metricIds || []).map(id => METRIC_LABELS[id] || id).join(' ');
    const matchKW = dir.content.toLowerCase().includes(keyword) || metricLabel.toLowerCase().includes(keyword) || (dir.agency || '').toLowerCase().includes(keyword);
    const matchOrg = filterOrgValues.length === 0 || filterOrgValues.includes(dir.agency);
    const matchStatus = filterStatusValues.length === 0 || filterStatusValues.includes(dir.status);
    const matchTab = tabStatuses.includes(dir.status);
    return matchKW && matchOrg && matchStatus && matchTab;
  }).length;

  const rowsPerPage = parseInt(paginationLimit.value) || 5;
  const totalPages = Math.ceil(filteredLen / rowsPerPage) || 1;
  if (currentPage < totalPages) { currentPage++; populateUI(); }
});

// ----- Init -----
// populateUI() moved to end of file to ensure custom elements are defined first.

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

    if (this.activeDirectives.length === 0 || !isWarningAlertEnabled) {
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

    // 2. Số khoanh tròn thay thế vị trí icon khi có ≥ 2 chỉ đạo active
    let centerHtml = '';
    if (this.activeDirectives.length === 1) {
      centerHtml = `<div class="directive-ribbon-icon">${iconSvg}</div>`;
    } else {
      centerHtml = `<div class="directive-ribbon-number">${this.activeDirectives.length}</div>`;
    }

    // 3. Popover HTML
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

        const shortTitle = d.title && d.title.length > 35
          ? d.title.substring(0, 35) + '...'
          : (d.title || '');

        return `
          <div class="directive-ribbon-popover-item" data-id="${d.id}">
            <div class="directive-ribbon-popover-item-icon" style="color: ${iconColor}; width: 14px; height: 14px;">
              ${itemIcon}
            </div>
            <div class="directive-ribbon-popover-item-text" title="${d.title || ''}">${shortTitle}</div>
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
    const centerEl = this.querySelector('.directive-ribbon-icon, .directive-ribbon-number');

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
    if (centerEl) centerEl.addEventListener('click', handleClick);

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

// ----- Modal Handlers / State -----
let isWarningAlertEnabled = true;
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggleWarningAlert');
  if (toggle) isWarningAlertEnabled = toggle.checked;
});

if (!customElements.get('directive-ribbon')) {
  customElements.define('directive-ribbon', DirectiveRibbon);
}

// ----- Init -----
populateUI();

window.handleWarningToggleChange = function (input) {
  isWarningAlertEnabled = input.checked;
  const blocks = document.querySelectorAll('.metric-block');
  blocks.forEach(b => {
    if (!isWarningAlertEnabled) {
      b.style.animation = 'none';
    } else {
      b.style.animation = '';
    }
  });

  const ribbons = document.querySelectorAll('directive-ribbon');
  ribbons.forEach(r => {
    r.style.display = isWarningAlertEnabled ? 'block' : 'none';
  });

  showToast(isWarningAlertEnabled ? 'Đã bật hiển thị cảnh báo chỉ đạo!' : 'Đã tắt hiển thị cảnh báo chỉ đạo!');
};

// ============================================================
// LOGIC FORM THÊM MỚI: 8 NHÓM DỮ LIỆU / TRANG DỮ LIỆU & TỰ SINH FILE/LINK
// ============================================================
const MONITORING_LAYOUT_GROUPS = {
  'giao-duc': {
    name: 'Giáo dục',
    pages: [
      { id: 'gd-1', name: 'Trang Giám sát Mạng lưới Trường học', url: 'https://gialai.gov.vn/giam-sat/giao-duc/mang-luoi-truong-hoc' },
      { id: 'gd-2', name: 'Trang Thống kê Học sinh - Giáo viên', url: 'https://gialai.gov.vn/giam-sat/giao-duc/thong-ke-hoc-sinh-giao-vien' },
      { id: 'gd-3', name: 'Trang Phân bổ Ngân sách Giáo dục', url: 'https://gialai.gov.vn/giam-sat/giao-duc/ngan-sach-giao-duc' }
    ]
  },
  'quan-ly-van-ban': {
    name: 'Quản lý văn bản',
    pages: [
      { id: 'vb-1', name: 'Trang Tiến độ Xử lý Văn bản Đi/Đến', url: 'https://gialai.gov.vn/giam-sat/van-ban/tien-do-xu-ly' },
      { id: 'vb-2', name: 'Trang Thống kê Văn bản Quá hạn', url: 'https://gialai.gov.vn/giam-sat/van-ban/van-ban-qua-han' },
      { id: 'vb-3', name: 'Trang Theo dõi Chỉ đạo Điều hành', url: 'https://gialai.gov.vn/giam-sat/van-ban/theo-doi-chi-dao' }
    ]
  },
  'y-te': {
    name: 'Y tế',
    pages: [
      { id: 'yt-1', name: 'Trang Công suất Giường bệnh & Cơ sở Y tế', url: 'https://gialai.gov.vn/giam-sat/y-te/co-so-y-te' },
      { id: 'yt-2', name: 'Trang Thống kê Khám chữa bệnh BHYT', url: 'https://gialai.gov.vn/giam-sat/y-te/kham-chua-benh-bhyt' },
      { id: 'yt-3', name: 'Trang Giám sát Dịch bệnh Tỉnh', url: 'https://gialai.gov.vn/giam-sat/y-te/giam-sat-dich-benh' }
    ]
  },
  'doanh-nghiep': {
    name: 'Doanh nghiệp',
    pages: [
      { id: 'dn-1', name: 'Trang Phát triển Doanh nghiệp Mới thành lập', url: 'https://gialai.gov.vn/giam-sat/doanh-nghiep/phat-trien-moi' },
      { id: 'dn-2', name: 'Trang Thống kê Tình hình Thuế & Ngân sách DN', url: 'https://gialai.gov.vn/giam-sat/doanh-nghiep/thue-ngan-sach' },
      { id: 'dn-3', name: 'Trang Giám sát Giải thể & Tạm ngừng', url: 'https://gialai.gov.vn/giam-sat/doanh-nghiep/giai-the-tam-ngung' }
    ]
  },
  'kinh-te-xa-hoi': {
    name: 'Kinh tế - Xã hội',
    pages: [
      { id: 'kt-1', name: 'Trang Chỉ số Tăng trưởng GRDP', url: 'https://gialai.gov.vn/giam-sat/kinh-te/tang-truong-grdp' },
      { id: 'kt-2', name: 'Trang Chỉ số Thu hút Đầu tư FDI', url: 'https://gialai.gov.vn/giam-sat/kinh-te/dau-tu-fdi' },
      { id: 'kt-3', name: 'Trang Thống kê Lao động & Việc làm', url: 'https://gialai.gov.vn/giam-sat/kinh-te/lao-dong-viec-lam' }
    ]
  },
  'dich-vu-cong': {
    name: 'Dịch vụ công',
    pages: [
      { id: 'dvc-1', name: 'Trang Tỷ lệ Hồ sơ Đúng hạn & Quá hạn', url: 'https://gialai.gov.vn/giam-sat/dich-vu-cong/ty-le-ho-so' },
      { id: 'dvc-2', name: 'Trang Thanh toán Trực tuyến Dịch vụ công', url: 'https://gialai.gov.vn/giam-sat/dich-vu-cong/thanh-toan-truc-tuyen' },
      { id: 'dvc-3', name: 'Trang Mức độ Hài lòng của Người dân', url: 'https://gialai.gov.vn/giam-sat/dich-vu-cong/hai-long-nguoi-dan' }
    ]
  },
  'dau-tu-cong': {
    name: 'Đầu tư công',
    pages: [
      { id: 'dtc-1', name: 'Trang Giải ngân Vốn Đầu tư công', url: 'https://gialai.gov.vn/giam-sat/dau-tu-cong/giai-ngan-von' },
      { id: 'dtc-2', name: 'Trang Tiến độ Dự án Trọng điểm', url: 'https://gialai.gov.vn/giam-sat/dau-tu-cong/du-an-trong-diem' },
      { id: 'dtc-3', name: 'Trang Giám sát Năng lực Nhà thầu', url: 'https://gialai.gov.vn/giam-sat/dau-tu-cong/nha-thau' }
    ]
  },
  'du-lieu-khac': {
    name: 'Dữ liệu khác / Dân cư',
    pages: [
      { id: 'dlk-1', name: 'Trang Phân bố Dân cư theo Giới tính', url: 'https://gialai.gov.vn/giam-sat/dan-cu/gioi-tinh' },
      { id: 'dlk-2', name: 'Trang Phân bố Dân cư theo Độ tuổi', url: 'https://gialai.gov.vn/giam-sat/dan-cu/do-tuoi' },
      { id: 'dlk-3', name: 'Trang Thống kê Bảo hiểm Xã hội', url: 'https://gialai.gov.vn/giam-sat/dan-cu/bao-hiem' }
    ]
  }
};

window.toggleLayoutGroupDropdown = function () {
  const dropdown = document.getElementById('formLayoutGroupDropdown');
  if (dropdown) dropdown.classList.toggle('open');
};

window.selectLayoutGroup = function (radio) {
  const hiddenInput = document.getElementById('formLayoutGroup');
  hiddenInput.value = radio.value;

  // Update display
  const placeholder = document.getElementById('formLayoutGroupPlaceholder');
  const display = document.getElementById('formLayoutGroupDisplay');
  const name = radio.getAttribute('data-name');

  display.querySelectorAll('.ms-tag-chip').forEach(el => el.remove());
  if (placeholder) placeholder.style.display = 'none';

  const chip = document.createElement('span');
  chip.className = 'ms-tag-chip';
  chip.innerHTML = name;
  const chevron = display.querySelector('.multiselect-arrow-icon');
  if (chevron) display.insertBefore(chip, chevron);
  else display.appendChild(chip);

  // Close dropdown
  const dropdown = document.getElementById('formLayoutGroupDropdown');
  if (dropdown) dropdown.classList.remove('open');

  // Trigger original logic
  onLayoutGroupChange();
};

window.toggleAgencyDropdown = function () {
  const dropdown = document.getElementById('formAgencyDropdown');
  if (dropdown) dropdown.classList.toggle('open');
};

window.selectAgencyMulti = function () {
  const cbAll = document.getElementById('selectAllAgencyForm');
  const checkboxes = Array.from(document.querySelectorAll('#formAgencyDropdown input[name="agencyCb"]'));
  const checked = checkboxes.filter(cb => cb.checked);

  if (cbAll) {
    if (checked.length !== checkboxes.length && cbAll.checked) {
      cbAll.checked = false;
    } else if (checked.length > 0 && checked.length === checkboxes.length && !cbAll.checked) {
      cbAll.checked = true;
    }
  }

  const allChecked = cbAll ? cbAll.checked : false;

  const hiddenInput = document.getElementById('formAgency');
  hiddenInput.value = allChecked ? 'Chỉ đạo toàn tỉnh' : checked.map(cb => cb.value).join(', ');

  const placeholder = document.getElementById('formAgencyPlaceholder');
  const display = document.getElementById('formAgencyDisplay');

  display.querySelectorAll('.ms-tag-chip, .fms-count-badge').forEach(el => el.remove());

  if (checked.length === 0 && !allChecked) {
    if (placeholder) placeholder.style.display = 'inline';
  } else {
    if (placeholder) placeholder.style.display = 'none';
    const chevron = display.querySelector('.multiselect-arrow-icon');

    if (allChecked) {
      const chip = document.createElement('span');
      chip.className = 'ms-tag-chip';
      const allLocked = checkboxes.length > 0 && checkboxes.every(cb => isAgencyLocked(cb.value));
      chip.innerHTML = allLocked
        ? `Chỉ đạo toàn tỉnh <i class="fa-solid fa-lock chip-lock-icon"></i>`
        : `Chỉ đạo toàn tỉnh <i class="fa-solid fa-xmark btn-remove-chip" onclick="clearAllAgencyForm(event)"></i>`;
      if (allLocked) chip.classList.add('ms-tag-chip-locked');
      if (chevron) display.insertBefore(chip, chevron);
      else display.appendChild(chip);
    } else {
      // Ưu tiên hiển thị đơn vị đã tiếp nhận để người dùng thấy rõ phần bị khoá
      const ordered = checked.slice().sort((a, b) => Number(isAgencyLocked(b.value)) - Number(isAgencyLocked(a.value)));
      const visibleItems = ordered.slice(0, 1);
      visibleItems.forEach(cb => {
        const chip = document.createElement('span');
        chip.className = 'ms-tag-chip';
        if (isAgencyLocked(cb.value)) {
          chip.classList.add('ms-tag-chip-locked');
          chip.innerHTML = `${cb.value} <i class="fa-solid fa-lock chip-lock-icon"></i>`;
        } else {
          chip.innerHTML = `${cb.value} <i class="fa-solid fa-xmark btn-remove-chip" onclick="uncheckAgencyChip('${cb.value}', event)"></i>`;
        }
        if (chevron) display.insertBefore(chip, chevron);
        else display.appendChild(chip);
      });

      if (checked.length > 1) {
        const remainingCount = checked.length - 1;
        const badge = document.createElement('span');
        badge.className = 'fms-count-badge';
        badge.style.padding = '3px 8px';
        badge.style.borderRadius = '6px';
        badge.style.background = '#1e293b';
        badge.style.color = '#fff';
        badge.style.fontSize = 'var(--fs-xs)';
        badge.style.fontWeight = '700';
        badge.textContent = '+' + remainingCount;
        badge.title = 'Đã chọn tổng cộng ' + checked.length + ' đơn vị';
        if (chevron) display.insertBefore(badge, chevron);
        else display.appendChild(badge);
      }
    }
  }
};

window.uncheckAgencyChip = function (agencyVal, event) {
  if (event) event.stopPropagation();
  if (isAgencyLocked(agencyVal)) {
    showToast('Không thể xoá "' + agencyVal + '" vì đơn vị đã tiếp nhận chỉ đạo. Chỉ được thêm đơn vị mới.', 'error');
    return;
  }
  const cb = Array.from(document.querySelectorAll('#formAgencyDropdown input[type=checkbox]')).find(c => c.value === agencyVal);
  if (cb) {
    cb.checked = false;
    selectAgencyMulti();
  }
};

// Bỏ chọn "Chỉ đạo toàn tỉnh" nhưng vẫn giữ các đơn vị đã tiếp nhận chỉ đạo
window.clearAllAgencyForm = function (event) {
  if (event) event.stopPropagation();
  const cbAll = document.getElementById('selectAllAgencyForm');
  if (cbAll) cbAll.checked = false;
  document.querySelectorAll('#formAgencyDropdown input[name="agencyCb"]').forEach(cb => {
    cb.checked = isAgencyLocked(cb.value);
  });
  applyAgencyLockUI();
  selectAgencyMulti();
};

window.onLayoutGroupChange = function () {
  const groupKey = document.getElementById('formLayoutGroup').value;
  const pageGroup = document.getElementById('formDataPageGroup');
  const dropdown = document.getElementById('formDataPageDropdown');
  const sourceGroup = document.getElementById('formDataSourceGroup');
  const sourceLinks = document.getElementById('formDataSourceLinks');

  if (!groupKey || !MONITORING_LAYOUT_GROUPS[groupKey]) {
    pageGroup.style.display = 'none';
    sourceGroup.style.display = 'none';
    return;
  }

  const groupData = MONITORING_LAYOUT_GROUPS[groupKey];
  pageGroup.style.display = 'block';
  sourceGroup.style.display = 'block';

  // Build dropdown items with Select All option
  let html = `
    <label class="ms-opt" style="font-weight:700; border-bottom:1px solid #e2e8f0; padding-bottom:6px;">
      <input type="checkbox" id="selectAllDataPages" onchange="toggleSelectAllDataPages(this)"> 
      <span>Chọn tất cả (${groupData.pages.length} trang)</span>
    </label>
  `;

  groupData.pages.forEach(p => {
    html += `
      <label class="ms-opt">
        <input type="checkbox" class="data-page-cb" value="${p.id}" data-name="${p.name}" data-url="${p.url}" onchange="onDataPageSelectionChange()">
        <span>${p.name}</span>
      </label>
    `;
  });

  dropdown.innerHTML = html;
  updateDataPageDisplay();
};

window.toggleDataPageMultiselect = function () {
  const dropdown = document.getElementById('formDataPageDropdown');
  if (dropdown) dropdown.classList.toggle('open');
};

window.toggleSelectAllDataPages = function (selectAllCb) {
  document.querySelectorAll('.data-page-cb').forEach(cb => {
    cb.checked = selectAllCb.checked;
  });
  onDataPageSelectionChange();
};

window.onDataPageSelectionChange = function () {
  updateDataPageDisplay();
  autoGenerateSourceLinksAndAttachments();
};

function updateDataPageDisplay() {
  const checked = Array.from(document.querySelectorAll('.data-page-cb:checked'));
  const display = document.getElementById('formDataPageDisplay');
  const placeholder = document.getElementById('formDataPagePlaceholder');

  if (!display) return;

  display.querySelectorAll('.ms-tag-chip').forEach(el => el.remove());

  if (checked.length === 0) {
    if (placeholder) placeholder.style.display = 'inline';
  } else {
    if (placeholder) placeholder.style.display = 'none';
    const chevron = display.querySelector('.multiselect-arrow-icon');
    checked.forEach(cb => {
      const pageName = cb.getAttribute('data-name');
      const chip = document.createElement('span');
      chip.className = 'ms-tag-chip';
      chip.innerHTML = `<i class="fa-solid fa-file-lines"></i> ${pageName} <i class="fa-solid fa-xmark btn-remove-chip" onclick="event.stopPropagation(); uncheckDataPage('${cb.value}')"></i>`;
      if (chevron) display.insertBefore(chip, chevron);
      else display.appendChild(chip);
    });
  }
}

window.uncheckDataPage = function (pageId) {
  const cb = document.querySelector(`.data-page-cb[value="${pageId}"]`);
  if (cb) {
    cb.checked = false;
    const selectAll = document.getElementById('selectAllDataPages');
    if (selectAll) selectAll.checked = false;
    onDataPageSelectionChange();
  }
};

function autoGenerateSourceLinksAndAttachments() {
  const checked = Array.from(document.querySelectorAll('.data-page-cb:checked'));
  const sourceLinks = document.getElementById('formDataSourceLinks');

  if (!sourceLinks) return;

  const groupKey = document.getElementById('formLayoutGroup').value;
  const groupData = MONITORING_LAYOUT_GROUPS[groupKey];

  if (groupData) {
    const allPossibleScreenshots = groupData.pages.map(p => `Screenshot_${p.name.replace(/ /g, '_')}.png`);
    const checkedScreenshots = checked.map(cb => `Screenshot_${cb.getAttribute('data-name').replace(/ /g, '_')}.png`);

    // Remove screenshots that are in allPossible but NOT in checked (to clean up when unchecked)
    selectedFormFiles = selectedFormFiles.filter(f => {
      if (f.type === 'screenshot' && allPossibleScreenshots.includes(f.name) && !checkedScreenshots.includes(f.name)) {
        return false;
      }
      return true;
    });
  }

  if (checked.length === 0) {
    sourceLinks.innerHTML = '<span style="color:var(--text-muted); font-size: var(--fs-xs);">Chọn trang dữ liệu để tự sinh link</span>';
  } else {
    sourceLinks.innerHTML = checked.map(cb => {
      const pageName = cb.getAttribute('data-name');
      const pageUrl = cb.getAttribute('data-url');
      return `<a href="${pageUrl}" target="_blank" class="data-source-link-chip" onclick="event.stopPropagation(); previewFile('${pageUrl}')"><i class="fa-solid fa-link"></i> ${pageName}</a>`;
    }).join(' ');

    // Add generated screenshots for checked pages
    checked.forEach(cb => {
      const pageName = cb.getAttribute('data-name');
      const screenshotName = `Screenshot_${pageName.replace(/ /g, '_')}.png`;
      if (!selectedFormFiles.some(f => f.name === screenshotName)) {
        selectedFormFiles.push({ name: screenshotName, source: 'leader', type: 'screenshot' });
      }
    });
  }
  renderAttachFileList();
}

// ----- Image Zoom Modal Handlers -----
window.openImageZoomModal = function (imgSrc) {
  const modal = document.getElementById('imageZoomModal');
  const imgEl = document.getElementById('imageZoomSrc');
  if (modal && imgEl) {
    imgEl.src = imgSrc || 'image/IOC_TinhHinhDanCuTheoGioiTinh.png';
    modal.classList.add('open');
  }
};

window.closeImageZoomModal = function () {
  const modal = document.getElementById('imageZoomModal');
  if (modal) modal.classList.remove('open');
};

// ----- Rich File Preview Modal (Hiển thị chọn 1/tất cả file đính kèm để tải hoặc xem trước) -----
let currentPreviewFileName = '';
window.previewFile = function (fileName) {
  const lower = fileName.toLowerCase();
  const isImage = /\.(png|jpg|jpeg|gif|webp|bmp)$/i.test(lower) || lower.includes('screenshot') || lower.includes('image');
  const isPdf = lower.endsWith('.pdf');
  const isWord = lower.endsWith('.docx') || lower.endsWith('.doc');
  const isExcel = lower.endsWith('.xlsx') || lower.endsWith('.xls');

  if (isImage) {
    openImageZoomModal(fileName);
  } else if (isPdf) {
    window.open(fileName, '_blank');
  } else if (isWord || isExcel || lower.endsWith('.csv')) {
    downloadFile(fileName);
  } else {
    window.open(fileName, '_blank');
  }
};

window.previewSingleFile = function (fileName, type, url) {
  if (type === 'image') {
    openImageZoomModal(url || fileName);
  } else if (type === 'pdf' || fileName.toLowerCase().endsWith('.pdf')) {
    window.open(url || fileName, '_blank');
  } else if (type === 'word' || type === 'excel' || fileName.toLowerCase().endsWith('.doc') || fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.xls') || fileName.toLowerCase().endsWith('.xlsx')) {
    downloadFile(fileName);
  } else {
    showToast('📄 Đang xử lý file: ' + fileName);
  }
};

window.updatePreviewSelectCount = function () {
  const checked = document.querySelectorAll('.preview-file-cb:checked').length;
  const selectAllCb = document.getElementById('selectAllPreviewFiles');
  const total = document.querySelectorAll('.preview-file-cb').length;
  if (selectAllCb) selectAllCb.checked = (checked === total && total > 0);

  const labelEl = document.getElementById('previewSelectAllLabel');
  if (labelEl) {
    labelEl.textContent = checked > 0 ? ('Chọn tất cả (' + checked + ')') : 'Chọn tất cả';
  }

  const btnDl = document.getElementById('btnDownloadSelectedFiles');
  if (btnDl) {
    btnDl.style.display = checked > 0 ? 'inline-flex' : 'none';
  }
};

window.toggleSelectAllPreviewFiles = function (cb) {
  document.querySelectorAll('.preview-file-cb').forEach(itemCb => {
    itemCb.checked = cb.checked;
  });
  updatePreviewSelectCount();
};

window.downloadSelectedPreviewFiles = function () {
  const selected = Array.from(document.querySelectorAll('.preview-file-cb:checked')).map(cb => cb.value);
  if (!selected.length) {
    showToast('Vui lòng chọn ít nhất 1 file để tải xuống', 'error');
    return;
  }
  showToast('📥 Đang tải xuống ' + selected.length + ' file đính kèm đã chọn!');
};


window.closeFilePreviewModal = function () {
  const modal = document.getElementById('filePreviewModal');
  if (modal) modal.classList.remove('open');
};

window.downloadCurrentPreviewFile = function () {
  if (currentPreviewFileName) {
    downloadFile(currentPreviewFileName);
  }
};

window.downloadFile = function (fileName) {
  showToast('📥 Đang tải tài liệu: ' + fileName);
};

let approveTargetDirectiveId = null;
let approveTargetAgencyName = null;
let approveAllAgenciesFlag = false;

window.approveDirective = function (id, event) {
  if (event) event.stopPropagation();
  approveTargetDirectiveId = id;
  const modal = document.getElementById('confirmApproveModal');
  if (modal) modal.classList.add('open');
};

window.closeConfirmApproveModal = function () {
  const modal = document.getElementById('confirmApproveModal');
  if (modal) modal.classList.remove('open');
  approveTargetDirectiveId = null;
  approveTargetAgencyName = null;
  approveAllAgenciesFlag = false;
};

window.executeConfirmApprove = function () {
  if (approveTargetDirectiveId) {
    const dir = directives.find(d => d.id === approveTargetDirectiveId);
    if (dir) {
      if (approveTargetAgencyName) {
         const a = dir.agencies.find(x => x.name === approveTargetAgencyName);
         if (a) {
             a.status = 'Kết thúc';
             const allFinished = dir.agencies.every(x => x.status === 'Kết thúc');
             if (allFinished) dir.status = 'Kết thúc';
             showToast('✅ Đã phê duyệt báo cáo của ' + a.name);
         }
      } else if (approveAllAgenciesFlag) {
         dir.agencies.forEach(a => {
            if (a.status === 'Chờ phê duyệt') {
               a.status = 'Kết thúc';
            }
         });
         const allFinished = dir.agencies.every(x => x.status === 'Kết thúc');
         if (allFinished) dir.status = 'Kết thúc';
         showToast('✅ Đã phê duyệt các đơn vị đã chọn');
      } else {
         dir.status = 'Kết thúc';
         if (dir.agencies) {
             dir.agencies.forEach(a => a.status = 'Kết thúc');
         }
         showToast('✅ Đã phê duyệt và kết thúc chỉ đạo!');
      }
      saveDirectives();
      closeConfirmApproveModal();
      populateUI();
      if (approveTargetAgencyName || approveAllAgenciesFlag) {
         viewDirectiveDetail(approveTargetDirectiveId);
      }
    }
  }
};

let deleteTargetDirectiveId = null;
window.deleteDirective = function (id, event) {
  if (event) event.stopPropagation();
  deleteTargetDirectiveId = id;
  const modal = document.getElementById('confirmDeleteModal');
  if (modal) modal.classList.add('open');
};

window.closeConfirmDeleteModal = function () {
  const modal = document.getElementById('confirmDeleteModal');
  if (modal) modal.classList.remove('open');
  deleteTargetDirectiveId = null;
};

window.executeConfirmDelete = function () {
  if (deleteTargetDirectiveId) {
    directives = directives.filter(d => d.id !== deleteTargetDirectiveId);
    saveDirectives();
    showToast('Đã xoá chỉ đạo thành công!');
    closeConfirmDeleteModal();
    populateUI();
  }
};

window.urgeDirective = function (id, event) {
  if (event) event.stopPropagation();
  const dir = directives.find(d => d.id === id);
  if (dir) {
    showToast('📢 Đã gửi đôn đốc chỉ đạo tới ' + (dir.agency || 'Đơn vị tiếp nhận') + '!');
  }
};

window.showToast = function (msg, type = 'success') {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  const icon = toast.querySelector('i');
  if (type === 'error') {
    toast.classList.add('toast-error');
    if (icon) {
      icon.className = 'fa-solid fa-circle-exclamation';
      icon.style.color = '#ef4444';
    }
  } else {
    toast.classList.remove('toast-error');
    if (icon) {
      icon.className = 'fa-solid fa-circle-check';
      icon.style.color = '#4ade80';
    }
  }

  toast.classList.add('show');
  if (window._toastTimeout) clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
};

window.toggleSelectAllAgencyForm = function() {
  const cbAll = document.getElementById('selectAllAgencyForm');
  const isChecked = cbAll.checked;
  document.querySelectorAll('#formAgencyDropdown input[name="agencyCb"]').forEach(cb => {
    // Bỏ chọn tất cả vẫn phải giữ đơn vị đã tiếp nhận chỉ đạo
    cb.checked = isChecked || isAgencyLocked(cb.value);
  });
  if (typeof applyAgencyLockUI === 'function') applyAgencyLockUI();
  if (typeof selectAgencyMulti === 'function') selectAgencyMulti();
};


window.approveAgency = function(dirId, agencyName, event) {
   if (event) event.stopPropagation();
   approveTargetDirectiveId = dirId;
   approveTargetAgencyName = agencyName;
   approveAllAgenciesFlag = false;
   const modal = document.getElementById('confirmApproveModal');
   if (modal) modal.classList.add('open');
};

window.rejectAgency = function(dirId, agencyName, event) {
   if (event) event.stopPropagation();
   const dir = directives.find(d => d.id === dirId);
   if (!dir) return;

   rejectingDirectiveId = dirId;
   rejectingAgencyName = agencyName;
   document.getElementById('rejectReasonInput').value = '';
   rejectFormFiles = [];
   renderRejectAttachFileList();
   const modal = document.getElementById('rejectModal');
   if (modal) modal.classList.add('open');
};

window.approveAllAgencies = function(dirId) {
   approveTargetDirectiveId = dirId;
   approveTargetAgencyName = null;
   approveAllAgenciesFlag = true;
   const modal = document.getElementById('confirmApproveModal');
   if (modal) modal.classList.add('open');
};
