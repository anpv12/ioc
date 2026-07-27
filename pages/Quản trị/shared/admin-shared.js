/* ============================================================
   admin-shared.js — Shared logic for all Quản trị subpages
   Includes: layout loader, sidebar collapse, toast, confirm dialog
   ============================================================ */

/**
 * Load sidebar + topbar từ shared/layout.html vào .app
 * @param {string} activeNavId  - id của nav-item cần active, vd: 'nav-quy-trinh-dong'
 * @param {string} pageTitle    - Tiêu đề hiển thị ở breadcrumb và pageTitle
 */
async function loadSharedLayout(activeNavId, pageTitle) {
  const app = document.querySelector('.app');
  if (!app) return;

  try {
    const res = await fetch(new URL('../shared/layout.html', location.href).href);
    if (!res.ok) throw new Error('fetch failed');
    const html = await res.text();

    // Inject layout vào đầu .app (trước #pageContent)
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    // Sidebar
    const sidebar = tmp.querySelector('.sidebar');
    const main = tmp.querySelector('.main');
    if (sidebar) app.insertBefore(sidebar, app.firstChild);
    if (main) {
      // Chuyển #pageContent vào main.content nếu có
      const existingContent = app.querySelector('#pageContent');
      const mainContent = main.querySelector('#pageContent');
      if (existingContent && mainContent) {
        mainContent.replaceWith(existingContent);
      }
      app.appendChild(main);
    }
  } catch {
    // Fallback: layout.html không load được — dùng inline HTML đã có
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

/* ---------------- Toast / showNotice ---------------- */
let _noticeTimeout = null;
function showNotice(message, autoHideMs = 2500) {
  if (!message) return;
  const toast = document.getElementById('toast');
  if (!toast) return;
  const titleEl = document.getElementById('toast-title');
  const msgEl = document.getElementById('toast-message');
  if (titleEl) titleEl.innerText = 'Thành công';
  if (msgEl) msgEl.innerText = message;
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
    if (confirm(`${title}\n${message}`)) { if (onOk) onOk(); }
    else { if (onCancel) onCancel(); }
    return;
  }
  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;
  overlay.hidden = false;

  const doOk = () => { overlay.hidden = true; okBtn.removeEventListener('click', doOk); cancelBtn.removeEventListener('click', doCancel); if (onOk) onOk(); };
  const doCancel = () => { overlay.hidden = true; okBtn.removeEventListener('click', doOk); cancelBtn.removeEventListener('click', doCancel); if (onCancel) onCancel(); };
  okBtn.addEventListener('click', doOk);
  cancelBtn.addEventListener('click', doCancel);
}
