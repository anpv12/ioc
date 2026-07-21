/**
 * charts.js — Chart.js render
 * Trang: p01 - Tình hình dân cư theo giới tính
 *
 * Phụ thuộc: Chart.js (CDN) phải được load trước.
 * Render 2 biểu đồ cột ngang: Top 5 cao nhất & thấp nhất.
 */

// ----- Bar chart: Top 5 nhân khẩu cao nhất -----
new Chart(document.getElementById('chartHigh'), {
  type: 'bar',
  data: {
    labels: ['Phường Quy Nhơn', 'Xã Tuy Phước', 'Phường Quy Nhơn Nam', 'Phường Pleiku', 'Xã Chư Sê'],
    datasets: [
      { label: 'Nhân khẩu nữ', data: [65920, 38985, 38734, 38052, 34007], backgroundColor: '#F39798', borderRadius: 3, barPercentage: 0.55 },
      { label: 'Nhân khẩu nam', data: [62312, 38394, 36105, 36610, 34260], backgroundColor: '#4A90E2', borderRadius: 3, barPercentage: 0.55 }
    ]
  },
  options: {
    indexAxis: 'y',
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top', align: 'center', labels: { usePointStyle: true, pointStyle: 'circle', font: { size: 12 } } } },
    scales: {
      x: { min: 0, max: 70000, ticks: { stepSize: 10000, callback: v => v.toLocaleString('vi-VN') }, grid: { color: '#eee' } },
      y: { grid: { display: false }, ticks: { font: { size: 12 } } }
    }
  }
});

// ----- Bar chart: Top 5 nhân khẩu thấp nhất -----
new Chart(document.getElementById('chartLow'), {
  type: 'bar',
  data: {
    labels: ['Xã An Toàn', 'Xã Canh Liên', 'Xã Nhơn Châu', 'Xã Ia Mơ', 'Xã Ia Púch'],
    datasets: [
      { label: 'Nhân khẩu nữ', data: [913, 1175, 1197, 1795, 2079], backgroundColor: '#F39798', borderRadius: 3, barPercentage: 0.55 },
      { label: 'Nhân khẩu nam', data: [927, 1230, 1159, 1829, 2052], backgroundColor: '#4A90E2', borderRadius: 3, barPercentage: 0.55 }
    ]
  },
  options: {
    indexAxis: 'y',
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top', align: 'center', labels: { usePointStyle: true, pointStyle: 'circle', font: { size: 12 } } } },
    scales: {
      x: { min: 0, max: 2500, ticks: { stepSize: 500, callback: v => v.toLocaleString('vi-VN') }, grid: { color: '#eee' } },
      y: { grid: { display: false }, ticks: { font: { size: 12 } } }
    }
  }
});
