// Customer Booking Form JavaScript - Connected to Backend API

// Tự động phát hiện API URL dựa trên môi trường
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5001'
    : `http://${window.location.hostname}:5001`;

document.addEventListener('DOMContentLoaded', function() {
    const currentCustomer = localStorage.getItem('currentCustomer');
    if (currentCustomer) {
        const customer = JSON.parse(currentCustomer);
        document.getElementById('fullName').value = customer.fullName || '';
        document.getElementById('email').value = customer.email || '';
        document.getElementById('phone').value = customer.phone || '';
    }
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn').setAttribute('min', today);
    document.getElementById('checkOut').setAttribute('min', today);
    
    document.getElementById('checkIn').addEventListener('change', function() {
        const checkInDate = this.value;
        const checkOutInput = document.getElementById('checkOut');
        checkOutInput.setAttribute('min', checkInDate);
        if (checkOutInput.value && checkOutInput.value <= checkInDate) {
            checkOutInput.value = '';
        }
    });
});

document.getElementById('bookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Disable submit button to prevent double submission
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Đang gửi...';
    
    try {
        const checkIn = new Date(document.getElementById('checkIn').value);
        const checkOut = new Date(document.getElementById('checkOut').value);
        
        if (checkOut <= checkIn) {
            alert('Ngày trả phòng phải sau ngày nhận phòng!');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            return;
        }
        
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            checkIn: document.getElementById('checkIn').value,
            checkOut: document.getElementById('checkOut').value,
            roomType: document.getElementById('roomType').value,
            adults: parseInt(document.getElementById('adults').value) || 1,
            children: parseInt(document.getElementById('children').value) || 0,
            specialRequests: document.getElementById('specialRequests').value
        };
        
        // Validate required fields
        if (!formData.fullName || !formData.email || !formData.phone || !formData.roomType) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Booking saved:', result);
            
            const bookingWithId = {id: result.id, timestamp: result.timestamp, ...formData};
            let bookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
            bookings.push(bookingWithId);
            localStorage.setItem('hotelBookings', JSON.stringify(bookings));
            
            document.getElementById('successMessage').classList.remove('hidden');
            document.getElementById('bookingForm').reset();
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        } else {
            const errorData = await response.json().catch(() => ({}));
            alert('Lỗi khi lưu đặt phòng: ' + (errorData.error || 'Vui lòng thử lại.'));
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Lỗi kết nối. Đặt phòng đã được lưu cục bộ.');
        
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            checkIn: document.getElementById('checkIn').value,
            checkOut: document.getElementById('checkOut').value,
            roomType: document.getElementById('roomType').value,
            adults: parseInt(document.getElementById('adults').value) || 1,
            children: parseInt(document.getElementById('children').value) || 0,
            specialRequests: document.getElementById('specialRequests').value
        };
        
        const bookingWithId = {
            id: 'BK' + Date.now(),
            timestamp: new Date().toISOString(),
            ...formData
        };
        let bookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
        bookings.push(bookingWithId);
        localStorage.setItem('hotelBookings', JSON.stringify(bookings));
        
        document.getElementById('successMessage').classList.remove('hidden');
        document.getElementById('bookingForm').reset();
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
});

function closeSuccessMessage() {
    document.getElementById('successMessage').classList.add('hidden');
}

document.querySelectorAll('input[required], select[required]').forEach(input => {
    input.addEventListener('invalid', function(e) {
        e.preventDefault();
        this.classList.add('error');
    });
    input.addEventListener('input', function() {
        this.classList.remove('error');
    });
});

document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^\d+\s-()]/g, '');
    e.target.value = value;
});

document.getElementById('email').addEventListener('blur', function() {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        this.setCustomValidity('Please enter a valid email address');
        this.reportValidity();
    } else {
        this.setCustomValidity('');
    }
});