/* ============================================================
   UI.JS — Trang IAM: Quản lý Cơ quan / Đơn vị
   ============================================================ */

const agenciesData = [
  {
    id: 1,
    name: 'Sở Khoa học và Công nghệ Tỉnh Gia Lai',
    manager: 'Nguyễn Văn An',
    address: '02 Trần Hưng Đạo, P. Tây Sơn, TP. Pleiku, Gia Lai',
    active: true
  },
  {
    id: 2,
    name: 'Trung tâm Giám sát, Điều hành Thông minh (IOC)',
    manager: 'Trần Thị Trinh',
    address: '15 Lý Thái Tổ, P. Diên Hồng, TP. Pleiku, Gia Lai',
    active: true
  },
  {
    id: 3,
    name: 'Sở Y tế Tỉnh Gia Lai',
    manager: 'Lê Văn Nam',
    address: '88 Anh Hùng Núp, P. Hoa Lư, TP. Pleiku, Gia Lai',
    active: true
  },
  {
    id: 4,
    name: 'Sở Lao động - Thương binh và Xã hội Tỉnh Gia Lai',
    manager: 'Phạm Minh Tuấn',
    address: '12 Phạm Văn Đồng, P. Thống Nhất, TP. Pleiku, Gia Lai',
    active: false
  }
];

/* Danh sách nhân viên để chọn "Người phụ trách" (mock — sau này lấy từ API) */
const staffData = [
  { id: 1, name: 'Nguyễn Văn An' },
  { id: 2, name: 'Trần Thị Trinh' },
  { id: 3, name: 'Lê Văn Nam' },
  { id: 4, name: 'Phạm Minh Tuấn' },
  { id: 5, name: 'Hoàng Thị Bích Ngọc' },
  { id: 6, name: 'Đặng Quốc Huy' },
  { id: 7, name: 'Vũ Thị Kim Oanh' },
  { id: 8, name: 'Bùi Đức Thắng' },
  { id: 9, name: 'Ngô Thanh Hằng' },
  { id: 10, name: 'Đỗ Xuân Trường' }
];

