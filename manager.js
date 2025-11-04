// Manager Dashboard JavaScript - Connected to Backend API

// Tự động phát hiện API URL dựa trên môi trường
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5001'
    : `http://${window.location.hostname}:5001`;
let currentBookingId = null;
let allBookings = [];
let currentPage = 1;
let itemsPerPage = 50; // Tăng từ mặc định lên 50 bookings mỗi trang

function checkManagerAuth() {
    const currentManager = localStorage.getItem('currentManager');
    if (!currentManager) {
        window.location.href = 'manager-login.html';
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    if (!checkManagerAuth()) return;
    loadBookings();
    document.getElementById('searchInput').addEventListener('input', filterBookings);
    document.getElementById('filterRoom').addEventListener('change', filterBookings);
    displayManagerInfo();
});

function displayManagerInfo() {
    const currentManager = JSON.parse(localStorage.getItem('currentManager'));
    if (currentManager) {
        const header = document.querySelector('.dashboard-header');
        const managerInfo = document.createElement('div');
        managerInfo.style.cssText = 'background: #e3f2fd; padding: 10px 15px; border-radius: 5px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;';
        managerInfo.innerHTML = '<span><strong>Hello, ' + currentManager.name + '</strong> (' + currentManager.email + ')</span><button onclick="logoutManager()" class="btn btn-secondary" style="padding: 5px 15px;">Logout</button>';
        header.insertBefore(managerInfo, header.firstChild);
    }
}

function logoutManager() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentManager');
        window.location.href = 'manager-login.html';
    }
}

