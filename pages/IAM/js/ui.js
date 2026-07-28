/* ============================================================
   UI.JS — Trang IAM: Quản lý Cơ quan / Đơn vị
   ============================================================ */

/* ---------- MOCK DATA: Danh sách cơ quan ---------- */
const agenciesData = [
  {
    id: 1,
    name: 'Sở Khoa học và Công nghệ Tỉnh Gia Lai',
    manager: 'Nguyễn Văn An',
    address: '02 Trần Hưng Đạo, P. Tây Sơn, TP. Pleiku, Gia Lai',
    active: true,
    parentId: null,
    floors: 5,
    lat: 13.9833,
    lng: 108.0000,
    description: 'Cơ quan chuyên môn thuộc UBND tỉnh, tham mưu quản lý nhà nước về khoa học và công nghệ.',
    managedByCurrentUser: true
  },
  {
    id: 2,
    name: 'Trung tâm Giám sát, Điều hành Thông minh (IOC)',
    manager: 'Trần Thị Trinh',
    address: '15 Lý Thái Tổ, P. Diên Hồng, TP. Pleiku, Gia Lai',
    active: true,
    parentId: 1,
    floors: 3,
    lat: 13.9755,
    lng: 108.0121,
    description: 'Đơn vị vận hành, giám sát dữ liệu điều hành thông minh của tỉnh.',
    managedByCurrentUser: true
  },
  {
    id: 3,
    name: 'Sở Y tế Tỉnh Gia Lai',
    manager: 'Lê Văn Nam',
    address: '88 Anh Hùng Núp, P. Hoa Lư, TP. Pleiku, Gia Lai',
    active: true,
    parentId: null,
    floors: 7,
    lat: 13.9694,
    lng: 107.9989,
    description: 'Cơ quan chuyên môn thuộc UBND tỉnh, quản lý nhà nước về y tế.',
    managedByCurrentUser: false
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
    description: 'Cơ quan chuyên môn thuộc UBND tỉnh, quản lý nhà nước về lao động, người có công và xã hội.',
    managedByCurrentUser: false
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
    description: 'Cơ quan chuyên môn thuộc UBND tỉnh, quản lý nhà nước về giáo dục và đào tạo.',
    managedByCurrentUser: false
  },
  {
    id: 6,
    name: 'Sở Thông tin và Truyền thông Tỉnh Gia Lai',
    manager: 'Nguyễn Thị Hồng',
    address: '17 Hùng Vương, P. Diên Hồng, TP. Pleiku, Gia Lai',
    active: true,
    parentId: null,
    floors: 4,
    lat: 13.9820,
    lng: 108.0100,
    description: 'Cơ quan chuyên môn thuộc UBND tỉnh, quản lý nhà nước về thông tin và truyền thông.',
    managedByCurrentUser: false
  },
  {
    id: 7,
    name: 'UBND Thành phố Pleiku',
    manager: 'Trịnh Văn Bình',
    address: '01 Lê Lợi, P. Ia Kring, TP. Pleiku, Gia Lai',
    active: true,
    parentId: null,
    floors: 8,
    lat: 13.9718,
    lng: 108.0142,
    description: 'Cơ quan hành chính nhà nước cấp thành phố, quản lý các mặt kinh tế - xã hội trên địa bàn.',
    managedByCurrentUser: false
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
    description: 'Đơn vị sự nghiệp trực thuộc Sở TT&TT, vận hành hạ tầng CNTT và chuyển đổi số của tỉnh.',
    managedByCurrentUser: true
  },
  {
    id: 9,
    name: 'Sở Tài chính Tỉnh Gia Lai',
    manager: 'Đỗ Thị Lan',
    address: '09 Trần Phú, P. Diên Hồng, TP. Pleiku, Gia Lai',
    active: true,
    parentId: null,
    floors: 5,
    lat: 13.9790,
    lng: 107.9975,
    description: 'Cơ quan chuyên môn thuộc UBND tỉnh, tham mưu quản lý nhà nước về tài chính, ngân sách.',
    managedByCurrentUser: false
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
    description: 'Cơ quan chuyên môn thuộc UBND tỉnh, tham mưu quản lý nhà nước về tổ chức bộ máy, cán bộ.',
    managedByCurrentUser: false
  }
];

/* ---------- MOCK DATA: Phòng ban (mỗi cơ quan 2-4 phòng ban) ---------- */
const departmentsData = [
  { id: 1, agencyId: 1, name: 'Ban Giám đốc', description: 'Điều hành chung toàn cơ quan.', active: true },
  { id: 2, agencyId: 1, name: 'Phòng Hành chính', description: 'Quản lý văn thư, hành chính, nhân sự.', active: true },
  { id: 3, agencyId: 1, name: 'Phòng Kế hoạch', description: 'Xây dựng kế hoạch, tổng hợp báo cáo.', active: true },
  { id: 4, agencyId: 1, name: 'Phòng Công nghệ thông tin', description: 'Quản trị hạ tầng CNTT của Sở.', active: false },

  { id: 5, agencyId: 2, name: 'Phòng Kỹ thuật', description: 'Vận hành hệ thống giám sát, điều hành.', active: true },
  { id: 6, agencyId: 2, name: 'Phòng Vận hành', description: 'Trực vận hành, xử lý sự cố 24/7.', active: true },
  { id: 7, agencyId: 2, name: 'Phòng Phân tích dữ liệu', description: 'Phân tích, trực quan hóa dữ liệu dân cư.', active: true },

  { id: 8, agencyId: 3, name: 'Ban Giám đốc', description: 'Điều hành chung Sở Y tế.', active: true },
  { id: 9, agencyId: 3, name: 'Phòng Hành chính', description: 'Quản lý văn thư, hành chính, nhân sự.', active: true },

  { id: 10, agencyId: 4, name: 'Ban Giám đốc', description: 'Điều hành chung Sở LĐTBXH.', active: true },
  { id: 11, agencyId: 4, name: 'Phòng Kế hoạch', description: 'Xây dựng kế hoạch, tổng hợp báo cáo.', active: true },
  { id: 12, agencyId: 4, name: 'Phòng Chính sách', description: 'Tham mưu chính sách lao động, xã hội.', active: false },

  { id: 13, agencyId: 5, name: 'Ban Giám đốc', description: 'Điều hành chung Sở Giáo dục và Đào tạo.', active: true },
  { id: 14, agencyId: 5, name: 'Phòng Giáo dục Tiểu học', description: 'Quản lý chuyên môn bậc tiểu học.', active: true },
  { id: 15, agencyId: 5, name: 'Phòng Tổ chức Cán bộ', description: 'Quản lý tổ chức bộ máy, nhân sự ngành.', active: true },

  { id: 16, agencyId: 6, name: 'Ban Giám đốc', description: 'Điều hành chung Sở Thông tin và Truyền thông.', active: true },
  { id: 17, agencyId: 6, name: 'Phòng Bưu chính - Viễn thông', description: 'Quản lý nhà nước về bưu chính, viễn thông.', active: true },
  { id: 18, agencyId: 6, name: 'Phòng Công nghệ thông tin', description: 'Quản lý nhà nước về CNTT trên địa bàn tỉnh.', active: true },

  { id: 19, agencyId: 7, name: 'Văn phòng UBND', description: 'Tổng hợp, tham mưu điều hành chung.', active: true },
  { id: 20, agencyId: 7, name: 'Phòng Quản lý Đô thị', description: 'Quản lý quy hoạch, xây dựng đô thị.', active: true },
  { id: 21, agencyId: 7, name: 'Phòng Tài nguyên và Môi trường', description: 'Quản lý đất đai, tài nguyên, môi trường.', active: false },

  { id: 22, agencyId: 8, name: 'Phòng Hạ tầng số', description: 'Vận hành, bảo trì hạ tầng CNTT dùng chung.', active: true },
  { id: 23, agencyId: 8, name: 'Phòng Dữ liệu số', description: 'Quản trị, tích hợp dữ liệu dùng chung của tỉnh.', active: true },
  { id: 24, agencyId: 8, name: 'Phòng An toàn thông tin', description: 'Giám sát, bảo đảm an toàn thông tin mạng.', active: true },

  { id: 25, agencyId: 9, name: 'Ban Giám đốc', description: 'Điều hành chung Sở Tài chính.', active: true },
  { id: 26, agencyId: 9, name: 'Phòng Ngân sách', description: 'Tham mưu quản lý ngân sách nhà nước.', active: true },
  { id: 27, agencyId: 9, name: 'Phòng Quản lý Giá', description: 'Quản lý nhà nước về giá trên địa bàn tỉnh.', active: false },

  { id: 28, agencyId: 10, name: 'Phòng Tổ chức Bộ máy', description: 'Quản lý tổ chức bộ máy hành chính.', active: true },
  { id: 29, agencyId: 10, name: 'Phòng Công chức, Viên chức', description: 'Quản lý công chức, viên chức toàn tỉnh.', active: true }
];