function renderAgenciesTable() {
  const tbody = document.getElementById('iamAgencyBody');
  if (!tbody) return;

  let html = '';
  agenciesData.forEach((item, index) => {
    const activeChecked = item.active ? 'checked' : '';
    html += `
      <tr>
        <td class="center">${index + 1}</td>
        <td><strong>${item.name}</strong></td>
        <td>${item.manager}</td>
        <td>${item.address}</td>
        <td class="center">
          <label class="switch" style="position:relative;display:inline-block;width:34px;height:18px;margin:0;">
            <input type="checkbox" ${activeChecked} onchange="toggleAgencyStatus(${item.id})">
            <span class="slider round"></span>
          </label>
        </td>
        <td class="center">
          <div class="row-actions">
            <button class="act-btn act-edit" title="Sửa" onclick="openAgencyModal(${item.id})"><i class="fa-solid fa-pen"></i></button>
            <button class="act-btn act-del" title="Xóa"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

function toggleAgencyStatus(id) {
  const item = agenciesData.find(a => a.id === id);
  if (item) {
    item.active = !item.active;
  }
}

/* ---------- TOAST: Thông báo lưu thành công / thất bại ---------- */
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

/* ---------- COMBO SELECT: Người phụ trách (tìm kiếm, chọn 1) ---------- */
let selectedManagerId = null;

function isAgencyPrerequisiteFilled() {
  const name = document.getElementById('agencyNameInput').value.trim();
  const address = document.getElementById('agencyAddressInput').value.trim();
  return !!name && !!address;
}

function updateManagerFieldState() {
  const searchInput = document.getElementById('agencyManagerSearch');
  if (!searchInput) return;

  const ready = isAgencyPrerequisiteFilled();
  searchInput.disabled = !ready;
  searchInput.placeholder = ready
    ? 'Tìm và chọn người phụ trách'
    : 'Nhập tên cơ quan và địa chỉ trước';

  if (!ready) {
    closeManagerDropdown();
  }
}

function renderManagerOptions(keyword) {
  const dropdown = document.getElementById('agencyManagerDropdown');
  if (!dropdown) return;

  const kw = (keyword || '').trim().toLowerCase();
  const filtered = staffData.filter(s => s.name.toLowerCase().includes(kw));

  if (filtered.length === 0) {
    dropdown.innerHTML = `<div class="combo-empty">Không tìm thấy nhân viên phù hợp</div>`;
    return;
  }

  dropdown.innerHTML = filtered.map(s => {
    const selectedCls = s.id === selectedManagerId ? ' selected' : '';
    return `<div class="combo-option${selectedCls}" data-id="${s.id}" onclick="selectManagerOption(${s.id})">${s.name}</div>`;
  }).join('');
}

function openManagerDropdown() {
  const searchInput = document.getElementById('agencyManagerSearch');
  const dropdown = document.getElementById('agencyManagerDropdown');
  if (!searchInput || searchInput.disabled || !dropdown) return;

  renderManagerOptions(searchInput.value);
  dropdown.classList.add('show');
}

function closeManagerDropdown() {
  const dropdown = document.getElementById('agencyManagerDropdown');
  if (dropdown) dropdown.classList.remove('show');
}

function selectManagerOption(id) {
  const staff = staffData.find(s => s.id === id);
  if (!staff) return;

  selectedManagerId = staff.id;
  document.getElementById('agencyManagerSearch').value = staff.name;
  document.getElementById('agencyManagerIdInput').value = staff.id;
  closeManagerDropdown();
}

function resetManagerSelectionIfMismatch() {
  const searchInput = document.getElementById('agencyManagerSearch');
  if (!searchInput) return;

  const typed = searchInput.value.trim();
  const staff = staffData.find(s => s.id === selectedManagerId);
  if (!staff || staff.name !== typed) {
    selectedManagerId = null;
    document.getElementById('agencyManagerIdInput').value = '';
  }
}

/* ---------- MODAL: Thiết lập cơ quan ---------- */
let currentEditAgencyId = null;

function openAgencyModal(id) {
  const item = agenciesData.find(a => a.id === id);
  if (!item) return;

  currentEditAgencyId = id;
  document.getElementById('agencyNameInput').value = item.name;
  document.getElementById('agencyAddressInput').value = item.address;
  document.getElementById('agencyActiveInput').checked = item.active;

  const staff = staffData.find(s => s.name === item.manager);
  selectedManagerId = staff ? staff.id : null;
  document.getElementById('agencyManagerSearch').value = item.manager;
  document.getElementById('agencyManagerIdInput').value = selectedManagerId || '';

  updateManagerFieldState();
  closeManagerDropdown();

  document.getElementById('agencyModalOverlay').classList.add('show');
}

function closeAgencyModal() {
  currentEditAgencyId = null;
  selectedManagerId = null;
  closeManagerDropdown();
  document.getElementById('agencyModalOverlay').classList.remove('show');
}

function saveAgencyModal() {
  if (currentEditAgencyId === null) return;
  const item = agenciesData.find(a => a.id === currentEditAgencyId);
  if (!item) {
    showToast('Lưu thất bại. Không tìm thấy cơ quan cần cập nhật.', 'error');
    return;
  }

  const name = document.getElementById('agencyNameInput').value.trim();
  const address = document.getElementById('agencyAddressInput').value.trim();
  const active = document.getElementById('agencyActiveInput').checked;

  if (!name) {
    showToast('Lưu thất bại. Vui lòng nhập tên cơ quan.', 'error');
    return;
  }
  if (!address) {
    showToast('Lưu thất bại. Vui lòng nhập địa chỉ cơ quan.', 'error');
    return;
  }

  resetManagerSelectionIfMismatch();
  const staff = staffData.find(s => s.id === selectedManagerId);
  if (!staff) {
    showToast('Lưu thất bại. Vui lòng chọn người phụ trách từ danh sách.', 'error');
    return;
  }

  item.name = name;
  item.address = address;
  item.manager = staff.name;
  item.active = active;

  renderAgenciesTable();
  closeAgencyModal();
  showToast('Lưu thông tin cơ quan thành công.', 'success');
}

document.addEventListener('DOMContentLoaded', () => {
  renderAgenciesTable();

  const cancelBtn = document.getElementById('agencyCancelBtn');
  const closeBtn = document.getElementById('agencyModalCloseBtn');
  const saveBtn = document.getElementById('agencySaveBtn');
  const overlay = document.getElementById('agencyModalOverlay');
  const nameInput = document.getElementById('agencyNameInput');
  const addressInput = document.getElementById('agencyAddressInput');
  const managerSearch = document.getElementById('agencyManagerSearch');
  const managerCombo = document.getElementById('agencyManagerCombo');

  if (cancelBtn) cancelBtn.addEventListener('click', closeAgencyModal);
  if (closeBtn) closeBtn.addEventListener('click', closeAgencyModal);
  if (saveBtn) saveBtn.addEventListener('click', saveAgencyModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAgencyModal();
    });
  }

  if (nameInput) nameInput.addEventListener('input', updateManagerFieldState);
  if (addressInput) addressInput.addEventListener('input', updateManagerFieldState);

  if (managerSearch) {
    managerSearch.addEventListener('focus', openManagerDropdown);
    managerSearch.addEventListener('input', () => {
      selectedManagerId = null;
      document.getElementById('agencyManagerIdInput').value = '';
      openManagerDropdown();
    });
  }

  document.addEventListener('click', (e) => {
    if (managerCombo && !managerCombo.contains(e.target)) {
      closeManagerDropdown();
    }
  });
});
