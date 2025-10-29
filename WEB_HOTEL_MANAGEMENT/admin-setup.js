// Admin Setup JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadManagersList();
    
    document.getElementById('createManagerForm').addEventListener('submit', handleCreateManager);
});

// Handle create manager form submission
function handleCreateManager(e) {
    e.preventDefault();
    
    const managerData = {
        id: 'MGR' + Date.now(),
        name: document.getElementById('managerName').value,
        email: document.getElementById('managerEmail').value,
        username: document.getElementById('managerUsername').value,
        password: document.getElementById('managerPassword').value,
        phone: document.getElementById('managerPhone').value,
        createdAt: new Date().toISOString(),
        role: 'manager'
    };
    
    // Validate password length
    if (managerData.password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    
    // Get existing managers
    let managers = JSON.parse(localStorage.getItem('hotelManagers') || '[]');
    
    // Check if username already exists
    if (managers.some(m => m.username === managerData.username)) {
        alert('Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.');
        return;
    }
    
    // Check if email already exists
    if (managers.some(m => m.email === managerData.email)) {
        alert('Email đã được sử dụng! Vui lòng chọn email khác.');
        return;
    }
    
    // Add new manager
    managers.push(managerData);
    localStorage.setItem('hotelManagers', JSON.stringify(managers));
    
    alert('Tạo tài khoản manager thành công!\n\nTên đăng nhập: ' + managerData.username);
    
    // Reset form and reload list
    document.getElementById('createManagerForm').reset();
    loadManagersList();
}

// Load and display managers list
function loadManagersList() {
    const managers = JSON.parse(localStorage.getItem('hotelManagers') || '[]');
    const managersList = document.getElementById('managersList');
    
    if (managers.length === 0) {
        managersList.innerHTML = '<p style="color: #666; text-align: center;">Chưa có manager nào được tạo.</p>';
        return;
    }
    
    managersList.innerHTML = managers.map(manager => `
        <div class="manager-item">
            <div class="manager-info">
                <strong>${manager.name}</strong><br>
                <small>Username: ${manager.username} | Email: ${manager.email}</small><br>
                <small>Tạo ngày: ${new Date(manager.createdAt).toLocaleDateString('vi-VN')}</small>
            </div>
            <button class="delete-btn" onclick="deleteManager('${manager.id}')">Xóa</button>
        </div>
    `).join('');
}

// Delete manager
function deleteManager(managerId) {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản manager này?')) {
        return;
    }
    
    let managers = JSON.parse(localStorage.getItem('hotelManagers') || '[]');
    managers = managers.filter(m => m.id !== managerId);
    localStorage.setItem('hotelManagers', JSON.stringify(managers));
    
    alert('Đã xóa tài khoản manager!');
    loadManagersList();
}