/* ---------- MOCK DATA: Nhân viên ---------- */
const staffData = [
  { id: 1, username: 'AnNV', fullName: 'Nguyễn Văn An', email: 'annv@gialai.gov.vn', phone: '0905123001', birthday: '12/03/1980', gender: 'Nam', agencyId: 1, department: 'Ban Giám đốc' },
  { id: 2, username: 'TrinhTT', fullName: 'Trần Thị Trinh', email: 'trinhtt@gialai.gov.vn', phone: '0905123002', birthday: '25/07/1985', gender: 'Nữ', agencyId: 2, department: 'Phòng Kỹ thuật' },
  { id: 3, username: 'NamLV', fullName: 'Lê Văn Nam', email: 'namlv@gialai.gov.vn', phone: '0905123003', birthday: '02/11/1978', gender: 'Nam', agencyId: 3, department: 'Ban Giám đốc' },
  { id: 4, username: 'TuanPM', fullName: 'Phạm Minh Tuấn', email: 'tuanpm@gialai.gov.vn', phone: '0905123004', birthday: '19/05/1982', gender: 'Nam', agencyId: 4, department: 'Ban Giám đốc' },
  { id: 5, username: 'NgocHTB', fullName: 'Hoàng Thị Bích Ngọc', email: 'ngochtb@gialai.gov.vn', phone: '0905123005', birthday: '08/09/1990', gender: 'Nữ', agencyId: 1, department: 'Phòng Hành chính' },
  { id: 6, username: 'HuyDQ', fullName: 'Đặng Quốc Huy', email: 'huydq@gialai.gov.vn', phone: '0905123006', birthday: '30/01/1988', gender: 'Nam', agencyId: 2, department: 'Phòng Vận hành' },
  { id: 7, username: 'OanhVTK', fullName: 'Vũ Thị Kim Oanh', email: 'oanhvtk@gialai.gov.vn', phone: '0905123007', birthday: '14/06/1991', gender: 'Nữ', agencyId: 1, department: 'Phòng Kế hoạch' },
  { id: 8, username: 'ThangBD', fullName: 'Bùi Đức Thắng', email: 'thangbd@gialai.gov.vn', phone: '0905123008', birthday: '22/12/1986', gender: 'Nam', agencyId: 2, department: 'Phòng Kỹ thuật' },
  { id: 9, username: 'HangNT', fullName: 'Ngô Thanh Hằng', email: 'hangnt@gialai.gov.vn', phone: '0905123009', birthday: '05/04/1993', gender: 'Nữ', agencyId: 3, department: 'Phòng Hành chính' },
  { id: 10, username: 'TruongDX', fullName: 'Đỗ Xuân Trường', email: 'truongdx@gialai.gov.vn', phone: '0905123010', birthday: '17/08/1984', gender: 'Nam', agencyId: 4, department: 'Phòng Kế hoạch' },
  { id: 11, username: 'LinhPTM', fullName: 'Phan Thị Mỹ Linh', email: 'linhptm@gialai.gov.vn', phone: '0905123011', birthday: '09/02/1992', gender: 'Nữ', agencyId: 8, department: 'Phòng Hạ tầng số' },
  { id: 12, username: 'KhoaNV', fullName: 'Nguyễn Văn Khoa', email: 'khoanv@gialai.gov.vn', phone: '0905123012', birthday: '23/10/1989', gender: 'Nam', agencyId: 8, department: 'Phòng Dữ liệu số' }
];

/* Lưu người phụ trách chính theo cơ quan: { [agencyId]: staffId } (mock, không backend) */
const primaryManagerAssignments = {};

/* ============================================================
   1. DANH SÁCH CƠ QUAN
   ============================================================ */
let currentKeyword = '';

function getFilteredAgencies() {
  const kw = currentKeyword.trim().toLowerCase();
  if (!kw) return agenciesData;
  return agenciesData.filter(a => a.name.toLowerCase().includes(kw));
}

