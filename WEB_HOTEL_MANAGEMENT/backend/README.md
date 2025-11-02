# 🐍 Flask Backend API - Hotel Management

## 📦 Cài Đặt

### 1. Cài Python (nếu chưa có)
```bash
# Kiểm tra Python
python --version
# hoặc
python3 --version
```

Tải Python: https://www.python.org/downloads/

### 2. Tạo Virtual Environment (khuyên dùng)
```bash
# Windows
cd backend
python -m venv venv
venv\Scripts\activate

# Linux/Mac
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 3. Cài Dependencies
```bash
pip install -r requirements.txt
```

## 🚀 Chạy Server

### Development (Local)
```bash
python app.py
```

Server sẽ chạy tại: `http://localhost:5000`

### Production (Ubuntu Server)
```bash
# Sử dụng Gunicorn
pip install gunicorn

# Chạy với 4 workers
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 📋 API Endpoints

### Customers
- `GET    /customers` - Lấy danh sách khách hàng
- `GET    /customers?email=xxx` - Tìm theo email
- `GET    /customers/<id>` - Lấy 1 khách hàng
- `POST   /customers` - Tạo khách hàng mới
- `PUT    /customers/<id>` - Cập nhật
- `DELETE /customers/<id>` - Xóa

### Managers
- `GET    /managers` - Lấy danh sách managers
- `GET    /managers?username=xxx` - Tìm theo username
- `POST   /managers` - Tạo manager mới
- `PUT    /managers/<id>` - Cập nhật
- `DELETE /managers/<id>` - Xóa

### Bookings
- `GET    /bookings` - Lấy danh sách booking
- `POST   /bookings` - Tạo booking mới
- `PUT    /bookings/<id>` - Cập nhật
- `DELETE /bookings/<id>` - Xóa

### Health Check
- `GET /health` - Kiểm tra server status

## 💾 Database

Dữ liệu lưu trong file `database.json` (JSON file)

### Cấu trúc:
```json
{
  "customers": [...],
  "managers": [...],
  "bookings": [...]
}
```

## 🔧 Cấu Hình

### Thay đổi Port
Sửa dòng cuối trong `app.py`:
```python
app.run(host='0.0.0.0', port=5000, debug=True)
#                       ^^^^ đổi port ở đây
```

### Disable Debug Mode (Production)
```python
app.run(host='0.0.0.0', port=5000, debug=False)
```

## 🐧 Deploy Trên Ubuntu

### 1. Upload code
```bash
scp -r backend username@server-ip:/var/www/html/WEB_HOTEL_MANAGEMENT/
```

### 2. Cài Python packages
```bash
ssh username@server-ip
cd /var/www/html/WEB_HOTEL_MANAGEMENT/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Tạo Systemd Service
```bash
sudo nano /etc/systemd/system/hotel-flask.service
```

Nội dung:
```ini
[Unit]
Description=Hotel Management Flask API
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/html/WEB_HOTEL_MANAGEMENT/backend
Environment="PATH=/var/www/html/WEB_HOTEL_MANAGEMENT/backend/venv/bin"
ExecStart=/var/www/html/WEB_HOTEL_MANAGEMENT/backend/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

### 4. Kích hoạt service
```bash
sudo systemctl daemon-reload
sudo systemctl enable hotel-flask
sudo systemctl start hotel-flask
sudo systemctl status hotel-flask
```

## 🧪 Test API

### Sử dụng curl
```bash
# Health check
curl http://localhost:5000/health

# Get customers
curl http://localhost:5000/customers

# Create customer
curl -X POST http://localhost:5000/customers \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","phone":"0123456789","password":"123456"}'
```

### Sử dụng Python
```python
import requests

# Create customer
response = requests.post('http://localhost:5000/customers', json={
    'fullName': 'Nguyễn Văn A',
    'email': 'a@example.com',
    'phone': '0912345678',
    'password': '123456'
})
print(response.json())
```

## 📊 Logs

### Xem logs
```bash
# Development
# Logs hiển thị trực tiếp trong terminal

# Production (systemd)
sudo journalctl -u hotel-flask -f
```

## 🔒 Security Notes

⚠️ **CẢNH BÁO**: Code hiện tại lưu password dạng plain text!

### TODO: Thêm bảo mật
1. Hash password (bcrypt)
2. JWT authentication
3. Rate limiting
4. Input validation
5. SQL Injection protection

## 🛠️ Troubleshooting

### Lỗi: "Address already in use"
Port 5000 đang được dùng. Đổi port hoặc kill process:
```bash
# Linux
sudo lsof -i :5000
sudo kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Lỗi: "ModuleNotFoundError"
```bash
pip install -r requirements.txt
```

### Lỗi: CORS
Flask-CORS đã được enable trong code. Nếu vẫn lỗi, kiểm tra:
```python
CORS(app, resources={r"/*": {"origins": "*"}})
```
