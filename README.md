# Task List Project

Task List Project là ứng dụng quản lý công việc gồm backend Ruby on Rails + Grape API và frontend React + Vite.

## Cấu Trúc

- `task-list-be`: Backend Rails API, PostgreSQL, Grape, Grape Entity, Swagger, pagination bằng `grape-kaminari`.
- `task-list-fe`: Frontend React, Vite, Axios, CSS Modules, React Toastify.
- `project-detail.md`: Mô tả yêu cầu tính năng gốc của dự án.

## Tính Năng Chính

- Tạo task với title, description và thời điểm cần hoàn thành.
- Xem danh sách task sắp xếp tăng dần theo thời gian cần hoàn thành.
- Phân trang danh sách task với `page` và `per_page`.
- Lọc task cần hoàn thành trước cuối ngày hôm nay.
- Đánh dấu task quá hạn.
- Mở màn hình chi tiết của một task.
- Chỉnh sửa title, description và due date của task.
- Đánh dấu task đã hoàn thành.
- Xóa task.
- Hiển thị toast message khi create, update, complete và delete thành công.
- Đổi browser tab title theo từng màn hình.

## Frontend Screens

- `/tasks`: Danh sách task, filter due by today, pagination.
- `/tasks/new`: Tạo task mới.
- `/tasks/:taskId`: Xem chi tiết task, edit task, complete task và delete task.

## Backend API

- `GET /api/v1/health`: Health check.
- `GET /api/v1/tasks`: Danh sách task có pagination.
- `POST /api/v1/tasks`: Tạo task.
- `GET /api/v1/tasks/:id`: Xem một task.
- `PATCH /api/v1/tasks/:id`: Cập nhật task.
- `PATCH /api/v1/tasks/:id/complete`: Đánh dấu completed.
- `DELETE /api/v1/tasks/:id`: Xóa task.

Swagger UI: `http://localhost:3000/api-docs`

## Chạy Dự Án

Backend:

```bash
cd task-list-be
docker compose up --build
```

Frontend:

```bash
cd task-list-fe
npm install
npm run dev
```

Frontend chạy tại `http://localhost:5173`.
Backend chạy tại `http://localhost:3000`.