function renderAgenciesTable() {
  const tbody = document.getElementById('iamAgencyBody');
  if (!tbody) return;

  const list = getFilteredAgencies();

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="center" style="color:#9AA0AC;padding:24px;">Không tìm thấy cơ quan phù hợp</td></tr>`;
    return;
  }

  let html = '';
  list.forEach((item, index) => {
    const activeChecked = item.active ? 'checked' : '';
    const managedChecked = item.managedByCurrentUser ? 'checked' : '';
    const managedTitle = item.managedByCurrentUser ? 'Bạn đang được gán quyền quản lý cơ quan này' : '';
    const configBtn = item.managedByCurrentUser
      ? `<button class="act-btn act-config" title="Cấu hình người phụ trách chính" onclick="openForm2(${item.id})"><i class="fa-solid fa-user-gear"></i></button>`
      : '';
    const managerText = item.manager
      ? item.manager
      : '<span class="text-muted">Chưa cấu hình</span>';

    html += `
      <tr>
        <td class="center">${index + 1}</td>
        <td><strong>${item.name}</strong></td>
        <td>${managerText}</td>
        <td>${item.address}</td>
        <td class="center">
          <input type="checkbox" class="readonly-checkbox" ${managedChecked} disabled title="${managedTitle}">
        </td>
        <td class="center">
          <label class="switch">
            <input type="checkbox" ${activeChecked} onchange="toggleAgencyStatus(${item.id})">
            <span class="slider round"></span>
          </label>
        </td>
        <td class="center">
          <div class="row-actions">
            <button class="act-btn act-view" title="Xem" onclick="openForm1(${item.id}, 'view')"><i class="fa-solid fa-eye"></i></button>
            <button class="act-btn act-edit" title="Sửa" onclick="openForm1(${item.id}, 'edit')"><i class="fa-solid fa-pen"></i></button>
            <button class="act-btn act-del" title="Xóa" onclick="openDeleteConfirm('agency', ${item.id})"><i class="fa-solid fa-trash"></i></button>
            ${configBtn}
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

function handleSearch() {
  const input = document.getElementById('searchInput');
  currentKeyword = input ? input.value : '';
  renderAgenciesTable();
}

function handleReset() {
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  currentKeyword = '';
  renderAgenciesTable();
  showToast('Đã làm mới dữ liệu thành công', 'success');
}

/* ============================================================
   2. ĐIỀU HƯỚNG GIỮA CÁC VIEW
   ============================================================ */
function showView(viewId) {
  ['listView', 'listDeptView', 'form1View', 'form2View'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === viewId) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });
}

function setPageHeading(title) {
  const titleEl = document.getElementById('pageTitleText');
  const crumbEl = document.getElementById('breadcrumbCurrent');
  if (titleEl) titleEl.textContent = title;
  if (crumbEl) crumbEl.textContent = title;
}

/* ---------- Điều hướng Sidebar: Quản lý cơ quan <-> Quản lý phòng ban ---------- */
function setActiveNav(navId) {
  ['nav-quan-ly-co-quan', 'nav-quan-ly-phong-ban'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('active', id === navId);
  });
}

function goToAgencyList() {
  showView('listView');
  setActiveNav('nav-quan-ly-co-quan');
  setPageHeading('Quản lý cơ quan');
  renderAgenciesTable();
}

function goToDeptListTop() {
  topDeptKeyword = '';
  topDeptPage = 1;
  topDeptOpenMenuId = null;
  const input = document.getElementById('topDeptSearchInput');
  if (input) input.value = '';
  showView('listDeptView');
  setActiveNav('nav-quan-ly-phong-ban');
  setPageHeading('Quản lý phòng ban');
  renderTopDeptTable();
}

function backToList() {
  goToAgencyList();
}

/* ============================================================
   3. FORM 1 — THÔNG TIN CƠ QUAN (Thêm / Sửa / Xem)
   ============================================================ */
let form1Mode = 'add'; // 'add' | 'edit' | 'view'
let form1EditingId = null;

function populateParentSelect(excludeId) {
  const select = document.getElementById('agencyParentSelect');
  if (!select) return;

  const options = ['<option value="">-- Không có --</option>'];
  agenciesData.forEach(a => {
    if (a.id === excludeId) return; // không cho chọn chính nó làm cơ quan cấp trên
    options.push(`<option value="${a.id}">${a.name}</option>`);
  });
  select.innerHTML = options.join('');
}

function updateMapPlaceholder(lat, lng) {
  const text = document.getElementById('agencyMapCoordText');
  if (!text) return;
  if (lat !== '' && lng !== '' && lat !== undefined && lng !== undefined) {
    text.textContent = `Tọa độ: ${lat}, ${lng}`;
  } else {
    text.textContent = 'Chưa có tọa độ';
  }
}

function clearForm1Errors() {
  ['agencyNameError', 'agencyFloorsError', 'agencyLocationError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function setForm1FieldsDisabled(disabled) {
  const ids = [
    'agencyNameInput', 'agencyParentSelect', 'agencyAddressInput',
    'agencyFloorsInput', 'agencyLocationInput', 'agencyDescriptionInput', 'agencyActiveInput'
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = disabled;
  });
}

function openForm1(id, mode) {
  form1Mode = mode; // 'add' | 'edit' | 'view'
  form1EditingId = id || null;

  clearForm1Errors();

  const nameInput = document.getElementById('agencyNameInput');
  const addressInput = document.getElementById('agencyAddressInput');
  const floorsInput = document.getElementById('agencyFloorsInput');
  const locationInput = document.getElementById('agencyLocationInput');
  const descInput = document.getElementById('agencyDescriptionInput');
  const activeInput = document.getElementById('agencyActiveInput');
  const title = document.getElementById('form1Title');
  const saveBtn = document.getElementById('btnForm1Save');
  const deptSection = document.getElementById('deptSection');

  populateParentSelect(id || null);

  if (mode === 'add') {
    title.textContent = 'Thêm cơ quan';
    nameInput.value = '';
    document.getElementById('agencyParentSelect').value = '';
    addressInput.value = '';
    floorsInput.value = '';
    locationInput.value = '';
    descInput.value = '';
    activeInput.checked = true;
    updateMapPlaceholder('', '');
    setForm1FieldsDisabled(false);
    saveBtn.classList.remove('hidden');
    setPageHeading('Thêm cơ quan');

    // Thêm mới: ẩn hoàn toàn block Danh sách phòng ban
    deptSection.classList.add('hidden');
    setDeptSectionReadonly(false);
  } else {
    const item = agenciesData.find(a => a.id === id);
    if (!item) return;

    title.textContent = mode === 'edit' ? 'Sửa cơ quan' : 'Chi tiết cơ quan';
    nameInput.value = item.name;
    document.getElementById('agencyParentSelect').value = item.parentId || '';
    addressInput.value = item.address || '';
    floorsInput.value = item.floors != null ? item.floors : '';
    locationInput.value = (item.lat != null && item.lng != null) ? `${item.lat}, ${item.lng}` : '';
    descInput.value = item.description || '';
    activeInput.checked = !!item.active;
    updateMapPlaceholder(item.lat, item.lng);

    if (mode === 'view') {
      setForm1FieldsDisabled(true);
      saveBtn.classList.add('hidden');
      setPageHeading('Chi tiết cơ quan');
    } else {
      setForm1FieldsDisabled(false);
      saveBtn.classList.remove('hidden');
      setPageHeading('Sửa cơ quan');
    }

    // Sửa / Xem: hiện block Danh sách phòng ban của đúng cơ quan này
    deptSection.classList.remove('hidden');
    setDeptSectionReadonly(mode === 'view');
    openDeptSectionFor(item.id);
  }

  showView('form1View');
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

  if (!floors) {
    document.getElementById('agencyFloorsError').textContent = 'Vui lòng nhập số tầng.';
    valid = false;
  } else if (isNaN(floors) || Number(floors) < 0) {
    document.getElementById('agencyFloorsError').textContent = 'Số tầng không hợp lệ.';
    valid = false;
  }

  const locationPattern = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
  if (!location) {
    document.getElementById('agencyLocationError').textContent = 'Vui lòng nhập vị trí (lat, lng).';
    valid = false;
  } else if (!locationPattern.test(location)) {
    document.getElementById('agencyLocationError').textContent = 'Định dạng vị trí không hợp lệ. Ví dụ: 13.9833, 108.0000';
    valid = false;
  }

  return valid;
}

