"""
Test script for Flask API
Run: python test_api.py
"""

import requests
import json

# API base URL
BASE_URL = "http://localhost:5000"

def test_health():
    """Test health check endpoint"""
    print("\n" + "="*50)
    print("TEST 1: Health Check")
    print("="*50)
    
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    
    assert response.status_code == 200
    print("✅ PASSED")

def test_create_customer():
    """Test create customer"""
    print("\n" + "="*50)
    print("TEST 2: Create Customer")
    print("="*50)
    
    customer_data = {
        "fullName": "Nguyễn Văn Test",
        "email": "test@example.com",
        "phone": "0912345678",
        "password": "123456"
    }
    
    response = requests.post(f"{BASE_URL}/customers", json=customer_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    
    assert response.status_code == 201
    print("✅ PASSED")
    
    return response.json()['id']

def test_get_customers():
    """Test get all customers"""
    print("\n" + "="*50)
    print("TEST 3: Get All Customers")
    print("="*50)
    
    response = requests.get(f"{BASE_URL}/customers")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    
    assert response.status_code == 200
    print("✅ PASSED")

def test_get_customer_by_email():
    """Test get customer by email"""
    print("\n" + "="*50)
    print("TEST 4: Get Customer By Email")
    print("="*50)
    
    response = requests.get(f"{BASE_URL}/customers?email=test@example.com")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    
    assert response.status_code == 200
    print("✅ PASSED")

def test_create_manager():
    """Test create manager"""
    print("\n" + "="*50)
    print("TEST 5: Create Manager")
    print("="*50)
    
    manager_data = {
        "name": "Quản Lý Test",
        "email": "manager@example.com",
        "username": "manager1",
        "password": "123456",
        "phone": "0987654321"
    }
    
    response = requests.post(f"{BASE_URL}/managers", json=manager_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    
    assert response.status_code == 201
    print("✅ PASSED")
    
    return response.json()['id']

def test_create_booking():
    """Test create booking"""
    print("\n" + "="*50)
    print("TEST 6: Create Booking")
    print("="*50)
    
    booking_data = {
        "fullName": "Nguyễn Văn Test",
        "email": "test@example.com",
        "phone": "0912345678",
        "address": "123 Test Street",
        "checkIn": "2025-11-10",
        "checkOut": "2025-11-12",
        "roomType": "deluxe",
        "guests": "2",
        "specialRequests": "View biển"
    }
    
    response = requests.post(f"{BASE_URL}/bookings", json=booking_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    
    assert response.status_code == 201
    print("✅ PASSED")

def test_delete_customer(customer_id):
    """Test delete customer"""
    print("\n" + "="*50)
    print("TEST 7: Delete Customer")
    print("="*50)
    
    response = requests.delete(f"{BASE_URL}/customers/{customer_id}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    
    assert response.status_code == 200
    print("✅ PASSED")

def main():
    """Run all tests"""
    print("\n" + "🧪 STARTING API TESTS")
    print("="*50)
    
    try:
        test_health()
        customer_id = test_create_customer()
        test_get_customers()
        test_get_customer_by_email()
        manager_id = test_create_manager()
        test_create_booking()
        test_delete_customer(customer_id)
        
        print("\n" + "="*50)
        print("✅ ALL TESTS PASSED!")
        print("="*50)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to API server!")
        print("Make sure Flask server is running: python app.py")
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    main()
