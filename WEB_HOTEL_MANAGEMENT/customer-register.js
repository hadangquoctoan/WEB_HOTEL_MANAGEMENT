// Customer Register JavaScript

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
});

function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate password length
    if (password.length < 6) {
        showError('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    
    // Validate password match
    if (password !== confirmPassword) {
        showError('Mật khẩu xác nhận không khớp!');
        return;
    }
    
    // Get existing customers
    let customers = JSON.parse(localStorage.getItem('hotelCustomers') || '[]');
    
    // Check if email already exists
    if (customers.some(c => c.email === email)) {
        showError('Email đã được đăng ký! Vui lòng sử dụng email khác hoặc đăng nhập.');
        return;
    }
    
    // Create new customer
    const customerData = {
        id: 'CUST' + Date.now(),
        fullName: fullName,
        email: email,
        phone: phone,
        password: password,
        createdAt: new Date().toISOString(),
        bookings: []
    };
    
    // Add to customers list
    customers.push(customerData);
    localStorage.setItem('hotelCustomers', JSON.stringify(customers));
    
    // Show success message
    showSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
        window.location.href = 'customer-login.html';
    }, 2000);
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    const successDiv = document.getElementById('successMessage');
    successDiv.style.display = 'none';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.display = 'none';
}
