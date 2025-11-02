# 🚀 QUICK START - Flask Backend

## 🪟 Windows

### Cách 1: Double-click file
```
Double-click: start.bat
```

### Cách 2: PowerShell
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## 🐧 Linux / Mac

### Cách 1: Script
```bash
cd backend
chmod +x start.sh
./start.sh
```

### Cách 2: Terminal
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

## ✅ Test API

Mở browser: `http://localhost:5000/health`

Hoặc dùng curl:
```bash
curl http://localhost:5000/health
```

## 📦 Test Full

```bash
cd backend
source venv/bin/activate  # Linux/Mac
# hoặc
venv\Scripts\activate  # Windows

pip install requests
python test_api.py
```

## 🌐 Deploy lên Ubuntu

Xem file: `FLASK_DEPLOY_GUIDE.md`

## 🛑 Stop Server

**Development:** `Ctrl + C` trong terminal

**Production (systemd):**
```bash
sudo systemctl stop hotel-flask
```

## 📝 Các Endpoints

- GET    `/health` - Health check
- GET    `/customers` - Lấy danh sách khách hàng
- POST   `/customers` - Tạo khách hàng mới
- GET    `/managers` - Lấy danh sách managers
- POST   `/managers` - Tạo manager mới
- GET    `/bookings` - Lấy danh sách booking
- POST   `/bookings` - Tạo booking mới

## 🔍 Debug

Xem file `database.json` để kiểm tra dữ liệu:
```bash
cat database.json
# hoặc
type database.json  # Windows
```

## 💡 Tips

1. Đảm bảo port 5000 không bị chiếm bởi app khác
2. Nếu lỗi "Module not found", chạy: `pip install -r requirements.txt`
3. Database lưu trong file `database.json` - có thể backup bằng cách copy file này
