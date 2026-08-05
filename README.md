# Task List Project

Task List Project là ứng dụng quản lý công việc gồm backend Ruby on Rails + Grape API và frontend React + Vite.

## Cấu Trúc

- `task-list-be`: Backend Rails API, PostgreSQL, Grape, Grape Entity, Swagger, pagination bằng `grape-kaminari`.
- `task-list-fe`: Frontend React, Vite, Axios, CSS Modules, React Toastify và xác thực phiên bằng Devise.
- `project-detail.md`: Mô tả yêu cầu tính năng gốc của dự án.

## Tính Năng Chính

- Tạo task với title, description và thời điểm cần hoàn thành.
- Xem danh sách task sắp xếp tăng dần theo thời gian cần hoàn thành.
- Phân trang danh sách task với `page` và `per_page`.
- Lọc task cần hoàn thành trước cuối ngày hôm nay.
- Lọc theo trạng thái, khoảng ngày cần hoàn thành và tìm kiếm theo title hoặc description.
- Đánh dấu task quá hạn.
- Mở màn hình chi tiết của một task.
- Chỉnh sửa title, description và due date của task.
- Đánh dấu task đã hoàn thành.
- Lưu và hiển thị người tạo task cùng người thực hiện complete task.
- Xóa task.
- Upload, tải xuống và xóa tệp đính kèm của task.
- Mỗi user chỉ xem và thao tác được trên task của chính mình.
- Đăng nhập, đăng xuất và tự xóa phiên cục bộ khi token không hợp lệ.
- Hiển thị toast message khi create, update, complete và delete thành công.
- Đổi browser tab title theo từng màn hình.

## Frontend Screens

- `/login`: Đăng nhập bằng email và password.
- `/tasks`: Danh sách task, tìm kiếm, bộ lọc, pagination và tạo task.
- `/tasks/new`: Tạo task mới.
- `/tasks/:taskId`: Xem chi tiết task, edit, complete, delete và quản lý tệp đính kèm.

## Backend API

- `GET /api/v1/health`: Health check.
- `POST /api/v1/auth/login`: Đăng nhập bằng Devise, tạo session cookie.
- `GET /api/v1/auth/me`: Lấy user hiện tại.
- `DELETE /api/v1/auth/logout`: Hủy token hiện tại.
- `GET /api/v1/tasks`: Danh sách task của user hiện tại có pagination, `query`, `status`, `due_from`, `due_to` và `due_by_today`.
- `POST /api/v1/tasks`: Tạo task.
- `GET /api/v1/tasks/:id`: Xem một task.
- `PATCH /api/v1/tasks/:id`: Cập nhật task.
- `PATCH /api/v1/tasks/:id/complete`: Đánh dấu completed.
- `DELETE /api/v1/tasks/:id`: Xóa task.
- `POST /api/v1/tasks/:id/attachments`: Upload tệp đính kèm tối đa 10 MB bằng `multipart/form-data` với field `file`.
- `GET /api/v1/tasks/:id/attachments/:attachment_id/download`: Tải tệp đính kèm.
- `DELETE /api/v1/tasks/:id/attachments/:attachment_id`: Xóa tệp đính kèm.

Trừ health check và đăng nhập, toàn bộ task API yêu cầu Devise session cookie hợp lệ.

Swagger UI: `http://localhost:3000/api-docs`

## Chạy Dự Án

Backend:

```bash
cd task-list-be
docker compose up --build
```

Nạp dữ liệu mẫu khi cần:

```bash
docker compose run --rm web bin/rails db:seed
```

Tài khoản mẫu sau khi seed:

- `ava.stone@boardpackager.example` / `tasklist123`
- `minh.tran@boardpackager.example` / `tasklist123`

Tạo user bằng Rails console, không cần giao diện quản trị:

```ruby
User.create!(name: "Tên người dùng", email: "user@example.com", password: "mat-khau-it-nhat-8-ky-tu")
```

Khi thêm trực tiếp vào database, cột `encrypted_password` phải chứa BCrypt hash của password, không lưu password thuần.

Frontend:

```bash
cd task-list-fe
npm install
npm run dev
```

Frontend chạy tại `http://localhost:5173`.
Backend chạy tại `http://localhost:3000`.
