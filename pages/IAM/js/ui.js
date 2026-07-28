/* ============================================================
   UI.JS — Trang IAM: Quản lý Cơ quan / Đơn vị
   ============================================================ */

/* ---------- MOCK DATA: Nhân viên (cho dropdown Người phụ trách) ---------- */
const employeesData = [
  { id: 1, username: 'HoaCM', fullName: 'Châu Minh Hoa', department: 'Phòng Tổ chức - Hành chính' },
  { id: 2, username: 'AnNV', fullName: 'Nguyễn Văn An', department: 'Phòng Tổ chức - Hành chính' },
  { id: 3, username: 'BinhTV', fullName: 'Trịnh Văn Bình', department: 'Phòng Tổ chức - Hành chính' },
  { id: 4, username: 'TrinhTT', fullName: 'Trần Thị Trinh', department: 'Phòng Khoa học & Công nghệ' },
  { id: 5, username: 'NamLV', fullName: 'Lê Văn Nam', department: 'Phòng Khoa học & Công nghệ' },
  { id: 6, username: 'HongNT', fullName: 'Nguyễn Thị Hồng', department: 'Phòng Kế hoạch - Tài chính' },
  { id: 7, username: 'LanDT', fullName: 'Đỗ Thị Lan', department: 'Phòng Kế hoạch - Tài chính' }
];

function empDisplay(emp) {
  return emp ? `${emp.username} - ${emp.fullName}` : '';
}

function empDisplayWithDept(emp) {
  return emp ? `${emp.username} - ${emp.fullName} - ${emp.department}` : '';
}

function findEmpByDisplay(disp) {
  if (!disp) return null;
  return employeesData.find(e => empDisplay(e) === disp) || null;
}

function managerFullNameOnly(managerStr) {
  if (!managerStr) return '';
  const emp = findEmpByDisplay(managerStr);
  if (emp) return emp.fullName;
  const parts = managerStr.split(' - ');
  return parts.length >= 2 ? parts.slice(1).join(' - ').trim() : managerStr;
}

function managerDisplayDetail(managerStr) {
  if (!managerStr) return '';
  const emp = findEmpByDisplay(managerStr);
  if (emp) return empDisplayWithDept(emp);
  return managerStr;
}

/* ---------- MOCK DATA: Danh sách cơ quan ---------- */
const agenciesData = [
  {
    id: 1,
    name: 'Sở Khoa học và Công nghệ Tỉnh Gia Lai',
    manager: 'AnNV - Nguyễn Văn An',
    address: '02 Trần Hưng Đạo, P. Tây Sơn, TP. Pleiku, Gia Lai',
    active: true,
    parentId: null,
    floors: 5,
    lat: 13.9833,
    lng: 108.0000,
    description: 'Cơ quan chuyên môn thuộc UBND tỉnh, tham mưu quản lý nhà nước về khoa học và công nghệ.'
  },
  {
    id: 2,
    name: 'Trung tâm Giám sát, Điều hành Thông minh (IOC)',
    manager: 'TrinhTT - Trần Thị Trinh',
    address: '15 Lý Thái Tổ, P. Diên Hồng, TP. Pleiku, Gia Lai',
    active: true,
    parentId: 1,
    floors: 3,
    lat: 13.9755,
    lng: 108.0121,
    description: 'Đơn vị vận hành, giám sát dữ liệu điều hành thông minh của tỉnh.'
  },
  {
    id: 3,
    name: 'Sở Y tế Tỉnh Gia Lai',
    manager: 'NamLV - Lê Văn Nam',
    address: '88 Anh Hùng Núp, P. Hoa Lư, TP. Pleiku, Gia Lai',
    active: true,
    parentId: null,
    floors: 7,
    lat: 13.9694,
    lng: 107.9989,
    description: 'Cơ quan chuyên môn thuộc UBND tỉnh, quản lý nhà nước về y tế.'
  },
  {
    id: 4,
    name: 'Sở Lao động - Thương binh và Xã hội Tỉnh Gia Lai',
    manager: '',
    address: '12 Phạm Văn Đồng, P. Thống Nhất, TP. Pleiku, Gia Lai',
    active: false,
    parentId: 1,
    floors: 4,
    lat: 13.9812,
    lng: 108.0056,
    description: 'Cơ quan chuyên môn thuộc UBND tỉnh, quản lý nhà nước về lao động, người có công và xã hội.'
  },
  {
    id: 5,
    name: 'Sở Giáo dục và Đào tạo Tỉnh Gia Lai',
    manager: '',
    address: '20 Trường Chinh, P. Ia Kring, TP. Pleiku, Gia Lai',
    active: true,
    parentId: null,
    floors: 6,
    lat: 13.9770,
    lng: 107.9950,
    description: 'Cơ quan chuyên môn thuộc UBND tỉnh, quản lý nhà nước về giáo dục và đào tạo.'
  },
  {
    id: 6,
    name: 'Sở Thông tin và Truyền thông Tỉnh Gia Lai',
    manager: 'HongNT - Nguyễn Thị Hồng',
    address: '17 Hùng Vương, P. Diên Hồng, TP. Pleiku, Gia Lai',
    active: true,
    parentId: null,
    floors: 4,
    lat: 13.9820,
    lng: 108.0100,
    description: 'Cơ quan chuyên môn thuộc UBND tỉnh, quản lý nhà nước về thông tin và truyền thông.'
  },
  {
    id: 7,
    name: 'UBND Thành phố Pleiku',
    manager: 'BinhTV - Trịnh Văn Bình',
    address: '01 Lê Lợi, P. Ia Kring, TP. Pleiku, Gia Lai',
    active: true,
    parentId: null,
    floors: 8,
    lat: 13.9718,
    lng: 108.0142,
    description: 'Cơ quan hành chính nhà nước cấp thành phố, quản lý các mặt kinh tế - xã hội trên địa bàn.'
  },
  {
    id: 8,
    name: 'Trung tâm Công nghệ thông tin và Chuyển đổi số',
    manager: '',
    address: '17 Hùng Vương, P. Diên Hồng, TP. Pleiku, Gia Lai',
    active: true,
    parentId: 6,
    floors: 3,
    lat: 13.9840,
    lng: 108.0080,
    description: 'Đơn vị sự nghiệp trực thuộc Sở TT&TT, vận hành hạ tầng CNTT và chuyển đổi số của tỉnh.'
  },
  {
    id: 9,
    name: 'Sở Tài chính Tỉnh Gia Lai',
    manager: 'LanDT - Đỗ Thị Lan',
    address: '09 Trần Phú, P. Diên Hồng, TP. Pleiku, Gia Lai',
    active: true,
    parentId: null,
    floors: 5,
    lat: 13.9790,
    lng: 107.9975,
    description: 'Cơ quan chuyên môn thuộc UBND tỉnh, tham mưu quản lý nhà nước về tài chính, ngân sách.'
  },
  {
    id: 10,
    name: 'Sở Nội vụ Tỉnh Gia Lai',
    manager: '',
    address: '04 Nguyễn Tất Thành, P. Hoa Lư, TP. Pleiku, Gia Lai',
    active: true,
    parentId: null,
    floors: 4,
    lat: 13.9805,
    lng: 108.0030,
    description: 'Cơ quan chuyên môn thuộc UBND tỉnh, tham mưu quản lý nhà nước về tổ chức bộ máy, cán bộ.'
  }
];

