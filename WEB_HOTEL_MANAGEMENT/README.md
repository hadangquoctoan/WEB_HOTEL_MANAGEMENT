# WEB_HOTEL_MANAGEMENT

A modern hotel booking management system built with HTML, CSS, and JavaScript. This system consists of two separate interfaces: a customer booking form and a manager dashboard.

## Features

### Customer Interface (`index.html`)
- **Guest Information Collection**: Name, email, phone, and address
- **Booking Details**: Check-in/check-out dates, room type selection, number of guests
- **Additional Services**: Breakfast, parking, spa access, airport pickup
- **Special Requests**: Custom notes and preferences
- **Form Validation**: Real-time validation with date constraints
- **Success Confirmation**: Visual feedback after successful submission
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Manager Dashboard (`manager.html`)
- **Statistics Dashboard**: 
  - Total bookings count
  - Today's bookings
  - Upcoming check-ins (next 7 days)
- **Booking Management**:
  - View all customer bookings
  - Detailed booking information
  - Delete individual bookings
  - Clear all data option
- **Search & Filter**:
  - Search by name, email, or phone
  - Filter by room type
- **Data Export**: Export bookings to JSON format
- **Responsive Layout**: Optimized for all screen sizes

## Technology Stack

- **HTML5**: Semantic markup and form elements
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (Vanilla)**: Client-side logic and data management
- **LocalStorage**: Data persistence without a backend server

## File Structure

```
WEB_HOTEL_MANAGEMENT/
├── index.html          # Customer booking form
├── manager.html        # Manager dashboard
├── styles.css          # Shared stylesheet for both pages
├── customer.js         # Customer form logic
├── manager.js          # Manager dashboard logic
└── README.md           # Documentation
```

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hadangquoctoan/WEB_HOTEL_MANAGEMENT.git
cd WEB_HOTEL_MANAGEMENT
```

2. Open the customer form in a web browser:
```bash
# Option 1: Open directly
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux

# Option 2: Use a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000
```

### Usage

#### For Customers:

1. Open `index.html` in your web browser
2. Fill out all required fields (*):
   - Guest information (name, email, phone)
   - Booking dates (check-in and check-out)
   - Room type and number of guests
3. (Optional) Select additional services
4. (Optional) Add special requests
5. Click "Submit Booking Request"
6. You'll receive a confirmation message

#### For Managers:

1. Open `manager.html` in your web browser
2. View all submitted booking requests
3. Click on any booking card to see full details
4. Use the search bar to find specific bookings
5. Filter bookings by room type
6. Export data to JSON for record-keeping
7. Delete individual bookings or clear all data as needed

## How It Works

### Data Flow

1. **Customer Submission**:
   - Customer fills out the booking form
   - JavaScript validates all inputs
   - Form data is converted to a JSON object
   - Data is stored in browser's LocalStorage
   - Success message is displayed

2. **Manager Access**:
   - Manager opens dashboard
   - JavaScript reads all bookings from LocalStorage
   - Statistics are calculated and displayed
   - Bookings are rendered as cards
   - Manager can view, filter, search, and manage bookings

### Data Storage

All booking data is stored in the browser's LocalStorage under the key `hotelBookings`. This means:
- ✅ No server or database required
- ✅ Instant access to data
- ✅ Works offline
- ⚠️ Data is stored per browser/device
- ⚠️ Clearing browser data will delete bookings
- ⚠️ Not suitable for production use without a backend

## Room Types & Pricing

- **Single Room**: $80/night
- **Double Room**: $120/night
- **Deluxe Room**: $180/night
- **Suite**: $250/night
- **Presidential Suite**: $500/night

### Additional Services

- **Breakfast**: +$15/day
- **Parking**: +$10/day
- **Spa Access**: +$30/day
- **Airport Pickup**: +$50 (one-time)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

Potential improvements for future versions:
- Backend integration (Node.js, PHP, etc.)
- Database storage (MySQL, MongoDB)
- User authentication for managers
- Email notifications
- Payment processing
- Booking confirmation PDFs
- Calendar integration
- Room availability checking
- Multi-language support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This is a demonstration project using LocalStorage for data persistence. For production use, implement proper backend infrastructure with database storage and security measures.