/* ============================================================
   SIDEBAR HTML TEMPLATE — nguồn duy nhất (single source of truth)
   Mỗi module HTML không cần chứa sidebar, loadSharedLayout sẽ inject.
   ============================================================ */
const ADMIN_SIDEBAR_HTML = `
<div class="sidebar">
  <div class="sidebar-top">
    <span class="menu-label">Menu</span>
    <button type="button" class="collapse-btn" id="sidebarCollapseBtn" aria-label="Thu gọn menu" title="Thu gọn">
      <i class="fa-solid fa-angles-left" aria-hidden="true"></i>
    </button>
  </div>
  <div class="sidebar-search"><input type="text" placeholder="Tìm kiếm..."></div>

  <div class="nav-parent open" id="navParent">
    <span class="nav-ic"><i class="fa-solid fa-table-columns"></i></span>
    <span>Dashboard</span>
    <span class="chev"><i class="fa-solid fa-chevron-down"></i></span>
  </div>
  <div class="nav-children" id="navChildren">
    <div class="nav-item" id="nav-dashboard-giam-sat" onclick="window.location.href='../../dashboard/index.html'">
      <span class="dot"></span><span>Dashboard giám sát</span>
    </div>
  </div>

  <div class="nav-parent open" id="adminNavParent">
    <span class="nav-ic"><i class="fa-solid fa-list-check"></i></span>
    <span>Quản trị chỉ đạo</span>
    <span class="chev"><i class="fa-solid fa-chevron-down"></i></span>
  </div>
  <div class="nav-children" id="adminNavChildren">
    <div class="nav-item" id="nav-quy-trinh-dong" onclick="window.location.href='../../Qu%E1%BA%A3n%20tr%E1%BB%8B%20ch%E1%BB%89%20%C4%91%E1%BA%A1o/quy-trinh-dong/index.html'">
      <span class="dot"></span><span>Quy trình động</span>
    </div>
    <div class="nav-item" id="nav-bao-cao-thong-ke" onclick="window.location.href='../../Qu%E1%BA%A3n%20tr%E1%BB%8B%20ch%E1%BB%89%20%C4%91%E1%BA%A1o/bao-cao-thong-ke/index.html'">
      <span class="dot"></span><span>Báo cáo thống kê</span>
    </div>
    <div class="nav-item" id="nav-xu-ly-chi-dao" onclick="window.location.href='../../Qu%E1%BA%A3n%20tr%E1%BB%8B%20ch%E1%BB%89%20%C4%91%E1%BA%A1o/xu-ly-chi-dao/index.html'">
      <span class="dot"></span><span>Xử lý chỉ đạo</span>
    </div>
  </div>

  <div class="nav-parent open" id="sysNavParent">
    <span class="nav-ic"><i class="fa-solid fa-gears"></i></span>
    <span>Quản trị hệ thống</span>
    <span class="chev"><i class="fa-solid fa-chevron-down"></i></span>
  </div>
  <div class="nav-children" id="sysNavChildren">
    <div class="nav-item" id="nav-quan-tri-quyen" onclick="window.location.href='../../Qu%E1%BA%A3n%20tr%E1%BB%8B%20h%E1%BB%87%20th%E1%BB%91ng/quan-tri-quyen/index.html'">
      <span class="dot"></span><span>Quản trị quyền</span>
    </div>
    <div class="nav-item" id="nav-quan-tri-phan-quyen" onclick="window.location.href='../../Qu%E1%BA%A3n%20tr%E1%BB%8B%20h%E1%BB%87%20th%E1%BB%91ng/quan-tri-phan-quyen/index.html'">
      <span class="dot"></span><span>Quản trị phân quyền</span>
    </div>
    <div class="nav-item" id="nav-quan-ly-chi-dao" onclick="window.location.href='../../Qu%E1%BA%A3n%20tr%E1%BB%8B%20h%E1%BB%87%20th%E1%BB%91ng/quan-ly-chi-dao/index.html'">
      <span class="dot"></span><span>Quản lý chỉ đạo</span>
    </div>
  </div>
</div>`;

/**
 * Inject sidebar vào .app và đánh dấu nav-item active.
 * Gọi ngay trong <script> cuối <body> của mỗi trang.
 * @param {string} activeNavId  - id của nav-item cần active
 * @param {string} pageTitle    - Tiêu đề trang (breadcrumb)
 */