function saveForm1() {
  if (!validateForm1()) return;

  const name = document.getElementById('agencyNameInput').value.trim();
  const parentVal = document.getElementById('agencyParentSelect').value;
  const address = document.getElementById('agencyAddressInput').value.trim();
  const floors = Number(document.getElementById('agencyFloorsInput').value.trim());
  const location = document.getElementById('agencyLocationInput').value.trim();
  const [latStr, lngStr] = location.split(',').map(s => s.trim());
  const description = document.getElementById('agencyDescriptionInput').value.trim();
  const active = document.getElementById('agencyActiveInput').checked;

  if (form1Mode === 'add') {
    const newId = agenciesData.length > 0 ? Math.max(...agenciesData.map(a => a.id)) + 1 : 1;
    agenciesData.push({
      id: newId,
      name: name,
      manager: '',
      address: address,
      active: active,
      parentId: parentVal ? Number(parentVal) : null,
      floors: floors,
      lat: Number(latStr),
      lng: Number(lngStr),
      description: description,
      managedByCurrentUser: false
    });
    showToast('Thêm cơ quan thành công.', 'success');
  } else if (form1Mode === 'edit') {
    const item = agenciesData.find(a => a.id === form1EditingId);
    if (!item) {
      showToast('Lưu thất bại. Không tìm thấy cơ quan cần cập nhật.', 'error');
      return;
    }
    item.name = name;
    item.parentId = parentVal ? Number(parentVal) : null;
    item.address = address;
    item.floors = floors;
    item.lat = Number(latStr);
    item.lng = Number(lngStr);
    item.description = description;
    item.active = active;
    showToast('Cập nhật cơ quan thành công.', 'success');
  }

  backToList();
}

/* ============================================================
   4. DANH SÁCH PHÒNG BAN THUỘC CƠ QUAN (trong Form 1)
   ============================================================ */
let deptCurrentAgencyId = null;
let deptKeyword = '';
let deptPage = 1;
const DEPT_PAGE_SIZE = 5;
let deptOpenMenuId = null;
let deptSectionReadonly = false;

/* Chế độ Xem chi tiết cơ quan: khóa toàn bộ block phòng ban
   (ẩn nút Thêm mới, disable tìm kiếm, menu chỉ còn "Xem"). */
function setDeptSectionReadonly(readonly) {
  deptSectionReadonly = readonly;
  const addBtn = document.getElementById('btnAddDept');
  const searchInput = document.getElementById('deptSearchInput');
  const searchBtn = document.getElementById('btnDeptSearch');
  const resetBtn = document.getElementById('btnDeptReset');
  if (addBtn) addBtn.classList.toggle('hidden', readonly);
  if (searchInput) searchInput.disabled = readonly;
  if (searchBtn) searchBtn.disabled = readonly;
  if (resetBtn) resetBtn.disabled = readonly;
}

function openDeptSectionFor(agencyId) {
  deptCurrentAgencyId = agencyId;
  deptKeyword = '';
  deptPage = 1;
  deptOpenMenuId = null;
  const searchInput = document.getElementById('deptSearchInput');
  if (searchInput) searchInput.value = '';
  renderDeptTable();
}

function getFilteredDepartments() {
  const kw = deptKeyword.trim().toLowerCase();
  return departmentsData.filter(d => {
    if (d.agencyId !== deptCurrentAgencyId) return false;
    if (!kw) return true;
    return d.name.toLowerCase().includes(kw);
  });
}

function renderDeptTable() {
  const tbody = document.getElementById('deptTableBody');
  const pagination = document.getElementById('deptPagination');
  if (!tbody || !pagination) return;

  const filtered = getFilteredDepartments();
  const totalPages = Math.max(1, Math.ceil(filtered.length / DEPT_PAGE_SIZE));
  if (deptPage > totalPages) deptPage = totalPages;

  const start = (deptPage - 1) * DEPT_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + DEPT_PAGE_SIZE);

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="center" style="color:#9AA0AC;padding:20px;">Không có phòng ban phù hợp</td></tr>`;
  } else {
    tbody.innerHTML = pageItems.map((d, i) => {
      const badge = d.active
        ? `<span class="status-badge status-badge-on">Hoạt động</span>`
        : `<span class="status-badge status-badge-off">Không hoạt động</span>`;
      const menuShow = deptOpenMenuId === d.id ? ' show' : '';
      const menuItems = deptSectionReadonly
        ? `<div class="action-menu-item" onclick="closeDeptMenu(); openDeptModal('view', ${d.id}, 'agency')"><i class="fa-solid fa-eye"></i>Xem</div>`
        : `<div class="action-menu-item" onclick="openDeptModal('edit', ${d.id}, 'agency')"><i class="fa-solid fa-pen"></i>Chỉnh sửa</div>
           <div class="action-menu-item danger" onclick="closeDeptMenu(); openDeleteConfirm('department', ${d.id})"><i class="fa-solid fa-trash"></i>Xóa</div>`;
      return `
        <tr>
          <td class="center">${start + i + 1}</td>
          <td><strong>${d.name}</strong></td>
          <td>${d.description || ''}</td>
          <td class="center">${badge}</td>
          <td class="center">
            <div class="action-menu-wrap">
              <button class="act-btn-dots" title="Xử lý" onclick="toggleDeptMenu(event, ${d.id})"><i class="fa-solid fa-ellipsis-vertical"></i></button>
              <div class="action-menu${menuShow}" id="deptMenu-${d.id}">
                ${menuItems}
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  pagination.innerHTML = `
    <button class="page-btn" id="deptPrevBtn" ${deptPage <= 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>
    <span class="page-info">Trang ${deptPage}/${totalPages}</span>
    <button class="page-btn" id="deptNextBtn" ${deptPage >= totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>
  `;

  const prevBtn = document.getElementById('deptPrevBtn');
  const nextBtn = document.getElementById('deptNextBtn');
  if (prevBtn) prevBtn.addEventListener('click', () => { if (deptPage > 1) { deptPage--; renderDeptTable(); } });
  if (nextBtn) nextBtn.addEventListener('click', () => { if (deptPage < totalPages) { deptPage++; renderDeptTable(); } });
}

function handleDeptSearch() {
  const input = document.getElementById('deptSearchInput');
  deptKeyword = input ? input.value : '';
  deptPage = 1;
  renderDeptTable();
}

function handleDeptReset() {
  const input = document.getElementById('deptSearchInput');
  if (input) input.value = '';
  deptKeyword = '';
  deptPage = 1;
  renderDeptTable();
  showToast('Đã làm mới dữ liệu thành công', 'success');
}

