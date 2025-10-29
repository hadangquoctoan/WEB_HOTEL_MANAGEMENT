// Manager Dashboard JavaScript

let currentBookingId = null;
let allBookings = [];

// Check manager authentication
function checkManagerAuth() {
    const currentManager = localStorage.getItem('currentManager');
    if (!currentManager) {
        window.location.href = 'manager-login.html';
        return false;
    }
    return true;
}

// Load and display bookings when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (!checkManagerAuth()) return;
    
    loadBookings();
    
    // Set up event listeners
    document.getElementById('searchInput').addEventListener('input', filterBookings);
    document.getElementById('filterRoom').addEventListener('change', filterBookings);
    
    // Display manager info
    displayManagerInfo();
});

// Auto-refresh when bookings change in another tab/window
window.addEventListener('storage', function(e) {
    if (e.key === 'hotelBookings' || e.key === 'bookings') {
        loadBookings();
    }
});

// Display manager info
function displayManagerInfo() {
    const currentManager = JSON.parse(localStorage.getItem('currentManager'));
    if (currentManager) {
        const header = document.querySelector('.dashboard-header');
        const managerInfo = document.createElement('div');
        managerInfo.style.cssText = 'background: #e3f2fd; padding: 10px 15px; border-radius: 5px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;';
        managerInfo.innerHTML = `
            <span><strong>Xin chào, ${currentManager.name}</strong> (${currentManager.email})</span>
            <button onclick="logoutManager()" class="btn btn-secondary" style="padding: 5px 15px;">Đăng Xuất</button>
        `;
        header.insertBefore(managerInfo, header.firstChild);
    }
}

// Logout manager
function logoutManager() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('currentManager');
        window.location.href = 'manager-login.html';
    }
}

// Lightweight manager auth guard (deprecated - now using proper auth)
// Keeping for backward compatibility
function checkManagerAuth_old() {
    const manager = localStorage.getItem('managerUser');
    if (!manager) {
        const banner = document.createElement('div');
        banner.style.position = 'fixed';
        banner.style.bottom = '12px';
        banner.style.right = '12px';
        banner.style.background = '#fffae6';
        banner.style.border = '1px solid #f0c36d';
        banner.style.padding = '12px 16px';
        banner.style.zIndex = 9999;
        banner.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
        banner.innerHTML = `Manager not signed in. For testing, set a manager account in the console:<br><code>localStorage.setItem('managerUser', JSON.stringify({username:'admin'}))</code>`;
        document.body.appendChild(banner);
    }
}

// Run auth check after DOM ready (deprecated)
// document.addEventListener('DOMContentLoaded', checkManagerAuth_old);

// Load bookings from localStorage
function loadBookings() {
    // Load canonical hotel bookings
    const hotelRaw = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
    const hotel = hotelRaw.map(b => ({ ...b, source: 'hotel' }));

    // Load legacy bookings from other pages (e.g. booking.html uses key 'bookings')
    const legacyRaw = JSON.parse(localStorage.getItem('bookings') || '[]');
    const legacy = legacyRaw.map((b, i) => {
        // Normalize differing shapes into a common structure used by the manager UI
        const timestamp = b.bookingDate || b.bookingDate || b.timestamp || new Date().toISOString();
        const fullName = b.fullName || ((b.firstName || '') + ' ' + (b.lastName || '')).trim();
        return {
            id: b.id || `legacy-${i}-${Date.parse(timestamp) || Date.now()}`,
            timestamp: timestamp,
            fullName: fullName || 'Guest',
            email: b.email || b.guestEmail || '',
            phone: b.phone || b.guestPhone || '',
            address: b.address || '',
            checkIn: b.checkInDate || b.checkIn || '',
            checkOut: b.checkOutDate || b.checkOut || '',
            roomType: b.roomType || '',
            guests: b.guests || b.numGuests || 1,
            services: b.services || [],
            specialRequests: b.specialRequests || b.specialRequests || '',
            source: 'legacy',
            _legacyIndex: i
        };
    });

    // Merge, preferring hotel entries first and then legacy entries that don't share the same id
    allBookings = hotel.concat(legacy.filter(l => !hotel.some(h => h.id === l.id)));

    updateStatistics();
    displayBookings(allBookings);
}

