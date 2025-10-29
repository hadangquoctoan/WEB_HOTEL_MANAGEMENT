// Customer Booking Form JavaScript

// Check if customer is logged in and pre-fill data
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
    
    // Update checkout minimum date when check-in changes
    document.getElementById('checkIn').addEventListener('change', function() {
        const checkInDate = this.value;
        const checkOutInput = document.getElementById('checkOut');
        checkOutInput.setAttribute('min', checkInDate);
        
        // If checkout is before new check-in, reset it
        if (checkOutInput.value && checkOutInput.value <= checkInDate) {
            checkOutInput.value = '';
        }
    });
});

// Form submission handler
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate dates
    const checkIn = new Date(document.getElementById('checkIn').value);
    const checkOut = new Date(document.getElementById('checkOut').value);
    
    if (checkOut <= checkIn) {
        alert('Check-out date must be after check-in date!');
        return;
    }
    
    // Collect form data
    const formData = {
        id: generateBookingId(),
        timestamp: new Date().toISOString(),
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        checkIn: document.getElementById('checkIn').value,
        checkOut: document.getElementById('checkOut').value,
        roomType: document.getElementById('roomType').value,
        guests: document.getElementById('guests').value,
        specialRequests: document.getElementById('specialRequests').value
    };
    
    // Save booking to localStorage
    saveBooking(formData);
    
    // Show success message
    document.getElementById('successMessage').classList.remove('hidden');
    
    // Reset form
    document.getElementById('bookingForm').reset();
});

// Generate unique booking ID
function generateBookingId() {
    return 'BK' + Date.now() + Math.random().toString(36).substr(2, 9);
}

// Save booking to localStorage
function saveBooking(bookingData) {
    let bookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('hotelBookings', JSON.stringify(bookings));
}

// Close success message
function closeSuccessMessage() {
    document.getElementById('successMessage').classList.add('hidden');
}

// Form validation enhancement
document.querySelectorAll('input[required], select[required]').forEach(input => {
    input.addEventListener('invalid', function(e) {
        e.preventDefault();
        this.classList.add('error');
    });
    
    input.addEventListener('input', function() {
        this.classList.remove('error');
    });
});

// Phone number formatting (basic)
document.getElementById('phone').addEventListener('input', function(e) {
    // Remove non-numeric characters except + and spaces
    let value = e.target.value.replace(/[^\d+\s-()]/g, '');
    e.target.value = value;
});

// Email validation
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
