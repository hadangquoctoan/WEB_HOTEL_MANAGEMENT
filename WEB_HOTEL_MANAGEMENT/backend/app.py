"""
Flask Backend API for Hotel Management System
Author: GitHub Copilot
Date: 2025-11-02
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database file path
DB_FILE = 'database.json'

# Initialize database if not exists
def init_db():
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump({
                'customers': [],
                'managers': [],
                'bookings': []
            }, f, ensure_ascii=False, indent=2)

# Read database
def read_db():
    with open(DB_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

# Write database
def write_db(data):
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Generate ID
def generate_id(prefix='ID'):
    timestamp = int(datetime.now().timestamp() * 1000)
    return f"{prefix}{timestamp}"

# ==================== CUSTOMERS ENDPOINTS ====================

@app.route('/customers', methods=['GET'])
def get_customers():
    """Get all customers"""
    db = read_db()
    # Filter by email if provided
    email = request.args.get('email')
    if email:
        customers = [c for c in db['customers'] if c.get('email') == email]
        return jsonify(customers)
    return jsonify(db['customers'])

@app.route('/customers/<customer_id>', methods=['GET'])
def get_customer(customer_id):
    """Get customer by ID"""
    db = read_db()
    customer = next((c for c in db['customers'] if c['id'] == customer_id), None)
    if customer:
        return jsonify(customer)
    return jsonify({'error': 'Customer not found'}), 404

@app.route('/customers', methods=['POST'])
def create_customer():
    """Create new customer"""
    data = request.json
    db = read_db()
    
    # Check if email already exists
    if any(c['email'] == data['email'] for c in db['customers']):
        return jsonify({'error': 'Email đã tồn tại'}), 400
    
    # Create new customer
    customer = {
        'id': generate_id('CUST'),
        'fullName': data.get('fullName'),
        'email': data.get('email'),
        'phone': data.get('phone'),
        'password': data.get('password'),  # TODO: Hash password
        'createdAt': datetime.now().isoformat(),
        'bookings': []
    }
    
    db['customers'].append(customer)
    write_db(db)
    
    return jsonify(customer), 201

@app.route('/customers/<customer_id>', methods=['PUT'])
def update_customer(customer_id):
    """Update customer"""
    data = request.json
    db = read_db()
    
    customer = next((c for c in db['customers'] if c['id'] == customer_id), None)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    
    # Update fields
    customer.update(data)
    customer['updatedAt'] = datetime.now().isoformat()
    
    write_db(db)
    return jsonify(customer)

@app.route('/customers/<customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    """Delete customer"""
    db = read_db()
    
    db['customers'] = [c for c in db['customers'] if c['id'] != customer_id]
    write_db(db)
    
    return jsonify({'message': 'Customer deleted'}), 200

# ==================== MANAGERS ENDPOINTS ====================

@app.route('/managers', methods=['GET'])
def get_managers():
    """Get all managers"""
    db = read_db()
    # Filter by username if provided
    username = request.args.get('username')
    if username:
        managers = [m for m in db['managers'] if m.get('username') == username]
        return jsonify(managers)
    return jsonify(db['managers'])

@app.route('/managers/<manager_id>', methods=['GET'])
def get_manager(manager_id):
    """Get manager by ID"""
    db = read_db()
    manager = next((m for m in db['managers'] if m['id'] == manager_id), None)
    if manager:
        return jsonify(manager)
    return jsonify({'error': 'Manager not found'}), 404

@app.route('/managers', methods=['POST'])
def create_manager():
    """Create new manager"""
    data = request.json
    db = read_db()
    
    # Check if username already exists
    if any(m['username'] == data['username'] for m in db['managers']):
        return jsonify({'error': 'Username đã tồn tại'}), 400
    
    # Check if email already exists
    if any(m['email'] == data['email'] for m in db['managers']):
        return jsonify({'error': 'Email đã tồn tại'}), 400
    
    # Create new manager
    manager = {
        'id': generate_id('MGR'),
        'name': data.get('name'),
        'email': data.get('email'),
        'username': data.get('username'),
        'password': data.get('password'),  # TODO: Hash password
        'phone': data.get('phone'),
        'role': 'manager',
        'createdAt': datetime.now().isoformat()
    }
    
    db['managers'].append(manager)
    write_db(db)
    
    return jsonify(manager), 201

@app.route('/managers/<manager_id>', methods=['PUT'])
def update_manager(manager_id):
    """Update manager"""
    data = request.json
    db = read_db()
    
    manager = next((m for m in db['managers'] if m['id'] == manager_id), None)
    if not manager:
        return jsonify({'error': 'Manager not found'}), 404
    
    # Update fields
    manager.update(data)
    manager['updatedAt'] = datetime.now().isoformat()
    
    write_db(db)
    return jsonify(manager)

@app.route('/managers/<manager_id>', methods=['DELETE'])
def delete_manager(manager_id):
    """Delete manager"""
    db = read_db()
    
    db['managers'] = [m for m in db['managers'] if m['id'] != manager_id]
    write_db(db)
    
    return jsonify({'message': 'Manager deleted'}), 200

# ==================== BOOKINGS ENDPOINTS ====================

@app.route('/bookings', methods=['GET'])
def get_bookings():
    """Get all bookings"""
    db = read_db()
    return jsonify(db['bookings'])

@app.route('/bookings/<booking_id>', methods=['GET'])
def get_booking(booking_id):
    """Get booking by ID"""
    db = read_db()
    booking = next((b for b in db['bookings'] if b['id'] == booking_id), None)
    if booking:
        return jsonify(booking)
    return jsonify({'error': 'Booking not found'}), 404

@app.route('/bookings', methods=['POST'])
def create_booking():
    """Create new booking"""
    data = request.json
    db = read_db()
    
    # Create new booking
    booking = {
        'id': generate_id('BK'),
        'timestamp': datetime.now().isoformat(),
        'fullName': data.get('fullName'),
        'email': data.get('email'),
        'phone': data.get('phone'),
        'address': data.get('address'),
        'checkIn': data.get('checkIn'),
        'checkOut': data.get('checkOut'),
        'roomType': data.get('roomType'),
        'guests': data.get('guests'),
        'specialRequests': data.get('specialRequests', ''),
        'status': 'pending'
    }
    
    db['bookings'].append(booking)
    write_db(db)
    
    return jsonify(booking), 201

@app.route('/bookings/<booking_id>', methods=['PUT'])
def update_booking(booking_id):
    """Update booking"""
    data = request.json
    db = read_db()
    
    booking = next((b for b in db['bookings'] if b['id'] == booking_id), None)
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404
    
    # Update fields
    booking.update(data)
    booking['updatedAt'] = datetime.now().isoformat()
    
    write_db(db)
    return jsonify(booking)

@app.route('/bookings/<booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    """Delete booking"""
    db = read_db()
    
    db['bookings'] = [b for b in db['bookings'] if b['id'] != booking_id]
    write_db(db)
    
    return jsonify({'message': 'Booking deleted'}), 200

# ==================== HEALTH CHECK ====================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': 'Hotel Management API is running',
        'timestamp': datetime.now().isoformat()
    })

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# ==================== MAIN ====================

if __name__ == '__main__':
    init_db()
    print("=" * 50)
    print("🏨 Hotel Management API Server")
    print("=" * 50)
    print("📍 Server: http://localhost:5000")
    print("📋 Endpoints:")
    print("   - GET    /customers")
    print("   - POST   /customers")
    print("   - PUT    /customers/<id>")
    print("   - DELETE /customers/<id>")
    print("   - GET    /managers")
    print("   - POST   /managers")
    print("   - GET    /bookings")
    print("   - POST   /bookings")
    print("=" * 50)
    
    # Run server
    # host='0.0.0.0' cho phép truy cập từ máy khác
    app.run(host='0.0.0.0', port=5000, debug=True)