// Update statistics
function updateStatistics() {
    const today = new Date().toISOString().split('T')[0];
    
    // Total bookings
    document.getElementById('totalBookings').textContent = allBookings.length;
    
    // Today's bookings
    const todayBookings = allBookings.filter(booking => {
        const bookingDate = booking.timestamp.split('T')[0];
        return bookingDate === today;
    });
    document.getElementById('todayBookings').textContent = todayBookings.length;
    
    // Upcoming check-ins (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingCheckIns = allBookings.filter(booking => {
        const checkIn = new Date(booking.checkIn);
        const now = new Date();
        return checkIn >= now && checkIn <= nextWeek;
    });
    document.getElementById('upcomingCheckIns').textContent = upcomingCheckIns.length;
}

// Display bookings
function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="no-bookings">
                <p>📋 No booking requests yet</p>
                <p class="subtitle">Bookings submitted by customers will appear here.</p>
            </div>
        `;
        return;
    }
    
    // Sort bookings by timestamp (newest first)
    bookings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    bookingsList.innerHTML = bookings.map(booking => createBookingCard(booking)).join('');
}

// Create booking card HTML
function createBookingCard(booking) {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const submittedDate = new Date(booking.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const roomTypeLabels = {
        'bungalow-2nl2te-sat-bien': 'BUNGALOW (2NL+2TE) SÁT BIỂN',
        'bungalow-2nl1te-sat-bien': 'BUNGALOW (2NL+1TE) SÁT BIỂN',
        'bungalow-2nl1te-huong-bien': 'BUNGALOW (2NL+1TE) HƯỚNG BIỂN',
        'bungalow-2nl2te-huong-bien': 'BUNGALOW (2NL+2TE) HƯỚNG BIỂN',
        'bungalow-4nl-sat-bien': 'BUNGALOW 4NL SÁT BIỂN',
        'villa-nha-go-view-bien': 'VILLA NHÀ GỖ VIEW BIỂN',
        // Legacy room types for backward compatibility
        'single': 'Single Room',
        'double': 'Double Room',
        'deluxe': 'Deluxe Room',
        'suite': 'Suite',
        'presidential': 'Presidential Suite'
    };
    
    return `
        <div class="booking-card" onclick="showBookingDetails('${booking.id}')">
            <div class="booking-card-header">
                <div>
                    <div class="booking-name">${booking.fullName}</div>
                    <div class="booking-date">Submitted: ${submittedDate}</div>
                </div>
                <span class="booking-badge">${roomTypeLabels[booking.roomType]}</span>
            </div>
            <div class="booking-info">
                <div class="booking-info-item">
                    <strong>Email</strong>
                    ${booking.email}
                </div>
                <div class="booking-info-item">
                    <strong>Phone</strong>
                    ${booking.phone}
                </div>
                <div class="booking-info-item">
                    <strong>Check-in</strong>
                    ${new Date(booking.checkIn).toLocaleDateString()}
                </div>
                <div class="booking-info-item">
                    <strong>Check-out</strong>
                    ${new Date(booking.checkOut).toLocaleDateString()}
                </div>
                <div class="booking-info-item">
                    <strong>Duration</strong>
                    ${nights} night${nights !== 1 ? 's' : ''}
                </div>
                <div class="booking-info-item">
                    <strong>Guests</strong>
                    ${booking.guests} guest${booking.guests != 1 ? 's' : ''}
                </div>
            </div>
        </div>
    `;
}

// Show booking details modal
function showBookingDetails(bookingId) {
    currentBookingId = bookingId;
    const booking = allBookings.find(b => b.id === bookingId);
    
    if (!booking) return;
    
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const roomTypeLabels = {
        'bungalow-2nl2te-sat-bien': 'BUNGALOW (2NL+2TE) SÁT BIỂN',
        'bungalow-2nl1te-sat-bien': 'BUNGALOW (2NL+1TE) SÁT BIỂN',
        'bungalow-2nl1te-huong-bien': 'BUNGALOW (2NL+1TE) HƯỚNG BIỂN',
        'bungalow-2nl2te-huong-bien': 'BUNGALOW (2NL+2TE) HƯỚNG BIỂN',
        'bungalow-4nl-sat-bien': 'BUNGALOW 4NL SÁT BIỂN',
        'villa-nha-go-view-bien': 'VILLA NHÀ GỖ VIEW BIỂN',
        // Legacy room types
        'single': 'Single Room',
        'double': 'Double Room',
        'deluxe': 'Deluxe Room',
        'suite': 'Suite',
        'presidential': 'Presidential Suite'
    };
    
    const serviceLabels = {
        'breakfast': 'Breakfast included (+$15/day)',
        'parking': 'Parking space (+$10/day)',
        'spa': 'Spa access (+$30/day)',
        'airport': 'Airport pickup (+$50 one-time)'
    };
    
    const detailsHTML = `
        <div class="detail-section">
            <h3>Guest Information</h3>
            <div class="detail-row">
                <div class="detail-label">Full Name:</div>
                <div class="detail-value">${booking.fullName}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Email:</div>
                <div class="detail-value">${booking.email}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Phone:</div>
                <div class="detail-value">${booking.phone}</div>
            </div>
            ${booking.address ? `
            <div class="detail-row">
                <div class="detail-label">Address:</div>
                <div class="detail-value">${booking.address}</div>
            </div>
            ` : ''}
        </div>
        
        <div class="detail-section">
            <h3>Booking Details</h3>
            <div class="detail-row">
                <div class="detail-label">Booking ID:</div>
                <div class="detail-value">${booking.id}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Submitted:</div>
                <div class="detail-value">${new Date(booking.timestamp).toLocaleString()}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Check-in:</div>
                <div class="detail-value">${checkIn.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Check-out:</div>
                <div class="detail-value">${checkOut.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Duration:</div>
                <div class="detail-value">${nights} night${nights !== 1 ? 's' : ''}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Room Type:</div>
                <div class="detail-value">${roomTypeLabels[booking.roomType]}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Number of Guests:</div>
                <div class="detail-value">${booking.guests}</div>
            </div>
        </div>
        
        ${booking.services && booking.services.length > 0 ? `
        <div class="detail-section">
            <h3>Additional Services</h3>
            ${booking.services.map(service => `
                <div class="detail-row">
                    <div class="detail-label">✓</div>
                    <div class="detail-value">${serviceLabels[service]}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${booking.specialRequests ? `
        <div class="detail-section">
            <h3>Special Requests</h3>
            <div class="detail-row">
                <div class="detail-value" style="width: 100%">${booking.specialRequests}</div>
            </div>
        </div>
        ` : ''}
    `;
    
    document.getElementById('bookingDetails').innerHTML = detailsHTML;
    document.getElementById('bookingModal').classList.remove('hidden');
}

// Close modal
function closeModal() {
    document.getElementById('bookingModal').classList.add('hidden');
    currentBookingId = null;
}

// Delete booking
function deleteBooking() {
    if (!currentBookingId) return;
    
    if (confirm('Are you sure you want to delete this booking?')) {
        const booking = allBookings.find(b => b.id === currentBookingId);
        if (!booking) return;

        // Remove from appropriate storage key
        if (booking.source === 'hotel') {
            let hotelArr = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
            hotelArr = hotelArr.filter(b => b.id !== currentBookingId);
            localStorage.setItem('hotelBookings', JSON.stringify(hotelArr));
        } else if (booking.source === 'legacy') {
            // Remove matching legacy entry by trying to match timestamp + fullName
            let legacyArr = JSON.parse(localStorage.getItem('bookings') || '[]');
            legacyArr = legacyArr.filter(l => {
                const legacyFull = l.fullName || ((l.firstName || '') + ' ' + (l.lastName || '')).trim();
                const legacyTimestamp = l.bookingDate || l.bookingDate || l.timestamp || '';
                return !(legacyFull === booking.fullName && legacyTimestamp === booking.timestamp);
            });
            localStorage.setItem('bookings', JSON.stringify(legacyArr));
        }

        closeModal();
        loadBookings();
    }
}

// Filter bookings
function filterBookings() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const roomFilter = document.getElementById('filterRoom').value;
    
    let filtered = allBookings;
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(booking => {
            return booking.fullName.toLowerCase().includes(searchTerm) ||
                   booking.email.toLowerCase().includes(searchTerm) ||
                   booking.phone.includes(searchTerm);
        });
    }
    
    // Apply room type filter
    if (roomFilter) {
        filtered = filtered.filter(booking => booking.roomType === roomFilter);
    }
    
    displayBookings(filtered);
}

// Clear all bookings
function clearAllBookings() {
    if (confirm('Are you sure you want to delete ALL booking data? This action cannot be undone!')) {
        if (confirm('This will permanently delete all ' + allBookings.length + ' bookings. Are you absolutely sure?')) {
            // Remove both canonical and legacy booking keys to fully clear data
            localStorage.removeItem('hotelBookings');
            localStorage.removeItem('bookings');
            allBookings = [];
            loadBookings();
        }
    }
}

// Export bookings to JSON
function exportBookings() {
    if (allBookings.length === 0) {
        alert('No bookings to export!');
        return;
    }
    
    // Export the currently shown/merged booking view
    const dataStr = JSON.stringify(allBookings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hotel-bookings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Close modal when clicking outside
document.getElementById('bookingModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
