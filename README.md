# 🎬 Movie Booking App
This project is a movie booking system built with Node.js, Express, PostgreSQL, and Sequelize ORM. It allows users to book seat, check seat availability, and manage seat bookings. Redis is used for caching seat availability data.

# 🚀 Features
Seat Management: View and book seats for different screens.
Booking Management: Book and update seat status (available/booked).
Redis Caching: Caches hall seating arrangements for optimized performance.

# 🛠️ Tech Stack
Backend: Node.js, Express.js
Database: PostgreSQL
ORM: Sequelize
Cache: Redis
Package Manager: NPM

# 📝 Installation
Requirements
Node.js v14+
PostgreSQL
Redis
Steps

# Clone the repository: 
git clone https://github.com/your-repo/movie-booking-app.git
cd movie-booking-app

# Install dependencies:
npm install

# Set up environment variables:
-> Create a .env file in the root directory and add the following:
APP_PORT=3000
JWT_SECRET=3wzxmoDsmQteZ3LKLndsJRDKVjHKgzHRQbfjTeugLzyvSaQDfN2q2qJjcackKPTgd279bu2zMCx3VbRbvS9vpF5AJjG4YqZxw3ukWqr5zX9hZo
DB_NAME=movie_booking
DB_USERNAME=postgres
DB_SECRET=your_db_password
DB_HOST=127.0.0.1
DB_PORT=5432
REDIS_HOST=127.0.0.1
REDIS_PORT=6379


# Start the development server:
npm run dev


# Important point
As soon as server will start, some data will be saved to your db for seeding data of seats.


# 🎯 API Documentation
Postman collection: https://api.postman.com/collections/37963166-abca3157-8584-43df-ab27-eea1d79f59cb?access_key=PMAT-01J886VCQXX4GJJK0D5Z9G9BPP


Base URL: http://localhost:3000/api

Authentication:

Register (POST /auth/register)
Description: register a user.
Request:
 Body:
    {
    "username": "admin_user",
    "password": "password123",
    "role": "admin/user"
    }
Response:
    200 OK:
        {
        "username": "username-here"
        }


Login (POST /auth/login)
Description: Login to receive a JWT token for authentication.
Request:
    Body:
        {
        "username": "admin_user",
        "password": "password123"
        }
Response:
    200 OK:
        {
        "token": "JWT_TOKEN_HERE"
        }
    401 Unauthorized: Invalid credentials.


Endpoints
1. Get Hall Seat Arrangement (GET /hall/:hall_id)
Description: Retrieve the seat arrangement of a movie hall. The seats are shown in an x*y format, displaying whether each seat is available or booked.
Authentication: Not required.
Redis Caching: Cached response for 2 minutes.
Response:
    200 OK:
        {
        "seats": [
            [['A1', status], ['A2', status], ['A3', status],...],
            [['B1', status], ['B2', status], ['B3', status],...],
            ...
        ]
        }

        
2. Get Seat Status (POST /hall/:hall_id/:seat_number)
Description: Check the status of a specific seat by its seat number.
Authentication: Not required.
Request Parameters:
    URL Parameter: seat_number, hall_id (e.g., /hall/12/A1)
Response:
    200 OK:
        {
        "seatNumber": 12,
        "status": "booked"
        }
    404 Not Found: Seat number does not exist.
    400 Bad Request: Invalid seat number format.


3. Book a Seat (POST /hall/book)
Description: Admin users can book a seat for a customer.
Authentication: Required (Admin only).
Request:
Headers:
Authorization: Bearer <JWT_TOKEN>
Body:
    {
    "hallId": 1,
    "seatNumber": 12,
    "customerName": "John Doe"
    }
Response:
    200 OK: Seat booked successfully.
        {
        "message": "Seat has been booked successfully."
        }
    400 Bad Request: Seat already booked.
    404 Not Found: Seat number or hall not found.
    403 Forbidden: Unauthorized (non-admin user trying to book).


Error Handling
400 Bad Request: Returned when there are validation issues with the request (e.g., invalid seat number).
401 Unauthorized: Returned when the request lacks valid authentication.
403 Forbidden: Returned when a non-admin user attempts to book a seat.
404 Not Found: Returned when a hall or seat cannot be found.
Additional Information
Redis Caching: Seat arrangements for a hall are cached in Redis for 2 minutes. This helps to reduce database load when fetching seat arrangements frequently.