/* ---------- Menu 3 chấm của từng dòng phòng ban ---------- */
function toggleDeptMenu(evt, deptId) {
  evt.stopPropagation();
  deptOpenMenuId = deptOpenMenuId === deptId ? null : deptId;
  renderDeptTable();
}

function closeDeptMenu() {
  deptOpenMenuId = null;
}

document.addEventListener('click', () => {
  if (deptOpenMenuId !== null) {
    deptOpenMenuId = null;
    renderDeptTable();
  }
});

/* ============================================================
   5. MODAL THÊM / SỬA PHÒNG BAN
   ============================================================ */
let deptModalMode = 'add'; // 'add' | 'edit' | 'view'
let deptEditingId = null;
let deptModalContext = 'agency'; // 'agency' (trong Form 1) | 'top' (màn hình Quản lý phòng ban)

function populateDeptAgencySelect() {
  const select = document.getElementById('deptAgencySelect');
  if (!select) return;
  const options = ['<option value="">-- Chọn --</option>'];
  agenciesData.forEach(a => options.push(`<option value="${a.id}">${a.name}</option>`));
  select.innerHTML = options.join('');
}

function openDeptModal(mode, id, context) {
  deptModalMode = mode;
  deptEditingId = id || null;
  deptModalContext = context || 'agency';
  closeDeptMenu();
  closeTopDeptMenu();
  renderDeptTable();
  renderTopDeptTable();

  const title = document.getElementById('deptModalTitle');
  const nameInput = document.getElementById('deptNameInput');
  const descInput = document.getElementById('deptDescInput');
  const activeInput = document.getElementById('deptActiveInput');
  const errorEl = document.getElementById('deptNameError');
  const agencyGroup = document.getElementById('deptAgencyGroup');
  const agencySelect = document.getElementById('deptAgencySelect');
  const agencyError = document.getElementById('deptAgencyError');
  const saveBtn = document.getElementById('deptSaveBtn');
  const cancelBtn = document.getElementById('deptCancelBtn');

  if (errorEl) errorEl.textContent = '';
  if (agencyError) agencyError.textContent = '';

  const showAgencyField = deptModalContext === 'top';
  if (agencyGroup) agencyGroup.classList.toggle('hidden', !showAgencyField);
  if (showAgencyField) populateDeptAgencySelect();

  if (mode === 'add') {
    title.textContent = 'Thêm phòng ban';
    nameInput.value = '';
    descInput.value = '';
    activeInput.checked = true;
    if (agencySelect) agencySelect.value = '';
  } else {
    const dept = departmentsData.find(d => d.id === id);
    if (!dept) return;
    title.textContent = mode === 'view' ? 'Xem thông tin phòng ban' : 'Chỉnh sửa phòng ban';
    nameInput.value = dept.name;
    descInput.value = dept.description || '';
    activeInput.checked = !!dept.active;
    if (agencySelect) agencySelect.value = dept.agencyId;
  }

  const readonly = mode === 'view';
  [nameInput, descInput, activeInput, agencySelect].forEach(el => { if (el) el.disabled = readonly; });
  if (saveBtn) saveBtn.classList.toggle('hidden', readonly);
  if (cancelBtn) cancelBtn.textContent = readonly ? 'Đóng' : 'Hủy';

  document.getElementById('deptModalOverlay').classList.add('show');
}

function closeDeptModal() {
  document.getElementById('deptModalOverlay').classList.remove('show');
}

function saveDeptModal() {
  if (deptModalMode === 'view') { closeDeptModal(); return; }

  const nameInput = document.getElementById('deptNameInput');
  const descInput = document.getElementById('deptDescInput');
  const activeInput = document.getElementById('deptActiveInput');
  const errorEl = document.getElementById('deptNameError');
  const agencySelect = document.getElementById('deptAgencySelect');
  const agencyError = document.getElementById('deptAgencyError');

  const name = nameInput.value.trim();
  let valid = true;

  if (!name) {
    errorEl.textContent = 'Vui lòng nhập tên phòng ban.';
    valid = false;
  } else {
    errorEl.textContent = '';
  }

  let targetAgencyId = deptCurrentAgencyId;
  if (deptModalContext === 'top') {
    const val = agencySelect ? agencySelect.value : '';
    if (!val) {
      if (agencyError) agencyError.textContent = 'Vui lòng chọn cơ quan.';
      valid = false;
    } else {
      if (agencyError) agencyError.textContent = '';
      targetAgencyId = Number(val);
    }
  }

  if (!valid) return;

  const description = descInput.value.trim();
  const active = activeInput.checked;

  if (deptModalMode === 'add') {
    const newId = departmentsData.length > 0 ? Math.max(...departmentsData.map(d => d.id)) + 1 : 1;
    departmentsData.push({
      id: newId,
      agencyId: targetAgencyId,
      name: name,
      description: description,
      active: active
    });
    if (deptModalContext === 'agency') {
      deptKeyword = '';
      document.getElementById('deptSearchInput').value = '';
      deptPage = 1;
    } else {
      topDeptKeyword = '';
      document.getElementById('topDeptSearchInput').value = '';
      topDeptPage = 1;
    }
    showToast('Thêm phòng ban thành công.', 'success');
  } else {
    const dept = departmentsData.find(d => d.id === deptEditingId);
    if (!dept) {
      showToast('Lưu thất bại. Không tìm thấy phòng ban cần cập nhật.', 'error');
      return;
    }
    dept.name = name;
    dept.description = description;
    dept.active = active;
    if (deptModalContext === 'top') dept.agencyId = targetAgencyId;
    showToast('Cập nhật phòng ban thành công.', 'success');
  }

  closeDeptModal();
  renderDeptTable();
  renderTopDeptTable();
}

/* ============================================================
   5B. DANH SÁCH PHÒNG BAN (TOP-LEVEL, TOÀN HỆ THỐNG)
   ============================================================ */
let topDeptKeyword = '';
let topDeptPage = 1;
const TOP_DEPT_PAGE_SIZE = 10;
let topDeptOpenMenuId = null;

function getFilteredTopDepartments() {
  const kw = topDeptKeyword.trim().toLowerCase();
  if (!kw) return departmentsData;
  return departmentsData.filter(d => d.name.toLowerCase().includes(kw));
}

