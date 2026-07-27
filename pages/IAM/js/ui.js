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
          <div style="display:flex;gap:6px;justify-content:center;">
            <button style="border:none;background:#D0EBFF;color:#0091FF;padding:4px 10px;border-radius:6px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;"><i class="fa-solid fa-pen"></i> Sửa</button>
            <button style="border:none;background:#FFE2E8;color:#EA0001;padding:4px 10px;border-radius:6px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;"><i class="fa-solid fa-trash"></i> Xóa</button>
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

document.addEventListener('DOMContentLoaded', renderAgenciesTable);
