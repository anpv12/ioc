/* ============================================================
   UI.JS — Trang IAM (Identity and Access Management)
   ============================================================ */

const usersData = [
  { id: 1, name: 'Nguyễn Văn An', email: 'an.nv@gialai.gov.vn', dept: 'Sở Khoa học và Công nghệ', role: 'Lãnh đạo', roleClass: 'role-leader', status: 'Hoạt động' },
  { id: 2, name: 'Trần Thị Trinh', email: 'trinh.ttt@gialai.gov.vn', dept: 'Trung tâm IOC', role: 'Quản trị hệ thống', roleClass: 'role-admin', status: 'Hoạt động' },
  { id: 3, name: 'Lê Văn Nam', email: 'nam.lv@gialai.gov.vn', dept: 'Sở Y tế', role: 'Người thực thi', roleClass: 'role-user', status: 'Hoạt động' },
  { id: 4, name: 'Phạm Minh Tuấn', email: 'tuan.pm@gialai.gov.vn', dept: 'Sở Lao động - TB&XH', role: 'Người thực thi', roleClass: 'role-user', status: 'Tạm khóa' }
];

function renderUsersTable() {
  const tbody = document.getElementById('iamUserBody');
  if (!tbody) return;

  let html = '';
  usersData.forEach((u) => {
    html += `
      <tr>
        <td class="center">${u.id}</td>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td>${u.dept}</td>
        <td class="center"><span class="role-badge ${u.roleClass}">${u.role}</span></td>
        <td class="center">${u.status}</td>
        <td class="center">
          <button style="border:none;background:#D0EBFF;color:#0091FF;padding:4px 8px;border-radius:4px;cursor:pointer;font-family:inherit;">Sửa</button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderUsersTable);