function loadSharedLayout(activeNavId, pageTitle) {
  const app = document.querySelector('.app');
  if (app && !app.querySelector('.sidebar')) {
    // Inject sidebar nếu chưa có (tránh inject 2 lần)
    app.insertAdjacentHTML('afterbegin', ADMIN_SIDEBAR_HTML);
  }

  // Đánh dấu nav-item active
  if (activeNavId) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeItem = document.getElementById(activeNavId);
    if (activeItem) activeItem.classList.add('active');
  }

  // Cập nhật tiêu đề
  if (pageTitle) {
    const pageTitleEl = document.getElementById('pageTitle');
    const breadcrumb = document.getElementById('breadcrumbCurrent');
    if (pageTitleEl) pageTitleEl.textContent = pageTitle;
    if (breadcrumb) breadcrumb.textContent = pageTitle;
  }

  // Bind sidebar collapse
  bindSidebarCollapse();

  // Bind navigation group collapse
  bindNavigationGroup('navParent', 'navChildren');
  bindNavigationGroup('adminNavParent', 'adminNavChildren');
  bindNavigationGroup('sysNavParent', 'sysNavChildren');
}

/* ---------------- Sidebar collapse / expand ---------------- */
function bindSidebarCollapse() {
  const STORAGE_KEY = 'gialai_admin_sidebar_collapsed';
  const app = document.querySelector('.app');
  const collapseBtn = document.getElementById('sidebarCollapseBtn');
  const expandBtn = document.getElementById('sidebarExpandBtn');
  if (!app || !collapseBtn) return;

  function setCollapsed(collapsed) {
    app.classList.toggle('is-sidebar-collapsed', collapsed);
    if (expandBtn) expandBtn.hidden = !collapsed;
    collapseBtn.setAttribute('aria-label', collapsed ? 'Mở menu' : 'Thu gọn menu');
    collapseBtn.title = collapsed ? 'Mở menu' : 'Thu gọn';
    try { localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0'); } catch (e) { /* ignore */ }
  }

  collapseBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); setCollapsed(true); });
  if (expandBtn) {
    expandBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); setCollapsed(false); });
  }

  let saved = false;
  try { saved = localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { /* ignore */ }
  setCollapsed(saved);
}

/* ---------------- Navigation group collapse ---------------- */
function bindNavigationGroup(parentId, childrenId) {
  const parent = document.getElementById(parentId);
  const children = document.getElementById(childrenId);
  if (!parent || !children) return;
  parent.addEventListener('click', () => {
    parent.classList.toggle('open');
    children.hidden = !parent.classList.contains('open');
  });
}

/* ---------------- Toast / showNotice & showErrorNotice ---------------- */
let _noticeTimeout = null;
function showNotice(message, autoHideMs = 2000) {
  if (!message) return;
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.remove('error', 'danger', 'failure');
  toast.classList.add('success');
  const titleEl = document.getElementById('toast-title');
  const msgEl = document.getElementById('toast-message');
  if (titleEl) titleEl.innerText = 'Thành công';
  if (msgEl) {
    msgEl.innerText = message;
    msgEl.hidden = !message;
  }
  toast.classList.add('show');
  if (_noticeTimeout) clearTimeout(_noticeTimeout);
  if (autoHideMs > 0) {
    _noticeTimeout = setTimeout(() => toast.classList.remove('show'), autoHideMs);
  }
}

function showErrorNotice(message = 'Thao tác thất bại.', title = 'Thất bại', autoHideMs = 2500) {
  if (!message) return;
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.remove('success');
  toast.classList.add('error');
  const titleEl = document.getElementById('toast-title');
  const msgEl = document.getElementById('toast-message');
  if (titleEl) titleEl.innerText = title;
  if (msgEl) {
    msgEl.innerText = message;
    msgEl.hidden = !message;
  }
  toast.classList.add('show');
  if (_noticeTimeout) clearTimeout(_noticeTimeout);
  if (autoHideMs > 0) {
    _noticeTimeout = setTimeout(() => toast.classList.remove('show'), autoHideMs);
  }
}

/* ---------------- Custom Confirm Dialog ---------------- */
function showCustomConfirm(title, message, onOk, onCancel) {
  const overlay = document.getElementById('confirmDialogOverlay');
  const titleEl = document.getElementById('confirmDialogTitle');
  const msgEl = document.getElementById('confirmDialogMessage');
  const okBtn = document.getElementById('confirmDialogOk');
  const cancelBtn = document.getElementById('confirmDialogCancel');
  if (!overlay) {
    if (confirm(`Xác nhận\n${message}`)) { if (onOk) onOk(); }
    else { if (onCancel) onCancel(); }
    return;
  }
  if (titleEl) titleEl.textContent = 'Xác nhận';
  if (msgEl) msgEl.textContent = message;
  overlay.hidden = false;

  const doOk = () => { overlay.hidden = true; okBtn.removeEventListener('click', doOk); cancelBtn.removeEventListener('click', doCancel); if (onOk) onOk(); };
  const doCancel = () => { overlay.hidden = true; okBtn.removeEventListener('click', doOk); cancelBtn.removeEventListener('click', doCancel); if (onCancel) onCancel(); };
  okBtn.addEventListener('click', doOk);
  cancelBtn.addEventListener('click', doCancel);
}

// Export global helpers
window.showNotice = showNotice;
window.showErrorNotice = showErrorNotice;
window.showCustomConfirm = showCustomConfirm;