function renderTopDeptTable() {
  const tbody = document.getElementById('topDeptTableBody');
  const pagination = document.getElementById('topDeptPagination');
  if (!tbody || !pagination) return;

  const filtered = getFilteredTopDepartments();
  const totalPages = Math.max(1, Math.ceil(filtered.length / TOP_DEPT_PAGE_SIZE));
  if (topDeptPage > totalPages) topDeptPage = totalPages;

  const start = (topDeptPage - 1) * TOP_DEPT_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + TOP_DEPT_PAGE_SIZE);

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="center" style="color:#9AA0AC;padding:24px;">Không tìm thấy phòng ban phù hợp</td></tr>`;
  } else {
    tbody.innerHTML = pageItems.map((d, i) => {
      const agency = agenciesData.find(a => a.id === d.agencyId);
      const badge = d.active
        ? `<span class="status-badge status-badge-on">Hoạt động</span>`
        : `<span class="status-badge status-badge-off">Không hoạt động</span>`;
      const menuShow = topDeptOpenMenuId === d.id ? ' show' : '';
      return `
        <tr>
          <td class="center">${start + i + 1}</td>
          <td><strong>${d.name}</strong></td>
          <td>${agency ? agency.name : ''}</td>
          <td>${d.description || ''}</td>
          <td class="center">${badge}</td>
          <td class="center">
            <div class="action-menu-wrap">
              <button class="act-btn-dots" title="Xử lý" onclick="toggleTopDeptMenu(event, ${d.id})"><i class="fa-solid fa-ellipsis-vertical"></i></button>
              <div class="action-menu${menuShow}" id="topDeptMenu-${d.id}">
                <div class="action-menu-item" onclick="closeTopDeptMenu(); openDeptModal('view', ${d.id}, 'top')"><i class="fa-solid fa-eye"></i>Xem</div>
                <div class="action-menu-item" onclick="closeTopDeptMenu(); openDeptModal('edit', ${d.id}, 'top')"><i class="fa-solid fa-pen"></i>Sửa</div>
                <div class="action-menu-item danger" onclick="closeTopDeptMenu(); openDeleteConfirm('department', ${d.id})"><i class="fa-solid fa-trash"></i>Xóa</div>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  pagination.innerHTML = `
    <button class="page-btn" id="topDeptPrevBtn" ${topDeptPage <= 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>
    <span class="page-info">Trang ${topDeptPage}/${totalPages}</span>
    <button class="page-btn" id="topDeptNextBtn" ${topDeptPage >= totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>
  `;

  const prevBtn = document.getElementById('topDeptPrevBtn');
  const nextBtn = document.getElementById('topDeptNextBtn');
  if (prevBtn) prevBtn.addEventListener('click', () => { if (topDeptPage > 1) { topDeptPage--; renderTopDeptTable(); } });
  if (nextBtn) nextBtn.addEventListener('click', () => { if (topDeptPage < totalPages) { topDeptPage++; renderTopDeptTable(); } });
}

function handleTopDeptSearch() {
  const input = document.getElementById('topDeptSearchInput');
  topDeptKeyword = input ? input.value : '';
  topDeptPage = 1;
  renderTopDeptTable();
}

function handleTopDeptReset() {
  const input = document.getElementById('topDeptSearchInput');
  if (input) input.value = '';
  topDeptKeyword = '';
  topDeptPage = 1;
  renderTopDeptTable();
  showToast('Đã làm mới dữ liệu thành công', 'success');
}

function toggleTopDeptMenu(evt, deptId) {
  evt.stopPropagation();
  topDeptOpenMenuId = topDeptOpenMenuId === deptId ? null : deptId;
  renderTopDeptTable();
}

function closeTopDeptMenu() {
  topDeptOpenMenuId = null;
}

document.addEventListener('click', () => {
  if (topDeptOpenMenuId !== null) {
    topDeptOpenMenuId = null;
    renderTopDeptTable();
  }
});

/* ============================================================
   6. XÓA (Modal xác nhận dùng chung: Cơ quan & Phòng ban)
   ============================================================ */
let deleteContext = { type: null, id: null };

function openDeleteConfirm(type, id) {
  let name = '';
  if (type === 'agency') {
    const item = agenciesData.find(a => a.id === id);
    if (!item) return;
    name = item.name;
  } else if (type === 'department') {
    const item = departmentsData.find(d => d.id === id);
    if (!item) return;
    name = item.name;
  } else {
    return;
  }

  deleteContext = { type, id };
  document.getElementById('deleteTargetName').textContent = name;
  document.getElementById('deleteConfirmModal').classList.add('show');
}

function closeDeleteConfirm() {
  deleteContext = { type: null, id: null };
  document.getElementById('deleteConfirmModal').classList.remove('show');
}

function confirmDeleteTarget() {
  const { type, id } = deleteContext;
  if (!type || id === null) return;

  if (type === 'agency') {
    const index = agenciesData.findIndex(a => a.id === id);
    if (index === -1) {
      showToast('Xóa thất bại. Không tìm thấy cơ quan.', 'error');
      closeDeleteConfirm();
      return;
    }
    agenciesData.splice(index, 1);
    closeDeleteConfirm();
    renderAgenciesTable();
    showToast('Xóa cơ quan thành công.', 'success');
  } else if (type === 'department') {
    const index = departmentsData.findIndex(d => d.id === id);
    if (index === -1) {
      showToast('Xóa thất bại. Không tìm thấy phòng ban.', 'error');
      closeDeleteConfirm();
      return;
    }
    departmentsData.splice(index, 1);
    closeDeleteConfirm();
    renderDeptTable();
    renderTopDeptTable();
    showToast('Xóa phòng ban thành công.', 'success');
  }
}

/* ============================================================
   7. FORM 2 — NGƯỜI PHỤ TRÁCH CHÍNH
   ============================================================ */
let form2SelectedAgencyId = null;
let form2SelectedStaffId = null;
let form2StaffCommittedText = ''; // giá trị input đã "chốt" khi chọn 1 nhân viên

function getManagedAgencies() {
  return agenciesData.filter(a => a.managedByCurrentUser);
}

/* ---------- Form 2: Dropdown Cơ quan (custom combo, đồng bộ style với Nhân viên) ---------- */
function renderForm2AgencyOptions() {
  const dropdown = document.getElementById('form2AgencyDropdown');
  if (!dropdown) return;

  const managed = getManagedAgencies();
  if (managed.length === 0) {
    dropdown.innerHTML = `<div class="combo-empty">Không có cơ quan được gán quyền</div>`;
    return;
  }

  dropdown.innerHTML = managed.map(a => {
    const selectedCls = a.id === form2SelectedAgencyId ? ' selected' : '';
    return `<div class="combo-option${selectedCls}" data-id="${a.id}" onclick="selectForm2AgencyOption(${a.id})">${a.name}</div>`;
  }).join('');
}

function openForm2AgencyDropdown() {
  const dropdown = document.getElementById('form2AgencyDropdown');
  if (!dropdown) return;
  renderForm2AgencyOptions();
  dropdown.classList.add('show');
}

function closeForm2AgencyDropdown() {
  const dropdown = document.getElementById('form2AgencyDropdown');
  if (dropdown) dropdown.classList.remove('show');
}

function selectForm2AgencyOption(agencyId) {
  const agency = agenciesData.find(a => a.id === agencyId);
  if (!agency) return;

  form2SelectedAgencyId = agency.id;
  const searchEl = document.getElementById('form2AgencySearch');
  const idEl = document.getElementById('form2AgencyIdInput');
  if (searchEl) searchEl.value = agency.name;
  if (idEl) idEl.value = agency.id;
  closeForm2AgencyDropdown();
  prefillForm2StaffForAgency(agency.id);
}

