(function () {
  var STORAGE_KEY = 'gialai_home_sidebar_collapsed';
  var DEFAULT_FOLDER = 'Quản trị chỉ đạo';

  var nav = document.getElementById('home-nav');
  var frame = document.getElementById('home-frame');
  var titleEl = document.getElementById('home-active-title');
  var collapseBtn = document.getElementById('home-collapse-btn');
  var expandBtn = document.getElementById('home-expand-btn');
  var routes = Array.isArray(window.GIALAI_ROUTES) ? window.GIALAI_ROUTES : [];

  if (!nav || !frame) return;

  /** Path tương đối từ pages/home — ưu tiên route.path (đã encode). */
  function routeHref(route) {
    if (route.path) return route.path;
    if (route.folder && route.html) {
      return '../' + encodeURIComponent(route.folder) + '/' + encodeURIComponent(route.html);
    }
    return '';
  }

  function setCollapsed(collapsed) {
    document.body.classList.toggle('is-collapsed', collapsed);
    if (expandBtn) expandBtn.hidden = !collapsed;
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
    } catch (e) { /* ignore */ }
  }

  function pickDefaultRoute() {
    var found = routes.find(function (r) {
      return r.folder === DEFAULT_FOLDER || r.title === DEFAULT_FOLDER || r.id === 'quan-tri-pm6' || r.id === 'quản-trị-chỉ-đạo';
    });
    return found || routes[0] || null;
  }

  function setActive(route, linkEl) {
    Array.prototype.forEach.call(nav.querySelectorAll('.home-nav-link'), function (el) {
      el.classList.toggle('is-active', el === linkEl);
    });
    if (titleEl) titleEl.textContent = route.title;
    // Gán relative src — browser resolve theo URL trang home hiện tại
    frame.removeAttribute('srcdoc');
    frame.src = routeHref(route);
  }

  function iconFor(route) {
    if (route.folder === DEFAULT_FOLDER || route.id === 'quan-tri-pm6' || route.id === 'quản-trị') return 'fa-solid fa-gear';
    if (route.folder === 'dashboard' || route.id === 'dashboard') return 'fa-solid fa-chart-pie';
    return 'fa-solid fa-file-lines';
  }

  if (!routes.length) {
    nav.innerHTML = '<p class="home-nav-empty">Chưa có route. Chạy: node tools/generate-routes.js</p>';
    if (titleEl) titleEl.textContent = 'Không có trang';
    return;
  }

  var defaultRoute = pickDefaultRoute();
  var defaultLink = null;
  var frag = document.createDocumentFragment();

  routes.forEach(function (route) {
    var a = document.createElement('a');
    a.className = 'home-nav-link';
    a.href = routeHref(route);
    a.target = 'home-frame';
    a.rel = 'noopener';

    var icon = document.createElement('i');
    icon.className = iconFor(route);
    icon.setAttribute('aria-hidden', 'true');

    var label = document.createElement('span');
    label.textContent = route.title;

    a.appendChild(icon);
    a.appendChild(label);
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      setActive(route, a);
    });

    frag.appendChild(a);

    if (defaultRoute && route.folder === defaultRoute.folder) {
      defaultLink = a;
    }
  });

  nav.appendChild(frag);

  if (defaultRoute && defaultLink) {
    setActive(defaultRoute, defaultLink);
  }

  if (collapseBtn) {
    collapseBtn.addEventListener('click', function () {
      setCollapsed(true);
    });
  }
  if (expandBtn) {
    expandBtn.addEventListener('click', function () {
      setCollapsed(false);
    });
  }

  var savedCollapsed = false;
  try {
    savedCollapsed = localStorage.getItem(STORAGE_KEY) === '1';
  } catch (e) { /* ignore */ }
  setCollapsed(savedCollapsed);
})();
