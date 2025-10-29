// Manager Login JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const currentManager = localStorage.getItem('currentManager');
    if (currentManager) {
        window.location.href = 'manager.html';
        return;
    }
    
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Get managers from localStorage
    const managers = JSON.parse(localStorage.getItem('hotelManagers') || '[]');
    
    // Find matching manager
    const manager = managers.find(m => m.username === username && m.password === password);
    
    if (manager) {
        // Store current manager session (without password)
        const managerSession = {
            id: manager.id,
            name: manager.name,
            email: manager.email,
            username: manager.username,
            role: manager.role,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentManager', JSON.stringify(managerSession));
        
        // Redirect to manager dashboard
        window.location.href = 'manager.html';
    } else {
        showError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}
