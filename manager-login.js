// Manager Login JavaScript - Connected to Backend API

// Tự động phát hiện API URL dựa trên môi trường
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5001'
    : `http://${window.location.hostname}:5001`;

console.log('Manager Login loaded. API URL:', API_BASE_URL);

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing login...');
    
    // Check if already logged in
    const currentManager = localStorage.getItem('currentManager');
    if (currentManager) {
        console.log('Already logged in, redirecting to dashboard...');
        window.location.href = 'manager.html';
        return;
    }
    
    // Attach login handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form handler attached');
    } else {
        console.error('Login form not found!');
    }
});

async function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('Attempting login for username:', username);
    
    try {
        const apiUrl = `${API_BASE_URL}/managers?username=${encodeURIComponent(username)}`;
        console.log('Fetching from:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);
        
        if (response.ok) {
            const managers = await response.json();
            console.log('Received managers:', managers.length);
            
            const manager = managers.find(m => m.username === username && m.password === password);
            
            if (manager) {
                console.log('Login successful! Manager:', manager.name);
                
                const managerSession = {
                    id: manager.id,
                    name: manager.name,
                    email: manager.email,
                    username: manager.username,
                    role: manager.role || 'manager',
                    loginTime: new Date().toISOString()
                };
                
                console.log('Saving session to localStorage:', managerSession);
                localStorage.setItem('currentManager', JSON.stringify(managerSession));
                
                // Verify it was saved
                const saved = localStorage.getItem('currentManager');
                console.log('Session saved successfully:', saved ? 'Yes' : 'No');
                
                console.log('Redirecting to manager.html...');
                window.location.href = 'manager.html';
                return;
            } else {
                console.error('Invalid credentials');
                showError('Username or password incorrect!');
            }
        } else {
            console.error('API returned error status:', response.status);
            // Try localStorage fallback
            const localManagers = JSON.parse(localStorage.getItem('hotelManagers') || '[]');
            console.log('Trying localStorage fallback, found:', localManagers.length);
            
            const localManager = localManagers.find(m => m.username === username && m.password === password);
            
            if (localManager) {
                console.log('Login successful via localStorage!');
                const managerSession = {
                    id: localManager.id,
                    name: localManager.name,
                    email: localManager.email,
                    username: localManager.username,
                    role: localManager.role || 'manager',
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('currentManager', JSON.stringify(managerSession));
                window.location.href = 'manager.html';
            } else {
                showError('Username or password incorrect!');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Connection error! Please try again.');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    } else {
        alert(message);
    }
}