async function loadBookings() {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`);
        if (response.ok) {
            const apiBookings = await response.json();
            console.log('Loaded bookings from API:', apiBookings.length);
            const localBookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
            const apiIds = apiBookings.map(b => b.id);
            const uniqueLocalBookings = localBookings.filter(b => !apiIds.includes(b.id));
            allBookings = [...apiBookings, ...uniqueLocalBookings];
        } else {
            console.warn('API unavailable, loading from localStorage');
            allBookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        allBookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
    }
    updateStatistics();
    displayBookings(allBookings);
}

function updateStatistics() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('totalBookings').textContent = allBookings.length;
    const todayBookings = allBookings.filter(booking => {
        const bookingDate = booking.timestamp.split('T')[0];
        return bookingDate === today;
    });
    document.getElementById('todayBookings').textContent = todayBookings.length;
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingCheckIns = allBookings.filter(booking => {
        const checkIn = new Date(booking.checkIn);
        const now = new Date();
        return checkIn >= now && checkIn <= nextWeek;
    });
    document.getElementById('upcomingCheckIns').textContent = upcomingCheckIns.length;
}

function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<div class="no-bookings"><p>No booking requests yet</p><p class="subtitle">Bookings submitted by customers will appear here.</p></div>';
        return;
    }
    bookings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedBookings = bookings.slice(startIndex, endIndex);
    const totalPages = Math.ceil(bookings.length / itemsPerPage);
    
    let html = paginatedBookings.map(booking => createBookingCard(booking)).join('');
    
    // Add pagination controls if more than itemsPerPage
    if (bookings.length > itemsPerPage) {
        html += '<div class="pagination">';
        html += '<button onclick="changePage(' + (currentPage - 1) + ')" ' + (currentPage === 1 ? 'disabled' : '') + '>← Trước</button>';
        html += '<span>Trang ' + currentPage + ' / ' + totalPages + ' (Tổng: ' + bookings.length + ' bookings)</span>';
        html += '<button onclick="changePage(' + (currentPage + 1) + ')" ' + (currentPage === totalPages ? 'disabled' : '') + '>Sau →</button>';
        html += '</div>';
    }
    
    bookingsList.innerHTML = html;
}

function changePage(page) {
    const totalPages = Math.ceil(allBookings.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    filterBookings();
}

function createBookingCard(booking) {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const submittedDate = new Date(booking.timestamp).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    const roomTypes = {
        'bungalow-2nl2te-sat-bien': 'BUNGALOW (2NL+2TE) SÁT BIỂN - 1,400,000 VNĐ/đêm',
        'bungalow-2nl1te-sat-bien': 'BUNGALOW (2NL+1TE) SÁT BIỂN - 1,000,000 VNĐ/đêm',
        'bungalow-2nl1te-huong-bien': 'BUNGALOW (2NL+1TE) HƯỚNG BIỂN - 800,000 VNĐ/đêm',
        'bungalow-2nl2te-huong-bien': 'BUNGALOW (2NL+2TE) HƯỚNG BIỂN - 1,200,000 VNĐ/đêm',
        'bungalow-4nl-sat-bien': 'BUNGALOW 4NL SÁT BIỂN - 1,600,000 VNĐ/đêm',
        'villa-nha-go-view-bien': 'VILLA NHÀ GỖ VIEW BIỂN - 7,000,000 VNĐ/đêm'
    };
    const guestsText = (booking.adults || booking.guests || 0) + ' người lớn' + (booking.children ? ', ' + booking.children + ' trẻ em' : '');
    return '<div class="booking-card" onclick="showBookingDetails(\'' + booking.id + '\')"><div class="booking-card-header"><div><div class="booking-name">' + booking.fullName + '</div><div class="booking-date">Submitted: ' + submittedDate + '</div></div><span class="booking-badge">' + (roomTypes[booking.roomType] || booking.roomType) + '</span></div><div class="booking-info"><div class="booking-info-item"><strong>Email</strong>' + booking.email + '</div><div class="booking-info-item"><strong>Phone</strong>' + booking.phone + '</div><div class="booking-info-item"><strong>Check-in</strong>' + checkIn.toLocaleDateString() + '</div><div class="booking-info-item"><strong>Check-out</strong>' + checkOut.toLocaleDateString() + '</div><div class="booking-info-item"><strong>Duration</strong>' + nights + ' night' + (nights !== 1 ? 's' : '') + '</div><div class="booking-info-item"><strong>Guests</strong>' + guestsText + '</div></div></div>';
}

function showBookingDetails(bookingId) {
    currentBookingId = bookingId;
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const roomTypes = {
        'bungalow-2nl2te-sat-bien': 'BUNGALOW (2NL+2TE) SÁT BIỂN - 1,400,000 VNĐ/đêm',
        'bungalow-2nl1te-sat-bien': 'BUNGALOW (2NL+1TE) SÁT BIỂN - 1,000,000 VNĐ/đêm',
        'bungalow-2nl1te-huong-bien': 'BUNGALOW (2NL+1TE) HƯỚNG BIỂN - 800,000 VNĐ/đêm',
        'bungalow-2nl2te-huong-bien': 'BUNGALOW (2NL+2TE) HƯỚNG BIỂN - 1,200,000 VNĐ/đêm',
        'bungalow-4nl-sat-bien': 'BUNGALOW 4NL SÁT BIỂN - 1,600,000 VNĐ/đêm',
        'villa-nha-go-view-bien': 'VILLA NHÀ GỖ VIEW BIỂN - 7,000,000 VNĐ/đêm'
    };
    const guestsDetail = (booking.adults || booking.guests || 0) + ' người lớn' + (booking.children ? ', ' + booking.children + ' trẻ em' : '');
    const detailsHTML = '<div class="detail-section"><h3>Guest Information</h3><div class="detail-row"><div class="detail-label">Full Name:</div><div class="detail-value">' + booking.fullName + '</div></div><div class="detail-row"><div class="detail-label">Email:</div><div class="detail-value">' + booking.email + '</div></div><div class="detail-row"><div class="detail-label">Phone:</div><div class="detail-value">' + booking.phone + '</div></div>' + (booking.address ? '<div class="detail-row"><div class="detail-label">Address:</div><div class="detail-value">' + booking.address + '</div></div>' : '') + '</div><div class="detail-section"><h3>Booking Details</h3><div class="detail-row"><div class="detail-label">Booking ID:</div><div class="detail-value">' + booking.id + '</div></div><div class="detail-row"><div class="detail-label">Submitted:</div><div class="detail-value">' + new Date(booking.timestamp).toLocaleString() + '</div></div><div class="detail-row"><div class="detail-label">Check-in:</div><div class="detail-value">' + checkIn.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) + '</div></div><div class="detail-row"><div class="detail-label">Check-out:</div><div class="detail-value">' + checkOut.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) + '</div></div><div class="detail-row"><div class="detail-label">Duration:</div><div class="detail-value">' + nights + ' night' + (nights !== 1 ? 's' : '') + '</div></div><div class="detail-row"><div class="detail-label">Room Type:</div><div class="detail-value">' + (roomTypes[booking.roomType] || booking.roomType) + '</div></div><div class="detail-row"><div class="detail-label">Number of Guests:</div><div class="detail-value">' + guestsDetail + '</div></div></div>' + (booking.specialRequests ? '<div class="detail-section"><h3>Special Requests</h3><div class="detail-row"><div class="detail-value" style="width: 100%">' + booking.specialRequests + '</div></div></div>' : '');
    document.getElementById('bookingDetails').innerHTML = detailsHTML;
    document.getElementById('bookingModal').classList.remove('hidden');
}

function changeItemsPerPage(value) {
    itemsPerPage = parseInt(value);
    currentPage = 1;
    filterBookings();
}

function closeModal() {
    document.getElementById('bookingModal').classList.add('hidden');
    currentBookingId = null;
}

async function deleteBooking() {
    if (!currentBookingId) return;
    if (confirm('Are you sure you want to delete this booking?')) {
        try {
            await fetch(`${API_BASE_URL}/bookings/${currentBookingId}`, {method: 'DELETE'});
        } catch (error) {
            console.error('Error deleting:', error);
        }
        let localBookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
        localBookings = localBookings.filter(b => b.id !== currentBookingId);
        localStorage.setItem('hotelBookings', JSON.stringify(localBookings));
        closeModal();
        loadBookings();
    }
}

function filterBookings() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const roomFilter = document.getElementById('filterRoom').value;
    let filtered = allBookings;
    if (searchTerm) {
        filtered = filtered.filter(booking => booking.fullName.toLowerCase().includes(searchTerm) || booking.email.toLowerCase().includes(searchTerm) || booking.phone.includes(searchTerm));
    }
    if (roomFilter) {
        filtered = filtered.filter(booking => booking.roomType === roomFilter);
    }
    displayBookings(filtered);
}

async function clearAllBookings() {
    if (confirm('Delete all booking data? This action cannot be undone!')) {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings`);
            if (response.ok) {
                const apiBookings = await response.json();
                for (const booking of apiBookings) {
                    await fetch(`${API_BASE_URL}/bookings/${booking.id}`, {method: 'DELETE'});
                }
            }
        } catch (error) {
            console.error('Error clearing API bookings:', error);
        }
        localStorage.setItem('hotelBookings', '[]');
        allBookings = [];
        displayBookings(allBookings);
        updateStatistics();
        alert('All bookings have been deleted!');
    }
}