function resetForm2StaffSelection() {
  form2SelectedStaffId = null;
  form2StaffCommittedText = '';
  const searchEl = document.getElementById('form2StaffSearch');
  const idEl = document.getElementById('form2StaffIdInput');
  const detailEl = document.getElementById('form2StaffDetail');
  if (searchEl) searchEl.value = '';
  if (idEl) idEl.value = '';
  if (detailEl) detailEl.classList.add('hidden');
  closeForm2StaffDropdown();
}

/* Tìm nhân viên đang là người phụ trách chính đã lưu của 1 cơ quan (nếu có),
   ưu tiên primaryManagerAssignments, sau đó đối chiếu agency.manager với staffData. */
function findAssignedStaffId(agencyId) {
  if (primaryManagerAssignments[agencyId] != null) {
    return primaryManagerAssignments[agencyId];
  }
  const agency = agenciesData.find(a => a.id === agencyId);
  if (agency && agency.manager) {
    const staff = staffData.find(s => s.agencyId === agencyId && s.fullName === agency.manager);
    if (staff) return staff.id;
  }
  return null;
}

/* Pre-fill lại nhân viên phụ trách đã lưu (nếu có) khi mở Form 2 hoặc đổi cơ quan;
   nếu cơ quan chưa có ai được cấu hình thì để trống. */
function prefillForm2StaffForAgency(agencyId) {
  const staffId = findAssignedStaffId(agencyId);
  if (staffId != null) {
    const staff = staffData.find(s => s.id === staffId);
    if (staff) {
      form2SelectedStaffId = staff.id;
      form2StaffCommittedText = `${staff.username} – ${staff.fullName}`;
      const searchEl = document.getElementById('form2StaffSearch');
      const idEl = document.getElementById('form2StaffIdInput');
      if (searchEl) searchEl.value = form2StaffCommittedText;
      if (idEl) idEl.value = staff.id;
      closeForm2StaffDropdown();
      renderStaffDetail(staff);
      return;
    }
  }
  resetForm2StaffSelection();
}

function getStaffOfSelectedAgency() {
  if (form2SelectedAgencyId === null) return [];
  return staffData.filter(s => s.agencyId === form2SelectedAgencyId);
}

function renderForm2StaffOptions(keyword) {
  const dropdown = document.getElementById('form2StaffDropdown');
  if (!dropdown) return;

  const kw = (keyword || '').trim().toLowerCase();
  const staffList = getStaffOfSelectedAgency().filter(s =>
    s.username.toLowerCase().includes(kw) || s.fullName.toLowerCase().includes(kw)
  );

  if (staffList.length === 0) {
    dropdown.innerHTML = `<div class="combo-empty">Không tìm thấy nhân viên phù hợp</div>`;
    return;
  }

  dropdown.innerHTML = staffList.map(s => {
    const selectedCls = s.id === form2SelectedStaffId ? ' selected' : '';
    return `<div class="combo-option${selectedCls}" data-id="${s.id}" onclick="selectForm2StaffOption(${s.id})">${s.username} – ${s.fullName}</div>`;
  }).join('');
}

/* Mở dropdown: nếu ô tìm kiếm đang hiển thị đúng giá trị đã chọn trước đó (chưa gõ gì thêm)
   thì hiện toàn bộ danh sách thay vì lọc theo chuỗi "username – họ tên" (sẽ không khớp ai). */
function openForm2StaffDropdown() {
  const dropdown = document.getElementById('form2StaffDropdown');
  const searchInput = document.getElementById('form2StaffSearch');
  if (!dropdown || !searchInput) return;

  const typed = searchInput.value;
  const effectiveKeyword = (form2SelectedStaffId !== null && typed === form2StaffCommittedText) ? '' : typed;

  renderForm2StaffOptions(effectiveKeyword);
  dropdown.classList.add('show');
}

function closeForm2StaffDropdown() {
  const dropdown = document.getElementById('form2StaffDropdown');
  if (dropdown) dropdown.classList.remove('show');
}

function selectForm2StaffOption(staffId) {
  const staff = staffData.find(s => s.id === staffId);
  if (!staff) return;

  form2SelectedStaffId = staff.id;
  form2StaffCommittedText = `${staff.username} – ${staff.fullName}`;
  document.getElementById('form2StaffSearch').value = form2StaffCommittedText;
  document.getElementById('form2StaffIdInput').value = staff.id;
  closeForm2StaffDropdown();
  renderStaffDetail(staff);
}

function renderStaffDetail(staff) {
  const agency = agenciesData.find(a => a.id === staff.agencyId);

  document.getElementById('dvUsername').textContent = staff.username;
  document.getElementById('dvFullName').textContent = staff.fullName;
  document.getElementById('dvEmail').textContent = staff.email;
  document.getElementById('dvPhone').textContent = staff.phone;
  document.getElementById('dvBirthday').textContent = staff.birthday;
  document.getElementById('dvGender').textContent = staff.gender;
  document.getElementById('dvAgency').textContent = agency ? agency.name : '';
  document.getElementById('dvDepartment').textContent = staff.department;

  document.getElementById('form2StaffDetail').classList.remove('hidden');
}

function openForm2(preselectAgencyId) {
  const managed = getManagedAgencies();
  if (managed.length === 0) {
    showToast('Tài khoản của bạn hiện không được gán quyền quản lý cơ quan nào.', 'error');
    return;
  }

  const target = preselectAgencyId && managed.some(a => a.id === preselectAgencyId)
    ? preselectAgencyId
    : managed[0].id;

  form2SelectedAgencyId = target;
  const agency = agenciesData.find(a => a.id === target);
  const searchEl = document.getElementById('form2AgencySearch');
  const idEl = document.getElementById('form2AgencyIdInput');
  if (searchEl) searchEl.value = agency ? agency.name : '';
  if (idEl) idEl.value = target;

  prefillForm2StaffForAgency(target);
  setPageHeading('Cấu hình người phụ trách chính');
  showView('form2View');
}

function saveForm2() {
  if (form2SelectedAgencyId === null) {
    showToast('Vui lòng chọn cơ quan.', 'error');
    return;
  }
  if (form2SelectedStaffId === null) {
    showToast('Vui lòng chọn nhân viên phụ trách chính.', 'error');
    return;
  }

  const staff = staffData.find(s => s.id === form2SelectedStaffId);
  const agency = agenciesData.find(a => a.id === form2SelectedAgencyId);
  if (!staff || !agency) return;

  const oldStaffId = findAssignedStaffId(form2SelectedAgencyId);

  if (oldStaffId != null && oldStaffId !== staff.id) {
    const oldStaff = staffData.find(s => s.id === oldStaffId);
    openChangeManagerConfirm(agency, oldStaff, staff);
    return;
  }

  commitForm2Save(agency, staff);
}

function commitForm2Save(agency, staff) {
  primaryManagerAssignments[agency.id] = staff.id;
  // Cập nhật cột "Người phụ trách" ngoài danh sách cơ quan
  agency.manager = staff.fullName;

  showToast('Lưu người phụ trách chính thành công.', 'success');
  backToList();
}

