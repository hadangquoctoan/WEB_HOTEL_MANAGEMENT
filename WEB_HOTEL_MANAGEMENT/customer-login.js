// Customer Login JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const currentCustomer = localStorage.getItem('currentCustomer');
    if (currentCustomer) {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Get customers from localStorage
    const customers = JSON.parse(localStorage.getItem('hotelCustomers') || '[]');
    
    // Find matching customer
    const customer = customers.find(c => c.email === email && c.password === password);
    
    if (customer) {
        // Store current customer session (without password)
        const customerSession = {
            id: customer.id,
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentCustomer', JSON.stringify(customerSession));
        
        // Redirect to booking page
        window.location.href = 'index.html';
    } else {
        showError('Email hoặc mật khẩu không đúng!');
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