/* ============================================================
   1. DANH SÁCH CƠ QUAN (có phân trang)
   ============================================================ */
let currentKeyword = '';
let agencyPage = 1;
let agencyPageSize = 10;
let agencyOpenMenuId = null;

function getFilteredAgencies() {
  const kw = currentKeyword.trim().toLowerCase();
  if (!kw) return agenciesData;
  return agenciesData.filter(a => a.name.toLowerCase().includes(kw));
}

function renderAgenciesTable() {
  const tbody = document.getElementById('iamAgencyBody');
  if (!tbody) return;

  const list = getFilteredAgencies();
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / agencyPageSize));
  if (agencyPage > totalPages) agencyPage = totalPages;

  const start = (agencyPage - 1) * agencyPageSize;
  const end = Math.min(start + agencyPageSize, total);
  const pageList = list.slice(start, end);

  if (total === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="center" style="color:#9AA0AC;padding:24px;">Không tìm thấy cơ quan phù hợp</td></tr>`;
  } else {
    let html = '';
    pageList.forEach((item, index) => {
      const managerText = item.manager
        ? managerFullNameOnly(item.manager)
        : '<span class="text-muted">Chưa cấu hình</span>';
      const statusBadge = item.active
        ? '<span class="status-badge status-badge-on">Hoạt động</span>'
        : '<span class="status-badge status-badge-off">Không hoạt động</span>';
      html += `
        <tr>
          <td class="center">${start + index + 1}</td>
          <td class="col-name">${item.name}</td>
          <td class="col-address" title="${item.address || ''}">${item.address || ''}</td>
          <td class="col-manager">${managerText}</td>
          <td class="center col-status">${statusBadge}</td>
          <td class="center">
            <div class="action-menu-wrap">
              <button class="act-btn-dots" type="button" title="Thao tác" onclick="toggleAgencyMenu(event, ${item.id})">
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </button>
              <div class="action-menu">
                <div class="action-menu-item" onclick="openForm1(${item.id}, 'view')">
                  <i class="fa-solid fa-eye"></i> Xem
                </div>
                <div class="action-menu-item" onclick="openForm1(${item.id}, 'edit')">
                  <i class="fa-solid fa-pen"></i> Sửa
                </div>
                <div class="action-menu-item danger" onclick="openDeleteConfirm(${item.id})">
                  <i class="fa-solid fa-trash"></i> Xóa
                </div>
              </div>
            </div>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  const infoEl = document.getElementById('agencyPageInfo');
  if (infoEl) {
    infoEl.textContent = total === 0
      ? 'Hiển thị 0-0/0'
      : `Hiển thị ${start + 1}-${end}/${total}`;
  }

  const btnsEl = document.getElementById('agencyPageButtons');
  if (btnsEl) {
    let btns = '';
    btns += `<button class="pg-btn" ${agencyPage === 1 ? 'disabled' : ''} data-page="1"><i class="fa-solid fa-angles-left"></i></button>`;
    btns += `<button class="pg-btn" ${agencyPage === 1 ? 'disabled' : ''} data-page="${agencyPage - 1}"><i class="fa-solid fa-angle-left"></i></button>`;
    for (let p = 1; p <= totalPages; p++) {
      btns += `<button class="pg-btn ${p === agencyPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
    btns += `<button class="pg-btn" ${agencyPage === totalPages ? 'disabled' : ''} data-page="${agencyPage + 1}"><i class="fa-solid fa-angle-right"></i></button>`;
    btns += `<button class="pg-btn" ${agencyPage === totalPages ? 'disabled' : ''} data-page="${totalPages}"><i class="fa-solid fa-angles-right"></i></button>`;
    btnsEl.innerHTML = btns;
  }
}

function closeAllActionMenus() {
  document.querySelectorAll('.action-menu.show').forEach(m => {
    m.classList.remove('show');
    m.style.top = '';
    m.style.left = '';
    m.style.right = '';
    m.style.bottom = '';
    m.style.position = '';
  });
  agencyOpenMenuId = null;
}

function toggleAgencyMenu(evt, id) {
  evt.stopPropagation();
  const btn = evt.currentTarget || evt.target.closest('.act-btn-dots');
  const wrap = btn ? btn.closest('.action-menu-wrap') : null;
  const menu = wrap ? wrap.querySelector('.action-menu') : null;

  // Đóng menu khác
  const wasOpen = agencyOpenMenuId === id;
  closeAllActionMenus();
  if (wasOpen || !menu || !btn) return;

  agencyOpenMenuId = id;
  const rect = btn.getBoundingClientRect();
  const menuWidth = 140;
  const menuApproxH = 130;
  let top = rect.bottom + 4;
  let left = rect.right - menuWidth;

  // Nếu tràn dưới viewport → mở lên trên
  if (top + menuApproxH > window.innerHeight - 8) {
    top = rect.top - menuApproxH - 4;
    if (top < 8) top = 8;
  }
  // Không tràn trái/phải
  if (left < 8) left = 8;
  if (left + menuWidth > window.innerWidth - 8) {
    left = window.innerWidth - menuWidth - 8;
  }

  menu.style.position = 'fixed';
  menu.style.top = top + 'px';
  menu.style.left = left + 'px';
  menu.style.right = 'auto';
  menu.style.bottom = 'auto';
  menu.classList.add('show');
}

function closeAgencyMenu() {
  closeAllActionMenus();
}

function handleSearch() {
  const input = document.getElementById('searchInput');
  currentKeyword = input ? input.value : '';
  agencyPage = 1;
  agencyOpenMenuId = null;
  renderAgenciesTable();
}

function handleReset() {
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  currentKeyword = '';
  agencyPage = 1;
  agencyOpenMenuId = null;
  renderAgenciesTable();
  showToast('Đã làm mới dữ liệu thành công', 'success');
}

/* ============================================================
   2. ĐIỀU HƯỚNG GIỮA CÁC VIEW
   ============================================================ */
function showView(viewId) {
  ['listView', 'form1View', 'viewDetailView'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === viewId) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });
  const actions = document.getElementById('viewHeaderActions');
  if (actions) {
    if (viewId === 'viewDetailView') actions.classList.remove('hidden');
    else actions.classList.add('hidden');
  }
}

function setPageHeading(title) {
  const titleEl = document.getElementById('pageTitleText');
  const crumbEl = document.getElementById('breadcrumbCurrent');
  if (titleEl) titleEl.textContent = title;
  if (crumbEl) crumbEl.textContent = title;
}

function goToAgencyList() {
  showView('listView');
  setPageHeading('Quản lý cơ quan');
  agencyOpenMenuId = null;
  destroyMaps();
  renderAgenciesTable();
}

function backToList() {
  goToAgencyList();
}

/* ============================================================
   3. CUSTOM DROPDOWN
   ============================================================ */
let parentDdValue = null;   // agency id or null
let managerDdValue = null;  // display string or null

function closeAllCustomDd(exceptId) {
  document.querySelectorAll('.custom-dd.open').forEach(dd => {
    if (exceptId && dd.id === exceptId) return;
    dd.classList.remove('open');
  });
}

function setCustomDdValue(ddId, value, displayText) {
  const dd = document.getElementById(ddId);
  if (!dd) return;
  const trigger = dd.querySelector('.custom-dd-trigger');
  const ph = trigger.querySelector('.dd-placeholder');
  const val = trigger.querySelector('.dd-value');
  if (value == null || value === '') {
    ph.classList.remove('hidden');
    val.classList.add('hidden');
    val.textContent = '';
    trigger.classList.remove('has-value');
  } else {
    ph.classList.add('hidden');
    val.classList.remove('hidden');
    val.textContent = displayText || value;
    trigger.classList.add('has-value');
  }
  if (ddId === 'agencyParentDd') parentDdValue = value;
  if (ddId === 'agencyManagerDd') managerDdValue = value;
  // re-render panel selection state
  if (ddId === 'agencyParentDd') renderParentPanel();
  if (ddId === 'agencyManagerDd') renderManagerPanel();
}

function renderParentPanel(filterText) {
  const panel = document.getElementById('agencyParentPanel');
  if (!panel) return;
  const excludeId = form1EditingId;
  const kw = (filterText || '').trim().toLowerCase();
  let html = `<div class="custom-dd-search-wrap">
    <i class="fa-solid fa-magnifying-glass"></i>
    <input type="text" class="custom-dd-search" id="agencyParentSearch" placeholder="Tìm theo tên..." autocomplete="off">
  </div>`;
  let count = 0;
  agenciesData.forEach(a => {
    if (a.id === excludeId) return;
    if (kw && !a.name.toLowerCase().includes(kw)) return;
    const sel = parentDdValue === a.id ? ' selected' : '';
    html += `<div class="custom-dd-item${sel}" data-id="${a.id}">${a.name}</div>`;
    count++;
  });
  if (count === 0) {
    html += '<div class="custom-dd-item custom-dd-empty">Không có dữ liệu</div>';
  }
  panel.innerHTML = html;
  const searchInput = document.getElementById('agencyParentSearch');
  if (searchInput) {
    searchInput.value = filterText || '';
    searchInput.addEventListener('click', (e) => e.stopPropagation());
    searchInput.addEventListener('input', () => {
      renderParentPanel(searchInput.value);
      const again = document.getElementById('agencyParentSearch');
      if (again) {
        again.focus();
        const len = again.value.length;
        again.setSelectionRange(len, len);
      }
    });
    searchInput.addEventListener('keydown', (e) => e.stopPropagation());
  }
}

function renderManagerPanel(filterText) {
  const panel = document.getElementById('agencyManagerPanel');
  if (!panel) return;

  const kw = (filterText || '').trim().toLowerCase();

  // group by department (filter by name/username)
  const groups = {};
  employeesData.forEach(e => {
    if (kw) {
      const hay = `${e.username} ${e.fullName}`.toLowerCase();
      if (!hay.includes(kw)) return;
    }
    if (!groups[e.department]) groups[e.department] = [];
    groups[e.department].push(e);
  });

  let html = `<div class="custom-dd-search-wrap">
    <i class="fa-solid fa-magnifying-glass"></i>
    <input type="text" class="custom-dd-search" id="agencyManagerSearch" placeholder="Tìm theo tên..." autocomplete="off">
  </div>`;
  let count = 0;
  Object.keys(groups).forEach(dept => {
    html += `<div class="custom-dd-group-label">${dept}</div>`;
    groups[dept].forEach(e => {
      const disp = empDisplay(e);
      const sel = managerDdValue === disp ? ' selected' : '';
      html += `<div class="custom-dd-item${sel}" data-value="${disp}">${disp}</div>`;
      count++;
    });
  });
  if (count === 0) {
    html += '<div class="custom-dd-item custom-dd-empty">Không có dữ liệu</div>';
  }
  panel.innerHTML = html;
  const searchInput = document.getElementById('agencyManagerSearch');
  if (searchInput) {
    searchInput.value = filterText || '';
    searchInput.addEventListener('click', (e) => e.stopPropagation());
    searchInput.addEventListener('input', () => {
      renderManagerPanel(searchInput.value);
      const again = document.getElementById('agencyManagerSearch');
      if (again) {
        again.focus();
        const len = again.value.length;
        again.setSelectionRange(len, len);
      }
    });
    searchInput.addEventListener('keydown', (e) => e.stopPropagation());
  }
}

function initCustomDropdowns() {
  // Parent
  const parentDd = document.getElementById('agencyParentDd');
  if (parentDd) {
    const trigger = parentDd.querySelector('.custom-dd-trigger');
    const clearBtn = parentDd.querySelector('.dd-clear');
    const panel = document.getElementById('agencyParentPanel');

    trigger.addEventListener('click', (e) => {
      if (e.target.closest('.dd-clear')) return;
      const isOpen = parentDd.classList.contains('open');
      closeAllCustomDd();
      if (!isOpen) {
        parentDd.classList.add('open');
        renderParentPanel();
      }
    });

    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setCustomDdValue('agencyParentDd', null, '');
      closeAllCustomDd();
    });

    panel.addEventListener('click', (e) => {
      const item = e.target.closest('.custom-dd-item[data-id]');
      if (!item) return;
      const id = Number(item.dataset.id);
      const name = item.textContent;
      setCustomDdValue('agencyParentDd', id, name);
      closeAllCustomDd();
    });
  }

  // Manager
  const managerDd = document.getElementById('agencyManagerDd');
  if (managerDd) {
    const trigger = managerDd.querySelector('.custom-dd-trigger');
    const clearBtn = managerDd.querySelector('.dd-clear');
    const panel = document.getElementById('agencyManagerPanel');

    trigger.addEventListener('click', (e) => {
      if (e.target.closest('.dd-clear')) return;
      const isOpen = managerDd.classList.contains('open');
      closeAllCustomDd();
      if (!isOpen) {
        managerDd.classList.add('open');
        renderManagerPanel();
      }
    });

    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setCustomDdValue('agencyManagerDd', null, '');
      closeAllCustomDd();
    });

    panel.addEventListener('click', (e) => {
      const item = e.target.closest('.custom-dd-item[data-value]');
      if (!item) return;
      const val = item.dataset.value;
      const emp = findEmpByDisplay(val);
      const display = emp ? empDisplayWithDept(emp) : val;
      setCustomDdValue('agencyManagerDd', val, display);
      closeAllCustomDd();
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dd')) closeAllCustomDd();
  });
}

/* ============================================================
   4. MAP (Leaflet)
   ============================================================ */
let editMap = null;
let editMarker = null;
let viewMap = null;
let viewMarker = null;

function destroyMaps() {
  if (editMap) { editMap.remove(); editMap = null; editMarker = null; }
  if (viewMap) { viewMap.remove(); viewMap = null; viewMarker = null; }
}

function initEditMap(lat, lng) {
  const container = document.getElementById('agencyMapEdit');
  if (!container || typeof L === 'undefined') {
    // fallback placeholder
    const ph = document.getElementById('agencyMapPlaceholder');
    if (ph) {
      ph.classList.remove('hidden');
      container.classList.add('hidden');
      updateMapPlaceholderText(lat, lng);
    }
    return;
  }
  container.classList.remove('hidden');
  const ph = document.getElementById('agencyMapPlaceholder');
  if (ph) ph.classList.add('hidden');

  if (editMap) {
    editMap.remove();
    editMap = null;
    editMarker = null;
  }

  const hasCoord = lat != null && lng != null && !isNaN(lat) && !isNaN(lng);
  const center = hasCoord ? [lat, lng] : [13.9833, 108.0000];
  editMap = L.map(container).setView(center, hasCoord ? 14 : 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(editMap);

  if (hasCoord) {
    editMarker = L.marker(center).addTo(editMap);
  }
  setTimeout(() => editMap.invalidateSize(), 100);
}

function updateEditMap(lat, lng) {
  if (!editMap) {
    initEditMap(lat, lng);
    return;
  }
  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return;
  const pos = [lat, lng];
  editMap.setView(pos, 14);
  if (editMarker) {
    editMarker.setLatLng(pos);
  } else {
    editMarker = L.marker(pos).addTo(editMap);
  }
}

function initViewMap(lat, lng) {
  const container = document.getElementById('agencyMapView');
  if (!container || typeof L === 'undefined') return;

  if (viewMap) {
    viewMap.remove();
    viewMap = null;
    viewMarker = null;
  }

  const hasCoord = lat != null && lng != null && !isNaN(lat) && !isNaN(lng);
  const center = hasCoord ? [lat, lng] : [13.9833, 108.0000];
  viewMap = L.map(container).setView(center, hasCoord ? 14 : 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(viewMap);

  if (hasCoord) {
    viewMarker = L.marker(center).addTo(viewMap);
  }
  setTimeout(() => viewMap.invalidateSize(), 150);
}

function updateMapPlaceholderText(lat, lng) {
  const text = document.getElementById('agencyMapCoordText');
  if (!text) return;
  if (lat !== '' && lng !== '' && lat != null && lng != null) {
    text.textContent = `Tọa độ: ${lat}, ${lng}`;
  } else {
    text.textContent = 'Chưa có tọa độ';
  }
}

/* ============================================================
   5. FORM — THÊM / SỬA / XEM
   ============================================================ */
let form1Mode = 'add'; // 'add' | 'edit' | 'view'
let form1EditingId = null;
let originalManagerValue = null; // for change confirmation

function clearForm1Errors() {
  ['agencyNameError', 'agencyManagerError', 'agencyFloorsError', 'agencyLocationError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function openForm1(id, mode) {
  form1Mode = mode;
  form1EditingId = id || null;
  agencyOpenMenuId = null;
  closeAllCustomDd();
  clearForm1Errors();
  destroyMaps();

  if (mode === 'view') {
    openViewDetail(id);
    return;
  }

  // Thêm / Sửa
  const nameInput = document.getElementById('agencyNameInput');
  const addressInput = document.getElementById('agencyAddressInput');
  const floorsInput = document.getElementById('agencyFloorsInput');
  const locationInput = document.getElementById('agencyLocationInput');
  const descInput = document.getElementById('agencyDescriptionInput');
  const activeInput = document.getElementById('agencyActiveInput');
  const title = document.getElementById('form1Title');
  const saveBtn = document.getElementById('btnForm1Save');

  if (mode === 'add') {
    if (title) title.textContent = 'Thông tin cơ quan';
    nameInput.value = '';
    setCustomDdValue('agencyParentDd', null, '');
    setCustomDdValue('agencyManagerDd', null, '');
    originalManagerValue = null;
    addressInput.value = '';
    floorsInput.value = '';
    locationInput.value = '';
    descInput.value = '';
    activeInput.checked = true;
    setPageHeading('Thêm cơ quan');
    saveBtn.classList.remove('hidden');
    showView('form1View');
    setTimeout(() => initEditMap(null, null), 50);
  } else {
    const item = agenciesData.find(a => a.id === id);
    if (!item) return;

    if (title) title.textContent = 'Thông tin cơ quan';
    nameInput.value = item.name;
    // parent
    if (item.parentId) {
      const parent = agenciesData.find(a => a.id === item.parentId);
      setCustomDdValue('agencyParentDd', item.parentId, parent ? parent.name : '');
    } else {
      setCustomDdValue('agencyParentDd', null, '');
    }
    // manager — value lưu username - fullName; hiển thị thêm phòng ban
    setCustomDdValue(
      'agencyManagerDd',
      item.manager || null,
      item.manager ? managerDisplayDetail(item.manager) : ''
    );
    originalManagerValue = item.manager || '';
    addressInput.value = item.address || '';
    floorsInput.value = item.floors != null ? item.floors : '';
    locationInput.value = (item.lat != null && item.lng != null) ? `${item.lat}, ${item.lng}` : '';
    descInput.value = item.description || '';
    activeInput.checked = !!item.active;
    setPageHeading('Cấu hình cơ quan');
    saveBtn.classList.remove('hidden');
    showView('form1View');
    setTimeout(() => initEditMap(item.lat, item.lng), 50);
  }
}

function openViewDetail(id) {
  const item = agenciesData.find(a => a.id === id);
  if (!item) return;

  form1Mode = 'view';
  form1EditingId = id;
  setPageHeading('Cấu hình cơ quan');

  const parent = item.parentId ? agenciesData.find(a => a.id === item.parentId) : null;
  const grid = document.getElementById('viewDetailGrid');
  if (grid) {
    const rows = [
      ['Tên cơ quan:', item.name || '—'],
      ['Cơ quan cấp trên:', parent ? parent.name : '—'],
      ['Người phụ trách chính:', item.manager ? managerDisplayDetail(item.manager) : '—'],
      ['Số tầng:', item.floors != null ? item.floors : '—'],
      ['Tình trạng hoạt động:', item.active ? 'Hoạt động' : 'Không hoạt động', item.active ? 'status-on' : 'status-off'],
      ['Địa chỉ:', item.address || '—'],
      ['Vị trí bản đồ:', (item.lat != null && item.lng != null) ? `${item.lat}, ${item.lng}` : '—'],
      ['Mô tả:', item.description || '—']
    ];
    grid.innerHTML = rows.map(([label, value, cls]) => `
      <div class="view-label">${label}</div>
      <div class="view-value ${cls || ''} ${(!value || value === '—') ? 'empty' : ''}">${value}</div>
    `).join('');
  }

  showView('viewDetailView');
  setTimeout(() => initViewMap(item.lat, item.lng), 80);
}

function validateForm1() {
  clearForm1Errors();
  let valid = true;

  const name = document.getElementById('agencyNameInput').value.trim();
  const floors = document.getElementById('agencyFloorsInput').value.trim();
  const location = document.getElementById('agencyLocationInput').value.trim();

  if (!name) {
    document.getElementById('agencyNameError').textContent = 'Vui lòng nhập tên cơ quan.';
    valid = false;
  }

  if (!managerDdValue) {
    document.getElementById('agencyManagerError').textContent = 'Vui lòng chọn người phụ trách chính.';
    valid = false;
  }

  if (!floors) {
    document.getElementById('agencyFloorsError').textContent = 'Vui lòng nhập số tầng.';
    valid = false;
  } else if (isNaN(floors) || Number(floors) < 0) {
    document.getElementById('agencyFloorsError').textContent = 'Số tầng không hợp lệ.';
    valid = false;
  }

  if (!location) {
    document.getElementById('agencyLocationError').textContent = 'Vui lòng nhập vị trí (lat, lng).';
    valid = false;
  } else {
    const parts = location.split(',').map(s => s.trim());
    if (parts.length !== 2 || parts[0] === '' || parts[1] === '' || isNaN(parts[0]) || isNaN(parts[1])) {
      document.getElementById('agencyLocationError').textContent = 'Định dạng vị trí không hợp lệ. Ví dụ: 13.9833, 108.0000';
      valid = false;
    }
  }

  return valid;
}

function doSaveForm1() {
  const name = document.getElementById('agencyNameInput').value.trim();
  const manager = managerDdValue || '';
  const address = document.getElementById('agencyAddressInput').value.trim();
  const floors = Number(document.getElementById('agencyFloorsInput').value);
  const location = document.getElementById('agencyLocationInput').value.trim();
  const parts = location.split(',').map(s => s.trim());
  const lat = Number(parts[0]);
  const lng = Number(parts[1]);
  const description = document.getElementById('agencyDescriptionInput').value.trim();
  const active = document.getElementById('agencyActiveInput').checked;
  const parentId = parentDdValue != null ? Number(parentDdValue) : null;

  let savedId = form1EditingId;
  if (form1Mode === 'add') {
    const newId = agenciesData.length > 0 ? Math.max(...agenciesData.map(a => a.id)) + 1 : 1;
    agenciesData.push({
      id: newId,
      name,
      manager,
      address,
      active,
      parentId,
      floors,
      lat,
      lng,
      description
    });
    savedId = newId;
    showToast('Thêm cơ quan thành công.', 'success');
  } else if (form1Mode === 'edit') {
    const item = agenciesData.find(a => a.id === form1EditingId);
    if (!item) {
      showToast('Không tìm thấy cơ quan.', 'error');
      return;
    }
    item.name = name;
    item.manager = manager;
    item.address = address;
    item.active = active;
    item.parentId = parentId;
    item.floors = floors;
    item.lat = lat;
    item.lng = lng;
    item.description = description;
    savedId = form1EditingId;
    showToast('Cập nhật cơ quan thành công.', 'success');
  }

  // Giữ màn hình chi tiết sau khi lưu (không quay về danh sách)
  if (savedId != null) openViewDetail(savedId);
  else backToList();
}

function saveForm1() {
  if (form1Mode === 'view') return;
  if (!validateForm1()) return;

  // Check manager change on edit
  if (form1Mode === 'edit') {
    const newManager = managerDdValue || '';
    const oldManager = originalManagerValue || '';
    if (newManager !== oldManager) {
      openManagerChangeConfirm(oldManager, newManager);
      return;
    }
  }

  doSaveForm1();
}

/* ============================================================
   6. MODAL XÁC NHẬN ĐỔI NGƯỜI PHỤ TRÁCH
   ============================================================ */
function openManagerChangeConfirm(oldVal, newVal) {
  const textEl = document.getElementById('managerChangeText');
  if (textEl) {
    textEl.textContent = 'Bạn có chắc chắn muốn đổi người phụ trách chính?';
  }
  const compareEl = document.getElementById('managerChangeCompare');
  if (compareEl) {
    const oldEmp = findEmpByDisplay(oldVal);
    const newEmp = findEmpByDisplay(newVal);
    const oldName = oldVal || 'Chưa cấu hình';
    const newName = newVal || 'Chưa cấu hình';
    const oldDept = oldEmp ? oldEmp.department : '—';
    const newDept = newEmp ? newEmp.department : '—';
    compareEl.innerHTML = `
      <div class="mgr-change-card">
        <div class="mgr-role">Hiện tại</div>
        <div class="mgr-name">${oldName}</div>
        <div class="mgr-dept">${oldDept}</div>
      </div>
      <div class="mgr-change-arrow"><i class="fa-solid fa-arrow-down"></i></div>
      <div class="mgr-change-card">
        <div class="mgr-role">Người mới</div>
        <div class="mgr-name">${newName}</div>
        <div class="mgr-dept">${newDept}</div>
      </div>`;
  }
  document.getElementById('managerChangeModal').classList.add('show');
}

function closeManagerChangeConfirm() {
  document.getElementById('managerChangeModal').classList.remove('show');
}

function confirmManagerChange() {
  closeManagerChangeConfirm();
  doSaveForm1();
}

/* ============================================================
   7. MODAL XÁC NHẬN XÓA CƠ QUAN
   ============================================================ */
let deleteTargetId = null;

function openDeleteConfirm(id) {
  agencyOpenMenuId = null;
  const item = agenciesData.find(a => a.id === id);
  if (!item) return;
  deleteTargetId = id;
  document.getElementById('deleteConfirmModal').classList.add('show');
}

function closeDeleteConfirm() {
  deleteTargetId = null;
  document.getElementById('deleteConfirmModal').classList.remove('show');
}

function confirmDeleteTarget() {
  if (deleteTargetId == null) return;
  const index = agenciesData.findIndex(a => a.id === deleteTargetId);
  if (index === -1) {
    showToast('Xóa thất bại. Không tìm thấy cơ quan.', 'error');
    closeDeleteConfirm();
    return;
  }
  agenciesData.splice(index, 1);
  closeDeleteConfirm();
  renderAgenciesTable();
  showToast('Xóa cơ quan thành công.', 'success');
}

/* ============================================================
   8. TOAST
   ============================================================ */
let toastTimer = null;

function showToast(message, type) {
  const toast = document.getElementById('appToast');
  const icon = document.getElementById('appToastIcon');
  const msg = document.getElementById('appToastMsg');
  if (!toast || !icon || !msg) return;

  toast.classList.remove('toast-success', 'toast-error');
  toast.classList.add(type === 'error' ? 'toast-error' : 'toast-success');
  icon.className = type === 'error' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check';
  msg.textContent = message;

  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ============================================================
   9. KHỞI TẠO SỰ KIỆN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  renderAgenciesTable();
  initCustomDropdowns();

  const navAgency = document.getElementById('nav-quan-ly-co-quan');
  if (navAgency) navAgency.addEventListener('click', goToAgencyList);

  /* --- Danh sách cơ quan: tìm kiếm / làm mới / thêm --- */
  const btnSearch = document.getElementById('btnSearch');
  const btnReset = document.getElementById('btnReset');
  const btnAddAgency = document.getElementById('btnAddAgency');
  const searchInput = document.getElementById('searchInput');

  if (btnSearch) btnSearch.addEventListener('click', handleSearch);
  if (btnReset) btnReset.addEventListener('click', handleReset);
  if (btnAddAgency) btnAddAgency.addEventListener('click', () => openForm1(null, 'add'));
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }

  /* --- Phân trang --- */
  const pageSizeSelect = document.getElementById('agencyPageSize');
  if (pageSizeSelect) {
    pageSizeSelect.addEventListener('change', (e) => {
      agencyPageSize = Number(e.target.value) || 10;
      agencyPage = 1;
      renderAgenciesTable();
    });
  }
  const pageButtons = document.getElementById('agencyPageButtons');
  if (pageButtons) {
    pageButtons.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-page]');
      if (!btn || btn.disabled) return;
      agencyPage = Number(btn.dataset.page);
      agencyOpenMenuId = null;
      renderAgenciesTable();
    });
  }

  /* --- Đóng menu 3 chấm khi click ra ngoài / scroll / resize --- */
  document.addEventListener('click', () => {
    closeAgencyMenu();
  });
  window.addEventListener('scroll', closeAgencyMenu, true);
  window.addEventListener('resize', closeAgencyMenu);

  /* --- Form 1 --- */
  const btnForm1Back = document.getElementById('btnForm1Back');
  const btnForm1Save = document.getElementById('btnForm1Save');
  const locationInput = document.getElementById('agencyLocationInput');

  if (btnForm1Back) btnForm1Back.addEventListener('click', backToList);
  if (btnForm1Save) btnForm1Save.addEventListener('click', saveForm1);
  if (locationInput) {
    locationInput.addEventListener('input', () => {
      const val = locationInput.value.trim();
      const parts = val.split(',').map(s => s.trim());
      if (parts.length === 2 && parts[0] && parts[1] && !isNaN(parts[0]) && !isNaN(parts[1])) {
        updateEditMap(Number(parts[0]), Number(parts[1]));
      }
    });
  }

  /* --- View detail buttons (header) --- */
  const btnViewEditTop = document.getElementById('btnViewEditTop');
  const btnViewBackTop = document.getElementById('btnViewBackTop');
  if (btnViewEditTop) {
    btnViewEditTop.addEventListener('click', () => {
      if (form1EditingId) openForm1(form1EditingId, 'edit');
    });
  }
  if (btnViewBackTop) btnViewBackTop.addEventListener('click', backToList);

  /* --- Modal xác nhận xóa --- */
  const deleteModalCloseBtn = document.getElementById('deleteModalCloseBtn');
  const deleteCancelBtn = document.getElementById('deleteCancelBtn');
  const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');

  if (deleteModalCloseBtn) deleteModalCloseBtn.addEventListener('click', closeDeleteConfirm);
  if (deleteCancelBtn) deleteCancelBtn.addEventListener('click', closeDeleteConfirm);
  if (deleteConfirmBtn) deleteConfirmBtn.addEventListener('click', confirmDeleteTarget);
  if (deleteConfirmModal) {
    deleteConfirmModal.addEventListener('click', (e) => {
      if (e.target === deleteConfirmModal) closeDeleteConfirm();
    });
  }

  /* --- Modal xác nhận đổi manager --- */
  const managerChangeCloseBtn = document.getElementById('managerChangeCloseBtn');
  const managerChangeCancelBtn = document.getElementById('managerChangeCancelBtn');
  const managerChangeConfirmBtn = document.getElementById('managerChangeConfirmBtn');
  const managerChangeModal = document.getElementById('managerChangeModal');

  if (managerChangeCloseBtn) managerChangeCloseBtn.addEventListener('click', closeManagerChangeConfirm);
  if (managerChangeCancelBtn) managerChangeCancelBtn.addEventListener('click', closeManagerChangeConfirm);
  if (managerChangeConfirmBtn) managerChangeConfirmBtn.addEventListener('click', confirmManagerChange);
  if (managerChangeModal) {
    managerChangeModal.addEventListener('click', (e) => {
      if (e.target === managerChangeModal) closeManagerChangeConfirm();
    });
  }
});
