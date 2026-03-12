# Hướng dẫn Test API với Postman

## 📥 Import Collection vào Postman

1. Mở **Postman**
2. Click **Import** (góc trên bên trái)
3. Chọn file `NNPTUD-API.postman_collection.json`
4. Click **Import**

## 🧪 Thứ tự Test APIs (Khuyên dùng)

### Bước 1: Tạo Role
```
POST http://localhost:3000/api/v1/roles
Body:
{
  "name": "Admin",
  "description": "Administrator role"
}
```
**Lưu lại `_id` của Role vừa tạo!**

---

### Bước 2: Tạo User với Role
```
POST http://localhost:3000/api/v1/users
Body:
{
  "username": "john_doe",
  "password": "password123",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "ROLE_ID_TỪ_BƯỚC_1"
}
```
**Lưu lại `_id` của User vừa tạo!**

---

### Bước 3: Get All Users
```
GET http://localhost:3000/api/v1/users
```
Response sẽ có thông tin role được populate!

---

### Bước 4: Enable User
```
POST http://localhost:3000/api/v1/users/enable
Body:
{
  "email": "john@example.com",
  "username": "john_doe"
}
```
Kiểm tra `status` chuyển thành `true`

---

### Bước 5: Disable User
```
POST http://localhost:3000/api/v1/users/disable
Body:
{
  "email": "john@example.com",
  "username": "john_doe"
}
```
Kiểm tra `status` chuyển thành `false`

---

### Bước 6: Get Users by Role
```
GET http://localhost:3000/api/v1/roles/ROLE_ID/users
```
Trả về tất cả users có role đó

---

### Bước 7: Update User
```
PUT http://localhost:3000/api/v1/users/USER_ID
Body:
{
  "fullName": "John Updated",
  "loginCount": 5
}
```

---

### Bước 8: Delete User (Soft Delete)
```
DELETE http://localhost:3000/api/v1/users/USER_ID
```
User vẫn còn trong DB nhưng `isDeleted: true`

---

## 📝 Test Categories & Products

### Tạo Category trước
```
POST http://localhost:3000/api/v1/categories
Body:
{
  "name": "Electronics"
}
```

### Sau đó tạo Product
```
POST http://localhost:3000/api/v1/products
Body:
{
  "title": "iPhone 15",
  "price": 999,
  "description": "Latest iPhone",
  "category": "CATEGORY_ID"
}
```

---

## 🔍 Query Parameters cho Products

```
GET http://localhost:3000/api/v1/products?title=iphone&min=500&max=1500
```

- `title`: Tìm kiếm theo tên (case-insensitive)
- `min`: Giá tối thiểu
- `max`: Giá tối đa

---

## ✅ Kiểm tra kết quả

Tất cả response sẽ trả về JSON format:
- **Success**: Status 200, data object
- **Not Found**: Status 404, message
- **Error**: Status 400/500, error message

---

## 🚀 Tips

1. Lưu IDs sau mỗi lần tạo để sử dụng cho các request tiếp theo
2. Sử dụng Postman Variables để lưu IDs tự động
3. Kiểm tra MongoDB Compass để xem data trong database
4. Tất cả các thao tác DELETE là soft delete (isDeleted: true)

---

## 🗄️ Kết nối MongoDB Compass

```
mongodb://localhost:27017/NNPTUD-C5
```

Database name: `NNPTUD-C5`
Collections:
- `users`
- `roles`
- `products`
- `categories`
