# CONTEXT — Dashboard Phân tích Dân cư Tỉnh Gia Lai

> **Đây là file đầu tiên cần đọc.** Mọi AI tham gia dự án này hãy đọc file này trước khi làm bất kỳ điều gì.

---

## Dự án là gì
Hệ thống dashboard trực quan hóa số liệu dân cư tỉnh Gia Lai, gồm nhiều trang phân tích theo từng chiều (giới tính, độ tuổi, dân tộc, tôn giáo...).

Giai đoạn hiện tại: **Thiết kế prototype UI** — chưa kết nối backend.

---

## Đọc theo thứ tự này

| Bước | File | Mục đích |
|------|------|----------|
| 1 | [`system_design.md`](./system_design.md) | Nghiệp vụ: mục tiêu, vai trò, luồng, tính năng |
| 2 | [`pages/p01-dan-cu-gioi-tinh/SPECS.md`](./pages/p01-dan-cu-gioi-tinh/SPECS.md) | Chi tiết trang đang hoàn thiện |
| 3 | [`pages/p01-dan-cu-gioi-tinh/index.html`](./pages/p01-dan-cu-gioi-tinh/index.html) | HTML trang p01 |

---

## Trạng thái hiện tại

| Màn hình | Trạng thái |
|----------|------------|
| p01 — Dân cư theo giới tính | ✅ Prototype xong, đang hoàn thiện |
| p02 → p06 | 📋 Chưa bắt đầu |

---

## Cấu trúc thư mục
```
Thiết kế/
├── CONTEXT.md              ← Đọc trước tiên
├── system_design.md        ← Tài liệu BA
├── shared/css/
│   ├── tokens.css          ← CSS vars dùng chung mọi trang
│   └── base.css            ← Base layout dùng chung
└── pages/
    └── p[xx]-[ten-trang]/
        ├── SPECS.md        ← Đặc tả trang
        ├── index.html
        ├── style.css
        └── js/
            ├── state.js
            ├── ui.js
            ├── charts.js
            └── map.js
```

---

## Quy tắc làm việc quan trọng

Xem đầy đủ tại `.agents/skills/gia-lai-dashboard/SKILL.md`

Tóm tắt nhanh:
- Không hardcode — mọi giá trị đều phải dynamic hoặc dùng token
- DRY — không lặp code, dùng shared CSS và shared JS
- Directive gắn vào **metric-block** (khối chỉ số), không phải hàng dữ liệu
- Tạo chỉ đạo ở **Event Panel (Drawer)**, không phải click vào chart
- Bao giờ cũng hỏi xác nhận trước khi code