/* ---------- Modal xác nhận thay đổi người phụ trách ---------- */
let changeManagerPending = null;

function openChangeManagerConfirm(agency, oldStaff, newStaff) {
  changeManagerPending = { agency, staff: newStaff };
  const textEl = document.getElementById('changeManagerText');
  if (textEl) {
    textEl.innerHTML = `Bạn đang thay đổi người phụ trách chính của cơ quan <strong>${agency.name}</strong> từ <strong>${oldStaff ? oldStaff.fullName : 'chưa cấu hình'}</strong> sang <strong>${newStaff.fullName}</strong>. Bạn có chắc chắn?`;
  }
  document.getElementById('changeManagerConfirmModal').classList.add('show');
}

function closeChangeManagerConfirm() {
  changeManagerPending = null;
  document.getElementById('changeManagerConfirmModal').classList.remove('show');
}

function confirmChangeManager() {
  if (!changeManagerPending) return;
  const { agency, staff } = changeManagerPending;
  closeChangeManagerConfirm();
  commitForm2Save(agency, staff);
}

/* ============================================================
   8. TOAST: Thông báo lưu thành công / thất bại
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

  /* --- Sidebar: điều hướng Quản lý cơ quan <-> Quản lý phòng ban --- */
  const navAgency = document.getElementById('nav-quan-ly-co-quan');
  const navDept = document.getElementById('nav-quan-ly-phong-ban');
  if (navAgency) navAgency.addEventListener('click', goToAgencyList);
  if (navDept) navDept.addEventListener('click', goToDeptListTop);

  /* --- Danh sách phòng ban (top-level): tìm kiếm / làm mới / thêm --- */
  const btnTopDeptSearch = document.getElementById('btnTopDeptSearch');
  const btnTopDeptReset = document.getElementById('btnTopDeptReset');
  const btnTopDeptAdd = document.getElementById('btnTopDeptAdd');
  const topDeptSearchInput = document.getElementById('topDeptSearchInput');

  if (btnTopDeptSearch) btnTopDeptSearch.addEventListener('click', handleTopDeptSearch);
  if (btnTopDeptReset) btnTopDeptReset.addEventListener('click', handleTopDeptReset);
  if (btnTopDeptAdd) btnTopDeptAdd.addEventListener('click', () => openDeptModal('add', null, 'top'));
  if (topDeptSearchInput) {
    topDeptSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleTopDeptSearch();
    });
  }

  /* --- Modal xác nhận thay đổi người phụ trách --- */
  const changeManagerCloseBtn = document.getElementById('changeManagerCloseBtn');
  const changeManagerCancelBtn = document.getElementById('changeManagerCancelBtn');
  const changeManagerConfirmBtn = document.getElementById('changeManagerConfirmBtn');
  const changeManagerConfirmModal = document.getElementById('changeManagerConfirmModal');

  if (changeManagerCloseBtn) changeManagerCloseBtn.addEventListener('click', closeChangeManagerConfirm);
  if (changeManagerCancelBtn) changeManagerCancelBtn.addEventListener('click', closeChangeManagerConfirm);
  if (changeManagerConfirmBtn) changeManagerConfirmBtn.addEventListener('click', confirmChangeManager);
  if (changeManagerConfirmModal) {
    changeManagerConfirmModal.addEventListener('click', (e) => {
      if (e.target === changeManagerConfirmModal) closeChangeManagerConfirm();
    });
  }

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
      if (parts.length === 2 && parts[0] && parts[1]) {
        updateMapPlaceholder(parts[0], parts[1]);
      } else {
        updateMapPlaceholder('', '');
      }
    });
  }

  /* --- Danh sách phòng ban (trong Form 1) --- */
  const btnDeptSearch = document.getElementById('btnDeptSearch');
  const btnDeptReset = document.getElementById('btnDeptReset');
  const btnAddDept = document.getElementById('btnAddDept');
  const deptSearchInput = document.getElementById('deptSearchInput');

  if (btnDeptSearch) btnDeptSearch.addEventListener('click', handleDeptSearch);
  if (btnDeptReset) btnDeptReset.addEventListener('click', handleDeptReset);
  if (btnAddDept) btnAddDept.addEventListener('click', () => openDeptModal('add', null, 'agency'));
  if (deptSearchInput) {
    deptSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleDeptSearch();
    });
  }

  /* --- Modal Thêm/Sửa phòng ban --- */
  const deptModalCloseBtn = document.getElementById('deptModalCloseBtn');
  const deptCancelBtn = document.getElementById('deptCancelBtn');
  const deptSaveBtn = document.getElementById('deptSaveBtn');
  const deptModalOverlay = document.getElementById('deptModalOverlay');

  if (deptModalCloseBtn) deptModalCloseBtn.addEventListener('click', closeDeptModal);
  if (deptCancelBtn) deptCancelBtn.addEventListener('click', closeDeptModal);
  if (deptSaveBtn) deptSaveBtn.addEventListener('click', saveDeptModal);
  if (deptModalOverlay) {
    deptModalOverlay.addEventListener('click', (e) => {
      if (e.target === deptModalOverlay) closeDeptModal();
    });
  }

  /* --- Form 2 --- */
  const btnForm2Back = document.getElementById('btnForm2Back');
  const btnForm2Save = document.getElementById('btnForm2Save');
  const form2AgencySearch = document.getElementById('form2AgencySearch');
  const form2AgencyCombo = document.getElementById('form2AgencyCombo');
  const form2StaffSearch = document.getElementById('form2StaffSearch');
  const form2StaffCombo = document.getElementById('form2StaffCombo');

  if (btnForm2Back) btnForm2Back.addEventListener('click', backToList);
  if (btnForm2Save) btnForm2Save.addEventListener('click', saveForm2);

  /* Form 2: Cơ quan combo */
  if (form2AgencySearch) {
    form2AgencySearch.addEventListener('focus', openForm2AgencyDropdown);
    form2AgencySearch.addEventListener('click', openForm2AgencyDropdown);
  }
  document.addEventListener('click', (e) => {
    if (form2AgencyCombo && !form2AgencyCombo.contains(e.target)) {
      closeForm2AgencyDropdown();
    }
  });

  /* Form 2: Nhân viên combo */
  if (form2StaffSearch) {
    form2StaffSearch.addEventListener('focus', openForm2StaffDropdown);
    form2StaffSearch.addEventListener('input', () => {
      form2SelectedStaffId = null;
      const idEl = document.getElementById('form2StaffIdInput');
      const detailEl = document.getElementById('form2StaffDetail');
      if (idEl) idEl.value = '';
      if (detailEl) detailEl.classList.add('hidden');
      openForm2StaffDropdown();
    });
  }
  document.addEventListener('click', (e) => {
    if (form2StaffCombo && !form2StaffCombo.contains(e.target)) {
      closeForm2StaffDropdown();
    }
  });

  /* --- Modal xác nhận xóa (dùng chung Cơ quan & Phòng ban) --- */
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
});
